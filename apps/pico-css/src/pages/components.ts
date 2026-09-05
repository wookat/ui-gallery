import contract from "@ui-gallery/spec/contract.json"
import { coverage } from "../coverage"
import { icon } from "../icons"

const keys = contract.components as string[]
const button = (label: string, cls = "", extra = "") => `<button class="${cls}" ${extra}>${label}</button>`
const input = (type = "text", extra = "") => `<input type="${type}" ${extra}>`

function demo(name: string): string {
  if (coverage[name] === "missing") return `<article class="muted-demo">${icon("circle-help")}<strong>Pico CSS 无此组件</strong><small>使用原生元素或组合实现。</small></article>`
  switch (name) {
    case "Typography": return `<h1>标题 H1</h1><h2>标题 H2</h2><h3>标题 H3</h3><h4>标题 H4</h4><h5>标题 H5</h5><h6>标题 H6</h6><p>正文、<mark>强调</mark>、<small>辅助文本</small>与<a href="#component-index">链接</a>。</p><blockquote>原生 HTML 元素由 Pico CSS 提供默认样式。</blockquote><ul><li>无序列表</li><li>第二项</li></ul>`
    case "Button": return `<div class="demo-row">${button("主要")}${button("次要", "secondary")}${button("对比", "contrast")}${button("主要轮廓", "outline")}${button("次要轮廓", "secondary outline")}${button("对比轮廓", "contrast outline")}${button("禁用", "", "disabled")}${button("加载中", "", 'aria-busy="true"')}</div><div class="demo-row"><small>${button(`${icon("plus")}小型行内按钮`, "outline")}</small>${button(`${icon("check")}保存并继续`)}${button(`${icon("check")}`, "outline", 'aria-label="确认"')}</div>`
    case "ButtonGroup": return `<div class="demo-row"><div role="group">${button("左")}${button("中")}${button("右")}</div><div role="group">${button("编辑", "outline")}${button("删除", "outline contrast")}</div></div>`
    case "IconButton": return `<div class="demo-row icon-button-matrix">${["", "secondary", "contrast", "outline"].map((cls) => button(icon(cls === "contrast" ? "trash" : "plus"), cls, `aria-label="${cls || "primary"} icon button"`)).join("")}</div>`
    case "Input": return `<div class="form-grid"><label>文本${input("text", 'placeholder="输入文本"')}</label><label>密码<div class="input-with-action">${input("password", 'value="secret"')}<button class="outline" type="button" aria-label="显示密码">${icon("eye")}</button></div></label><label>搜索${input("search", 'placeholder="搜索"')}</label><label>前缀图标<div class="input-with-icon">${icon("mail")}${input("email", 'placeholder="邮箱"')}</div></label><label>后缀${input("text", 'value="suffix"')}</label><label>禁用${input("text", "disabled value=\"disabled\"")}</label><label>只读${input("text", "readonly value=\"readonly\"")}</label><label>无效${input("text", 'aria-invalid="true" value="invalid"')}<small>请输入有效内容</small></label><label>有效${input("text", 'aria-invalid="false" value="valid"')}</label></div>`
    case "Textarea": return `<label>多行文本<textarea rows="3" placeholder="输入内容…"></textarea><small>最多 500 个字符</small></label>`
    case "NumberInput": return `<label>数量<div role="group">${button("-", "outline", 'type="button"')}${input("number", 'value="2" min="0"')}${button("+", "outline", 'type="button"')}</div></label>`
    case "Select": return `<label>默认<select><option>选项一</option><option>选项二</option></select></label><label>禁用<select disabled><option>禁用选择</option></select></label><label>无效<select aria-invalid="true"><option>无效选择</option></select></label>`
    case "MultiSelect": return `<label>多选<select multiple><option selected>Web</option><option selected>iOS</option><option>Android</option></select></label>`
    case "Combobox": return `<details class="dropdown"><summary role="button" class="outline">Combobox</summary><ul><li><input type="search" placeholder="筛选选项"></li><li><a href="#component-Combobox">订单</a></li><li><a href="#component-Combobox">客户</a></li></ul></details>`
    case "Autocomplete": return `<label>Autocomplete${input("text", 'list="component-options" placeholder="输入关键词"')}<datalist id="component-options"><option value="订单分析"><option value="客户画像"><option value="收入报表"></datalist></label>`
    case "Checkbox": return `<fieldset><label><input type="checkbox" checked>已选</label><label><input type="checkbox">未选</label><label><input type="checkbox" disabled>禁用</label><label><input class="indeterminate-checkbox" type="checkbox">双击切换 indeterminate</label></fieldset>`
    case "Radio": return `<fieldset><label><input type="radio" name="radio-demo" checked>选项一</label><label><input type="radio" name="radio-demo">选项二</label><label><input type="radio" disabled>禁用</label></fieldset>`
    case "Switch": return `<div class="switch-demo"><label><input type="checkbox" role="switch" checked>开启</label><label><input type="checkbox" role="switch">关闭</label><label><input type="checkbox" role="switch" disabled>禁用</label></div>`
    case "Slider": return `<label>当前值 60<input type="range" value="60"></label><label>禁用<input type="range" value="30" disabled></label>`
    case "Rating": return `<div aria-label="4 of 5 stars" class="rating">${[1, 2, 3, 4, 5].map((n) => `<span class="${n === 5 ? "empty-star" : ""}">${icon("star", 22)}</span>`).join("")}</div><small>只读评分</small>`
    case "DatePicker": return `<label>日期${input("date", 'value="2026-09-15"')}</label>`
    case "TimePicker": return `<label>时间${input("time", 'value="09:30"')}</label>`
    case "DateRangePicker": return `<div class="form-grid"><label>开始${input("date")}</label><label>结束${input("date")}</label></div>`
    case "ColorPicker": return `<label>颜色${input("color", 'value="#0172ad"')}</label>`
    case "Upload": return `<label class="upload-box">${icon("upload")}拖拽文件或点击上传<input type="file" multiple hidden></label><ul><li>report.pdf · 2.4 MB</li></ul>`
    case "Cascader": return `<div class="form-grid"><select aria-label="一级分类"><option>产品</option><option>营销</option></select><select aria-label="二级分类"><option>订单</option><option>客户</option></select></div>`
    case "Transfer": return `<div class="transfer-demo"><ul><li>可选成员</li><li>王子涵</li><li>Alex Chen</li></ul><div>${button("→", "outline")}${button("←", "outline")}</div><ul><li>已选成员</li><li>林晓</li></ul></div>`
    case "Mention": return `<label>提及成员<textarea list="mention-options" placeholder="输入 @ 提及成员"></textarea><datalist id="mention-options"><option value="@林晓"><option value="@王子涵"></datalist></label>`
    case "PinInput": return `<div class="pin-input">${Array.from({ length: 6 }, (_, i) => input("text", `maxlength="1" aria-label="验证码第 ${i + 1} 位"`)).join("")}</div>`
    case "Form": return `<form class="form-grid"><label>姓名${input("text", "required")}</label><label>邮箱${input("email", "required")}</label><label class="span-2"><button>提交表单</button></label></form>`
    case "Table": return `<figure class="overflow-auto"><table class="striped demo-table"><thead><tr><th><input type="checkbox" aria-label="全选"></th><th>名称 ↕</th><th>状态</th><th>金额</th></tr></thead><tbody><tr><td><input type="checkbox"></td><td>ORD-2401</td><td><mark>已支付</mark></td><td>¥1,280.00</td></tr><tr><td><input type="checkbox"></td><td>ORD-2402</td><td><mark>处理中</mark></td><td>¥420.00</td></tr><tr><td colspan="4">暂无更多数据</td></tr></tbody></table></figure><footer role="group">${button("上一页", "outline", "disabled")}${button("1")}${button("下一页", "outline")}</footer>`
    case "DataGrid": return `<figure class="overflow-auto data-grid-demo"><table class="striped sticky-table"><thead><tr><th>订单号</th><th>客户</th><th>日期</th><th>状态</th></tr></thead><tbody>${["ORD-2401", "ORD-2402", "ORD-2403"].map((x) => `<tr><td>${x}</td><td>林晓</td><td>2026-09-15</td><td><mark>已支付</mark></td></tr>`).join("")}</tbody></table></figure><footer role="group">${button("1")}${button("2", "outline")}${button("下一页", "outline")}</footer>`
    case "Descriptions": return `<dl class="description-list"><dt>订单号</dt><dd>ORD-2401</dd><dt>客户</dt><dd>林晓</dd><dt>状态</dt><dd>已支付</dd><dt>金额</dt><dd>¥1,280.00</dd></dl>`
    case "List": return `<ul class="component-list"><li><span class="avatar">林</span><span><strong>林晓</strong><small>刚刚更新了订单</small></span></li><li><span class="avatar">王</span><span><strong>王子涵</strong><small>邀请了新成员</small></span></li></ul>`
    case "Card": return `<div class="card-demo"><article><header><h3>基础卡片</h3></header><p>卡片正文内容。</p><footer>${button("操作", "outline")}</footer></article><article><div class="card-image-placeholder"></div><h3>图片卡片</h3><p>带媒体区域的卡片。</p><footer>${button("编辑", "outline")}${button("删除", "outline contrast")}</footer></article></div>`
    case "Avatar": return `<div class="avatar-sizes">${["xs", "sm", "md", "lg", "xl"].map((size) => `<span class="avatar avatar-${size}">${size[0].toUpperCase()}</span>`).join("")}<span class="avatar avatar-status">林<i></i></span></div>`
    case "AvatarGroup": return `<div class="avatar-group avatar-overlap"><span class="avatar">林</span><span class="avatar">王</span><span class="avatar">A</span><span class="avatar">M</span><span class="avatar">+8</span></div>`
    case "Badge": return `<div class="demo-row"><mark>默认</mark><mark class="badge-success">成功</mark><mark class="badge-warning">警告</mark><mark class="badge-danger">危险</mark><mark class="badge-info">信息</mark></div>`
    case "Tag": return `<div class="demo-row"><small class="status status-paid">成功</small><small class="status status-pending">警告</small><small class="status status-failed">危险</small><small class="status">信息</small></div>`
    case "Statistic": return `<div class="stats-grid mini-stats"><article><small>收入</small><strong>¥128,430</strong><span class="delta-up">${icon("trending-up")}12.4%</span></article><article><small>订单</small><strong>1,024</strong><span class="delta-up">${icon("trending-up")}8.2%</span></article><article><small>退款</small><strong>12</strong><span class="delta-down">${icon("trending-down")}2.1%</span></article></div>`
    case "Timeline": return `<ul class="timeline"><li><strong>创建项目</strong><small>刚刚</small></li><li><strong>邀请团队成员</strong><small>1 小时前</small></li><li><strong>完成部署</strong><small>昨天</small></li></ul>`
    case "Tree": return `<details open><summary>工作区</summary><ul><li><details><summary>订单</summary><ul><li>列表</li><li>分析</li></ul></details></li><li>设置</li></ul></details>`
    case "Calendar": return `<table class="calendar-demo"><thead><tr>${["一", "二", "三", "四", "五", "六", "日"].map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${Array.from({ length: 5 }, (_, row) => `<tr>${Array.from({ length: 7 }, (_, col) => `<td>${row * 7 + col + 1}</td>`).join("")}</tr>`).join("")}</tbody></table>`
    case "Image": return `<figure><div class="image-placeholder" role="img" aria-label="产品预览">${icon("image", 32)}</div><figcaption>产品预览</figcaption></figure>`
    case "Empty": return `<article class="empty-state">${icon("inbox", 32)}<h3>暂无内容</h3><p>没有可展示的数据。</p>${button("创建第一条记录")}</article>`
    case "Tooltip": return `<div class="demo-row tooltip-demo">${["top", "right", "bottom", "left"].map((place) => button(place, "outline", `data-tooltip="${place} 提示" data-placement="${place}"`)).join("")}</div>`
    case "Popover": return `<details class="dropdown"><summary role="button" class="outline">打开 Popover</summary><ul><li><strong>快捷操作</strong></li><li><a href="#component-Popover">查看详情</a></li></ul></details>`
    case "Segmented": return `<div class="demo-row" role="group" aria-label="视图切换">${button("列表", "", 'aria-pressed="true"')}${button("看板", "outline", 'aria-pressed="false"')}${button("日历", "outline", 'aria-pressed="false"')}</div>`
    case "Alert": return `<div class="alert-stack"><article role="alert" class="alert-info">${icon("info")}信息提示 <button class="outline">×</button></article><article role="alert" class="alert-success">${icon("check-circle")}操作成功</article><article role="alert" class="alert-warning">${icon("alert-triangle")}注意事项</article><article role="alert" class="alert-danger">${icon("x")}危险操作</article></div>`
    case "Toast": return `<div class="demo-row toast-controls">${button("信息提示", "outline", 'data-toast="info"')}${button("成功提示", "outline", 'data-toast="success"')}${button("危险提示", "outline", 'data-toast="danger"')}</div>`
    case "Notification": return `<div class="notification-list"><article><span class="unread-dot"></span><strong>订单已支付</strong><small>刚刚 · ORD-2401</small></article><article><strong>团队邀请</strong><small>昨天 · 王子涵</small></article></div>`
    case "Dialog": return `<div class="demo-row">${button("默认对话框", "outline", 'data-dialog="default"')}${button("危险确认", "outline contrast", 'data-dialog="danger"')}${button("表单对话框", "outline", 'data-dialog="form"')}</div>`
    case "Drawer": return `<div class="demo-row">${["right", "left", "top", "bottom"].map((direction) => button(`${direction} drawer`, "outline", `data-drawer="${direction}"`)).join("")}</div>`
    case "Progress": return `<progress value="65" max="100"></progress><progress></progress><div class="circular-progress">65%</div><div class="steps-progress"><span class="done"></span><span class="done"></span><span></span></div>`
    case "Skeleton": return `<div class="skeleton-card"><span class="skeleton skeleton-avatar"></span><div><span class="skeleton skeleton-line"></span><span class="skeleton skeleton-line short"></span></div></div>`
    case "Spinner": return `<div class="demo-row"><button aria-busy="true">处理中</button><article aria-busy="true">加载内容中…</article>${icon("loader", 24)}</div>`
    case "Result": return `<div class="result-grid"><article>${icon("check-circle")}<h3>操作成功</h3><p>你的更改已保存。</p>${button("返回", "outline")}</article><article>${icon("x")}<h3>操作失败</h3><p>请稍后重试。</p>${button("重试", "outline")}</article><article><h3>404</h3><p>页面不存在。</p>${button("返回首页", "outline")}</article></div>`
    case "Popconfirm": return `<details class="dropdown"><summary role="button" class="outline">删除项目</summary><ul><li>确定删除？</li><li>${button("确认", "contrast")}${button("取消", "outline")}</li></ul></details>`
    case "Menu": return `<aside class="menu-demo"><nav aria-label="组件菜单"><ul><li><a href="#component-Menu" aria-current="page">${icon("home")}<span>概览</span></a></li><li><a href="#component-Menu">${icon("settings")}<span>设置</span></a></li><li><hr></li><li><details><summary>${icon("more-horizontal")}<span>更多</span></summary><ul><li><a href="#component-Menu">${icon("circle-help")}<span>帮助</span></a></li></ul></details></li></ul></nav></aside>`
    case "Dropdown": return `<details class="dropdown"><summary role="button" class="outline">打开菜单</summary><ul><li><strong>操作</strong></li><li><a href="#component-Dropdown">编辑</a></li><li><label><input type="checkbox" checked> 显示通知</label></li><li><a aria-disabled="true">禁用项</a></li></ul></details>`
    case "Breadcrumb": return `<nav aria-label="breadcrumb"><a href="#component-index">首页</a><span>/</span><a href="#component-Breadcrumb">工作区</a><span>/</span><span>当前页面</span></nav>`
    case "Tabs": return `<div class="tabs-demo"><div role="tablist">${button("概览", "", 'role="tab" aria-selected="true" data-tab="overview"')}${button("详情", "outline", 'role="tab" aria-selected="false" data-tab="details"')}</div><article data-tab-panel="overview">概览内容</article><article data-tab-panel="details" hidden>详情内容</article></div>`
    case "Pagination": return `<div role="group" class="pagination-demo">${button("上一页", "outline", "disabled")}${button("1")}${button("2", "outline")}${button("3", "outline")}${button("…", "outline")}${button("10", "outline")}${button("下一页", "outline")}</div>`
    case "Steps": return `<ol class="stepper"><li class="done"><span class="step-number">✓</span>基本信息</li><li class="active"><span class="step-number">2</span>确认</li><li><span class="step-number">3</span>完成</li></ol><ol class="stepper vertical"><li class="done">已完成</li><li class="active">进行中</li><li>待开始</li></ol>`
    case "Anchor": return `<nav class="anchor-demo"><a href="#component-Button">Button</a><a href="#component-Input">Input</a><a href="#component-Table">Table</a></nav>`
    case "BackTop": return button("↑ 返回顶部", "outline", 'data-back-top="true"')
    case "Affix": return `<div class="affix-demo">滚动时保持在顶部</div>`
    case "Navbar": return `<nav class="navbar-demo"><a href="#component-Navbar"><strong>Acme</strong></a><a href="#component-Navbar">产品</a><a href="#component-Navbar">文档</a>${button("登录", "outline")}</nav>`
    case "Sidebar": return `<aside class="sidebar-mini"><a class="active" href="#component-Sidebar">${icon("home")}概览</a><a href="#component-Sidebar">${icon("settings")}设置</a><a href="#component-Sidebar">${icon("users")}团队</a></aside>`
    case "CommandPalette": return `<button type="button" class="outline" data-command-palette>打开命令面板 <kbd>⌘K</kbd></button><dialog class="command-palette"><article><header><strong>命令面板</strong><button type="button" class="outline" data-command-close aria-label="关闭">×</button></header><input type="search" placeholder="搜索命令…"><ul><li>打开设置 <kbd>⌘K</kbd></li><li>创建订单</li><li>切换主题</li></ul></article></dialog>`
    case "Grid": return `<div class="grid demo-grid"><span>列一</span><span>列二</span><span>列三</span></div>`
    case "Stack": return `<div class="stack-demo">${button("第一项", "outline")}${button("第二项", "outline")}${button("第三项", "outline")}</div>`
    case "Layout": return `<div class="layout-demo"><header>Header</header><main>主内容</main><aside>Sidebar</aside><footer>Footer</footer></div>`
    case "Container": return `<main class="container container-demo">Pico .container 内容宽度示例</main>`
    case "AspectRatio": return `<div class="aspect-ratio-demo">16:9</div>`
    case "Resizable": return `<div class="resizable-demo">可拖拽调整大小</div>`
    case "ScrollArea": return `<div class="overflow-auto scroll-demo">${Array.from({ length: 8 }, (_, i) => `<p>滚动内容 ${i + 1}</p>`).join("")}</div>`
    case "Accordion": return `<details open><summary>常见问题一</summary><p>这是展开的内容。</p></details><details><summary>常见问题二</summary><p>这是折叠的内容。</p></details>`
    case "ThemeProvider": return `<div class="demo-row">${button("浅色", "outline", 'data-theme-demo="light"')}${button("深色", "outline", 'data-theme-demo="dark"')}</div>`
    case "Watermark": return `<div class="watermark-demo">ACME CONSOLE</div>`
    case "Tour": return `<details open class="tour-demo"><summary>步骤 1 / 3</summary><p>这是一个引导提示。</p>${button("下一步")}</details>`
    case "FloatButton": return button(icon("plus"), "float-button", 'aria-label="新增"')
    case "Kbd": return `<p>保存 <kbd>⌘</kbd> + <kbd>S</kbd></p>`
    case "Code": return `<code>const status = "paid"</code><pre><code>SELECT * FROM orders;</code></pre>`
    case "Divider": return `<hr><div class="labelled-divider"><span>或</span></div>`
    case "Link": return `<div class="demo-row"><a href="#component-Link">默认链接</a><a class="secondary" href="#component-Link">次要链接</a><a class="contrast" href="#component-Link">对比链接</a><a href="#component-Link">外部链接 ${icon("external-link")}</a><a aria-disabled="true">禁用链接</a></div>`
    default: return `<article class="composed-demo"><h3>${name} 组合示例</h3><p>使用 Pico CSS 原生元素组合实现。</p><div class="demo-row">${button("主要操作")}${button("次要操作", "outline")}</div></article>`
  }
}

