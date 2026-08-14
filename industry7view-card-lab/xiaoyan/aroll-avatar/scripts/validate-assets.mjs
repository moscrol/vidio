import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function validateManifest(manifestUrl) {
  const manifestPath = fileURLToPath(manifestUrl);
  const root = path.dirname(manifestPath);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  if (manifest.characterId !== "ar-schema") {
    throw new Error("Unexpected characterId");
  }

  if (!Array.isArray(manifest.assets) || manifest.assets.length !== 5) {
    throw new Error("Expected five avatar assets");
  }

  for (const asset of manifest.assets) {
    if (!asset.id || !asset.path || !asset.usage) {
      throw new Error("Asset entries require id, path, and usage");
    }

    if (!asset.path.endsWith(".png")) {
      throw new Error(`Asset must be PNG: ${asset.path}`);
    }

    await access(path.join(root, asset.path));
  }

  return { ok: true, assets: manifest.assets };
}
