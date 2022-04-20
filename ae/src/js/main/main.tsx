import { useEffect, useState } from "react";
import { os, path, fs } from "../lib/node";
import { csi, evalES, evalFile, openLinkInBrowser } from "../lib/utils";

import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import tsLogo from "../assets/typescript.svg";
import sassLogo from "../assets/sass.svg";

import nodeJs from "../assets/node-js.svg";
import adobe from "../assets/adobe.svg";
import bolt from "../assets/bolt-cep.svg";

import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import expressionTypes from "expression-globals-typescript/dist/index.d.ts?raw";

import "./main.scss";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }

    return new editorWorker();
  },
};

monaco.editor.create(document.getElementById("container")!, {
  value: "wiggle()",
  language: "typescript",
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  formatOnPaste: true,
  insertSpaces: false,
  tabSize: 2,
});

const libCode = expressionTypes.replace(/export /g, "");
monaco.languages.typescript.typescriptDefaults.addExtraLib(`${libCode}
const thisComp = new Comp();
const thisProperty = new Property<>();
const thisLayer = new Layer();`);

const Main = () => {
  const [count, setCount] = useState(0);

  const jsxTest = () => {
    console.log(evalES(`helloWorld("${csi.getApplicationID()}")`));
  };

  const nodeTest = () => {
    alert(
      `Node.js ${process.version}\nPlatform: ${
        os.platform
      }\nFolder: ${path.basename(window.cep_node.global.__dirname)}`
    );
  };

  useEffect(() => {
    if (window.cep) {
      const extRoot = csi.getSystemPath("extension");
      const jsxSrc = `${extRoot}/jsx/index.js`;
      const jsxBinSrc = `${extRoot}/jsx/index.jsxbin`;
      if (fs.existsSync(jsxSrc)) {
        console.log(jsxSrc);
        evalFile(jsxSrc);
      } else if (fs.existsSync(jsxBinSrc)) {
        console.log(jsxBinSrc);
        evalFile(jsxBinSrc);
      }
    }
  }, []);

  return (
    <div className="app" id="container">
      content
    </div>
  );
};

export default Main;
