import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";
import "./index.css";

import { inCEPEnvironment } from "cep-interface";

if (inCEPEnvironment()) {
  import("./utils/extendscript");
}

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
