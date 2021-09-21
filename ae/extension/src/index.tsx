import * as monaco from "monaco-editor";
import monacoWorkers from "./monacoWorkerManifest.json";
import theme from "../../../common/onedarkpro-theme.json";

// Since packaging is done by you, you need
// to instruct the editor how you named the
// bundles that contain the web workers.
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === "json") {
      return monacoWorkers["language/json/json.worker.js"];
    }
    if (label === "css") {
      return monacoWorkers["language/css/css.worker.js"];
    }
    if (label === "html") {
      return monacoWorkers["language/html/html.worker.js"];
    }
    if (label === "typescript" || label === "javascript") {
      return monacoWorkers["language/typescript/ts.worker.js"];
    }
    return monacoWorkers["editor/editor.worker.js"];
  },
};

monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false,
});

// compiler options
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES6,
  allowNonTsExtensions: true,
});

// extra libraries
var libSource = [
  "declare class Facts {",
  "    /**",
  "     * Returns the next fact",
  "     */",
  "    static next():string",
  "}",
].join("\n");
var libUri = "ts:filename/facts.d.ts";
monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
// When resolving definitions and references, the editor will try to use created models.
// Creating a model for the library allows "peek definition/references" commands to work with the library.
monaco.editor.createModel(libSource, "typescript", monaco.Uri.parse(libUri));

var jsCode = [
  '"use strict";',
  "",
  "class Chuck {",
  "    greet() {",
  "        return Facts.next();",
  "    }",
  "}",
].join("\n");

monaco.editor.create(document.getElementById("root"), {
  value: jsCode,
  language: "javascript",
});
