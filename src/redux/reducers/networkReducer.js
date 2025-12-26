// // reducers/networkReducer.js
// const initialState = {
//   isOnline: navigator.onLine,
//   pendingSubmissions: [], // Queue of submissions to send when online
//   isProcessingQueue: false
// };

// export default function networkReducer(state = initialState, action) {
//   switch (action.type) {
//     case "NETWORK_STATUS_CHANGED":
//       return {
//         ...state,
//         isOnline: action.payload
//       };
    
//     case "ADD_PENDING_SUBMISSION":
//       return {
//         ...state,
//         pendingSubmissions: [...state.pendingSubmissions, action.payload]
//       };
    
//     case "REMOVE_PENDING_SUBMISSION":
//       return {
//         ...state,
//         pendingSubmissions: state.pendingSubmissions.filter(
//           (_, index) => index !== action.payload
//         )
//       };
    
//     case "PROCESSING_QUEUE_START":
//       return {
//         ...state,
//         isProcessingQueue: true
//       };
    
//     case "PROCESSING_QUEUE_END":
//       return {
//         ...state,
//         isProcessingQueue: false
//       };
    
//     case "CLEAR_ALL_PENDING":
//       return {
//         ...state,
//         pendingSubmissions: []
//       };
    
//     default:
//       return state;
//   }
// }