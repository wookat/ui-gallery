// 阶段 3 门禁：design/hifi/landing
//   node design/hifi/landing/check.mjs          → 静态检查 + Playwright 截基准图到 ref/ + 运行时检查
//   node design/hifi/landing/check.mjs --static → 只跑静态检查
// 依赖：pnpm install --filter @ui-gallery/shoot（playwright）；字体：pnpm install --filter shadcn-ui（@fontsource-variable/inter、noto-sans-sc、jetbrains-mono；未安装时回退系统字体，门禁 FAIL）
// 截图矩阵：1440×900 × {default, navbar-scrolled, pricing-yearly}；375×812 × {default, navbar-scrolled, pricing-yearly, mobile-menu-open}；亮 / 暗 → 14 张
//   default / pricing-yearly 整页；navbar-scrolled 滚到 #features 后截视口（fixed Navbar 实底态只在视口内有意义）；mobile-menu-open 截视口（fixed Sheet）
// 1024×900 / 768×1024 只跑溢出 / 热区 / 控制台检查，不出图
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
const fontLit = cssNoMedia.match(/font(-size)?:\s*(?!var\(|inherit)\S/g) || [];
ok(fontLit.length === 0, `页面 CSS 无字面字号（${fontLit.length} 处）${fontLit.length ? ': ' + fontLit.join(',') : ''}`);
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
ok(!/<img\b/i.test(html), '无 <img>（插画为纯 CSS/SVG）');
ok(html.includes('href="../../tokens.css"'), '引用 ../../tokens.css');

// 文案 / 数据：mock/landing.json 的全部字符串值（结构性字段除外）必须逐字出现在页面中
const mock = JSON.parse(readFileSync(join(repo, 'mock/landing.json'), 'utf8'));
const SKIP_KEYS = new Set(['note', 'illustration', 'visual', 'icon', 'href', 'loginHref', 'trialHref', 'key', 'initial']);
const strings = [];
(function walk(v, k) {
  if (SKIP_KEYS.has(k)) return;
  if (typeof v === 'string') strings.push([k, v]);
  else if (Array.isArray(v)) v.forEach((x) => walk(x, k));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([kk, vv]) => walk(vv, kk));
})(mock, '');
const missing = strings.filter(([, s]) => !html.includes(s));
ok(missing.length === 0, `mock/landing.json 全部 ${strings.length} 条文案逐字出现${missing.length ? ' → 缺 ' + missing.map(([k, s]) => `${k}:「${s}」`).join(' | ') : ''}`);
const fmt = (n) => '¥' + n.toLocaleString('en-US');
const settings = JSON.parse(readFileSync(join(repo, 'mock/settings.json'), 'utf8'));
for (const p of mock.pricing.plans) {
  const sp = settings.billing.plans.find((x) => x.key === p.key);
  ok(sp && sp.monthly === p.monthly && sp.yearly === p.yearly && sp.label === p.label, `${p.label} 价格与 settings.billing 同价（${p.monthly} / ${p.yearly}）`);
  const perMonth = '折合 ¥' + (p.yearly / 12).toFixed(2) + ' / 月';
  ok(html.includes(`>${fmt(p.monthly)}<`) && html.includes(`>${fmt(p.yearly)}<`) && html.includes(perMonth), `${p.label} 页面价格 ${fmt(p.monthly)} / ${fmt(p.yearly)} / ${perMonth}`);
}
const content = readFileSync(join(repo, 'content/landing.md'), 'utf8');
for (const s of ['主导航', 'Acme Console 首页', '打开菜单', '关闭菜单', '菜单', '登录', '免费试用', '已吸顶', '跳到主内容', '全渠道订单与库存运营后台', 'Acme Console 仪表盘示意图', '使用 Acme 的团队成员头像', '无需绑卡 · 5 分钟接入',
  '这些品牌正在用 Acme 管订单', '客户名单', '从下单到发货，每一步都在一个后台', '六个核心能力覆盖中小品牌全渠道运营的日常', '三个场景，看它怎么用', '功能示意图', '了解更多', '平台数据', '数据截至 2026 年 8 月',
  '简单透明，按团队规模选', '所有计划都含 14 天免费试用，随时升降级', '计费周期', '/ 月', '/ 年', '最受欢迎', '包含', '查看完整功能对比', '客户评价', '运营的人怎么说', '客户评价列表', '常见问题', '还有疑问？', '没找到答案？联系我们', '立即开始',
  '页脚', 'Acme Console 是 UI Gallery 的参考应用，用于演示设计系统在真实业务界面中的还原效果。', '社交媒体', '语言', '演示站点，链接不可用']) {
  ok(html.includes(s) && content.includes(s), `文案「${s}」来自 content/landing.md`);
}
const dash = readFileSync(join(repo, 'content/dashboard.md'), 'utf8');
for (const s of ['后续轮次提供', '切换为暗色', '切换为亮色']) ok(html.includes(s) && dash.includes(s), `文案「${s}」复用 content/dashboard.md shell.*`);
const chat = JSON.parse(readFileSync(join(repo, 'mock/chat.json'), 'utf8'));
const chatText = JSON.stringify(chat);
ok(['QM-NS-WAL-2D', 'SO-20260903-0087', '| 14 |'].every((s) => chatText.includes(s)) && html.includes('缺货延迟发货 14 单') && html.includes('SO-20260903-0087'), '分屏③ 问答数字（QM-NS-WAL-2D · 14 单 · SO-20260903-0087）与 mock/chat.json 一致');
ok((html.match(/aria-disabled="true"/g) || []).length >= 26, `不可达项 aria-disabled（${(html.match(/aria-disabled="true"/g) || []).length} 处）`);
ok(!/fg-disabled/.test(styleBlock), 'fg-disabled 未用于可聚焦的 aria-disabled 项（本页无 disabled 控件，未引用该令牌）');

