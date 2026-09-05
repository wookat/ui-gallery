<script lang="ts">
  import {
    Accordion, AppBar, Avatar, Carousel, Collapsible, Combobox, DatePicker, Dialog, FileUpload, FloatingPanel, Listbox,
    Marquee, Menu, Navigation, Pagination, Popover, Portal, Progress, QrCode, RatingGroup, SegmentedControl, Slider,
    Steps, Switch, Tabs, TagsInput, ToggleGroup, Tooltip, TreeView, createTreeViewCollection, useListCollection,
  } from "@skeletonlabs/skeleton-svelte"
  import team from "@ui-gallery/spec/mock/team.json"
  import orders from "@ui-gallery/spec/mock/orders.json"
  import nav from "@ui-gallery/spec/mock/nav.json"
  import notifications from "@ui-gallery/spec/mock/notifications.json"
  import tasks from "@ui-gallery/spec/mock/tasks.json"
  import plans from "@ui-gallery/spec/mock/plans.json"
  import activity from "@ui-gallery/spec/mock/activity.json"
  import landing from "@ui-gallery/spec/mock/landing.json"
  import stats from "@ui-gallery/spec/mock/stats.json"
  import Demo from "../lib/Demo.svelte"
  import Icon from "../lib/Icon.svelte"
  import StatusBadge from "../lib/StatusBadge.svelte"
  import type { IconName } from "../lib/icons"
  import { initials, money, number } from "../lib/format"
  import { toaster } from "../lib/toaster"
  import { isDark, setDark } from "../lib/settings"
  import { link, router } from "../lib/router.svelte"

  const groups = [
    { id: "general", label: "通用", items: ["typography", "button", "button-group", "icon-button", "link", "kbd", "code", "divider"] },
    { id: "inputs", label: "数据录入", items: ["input", "textarea", "number-input", "select", "multi-select", "combobox", "autocomplete", "checkbox", "radio", "switch", "slider", "rating", "date-picker", "time-picker", "date-range-picker", "color-picker", "upload", "cascader", "transfer", "mention", "pin-input", "form", "tags-input"] },
    { id: "display", label: "数据展示", items: ["table", "data-grid", "descriptions", "list", "card", "avatar", "avatar-group", "badge", "tag", "statistic", "timeline", "tree", "calendar", "image", "carousel", "marquee", "empty", "tooltip", "popover", "qr-code", "segmented", "toggle-group", "collapsible"] },
    { id: "feedback", label: "反馈", items: ["alert", "toast", "notification", "dialog", "drawer", "progress", "skeleton", "spinner", "result", "popconfirm"] },
    { id: "navigation", label: "导航", items: ["menu", "dropdown", "breadcrumb", "tabs", "pagination", "steps", "anchor", "back-top", "affix", "navbar", "sidebar", "command-palette"] },
    { id: "layout", label: "布局与其他", items: ["grid", "stack", "layout", "container", "aspect-ratio", "resizable", "floating-panel", "scroll-area", "accordion", "theme-provider", "watermark", "tour", "float-button"] },
  ]

  const presets = ["preset-filled", "preset-tonal", "preset-outlined"]
  const colors = ["primary", "secondary", "tertiary", "success", "warning", "error", "surface"]
  const sizes = [["btn-sm", "小"], ["btn-base", "中"], ["btn-lg", "大"], ["btn-xl", "特大"]]

  let dark = $state(isDark())
  let sliderValue = $state([40])
  let rangeValue = $state([20, 70])
  let rating = $state(3)
  let switchOn = $state(true)
  let segment = $state("list")
  let toggles = $state(["bold"])
  let tags = $state(["设计", "研发"])
  let pin = $state(["", "", "", ""])
  let listboxValue = $state<string[]>([team[1].name])
  let transferLeft = $state(team.slice(0, 3).map((m) => m.name))
  let transferRight = $state(team.slice(3).map((m) => m.name))
  let transferPick = $state<string[]>([])
  let cascaderPath = $state<string[]>([])
  let mentionText = $state("")
  let mentionOpen = $state(false)
  let cmdOpen = $state(false)
  let cmdQuery = $state("")
  let drawerOpen = $state(false)
  type DrawerSide = "left" | "right" | "top" | "bottom"
  let drawerSide = $state<DrawerSide>("right")
  const drawerSides: { side: DrawerSide; label: string; positioner: string; content: string }[] = [
    { side: "left", label: "左", positioner: "justify-start items-stretch", content: "h-full w-full max-w-sm" },
    { side: "right", label: "右", positioner: "justify-end items-stretch", content: "h-full w-full max-w-sm" },
    { side: "top", label: "上", positioner: "items-start justify-stretch", content: "w-full max-h-[60vh]" },
    { side: "bottom", label: "下", positioner: "items-end justify-stretch", content: "w-full max-h-[60vh]" },
  ]
  const drawerConfig = $derived(drawerSides.find((d) => d.side === drawerSide) ?? drawerSides[1])
  let progress = $state(64)
  let page = $state(2)
  let stepIdx = $state(1)
  let comboInput = $state("")
  let sortKey = $state<"customer" | "amount">("amount")
  let sortAsc = $state(false)

  const members = team.map((m) => ({ label: m.name, value: m.name }))
  const comboCollection = $derived(
    useListCollection({ items: members.filter((m) => m.label.toLowerCase().includes(comboInput.toLowerCase())) }),
  )
  const listCollection = useListCollection({ items: members })
  const cmdItems = $derived(nav.filter((n) => n.label.toLowerCase().includes(cmdQuery.toLowerCase())))
  const gridRows = $derived(
    [...orders.slice(0, 5)].sort((a, b) => {
      const cmp = sortKey === "amount" ? a.amount - b.amount : a.customer.localeCompare(b.customer)
      return sortAsc ? cmp : -cmp
    }),
  )

  type Node = { id: string; name: string; children?: Node[] }
  const treeData: Node = {
    id: "root",
    name: "",
    children: [
      { id: "products", name: "产品", children: plans.map((p) => ({ id: `plan-${p.name}`, name: p.name })) },
      { id: "team", name: "团队", children: team.slice(0, 3).map((m) => ({ id: `m-${m.email}`, name: m.name })) },
      { id: "tasks", name: "任务", children: tasks.map((t) => ({ id: `t-${t.title}`, name: t.title })) },
    ],
  }
  const treeCollection = createTreeViewCollection<Node>({
    rootNode: treeData,
    nodeToValue: (n) => n.id,
    nodeToString: (n) => n.name,
  })

  const cascade: Record<string, string[]> = { 华东: ["上海", "杭州", "南京"], 华南: ["深圳", "广州"], 华北: ["北京", "天津"] }
  const slides = landing.features.slice(0, 4)

  function move(dir: "right" | "left") {
    if (dir === "right") {
      transferRight = [...transferRight, ...transferPick.filter((p) => transferLeft.includes(p))]
      transferLeft = transferLeft.filter((p) => !transferPick.includes(p))
    } else {
      transferLeft = [...transferLeft, ...transferPick.filter((p) => transferRight.includes(p))]
      transferRight = transferRight.filter((p) => !transferPick.includes(p))
    }
    transferPick = []
  }
  function pinInput(i: number, e: Event) {
    const el = e.currentTarget as HTMLInputElement
    pin[i] = el.value.slice(-1)
    if (el.value && el.nextElementSibling instanceof HTMLInputElement) el.nextElementSibling.focus()
  }
</script>

<header class="space-y-2">
  <h1 class="h3">组件总览</h1>
  <p class="text-sm opacity-70">Skeleton v5（Svelte）全部组件、变体、尺寸与状态。徽标含义：implemented = Skeleton 原生组件/工具类，composed = 用 Skeleton 原语组合，missing = 无对应实现，native = 契约之外的 Skeleton 原生组件。</p>
</header>

