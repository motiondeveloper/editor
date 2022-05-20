import type * as Monaco from "monaco-editor";
import Linter from "eslint4b-prebuilt";
import { eslintConfig } from "./eslintConfig";
import { eslintErrorsToMonacoMarkers } from "./eslintErrorsToMonacoMarkers";
import noEndingWithFunctionDeclaration from "./rules/no-ending-with-function-declaration";

export function lintEditor(
  monaco: typeof Monaco,
  monacoInstance: Monaco.editor.IStandaloneCodeEditor
) {
  const model = monacoInstance.getModel();
  if (!model) return;

  const value = monacoInstance.getValue();
  const markers = getLintModelMarkers(value);
  if (!markers) return;
  monaco.editor.setModelMarkers(model, "eslint", markers);
}

function getLintModelMarkers(code: string) {
  const linter = new Linter();
  linter.defineRule(
    "no-ending-with-function-declaration",
    noEndingWithFunctionDeclaration
  );

  const errs = linter.verify(code, eslintConfig);
  const markers = eslintErrorsToMonacoMarkers(errs, linter);

  return markers;
}
