import { useEffect, useState, type CSSProperties } from "react"
import { Icon } from "@ui-gallery/icons-react"
import contract from "@ui-gallery/spec/contract.json"
import { coverage, daisyExtras, type CoverageStatus } from "../coverage"
import { useTheme } from "../App"
import { PageHeader } from "./shared"

const colors = ["neutral", "primary", "secondary", "accent", "info", "success", "warning", "error"] as const
const sizes = ["xs", "sm", "md", "lg", "xl"] as const
type Color = (typeof colors)[number]
type Size = (typeof sizes)[number]

// Tailwind v4 只扫描源码中的完整类名字面量，因此 variant 类名必须静态写出，不能模板拼接。
const btnColor: Record<Color, string> = { neutral: "btn btn-neutral", primary: "btn btn-primary", secondary: "btn btn-secondary", accent: "btn btn-accent", info: "btn btn-info", success: "btn btn-success", warning: "btn btn-warning", error: "btn btn-error" }
const btnSize: Record<Size, string> = { xs: "btn btn-xs", sm: "btn btn-sm", md: "btn btn-md", lg: "btn btn-lg", xl: "btn btn-xl" }
const badgeColor: Record<Color, string> = { neutral: "badge badge-neutral", primary: "badge badge-primary", secondary: "badge badge-secondary", accent: "badge badge-accent", info: "badge badge-info", success: "badge badge-success", warning: "badge badge-warning", error: "badge badge-error" }
const badgeSize: Record<Size, string> = { xs: "badge badge-xs", sm: "badge badge-sm", md: "badge badge-md", lg: "badge badge-lg", xl: "badge badge-xl" }
const checkboxColor: Record<Color, string> = { neutral: "checkbox checkbox-neutral", primary: "checkbox checkbox-primary", secondary: "checkbox checkbox-secondary", accent: "checkbox checkbox-accent", info: "checkbox checkbox-info", success: "checkbox checkbox-success", warning: "checkbox checkbox-warning", error: "checkbox checkbox-error" }
const radioColor: Record<Color, string> = { neutral: "radio radio-neutral", primary: "radio radio-primary", secondary: "radio radio-secondary", accent: "radio radio-accent", info: "radio radio-info", success: "radio radio-success", warning: "radio radio-warning", error: "radio radio-error" }
const toggleColor: Record<Color, string> = { neutral: "toggle toggle-neutral", primary: "toggle toggle-primary", secondary: "toggle toggle-secondary", accent: "toggle toggle-accent", info: "toggle toggle-info", success: "toggle toggle-success", warning: "toggle toggle-warning", error: "toggle toggle-error" }
const rangeColor: Record<Color, string> = { neutral: "range range-neutral", primary: "range range-primary", secondary: "range range-secondary", accent: "range range-accent", info: "range range-info", success: "range range-success", warning: "range range-warning", error: "range range-error" }
const statusColor: Record<Color, string> = { neutral: "status status-neutral", primary: "status status-primary", secondary: "status status-secondary", accent: "status status-accent", info: "status status-info", success: "status status-success", warning: "status status-warning", error: "status status-error" }
const alertColor = { info: "alert alert-info", success: "alert alert-success", warning: "alert alert-warning", error: "alert alert-error" } as const
const loadingType = { spinner: "loading loading-spinner", dots: "loading loading-dots", ring: "loading loading-ring", ball: "loading loading-ball", bars: "loading loading-bars", infinity: "loading loading-infinity" } as const
const scrollHint = <p className="mt-1 text-xs text-base-content/60 sm:hidden">← 左右滑动查看更多 →</p>

