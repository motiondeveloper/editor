import { useEffect, useState } from "react";
import { version } from "../../../package.json";

export function useUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    async function checkVersion() {
      const latestVersion = await getLatestRelease();

      if (latestVersion && versionIsGreater(latestVersion, version)) {
        setUpdateAvailable(true);
      }
    }
    checkVersion();
  }, []);

  return updateAvailable;
}

async function getLatestRelease() {
  const url = `https://api.github.com/repos/motiondeveloper/editor/releases/latest`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    // TODO: handle api failures
    return;
  }

  const data = await response.json();

  return data.tag_name;
}

function getVersionParts(versionString: string): number[] {
  return versionString.split(".").map((s) => Number(s));
}

function versionIsGreater(versionA: string, versionB: string): boolean {
  const partsA = getVersionParts(versionA);
  const majorA = partsA[0];
  const minorA = partsA[1];
  const patchA = partsA[2];

  const partsB = getVersionParts(versionB);
  const majorB = partsB[0];
  const minorB = partsB[1];
  const patchB = partsB[2];

  if (majorA < majorB) return false;
  if (majorA > majorB) return true;

  if (minorA < minorB) return false;
  if (minorA > minorB) return true;

  if (patchA < patchB || patchA === patchB) return false;

  return true;
}
