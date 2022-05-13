import { useRef } from "react";
import { evalES, useScripts } from "../lib/utils";
import "./main.scss";
import { useMonaco } from "../monaco/useMonaco";

const Main = () => {
  useScripts();
  const editorRef = useRef<HTMLDivElement>(null);
  const { setValue, getValue, insertValue } = useMonaco(editorRef);
  return (
    <div className="app">
      <div ref={editorRef} id="monaco" />
      <div className="controls">
        <button
          onClick={async () => setValue(await evalES("getCurrentExpression()"))}
        >
          Get
        </button>
        <button
          onClick={() =>
            evalES(`setCurrentExpression(${JSON.stringify(getValue())})`)
          }
        >
          Apply
        </button>
        <button
          onClick={async () => insertValue(await evalES(`getPropertyPath()`))}
        >
          Link
        </button>
      </div>
    </div>
  );
};

export default Main;