export function render(): string {
  const implemented = keys.filter((key) => coverage[key] === "implemented").length
  const composed = keys.filter((key) => coverage[key] === "composed").length
  const missing = keys.filter((key) => coverage[key] === "missing").length
  return `<div class="components-page"><div class="page-heading"><div><h1>组件全集</h1><p>原生 Pico CSS 与组合示例 · ${implemented} implemented · ${composed} composed · ${missing} missing</p></div></div><nav class="component-index" id="component-index">${keys.map((key) => `<a href="#component-${key}">${key}</a>`).join("")}</nav><div class="component-sections">${keys.map((key) => `<section id="component-${key}" class="component-section"><header><h2>${key}</h2><mark>${coverage[key]}</mark></header>${demo(key)}</section>`).join("")}</div></div>`
}

export function mount(root: HTMLElement): void {
  root.querySelectorAll<HTMLInputElement>(".indeterminate-checkbox").forEach((input) => input.addEventListener("dblclick", () => { input.indeterminate = !input.indeterminate }))
  root.querySelectorAll<HTMLElement>("[data-dialog]").forEach((button) => button.addEventListener("click", () => {
    const dialog = document.createElement("dialog")
    dialog.innerHTML = `<article><h3>${button.dataset.dialog === "danger" ? "危险确认" : "确认操作"}</h3><p>请确认是否继续此操作。</p><footer><button class="outline" value="cancel">取消</button><button class="${button.dataset.dialog === "danger" ? "contrast" : ""}">确认</button></footer></article>`
    document.body.append(dialog); dialog.showModal(); dialog.addEventListener("close", () => dialog.remove())
  }))
  root.querySelectorAll<HTMLElement>("[data-toast]").forEach((button) => button.addEventListener("click", () => {
    const toast = document.createElement("article"); toast.className = `toast ${button.dataset.toast}`; toast.textContent = `${button.textContent} · 操作已完成`; document.body.append(toast); window.setTimeout(() => toast.remove(), 3000)
  }))
  root.querySelectorAll<HTMLElement>("[data-drawer]").forEach((button) => button.addEventListener("click", () => {
    root.querySelector(".component-drawer")?.remove()
    const direction = button.dataset.drawer ?? "right"
    const drawer = document.createElement("aside")
    drawer.className = `component-drawer drawer-${direction}`
    drawer.innerHTML = `<header><strong>${direction} Drawer</strong><button class="outline" type="button" aria-label="关闭">×</button></header><p>这是一个组合式抽屉示例。</p><button type="button">保存</button>`
    root.append(drawer)
    drawer.querySelector("button")?.addEventListener("click", () => drawer.remove())
  }))
  const commandPalette = root.querySelector<HTMLDialogElement>(".command-palette")
  const openCommandPalette = () => commandPalette?.showModal()
  root.querySelector("[data-command-palette]")?.addEventListener("click", openCommandPalette)
  root.querySelector("[data-command-close]")?.addEventListener("click", () => commandPalette?.close())
  window.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault()
      openCommandPalette()
    }
  })
  root.querySelectorAll<HTMLElement>("[data-tab]").forEach((button) => button.addEventListener("click", () => {
    root.querySelectorAll<HTMLElement>("[data-tab]").forEach((item) => item.setAttribute("aria-selected", String(item === button)))
    root.querySelectorAll<HTMLElement>("[data-tab-panel]").forEach((panel) => { panel.hidden = panel.dataset.tabPanel !== button.dataset.tab })
  }))
  root.querySelectorAll<HTMLElement>("[data-theme-demo]").forEach((button) => button.addEventListener("click", () => { document.documentElement.dataset.theme = button.dataset.themeDemo ?? "light" }))
  root.querySelector("[data-back-top]")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }))
}
