import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseNotes: string;
  apkUrl: string | null;
  releaseUrl: string;
  publishedAt: string;
}

const DEFAULT_REPO = "shakhawathossain/radiobd";
const FALLBACK_VERSION = "1.0.0";

export const getAppVersion = async (): Promise<string> => {
  if (Capacitor.isNativePlatform()) {
    try {
      const info = await App.getInfo();
      return info.version || FALLBACK_VERSION;
    } catch {
      return FALLBACK_VERSION;
    }
  }
  return FALLBACK_VERSION;
};

// Compare two semver strings: returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
export const compareVersions = (v1: string, v2: string): number => {
  const clean1 = v1.replace(/^v/i, "").trim().split(".").map(Number);
  const clean2 = v2.replace(/^v/i, "").trim().split(".").map(Number);

  for (let i = 0; i < Math.max(clean1.length, clean2.length); i++) {
    const num1 = clean1[i] || 0;
    const num2 = clean2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
};

export const checkForAppUpdate = async (customRepo?: string): Promise<UpdateInfo | null> => {
  const repo =
    customRepo ||
    (typeof window !== "undefined"
      ? localStorage.getItem("radio_bd_github_repo")
      : null) ||
    process.env.NEXT_PUBLIC_GITHUB_REPO ||
    DEFAULT_REPO;

  try {
    const currentVersion = await getAppVersion();
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const latestVersion = (data.tag_name || data.name || "").replace(/^v/i, "");

    // Check if new version is higher than current version
    const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;

    // Find APK asset in release
    let apkUrl: string | null = null;
    if (Array.isArray(data.assets)) {
      const apkAsset = data.assets.find(
        (asset: { name: string; browser_download_url: string }) =>
          asset.name.toLowerCase().endsWith(".apk")
      );
      if (apkAsset) {
        apkUrl = apkAsset.browser_download_url;
      }
    }

    return {
      hasUpdate,
      currentVersion,
      latestVersion,
      releaseNotes: data.body || "Performance improvements and bug fixes.",
      apkUrl: apkUrl || data.html_url,
      releaseUrl: data.html_url,
      publishedAt: data.published_at || new Date().toISOString(),
    };
  } catch (error) {
    console.warn("Update check failed:", error);
    return null;
  }
};

export const installUpdate = async (downloadUrl: string): Promise<void> => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url: downloadUrl });
    } else {
      window.open(downloadUrl, "_blank");
    }
  } catch (err) {
    console.error("Failed to open update URL:", err);
    window.location.href = downloadUrl;
  }
};
