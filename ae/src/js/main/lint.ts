import type * as Monaco from "monaco-editor";

if (typeof window.cep_node !== "undefined") {
  /**
   * TODO: this works when we reference the file in node modules directly,
   * ("esbuild/lib/linter/linter.js")
   * but we need to get rollup building it somehow
   */
  var ESLint = require("") as typeof import("eslint");
}

import type { Linter } from "eslint";

const WARN = 1;
const ERROR = 2;
const eslintConfig: Linter.Config<Linter.RulesRecord> = {
  env: { es2021: true },
  rules: {
    "array-callback-return": WARN,
    "getter-return": WARN,
    "new-parens": WARN,
    indent: WARN,
    quotes: WARN,
    "no-array-constructor": WARN,
    "no-caller": ERROR,
    "no-cond-assign": [WARN, "except-parens"],
    "no-const-assign": ERROR,
    "no-control-regex": WARN,
    "no-dupe-args": WARN,
    "no-dupe-class-members": WARN,
    "no-dupe-keys": WARN,
    "no-duplicate-case": WARN,
    "no-empty-character-class": WARN,
    "no-empty-pattern": WARN,
    "no-duplicate-imports": WARN,
    "no-empty": [WARN, { allowEmptyCatch: true }],
    "no-eval": ERROR,
    "no-ex-assign": WARN,
    "no-extend-native": WARN,
    "no-extra-bind": WARN,
    "no-extra-label": WARN,
    "no-extra-boolean-cast": WARN,
    "no-func-assign": ERROR,
    "no-global-assign": ERROR,
    "no-implied-eval": WARN,
    "no-invalid-regexp": WARN,
    "no-label-var": WARN,
    "no-labels": [WARN, { allowLoop: true, allowSwitch: false }],
    "no-lone-blocks": WARN,
    "no-loop-func": WARN,
    "no-mixed-operators": [
      WARN,
      {
        groups: [
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
          ["in", "instanceof"],
        ],
        allowSamePrecedence: false,
      },
    ],
    "no-unsafe-negation": WARN,
    "no-new-func": WARN,
    "no-new-object": WARN,
    "no-octal": WARN,
    "no-redeclare": ERROR,
    "no-script-url": WARN,
    "no-self-assign": WARN,
    "no-self-compare": WARN,
    "no-sequences": WARN,
    "no-shadow-restricted-names": WARN,
    "no-sparse-arrays": WARN,
    "no-template-curly-in-string": WARN,
    "no-this-before-super": WARN,
    "no-unreachable": WARN,
    "no-unused-labels": WARN,
    "no-unused-vars": [
      WARN,
      {
        args: "none",
        ignoreRestSiblings: true,
      },
    ],
    "no-use-before-define": [
      WARN,
      { classes: false, functions: false, variables: false },
    ],
    "no-useless-computed-key": WARN,
    "no-useless-concat": WARN,
    "no-useless-constructor": WARN,
    "no-useless-escape": WARN,
    "no-useless-rename": [
      WARN,
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    "require-yield": WARN,
    "use-isnan": WARN,
    "valid-typeof": WARN,
  },
};

export function lintEditor(
  monaco: typeof Monaco,
  monacoInstance: Monaco.editor.IStandaloneCodeEditor
) {
  if (typeof window.cep_node === "undefined") return;
  const model = monacoInstance.getModel();
  if (!model) return;

  const value = monacoInstance.getValue();
  const markers = getLintModelMarkers(value);
  if (!markers) return;
  monaco.editor.setModelMarkers(model, "eslint", markers);
}

function getLintModelMarkers(code: string) {
  const linter = new ESLint.Linter();

  const errs = linter.verify(code, eslintConfig);

  const severityMap = {
    2: 8, // 2 for eslint is error
    1: 4, // 1 for eslint is warning
    0: 0,
  } as const;

  const ruleDefines = linter.getRules();

  const markers: Monaco.editor.IMarkerData[] = errs.map((err) => ({
    code: {
      value: err.ruleId,
      target: ruleDefines.get(err.ruleId).meta.docs.url,
    },
    startLineNumber: err.line,
    endLineNumber: err.endLine,
    startColumn: err.column,
    endColumn: err.endColumn,
    message: err.message,
    severity: severityMap[err.severity],
    source: "eslint",
  }));

  return markers;
}
