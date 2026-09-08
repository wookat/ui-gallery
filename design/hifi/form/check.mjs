// 阶段 3 门禁：design/hifi/form
//   node design/hifi/form/check.mjs          → 静态检查 + Playwright 截基准图到 ref/ + 运行时检查
//   node design/hifi/form/check.mjs --static → 只跑静态检查
// 依赖：pnpm install --filter @ui-gallery/shoot（playwright）；字体：pnpm install --filter shadcn-ui（@fontsource-variable/inter、noto-sans-sc、jetbrains-mono；未安装时门禁 FAIL）
// 视口：1440×900 与 375×812 全矩阵（5 态 + 步 2/步 3 + 叠层）；1024×900（默认 rail）与 768×1024（抽屉）只截 default，但同样跑溢出/热区/控制台检查
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
const usedVars = [...new Set([...styleBlock.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]))].filter((v) => !v.startsWith('--hifi-') && !['--hue', '--lo', '--hi'].includes(v));
const tokensCss = readFileSync(join(repo, 'design/tokens.css'), 'utf8');
const missingVars = usedVars.filter((v) => !tokensCss.includes(`${v}:`));
ok(missingVars.length === 0, `引用的 ${usedVars.length} 个令牌变量均在 design/tokens.css 中定义${missingVars.length ? ' → 缺 ' + missingVars.join(',') : ''}`);
const bodyHtml = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script[\s\S]*?<\/script>/g, '');
const inlineStyle = bodyHtml.match(/style="[^"]*"/g) || [];
ok(inlineStyle.length === 0, `标记内无 inline style（${inlineStyle.length} 处）`);
ok(!/lorem|ipsum|placeholder\.com|via\.placeholder|unsplash|张三|李四|<img/i.test(html), '无 lorem ipsum / 占位图 / 占位人名 / 位图');
ok(html.includes('href="../../tokens.css"'), '引用 ../../tokens.css');

const inline = JSON.parse(html.match(/<script type="application\/json" id="data">(\{[\s\S]*?\})<\/script>/)[1]);
for (const k of Object.keys(inline)) {
  const file = JSON.parse(readFileSync(join(repo, 'mock', `${k}.json`), 'utf8'));
  ok(JSON.stringify(file) === JSON.stringify(inline[k]), `内联数据 ${k} 与 mock/${k}.json 一致`);
}
const draft = inline['purchase-form'].draft;
const recomputed = draft.items.reduce((s, r) => s + r.qty * r.unitPrice, 0);
ok(recomputed === 40760 && recomputed === draft.subtotal, `草稿 ${draft.poNumber} 合计复算 = ${recomputed}（= mock.subtotal ${draft.subtotal}）`);

const content = readFileSync(join(repo, 'content/form.md'), 'utf8') + readFileSync(join(repo, 'content/dashboard.md'), 'utf8');
for (const s of ['新建采购单', '将在提交后生成', '采购单填写步骤', '共 3 步', '已完成', '当前步骤', '未开始', '基本信息', '选择供应商并填写联系与结算方式', '商品与配送', '添加采购商品，指定收货仓库与到货要求', '确认提交', '核对信息并同意采购条款',
  '上一步', '下一步', '保存草稿', '提交采购单', '提交中…', '必填', '选填',
  '供应商', '搜索供应商名称', '没有匹配的供应商', '常规交期', '结算方式已按该供应商默认值填入，可修改', '联系人', '姓名', '联系电话', '国家或地区代码', '11 位手机号', '邮箱', 'name@company.cn', '采购单 PDF 会发送到该邮箱', '备注', '工艺要求、包装方式、交期沟通记录…', '结算方式', '需要开具发票', '开票信息见采购条款第 4 条', '加急采购', '加急单会通知供应商优先排产，到货日期可早于常规交期',
  '采购商品', '商品', '数量', '采购单价', '小计', '删除第', '搜索 SKU 或商品名', '没有匹配的商品', '安全线', '库存预警', '添加商品行', '商品合计', '种商品，', '收货仓库', '收货地址：', '期望到货日期', '选择日期', '供应商常规交期', '建议不早于', '收货时段', '运费预算区间', '大件家具走德邦物流，江浙沪整车约 ¥400–800',
  '附件', '拖拽文件到此处，或点击选择', '支持 PDF / XLSX / JPG / PNG，单个不超过 10 MB，最多 5 个', '上传中', '已上传', '移除', '重试', '标签', '输入后回车添加', '移除标签', '常用：',
  '请核对采购单', '修改', '配送', '开票', '加急', '期望到货', '运费预算', '个文件', '预计总额', '我已阅读并同意', '《采购条款》', '采购条款', '我知道了', '需要', '不需要',
  '项需要修正', '查看', '提交失败', '重新提交', '关闭提示', '草稿已保存', '已添加商品行', '采购单已提交', '查看采购单', '再建一张', '已发送至', '离开页面？', '采购单尚未提交，离开后填写内容将丢失。', '继续填写', '放弃并离开',
  '搜索订单号、商品、客户', '全部标为已读', '查看全部通知', '暂无新通知', '个人资料', '账号安全', '切换团队空间', '帮助中心', '退出登录', '收起侧边栏', '展开侧边栏', '打开导航', '后续轮次提供', '跳到主内容']) {
  ok(html.includes(s) && content.includes(s), `文案「${s}」来自 content/form.md 或 dashboard.md`);
}
const V = inline['purchase-form'].validation;
for (const s of [V.supplier, V.contact, V.phone, V.email, V.noteMaxMessage, V.settlement, V.itemsMin, V.warehouse, V.arrivalDate, V.slot, V.terms, V.submitError]) ok(html.includes(s), `校验文案「${s}」来自 mock.validation`);

