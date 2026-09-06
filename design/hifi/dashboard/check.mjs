// 阶段 3 门禁：design/hifi/dashboard
//   node design/hifi/dashboard/check.mjs          → 静态检查 + Playwright 截基准图到 ref/ + 运行时检查
//   node design/hifi/dashboard/check.mjs --static → 只跑静态检查
// 依赖：pnpm install --filter @ui-gallery/shoot（playwright）；字体可选：pnpm install --filter shadcn-ui
import { readFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../../..');
const html = readFileSync(join(here, 'index.html'), 'utf8');
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); console.log(`${cond ? 'PASS' : 'FAIL'} ${msg}`); };

// ---------- 静态检查 ----------
const styleBlock = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const cssNoMedia = styleBlock.replace(/@media[^{]*\{/g, '@media{');
const hexInCss = cssNoMedia.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
ok(hexInCss.length === 0, `页面 CSS 无硬编码色值（${hexInCss.length} 处）${hexInCss.length ? ': ' + hexInCss.join(',') : ''}`);
const pxInCss = cssNoMedia.match(/-?\d*\.?\d+px/g) || [];
ok(pxInCss.length === 0, `页面 CSS 无 px 字面量（@media 条件除外，${pxInCss.length} 处）${pxInCss.length ? ': ' + pxInCss.join(',') : ''}`);
const fontLit = cssNoMedia.match(/font-size:\s*(?!var\()\S/g) || [];
ok(fontLit.length === 0, `页面 CSS 无字面字号（${fontLit.length} 处）`);
const rgbInCss = cssNoMedia.match(/\b(rgb|rgba|hsla?)\((?!var)[^)]*\)/g) || [];
ok(rgbInCss.length === 0, `页面 CSS 无 rgb()/字面 hsl()（${rgbInCss.length} 处）`);
const mediaPx = [...styleBlock.matchAll(/@media[^{]*?(\d+)px/g)].map((m) => +m[1]);
const tokens = JSON.parse(readFileSync(join(repo, 'design/tokens.json'), 'utf8'));
const bpVals = Object.values(tokens.breakpoint).filter((b) => b && b.$value).map((b) => b.$value.value);
ok(mediaPx.every((v) => bpVals.includes(v) || bpVals.includes(v + 1)), `@media 断点仅用 tokens.breakpoint（${[...new Set(mediaPx)].join(',')} ⊂ ${bpVals.join(',')}）`);
const bodyHtml = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script[\s\S]*?<\/script>/g, '');
const inlineStyle = bodyHtml.match(/style="[^"]*"/g) || [];
ok(inlineStyle.length === 0, `标记内无 inline style（${inlineStyle.length} 处）`);
ok(!/lorem|ipsum|placeholder\.com|via\.placeholder|unsplash|张三|李四/i.test(html), '无 lorem ipsum / 占位图 / 占位人名');
ok(html.includes('href="../../tokens.css"'), '引用 ../../tokens.css');

const inline = JSON.parse(html.match(/<script type="application\/json" id="data">(\{[\s\S]*?\})<\/script>/)[1]);
for (const k of Object.keys(inline)) {
  const file = JSON.parse(readFileSync(join(repo, 'mock', `${k}.json`), 'utf8'));
  ok(JSON.stringify(file) === JSON.stringify(inline[k]), `内联数据 ${k} 与 mock/${k}.json 一致`);
}
const content = readFileSync(join(repo, 'content/dashboard.md'), 'utf8');
for (const s of ['下午好，若琳', '数据更新于', '销售趋势', '销售额（折线）与订单数（柱）', '渠道占比', '合计', '最近订单', '查看全部', '团队动态', '任务进度',
  '还没有经营数据', '接入第一个销售渠道后，销售额、订单和库存会在这里实时汇总。', '接入销售渠道', '导入历史订单', '未命名团队', '你好',
  '数据加载失败', '服务暂时不可用（错误码 503）。已为你保留上次的筛选条件，稍后重试即可。', '重试', '若持续失败，请联系管理员或', '服务状态',
  '搜索订单号、商品、客户', '全部标为已读', '查看全部通知', '暂无新通知', '个人资料', '账号安全', '切换团队空间', '帮助中心', '退出登录',
  '查看详情', '标记发货', '打印面单', '取消订单', '收起侧边栏', '展开侧边栏', '打开导航', '后续轮次提供', '欢迎回来']) {
  ok(html.includes(s) && content.includes(s.replace('，若琳', '')), `文案「${s}」来自 content/dashboard.md`);
}

if (process.argv.includes('--static')) finish();

// ---------- Playwright：截图 + 运行时检查 ----------
const require = createRequire(join(repo, 'tools/shoot/package.json'));
const { chromium } = require('playwright');
const outDir = join(here, 'ref');
mkdirSync(outDir, { recursive: true });
const fileUrl = pathToFileURL(join(here, 'index.html')).href;
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 375, height: 812 } };
const states = ['success', 'loading', 'empty', 'error'];
const extras = [
  ['success-toast', 'state=success&toast=login&hold'],
  ['success-notifications', 'state=success&open=notifications'],
  ['success-account', 'state=success&open=account'],
  ['success-order-menu', 'state=success&open=order-menu'],
  ['success-week', 'state=success&period=week'],
  ['success-day', 'state=success&period=day'],
];
const desktopOnly = [['success-rail', 'state=success&sidebar=rail']];
const mobileOnly = [['success-drawer', 'state=success&open=drawer']];

