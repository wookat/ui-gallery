// 阶段 3 门禁：design/hifi/settings
//   node design/hifi/settings/check.mjs          → 静态检查 + Playwright 截基准图到 ref/ + 运行时检查
//   node design/hifi/settings/check.mjs --static → 只跑静态检查
// 依赖：pnpm install --filter @ui-gallery/shoot（playwright）；字体：pnpm install --filter shadcn-ui（@fontsource-variable/inter、noto-sans-sc、jetbrains-mono；未安装截图会回退系统字体，门禁 FAIL）
// 路由：?tab=profile|security|notifications|team|billing  ?state=default|saving|saved|error|empty
//       ?open=2fa|2fa-disable|remove|danger|leave|notifications|account|drawer  ?twofa=setup|on  ?cycle=monthly|yearly
//       ?channel=all|email|push|inapp  ?theme=light|dark  ?sidebar=rail|expanded  &hold（Toast 不自动消失，截图用）
// 视口：1440×900 与 375×812 全矩阵；1024×900（默认 rail）与 768×1024（抽屉）只截 default 各 Tab，但同样跑溢出/热区/控制台检查
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
ok(!/<img\b/.test(bodyHtml) && !/url\(\s*["']?(https?:|data:image\/(png|jpe?g|webp))/i.test(styleBlock), '无位图（<img> / 位图 url()），头像与二维码位均为 CSS/SVG');
ok(html.includes('href="../../tokens.css"'), '引用 ../../tokens.css');

const inline = JSON.parse(html.match(/<script type="application\/json" id="data">(\{[\s\S]*?\})<\/script>/)[1]);
for (const k of Object.keys(inline)) {
  const file = JSON.parse(readFileSync(join(repo, 'mock', `${k}.json`), 'utf8'));
  ok(JSON.stringify(file) === JSON.stringify(inline[k]), `内联数据 ${k} 与 mock/${k}.json 一致`);
}
// 交叉一致：profile ↔ user.json；members ↔ team.json；billing.plan ↔ user.workspace.plan；发票金额 ∈ 计划价；landing 定价
const S = inline.settings;
ok(S.profile.userId === inline.user.id && S.profile.name === inline.user.name && S.profile.email === inline.user.email && S.profile.avatarHue === inline.user.avatarHue, 'profile 与 user.json 同源（id/name/email/avatarHue）');
ok(S.team.members.every((m) => inline.team.some((t) => t.id === m.id)) && S.team.members.length === inline.team.length, 'team.members 全部引用 team.json');
ok(S.team.seats.used === S.team.members.length, `seats.used = 成员数（${S.team.seats.used}）`);
ok(S.billing.planLabel === inline.user.workspace.plan && S.billing.plans.find((p) => p.key === S.billing.plan).label === inline.user.workspace.plan, `billing.plan「${S.billing.planLabel}」= user.workspace.plan`);
const prices = S.billing.plans.flatMap((p) => [p.monthly, p.yearly]);
ok(S.billing.invoices.every((i) => prices.includes(i.amount)), '发票金额均为计划年付/月付价');
try {
  const landing = JSON.parse(readFileSync(join(repo, 'mock/landing.json'), 'utf8'));
  const lp = JSON.stringify(landing);
  ok(S.billing.plans.every((p) => lp.includes(String(p.monthly)) && lp.includes(String(p.yearly))), '三档价格与 mock/landing.json 定价一致');
} catch { console.log('INFO mock/landing.json 不存在，跳过 landing 定价交叉校验'); }
const content = readFileSync(join(repo, 'content/settings.md'), 'utf8');
for (const s of ['设置', '设置分类', '个人资料', '账号安全', '通知', '团队', '计费', '保存', '保存中…', '重置', '有未保存的修改', '保存失败', '重试',
  '你的姓名与头像会显示在团队活动与备注中', '头像由姓名末字自动生成，不支持上传图片', '姓名', '请填写姓名', '邮箱', '登录邮箱不可修改，如需变更请联系管理员', '职位', '简介', '一句话介绍你负责的工作', '语言', '时区', '搜索城市或 UTC 偏移', '没有匹配的时区',
  '修改密码', '上次修改于', '当前密码', '新密码', '确认新密码', '两次输入的密码不一致', '当前密码不正确', '密码强度', '密码要求', '更新密码', '两步验证', '登录时额外输入验证器应用生成的 6 位动态码', '启用两步验证', '已启用', '未启用', '两步验证二维码（示意）', '无法扫码？手动输入密钥', '输入 6 位验证码', '验证码不正确或已过期', '验证并启用', '关闭两步验证？', '关闭后仅凭密码即可登录，账号安全性会降低。',
  '活跃会话', '以下设备当前已登录你的账号', '当前设备', '注销', '注销其他所有会话', '没有其他活跃会话',
  '通知偏好', '按事件选择接收方式，站内通知始终显示在铃铛中', '接收方式', '全部开启', '全部关闭', '免打扰时段', '该时段内推送通知静默，次日早上汇总', '该接收方式下没有可配置的通知',
  '团队成员', '邀请成员', '输入邮箱，回车添加', '角色', '发送邀请', '邮箱格式不正确', '待接受邀请', '重新发送', '撤回', '成员列表', '成员', '加入时间', '最近活动', '不能修改自己的角色', '移除', '取消', '还没有其他成员，邀请同事一起使用',
  '当前计划', '下次续费', '付款方式', '更换付款方式', '取消订阅', '按月付', '按年付', '切换计费周期', '省 2 个月', '推荐', '折合', '升级到', '降级到', '联系销售', '包含', '不包含', '发票', '编号', '开具日期', '说明', '金额', '状态', '下载 PDF', '还没有发票，首次扣款后会显示在这里',
  '危险区', '删除团队空间', '以确认', '输入内容不匹配', '永久删除']) {
  ok(html.includes(s) && content.includes(s), `文案「${s}」来自 content/settings.md`);
}
const shell = readFileSync(join(repo, 'content/dashboard.md'), 'utf8');
for (const s of ['搜索订单号、商品、客户', '全部标为已读', '查看全部通知', '暂无新通知', '切换团队空间', '帮助中心', '退出登录', '收起侧边栏', '展开侧边栏', '打开导航', '后续轮次提供']) {
  ok(html.includes(s) && shell.includes(s), `壳文案「${s}」复用 content/dashboard.md`);
}
ok(html.includes(S.dangerZone.confirmPhrase) && html.includes(S.dangerZone.confirmHint), `危险区确认短语「${S.dangerZone.confirmPhrase}」来自 mock`);
ok(!/secret=[A-Z2-7]{16,}/.test(html) || html.includes('DEMO-NOT-A-REAL-SECRET'), '2FA otpauth 仅为演示串，无真实密钥');

if (process.argv.includes('--static')) finish();

// ---------- Playwright：截图 + 运行时检查 ----------
const require = createRequire(join(repo, 'tools/shoot/package.json'));
const { chromium } = require('playwright');
const outDir = join(here, 'ref');
mkdirSync(outDir, { recursive: true });
const fileUrl = pathToFileURL(join(here, 'index.html')).href;
const viewports = { desktop: { width: 1440, height: 900 }, tablet: { width: 1024, height: 900 }, tabletSm: { width: 768, height: 1024 }, mobile: { width: 375, height: 812 } };
const FONTS = [['Inter Variable', 'Acme Console'], ['Noto Sans SC Variable', '个人资料'], ['JetBrains Mono Variable', 'INV-2026-0312']];
const TABS = ['profile', 'security', 'notifications', 'team', 'billing'];
// 名称 = {tab}-{state}[-变体]；截图文件 {desktop,mobile}-{light,dark}-{name}.png
const full = [
  ...TABS.map((t) => [`${t}-default`, `tab=${t}&state=default`]),
  ['profile-saving', 'tab=profile&state=saving'],
  ['profile-saved', 'tab=profile&state=saved&hold'],
  ['profile-error', 'tab=profile&state=error'],
  ['security-empty', 'tab=security&state=empty'],
  ['security-2fa', 'tab=security&state=default&open=2fa'],
  ['security-2fa-setup', 'tab=security&state=default&twofa=setup'],
  ['security-2fa-disable', 'tab=security&state=default&twofa=on&open=2fa-disable'],
  ['notifications-saving', 'tab=notifications&state=saving'],
  ['notifications-saved', 'tab=notifications&state=saved&hold'],
  ['notifications-error', 'tab=notifications&state=error'],
  ['notifications-email', 'tab=notifications&state=default&channel=email'],
  ['team-empty', 'tab=team&state=empty'],
  ['team-remove', 'tab=team&state=default&open=remove'],
  ['team-danger', 'tab=team&state=default&open=danger'],
  ['billing-empty', 'tab=billing&state=empty'],
  ['billing-monthly', 'tab=billing&state=default&cycle=monthly'],
  ['profile-leave', 'tab=profile&state=default&open=leave'],
  ['profile-notifications', 'tab=profile&state=default&open=notifications'],
  ['profile-account', 'tab=profile&state=default&open=account'],
];
const desktopOnly = [['profile-default-rail', 'tab=profile&state=default&sidebar=rail']];
const mobileOnly = [['profile-default-drawer', 'tab=profile&state=default&open=drawer']];
const isOverlay = (name) => /-(drawer|2fa|2fa-disable|remove|danger|leave|notifications|account|saved)$/.test(name);
const perViewport = {
  desktop: [...full, ...desktopOnly],
  mobile: [...full, ...mobileOnly],
  tablet: [...TABS.map((t) => [`${t}-default`, `tab=${t}&state=default`]), ['team-default-expanded', 'tab=team&state=default&sidebar=expanded']],
  tabletSm: [...TABS.map((t) => [`${t}-default`, `tab=${t}&state=default`]), ['profile-default-drawer', 'tab=profile&state=default&open=drawer']],
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
      await page.goto(`${fileUrl}?${query}&theme=${theme}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      if (theme === 'light' && name === 'billing-default') {
        const loaded = await page.evaluate((fs) => fs.filter(([f, sample]) => document.fonts.check(`16px "${f}"`, sample)).map(([f]) => f), FONTS);
        ok(loaded.length === FONTS.length, `${vpName}: 字体已加载 ${FONTS.map(([f]) => f).join(' / ')}${loaded.length === FONTS.length ? '' : ' → 仅 ' + (loaded.join(',') || '无')}`);
      }
      const m = await page.evaluate((w) => {
        const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && el.closest('[hidden]') === null && !el.closest('[inert]'); };
        const small = [];
        for (const el of document.querySelectorAll('a, button, [role="tab"], [role="menuitem"], [role="option"], input, select, textarea, summary')) {
          if (!vis(el)) continue;
          const r = el.getBoundingClientRect();
          if (r.width < w || r.height < w) small.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')} ${Math.round(r.width)}x${Math.round(r.height)} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 12)}"`);
        }
        const overflow = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width && r.right > innerWidth + 0.5 && getComputedStyle(el).position !== 'fixed' && !el.closest('.sidebar') && !el.closest('.ttable-wrap, .itable-wrap, .ntable-wrap, .stabs')) overflow.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)}`);
        }
        const h = document.documentElement;
        return { sw: h.scrollWidth, bw: document.body.scrollWidth, theme: h.getAttribute('data-theme'), state: h.getAttribute('data-state'), tab: h.getAttribute('data-tab'), open: h.getAttribute('data-open'), small, overflow: overflow.slice(0, 5),
          paneVisible: [...document.querySelectorAll('.pane')].filter((p) => !p.hidden).map((p) => p.id).join(','), toast: !document.getElementById('toast').hidden };
      }, 40);
      const file = join(outDir, `${vpName}-${theme}-${name}.png`);
      if (isOverlay(name)) await page.screenshot({ path: file, animations: 'disabled' });
      else {
        // 整页截图前把视口拉到文档高度，避免 sticky 保存栏在整页图中"悬浮"于视口位置
        const docH = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.setViewportSize({ width: vp.width, height: Math.max(vp.height, docH) });
        await page.waitForTimeout(50);
        await page.screenshot({ path: file, animations: 'disabled' });
        await page.setViewportSize(vp);
      }
      shots++;
      let size = statSync(file).size;
      if (size >= 300 * 1024) {
        execFileSync('convert', [file, '-strip', '-dither', 'None', '-colors', '256', file]);
        size = statSync(file).size;
        console.log(`INFO ${vpName}-${theme}-${name}.png 量化为 PNG8 → ${(size / 1024).toFixed(0)}KB`);
      }
      const want = Object.fromEntries(query.split('&').map((kv) => kv.split('=')));
      ok(m.sw <= vp.width && m.bw <= vp.width, `${vpName}-${theme}-${name}: scrollWidth=${m.sw}/${m.bw} ≤ ${vp.width}`);
      ok(m.overflow.length === 0, `${vpName}-${theme}-${name}: 无元素超出视口右缘${m.overflow.length ? ' → ' + m.overflow.join(' | ') : ''}`);
      ok(m.small.length === 0, `${vpName}-${theme}-${name}: 可点元素热区 ≥40×40${m.small.length ? ' → ' + m.small.join(' | ') : ''}`);
      ok(m.theme === theme && m.state === want.state && m.tab === want.tab && m.paneVisible === `pane-${want.tab}`, `${vpName}-${theme}-${name}: data-theme/data-state/data-tab 正确且仅显示对应 pane（${m.paneVisible}）`);
      if (want.open && !/^(notifications|account|drawer)$/.test(want.open)) ok(m.open === want.open, `${vpName}-${theme}-${name}: Dialog ${want.open} 已打开`);
      if (want.state === 'saved') ok(m.toast, `${vpName}-${theme}-${name}: saved 显示 Toast`);
      ok(size < 300 * 1024, `${vpName}-${theme}-${name}.png ${(size / 1024).toFixed(0)}KB < 300KB`);
    }
  }
  ok(errors.length === 0, `${vpName}: console error = ${errors.length}${errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();

// ---------- 键盘可达 / 交互检查（1440 亮色） ----------
{
  const b2 = await chromium.launch();
  const page = await b2.newPage({ viewport: viewports.desktop });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${fileUrl}?tab=profile&state=default&theme=light`);
  await page.keyboard.press('Tab');
  ok((await page.evaluate(() => document.activeElement.className)).includes('skip'), 'Tab 首焦点为跳转链接');
  const activeNav = await page.evaluate(() => { const a = document.querySelector('#nav [aria-current="page"]'); return a && a.textContent.trim(); });
  ok(activeNav === '设置', `侧边栏 aria-current = 「${activeNav}」`);
  // Tabs：点击 / 方向键 / URL 同步
  await page.click('#tab-security');
  ok((await page.getAttribute('html', 'data-tab')) === 'security' && page.url().includes('tab=security') && !(await page.isHidden('#pane-security')), '点击 Tab「账号安全」切换 pane 并同步 URL');
  await page.focus('#tab-security'); await page.keyboard.press('ArrowDown');
  ok((await page.getAttribute('html', 'data-tab')) === 'notifications' && (await page.evaluate(() => document.activeElement.id)) === 'tab-notifications', 'Tabs ArrowDown → 通知（焦点随动）');
  await page.keyboard.press('End');
  ok((await page.getAttribute('html', 'data-tab')) === 'billing', 'Tabs End → 计费');
  await page.keyboard.press('ArrowDown');
  ok((await page.getAttribute('html', 'data-tab')) === 'profile', 'Tabs 从末项 ArrowDown 循环到个人资料');
  // 个人资料：脏 → 保存 → saving → saved Toast；重置
  await page.fill('#pName', '沈若琳琳');
  ok((await page.getAttribute('#profileForm .savebar', 'data-dirty')) === 'true' && !(await page.isDisabled('#profileForm [type="reset"]')), '编辑姓名后出现「有未保存的修改」且重置可用');
  ok((await page.textContent('#profileAvatar')).trim() === '琳', '头像取姓名末字');
  await page.click('#profileForm [type="submit"]');
  ok((await page.getAttribute('html', 'data-state')) === 'saving' && (await page.getAttribute('#profileForm', 'aria-busy')) === 'true', '点击保存 → saving（表单 aria-busy）');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-state') === 'saved');
  ok(!(await page.isHidden('#toast')) && (await page.textContent('#toastText')).includes('个人资料已保存'), 'saving → saved：Toast「个人资料已保存」');
  ok((await page.getAttribute('#profileForm .savebar', 'data-dirty')) === 'false', '保存后脏标记清除');
  await page.fill('#pName', '临时'); await page.click('#profileForm [type="reset"]');
  ok((await page.inputValue('#pName')) === '沈若琳', '重置恢复已保存值');
  // 脏状态切 Tab → 离开确认
  await page.fill('#pName', '临时');
  await page.click('#tab-team');
  ok((await page.getAttribute('html', 'data-open')) === 'leave' && (await page.getAttribute('html', 'data-tab')) === 'profile', '有未保存修改时切 Tab 弹出「离开页面？」且不切换');
  await page.keyboard.press('Escape');
  ok((await page.getAttribute('html', 'data-open')) === null && (await page.evaluate(() => document.activeElement.id)) === 'tab-team', 'Escape 关闭 Dialog，焦点回到触发 Tab');
  await page.click('#tab-team'); await page.click('#leaveConfirm');
  ok((await page.getAttribute('html', 'data-tab')) === 'team' && (await page.evaluate(() => document.getElementById('pName').value)) === '沈若琳', '「放弃并离开」→ 切到团队并丢弃修改');
  // 时区 Combobox
  await page.click('#tab-profile');
  await page.fill('#pTz', '东京');
  ok(!(await page.isHidden('#tzList')) && (await page.evaluate(() => document.querySelectorAll('#tzList [role="option"]').length)) === 1, 'Combobox 输入「东京」过滤到 1 项');
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
  ok((await page.inputValue('#pTz')).includes('东京') && (await page.getAttribute('#pTz', 'data-key')) === 'Asia/Tokyo' && (await page.isHidden('#tzList')), 'ArrowDown + Enter 选中 Asia/Tokyo 并关闭列表');
  // 错误态 → 重试
  await page.goto(`${fileUrl}?tab=profile&state=error&theme=light`);
  ok(!(await page.isHidden('#saveError')) && (await page.textContent('#saveErrorText')).includes('保存失败：网络超时，请重试'), 'error 显示 Alert「保存失败：网络超时，请重试」');
  await page.click('#retryBtn');
  ok((await page.getAttribute('html', 'data-state')) === 'saving', '错误态点击重试 → saving');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-state') === 'saved');
  ok(true, 'saving → saved');
  // 密码强度 + 校验
  await page.goto(`${fileUrl}?tab=security&state=default&theme=light`);
  await page.fill('#pwdNew', 'abcdefgh');
  const lv1 = await page.getAttribute('#strength', 'data-level');
  await page.fill('#pwdNew', 'Abcdefgh');
  const lv2 = await page.getAttribute('#strength', 'data-level');
  await page.fill('#pwdNew', 'Abcdefg1!');
  const lv3 = await page.getAttribute('#strength', 'data-level');
  ok(lv1 === '1' && lv2 === '2' && lv3 === '3' && (await page.textContent('#strengthLabel')) === '强', `密码强度 1/2/3 级（${lv1}/${lv2}/${lv3}，标签「强」）`);
  ok((await page.evaluate(() => [...document.querySelectorAll('#pwdRules li')].every((li) => li.getAttribute('data-ok') === 'true'))), '三条密码规则全部打勾');
  await page.fill('#pwdCur', 'oldpass'); await page.fill('#pwdConfirm', 'Abcdefg2!');
  await page.click('#pwdForm [type="submit"]');
  ok((await page.evaluate(() => document.getElementById('pwdConfirm').closest('.field').classList.contains('is-invalid') && document.activeElement.id === 'pwdConfirm')), '确认密码不一致 → 内联错误并聚焦');
  // 2FA：开关 → 内联面板 → 6 位码 → 已启用；再关 → Dialog
  await page.click('#twofaSwitch');
  ok((await page.getAttribute('html', 'data-twofa')) === 'setup' && (await page.evaluate(() => getComputedStyle(document.getElementById('twofaPanel')).display)) === 'grid', 'Switch 开启 → 展开 2FA 设置面板');
  const qrRects = await page.evaluate(() => document.querySelectorAll('#qr svg rect').length);
  ok(qrRects > 200, `二维码位为纯 SVG（${qrRects} 个模块）`);
  await page.keyboard.type('123456');
  await page.click('#twofaVerify');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-twofa') === 'on');
  ok((await page.getAttribute('#twofaSwitch', 'aria-checked')) === 'true' && (await page.textContent('#toastText')).includes('两步验证已启用'), '6 位码验证 → 已启用 + Toast');
  await page.click('#twofaSwitch');
  ok((await page.getAttribute('html', 'data-open')) === '2fa-disable', '已启用时关闭 Switch → Dialog「关闭两步验证？」');
  await page.click('#twofaDisableBtn');
  ok((await page.getAttribute('html', 'data-twofa')) === 'off' && (await page.evaluate(() => document.activeElement.id)) === 'twofaSwitch', '确认关闭 → off，焦点回 Switch');
  // 会话
  const before = await page.evaluate(() => document.querySelectorAll('#sessList li').length);
  await page.click('#sessList [data-revoke]');
  const after = await page.evaluate(() => document.querySelectorAll('#sessList li').length);
  ok(before === 3 && after === 2, `注销单个会话 3 → ${after}`);
  await page.click('#revokeAll');
  ok((await page.evaluate(() => document.querySelectorAll('#sessList li').length)) === 1 && (await page.isDisabled('#revokeAll')) && (await page.evaluate(() => document.querySelector('#sessList + .empty-inline').classList.contains('is-visible'))), '注销全部 → 仅当前设备 + 空态「没有其他活跃会话」');
  // 通知：Switch / 分组全开 / 渠道分段
  await page.goto(`${fileUrl}?tab=notifications&state=default&theme=light`);
  const sw = page.locator('#notifRows .switch[data-key="new_order"][data-ch="email"]');
  await sw.click();
  ok((await sw.getAttribute('aria-checked')) === 'true' && (await page.getAttribute('#notifForm .savebar', 'data-dirty')) === 'true', '切换通知 Switch → 脏标记');
  await page.click('#notifRows [data-group="orders"][data-all="false"]');
  ok((await page.evaluate(() => [...document.querySelectorAll('#notifRows .switch[data-key="new_order"], #notifRows .switch[data-key="refund"]')].every((b) => b.getAttribute('aria-checked') === 'false'))), '「全部关闭」关闭分组内全部 Switch');
  await page.click('#channelSeg [data-channel="push"]');
  ok((await page.getAttribute('html', 'data-channel')) === 'push' && (await page.evaluate(() => getComputedStyle(document.querySelector('.ntable .col-email')).display)) === 'none', '渠道分段「推送」只显示推送列');
  await page.click('#quietSwitch');
  ok((await page.isDisabled('#quietStart')) && (await page.getAttribute('#quietBody', 'aria-disabled')) === 'true', '关闭免打扰 → 时间输入禁用');
  // 团队：邀请 chips / 移除 Dialog
  await page.goto(`${fileUrl}?tab=team&state=default&theme=light`);
  await page.fill('#inviteInput', 'bad-email'); await page.keyboard.press('Enter');
  ok((await page.evaluate(() => document.getElementById('inviteInput').closest('.field').classList.contains('is-invalid'))), '无效邮箱 → 「邮箱格式不正确」');
  await page.fill('#inviteInput', 'wenbo.guo@qimu-home.cn'); await page.keyboard.press('Enter');
  ok((await page.textContent('#inviteForm .err')).includes('已是成员'), '已有成员邮箱 → 「{email} 已是成员」');
  await page.fill('#inviteInput', 'zihan.zhou@qimu-home.cn'); await page.keyboard.press('Enter');
  ok((await page.evaluate(() => document.querySelectorAll('#chips .chip').length)) === 1, '有效邮箱回车 → Chip');
  await page.click('#inviteBtn');
  await page.waitForFunction(() => document.querySelectorAll('#pendList li').length === 2);
  ok((await page.textContent('#toastText')).includes('已向 1 位成员发送邀请') && (await page.textContent('#seats')).includes('5'), '发送邀请 → 待接受 +1，席位仍为成员数 已用 5 / 10');
  await page.click('#memberRows [data-remove="u_wenbo"]');
  ok((await page.getAttribute('html', 'data-open')) === 'remove' && (await page.textContent('#d4Title')) === '移除 郭文博？', 'Dialog「移除 郭文博？」');
  await page.click('#removeConfirm');
  ok((await page.evaluate(() => document.querySelectorAll('#memberRows tr').length)) === 4 && (await page.textContent('#toastText')).includes('已移除 郭文博'), '确认移除 → 成员 4 人 + Toast');
  // 计费：周期切换 / 价格 / 升级
  await page.goto(`${fileUrl}?tab=billing&state=default&theme=light`);
  const yearly = await page.evaluate(() => [...document.querySelectorAll('#plans .price strong')].map((s) => s.textContent));
  await page.click('#cycleSwitch');
  const monthly = await page.evaluate(() => [...document.querySelectorAll('#plans .price strong')].map((s) => s.textContent));
  ok(yearly.join() === '¥990,¥2,990,¥8,990' && monthly.join() === '¥99,¥299,¥899', `年付 ${yearly.join('/')} ↔ 月付 ${monthly.join('/')}`);
  ok((await page.getAttribute('html', 'data-cycle')) === 'monthly' && (await page.evaluate(() => document.querySelector('#plans .plan.is-current'))) === null, '切到月付后无「当前计划」卡（当前为年付）');
  await page.click('#plans [data-plan="starter"]');
  ok((await page.textContent('#planNow .big')).includes('入门版') && (await page.textContent('#planNow')).includes('¥99'), '选入门版月付 → 当前计划更新为 入门版 ¥99');
  ok((await page.evaluate(() => document.querySelectorAll('#invoiceRows tr').length)) === 4, '发票 4 行');
  // 危险区：短语精确匹配
  await page.click('#dzBtn');
  ok((await page.getAttribute('html', 'data-open')) === 'danger' && (await page.isDisabled('#dzConfirm')) && (await page.evaluate(() => document.activeElement.id)) === 'dzInput', 'Dialog「删除…」打开、确认禁用、焦点在输入框');
  await page.fill('#dzInput', '删除 栖木家具');
  ok((await page.isDisabled('#dzConfirm')) && (await page.evaluate(() => document.getElementById('dzField').classList.contains('is-invalid'))), '短语不匹配 → 仍禁用 + 内联错误');
  await page.fill('#dzInput', '删除 栖木家居');
  ok(!(await page.isDisabled('#dzConfirm')), '精确匹配 → 确认可用');
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  ok((await page.evaluate(() => !!document.activeElement.closest('#dlg-danger'))), 'Dialog 内 Tab 焦点圈定');
  await page.keyboard.press('Escape');
  ok((await page.getAttribute('html', 'data-open')) === null && (await page.evaluate(() => document.activeElement.id)) === 'dzBtn', 'Escape 关闭，焦点回「删除团队空间」按钮');
  // 壳：通知 Popover / 主题 / 侧栏
  await page.click('#bellBtn');
  ok(!(await page.isHidden('#notifPop')), '点击铃铛打开通知 Popover');
  await page.keyboard.press('Escape');
  ok((await page.isHidden('#notifPop')) && (await page.evaluate(() => document.activeElement.id)) === 'bellBtn', 'Escape 关闭 Popover，焦点回铃铛');
  await page.click('#acctBtn'); await page.keyboard.press('ArrowDown');
  ok((await page.evaluate(() => document.activeElement.getAttribute('role'))) === 'menuitem', '账号菜单 ArrowDown 聚焦 menuitem');
  await page.click('#acctPop [data-tab="security"]');
  ok((await page.getAttribute('html', 'data-tab')) === 'security' && (await page.isHidden('#acctPop')), '账号菜单「账号安全」→ 切 Tab 并关闭菜单');
  await page.click('#themeBtn');
  ok((await page.getAttribute('html', 'data-theme')) === 'dark', '主题按钮切换为暗色');
  await page.click('#collapseBtn'); await page.waitForTimeout(400);
  const railW = await page.evaluate(() => document.getElementById('sidebar').getBoundingClientRect().width);
  ok((await page.getAttribute('html', 'data-sidebar')) === 'rail' && railW === 64, `侧边栏收起为图标栏（${railW} = --size-sidebar-rail）`);
  // 未实现导航项
  const navMeta = await page.evaluate(() => {
    const items = [...document.querySelectorAll('#nav .nav-item')]; const dis = items.filter((a) => a.getAttribute('aria-disabled') === 'true');
    return { total: items.length, disabled: dis.length, withHref: dis.filter((a) => a.hasAttribute('href')).length, cursor: dis.every((a) => getComputedStyle(a).cursor === 'not-allowed'), focusable: dis.every((a) => a.tabIndex === 0) };
  });
  ok(navMeta.total === 8 && navMeta.disabled === 6 && navMeta.withHref === 0 && navMeta.cursor && navMeta.focusable, `未实现导航项 6/8 aria-disabled 无 href + cursor:not-allowed + 可聚焦（${navMeta.disabled}/${navMeta.total}）`);

  // 文案极值：长姓名 / 长邮箱 / 长金额（375）不溢出
  const mob = await b2.newPage({ viewport: viewports.mobile });
  await mob.goto(`${fileUrl}?tab=team&state=default&theme=light`);
  await mob.evaluate(() => document.fonts.ready);
  const ext = await mob.evaluate(() => {
    const c = document.querySelector('#memberCards .tcard'); c.querySelector('.name').firstChild.textContent = '欧阳雨薇·玛丽亚·冯·施特劳斯（华东大区客户成功负责人）'; c.querySelector('.m').textContent = 'yuwei.ouyang.maria.von.strauss@customer-success-huadong.qimu-home.cn';
    const s = document.getElementById('seats'); s.querySelector('b').textContent = '9999';
    return { doc: document.documentElement.scrollWidth, cardRight: Math.round(c.getBoundingClientRect().right), nameOver: c.querySelector('.name').getBoundingClientRect().right > c.getBoundingClientRect().right + 0.5, mailOver: c.querySelector('.m').getBoundingClientRect().right > c.getBoundingClientRect().right + 0.5 };
  });
  ok(ext.doc <= 375 && ext.cardRight <= 375 && !ext.nameOver && !ext.mailOver, `375 成员卡长姓名 + 长邮箱不溢出（doc=${ext.doc} cardRight=${ext.cardRight}）`);
  await mob.goto(`${fileUrl}?tab=billing&state=default&theme=light`);
  const ext2 = await mob.evaluate(() => {
    document.querySelectorAll('#plans .price strong').forEach((s) => { s.textContent = '¥1,289,990'; });
    document.querySelectorAll('#invoiceCards .amount').forEach((s) => { s.textContent = '¥1,289,990.00'; });
    const p = document.querySelector('#plans .plan').getBoundingClientRect();
    return { doc: document.documentElement.scrollWidth, planRight: Math.round(p.right), over: [...document.querySelectorAll('#plans .price, #invoiceCards .bot')].filter((el) => el.scrollWidth > el.clientWidth + 1).length };
  });
  ok(ext2.doc <= 375 && ext2.planRight <= 375 && ext2.over === 0, `375 计划卡 ¥1,289,990 / 发票卡长金额不溢出（doc=${ext2.doc} over=${ext2.over}）`);
  // 未实现项对比度 ≥ 4.5（亮/暗），跳转链接高 ≥ 40
  const lum = (rgb) => { const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map((c) => { c = +c / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const contrast = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  for (const theme of ['light', 'dark']) {
    await mob.goto(`${fileUrl}?tab=profile&state=default&theme=${theme}&open=drawer`);
    await mob.waitForTimeout(300);
    const a11y = await mob.evaluate(() => {
      const dis = document.querySelector('#nav .nav-item[aria-disabled="true"]');
      const muted = document.querySelector('.card-head .desc'); const card = muted.closest('.card');
      return { fg: getComputedStyle(dis).color, bg: getComputedStyle(document.getElementById('sidebar')).backgroundColor, skipH: document.querySelector('.skip').getBoundingClientRect().height, mfg: getComputedStyle(muted).color, mbg: getComputedStyle(card).backgroundColor };
    });
    ok(contrast(a11y.fg, a11y.bg) >= 4.5, `${theme}: 未实现导航项/侧栏背景对比度 = ${contrast(a11y.fg, a11y.bg).toFixed(2)}:1 ≥ 4.5`);
    ok(contrast(a11y.mfg, a11y.mbg) >= 4.5, `${theme}: 辅助文字/卡片背景对比度 = ${contrast(a11y.mfg, a11y.mbg).toFixed(2)}:1 ≥ 4.5`);
    ok(a11y.skipH >= 40, `${theme}: 跳转链接高度 = ${a11y.skipH} ≥ 40`);
  }
  // 375：Tabs 横向可滚动、表格变卡片、抽屉键盘
  await mob.goto(`${fileUrl}?tab=team&state=default&theme=light`);
  await mob.waitForTimeout(250);
  const mobMeta = await mob.evaluate(() => ({
    tabsScroll: document.getElementById('stabs').scrollWidth > document.getElementById('stabs').clientWidth || getComputedStyle(document.getElementById('stabs')).overflowX === 'auto',
    tableHidden: getComputedStyle(document.querySelector('.ttable-wrap')).display === 'none', cards: document.querySelectorAll('#memberCards .tcard').length,
    orientation: document.getElementById('stabs').getAttribute('aria-orientation'), inert: document.getElementById('sidebar').inert, vis: getComputedStyle(document.getElementById('sidebar')).visibility,
  }));
  ok(mobMeta.tabsScroll && mobMeta.orientation === 'horizontal', '375 Tabs 横向可滚动且 aria-orientation=horizontal');
  ok(mobMeta.tableHidden && mobMeta.cards === 5, `375 成员表变卡片（${mobMeta.cards} 张）`);
  ok(mobMeta.inert && mobMeta.vis === 'hidden', '375 抽屉关闭：侧栏 inert + visibility:hidden');
  await mob.keyboard.press('Tab'); await mob.keyboard.press('Tab');
  ok((await mob.evaluate(() => document.activeElement.id)) === 'drawerOpen', '375 Tab 序列第 2 位 = 汉堡按钮');
  await mob.click('#drawerOpen'); await mob.waitForTimeout(300);
  ok((await mob.getAttribute('html', 'data-drawer')) === 'open' && (await mob.evaluate(() => document.getElementById('sidebar').contains(document.activeElement))), '汉堡按钮打开抽屉，焦点进入侧栏');
  await mob.keyboard.press('Escape'); await mob.waitForTimeout(300);
  ok((await mob.evaluate(() => document.activeElement.id)) === 'drawerOpen', 'Escape 关闭抽屉，焦点回汉堡');
  // 1024 默认 rail；768 抽屉
  const t = await b2.newPage({ viewport: viewports.tablet });
  await t.goto(`${fileUrl}?tab=billing&state=default&theme=light`); await t.waitForTimeout(250);
  ok((await t.getAttribute('html', 'data-sidebar')) === 'rail' && (await t.evaluate(() => document.documentElement.scrollWidth)) <= 1024, '1024 侧边栏默认 rail 且无横向滚动');
  ok((await t.evaluate(() => document.querySelectorAll('#plans .plan').length === 3 && [...document.querySelectorAll('#plans .plan')].every((p, i, a) => i === 0 || Math.abs(p.getBoundingClientRect().top - a[0].getBoundingClientRect().top) < 1))), '1024 三档计划卡同一行');
  await t.setViewportSize(viewports.tabletSm);
  await t.goto(`${fileUrl}?tab=team&state=default&theme=light`); await t.waitForTimeout(250);
  const sm = await t.evaluate(() => ({ sw: document.documentElement.scrollWidth, drawerBtn: getComputedStyle(document.getElementById('drawerOpen')).display !== 'none', sbOff: document.getElementById('sidebar').getBoundingClientRect().right <= 0, hTabs: document.getElementById('stabs').getAttribute('aria-orientation') }));
  ok(sm.sw <= 768 && sm.drawerBtn && sm.sbOff && sm.hTabs === 'horizontal', `768 抽屉模式 + 横向 Tabs + 无横向滚动（sw=${sm.sw}）`);
  ok(errors.length === 0, `交互检查 console error = ${errors.length}${errors.length ? ' → ' + errors.slice(0, 3).join(' | ') : ''}`);
  await b2.close();
}

const pngs = readdirSync(outDir).filter((f) => f.endsWith('.png'));
const badName = pngs.filter((f) => !/^(desktop|tablet|tabletSm|mobile)-(light|dark)-[a-z0-9-]+\.png$/.test(f));
ok(badName.length === 0, `ref/*.png 命名 {viewport}-{theme}-{state}.png（异常 ${badName.length}）`);
const big = pngs.filter((f) => statSync(join(outDir, f)).size >= 300 * 1024);
ok(big.length === 0, `ref/*.png 全部 <300KB（超限 ${big.length}）`);
console.log(`\nref/*.png = ${pngs.length} 张（本次新截 ${shots}）`);
finish();

function finish() {
  console.log(`\n${fails.length === 0 ? '全部通过' : `失败 ${fails.length} 项`}`);
  process.exit(fails.length ? 1 : 0);
}
