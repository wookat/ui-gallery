# 页面规格（Page Spec）v1

每个库应用 `apps/<slug>/` 必须实现以下 8 个路由，路由名、信息结构、组件类型与状态**必须一致**；视觉全部使用该库的**官方默认主题与默认组件**，不写自定义样式（布局用的容器/栅格允许用该库自带的 Grid/Stack/Container，库无布局组件时用最小 CSS flex/grid）。库缺少某组件时：用该库官方推荐的替代或组合实现，并在 `gallery.json` 的 `coverage` 中标 `missing` 或 `composed`，不得静默跳过。

通用要求：
- 视口：桌面 1440×900、移动 375×812 两档均须可用（无横向溢出、导航在移动端折叠为抽屉/底栏）。
- 主题：亮/暗两态（库无暗色主题时标 `dark: n/a`）。
- 图标：默认 lucide；应用须读取 `?icons=lucide|tabler|phosphor|heroicons` 切换图标集（通过 `packages/icons-<framework>` 适配层）；库自带图标体系（MUI、Ant、Element）时同时提供 `?icons=native`。
- 字体：默认库自身默认字体；读取 `?font=default|inter|geist|noto-sans-sc|lxgw-wenkai` 通过 CSS 变量切换。
- 数据：全部来自 `packages/spec/mock/*.json`（框架无关），不请求网络。
- 每页顶部不得出现库名水印以外的额外品牌元素；应用标题统一为「Acme Console」。

## 路由与内容

### 1. `/login` 认证
登录卡片：Logo + 标题 + 描述；邮箱输入（带前缀图标）、密码输入（可见性切换）、「记住我」复选框、「忘记密码」链接、主按钮、分隔线「或」、3 个 OAuth 次级按钮（Google/GitHub/微信）、底部「注册」链接。状态：字段校验错误（内联错误文案）、提交加载（按钮 loading）、顶部 Alert（错误态）。移动端全宽。

### 2. `/` 仪表盘（应用壳 + 概览）
应用壳：侧边栏（Logo、分组导航 8 项、折叠按钮、底部用户卡）、顶栏（面包屑、全局搜索输入、通知铃铛+角标+Popover 列表、主题切换、头像下拉菜单 5 项）。内容：4 个统计卡（数字+同比 badge+迷你趋势）、图表区（折线图 + 柱状图/环形图；库无图表时用 Recharts/ECharts/Chart.js 之一并标 `external`）、「最近订单」表格（5 行，含状态 Tag、头像、操作菜单）、「团队动态」时间线、「任务进度」进度条列表、Tabs 切换周期（日/周/月）。状态：加载骨架屏。

### 3. `/orders` 数据表格
工具栏：搜索框、状态 Select、日期范围选择、多选筛选（下拉多选/标签）、「导出」按钮、列显示开关。表格：可排序表头、行选择（全选/半选）、状态 Tag、金额右对齐、行内操作（编辑/删除 Dropdown）、分页器（页码+每页条数）。交互：点行打开右侧 Drawer 详情（Descriptions 列表 + Tabs + 备注 Textarea）；删除弹出 Dialog 确认；确认后 Toast 成功提示。状态：空态（插画/图标+文案+按钮）、加载（骨架或 Spinner）、错误（Alert + 重试）。移动端：表格横向滚动或卡片化。

### 4. `/form` 表单（多步）
Stepper 三步（基本信息 / 详细配置 / 确认）。步骤 1：文本、数字、邮箱、电话（带国家码 Select）、Textarea（字数统计）、单选组、复选组、Switch。步骤 2：Select、多选 Select、Combobox/Autocomplete、日期选择、时间选择、日期范围、Slider（区间）、评分、颜色选择、文件上传（拖拽区 + 文件列表）、标签输入、Tooltip 说明图标、字段级帮助文案、必填星号。步骤 3：只读摘要（Descriptions）+ 同意条款复选 + 提交。全部字段带校验（必填/格式/范围），错误内联显示；提交成功后 Result/成功页。

### 5. `/settings` 设置
左侧（移动端顶部）Tabs：个人资料 / 账号安全 / 通知 / 团队 / 计费。个人资料：头像上传（裁剪弹窗可省略）、姓名、简介、语言 Select、时区 Combobox。账号安全：修改密码表单、两步验证 Switch + 二维码占位、活跃会话列表（List + 「注销」按钮）。通知：分组 Switch 列表 + Segmented（邮件/推送/站内）。团队：成员表格（头像、角色 Select、移除）+ 邀请输入。计费：当前计划卡 + 计划对比 3 卡（含推荐 badge）+ 发票表格。底部「危险区」Card（红色边框，删除账号按钮 → 二次确认 Dialog 需输入确认文字）。

