import { evalES, useScripts } from "../lib/utils";
import "./main.scss";
import { useMonaco } from "./Monaco";

const Main = () => {
  useScripts();
  const { setValue, getValue } = useMonaco();
  return (
    <div className="app">
      <div id="monaco" />
      <div>
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
      </div>
    </div>
  );
};

export default Main;
