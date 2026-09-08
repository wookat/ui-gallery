// 阶段 1 门禁：用 Playwright（tools/shoot 的 1.62.1）打开每个线框 × 状态，1440×900 与 375×812 截图到 shots/wireframes/（不入库），
// 断言 375 下 document.documentElement.scrollWidth <= 375，无 console error，且全部元素的 color / background / border / outline / fill / stroke 均为灰阶（r=g=b）、无图片。
// 第 2 轮追加 6 屏（orders / form / settings / components / landing / chat）：状态项可写完整查询串（以 ? 开头）；对若干屏另断言页面文本含 mock 复算出的关键数字（见 textAsserts）。
// 用法：node design/wireframes/check.mjs [screen…]   （仓库根执行；先 pnpm install --filter @ui-gallery/shoot）
import { chromium } from "../../tools/shoot/node_modules/playwright/index.mjs";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("../../", import.meta.url).pathname;
const out = join(root, "shots", "wireframes");
mkdirSync(out, { recursive: true });

const screens = {
  login: ["default", "invalid", "loading", "error"],
  dashboard: ["success", "loading", "empty", "error", "success&toast=login"],
  orders: [
    "?state=success", "?state=loading", "?state=empty-filtered", "?state=empty-new", "?state=error",
    "?open=drawer", "?open=dialog-cancel", "?open=dialog-delete", "?open=filter-sheet",
    "?toast=cancelled", "?toast=deleted", "?toast=shipped", "?toast=copied", "?toast=export",
  ],
  form: [
    "?step=1", "?step=2", "?step=3", "?step=1&state=invalid", "?step=2&state=invalid", "?step=3&state=loading",
    "?state=success", "?step=3&state=error", "?step=3&open=terms", "?open=leave", "?open=supplier", "?step=2&open=sku",
  ],
  settings: [
    "?tab=profile", "?tab=security", "?tab=notifications", "?tab=team", "?tab=billing",
    "?tab=profile&state=saving", "?tab=profile&state=saved", "?tab=profile&state=error",
    "?tab=security&state=empty", "?tab=team&state=empty", "?tab=billing&state=empty", "?tab=notifications&state=empty",
    "?tab=security&open=2fa", "?tab=security&open=2fa-disable", "?tab=team&open=remove", "?tab=team&open=danger", "?tab=profile&open=leave",
    "?tab=billing&cycle=monthly", "?tab=billing&cycle=yearly",
  ],
  components: ["?theme=light", "?theme=dark", "?theme=system", "?open=code", "?from=kitchen-sink"],
  landing: ["?state=default", "?state=scrolled", "?cycle=monthly", "?cycle=yearly", "?open=menu", "?theme=dark"],
  chat: [
    "?state=empty", "?state=loading", "?state=streaming&conversation=c_1", "?state=success&conversation=c_1", "?state=error&conversation=c_1",
    "?conversation=c_2", "?conversation=c_3", "?conversation=c_4", "?conversation=c_5", "?conversation=c_6", "?conversation=c_7",
    "?open=sidebar", "?open=delete&conversation=c_3", "?conversation=c_2&toast=urgent",
  ],
};
const viewports = { 1440: [1440, 900], 375: [375, 812] };

// 关键数字由 mock 复算，页面文本必须含这些字面（只在列出的状态上断言）
const mock = (f) => JSON.parse(readFileSync(join(root, "mock", f), "utf8"));
const fmt = (n) => n.toLocaleString("en-US");
const skus = mock("skus.json").items;
const stockout = skus.filter((s) => s.weekStockoutOrders);
const summary = mock("orders-summary.json");
const month = mock("series.json").month.points;
const d0903 = month.find((p) => p.date === "2026-09-03");
const d0902 = month.find((p) => p.date === "2026-09-02");
const draft = mock("purchase-form.json").draft;
const subtotal = draft.items.reduce((a, i) => a + i.qty * i.unitPrice, 0);
const plans = mock("settings.json").billing.plans;
const textAsserts = {
  "orders?state=success": [`${fmt(summary.total)}`, `${summary.byStatus.pending_shipment}`],
  "form?step=2": [`¥${fmt(subtotal)}.00`, draft.poNumber],
  "form?step=3": [`¥${fmt(subtotal)}.00`],
  "settings?tab=billing&cycle=yearly": plans.map((p) => `¥${fmt(p.yearly)}`),
  "settings?tab=billing&cycle=monthly": plans.map((p) => `¥${fmt(p.monthly)}`),
  "landing?cycle=yearly": plans.map((p) => `¥${fmt(p.yearly)}`),
  "landing?cycle=monthly": plans.map((p) => `¥${fmt(p.monthly)}`),
  "chat?state=success&conversation=c_1": [
    `${stockout.reduce((a, s) => a + s.weekStockoutOrders, 0)} 单`, `${stockout.length} 个 SKU`,
    ...stockout.map((s) => s.sku),
  ],
  "chat?conversation=c_4": [`¥${fmt(d0903.gmv)}`, `${d0903.orders} 单`, `¥${fmt(d0902.gmv)}`, `${d0902.orders} 单`],
};

const only = process.argv.slice(2);
const browser = await chromium.launch();
let fail = 0;
for (const [screen, states] of Object.entries(screens)) {
  if (only.length && !only.includes(screen)) continue;
  for (const [vp, [width, height]] of Object.entries(viewports)) {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const state of states) {
      const query = state.startsWith("?") ? state : `?state=${state}`;
      const url = pathToFileURL(join(root, "design/wireframes", `${screen}.html`)).href + query;
      await page.goto(url, { waitUntil: "load" });
      const name = `${screen}-${query.slice(1).replace(/[^a-z0-9]+/g, "-")}-${vp}.png`;
      await page.screenshot({ path: join(out, name), fullPage: true });
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      const bodySw = await page.evaluate(() => document.body.scrollWidth);
      const chroma = await page.evaluate(() => {
        const props = ["color", "background-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "outline-color", "fill", "stroke", "background-image"];
        const bad = [];
        for (const el of document.querySelectorAll("*")) {
          const cs = getComputedStyle(el);
          for (const p of props) {
            const v = cs.getPropertyValue(p);
            if (p === "background-image") {
              if (v !== "none" && /url\(/.test(v)) bad.push(`${el.tagName.toLowerCase()} ${p}=${v}`);
              continue;
            }
            const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (m && !(m[1] === m[2] && m[2] === m[3])) bad.push(`${el.tagName.toLowerCase()} ${p}=${v}`);
          }
        }
        return [...new Set(bad)].slice(0, 5);
      });
      const imgs = await page.evaluate(() => document.querySelectorAll("img, picture, video, canvas").length);
      const text = await page.evaluate(() => document.body.textContent);
      const missing = (textAsserts[`${screen}${query}`] || []).filter((t) => !text.includes(t));
      const ok = sw <= width && bodySw <= width && errors.length === 0 && chroma.length === 0 && imgs === 0 && missing.length === 0;
      if (!ok) fail++;
      console.log(`${ok ? "ok  " : "FAIL"} ${name.padEnd(56)} scrollWidth=${sw}/${bodySw} (viewport ${width}) errors=${errors.length} chroma=${chroma.length} img=${imgs}`);
      if (chroma.length) console.log("     non-gray:", chroma.join(" | "));
      if (errors.length) console.log("     errors:", errors.slice(0, 3).join(" | "));
      if (missing.length) console.log("     missing text:", missing.join(" | "));
    }
    await ctx.close();
  }
}
await browser.close();
console.log(fail ? `\n${fail} FAIL` : "\nwireframes ok");
process.exit(fail ? 1 : 0);
