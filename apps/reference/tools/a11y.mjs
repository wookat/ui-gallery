// node tools/a11y.mjs <screen> [--build]
// 每个 视口 × 主题 × 状态：axe-core（wcag2a/aa：对比度等）+ 热区 ≥ tokens.size.hit + 键盘焦点环可见
// + 375 下 scrollWidth ≤ 375 + console error = 0。任一失败退出码 1。
import { createRequire } from "node:module";
import { hitMin, launch, openPage, pageUrl, screenArg, serveDist, settle, shotList, themes, viewports } from "./_shared.mjs";

const axeSource = createRequire(import.meta.url)("axe-core").source;
const screen = screenArg();
const list = shotList(screen);
const fails = [];
const ok = (cond, msg) => {
  if (!cond) fails.push(msg);
  console.log(`${cond ? "PASS" : "FAIL"} ${msg}`);
};

const { origin, close } = await serveDist();
const browser = await launch();
for (const [vpName, vp] of Object.entries(viewports)) {
  for (const theme of themes) {
    const { ctx, page, errors } = await openPage(browser, vp, theme);
    for (const { name, query } of list) {
      const tag = `${vpName}/${theme}/${name}`;
      await page.goto(pageUrl(origin, screen, query, theme), { waitUntil: "networkidle" });
      await settle(page);
      await page.addScriptTag({ content: axeSource });
      const axe = await page.evaluate(async () =>
        window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"] },
          rules: { region: { enabled: false } },
        }),
      );
      const serious = axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      ok(
        serious.length === 0,
        `${tag} axe serious/critical = ${serious.length}${serious.map((v) => `\n     - ${v.id}: ${v.nodes.length} 处 e.g. ${v.nodes[0].target.join(" ")}`).join("")}`,
      );
      const minor = axe.violations.filter((v) => !(v.impact === "serious" || v.impact === "critical"));
      if (minor.length) console.log(`     info: axe minor/moderate ${minor.map((v) => `${v.id}(${v.nodes.length})`).join(", ")}`);

      // 热区：盒子 ≥ hit 直接通过；否则以元素中心为准，用 elementFromPoint 实测 hit×hit 范围四边是否仍命中该控件
      // （伪元素撑出的热区、包裹它的 label 都算命中；被浮层盖住的控件跳过；
      //   scrollIntoView 后等两帧再取点，让 position:fixed 的浮层（Radix Popover autoUpdate）随锚点重定位，量到的是真实布局而非滚动瞬间）
      const m = await page.evaluate(async (min) => {
        const nextFrames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const vis = (el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && !el.closest("[hidden],[aria-hidden='true']");
        };
        const small = [];
        for (const el of document.querySelectorAll("a[href], button, [role='tab'], [role='menuitem'], [role='checkbox'], [role='switch'], input:not([type=hidden])")) {
          if (!vis(el) || el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") continue;
          let r = el.getBoundingClientRect();
          if (r.width + 0.5 >= min && r.height + 0.5 >= min) continue;
          el.scrollIntoView({ block: "center", inline: "nearest" });
          await nextFrames();
          r = el.getBoundingClientRect();
          const owner = el.closest("label") || el;
          const hits = (x, y) => {
            const t = document.elementFromPoint(x, y);
            return Boolean(t && owner.contains(t));
          };
          const cx = (r.left + r.right) / 2;
          const cy = (r.top + r.bottom) / 2;
          if (!hits(cx, cy)) continue;
          const d = min / 2 - 1;
          const okHit = hits(cx, cy - d) && hits(cx, cy + d) && hits(cx - d, cy) && hits(cx + d, cy);
          if (!okHit)
            small.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.getAttribute("aria-label") || el.textContent).trim().slice(0, 14)}"`);
        }
        window.scrollTo(0, 0);
        return { sw: document.documentElement.scrollWidth, small };
      }, hitMin);
      ok(m.sw <= vp.width, `${tag} scrollWidth ${m.sw} ≤ ${vp.width}`);
      ok(m.small.length === 0, `${tag} 热区 ≥ ${hitMin}×${hitMin}（${m.small.length} 处不足）${m.small.slice(0, 6).map((s) => "\n     - " + s).join("")}`);

      // 键盘焦点：Tab 前 N 个可聚焦元素，焦点环（outline 或 box-shadow）必须可见；菜单项按 APG 用 data-highlighted 高亮
      await page.mouse.click(1, 1);
      const noRing = [];
      let tabs = 0;
      const seen = new Set();
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        const f = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const ring =
            (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
            cs.boxShadow !== "none" ||
            (el.getAttribute("role") === "menuitem" && el.hasAttribute("data-highlighted"));
          return { key: `${el.tagName}#${el.id}.${el.className}`, ring, label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 14) };
        });
        if (!f || seen.has(f.key + f.label)) break;
        seen.add(f.key + f.label);
        tabs++;
        if (!f.ring) noRing.push(`${f.key.split(".")[0]} "${f.label}"`);
      }
      ok(tabs > 0 && noRing.length === 0, `${tag} 键盘可达 ${tabs} 个元素，焦点环缺失 ${noRing.length}${noRing.slice(0, 6).map((s) => "\n     - " + s).join("")}`);
    }
    ok(errors.length === 0, `${vpName}/${theme} console error = ${errors.length}${errors.slice(0, 3).map((e) => "\n     - " + e).join("")}`);
    await ctx.close();
  }
}
await browser.close();
close();
console.log(fails.length ? `\n${fails.length} FAIL` : "\nALL PASS");
process.exit(fails.length ? 1 : 0);
