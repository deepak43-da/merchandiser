
// import { all } from "redux-saga/effects";
// import authSaga from "./authSaga";
// import taskSaga from "./taskSaga";

// export default function* rootSaga() {
//   yield all([authSaga(), taskSaga()]);
// }

import { all } from "redux-saga/effects";
import authSaga from "./authSaga";
import taskSaga from "./taskSaga";

export default function* rootSaga() {
  yield all([authSaga(), taskSaga()]);
}
