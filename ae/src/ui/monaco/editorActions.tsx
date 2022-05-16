import * as monaco from "monaco-editor";
import { compressToEncodedURIComponent } from "lz-string";
import { evalES } from "../lib/utils";
import Linter from "eslint4b-prebuilt";
import { eslintConfig } from "../linting/eslintConfig";

const saveToURL = {
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

  contextMenuGroupId: "9_cutcopypaste",

  contextMenuOrder: 1.5,

  // Method that will be executed when the action is triggered.
  // @param editor The editor instance is passed in as a convinience
  run: async function (editor: monaco.editor.IStandaloneCodeEditor) {
    // Encode to URI friendly string
    const encoded = compressToEncodedURIComponent(editor.getValue());

    // Copy the URL to the clipboard
    // TODO: this only works on https, won't work in CEP
    await navigator.clipboard.writeText(
      `editor.motiondeveloper.com/?state=${encoded}`
    );
  },
};

const applyToProperty = {
  // An unique identifier of the contributed action.
  id: "apply-to-property",

  // A label of the action that will be presented to the user.
  label: "Apply Expression",

  // An optional array of keybindings for the action.
  keybindings: [
    // TODO: find keys that work
    monaco.KeyMod.chord(monaco.KeyMod.Alt, monaco.KeyCode.KeyA),
  ],

  // A precondition for this action.
  precondition: undefined,

  // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
  keybindingContext: undefined,

  contextMenuGroupId: "expression",

  contextMenuOrder: 1.5,

  // Method that will be executed when the action is triggered.
  // @param editor The editor instance is passed in as a convinience
  run: async function (editor: monaco.editor.IStandaloneCodeEditor) {
    evalES(`setCurrentExpression(${JSON.stringify(editor.getValue())})`);
  },
};

const getValueFromProperty = {
  // An unique identifier of the contributed action.
  id: "get-value-from-property",

  // A label of the action that will be presented to the user.
  label: "Get Expression",

  // An optional array of keybindings for the action.
  keybindings: [
    // TODO: find keys that work
    monaco.KeyMod.chord(monaco.KeyMod.Alt, monaco.KeyCode.KeyG),
  ],

  // A precondition for this action.
  precondition: undefined,

  // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
  keybindingContext: undefined,

  contextMenuGroupId: "expression",

  contextMenuOrder: 1.5,

  // Method that will be executed when the action is triggered.
  // @param editor The editor instance is passed in as a convinience
  run: async function (editor: monaco.editor.IStandaloneCodeEditor) {
    editor.setValue(await evalES("getCurrentExpression()"));
  },
};

const fixLintErrors = {
  // An unique identifier of the contributed action.
  id: "fix-eslint-errors",

  // A label of the action that will be presented to the user.
  label: "Fix Lint Errors",

  // A precondition for this action.
  precondition: undefined,

  // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
  keybindingContext: undefined,

  contextMenuGroupId: "1_modification",

  contextMenuOrder: 1.5,

  // Method that will be executed when the action is triggered.
  // @param editor The editor instance is passed in as a convinience
  run: async function (editor: monaco.editor.IStandaloneCodeEditor) {
    const linter = new Linter();
    const errs = linter.verifyAndFix(editor.getValue(), eslintConfig);
    const model = editor.getModel();
    if (!model) return;

    const lines = model.getLineCount();

    editor.executeEdits("fix eslint errors", [
      {
        text: errs.output,
        range: {
          startColumn: 1,
          startLineNumber: 1,
          endColumn: model.getLineMaxColumn(lines),
          endLineNumber: lines,
        },
        forceMoveMarkers: false,
      },
    ]);
  },
};

export const editorActions = [
  saveToURL,
  applyToProperty,
  getValueFromProperty,
  fixLintErrors,
];
