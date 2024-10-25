import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import { useEffect, useState } from "react";

import { lintEditor } from "../linting/lint";
import { editorActions } from "./editorActions";
import { monacoConfig } from "./monacoConfig";

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
