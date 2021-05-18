import React from "react";
import "./App.css";
import Editor from "@monaco-editor/react";
import defaultCode from "./defaultCode";
// eslint-disable-next-line import/no-webpack-loader-syntax
import expressionTypes from "!!raw-loader!expression-globals-typescript/dist/index.d.ts";
import theme from "./onedarkpro-theme.json";

function App() {
  const libCode = expressionTypes.replace(/export /g, "");
  function handleEditorWillMount(monaco) {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
      noLib: true,
    });

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `${libCode}
      const thisComp = new Comp();
      const thisProperty = new Property<>();
      const thisLayer = new Layer();`
    );
    monaco.editor.defineTheme("one-dark", theme);
  }
  return (
    <Editor
      height="100vh"
      theme="one-dark"
      language="javascript"
      value={defaultCode}
      beforeMount={handleEditorWillMount}
      options={{ minimap: { enabled: false } }}
    />
  );
}

export default App;