if (process.argv.includes('--static')) finish();

// ---------- Playwright：截图 + 运行时检查 ----------
const require = createRequire(join(repo, 'tools/shoot/package.json'));
const { chromium } = require('playwright');
const outDir = join(here, 'ref');
mkdirSync(outDir, { recursive: true });
const fileUrl = pathToFileURL(join(here, 'index.html')).href;
const viewports = { desktop: { width: 1440, height: 900 }, tablet: { width: 1024, height: 900 }, tabletSm: { width: 768, height: 1024 }, mobile: { width: 375, height: 812 } };
const FONTS = [['Inter Variable', 'Acme Console 1,200+'], ['Noto Sans SC Variable', '把全渠道订单和库存'], ['JetBrains Mono Variable', 'SO-20260903-0087']];
const shotStates = [['default', 'state=default'], ['navbar-scrolled', 'state=scrolled'], ['pricing-yearly', 'state=default&cycle=yearly']];
const perViewport = {
  desktop: shotStates,
  mobile: [...shotStates, ['mobile-menu-open', 'state=default&open=menu']],
  tablet: [['default', 'state=default'], ['mobile-menu-open', 'state=default&open=menu']],
  tabletSm: [['default', 'state=default'], ['mobile-menu-open', 'state=default&open=menu']],
};
const isViewportShot = (name) => /^(navbar-scrolled|mobile-menu-open)$/.test(name);

