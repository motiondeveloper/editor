import * as monaco from "monaco-editor";
import defaultCode from "../../../../common/defaultCode";

export const monacoConfig: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    value: defaultCode,
    language: "typescript",
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    formatOnPaste: true,
    insertSpaces: false,
    tabSize: 2,
    theme: "one-dark",
    lineNumbersMinChars: 3,
  };
