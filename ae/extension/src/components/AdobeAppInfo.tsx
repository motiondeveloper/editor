import * as React from "react";
import { useExtensionProperties } from "../hooks/useExtensionProperties";

export default function AdobeAppInfo() {
  const extensionProperties = useExtensionProperties();

  return (
    <div className="AdobeAppInfo">
      <h3>Adobe App Info</h3>
      {!extensionProperties.isInCEPEnvironment && (
        <p>Not in CEP environment.</p>
      )}
      <ul>
        <li>Id: {extensionProperties.id}</li>
        <li>Name: {extensionProperties.name}</li>
        <li>Version: {extensionProperties.version}</li>
        <li>Extension Path: {extensionProperties.extensionPath}</li>
      </ul>
    </div>
  );
}