const runtimeAudit = async (page, w) => page.evaluate((w) => {
  const hiddenBy = (el) => el.closest('[aria-hidden="true"], [hidden], .sr-only') !== null;
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && el.closest('[hidden]') === null; };
  const menuOpen = document.documentElement.getAttribute('data-open') === 'menu';
  const small = [];
  for (const el of document.querySelectorAll('a, button, summary, select, [role="switch"]')) {
    if (!vis(el) || el.classList.contains('skip')) continue;
    if (menuOpen && !el.closest('#sheet-root')) continue; // Sheet 打开时下层不可交互
    const r = el.getBoundingClientRect();
    if (r.width < w || r.height < w) small.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 12)}"`);
  }
  const overflow = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width && r.right > innerWidth + 0.5 && getComputedStyle(el).position !== 'fixed' && !el.closest('.skip')) overflow.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
  }
  // 对比度：所有可见文本（非 aria-hidden / sr-only）相对最近的非透明背景
  const parse = (c) => { const m = c.match(/[\d.]+/g) || []; return { r: +m[0], g: +m[1], b: +m[2], a: m.length > 3 ? +m[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  const bgOf = (el) => { let n = el; while (n && n !== document.documentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c.a > 0.9) return c; n = n.parentElement; } return parse(getComputedStyle(document.body).backgroundColor); };
  const low = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let t; (t = walker.nextNode());) {
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || seen.has(el) || hiddenBy(el) || !vis(el) || el.closest('script, style, .skip')) continue;
    if (menuOpen && !el.closest('#sheet-root')) continue;
    if (!menuOpen && el.closest('#sheet-root')) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const fg = parse(cs.color); if (fg.a < 1) continue;
    const bg = bgOf(el);
    const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700);
    const r = ratio(fg, bg);
    if (r < (big ? 3 : 4.5)) low.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${t.textContent.trim().slice(0, 10)}" ${r.toFixed(2)}`);
  }
  // 装饰 Tag（aria-hidden 抽象图内）也要求 ≥4.5
  for (const el of document.querySelectorAll('.panel .tag')) {
    if (!vis(el) || (menuOpen)) continue;
    const r = ratio(parse(getComputedStyle(el).color), parse(getComputedStyle(el).backgroundColor));
    if (r < 4.5) low.push(`tag.${[...el.classList].join('.')} ${r.toFixed(2)}`);
  }
  return {
    sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, theme: document.documentElement.getAttribute('data-theme'),
    state: document.documentElement.getAttribute('data-state'), cycle: document.documentElement.getAttribute('data-cycle'), open: document.documentElement.getAttribute('data-open'),
    small, overflow: overflow.slice(0, 5), low: low.slice(0, 8), lowCount: low.length,
  };
}, w);

