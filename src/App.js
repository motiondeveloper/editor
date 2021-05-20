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
    // Compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
      noLib: true,
    });

    // Adding type definitions
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `${libCode}
      const thisComp = new Comp();
      const thisProperty = new Property<>();
      const thisLayer = new Layer();`
    );

    // Register the custom theme
    monaco.editor.defineTheme("one-dark", theme);
    // Register prettier as the formatter
    monaco.languages.registerDocumentFormattingEditProvider("javascript", {
      async provideDocumentFormattingEdits(model, options, token) {
        const prettier = require("prettier/standalone");
        const plugins = [require("prettier/parser-babel")];
        const text = prettier.format(model.getValue(), {
          parser: "babel",
          plugins,
          useTabs: true,
        });

        return [
          {
            range: model.getFullModelRange(),
            text,
          },
        ];
      },
    });
  }
  return (
    <Editor
      height="100vh"
      theme="vs-dark"
      language="javascript"
      value={defaultCode}
      beforeMount={handleEditorWillMount}
      options={{
        minimap: { enabled: false },
        formatOnPaste: true,
        insertSpaces: false,
        tabSize: 2,
      }}
    />
  );
}

export default App;
