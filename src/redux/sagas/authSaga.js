
import { takeLatest, put } from "redux-saga/effects";

function* loginWorker(action) {
  yield put({ type: "LOGIN_SUCCESS", payload: action.payload });
}

export default function* authSaga() {
  yield takeLatest("LOGIN_REQUEST", loginWorker);
}