const browser = await chromium.launch();
let shots = 0;
for (const [vpName, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, colorScheme: 'light', locale: 'zh-CN', timezoneId: 'Asia/Shanghai', reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const list = perViewport[vpName];
  const doShots = vpName === 'desktop' || vpName === 'mobile';
  for (const theme of ['light', 'dark']) {
    for (const [name, query] of list) {
      await page.goto(`${fileUrl}?${query}&theme=${theme}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      if (theme === 'light' && name === 'default') {
        const loaded = await page.evaluate((fs) => fs.filter(([f, sample]) => document.fonts.check(`16px "${f}"`, sample)).map(([f]) => f), FONTS);
        ok(loaded.length === FONTS.length, `${vpName}: 字体已加载 ${FONTS.map(([f]) => f).join(' / ')}（pnpm install --filter shadcn-ui）${loaded.length === FONTS.length ? '' : ' → 仅 ' + (loaded.join(',') || '无')}`);
      }
      if (name === 'navbar-scrolled') { await page.evaluate(() => document.getElementById('features').scrollIntoView()); await page.waitForTimeout(150); }
      const m = await runtimeAudit(page, 40);
      const label = `${vpName}-${theme}-${name}`;
      if (doShots) {
        const file = join(outDir, `${label}.png`);
        await page.screenshot({ path: file, fullPage: !isViewportShot(name), animations: 'disabled' });
        shots++;
        let size = statSync(file).size;
        if (size >= 300 * 1024) { execFileSync('convert', [file, '-strip', '-dither', 'None', '-colors', '256', file]); size = statSync(file).size; console.log(`INFO ${label}.png 量化为 PNG8 → ${(size / 1024).toFixed(0)}KB`); }
        ok(size < 300 * 1024, `${label}.png ${(size / 1024).toFixed(0)}KB < 300KB`);
      }
      ok(m.sw <= vp.width && m.bw <= vp.width, `${label}: scrollWidth=${m.sw}/${m.bw} ≤ ${vp.width}`);
      ok(m.overflow.length === 0, `${label}: 无元素超出视口右缘${m.overflow.length ? ' → ' + m.overflow.join(' | ') : ''}`);
      ok(m.small.length === 0, `${label}: 可点元素热区 ≥40×40${m.small.length ? ' → ' + m.small.join(' | ') : ''}`);
      ok(m.lowCount === 0, `${label}: 可见文本对比度 ≥4.5:1（大字 ≥3:1）${m.lowCount ? ` → ${m.lowCount} 处：` + m.low.join(' | ') : ''}`);
      const expState = name === 'navbar-scrolled' ? 'scrolled' : 'default';
      const expCycle = name === 'pricing-yearly' ? 'yearly' : 'monthly';
      ok(m.theme === theme && m.state === expState && m.cycle === expCycle && (m.open === 'menu') === (name === 'mobile-menu-open'), `${label}: data-theme/state/cycle/open 正确（${m.theme}/${m.state}/${m.cycle}/${m.open}）`);
    }
  }
  ok(errors.length === 0, `${vpName}: console error = ${errors.length}${errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();

// ---------- 交互 / 键盘 / 极值 ----------
{
  const b2 = await chromium.launch();
  const page = await b2.newPage({ viewport: viewports.desktop, reducedMotion: 'reduce' });
  await page.goto(`${fileUrl}?theme=light`);
  await page.keyboard.press('Tab');
  ok((await page.evaluate(() => document.activeElement.className)).includes('skip'), 'Tab 首焦点为跳转链接');
  const skipH = await page.evaluate(() => document.querySelector('.skip').getBoundingClientRect().height);
  ok(skipH >= 40, `跳转链接聚焦后高度 ${skipH} ≥ 40`);
  // 不传 ?state 时按滚动自动切换 Navbar
  ok((await page.getAttribute('html', 'data-state')) === 'default', '初始 data-state=default（Navbar 透明）');
  await page.evaluate(() => window.scrollTo(0, 600)); await page.waitForTimeout(100);
  ok((await page.getAttribute('html', 'data-state')) === 'scrolled', '滚动 600px 后 data-state=scrolled');
  const navCss = await page.evaluate(() => { const cs = getComputedStyle(document.querySelector('.nav')); return { bg: cs.backgroundColor, bw: cs.borderBottomWidth, sh: cs.boxShadow }; });
  ok(navCss.bg === 'rgb(255, 255, 255)' && navCss.bw === '1px' && navCss.sh !== 'none', `吸顶实底：bg=${navCss.bg} hairline=${navCss.bw} shadow`);
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(100);
  ok((await page.getAttribute('html', 'data-state')) === 'default' && (await page.evaluate(() => getComputedStyle(document.querySelector('.nav')).backgroundColor)) === 'rgba(0, 0, 0, 0)', '回到顶部 Navbar 恢复透明');
  // 定价 Switch
  await page.click('.js-switch');
  const yearly = await page.evaluate(() => ({ cycle: document.documentElement.getAttribute('data-cycle'), checked: document.querySelector('.js-switch').getAttribute('aria-checked'), pressed: document.querySelector('.js-cycle[data-cycle="yearly"]').getAttribute('aria-pressed'), url: location.search,
    price: document.querySelector('[data-plan="pro"] .price.only-yearly strong').textContent, vis: getComputedStyle(document.querySelector('[data-plan="pro"] .price.only-yearly')).display !== 'none' && getComputedStyle(document.querySelector('[data-plan="pro"] .price.only-monthly')).display === 'none' }));
  ok(yearly.cycle === 'yearly' && yearly.checked === 'true' && yearly.pressed === 'true' && yearly.vis && yearly.price === '¥2,990' && yearly.url.includes('cycle=yearly'), `Switch → 年付：aria-checked / aria-pressed / 专业版 ${yearly.price} / URL ?cycle=yearly`);
  await page.click('.js-cycle[data-cycle="monthly"]');
  ok((await page.getAttribute('html', 'data-cycle')) === 'monthly' && !(await page.evaluate(() => location.search.includes('cycle'))), '点「按月付」→ 月付并清除 URL 参数');
  // 主题
  await page.click('.nav-theme');
  ok((await page.getAttribute('html', 'data-theme')) === 'dark' && (await page.getAttribute('.nav-theme', 'aria-label')) === '切换为亮色', '主题按钮 → 暗色，aria-label 变为「切换为亮色」');
  await page.click('.nav-theme');
  // FAQ 单开
  const faqInit = await page.evaluate(() => [...document.querySelectorAll('.faq-list details')].map((d) => d.open));
  ok(faqInit.filter(Boolean).length === 1 && faqInit[0], 'FAQ 默认只展开第 1 项');
  await page.click('.faq-list details:nth-child(2) summary');
  const faqAfter = await page.evaluate(() => [...document.querySelectorAll('.faq-list details')].map((d) => d.open));
  ok(faqAfter.filter(Boolean).length === 1 && faqAfter[1], 'FAQ 点第 2 项 → 第 1 项收起（单开）');
  // 不可达项
  const dis = await page.evaluate(() => {
    const items = [...document.querySelectorAll('a[aria-disabled="true"]')];
    return { n: items.length, tip: items.every((a) => /^(后续轮次提供|演示站点，链接不可用)$/.test(a.getAttribute('data-tip') || '')), cursor: items.every((a) => getComputedStyle(a).cursor === 'not-allowed'), focusable: items.every((a) => a.tabIndex === 0),
      footTip: [...document.querySelectorAll('.foot a[aria-disabled="true"]')].every((a) => a.getAttribute('data-tip') === '演示站点，链接不可用'),
      trial: [...document.querySelectorAll('.btn-primary[aria-disabled="true"]')].every((a) => getComputedStyle(a).backgroundColor === 'rgb(23, 115, 106)') };
  });
  ok(dis.tip && dis.cursor && dis.focusable && dis.footTip, `不可达项 ${dis.n} 个：Tooltip + cursor:not-allowed + 可聚焦；Footer 用「演示站点，链接不可用」`);
  ok(dis.trial, '不可达主按钮保持 primary 本色（不用 fg-disabled）');
  await page.click('.hero-actions .btn-primary', { force: true }); await page.waitForTimeout(100);
  ok(page.url().startsWith(fileUrl), '点击不可达主按钮不离开页面');
  const loginHref = await page.getAttribute('.nav-login', 'href');
  ok(loginHref === '../login/index.html', `登录 → ${loginHref}`);
  // Tooltip 出现
  await page.hover('.pricing-foot .link');
  ok((await page.evaluate(() => getComputedStyle(document.querySelector('.pricing-foot .link'), '::after').opacity)) === '1', 'hover 不可达链接显示 Tooltip');

  // 375：Sheet 打开 / 关闭 / 焦点；极值文案
  const mob = await b2.newPage({ viewport: viewports.mobile, reducedMotion: 'reduce' });
  await mob.goto(`${fileUrl}?theme=light`);
  await mob.evaluate(() => document.fonts.ready);
  const navMob = await mob.evaluate(() => ({ links: getComputedStyle(document.querySelector('.nav-links')).display, burger: getComputedStyle(document.querySelector('.nav-burger')).display, login: getComputedStyle(document.querySelector('.nav-login')).display }));
  ok(navMob.links === 'none' && navMob.login === 'none' && navMob.burger !== 'none', '375 Navbar 只留 Logo + 试用 + 汉堡');
  await mob.click('.nav-burger'); await mob.waitForTimeout(150);
  const opened = await mob.evaluate(() => ({ open: document.documentElement.getAttribute('data-open'), expanded: document.querySelector('.nav-burger').getAttribute('aria-expanded'), focusIn: document.getElementById('sheet').contains(document.activeElement), links: document.querySelectorAll('#sheet .sheet-nav a').length, url: location.search, bodyOverflow: getComputedStyle(document.body).overflow,
    sheetW: document.getElementById('sheet').getBoundingClientRect().width, dialog: document.getElementById('sheet').getAttribute('role') === 'dialog' && document.getElementById('sheet').getAttribute('aria-modal') === 'true' }));
  ok(opened.open === 'menu' && opened.expanded === 'true' && opened.focusIn && opened.links === 5 && opened.url.includes('open=menu') && opened.dialog, `汉堡 → Sheet：data-open=menu、aria-expanded、焦点进入、5 链接、role=dialog、URL ?open=menu`);
  ok(opened.bodyOverflow === 'hidden' && opened.sheetW === 320, `Sheet 打开锁滚动，宽 ${opened.sheetW}（--size-sheet）`);
  let trapOk = true;
  for (let i = 0; i < 12; i++) { await mob.keyboard.press('Tab'); if (!(await mob.evaluate(() => document.getElementById('sheet').contains(document.activeElement)))) trapOk = false; }
  ok(trapOk, 'Sheet 内 Tab 12 步焦点不逃出');
  await mob.keyboard.press('Escape'); await mob.waitForTimeout(100);
  ok(!(await mob.evaluate(() => document.documentElement.hasAttribute('data-open'))) && (await mob.evaluate(() => document.activeElement.classList.contains('nav-burger'))) && !(await mob.evaluate(() => location.search.includes('open'))), 'Escape 关闭 Sheet，焦点回汉堡，URL 清除 open');
  await mob.click('.nav-burger'); await mob.waitForTimeout(100);
  await mob.click('#sheet .sheet-nav a[href="#pricing"]'); await mob.waitForTimeout(200);
  ok(!(await mob.evaluate(() => document.documentElement.hasAttribute('data-open'))) && (await mob.evaluate(() => location.hash)) === '#pricing' && (await mob.evaluate(() => document.querySelector('.nav-links a[href="#pricing"]').getAttribute('aria-current'))) === 'true', 'Sheet 点「定价」→ 关闭并跳到 #pricing，导航项 aria-current');
  // 极值：最长金额 / 最长计划名 / 最长 wordmark 不撑破 375
  await mob.goto(`${fileUrl}?theme=light&cycle=yearly`);
  await mob.waitForTimeout(200);
  const ext = await mob.evaluate(() => {
    document.querySelectorAll('.price.only-yearly strong').forEach((s) => { s.textContent = '¥188,990'; });
    document.querySelectorAll('.price-sub .only-yearly').forEach((s) => { s.textContent = '折合 ¥15,749.17 / 月'; });
    document.querySelector('[data-plan="business"] h3').textContent = '企业版（多仓多店多法人旗舰）';
    document.querySelector('.logos li:last-child').textContent = 'NORTHSHORECOFFEE';
    document.querySelector('.stats li:nth-child(2) strong').textContent = '3,800,000,000+';
    const right = (sel) => Math.max(...[...document.querySelectorAll(sel)].map((e) => Math.round(e.getBoundingClientRect().right)));
    return { doc: document.documentElement.scrollWidth, plan: right('.plan'), price: right('.price'), logos: right('.logos li'), stats: right('.stats strong') };
  });
  ok(ext.doc <= 375 && ext.plan <= 375 && ext.price <= 375 && ext.logos <= 375 && ext.stats <= 375, `375 极值文案（¥188,990 / 长计划名 / NORTHSHORECOFFEE / 3,800,000,000+）无溢出（doc=${ext.doc}）`);
  // 定价卡三卡在 1440 等高对齐（grid stretch）
  await page.goto(`${fileUrl}?theme=light`);
  await page.waitForTimeout(200);
  const eq = await page.evaluate(() => { const hs = [...document.querySelectorAll('.plan')].map((p) => Math.round(p.getBoundingClientRect().height)); const btn = [...document.querySelectorAll('.plan > .btn')].map((b) => Math.round(b.getBoundingClientRect().bottom)); return { hs, btnAligned: Math.max(...btn) - Math.min(...btn) <= 1 }; });
  ok(new Set(eq.hs).size === 1 && eq.btnAligned, `1440 三张定价卡等高（${eq.hs.join('/')}）且按钮底部对齐`);
  // 8pt 节奏：区块纵向 padding / 主容器宽
  const rhythm = await page.evaluate(() => { const s = getComputedStyle(document.getElementById('features')); const w = document.querySelector('#features .wrap').getBoundingClientRect().width; return { pt: s.paddingTop, pb: s.paddingBottom, wrap: Math.round(w) }; });
  ok(rhythm.pt === '80px' && rhythm.pb === '80px' && rhythm.wrap === 1168, `1440 区块 padding ${rhythm.pt}/${rhythm.pb}（space-20），容器 ${rhythm.wrap} = 1120 + 2×24`);
  await b2.close();
}

const pngs = readdirSync(outDir).filter((f) => f.endsWith('.png'));
console.log(`\nref/*.png = ${pngs.length} 张（本次新截 ${shots}）`);
finish();

function finish() {
  console.log(`\n${fails.length === 0 ? '全部通过' : `失败 ${fails.length} 项`}`);
  process.exit(fails.length ? 1 : 0);
}
