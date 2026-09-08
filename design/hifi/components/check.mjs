// 阶段 3 门禁：design/hifi/components（/components 设计系统全集页，取代 /kitchen-sink）
//   node design/hifi/components/check.mjs          → 静态检查 + Playwright 截基准图到 ref/ + 运行时检查
//   node design/hifi/components/check.mjs --static → 只跑静态检查
// 依赖：pnpm install --filter @ui-gallery/shoot（playwright 1.62.1）；字体：pnpm install --filter shadcn-ui（@fontsource-variable/inter、noto-sans-sc、jetbrains-mono；未安装时门禁 FAIL）
// 视口：1440×900 / 375×812 × 亮/暗。页面无业务状态，状态 = default | snippet-expanded（?open=code）；?theme=light|dark|system；?from=kitchen-sink 显示迁移提示；?q= 预填搜索。
// 基准图：整页 1440×21000+ / 375×36000+ 的 PNG 无法压到 300KB（实测 2.2–2.6MB），因此
//   {desktop,mobile}-{light,dark}-{default,snippet-expanded}.png 截首屏（视口尺寸），
//   {desktop,mobile}-{light,dark}-section-<id>.png 逐类别滚到锚点截视口，10 类 × 4 = 40 张，覆盖全部区块。
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

// ---------- 静态检查：只允许 tokens.css 变量 ----------
const styleBlock = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const cssNoMedia = styleBlock.replace(/@media[^{]*\{/g, '@media{');
const hexInCss = cssNoMedia.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
ok(hexInCss.length === 0, `页面 CSS 无硬编码色值（${hexInCss.length} 处）${hexInCss.length ? ': ' + hexInCss.join(',') : ''}`);
const pxInCss = cssNoMedia.match(/-?\d*\.?\d+px/g) || [];
ok(pxInCss.length === 0, `页面 CSS 无 px 字面量（@media 条件除外，${pxInCss.length} 处）${pxInCss.length ? ': ' + pxInCss.slice(0, 8).join(',') : ''}`);
const remInCss = cssNoMedia.match(/\b\d*\.?\d+(rem|em|pt)\b/g) || [];
ok(remInCss.length === 0, `页面 CSS 无 rem/em/pt 字面量（${remInCss.length} 处）${remInCss.length ? ': ' + remInCss.slice(0, 8).join(',') : ''}`);
const fontLit = cssNoMedia.match(/font-size:\s*(?!var\()\S/g) || [];
ok(fontLit.length === 0, `页面 CSS 无字面字号（${fontLit.length} 处）`);
const rgbInCss = cssNoMedia.match(/\b(rgb|rgba|hsla?)\((?!var)[^)]*\)/g) || [];
ok(rgbInCss.length === 0, `页面 CSS 无 rgb()/字面 hsl()（${rgbInCss.length} 处）`);
const namedColors = cssNoMedia.match(/:\s*(white|black|red|blue|green|gray|grey|orange|yellow)\b/g) || [];
ok(namedColors.length === 0, `页面 CSS 无 CSS 命名色（${namedColors.length} 处）`);
const mediaPx = [...styleBlock.matchAll(/@media[^{]*?(\d+)px/g)].map((m) => +m[1]);
const tokens = JSON.parse(readFileSync(join(repo, 'design/tokens.json'), 'utf8'));
const bpVals = Object.values(tokens.breakpoint).filter((b) => b && b.$value).map((b) => b.$value.value);
ok(mediaPx.length > 0 && mediaPx.every((v) => bpVals.includes(v) || bpVals.includes(v + 1)), `@media 断点仅用 tokens.breakpoint（${[...new Set(mediaPx)].join(',')} ⊂ ${bpVals.join(',')}）`);
const bodyHtml = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script[\s\S]*?<\/script>/g, '');
const inlineStyle = bodyHtml.match(/style="[^"]*"/g) || [];
ok(inlineStyle.length === 0, `标记内无 inline style（${inlineStyle.length} 处）`);
const hexInMarkup = bodyHtml.match(/(fill|stroke|color)="#[0-9a-fA-F]{3,8}"/g) || [];
ok(hexInMarkup.length === 0, `SVG 属性无硬编码色值（${hexInMarkup.length} 处）`);
ok(!/lorem|ipsum|placeholder\.com|via\.placeholder|unsplash|张三|李四|王五|John Doe/i.test(html), '无 lorem ipsum / 占位图 / 占位人名');
ok(!/<img\b/i.test(html), '无位图 <img>（图标为内联 SVG sprite，Hero 为抽象图）');
ok(html.includes('href="../../tokens.css"'), '引用 ../../tokens.css');
const tokensCss = readFileSync(join(repo, 'design/tokens.css'), 'utf8');
const definedVars = new Set([...tokensCss.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const localVars = new Set([...styleBlock.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const usedVars = [...new Set([...html.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]))];
const unknownVars = usedVars.filter((v) => !definedVars.has(v) && !localVars.has(v));
ok(unknownVars.length === 0, `引用的 ${usedVars.length} 个变量均在 tokens.css 或页面局部定义${unknownVars.length ? ' → 未定义: ' + unknownVars.join(',') : ''}`);
ok(/\[data-theme="dark"\]\s*\{/.test(tokensCss), 'tokens.css 提供 html[data-theme="dark"] 语义重映射（页面不自写暗色色值）');
ok(!/data-theme="dark"\][^{]*\{[^}]*#[0-9a-f]/i.test(styleBlock), '页面 CSS 不为暗色另写色值');

// ---------- 结构：10 类区块 + 锚点 + 状态词表 + 文案来源 ----------
const sections = ['typography', 'button', 'form-controls', 'data-display', 'feedback', 'navigation', 'layout', 'theme', 'onboarding', 'composed'];
for (const id of sections) ok(new RegExp(`<section[^>]*class="cat"[^>]*id="${id}"`).test(html) && new RegExp(`href="#${id}"`).test(html), `区块 #${id} 存在且有锚点链接`);
const order = sections.map((id) => html.indexOf(`id="${id}"`));
ok(order.every((p, i) => i === 0 || p > order[i - 1]), '10 类区块顺序与 content/components.md §类别 一致');
const compCount = (html.match(/<article class="comp"/g) || []).length;
ok(compCount >= 25, `组件卡片 ≥ 25（${compCount}）`);
const toggles = (html.match(/class="code-toggle"/g) || []).length;
const panels = (html.match(/class="code-panel"/g) || []).length;
ok(toggles === panels && toggles === compCount, `每个组件卡都有代码折叠按钮 + 面板（toggle ${toggles} / panel ${panels} / comp ${compCount}）`);
for (const m of html.matchAll(/aria-controls="([\w-]+)"/g)) if (!html.includes(`id="${m[1]}"`)) fails.push(`aria-controls 指向不存在的 id ${m[1]}`);
ok(!fails.some((f) => f.startsWith('aria-controls')), 'aria-controls 全部指向存在的 id');
const symbolIds = new Set([...html.matchAll(/<symbol id="([\w-]+)"/g)].map((m) => m[1]));
const usedIcons = [...new Set([...html.matchAll(/<use href="#([\w-]+)"/g)].map((m) => m[1]))];
const missingIcons = usedIcons.filter((i) => !symbolIds.has(i));
ok(missingIcons.length === 0, `内联 SVG sprite 覆盖全部 ${usedIcons.length} 个图标引用${missingIcons.length ? ' → 缺: ' + missingIcons.join(',') : ''}`);

const content = readFileSync(join(repo, 'content/components.md'), 'utf8');
const contentStrings = [
  'Acme 设计系统', 'apps/reference 全部 ui / composed 组件 × 变体 × 尺寸 × 状态', '组件类别导航', '跳转到类别', '切换为亮色', '切换为暗色', '跟随系统', '搜索组件名', '没有名为「', '回到顶部', '/kitchen-sink 已迁移到 /components',
  '排版', '按钮', '表单控件', '数据展示', '反馈', '导航', '布局', '主题', '引导', '复合组件',
  '变体', '尺寸', '状态', '不适用',
  '默认', '悬停', '焦点', '禁用', '加载中', '错误', '选中', '已勾选', '只读', '展开', '空态', '成功', '警告', '信息', '流式', '执行中', '半选', '拖入中', '上传中',
  '代码', '的用法', '收起代码', '复制', '已复制', 'tsx', 'Props', '属性', '类型', '默认值',
  '保存更改', '取消', '查看全部', '删除订单', '忘记密码？', '保存中…', '更多操作', '通知', '仓库名称', '例如：杭州仓', '杭州仓', '仓库名称不能为空', '用于发货单与库存报表的显示名', '发货后自动通知客户',
  '后续轮次提供', '打开通知', '打开账号菜单', '打开导航抽屉', '关闭导航', '弹出 Toast', '查看服务状态', '左右滑动查看更多', '销售趋势示例', '渠道占比示例', '订单数', '销售额', '合计', '系统',
  '备注', '工艺要求、包装方式…', '收货仓库', '选择仓库', '供应商', '搜索供应商名称', '没有匹配的供应商', '结算方式', '加急采购', '运费预算区间', '期望到货日期', '选择日期', '收货时段', '标签', '输入后回车添加', '输入 6 位验证码', '拖拽文件到此处，或点击选择',
  '打开对话框', '取消订单 SO-20260906-0107？', '确认取消', '返回', '打开订单详情', '采购单已提交', 'Markdown 渲染示例', '复制代码',
];
const missingContent = contentStrings.filter((s) => !(html.includes(s) && content.includes(s)));
ok(missingContent.length === 0, `${contentStrings.length} 条文案均出现在页面且来自 content/components.md${missingContent.length ? ' → 缺: ' + missingContent.join(' | ') : ''}`);
// 示例数据来自 mock/*.json（订单号 / 客户 / 商品 / 会话 / 团队）
const mockPairs = [['orders', 'SO-20260906-0108'], ['orders', '周雅婷'], ['orders', '北欧白橡木餐桌 1.4m'], ['orders-all', 'SO-20260903-0087'], ['orders-all', '苏婉婷'], ['orders', '胡桃木床头柜（双抽）'], ['chat', '帮我把 SO-20260903-0087 改为加急'], ['team', '若琳'], ['skus', '新西兰羊毛地毯 1.6×2.3m']];
const mockMiss = mockPairs.filter(([f, s]) => !(html.includes(s) && readFileSync(join(repo, 'mock', `${f}.json`), 'utf8').includes(s)));
ok(mockMiss.length === 0, `示例数据来自 mock/*.json（${mockPairs.length} 组抽样）${mockMiss.length ? ' → ' + mockMiss.map((m) => m.join(':')).join(' | ') : ''}`);
ok(/data-theme-opt="light"[\s\S]*data-theme-opt="dark"[\s\S]*data-theme-opt="system"/.test(html), '主题控件三态：亮 / 暗 / 跟随系统');
ok(/id="anchorSelect"/.test(html) && /<nav class="anchors"/.test(html), '锚点导航：桌面横向 nav + 375 Select');
ok(/id="redirectNotice"[^>]*role="status"[^>]*hidden/.test(html), '迁移提示默认隐藏，?from=kitchen-sink 时显示');

if (process.argv.includes('--static')) finish();

// ---------- Playwright：截图 + 运行时检查 ----------
const require = createRequire(join(repo, 'tools/shoot/package.json'));
const { chromium } = require('playwright');
const outDir = join(here, 'ref');
mkdirSync(outDir, { recursive: true });
const fileUrl = pathToFileURL(join(here, 'index.html')).href;
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 375, height: 812 } };
const FONTS = [['Inter Variable', 'Acme f37ffb6'], ['Noto Sans SC Variable', '设计系统'], ['JetBrains Mono Variable', 'SO-20260906-0108']];
const states = [['default', ''], ['snippet-expanded', 'open=code']];
const HIT = tokens.size.hit.$value.value; // 40
const SPACE = tokens.space['1'].$value.value; // 4 → 8pt 节奏取 2×

const lum = (rgb) => { const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map((c) => { c = +c / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };

// 页内全量扫描（每视口×主题×状态各跑一次）：boundingRect/固定选择器覆盖不到的盲区
//   1) 全文本对比度：每个含文字的元素，文字色（合成祖先 opacity）vs 最近不透明祖先背景；≥24px 或 ≥18.66px 粗体按 3:1，其余 4.5:1；
//      跳过 aria-hidden / sr-only / disabled / aria-disabled / 代码面板 / 有 background-image 的祖先
//   2) elementFromPoint 有效热区：把控件滚到视口中央，从中心向四方逐像素 elementFromPoint，统计连续命中自身（或 .hit-area/.switch-hit/.control/.taginput 包裹层、关联 label）的长度 → 实际可点尺寸 ≥ size.hit；被遮挡/重叠即失败
const deepScan = (hit) => {
  const parse = (c) => { // rgb()/rgba() 与 color-mix 产生的 color(srgb r g b / a)
    const m = (c.match(/[\d.]+/g) || []).map(Number); const k = c.startsWith('color(') ? 255 : 1;
    return { r: (m[0] || 0) * k, g: (m[1] || 0) * k, b: (m[2] || 0) * k, a: m.length > 3 ? m[3] : (c === 'transparent' ? 0 : 1) };
  };
  const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
  const lum = ({ r, g, b }) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && el.closest('[hidden]') === null; };
  const label = (el) => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')}`;
  const low = []; let texts = 0;
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    if (!n.data.trim()) continue;
    const el = n.parentElement;
    if (!el || seen.has(el) || !vis(el) || el.closest('[aria-hidden="true"], .sr-only, [disabled], [aria-disabled="true"], .code-panel, pre, code, script, style, svg')) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    let fg = parse(cs.color);
    if (fg.a === 0 || (cs.webkitTextFillColor && parse(cs.webkitTextFillColor).a === 0)) continue;
    let opacity = 1, bg = null, image = false;
    for (let a = el; a; a = a.parentElement) {
      const s = getComputedStyle(a);
      opacity *= +s.opacity;
      if (s.backgroundImage !== 'none') { image = true; break; }
      const b = parse(s.backgroundColor);
      if (b.a > 0) { bg = bg ? over(bg, b) : b; if (b.a >= 1) break; }
    }
    if (image) continue;
    if (!bg || bg.a < 1) bg = over(bg || { r: 0, g: 0, b: 0, a: 0 }, parse(getComputedStyle(document.documentElement).backgroundColor));
    fg = over({ ...fg, a: fg.a * opacity }, bg);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    const c = ratio(fg, bg);
    texts++;
    if (c < need) low.push(`${label(el)} "${n.data.trim().slice(0, 10)}" ${c.toFixed(2)}<${need}`);
  }
  const scrollers = [...document.querySelectorAll('*')].filter((e) => e.scrollLeft || e.scrollTop).map((e) => [e, e.scrollLeft, e.scrollTop]);
  const small = []; let probed = 0;
  for (const el of document.querySelectorAll('a[href], button, [role="tab"], [role="menuitem"], [role="checkbox"], [role="radio"], [role="switch"], [role="option"], input, select, textarea, summary, [tabindex="0"]')) {
    if (!vis(el) || el.closest('[aria-hidden="true"]') || el.classList.contains('sr-only') || el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
    el.scrollIntoView({ block: 'center', inline: 'center' });
    const wrap = el.closest('.hit-area, .switch-hit, .control, .taginput');
    const owns = (t) => !!t && (el.contains(t) || (wrap && wrap.contains(t)) || (t.tagName === 'LABEL' && t.control === el));
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cx < 0 || cy < 0 || cx >= innerWidth || cy >= innerHeight) continue; // 滚不进视口（如 .skip 仅聚焦时出现）
    const name = `${label(el)} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 12)}"`;
    if (!owns(document.elementFromPoint(cx, cy))) { small.push(`${name} 中心点被遮挡`); continue; }
    const span = (dx, dy) => { let n = 0; while (n < hit && owns(document.elementFromPoint(cx + dx * (n + 1), cy + dy * (n + 1)))) n++; return n; };
    const w = span(1, 0) + span(-1, 0) + 1, h = span(0, 1) + span(0, -1) + 1;
    probed++;
    if (w < hit || h < hit) small.push(`${name} ${w}x${h}`);
  }
  for (const [e, l, t] of scrollers) { e.scrollLeft = l; e.scrollTop = t; }
  scrollTo(0, 0);
  return { texts, low, probed, small };
};

const shoot = async (page, file) => {
  await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
  let size = statSync(file).size;
  if (size >= 300 * 1024) {
    execFileSync('convert', [file, '-strip', '-dither', 'None', '-colors', '256', file]);
    size = statSync(file).size;
    console.log(`INFO ${file.split('/').pop()} 量化为 PNG8 → ${(size / 1024).toFixed(0)}KB`);
  }
  return size;
};

const browser = await chromium.launch();
let shots = 0;
for (const [vpName, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce', locale: 'zh-CN', timezoneId: 'Asia/Shanghai' }); // reduce → scroll-behavior:auto，锚点跳转可同步测量
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const theme of ['light', 'dark']) {
    for (const [name, query] of states) {
      await page.goto(`${fileUrl}?theme=${theme}${query ? '&' + query : ''}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.documentElement.getAttribute('data-ready') === 'true');
      await page.waitForTimeout(250);
      if (theme === 'light' && name === 'default') {
        const loaded = await page.evaluate((fs) => fs.filter(([f, sample]) => document.fonts.check(`16px "${f}"`, sample)).map(([f]) => f), FONTS);
        ok(loaded.length === FONTS.length, `${vpName}: 字体已加载 ${FONTS.map(([f]) => f).join(' / ')}${loaded.length === FONTS.length ? '' : ' → 仅 ' + (loaded.join(',') || '无')}`);
      }
      const m = await page.evaluate((hit) => {
        const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && el.closest('[hidden]') === null; };
        const hitRect = (el) => { // 视觉尺寸 < 热区的控件：.hit-area 用 ::after 撑高、.switch-hit / .control 用包裹层撑到 size.hit
          const r = el.getBoundingClientRect();
          let w = r.width, h = r.height;
          const wrap = el.closest('.hit-area, .switch-hit, .control, .taginput');
          if (wrap) { const wr = wrap.getBoundingClientRect(); w = Math.max(w, wr.width); h = Math.max(h, wr.height); }
          if (el.classList.contains('hit-area')) { const after = getComputedStyle(el, '::after'); if (after.content !== 'none') h = Math.max(h, parseFloat(after.height) || 0); }
          return { width: w, height: h };
        };
        const small = [];
        for (const el of document.querySelectorAll('a[href], button, [role="tab"], [role="menuitem"], [role="checkbox"], [role="radio"], [role="switch"], [role="option"], input, select, textarea, summary, [tabindex="0"]')) {
          if (!vis(el) || el.closest('[aria-hidden="true"]') || el.classList.contains('sr-only') || el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
          const r = hitRect(el);
          if (r.width < hit - 0.5 || r.height < hit - 0.5) small.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 12)}"`);
        }
        const overflow = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > innerWidth + 0.5 && getComputedStyle(el).position !== 'fixed' && !el.closest('.matrix-wrap, .table-wrap, .codeblock pre')) overflow.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
        }
        const expanded = [...document.querySelectorAll('.code-toggle')].filter((b) => b.getAttribute('aria-expanded') === 'true').length;
        const hiddenPanels = [...document.querySelectorAll('.code-panel')].filter((p) => p.hidden).length;
        return {
          sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, theme: document.documentElement.getAttribute('data-theme'),
          open: document.documentElement.getAttribute('data-open'), expanded, hiddenPanels, toggles: document.querySelectorAll('.code-toggle').length,
          small: small.slice(0, 8), smallCount: small.length, overflow: overflow.slice(0, 5),
        };
      }, HIT);
      const tag = `${vpName}-${theme}-${name}`;
      ok(m.sw <= vp.width && m.bw <= vp.width, `${tag}: scrollWidth=${m.sw}/${m.bw} ≤ ${vp.width}`);
      ok(m.overflow.length === 0, `${tag}: 无元素超出视口右缘（表格/矩阵滚动容器除外）${m.overflow.length ? ' → ' + m.overflow.join(' | ') : ''}`);
      ok(m.smallCount === 0, `${tag}: 可点元素热区 ≥${HIT}×${HIT}${m.smallCount ? ` → ${m.smallCount} 处: ` + m.small.join(' | ') : ''}`);
      const d = await page.evaluate(deepScan, HIT);
      ok(d.texts > 500 && d.low.length === 0, `${tag}: 全文本对比度扫描 ${d.texts} 处均达标${d.low.length ? ` → ${d.low.length} 处不足: ` + d.low.slice(0, 8).join(' | ') : ''}`);
      ok(d.probed > 300 && d.small.length === 0, `${tag}: elementFromPoint 实测热区 ${d.probed} 个控件均 ≥${HIT}×${HIT}${d.small.length ? ` → ${d.small.length} 处: ` + d.small.slice(0, 8).join(' | ') : ''}`);
      ok(m.theme === theme, `${tag}: data-theme=${m.theme}`);
      if (name === 'snippet-expanded') ok(m.open === 'code' && m.expanded === m.toggles && m.hiddenPanels === 0, `${tag}: ?open=code → ${m.expanded}/${m.toggles} 代码面板全部展开`);
      else ok(m.expanded === 0 && m.hiddenPanels === m.toggles, `${tag}: 默认 ${m.toggles} 个代码面板全部折叠`);
      if (name === 'snippet-expanded') { // 首屏截图里要看得见展开的代码：滚到首个代码面板
        await page.evaluate(() => { const p = document.querySelector('.code-panel'); const top = p.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop); scrollTo(0, Math.max(0, top)); });
        await page.waitForTimeout(150);
      }
      const size = await shoot(page, join(outDir, `${tag}.png`));
      shots++;
      ok(size < 300 * 1024, `${tag}.png ${(size / 1024).toFixed(0)}KB < 300KB`);
      if (name === 'default') {
        for (const id of sections) {
          await page.evaluate((id) => { location.hash = '#' + id; }, id);
          await page.waitForTimeout(200);
          const top = await page.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, id);
          ok(top >= 0 && top <= 200, `${tag}: 锚点 #${id} 滚动后标题位于粘性栏之下（top=${Math.round(top)}）`);
          const sz = await shoot(page, join(outDir, `${vpName}-${theme}-section-${id}.png`));
          shots++;
          ok(sz < 300 * 1024, `${vpName}-${theme}-section-${id}.png ${(sz / 1024).toFixed(0)}KB < 300KB`);
        }
      }
    }
  }
  ok(errors.length === 0, `${vpName}: console error = ${errors.length}${errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();

// ---------- 交互 / 键盘 / 对比度 / 节奏（1440 与 375） ----------
{
  const b2 = await chromium.launch();
  const page = await b2.newPage({ viewport: viewports.desktop, reducedMotion: 'reduce' });
  await page.goto(`${fileUrl}?theme=light`);
  await page.waitForFunction(() => document.documentElement.getAttribute('data-ready') === 'true');
  await page.keyboard.press('Tab');
  const first = await page.evaluate(() => ({ cls: document.activeElement.className, h: document.activeElement.getBoundingClientRect().height, ring: getComputedStyle(document.activeElement).outlineWidth }));
  ok(first.cls.includes('skip') && first.h >= HIT, `Tab 首焦点为跳转链接（${first.cls}，高 ${Math.round(first.h)}）`);
  // 焦点环：真实 Tab 到搜索框与第一个代码按钮，:focus-visible 轮廊 = --border-width-focus
  const searchIdle = await page.evaluate(() => getComputedStyle(document.querySelector('.search')).boxShadow);
  await page.focus('#searchInput');
  const searchFocus = await page.evaluate(() => getComputedStyle(document.querySelector('.search')).boxShadow);
  ok(searchFocus !== 'none' && searchFocus !== searchIdle, `搜索框 :focus-within 容器描边 = ${searchFocus.slice(0, 40)}`);
  await page.focus('.code-toggle');
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  const ring2 = await page.evaluate(() => { const cs = getComputedStyle(document.activeElement); return { cls: document.activeElement.className, w: cs.outlineWidth, s: cs.outlineStyle }; });
  ok(ring2.cls.includes('code-toggle') && ring2.w !== '0px' && ring2.s !== 'none', `代码按钮键盘聚焦 :focus-visible 焦点环 = ${ring2.w} ${ring2.s}`);
  // 主题三态即时切换 + 持久化
  await page.click('#themeSeg [data-theme-opt="dark"]');
  ok((await page.getAttribute('html', 'data-theme')) === 'dark' && (await page.getAttribute('#themeSeg [data-theme-opt="dark"]', 'aria-pressed')) === 'true', '点击「暗」→ data-theme=dark 且按钮 aria-pressed');
  await page.click('#themeSeg [data-theme-opt="light"]');
  ok((await page.getAttribute('html', 'data-theme')) === 'light', '点击「亮」→ data-theme=light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.click('#themeSeg [data-theme-opt="system"]');
  ok((await page.getAttribute('html', 'data-theme')) === 'dark' && (await page.getAttribute('html', 'data-theme-pref')) === 'system', '「跟随系统」在系统暗色下解析为 dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForTimeout(50);
  ok((await page.getAttribute('html', 'data-theme')) === 'light', '系统切回亮色时即时跟随');
  await page.goto(fileUrl); // 无 ?theme 时读 localStorage
  await page.waitForFunction(() => document.documentElement.getAttribute('data-ready') === 'true');
  ok((await page.getAttribute('html', 'data-theme-pref')) === 'system', '主题偏好 localStorage 持久化（无 ?theme 重开仍为 system）');
  // 代码折叠：点开 / 收起 / 焦点回按钮 / 复制反馈
  const firstToggle = page.locator('.code-toggle').first();
  const panelId = await firstToggle.getAttribute('aria-controls');
  await firstToggle.click();
  ok((await firstToggle.getAttribute('aria-expanded')) === 'true' && !(await page.isHidden(`#${panelId}`)), '点击「代码」展开面板（aria-expanded=true）');
  const codeMono = await page.evaluate((id) => getComputedStyle(document.querySelector(`#${id} code`)).fontFamily, panelId);
  ok(/JetBrains Mono/.test(codeMono), `代码块等宽字体 = ${codeMono.split(',')[0]}`);
  await page.click(`#${panelId} [data-copy]`);
  ok((await page.textContent(`#${panelId} [data-copy]`)).trim() === '已复制', '点击「复制」→ 按钮短暂替换为「已复制」');
  await page.click(`#${panelId} [data-hide]`);
  ok((await firstToggle.getAttribute('aria-expanded')) === 'false' && (await page.isHidden(`#${panelId}`)), '「收起代码」折叠面板');
  ok((await page.evaluate(() => document.activeElement.className)).includes('code-toggle'), '收起后焦点回到「代码」按钮');
  // 真实 Toast / Dialog 触发器
  await page.click('#toastBtn');
  ok((await page.locator('#toastRegion .toast').count()) === 1 && (await page.textContent('#toastRegion')).includes('通知偏好已保存'), '「弹出 Toast」→ 右下角 aria-live 区域出现 Toast');
  await page.click('#toastRegion .toast .iconbtn');
  ok((await page.locator('#toastRegion .toast').count()) === 0, 'Toast 关闭按钮移除 Toast');
  await page.click('#dialogBtn');
  ok(!(await page.isHidden('#liveOverlay')) && (await page.evaluate(() => document.activeElement.getAttribute('role'))) === 'dialog', '「打开对话框」→ 遮罩 + 焦点进入 role=dialog');
  await page.keyboard.press('Escape');
  ok((await page.isHidden('#liveOverlay')) && (await page.evaluate(() => document.activeElement.id)) === 'dialogBtn', 'Escape 关闭对话框并回焦触发按钮');
  // 搜索过滤 + 空结果 + 清空 + "/" 快捷键
  await page.fill('#searchInput', 'OrderCard');
  const filt = await page.evaluate(() => ({ shown: [...document.querySelectorAll('.comp')].filter((c) => !c.hidden).length, cats: [...document.querySelectorAll('.cat')].filter((c) => !c.hidden).length, empty: document.getElementById('noResult').hidden }));
  ok(filt.shown >= 1 && filt.shown < 5 && filt.cats === 1 && filt.empty, `搜索 OrderCard → ${filt.shown} 个组件 / ${filt.cats} 类，无空态`);
  await page.fill('#searchInput', '不存在的组件名');
  const emptyTxt = await page.evaluate(() => ({ hidden: document.getElementById('noResult').hidden, txt: document.getElementById('noResult').textContent }));
  ok(!emptyTxt.hidden && emptyTxt.txt.includes('没有名为「不存在的组件名」的组件'), '无匹配时显示 search.empty「没有名为「{q}」的组件」');
  await page.click('#clearSearch');
  ok((await page.evaluate(() => [...document.querySelectorAll('.comp')].filter((c) => !c.hidden).length)) === compCount && (await page.evaluate(() => document.activeElement.id)) === 'searchInput', '「清空搜索」恢复全部组件并聚焦搜索框');
  await page.keyboard.press('Escape'); await page.click('body');
  await page.keyboard.press('/');
  ok((await page.evaluate(() => document.activeElement.id)) === 'searchInput', '快捷键 / 聚焦搜索框');
  // 迁移提示
  await page.goto(`${fileUrl}?theme=light&from=kitchen-sink`);
  await page.waitForFunction(() => document.documentElement.getAttribute('data-ready') === 'true');
  ok(!(await page.isHidden('#redirectNotice')) && (await page.textContent('#redirectNotice')).includes('/kitchen-sink 已迁移到 /components'), '?from=kitchen-sink 显示迁移 Alert');
  await page.click('#redirectClose');
  ok(await page.isHidden('#redirectNotice'), '关闭迁移 Alert');
  // 回到顶部：首屏隐藏，滚过一屏显示
  const topBefore = await page.evaluate(() => getComputedStyle(document.getElementById('toTop')).visibility);
  await page.evaluate(() => scrollTo(0, innerHeight * 2));
  await page.waitForTimeout(150);
  const topAfter = await page.evaluate(() => getComputedStyle(document.getElementById('toTop')).visibility);
  ok(topBefore === 'hidden' && topAfter === 'visible', `回到顶部按钮：首屏 ${topBefore} → 滚动后 ${topAfter}`);
  // 锚点当前项高亮
  await page.evaluate(() => { location.hash = '#feedback'; });
  await page.waitForTimeout(400);
  ok((await page.getAttribute('.anchors a[href="#feedback"]', 'aria-current')) === 'true', '滚到 #feedback 后锚点 aria-current=true');

  // 对比度（亮/暗）：正文 / 弱化文字 / 主按钮 / 标签；层级：display > h1 > h2 > h3 > body > caption；8pt 节奏
  for (const theme of ['light', 'dark']) {
    await page.goto(`${fileUrl}?theme=${theme}`);
    await page.waitForFunction(() => document.documentElement.getAttribute('data-ready') === 'true');
    const a = await page.evaluate(() => {
      const cs = (sel, prop) => getComputedStyle(document.querySelector(sel))[prop];
      const bg = cs('body', 'backgroundColor');
      const card = cs('.comp', 'backgroundColor');
      return {
        bg, card,
        fg: cs('.comp p, .comp .t-body', 'color'), muted: cs('.t-caption', 'color'),
        btnBg: cs('.btn-primary', 'backgroundColor'), btnFg: cs('.btn-primary', 'color'),
        tagBg: cs('.tag-warning', 'backgroundColor'), tagFg: cs('.tag-warning', 'color'),
        sizes: ['.t-display', '.cat-head h2', '.comp-head h3', '.t-body', '.t-caption'].map((s) => parseFloat(cs(s, 'fontSize'))),
        gaps: ['.page', '.cat', '.comp', '.grid-3', '.demo-box'].map((s) => { const c = getComputedStyle(document.querySelector(s)); return [s, ...[c.rowGap, c.columnGap, c.paddingTop, c.paddingLeft, c.marginTop].filter((v) => /px/.test(v)).map((v) => parseFloat(v))]; }),
      };
    });
    const c1 = contrast(a.fg, a.card), c2 = contrast(a.muted, a.card), c3 = contrast(a.btnFg, a.btnBg), c4 = contrast(a.tagFg, a.tagBg);
    ok(c1 >= 4.5 && c2 >= 4.5 && c3 >= 4.5 && c4 >= 4.5, `${theme}: 对比度 正文 ${c1.toFixed(2)} / 辅助 ${c2.toFixed(2)} / 主按钮 ${c3.toFixed(2)} / 警告标签 ${c4.toFixed(2)} ≥ 4.5`);
    ok(a.sizes.every((s, i) => i === 0 || s <= a.sizes[i - 1]) && a.sizes[0] > a.sizes[3] && a.sizes[3] > a.sizes[4], `${theme}: 字阶层级 display ${a.sizes[0]} ≥ h2 ${a.sizes[1]} ≥ h3 ${a.sizes[2]} > body ${a.sizes[3]} > caption ${a.sizes[4]}`);
    const off = a.gaps.flatMap(([s, ...vals]) => vals.filter((v) => v % (SPACE * 2) !== 0).map((v) => `${s}:${v}`));
    ok(off.length === 0, `${theme}: 页面/区块/卡片间距均为 8pt 倍数${off.length ? ' → ' + off.join(',') : ''}`);
  }

  // 375：锚点 Select 导航；长文案极值不撑破；表格容器可横滚并有提示
  const mob = await b2.newPage({ viewport: viewports.mobile, reducedMotion: 'reduce' });
  await mob.goto(`${fileUrl}?theme=light`);
  await mob.waitForFunction(() => document.documentElement.getAttribute('data-ready') === 'true');
  const mobNav = await mob.evaluate(() => ({ selectVisible: getComputedStyle(document.querySelector('.anchor-select')).display !== 'none', navHidden: getComputedStyle(document.querySelector('.anchors a.anchor')).display === 'none' }));
  ok(mobNav.selectVisible && mobNav.navHidden, '375 锚点导航折叠为 Select');
  await mob.selectOption('#anchorSelect', 'composed');
  await mob.waitForTimeout(300);
  const selTop = await mob.evaluate(() => document.getElementById('composed').getBoundingClientRect().top);
  ok(selTop >= 0 && selTop <= 200 && (await mob.evaluate(() => location.hash)) === '#composed', `375 Select 跳转到 #composed（top=${Math.round(selTop)}）`);
  const scrollables = await mob.evaluate(() => {
    const wraps = [...document.querySelectorAll('.matrix-wrap, .table-wrap')];
    const sc = wraps.filter((w) => w.scrollWidth > w.clientWidth);
    return { total: wraps.length, scrollable: sc.length, flagged: sc.filter((w) => w.classList.contains('is-scrollable')).length, hints: sc.filter((w) => { const h = w.parentElement.querySelector('.table-hint'); return h && h.classList.contains('is-visible'); }).length, overflowX: sc.every((w) => getComputedStyle(w).overflowX === 'auto') };
  });
  ok(scrollables.scrollable > 0 && scrollables.flagged === scrollables.scrollable && scrollables.overflowX, `375 ${scrollables.scrollable}/${scrollables.total} 个矩阵/表格可横滚，均标记 .is-scrollable 且 overflow-x:auto（提示 ${scrollables.hints} 处）`);
  const ext = await mob.evaluate(() => {
    const card = document.querySelector('.order-card');
    card.querySelector('.oc-mid .name').textContent = '杭州栖木家居有限公司浙江省内采购中心周雅婷（大客户）';
    card.querySelector('.oc-mid .items').textContent = '北欧白橡木餐桌 1.4m × 1 · 新西兰羊毛地毯 1.6×2.3m × 4 · 胡桃木床头柜（双抽）× 2';
    card.querySelector('.oc-bot .amount').textContent = '¥1,186,420,999.00';
    const stat = document.querySelector('.stat .stat-value strong');
    if (stat) stat.textContent = '¥1,186,420,999';
    const statRect = document.querySelector('.stat').getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    return { doc: document.documentElement.scrollWidth, statRight: Math.round(statRect.right), cardRight: Math.round(cr.right), inner: [...card.querySelectorAll('*')].every((el) => el.getBoundingClientRect().right <= cr.right + 0.5) };
  });
  ok(ext.doc <= 375 && ext.cardRight <= 375 && ext.statRight <= 375 && ext.inner, `375 订单卡 长客户名 + 长商品串 + ¥1,186,420,999.00 / 统计卡 ¥1,186,420,999 不溢出（doc=${ext.doc} cardRight=${ext.cardRight} statRight=${ext.statRight}）`);
  await b2.close();
}

const pngs = readdirSync(outDir).filter((f) => f.endsWith('.png'));
const required = ['desktop', 'mobile'].flatMap((v) => ['light', 'dark'].flatMap((t) => ['default', 'snippet-expanded'].map((s) => `${v}-${t}-${s}.png`)));
ok(required.every((f) => pngs.includes(f)), `必备基准图 8 张齐全：${required.join(' ')}`);
const oversize = pngs.filter((f) => statSync(join(outDir, f)).size >= 300 * 1024);
ok(oversize.length === 0, `ref/*.png 全部 < 300KB${oversize.length ? ' → ' + oversize.join(',') : ''}`);
console.log(`\nref/*.png = ${pngs.length} 张（本次新截 ${shots}）`);
finish();

function finish() {
  console.log(`\n${fails.length === 0 ? '全部通过' : `失败 ${fails.length} 项`}`);
  process.exit(fails.length ? 1 : 0);
}
