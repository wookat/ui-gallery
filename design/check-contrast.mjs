// 阶段 2 门禁：实测 design/tokens.json 中所有「前景 role × 背景 role」组合在亮 / 暗两主题下的 WCAG 2.x 对比度。
// 正文（text）≥4.5:1；大字 / 图形 / 控件边界（graphic）≥3:1；头像配方对 0–359 全部色相逐一验证 ≥4.5:1。
// fg-disabled 按 WCAG 1.4.3 例外只报告不判定。任一不达标 → 退出码 1。
// 用法：node design/check-contrast.mjs   （先 node design/build-tokens.mjs 不是必需，本脚本直接读 tokens.json）
import { loadTokens, resolve } from "./build-tokens.mjs";

const tokens = loadTokens();
const MODES = ["light", "dark"];
const SURFACES = ["bg", "surface", "surface-muted", "surface-raised"];
const SOFTS = ["primary-soft", "success-soft", "warning-soft", "danger-soft", "neutral-soft"];

// [前景, 背景] 组合；每组以 role 名书写，脚本自动加 color.role. 前缀（chart.* 除外）。
const TEXT_PAIRS = [
  ...["fg", "fg-muted", "link", "primary", "success", "warning", "danger", "info"].flatMap((fg) => SURFACES.map((bg) => [fg, bg])),
  ...["primary", "primary-hover", "primary-active"].map((bg) => ["on-primary", bg]),
  ["on-primary-soft", "primary-soft"],
  ["success", "success-soft"],
  ["on-success", "success"],
  ["warning", "warning-soft"],
  ["on-warning", "warning"],
  ["danger", "danger-soft"],
  ["on-danger", "danger"],
  ["on-neutral-soft", "neutral-soft"],
  ["fg-inverse", "bg-inverse"],
  ...SOFTS.flatMap((bg) => [["fg", bg], ["fg-muted", bg]]),
];
const GRAPHIC_PAIRS = [
  ...["border-strong", "focus-ring", "primary", "success", "warning", "danger", "info"].flatMap((fg) => ["bg", "surface", "surface-muted"].map((bg) => [fg, bg])),
  ...["chart.1", "chart.2", "chart.3", "chart.4", "chart.5", "chart.line", "chart.bar"].flatMap((fg) => ["bg", "surface"].map((bg) => [fg, bg])),
];
const EXEMPT_PAIRS = [["fg-disabled", "surface"], ["fg-disabled", "bg"]];

const path = (name) => (name.startsWith("chart.") ? `color.${name}` : `color.role.${name}`);

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
}
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: f(0), g: f(8), b: f(4), a: 1 };
}
const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
function luminance({ r, g, b }) {
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
export function contrast(fg, bg) {
  if (bg.a < 1) throw new Error("背景不可带透明度");
  const f = fg.a < 1 ? over(fg, bg) : fg;
  const [hi, lo] = [luminance(f), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const color = (name, mode) => hexToRgb(resolve(tokens, path(name), mode));
const fmt = (n) => n.toFixed(2).padStart(5);

const rows = [];
let fail = 0;
const check = (kind, min, fg, bg, mode, ratio, label = `${fg} / ${bg}`) => {
  const ok = min === 0 || ratio >= min;
  if (!ok) fail++;
  rows.push({ kind, mode, label, ratio, ok, min });
};

for (const mode of MODES) {
  for (const [fg, bg] of TEXT_PAIRS) check("text", 4.5, fg, bg, mode, contrast(color(fg, mode), color(bg, mode)));
  for (const [fg, bg] of GRAPHIC_PAIRS) check("graphic", 3, fg, bg, mode, contrast(color(fg, mode), color(bg, mode)));
  for (const [fg, bg] of EXEMPT_PAIRS) check("exempt", 0, fg, bg, mode, contrast(color(fg, mode), color(bg, mode)));

  const num = (p) => resolve(tokens, `color.avatar.${p}`, mode);
  let worst = { ratio: Infinity, hue: -1 };
  for (let hue = 0; hue < 360; hue++) {
    const ratio = contrast(hslToRgb(hue, num("fg-saturation"), num("fg-lightness")), hslToRgb(hue, num("bg-saturation"), num("bg-lightness")));
    if (ratio < worst.ratio) worst = { ratio, hue };
  }
  check("text", 4.5, "avatar-fg", "avatar-bg", mode, worst.ratio, `avatar fg / bg（360 色相最差 hue=${worst.hue}）`);
}

for (const mode of MODES) {
  console.log(`\n== ${mode} ==`);
  for (const r of rows.filter((r) => r.mode === mode)) {
    const mark = r.kind === "exempt" ? "info" : r.ok ? " ok " : "FAIL";
    console.log(`${mark}  ${fmt(r.ratio)}:1  ${r.kind.padEnd(7)} ${r.label}`);
  }
}

const minOf = (kind) => Math.min(...rows.filter((r) => r.kind === kind).map((r) => r.ratio));
const minText = minOf("text");
const minGraphic = minOf("graphic");
const worstText = rows.filter((r) => r.kind === "text").sort((a, b) => a.ratio - b.ratio)[0];
console.log(`\n组合数：text ${rows.filter((r) => r.kind === "text").length} · graphic ${rows.filter((r) => r.kind === "graphic").length} · exempt ${rows.filter((r) => r.kind === "exempt").length}`);
console.log(`最小正文对比度 min_contrast = ${minText.toFixed(2)}:1（${worstText.mode} ${worstText.label}，门槛 4.5）`);
console.log(`最小图形对比度 = ${minGraphic.toFixed(2)}:1（门槛 3）`);
console.log(fail ? `FAIL：${fail} 组不达标` : "PASS：全部达标");
process.exit(fail ? 1 : 0);
