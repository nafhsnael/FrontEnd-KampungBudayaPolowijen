import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { getApiErrorMessage } from "../lib/api-error.mjs";
import { serializeJsonLd } from "../lib/json-ld.mjs";

process.env.NODE_ENV = "production";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let nextApp;
let server;
let baseUrl;

before(async () => {
  const nextModule = await import("next");
  const createNext = nextModule.default ?? nextModule;
  nextApp = createNext({ dev: false, dir: projectRoot });
  await nextApp.prepare();

  server = createServer(nextApp.getRequestHandler());
  server.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
  if (nextApp) {
    await nextApp.close();
  }
});

test("unknown paths use the custom 404 and security headers", async () => {
  const response = await fetch(`${baseUrl}/missing-page?secret=do-not-render`);
  const page = await response.text();

  assert.equal(response.status, 404);
  assert.match(page, /Halaman tidak ditemukan/);
  assert.ok(!page.includes("do-not-render"));
  assert.ok(!page.includes("Internal Server Error"));
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'none'/);
});

test("API server errors are replaced with a safe user message", async () => {
  const response = new Response(
    JSON.stringify({ message: "Database password: private-value" }),
    { status: 500, headers: { "Content-Type": "application/json" } },
  );

  assert.equal(
    await getApiErrorMessage(response, "Permintaan gagal. Silakan coba lagi."),
    "Permintaan gagal. Silakan coba lagi.",
  );
});

test("safe client errors can show their validation message", async () => {
  const response = new Response(
    JSON.stringify({ message: "Format email tidak valid." }),
    { status: 400, headers: { "Content-Type": "application/json" } },
  );

  assert.equal(
    await getApiErrorMessage(response, "Permintaan gagal."),
    "Format email tidak valid.",
  );
});

test("public pages expose unique metadata and safe structured data", async () => {
  const [homeResponse, catalogResponse] = await Promise.all([
    fetch(`${baseUrl}/`),
    fetch(`${baseUrl}/umkm`),
  ]);
  const [home, catalog] = await Promise.all([
    homeResponse.text(),
    catalogResponse.text(),
  ]);

  assert.equal(homeResponse.status, 200);
  assert.match(home, /<title>Jelajahi Budaya dan Karya Lokal \| Kampung Budaya Polowijen<\/title>/);
  assert.match(home, /application\/ld\+json/);
  assert.match(home, /"@type":"WebSite"/);
  assert.equal(catalogResponse.status, 200);
  assert.match(catalog, /<title>Produk UMKM Lokal \| Kampung Budaya Polowijen<\/title>/);
  assert.match(catalog, /property="og:description"/);
});

test("private and incomplete routes are marked noindex", async () => {
  for (const route of [
    "/login",
    "/register",
    "/dashboard",
    "/favorite",
    "/umkm/batik-polowijen",
    "/user/dashboard",
  ]) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    assert.equal(response.status, 200, `${route} should remain reachable`);
    assert.match(html, /name="robots" content="noindex, nofollow"/, route);
  }
});

test("robots and sitemap expose only intended public routes", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    fetch(`${baseUrl}/robots.txt`),
    fetch(`${baseUrl}/sitemap.xml`),
  ]);
  const [robots, sitemap] = await Promise.all([
    robotsResponse.text(),
    sitemapResponse.text(),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(robots, /Sitemap: https?:\/\//);
  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemap, /<loc>https?:\/\/[^<]+\/<\/loc>/);
  assert.match(sitemap, /<loc>https?:\/\/[^<]+\/umkm<\/loc>/);
  assert.ok(!sitemap.includes("/dashboard"));
});

test("JSON-LD escapes script-closing characters", () => {
  assert.equal(
    serializeJsonLd({ name: "</script><script>alert(1)</script>" }),
    '{"name":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}',
  );
});
