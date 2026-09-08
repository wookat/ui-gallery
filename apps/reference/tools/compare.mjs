// node tools/compare.mjs <screen> [--threshold 0.95]
// 把 shots/reference/<screen>/*.png 与 design/hifi/<screen>/ref/ 同名基准做 pixelmatch，
// 输出相似度表与 shots/reference/<screen>/diff/<name>.png；低于阈值退出码 1。
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { repo, screenArg, shotsRoot } from "./_shared.mjs";

const screen = screenArg();
const ti = process.argv.indexOf("--threshold");
const threshold = ti > -1 ? Number(process.argv[ti + 1]) : 0.95;
const refDir = join(repo, "design/hifi", screen, "ref");
const shotDir = join(shotsRoot, screen);
const diffDir = join(shotDir, "diff");
if (!existsSync(refDir)) {
  console.log(`design/hifi/${screen}/ref 不存在（kitchen-sink 等无设计稿的屏幕不做像素对比）`);
  process.exit(0);
}
if (!existsSync(shotDir)) {
  console.error(`先运行 node tools/shoot.mjs ${screen}`);
  process.exit(2);
}
mkdirSync(diffDir, { recursive: true });

const read = (f) => PNG.sync.read(readFileSync(f));
/** 两图尺寸不同时（整页高度不同）按公共区域比较，超出部分计为差异 */
function fit(img, w, h) {
  const out = new PNG({ width: w, height: h });
  out.data.fill(0);
  for (let y = 0; y < Math.min(h, img.height); y++) {
    const row = Math.min(w, img.width) * 4;
    img.data.copy(out.data, y * w * 4, y * img.width * 4, y * img.width * 4 + row);
  }
  return out;
}

const rows = [];
let worst = 1;
for (const f of readdirSync(refDir).filter((f) => f.endsWith(".png")).sort()) {
  const shot = join(shotDir, f);
  if (!existsSync(shot)) {
    rows.push({ name: f, similarity: null, note: "无对应截图（shots.json 未定义该状态）" });
    continue;
  }
  const a = read(join(refDir, f));
  const b = read(shot);
  const w = Math.max(a.width, b.width);
  const h = Math.max(a.height, b.height);
  const A = fit(a, w, h);
  const B = fit(b, w, h);
  const diff = new PNG({ width: w, height: h });
  const bad = pixelmatch(A.data, B.data, diff.data, w, h, { threshold: 0.1, includeAA: true });
  const similarity = 1 - bad / (w * h);
  worst = Math.min(worst, similarity);
  writeFileSync(join(diffDir, f), PNG.sync.write(diff));
  rows.push({ name: f, similarity, size: `${a.width}×${a.height} vs ${b.width}×${b.height}` });
}

const pct = (v) => (v == null ? "  n/a " : `${(v * 100).toFixed(2)}%`);
for (const r of rows) console.log(`${pct(r.similarity)}  ${r.name}${r.size ? "  " + r.size : ""}${r.note ? "  " + r.note : ""}`);
writeFileSync(join(shotDir, "compare.json"), JSON.stringify({ screen, threshold, rows }, null, 1));
const compared = rows.filter((r) => r.similarity != null);
console.log(`\n${compared.length}/${rows.length} 已对比，最低相似度 ${pct(worst)}，阈值 ${pct(threshold)}；diff → ${diffDir}`);
if (compared.length && worst < threshold) process.exit(1);
