import { useRef, useState } from "react";
import { evalES, useScripts, openLinkInBrowser } from "../lib/utils";
import "./main.scss";
import { useMonaco } from "../monaco/useMonaco";
import * as pkg from "../../../package.json";

const Main = () => {
  useScripts();
  const editorRef = useRef<HTMLDivElement>(null);

  const { setValue, getValue, insertValue, disableErrors } =
    useMonaco(editorRef);

  const issueUrl = new URL(
    "https://github.com/motiondeveloper/editor/issues/new"
  );

  issueUrl.searchParams.set("title", `[${pkg.version}] Issue Name`);
  issueUrl.searchParams.set("labels", "ae");

  return (
    <div className="app">
      <div ref={editorRef} id="monaco" />
      <div className="controls">
        <div>
          <button
            onClick={async () =>
              setValue(await evalES("getCurrentExpression()"))
            }
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
          <button onClick={() => openLinkInBrowser(issueUrl.toString())}>
            File Issue
          </button>
        </div>
        <div>
          <label>
            Disable TS Errors
            <input
              type="checkbox"
              onChange={(e) => disableErrors(e.target.checked)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Main;