<nav class="card bg-surface-50-950 border border-surface-200-800 p-3 sticky top-16 z-20 space-y-2" aria-label="组件索引">
  {#each groups as g (g.id)}
    <div class="flex flex-wrap items-center gap-1 text-xs">
      <span class="font-medium w-20 opacity-70">{g.label}</span>
      {#each g.items as item (item)}<a class="chip preset-tonal hover:preset-filled-primary-500" href={`#${item}`}>{item}</a>{/each}
    </div>
  {/each}
</nav>

<!-- ===== 通用 ===== -->
<h2 class="h4 pt-4" id="general">通用</h2>
<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <Demo id="typography" title="Typography" status="implemented" note="h1–h6 / p / blockquote / pre / mark / ins / del">
    <h1 class="h1">标题 H1</h1><h2 class="h2">标题 H2</h2><h3 class="h3">标题 H3</h3><h4 class="h4">标题 H4</h4><h5 class="h5">标题 H5</h5><h6 class="h6">标题 H6</h6>
    <p>正文段落，<strong>加粗</strong>、<em>斜体</em>、<mark class="mark">高亮</mark>、<ins class="ins">插入</ins>、<del class="del">删除</del>、<abbr class="abbr" title="用户界面">UI</abbr>。</p>
    <blockquote class="blockquote">{landing.testimonials[0].quote}<cite class="cite block">— {landing.testimonials[0].name}</cite></blockquote>
    <p class="text-sm opacity-70">辅助说明文字</p>
  </Demo>
  <Demo id="button" title="Button" status="implemented" note="preset × color × size × state">
    {#each presets as preset (preset)}
      <div class="flex flex-wrap gap-2">
        {#each colors as c (c)}<button type="button" class="btn {preset}-{c}-500">{c}</button>{/each}
      </div>
    {/each}
    <div class="flex flex-wrap items-center gap-2">
      {#each sizes as [cls, label] (cls)}<button type="button" class="btn {cls} preset-filled-primary-500">{label}</button>{/each}
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="btn preset-filled-primary-500" disabled>禁用</button>
      <button type="button" class="btn preset-filled-primary-500" aria-busy="true"><Icon name="loader" class="animate-spin" />加载中</button>
      <button type="button" class="btn preset-filled-primary-500"><Icon name="download" />带图标</button>
      <button type="button" class="btn preset-tonal hover:preset-filled">Hover 变体</button>
      <button type="button" class="btn preset-filled-primary-500 w-full sm:w-auto">块级</button>
    </div>
  </Demo>
  <Demo id="button-group" title="ButtonGroup" status="implemented" note="btn-group">
    <div class="btn-group preset-outlined-surface-500 flex-col sm:flex-row p-1 gap-1">
      <button type="button" class="btn preset-filled">日</button><button type="button" class="btn hover:preset-tonal">周</button><button type="button" class="btn hover:preset-tonal">月</button>
    </div>
  </Demo>
  <Demo id="icon-button" title="IconButton" status="implemented" note="btn-icon × size × preset">
    <div class="flex flex-wrap items-center gap-2">
      {#each ["btn-icon-sm", "btn-icon-base", "btn-icon-lg", "btn-icon-xl"] as s (s)}<button type="button" class="btn-icon {s} preset-filled-primary-500" aria-label="搜索"><Icon name="search" /></button>{/each}
      <button type="button" class="btn-icon preset-tonal" aria-label="设置"><Icon name="settings" /></button>
      <button type="button" class="btn-icon preset-outlined-surface-500" aria-label="编辑"><Icon name="pencil" /></button>
      <button type="button" class="btn-icon hover:preset-tonal" aria-label="更多"><Icon name="ellipsis-horizontal" /></button>
      <button type="button" class="btn-icon preset-filled-error-500 rounded-full" aria-label="删除" disabled><Icon name="trash" /></button>
    </div>
  </Demo>
  <Demo id="link" title="Link" status="implemented" note="anchor">
    <p><a class="anchor" href="#link">默认链接</a> · <a class="anchor text-secondary-500" href="#link">次要色</a> · <a class="anchor inline-flex items-center gap-1" href="#link">外链 <Icon name="link" class="size-3" /></a> · <span class="anchor opacity-50 pointer-events-none">禁用</span></p>
  </Demo>
  <Demo id="kbd" title="Kbd" status="implemented"><p class="flex flex-wrap gap-2 items-center"><kbd class="kbd">⌘</kbd> + <kbd class="kbd">K</kbd> 打开命令面板，<kbd class="kbd">Esc</kbd> 关闭</p></Demo>
  <Demo id="code" title="Code" status="implemented" note="code / pre">
    <p>安装：<code class="code">pnpm add @skeletonlabs/skeleton</code></p>
    <pre class="pre">{`import { Toast } from "@skeletonlabs/skeleton-svelte"\nconst toaster = createToaster()`}</pre>
  </Demo>
  <Demo id="divider" title="Divider" status="implemented" note="hr / vr">
    <hr class="hr" /><hr class="hr border-dashed" /><hr class="hr border-2 border-primary-500" />
    <div class="flex items-center gap-3 h-8"><span>左</span><span class="vr h-full"></span><span>右</span></div>
    <div class="flex items-center gap-3 text-xs opacity-60"><hr class="hr flex-1" />带文字<hr class="hr flex-1" /></div>
  </Demo>
</div>

<!-- ===== 数据录入 ===== -->
<h2 class="h4 pt-4" id="inputs">数据录入</h2>
<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <Demo id="input" title="Input" status="implemented" note="input × size × state">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <input class="input field-sm" placeholder="小尺寸" /><input class="input" placeholder="默认" /><input class="input field-lg" placeholder="大尺寸" />
      <input class="input" placeholder="禁用" disabled /><input class="input" value="只读值" readonly />
      <input class="input !border-error-500" value="无效输入" aria-invalid="true" /><input class="input !border-success-500" value="有效输入" />
      <input class="input input-ghost" placeholder="Ghost 变体" />
      <div class="field-group grid-cols-[auto_1fr_auto]"><div class="label">https://</div><input class="input" placeholder="域名" /><button type="button" class="btn preset-filled">提交</button></div>
      <input class="input" type="password" value="password" aria-label="密码" /><input class="input" type="search" placeholder="搜索…" />
    </div>
  </Demo>
  <Demo id="textarea" title="Textarea" status="implemented">
    <textarea class="textarea" rows="3" placeholder="默认"></textarea>
    <textarea class="textarea !border-error-500" rows="2" placeholder="错误态" aria-invalid="true"></textarea>
    <textarea class="textarea" rows="2" placeholder="禁用" disabled></textarea>
  </Demo>
  <Demo id="number-input" title="NumberInput" status="composed" note="原生 number input + btn-group">
    <div class="field-group grid-cols-[auto_1fr_auto] w-48">
      <button type="button" class="btn preset-tonal" aria-label="减少" onclick={() => (progress = Math.max(0, progress - 1))}><Icon name="minus" /></button>
      <input class="input text-center" type="number" bind:value={progress} min="0" max="100" />
      <button type="button" class="btn preset-tonal" aria-label="增加" onclick={() => (progress = Math.min(100, progress + 1))}><Icon name="plus" /></button>
    </div>
  </Demo>
  <Demo id="select" title="Select" status="implemented" note="select 原生元素 + 尺寸">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <select class="select field-sm"><option>小</option></select>
      <select class="select"><option>默认</option>{#each team as m (m.email)}<option>{m.name}</option>{/each}</select>
      <select class="select" disabled><option>禁用</option></select>
    </div>
    <select class="select" size={4} multiple>{#each team as m (m.email)}<option>{m.name}</option>{/each}</select>
  </Demo>
  <Demo id="multi-select" title="MultiSelect" status="implemented" note="Listbox selectionMode=multiple">
    <Listbox collection={listCollection} selectionMode="multiple" value={listboxValue} onValueChange={(d) => (listboxValue = d.value)} class="space-y-1">
      <Listbox.Label class="text-sm">成员（已选 {listboxValue.length}）</Listbox.Label>
      <Listbox.Content class="card border border-surface-200-800 p-1 max-h-40 overflow-y-auto">
        {#each listCollection.items as item (item.value)}
          <Listbox.Item {item} class="flex items-center justify-between px-3 py-1.5 rounded-base cursor-pointer hover:preset-tonal data-[state=checked]:preset-filled-primary-500">
            <Listbox.ItemText>{item.label}</Listbox.ItemText>
            <Listbox.ItemIndicator><Icon name="check" /></Listbox.ItemIndicator>
          </Listbox.Item>
        {/each}
      </Listbox.Content>
    </Listbox>
  </Demo>
  <Demo id="combobox" title="Combobox" status="implemented">
    <Combobox collection={comboCollection} onInputValueChange={(d) => (comboInput = d.inputValue)} class="space-y-1">
      <Combobox.Label class="text-sm">负责人</Combobox.Label>
      <Combobox.Control class="field-group grid-cols-[1fr_auto]">
        <Combobox.Input class="input" placeholder="搜索成员…" />
        <Combobox.Trigger class="btn preset-tonal" aria-label="展开"><Icon name="chevrons-up-down" /></Combobox.Trigger>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner class="z-40">
          <Combobox.Content class="card bg-surface-100-900 shadow-xl p-1 max-h-48 overflow-y-auto">
            {#each comboCollection.items as item (item.value)}
              <Combobox.Item {item} class="flex items-center justify-between px-3 py-1.5 rounded-base cursor-pointer data-[highlighted]:preset-tonal data-[state=checked]:preset-filled-primary-500">
                <Combobox.ItemText>{item.label}</Combobox.ItemText>
                <Combobox.ItemIndicator><Icon name="check" /></Combobox.ItemIndicator>
              </Combobox.Item>
            {:else}
              <p class="px-3 py-2 text-sm opacity-60">无匹配结果</p>
            {/each}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox>
  </Demo>
  <Demo id="autocomplete" title="Autocomplete" status="composed" note="原生 input + datalist">
    <input class="input" list="ac-list" placeholder="输入产品名…" />
    <datalist id="ac-list">{#each [...new Set(orders.map((o) => o.product))] as p (p)}<option value={p}></option>{/each}</datalist>
  </Demo>
  <Demo id="checkbox" title="Checkbox" status="implemented">
    <div class="flex flex-wrap gap-4">
      <label class="flex items-center gap-2"><input class="checkbox" type="checkbox" checked /> 已选</label>
      <label class="flex items-center gap-2"><input class="checkbox" type="checkbox" /> 未选</label>
      <label class="flex items-center gap-2"><input class="checkbox" type="checkbox" indeterminate /> 部分</label>
      <label class="flex items-center gap-2 opacity-50"><input class="checkbox" type="checkbox" disabled checked /> 禁用</label>
      <label class="flex items-center gap-2"><input class="checkbox size-6" type="checkbox" checked /> 大号</label>
    </div>
  </Demo>
  <Demo id="radio" title="Radio" status="implemented">
    <div class="flex flex-wrap gap-4">
      {#each ["选项 A", "选项 B", "选项 C"] as r, i (r)}<label class="flex items-center gap-2"><input class="radio" type="radio" name="demo-radio" checked={i === 0} /> {r}</label>{/each}
      <label class="flex items-center gap-2 opacity-50"><input class="radio" type="radio" disabled /> 禁用</label>
    </div>
  </Demo>
  <Demo id="switch" title="Switch" status="implemented" note="Switch 组件 + switch 工具类">
    <div class="flex flex-wrap items-center gap-6">
      <Switch checked={switchOn} onCheckedChange={(d) => (switchOn = d.checked)} class="flex items-center gap-2">
        <Switch.Control><Switch.Thumb /></Switch.Control>
        <Switch.Label class="text-sm">{switchOn ? "开" : "关"}</Switch.Label>
        <Switch.HiddenInput />
      </Switch>
      <Switch checked disabled class="flex items-center gap-2"><Switch.Control><Switch.Thumb /></Switch.Control><Switch.Label class="text-sm">禁用</Switch.Label><Switch.HiddenInput /></Switch>
      <Switch class="flex items-center gap-2"><Switch.Control class="h-8 w-14 [&>*]:size-7"><Switch.Thumb /></Switch.Control><Switch.Label class="text-sm">大号</Switch.Label><Switch.HiddenInput /></Switch>
      <label class="flex items-center gap-2 text-sm"><input class="switch" type="checkbox" role="switch" checked /> 工具类</label>
    </div>
  </Demo>
  <Demo id="slider" title="Slider" status="implemented" note="单值 / 范围 / 禁用 / 刻度">
    <Slider value={sliderValue} onValueChange={(d) => (sliderValue = d.value)} class="space-y-2">
      <div class="flex justify-between text-sm"><Slider.Label>音量</Slider.Label><Slider.ValueText /></div>
      <Slider.Control><Slider.Track><Slider.Range /></Slider.Track><Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb></Slider.Control>
    </Slider>
    <Slider value={rangeValue} onValueChange={(d) => (rangeValue = d.value)} class="space-y-2">
      <div class="flex justify-between text-sm"><Slider.Label>范围</Slider.Label><Slider.ValueText /></div>
      <Slider.Control><Slider.Track><Slider.Range /></Slider.Track><Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb><Slider.Thumb index={1}><Slider.HiddenInput /></Slider.Thumb></Slider.Control>
      <Slider.MarkerGroup class="text-xs opacity-60"><Slider.Marker value={0}>0</Slider.Marker><Slider.Marker value={50}>50</Slider.Marker><Slider.Marker value={100}>100</Slider.Marker></Slider.MarkerGroup>
    </Slider>
    <Slider defaultValue={[30]} disabled class="space-y-2">
      <Slider.Label class="text-sm">禁用</Slider.Label>
      <Slider.Control><Slider.Track><Slider.Range /></Slider.Track><Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb></Slider.Control>
    </Slider>
  </Demo>
  <Demo id="rating" title="Rating" status="implemented" note="RatingGroup：可交互 / 半星 / 只读">
    <RatingGroup value={rating} onValueChange={(d) => (rating = d.value)} count={5} class="flex items-center gap-3">
      <RatingGroup.Control class="flex gap-1">
        <RatingGroup.Context>
          {#snippet children(api)}
            {#each api().items as index (index)}
              <RatingGroup.Item {index} class="cursor-pointer">
                {#snippet empty()}<Icon name="star" class="size-6 opacity-30" />{/snippet}
                {#snippet half()}<Icon name="star" class="size-6 text-warning-500" />{/snippet}
                {#snippet full()}<Icon name="star" class="size-6 fill-warning-500 text-warning-500" />{/snippet}
              </RatingGroup.Item>
            {/each}
          {/snippet}
        </RatingGroup.Context>
        <RatingGroup.HiddenInput />
      </RatingGroup.Control>
      <RatingGroup.Label class="text-sm opacity-70">{rating} / 5</RatingGroup.Label>
    </RatingGroup>
    <RatingGroup defaultValue={3.5} allowHalf readOnly count={5}>
      <RatingGroup.Control class="flex gap-1 text-warning-500">
        <RatingGroup.Context>{#snippet children(api)}{#each api().items as index (index)}<RatingGroup.Item {index} class="[&_svg]:size-5" />{/each}{/snippet}</RatingGroup.Context>
      </RatingGroup.Control>
    </RatingGroup>
  </Demo>
  <Demo id="date-picker" title="DatePicker" status="implemented">
    <DatePicker class="space-y-1" positioning={{ placement: "bottom-start" }}>
      <DatePicker.Label class="text-sm">日期</DatePicker.Label>
      <DatePicker.Control class="field-group grid-cols-[1fr_auto]">
        <DatePicker.Input class="input" placeholder="YYYY-MM-DD" />
        <DatePicker.Trigger class="btn preset-tonal" aria-label="打开日历"><Icon name="calendar" /></DatePicker.Trigger>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner class="z-40">
          <DatePicker.Content class="card bg-surface-100-900 shadow-xl p-3 space-y-2">
            <DatePicker.View view="day">
              <DatePicker.Context>
                {#snippet children(api)}
                  <DatePicker.ViewControl class="flex items-center justify-between gap-2">
                    <DatePicker.PrevTrigger class="btn-icon btn-icon-sm hover:preset-tonal"><Icon name="chevron-left" /></DatePicker.PrevTrigger>
                    <DatePicker.ViewTrigger class="btn btn-sm hover:preset-tonal"><DatePicker.RangeText /></DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger class="btn-icon btn-icon-sm hover:preset-tonal"><Icon name="chevron-right" /></DatePicker.NextTrigger>
                  </DatePicker.ViewControl>
                  <DatePicker.Table class="text-sm">
                    <DatePicker.TableHead><DatePicker.TableRow>{#each api().weekDays as d (d.long)}<DatePicker.TableHeader class="size-8 text-xs opacity-60">{d.narrow}</DatePicker.TableHeader>{/each}</DatePicker.TableRow></DatePicker.TableHead>
                    <DatePicker.TableBody>
                      {#each api().weeks as week, wi (wi)}
                        <DatePicker.TableRow>
                          {#each week as day (day.toString())}
                            <DatePicker.TableCell value={day}><DatePicker.TableCellTrigger class="size-8 rounded-base grid place-items-center hover:preset-tonal data-[selected]:preset-filled-primary-500 data-[outside-range]:opacity-30 data-[today]:font-bold">{day.day}</DatePicker.TableCellTrigger></DatePicker.TableCell>
                          {/each}
                        </DatePicker.TableRow>
                      {/each}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                {/snippet}
              </DatePicker.Context>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker>
    <input class="input" type="date" aria-label="原生日期" />
  </Demo>
  <Demo id="time-picker" title="TimePicker" status="composed" note="原生 time input"><input class="input w-40" type="time" value="09:30" aria-label="时间" /></Demo>
  <Demo id="date-range-picker" title="DateRangePicker" status="implemented" note="DatePicker selectionMode=range（inline）">
    <DatePicker selectionMode="range" inline class="card border border-surface-200-800 p-3 space-y-2 inline-block">
      <DatePicker.View view="day">
        <DatePicker.Context>
          {#snippet children(api)}
            <DatePicker.ViewControl class="flex items-center justify-between gap-2">
              <DatePicker.PrevTrigger class="btn-icon btn-icon-sm hover:preset-tonal"><Icon name="chevron-left" /></DatePicker.PrevTrigger>
              <DatePicker.RangeText class="text-sm font-medium" />
              <DatePicker.NextTrigger class="btn-icon btn-icon-sm hover:preset-tonal"><Icon name="chevron-right" /></DatePicker.NextTrigger>
            </DatePicker.ViewControl>
            <DatePicker.Table class="text-sm">
              <DatePicker.TableHead><DatePicker.TableRow>{#each api().weekDays as d (d.long)}<DatePicker.TableHeader class="size-8 text-xs opacity-60">{d.narrow}</DatePicker.TableHeader>{/each}</DatePicker.TableRow></DatePicker.TableHead>
              <DatePicker.TableBody>
                {#each api().weeks as week, wi (wi)}
                  <DatePicker.TableRow>
                    {#each week as day (day.toString())}
                      <DatePicker.TableCell value={day}><DatePicker.TableCellTrigger class="size-8 rounded-base grid place-items-center hover:preset-tonal data-[selected]:preset-filled-primary-500 data-[in-range]:preset-tonal-primary data-[outside-range]:opacity-30">{day.day}</DatePicker.TableCellTrigger></DatePicker.TableCell>
                    {/each}
                  </DatePicker.TableRow>
                {/each}
              </DatePicker.TableBody>
            </DatePicker.Table>
            <p class="text-xs opacity-60">已选：{api().valueAsString.join(" → ") || "—"}</p>
          {/snippet}
        </DatePicker.Context>
      </DatePicker.View>
    </DatePicker>
  </Demo>
  <Demo id="color-picker" title="ColorPicker" status="composed" note="原生 color input + 预设色板">
    <div class="flex items-center gap-2">
      <input class="input w-12 h-10 p-1" type="color" value="#6366f1" aria-label="颜色" />
      {#each colors.slice(0, 6) as c (c)}<button type="button" class="size-8 rounded-full bg-{c}-500 ring-offset-2 hover:ring-2 ring-{c}-500" aria-label={c}></button>{/each}
    </div>
  </Demo>
  <Demo id="upload" title="Upload" status="implemented" note="FileUpload：拖拽区 / 按钮 / 文件列表">
    <FileUpload maxFiles={3} class="space-y-2">
      <FileUpload.Dropzone class="card border-2 border-dashed border-surface-300-700 p-6 text-center hover:preset-tonal">
        <Icon name="upload" class="size-6 mx-auto opacity-60" /><p class="text-sm mt-1">拖拽或点击上传</p><FileUpload.HiddenInput />
      </FileUpload.Dropzone>
      <div class="flex gap-2"><FileUpload.Trigger class="btn btn-sm preset-outlined-surface-500"><Icon name="paperclip" />选择文件</FileUpload.Trigger><FileUpload.ClearTrigger class="btn btn-sm hover:preset-tonal">清空</FileUpload.ClearTrigger></div>
      <FileUpload.ItemGroup class="space-y-1">
        <FileUpload.Context>{#snippet children(api)}{#each api().acceptedFiles as file (file.name)}<FileUpload.Item {file} class="flex items-center gap-2 text-sm card preset-tonal p-2"><Icon name="file" /><FileUpload.ItemName class="flex-1 truncate" /><FileUpload.ItemSizeText class="text-xs opacity-60" /><FileUpload.ItemDeleteTrigger class="btn-icon btn-icon-sm" aria-label="移除"><Icon name="x" class="size-3" /></FileUpload.ItemDeleteTrigger></FileUpload.Item>{/each}{/snippet}</FileUpload.Context>
      </FileUpload.ItemGroup>
    </FileUpload>
  </Demo>
  <Demo id="cascader" title="Cascader" status="composed" note="Menu 嵌套子菜单">
    <Menu positioning={{ placement: "bottom-start" }}>
      <Menu.Trigger class="btn preset-outlined-surface-500 justify-between w-56">{cascaderPath.length ? cascaderPath.join(" / ") : "选择地区"}<Icon name="chevron-down" /></Menu.Trigger>
      <Portal><Menu.Positioner class="z-40"><Menu.Content class="card p-1 bg-surface-100-900 shadow-xl min-w-40">
        {#each Object.entries(cascade) as [region, cities] (region)}
          <Menu positioning={{ placement: "right-start" }}>
            <Menu.TriggerItem value={region} class="flex justify-between"><Menu.ItemText>{region}</Menu.ItemText><Icon name="chevron-right" /></Menu.TriggerItem>
            <Portal><Menu.Positioner class="z-50"><Menu.Content class="card p-1 bg-surface-100-900 shadow-xl min-w-32">
              {#each cities as city (city)}<Menu.Item value={city} onclick={() => (cascaderPath = [region, city])}><Menu.ItemText>{city}</Menu.ItemText></Menu.Item>{/each}
            </Menu.Content></Menu.Positioner></Portal>
          </Menu>
        {/each}
      </Menu.Content></Menu.Positioner></Portal>
    </Menu>
  </Demo>
  <Demo id="transfer" title="Transfer" status="composed" note="两个列表 + 移动按钮">
    <div class="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
      {#snippet column(title: string, items: string[])}
        <div class="card border border-surface-200-800 p-2 space-y-1 min-h-40">
          <p class="text-xs opacity-60 px-1">{title}（{items.length}）</p>
          {#each items as it (it)}<label class="flex items-center gap-2 text-sm px-1 py-0.5 rounded hover:preset-tonal"><input class="checkbox" type="checkbox" checked={transferPick.includes(it)} onchange={() => (transferPick = transferPick.includes(it) ? transferPick.filter((x) => x !== it) : [...transferPick, it])} />{it}</label>{/each}
        </div>
      {/snippet}
      {@render column("候选", transferLeft)}
      <div class="flex flex-col gap-2">
        <button type="button" class="btn-icon btn-icon-sm preset-filled" aria-label="移到右侧" onclick={() => move("right")}><Icon name="chevron-right" /></button>
        <button type="button" class="btn-icon btn-icon-sm preset-filled" aria-label="移到左侧" onclick={() => move("left")}><Icon name="chevron-left" /></button>
      </div>
      {@render column("已选", transferRight)}
    </div>
  </Demo>
  <Demo id="mention" title="Mention" status="composed" note="textarea + 输入 @ 触发 Popover 成员列表">
    <Popover open={mentionOpen} onOpenChange={(d) => (mentionOpen = d.open)} positioning={{ placement: "bottom-start" }} autoFocus={false}>
      <Popover.Anchor>
        <textarea class="textarea" rows="2" placeholder="输入 @ 提及成员" bind:value={mentionText} oninput={() => (mentionOpen = mentionText.endsWith("@"))}></textarea>
      </Popover.Anchor>
      <Portal><Popover.Positioner class="z-40"><Popover.Content class="card p-1 bg-surface-100-900 shadow-xl">
        {#each team.slice(0, 4) as m (m.email)}<button type="button" class="btn btn-sm hover:preset-tonal w-full justify-start" onclick={() => { mentionText += m.name + " "; mentionOpen = false }}>@{m.name}</button>{/each}
      </Popover.Content></Popover.Positioner></Portal>
    </Popover>
  </Demo>
  <Demo id="pin-input" title="PinInput" status="composed" note="4 个单字符 input，自动跳转">
    <div class="flex gap-2">{#each pin as digit, i (i)}<input class="input w-12 text-center text-lg" maxlength="1" inputmode="numeric" value={digit} oninput={(e) => pinInput(i, e)} aria-label={`第 ${i + 1} 位`} />{/each}</div>
  </Demo>
  <Demo id="form" title="Form" status="implemented" note="fieldset / legend / label / label-text 工具类">
    <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); toaster.success({ title: "已提交" }) }}>
      <fieldset class="fieldset space-y-3">
        <legend class="legend">联系信息</legend>
        <label class="label"><span class="label-text">姓名 <span class="text-error-500">*</span></span><input class="input" required value={team[2].name} /></label>
        <label class="label"><span class="label-text">邮箱</span><input class="input" type="email" value={team[2].email} /><span class="text-xs opacity-60">我们不会分享你的邮箱</span></label>
        <label class="label"><span class="label-text">手机</span><input class="input !border-error-500" value="1380000" aria-invalid="true" /><span class="text-xs text-error-500">手机号格式不正确</span></label>
      </fieldset>
      <div class="flex gap-2"><button type="submit" class="btn preset-filled-primary-500">提交</button><button type="reset" class="btn hover:preset-tonal">重置</button></div>
    </form>
  </Demo>
  <Demo id="tags-input" title="TagsInput" status="native" note="Skeleton 原生 TagsInput（契约外）">
    <TagsInput value={tags} onValueChange={(d) => (tags = d.value)}>
      <TagsInput.Control class="input flex flex-wrap gap-1 h-auto min-h-10 items-center">
        <TagsInput.Context>{#snippet children(api)}{#each api().value as value, index (value)}<TagsInput.Item {index} {value} class="chip preset-tonal-primary gap-1"><TagsInput.ItemPreview class="flex items-center gap-1"><TagsInput.ItemText>{value}</TagsInput.ItemText><TagsInput.ItemDeleteTrigger aria-label="删除"><Icon name="x" class="size-3" /></TagsInput.ItemDeleteTrigger></TagsInput.ItemPreview><TagsInput.ItemInput /></TagsInput.Item>{/each}{/snippet}</TagsInput.Context>
        <TagsInput.Input placeholder="添加标签…" class="flex-1 min-w-20 bg-transparent outline-none" />
      </TagsInput.Control>
      <TagsInput.HiddenInput />
    </TagsInput>
  </Demo>
</div>

{#snippet treeNode(n: Node, indexPath: number[])}
  <TreeView.NodeProvider value={{ node: n, indexPath }}>
    {#if n.children}
      <TreeView.Branch>
        <TreeView.BranchControl class="flex items-center gap-1 py-1 px-2 rounded hover:preset-tonal cursor-pointer">
          <TreeView.BranchIndicator class="[&[data-state=open]]:rotate-90 transition"><Icon name="chevron-right" class="size-4" /></TreeView.BranchIndicator>
          <Icon name="folder" class="size-4 opacity-60" /><TreeView.BranchText>{n.name}</TreeView.BranchText>
        </TreeView.BranchControl>
        <TreeView.BranchContent class="ms-4 border-s border-surface-200-800 ps-2">
          {#each n.children as child, i (child.id)}{@render treeNode(child, [...indexPath, i])}{/each}
        </TreeView.BranchContent>
      </TreeView.Branch>
    {:else}
      <TreeView.Item class="flex items-center gap-1 py-1 px-2 rounded hover:preset-tonal cursor-pointer data-[selected]:preset-tonal-primary"><Icon name="file" class="size-4 opacity-60" />{n.name}</TreeView.Item>
    {/if}
  </TreeView.NodeProvider>
{/snippet}

<!-- ===== 数据展示 ===== -->
<h2 class="h4 pt-4" id="display">数据展示</h2>
<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <Demo id="table" title="Table" status="implemented" note="table / table-zebra / hover / 紧凑">
    <div class="table-wrap"><table class="table table-zebra"><thead><tr><th>订单</th><th>客户</th><th>状态</th><th class="text-right">金额</th></tr></thead>
      <tbody class="[&>tr]:hover:preset-tonal-primary">{#each orders.slice(0, 4) as o (o.id)}<tr><td class="font-mono text-xs">{o.id}</td><td>{o.customer}</td><td><StatusBadge status={o.status} /></td><td class="text-right tabular-nums">{money(o.amount)}</td></tr>{/each}</tbody>
      <tfoot><tr><td colspan="3" class="font-medium">合计</td><td class="text-right tabular-nums font-medium">{money(orders.slice(0, 4).reduce((s, o) => s + o.amount, 0))}</td></tr></tfoot></table></div>
  </Demo>
  <Demo id="data-grid" title="DataGrid" status="composed" note="table + 可排序列头 + 行选择">
    <div class="table-wrap"><table class="table"><thead><tr><th><input class="checkbox" type="checkbox" aria-label="全选" /></th>
      <th><button type="button" class="inline-flex items-center gap-1" onclick={() => { sortKey = "customer"; sortAsc = !sortAsc }}>客户 <Icon name="arrow-up-down" class="size-3" /></button></th>
      <th class="text-right"><button type="button" class="inline-flex items-center gap-1" onclick={() => { sortKey = "amount"; sortAsc = !sortAsc }}>金额 <Icon name={sortKey === "amount" ? (sortAsc ? "arrow-up" : "arrow-down") : "arrow-up-down"} class="size-3" /></button></th></tr></thead>
      <tbody>{#each gridRows as o (o.id)}<tr><td><input class="checkbox" type="checkbox" aria-label={o.id} /></td><td>{o.customer}</td><td class="text-right tabular-nums">{money(o.amount)}</td></tr>{/each}</tbody></table></div>
  </Demo>
  <Demo id="descriptions" title="Descriptions" status="composed" note="dl 网格">
    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
      <div class="flex justify-between border-b border-surface-200-800 py-1"><dt class="opacity-60">订单号</dt><dd class="font-mono">{orders[0].id}</dd></div>
      <div class="flex justify-between border-b border-surface-200-800 py-1"><dt class="opacity-60">客户</dt><dd>{orders[0].customer}</dd></div>
      <div class="flex justify-between border-b border-surface-200-800 py-1"><dt class="opacity-60">金额</dt><dd>{money(orders[0].amount)}</dd></div>
      <div class="flex justify-between border-b border-surface-200-800 py-1"><dt class="opacity-60">状态</dt><dd><StatusBadge status={orders[0].status} /></dd></div>
    </dl>
  </Demo>
  <Demo id="list" title="List" status="composed" note="ul + divide">
    <ul class="divide-y divide-surface-200-800">{#each notifications as n (n.title)}<li class="py-2 flex items-center gap-3"><Icon name="bell" class="opacity-60" /><span class="flex-1 text-sm">{n.title}</span><span class="text-xs opacity-60">{n.time}</span></li>{/each}</ul>
  </Demo>
  <Demo id="card" title="Card" status="implemented" note="card × preset × 结构">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <article class="card preset-filled-surface-100-900 p-4 space-y-1"><h3 class="font-medium">填充卡片</h3><p class="text-sm opacity-70">{landing.features[0].desc}</p></article>
      <article class="card preset-outlined-surface-500 p-4 space-y-1"><h3 class="font-medium">描边卡片</h3><p class="text-sm opacity-70">{landing.features[1].desc}</p></article>
      <article class="card preset-tonal-primary p-4 space-y-1 hover:shadow-lg transition"><h3 class="font-medium">Tonal + Hover</h3><p class="text-sm opacity-70">{landing.features[2].desc}</p></article>
    </div>
    <article class="card border border-surface-200-800 divide-y divide-surface-200-800 overflow-hidden">
      <header class="p-3 font-medium">头部</header><div class="p-3 text-sm opacity-70">内容区</div><footer class="p-3 flex justify-end gap-2"><button type="button" class="btn btn-sm hover:preset-tonal">取消</button><button type="button" class="btn btn-sm preset-filled-primary-500">确认</button></footer>
    </article>
  </Demo>
  <Demo id="avatar" title="Avatar" status="implemented" note="尺寸 / 回退 / 图标 / 形状">
    <div class="flex flex-wrap items-center gap-3">
      {#each ["size-6 text-[10px]", "size-8 text-xs", "size-10 text-sm", "size-14 text-lg", "size-20 text-2xl"] as s (s)}<Avatar class={s}><Avatar.Fallback class="preset-filled-primary-500">{initials(team[0].name)}</Avatar.Fallback></Avatar>{/each}
      <Avatar class="size-10"><Avatar.Fallback class="preset-tonal"><Icon name="user" /></Avatar.Fallback></Avatar>
      <Avatar class="size-10 rounded-lg"><Avatar.Fallback class="preset-filled-secondary-500 rounded-lg">方</Avatar.Fallback></Avatar>
      <span class="relative"><Avatar class="size-10"><Avatar.Fallback class="preset-filled-tertiary-500">{initials(team[3].name)}</Avatar.Fallback></Avatar><span class="badge-dot preset-filled-success-500 absolute bottom-0 right-0 ring-2 ring-surface-50-950"></span></span>
    </div>
  </Demo>
  <Demo id="avatar-group" title="AvatarGroup" status="composed" note="负 margin 叠放 + 计数">
    <div class="flex -space-x-3">{#each team.slice(0, 4) as m (m.email)}<Avatar class="size-10 ring-2 ring-surface-50-950"><Avatar.Fallback class="preset-filled-secondary-500 text-xs">{initials(m.name)}</Avatar.Fallback></Avatar>{/each}<Avatar class="size-10 ring-2 ring-surface-50-950"><Avatar.Fallback class="preset-tonal text-xs">+{team.length - 4}</Avatar.Fallback></Avatar></div>
  </Demo>
  <Demo id="badge" title="Badge" status="implemented" note="badge / badge-icon / badge-dot × preset">
    <div class="flex flex-wrap items-center gap-2">
      {#each colors as c (c)}<span class="badge preset-filled-{c}-500">{c}</span>{/each}
    </div>
    <div class="flex flex-wrap items-center gap-2">
      {#each colors.slice(0, 4) as c (c)}<span class="badge preset-tonal-{c}">{c}</span><span class="badge preset-outlined-{c}-500">{c}</span>{/each}
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <span class="badge-icon preset-filled-primary-500"><Icon name="check" class="size-3" /></span><span class="badge-icon preset-filled-error-500">9</span><span class="badge-dot preset-filled-success-500"></span>
      <span class="relative inline-block"><button type="button" class="btn-icon preset-tonal" aria-label="通知"><Icon name="bell" /></button><span class="badge-icon preset-filled-error-500 absolute -top-1 -right-1 size-4 text-[10px]">3</span></span>
    </div>
  </Demo>
  <Demo id="tag" title="Tag" status="implemented" note="chip × preset × 可关闭 / 可选">
    <div class="flex flex-wrap gap-2">
      {#each colors.slice(0, 5) as c (c)}<span class="chip preset-filled-{c}-500">{c}</span>{/each}
      <span class="chip preset-tonal-primary gap-1">可关闭 <button type="button" aria-label="移除"><Icon name="x" class="size-3" /></button></span>
      <button type="button" class="chip preset-outlined-surface-500 hover:preset-tonal">可点击</button>
      <span class="chip preset-filled opacity-50">禁用</span>
      <span class="chip-icon preset-tonal"><Icon name="star" class="size-3" /></span>
    </div>
  </Demo>
  <Demo id="statistic" title="Statistic" status="composed">
    <div class="grid grid-cols-2 gap-3">{#each stats.slice(0, 4) as s (s.key)}<div class="card preset-tonal p-3"><p class="text-xs opacity-60">{s.label}</p><p class="text-xl font-bold tabular-nums">{s.unit === "CNY" ? money(s.value) : s.unit === "%" ? `${s.value}%` : number(s.value)}</p><p class="text-xs {s.delta >= 0 ? 'text-success-500' : 'text-error-500'}">{s.delta >= 0 ? "↑" : "↓"} {Math.abs(s.delta)}%</p></div>{/each}</div>
  </Demo>
  <Demo id="timeline" title="Timeline" status="composed">
    <ol class="relative border-s border-surface-200-800 ms-2 space-y-4">{#each activity.slice(0, 4) as a, i (a.action)}<li class="ms-4"><span class="absolute -start-1.5 mt-1.5 size-3 rounded-full {i === 0 ? 'bg-primary-500' : 'bg-surface-300-700'}"></span><p class="text-sm"><b>{a.user}</b> {a.action}</p><time class="text-xs opacity-60">{a.time}</time></li>{/each}</ol>
  </Demo>
  <Demo id="tree" title="Tree" status="implemented" note="TreeView">
    <TreeView collection={treeCollection} defaultExpandedValue={["products"]} class="text-sm">
      <TreeView.Tree>
        {#each treeData.children ?? [] as child, i (child.id)}{@render treeNode(child, [i])}{/each}
      </TreeView.Tree>
    </TreeView>
  </Demo>
  <Demo id="calendar" title="Calendar" status="implemented" note="DatePicker inline + 月/年选择">
    <DatePicker inline class="card border border-surface-200-800 p-3 space-y-2 inline-block">
      <DatePicker.View view="day">
        <DatePicker.Context>
          {#snippet children(api)}
            <div class="flex gap-2"><DatePicker.MonthSelect class="select field-sm flex-1" /><DatePicker.YearSelect class="select field-sm w-24" /></div>
            <DatePicker.Table class="text-sm">
              <DatePicker.TableHead><DatePicker.TableRow>{#each api().weekDays as d (d.long)}<DatePicker.TableHeader class="size-8 text-xs opacity-60">{d.narrow}</DatePicker.TableHeader>{/each}</DatePicker.TableRow></DatePicker.TableHead>
              <DatePicker.TableBody>{#each api().weeks as week, wi (wi)}<DatePicker.TableRow>{#each week as day (day.toString())}<DatePicker.TableCell value={day}><DatePicker.TableCellTrigger class="size-8 rounded-base grid place-items-center hover:preset-tonal data-[selected]:preset-filled-primary-500 data-[today]:ring-1 ring-primary-500 data-[outside-range]:opacity-30">{day.day}</DatePicker.TableCellTrigger></DatePicker.TableCell>{/each}</DatePicker.TableRow>{/each}</DatePicker.TableBody>
            </DatePicker.Table>
          {/snippet}
        </DatePicker.Context>
      </DatePicker.View>
    </DatePicker>
  </Demo>
  <Demo id="image" title="Image" status="composed" note="占位 SVG + mask 形状 + 说明">
    <div class="flex flex-wrap gap-3 items-end">
      {#each ["", "mask mask-squircle", "mask mask-hexagon", "rounded-full"] as shape (shape)}
        <figure class="space-y-1"><svg viewBox="0 0 96 96" class="size-24 {shape}" role="img" aria-label="占位图"><rect width="96" height="96" class="fill-primary-500" /><circle cx="48" cy="40" r="18" class="fill-surface-50-950/40" /><rect x="16" y="64" width="64" height="16" rx="4" class="fill-surface-50-950/40" /></svg><figcaption class="text-xs opacity-60 text-center">{shape || "默认"}</figcaption></figure>
      {/each}
    </div>
  </Demo>
  <Demo id="carousel" title="Carousel" status="implemented">
    <Carousel slideCount={slides.length} loop class="space-y-2">
      <Carousel.ItemGroup class="rounded-container overflow-hidden">
        {#each slides as s, i (s.title)}<Carousel.Item index={i}><div class="card preset-tonal-primary p-8 text-center space-y-2"><Icon name={s.icon as IconName} class="size-8 mx-auto" /><h3 class="h5">{s.title}</h3><p class="text-sm opacity-70">{s.desc}</p></div></Carousel.Item>{/each}
      </Carousel.ItemGroup>
      <Carousel.Control class="flex items-center justify-between">
        <Carousel.PrevTrigger class="btn-icon preset-tonal" aria-label="上一张"><Icon name="chevron-left" /></Carousel.PrevTrigger>
        <Carousel.IndicatorGroup class="flex gap-1">{#each slides as s, i (s.title)}<Carousel.Indicator index={i} class="size-2 rounded-full bg-surface-300-700 data-[current]:bg-primary-500" aria-label={`第 ${i + 1} 张`} />{/each}</Carousel.IndicatorGroup>
        <Carousel.NextTrigger class="btn-icon preset-tonal" aria-label="下一张"><Icon name="chevron-right" /></Carousel.NextTrigger>
      </Carousel.Control>
    </Carousel>
  </Demo>
  <Demo id="marquee" title="Marquee" status="native" note="Skeleton 原生 Marquee（契约外）">
    <Marquee class="py-2" pauseOnInteraction autoFill>
      <Marquee.Viewport class="overflow-hidden">
        <Marquee.Content index={0} class="flex gap-6 whitespace-nowrap">{#each landing.testimonials as t (t.name)}<span class="chip preset-tonal">{t.company}</span>{/each}</Marquee.Content>
      </Marquee.Viewport>
    </Marquee>
  </Demo>
  <Demo id="empty" title="Empty" status="composed">
    <div class="p-8 text-center space-y-2"><Icon name="inbox" class="size-10 mx-auto opacity-30" /><p class="font-medium">暂无数据</p><p class="text-sm opacity-60">尝试调整筛选条件</p><button type="button" class="btn btn-sm preset-filled-primary-500">新建</button></div>
  </Demo>
  <Demo id="tooltip" title="Tooltip" status="implemented" note="四个方向 + 箭头">
    <div class="flex flex-wrap gap-2">
      {#each ["top", "bottom", "left", "right"] as placement (placement)}
        <Tooltip positioning={{ placement: placement as "top" | "bottom" | "left" | "right" }} openDelay={100}>
          <Tooltip.Trigger class="btn preset-outlined-surface-500">{placement}</Tooltip.Trigger>
          <Portal><Tooltip.Positioner class="z-40"><Tooltip.Content class="card preset-filled p-2 text-xs">提示：{placement}<Tooltip.Arrow><Tooltip.ArrowTip /></Tooltip.Arrow></Tooltip.Content></Tooltip.Positioner></Portal>
        </Tooltip>
      {/each}
    </div>
  </Demo>
  <Demo id="popover" title="Popover" status="implemented">
    <Popover positioning={{ placement: "bottom-start" }}>
      <Popover.Trigger class="btn preset-filled-primary-500">打开 Popover</Popover.Trigger>
      <Portal><Popover.Positioner class="z-40"><Popover.Content class="card bg-surface-100-900 shadow-xl p-4 w-64 space-y-2">
        <Popover.Title class="font-medium">{notifications[0].title}</Popover.Title><Popover.Description class="text-sm opacity-70">{notifications[0].time}</Popover.Description>
        <Popover.CloseTrigger class="btn btn-sm preset-tonal">关闭</Popover.CloseTrigger><Popover.Arrow><Popover.ArrowTip /></Popover.Arrow>
      </Popover.Content></Popover.Positioner></Portal>
    </Popover>
  </Demo>
  <Demo id="qr-code" title="QRCode" status="implemented">
    <div class="flex flex-wrap gap-4 items-center">
      <QrCode value="https://ui.zalize.com/apps/skeleton" class="size-28"><QrCode.Frame class="size-full"><QrCode.Pattern /></QrCode.Frame></QrCode>
      <QrCode value="Acme Console" encoding={{ ecc: "H" }} class="size-28 text-primary-500"><QrCode.Frame class="size-full"><QrCode.Pattern /></QrCode.Frame><QrCode.Overlay class="p-1 bg-surface-50-950 rounded"><Icon name="zap" /></QrCode.Overlay></QrCode>
    </div>
  </Demo>
  <Demo id="segmented" title="Segmented" status="implemented" note="SegmentedControl">
    <SegmentedControl value={segment} onValueChange={(d) => (segment = d.value ?? "list")}>
      <SegmentedControl.Control>
        <SegmentedControl.Indicator />
        {#each [["list", "list", "列表"], ["grid", "grid", "网格"], ["chart", "bar-chart", "图表"]] as [v, icon, label] (v)}
          <SegmentedControl.Item value={v}><SegmentedControl.ItemText class="flex items-center gap-1"><Icon name={icon as IconName} />{label}</SegmentedControl.ItemText><SegmentedControl.ItemHiddenInput /></SegmentedControl.Item>
        {/each}
        <SegmentedControl.Item value="disabled" disabled><SegmentedControl.ItemText>禁用</SegmentedControl.ItemText><SegmentedControl.ItemHiddenInput /></SegmentedControl.Item>
      </SegmentedControl.Control>
    </SegmentedControl>
  </Demo>
  <Demo id="toggle-group" title="ToggleGroup" status="native" note="Skeleton 原生 ToggleGroup（契约外）">
    <ToggleGroup value={toggles} onValueChange={(d) => (toggles = d.value)} multiple class="btn-group preset-outlined-surface-500 p-1 gap-1">
      {#each [["bold", "bold"], ["italic", "italic"], ["underline", "underline"]] as [v, icon] (v)}<ToggleGroup.Item value={v} class="btn-icon btn-icon-sm hover:preset-tonal data-[state=on]:preset-filled" aria-label={v}><Icon name={icon as IconName} /></ToggleGroup.Item>{/each}
    </ToggleGroup>
  </Demo>
  <Demo id="collapsible" title="Collapsible" status="native" note="Skeleton 原生 Collapsible（契约外）">
    <Collapsible class="card border border-surface-200-800">
      <Collapsible.Trigger class="flex w-full items-center justify-between p-3 text-sm font-medium">{landing.faq[0].q}<Collapsible.Indicator class="[&[data-state=open]]:rotate-180 transition"><Icon name="chevron-down" /></Collapsible.Indicator></Collapsible.Trigger>
      <Collapsible.Content class="px-3 pb-3 text-sm opacity-70">{landing.faq[0].a}</Collapsible.Content>
    </Collapsible>
  </Demo>
</div>

<!-- ===== 反馈 ===== -->
<h2 class="h4 pt-4" id="feedback">反馈</h2>
<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <Demo id="alert" title="Alert" status="composed" note="card + preset-tonal-* + 图标">
    {#each [["info", "info", "提示：系统将于今晚维护。"], ["success", "circle-check", "成功：设置已保存。"], ["warning", "triangle-alert", "警告：存储空间即将用尽。"], ["error", "alert-circle", "错误：支付失败，请重试。"]] as [c, icon, text] (c)}
      <div class="card preset-tonal-{c === 'info' ? 'primary' : c} p-3 flex items-start gap-3 text-sm" role="alert"><Icon name={icon as IconName} class="size-5 shrink-0" /><span class="flex-1">{text}</span><button type="button" class="btn-icon btn-icon-sm" aria-label="关闭"><Icon name="x" class="size-3" /></button></div>
    {/each}
    <div class="card preset-outlined-primary-500 p-3 text-sm flex items-start gap-3"><Icon name="info" class="size-5 shrink-0" /><div><p class="font-medium">带标题的描边 Alert</p><p class="opacity-70">{landing.faq[1].a}</p></div></div>
  </Demo>
  <Demo id="toast" title="Toast" status="implemented" note="createToaster × type">
    <div class="flex flex-wrap gap-2">
      <button type="button" class="btn preset-filled-primary-500" onclick={() => toaster.info({ title: "信息", description: notifications[0].title })}>info</button>
      <button type="button" class="btn preset-filled-success-500" onclick={() => toaster.success({ title: "成功", description: "操作已完成" })}>success</button>
      <button type="button" class="btn preset-filled-warning-500" onclick={() => toaster.warning({ title: "警告", description: "请检查输入" })}>warning</button>
      <button type="button" class="btn preset-filled-error-500" onclick={() => toaster.error({ title: "错误", description: "请求失败" })}>error</button>
      <button type="button" class="btn preset-tonal" onclick={() => toaster.promise(new Promise((r) => setTimeout(r, 1500)), { loading: { title: "处理中…" }, success: () => ({ title: "完成" }), error: () => ({ title: "失败" }) })}>promise</button>
    </div>
  </Demo>
  <Demo id="notification" title="Notification" status="composed" note="Toast 带操作按钮 + 静态通知卡">
    <button type="button" class="btn preset-outlined-surface-500" onclick={() => toaster.create({ title: notifications[1].title, description: notifications[1].time, type: "info", duration: 8000, action: { label: "查看", onClick: () => toaster.success({ title: "已跳转" }) } })}>带操作的通知</button>
    <div class="card border border-surface-200-800 p-3 flex gap-3 text-sm"><Avatar class="size-9"><Avatar.Fallback class="preset-filled-secondary-500 text-xs">{initials(team[1].name)}</Avatar.Fallback></Avatar><div class="flex-1"><p class="font-medium">{notifications[2].title}</p><p class="opacity-60 text-xs">{notifications[2].time}</p></div><button type="button" class="btn-icon btn-icon-sm" aria-label="关闭"><Icon name="x" class="size-3" /></button></div>
  </Demo>
  <Demo id="dialog" title="Dialog" status="implemented" note="标准 / 危险确认 / 全屏">
    <div class="flex flex-wrap gap-2">
      <Dialog>
        <Dialog.Trigger class="btn preset-filled-primary-500">打开对话框</Dialog.Trigger>
        <Portal><Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" /><Dialog.Positioner class="fixed inset-0 z-50 grid place-items-center p-4"><Dialog.Content class="card bg-surface-50-950 p-6 w-full max-w-md space-y-4 shadow-xl">
          <Dialog.Title class="h5">编辑资料</Dialog.Title><Dialog.Description class="text-sm opacity-70">修改后点击保存。</Dialog.Description>
          <label class="label"><span class="label-text">姓名</span><input class="input" value={team[0].name} /></label>
          <div class="flex justify-end gap-2"><Dialog.CloseTrigger class="btn preset-tonal">取消</Dialog.CloseTrigger><Dialog.CloseTrigger class="btn preset-filled-primary-500">保存</Dialog.CloseTrigger></div>
        </Dialog.Content></Dialog.Positioner></Portal>
      </Dialog>
      <Dialog role="alertdialog">
        <Dialog.Trigger class="btn preset-filled-error-500">危险操作</Dialog.Trigger>
        <Portal><Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" /><Dialog.Positioner class="fixed inset-0 z-50 grid place-items-center p-4"><Dialog.Content class="card bg-surface-50-950 p-6 w-full max-w-sm space-y-4 shadow-xl">
          <Dialog.Title class="h5 text-error-500">确认删除？</Dialog.Title><Dialog.Description class="text-sm opacity-70">此操作无法撤销。</Dialog.Description>
          <div class="flex justify-end gap-2"><Dialog.CloseTrigger class="btn preset-tonal">取消</Dialog.CloseTrigger><Dialog.CloseTrigger class="btn preset-filled-error-500">删除</Dialog.CloseTrigger></div>
        </Dialog.Content></Dialog.Positioner></Portal>
      </Dialog>
      <Dialog>
        <Dialog.Trigger class="btn preset-outlined-surface-500">全屏</Dialog.Trigger>
        <Portal><Dialog.Positioner class="fixed inset-0 z-50"><Dialog.Content class="h-screen w-screen bg-surface-50-950 p-6 flex flex-col">
          <header class="flex justify-between items-center"><Dialog.Title class="h4">全屏对话框</Dialog.Title><Dialog.CloseTrigger class="btn-icon hover:preset-tonal" aria-label="关闭"><Icon name="x" /></Dialog.CloseTrigger></header>
          <div class="flex-1 grid place-items-center opacity-60">内容</div>
        </Dialog.Content></Dialog.Positioner></Portal>
      </Dialog>
    </div>
  </Demo>
  <Demo id="drawer" title="Drawer" status="composed" note="Dialog + Positioner，四方向">
    <div class="flex flex-wrap gap-2">
      {#each drawerSides as d (d.side)}
        <button type="button" class="btn preset-filled-primary-500" onclick={() => { drawerSide = d.side; drawerOpen = true }}>{d.label}侧抽屉</button>
      {/each}
    </div>
    <Dialog open={drawerOpen} onOpenChange={(d) => (drawerOpen = d.open)}>
      <Portal><Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" /><Dialog.Positioner class="fixed inset-0 z-50 flex {drawerConfig.positioner}"><Dialog.Content class="{drawerConfig.content} bg-surface-50-950 p-4 shadow-xl space-y-4 overflow-y-auto">
        <header class="flex justify-between items-center"><Dialog.Title class="h5">{drawerConfig.label}侧抽屉</Dialog.Title><Dialog.CloseTrigger class="btn-icon hover:preset-tonal" aria-label="关闭"><Icon name="x" /></Dialog.CloseTrigger></header>
        <ul class="divide-y divide-surface-200-800 text-sm">{#each tasks as t (t.title)}<li class="py-2 flex justify-between"><span>{t.title}</span><span class="opacity-60">{t.progress}%</span></li>{/each}</ul>
      </Dialog.Content></Dialog.Positioner></Portal>
    </Dialog>
  </Demo>
  <Demo id="progress" title="Progress" status="implemented" note="线性 / 环形 / 不定态 / 颜色">
    <Progress value={progress} class="space-y-1"><div class="flex justify-between text-sm"><Progress.Label>上传</Progress.Label><Progress.ValueText /></div><Progress.Track><Progress.Range /></Progress.Track></Progress>
    <Progress value={progress} class="space-y-1"><Progress.Track class="h-1"><Progress.Range class="bg-success-500" /></Progress.Track></Progress>
    <Progress value={null} class="space-y-1"><Progress.Label class="text-sm">不定态</Progress.Label><Progress.Track><Progress.Range /></Progress.Track></Progress>
    <div class="flex items-center gap-4">
      <Progress value={progress} class="size-16"><Progress.Circle class="size-16 [--size:4rem] [--thickness:6px]"><Progress.CircleTrack /><Progress.CircleRange /></Progress.Circle></Progress>
      <Progress value={25} class="size-12"><Progress.Circle class="size-12 [--size:3rem] [--thickness:4px] text-warning-500"><Progress.CircleTrack /><Progress.CircleRange /></Progress.Circle></Progress>
      <input type="range" class="input flex-1" min="0" max="100" bind:value={progress} aria-label="调整进度" />
    </div>
  </Demo>
  <Demo id="skeleton" title="Skeleton" status="implemented" note="placeholder / placeholder-circle + animate-pulse">
    <div class="flex gap-3"><div class="placeholder-circle animate-pulse size-12"></div><div class="flex-1 space-y-2"><div class="placeholder animate-pulse h-4 w-1/2"></div><div class="placeholder animate-pulse h-4"></div><div class="placeholder animate-pulse h-4 w-3/4"></div></div></div>
    <div class="placeholder animate-pulse h-24 rounded-container"></div>
  </Demo>
  <Demo id="spinner" title="Spinner" status="composed" note="animate-spin 图标 / 边框环">
    <div class="flex items-center gap-4">
      <Icon name="loader" class="size-4 animate-spin" /><Icon name="loader" class="size-6 animate-spin text-primary-500" /><Icon name="loader" class="size-8 animate-spin text-secondary-500" />
      <span class="size-8 rounded-full border-4 border-surface-200-800 border-t-primary-500 animate-spin"></span>
      <button type="button" class="btn preset-filled" disabled><Icon name="loader" class="animate-spin" />加载中</button>
    </div>
  </Demo>
  <Demo id="result" title="Result" status="composed">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="p-6 text-center space-y-2"><span class="mx-auto grid place-items-center size-12 rounded-full preset-tonal-success"><Icon name="circle-check" class="size-6" /></span><p class="font-medium">提交成功</p><p class="text-sm opacity-60">我们已收到你的请求</p><button type="button" class="btn btn-sm preset-filled-primary-500">返回</button></div>
      <div class="p-6 text-center space-y-2"><span class="mx-auto grid place-items-center size-12 rounded-full preset-tonal-error"><Icon name="x" class="size-6" /></span><p class="font-medium">提交失败</p><p class="text-sm opacity-60">请稍后重试</p><button type="button" class="btn btn-sm preset-outlined-surface-500">重试</button></div>
    </div>
  </Demo>
  <Demo id="popconfirm" title="Popconfirm" status="composed" note="Popover + 确认按钮">
    <Popover positioning={{ placement: "top" }}>
      <Popover.Trigger class="btn preset-outlined-error-500"><Icon name="trash" />删除</Popover.Trigger>
      <Portal><Popover.Positioner class="z-40"><Popover.Content class="card bg-surface-100-900 shadow-xl p-3 space-y-2 w-56">
        <p class="text-sm flex items-start gap-2"><Icon name="triangle-alert" class="text-warning-500 shrink-0 mt-0.5" />确定删除此项？</p>
        <div class="flex justify-end gap-2"><Popover.CloseTrigger class="btn btn-sm preset-tonal">取消</Popover.CloseTrigger><Popover.CloseTrigger class="btn btn-sm preset-filled-error-500" onclick={() => toaster.success({ title: "已删除" })}>确定</Popover.CloseTrigger></div>
        <Popover.Arrow><Popover.ArrowTip /></Popover.Arrow>
      </Popover.Content></Popover.Positioner></Portal>
    </Popover>
  </Demo>
</div>

<!-- ===== 导航 ===== -->
<h2 class="h4 pt-4" id="navigation">导航</h2>
<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <Demo id="menu" title="Menu" status="implemented" note="分组 / 分隔 / 禁用 / 快捷键 / 单选项">
    <Menu positioning={{ placement: "bottom-start" }}>
      <Menu.Trigger class="btn preset-filled-primary-500">打开菜单<Icon name="chevron-down" /></Menu.Trigger>
      <Portal><Menu.Positioner class="z-40"><Menu.Content class="card p-1 bg-surface-100-900 shadow-xl min-w-52">
        <Menu.ItemGroup><Menu.ItemGroupLabel class="px-2 py-1 text-xs opacity-60">操作</Menu.ItemGroupLabel>
          <Menu.Item value="edit"><Icon name="pencil" /><Menu.ItemText>编辑</Menu.ItemText><kbd class="kbd ml-auto text-xs">⌘E</kbd></Menu.Item>
          <Menu.Item value="copy"><Icon name="copy" /><Menu.ItemText>复制</Menu.ItemText></Menu.Item>
          <Menu.Item value="archive" disabled><Icon name="archive" /><Menu.ItemText>归档</Menu.ItemText></Menu.Item>
        </Menu.ItemGroup>
        <Menu.Separator />
        <Menu.OptionItem type="checkbox" value="pin" checked={switchOn} onCheckedChange={(v) => (switchOn = v)}><Menu.ItemIndicator><Icon name="check" /></Menu.ItemIndicator><Menu.ItemText>置顶</Menu.ItemText></Menu.OptionItem>
        <Menu.Separator />
        <Menu.Item value="delete" class="text-error-500"><Icon name="trash" /><Menu.ItemText>删除</Menu.ItemText></Menu.Item>
      </Menu.Content></Menu.Positioner></Portal>
    </Menu>
  </Demo>
  <Demo id="dropdown" title="Dropdown" status="implemented" note="Menu 作为下拉 + 右键 ContextTrigger">
    <div class="flex flex-wrap gap-2 items-center">
      <Menu positioning={{ placement: "bottom-end" }}>
        <Menu.Trigger class="btn preset-outlined-surface-500">更多<Icon name="chevron-down" /></Menu.Trigger>
        <Portal><Menu.Positioner class="z-40"><Menu.Content class="card p-1 bg-surface-100-900 shadow-xl min-w-40">{#each nav.slice(0, 4) as n (n.key)}<Menu.Item value={n.key}><Icon name={n.icon as IconName} /><Menu.ItemText>{n.label}</Menu.ItemText></Menu.Item>{/each}</Menu.Content></Menu.Positioner></Portal>
      </Menu>
      <Menu>
        <Menu.ContextTrigger class="card preset-tonal p-4 text-sm select-none">右键此区域</Menu.ContextTrigger>
        <Portal><Menu.Positioner class="z-40"><Menu.Content class="card p-1 bg-surface-100-900 shadow-xl min-w-32"><Menu.Item value="a"><Menu.ItemText>刷新</Menu.ItemText></Menu.Item><Menu.Item value="b"><Menu.ItemText>属性</Menu.ItemText></Menu.Item></Menu.Content></Menu.Positioner></Portal>
      </Menu>
    </div>
  </Demo>
  <Demo id="breadcrumb" title="Breadcrumb" status="composed" note="ol + 分隔符">
    <ol class="flex flex-wrap items-center gap-2 text-sm"><li><a class="anchor flex items-center gap-1" href={router.href("/")} use:link><Icon name="home" class="size-3.5" />首页</a></li><li class="opacity-40"><Icon name="chevron-right" class="size-3" /></li><li><a class="anchor" href={router.href("/orders")} use:link>订单</a></li><li class="opacity-40"><Icon name="chevron-right" class="size-3" /></li><li aria-current="page" class="font-medium">{orders[0].id}</li></ol>
    <ol class="flex items-center gap-2 text-sm"><li><a class="anchor" href={router.href("/settings")} use:link>设置</a></li><li class="opacity-40">/</li><li><a class="anchor" href={router.href("/settings")} use:link>团队</a></li><li class="opacity-40">/</li><li class="opacity-60">成员</li></ol>
  </Demo>
  <Demo id="tabs" title="Tabs" status="implemented" note="默认 / 带图标 / 垂直 / 禁用">
    <Tabs defaultValue="a"><Tabs.List><Tabs.Trigger value="a">概览</Tabs.Trigger><Tabs.Trigger value="b" class="gap-1"><Icon name="bar-chart" />分析</Tabs.Trigger><Tabs.Trigger value="c" disabled>禁用</Tabs.Trigger><Tabs.Indicator /></Tabs.List><Tabs.Content value="a" class="text-sm opacity-70 pt-2">概览内容</Tabs.Content><Tabs.Content value="b" class="text-sm opacity-70 pt-2">分析内容</Tabs.Content></Tabs>
    <Tabs defaultValue="x"><Tabs.List><Tabs.Trigger value="x">周</Tabs.Trigger><Tabs.Trigger value="y">月</Tabs.Trigger><Tabs.Trigger value="z">年</Tabs.Trigger><Tabs.Indicator /></Tabs.List></Tabs>
    <Tabs defaultValue="v1" orientation="vertical" class="flex gap-4"><Tabs.List class="flex-col items-stretch"><Tabs.Trigger value="v1">通用</Tabs.Trigger><Tabs.Trigger value="v2">安全</Tabs.Trigger><Tabs.Indicator /></Tabs.List><Tabs.Content value="v1" class="text-sm opacity-70">通用设置</Tabs.Content><Tabs.Content value="v2" class="text-sm opacity-70">安全设置</Tabs.Content></Tabs>
  </Demo>
  <Demo id="pagination" title="Pagination" status="implemented" note="数字 / 首末页 / 简洁">
    <Pagination count={orders.length} pageSize={5} {page} onPageChange={(d) => (page = d.page)} siblingCount={1} class="flex flex-wrap gap-1">
      <Pagination.FirstTrigger class="btn-icon btn-icon-sm preset-outlined-surface-500" aria-label="首页"><Icon name="chevrons-up-down" class="-rotate-90" /></Pagination.FirstTrigger>
      <Pagination.PrevTrigger class="btn-icon btn-icon-sm preset-outlined-surface-500" aria-label="上一页"><Icon name="chevron-left" /></Pagination.PrevTrigger>
      <Pagination.Context>{#snippet children(api)}{#each api().pages as p, i (i)}{#if p.type === "page"}<Pagination.Item {...p} class="btn-icon btn-icon-sm {p.value === page ? 'preset-filled-primary-500' : 'preset-outlined-surface-500'}">{p.value}</Pagination.Item>{:else}<Pagination.Ellipsis index={i} class="btn-icon btn-icon-sm">…</Pagination.Ellipsis>{/if}{/each}{/snippet}</Pagination.Context>
      <Pagination.NextTrigger class="btn-icon btn-icon-sm preset-outlined-surface-500" aria-label="下一页"><Icon name="chevron-right" /></Pagination.NextTrigger>
      <Pagination.LastTrigger class="btn-icon btn-icon-sm preset-outlined-surface-500" aria-label="末页"><Icon name="chevrons-up-down" class="rotate-90" /></Pagination.LastTrigger>
    </Pagination>
    <div class="flex items-center gap-2 text-sm"><button type="button" class="btn btn-sm preset-tonal" onclick={() => (page = Math.max(1, page - 1))}>上一页</button><span>第 {page} 页</span><button type="button" class="btn btn-sm preset-tonal" onclick={() => (page = page + 1)}>下一页</button></div>
  </Demo>
  <Demo id="steps" title="Steps" status="implemented" note="水平 / 垂直 / 完成态">
    <Steps step={stepIdx} count={3} onStepChange={(d) => (stepIdx = d.step)}>
      <Steps.List class="flex items-center gap-2">
        {#each ["基本信息", "配置", "完成"] as s, i (s)}
          <Steps.Item index={i} class="flex items-center gap-2 flex-1">
            <Steps.Trigger class="flex items-center gap-2 text-sm"><Steps.Indicator class="size-7 rounded-full grid place-items-center text-xs font-bold {i < stepIdx ? 'preset-filled-success-500' : i === stepIdx ? 'preset-filled-primary-500' : 'preset-tonal'}">{#if i < stepIdx}<Icon name="check" class="size-3" />{:else}{i + 1}{/if}</Steps.Indicator><span class="hidden sm:inline">{s}</span></Steps.Trigger>
            {#if i < 2}<Steps.Separator class="flex-1 h-px bg-surface-200-800" />{/if}
          </Steps.Item>
        {/each}
      </Steps.List>
      <div class="flex gap-2 pt-3"><Steps.PrevTrigger class="btn btn-sm preset-tonal">上一步</Steps.PrevTrigger><Steps.NextTrigger class="btn btn-sm preset-filled-primary-500">下一步</Steps.NextTrigger></div>
    </Steps>
    <Steps step={1} count={3} orientation="vertical">
      <Steps.List class="flex flex-col gap-3">
        {#each ["创建订单", "支付", "发货"] as s, i (s)}<Steps.Item index={i} class="flex items-start gap-3"><Steps.Indicator class="size-6 rounded-full grid place-items-center text-xs {i < 1 ? 'preset-filled-success-500' : i === 1 ? 'preset-filled-primary-500' : 'preset-tonal'}">{i + 1}</Steps.Indicator><div class="text-sm"><p class="font-medium">{s}</p><p class="text-xs opacity-60">{activity[i]?.time}</p></div></Steps.Item>{/each}
      </Steps.List>
    </Steps>
  </Demo>
  <Demo id="anchor" title="Anchor" status="composed" note="页内锚点导航（见页面顶部索引）">
    <ul class="border-s-2 border-surface-200-800 text-sm">{#each groups as g (g.id)}<li><a class="block ps-3 py-1 -ms-0.5 border-s-2 border-transparent hover:border-primary-500 hover:text-primary-500" href={`#${g.id}`}>{g.label}</a></li>{/each}</ul>
  </Demo>
  <Demo id="back-top" title="BackTop" status="composed"><button type="button" class="btn preset-filled-primary-500" onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="arrow-up" />回到顶部</button><p class="text-xs opacity-60">右下角另有固定悬浮版本。</p></Demo>
  <Demo id="affix" title="Affix" status="composed" note="sticky 定位（本页顶部组件索引即为示例）">
    <div class="h-32 overflow-y-auto card border border-surface-200-800"><div class="sticky top-0 bg-primary-500 text-primary-contrast-500 px-3 py-1 text-sm">吸顶栏</div><div class="p-3 space-y-2 text-sm opacity-70">{#each { length: 8 }, i (i)}<p>滚动内容 {i + 1}</p>{/each}</div></div>
  </Demo>
  <Demo id="navbar" title="Navbar" status="implemented" note="AppBar：Lead / Headline / Trail">
    <AppBar class="card border border-surface-200-800"><AppBar.Toolbar class="grid-cols-[auto_1fr_auto]"><AppBar.Lead><button type="button" class="btn-icon hover:preset-tonal" aria-label="菜单"><Icon name="menu" /></button></AppBar.Lead><AppBar.Headline class="font-bold">Acme Console</AppBar.Headline><AppBar.Trail class="items-center"><button type="button" class="btn-icon hover:preset-tonal" aria-label="搜索"><Icon name="search" /></button><Avatar class="size-8"><Avatar.Fallback class="preset-filled-secondary-500 text-xs">{initials(team[0].name)}</Avatar.Fallback></Avatar></AppBar.Trail></AppBar.Toolbar></AppBar>
    <AppBar class="card preset-filled-primary-500"><AppBar.Toolbar class="grid-cols-[1fr_auto]"><AppBar.Lead class="font-bold">品牌色</AppBar.Lead><AppBar.Trail><button type="button" class="btn btn-sm preset-filled-surface-50-950">登录</button></AppBar.Trail></AppBar.Toolbar></AppBar>
  </Demo>
  <Demo id="sidebar" title="Sidebar" status="implemented" note="Navigation layout=sidebar / bar（rail）">
    <div class="grid grid-cols-[auto_1fr] gap-4 min-h-56">
      <Navigation layout="sidebar" class="card border border-surface-200-800 p-2! w-40! h-auto!">
        <Navigation.Content><Navigation.Group><Navigation.Label class="px-2 text-xs opacity-60">导航</Navigation.Label><Navigation.Menu>{#each nav.slice(0, 4) as n, i (n.key)}<Navigation.TriggerAnchor href={router.href(n.path)} class="gap-2 {i === 0 ? 'preset-filled-primary-500' : ''}"><Icon name={n.icon as IconName} /><Navigation.TriggerText>{n.label}</Navigation.TriggerText></Navigation.TriggerAnchor>{/each}</Navigation.Menu></Navigation.Group></Navigation.Content>
      </Navigation>
      <Navigation layout="bar" class="card border border-surface-200-800 self-end">
        <Navigation.Menu class="flex justify-around">{#each nav.slice(0, 4) as n, i (n.key)}<Navigation.Trigger class="text-xs {i === 0 ? 'text-primary-500' : ''}"><Icon name={n.icon as IconName} class="size-5" /><Navigation.TriggerText>{n.label}</Navigation.TriggerText></Navigation.Trigger>{/each}</Navigation.Menu>
      </Navigation>
    </div>
  </Demo>
  <Demo id="command-palette" title="CommandPalette" status="composed" note="Dialog + 搜索输入 + 结果列表 + kbd">
    <button type="button" class="btn preset-outlined-surface-500 gap-3" onclick={() => (cmdOpen = true)}><Icon name="search" />搜索命令… <kbd class="kbd">⌘K</kbd></button>
    <Dialog open={cmdOpen} onOpenChange={(d) => (cmdOpen = d.open)}>
      <Portal><Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" /><Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-start pt-24 p-4"><Dialog.Content class="card bg-surface-50-950 w-full max-w-lg shadow-xl overflow-hidden">
        <Dialog.Title class="sr-only">命令面板</Dialog.Title>
        <label class="flex items-center gap-2 px-3 border-b border-surface-200-800"><Icon name="search" class="opacity-60" /><input class="flex-1 bg-transparent py-3 outline-none" placeholder="输入命令或页面…" bind:value={cmdQuery} /><kbd class="kbd">Esc</kbd></label>
        <ul class="max-h-64 overflow-y-auto p-1">{#each cmdItems as n (n.key)}<li><button type="button" class="w-full flex items-center gap-2 px-3 py-2 rounded-base text-sm hover:preset-tonal" onclick={() => { cmdOpen = false; toaster.info({ title: `跳转到 ${n.label}` }) }}><Icon name={n.icon as IconName} /><span class="flex-1 text-left">{n.label}</span><span class="text-xs opacity-60">{n.path}</span></button></li>{:else}<li class="p-4 text-sm text-center opacity-60">无结果</li>{/each}</ul>
      </Dialog.Content></Dialog.Positioner></Portal>
    </Dialog>
  </Demo>
</div>

<!-- ===== 布局与其他 ===== -->
<h2 class="h4 pt-4" id="layout">布局与其他</h2>
<div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
  <Demo id="grid" title="Grid" status="composed" note="Tailwind grid"><div class="grid grid-cols-2 sm:grid-cols-4 gap-2">{#each { length: 8 }, i (i)}<div class="card preset-tonal-primary p-3 text-center text-sm">{i + 1}</div>{/each}</div><div class="grid grid-cols-3 gap-2"><div class="card preset-tonal p-3 col-span-2 text-sm">span 2</div><div class="card preset-tonal p-3 text-sm">1</div></div></Demo>
  <Demo id="stack" title="Stack" status="composed" note="flex-col / flex-row + gap"><div class="flex flex-col gap-2">{#each { length: 3 }, i (i)}<div class="card preset-tonal p-2 text-sm">垂直 {i + 1}</div>{/each}</div><div class="flex flex-row gap-2">{#each { length: 3 }, i (i)}<div class="card preset-tonal p-2 text-sm flex-1 text-center">水平 {i + 1}</div>{/each}</div></Demo>
  <Demo id="layout" title="Layout" status="composed" note="Header / Sider / Content / Footer 骨架"><div class="card border border-surface-200-800 overflow-hidden text-xs"><div class="bg-primary-500 text-primary-contrast-500 p-2">Header</div><div class="grid grid-cols-[80px_1fr]"><div class="preset-tonal p-2 min-h-20">Sider</div><div class="p-2">Content</div></div><div class="preset-tonal-surface p-2">Footer</div></div></Demo>
  <Demo id="container" title="Container" status="composed" note="mx-auto max-w-*"><div class="bg-surface-100-900 p-2 rounded"><div class="mx-auto max-w-xs card preset-tonal-primary p-3 text-center text-sm">max-w-xs</div></div><div class="bg-surface-100-900 p-2 rounded"><div class="mx-auto max-w-md card preset-tonal-primary p-3 text-center text-sm">max-w-md</div></div></Demo>
  <Demo id="aspect-ratio" title="AspectRatio" status="composed" note="aspect-video / aspect-square"><div class="grid grid-cols-2 gap-3"><div class="aspect-video card preset-tonal-primary grid place-items-center text-sm">16:9</div><div class="aspect-square card preset-tonal-secondary grid place-items-center text-sm w-1/2">1:1</div></div></Demo>
  <Demo id="resizable" title="Resizable" status="composed" note="CSS resize + FloatingPanel 拖拽缩放"><div class="resize overflow-auto card border border-surface-200-800 p-3 w-64 h-24 min-w-40 min-h-16 text-sm">拖动右下角缩放</div></Demo>
  <Demo id="floating-panel" title="FloatingPanel" status="native" note="Skeleton 原生 FloatingPanel（契约外）：可拖拽、缩放、最小化">
    <FloatingPanel defaultSize={{ width: 320, height: 200 }}>
      <FloatingPanel.Trigger class="btn preset-filled-primary-500">打开浮动面板</FloatingPanel.Trigger>
      <Portal><FloatingPanel.Positioner class="z-40"><FloatingPanel.Content class="card bg-surface-100-900 shadow-xl border border-surface-200-800 flex flex-col overflow-hidden">
        <FloatingPanel.DragTrigger><FloatingPanel.Header class="flex items-center justify-between px-3 py-2 border-b border-surface-200-800 cursor-move"><FloatingPanel.Title class="text-sm font-medium">浮动面板</FloatingPanel.Title><FloatingPanel.Control class="flex gap-1"><FloatingPanel.StageTrigger stage="minimized" class="btn-icon btn-icon-sm hover:preset-tonal" aria-label="最小化"><Icon name="minus" /></FloatingPanel.StageTrigger><FloatingPanel.StageTrigger stage="maximized" class="btn-icon btn-icon-sm hover:preset-tonal" aria-label="最大化"><Icon name="maximize" /></FloatingPanel.StageTrigger><FloatingPanel.CloseTrigger class="btn-icon btn-icon-sm hover:preset-tonal" aria-label="关闭"><Icon name="x" /></FloatingPanel.CloseTrigger></FloatingPanel.Control></FloatingPanel.Header></FloatingPanel.DragTrigger>
        <FloatingPanel.Body class="p-3 text-sm opacity-70 flex-1">{landing.features[3].desc}</FloatingPanel.Body>
        <FloatingPanel.ResizeTrigger axis="se" class="absolute bottom-0 right-0 size-3 cursor-se-resize" />
      </FloatingPanel.Content></FloatingPanel.Positioner></Portal>
    </FloatingPanel>
  </Demo>
  <Demo id="scroll-area" title="ScrollArea" status="composed" note="overflow-auto + 自定义滚动条"><div class="h-32 overflow-y-auto card border border-surface-200-800 p-3 space-y-2 text-sm [scrollbar-width:thin]">{#each orders.slice(0, 12) as o (o.id)}<p class="flex justify-between"><span class="font-mono text-xs">{o.id}</span><span>{o.customer}</span></p>{/each}</div><div class="overflow-x-auto flex gap-2 pb-2">{#each team as m (m.email)}<div class="card preset-tonal p-3 min-w-36 text-sm">{m.name}</div>{/each}</div></Demo>
  <Demo id="accordion" title="Accordion" status="implemented" note="单开 / 多开 / 禁用">
    <Accordion collapsible defaultValue={["0"]} class="card border border-surface-200-800 divide-y divide-surface-200-800">
      {#each landing.faq.slice(0, 3) as f, i (f.q)}<Accordion.Item value={String(i)} disabled={i === 2}><Accordion.ItemTrigger class="flex w-full items-center justify-between p-3 text-sm font-medium text-left disabled:opacity-50">{f.q}<Accordion.ItemIndicator class="[&[data-state=open]]:rotate-180 transition"><Icon name="chevron-down" /></Accordion.ItemIndicator></Accordion.ItemTrigger><Accordion.ItemContent class="px-3 pb-3 text-sm opacity-70">{f.a}</Accordion.ItemContent></Accordion.Item>{/each}
    </Accordion>
    <Accordion multiple defaultValue={["0", "1"]} class="space-y-2">
      {#each landing.faq.slice(3, 5) as f, i (f.q)}<Accordion.Item value={String(i)} class="card preset-tonal"><Accordion.ItemTrigger class="flex w-full items-center justify-between p-3 text-sm font-medium text-left">{f.q}<Accordion.ItemIndicator class="[&[data-state=open]]:rotate-180 transition"><Icon name="chevron-down" /></Accordion.ItemIndicator></Accordion.ItemTrigger><Accordion.ItemContent class="px-3 pb-3 text-sm opacity-70">{f.a}</Accordion.ItemContent></Accordion.Item>{/each}
    </Accordion>
  </Demo>
  <Demo id="theme-provider" title="ThemeProvider" status="composed" note="data-theme=cerberus + .dark 类切换">
    <div class="flex flex-wrap items-center gap-3"><button type="button" class="btn preset-filled-primary-500" onclick={() => { dark = !dark; setDark(dark) }}><Icon name={dark ? "sun" : "moon"} />切换到{dark ? "浅色" : "深色"}</button><code class="code">data-theme="cerberus"</code><code class="code">.{dark ? "dark" : "light"}</code></div>
    <div class="flex gap-1">{#each ["primary", "secondary", "tertiary", "success", "warning", "error", "surface"] as c (c)}<span class="flex-1 h-6 rounded bg-{c}-500" title={c}></span>{/each}</div>
  </Demo>
  <Demo id="watermark" title="Watermark" status="composed" note="重复 SVG 背景">
    <div class="relative h-32 card border border-surface-200-800 overflow-hidden"><div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='100'><text x='10' y='60' font-size='14' fill='gray' transform='rotate(-20 80 50)'>Acme Console</text></svg>&quot;)"></div><p class="p-4 text-sm relative">受水印保护的内容</p></div>
  </Demo>
  <Demo id="tour" title="Tour" status="missing" note="Skeleton 未提供 Tour/引导组件，也无合适原语组合（需要元素高亮遮罩 + 步骤定位）。" />
  <Demo id="float-button" title="FloatButton" status="composed" note="fixed 定位 btn-icon（见右下角）"><div class="relative h-24 card preset-tonal"><button type="button" class="btn-icon preset-filled-primary-500 rounded-full shadow-xl absolute bottom-3 right-3" aria-label="新建"><Icon name="plus" /></button><button type="button" class="btn-icon preset-filled-secondary-500 rounded-full shadow-xl absolute bottom-3 right-16" aria-label="帮助"><Icon name="circle-help" /></button></div></Demo>
</div>

<button type="button" class="btn-icon min-w-10 min-h-10 preset-filled-primary-500 rounded-full shadow-xl fixed bottom-6 right-6 z-30" aria-label="回到顶部" onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="arrow-up" /></button>
