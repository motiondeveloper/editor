import CSInterface from "./csinterface";
import Vulcan, { VulcanMessage } from "./vulcan";
import { ns } from "../../shared/shared";
import { useEffect } from "react";
import { fs } from "./node";

export const csi = new CSInterface();
export const vulcan = new Vulcan();

export const openLinkInBrowser = (url: string) => {
  if (window.cep) {
    csi.openURLInDefaultBrowser(url);
  } else {
    location.href = url;
  }
};

export const evalES = (script: string, isGlobal = false): Promise<string> => {
  return new Promise(function (resolve, reject) {
    csi.evalScript(
      `try{
        ${
          isGlobal
            ? ""
            : `var host = typeof $ !== 'undefined' ? $ : window; host["${ns}"].`
        }${script};
      }catch(e){
        alert(e);
      }`,
      (res: string) => {
        resolve(res);
      }
    );
  });
};

export const evalFile = (file: string) => {
  return evalES(
    `typeof $ !== 'undefined' ?
    $.evalFile("${file}") :
    fl.runScript(FLfile.platformPathToURI("${file}"));`,
    true
  );
};

export const getAppBackgroundColor = () => {
  const { green, blue, red } =
    csi.hostEnvironment.appSkinInfo.panelBackgroundColor.color;
  return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
};
declare type IVulcanMessageObject = {
  event: string;
  callbackID?: string;
  data?: string | null;
  payload?: object;
};

export const vulcanSend = (id: string, msgObj: IVulcanMessageObject) => {
  const msg = new VulcanMessage(VulcanMessage.TYPE_PREFIX + id, null, null);
  const msgStr = JSON.stringify(msgObj);
  msg.setPayload(msgStr);
  vulcan.dispatchMessage(msg);
};

export const vulcanListen = (id: string, callback: Function) => {
  vulcan.addMessageListener(
    VulcanMessage.TYPE_PREFIX + id,
    (res: any) => {
      var msgStr = vulcan.getPayload(res);
      const msgObj = JSON.parse(msgStr);
      callback(msgObj);
    },
    null
  );
};

export const posix = (str: string) => str.replace(/\\/g, "/");

export function useScripts() {
  useEffect(() => {
    if (window.cep) {
      const extRoot = csi.getSystemPath("extension");
      const jsxSrc = `${extRoot}/jsx/index.js`;
      const jsxBinSrc = `${extRoot}/jsx/index.jsxbin`;
      if (fs.existsSync(jsxSrc)) {
        console.log(jsxSrc);
        evalFile(jsxSrc);
      } else if (fs.existsSync(jsxBinSrc)) {
        console.log(jsxBinSrc);
        evalFile(jsxBinSrc);
      }
    }
  }, []);
}
