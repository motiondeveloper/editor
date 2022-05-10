import expressionTypes from "expression-globals-typescript/dist/index.d.ts?raw";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import prettierBabel from "prettier/parser-babel";
import prettier from "prettier/standalone";
import { useEffect, useState } from "react";
import defaultCode from "../../../../common/defaultCode";
import theme from "../../../../common/onedarkpro-theme.json";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { evalES } from "../lib/utils";

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
        lineNumbersMinChars: 3,
      }
    );

    monacoInstance.addAction({
      // An unique identifier of the contributed action.
      id: "save-to-url",

      // A label of the action that will be presented to the user.
      label: "Save to URL",

      // An optional array of keybindings for the action.
      keybindings: [
        // chord
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd, monaco.KeyCode.KeyS),
      ],

      // A precondition for this action.
      precondition: undefined,

      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: undefined,

      contextMenuGroupId: "navigation",

      contextMenuOrder: 1.5,

      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run: async function (editor) {
        // Encode to URI friendly string
        const encoded = compressToEncodedURIComponent(editor.getValue());

        // Copy the URL to the clipboard
        // TODO: this only works on https, won't work in CEP
        await navigator.clipboard.writeText(
          `editor.motiondeveloper.com/?state=${encoded}`
        );
      },
    });

    monacoInstance.addAction({
      // An unique identifier of the contributed action.
      id: "apply-to-property",

      // A label of the action that will be presented to the user.
      label: "Apply expression",

      // An optional array of keybindings for the action.
      keybindings: [
        // TODO: find keys that work
        monaco.KeyMod.chord(monaco.KeyMod.Alt, monaco.KeyCode.KeyA),
      ],

      // A precondition for this action.
      precondition: undefined,

      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: undefined,

      contextMenuGroupId: "navigation",

      contextMenuOrder: 1.5,

      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run: async function (editor) {
        evalES(`setCurrentExpression(${JSON.stringify(editor.getValue())})`);
      },
    });

    monacoInstance.addAction({
      // An unique identifier of the contributed action.
      id: "get-value-from-property",

      // A label of the action that will be presented to the user.
      label: "Get expression",

      // An optional array of keybindings for the action.
      keybindings: [
        // TODO: find keys that work
        monaco.KeyMod.chord(monaco.KeyMod.Alt, monaco.KeyCode.KeyG),
      ],

      // A precondition for this action.
      precondition: undefined,

      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: undefined,

      contextMenuGroupId: "navigation",

      contextMenuOrder: 1.5,

      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run: async function (editor) {
        editor.setValue(await evalES("getCurrentExpression()"));
      },
    });

    monaco.languages.registerDocumentFormattingEditProvider("typescript", {
      async provideDocumentFormattingEdits(model, options, token) {
        const plugins = [prettierBabel];
        const text = prettier.format(model.getValue(), {
          parser: "babel",
          plugins,
          useTabs: true,
          printWidth: 56,
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

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      target: 99,
      allowJs: true,
      lib: ["esnext"],
    });

    setMonacoInstance(monacoInstance);
    return () => monacoInstance.dispose();
  }, []);

  return {
    setValue(value: string) {
      // Exit early if we're going to set the same value
      if (value === monacoInstance?.getValue()) return;

      const model = monacoInstance?.getModel();
      if (!model) return;

      // Set the value with an edit operation (rather than .setValue())
      // to allow users to undo the change
      model.pushEditOperations(
        [],
        [{ range: model.getFullModelRange(), text: value }],
        () => []
      );
    },
    getValue() {
      return monacoInstance?.getValue();
    },
  };
}
