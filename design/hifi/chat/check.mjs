// 阶段 3 门禁：design/hifi/chat
//   node design/hifi/chat/check.mjs          → 静态检查 + Playwright 截基准图到 ref/ + 运行时检查
//   node design/hifi/chat/check.mjs --static → 只跑静态检查
// 依赖：pnpm install --filter @ui-gallery/shoot（playwright 1.62.1）；字体：pnpm install --filter shadcn-ui（@fontsource-variable/inter、noto-sans-sc、jetbrains-mono）
// 查询串（实现阶段 useScreenState 同名）：
//   state=success|streaming|error|empty|loading   conversation=c_1…c_7（c_6/c_7 historyAvailable:false → 骨架 → 历史不可用空态）
//   open=sidebar|delete|menu|model|notifications|account|drawer   toast=urgent[&hold]   attach   scrolled=up   sidebar=rail|expanded   theme=light|dark
// 视口：1440×900 与 375×812 全矩阵；1024×900（默认 rail）与 768×1024（抽屉 + 会话 Sheet）只截 success 与其叠层，但同样跑溢出/热区/控制台检查
import { readFileSync, statSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../../..');
const html = readFileSync(join(here, 'index.html'), 'utf8');
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); console.log(`${cond ? 'PASS' : 'FAIL'} ${msg}`); };
const money = (n) => `¥${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
// 脚本内允许的 style 赋值：仅 Popover/菜单定位、自增 Textarea 高度、头像色相（值全部来自 DOM 测量或 mock）
const scriptBlock = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const styleWrites = scriptBlock.match(/\.style\.(setProperty\('[^']+'|\w+)/g) || [];
const styleProps = scriptBlock.match(/\.style\.setProperty\('([^']+)'/g) || [];
ok(styleWrites.every((s) => /\.(left|top|height|setProperty\('--hue')$/.test(s)) && styleProps.every((p) => p.includes('--hue')), `脚本 style 写入仅 left/top/height/--hue（${[...new Set(styleWrites)].join(' ')}）`);
ok(!/lorem|ipsum|placeholder\.com|via\.placeholder|unsplash|张三|李四/i.test(html), '无 lorem ipsum / 占位图 / 占位人名');
ok(html.includes('href="../../tokens.css"'), '引用 ../../tokens.css');
ok(!/<img\b/.test(bodyHtml), '无位图（头像用首字 + 品牌用 lucide 图标）');

const inline = JSON.parse(html.match(/<script type="application\/json" id="data">(\{[\s\S]*?\})<\/script>/)[1]);
for (const k of Object.keys(inline)) {
  const file = JSON.parse(readFileSync(join(repo, 'mock', `${k}.json`), 'utf8'));
  ok(JSON.stringify(file) === JSON.stringify(inline[k]), `内联数据 ${k} 与 mock/${k}.json 一致`);
}
ok(['chat', 'nav', 'user', 'notifications', 'meta'].every((k) => k in inline), '内联数据含 chat / nav / user / notifications / meta');
const chat = inline.chat;
const content = readFileSync(join(repo, 'content/chat.md'), 'utf8');
for (const s of ['智能助理', '新建会话', '搜索会话', '会话操作', '删除会话', '重命名', '有新回复', '打开会话列表', '关闭会话列表', '正在加载历史消息',
  '历史消息未包含在演示数据中', '这条会话共', '演示站点只保留今天与本周的会话内容。', '返回今天的会话', '回到最新消息', '复制回复', '重新生成', '有帮助', '没帮助',
  '复制代码', '已复制', '来源', '引用来源', '助理正在输入', '回复失败', '忽略', '停止生成', '发送', '添加附件', '移除附件', '选择模型', '试试这样问',
  '消息不超过 2000 字', '左右滑动查看更多', '收起', '展开']) {
  ok(html.includes(s) && content.includes(s), `文案「${s}」来自 content/chat.md`);
}
for (const s of [chat.assistant.name, chat.assistant.disclaimer, chat.composer.placeholder, chat.composer.hint, chat.emptyState.title, chat.emptyState.description,
  chat.errorState.message, chat.errorState.retry, ...chat.suggestions.map((s) => s.label), ...chat.models.map((m) => m.label), ...chat.groups.map((g) => g.label), ...chat.conversations.map((c) => c.title)]) {
  ok(JSON.stringify(chat).includes(JSON.stringify(s).slice(1, -1)), `mock 文案「${s.slice(0, 18)}」可被页面读取`);
}
// 答案数字复算（与 mock/check.mjs 同源，这里只断言渲染路径会用到的三组）
const skus = JSON.parse(readFileSync(join(repo, 'mock/skus.json'), 'utf8'));
const ordersAll = JSON.parse(readFileSync(join(repo, 'mock/orders-all.json'), 'utf8'));
const series = JSON.parse(readFileSync(join(repo, 'mock/series.json'), 'utf8'));
const topSku = skus.items.filter((s) => s.weekStockoutOrders > 0).sort((a, b) => b.weekStockoutOrders - a.weekStockoutOrders)[0];
const total = skus.items.reduce((n, s) => n + (s.weekStockoutOrders || 0), 0);
ok(chat.messages.c_1[1].markdown.includes(`**${total} 单**`) && chat.messages.c_1[1].markdown.includes(`| ${topSku.sku} |`), `c_1 缺货合计 ${total} 单、最高 ${topSku.sku} = skus.json 复算`);
const o87 = ordersAll.find((o) => o.id === 'SO-20260903-0087');
ok(chat.messages.c_2[1].markdown.includes(money(o87.amount)), `c_2 金额 ${money(o87.amount)} = orders-all`);
const m30 = series.month.data ?? series.month;
ok(Array.isArray(m30) || typeof m30 === 'object', 'series.month 可读（复盘数字由 mock/check.mjs 断言）');

if (process.argv.includes('--static')) finish();

// ---------- Playwright：截图 + 运行时检查 ----------
const require = createRequire(join(repo, 'tools/shoot/package.json'));
const { chromium } = require('playwright');
const outDir = join(here, 'ref');
mkdirSync(outDir, { recursive: true });
const fileUrl = pathToFileURL(join(here, 'index.html')).href;
const viewports = { desktop: { width: 1440, height: 900 }, tablet: { width: 1024, height: 900 }, tabletSm: { width: 768, height: 1024 }, mobile: { width: 375, height: 812 } };
const FONTS = [['Inter Variable', 'Acme Console'], ['Noto Sans SC Variable', '智能助理'], ['JetBrains Mono Variable', 'SO-20260903-0087']];
const states = ['success', 'streaming', 'error', 'empty', 'loading'];
const extras = [
  ['success-c2', 'state=success&conversation=c_2'],
  ['success-c3', 'state=success&conversation=c_3'],
  ['success-c4', 'state=success&conversation=c_4'],
  ['success-c5', 'state=success&conversation=c_5'],
  ['success-c6-unavailable', 'state=success&conversation=c_6'],
  ['success-toast', 'state=success&conversation=c_2&toast=urgent&hold'],
  ['success-attach', 'state=success&attach'],
  ['success-model', 'state=success&open=model'],
  ['success-menu', 'state=success&conversation=c_3&open=menu'],
  ['success-delete', 'state=success&conversation=c_3&open=delete'],
  ['success-notifications', 'state=success&open=notifications'],
  ['success-account', 'state=success&open=account'],
];
const desktopOnly = [['success-scrolled', 'state=success&scrolled=up'], ['success-rail', 'state=success&sidebar=rail']];
const mobileOnly = [['success-sidebar', 'state=success&open=sidebar'], ['success-drawer', 'state=success&open=drawer']];
// 叠层变体截视口而非整页；桌面消息流在 .thread 内滚动，整页即视口
const isOverlay = (name) => /-(drawer|sidebar|menu|delete|model|notifications|account|toast)$/.test(name);
const perViewport = {
  desktop: [...states.map((s) => [s, `state=${s}`]), ...extras, ...desktopOnly],
  mobile: [...states.map((s) => [s, `state=${s}`]), ...extras, ...mobileOnly],
  tablet: [['success', 'state=success'], ['success-model', 'state=success&open=model'], ['success-expanded', 'state=success&sidebar=expanded']],
  tabletSm: [['success', 'state=success'], ['success-sidebar', 'state=success&open=sidebar'], ['success-drawer', 'state=success&open=drawer']],
};

const browser = await chromium.launch();
let shots = 0;
for (const [vpName, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, colorScheme: 'light', locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  for (const theme of ['light', 'dark']) {
    for (const [name, query] of perViewport[vpName]) {
      await page.goto(`${fileUrl}?${query}&theme=${theme}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(name.includes('unavailable') ? 700 : 300); // c_6 骨架 motion.slow 后转历史不可用
      if (theme === 'light' && name === 'success') {
        const loaded = await page.evaluate((fs) => fs.filter(([f, sample]) => document.fonts.check(`16px "${f}"`, sample)).map(([f]) => f), FONTS);
        ok(loaded.length === FONTS.length, `${vpName}: 字体已加载 ${FONTS.map(([f]) => f).join(' / ')}${loaded.length === FONTS.length ? '' : ' → 仅 ' + (loaded.join(',') || '无')}`);
      }
      const m = await page.evaluate((w) => {
        const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && el.closest('[hidden]') === null && el.closest('[inert]') === null; };
        const small = [];
        for (const el of document.querySelectorAll('a, button, [role="option"], [role="menuitem"], input, textarea, summary')) {
          if (!vis(el)) continue;
          const r = el.getBoundingClientRect();
          if (r.width < w || r.height < w) small.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 12)}"`);
        }
        const overflow = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > innerWidth + 0.5 && getComputedStyle(el).position !== 'fixed' && !el.closest('.sidebar') && !el.closest('.convs') && !el.closest('.md-table') && !el.closest('.code') && !el.closest('.chips-row')) overflow.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
        }
        return {
          sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, theme: document.documentElement.getAttribute('data-theme'),
          state: document.documentElement.getAttribute('data-state'), view: document.documentElement.getAttribute('data-view'), small, overflow: overflow.slice(0, 5),
        };
      }, 40);
      const file = join(outDir, `${vpName}-${theme}-${name}.png`);
      await page.screenshot({ path: file, fullPage: !isOverlay(name), animations: 'disabled' });
      shots++;
      let size = statSync(file).size;
      if (size >= 300 * 1024) {
        execFileSync('convert', [file, '-strip', '-dither', 'None', '-colors', '256', file]);
        size = statSync(file).size;
        console.log(`INFO ${vpName}-${theme}-${name}.png 量化为 PNG8 → ${(size / 1024).toFixed(0)}KB`);
      }
      const tag = `${vpName}-${theme}-${name}`;
      ok(m.sw <= vp.width && m.bw <= vp.width, `${tag}: scrollWidth=${m.sw}/${m.bw} ≤ ${vp.width}`);
      ok(m.overflow.length === 0, `${tag}: 无元素超出视口右缘${m.overflow.length ? ' → ' + m.overflow.join(' | ') : ''}`);
      ok(m.small.length === 0, `${tag}: 可点元素热区 ≥40×40${m.small.length ? ' → ' + m.small.join(' | ') : ''}`);
      ok(m.theme === theme && m.state === query.match(/state=(\w+)/)[1], `${tag}: data-theme/data-state 正确`);
      if (name.includes('unavailable')) ok(m.view === 'unavailable', `${tag}: c_6 转为历史不可用空态（data-view=${m.view}）`);
      ok(size < 300 * 1024, `${tag}.png ${(size / 1024).toFixed(0)}KB < 300KB`);
    }
  }
  ok(errors.length === 0, `${vpName}: console error = ${errors.length}${errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();

// ---------- 交互 / 键盘 / 文案极值（1440 亮色 + 375）----------
{
  const b2 = await chromium.launch();
  const page = await b2.newPage({ viewport: viewports.desktop });
  const go = async (q) => { await page.goto(`${fileUrl}?${q}`); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250); };
  await go('state=success&theme=light');
  await page.keyboard.press('Tab');
  ok((await page.evaluate(() => document.activeElement.className)).includes('skip'), 'Tab 首焦点为跳转链接');
  // 会话列表：分组 / 当前项 / 未读点 / 搜索过滤
  const list = await page.evaluate(() => ({
    groups: [...document.querySelectorAll('#convList .grp-label')].map((g) => g.firstChild.textContent),
    items: document.querySelectorAll('#convList .citem').length,
    current: document.querySelector('#convList [aria-current="page"]')?.closest('.citem').getAttribute('data-id'),
    unread: [...document.querySelectorAll('#convList .citem[data-unread="true"]')].map((c) => c.getAttribute('data-id')),
  }));
  ok(list.groups.join('/') === '今天/本周/更早' && list.items === 7, `会话列表 3 组 / 7 会话（${list.groups.join('/')}，${list.items}）`);
  ok(list.current === 'c_1' && list.unread.join() === 'c_3', `当前会话 c_1、未读 c_3（${list.current} / ${list.unread}）`);
  await page.fill('#convSearch', '加急');
  ok((await page.evaluate(() => document.querySelectorAll('#convList .citem').length)) === 1, '搜索「加急」过滤为 1 条');
  await page.fill('#convSearch', '不存在的会话');
  ok((await page.textContent('#convList')).includes('没有匹配的会话'), '搜索无结果显示「没有匹配的会话」');
  await page.fill('#convSearch', '');
  // 消息流：Markdown 表格 / 代码块复制 / 来源 Chip 指向真实订单 / 工具卡折叠
  const thread = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('#log .sources a.chip.is-order[href]')].map((a) => a.getAttribute('href'));
    return {
      tables: document.querySelectorAll('#log .md-table table').length, code: document.querySelectorAll('#log .code pre').length, copy: document.querySelectorAll('#log .code-copy').length,
      sources: ids, tools: [...document.querySelectorAll('#log details.tool')].map((d) => d.getAttribute('data-status') + (d.open ? ':open' : ':closed')),
      role: document.getElementById('log').getAttribute('role'), live: document.getElementById('log').getAttribute('aria-live'), datesep: document.querySelectorAll('#log .datesep').length,
    };
  });
  ok(thread.tables >= 1 && thread.code >= 1 && thread.copy === thread.code, `c_1 含 Markdown 表格 ${thread.tables} 张、代码块 ${thread.code} 个（含复制按钮）`);
  const orderIds = new Set(ordersAll.map((o) => o.id));
  const linked = thread.sources.filter((h) => /SO-\d{8}-\d{4}/.test(h));
  ok(linked.length >= 3 && linked.every((h) => orderIds.has(h.match(/SO-\d{8}-\d{4}/)[0])), `来源 Chip ${linked.length} 个订单链接全部存在于 orders-all（${linked.join(' ')}）`);
  ok(thread.tools.length >= 1 && thread.tools.every((t) => t.startsWith('done:closed')), `工具调用卡默认折叠且状态 done（${thread.tools.join(',')}）`);
  ok(thread.role === 'log' && thread.live === 'polite' && thread.datesep >= 1, 'role=log + aria-live=polite + 日期分隔');
  await page.click('#log details.tool summary');
  ok(await page.evaluate(() => document.querySelector('#log details.tool').open), '点击工具卡 summary 展开');
  await page.click('#log .code-copy');
  ok((await page.getAttribute('#log .code-copy', 'aria-pressed')) === 'true', '复制代码 → aria-pressed=true / 「已复制」');
  // 输入区：禁用发送 / 自增 / Enter 发送 → streaming / 停止 / 模型 Select / 附件
  ok(await page.isDisabled('#sendBtn'), '空输入时发送按钮 disabled');
  const h0 = await page.evaluate(() => document.getElementById('msgInput').offsetHeight);
  await page.fill('#msgInput', '第一行\n第二行\n第三行\n第四行');
  const h1 = await page.evaluate(() => document.getElementById('msgInput').offsetHeight);
  ok(h1 > h0 && !(await page.isDisabled('#sendBtn')), `Textarea 自增（${h0} → ${h1}）且发送可用`);
  await page.fill('#msgInput', 'x'.repeat(2001));
  ok((await page.isDisabled('#sendBtn')) && (await page.evaluate(() => document.getElementById('counter').classList.contains('is-over'))), '超过 2000 字：计数变警示、发送禁用');
  await page.fill('#msgInput', '那就帮我建采购单草稿吧');
  await page.keyboard.press('Enter');
  ok((await page.getAttribute('html', 'data-state')) === 'streaming' && (await page.getAttribute('#log', 'aria-busy')) === 'true' && !(await page.isHidden('#stopBtn')), 'Enter 发送 → streaming（aria-busy、停止生成按钮）');
  await page.click('#stopBtn');
  ok((await page.getAttribute('html', 'data-state')) === 'success', '停止生成 → success');
  await page.click('#modelBtn');
  ok(!(await page.isHidden('#modelPop')) && (await page.evaluate(() => document.querySelectorAll('#modelPop [role="option"]').length)) === 2, '模型 Select 打开，2 个选项');
  await page.waitForTimeout(100);
  await page.click('#modelPop [data-key="deep"]');
  ok((await page.textContent('#modelLabel')).trim() === '深度分析' && (await page.isHidden('#modelPop')), '选择「深度分析」后关闭并更新触发器');
  await page.click('#attachBtn');
  ok(!(await page.isHidden('#attRow')) && (await page.textContent('#attRow')).includes('.csv'), '附件按钮 → 附件 Chip');
  await page.click('#attRow [data-remove]');
  ok((await page.isHidden('#attRow')) && (await page.evaluate(() => document.activeElement.id)) === 'attachBtn', '移除附件后焦点回附件按钮');
  // 建议 Chip → 对应会话；空态 4 建议卡；新建会话 → 空态
  await page.click('#chips .chip[data-key="overdue"]');
  ok((await page.getAttribute('html', 'data-conversation')) === 'c_3', '建议 Chip「待发货超 48 小时」→ c_3');
  await page.click('#newBtn');
  ok((await page.getAttribute('html', 'data-state')) === 'empty' && (await page.evaluate(() => document.querySelectorAll('#suggGrid .sugg-card').length)) === 4, '新建会话 → 空态 + 4 建议卡');
  // 错误态重试 → streaming；忽略 → success
  await go('state=error&theme=light');
  ok((await page.evaluate(() => document.querySelector('#log [role="alert"]') !== null)), '错误态 role=alert');
  await page.click('#retryBtn');
  ok((await page.getAttribute('html', 'data-state')) === 'streaming', '错误态点击重试 → streaming');
  await go('state=error&theme=light');
  await page.click('#dismissBtn');
  ok((await page.getAttribute('html', 'data-state')) === 'success', '错误态点击忽略 → success');
  // 会话菜单 / 删除 Dialog 键盘
  await go('state=success&theme=light');
  await page.hover('#convList .citem[data-id="c_3"]');
  await page.click('#convList .citem[data-id="c_3"] .citem-more');
  ok(!(await page.isHidden('#convMenu')) && (await page.evaluate(() => document.activeElement.closest('#convMenu') !== null)), '会话 ⋯ 菜单打开且焦点进入');
  await page.keyboard.press('Escape');
  ok((await page.isHidden('#convMenu')) && (await page.evaluate(() => document.activeElement.classList.contains('citem-more'))), 'Escape 关闭菜单、焦点回 ⋯');
  await page.click('#convList .citem[data-id="c_3"] .citem-more');
  await page.click('#convMenu [data-action="delete"]');
  ok(!(await page.isHidden('#deleteDlg')) && (await page.evaluate(() => document.activeElement.id)) === 'dlgCancel' && (await page.textContent('#dlgTitle')).includes('待发货超 48 小时的订单'), '删除 Dialog 打开、焦点在「取消」、标题含会话名');
  await page.keyboard.press('Escape');
  ok((await page.isHidden('#deleteDlg')) && (await page.evaluate(() => document.activeElement.classList.contains('citem-more'))), 'Escape 关闭 Dialog、焦点回 ⋯');
  await page.click('#convList .citem[data-id="c_3"] .citem-more');
  await page.click('#convMenu [data-action="delete"]');
  await page.click('#dlgConfirm');
  ok((await page.evaluate(() => document.querySelectorAll('#convList .citem').length)) === 6, '确认删除 → 列表剩 6 条');
  // 通知 / 主题 / 侧栏
  await page.click('#bellBtn');
  ok(!(await page.isHidden('#notifPop')), '铃铛打开通知 Popover');
  await page.keyboard.press('Escape');
  ok((await page.isHidden('#notifPop')) && (await page.evaluate(() => document.activeElement.id)) === 'bellBtn', 'Escape 关闭通知、焦点回铃铛');
  await page.click('#themeBtn');
  ok((await page.getAttribute('html', 'data-theme')) === 'dark', '主题按钮切换为暗色');
  await page.click('#collapseBtn');
  await page.waitForTimeout(400);
  ok((await page.evaluate(() => document.getElementById('sidebar').getBoundingClientRect().width)) === 64, '侧栏收起为 64 图标栏');
  // 默认贴底：错误卡与「重试」在首屏可见；「回到最新消息」隐藏
  await go('state=error&theme=light');
  const pin = await page.evaluate(() => { const th = document.getElementById('thread'); const r = document.getElementById('retryBtn').getBoundingClientRect(); const t = th.getBoundingClientRect(); return { gap: th.scrollHeight - th.clientHeight - th.scrollTop, retryIn: r.top >= t.top && r.bottom <= t.bottom, tb: document.getElementById('toBottom').hidden }; });
  ok(pin.gap < 1 && pin.retryIn && pin.tb, `error 态贴底、「重试」在视口内、无「回到最新消息」（gap=${pin.gap}）`);
  // 「回到最新消息」
  await go('state=success&theme=light&scrolled=up');
  ok(!(await page.isHidden('#toBottom')), '滚到顶部显示「回到最新消息」');
  await page.click('#toBottom');
  await page.waitForTimeout(600);
  ok(await page.isHidden('#toBottom'), '点击后回到底部并隐藏按钮');
  // c_6 历史不可用：骨架 → 空态 → 返回今天
  await go('state=success&theme=light&conversation=c_6');
  await page.waitForTimeout(500);
  ok((await page.getAttribute('html', 'data-view')) === 'unavailable' && (await page.textContent('#unavailDesc')).includes('6 条消息'), 'c_6 → 历史不可用空态（6 条消息）');
  await page.click('#backTodayBtn');
  ok((await page.getAttribute('html', 'data-conversation')) === 'c_1', '「返回今天的会话」→ c_1');
  // 焦点环 2px
  await page.focus('#convSearch');
  const ring = await page.evaluate(() => { const cs = getComputedStyle(document.getElementById('convSearch')); return [cs.outlineWidth, cs.outlineStyle]; });
  ok(ring[0] === '2px' && ring[1] === 'solid', `搜索框 :focus-visible 焦点环 = ${ring.join(' ')}`);
  await page.focus('#msgInput');
  await page.waitForTimeout(250);
  const taRing = await page.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('.composer .box'));
    const probe = document.createElement('span'); probe.style.color = 'var(--color-role-primary)'; document.body.appendChild(probe);
    const primary = getComputedStyle(probe).color; probe.remove();
    return [cs.borderColor, cs.boxShadow !== 'none', primary];
  });
  ok(taRing[1] && taRing[0] === taRing[2], `输入区 :focus-within 主色边框 + 光环（${taRing[0]} = primary ${taRing[2]}）`);

  // 文案极值：最长会话名 / 最长金额 / 长订单号列表 不撑破 375 与 280 会话栏
  const LONG_TITLE = '双 11 预售上架清单（含床头柜、遮光窗帘、羊羔绒抱枕、藤编脏衣篓与白橡木三门衣柜的库存与到货排期复核）';
  const ext = await page.evaluate((t) => {
    const a = document.querySelector('#convList .citem[data-id="c_6"] .citem-title > span'); a.textContent = t;
    const li = a.closest('.citem').getBoundingClientRect(); const convs = document.getElementById('convs').getBoundingClientRect();
    const b = document.querySelector('#log .msg.me .bubble'); b.textContent = '¥1,186,420,999.00 的采购单请按 SO-20260905-0115、SO-20260904-0075、SO-20260903-0087、SO-20260903-0118 的顺序加急';
    const bubble = b.getBoundingClientRect(); const th = document.getElementById('thread').getBoundingClientRect();
    return { liRight: Math.round(li.right), convsRight: Math.round(convs.right), lines: Math.round(a.getBoundingClientRect().height / parseFloat(getComputedStyle(a).lineHeight)), bubbleRight: Math.round(bubble.right), thRight: Math.round(th.right), sw: document.documentElement.scrollWidth };
  }, LONG_TITLE);
  ok(ext.liRight <= ext.convsRight && ext.lines === 1, `1440 最长会话名单行截断不撑破会话栏（行数 ${ext.lines}，${ext.liRight} ≤ ${ext.convsRight}）`);
  ok(ext.bubbleRight <= ext.thRight && ext.sw <= 1440, `1440 长金额 + 4 个订单号气泡不溢出（${ext.bubbleRight} ≤ ${ext.thRight}）`);

  const mob = await b2.newPage({ viewport: viewports.mobile });
  const gom = async (q) => { await mob.goto(`${fileUrl}?${q}`); await mob.evaluate(() => document.fonts.ready); await mob.waitForTimeout(300); };
  await gom('state=success&theme=light');
  const m375 = await mob.evaluate((t) => {
    const b = document.querySelector('#log .msg.me .bubble'); b.textContent = '¥1,186,420,999.00 的采购单请按 SO-20260905-0115、SO-20260904-0075、SO-20260903-0087、SO-20260903-0118 的顺序加急';
    const ids = [...document.querySelectorAll('#log .md p .ref-id')];
    return { sw: document.documentElement.scrollWidth, bubbleRight: Math.round(b.getBoundingClientRect().right), refWrapped: ids.filter((s) => s.getClientRects().length > 1).length, ids: ids.length,
      hintHidden: getComputedStyle(document.querySelector('.hint')).display === 'none', tableHint: [...document.querySelectorAll('#log .table-hint')].some((h) => h.classList.contains('is-visible')),
      convsOff: document.getElementById('convs').getBoundingClientRect().right <= 0 || getComputedStyle(document.getElementById('convs')).visibility === 'hidden',
      inert: document.getElementById('convs').inert && document.getElementById('sidebar').inert };
  }, LONG_TITLE);
  ok(m375.sw <= 375 && m375.bubbleRight <= 375, `375 长金额 + 4 个订单号气泡不溢出（sw=${m375.sw} right=${m375.bubbleRight}）`);
  ok(m375.ids >= 3 && m375.refWrapped === 0, `375 正文 ${m375.ids} 个订单号均不折行（折行 ${m375.refWrapped}）`);
  ok(m375.hintHidden && m375.tableHint, '375 隐藏键盘提示、表格显示「左右滑动查看更多」');
  ok(m375.convsOff && m375.inert, '375 会话列表为离屏 Sheet（inert）、主导航抽屉 inert');
  // 375：Tab 走 20 步不落入离屏侧栏/Sheet；打开 Sheet → 焦点进入 → Escape 回触发器；点会话项关 Sheet
  const off = [];
  for (let i = 0; i < 20; i++) {
    await mob.keyboard.press('Tab');
    const f = await mob.evaluate(() => { const el = document.activeElement; const r = el.getBoundingClientRect(); return { bad: !!el.closest('#sidebar') || !!el.closest('#convs') || r.right <= 0 || r.width === 0, tag: el.tagName + '.' + [...el.classList].join('.') }; });
    if (f.bad) off.push(f.tag);
  }
  ok(off.length === 0, `375 Tab 走 20 步无屏外/Sheet 内焦点${off.length ? ' → ' + off.slice(0, 3).join(' | ') : ''}`);
  await mob.click('#convsOpen');
  await mob.waitForTimeout(350);
  ok((await mob.getAttribute('html', 'data-convs')) === 'open' && (await mob.evaluate(() => document.getElementById('convs').contains(document.activeElement))), '「打开会话列表」→ Sheet 打开、焦点进入');
  await mob.evaluate((t) => { document.querySelector('#convList .citem[data-id="c_6"] .citem-title > span').textContent = t; }, LONG_TITLE);
  const sheet = await mob.evaluate(() => { const a = document.querySelector('#convList .citem[data-id="c_6"] .citem-title > span'); const c = document.getElementById('convs').getBoundingClientRect(); return { w: Math.round(c.width), aRight: Math.round(a.getBoundingClientRect().right), cRight: Math.round(c.right), sw: document.documentElement.scrollWidth }; });
  ok(sheet.sw <= 375 && sheet.aRight <= sheet.cRight, `375 Sheet 宽 ${sheet.w}，最长会话名不溢出（${sheet.aRight} ≤ ${sheet.cRight}）`);
  await mob.keyboard.press('Escape');
  await mob.waitForTimeout(350);
  ok((await mob.getAttribute('html', 'data-convs')) !== 'open' && (await mob.evaluate(() => document.activeElement.id)) === 'convsOpen', 'Escape 关闭 Sheet、焦点回「打开会话列表」');
  await mob.click('#convsOpen');
  await mob.waitForTimeout(350);
  await mob.click('#convList .citem[data-id="c_2"] .citem-link');
  await mob.waitForTimeout(350);
  ok((await mob.getAttribute('html', 'data-conversation')) === 'c_2' && (await mob.getAttribute('html', 'data-convs')) !== 'open' && (await mob.textContent('#curTitle')).includes('改加急'), '375 点会话项 → 切换 c_2 并关闭 Sheet、标题栏更新');
  await mob.click('#drawerOpen');
  await mob.waitForTimeout(350);
  ok((await mob.getAttribute('html', 'data-drawer')) === 'open' && (await mob.evaluate(() => document.getElementById('sidebar').contains(document.activeElement))), '375 汉堡 → 主导航抽屉打开、焦点进入');
  await mob.keyboard.press('Escape');
  await mob.waitForTimeout(350);
  ok((await mob.getAttribute('html', 'data-drawer')) !== 'open' && (await mob.evaluate(() => document.activeElement.id)) === 'drawerOpen', 'Escape 关闭抽屉、焦点回汉堡');
  // 375 输入区 sticky 底部、流式态 stop 可见；空态 4 卡纵向
  await gom('state=streaming&theme=light');
  const comp = await mob.evaluate(() => ({ stop: getComputedStyle(document.getElementById('stopBtn')).display !== 'none', send: getComputedStyle(document.getElementById('sendBtn')).display === 'none', pos: getComputedStyle(document.querySelector('.composer')).position, thOverflow: getComputedStyle(document.getElementById('thread')).overflowY }));
  ok(comp.stop && comp.send && comp.pos === 'static' && comp.thOverflow === 'visible', `375 streaming：停止生成可见、发送隐藏、输入区随文档流（IA：不遮长表；position=${comp.pos}）`);
  await gom('state=empty&theme=light');
  const cards = await mob.evaluate(() => [...document.querySelectorAll('#suggGrid .sugg-card')].map((c) => Math.round(c.getBoundingClientRect().width)));
  ok(cards.length === 4 && cards.every((w) => w === cards[0] && w > 300), `375 空态 4 建议卡单列（宽 ${cards[0]}）`);

  // 对比度：辅助文字 / 会话时间 / 免责声明 ≥ 4.5:1（亮/暗）
  const lum = (rgb) => { const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map((c) => { c = +c / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const contrast = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  for (const theme of ['light', 'dark']) {
    await go(`state=success&theme=${theme}`);
    const c = await page.evaluate(() => {
      const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const v = getComputedStyle(e).backgroundColor; if (v !== 'rgba(0, 0, 0, 0)' && v !== 'transparent') return v; } return getComputedStyle(document.body).backgroundColor; };
      return {
      meta: getComputedStyle(document.querySelector('#convList .citem-meta')).color, convsBg: bgOf(document.getElementById('convs')),
      disc: getComputedStyle(document.querySelector('#log .disclaimer')).color, mainBg: bgOf(document.querySelector('#log .disclaimer')),
      th: getComputedStyle(document.querySelector('#log .md-table th')).color, thBg: getComputedStyle(document.querySelector('#log .md-table th')).backgroundColor,
      me: getComputedStyle(document.querySelector('#log .msg.me .bubble')).color, meBg: getComputedStyle(document.querySelector('#log .msg.me .bubble')).backgroundColor,
    }; });
    const pairs = [['会话时间/列表背景', c.meta, c.convsBg], ['免责声明/消息流背景', c.disc, c.mainBg], ['表头/表头背景', c.th, c.thBg], ['用户气泡文字/气泡', c.me, c.meBg]];
    for (const [label, fg, bg] of pairs) { const r = contrast(fg, bg); ok(r >= 4.5, `${theme}: ${label} 对比度 = ${r.toFixed(2)}:1 ≥ 4.5`); }
  }
  await b2.close();
}

// 平板断点：1024 默认 rail + 会话栏仍并排；768 会话列表为 Sheet、主导航为抽屉
{
  const b3 = await chromium.launch();
  const t = await b3.newPage({ viewport: viewports.tablet });
  await t.goto(`${fileUrl}?state=success&theme=light`);
  await t.evaluate(() => document.fonts.ready);
  await t.waitForTimeout(250);
  const tm = await t.evaluate(() => ({ sidebar: document.documentElement.getAttribute('data-sidebar'), sw: document.documentElement.scrollWidth, convsW: Math.round(document.getElementById('convs').getBoundingClientRect().width), convsBtn: document.getElementById('convsOpen').getBoundingClientRect().width === 0, threadW: Math.round(document.getElementById('thread').getBoundingClientRect().width) }));
  ok(tm.sidebar === 'rail' && tm.sw <= 1024, `1024 侧边栏默认 = ${tm.sidebar}，scrollWidth = ${tm.sw}`);
  ok(tm.convsW === 280 && tm.convsBtn && tm.threadW >= 600, `1024 会话栏并排 280 宽、消息流 ${tm.threadW} 宽、无「打开会话列表」按钮`);
  const s = await b3.newPage({ viewport: viewports.tabletSm });
  await s.goto(`${fileUrl}?state=success&theme=light`);
  await s.evaluate(() => document.fonts.ready);
  await s.waitForTimeout(250);
  const sm = await s.evaluate(() => ({ sw: document.documentElement.scrollWidth, drawerBtn: getComputedStyle(document.getElementById('drawerOpen')).display !== 'none', convsBtn: getComputedStyle(document.getElementById('convsOpen')).display !== 'none', convsInert: document.getElementById('convs').inert, sidebarInert: document.getElementById('sidebar').inert }));
  ok(sm.sw <= 768 && sm.drawerBtn && sm.convsBtn && sm.convsInert && sm.sidebarInert, `768 抽屉模式 + 会话 Sheet（sw=${sm.sw}）`);
  await s.click('#convsOpen');
  await s.waitForTimeout(350);
  const sh = await s.evaluate(() => ({ open: document.documentElement.getAttribute('data-convs'), w: Math.round(document.getElementById('convs').getBoundingClientRect().width), scrim: getComputedStyle(document.getElementById('scrim')).display }));
  ok(sh.open === 'open' && sh.w === 320 && sh.scrim === 'block', `768 会话 Sheet 打开：宽 ${sh.w}（--size-sidebar-drawer）+ 遮罩`);
  await b3.close();
}

console.log(`INFO 基准图 ${shots} 张 → ${outDir}`);
finish();

function finish() {
  if (fails.length) { console.error(`\n${fails.length} 项未通过：\n- ${fails.join('\n- ')}`); process.exit(1); }
  console.log('\n全部通过');
  process.exit(0);
}
