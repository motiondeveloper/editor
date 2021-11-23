import React from "react";
import Editor from "@monaco-editor/react";
import defaultCode from "../../common/defaultCode";
import expressionTypes from "expression-globals-typescript/dist/index.d.ts?raw";
import theme from "../../common/onedarkpro-theme.json";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import toast, { Toaster } from "react-hot-toast";
import prettier from "prettier/esm/standalone";
import prettierBabel from "prettier/esm/parser-babel";

function App() {
  const libCode = expressionTypes.replace(/export /g, "");

  function loadContentFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("state");

    if (encoded == null) {
      return null;
    }

    const decoded = decompressFromEncodedURIComponent(encoded);
    if (decoded == null) {
      throw new Error("failed decompression");
    }
    return decoded;
  }

  const [value, setValue] = React.useState(defaultCode);
  React.useEffect(() => {
    const valueFromUrl = loadContentFromUrl();
    if (valueFromUrl) {
      setValue(valueFromUrl);
    }
  }, []);

  function handleEditorWillMount(monaco) {
    // Compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      allowNonTsExtensions: true,
    });

    // Adding type definitions
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `${libCode}
      const thisComp = new Comp();
      const thisProperty = new Property<>();
      const thisLayer = new Layer();`
    );

    // Register the custom theme
    monaco.editor.defineTheme("one-dark", theme);
    // Register prettier as the formatter
    monaco.languages.registerDocumentFormattingEditProvider("javascript", {
      async provideDocumentFormattingEdits(model, options, token) {
        const plugins = [prettierBabel];
        const text = prettier.format(model.getValue(), {
          parser: "babel",
          plugins,
          useTabs: true,
        });

        return [
          {
            range: model.getFullModelRange(),
            text,
          },
        ];
      },
    });
  }

  function handleEditorDidMount(editor, monaco) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    editor.addAction({
      // An unique identifier of the contributed action.
      id: "save-to-url",

      // A label of the action that will be presented to the user.
      label: "Save to URL",

      // An optional array of keybindings for the action.
      keybindings: [
        // chord
        monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S),
      ],

      // A precondition for this action.
      precondition: null,

      // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
      keybindingContext: null,

      contextMenuGroupId: "navigation",

      contextMenuOrder: 1.5,

      // Method that will be executed when the action is triggered.
      // @param editor The editor instance is passed in as a convinience
      run: async function (editor) {
        // Encode to URI friendly string
        const encoded = compressToEncodedURIComponent(editor.getValue());
        // Replace the current url with a state parameter
        window.history.replaceState(null, document.title, `?state=${encoded}`);
        // Copy the URL to the clipboard
        await navigator.clipboard.writeText(document.location.href);
        toast.success("Saved to URL and copied to clipboard!", {
          style: {
            borderRadius: "16px",
            color: "#FFFFFF",
            background: "#282C35",
          },
        });
        return null;
      },
    });
  }
  return (
    <div>
      <Toaster position="bottom-center" />
      <Editor
        height="100vh"
        theme="one-dark"
        language="javascript"
        value={value}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          formatOnPaste: true,
          insertSpaces: false,
          tabSize: 2,
          padding: {
            top: 16,
          },
        }}
      />
    </div>
  );
}

export default App;
