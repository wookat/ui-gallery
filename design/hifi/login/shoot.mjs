// 阶段 3 门禁 + 基准图：用 Playwright（tools/shoot 的 1.62.1）打开 design/hifi/login/index.html 的每个 状态 × 视口 × 主题，
// 截图到 design/hifi/login/ref/{desktop,mobile}-{light,dark}-{state}.png（入库），并断言：
//   375 下 scrollWidth <= 375、无 console error / pageerror、所有可见可点元素热区 >= 40×40、每张 PNG < 300KB、
//   令牌字体 Inter Variable / Noto Sans SC Variable 已加载（CDN，需联网；回退系统字体会与 ref/ 失配，直接判 FAIL）。
// 用法：node design/hifi/login/shoot.mjs   （仓库根执行；先 pnpm install --filter @ui-gallery/shoot）
import { chromium } from "../../../tools/shoot/node_modules/playwright/index.mjs";
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("../../../", import.meta.url).pathname;
const dir = join(root, "design/hifi/login");
const out = join(dir, "ref");
mkdirSync(out, { recursive: true });

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

const browser = await chromium.launch();
let fail = 0;
let shots = 0;
for (const [vp, [width, height]] of Object.entries(viewports)) {
  for (const theme of themes) {
    const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const [state, query] of Object.entries(states)) {
      const url = `${pathToFileURL(join(dir, "index.html")).href}?${query}&theme=${theme}`;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const name = `${vp}-${theme}-${state}.png`;
      const file = join(out, name);
      await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
      shots++;
      const { sw, bodySw, smallHits, missingFonts } = await page.evaluate(({ hit, fonts }) => {
        const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/^["']|["']$/g, ""));
        const missingFonts = fonts.filter((f) => !loaded.includes(f));
        const clickable = [...document.querySelectorAll("a, button, input, [role=button]")].filter((el) => {
          const cs = getComputedStyle(el);
          return cs.display !== "none" && cs.visibility !== "hidden" && el.getClientRects().length > 0;
        });
        const smallHits = clickable
          .map((el) => {
            // 复选框：原生 input 覆盖整个 label 热区，量 label
            const box = (el.matches("input[type=checkbox]") ? el.closest("label") || el : el).getBoundingClientRect();
            return { tag: el.tagName.toLowerCase(), text: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 20), w: Math.round(box.width), h: Math.round(box.height) };
          })
          .filter((b) => b.w < hit || b.h < hit);
        return { sw: document.documentElement.scrollWidth, bodySw: document.body.scrollWidth, smallHits, missingFonts };
      }, { hit: HIT, fonts: FONTS });
      const bytes = statSync(file).size;
      const ok = sw <= width && bodySw <= width && errors.length === 0 && smallHits.length === 0 && bytes < MAX_BYTES && missingFonts.length === 0;
      if (!ok) fail++;
      console.log(
        `${ok ? "ok  " : "FAIL"} ${name.padEnd(34)} scrollWidth=${sw}/${bodySw} (vp ${width}) errors=${errors.length} smallHits=${smallHits.length} size=${(bytes / 1024).toFixed(0)}KB fonts=${missingFonts.length ? "MISSING" : "ok"}`,
      );
      if (missingFonts.length) console.log("     missing fonts (需联网加载 CDN 字体):", missingFonts.join(" | "));
      if (smallHits.length) console.log("     small hits:", JSON.stringify(smallHits));
      if (errors.length) console.log("     errors:", errors.join(" | "));
      errors.length = 0;
    }
    await ctx.close();
  }
}
await browser.close();
console.log(fail ? `\n${fail} FAIL (${shots} shots)` : `\nhifi/login ok (${shots} shots)`);
process.exit(fail ? 1 : 0);
