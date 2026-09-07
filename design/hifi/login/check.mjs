// 阶段 3 门禁 + 基准图：design/hifi/login
//   node design/hifi/login/check.mjs          → 静态检查 + Playwright 截基准图到 ref/ + 运行时检查
//   node design/hifi/login/check.mjs --static → 只跑静态检查
// 依赖：pnpm install --filter @ui-gallery/shoot（playwright 1.62.1）+ playwright install chromium；字体走 CDN，需联网
//   （回退系统字体会与 ref/ 失配，直接判 FAIL）。
// 截图：7 态 × {desktop 1440×900, mobile 375×812} × {light, dark} = 28 张 ref/{vp}-{theme}-{state}.png（入库）。
// 断言：
//   静态：页面 CSS 无硬编码色值 / px / 字号 / rgb()、@media 断点 ⊂ tokens.breakpoint、标记内无 inline style、无 lorem/占位、
//         引用 ../../tokens.css、所有 data-key 文案与 content/login.md 一致、演示账号与 mock/user.json 一致。
//   每张：scrollWidth ≤ 视口、无元素超出右缘、无 console/pageerror、可见可点元素热区 ≥ 40×40、PNG < 300KB、令牌字体已加载。
//   每态（1440 亮/暗）：可见文字对比度 ≥ 4.5:1（display 级大字 ≥ 3:1）；fg-disabled 只出现在 :disabled / aria-hidden 上（tokens ef05fe8 契约）。
//   交互：默认焦点、Tab 序列、焦点环 2px、眼睛按钮切换、error 态焦点落 Alert、Alert/Toast 可关闭、aria-disabled 链接不跳转。
//   节奏 / 层级 / 极值：块间距为 8 的倍数、h1 > 副标题 > 辅助文字、375 下长邮箱 / 长 Alert / Toast 不溢出、记住我与忘记密码同排不重叠。
import { chromium } from "../../../tools/shoot/node_modules/playwright/index.mjs";
import { mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("../../../", import.meta.url).pathname;
const dir = join(root, "design/hifi/login");
const out = join(dir, "ref");
mkdirSync(out, { recursive: true });
const html = readFileSync(join(dir, "index.html"), "utf8");
const fileUrl = pathToFileURL(join(dir, "index.html")).href;

const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); console.log(`${cond ? "PASS" : "FAIL"} ${msg}`); };

