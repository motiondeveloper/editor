import * as monaco from "monaco-editor";
import prettierPluginEstree from "prettier/plugins/estree";
import prettierBabel from "prettier/plugins/typescript";
import prettier from "prettier/standalone";
import { useEffect, useState } from "react";
import theme from "../../../../common/onedarkpro-theme.json";
import { lintEditor } from "../linting/lint";
import { editorActions } from "./editorActions";
import { monacoConfig } from "./monacoConfig";
import { typeDefsLib } from "./typeDefsLibrary";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

function initiMonaco() {
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
    theme as monaco.editor.IStandaloneThemeData,
  );

  monaco.languages.registerDocumentFormattingEditProvider("typescript", {
    async provideDocumentFormattingEdits(model, options) {
      const plugins = [prettierBabel, prettierPluginEstree];
      const text = await prettier.format(model.getValue(), {
        parser: "typescript",
        plugins,
        tabWidth: options.tabSize,
        useTabs: !options.insertSpaces,
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
      content: '<reference lib="es6" />',
      filePath: "lib.es6.d.ts",
    },
  ]);
}

// Initialize the editor settings once, outside of the react lifecycle
initiMonaco();

function setupMonacoInstance(editorElement: HTMLDivElement) {
  const monacoInstance = monaco.editor.create(editorElement, monacoConfig);

  for (const action of editorActions) {
    monacoInstance.addAction(action);
  }

  lintEditor(monaco, monacoInstance);

  let timer: NodeJS.Timeout | null = null;
  monacoInstance?.getModel()?.onDidChangeContent(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      lintEditor(monaco, monacoInstance);
    }, 500);
  });

  return monacoInstance;
}

export function useMonaco(editorRef: React.RefObject<HTMLDivElement>) {
  const [monacoInstance, setMonacoInstance] =
    useState<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if (!editorRef.current) return;

    const monacoInstance = setupMonacoInstance(editorRef.current);

    setMonacoInstance(monacoInstance);
    return () => monacoInstance.dispose();
  }, [editorRef]);

  return {
    setValue(value: string) {
      monacoInstance?.setValue(value);
    },
    getValue() {
      return monacoInstance?.getValue();
    },
    insertValue(content: string) {
      if (!monacoInstance) return;
      const selection = monacoInstance.getSelection();
      monacoInstance.executeEdits("pickwhip", [
        {
          text: content,
          range: selection || {
            endColumn: 1,
            endLineNumber: 1,
            startColumn: 1,
            startLineNumber: 1,
          },
          forceMoveMarkers: true,
        },
      ]);
    },
    disableErrors(shouldDisable: boolean) {
      const model = monacoInstance?.getModel();
      if (!model) return;

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: shouldDisable,
        noSyntaxValidation: shouldDisable,
      });
    },
  };
}
