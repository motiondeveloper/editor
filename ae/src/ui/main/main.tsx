import { useRef } from "react";
import * as pkg from "../../../package.json";
import { evalTS, openLinkInBrowser } from "../lib/utils/bolt";
import { useMonaco } from "../monaco/useMonaco";
import "./main.scss";

const Main = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  const { setValue, getValue, insertValue, disableErrors } =
    useMonaco(editorRef);

  const issueUrl = new URL(
    "https://github.com/motiondeveloper/editor/issues/new",
  );

  issueUrl.searchParams.set("title", `[${pkg.version}] Issue Name`);
  issueUrl.searchParams.set("labels", "ae");

  return (
    <div className="app">
      <div ref={editorRef} id="monaco" />
      <div className="controls">
        <div>
          <button
            onClick={async () => setValue(await evalTS("getCurrentExpression"))}
          >
            Get
          </button>
          <button
            onClick={() => {
              const expression = getValue();
              if (expression) evalTS(`setCurrentExpression`, expression);
            }}
          >
            Apply
          </button>
          <button
            onClick={async () => {
              const linkString = await evalTS(`getPropertyPath`);
              if (linkString) insertValue(linkString);
            }}
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