if (process.argv.includes('--static')) finish();

// ---------- Playwright：截图 + 运行时检查 ----------
const require = createRequire(join(repo, 'tools/shoot/package.json'));
const { chromium } = require('playwright');
const outDir = join(here, 'ref');
mkdirSync(outDir, { recursive: true });
const fileUrl = pathToFileURL(join(here, 'index.html')).href;
const viewports = { desktop: { width: 1440, height: 900 }, tablet: { width: 1024, height: 900 }, tabletSm: { width: 768, height: 1024 }, mobile: { width: 375, height: 812 } };
const FONTS = [['Inter Variable', 'Acme Console'], ['Noto Sans SC Variable', '新建采购单'], ['JetBrains Mono Variable', 'PO-20260906-003']];
const states = ['default', 'invalid', 'loading', 'success', 'error'];
const extras = [
  ['default-step2', 'state=default&step=2'],
  ['default-step3', 'state=default&step=3'],
  ['invalid-step2', 'state=invalid&step=2'],
  ['invalid-step3', 'state=invalid&step=3'],
  ['default-terms', 'state=default&step=3&open=terms'],
  ['default-leave', 'state=default&open=leave'],
  ['default-supplier', 'state=default&open=supplier'],
  ['default-sku', 'state=default&step=2&open=sku'],
  ['default-toast', 'state=default&toast=draft&hold'],
  ['default-notifications', 'state=default&open=notifications'],
  ['default-account', 'state=default&open=account'],
];
const desktopOnly = [['default-rail', 'state=default&sidebar=rail']];
const mobileOnly = [['default-drawer', 'state=default&open=drawer']];
const isOverlay = (name) => /-(drawer|terms|leave|notifications|account|toast)$/.test(name);
const perViewport = {
  desktop: [...states.map((s) => [s, `state=${s}`]), ...extras, ...desktopOnly],
  mobile: [...states.map((s) => [s, `state=${s}`]), ...extras, ...mobileOnly],
  tablet: [['default', 'state=default'], ['default-step2', 'state=default&step=2'], ['default-expanded', 'state=default&sidebar=expanded']],
  tabletSm: [['default', 'state=default'], ['default-step2', 'state=default&step=2'], ['default-drawer', 'state=default&open=drawer']],
};

