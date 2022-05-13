import * as Monaco from "monaco-editor";
import Linter from "eslint4b-prebuilt";
import { SEVERITY } from "./eslintConfig";

export function eslintErrorsToMonacoMarkers(
  errors: Linter.LintMessage[],
  linter: Linter
): Monaco.editor.IMarkerData[] {
  const ruleDefines = linter.getRules();
  const severityMap = {
    [SEVERITY.ERROR]: 8,
    [SEVERITY.WARN]: 4,
    [SEVERITY.OFF]: 0,
  } as const;

  const markers = errors.map((err) => {
    if (err.fatal) {
      return {
        startLineNumber: err.line,
        startColumn: err.column,
        message: err.message,
        severity: severityMap[err.severity],
        source: "eslint",
      };
    }

    return {
      code: {
        value: err.ruleId ?? "",
        target: err.ruleId && ruleDefines.get(err.ruleId)?.meta?.docs?.url,
      },
      startLineNumber: err.line,
      endLineNumber: err.endLine,
      startColumn: err.column,
      endColumn: err.endColumn,
      message: err.message,
      severity: severityMap[err.severity],
      source: "eslint",
    };
  });

  return markers;
}
