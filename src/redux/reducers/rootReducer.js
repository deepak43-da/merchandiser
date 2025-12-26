
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import taskReducer from "./taskReducer";
import capturedImagesReducer from "./capturedImagesReducer";
import queueReducer from "./queueReducer";

export default combineReducers({
  auth: authReducer,
  tasks: taskReducer,
   capturedImages: capturedImagesReducer,
   queue:queueReducer
});