// ---------- 静态检查 ----------
const styleBlock = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const cssNoMedia = styleBlock.replace(/@media[^{]*\{/g, "@media{");
const hexInCss = cssNoMedia.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
ok(hexInCss.length === 0, `页面 CSS 无硬编码色值（${hexInCss.length} 处）${hexInCss.length ? ": " + hexInCss.join(",") : ""}`);
const pxInCss = cssNoMedia.match(/-?\d*\.?\d+px/g) || [];
ok(pxInCss.length === 0, `页面 CSS 无 px 字面量（@media 条件除外，${pxInCss.length} 处）${pxInCss.length ? ": " + pxInCss.join(",") : ""}`);
const fontLit = cssNoMedia.match(/font(-size)?:\s*(?!var\(|inherit)\S/g) || [];
ok(fontLit.length === 0, `页面 CSS 无字面字号（${fontLit.length} 处）`);
const rgbInCss = cssNoMedia.match(/\b(rgb|rgba|hsla?)\((?!var)[^)]*\)/g) || [];
ok(rgbInCss.length === 0, `页面 CSS 无 rgb()/字面 hsl()（${rgbInCss.length} 处）`);
const mediaPx = [...styleBlock.matchAll(/@media[^{]*?(\d+)px/g)].map((m) => +m[1]);
const tokens = JSON.parse(readFileSync(join(root, "design/tokens.json"), "utf8"));
const bpVals = Object.values(tokens.breakpoint).filter((b) => b && b.$value).map((b) => b.$value.value);
ok(mediaPx.length > 0 && mediaPx.every((v) => bpVals.includes(v)), `@media 断点仅用 tokens.breakpoint（${[...new Set(mediaPx)].join(",")} ⊂ ${bpVals.join(",")}）`);
const bodyHtml = html.replace(/<style>[\s\S]*?<\/style>/, "").replace(/<script[\s\S]*?<\/script>/g, "");
const inlineStyle = bodyHtml.match(/style="[^"]*"/g) || [];
ok(inlineStyle.length === 0, `标记内无 inline style（${inlineStyle.length} 处）`);
ok(!/lorem|ipsum|placeholder\.com|via\.placeholder|unsplash|张三|李四/i.test(html), "无 lorem ipsum / 占位图 / 占位人名");
ok(html.includes('href="../../tokens.css"'), "引用 ../../tokens.css");

// content/login.md：两张表（页面：key|文案|说明；校验与反馈：key|触发|文案|呈现）→ key → 文案
const content = {};
for (const line of readFileSync(join(root, "content/login.md"), "utf8").split("\n")) {
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length < 5 || cells[1] === "key" || !/^[a-z][\w.]*$/.test(cells[1])) continue;
  content[cells[1]] = cells.length >= 6 ? cells[3] : cells[2];
}
const user = JSON.parse(readFileSync(join(root, "mock/user.json"), "utf8"));
for (const [key, text] of Object.entries(content)) {
  if (/^error\.(email|password)\.required$/.test(key)) continue; // 复用 .err 形态，仅文案不同（见 index.html 头注）
  ok(html.includes(text), `文案「${text}」（${key}）来自 content/login.md`);
}
ok(html.includes(user.demoCredentials.email) && html.includes(user.demoCredentials.lockedEmail), "演示账号 / 锁定账号取自 mock/user.json.demoCredentials");
ok(html.includes(`欢迎回来，${user.shortName}`), `Toast 称呼「${user.shortName}」取自 mock/user.json.shortName`);

if (process.argv.includes("--static")) finish();

// ---------- Playwright：截图 + 每张运行时检查 ----------
const states = {
  default: "state=default",
  invalid: "state=invalid",
  loading: "state=loading",
  error: "state=error",
  "error-locked": "state=error&alert=locked",
  "error-network": "state=error&alert=network",
  success: "state=success",
};
const viewports = { desktop: [1440, 900], mobile: [375, 812] };
const themes = ["light", "dark"];
const HIT = 40;
const MAX_BYTES = 300 * 1024;
// document.fonts.check() 对未声明 @font-face 的字体也返回 true（CDN CSS 没加到时会假阳性），所以直接查 FontFaceSet 里有无已加载的同名 face
const FONTS = ["Inter Variable", "Noto Sans SC Variable"];

const gotoState = async (page, query, theme) => {
  await page.goto(`${fileUrl}?${query}&theme=${theme}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
};

const browser = await chromium.launch();
let shots = 0;
for (const [vp, [width, height]] of Object.entries(viewports)) {
  for (const theme of themes) {
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const [state, query] of Object.entries(states)) {
      await gotoState(page, query, theme);
      const name = `${vp}-${theme}-${state}.png`;
      const file = join(out, name);
      await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
      shots++;
      const m = await page.evaluate(({ hit, fonts, w }) => {
        const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/^["']|["']$/g, ""));
        const missingFonts = fonts.filter((f) => !loaded.includes(f));
        const vis = (el) => { const cs = getComputedStyle(el); return cs.display !== "none" && cs.visibility !== "hidden" && el.getClientRects().length > 0; };
        const smallHits = [...document.querySelectorAll("a, button, input, [role=button]")].filter(vis)
          .map((el) => {
            // 复选框：原生 input 覆盖整个 label 热区，量 label
            const box = (el.matches("input[type=checkbox]") ? el.closest("label") || el : el).getBoundingClientRect();
            return { tag: el.tagName.toLowerCase(), text: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 20), w: Math.round(box.width), h: Math.round(box.height) };
          })
          .filter((b) => b.w < hit || b.h < hit);
        const overflow = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > w + 0.5 && vis(el)) overflow.push(`${el.tagName.toLowerCase()}.${[...el.classList].join(".")} right=${Math.round(r.right)}`);
        }
        return {
          sw: document.documentElement.scrollWidth, bodySw: document.body.scrollWidth, smallHits, missingFonts, overflow: overflow.slice(0, 5),
          theme: document.documentElement.getAttribute("data-theme"), state: document.documentElement.getAttribute("data-state"),
        };
      }, { hit: HIT, fonts: FONTS, w: width });
      const bytes = statSync(file).size;
      ok(m.sw <= width && m.bodySw <= width, `${name}: scrollWidth=${m.sw}/${m.bodySw} ≤ ${width}`);
      ok(m.overflow.length === 0, `${name}: 无元素超出视口右缘${m.overflow.length ? " → " + m.overflow.join(" | ") : ""}`);
      ok(m.smallHits.length === 0, `${name}: 可点元素热区 ≥40×40${m.smallHits.length ? " → " + JSON.stringify(m.smallHits) : ""}`);
      ok(m.theme === theme && m.state === query.match(/state=(\w+)/)[1], `${name}: data-theme/data-state 正确`);
      ok(bytes < MAX_BYTES, `${name}: ${(bytes / 1024).toFixed(0)}KB < 300KB`);
      ok(m.missingFonts.length === 0, `${name}: 令牌字体已加载${m.missingFonts.length ? "（缺 " + m.missingFonts.join(" | ") + "，需联网加载 CDN 字体）" : ""}`);
      ok(errors.length === 0, `${name}: console error = ${errors.length}${errors.length ? " → " + errors.slice(0, 3).join(" | ") : ""}`);
      errors.length = 0;
    }
    await ctx.close();
  }
}

// ---------- 对比度 + fg-disabled 契约（1440，每态 × 亮/暗） ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const theme of themes) {
    for (const [state, query] of Object.entries(states)) {
      await gotoState(page, query, theme);
      const r = await page.evaluate(() => {
        const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; };
        const lum = ({ r, g, b }) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const blend = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
        const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
        const bgOf = (el) => { // 向上找到不透明背景，半透明层叠加
          let acc = null;
          for (let n = el; n; n = n.parentElement) {
            const c = parse(getComputedStyle(n).backgroundColor);
            if (c.a === 0) continue;
            acc = acc ? blend(acc, c) : c;
            if (acc.a >= 1 && c.a >= 1) return acc;
          }
          return acc || { r: 255, g: 255, b: 255, a: 1 };
        };
        const vis = (el) => { const cs = getComputedStyle(el); return cs.display !== "none" && cs.visibility !== "hidden" && el.getClientRects().length > 0 && !el.closest("[aria-hidden=true]"); };
        const hexToRgb = (h) => { h = h.trim().replace("#", ""); return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }; };
        const disabledTok = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue("--color-role-fg-disabled"));
        const isDisabledTok = (c) => { const p = parse(c); return p.r === disabledTok.r && p.g === disabledTok.g && p.b === disabledTok.b; };
        const low = [], focusableDisabledColor = [];
        const label = (el) => `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${[...el.classList].join(".")}`;
        for (const el of document.querySelectorAll("body *")) {
          if (!vis(el)) continue;
          const cs = getComputedStyle(el);
          const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || (el.matches("input") && el.value);
          if (hasText && !el.matches(":disabled")) { // :disabled 不可聚焦控件按契约豁免（页面仍不整体降透明度）
            const big = parseFloat(cs.fontSize) >= 24;
            const rt = ratio(parse(cs.color), bgOf(el));
            if (rt < (big ? 3 : 4.5)) low.push(`${label(el)} "${(el.value || el.textContent).trim().slice(0, 10)}" ${rt.toFixed(2)}:1`);
          }
          if (el.matches("input:not(:disabled)") && el.placeholder && !el.value) {
            const rt = ratio(parse(getComputedStyle(el, "::placeholder").color), bgOf(el));
            if (rt < 4.5) low.push(`${label(el)}::placeholder ${rt.toFixed(2)}:1`);
          }
          const focusable = el.matches("a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex='-1'])");
          if (focusable && isDisabledTok(cs.color)) focusableDisabledColor.push(label(el));
        }
        const ariaDis = [...document.querySelectorAll("[aria-disabled=true]")].filter(vis);
        return { low, focusableDisabledColor, ariaDisFocusable: ariaDis.every((a) => a.tabIndex >= 0), ariaDisCount: ariaDis.length };
      });
      ok(r.low.length === 0, `1440-${theme}-${state}: 可见文字对比度 ≥4.5:1（大字 ≥3:1）${r.low.length ? " → " + r.low.join(" | ") : ""}`);
      ok(r.focusableDisabledColor.length === 0, `1440-${theme}-${state}: 可聚焦元素不用 fg-disabled${r.focusableDisabledColor.length ? " → " + r.focusableDisabledColor.join(" | ") : ""}`);
      ok(r.ariaDisCount > 0 && r.ariaDisFocusable, `1440-${theme}-${state}: ${r.ariaDisCount} 个 aria-disabled 链接保持可聚焦（fg-muted/link，非 fg-disabled）`);
    }
  }
  await page.close();
}

// ---------- 交互 / 键盘（1440 亮色） ----------
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await gotoState(page, states.default, "light");
  ok((await page.evaluate(() => document.activeElement.id)) === "email", "default 态初始焦点 = #email");
  const seq = [];
  for (let i = 0; i < 9; i++) { await page.keyboard.press("Tab"); seq.push(await page.evaluate(() => { const el = document.activeElement; return el.id || el.getAttribute("data-key") || el.tagName.toLowerCase(); })); }
  ok(seq.join(",") === "password,eye,remember,forgot.link,submit,oauth.google,oauth.github,oauth.wechat,signup.link", `Tab 序列（品牌区 brand/footer 在 DOM 前面）= email → ${seq.join(" → ")}`);
  await page.focus("#submit");
  await page.keyboard.press("Shift+Tab"); await page.keyboard.press("Tab"); // 键盘触发 :focus-visible
  const ring = await page.evaluate(() => { const cs = getComputedStyle(document.getElementById("submit")); return [cs.outlineWidth, cs.outlineStyle, cs.outlineOffset]; });
  ok(ring[0] === "2px" && ring[1] === "solid" && ring[2] === "2px", `主按钮 :focus-visible 焦点环 = ${ring.join(" ")}（border.width.focus / focus-offset）`);
  await page.click("#eye");
  const eye = await page.evaluate(() => [document.getElementById("password").type, document.getElementById("eye").getAttribute("aria-pressed"), document.getElementById("eye").getAttribute("aria-label")]);
  ok(eye.join(",") === "text,true,隐藏密码", `眼睛按钮切换 → type=${eye[0]} aria-pressed=${eye[1]} aria-label=${eye[2]}`);
  await page.click('a[data-key="forgot.link"]', { force: true });
  await page.waitForTimeout(100);
  ok(page.url().startsWith(fileUrl), "点击 aria-disabled 链接不离开页面");
  await gotoState(page, states.invalid, "light");
  const inv = await page.evaluate(() => ["email", "password"].map((id) => { const i = document.getElementById(id); return `${i.getAttribute("aria-invalid")}/${document.getElementById(i.getAttribute("aria-describedby")).offsetParent !== null}`; }));
  ok(inv.join(",") === "true/true,true/true", "invalid 态：两字段 aria-invalid + aria-describedby 指向可见的内联错误");
  await gotoState(page, states.error, "light");
  ok((await page.evaluate(() => document.activeElement.id)) === "alert", "error 态焦点落在 Alert（role=alert, tabindex=-1）");
  await page.click("#alert .close");
  ok(await page.isHidden("#alert"), "Alert 可关闭");
  await gotoState(page, states["error-network"], "light");
  const net = await page.evaluate(() => { const a = document.getElementById("alert"); return [a.getAttribute("data-variant"), !document.getElementById("alert-retry").hidden, getComputedStyle(a.querySelector(".icon-warning")).display !== "none", getComputedStyle(a.querySelector(".icon-danger")).display === "none"]; });
  ok(net.every(Boolean) && net[0] === "warning", "network 变体：warning 色 + 「重试」按钮 + 图标切换");
  await gotoState(page, states.loading, "light");
  const ld = await page.evaluate(() => { const s = document.getElementById("submit"); return [s.disabled, s.getAttribute("aria-busy"), getComputedStyle(s.querySelector(".spinner")).display, s.querySelector(".label-loading").offsetParent !== null, [...document.querySelectorAll(".oauth .btn")].every((b) => b.disabled), document.getElementById("email").readOnly]; });
  ok(ld[0] && ld[1] === "true" && ld[2] === "block" && ld[3] && ld[4] && ld[5], "loading 态：主按钮 disabled + aria-busy + spinner + 「登录中…」；第三方按钮禁用；字段只读");
  await gotoState(page, states.success, "light");
  ok(await page.isVisible(".toast") && (await page.textContent(".toast")).includes("欢迎回来，若琳"), "success 态 Toast「欢迎回来，若琳」可见");
  await page.click(".toast .close");
  ok(await page.isHidden(".toast"), "Toast 可关闭");

  // 节奏（8pt）与层级
  await gotoState(page, states.default, "light");
  const rhythm = await page.evaluate(() => {
    const q = (s) => document.querySelector(s).getBoundingClientRect();
    const gaps = {
      "卡片内边距→h1": q("h1").top - q(".card").top - document.querySelector(".card").clientTop,
      "副标题→表单": q("form").top - q(".subtitle").bottom,
      "字段→字段": q(".field + .field").top - q(".field").bottom,
      "记住我行→登录按钮": q("#submit").top - q(".row").bottom,
      "登录按钮→分隔线": q(".divider").top - q("#submit").bottom,
      "分隔线→第三方": q(".oauth").top - q(".divider").bottom,
      "第三方按钮间": q(".oauth .btn:nth-child(2)").top - q(".oauth .btn:nth-child(1)").bottom,
      "第三方→注册": q(".signup").top - q(".oauth").bottom,
      "品牌区内边距": q(".brand").top - q(".brand-col").top,
    };
    const fs = (s) => parseFloat(getComputedStyle(document.querySelector(s)).fontSize);
    return { gaps, h1: fs("h1"), sub: fs(".subtitle"), label: fs(".label"), err: fs(".err"), caption: fs(".footer"), display: fs(".tagline"), cardW: q(".card").width, formMax: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--size-form-max")) };
  });
  const off8 = Object.entries(rhythm.gaps).filter(([, v]) => Math.abs(v / 8 - Math.round(v / 8)) > 0.05);
  ok(off8.length === 0, `块间距均为 8 的倍数 ${JSON.stringify(rhythm.gaps)}${off8.length ? " → 非 8 倍数: " + off8.map(([k, v]) => `${k}=${v}`).join(", ") : ""}`);
  ok(rhythm.display > rhythm.h1 && rhythm.h1 > rhythm.sub && rhythm.sub >= rhythm.label && rhythm.label > rhythm.err && rhythm.err === rhythm.caption, `字号层级 tagline ${rhythm.display} > h1 ${rhythm.h1} > 正文 ${rhythm.sub} ≥ 标签 ${rhythm.label} > 辅助 ${rhythm.err}`);
  ok(rhythm.cardW === rhythm.formMax, `1440 表单卡宽 = ${rhythm.cardW}（--size-form-max ${rhythm.formMax}）`);
  await page.close();
}

// ---------- 375 文案极值 ----------
{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const LONG_EMAIL = "ruolin.shen.operations-manager@qimu-home-furnishing-group-shanghai.cn";
  await gotoState(page, states["error-locked"], "light");
  const ext = await page.evaluate((email) => {
    document.getElementById("email").value = email;
    const a = document.getElementById("alert").getBoundingClientRect();
    const p = document.getElementById("alert-text");
    const chk = document.querySelector(".check").getBoundingClientRect(), link = document.querySelector(".row .link").getBoundingClientRect();
    return { doc: document.documentElement.scrollWidth, alertRight: Math.round(a.right), textOverflow: p.scrollWidth > p.clientWidth, rowOk: link.left >= chk.right, sameRow: Math.abs(link.top + link.height / 2 - (chk.top + chk.height / 2)) < 2, inputSw: document.getElementById("email").scrollWidth <= document.getElementById("email").clientWidth + 1 };
  }, LONG_EMAIL);
  ok(ext.doc <= 375 && ext.alertRight <= 375 && !ext.textOverflow, `375 最长 Alert（alert.locked）不溢出（doc=${ext.doc} alertRight=${ext.alertRight}）`);
  ok(ext.rowOk && ext.sameRow, "375 「30 天内记住我」与「忘记密码？」同排且不重叠");
  ok(ext.doc <= 375, `375 长邮箱（${LONG_EMAIL.length} 字符）输入框内滚动、页面不撑破`);
  await gotoState(page, states.success, "light");
  const toast = await page.evaluate(() => { const t = document.querySelector(".toast").getBoundingClientRect(); return { left: Math.round(t.left), right: Math.round(t.right), h: Math.round(t.height) }; });
  ok(toast.left >= 16 && toast.right <= 375 - 16 && toast.h >= 40, `375 Toast 顶部通栏 left=${toast.left} right=${toast.right} h=${toast.h}`);
  await page.close();
}

await browser.close();
const pngs = readdirSync(out).filter((f) => f.endsWith(".png"));
console.log(`\nref/*.png = ${pngs.length} 张（本次新截 ${shots}）`);
finish();

function finish() {
  console.log(`\n${fails.length === 0 ? `hifi/login 全部通过` : `hifi/login 失败 ${fails.length} 项`}`);
  if (fails.length) console.log(fails.map((f) => "  - " + f).join("\n"));
  process.exit(fails.length ? 1 : 0);
}