function Demo({ name }: { name: string }) {
  const status = coverage[name] as CoverageStatus
  if (status === "missing") return <div className="rounded-box border border-dashed border-warning p-4 text-sm">daisyUI 无此组件（missing）</div>
  if (name === "Button" || name === "IconButton" || name === "ButtonGroup") return <div className="space-y-3"><div className="flex flex-wrap gap-2">{colors.map((color) => <button className={btnColor[color]} key={color}>{color}</button>)}</div><div className="flex flex-wrap gap-2">{["", "btn-outline", "btn-dash", "btn-soft", "btn-ghost", "btn-link"].map((style) => <button className={`btn ${style}`} key={style}>{style ? style.replace("btn-", "") : "default"}</button>)}</div><div className="flex flex-wrap items-center gap-2">{sizes.map((size) => <button className={btnSize[size]} key={size}>{size}</button>)}<button className="btn btn-wide">宽按钮</button><button className="btn btn-block max-w-xs">块按钮</button><button className="btn btn-square"><Icon name="plus" /></button><button className="btn btn-circle"><Icon name="heart" /></button><button className="btn btn-primary loading"><span className="loading loading-spinner loading-sm" />加载</button><button className="btn btn-disabled">禁用</button><button className="btn" disabled>disabled</button></div><div className="join"><button className="btn join-item">保存</button><button className="btn join-item">取消</button></div></div>
  if (name === "Badge" || name === "Tag") return <div className="flex flex-wrap gap-2">{colors.map((color) => <span className={badgeColor[color]} key={color}>{color}</span>)}{sizes.map((size) => <span className={badgeSize[size]} key={size}>{size}</span>)}</div>
  if (name === "Typography" || name === "Code") return <div className="space-y-3"><h1 className="text-3xl font-bold">标题一级</h1><h2 className="text-2xl font-bold">标题二级</h2><h3 className="text-xl font-semibold">标题三级</h3><p>正文与辅助说明文字。</p><blockquote className="border-l-4 border-primary pl-3">这是一段引用。</blockquote><code className="rounded bg-base-200 px-2 py-1 text-sm">const console = "Acme"</code><ul className="list-disc pl-5"><li>列表一</li><li>列表二</li></ul></div>
  if (["Input", "NumberInput", "Autocomplete", "Mention"].includes(name)) return <div className="flex flex-wrap gap-2"><input className="input input-bordered" type={name === "NumberInput" ? "number" : "text"} placeholder={`${name} 输入`} /><label className="input input-bordered"><Icon name="search" size={15} /><input placeholder="搜索" /></label><input className="input input-bordered" disabled placeholder="disabled" /></div>
  if (name === "Textarea") return <textarea className="textarea textarea-bordered w-full" placeholder="多行文本..." />
  if (name === "Select" || name === "MultiSelect") return <div className="flex flex-wrap gap-2"><select className="select select-bordered"><option>选择选项</option><option>选项一</option><option>选项二</option></select>{name === "MultiSelect" ? <select className="select select-bordered h-24" multiple defaultValue={["one"]}><option value="one">选项一</option><option value="two">选项二</option></select> : null}</div>
  if (name === "Combobox" || name === "Cascader" || name === "Popover") return <div className="dropdown"><label tabIndex={0} className="input input-bordered"><input placeholder={`${name} 输入`} /><Icon name="chevron-down" size={15} /></label><ul tabIndex={0} className="dropdown-content menu z-10 w-48 rounded-box bg-base-100 p-2 shadow"><li><a>选项一</a></li><li><a>选项二</a></li><li><a>嵌套选项 <Icon name="chevron-down" /></a></li></ul></div>
  if (name === "Checkbox") return <div className="flex flex-wrap gap-4">{colors.slice(1).map((color) => <label className="label gap-2" key={color}><input type="checkbox" className={checkboxColor[color]} defaultChecked={color === "primary"} />{color}</label>)}</div>
  if (name === "Radio") return <div className="flex flex-wrap gap-4">{colors.slice(1).map((color) => <label className="label gap-2" key={color}><input type="radio" name="radio-demo" className={radioColor[color]} defaultChecked={color === "primary"} />{color}</label>)}</div>
  if (name === "Switch") return <div className="flex flex-wrap gap-3">{colors.slice(1).map((color) => <input type="checkbox" className={toggleColor[color]} defaultChecked key={color} />)}</div>
  if (name === "Slider" || name === "Range") return <div className="space-y-3">{colors.slice(1).map((color) => <input type="range" className={`${rangeColor[color]} w-full`} defaultValue={60} key={color} />)}</div>
  if (name === "Rating") return <div className="rating rating-lg"><input type="radio" name="rating-demo" className="mask mask-star-2 bg-warning" /><input type="radio" name="rating-demo" className="mask mask-star-2 bg-warning" /><input type="radio" name="rating-demo" className="mask mask-star-2 bg-warning" defaultChecked /><input type="radio" name="rating-demo" className="mask mask-star-2 bg-warning" /><input type="radio" name="rating-demo" className="mask mask-star-2 bg-warning" /></div>
  if (["DatePicker", "TimePicker", "DateRangePicker"].includes(name)) return <div className="join"><input className="input input-bordered join-item" type={name === "TimePicker" ? "time" : "date"} /><input className="input input-bordered join-item" type="date" /></div>
  if (name === "ColorPicker") return <input type="color" className="h-10 w-20 rounded-btn border border-base-300" defaultValue="#888888" />
  if (name === "Upload") return <div className="space-y-3"><input type="file" className="file-input file-input-bordered w-full" /><div className="rounded-box border border-dashed p-5 text-center"><Icon name="upload" className="mx-auto" />拖拽文件到这里</div></div>
  if (name === "PinInput") return <div className="flex gap-2">{[1, 2, 3, 4, 5].map((item) => <input className="input input-bordered w-10 text-center" maxLength={1} key={item} />)}</div>
  if (name === "Form") return <fieldset className="fieldset"><legend className="fieldset-legend">字段标签</legend><input className="input input-bordered" placeholder="字段值" /><p className="fieldset-label">帮助文案</p></fieldset>
  if (["Table", "DataGrid"].includes(name)) return <div className="overflow-x-auto"><table className="table table-zebra"><thead><tr><th>名称</th><th>状态</th><th>金额</th></tr></thead><tbody>{["ORD-2401", "ORD-2402"].map((item) => <tr key={item}><td>{item}</td><td><span className="badge badge-success">已支付</span></td><td>¥99</td></tr>)}</tbody></table></div>
  if (name === "Descriptions") return <div className="overflow-x-auto"><table className="table table-sm"><tbody><tr><th>状态</th><td>已完成</td></tr><tr><th>负责人</th><td>林晓</td></tr></tbody></table></div>
  if (name === "List") return <ul className="list rounded-box border border-base-300"><li className="list-row">项目更新 <span className="badge">新</span></li><li className="list-row">账单提醒</li></ul>
  if (name === "Card" || name === "Statistic") return <div className="card card-border max-w-sm bg-base-100"><div className="card-body"><h3 className="card-title">{name === "Statistic" ? "¥128,430" : "卡片标题"}</h3><p>Card 内容与操作。</p><div className="card-actions justify-end"><button className="btn btn-primary btn-sm">查看</button></div></div></div>
  if (name === "Avatar" || name === "AvatarGroup") return <div className="avatar-group -space-x-4"><div className="avatar avatar-placeholder"><div className="w-12 bg-primary text-primary-content"><span>林</span></div></div><div className="avatar avatar-placeholder"><div className="w-12 bg-secondary text-secondary-content"><span>王</span></div></div><div className="avatar avatar-placeholder"><div className="w-12 bg-base-300"><span>+3</span></div></div></div>
  if (name === "Timeline") return <ul className="timeline timeline-vertical timeline-compact">{["创建项目", "邀请团队", "完成发布"].map((item, index) => <li key={item}>{index > 0 ? <hr /> : null}<div className="timeline-start">{item}</div><div className="timeline-middle"><Icon name="check" size={14} /></div>{index < 2 ? <hr /> : null}</li>)}</ul>
  if (name === "Tree") return <ul className="menu rounded-box bg-base-200"><li><details open><summary>项目</summary><ul><li><a>文档</a></li><li><a>资源</a></li></ul></details></li></ul>
  if (name === "Calendar") return <div className="grid grid-cols-7 gap-1 text-center text-sm">{["一", "二", "三", "四", "五", "六", "日", ...Array.from({ length: 28 }, (_, index) => String(index + 1))].map((item, index) => <button className="btn btn-ghost btn-sm" key={`${item}-${index}`}>{item}</button>)}</div>
  if (name === "Image") return <figure className="max-w-xs"><div className="grid aspect-video place-items-center rounded-box bg-base-300"><Icon name="globe" size={32} /></div><figcaption className="text-center text-sm">Image 占位</figcaption></figure>
  if (name === "Carousel") return <div><div className="carousel carousel-center w-full space-x-2 rounded-box">{["第一张", "第二张", "第三张"].map((item, index) => <div className="carousel-item w-4/5" id={`carousel-${index}`} key={item}><div className={`grid h-32 w-full place-items-center rounded-box ${index % 2 ? "bg-base-300" : "bg-base-200"}`}>{item}</div></div>)}</div><div className="mt-2 flex justify-center gap-2">{[0, 1, 2].map((index) => <a className="btn btn-xs" href={`#carousel-${index}`} key={index}>{index + 1}</a>)}</div>{scrollHint}</div>
  if (name === "Empty") return <div className="hero rounded-box border border-dashed py-8"><div className="hero-content text-center"><div><Icon name="inbox" size={32} className="mx-auto" /><h3 className="mt-2 font-semibold">暂无内容</h3><p className="text-sm text-base-content/60">这里还没有数据。</p></div></div></div>
  if (name === "Tooltip") return <button className="tooltip btn btn-outline" data-tip="Tooltip 内容">悬停查看</button>
  if (name === "Segmented") return <div className="join"><button className="btn join-item btn-active">日</button><button className="btn join-item">周</button><button className="btn join-item">月</button></div>
  if (name === "Alert") return <div className="space-y-2">{(Object.keys(alertColor) as (keyof typeof alertColor)[]).map((color) => <div className={alertColor[color]} key={color}><Icon name="circle-help" size={16} />提示信息 <button className="btn btn-xs">操作</button></div>)}</div>
  if (name === "Toast" || name === "Notification") return <div className="toast toast-end static"><div className="alert alert-success"><Icon name="check" size={16} />操作成功</div></div>
  if (name === "Dialog" || name === "Popconfirm") return <DialogDemo name={name} />
  if (name === "Drawer") return <div className="drawer h-32 rounded-box border"><input id={`drawer-${name}`} type="checkbox" className="drawer-toggle" /><div className="drawer-content p-3"><label htmlFor={`drawer-${name}`} className="btn btn-outline btn-sm">打开 Drawer</label></div><div className="drawer-side"><label htmlFor={`drawer-${name}`} className="drawer-overlay" /><div className="w-60 bg-base-100 p-4">Drawer 内容</div></div></div>
  if (name === "Progress") return <div className="space-y-3"><progress className="progress progress-primary w-full" value="65" max="100" /><div className="radial-progress text-primary" style={{ "--value": 65 } as CSSProperties}>65%</div><ul className="steps steps-vertical"><li className="step step-primary">完成</li><li className="step step-primary">处理中</li><li className="step">待办</li></ul></div>
  if (name === "Skeleton") return <div className="space-y-2"><div className="skeleton h-4 w-2/3" /><div className="skeleton h-4 w-1/2" /><div className="skeleton h-20 w-full" /></div>
  if (name === "Spinner") return <div className="flex flex-wrap gap-4">{(Object.keys(loadingType) as (keyof typeof loadingType)[]).map((type) => <span className="flex items-center gap-1" key={type}><span className={loadingType[type]} />{type}</span>)}</div>
  if (name === "Result") return <div className="hero rounded-box bg-base-200 py-8"><div className="hero-content text-center"><div><div className="status status-success status-lg" /><h3 className="mt-2 font-bold">操作成功</h3></div></div></div>
  if (name === "Menu" || name === "Sidebar") return <ul className="menu menu-sm w-52 rounded-box bg-base-200"><li><a><Icon name="home" size={15} />概览</a></li><li><details open><summary>设置</summary><ul><li><a>个人资料</a></li><li><a>团队</a></li></ul></details></li></ul>
  if (name === "Dropdown") return <div className="dropdown"><button tabIndex={0} className="btn btn-outline">打开菜单</button><ul tabIndex={0} className="dropdown-content menu rounded-box bg-base-100 p-2 shadow"><li><a>编辑</a></li><li><a>删除</a></li></ul></div>
  if (name === "Breadcrumb") return <div className="breadcrumbs"><ul><li><a>首页</a></li><li><a>设置</a></li><li>账户</li></ul></div>
  if (name === "Tabs") return <div className="tabs tabs-box"><a className="tab tab-active">概览</a><a className="tab">详情</a><a className="tab tab-disabled">禁用</a></div>
  if (name === "Pagination") return <div className="join"><button className="btn join-item">上一页</button><button className="btn join-item btn-active">1</button><button className="btn join-item">下一页</button></div>
  if (name === "Steps") return <ul className="steps steps-vertical"><li className="step step-primary">基本信息</li><li className="step step-primary">配置选项</li><li className="step">确认提交</li></ul>
  if (name === "Anchor") return <ul className="menu menu-sm"><li><a href="#component-Button">Button</a></li><li><a href="#component-Input">Input</a></li></ul>
  if (name === "BackTop") return <div className="space-y-3"><p className="text-sm text-base-content/60">页面滚动超过 300px 后，右下角出现固定回顶按钮；下方为按钮样式示例。</p><button className="btn btn-primary btn-circle" aria-label="回到顶部" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="arrow-up" size={16} /></button></div>
  if (name === "Affix") return <div className="sticky top-16 rounded-box bg-base-200 p-3">sticky top-16</div>
  if (name === "Navbar") return <div className="navbar rounded-box border border-base-300"><span className="font-semibold">导航栏</span><button className="btn btn-primary btn-sm ml-auto">操作</button></div>
  if (name === "CommandPalette") return <CommandPaletteDemo />
  if (name === "Transfer") return <TransferDemo />
  if (["Grid", "Stack", "Layout", "Container", "ScrollArea", "AspectRatio"].includes(name)) return <div className="grid grid-cols-3 gap-2 rounded-box bg-base-200 p-3"><div className="h-16 rounded-box bg-base-300" /><div className="h-16 rounded-box bg-base-300" /><div className="h-16 rounded-box bg-base-300" /></div>
  if (name === "Accordion") return <div className="join join-vertical w-full"><div className="collapse collapse-arrow join-item border border-base-300"><input type="radio" name="accordion" defaultChecked /><div className="collapse-title">Accordion 项目</div><div className="collapse-content">内容</div></div><div className="collapse collapse-plus join-item border border-base-300"><input type="radio" name="accordion" /><div className="collapse-title">另一个项目</div><div className="collapse-content">内容</div></div></div>
  if (name === "ThemeProvider") return <ThemeControllerDemo />
  if (name === "FloatButton") return <button className="btn btn-primary btn-circle"><Icon name="plus" /></button>
  if (name === "Kbd") return <div className="flex gap-2"><kbd className="kbd">⌘</kbd><kbd className="kbd kbd-lg">K</kbd></div>
  if (name === "Divider") return <div className="space-y-3"><div className="divider">或</div><div className="divider divider-horizontal h-16">竖直</div></div>
  if (name === "Link") return <a className="link link-primary" href="#component-Link">链接组件示例</a>
  return <div className="rounded-box bg-base-200 p-4 text-sm">使用 daisyUI 类名组合实现 {name}。</div>
}

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false)
  const palette = <><label className="input w-full"><Icon name="search" size={15} /><input placeholder="搜索命令..." /><kbd className="kbd kbd-sm">⌘K</kbd></label><ul className="menu mt-2 w-full p-0"><li className="menu-title">常用</li><li><a><Icon name="settings" size={15} />打开设置</a></li><li><a><Icon name="plus" size={15} />创建项目</a></li><li><a><Icon name="users" size={15} />邀请成员</a></li></ul></>
  return <div className="space-y-3"><div className="rounded-box border border-base-300 bg-base-100 p-3 shadow-sm">{palette}</div><button className="btn btn-outline" onClick={() => setOpen(true)}>以 Modal 打开</button>{open ? <dialog open className="modal modal-top sm:modal-middle" onClose={() => setOpen(false)}><div className="modal-box max-w-md p-4">{palette}<div className="modal-action mt-3"><button className="btn btn-sm" onClick={() => setOpen(false)}>关闭</button></div></div><div className="modal-backdrop" onClick={() => setOpen(false)} /></dialog> : null}</div>
}

