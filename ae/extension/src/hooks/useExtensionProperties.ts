import * as React from "react";
import { id } from "../../../shared";

/**
 * Retrieves the CEP extension properties from 'cep-interface' and the getInfo() script function.
 * Runs on each render.
 */
export function useExtensionProperties() {
  const [extensionProperties, setExtensionProperties] = React.useState({
    id: undefined,
    version: undefined,
    name: undefined,
    extensionPath: undefined,
    isInCEPEnvironment: false,
  });

  React.useEffect(() => {
    async function loadExtensionProperties() {
      const { inCEPEnvironment, evalExtendscript, getExtensionPath } =
        await import("cep-interface");

      if (inCEPEnvironment()) {
        const info: any = await evalExtendscript(`$.global["${id}"].getInfo()`);
        const extensionPath = await getExtensionPath();
        setExtensionProperties({
          id: info.id,
          name: info.name,
          version: info.version,
          extensionPath,
          isInCEPEnvironment: true,
        });
      }
    }

    loadExtensionProperties();
  }, []);

  return extensionProperties;
}
