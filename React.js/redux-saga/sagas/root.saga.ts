import { all } from "redux-saga/effects";
import app from './app.saga';

export default function* rootSaga() {
  try {
    yield all([
      app(),
    ]);
  } catch (e) {
    console.error(e);
  }
}
