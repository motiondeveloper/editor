import expressionTypes from "expression-globals-typescript/dist/index.d.ts?raw";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import prettierBabel from "prettier/parser-babel";
import prettier from "prettier/standalone";
import { useEffect, useState } from "react";
import defaultCode from "../../../../common/defaultCode";
import theme from "../../../../common/onedarkpro-theme.json";

export function useMonaco() {
  const [monacoInstance, setMonacoInstance] =
    useState<monaco.editor.IStandaloneCodeEditor>();
  useEffect(() => {
    // @ts-expect-error
    self.MonacoEnvironment = {
      getWorker(_: undefined, label: string) {
        if (label === "typescript" || label === "javascript") {
          return new tsWorker();
        }

        return new editorWorker();
      },
    };

    monaco.editor.defineTheme(
      "one-dark",
      theme as monaco.editor.IStandaloneThemeData
    );
    const monacoInstance = monaco.editor.create(
      document.getElementById("monaco")!,
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
      }
    );

    monaco.languages.registerDocumentFormattingEditProvider("typescript", {
      async provideDocumentFormattingEdits(model, options, token) {
        const plugins = [prettierBabel];
        const text = prettier.format(model.getValue(), {
          parser: "babel",
          plugins,
          useTabs: true,
          printWidth: 70,
        });

        return [
          {
            range: model.getFullModelRange(),
            text,
          },
        ];
      },
    });

    const libCode = expressionTypes.replace(/export /g, "");
    monaco.languages.typescript.typescriptDefaults.addExtraLib(`${libCode}
const thisComp = new Comp();
const thisProperty = new Property<>();
const thisLayer = new Layer();`);

    setMonacoInstance(monacoInstance);
    return () => monacoInstance.dispose();
  }, []);

  return {
    setValue(value: string) {
      monacoInstance?.setValue(value);
    },
    getValue() {
      return monacoInstance?.getValue();
    },
  };
}
