import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import prettierBabel from "prettier/parser-babel";
import prettier from "prettier/standalone";
import { useEffect, useState } from "react";
import theme from "../../../../common/onedarkpro-theme.json";
import { lintEditor } from "../linting/lint";
import { editorActions } from "./editorActions";
import { typeDefsLib } from "./typeDefsLibrary";
import { monacoConfig } from "./monacoConfig";

function setupMonacoInstance(editorElement: HTMLDivElement) {
  monaco.editor.defineTheme(
    "one-dark",
    theme as monaco.editor.IStandaloneThemeData
  );

  const monacoInstance = monaco.editor.create(editorElement, monacoConfig);

  for (const action of editorActions) {
    monacoInstance.addAction(action);
  }

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

  monaco.languages.typescript.typescriptDefaults.addExtraLib(typeDefsLib());

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
    // @ts-expect-error
    self.MonacoEnvironment = {
      getWorker(_: undefined, label: string) {
        if (label === "typescript" || label === "javascript") {
          return new tsWorker();
        }

        return new editorWorker();
      },
    };

    const monacoInstance = setupMonacoInstance(editorRef.current);

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
    insertValue(content: string) {
      monacoInstance?.executeEdits("pickwhip", [
        {
          text: content,
          range: monacoInstance.getSelection(),
          forceMoveMarkers: true,
        },
      ]);
    },
  };
}
