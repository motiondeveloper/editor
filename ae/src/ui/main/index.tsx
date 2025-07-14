import { createRoot } from "react-dom/client";
import "../index.scss";
import Main from "./main";
import React from "react";
import { initBolt } from "../lib/utils/bolt";

initBolt();

const container = document.getElementById("root");

if (!container) {
  throw Error("Could not find root element to render react.");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
