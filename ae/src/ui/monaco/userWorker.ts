import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import prettierBabel from "prettier/parser-babel";
import prettier from "prettier/standalone";
import theme from "../../../../common/onedarkpro-theme.json";
import { typeDefsLib } from "./typeDefsLibrary";

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

const ignoredCodes = [2365 /** Operator types */];

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  diagnosticCodesToIgnore: ignoredCodes,
});

monaco.editor.defineTheme(
  "one-dark",
  theme as monaco.editor.IStandaloneThemeData
);
monaco.languages.registerDocumentFormattingEditProvider("typescript", {
  async provideDocumentFormattingEdits(model, options, token) {
    const plugins = [prettierBabel];
    const text = prettier.format(model.getValue(), {
      parser: "babel",
      plugins,
      useTabs: true,
      printWidth: 80,
    });

    return [
      {
        range: model.getFullModelRange(),
        text,
      },
    ];
  },
});

monaco.languages.typescript.typescriptDefaults.setExtraLibs([
  { content: typeDefsLib() },
  {
    content: '<reference lib="es5" />',
    filePath: "lib.es5.d.ts",
  },
]);
