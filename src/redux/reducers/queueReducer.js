// reducers/queueReducer.js
const initialState = {
  pendingSubmissions: [], // Array of { taskId, images, timestamp }
  isProcessing: false
};

export default function queueReducer(state = initialState, action) {
  switch (action.type) {
    case 'QUEUE_SUBMISSION':
      return {
        ...state,
        pendingSubmissions: [...state.pendingSubmissions, action.payload]
      };
    case 'REMOVE_SUBMISSION':
      return {
        ...state,
        pendingSubmissions: state.pendingSubmissions.filter(
          (_, idx) => idx !== action.payload
        )
      };
    case 'PROCESSING_START':
      return { ...state, isProcessing: true };
    case 'PROCESSING_END':
      return { ...state, isProcessing: false };
    case 'CLEAR_ALL_SUBMISSIONS':
      return initialState;
    default:
      return state;
  }
}
