// 阶段 3 门禁：design/hifi/orders
//   node design/hifi/orders/check.mjs          → 静态检查 + Playwright 截基准图到 ref/ + 运行时检查
//   node design/hifi/orders/check.mjs --static → 只跑静态检查
//   node design/hifi/orders/check.mjs --skip-shots → 跳过截图矩阵，只跑交互检查（调试用；提交前必须跑完整版）
// 依赖：pnpm install --filter @ui-gallery/shoot（playwright）；字体：pnpm install --filter shadcn-ui（@fontsource-variable/inter、noto-sans-sc、jetbrains-mono；未安装时门禁 FAIL）
// 视口：1440×900 与 375×812 全矩阵截图；1024×900（默认 rail、表格横滚）与 768×1024（侧栏抽屉、表格横滚）只截 success 与少数变体，但同样跑溢出/热区/控制台检查
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
const remEm = cssNoMedia.match(/(?<![\w-])\d*\.?\d+(rem|em|pt)\b/g) || [];
ok(remEm.length === 0, `页面 CSS 无 rem/em/pt 字面量（${remEm.length} 处）${remEm.length ? ': ' + remEm.join(',') : ''}`);
const mediaPx = [...styleBlock.matchAll(/@media[^{]*?(\d+)px/g)].map((m) => +m[1]);
const tokens = JSON.parse(readFileSync(join(repo, 'design/tokens.json'), 'utf8'));
const bpVals = Object.values(tokens.breakpoint).filter((b) => b && b.$value).map((b) => b.$value.value);
ok(mediaPx.every((v) => bpVals.includes(v) || bpVals.includes(v + 1)), `@media 断点仅用 tokens.breakpoint（${[...new Set(mediaPx)].join(',')} ⊂ ${bpVals.join(',')}）`);
const bodyHtml = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script[\s\S]*?<\/script>/g, '');
const inlineStyle = bodyHtml.match(/style="[^"]*"/g) || [];
ok(inlineStyle.length === 0, `标记内无 inline style（${inlineStyle.length} 处）`);
ok(!/lorem|ipsum|placeholder\.com|via\.placeholder|unsplash|张三|李四|<img/i.test(html), '无 lorem ipsum / 占位图 / 占位人名 / 位图');
ok(html.includes('href="../../tokens.css"'), '引用 ../../tokens.css');
const usedVars = [...new Set([...styleBlock.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]))].filter((v) => !v.startsWith('--hifi-') && v !== '--hue');
const tokensCss = readFileSync(join(repo, 'design/tokens.css'), 'utf8');
const missingVars = usedVars.filter((v) => !tokensCss.includes(`${v}:`));
ok(missingVars.length === 0, `页面引用的 ${usedVars.length} 个令牌变量均存在于 tokens.css${missingVars.length ? ' → 缺 ' + missingVars.join(',') : ''}`);

const inline = JSON.parse(html.match(/<script type="application\/json" id="data">(\{[\s\S]*?\})<\/script>/)[1]);
for (const k of Object.keys(inline)) {
  const file = JSON.parse(readFileSync(join(repo, 'mock', `${k}.json`), 'utf8'));
  ok(JSON.stringify(file) === JSON.stringify(inline[k]), `内联数据 ${k} 与 mock/${k}.json 一致`);
}
ok(inline['orders-all'].length === 50 && inline['orders-summary'].total === 731, '样本 50 单 / 服务端计数 731');
const content = readFileSync(join(repo, 'content/orders.md'), 'utf8') + readFileSync(join(repo, 'content/dashboard.md'), 'utf8');
for (const s of ['订单', '全渠道订单，数据更新于', '搜索订单号、买家、商品', '全部状态', '下单时间', '开始日期 – 结束日期', '今天', '近 7 天', '近 30 天', '渠道', '清除筛选', '导出', '列显示', '显示的列', '恢复默认', '新建订单',
  '订单列表', '订单号', '买家', '商品', '状态', '金额', '操作', '点击排序', '加急', '缺货', '查看详情', '标记发货', '标记加急', '取消加急', '复制订单号', '取消订单', '删除订单', '批量发货', '导出所选', '取消选择',
  '分页', '上一页', '下一页', '订单详情', '关闭详情', '手机号', '收货地址', '门店', '发货仓', '付款时间', '付款截止', '订单金额', '物流', '备注', '小计', '合计', '承运商', '运单号', '复制运单号',
  '尚未发货，暂无物流信息', '还没有备注', '添加内部备注，仅团队可见', '添加备注', '备注不超过 200 字', '买家将收到取消通知。此操作不可撤销。', '取消原因', '确认取消', '返回',
  '删除后订单将从列表与报表中移除，不可恢复。仅已取消订单可删除。', '删除', '撤销', '已复制', '操作失败，请重试', '正在加载订单', '没有符合条件的订单', '试试放宽筛选条件或更换关键词',
  '还没有订单', '接入销售渠道后，订单会每 15 分钟自动同步到这里', '接入渠道', '订单加载失败', '网络连接异常，请检查网络后重试', '重试', '筛选', '筛选订单',
  '全部标为已读', '查看全部通知', '暂无新通知', '个人资料', '账号安全', '切换团队空间', '帮助中心', '退出登录', '收起侧边栏', '展开侧边栏', '打开导航', '后续轮次提供', '未命名团队']) {
  ok(html.includes(s) && content.includes(s), `文案「${s}」来自 content/orders.md（壳文案 content/dashboard.md）`);
}
for (const s of ['共 {n} 单', '筛选出 {n} 单，共 {total} 单', '渠道 · {n}', '等 {n} 件', '订单 {id} 的更多操作', '已选 {n} 单', '第 {from}–{to} 条，共 {total} 条', '演示样本只包含前 {n} 页', '每页 {n} 条', '第 {n} 页', '当前页，第 {n} 页',
  '订单 {id}', '备注 · {n}', '退款原因：{reason}', '取消原因：{reason}', '取消订单 {id}？', '已付款订单会原路退回 ¥{amount}，买家将收到取消通知。此操作不可撤销。', '删除订单 {id}？',
  '订单 {id} 已取消', '订单 {id} 已删除', '订单 {id} 已标记发货', '订单 {id} 已标记加急', '正在导出 {n} 单，完成后发送到 {email}', '订单 {id}，{status}，{amount}', '查看 {n} 单']) {
  const parts = s.split(/\{\w+\}/).filter((p) => p.trim());
  ok(content.includes(s) && parts.every((p) => html.includes(p.trim())), `模板文案「${s}」来自 content/orders.md 且页面拼接片段齐全`);
}

