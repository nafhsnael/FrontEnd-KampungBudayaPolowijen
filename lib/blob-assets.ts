import blobAssets from "./blob-assets.generated.json";

const assets: Record<string, string> = blobAssets;

export function blobAsset(pathname: string): string {
  return assets[pathname] ?? pathname;
}
