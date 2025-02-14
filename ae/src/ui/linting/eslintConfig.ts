import Linter from "eslint4b-prebuilt";
import test from "./rules/no-ending-with-function-declaration";

export const SEVERITY = {
  OFF: 0,
  WARN: 1,
  ERROR: 2,
} as const;

export const eslintConfig: Linter.Config<Linter.RulesRecord> = {
  env: { es6: true },
  rules: {
    // Custom rules
    "no-ending-with-function-declaration": SEVERITY.ERROR,
    // Builtin rules
    "array-callback-return": SEVERITY.WARN,
    "getter-return": SEVERITY.WARN,
    "new-parens": SEVERITY.WARN,
    indent: [SEVERITY.WARN, 4],
    quotes: SEVERITY.WARN,
    "no-array-constructor": SEVERITY.WARN,
    "no-caller": SEVERITY.ERROR,
    "no-cond-assign": [SEVERITY.WARN, "except-parens"],
    "no-const-assign": SEVERITY.ERROR,
    "no-control-regex": SEVERITY.WARN,
    "no-dupe-args": SEVERITY.WARN,
    "no-dupe-class-members": SEVERITY.WARN,
    "no-dupe-keys": SEVERITY.WARN,
    "no-duplicate-case": SEVERITY.WARN,
    "no-empty-character-class": SEVERITY.WARN,
    "no-empty-pattern": SEVERITY.WARN,
    "no-duplicate-imports": SEVERITY.WARN,
    "no-empty": [SEVERITY.WARN, { allowEmptyCatch: true }],
    "no-eval": SEVERITY.ERROR,
    "no-ex-assign": SEVERITY.WARN,
    "no-extend-native": SEVERITY.WARN,
    "no-extra-bind": SEVERITY.WARN,
    "no-extra-label": SEVERITY.WARN,
    "no-extra-boolean-cast": SEVERITY.WARN,
    "no-func-assign": SEVERITY.ERROR,
    "no-global-assign": SEVERITY.ERROR,
    "no-implied-eval": SEVERITY.WARN,
    "no-invalid-regexp": SEVERITY.WARN,
    "no-label-var": SEVERITY.WARN,
    "no-labels": [SEVERITY.WARN, { allowLoop: true, allowSwitch: false }],
    "no-lone-blocks": SEVERITY.WARN,
    "no-loop-func": SEVERITY.WARN,
    "no-mixed-operators": [
      SEVERITY.WARN,
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
    "no-unsafe-negation": SEVERITY.WARN,
    "no-new-func": SEVERITY.WARN,
    "no-new-object": SEVERITY.WARN,
    "no-octal": SEVERITY.WARN,
    "no-redeclare": SEVERITY.ERROR,
    "no-script-url": SEVERITY.WARN,
    "no-self-assign": SEVERITY.WARN,
    "no-self-compare": SEVERITY.WARN,
    "no-sequences": SEVERITY.WARN,
    "no-shadow-restricted-names": SEVERITY.WARN,
    "no-sparse-arrays": SEVERITY.WARN,
    "no-template-curly-in-string": SEVERITY.WARN,
    "no-this-before-super": SEVERITY.WARN,
    "no-unreachable": SEVERITY.WARN,
    "no-unused-labels": SEVERITY.WARN,
    "no-unused-vars": [
      SEVERITY.WARN,
      {
        args: "none",
        ignoreRestSiblings: true,
      },
    ],
    "no-use-before-define": [
      SEVERITY.WARN,
      { classes: false, functions: false, variables: false },
    ],
    "no-useless-computed-key": SEVERITY.WARN,
    "no-useless-concat": SEVERITY.WARN,
    "no-useless-constructor": SEVERITY.WARN,
    "no-useless-escape": SEVERITY.WARN,
    "no-useless-rename": [
      SEVERITY.WARN,
      {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      },
    ],
    "require-yield": SEVERITY.WARN,
    "use-isnan": SEVERITY.WARN,
    "valid-typeof": SEVERITY.WARN,
    "arrow-body-style": SEVERITY.WARN,
    curly: SEVERITY.WARN,
    "dot-notation": SEVERITY.WARN,
    "no-confusing-arrow": SEVERITY.WARN,
    "no-extra-semi": SEVERITY.WARN,
    "prefer-const": SEVERITY.WARN,
    "spaced-comment": SEVERITY.WARN,
  },
};