### 6. `/components` 组件全集（Kitchen Sink）
**该库导出的每一个组件**都必须出现，按类别分节，每个组件展示全部 variant × size × state（默认/hover 不要求/disabled/loading/error）：
- 排版：标题 h1–h6、正文、Code、Kbd、Blockquote、链接、列表、Divider
- 按钮：所有 variant（primary/secondary/outline/ghost/link/destructive…）× 所有 size × icon-only × loading × disabled × ButtonGroup
- 表单控件：Input（前后缀、清除、密码、搜索）、Textarea、Number、Select、MultiSelect、Combobox、Autocomplete、Checkbox（含 indeterminate）、Radio、Switch、Slider、Rating、DatePicker、TimePicker、ColorPicker、Upload、Cascader、Transfer、Mention、OTP/PinInput、Form 布局（水平/垂直/内联）
- 数据展示：Table、Descriptions、List、Card（多布局）、Avatar（+Group）、Badge、Tag/Chip、Statistic、Timeline、Tree、Calendar、Image（+预览）、Carousel、Empty、Tooltip、Popover、QRCode、Segmented
- 反馈：Alert（4 级）、Toast/Notification（4 级 + 带操作）、Message、Dialog/Modal（普通/确认/全屏/可滚动）、Drawer（4 方向）、Progress（线/环/步骤）、Skeleton、Spinner、Result、Popconfirm
- 导航：Menu（水平/垂直/内嵌/折叠）、Dropdown、Breadcrumb、Tabs（所有变体）、Pagination、Steps、Anchor、BackTop、Affix、Navbar/AppBar、Sidebar、CommandPalette
- 布局：Grid/Row/Col、Flex/Stack、Space、Layout、Container、AspectRatio、Splitter/Resizable、ScrollArea、Collapse/Accordion
- 其他：ConfigProvider/ThemeProvider 的暗色/主色示例、Watermark、Tour/Onboarding、FloatButton、Affix
页面顶部放该库全部组件名的锚点索引；`gallery.json.coverage` 必须逐组件填写 `implemented | composed | missing`。

### 7. `/landing` 营销落地页（移动优先）
Navbar（Logo、5 链接、CTA、移动汉堡菜单）、Hero（标题/副标题/双按钮/产品截图占位 + 头像群「1000+ 团队在用」）、Logo 云（6 个灰度 Logo 占位）、特性网格（6 卡 icon+标题+描述）、产品分屏介绍 ×3（图文交替）、数据带（4 个大数字）、定价 3 卡（月/年 Switch、推荐 badge、功能勾选列表）、用户评价轮播/网格（6 条，头像+姓名+公司）、FAQ Accordion（6 项）、CTA 横幅、Footer（4 列链接 + 社交图标 + 版权 + 语言 Select）。

### 8. `/chat` AI 对话
左侧会话列表（搜索、分组、新建按钮、每项含标题/时间/未读 badge，移动端为抽屉）；主区消息流（用户/助手气泡、头像、时间戳、Markdown 渲染含代码块+复制按钮、表格、引用来源 Chip、流式打字中态、工具调用折叠卡）；底部输入区（多行自增 Textarea、附件按钮、模型 Select、发送按钮、提示 Chip 建议 4 条、字数/快捷键提示）；空态（欢迎标题 + 4 个建议卡片）。

## `gallery.json`（每应用必交）
```json
{
  "slug": "shadcn-ui",
  "name": "shadcn/ui",
  "framework": "react",
  "version": "4.21.0",
  "repo": "shadcn-ui/ui",
  "license": { "github": "MIT", "npm": "MIT" },
  "theme": { "dark": true, "nativeIcons": false },
  "routes": ["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"],
  "coverage": { "Button": "implemented", "Cascader": "missing", "Transfer": "composed" },
  "externals": { "chart": "recharts" },
  "notes": ""
}
```

## 截图矩阵（tools/shoot）
每应用：8 路由 × {1440×900, 375×812} × {light, dark} = 32 张（dark n/a 时 16 张），另加 `/components` 全页长截图 2 张；文件名 `shots/<slug>/<route>__<viewport>__<theme>.png`。画廊按「页面 → 库网格」与「库 → 页面网格」两种视图展示，支持按框架/许可证/图标库/字体筛选。