const browser = await chromium.launch();
let shots = 0;
for (const [vpName, vp] of Object.entries(viewports)) {
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
      await page.waitForTimeout(250);
      if (theme === 'light' && name === 'default') {
        const loaded = await page.evaluate((fs) => fs.filter(([f, sample]) => document.fonts.check(`16px "${f}"`, sample)).map(([f]) => f), FONTS);
        ok(loaded.length === FONTS.length, `${vpName}: 字体已加载 ${FONTS.map(([f]) => f).join(' / ')}${loaded.length === FONTS.length ? '' : ' → 仅 ' + (loaded.join(',') || '无')}`);
      }
      const m = await page.evaluate((w) => {
        const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && el.closest('[hidden]') === null; };
        const small = [];
        for (const el of document.querySelectorAll('a, button, [role="tab"], [role="menuitem"], input, select, textarea')) {
          if (!vis(el)) continue;
          // 表单控件的实际热区 = 外层 .ctl 容器 / 包裹的 label（点击容器任意处即聚焦或切换）
          const hit = /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) ? (el.closest('.ctl, label, .radio-card') || el) : el;
          const r = hit.getBoundingClientRect();
          if (r.width < w || r.height < w) small.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 12)}"`);
        }
        const overflow = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > innerWidth + 0.5 && getComputedStyle(el).position !== 'fixed' && !el.closest('.sidebar') && !el.closest('.sprite')) overflow.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
        }
        // 暗色：所有可见「面」不得是纯白（未映射的白块）
        const white = [];
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
          for (const el of document.querySelectorAll('.card, .sidebar, .topbar, .popover, .dialog, .toast, .ctl, .radio-card, .dropzone, .item-card, .sum-section, .totals, .listbox, .actions, body, html')) {
            if (!vis(el)) continue;
            const bg = getComputedStyle(el).backgroundColor;
            if (/^rgb\(255, 255, 255\)/.test(bg)) white.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
          }
        }
        return {
          sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth, theme: document.documentElement.getAttribute('data-theme'),
          state: document.documentElement.getAttribute('data-state'), step: document.documentElement.getAttribute('data-step'), small, overflow: overflow.slice(0, 5), white,
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
      ok(m.sw <= vp.width && m.bw <= vp.width, `${vpName}-${theme}-${name}: scrollWidth=${m.sw}/${m.bw} ≤ ${vp.width}`);
      ok(m.overflow.length === 0, `${vpName}-${theme}-${name}: 无元素超出视口右缘${m.overflow.length ? ' → ' + m.overflow.join(' | ') : ''}`);
      ok(m.small.length === 0, `${vpName}-${theme}-${name}: 可点元素热区 ≥40×40${m.small.length ? ' → ' + m.small.join(' | ') : ''}`);
      ok(m.theme === theme && m.state === query.match(/state=(\w+)/)[1], `${vpName}-${theme}-${name}: data-theme/data-state 正确`);
      const expStep = (query.match(/step=(\d)/) || [])[1] || (/state=(loading|error)/.test(query) ? '3' : '1');
      ok(m.step === expStep, `${vpName}-${theme}-${name}: data-step = ${m.step}（期望 ${expStep}）`);
      if (theme === 'dark') ok(m.white.length === 0, `${vpName}-dark-${name}: 暗色无纯白面${m.white.length ? ' → ' + m.white.join(' | ') : ''}`);
      ok(size < 300 * 1024, `${vpName}-${theme}-${name}.png ${(size / 1024).toFixed(0)}KB < 300KB`);
    }
  }
  ok(errors.length === 0, `${vpName}: console error = ${errors.length}${errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();

// ---------- 交互 / 键盘 / 业务断言（1440 亮色） ----------
{
  const b2 = await chromium.launch();
  const page = await b2.newPage({ viewport: viewports.desktop });
  const txt = async (sel) => (await page.textContent(sel)).replace(/\s+/g, ' ').trim();
  await page.goto(`${fileUrl}?state=default&theme=light`);
  await page.evaluate(() => document.fonts.ready);
  await page.keyboard.press('Tab');
  ok((await page.evaluate(() => document.activeElement.className)).includes('skip'), 'Tab 首焦点为跳转链接');
  // 草稿数据 → 摘要卡复算
  ok((await txt('#asideGoodsVal')) === '¥40,760.00' && (await txt('#asideCount')) === '3 种商品，88 件', `摘要卡 商品合计 = ${await txt('#asideGoodsVal')} / ${await txt('#asideCount')}`);
  ok((await txt('#asideFreight')) === '¥400 – ¥800' && (await txt('#asideGrand')) === '¥41,560.00', `摘要卡 运费 ${await txt('#asideFreight')} · 预计总额 ${await txt('#asideGrand')}（= 商品合计 + 运费上限）`);
  ok((await txt('#poNext')) === 'PO-20260906-003' && (await txt('#poAside')) === 'PO-20260906-003', '草稿号 PO-20260906-003 出现在页头与摘要卡');
  ok((await page.inputValue('#supplier')) === '东阳樟里木艺' && (await page.inputValue('#contact')) === '吴丽华' && (await page.inputValue('#phone')) === '13700003308' && (await page.inputValue('#email')) === 'sales@zhangli-wood.cn', '步 1 字段 = 草稿（供应商 / 联系人 / 电话 / 邮箱）');
  ok((await page.evaluate(() => document.querySelector('input[name="settlement"]:checked').value)) === 'prepay_30' && (await page.isChecked('#invoice')) && (await page.isChecked('#urgent')), '结算 = 预付 30%，开票 ✓，加急 ✓');
  ok((await txt('#noteCounter')).replace(/\s/g, '') === `${draft.note.length}/200`, `备注计数 = ${await txt('#noteCounter')}`);
  // 供应商 Combobox：搜索 → 选中自动回填
  await page.fill('#supplier', '林语');
  ok(!(await page.isHidden('#supplierList')) && (await page.locator('#supplierList .option').count()) === 1, '供应商输入「林语」→ 1 个匹配项');
  await page.click('#supplierList .option');
  ok((await page.inputValue('#contact')) === '林建军' && (await page.inputValue('#phone')) === '13900006620' && (await page.evaluate(() => document.querySelector('input[name="settlement"]:checked').value)) === 'monthly_30', '选中安吉林语木业 → 联系人 / 电话 / 结算自动回填');
  ok((await txt('#asideSupplier')) === '安吉林语木业', '摘要卡供应商同步');
  await page.fill('#supplier', 'zzz');
  ok((await txt('#supplierList')) === '没有匹配的供应商', 'Combobox 空态文案');
  await page.keyboard.press('Escape');
  // 步 1 校验：清空联系人 + 错误电话 → 下一步被拦截，Alert 计数与首错聚焦
  await page.fill('#contact', '');
  await page.fill('#phone', '139');
  await page.click('#nextBtn');
  ok((await page.getAttribute('html', 'data-step')) === '1' && (await txt('#invalidAlertText')) === '还有 2 项需要修正', `步 1 校验拦截：${await txt('#invalidAlertText')}`);
  ok((await page.evaluate(() => document.activeElement.id)) === 'contact', '首个错误字段自动聚焦（#contact）');
  ok((await page.evaluate(() => document.querySelector('.stepper .step[aria-current="step"]').classList.contains('is-error'))), 'Stepper 当前步标为错误');
  await page.fill('#contact', '林建军'); await page.fill('#phone', '13900006620');
  await page.click('#nextBtn');
  ok((await page.getAttribute('html', 'data-step')) === '2' && (await page.isHidden('#invalidAlert')), '修正后进入步 2，Alert 消失');
  // 步 2：行合计实时复算 + 添加/删除行
  await page.fill('#itemRows tr[data-row="0"] input[data-k="qty"]', '61');
  ok((await txt('#itemsTotal')) === '¥41,240.00' && (await txt('#asideGoodsVal')) === '¥41,240.00' && (await txt('#asideGrand')) === '¥42,040.00', `数量 60→61 后合计 ${await txt('#itemsTotal')} / 预计总额 ${await txt('#asideGrand')}`);
  await page.fill('#itemRows tr[data-row="0"] input[data-k="qty"]', '60');
  await page.click('#addRow');
  ok((await page.locator('#itemRows tr').count()) === 4 && !(await page.isHidden('#toast')) && (await txt('#toastText')) === '已添加商品行', '添加商品行 → 4 行 + Toast');
  await page.click('#itemRows tr[data-row="3"] [data-remove]');
  ok((await page.locator('#itemRows tr').count()) === 3 && (await txt('#itemsTotal')) === '¥40,760.00', '删除第 4 行 → 回到 3 行 ¥40,760.00');
  // 步 2 校验：数量 0 + 到货日期过早
  await page.fill('#itemRows tr[data-row="1"] input[data-k="qty"]', '0');
  await page.fill('#arrival', '2026-09-06');
  await page.click('#nextBtn');
  ok((await page.getAttribute('html', 'data-step')) === '2' && (await txt('#invalidAlertText')) === '还有 2 项需要修正', `步 2 校验拦截：${await txt('#invalidAlertText')}`);
  ok((await page.evaluate(() => document.activeElement.getAttribute('data-k'))) === 'qty', '首错聚焦到第 2 行数量');
  await page.fill('#itemRows tr[data-row="1"] input[data-k="qty"]', '20');
  await page.fill('#arrival', '2026-09-20');
  ok((await page.evaluate(() => document.getElementById('arrivalHint').classList.contains('is-warning'))) && (await txt('#arrivalHint')).includes('早于供应商常规交期'), '到货日期早于常规交期 → warning 提示');
  await page.fill('#arrival', '2026-09-24');
  // 滑块
  await page.evaluate(() => { const r = document.getElementById('freightMax'); r.value = 1000; r.dispatchEvent(new Event('input')); });
  ok((await txt('#freightValue')) === '¥400 – ¥1,000' && (await txt('#asideGrand')) === '¥41,760.00', `滑块上限 → ${await txt('#freightValue')}，预计总额 ${await txt('#asideGrand')}`);
  await page.evaluate(() => { const r = document.getElementById('freightMax'); r.value = 800; r.dispatchEvent(new Event('input')); });
  // 标签
  await page.click('#tagSuggest [data-add-tag="新品"]');
  ok((await page.locator('#tagBox .chip').count()) === 3, '点击常用标签「新品」→ 3 个 Chip');
  await page.click('#tagBox .chip-x[aria-label="移除标签 新品"]');
  ok((await page.locator('#tagBox .chip').count()) === 2, '移除标签 → 2 个 Chip');
  await page.click('#nextBtn');
  ok((await page.getAttribute('html', 'data-step')) === '3', '进入步 3');
  // 步 3：摘要与合计
  ok((await txt('#totals')).includes('¥40,760.00') && (await txt('#totals')).includes('¥400 – ¥800') && (await txt('#totals')).includes('¥41,560.00'), `步 3 合计：${await txt('#totals')}`);
  ok((await page.locator('#sumGoods tr').count()) === 3 && (await txt('#sumBasic')).includes('安吉林语木业') && (await txt('#sumDelivery')).includes('2 个文件'), '摘要三区块内容正确（3 行商品 / 供应商 / 2 个附件）');
  ok((await page.getAttribute('#submitBtn', 'aria-disabled')) === 'true', '未勾条款：提交按钮 aria-disabled');
  await page.click('#submitBtn', { force: true }); // Playwright 默认拒绝点击 aria-disabled，这里模拟真实点击
  ok((await txt('#invalidAlertText')) === '还有 1 项需要修正' && !(await page.isHidden('#termsErr')), '未勾条款提交 → 内联提示 + Alert');
  await page.click('#openTerms');
  ok(!(await page.isHidden('#termsDialog')) && (await page.locator('#termsList li').count()) === 4, '打开《采购条款》Dialog（4 条）');
  await page.keyboard.press('Escape');
  ok((await page.isHidden('#termsDialog')) && (await page.evaluate(() => document.activeElement.id)) === 'openTerms', 'Escape 关闭 Dialog，焦点回条款链接');
  await page.click('[data-goto="1"]');
  ok((await page.getAttribute('html', 'data-step')) === '1', '摘要「修改」→ 回到步 1');
  await page.click('.stepper .step[data-step="3"]');
  ok((await page.getAttribute('html', 'data-step')) === '3', 'Stepper 点击已完成步 → 回到步 3');
  await page.check('#terms');
  await page.click('#submitBtn');
  ok((await page.getAttribute('html', 'data-state')) === 'loading' && (await txt('#submitText')) === '提交中…' && (await page.evaluate(() => document.getElementById('fields').disabled)), '提交 → loading：按钮「提交中…」+ 全表单只读');
  const wLoading = await page.evaluate(() => document.getElementById('submitBtn').getBoundingClientRect().width);
  await page.waitForFunction(() => document.documentElement.getAttribute('data-state') === 'success');
  ok(wLoading >= 128, `loading 时提交按钮保持宽度 ${Math.round(wLoading)} ≥ 128`);
  ok((await txt('#resultTitle')) === '采购单已提交' && (await txt('#resultDesc')).includes('PO-20260906-003') && (await txt('#resultDesc')).includes('安吉林语木业') && (await txt('#resultSent')) === '已发送至 order@linyu-wood.cn', `success：${await txt('#resultDesc')}`);
  ok((await page.evaluate(() => getComputedStyle(document.querySelector('.layout')).display)) === 'none', 'success 隐藏表单与摘要卡，只留 Result');
  // error → 重试 → success
  await page.goto(`${fileUrl}?state=error&theme=light`);
  ok((await txt('#submitAlertText')) === V.submitError && (await page.getAttribute('html', 'data-step')) === '3', 'error：步 3 顶部「提交失败」Alert 文案 = validation.submitError');
  await page.click('#retryBtn');
  ok((await page.getAttribute('html', 'data-state')) === 'loading', '错误态点击重新提交 → loading');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-state') === 'success');
  ok(true, 'loading → success');
  await page.goto(`${fileUrl}?state=error&theme=light&fail=1`);
  await page.click('#retryBtn');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-state') === 'error');
  ok(true, '?fail=1 重试 → 再次 error');
  await page.click('#dismissAlert');
  ok((await page.isHidden('#submitAlert')), '关闭提示 → Alert 隐藏');
  // 默认 success 文案 = mock.success.description
  await page.goto(`${fileUrl}?state=success&theme=light`);
  ok((await txt('#resultDesc')) === inline['purchase-form'].success.description, 'success 直达：描述 = mock.success.description');
  await page.click('#viewPo');
  ok((await txt('#toastText')) === '后续轮次提供', '「查看采购单」不可达 → Toast「后续轮次提供」');
  // 应用壳
  await page.goto(`${fileUrl}?state=default&theme=light`);
  await page.click('#bellBtn');
  ok(!(await page.isHidden('#notifPop')) && (await page.locator('#notifList .notif-item').count()) === 5, '铃铛 → 通知 Popover 5 条');
  await page.keyboard.press('Escape');
  ok((await page.isHidden('#notifPop')) && (await page.evaluate(() => document.activeElement.id)) === 'bellBtn', 'Escape 关闭 Popover 且焦点回铃铛');
  await page.click('#themeBtn');
  ok((await page.getAttribute('html', 'data-theme')) === 'dark' && (await page.getAttribute('#themeBtn', 'aria-label')) === '切换为亮色', '主题按钮切换为暗色');
  await page.click('#collapseBtn');
  await page.waitForTimeout(400);
  ok((await page.getAttribute('html', 'data-sidebar')) === 'rail' && (await page.evaluate(() => document.getElementById('sidebar').getBoundingClientRect().width)) === 64, '侧边栏收起为 64 图标栏');
  const navMeta = await page.evaluate(() => {
    const items = [...document.querySelectorAll('#nav .nav-item')]; const dis = items.filter((a) => a.getAttribute('aria-disabled') === 'true');
    return { total: items.length, disabled: dis.length, current: items.filter((a) => a.getAttribute('aria-current')).length, tip: dis.every((a) => a.getAttribute('data-tip') === '后续轮次提供'), cursor: dis.every((a) => getComputedStyle(a).cursor === 'not-allowed') };
  });
  ok(navMeta.total === 8 && navMeta.disabled === 7 && navMeta.current === 0 && navMeta.tip && navMeta.cursor, `侧边栏 8 项 / 7 项 aria-disabled + Tooltip / 本屏无高亮项（brief §11.10-E）`);
  const crumb = await page.evaluate(() => { const c = document.querySelector('.crumbs .crumb-disabled'); return { tip: c.getAttribute('data-tip'), dis: c.getAttribute('aria-disabled'), txt: c.textContent, cur: document.querySelector('.crumbs [aria-current="page"]').textContent }; });
  ok(crumb.tip === '后续轮次提供' && crumb.dis === 'true' && crumb.txt === '采购' && crumb.cur === '新建采购单', '面包屑「采购」aria-disabled + Tooltip，当前项「新建采购单」');
  // 离开确认
  await page.click('#nav .nav-item[data-key="dashboard"]');
  ok(!(await page.isHidden('#leaveDialog')) && page.url().startsWith(fileUrl), '有未提交改动时点击「仪表盘」→ 离开确认 Dialog，不跳转');
  await page.click('#leaveDialog [data-close]');
  // 焦点环
  await page.focus('.search input');
  const ring = await page.evaluate(() => [getComputedStyle(document.querySelector('.search input')).outlineWidth, getComputedStyle(document.querySelector('.search input')).outlineStyle]);
  ok(ring[0] === '2px' && ring[1] === 'solid', `搜索 input :focus-visible 焦点环 = ${ring.join(' ')}`);
  await page.focus('#contact');
  const ctlRing = await page.evaluate(() => { const c = document.querySelector('#fContact .ctl'); return [getComputedStyle(c).outlineWidth, getComputedStyle(c).outlineStyle]; });
  ok(ctlRing[0] === '2px' && ctlRing[1] === 'solid', `输入框容器 :focus-within 焦点环 = ${ctlRing.join(' ')}`);

  // 文案极值：最长供应商法定名 / 商品名 / 备注 200 字 / 附件长名 / 大金额（375 与 1440）
  const LONG_SUP = '杭州栖木家居有限公司浙江省内实木家具联合采购中心（东阳樟里木艺分部）';
  const LONG_SKU = '北欧白橡木餐桌 1.4m 加厚桌面可伸缩六人位含两把同款餐椅套装（定制色）';
  const LONG_NOTE = '床'.repeat(200);
  for (const [vpName, w] of [['mobile', 375], ['tabletSm', 768], ['desktop', 1440]]) {
    await page.setViewportSize(viewports[vpName]);
    await page.goto(`${fileUrl}?state=default&step=3&theme=light`);
    await page.waitForTimeout(250);
    const ext = await page.evaluate(([sup, sku, note]) => {
      document.querySelectorAll('#sumBasic dd')[0].textContent = sup;
      document.getElementById('asideSupplier').textContent = sup;
      document.querySelectorAll('#sumGoods td:first-child > span:first-child').forEach((s) => { s.textContent = sku; });
      document.querySelectorAll('#sumGoods td.r:last-child').forEach((s) => { s.textContent = '¥12,345,678.00'; });
      document.getElementById('asideGoodsVal').textContent = '¥12,345,678.00'; document.getElementById('asideGrand').textContent = '¥12,346,478.00';
      document.querySelectorAll('#sumBasic dd')[6].textContent = note;
      const right = (sel) => Math.round(document.querySelector(sel).getBoundingClientRect().right);
      return { doc: document.documentElement.scrollWidth, form: right('.form-card'), aside: right('.aside'), goods: right('#sumGoods'), card: Math.round(document.querySelector('.form-card').getBoundingClientRect().right) };
    }, [LONG_SUP, LONG_SKU, LONG_NOTE]);
    ok(ext.doc <= w && ext.form <= w && ext.aside <= w && ext.goods <= ext.card, `${w} 步 3 极值（${LONG_SUP.length} 字供应商 / ${LONG_SKU.length} 字商品名 / 200 字备注 / ¥12,345,678.00）无溢出（doc=${ext.doc} form=${ext.form} aside=${ext.aside}）`);
    await page.goto(`${fileUrl}?state=default&step=2&theme=light`);
    await page.waitForTimeout(250);
    const ext2 = await page.evaluate(([sku]) => {
      document.querySelectorAll('#items input[data-k="sku"]').forEach((i) => { i.value = sku; });
      document.querySelectorAll('.file-name').forEach((f) => { f.textContent = '樟里木艺-报价单-202609-含工艺确认图与包装方案附录-最终版-v3-签章扫描件.pdf'; });
      const rows = [...document.querySelectorAll('#itemRows tr, #itemCards .item-card')].filter((r) => r.offsetParent);
      return { doc: document.documentElement.scrollWidth, rows: Math.max(...rows.map((r) => Math.round(r.getBoundingClientRect().right))), files: Math.max(...[...document.querySelectorAll('.file')].map((r) => Math.round(r.getBoundingClientRect().right))), card: Math.round(document.querySelector('.form-card').getBoundingClientRect().right) };
    }, [LONG_SKU]);
    ok(ext2.doc <= w && ext2.rows <= ext2.card && ext2.files <= ext2.card, `${w} 步 2 极值（长商品名 / 长附件名）不溢出卡片（doc=${ext2.doc} rows=${ext2.rows} files=${ext2.files} card=${ext2.card}）`);
  }

  // 375：摘要卡在表单上方、操作条吸底、Stepper 文字化、商品行卡片化、按钮 ≥40；侧栏 inert
  await page.setViewportSize(viewports.mobile);
  await page.goto(`${fileUrl}?state=default&step=2&theme=light`);
  await page.waitForTimeout(250);
  const mob = await page.evaluate(() => {
    const aside = document.querySelector('.aside').getBoundingClientRect(), form = document.querySelector('.form-card').getBoundingClientRect(), act = document.querySelector('.actions');
    return { asideAbove: aside.bottom <= form.top, fixed: getComputedStyle(act).position === 'sticky', actBottom: Math.round(act.getBoundingClientRect().bottom), stepper: getComputedStyle(document.querySelector('.stepper')).display, stepperM: getComputedStyle(document.querySelector('.stepper-mobile')).display, stepText: document.getElementById('stepperMobileN').textContent,
      table: getComputedStyle(document.querySelector('.items table')).display, cards: document.querySelectorAll('#itemCards .item-card').length, inert: document.getElementById('sidebar').inert, drawerBtn: getComputedStyle(document.getElementById('drawerOpen')).display !== 'none' };
  });
  ok(mob.asideAbove && mob.fixed && mob.actBottom === 812, `375：摘要卡在表单上方，操作条吸底（bottom=${mob.actBottom}）`);
  ok(mob.stepper === 'none' && mob.stepperM === 'flex' && mob.stepText === '第 2 步，共 3 步', `375：Stepper → 「${mob.stepText}」+ 进度条`);
  ok(mob.table === 'none' && mob.cards === 3, `375：商品行表格 → ${mob.cards} 张卡片`);
  ok(mob.inert && mob.drawerBtn, '375：抽屉关闭时侧栏 inert，汉堡按钮可见');
  await page.click('#drawerOpen');
  await page.waitForTimeout(300);
  ok((await page.getAttribute('html', 'data-drawer')) === 'open' && (await page.evaluate(() => document.getElementById('sidebar').contains(document.activeElement))), '375：打开抽屉 → 焦点进入侧栏');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  ok((await page.evaluate(() => document.activeElement.id)) === 'drawerOpen' && (await page.evaluate(() => document.getElementById('sidebar').inert)), '375：Escape 关闭抽屉，焦点回汉堡，侧栏 inert');
  // 375 invalid：错误 Alert + 首错定位
  await page.goto(`${fileUrl}?state=invalid&theme=light`);
  await page.waitForTimeout(250);
  ok((await txt('#invalidAlertText')) === '还有 3 项需要修正' && (await page.evaluate(() => document.getElementById('stepperMobileRow').classList.contains('is-error'))), '375 invalid：Alert「还有 3 项需要修正」+ 步骤标题变 danger');
  await page.click('#gotoFirstErr');
  ok((await page.evaluate(() => document.activeElement.id)) === 'supplier', '375 invalid：「查看」→ 聚焦首个错误字段 #supplier');
  // 对比度：未实现导航项文字 / 侧栏背景（亮 / 暗）；辅助文字 / 卡片背景
  const lum = (rgb) => { const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map((c) => { c = +c / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const contrast = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  for (const theme of ['light', 'dark']) {
    await page.goto(`${fileUrl}?state=default&theme=${theme}&open=drawer`);
    await page.waitForTimeout(300);
    const c = await page.evaluate(() => ({ navFg: getComputedStyle(document.querySelector('#nav .nav-item[aria-disabled="true"]')).color, navBg: getComputedStyle(document.getElementById('sidebar')).backgroundColor, hintFg: getComputedStyle(document.getElementById('emailHint')).color, cardBg: getComputedStyle(document.querySelector('.form-card')).backgroundColor, errFg: getComputedStyle(document.querySelector('.label .req')).color }));
    ok(contrast(c.navFg, c.navBg) >= 4.5, `${theme}: 未实现导航项文字/侧栏背景对比度 ${contrast(c.navFg, c.navBg).toFixed(2)}:1 ≥ 4.5`);
    ok(contrast(c.hintFg, c.cardBg) >= 4.5, `${theme}: 辅助文字/卡片背景对比度 ${contrast(c.hintFg, c.cardBg).toFixed(2)}:1 ≥ 4.5`);
    ok(contrast(c.errFg, c.cardBg) >= 3, `${theme}: 必填星号/卡片背景对比度 ${contrast(c.errFg, c.cardBg).toFixed(2)}:1 ≥ 3`);
  }
  // 8pt 节奏：主要块级间距为 8 的倍数
  await page.setViewportSize(viewports.desktop);
  await page.goto(`${fileUrl}?state=default&theme=light`);
  await page.waitForTimeout(250);
  const rhythm = await page.evaluate(() => {
    const px = (v) => parseFloat(v);
    const cs = (sel, p) => px(getComputedStyle(document.querySelector(sel))[p]);
    return { content: cs('.content', 'padding-left'), contentGap: cs('.content', 'row-gap'), card: cs('.card', 'padding-left'), grid: cs('.form-grid', 'row-gap'), gridCol: cs('.form-grid', 'column-gap'), layout: cs('.layout', 'column-gap'), panelHead: cs('.panel-head', 'margin-bottom'), actions: cs('.actions', 'margin-top'), field: cs('.field', 'row-gap'), ctl: cs('.ctl', 'min-height'), btn: cs('.btn', 'min-height') };
  });
  const off8 = Object.entries(rhythm).filter(([, v]) => v % 8 !== 0);
  ok(off8.length === 0, `8pt 节奏：${Object.entries(rhythm).map(([k, v]) => `${k}=${v}`).join(' ')}${off8.length ? ' → 非 8 倍数：' + off8.map(([k]) => k).join(',') : ''}`);
  // 1440 对齐：表单卡与摘要卡顶对齐；摘要卡宽 320；表单卡与页头左对齐
  const align = await page.evaluate(() => { const f = document.querySelector('.form-card').getBoundingClientRect(), a = document.querySelector('.aside').getBoundingClientRect(), h = document.querySelector('.page-head').getBoundingClientRect(), s = document.querySelector('.stepper').getBoundingClientRect(); return { top: Math.round(f.top) === Math.round(a.top), asideW: Math.round(a.width), left: Math.round(f.left) === Math.round(h.left) && Math.round(f.left) === Math.round(s.left), sticky: getComputedStyle(document.querySelector('.aside')).position }; });
  ok(align.top && align.asideW === 320 && align.left && align.sticky === 'sticky', `1440 对齐：表单卡/摘要卡顶对齐，摘要卡 ${align.asideW} 宽且 sticky，与页头/Stepper 左对齐`);
  await b2.close();
}

// 平板：1024 默认 rail 且双栏；768 抽屉 + 单栏
{
  const b3 = await chromium.launch();
  const t = await b3.newPage({ viewport: viewports.tablet });
  await t.goto(`${fileUrl}?state=default&theme=light`);
  await t.waitForTimeout(250);
  const tm = await t.evaluate(() => ({ sidebar: document.documentElement.getAttribute('data-sidebar'), sw: document.documentElement.scrollWidth, cols: getComputedStyle(document.querySelector('.layout')).gridTemplateColumns.split(' ').length }));
  ok(tm.sidebar === 'rail' && tm.sw <= 1024 && tm.cols === 2, `1024：侧边栏默认 ${tm.sidebar}，双栏（${tm.cols} 列），scrollWidth=${tm.sw}`);
  await t.setViewportSize(viewports.tabletSm);
  await t.goto(`${fileUrl}?state=default&theme=light`);
  await t.waitForTimeout(250);
  const sm = await t.evaluate(() => { const sb = document.getElementById('sidebar').getBoundingClientRect(); return { sw: document.documentElement.scrollWidth, drawerBtn: getComputedStyle(document.getElementById('drawerOpen')).display !== 'none', off: sb.right <= 0 || sb.width === 0, cols: getComputedStyle(document.querySelector('.layout')).gridTemplateColumns.split(' ').length, inert: document.getElementById('sidebar').inert }; });
  ok(sm.sw <= 768 && sm.drawerBtn && sm.off && sm.cols === 1 && sm.inert, `768：抽屉模式（汉堡可见、侧栏离屏、inert），单栏，scrollWidth=${sm.sw}`);
  await b3.close();
}

const pngs = readdirSync(outDir).filter((f) => f.endsWith('.png'));
const required = ['desktop', 'mobile'].flatMap((v) => ['light', 'dark'].flatMap((t) => states.map((s) => `${v}-${t}-${s}.png`)));
ok(required.every((f) => pngs.includes(f)), `必备基准图 20 张齐全：{desktop,mobile}-{light,dark}-{${states.join(',')}}.png`);
console.log(`\nref/*.png = ${pngs.length} 张（本次新截 ${shots}）`);
finish();

function finish() {
  console.log(`\n${fails.length === 0 ? '全部通过' : `失败 ${fails.length} 项`}`);
  process.exit(fails.length ? 1 : 0);
}
