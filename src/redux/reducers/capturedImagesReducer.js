

// reducers/capturedImagesReducer.js
const initialState = {
  // Structure: { taskId: { duringActivity: [], postActivity: [] } }
  tasks: {},
  currentTaskId: null
};

// Constants for limits
const DURING_ACTIVITY_LIMIT = 5;
const POST_ACTIVITY_LIMIT = 20;

export default function capturedImagesReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_CURRENT_TASK":
      return {
        ...state,
        currentTaskId: action.payload
      };
    
    case "CAPTURE_IMAGE":
      const { taskId, imageData, tab, timestamp, stage, scheduleId, storeId, activityId } = action.payload;
      
      // Initialize task if it doesn't exist
      if (!state.tasks[taskId]) {
        state.tasks[taskId] = {
          duringActivity: [],
          postActivity: []
        };
      }
      
      // Check limits before adding
      if (tab === "during") {
        const currentDuringCount = state.tasks[taskId].duringActivity.length;
        if (currentDuringCount >= DURING_ACTIVITY_LIMIT) {
          console.warn(`During activity limit reached (${DURING_ACTIVITY_LIMIT}) for task ${taskId}`);
          return state; // Don't add, return current state
        }
      } else if (tab === "post") {
        const currentPostCount = state.tasks[taskId].postActivity.length;
        if (currentPostCount >= POST_ACTIVITY_LIMIT) {
          console.warn(`Post activity limit reached (${POST_ACTIVITY_LIMIT}) for task ${taskId}`);
          return state; // Don't add, return current state
        }
      }
      
      const imageObject = {
        data: imageData,
        timestamp: timestamp,
        stage: stage,
        scheduleId: scheduleId,
        storeId: storeId,
        activityId: activityId,
        uploaded: false,
        uploadAttempts: 0 // Track upload retry attempts
      };
      
      if (tab === "during") {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              duringActivity: [...state.tasks[taskId].duringActivity, imageObject]
            }
          }
        };
      } else {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              postActivity: [...state.tasks[taskId].postActivity, imageObject]
            }
          }
        };
      }
    
    case "ADD_UPLOADED_IMAGE":
      const { 
        taskId: uploadedTaskId, 
        tab: uploadedTab, 
        imageData: uploadedImageData,
        timestamp: uploadedTimestamp,
        stage: uploadedStage,
        scheduleId: uploadedScheduleId,
        storeId: uploadedStoreId,
        activityId: uploadedActivityId
      } = action.payload;
      
      // Initialize task if it doesn't exist
      if (!state.tasks[uploadedTaskId]) {
        state.tasks[uploadedTaskId] = {
          duringActivity: [],
          postActivity: []
        };
      }
      
      // Check limits before adding (even for uploaded images)
      if (uploadedTab === "during") {
        const currentDuringCount = state.tasks[uploadedTaskId].duringActivity.length;
        if (currentDuringCount >= DURING_ACTIVITY_LIMIT) {
          console.warn(`Cannot add uploaded image: during activity limit reached for task ${uploadedTaskId}`);
          return state;
        }
      } else if (uploadedTab === "post") {
        const currentPostCount = state.tasks[uploadedTaskId].postActivity.length;
        if (currentPostCount >= POST_ACTIVITY_LIMIT) {
          console.warn(`Cannot add uploaded image: post activity limit reached for task ${uploadedTaskId}`);
          return state;
        }
      }
      
      const uploadedImageObject = {
        data: uploadedImageData,
        timestamp: uploadedTimestamp || new Date().toISOString(),
        stage: uploadedStage || (uploadedTab === "during" ? "Before" : "After"),
        scheduleId: uploadedScheduleId,
        storeId: uploadedStoreId,
        activityId: uploadedActivityId,
        uploaded: true,
        uploadAttempts: 0
      };
      
      if (uploadedTab === "during") {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [uploadedTaskId]: {
              ...state.tasks[uploadedTaskId],
              duringActivity: [...state.tasks[uploadedTaskId].duringActivity, uploadedImageObject]
            }
          }
        };
      } else {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [uploadedTaskId]: {
              ...state.tasks[uploadedTaskId],
              postActivity: [...state.tasks[uploadedTaskId].postActivity, uploadedImageObject]
            }
          }
        };
      }
    
    case "UPDATE_CAPTURED_IMAGE":
      const { taskId: updateTaskId, imageData: updateImageData, tab: updateTab, index } = action.payload;
      
      if (!state.tasks[updateTaskId]) {
        return state; // Task doesn't exist
      }
      
      if (updateTab === "during") {
        if (index >= 0 && index < state.tasks[updateTaskId].duringActivity.length) {
          return {
            ...state,
            tasks: {
              ...state.tasks,
              [updateTaskId]: {
                ...state.tasks[updateTaskId],
                duringActivity: state.tasks[updateTaskId].duringActivity.map((img, idx) => 
                  idx === index ? { ...img, data: updateImageData } : img
                )
              }
            }
          };
        }
      } else {
        if (index >= 0 && index < state.tasks[updateTaskId].postActivity.length) {
          return {
            ...state,
            tasks: {
              ...state.tasks,
              [updateTaskId]: {
                ...state.tasks[updateTaskId],
                postActivity: state.tasks[updateTaskId].postActivity.map((img, idx) => 
                  idx === index ? { ...img, data: updateImageData } : img
                )
              }
            }
          };
        }
      }
      return state;
    
    case "REMOVE_IMAGE":
      const { taskId: removeTaskId, tab: removeTab, index: removeIndex } = action.payload;
      
      if (!state.tasks[removeTaskId]) {
        return state; // Task doesn't exist
      }
      
      if (removeTab === "during") {
        if (removeIndex >= 0 && removeIndex < state.tasks[removeTaskId].duringActivity.length) {
          return {
            ...state,
            tasks: {
              ...state.tasks,
              [removeTaskId]: {
                ...state.tasks[removeTaskId],
                duringActivity: state.tasks[removeTaskId].duringActivity.filter((_, idx) => 
                  idx !== removeIndex
                )
              }
            }
          };
        }
      } else {
        if (removeIndex >= 0 && removeIndex < state.tasks[removeTaskId].postActivity.length) {
          return {
            ...state,
            tasks: {
              ...state.tasks,
              [removeTaskId]: {
                ...state.tasks[removeTaskId],
                postActivity: state.tasks[removeTaskId].postActivity.filter((_, idx) => 
                  idx !== removeIndex
                )
              }
            }
          };
        }
      }
      return state;
    
    case "MARK_IMAGE_UPLOADED":
      const { 
        taskId: markTaskId, 
        tab: markTab, 
        index: markIndex,
        scheduleId: markScheduleId,
        storeId: markStoreId,
        activityId: markActivityId
      } = action.payload;
      
      if (!state.tasks[markTaskId]) {
        return state;
      }
      
      // Helper function to mark image as uploaded
      const markAsUploaded = (images) => {
        if (markIndex >= 0 && markIndex < images.length) {
          return images.map((img, idx) => 
            idx === markIndex ? { 
              ...img, 
              uploaded: true,
              // Update IDs if provided (in case they were missing before)
              scheduleId: markScheduleId || img.scheduleId,
              storeId: markStoreId || img.storeId,
              activityId: markActivityId || img.activityId
            } : img
          );
        }
        return images;
      };
      
      if (markTab === "during") {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [markTaskId]: {
              ...state.tasks[markTaskId],
              duringActivity: markAsUploaded(state.tasks[markTaskId].duringActivity)
            }
          }
        };
      } else {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [markTaskId]: {
              ...state.tasks[markTaskId],
              postActivity: markAsUploaded(state.tasks[markTaskId].postActivity)
            }
          }
        };
      }
    
    case "INCREMENT_UPLOAD_ATTEMPTS":
      const { 
        taskId: attemptsTaskId, 
        tab: attemptsTab, 
        index: attemptsIndex 
      } = action.payload;
      
      if (!state.tasks[attemptsTaskId]) {
        return state;
      }
      
      const incrementAttempts = (images) => {
        if (attemptsIndex >= 0 && attemptsIndex < images.length) {
          return images.map((img, idx) => 
            idx === attemptsIndex ? { 
              ...img, 
              uploadAttempts: (img.uploadAttempts || 0) + 1 
            } : img
          );
        }
        return images;
      };
      
      if (attemptsTab === "during") {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [attemptsTaskId]: {
              ...state.tasks[attemptsTaskId],
              duringActivity: incrementAttempts(state.tasks[attemptsTaskId].duringActivity)
            }
          }
        };
      } else {
        return {
          ...state,
          tasks: {
            ...state.tasks,
            [attemptsTaskId]: {
              ...state.tasks[attemptsTaskId],
              postActivity: incrementAttempts(state.tasks[attemptsTaskId].postActivity)
            }
          }
        };
      }
    
    case "CLEAR_TASK_IMAGES":
      const taskIdToClear = action.payload;
      
      if (!state.tasks[taskIdToClear]) {
        return state;
      }
      
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskIdToClear]: {
            duringActivity: [],
            postActivity: []
          }
        }
      };
    
    case "REMOVE_UPLOADED_IMAGES":
      const removeUploadedTaskId = action.payload;
      
      if (!state.tasks[removeUploadedTaskId]) {
        return state;
      }
      
      // Remove only uploaded images (keep pending ones)
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [removeUploadedTaskId]: {
            duringActivity: state.tasks[removeUploadedTaskId].duringActivity.filter(img => !img.uploaded),
            postActivity: state.tasks[removeUploadedTaskId].postActivity.filter(img => !img.uploaded)
          }
        }
      };
    
    case "CLEAR_ALL_IMAGES":
      return initialState;
    
    // Utility action to check limits (can be used by components)
    case "CHECK_TASK_LIMITS":
      const checkTaskId = action.payload;
      
      if (!state.tasks[checkTaskId]) {
        return {
          ...state,
          // Add limit info to state if needed
          limits: {
            [checkTaskId]: {
              during: { count: 0, limit: DURING_ACTIVITY_LIMIT, reached: false },
              post: { count: 0, limit: POST_ACTIVITY_LIMIT, reached: false }
            }
          }
        };
      }
      
      const duringCount = state.tasks[checkTaskId].duringActivity.length;
      const postCount = state.tasks[checkTaskId].postActivity.length;
      
      return {
        ...state,
        limits: {
          ...state.limits,
          [checkTaskId]: {
            during: { 
              count: duringCount, 
              limit: DURING_ACTIVITY_LIMIT, 
              reached: duringCount >= DURING_ACTIVITY_LIMIT 
            },
            post: { 
              count: postCount, 
              limit: POST_ACTIVITY_LIMIT, 
              reached: postCount >= POST_ACTIVITY_LIMIT 
            }
          }
        }
      };
    
    default:
      return state;
  }
}

// Helper functions for components to check limits
export const getTaskImageCounts = (state, taskId) => {
  const task = state.tasks[taskId] || { duringActivity: [], postActivity: [] };
  return {
    during: task.duringActivity.length,
    post: task.postActivity.length,
    total: task.duringActivity.length + task.postActivity.length
  };
};

export const canCaptureMoreDuring = (state, taskId) => {
  const task = state.tasks[taskId];
  if (!task) return true; // No task yet, can capture
  return task.duringActivity.length < DURING_ACTIVITY_LIMIT;
};

export const canCaptureMorePost = (state, taskId) => {
  const task = state.tasks[taskId];
  if (!task) return true; // No task yet, can capture
  return task.postActivity.length < POST_ACTIVITY_LIMIT;
};

export const getTaskLimits = () => ({
  DURING_ACTIVITY_LIMIT,
  POST_ACTIVITY_LIMIT,
  TOTAL_LIMIT: DURING_ACTIVITY_LIMIT + POST_ACTIVITY_LIMIT
});