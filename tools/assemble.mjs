// Assemble final static site: dist/ = gallery, dist/apps/<slug>/ = each app, dist/shots/ = screenshots, dist/manifest.json
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
const root = new URL("../", import.meta.url).pathname;
const dist = join(root, "dist");
rmSync(dist, { recursive: true, force: true });
cpSync(join(root, "gallery/dist"), dist, { recursive: true });
const manifest = [];
for (const slug of readdirSync(join(root, "apps"))) {
  const app = join(root, "apps", slug);
  if (!existsSync(join(app, "dist/index.html"))) continue;
  cpSync(join(app, "dist"), join(dist, "apps", slug), { recursive: true });
  if (existsSync(join(root, "shots", slug))) cpSync(join(root, "shots", slug), join(dist, "shots", slug), { recursive: true });
  manifest.push(JSON.parse(readFileSync(join(app, "gallery.json"), "utf8")));
}
mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`assembled ${manifest.length} apps`);