const browser = await chromium.launch();
let shots = 0;
for (const [vpName, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, colorScheme: 'light', locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const list = [...states.map((s) => [s, `state=${s}`]), ...extras, ...(vpName === 'desktop' ? desktopOnly : mobileOnly)];
  for (const theme of ['light', 'dark']) {
    for (const [name, query] of list) {
      const url = `${fileUrl}?${query}&theme=${theme}`;
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      const m = await page.evaluate((w) => {
        const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && el.closest('[hidden]') === null; };
        const small = [];
        for (const el of document.querySelectorAll('a, button, [role="tab"], [role="menuitem"], input')) {
          if (!vis(el) || el.classList.contains('skip')) continue;
          const r = el.getBoundingClientRect();
          if (r.width < w || r.height < w) small.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 12)}"`);
        }
        const overflow = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > innerWidth + 0.5 && getComputedStyle(el).position !== 'fixed' && !el.closest('.sidebar') && !el.closest('.table-wrap')) overflow.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
        }
        return {
          sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, theme: document.documentElement.getAttribute('data-theme'),
          state: document.documentElement.getAttribute('data-state'), small, overflow: overflow.slice(0, 5),
        };
      }, 40);
      const file = join(outDir, `${vpName}-${theme}-${name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      shots++;
      let size = statSync(file).size;
      if (size >= 300 * 1024) { // 无损压不下时量化为 256 色 PNG8（ImageMagick）
        execFileSync('convert', [file, '-strip', '-dither', 'None', '-colors', '256', file]);
        size = statSync(file).size;
        console.log(`INFO ${vpName}-${theme}-${name}.png 量化为 PNG8 → ${(size / 1024).toFixed(0)}KB`);
      }
      ok(m.sw <= vp.width && m.bw <= vp.width, `${vpName}-${theme}-${name}: scrollWidth=${m.sw}/${m.bw} ≤ ${vp.width}`);
      ok(m.overflow.length === 0, `${vpName}-${theme}-${name}: 无元素超出视口右缘${m.overflow.length ? ' → ' + m.overflow.join(' | ') : ''}`);
      ok(m.small.length === 0, `${vpName}-${theme}-${name}: 可点元素热区 ≥40×40${m.small.length ? ' → ' + m.small.join(' | ') : ''}`);
      ok(m.theme === theme && m.state === (query.match(/state=(\w+)/)[1]), `${vpName}-${theme}-${name}: data-theme/data-state 正确`);
      ok(size < 300 * 1024, `${vpName}-${theme}-${name}.png ${(size / 1024).toFixed(0)}KB < 300KB`);
    }
  }
  ok(errors.length === 0, `${vpName}: console error = ${errors.length}${errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();

// 键盘可达 / 交互检查（1440 亮色）
{
  const b2 = await chromium.launch();
  const page = await b2.newPage({ viewport: viewports.desktop });
  await page.goto(`${fileUrl}?state=success&theme=light`);
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => document.activeElement.className);
  ok(firstFocus.includes('skip'), `Tab 首焦点为跳转链接（${firstFocus}）`);
  await page.click('#bellBtn');
  ok(!(await page.isHidden('#notifPop')), '点击铃铛打开通知 Popover');
  await page.keyboard.press('Escape');
  ok(await page.isHidden('#notifPop'), 'Escape 关闭通知 Popover 且焦点回到铃铛');
  ok((await page.evaluate(() => document.activeElement.id)) === 'bellBtn', '焦点回到铃铛');
  await page.click('.tab[data-period="day"]');
  ok((await page.getAttribute('html', 'data-period')) === 'day' && (await page.textContent('#stats .stat strong')).trim() === '¥42,380', 'Tabs 切到「日」后销售额 = ¥42,380');
  await page.click('#themeBtn');
  ok((await page.getAttribute('html', 'data-theme')) === 'dark', '主题按钮切换为暗色');
  await page.click('#collapseBtn');
  ok((await page.getAttribute('html', 'data-sidebar')) === 'rail', '侧边栏收起为图标栏');
  await page.waitForTimeout(400);
  const railW = await page.evaluate(() => document.getElementById('sidebar').getBoundingClientRect().width);
  ok(railW === 64, `图标栏宽度 = ${railW}（--size-sidebar-rail）`);
  await page.goto(`${fileUrl}?state=error&theme=light`);
  await page.click('#retryBtn');
  ok((await page.getAttribute('html', 'data-state')) === 'loading', '错误态点击重试 → loading');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-state') === 'success');
  ok(true, 'loading → success');
  await b2.close();
}

const pngs = readdirSync(outDir).filter((f) => f.endsWith('.png'));
console.log(`\nref/*.png = ${pngs.length} 张（本次新截 ${shots}）`);
finish();

function finish() {
  console.log(`\n${fails.length === 0 ? '全部通过' : `失败 ${fails.length} 项`}`);
  process.exit(fails.length ? 1 : 0);
}
