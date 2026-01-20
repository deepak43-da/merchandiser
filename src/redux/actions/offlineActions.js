import axios from "axios";

// Action Types
export const OFFLINE_ACTION_TYPES = {
  CAPTURE_IMAGE: "CAPTURE_IMAGE",
  UPDATE_DISPLAY: "UPDATE_DISPLAY",
  ADD_TO_SYNC_QUEUE: "ADD_TO_SYNC_QUEUE",
  SYNC_SUCCESS: "SYNC_SUCCESS",
  SYNC_FAILED: "SYNC_FAILED",
  SYNC_QUEUE: "SYNC_QUEUE",
  SET_NETWORK_STATUS: "SET_NETWORK_STATUS",
};

// Enhanced fetchTasks with offline-first approach
export const fetchTasks = (userId) => async (dispatch, getState) => {
  const { tasks } = getState();
  const now = Date.now();
  const cacheDuration = 5 * 60 * 1000; // 5 minutes cache

  // Check if we have cached data and it's not too old
  if (
    tasks.lastFetched &&
    now - tasks.lastFetched < cacheDuration &&
    tasks.tasks.length > 0
  ) {
    // Use cached data, but also fetch in background if online
    if (navigator.onLine) {
      // Background refresh
      fetchTasksOnline(userId, dispatch).catch(console.error);
    }
    return;
  }

  if (navigator.onLine) {
    try {
      await fetchTasksOnline(userId, dispatch);
    } catch (error) {
      // If online fetch fails but we have offline data, use it
      if (tasks.tasks.length > 0) {
        console.log("Using offline data due to network error");
        dispatch({
          type: "SET_TASKS",
          payload: {
            tasks: tasks.tasks,
            lastFetched: tasks.lastFetched,
            offline: true,
          },
        });
      } else {
        dispatch({ type: "SET_TASKS", payload: [] });
      }
    }
  } else {
    // Use offline data
    if (tasks.tasks.length > 0) {
      dispatch({
        type: "SET_TASKS",
        payload: {
          tasks: tasks.tasks,
          lastFetched: tasks.lastFetched,
          offline: true,
        },
      });
    }
  }
};

async function fetchTasksOnline(userId, dispatch) {
  // Fetch DailySchedule_Get
  const scheduleRes = await axios.post(
    "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DailySchedule_Get",
    { StoreID: userId },
    { headers: { "Content-Type": "application/json" } },
  );
  const schedules = scheduleRes.data.data || [];

  // For each schedule, fetch DailyScheduleDisplayList_Get and merge into Displays
  const merged = await Promise.all(
    schedules.map(async (task) => {
      try {
        const displayRes = await axios.post(
          "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/DailyScheduleDisplayList_Get",
          {
            DOWork: task.DOWork,
            ScheduleID: task.ID,
            StoreID: task.StoreID,
            SupplierID: task.SupplierID,
          },
          { headers: { "Content-Type": "application/json" } },
        );
        return {
          ...task,
          Displays: displayRes.data.data || [],
        };
      } catch (error) {
        return {
          ...task,
          Displays: [],
        };
      }
    }),
  );

  dispatch({
    type: "SET_TASKS",
    payload: {
      tasks: merged,
      lastFetched: Date.now(),
      offline: false,
    },
  });
}

// Capture image with offline support
export const captureImageWithOfflineSupport =
  (imageData, metadata) => async (dispatch, getState) => {
    const { networkStatus, offlineImages = [] } = getState().tasks;

    // Prevent duplicate: check if an image for this userId, taskId, tab, and type exists
    const isDuplicate = offlineImages.some(
      (img) =>
        img.metadata?.userId === metadata.userId &&
        img.metadata?.taskId === metadata.taskId &&
        img.metadata?.tab === metadata.tab &&
        img.metadata?.type === metadata.type,
    );
    if (isDuplicate) {
      // Optionally, show a toast or return early
      return;
    }

    const imageRecord = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageData,
      metadata,
      timestamp: new Date().toISOString(),
      status: networkStatus === "online" ? "pending" : "offline",
    };

    // Store immediately in Redux
    dispatch({
      type: "CAPTURE_IMAGE",
      payload: imageRecord,
    });

    // Add to sync queue
    dispatch({
      type: "ADD_TO_SYNC_QUEUE",
      payload: {
        type: "IMAGE_UPLOAD",
        data: imageRecord,
        retryCount: 0,
      },
    });

    // If online, try to sync immediately
    if (networkStatus === "online") {
      await syncQueue(dispatch, getState);
    }
  };

// Sync queue function
export const syncQueue = async (dispatch, getState) => {
  const { queue, offlineImages = [], networkStatus } = getState().tasks;

  // If online, try to upload all offlineImages
  if (networkStatus === "online" && offlineImages.length > 0) {
    for (const img of offlineImages) {
      try {
        await uploadImage(img);
        // Remove from offlineImages after successful upload
        dispatch({
          type: "REMOVE_IMAGE",
          payload: {
            userId: img.metadata?.userId,
            taskId: img.metadata?.taskId,
            tab: img.metadata?.tab,
            index: offlineImages.findIndex((i) => i.id === img.id),
          },
        });
      } catch (error) {
        // Optionally handle upload error
        console.error("Failed to upload offline image", img, error);
      }
    }
  }

  for (const item of queue.filter((q) => q.status === "pending")) {
    try {
      await processQueueItem(item, dispatch);
      dispatch({
        type: "SYNC_SUCCESS",
        payload: item.id,
      });
    } catch (error) {
      console.error("Sync failed for item:", item.id, error);
      dispatch({
        type: "SYNC_FAILED",
        payload: {
          id: item.id,
          retryCount: (item.retryCount || 0) + 1,
        },
      });
    }
  }
};

async function processQueueItem(item, dispatch) {
  switch (item.type) {
    case "IMAGE_UPLOAD":
      await uploadImage(item.data);
      break;
    case "DISPLAY_UPDATE":
      await updateDisplay(item.data);
      break;
    default:
      console.warn("Unknown queue item type:", item.type);
  }
}
