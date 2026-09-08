// 由 design/hifi/components/index.html 各卡片 <pre><code> 与 Props 表抽取：组件名与 props 用法的等宽纯文本（content components.code.hint），不含样式类。
export type Snippet = { id: string; cat: string; name: string; src: "shadcn" | "composed" | "tokens"; primary: string; keywords: string; code: string; props: string[][] }
export const snippets: Snippet[] = [
  {
    "id": "typography",
    "cat": "typography",
    "name": "Typography",
    "src": "composed",
    "primary": "Typography",
    "keywords": "Typography 排版 字阶",
    "code": "// 只用 theme.css 暴露的排版类，不写 text-[..]\n<h1 className=\"text-role-heading\">下午好，若琳</h1>\n<p className=\"text-role-body\">受理了订单 SO-20260906-0104 的退款申请</p>\n<span className=\"text-role-caption text-fg-muted\">用于发货单与库存报表的显示名</span>\n<code className=\"font-mono text-role-code\">SO-20260906-0108</code>",
    "props": [
      [
        "className",
        "text-role-{hero|display-lg|display|heading|title|lead|body|label|caption|eyebrow|code}",
        "text-role-body"
      ],
      [
        "font-family",
        "font-sans | font-mono",
        "font-sans"
      ]
    ]
  },
  {
    "id": "button",
    "cat": "button",
    "name": "Button",
    "src": "shadcn",
    "primary": "Button",
    "keywords": "Button 按钮",
    "code": "<Button>保存更改</Button>\n<Button variant=\"secondary\">取消</Button>\n<Button variant=\"ghost\" size=\"sm\">查看全部</Button>\n<Button variant=\"danger\">删除订单</Button>\n<Button variant=\"link\" asChild><a href=\"/forgot\">忘记密码？</a></Button>\n<Button loading>保存中…</Button>\n<Button size=\"lg\" block>免费试用 14 天</Button>",
    "props": [
      [
        "variant",
        "\"primary\" | \"secondary\" | \"ghost\" | \"danger\" | \"link\"",
        "\"primary\""
      ],
      [
        "size",
        "\"sm\" | \"md\" | \"lg\"",
        "\"md\""
      ],
      [
        "loading",
        "boolean",
        "false"
      ],
      [
        "block",
        "boolean",
        "false"
      ],
      [
        "asChild",
        "boolean",
        "false"
      ]
    ]
  },
  {
    "id": "iconbutton",
    "cat": "button",
    "name": "IconButton",
    "src": "shadcn",
    "primary": "IconButton",
    "keywords": "IconButton 图标按钮",
    "code": "<IconButton label=\"更多操作\" icon={Ellipsis} />\n<IconButton label=\"通知\" icon={Bell} shape=\"round\" count={3} />",
    "props": [
      [
        "label",
        "string（必填，aria-label）",
        "—"
      ],
      [
        "shape",
        "\"square\" | \"round\"",
        "\"square\""
      ],
      [
        "count",
        "number",
        "undefined"
      ]
    ]
  },
  {
    "id": "input",
    "cat": "form-controls",
    "name": "Input · PasswordInput · SearchInput · NumberInput · Textarea",
    "src": "shadcn",
    "primary": "Input",
    "keywords": "Input 输入框 PasswordInput 密码 SearchInput 搜索 NumberInput 数字 Textarea 文本域",
    "code": "<Input placeholder=\"例如：杭州仓\" />\n<PasswordInput defaultValue=\"12345678\" />\n<SearchInput placeholder=\"搜索订单号 / 客户\" onClear={reset} />\n<NumberInput value={40} min={1} />\n<Input prefix=\"¥\" inputMode=\"decimal\" value=\"1280.00\" />\n<Textarea rows={3} maxLength={200} placeholder=\"收货、质检或付款方面的特殊要求\" />",
    "props": [
      [
        "size",
        "\"sm\" | \"md\" | \"lg\"",
        "\"md\""
      ],
      [
        "invalid",
        "boolean（aria-invalid）",
        "false"
      ],
      [
        "prefix / suffix",
        "ReactNode",
        "undefined"
      ],
      [
        "onClear",
        "() => void（SearchInput）",
        "undefined"
      ]
    ]
  },
  {
    "id": "field",
    "cat": "form-controls",
    "name": "Field",
    "src": "composed",
    "primary": "Field",
    "keywords": "Field 表单项 Label 标签 错误提示 计数",
    "code": "<Field label=\"仓库名称\" required description=\"用于发货单与库存报表的显示名\">\n  <Input placeholder=\"例如：杭州仓\" />\n</Field>\n<Field label=\"邮箱\" required error=\"请输入正确的邮箱地址\">\n  <Input type=\"email\" />\n</Field>",
    "props": [
      [
        "label",
        "string",
        "—"
      ],
      [
        "required",
        "boolean",
        "false"
      ],
      [
        "description / error",
        "string（error 优先，role=\"alert\"）",
        "undefined"
      ],
      [
        "counter",
        "{ value: number; max: number }",
        "undefined"
      ]
    ]
  },
  {
    "id": "select",
    "cat": "form-controls",
    "name": "Select · Combobox",
    "src": "shadcn",
    "primary": "Select",
    "keywords": "Select 下拉 Combobox 搜索选择",
    "code": "<Select value={supplierId} onValueChange={setSupplierId}>\n  <SelectTrigger placeholder=\"选择仓库\" />\n  <SelectContent>\n    {suppliers.map((s) => <SelectItem key={s.id} value={s.id} disabled={!s.active}>{s.name}</SelectItem>)}\n  </SelectContent>\n</Select>\n<Combobox items={suppliers} searchPlaceholder=\"搜索供应商名称\" emptyText=\"没有匹配的供应商\" />",
    "props": [
      [
        "value / onValueChange",
        "string / (v: string) => void",
        "—"
      ],
      [
        "placeholder",
        "string",
        "\"请选择\""
      ],
      [
        "emptyText",
        "string（Combobox）",
        "\"没有匹配的结果\""
      ]
    ]
  },
  {
    "id": "choice",
    "cat": "form-controls",
    "name": "Checkbox · Radio · Switch",
    "src": "shadcn",
    "primary": "Checkbox",
    "keywords": "Checkbox 复选框 Radio 单选 Switch 开关",
    "code": "<Checkbox checked={remember} onCheckedChange={setRemember}>记住我</Checkbox>\n<Checkbox checked=\"indeterminate\">全选（3 / 12）</Checkbox>\n<RadioGroup value={terms} onValueChange={setTerms}>\n  <RadioItem value=\"net30\" description=\"对账后 30 天内付款\">月结 30 天</RadioItem>\n</RadioGroup>\n<Switch checked={email} onCheckedChange={setEmail} aria-label=\"邮件通知\" />",
    "props": [
      [
        "checked",
        "boolean | \"indeterminate\"（Checkbox）",
        "false"
      ],
      [
        "disabled",
        "boolean",
        "false"
      ],
      [
        "description",
        "string（RadioItem）",
        "undefined"
      ]
    ]
  },
  {
    "id": "date",
    "cat": "form-controls",
    "name": "Slider · DatePicker · DateRangePicker · TimePicker",
    "src": "shadcn",
    "primary": "DatePicker",
    "keywords": "Slider 滑块 DatePicker 日期 DateRangePicker 日期范围 TimePicker 时间",
    "code": "<Slider range value={[1000, 4500]} min={0} max={10000} step={100} formatValue={fmtCny} />\n<DatePicker value={eta} onChange={setEta} minDate={today} />\n<DateRangePicker value={{ from: \"2026-09-01\", to: \"2026-09-07\" }} />\n<TimePicker value=\"22:00\" /> 至 <TimePicker value=\"08:00\" />",
    "props": [
      [
        "range",
        "boolean（Slider）",
        "false"
      ],
      [
        "minDate / maxDate",
        "string（ISO 日期）",
        "undefined"
      ],
      [
        "value",
        "string | { from; to }",
        "—"
      ]
    ]
  },
  {
    "id": "misc-input",
    "cat": "form-controls",
    "name": "TagInput · OTPInput · FileDropzone",
    "src": "composed",
    "primary": "TagInput",
    "keywords": "TagInput 标签输入 OTPInput 验证码 FileDropzone 文件上传",
    "code": "<TagInput value={[\"补货\", \"双 11 备货\"]} placeholder=\"输入后回车添加\" />\n<OTPInput length={6} value=\"482\" error=\"验证码错误，还可重试 2 次\" />\n<FileDropzone accept=\".pdf,.xlsx,.jpg,.png\" maxSize={10 * 1024 * 1024} files={files} onDrop={upload} />",
    "props": [
      [
        "length",
        "number（OTPInput）",
        "6"
      ],
      [
        "accept / maxSize",
        "string / number",
        "undefined"
      ],
      [
        "files",
        "{ name; size; status: \"uploading\" | \"done\" | \"error\"; progress?; error? }[]",
        "[]"
      ]
    ]
  },
  {
    "id": "table",
    "cat": "data-display",
    "name": "Table · Pagination",
    "src": "shadcn",
    "primary": "Table",
    "keywords": "Table 表格 DataTable Pagination 分页",
    "code": "<DataTable columns={orderColumns} rows={orders} density=\"default\" selectable sort={{ key: \"amount\", dir: \"desc\" }} mobileHint=\"左右滑动查看更多\" />\n<Pagination page={1} pageSize={20} total={234} onChange={setPage} />",
    "props": [
      [
        "density",
        "\"default\" | \"compact\"",
        "\"default\""
      ],
      [
        "selectable",
        "boolean",
        "false"
      ],
      [
        "sort",
        "{ key: string; dir: \"asc\" | \"desc\" }",
        "undefined"
      ],
      [
        "page / pageSize / total",
        "number",
        "1 / 20 / —"
      ]
    ]
  },
  {
    "id": "tag",
    "cat": "data-display",
    "name": "Tag · CountBadge · Avatar · Delta",
    "src": "shadcn",
    "primary": "Tag",
    "keywords": "Tag 标签 CountBadge 角标 Avatar 头像 Delta 涨跌",
    "code": "<Tag tone=\"warning\" dot>待发货</Tag>\n<CountBadge count={124} max={99} tone=\"alert\" />\n<Avatar initial=\"琳\" hue={210} name=\"沈若琳\" size=\"md\" />\n<Delta value={6.8} format=\"percent\" />\n<Delta value={3} format=\"count\" unit=\"SKU\" invert />",
    "props": [
      [
        "tone",
        "\"info\" | \"warning\" | \"neutral\" | \"success\" | \"danger\" | \"muted\"",
        "\"neutral\""
      ],
      [
        "hue",
        "number（0–360，来自 mock avatarHue）",
        "210"
      ],
      [
        "invert",
        "boolean（上升为负面）",
        "false"
      ]
    ]
  },
  {
    "id": "dl",
    "cat": "data-display",
    "name": "DescriptionList · Timeline · Card",
    "src": "composed",
    "primary": "DescriptionList",
    "keywords": "DescriptionList 描述列表 Timeline 时间线 Card 卡片",
    "code": "<Card title=\"订单信息\" extra={<Tag tone=\"warning\" dot>待发货</Tag>}>\n  <DescriptionList items={[{ label: \"订单号\", value: order.id, mono: true }, { label: \"金额\", value: fmtCny(order.amount) }]} />\n</Card>\n<Timeline items={activity} renderActor={(a) => <Avatar initial={a.initial} hue={a.hue} size=\"sm\" />} />",
    "props": [
      [
        "variant",
        "\"default\" | \"muted\" | \"raised\"（Card）",
        "\"default\""
      ],
      [
        "columns",
        "1 | 2（DescriptionList，≤768 强制 1）",
        "1"
      ],
      [
        "items",
        "{ actor; text; detail?; at }[]",
        "[]"
      ]
    ]
  },
  {
    "id": "chart",
    "cat": "data-display",
    "name": "StatCard · TrendChart · DonutChart",
    "src": "composed",
    "primary": "StatCard",
    "keywords": "StatCard 统计卡 TrendChart 趋势图 DonutChart 环图 Sparkline",
    "code": "<StatCard label=\"销售额\" value={42380} format=\"currency\" delta={6.8} trend={[31260, 28950, 34410, 43870, 32780, 39680, 42380]} hint=\"较昨日同时段 ¥39,680\" />\n<TrendChart labels={trendLabels} gmv={gmvSeries} orders={orderSeries} activeIndex={5} />\n<DonutChart total={42380} items={channels} activeKey=\"tmall\" />",
    "props": [
      [
        "format",
        "\"currency\" | \"integer\" | \"percent\"",
        "\"integer\""
      ],
      [
        "trend",
        "number[]（Sparkline，7 点）",
        "undefined"
      ],
      [
        "activeIndex / activeKey",
        "number / string（悬停高亮 + Tooltip）",
        "undefined"
      ]
    ]
  },
  {
    "id": "md",
    "cat": "data-display",
    "name": "Markdown · CodeBlock · SourceChip",
    "src": "composed",
    "primary": "Markdown",
    "keywords": "Markdown 渲染 CodeBlock 代码块 SourceChip 来源",
    "code": "{\n  \"id\": \"SO-20260906-0108\",\n  \"customer\": { \"name\": \"周雅婷\" },\n  \"amount\": 4276,\n  \"status\": \"pending_shipment\"\n}",
    "props": [
      [
        "source",
        "string（GFM：表格 / 列表 / 行内代码 / 加粗）",
        "—"
      ],
      [
        "language",
        "\"tsx\" | \"json\" | \"bash\" | \"text\"",
        "\"text\""
      ],
      [
        "sources",
        "{ type: \"sku\" | \"order\" | \"po\"; ref: string }[]",
        "[]"
      ]
    ]
  },
  {
    "id": "alert",
    "cat": "feedback",
    "name": "Alert · Toast",
    "src": "shadcn",
    "primary": "Alert",
    "keywords": "Alert 提示条 Toast 轻提示",
    "code": "<Alert tone=\"warning\" title=\"警告\" action={<Button variant=\"ghost\" size=\"sm\">去补货</Button>}>「胡桃木床头柜（双抽）」库存低于安全线，剩余 18 件</Alert>\ntoast.success(\"通知偏好已保存\")\ntoast(\"已发货 12 单\", { description: \"面单已推送到打印队列\", action: { label: \"撤销\", onClick } })",
    "props": [
      [
        "tone",
        "\"info\" | \"success\" | \"warning\" | \"danger\" | \"neutral\"",
        "\"info\""
      ],
      [
        "dismissible",
        "boolean",
        "true"
      ],
      [
        "duration",
        "number（Toast，毫秒；danger 不自动关闭）",
        "4000"
      ]
    ]
  },
  {
    "id": "loading",
    "cat": "feedback",
    "name": "Skeleton · Spinner · Progress",
    "src": "shadcn",
    "primary": "Skeleton",
    "keywords": "Skeleton 骨架 Spinner 加载 Progress 进度",
    "code": "<Skeleton variant=\"stat\" />\n<Skeleton variant=\"row\" count={2} />\n<Spinner size=\"md\" label=\"加载中\" />\n<Progress value={72} label=\"杭州仓秋季盘点\" hint=\"1,842 / 2,560 SKU · 72%\" />\n<Progress indeterminate label=\"正在导出订单\" />",
    "props": [
      [
        "variant",
        "\"text\" | \"row\" | \"stat\" | \"block\"（Skeleton）",
        "\"text\""
      ],
      [
        "size",
        "\"sm\" | \"md\" | \"lg\"（Spinner）",
        "\"md\""
      ],
      [
        "tone",
        "\"primary\" | \"success\" | \"warning\" | \"danger\"（Progress）",
        "\"primary\""
      ],
      [
        "indeterminate",
        "boolean",
        "false"
      ]
    ]
  },
  {
    "id": "state",
    "cat": "feedback",
    "name": "StateCard · Result",
    "src": "composed",
    "primary": "StateCard",
    "keywords": "StateCard 状态卡 EmptyState 空态 ErrorState 错误 Result 结果页",
    "code": "<StateCard kind=\"empty\" title=\"今天还没有新订单\" description=\"渠道同步每 15 分钟一次；也可以手动触发一次同步。\" primary={{ label: \"手动同步\", onClick: sync }} />\n<StateCard kind=\"error\" title=\"数据加载失败\" description={err.message} primary={{ label: \"重新加载\", onClick: refetch }} help={{ label: \"查看服务状态\", href: \"/status\" }} />\n<Result status=\"success\" title=\"采购单已提交\" description=\"PO-20260906-003 已发送给安吉林语木业，预计 2026-09-24 到货。\" />",
    "props": [
      [
        "kind",
        "\"empty\" | \"error\" | \"forbidden\" | \"offline\"",
        "\"empty\""
      ],
      [
        "primary / secondary",
        "{ label; onClick }",
        "undefined"
      ],
      [
        "status",
        "\"success\" | \"info\" | \"warning\" | \"error\"（Result）",
        "\"success\""
      ]
    ]
  },
  {
    "id": "dialog",
    "cat": "feedback",
    "name": "Dialog · Tooltip",
    "src": "shadcn",
    "primary": "Dialog",
    "keywords": "Dialog 对话框 AlertDialog Tooltip 气泡提示",
    "code": "<Dialog open={open} onOpenChange={setOpen} size=\"md\">\n  <DialogHeader title=\"取消订单 SO-20260906-0107？\" description={summary} />\n  <Field label=\"取消原因\"><Select … /></Field>\n  <DialogFooter cancel=\"返回\" confirm={{ label: \"确认取消\", variant: \"danger\" }} />\n</Dialog>\n<Tooltip content=\"打印面单\" side=\"bottom\"><IconButton label=\"打印面单\" icon={Printer} /></Tooltip>",
    "props": [
      [
        "size",
        "\"sm\" | \"md\"",
        "\"md\""
      ],
      [
        "side",
        "\"top\" | \"bottom\" | \"left\" | \"right\"（Tooltip）",
        "\"top\""
      ],
      [
        "delay",
        "number（毫秒）",
        "300"
      ]
    ]
  },
  {
    "id": "nav",
    "cat": "navigation",
    "name": "NavItem · Breadcrumb",
    "src": "composed",
    "primary": "NavItem",
    "keywords": "NavItem 导航项 Sidebar 侧边栏 Breadcrumb 面包屑",
    "code": "<NavItem icon={ReceiptText} label=\"订单\" href=\"/orders\" count={63} />\n<NavItem icon={Truck} label=\"采购\" disabled tooltip=\"后续轮次提供\" />\n<Sidebar mode=\"rail\" />   // 1024 默认 rail；768 抽屉\n<Breadcrumb items={[{ label: \"订单\", href: \"/orders\" }, { label: \"待发货\", href: \"/orders?status=pending_shipment\" }, { label: order.id, mono: true }]} />",
    "props": [
      [
        "mode",
        "\"expanded\" | \"rail\" | \"drawer\"",
        "按视口"
      ],
      [
        "disabled",
        "boolean（aria-disabled，无 href，可聚焦）",
        "false"
      ],
      [
        "count",
        "number（rail 下退化为圆点）",
        "undefined"
      ]
    ]
  },
  {
    "id": "tabs",
    "cat": "navigation",
    "name": "Tabs · Segmented · Stepper",
    "src": "shadcn",
    "primary": "Tabs",
    "keywords": "Tabs 标签页 Segmented 分段控件 Stepper 步骤条",
    "code": "<Tabs value={period} onValueChange={setPeriod} variant=\"pill\" aria-label=\"统计周期示例\">\n  <Tab value=\"day\">日</Tab><Tab value=\"week\">周</Tab><Tab value=\"month\">月</Tab>\n</Tabs>\n<Segmented options={[\"邮件\", \"站内\", \"短信\"]} value=\"邮件\" aria-label=\"接收方式\" />\n<Stepper current={1} steps={[{ title: \"选择供应商\", hint: \"安吉林语木业\" }, { title: \"添加商品\", hint: \"1 个 SKU\" }, { title: \"确认提交\" }]} />",
    "props": [
      [
        "variant",
        "\"pill\" | \"line\" | \"vertical\"（Tabs）",
        "\"pill\""
      ],
      [
        "orientation",
        "\"horizontal\" | \"vertical\"（Stepper，≤768 强制 vertical）",
        "\"horizontal\""
      ],
      [
        "status",
        "\"done\" | \"current\" | \"todo\" | \"error\"",
        "按 current 推导"
      ]
    ]
  },
  {
    "id": "menu",
    "cat": "navigation",
    "name": "Accordion · DropdownMenu · Popover",
    "src": "shadcn",
    "primary": "DropdownMenu",
    "keywords": "Accordion 手风琴 DropdownMenu 下拉菜单 Popover 弹出层",
    "code": "<Accordion type=\"single\" defaultValue=\"q1\" items={faq} />\n<DropdownMenu trigger={<IconButton label=\"更多操作\" icon={Ellipsis} />}>\n  <MenuItem icon={Eye}>查看详情</MenuItem>\n  <MenuItem icon={PackageCheck} disabled={order.status !== \"pending_shipment\"}>标记发货</MenuItem>\n  <MenuSeparator />\n  <MenuItem tone=\"danger\" icon={Ban}>取消订单</MenuItem>\n</DropdownMenu>\n<Popover trigger={<IconButton label=\"通知\" icon={Bell} count={3} />} align=\"end\"><NotificationList items={notifications} /></Popover>",
    "props": [
      [
        "type",
        "\"single\" | \"multiple\"（Accordion）",
        "\"single\""
      ],
      [
        "tone",
        "\"default\" | \"danger\"（MenuItem）",
        "\"default\""
      ],
      [
        "align",
        "\"start\" | \"end\"（Popover / Menu）",
        "\"start\""
      ]
    ]
  },
  {
    "id": "sheet",
    "cat": "navigation",
    "name": "Sheet · Drawer · Anchor",
    "src": "shadcn",
    "primary": "Sheet",
    "keywords": "Sheet 抽屉导航 Drawer 详情抽屉 Anchor 页内导航",
    "code": "<Sheet side=\"left\" title=\"导航\" closeLabel=\"关闭导航\" open={navOpen} onOpenChange={setNavOpen}><NavList /></Sheet>\n<Drawer side=\"right\" width=\"drawer\" open={!!orderId}><OrderDrawer id={orderId} /></Drawer>\n<Anchor items={sections} activeId={active} aria-label=\"页内导航\" />",
    "props": [
      [
        "side",
        "\"left\" | \"right\" | \"bottom\"",
        "\"right\""
      ],
      [
        "width",
        "\"sheet\"（size.sheet 320）| \"drawer\"（size.drawer 480）；≤768 = 100% − space.8",
        "\"sheet\""
      ],
      [
        "activeId",
        "string（Anchor，滚动监听）",
        "首项"
      ]
    ]
  },
  {
    "id": "shell",
    "cat": "layout",
    "name": "AppShell",
    "src": "composed",
    "primary": "AppShell",
    "keywords": "AppShell 应用壳 Sidebar 侧边栏 Topbar 顶栏",
    "code": "<AppShell nav={nav} user={user} notifications={notifications}>\n  <PageHeader title=\"订单\" … />\n  {children}\n</AppShell>",
    "props": [
      [
        "sidebar",
        "\"expanded\" | \"rail\" | \"drawer\"（URL ?sidebar= 可覆盖）",
        "按视口"
      ],
      [
        "contentMax",
        "\"content\" | \"prose\" | \"marketing\"",
        "\"content\""
      ]
    ]
  },
  {
    "id": "layout",
    "cat": "layout",
    "name": "PageHeader · Toolbar · Separator · TextDivider · Kbd",
    "src": "composed",
    "primary": "PageHeader",
    "keywords": "PageHeader 页头 Toolbar 工具栏 Separator 分隔线 TextDivider Kbd 快捷键",
    "code": "<PageHeader crumbs={[{ label: \"订单\", href: \"/orders\" }, { label: \"待发货\" }]} title=\"待发货订单\" meta=\"63 单 · 数据更新于 2026-09-06 17:30\" actions={<><Button variant=\"secondary\">导出</Button><Button>批量打印面单</Button></>} />\n<Toolbar aria-label=\"订单列表工具栏\">…</Toolbar>\n<Separator orientation=\"vertical\" />\n<TextDivider>或使用以下方式登录</TextDivider>\n<Kbd>Enter</Kbd>",
    "props": [
      [
        "crumbs / title / meta / actions",
        "PageHeader",
        "—"
      ],
      [
        "orientation",
        "\"horizontal\" | \"vertical\"（Separator）",
        "\"horizontal\""
      ]
    ]
  },
  {
    "id": "color",
    "cat": "theme",
    "name": "语义色板",
    "src": "tokens",
    "primary": "语义色",
    "keywords": "色板 语义色 Color 主题 亮暗",
    "code": "// theme.css 从 tokens.css 注入；组件只用主题类\n<div className=\"bg-surface text-fg border-border rounded-md shadow-sm\" />\n<span className=\"bg-warning-soft text-on-warning\">待发货</span>\n// 亮暗：<html data-theme=\"dark\"> 重映射同名变量，不写 dark: 类",
    "props": []
  },
  {
    "id": "scale",
    "cat": "theme",
    "name": "间距 · 圆角 · 阴影 · 动效",
    "src": "tokens",
    "primary": "间距令牌",
    "keywords": "间距 圆角 阴影 动效 令牌 Spacing Radius Shadow Motion",
    "code": "<div className=\"grid gap-4 p-5 rounded-md shadow-sm\" />      // space-4 / space-5 / radius-md / shadow-sm\n<button className=\"h-control-md px-4 rounded-md transition-colors duration-fast\" />",
    "props": []
  },
  {
    "id": "onboarding",
    "cat": "onboarding",
    "name": "Welcome · SuggestionChips · QuietHours",
    "src": "composed",
    "primary": "Welcome",
    "keywords": "Welcome 欢迎 EmptyState 助理空态 SuggestionChips 建议 QuietHours 免打扰",
    "code": "<Welcome user={user} greeting={t(\"chat.greeting\")} intro={chat.emptyState.intro}>\n  <SuggestionChips items={chat.suggestions} onPick={send} />\n</Welcome>\n<QuietHours enabled={settings.notifications.quietHours.enabled} from=\"22:00\" to=\"08:00\" onChange={save} />",
    "props": [
      [
        "items",
        "{ key, label, icon }[]（最多 4 项，≤768 换行）",
        "[]"
      ],
      [
        "enabled / from / to",
        "boolean / \"HH:mm\" / \"HH:mm\"",
        "false / \"22:00\" / \"08:00\""
      ]
    ]
  },
  {
    "id": "order",
    "cat": "composed",
    "name": "OrderCard · PurchaseItemRow",
    "src": "composed",
    "primary": "OrderCard",
    "keywords": "OrderCard 订单卡 PurchaseItemRow 采购行",
    "code": "<OrderCard order={order} selected={order.id === activeId} onSelect={open} />   // ≤768 替代 Table 行\n<PurchaseItemRow item={item} onChange={update} onRemove={remove} error={errors[item.sku]} />",
    "props": [
      [
        "order",
        "{ id, customer, items[], amount, channel, status, urgent, createdAt }",
        "—"
      ],
      [
        "selected",
        "boolean（aria-pressed）",
        "false"
      ],
      [
        "error",
        "string（PurchaseItemRow 行级校验）",
        "undefined"
      ]
    ]
  },
  {
    "id": "pricing",
    "cat": "composed",
    "name": "PricingCard · MemberRow · SessionRow",
    "src": "composed",
    "primary": "PricingCard",
    "keywords": "PricingCard 价格卡 MemberRow 成员行 SessionRow 会话行",
    "code": "<PricingCard plan={plan} billing=\"yearly\" recommended={plan.recommended} />\n<MemberRow member={m} roles={team.roles} isSelf={m.id === user.id} onRoleChange={setRole} onRemove={remove} />\n<SessionRow session={s} onRevoke={revoke} revoking={pending.has(s.id)} />",
    "props": [
      [
        "billing",
        "\"monthly\" | \"yearly\"",
        "\"yearly\""
      ],
      [
        "pending",
        "boolean（MemberRow 待接受邀请，名字用邮箱）",
        "false"
      ],
      [
        "current",
        "boolean（SessionRow，不可注销）",
        "false"
      ]
    ]
  },
  {
    "id": "chat",
    "cat": "composed",
    "name": "ChatBubble · ToolCall · Composer · ConversationList",
    "src": "composed",
    "primary": "ChatBubble",
    "keywords": "ChatBubble 消息气泡 ToolCall 工具调用 Composer 输入框 ConversationList 会话列表 streaming",
    "code": "<ChatBubble role=\"assistant\" status=\"streaming\" markdown={partial} />\n<ToolCall name=\"查询订单\" args=\"SO-20260903-0087\" status=\"done\" durationMs={320} result=\"待发货 · 抖音小店 · …\" />\n<Composer value={draft} onSend={send} onStop={abort} generating={streaming} maxRows={6} />\n<ConversationList groups={chat.groups} items={chat.conversations} activeId=\"c_2\" />",
    "props": [
      [
        "status",
        "\"done\" | \"streaming\" | \"error\"（ChatBubble）；\"running\" | \"done\" | \"error\"（ToolCall）",
        "\"done\""
      ],
      [
        "generating",
        "boolean（Composer：textarea 禁用，发送 → 停止）",
        "false"
      ],
      [
        "historyAvailable",
        "boolean（false = aria-disabled + Tooltip）",
        "true"
      ]
    ]
  },
  {
    "id": "hero",
    "cat": "composed",
    "name": "HeroArt",
    "src": "composed",
    "primary": "HeroArt",
    "keywords": "HeroArt 首屏插画 Landing 营销",
    "code": "<HeroArt series={landing.hero.series} aria-label=\"产品界面示意\" />",
    "props": []
  }
]
