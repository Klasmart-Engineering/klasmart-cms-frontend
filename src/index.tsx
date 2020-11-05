import React from "react";
import ReactDOM from "react-dom";
import { apiEmitter, ApiErrorEventData, ApiEvent } from "./api";
import App from "./App";
import "./index.css";
import { LangRecordId } from "./locale/lang/type";
import { t } from "./locale/LocaleManager";
import { store } from "./reducers";
import { actError } from "./reducers/notify";
import * as serviceWorker from "./serviceWorker";

apiEmitter.on<ApiErrorEventData>(ApiEvent.ResponseError, (e) => {
  if (!e) return;
  const { label, msg } = e;
  const message = String(t(label as LangRecordId) || msg || "");
  if (message) store.dispatch(actError(message));
});

// if (process.env.NODE_ENV === 'development') {
//   const { worker } = require('./mocks/browser')
//   worker.start()
// }

ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