function TransferDemo() {
  const [right, setRight] = useState<string[]>(["王子涵"])
  const all = ["林晓", "王子涵", "Alex Chen", "Maria"]
  const [picked, setPicked] = useState<string[]>([])
  const left = all.filter((item) => !right.includes(item))
  const toggle = (item: string) => setPicked((value) => (value.includes(item) ? value.filter((x) => x !== item) : [...value, item]))
  const box = (title: string, items: string[]) => <div className="min-w-0 flex-1 rounded-box border border-base-300"><div className="border-b border-base-300 px-3 py-2 text-sm font-medium">{title} <span className="badge badge-sm badge-ghost">{items.length}</span></div><ul className="menu menu-sm w-full p-1">{items.length ? items.map((item) => <li key={item}><label className="label cursor-pointer gap-2"><input type="checkbox" className="checkbox checkbox-xs" checked={picked.includes(item)} onChange={() => toggle(item)} />{item}</label></li>) : <li className="px-3 py-2 text-xs text-base-content/60">暂无</li>}</ul></div>
  return <div className="flex items-stretch gap-2">{box("可选成员", left)}<div className="flex flex-col justify-center gap-2"><button className="btn btn-square btn-sm" aria-label="移入" onClick={() => { setRight((value) => [...value, ...picked.filter((item) => left.includes(item))]); setPicked([]) }}><Icon name="chevron-right" size={14} /></button><button className="btn btn-square btn-sm" aria-label="移出" onClick={() => { setRight((value) => value.filter((item) => !picked.includes(item))); setPicked([]) }}><Icon name="chevron-left" size={14} /></button></div>{box("已选成员", right)}</div>
}

