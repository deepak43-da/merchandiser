


import { takeLatest, put, call, select, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import axios from 'axios';

// Network status channel
function createNetworkChannel() {
  return eventChannel(emit => {
    const handleOnline = () => emit(true);
    const handleOffline = () => emit(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });
}

// Convert base64 to blob for upload
function base64ToBlob(base64) {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'image/jpeg' });
}

// Upload single offline image
function* uploadOfflineImage(image) {
  try {
    const blob = base64ToBlob(image.data);
    const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('ScheduleID', image.scheduleId);
    formData.append('StoreID', image.storeId);
    formData.append('ActivityID', image.activityId);
    formData.append('Stage', image.stage);
    formData.append('DTOImage', image.timestamp.replace('T', ' ').substring(0, 19));
    formData.append('UserID', '1');
    formData.append('Image', file);

    const response = yield call(axios.post,
      "https://tamimi.impulseglobal.net/Report/RamadhanApp/API/Schedules.asmx/QCImageUpload",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

// Process all offline images when back online
function* processOfflineImages() {
  const capturedImages = yield select(state => state.capturedImages.tasks);
  for (const taskId in capturedImages) {
    const task = capturedImages[taskId];
    
    // Process during activity images
    for (let i = 0; i < task.duringActivity.length; i++) {
      const image = task.duringActivity[i];
      if (!image.uploaded) {
        try {
          yield call(uploadOfflineImage, image);
          yield put({
            type: "MARK_IMAGE_UPLOADED",
            payload: {
              taskId,
              tab: "during",
              index: i
            }
          });
          console.log(`Uploaded during activity image ${i + 1} for task ${taskId}`);
        } catch (error) {
          console.error(`Failed to upload during activity image ${i + 1}:`, error);
        }
      }
    }
    
    // Process post activity images
    for (let i = 0; i < task.postActivity.length; i++) {
      const image = task.postActivity[i];
      if (!image.uploaded) {
        try {
          yield call(uploadOfflineImage, image);
          yield put({
            type: "MARK_IMAGE_UPLOADED",
            payload: {
              taskId,
              tab: "post",
              index: i
            }
          });
          console.log(`Uploaded post activity image ${i + 1} for task ${taskId}`);
        } catch (error) {
          console.error(`Failed to upload post activity image ${i + 1}:`, error);
        }
      }
    }
  }
}

// Network watcher saga
function* watchNetwork() {
  const networkChannel = yield call(createNetworkChannel);
  
  while (true) {
    const isOnline = yield take(networkChannel);
    if (isOnline) {
      yield call(processOfflineImages);
    }
  }
}

export default function* taskSaga() {
  yield watchNetwork();
}