if (process.argv.includes('--static')) finish();

// ---------- Playwright：截图 + 运行时检查 ----------
const require = createRequire(join(repo, 'tools/shoot/package.json'));
const { chromium } = require('playwright');
const outDir = join(here, 'ref');
mkdirSync(outDir, { recursive: true });
const fileUrl = pathToFileURL(join(here, 'index.html')).href;
const viewports = { desktop: { width: 1440, height: 900 }, tablet: { width: 1024, height: 900 }, tabletSm: { width: 768, height: 1024 }, mobile: { width: 375, height: 812 } };
const FONTS = [['Inter Variable', 'Acme Console'], ['Noto Sans SC Variable', '订单列表'], ['JetBrains Mono Variable', 'SO-20260906-0108']];
const states = ['success', 'loading', 'empty-filtered', 'empty-new', 'error'];
const extras = [
  ['success-drawer', 'state=success&open=drawer'],
  ['success-drawer-logistics', 'state=success&open=drawer&order=SO-20260906-0095&tab=logistics'],
  ['success-drawer-remarks', 'state=success&open=drawer&tab=remarks'],
  ['success-dialog-cancel', 'state=success&open=dialog-cancel'],
  ['success-dialog-delete', 'state=success&open=dialog-delete'],
  ['success-order-menu', 'state=success&open=order-menu&order=SO-20260906-0108'],
  ['success-selected', 'state=success&selected=3'],
  ['success-sorted-amount', 'state=success&sort=amount&dir=desc'],
  ['success-toast-deleted', 'state=success&toast=deleted'],
  ['success-toast-export', 'state=success&toast=export'],
];
const desktopOnly = [
  ['success-channels', 'state=success&open=channels'],
  ['success-columns', 'state=success&open=columns'],
  ['success-date', 'state=success&open=date'],
  ['success-notifications', 'state=success&open=notifications'],
  ['success-rail', 'state=success&sidebar=rail'],
];
const mobileOnly = [
  ['success-filter-sheet', 'state=success&open=filter-sheet'],
  ['success-nav', 'state=success&open=nav'],
];
// 叠层变体（fixed Drawer / Dialog / Sheet / 菜单 / Popover / Toast）截视口而非整页
const isOverlay = (name) => /-(drawer|drawer-logistics|drawer-remarks|dialog-cancel|dialog-delete|order-menu|toast-deleted|toast-export|channels|columns|date|notifications|filter-sheet|nav)$/.test(name);
const perViewport = {
  desktop: [...states.map((s) => [s, `state=${s}`]), ...extras, ...desktopOnly],
  mobile: [...states.map((s) => [s, `state=${s}`]), ...extras, ...mobileOnly],
  tablet: [['success', 'state=success'], ['success-drawer', 'state=success&open=drawer'], ['success-expanded', 'state=success&sidebar=expanded']],
  tabletSm: [['success', 'state=success'], ['success-drawer', 'state=success&open=drawer'], ['success-nav', 'state=success&open=nav']],
};

