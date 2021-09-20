import * as React from "react";
import { useExtensionProperties } from "../hooks/useExtensionProperties";
import { usePlatform } from "../hooks/usePlatform";

export default function LogInfo() {
  const [logPath, setLogPath] = React.useState(null);
  const platform = usePlatform();

  const { isInCEPEnvironment, name } = useExtensionProperties();

  React.useEffect(() => {
    async function loadLogPath() {
      if (isInCEPEnvironment) {
        const logger = await import("../logger");
        setLogPath(logger.logPath);
      }
    }

    loadLogPath();
  }, [isInCEPEnvironment]);

  const logMessage = async (level: string, message: string = "log") => {
    if (isInCEPEnvironment) {
      const { logger } = await import("../logger");
      logger[level](message);
    }
  };

  const openLog = async () => {
    if (isInCEPEnvironment) {
      // @ts-ignore
      const child = window.cep_node.require("child_process");
      if (platform === "darwin") {
        child.spawn("open", [logPath]);
      }
    }
  };

  return (
    <div className="LogInfo">
      <h3>Log Info</h3>

      {!isInCEPEnvironment && <p>Not in CEP environment.</p>}

      <ul>
        <li>Path: {logPath}</li>
      </ul>

      {platform == "darwin" && (
        <button onClick={() => openLog()}>Open Log</button>
      )}
      <button onClick={() => logMessage("info", `Info from CEP`)}>
        Log Info
      </button>
      <button onClick={() => logMessage("error", `Error from CEP`)}>
        Log Error
      </button>
    </div>
  );
}
