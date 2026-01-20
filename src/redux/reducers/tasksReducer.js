// const initialState = {
//   tasks: [], // Array of DailySchedule_Get items (with Displays)
//   lastFetched: null,
// };

// export default function tasksReducer(state = initialState, action) {
//   switch (action.type) {
//     case "SET_TASKS":
//       return {
//         ...state,
//         tasks: action.payload,
//         lastFetched: Date.now(),
//       };
//     case "UPDATE_TASK":
//       return {
//         ...state,
//         tasks: state.tasks.map((task) =>
//           task.ID === action.payload.ID ? { ...task, ...action.payload } : task,
//         ),
//       };
//     default:
//       return state;
//   }
// }

const initialState = {
  tasks: [], // Array of DailySchedule_Get items (with Displays)
  lastFetched: null,
  queue: [], // Items pending sync
  offlineImages: [], // Images captured offline
  networkStatus: "online", // 'online' or 'offline'
  syncInProgress: false,
  lastSync: null,
};

export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: Array.isArray(action.payload)
          ? action.payload
          : action.payload.tasks || [],
        lastFetched: action.payload.lastFetched || Date.now(),
        offline: action.payload.offline || false,
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.ID === action.payload.ID ? { ...task, ...action.payload } : task,
        ),
      };

    case "CAPTURE_IMAGE":
      return {
        ...state,
        offlineImages: [...state.offlineImages, action.payload],
      };

    case "ADD_TO_SYNC_QUEUE":
      return {
        ...state,
        queue: [
          ...state.queue,
          {
            ...action.payload,
            id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            status: "pending",
          },
        ],
      };

    case "SET_NETWORK_STATUS":
      return {
        ...state,
        networkStatus: action.payload,
      };

    case "SYNC_SUCCESS":
      return {
        ...state,
        queue: state.queue.filter((item) => item.id !== action.payload),
        lastSync: Date.now(),
      };

    case "SYNC_FAILED":
      return {
        ...state,
        queue: state.queue.map((item) =>
          item.id === action.payload.id
            ? { ...item, retryCount: action.payload.retryCount }
            : item,
        ),
      };

    case "CLEAR_USER_TASK_IMAGES":
      return {
        ...state,
        offlineImages: state.offlineImages.filter(
          (img) =>
            !(
              img.metadata?.userId === action.payload.userId &&
              img.metadata?.taskId === action.payload.taskId
            ),
        ),
        queue: state.queue.filter(
          (item) =>
            !(
              item.data?.metadata?.userId === action.payload.userId &&
              item.data?.metadata?.taskId === action.payload.taskId
            ),
        ),
      };

    case "REMOVE_IMAGE":
      const { userId, taskId, tab, index } = action.payload;
      return {
        ...state,
        offlineImages: state.offlineImages.filter((img, idx) => {
          if (idx !== index) return true;
          if (img.metadata?.userId !== userId) return true;
          if (img.metadata?.taskId !== taskId) return true;
          if (img.metadata?.tab !== tab) return true;
          return false;
        }),
      };

    default:
      return state;
  }
}