function DialogDemo({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  return <><button className="btn btn-outline" onClick={() => setOpen(true)}>打开 {name}</button>{open ? <dialog open className="modal"><div className="modal-box"><h3 className="text-lg font-bold">{name}</h3><p className="py-4">这是一个可交互的 daisyUI dialog。</p><div className="modal-action"><button className="btn" onClick={() => setOpen(false)}>取消</button><button className="btn btn-primary" onClick={() => setOpen(false)}>确认</button></div></div></dialog> : null}</>
}

function ThemeControllerDemo() {
  const { setTheme, theme } = useTheme()
  return <label className="label cursor-pointer justify-start gap-3"><input type="checkbox" className="toggle theme-controller" value="dark" checked={theme === "dark"} onChange={(event) => setTheme(event.target.checked ? "dark" : "light")} />主题：{theme}</label>
}

function ExtraDemo({ name }: { name: string }) {
  if (name === "Chat") return <div className="space-y-2"><div className="chat chat-start"><div className="chat-bubble">chat-start</div></div><div className="chat chat-end"><div className="chat-bubble chat-bubble-primary">chat-end</div></div></div>
  if (name === "Countdown") return <span className="countdown text-3xl"><span style={{ "--value": 24 } as CSSProperties} /></span>
  if (name === "Diff") return <div className="diff aspect-video"><div className="diff-item-1"><div className="grid place-content-center bg-primary text-primary-content">前</div></div><div className="diff-item-2"><div className="grid place-content-center bg-secondary text-secondary-content">后</div></div><div className="diff-resizer" /></div>
  if (name === "Dock") return <div className="dock static"><button><Icon name="home" /></button><button className="dock-active"><Icon name="search" /></button><button><Icon name="settings" /></button></div>
  if (name === "Filter") return <div className="filter"><input className="btn btn-square" type="radio" name="filter-demo" aria-label="全部" defaultChecked /><input className="btn" type="radio" name="filter-demo" aria-label="已支付" /><input className="btn" type="radio" name="filter-demo" aria-label="待处理" /></div>
  if (name === "Hero") return <div className="hero rounded-box bg-base-200 py-8"><div className="hero-content text-center"><h3 className="text-2xl font-bold">Hero 内容</h3></div></div>
  if (name === "Indicator") return <div className="indicator"><span className="indicator-item badge badge-secondary">新</span><div className="grid size-20 place-items-center rounded-box bg-base-200">内容</div></div>
  if (name === "Mask") return <div className="flex gap-3"><div className="mask mask-squircle size-16 bg-primary" /><div className="mask mask-hexagon size-16 bg-secondary" /><div className="mask mask-star-2 size-16 bg-accent" /></div>
  if (name === "Mockup") return <div className="mockup-code"><pre data-prefix="$"><code>pnpm build</code></pre></div>
  if (name === "RadialProgress") return <div className="radial-progress text-primary" style={{ "--value": 70 } as CSSProperties}>70%</div>
  if (name === "Status") return <div className="flex gap-3">{colors.map((color) => <span className={statusColor[color]} key={color} title={color} />)}</div>
  if (name === "Swap") return <label className="swap swap-rotate"><input type="checkbox" /><span className="swap-off text-2xl">☀</span><span className="swap-on text-2xl">☾</span></label>
  if (name === "ThemeController") return <ThemeControllerDemo />
  if (name === "Join") return <div className="join"><button className="btn join-item">左</button><button className="btn join-item">中</button><button className="btn join-item">右</button></div>
  if (name === "Stack") return <div className="stack"><div className="grid size-24 place-items-center rounded-box bg-primary text-primary-content">1</div><div className="grid size-24 place-items-center rounded-box bg-secondary text-secondary-content">2</div></div>
  if (name === "Fieldset" || name === "Label" || name === "Validator") return <fieldset className="fieldset"><legend className="fieldset-legend">{name}</legend><input className="input input-bordered validator" placeholder="示例输入" /><p className="validator-hint">帮助文字</p></fieldset>
  if (name === "Footer") return <footer className="footer rounded-box bg-base-200 p-6"><nav><h6 className="footer-title">资源</h6><a>文档</a><a>帮助</a></nav></footer>
  return <div className="rounded-box border border-dashed border-base-300 p-4 text-sm">{name} 组合示例</div>
}

export function ComponentsPage() {
  const [backTop, setBackTop] = useState(false)
  useEffect(() => { const handler = () => setBackTop(window.scrollY > 300); window.addEventListener("scroll", handler); return () => window.removeEventListener("scroll", handler) }, [])
  const names = contract.components as string[]
  return <div className="space-y-8"><PageHeader title="组件全集" description="daisyUI 官方组件、contract 覆盖与组合示例。" /><div id="component-index" className="flex flex-wrap gap-2">{names.map((name) => <a className="badge badge-outline link-hover" href={`#component-${name}`} key={name}>{name}<span className={`badge badge-xs ml-1 ${coverage[name] === "implemented" ? "badge-success" : coverage[name] === "composed" ? "badge-warning" : "badge-ghost"}`} /></a>)}</div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{names.map((name) => <section className="card scroll-mt-20 border border-base-300 bg-base-100" id={`component-${name}`} key={name}><div className="card-body"><div className="flex items-center justify-between gap-2"><h2 className="card-title text-base">{name}</h2><span className={`badge ${coverage[name] === "implemented" ? "badge-success" : coverage[name] === "composed" ? "badge-warning" : "badge-ghost"}`}>{coverage[name]}</span></div><div className="mt-3">{<Demo name={name} />}</div></div></section>)}</div><section className="space-y-4"><div><h2 className="text-2xl font-bold">daisyUI 补充</h2><p className="text-sm text-base-content/60">contract 未列出的 daisyUI 组件与扩展示例。</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{daisyExtras.map((name) => <section className="card border border-base-300 bg-base-100" key={name}><div className="card-body"><h3 className="card-title text-base">{name}</h3><ExtraDemo name={name} /></div></section>)}</div></section>{backTop ? <button className="btn btn-primary btn-circle fixed bottom-4 right-4 z-30" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="arrow-up" /></button> : null}</div>
}
