// // sagas/networkSaga.js
// import { takeLatest, takeEvery, put, select, delay } from "redux-saga/effects";
// import axios from "axios";

// // API endpoint for QC submission
// const QC_API_ENDPOINT = "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/SubmitQC";

// // Helper function to check network status
// function checkNetwork() {
//   return navigator.onLine;
// }

// // Worker to handle QC submission
// function* submitQCWorker(action) {
//   const isOnline = checkNetwork();
//   const submissionData = action.payload;
  
//   if (isOnline) {
//     try {
//       // Make API call
//       const response = yield axios.post(QC_API_ENDPOINT, submissionData, {
//         headers: { "Content-Type": "application/json" }
//       });
      
//       console.log("QC submitted successfully:", response.data);
//       yield put({ type: "QC_SUBMISSION_SUCCESS", payload: submissionData });
      
//     } catch (error) {
//       console.error("QC submission failed:", error);
      
//       // If API fails but we're online, add to pending queue for retry
//       yield put({ 
//         type: "ADD_PENDING_SUBMISSION", 
//         payload: {
//           ...submissionData,
//           attempts: 1,
//           lastAttempt: new Date().toISOString()
//         }
//       });
      
//       yield put({ type: "QC_SUBMISSION_FAILED", payload: error.message });
//     }
//   } else {
//     // Offline - add to pending queue
//     yield put({ 
//       type: "ADD_PENDING_SUBMISSION", 
//       payload: {
//         ...submissionData,
//         attempts: 0,
//         lastAttempt: new Date().toISOString()
//       }
//     });
    
//     yield put({ type: "QC_SUBMISSION_QUEUED_OFFLINE", payload: submissionData });
//   }
// }

// // Worker to process pending submissions when online
// function* processPendingQueueWorker() {
//   const state = yield select();
//   const { pendingSubmissions, isProcessingQueue } = state.network;
  
//   // If already processing or no pending submissions, return
//   if (isProcessingQueue || pendingSubmissions.length === 0) return;
  
//   yield put({ type: "PROCESSING_QUEUE_START" });
  
//   for (let i = 0; i < pendingSubmissions.length; i++) {
//     const submission = pendingSubmissions[i];
    
//     try {
//       const response = yield axios.post(QC_API_ENDPOINT, submission, {
//         headers: { "Content-Type": "application/json" }
//       });
      
//       console.log("Queued QC submitted successfully:", response.data);
      
//       // Remove from pending queue on success
//       yield put({ type: "REMOVE_PENDING_SUBMISSION", payload: i });
//       yield put({ type: "QC_SUBMISSION_SUCCESS", payload: submission });
      
//     } catch (error) {
//       console.error("Failed to submit queued QC:", error);
      
//       // Update attempt count
//       const updatedSubmission = {
//         ...submission,
//         attempts: (submission.attempts || 0) + 1,
//         lastAttempt: new Date().toISOString(),
//         lastError: error.message
//       };
      
//       // Replace with updated submission
//       yield put({ type: "REMOVE_PENDING_SUBMISSION", payload: i });
      
//       // If less than 3 attempts, add back to queue
//       if (updatedSubmission.attempts < 3) {
//         yield put({ type: "ADD_PENDING_SUBMISSION", payload: updatedSubmission });
//       } else {
//         console.warn("Max retries reached for submission:", submission.taskId);
//         yield put({ type: "QC_SUBMISSION_MAX_RETRIES", payload: updatedSubmission });
//       }
//     }
    
//     // Small delay between submissions
//     yield delay(1000);
//   }
  
//   yield put({ type: "PROCESSING_QUEUE_END" });
// }

// // Worker to monitor network status
// function* monitorNetworkWorker() {
//   const isOnline = checkNetwork();
//   yield put({ type: "NETWORK_STATUS_CHANGED", payload: isOnline });
  
//   // If we just came online, process pending queue
//   if (isOnline) {
//     yield put({ type: "PROCESS_PENDING_QUEUE" });
//   }
// }

// export default function* networkSaga() {
//   yield takeLatest("SUBMIT_TASK_FOR_QC", submitQCWorker);
//   yield takeLatest("PROCESS_PENDING_QUEUE", processPendingQueueWorker);
//   yield takeLatest("NETWORK_STATUS_CHANGED", monitorNetworkWorker);
  
//   // Listen for online/offline events
//   if (typeof window !== "undefined") {
//     window.addEventListener("online", () => {
//       put({ type: "NETWORK_STATUS_CHANGED", payload: true });
//       put({ type: "PROCESS_PENDING_QUEUE" });
//     });
    
//     window.addEventListener("offline", () => {
//       put({ type: "NETWORK_STATUS_CHANGED", payload: false });
//     });
//   }
// }