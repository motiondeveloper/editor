import React from "react";
import ReactDOM from "react-dom";
import "../index.scss";
import Main from "./main";
import "../monaco/userWorker";

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
