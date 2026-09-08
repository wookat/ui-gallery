// node tools/shoot.mjs <screen> [--build]
// 1440/375 × 亮/暗 × 状态（src/pages/<screen>/shots.json，默认 ?state=default|loading|empty|error）
// 条目可选 `viewports: ["tablet", "tabletSm"]`：附加在 1024/768 视口截图（仅该条目），与 hifi ref 的 tablet-*/tabletSm-* 基准配对。
// 输出 shots/reference/<screen>/<viewport>-<theme>-<name>.png，命名与 design/hifi/<screen>/ref 一致，供 compare.mjs 配对。
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium, extraViewports, openPage, pageUrl, screenArg, serveDist, settle, shotList, shotsRoot, themes, viewports } from "./_shared.mjs";

const screen = screenArg();
const list = shotList(screen);
const out = join(shotsRoot, screen);
mkdirSync(out, { recursive: true });

const { origin, close } = await serveDist();
const browser = await chromium.launch();
let n = 0;
const errors = [];
for (const [vpName, vp] of [...Object.entries(viewports), ...Object.entries(extraViewports)]) {
  // 无 viewports 字段 = 默认 desktop+mobile；有则为完整清单
  const items = list.filter((s) => (s.viewports ? s.viewports.includes(vpName) : vpName in viewports));
  if (!items.length) continue;
  for (const theme of themes) {
    const { ctx, page, errors: errs } = await openPage(browser, vp, theme);
    for (const { name, query, overlay, scrollTo } of items) {
      await page.goto(pageUrl(origin, screen, query, theme), { waitUntil: "networkidle" });
      await settle(page);
      if (scrollTo) {
        await page.locator(scrollTo).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
        await page.waitForTimeout(200);
      }
      // 仅 overlay 条目：?open= 程序化打开浮层时 Radix 自动聚焦首项会带出 :focus-visible 焦点环，hifi ref 无此环，截图前移开焦点
      //（不影响 a11y.mjs 的键盘检查）。非 overlay 页面不 blur——表单页 autoFocus 的输入框被 blur 会触发 onBlur 校验，与 ref 不符
      if (overlay) {
        await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined));
      }
      // 浮层（fixed 抽屉/菜单/Toast）截视口；其余整页
      await page.screenshot({ path: join(out, `${vpName}-${theme}-${name}.png`), fullPage: !overlay });
      n++;
    }
    if (errs.length) errors.push(`${vpName}/${theme}: ${errs.join(" | ")}`);
    await ctx.close();
  }
}
await browser.close();
close();
console.log(`shot ${n} → ${out}`);
if (errors.length) {
  console.error(`console error ${errors.length}:\n${errors.join("\n")}`);
  process.exit(1);
}