const browser = await chromium.launch();
let shots = 0;
const skipShots = process.argv.includes('--skip-shots');
for (const [vpName, vp] of skipShots ? [] : Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, colorScheme: 'light', locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  const list = perViewport[vpName];
  for (const theme of ['light', 'dark']) {
    for (const [name, query] of list) {
      const url = `${fileUrl}?${query}&theme=${theme}`;
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(350);
      if (theme === 'light' && name === 'success') {
        const loaded = await page.evaluate((fs) => fs.filter(([f, sample]) => document.fonts.check(`16px "${f}"`, sample)).map(([f]) => f), FONTS);
        ok(loaded.length === FONTS.length, `${vpName}: 字体已加载 ${FONTS.map(([f]) => f).join(' / ')}${loaded.length === FONTS.length ? '' : ' → 仅 ' + (loaded.join(',') || '无')}`);
      }
      const m = await page.evaluate((w) => {
        const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && el.closest('[hidden]') === null && !el.closest('[inert]'); };
        const small = [];
        for (const el of document.querySelectorAll('a, button, [role="tab"], [role="menuitem"], input, select, textarea, tr[tabindex]')) {
          if (!vis(el)) continue;
          const r = el.getBoundingClientRect();
          if (r.width < w || r.height < w) small.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 12)}"`);
        }
        const overflow = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > innerWidth + 0.5 && getComputedStyle(el).position !== 'fixed' && !el.closest('.sidebar') && !el.closest('.table-wrap') && !el.closest('.drawer, .sheet, .dialog, .toast')) overflow.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
        }
        return {
          sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, theme: document.documentElement.getAttribute('data-theme'),
          state: document.documentElement.getAttribute('data-state'), small, overflow: overflow.slice(0, 5),
        };
      }, 40);
      const file = join(outDir, `${vpName}-${theme}-${name}.png`);
      await page.screenshot({ path: file, fullPage: !isOverlay(name), animations: 'disabled' });
      shots++;
      let size = statSync(file).size;
      if (size >= 300 * 1000) {
        execFileSync('convert', [file, '-strip', '-dither', 'None', '-colors', '256', file]);
        size = statSync(file).size;
        console.log(`INFO ${vpName}-${theme}-${name}.png 量化为 PNG8 → ${(size / 1024).toFixed(0)}KB`);
      }
      ok(m.sw <= vp.width && m.bw <= vp.width, `${vpName}-${theme}-${name}: scrollWidth=${m.sw}/${m.bw} ≤ ${vp.width}`);
      ok(m.overflow.length === 0, `${vpName}-${theme}-${name}: 无元素超出视口右缘${m.overflow.length ? ' → ' + m.overflow.join(' | ') : ''}`);
      ok(m.small.length === 0, `${vpName}-${theme}-${name}: 可点元素热区 ≥40×40${m.small.length ? ' → ' + m.small.join(' | ') : ''}`);
      ok(m.theme === theme && m.state === query.match(/state=([\w-]+)/)[1], `${vpName}-${theme}-${name}: data-theme/data-state 正确`);
      ok(size < 300 * 1000, `${vpName}-${theme}-${name}.png ${(size / 1024).toFixed(0)}KB < 300KB`);
    }
  }
  ok(errors.length === 0, `${vpName}: console error = ${errors.length}${errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();

// ---------- 交互 / 键盘 / 数据契约（1440 亮色） ----------
{
  const b2 = await chromium.launch();
  const page = await b2.newPage({ viewport: viewports.desktop });
  await page.goto(`${fileUrl}?state=success&theme=light`);
  await page.evaluate(() => document.fonts.ready);
  await page.keyboard.press('Tab');
  ok((await page.evaluate(() => document.activeElement.className)).includes('skip'), 'Tab 首焦点为跳转链接');

  // 别名与非法值
  await page.goto(`${fileUrl}?state=empty&theme=light`);
  ok((await page.getAttribute('html', 'data-state')) === 'empty-filtered', '?state=empty → empty-filtered');
  await page.goto(`${fileUrl}?state=empty-filter&theme=light`);
  ok((await page.getAttribute('html', 'data-state')) === 'empty-filtered', '?state=empty-filter → empty-filtered');
  await page.goto(`${fileUrl}?state=whatever&theme=light`);
  ok((await page.getAttribute('html', 'data-state')) === 'success', '非法 state → success');

  // 计数 / 分页契约（orders-summary，不用样本行数）
  await page.goto(`${fileUrl}?state=success&theme=light`);
  const pg = await page.evaluate(() => ({
    count: document.getElementById('count').textContent.replace(/\s+/g, ' ').trim(), range: document.getElementById('range').textContent, rows: document.querySelectorAll('#rows tr').length,
    pages: [...document.querySelectorAll('#pages .page-btn[data-page]')].map((b) => b.textContent + (b.getAttribute('aria-disabled') === 'true' ? '!' : '')).join(' '),
    tip: document.querySelector('#pages .page-btn[aria-disabled="true"][data-page]')?.getAttribute('data-tip'),
    sort: document.querySelector('th[aria-sort="descending"] .sort-btn')?.getAttribute('data-sort'),
  }));
  ok(pg.count === '共 731 单' && pg.range === '第 1–20 条，共 731 条' && pg.rows === 20, `默认视图：${pg.count} / ${pg.range} / ${pg.rows} 行`);
  ok(pg.pages === '1 2 3 4! 37!' && pg.tip === '演示样本只包含前 3 页', `页码 = ${pg.pages}；不可达页 Tooltip「${pg.tip}」`);
  ok(pg.sort === 'placedAt', `默认排序 = placedAt 降序（${pg.sort}）`);
  const firstId = await page.textContent('#rows tr:first-child .order-id');
  ok(firstId === 'SO-20260906-0108', `首行 = ${firstId}（placedAt 倒序，与 dashboard 最近订单一致）`);
  await page.click('#pages .page-btn[data-page="3"]');
  const p3 = await page.evaluate(() => ({ range: document.getElementById('range').textContent, rows: document.querySelectorAll('#rows tr').length, next: document.querySelector('#pages [data-nav="next"]').getAttribute('aria-disabled') }));
  ok(p3.range === '第 41–50 条，共 731 条' && p3.rows === 10 && p3.next === 'true', `第 3 页：${p3.range}，${p3.rows} 行，下一页禁用`);
  await page.selectOption('#sizeSel', '50');
  const p50 = await page.evaluate(() => ({ range: document.getElementById('range').textContent, rows: document.querySelectorAll('#rows tr').length, pages: [...document.querySelectorAll('#pages .page-btn[data-page]')].map((b) => b.textContent).join(' ') }));
  ok(p50.range === '第 1–50 条，共 731 条' && p50.rows === 50 && p50.pages === '1 2 15', `每页 50：${p50.range}，页码 ${p50.pages}`);

  // 排序
  await page.goto(`${fileUrl}?state=success&theme=light`);
  await page.click('th[data-col="amount"] .sort-btn');
  let amt = await page.evaluate(() => [...document.querySelectorAll('#rows .cell-amount')].map((c) => +c.textContent.replace(/[¥,]/g, '')));
  ok(amt.every((v, i) => i === 0 || v <= amt[i - 1]) && amt[0] === 5374, `金额一次点击 → 降序（首行 ¥${amt[0].toLocaleString('en-US')}）`);
  await page.click('th[data-col="amount"] .sort-btn');
  amt = await page.evaluate(() => [...document.querySelectorAll('#rows .cell-amount')].map((c) => +c.textContent.replace(/[¥,]/g, '')));
  ok(amt.every((v, i) => i === 0 || v >= amt[i - 1]), '金额二次点击 → 升序');
  ok((await page.getAttribute('th[data-col="amount"]', 'aria-sort')) === 'ascending' && (await page.getAttribute('th[data-col="placedAt"]', 'aria-sort')) === 'none', 'aria-sort 随排序切换');

  // 选择 → 批量条
  await page.click('#rows tr:nth-child(1) .chk');
  await page.click('#rows tr:nth-child(2) .chk');
  const sel = await page.evaluate(() => ({ bulk: document.getElementById('bulk').classList.contains('is-visible'), text: document.getElementById('bulkCount').textContent, ind: document.getElementById('selectAll').indeterminate }));
  ok(sel.bulk && sel.text === '已选 2 单' && sel.ind, `选 2 行 → 批量条「${sel.text}」，全选半选`);
  await page.click('#selectAll');
  ok((await page.textContent('#bulkCount')) === '已选 20 单', '全选本页 → 已选 20 单');
  await page.click('#bulkClear');
  ok(!(await page.evaluate(() => document.getElementById('bulk').classList.contains('is-visible'))), '取消选择 → 批量条隐藏');

  // 筛选：状态 / 渠道 / 搜索 → 计数取 summary；无结果 → empty-filtered；清除 → 回 success
  await page.selectOption('#statusSel', 'pending_shipment');
  ok((await page.evaluate(() => document.getElementById('count').textContent.replace(/\s+/g, ' ').trim())) === '筛选出 63 单，共 731 单', '状态=待发货 → 筛选出 63 单，共 731 单');
  await page.selectOption('#statusSel', 'all');
  await page.click('#channelBtn');
  await page.click('#channelOpts input[value="tmall"]');
  ok((await page.textContent('#channelVal')) === '渠道 · 1' && (await page.evaluate(() => document.getElementById('count').textContent.replace(/\s+/g, ' ').trim())) === '筛选出 262 单，共 731 单', '渠道=天猫 → 渠道 · 1，筛选出 262 单');
  await page.keyboard.press('Escape');
  await page.fill('#searchInput', '不存在的商品');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-state') === 'empty-filtered');
  ok(true, '搜索无结果 → empty-filtered（工具栏保留筛选值）');
  ok((await page.inputValue('#searchInput')) === '不存在的商品' && (await page.isVisible('#clearFilters')), '空态工具栏保留搜索词并显示「清除筛选」');
  await page.click('#emptyClear');
  ok((await page.getAttribute('html', 'data-state')) === 'success' && (await page.evaluate(() => document.getElementById('count').textContent.replace(/\s+/g, ' ').trim())) === '共 731 单', '清除筛选 → success，共 731 单');

  // 列显示
  await page.click('#columnsBtn');
  await page.click('#columnOpts input[value="channel"]');
  ok((await page.evaluate(() => getComputedStyle(document.querySelector('th[data-col="channel"]')).display)) === 'none', '取消勾选「渠道」→ 列隐藏');
  ok(await page.evaluate(() => document.querySelector('#columnOpts input[value="id"]').disabled && document.querySelector('#columnOpts input[value="status"]').disabled), '订单号 / 状态列固定不可隐藏');
  await page.click('#columnsReset');
  ok((await page.evaluate(() => getComputedStyle(document.querySelector('th[data-col="channel"]')).display)) !== 'none', '恢复默认 → 列恢复');
  await page.keyboard.press('Escape');

  // 行菜单按状态
  await page.goto(`${fileUrl}?state=success&theme=light`);
  const menuFor = async (id) => {
    await page.click(`.order-more[data-id="${id}"]`);
    const r = await page.evaluate(() => [...document.querySelectorAll('#orderMenu [data-action]')].filter((b) => !b.hidden).map((b) => b.getAttribute('data-action')).join(','));
    await page.keyboard.press('Escape');
    return r;
  };
  ok((await menuFor('SO-20260906-0108')) === 'view,ship,urgent,copy,cancel', '待发货菜单 = 查看/发货/加急/复制/取消');
  ok((await menuFor('SO-20260906-0107')) === 'view,copy,cancel', '待付款菜单 = 查看/复制/取消');
  ok((await menuFor('SO-20260906-0095')) === 'view,copy', '已发货菜单 = 查看/复制');
  await page.goto(`${fileUrl}?state=success&theme=light&size=50`);
  ok((await menuFor('SO-20260906-0077')) === 'view,copy,delete', '已取消菜单 = 查看/复制/删除');
  await page.click('.order-more[data-id="SO-20260906-0077"]');
  await page.keyboard.press('ArrowDown');
  ok((await page.evaluate(() => document.activeElement.getAttribute('data-action'))) === 'copy', '菜单 ArrowDown 跳过隐藏项 → 复制订单号');
  await page.keyboard.press('End');
  ok((await page.evaluate(() => document.activeElement.getAttribute('data-action'))) === 'delete', '菜单 End → 删除订单');
  await page.keyboard.press('Escape');
  ok((await page.evaluate(() => document.activeElement.getAttribute('data-id'))) === 'SO-20260906-0077', 'Escape 关闭菜单，焦点回 ⋯ 按钮');

  // Drawer：打开 / Tabs / 焦点圈定 / Esc 回焦
  await page.goto(`${fileUrl}?state=success&theme=light`);
  await page.click('#rows tr[data-id="SO-20260905-0115"]');
  await page.waitForTimeout(300);
  const dr = await page.evaluate(() => ({ open: document.documentElement.getAttribute('data-open'), id: document.getElementById('drawerId').textContent, focus: document.activeElement.id, inert: document.querySelector('.app').inert,
    tags: document.getElementById('drawerTags').textContent.trim(), remarks: document.getElementById('tabRemarks').textContent, ship: !document.querySelector('#drawerFoot [data-action="ship"]').hidden, del: document.querySelector('#drawerFoot [data-action="delete"]').hidden }));
  ok(dr.open === 'drawer' && dr.id === 'SO-20260905-0115' && dr.focus === 'drawerClose' && dr.inert, `点行打开 Drawer（${dr.id}），焦点在关闭按钮，主区 inert`);
  ok(dr.tags === '待发货缺货' && dr.remarks === '备注 · 1' && dr.ship && dr.del, `Drawer 标签「${dr.tags}」、Tab「${dr.remarks}」、底部有标记发货 / 无删除`);
  await page.click('#tabLogistics');
  ok((await page.textContent('#panelLogistics')).includes('尚未发货，暂无物流信息'), '待发货 → 物流 Tab 空态');
  await page.focus('#tabLogistics'); await page.keyboard.press('ArrowRight');
  ok((await page.evaluate(() => document.activeElement.id)) === 'tabRemarks' && !(await page.isHidden('#panelRemarks')), 'Tabs ArrowRight → 备注');
  ok((await page.textContent('#remarkList')).includes('何嘉豪'), '备注列表显示 mock 备注作者');
  const trapped = [];
  for (let i = 0; i < 30; i++) { await page.keyboard.press('Tab'); if (!(await page.evaluate(() => document.getElementById('drawer').contains(document.activeElement)))) trapped.push(i); }
  ok(trapped.length === 0, `Drawer 打开时 Tab 走 30 步焦点不逃出（逃出 ${trapped.length} 次）`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  ok(!(await page.getAttribute('html', 'data-open')) && (await page.evaluate(() => document.activeElement.getAttribute('data-id'))) === 'SO-20260905-0115', 'Escape 关闭 Drawer，焦点回触发行');
  await page.goto(`${fileUrl}?state=success&theme=light&open=drawer&order=SO-20260906-0095&tab=logistics`);
  ok((await page.textContent('#panelLogistics')).includes('顺丰速运') && (await page.textContent('#panelLogistics')).includes('SF1436 5528 7031'), '已发货 Drawer 物流 Tab 显示承运商 + 运单号');
  await page.goto(`${fileUrl}?state=success&theme=light&open=drawer&order=SO-20260906-0104&tab=logistics`);
  ok((await page.textContent('#panelLogistics')).includes('退款原因：尺寸拍错'), '退款中 Drawer 显示退款原因');
  await page.goto(`${fileUrl}?state=success&theme=light&open=drawer&order=SO-20260906-0099`);
  ok((await page.evaluate(() => document.querySelectorAll('#itemsList li').length)) === 4 && (await page.textContent('#itemsList li.tot .p')) === '¥297.00', '多商品订单 Drawer：2 行 + 小计 + 合计 ¥297.00');

  // Dialog：取消需选原因 → Toast；删除 → Toast + 撤销
  await page.goto(`${fileUrl}?state=success&theme=light`);
  await page.click('.order-more[data-id="SO-20260906-0107"]');
  await page.click('#orderMenu [data-action="cancel"]');
  ok((await page.getAttribute('html', 'data-open')) === 'dialog-cancel' && (await page.textContent('#dialogCancelId')) === 'SO-20260906-0107', '菜单取消订单 → 取消 Dialog');
  ok((await page.textContent('#dialogCancelDesc')) === '买家将收到取消通知。此操作不可撤销。', '待付款订单描述省略退款句');
  await page.click('#cancelConfirm');
  ok((await page.getAttribute('#cancelReason', 'aria-invalid')) === 'true' && (await page.getAttribute('html', 'data-open')) === 'dialog-cancel', '未选原因 → aria-invalid，不关闭');
  await page.selectOption('#cancelReason', '重复下单');
  await page.click('#cancelConfirm');
  await page.waitForTimeout(200);
  ok(!(await page.getAttribute('html', 'data-open')) && (await page.textContent('#toastText')) === '订单 SO-20260906-0107 已取消', 'Toast「订单 SO-20260906-0107 已取消」');
  ok((await page.textContent('tr[data-id="SO-20260906-0107"] td[data-col="status"] .tag')) === '已取消', '行状态变为已取消');
  await page.click('.order-more[data-id="SO-20260906-0107"]');
  await page.click('#orderMenu [data-action="delete"]');
  ok((await page.getAttribute('html', 'data-open')) === 'dialog-delete', '已取消订单 → 删除 Dialog');
  await page.click('#deleteConfirm');
  await page.waitForTimeout(200);
  ok((await page.evaluate(() => !document.querySelector('tr[data-id="SO-20260906-0107"]'))) && (await page.textContent('#toastText')) === '订单 SO-20260906-0107 已删除' && (await page.isVisible('#toastUndo')), '删除 → 行移除 + Toast 含撤销');
  await page.click('#toastUndo');
  ok(await page.evaluate(() => !!document.querySelector('tr[data-id="SO-20260906-0107"]')), '撤销 → 行恢复');
  await page.goto(`${fileUrl}?state=success&theme=light&open=dialog-cancel&order=SO-20260906-0108`);
  ok((await page.textContent('#dialogCancelDesc')).startsWith('已付款订单会原路退回 ¥4,276.00，'), '已付款订单取消描述含退款金额 ¥4,276.00');

  // 标记发货 / 加急 / 复制 / 导出 Toast
  await page.goto(`${fileUrl}?state=success&theme=light`);
  await page.click('.order-more[data-id="SO-20260906-0108"]');
  await page.click('#orderMenu [data-action="urgent"]');
  ok((await page.textContent('#toastText')) === '订单 SO-20260906-0108 已标记加急' && (await page.isVisible('tr[data-id="SO-20260906-0108"] .tag-urgent')), '标记加急 → Toast + 加急 Tag');
  await page.click('.order-more[data-id="SO-20260906-0108"]');
  await page.click('#orderMenu [data-action="ship"]');
  ok((await page.textContent('#toastText')) === '订单 SO-20260906-0108 已标记发货' && (await page.textContent('tr[data-id="SO-20260906-0108"] td[data-col="status"] .tag')) === '已发货', '标记发货 → Toast + 已发货');
  await page.click('#exportBtn');
  ok((await page.textContent('#toastText')) === '正在导出 731 单，完成后发送到 ruolin.shen@qimu-home.cn', '导出 Toast 含 731 单 + 邮箱');

  // 错误态：导出 / 列显示禁用；重试 → loading → success
  await page.goto(`${fileUrl}?state=error&theme=light`);
  ok((await page.isDisabled('#exportBtn')) && (await page.isDisabled('#columnsBtn')), '错误态工具栏保留但导出 / 列显示禁用');
  await page.click('#retryBtn');
  ok((await page.getAttribute('html', 'data-state')) === 'loading', '错误态重试 → loading');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-state') === 'success');
  ok(true, 'loading → success');
  await page.goto(`${fileUrl}?state=empty-new&theme=light`);
  const en = await page.evaluate(() => ({ actions: getComputedStyle(document.querySelector('.page-head .actions')).display, badge: getComputedStyle(document.querySelector('#nav .count-badge')).display, ws: document.getElementById('brandWs').textContent, sub: document.getElementById('subtitle').textContent }));
  ok(en.actions === 'none' && en.badge === 'none' && en.ws === '未命名团队' && en.sub === '全渠道订单', '新账号空态：无新建按钮 / 无角标 / 未命名团队 / 副标题无更新时间');

  // 未实现导航 aria-disabled + Tooltip；当前项
  await page.goto(`${fileUrl}?state=success&theme=light`);
  const navMeta = await page.evaluate(() => {
    const items = [...document.querySelectorAll('#nav .nav-item')];
    const dis = items.filter((a) => a.getAttribute('aria-disabled') === 'true');
    return { total: items.length, disabled: dis.length, withHref: dis.filter((a) => a.hasAttribute('href')).length, tip: dis.every((a) => a.getAttribute('data-tip') === '后续轮次提供'),
      cursor: dis.every((a) => getComputedStyle(a).cursor === 'not-allowed'), current: document.querySelector('#nav [aria-current="page"] .nav-label').textContent };
  });
  ok(navMeta.total === 8 && navMeta.disabled === 6 && navMeta.withHref === 0 && navMeta.current === '订单', `导航 8 项：当前=${navMeta.current}，未实现 ${navMeta.disabled} 项 aria-disabled 无 href`);
  ok(navMeta.tip && navMeta.cursor, '未实现导航项 Tooltip「后续轮次提供」+ cursor:not-allowed');
  await page.click('#collapseBtn');
  await page.waitForTimeout(400);
  ok((await page.evaluate(() => document.getElementById('sidebar').getBoundingClientRect().width)) === 64, '侧边栏收起 = 64（--size-sidebar-rail）');
  await page.click('#themeBtn');
  ok((await page.getAttribute('html', 'data-theme')) === 'dark', '主题按钮切换为暗色');
  const ring = await page.evaluate(() => { const i = document.getElementById('searchInput'); i.focus(); const cs = getComputedStyle(i); return [cs.outlineWidth, cs.outlineStyle]; });
  ok(ring[0] === '2px' && ring[1] === 'solid', `搜索框 :focus-visible 焦点环 = ${ring.join(' ')}`);

  // 文案极值：最长商品名 / 最长金额 / 长买家名（1440 表格不撑破，375 卡片不溢出）
  const LONG_NAME = '杭州栖木家居有限公司浙江省内采购中心周雅婷（大客户）';
  const LONG_ITEM = '新西兰羊毛地毯 1.6×2.3m（含防滑垫与定制包边服务，赠同色系抱枕两只）';
  await page.goto(`${fileUrl}?state=success&theme=light`);
  const ext = await page.evaluate(([n, it]) => {
    const tr = document.querySelector('#rows tr');
    tr.querySelector('.cell-customer .name').textContent = n; tr.querySelector('.cell-items').textContent = it; tr.querySelector('.cell-amount').textContent = '¥1,186,420.00';
    return { doc: document.documentElement.scrollWidth, items: tr.querySelector('.cell-items').getBoundingClientRect().width, ellipsis: getComputedStyle(tr.querySelector('.cell-items')).textOverflow, sw: document.getElementById('tableWrap').scrollWidth, cw: document.getElementById('tableWrap').clientWidth };
  }, [LONG_NAME, LONG_ITEM]);
  ok(ext.doc <= 1440 && ext.items <= 256 && ext.ellipsis === 'ellipsis', `1440 长商品名限宽 ${Math.round(ext.items)} ≤ 256 且省略；表格 ${ext.sw}/${ext.cw}`);

  const mob = await b2.newPage({ viewport: viewports.mobile });
  await mob.goto(`${fileUrl}?state=success&theme=light`);
  await mob.evaluate(() => document.fonts.ready);
  const mx = await mob.evaluate(([n, it]) => {
    const card = document.querySelector('#cards .order-card');
    card.querySelector('.oc-mid .name').textContent = n; card.querySelector('.oc-items').textContent = it; card.querySelector('.oc-bot .amount').textContent = '¥1,186,420.00';
    const cr = card.getBoundingClientRect().right;
    return { doc: document.documentElement.scrollWidth, over: [...card.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().right > cr + 0.5).map((e) => e.className).slice(0, 3), table: getComputedStyle(document.getElementById('tableWrap')).display, cards: getComputedStyle(document.getElementById('cards')).display };
  }, [LONG_NAME, LONG_ITEM]);
  ok(mx.table === 'none' && mx.cards === 'flex', '375 表格隐藏、卡片显示');
  ok(mx.doc <= 375 && mx.over.length === 0, `375 卡片长买家名 + 长商品名 + ¥1,186,420.00 不溢出（doc=${mx.doc}${mx.over.length ? ' over=' + mx.over.join(',') : ''}）`);

  // 375：筛选 Sheet 预览计数 / 应用；侧栏抽屉 inert；Drawer 底部上滑
  await mob.goto(`${fileUrl}?state=success&theme=light`);
  await mob.click('#filterBtn');
  await mob.waitForTimeout(300);
  ok((await mob.getAttribute('html', 'data-open')) === 'filter-sheet' && (await mob.evaluate(() => document.activeElement.id)) === 'sheetClose', '375 筛选按钮 → Sheet，焦点在关闭');
  await mob.click('#sheetStatus input[value="pending_shipment"]');
  ok((await mob.textContent('#sheetApply')) === '查看 63 单', 'Sheet 选待发货 → 主按钮「查看 63 单」');
  await mob.click('#sheetApply');
  await mob.waitForTimeout(300);
  ok(!(await mob.getAttribute('html', 'data-open')) && (await mob.textContent('#filterBtnText')) === '筛选 · 1' && (await mob.evaluate(() => document.getElementById('count').textContent.replace(/\s+/g, ' ').trim())) === '筛选出 63 单，共 731 单', '应用 → 筛选 · 1，筛选出 63 单');
  await mob.click('#cards .order-card .oc-main');
  await mob.waitForTimeout(350);
  const md = await mob.evaluate(() => { const r = document.getElementById('drawer').getBoundingClientRect(); return { open: document.documentElement.getAttribute('data-open'), bottom: Math.round(r.bottom), left: Math.round(r.left), w: Math.round(r.width) }; });
  ok(md.open === 'drawer' && md.bottom === 812 && md.left === 0 && md.w === 375, `375 Drawer 底部上滑全宽（bottom=${md.bottom} w=${md.w}）`);
  await mob.keyboard.press('Escape');
  await mob.waitForTimeout(300);
  const closed = await mob.evaluate(() => { const sb = document.getElementById('sidebar'); return { inert: sb.inert, vis: getComputedStyle(sb).visibility }; });
  ok(closed.inert && closed.vis === 'hidden', `375 侧栏抽屉关闭：inert=${closed.inert} visibility=${closed.vis}`);
  await mob.click('#navOpen');
  await mob.waitForTimeout(300);
  ok((await mob.getAttribute('html', 'data-nav')) === 'open' && (await mob.evaluate(() => document.getElementById('sidebar').contains(document.activeElement))), '375 汉堡 → 侧栏抽屉打开且焦点进入');
  await mob.keyboard.press('Escape');
  ok((await mob.evaluate(() => document.activeElement.id)) === 'navOpen', 'Escape 关闭抽屉，焦点回汉堡');

  // 对比度：未实现导航项文字 / 侧栏背景；表格辅助文字 / 表面（亮暗）
  const lum = (rgb) => { const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map((c) => { c = +c / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const contrast = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  for (const theme of ['light', 'dark']) {
    await page.goto(`${fileUrl}?state=success&theme=${theme}`);
    await page.waitForTimeout(200);
    const c = await page.evaluate(() => ({
      navFg: getComputedStyle(document.querySelector('#nav .nav-item[aria-disabled="true"]')).color, navBg: getComputedStyle(document.getElementById('sidebar')).backgroundColor,
      timeFg: getComputedStyle(document.querySelector('#rows .cell-time')).color, surf: getComputedStyle(document.querySelector('.card')).backgroundColor,
      thFg: getComputedStyle(document.querySelector('th')).color, thBg: getComputedStyle(document.querySelector('th')).backgroundColor,
      tagFg: getComputedStyle(document.querySelector('.tag-info')).color, tagBg: getComputedStyle(document.querySelector('.tag-info')).backgroundColor,
    }));
    ok(contrast(c.navFg, c.navBg) >= 4.5, `${theme}: 未实现导航项 / 侧栏 = ${contrast(c.navFg, c.navBg).toFixed(2)}:1 ≥ 4.5`);
    ok(contrast(c.timeFg, c.surf) >= 4.5, `${theme}: 下单时间辅助文字 / 表面 = ${contrast(c.timeFg, c.surf).toFixed(2)}:1 ≥ 4.5`);
    ok(contrast(c.thFg, c.thBg) >= 4.5, `${theme}: 表头 / 表头底 = ${contrast(c.thFg, c.thBg).toFixed(2)}:1 ≥ 4.5`);
    ok(contrast(c.tagFg, c.tagBg) >= 4.5, `${theme}: 待发货 Tag = ${contrast(c.tagFg, c.tagBg).toFixed(2)}:1 ≥ 4.5`);
  }
  await b2.close();
}

// ---------- 平板断点 ----------
{
  const b3 = await chromium.launch();
  const t = await b3.newPage({ viewport: viewports.tablet });
  await t.goto(`${fileUrl}?state=success&theme=light`);
  await t.evaluate(() => document.fonts.ready);
  await t.waitForTimeout(250);
  const tm = await t.evaluate(() => ({ sidebar: document.documentElement.getAttribute('data-sidebar'), sw: document.documentElement.scrollWidth, table: getComputedStyle(document.getElementById('tableWrap')).display, tw: document.getElementById('tableWrap').scrollWidth, tc: document.getElementById('tableWrap').clientWidth }));
  ok(tm.sidebar === 'rail', `1024 侧边栏默认 = ${tm.sidebar}`);
  ok(tm.sw <= 1024 && tm.table !== 'none', `1024 无整页横滚（${tm.sw}）且仍为表格（${tm.tw}/${tm.tc}${tm.tw > tm.tc ? '，表格容器内横滚' : ''}）`);
  const s = await b3.newPage({ viewport: viewports.tabletSm });
  await s.goto(`${fileUrl}?state=success&theme=light`);
  await s.evaluate(() => document.fonts.ready);
  await s.waitForTimeout(250);
  const sm = await s.evaluate(() => {
    const sb = document.getElementById('sidebar').getBoundingClientRect();
    return { sw: document.documentElement.scrollWidth, nav: getComputedStyle(document.getElementById('navOpen')).display !== 'none', off: sb.right <= 0 || sb.width === 0, table: getComputedStyle(document.getElementById('tableWrap')).display !== 'none',
      scrollable: document.getElementById('tableWrap').classList.contains('is-scrollable'), filter: getComputedStyle(document.getElementById('filterBtn')).display !== 'none', status: getComputedStyle(document.getElementById('statusSel').closest('.field')).display === 'none' };
  });
  ok(sm.sw <= 768, `768 documentElement.scrollWidth = ${sm.sw}`);
  ok(sm.nav && sm.off, '768 为侧栏抽屉模式（汉堡可见、侧栏离屏）');
  ok(sm.table && sm.scrollable, '768 仍为表格且容器内横滚（两侧渐隐）');
  ok(sm.filter && sm.status, '768 工具栏折叠：显示「筛选」按钮、隐藏状态 Select');
  const off = [];
  for (let i = 0; i < 20; i++) {
    await s.keyboard.press('Tab');
    const f = await s.evaluate(() => { const el = document.activeElement; const r = el.getBoundingClientRect(); return { inSidebar: !!el.closest('#sidebar'), off: r.right <= 0 || r.width === 0, tag: el.tagName + '.' + [...el.classList].join('.') }; });
    if (f.inSidebar || f.off) off.push(f.tag);
  }
  ok(off.length === 0, `768 抽屉关闭：Tab 走 20 步无屏外/侧栏内焦点${off.length ? ' → ' + off.slice(0, 3).join(' | ') : ''}`);
  await b3.close();
}

const pngs = readdirSync(outDir).filter((f) => f.endsWith('.png'));
console.log(`\nref/*.png = ${pngs.length} 张（本次新截 ${shots}）`);
finish();

function finish() {
  console.log(`\n${fails.length === 0 ? '全部通过' : `失败 ${fails.length} 项`}`);
  process.exit(fails.length ? 1 : 0);
}
