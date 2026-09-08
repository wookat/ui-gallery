// pnpm lint 的一部分：页面/组件层禁止硬编码色值、px 字面量、字面 rgb()/hsl()、任意值中的字号/间距。
// 唯一例外：src/styles/theme.css（令牌 → 主题桥接，本身也只引用 var(--…)）。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const src = resolve(new URL("../src", import.meta.url).pathname);
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(f) && !p.endsWith("styles/theme.css")) files.push(p);
  }
})(src);

const rules = [
  [/(?<![\w&/])#[0-9a-fA-F]{3,8}\b(?![\w-])/g, "十六进制色值"],
  [/\b(rgba?|hsla?|oklch|color-mix)\((?!\s*var\()/g, "字面颜色函数"],
  [/(?<![\w.])\d*\.?\d+(px|rem|em)\b/g, "长度字面量（用令牌工具类或 var(--…)）"],
  [/\[(#|\d*\.?\d+(px|rem|em)|rgb|hsl)/g, "Tailwind 任意值中的色值/长度"],
  [/\b(text|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|w|h|size|rounded|leading|tracking)-\d+(\.\d+)?\b/g, "Tailwind 默认数值刻度（已被 @theme 关闭；用令牌刻度）"],
];
// 默认间距刻度（--spacing-*）保留了 8pt 网格数字：1..12 等已在 theme.css 定义为令牌别名
const spacingAllowed = /\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|w|h|size|space-x|space-y|inset|top|left|right|bottom|-mx|-my)-\d+(\.\d+)?\b/;

const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
const problems = [];
for (const file of files) {
  const text = strip(readFileSync(file, "utf8"));
  text.split("\n").forEach((line, i) => {
    if (/href=|to=|url\(|import |from "/.test(line) && !/className|style=/.test(line)) return;
    for (const [re, why] of rules) {
      for (const m of line.matchAll(re)) {
        if (why.startsWith("Tailwind 默认数值") && spacingAllowed.test(m[0])) continue;
        problems.push(`${relative(src, file)}:${i + 1}  ${why}: ${m[0]}`);
      }
    }
  });
}
if (problems.length) {
  console.error(`no-hardcode: ${problems.length} 处\n` + problems.join("\n"));
  process.exit(1);
}
console.log(`no-hardcode: ${files.length} 个文件通过`);
