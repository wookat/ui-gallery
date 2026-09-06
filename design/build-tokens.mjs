// 阶段 2：从 design/tokens.json（W3C DTCG）生成 design/tokens.css。
// 输出：:root 全量 CSS 变量；[data-theme=dark] 与 prefers-color-scheme: dark（未显式 data-theme=light 时）覆盖有暗色值的变量；
//       prefers-reduced-motion: reduce 下 motion.* 组的 duration 置 0（timing.* 组为行为时长，不归零）。
// 变量名 = token 路径以 - 连接并加前缀 --，如 {color.role.bg} → --color-role-bg，{font.size.sm} → --font-size-sm。
// 用法：node design/build-tokens.mjs   （仓库根或任意目录执行；同时被 check-contrast.mjs 作为库导入）
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = new URL(".", import.meta.url);
export const TOKENS_JSON = fileURLToPath(new URL("tokens.json", here));
export const TOKENS_CSS = fileURLToPath(new URL("tokens.css", here));

const ALIAS = /^\{([^}]+)\}$/;

/** 把 DTCG 树摊平为 Map<path, {type, value, dark}>；$type 沿组继承。 */
export function flatten(tree) {
  const out = new Map();
  const walk = (node, path, inheritedType) => {
    const type = node.$type ?? inheritedType;
    if (Object.hasOwn(node, "$value")) {
      out.set(path.join("."), {
        type,
        value: node.$value,
        dark: node.$extensions?.modes?.dark,
        description: node.$description ?? "",
      });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$") || typeof v !== "object" || v === null) continue;
      walk(v, [...path, k], type);
    }
  };
  walk(tree, [], undefined);
  return out;
}

/** 按模式解析 token 的最终值（递归解析别名与复合值内的别名）。 */
export function resolve(tokens, path, mode = "light", seen = new Set()) {
  const t = tokens.get(path);
  if (!t) throw new Error(`未知 token: {${path}}`);
  if (seen.has(path)) throw new Error(`别名循环: ${[...seen, path].join(" → ")}`);
  const raw = mode === "dark" && t.dark !== undefined ? t.dark : t.value;
  return resolveValue(tokens, raw, mode, new Set([...seen, path]));
}

function resolveValue(tokens, raw, mode, seen) {
  if (typeof raw === "string") {
    const m = raw.match(ALIAS);
    return m ? resolve(tokens, m[1], mode, seen) : raw;
  }
  if (Array.isArray(raw)) return raw.map((v) => resolveValue(tokens, v, mode, seen));
  if (raw && typeof raw === "object") {
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, resolveValue(tokens, v, mode, seen)]));
  }
  return raw;
}

export const varName = (path) => `--${path.replaceAll(".", "-")}`;

const dim = (d) => (d.value === 0 ? "0" : `${d.value}${d.unit}`);

/** 把已解析的值格式化为 CSS。typography 复合值返回多条声明。 */
export function toCss(type, v) {
  switch (type) {
    case "color":
      return String(v).toLowerCase();
    case "dimension":
      return dim(v);
    case "number":
    case "fontWeight":
      return String(v);
    case "duration":
      return `${v.value}${v.unit}`;
    case "cubicBezier":
      return `cubic-bezier(${v.join(", ")})`;
    case "fontFamily":
      return (Array.isArray(v) ? v : [v]).map((f) => (/[^a-z-]/i.test(f) ? `"${f}"` : f)).join(", ");
    case "shadow": {
      const list = Array.isArray(v) ? v : [v];
      return list.map((s) => `${dim(s.offsetX)} ${dim(s.offsetY)} ${dim(s.blur)} ${dim(s.spread)} ${String(s.color).toLowerCase()}`).join(", ");
    }
    case "typography":
      return `${v.fontWeight} ${dim(v.fontSize)}/${v.lineHeight} ${toCss("fontFamily", v.fontFamily)}`;
    default:
      throw new Error(`不支持的 $type: ${type}`);
  }
}

/** 生成某模式下全部声明 [[name, cssValue], ...]（typography 额外产出 -letter-spacing）。 */
export function declarations(tokens, mode) {
  const decls = [];
  for (const [path, t] of tokens) {
    const v = resolve(tokens, path, mode);
    decls.push([varName(path), toCss(t.type, v)]);
    if (t.type === "typography" && v.letterSpacing) decls.push([`${varName(path)}-letter-spacing`, dim(v.letterSpacing)]);
  }
  return decls;
}

export function buildCss(tokens) {
  const light = declarations(tokens, "light");
  const darkAll = declarations(tokens, "dark");
  const lightMap = new Map(light);
  const dark = darkAll.filter(([name, value]) => lightMap.get(name) !== value);
  const durations = [...tokens].filter(([p, t]) => t.type === "duration" && p.startsWith("motion.")).map(([p]) => [varName(p), "0ms"]);

  const block = (selector, decls, indent = "") =>
    `${indent}${selector} {\n${decls.map(([n, v]) => `${indent}  ${n}: ${v};`).join("\n")}\n${indent}}`;

  return [
    "/* 由 design/build-tokens.mjs 从 design/tokens.json 生成，请勿手改；改令牌请改 tokens.json 后重新生成。 */",
    "/* 主题：默认亮色；<html data-theme=\"dark\"> 或系统深色（且未显式 data-theme=\"light\"）为暗色。 */",
    block(":root", light),
    block("[data-theme=\"dark\"]", dark),
    `@media (prefers-color-scheme: dark) {\n${block(":root:not([data-theme=\"light\"])", dark, "  ")}\n}`,
    `@media (prefers-reduced-motion: reduce) {\n${block(":root", durations, "  ")}\n}`,
    "",
  ].join("\n\n");
}

export function loadTokens(file = TOKENS_JSON) {
  return flatten(JSON.parse(readFileSync(file, "utf8")));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const tokens = loadTokens();
  const css = buildCss(tokens);
  writeFileSync(TOKENS_CSS, css);
  const darkCount = (css.match(/^\[data-theme="dark"\] \{\n([\s\S]*?)\n\}/m)?.[1].split("\n").length) ?? 0;
  console.log(`tokens: ${tokens.size} 个 → ${TOKENS_CSS}（暗色覆盖 ${darkCount} 个变量）`);
}
