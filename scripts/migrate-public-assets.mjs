import { put } from "@vercel/blob";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(projectRoot, "public");
const generatedDirectory = path.join(projectRoot, "lib");
const manifestPath = path.join(generatedDirectory, "blob-assets.generated.json");
const manifestTempPath = `${manifestPath}.tmp`;

const contentTypes = {
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function loadBlobToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return process.env.BLOB_READ_WRITE_TOKEN;
  }

  try {
    const envFile = await readFile(path.join(projectRoot, ".env.local"), "utf8");
    const tokenLine = envFile.match(/^\s*(?:export\s+)?BLOB_READ_WRITE_TOKEN\s*=\s*(.*?)\s*$/m);
    const token = tokenLine?.[1].replace(/^(['"])(.*)\1$/, "$2");

    if (token) return token;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  throw new Error("BLOB_READ_WRITE_TOKEN belum diatur di environment atau .env.local.");
}

async function collectFiles(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath, relativePath)));
    } else if (entry.isFile()) {
      files.push({ absolutePath, relativePath });
    }
  }

  return files;
}

async function main() {
  const token = await loadBlobToken();
  const files = await collectFiles(publicDirectory);

  if (files.length === 0) {
    throw new Error("Folder public/ kosong; tidak ada aset untuk dimigrasikan.");
  }

  const manifest = {};
  const batchSize = 4;

  for (let index = 0; index < files.length; index += batchSize) {
    const batch = files.slice(index, index + batchSize);
    const uploaded = await Promise.all(
      batch.map(async ({ absolutePath, relativePath }) => {
        const pathname = relativePath.split(path.sep).join("/");
        const extension = path.extname(pathname).toLowerCase();
        const blob = await put(
          `static-assets/${pathname}`,
          await readFile(absolutePath),
          {
            access: "public",
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: contentTypes[extension] ?? "application/octet-stream",
            token,
          },
        );

        return [`/${pathname}`, blob.url];
      }),
    );

    for (const [pathname, url] of uploaded) {
      manifest[pathname] = url;
    }
  }

  await mkdir(generatedDirectory, { recursive: true });
  await writeFile(manifestTempPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await rename(manifestTempPath, manifestPath);
  await rm(publicDirectory, { recursive: true });

  console.log(`Migrated ${files.length} assets to Vercel Blob and removed public/.`);
}

main().catch((error) => {
  console.error(`Asset migration failed: ${error.message}`);
  process.exitCode = 1;
});
