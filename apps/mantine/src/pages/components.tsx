import { useState, type ReactNode } from "react"
import {
  Accordion, ActionIcon, Affix, Alert, Anchor, AspectRatio, Autocomplete, Avatar, Badge, Blockquote, Breadcrumbs, Button, Card, Cascader, Center, Checkbox, Chip, Code, Collapse, ColorInput, ColorPicker, Combobox, Container, DataList, Dialog, Divider, Drawer, EmptyState, Fieldset, FileInput, Flex, Grid, Group, HoverCard, Image, Indicator, Input, Kbd, List, Loader, LoadingOverlay, Mark, Menu, Menubar, Modal, MultiSelect, NativeSelect, NavLink, Notification, NumberFormatter, NumberInput, Pagination, Paper, PasswordInput, Pill, PinInput, Popover, Progress, Radio, RangeSlider, Rating, RingProgress, ScrollArea, SegmentedControl, Select, SemiCircleProgress, SimpleGrid, Skeleton, Slider, Space, Splitter, Stack, Stepper, Switch, Table, TableOfContents, Tabs, TagsInput, Text, Textarea, TextInput, ThemeIcon, Timeline, Title, Tooltip, Transition, Tree, TreeSelect, useCombobox, useMantineColorScheme, useTree, type MantineSize, type TreeNodeData,
} from "@mantine/core"
import { Calendar, DatePickerInput, DateTimePicker, TimeInput, TimePicker } from "@mantine/dates"
import { Dropzone } from "@mantine/dropzone"
import { useWindowScroll } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { Spotlight, spotlight } from "@mantine/spotlight"
import { Carousel } from "@mantine/carousel"
import { Icon } from "@ui-gallery/icons-react"
import orders from "@ui-gallery/spec/mock/orders.json"
import team from "@ui-gallery/spec/mock/team.json"
import activity from "@ui-gallery/spec/mock/activity.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import { coverage, type Coverage } from "@/coverage"
import { muted, PageHeader, placeholderBg, StatusBadge, money } from "./shared"

const sizes: MantineSize[] = ["xs", "sm", "md", "lg", "xl"]
const buttonVariants = ["filled", "light", "outline", "subtle", "default", "transparent", "white", "gradient"] as const
const colors = ["blue", "teal", "red", "yellow", "gray"]
const covColor: Record<Coverage, string> = { implemented: "green", composed: "yellow", missing: "red" }
const sections: { id: string; title: string; items: string[] }[] = [
  { id: "typography", title: "排版", items: ["Typography", "Code", "Kbd", "Divider", "Link"] },
  { id: "buttons", title: "按钮", items: ["Button", "ButtonGroup", "IconButton"] },
  { id: "inputs", title: "表单控件", items: ["Input", "Textarea", "NumberInput", "Select", "MultiSelect", "Combobox", "Autocomplete", "Checkbox", "Radio", "Switch", "Slider", "Rating", "DatePicker", "TimePicker", "DateRangePicker", "ColorPicker", "Upload", "Cascader", "Transfer", "Mention", "PinInput", "Form"] },
  { id: "data", title: "数据展示", items: ["Table", "DataGrid", "Descriptions", "List", "Card", "Avatar", "AvatarGroup", "Badge", "Tag", "Statistic", "Timeline", "Tree", "Calendar", "Image", "Carousel", "Empty", "Tooltip", "Popover", "QRCode", "Segmented"] },
  { id: "feedback", title: "反馈", items: ["Alert", "Toast", "Notification", "Dialog", "Drawer", "Progress", "Skeleton", "Spinner", "Result", "Popconfirm"] },
  { id: "navigation", title: "导航", items: ["Menu", "Dropdown", "Breadcrumb", "Tabs", "Pagination", "Steps", "Anchor", "BackTop", "Affix", "Navbar", "Sidebar", "CommandPalette"] },
  { id: "layout", title: "布局", items: ["Grid", "Stack", "Layout", "Container", "AspectRatio", "Resizable", "ScrollArea", "Accordion"] },
  { id: "other", title: "其他", items: ["ThemeProvider", "Watermark", "Tour", "FloatButton"] },
]

function Demo({ name, mantine, children }: { name: string; mantine?: string; children?: ReactNode }) {
  const c = coverage[name]
  return (
    <Card withBorder radius="md" padding="md" id={`c-${name}`} style={{ scrollMarginTop: 80 }}>
      <Group justify="space-between" mb="sm" wrap="wrap">
        <Group gap="xs"><Text fw={600} size="sm">{name}</Text>{mantine ? <Text size="xs" c={muted}>{mantine}</Text> : null}</Group>
        <Badge size="xs" variant="light" color={covColor[c]}>{c}</Badge>
      </Group>
      {c === "missing" ? <Text size="sm" c={muted}>Mantine 未提供对应组件（未引入第三方替代）。</Text> : children}
    </Card>
  )
}

const treeData: TreeNodeData[] = nav.map((n) => ({ value: n.path, label: n.label, children: [{ value: `${n.path}/a`, label: "子项 A" }, { value: `${n.path}/b`, label: "子项 B" }] }))
const cascaderData = [{ value: "cn", label: "中国", children: [{ value: "sh", label: "上海", children: [{ value: "pd", label: "浦东" }] }, { value: "hz", label: "杭州" }] }, { value: "sg", label: "新加坡" }]
const names = team.map((m) => m.name)

function ComboboxDemo() {
  const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() })
  const [value, setValue] = useState<string | null>(null)
  return (
    <Combobox store={combobox} onOptionSubmit={(v) => { setValue(v); combobox.closeDropdown() }}>
      <Combobox.Target><Button variant="default" rightSection={<Icon name="chevron-down" size={14} />} onClick={() => combobox.toggleDropdown()}>{value ?? "选择成员"}</Button></Combobox.Target>
      <Combobox.Dropdown><Combobox.Options>{names.map((n) => <Combobox.Option value={n} key={n}>{n}</Combobox.Option>)}</Combobox.Options></Combobox.Dropdown>
    </Combobox>
  )
}

function TreeDemo() {
  const tree = useTree({ initialExpandedState: { [nav[0].path]: true } })
  return <Tree data={treeData} tree={tree} levelOffset={24} expandOnClick renderNode={({ node, expanded, hasChildren, elementProps }) => <Group gap={6} {...elementProps}>{hasChildren ? <Icon name={expanded ? "chevron-down" : "chevron-right"} size={14} /> : <span style={{ width: 14 }} />}<Text size="sm">{node.label}</Text></Group>} />
}

export function ComponentsPage() {
  const [modal, setModal] = useState<"basic" | "confirm" | "full" | "scroll" | null>(null)
  const [drawer, setDrawer] = useState<"left" | "right" | "top" | "bottom" | null>(null)
  const [dialog, setDialog] = useState(false)
  const [popconfirm, setPopconfirm] = useState(false)
  const [overlay, setOverlay] = useState(false)
  const [scroll, scrollTo] = useWindowScroll()
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const stat = Object.entries(coverage).reduce((acc, [, v]) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {} as Record<string, number>)
  const toast = (color: string, title: string, withAction = false) => notifications.show({ color, title, message: withAction ? "包含操作按钮的通知" : "这是一条通知消息", icon: <Icon name={color === "red" ? "x" : color === "yellow" ? "alert-triangle" : "check"} size={16} />, autoClose: 4000, withCloseButton: true, ...(withAction ? { message: <Group justify="space-between"><Text size="sm">订单已归档</Text><Button size="compact-xs" variant="light" onClick={() => notifications.clean()}>撤销</Button></Group> } : {}) })

  return (
    <Stack gap="xl">
      <PageHeader title="组件全集" description={`Mantine 9 · implemented ${stat.implemented ?? 0} / composed ${stat.composed ?? 0} / missing ${stat.missing ?? 0}`} />

      <Card withBorder radius="md" padding="md">
        <Text size="sm" fw={600} mb="xs">索引</Text>
        <Stack gap="xs">
          {sections.map((s) => (
            <Group key={s.id} gap={6} wrap="wrap">
              <Anchor href={`#${s.id}`} size="sm" fw={600} w={72}>{s.title}</Anchor>
              {s.items.map((i) => <Anchor key={i} href={`#c-${i}`} size="xs" c={covColor[coverage[i]]}>{i}</Anchor>)}
            </Group>
          ))}
        </Stack>
      </Card>

      {/* 排版 */}
      <Stack gap="md" id="typography" style={{ scrollMarginTop: 80 }}>
        <Title order={2} size="h3">排版</Title>
        <Demo name="Typography" mantine="Title / Text / Blockquote / List / Mark / Highlight">
          <Stack gap="xs">
            {([1, 2, 3, 4, 5, 6] as const).map((o) => <Title key={o} order={o}>标题 H{o}</Title>)}
            <Text>正文 Text，默认字号。</Text><Text size="sm" c="dimmed">次要文本 dimmed。</Text><Text fw={700}>加粗</Text><Text td="underline">下划线</Text><Text><Mark>高亮</Mark> 文本</Text>
            <Blockquote cite="— 林晓" icon={<Icon name="message-square" size={16} />}>引用块：把团队的工作放进一个控制台。</Blockquote>
            <List size="sm"><List.Item>无序列表 1</List.Item><List.Item>无序列表 2</List.Item></List>
            <List size="sm" type="ordered"><List.Item>有序列表 1</List.Item><List.Item>有序列表 2</List.Item></List>
          </Stack>
        </Demo>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Demo name="Code" mantine="Code"><Group><Code>npm i @mantine/core</Code><Code color="blue.1" c="blue.9">彩色</Code></Group><Code block mt="sm">{`const x = 1\nconsole.log(x)`}</Code></Demo>
          <Demo name="Kbd" mantine="Kbd"><Group gap="xs">{sizes.map((s) => <Kbd key={s} size={s}>⌘ K</Kbd>)}</Group></Demo>
          <Demo name="Divider" mantine="Divider"><Divider my="xs" /><Divider my="xs" label="带标签" labelPosition="center" /><Divider my="xs" variant="dashed" /><Divider my="xs" variant="dotted" size="md" /><Group h={30}><Text size="sm">A</Text><Divider orientation="vertical" /><Text size="sm">B</Text></Group></Demo>
          <Demo name="Link" mantine="Anchor"><Group>{sizes.map((s) => <Anchor key={s} href="#" size={s}>链接 {s}</Anchor>)}<Anchor href="#" underline="always">总是下划线</Anchor><Anchor href="#" underline="never" c={muted}>无下划线</Anchor></Group></Demo>
        </SimpleGrid>
      </Stack>

      {/* 按钮 */}
      <Stack gap="md" id="buttons" style={{ scrollMarginTop: 80 }}>
        <Title order={2} size="h3">按钮</Title>
        <Demo name="Button" mantine="Button — 8 variant × 5 size × loading/disabled">
          <Stack gap="sm">
            {buttonVariants.map((v) => (
              <Group key={v} gap="xs" wrap="wrap" align="center">
                <Text size="xs" c={muted} w={80}>{v}</Text>
                {sizes.map((s) => <Button key={s} variant={v} size={s} color={v === "white" ? "dark" : undefined} gradient={{ from: "blue", to: "cyan" }}>{s}</Button>)}
                <Button variant={v} loading>加载</Button><Button variant={v} disabled>禁用</Button><Button variant={v} leftSection={<Icon name="plus" size={14} />}>图标</Button>
              </Group>
            ))}
            <Group gap="xs"><Button color="red">destructive</Button><Button color="red" variant="light">light red</Button><Button fullWidth variant="default">fullWidth</Button></Group>
            <Group gap="xs">{["compact-xs", "compact-sm", "compact-md", "compact-lg", "compact-xl"].map((s) => <Button key={s} size={s} variant="light">{s}</Button>)}</Group>
          </Stack>
        </Demo>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Demo name="ButtonGroup" mantine="Button.Group"><Stack gap="sm"><Button.Group><Button variant="default">左</Button><Button variant="default">中</Button><Button variant="default">右</Button></Button.Group><Button.Group orientation="vertical" w={120}><Button variant="light">上</Button><Button variant="light">中</Button><Button variant="light">下</Button></Button.Group></Stack></Demo>
          <Demo name="IconButton" mantine="ActionIcon">
            <Stack gap="xs">
              {buttonVariants.map((v) => <Group key={v} gap="xs">{sizes.map((s) => <ActionIcon key={s} variant={v} size={s} aria-label={v} gradient={{ from: "blue", to: "cyan" }} color={v === "white" ? "dark" : undefined}><Icon name="settings" size={14} /></ActionIcon>)}<ActionIcon variant={v} loading aria-label="loading" /><ActionIcon variant={v} disabled aria-label="disabled"><Icon name="settings" size={14} /></ActionIcon></Group>)}
              <ActionIcon.Group><ActionIcon variant="default" aria-label="a"><Icon name="chevron-left" size={14} /></ActionIcon><ActionIcon variant="default" aria-label="b"><Icon name="chevron-right" size={14} /></ActionIcon></ActionIcon.Group>
            </Stack>
          </Demo>
        </SimpleGrid>
      </Stack>

      {/* 表单控件 */}
      <Stack gap="md" id="inputs" style={{ scrollMarginTop: 80 }}>
        <Title order={2} size="h3">表单控件</Title>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Demo name="Input" mantine="TextInput / PasswordInput / Input">
            <Stack gap="sm">
              {sizes.map((s) => <TextInput key={s} size={s} placeholder={`size ${s}`} />)}
              <TextInput label="前后缀" leftSection={<Icon name="search" size={15} />} rightSection={<Icon name="x" size={15} />} placeholder="搜索" />
              <TextInput label="清除" rightSectionPointerEvents="all" rightSection={<Input.ClearButton />} defaultValue="可清除" />
              <PasswordInput label="密码" defaultValue="secret123" />
              <TextInput label="错误" error="必填项" /><TextInput label="禁用" disabled value="不可编辑" readOnly /><TextInput label="描述" description="帮助文案" withAsterisk />
              <Group grow>{(["default", "filled", "unstyled"] as const).map((v) => <TextInput key={v} variant={v} placeholder={v} />)}</Group>
            </Stack>
          </Demo>
          <Demo name="Textarea" mantine="Textarea"><Stack gap="sm"><Textarea placeholder="默认" /><Textarea autosize minRows={2} maxRows={4} placeholder="自增高" /><Textarea error="过长" defaultValue="错误态" /><Textarea disabled value="禁用" readOnly /><Textarea variant="filled" placeholder="filled" /></Stack></Demo>
          <Demo name="NumberInput" mantine="NumberInput / NumberFormatter"><Stack gap="sm"><NumberInput defaultValue={5} min={0} max={100} /><NumberInput prefix="¥" thousandSeparator defaultValue={128430} decimalScale={2} fixedDecimalScale /><NumberInput suffix=" %" defaultValue={12.4} step={0.1} /><NumberInput error="超出范围" defaultValue={999} /><NumberInput disabled defaultValue={1} /><Text size="sm"><NumberFormatter prefix="$ " value={1000000} thousandSeparator /></Text></Stack></Demo>
          <Demo name="Select" mantine="Select / NativeSelect"><Stack gap="sm">{sizes.map((s) => <Select key={s} size={s} data={names} placeholder={`size ${s}`} searchable />)}<Select data={names} defaultValue={names[0]} clearable label="可清除" /><Select data={names} error="请选择" /><Select data={names} disabled placeholder="禁用" /><NativeSelect data={names} label="原生" /></Stack></Demo>
          <Demo name="MultiSelect" mantine="MultiSelect / TagsInput / PillsInput"><Stack gap="sm"><MultiSelect data={names} defaultValue={names.slice(0, 2)} searchable clearable /><MultiSelect data={names} hidePickedOptions maxValues={3} placeholder="最多 3" /><MultiSelect data={names} error="至少一项" /><MultiSelect data={names} disabled defaultValue={[names[0]]} /><TagsInput defaultValue={["react", "mantine"]} placeholder="标签输入" /></Stack></Demo>
          <Demo name="Combobox" mantine="Combobox (headless)"><ComboboxDemo /></Demo>
          <Demo name="Autocomplete" mantine="Autocomplete"><Stack gap="sm"><Autocomplete data={names} placeholder="输入姓名" /><Autocomplete data={names} error="无匹配" /><Autocomplete data={names} disabled placeholder="禁用" /></Stack></Demo>
          <Demo name="Checkbox" mantine="Checkbox / Checkbox.Group / Checkbox.Card"><Stack gap="sm"><Group>{sizes.map((s) => <Checkbox key={s} size={s} defaultChecked label={s} />)}</Group><Group><Checkbox indeterminate label="半选" /><Checkbox disabled label="禁用" /><Checkbox disabled checked label="禁用已选" readOnly /><Checkbox error="必选" label="错误" /><Checkbox variant="outline" defaultChecked label="outline" /><Checkbox radius="xl" defaultChecked label="圆" /></Group><Checkbox.Group defaultValue={["a"]} label="分组"><Group mt={4}><Checkbox value="a" label="A" /><Checkbox value="b" label="B" /></Group></Checkbox.Group></Stack></Demo>
          <Demo name="Radio" mantine="Radio / Radio.Group"><Stack gap="sm"><Radio.Group defaultValue="a" label="尺寸"><Group mt={4}>{sizes.map((s) => <Radio key={s} value={s} size={s} label={s} />)}</Group></Radio.Group><Group><Radio checked readOnly label="选中" /><Radio disabled label="禁用" /><Radio variant="outline" checked readOnly label="outline" /><Radio error="必选" label="错误" /></Group></Stack></Demo>
          <Demo name="Switch" mantine="Switch"><Stack gap="sm"><Group>{sizes.map((s) => <Switch key={s} size={s} defaultChecked label={s} />)}</Group><Group><Switch label="关闭" /><Switch disabled label="禁用" /><Switch disabled checked readOnly label="禁用开" /><Switch onLabel="ON" offLabel="OFF" size="lg" defaultChecked /><Switch labelPosition="left" label="左标签" /></Group></Stack></Demo>
          <Demo name="Slider" mantine="Slider / RangeSlider"><Stack gap="lg" px="xs">{sizes.map((s) => <Slider key={s} size={s} defaultValue={40} />)}<Slider defaultValue={60} marks={[{ value: 0, label: "0" }, { value: 50, label: "50" }, { value: 100, label: "100" }]} mb="md" /><RangeSlider defaultValue={[20, 80]} minRange={10} /><Slider defaultValue={30} disabled /><Slider defaultValue={70} color="red" labelAlwaysOn /></Stack></Demo>
          <Demo name="Rating" mantine="Rating"><Stack gap="sm">{sizes.map((s) => <Rating key={s} size={s} defaultValue={3} />)}<Rating defaultValue={3.5} fractions={2} /><Rating value={4} readOnly /><Rating count={10} defaultValue={7} color="teal" /></Stack></Demo>
          <Demo name="DatePicker" mantine="@mantine/dates DatePickerInput / DateTimePicker"><Stack gap="sm"><DatePickerInput placeholder="选择日期" leftSection={<Icon name="calendar" size={15} />} /><DateTimePicker placeholder="日期时间" /><DatePickerInput placeholder="错误" error="必填" /><DatePickerInput placeholder="禁用" disabled /><DatePickerInput type="multiple" placeholder="多选" /></Stack></Demo>
          <Demo name="TimePicker" mantine="@mantine/dates TimePicker / TimeInput"><Stack gap="sm"><TimePicker withDropdown withSeconds /><TimeInput defaultValue="09:30" leftSection={<Icon name="clock" size={15} />} /><TimePicker disabled /></Stack></Demo>
          <Demo name="DateRangePicker" mantine="DatePickerInput type=range"><Stack gap="sm"><DatePickerInput type="range" placeholder="日期范围" /><DatePickerInput type="range" defaultValue={["2026-09-01", "2026-09-30"]} clearable /></Stack></Demo>
          <Demo name="ColorPicker" mantine="ColorPicker / ColorInput"><Stack gap="sm"><ColorInput defaultValue="#228be6" format="hex" swatches={["#228be6", "#12b886", "#fa5252", "#fab005"]} /><ColorPicker format="rgba" defaultValue="rgba(34,139,230,1)" swatches={["#228be6", "#12b886", "#fa5252"]} fullWidth /></Stack></Demo>
          <Demo name="Upload" mantine="@mantine/dropzone Dropzone / FileInput"><Stack gap="sm"><FileInput placeholder="选择文件" leftSection={<Icon name="paperclip" size={15} />} clearable /><FileInput multiple placeholder="多文件" /><Dropzone onDrop={() => {}} radius="md" mih={100}><Center h={80}><Group gap="sm" c={muted}><Icon name="upload" size={24} /><Text size="sm">拖拽文件到此处</Text></Group></Center></Dropzone><Dropzone onDrop={() => {}} loading mih={60}><Center h={40}><Text size="sm">上传中</Text></Center></Dropzone><Dropzone onDrop={() => {}} disabled mih={60}><Center h={40}><Text size="sm" c={muted}>禁用</Text></Center></Dropzone></Stack></Demo>
          <Demo name="Cascader" mantine="Cascader / TreeSelect"><Stack gap="sm"><Cascader data={cascaderData} placeholder="选择地区" /><TreeSelect data={treeData} placeholder="树形选择" /><TreeSelect data={treeData} mode="multiple" placeholder="多选树" /></Stack></Demo>
          <Demo name="Transfer" />
          <Demo name="Mention" />
          <Demo name="PinInput" mantine="PinInput"><Stack gap="sm">{sizes.map((s) => <PinInput key={s} size={s} length={4} placeholder="○" />)}<PinInput type="number" length={6} oneTimeCode /><PinInput mask defaultValue="1234" /><PinInput error defaultValue="12" /><PinInput disabled defaultValue="1234" /></Stack></Demo>
          <Demo name="Form" mantine="@mantine/form + Fieldset">
            <Stack gap="md">
              <Fieldset legend="垂直布局"><Stack gap="sm"><TextInput label="姓名" withAsterisk /><TextInput label="邮箱" /></Stack></Fieldset>
              <Fieldset legend="水平布局"><Stack gap="sm">{["姓名", "邮箱"].map((l) => <Group key={l} wrap="nowrap"><Text size="sm" w={60} ta="right">{l}</Text><TextInput style={{ flex: 1 }} /></Group>)}</Stack></Fieldset>
              <Fieldset legend="内联布局"><Group align="flex-end"><TextInput label="关键词" /><Select data={names} label="负责人" /><Button>搜索</Button></Group></Fieldset>
              <Fieldset legend="禁用" disabled><TextInput label="姓名" value="只读" readOnly /></Fieldset>
            </Stack>
          </Demo>
        </SimpleGrid>
      </Stack>

      {/* 数据展示 */}
      <Stack gap="md" id="data" style={{ scrollMarginTop: 80 }}>
        <Title order={2} size="h3">数据展示</Title>
        <Demo name="Table" mantine="Table — striped / highlightOnHover / withTableBorder / captions">
          <Table.ScrollContainer minWidth={600}>
            <Table striped highlightOnHover withTableBorder withColumnBorders stickyHeader>
              <Table.Caption>最近 5 笔订单</Table.Caption>
              <Table.Thead><Table.Tr><Table.Th>订单</Table.Th><Table.Th>客户</Table.Th><Table.Th>状态</Table.Th><Table.Th ta="right">金额</Table.Th></Table.Tr></Table.Thead>
              <Table.Tbody>{orders.slice(0, 5).map((o) => <Table.Tr key={o.id}><Table.Td>{o.id}</Table.Td><Table.Td>{o.customer}</Table.Td><Table.Td><StatusBadge value={o.status} /></Table.Td><Table.Td ta="right">{money(o.amount, o.currency)}</Table.Td></Table.Tr>)}</Table.Tbody>
              <Table.Tfoot><Table.Tr><Table.Th colSpan={3}>合计</Table.Th><Table.Th ta="right">{money(orders.slice(0, 5).reduce((s, o) => s + o.amount, 0))}</Table.Th></Table.Tr></Table.Tfoot>
            </Table>
          </Table.ScrollContainer>
        </Demo>
        <Demo name="DataGrid" mantine="Table + 排序/选择/分页（见 /orders 页）"><Text size="sm" c={muted}>Mantine 核心不含 DataGrid；/orders 页面用 Table + Checkbox + Pagination + Menu 组合实现排序、多选、列开关与分页。</Text><Group mt="sm"><Button component="a" href="/apps/mantine/orders" variant="light" size="xs">查看 /orders</Button></Group></Demo>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Demo name="Descriptions" mantine="DataList"><DataList withDivider labelWidth={80}><DataList.Item><DataList.ItemLabel>订单</DataList.ItemLabel><DataList.ItemValue>{orders[0].id}</DataList.ItemValue></DataList.Item><DataList.Item><DataList.ItemLabel>客户</DataList.ItemLabel><DataList.ItemValue>{orders[0].customer}</DataList.ItemValue></DataList.Item><DataList.Item><DataList.ItemLabel>状态</DataList.ItemLabel><DataList.ItemValue><StatusBadge value={orders[0].status} /></DataList.ItemValue></DataList.Item></DataList><DataList orientation="horizontal" mt="md" labelWidth={80}><DataList.Item><DataList.ItemLabel>渠道</DataList.ItemLabel><DataList.ItemValue>{orders[0].channel}</DataList.ItemValue></DataList.Item><DataList.Item><DataList.ItemLabel>金额</DataList.ItemLabel><DataList.ItemValue>{money(orders[0].amount)}</DataList.ItemValue></DataList.Item></DataList></Demo>
          <Demo name="List" mantine="List / NavLink"><List spacing="xs" size="sm" icon={<ThemeIcon size={20} radius="xl" variant="light"><Icon name="check" size={12} /></ThemeIcon>}>{team.slice(0, 3).map((m) => <List.Item key={m.email}>{m.name} · {m.role}</List.Item>)}</List><Paper withBorder mt="md" p={4}>{team.slice(0, 3).map((m, i) => <NavLink key={m.email} label={m.name} description={m.email} active={i === 0} leftSection={<Avatar size="sm" radius="xl" color="initials" name={m.name}>{m.name.slice(0, 1)}</Avatar>} rightSection={<Badge size="xs" variant="light">{m.role}</Badge>} />)}</Paper></Demo>
          <Demo name="Card" mantine="Card / Paper"><Stack gap="sm"><Card withBorder radius="md" padding="lg"><Card.Section><Image src={null} h={100} fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" alt="占位" bg={placeholderBg} /></Card.Section><Text fw={600} mt="md">图片卡片</Text><Text size="sm" c={muted}>带 Card.Section 与描述文字。</Text><Button fullWidth mt="md" variant="light">操作</Button></Card><Card shadow="sm" radius="md" padding="md"><Group><ThemeIcon variant="light"><Icon name="zap" size={16} /></ThemeIcon><div><Text fw={600} size="sm">横向卡片</Text><Text size="xs" c={muted}>shadow=sm</Text></div></Group></Card><Paper withBorder p="md" radius="md">Paper 容器</Paper></Stack></Demo>
          <Demo name="Avatar" mantine="Avatar / Indicator"><Group>{sizes.map((s) => <Avatar key={s} size={s} radius="xl" color="initials" name={team[0].name}>{team[0].name.slice(0, 1)}</Avatar>)}<Avatar radius="sm" color="blue"><Icon name="user" size={16} /></Avatar><Avatar variant="outline" color="teal">AC</Avatar><Indicator color="green" size={10} offset={4} processing><Avatar radius="xl" color="blue">在</Avatar></Indicator></Group></Demo>
          <Demo name="AvatarGroup" mantine="Avatar.Group"><Avatar.Group spacing="sm">{team.slice(0, 4).map((m) => <Avatar key={m.email} radius="xl" color="initials" name={m.name}>{m.name.slice(0, 1)}</Avatar>)}<Avatar radius="xl">+{team.length - 4}</Avatar></Avatar.Group></Demo>
          <Demo name="Badge" mantine="Badge"><Stack gap="xs">{(["filled", "light", "outline", "dot", "transparent", "default", "white", "gradient"] as const).map((v) => <Group key={v} gap="xs">{sizes.map((s) => <Badge key={s} variant={v} size={s} color={v === "white" ? "dark" : undefined} gradient={{ from: "blue", to: "cyan" }}>{v}</Badge>)}</Group>)}<Group gap="xs">{colors.map((c) => <Badge key={c} color={c} variant="light">{c}</Badge>)}<Badge circle>3</Badge><Badge leftSection={<Icon name="check" size={10} />} rightSection={<Icon name="x" size={10} />}>两侧</Badge></Group></Stack></Demo>
          <Demo name="Tag" mantine="Chip / Pill"><Stack gap="sm"><Group gap="xs">{sizes.map((s) => <Chip key={s} size={s} defaultChecked>{s}</Chip>)}</Group><Group gap="xs"><Chip variant="filled" defaultChecked>filled</Chip><Chip variant="light" defaultChecked>light</Chip><Chip variant="outline" defaultChecked>outline</Chip><Chip disabled>禁用</Chip></Group><Chip.Group multiple defaultValue={["a"]}><Group gap="xs"><Chip value="a">多选 A</Chip><Chip value="b">多选 B</Chip></Group></Chip.Group><Pill.Group>{sizes.map((s) => <Pill key={s} size={s} withRemoveButton>{s}</Pill>)}<Pill disabled>禁用</Pill></Pill.Group></Stack></Demo>
          <Demo name="Statistic" mantine="Text + NumberFormatter + Badge（组合）"><SimpleGrid cols={2}>{stats.slice(0, 2).map((s) => <Paper key={s.label} withBorder p="md" radius="md"><Text size="xs" c={muted} tt="uppercase">{s.label}</Text><Text fz={24} fw={700}><NumberFormatter value={s.value} prefix={s.unit === "CNY" ? "¥" : ""} suffix={s.unit === "%" ? "%" : ""} thousandSeparator /></Text><Badge size="xs" color={s.delta >= 0 ? "green" : "red"} variant="light">{s.delta >= 0 ? "+" : ""}{s.delta}%</Badge></Paper>)}</SimpleGrid></Demo>
          <Demo name="Timeline" mantine="Timeline"><Timeline active={1} bulletSize={22} lineWidth={2}>{activity.slice(0, 4).map((a, i) => <Timeline.Item key={i} bullet={<Icon name="check" size={12} />} title={a.user}><Text size="sm" c={muted}>{a.action}</Text><Text size="xs" mt={4}>{a.time}</Text></Timeline.Item>)}</Timeline></Demo>
          <Demo name="Tree" mantine="Tree + useTree"><TreeDemo /></Demo>
          <Demo name="Calendar" mantine="@mantine/dates Calendar"><Calendar defaultDate="2026-09-01" /></Demo>
          <Demo name="Image" mantine="Image / AspectRatio + Modal 预览"><Stack gap="sm"><Image radius="md" h={120} src={null} fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" alt="占位" bg={placeholderBg} /><Button size="xs" variant="light" onClick={() => setModal("basic")}>预览</Button></Stack></Demo>
          <Demo name="Carousel" mantine="@mantine/carousel"><Carousel withIndicators height={120} slideSize="100%" slideGap="sm" controlSize={40} controlsOffset="md" emblaOptions={{ loop: true }}>{[1, 2, 3, 4].map((i) => <Carousel.Slide key={i}><Center h="100%" px={56} style={{ borderRadius: 8, background: placeholderBg }}><Text>Slide {i}</Text></Center></Carousel.Slide>)}</Carousel></Demo>
          <Demo name="Empty" mantine="EmptyState"><EmptyState icon={<Icon name="inbox" size={28} />} title="暂无数据" description="调整筛选条件后重试"><EmptyState.Actions><Button size="xs">新建</Button></EmptyState.Actions></EmptyState></Demo>
          <Demo name="Tooltip" mantine="Tooltip / HoverCard"><Group>{(["top", "right", "bottom", "left"] as const).map((p) => <Tooltip key={p} label={`位置 ${p}`} position={p} withArrow><Button variant="default" size="xs">{p}</Button></Tooltip>)}<Tooltip label="多行提示文字，可换行显示" multiline w={160}><Button variant="default" size="xs">多行</Button></Tooltip><HoverCard width={220} withArrow><HoverCard.Target><Button variant="default" size="xs">HoverCard</Button></HoverCard.Target><HoverCard.Dropdown><Text size="sm">悬停显示更多内容。</Text></HoverCard.Dropdown></HoverCard></Group></Demo>
          <Demo name="Popover" mantine="Popover"><Popover width={220} position="bottom" withArrow shadow="md"><Popover.Target><Button variant="default" size="xs">打开 Popover</Button></Popover.Target><Popover.Dropdown><Text size="sm">Popover 内容，可放任意元素。</Text><TextInput mt="xs" size="xs" placeholder="输入" /></Popover.Dropdown></Popover></Demo>
          <Demo name="QRCode" />
          <Demo name="Segmented" mantine="SegmentedControl"><Stack gap="sm">{sizes.map((s) => <SegmentedControl key={s} size={s} data={["日", "周", "月"]} />)}<SegmentedControl data={["A", "B", "C"]} disabled /><SegmentedControl orientation="vertical" data={["上", "中", "下"]} /><SegmentedControl fullWidth color="blue" data={["全宽", "彩色"]} /></Stack></Demo>
        </SimpleGrid>
      </Stack>

      {/* 反馈 */}
      <Stack gap="md" id="feedback" style={{ scrollMarginTop: 80 }}>
        <Title order={2} size="h3">反馈</Title>
        <Demo name="Alert" mantine="Alert — 4 级 × 4 variant"><Stack gap="sm">{[["blue", "信息", "info"], ["green", "成功", "check"], ["yellow", "警告", "alert-triangle"], ["red", "错误", "alert-circle"]].map(([c, t, i]) => <SimpleGrid key={c} cols={{ base: 1, sm: 2, lg: 4 }}>{(["light", "filled", "outline", "white"] as const).map((v) => <Alert key={v} color={c} variant={v} title={`${t} · ${v}`} icon={<Icon name={i} size={16} />} withCloseButton={v === "light"}>提示内容。</Alert>)}</SimpleGrid>)}</Stack></Demo>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Demo name="Toast" mantine="@mantine/notifications"><Group gap="xs"><Button size="xs" color="blue" onClick={() => toast("blue", "信息")}>info</Button><Button size="xs" color="green" onClick={() => toast("green", "成功")}>success</Button><Button size="xs" color="yellow" onClick={() => toast("yellow", "警告")}>warning</Button><Button size="xs" color="red" onClick={() => toast("red", "错误")}>error</Button><Button size="xs" variant="default" onClick={() => toast("teal", "带操作", true)}>带操作</Button><Button size="xs" variant="default" onClick={() => { const id = notifications.show({ loading: true, title: "处理中", message: "请稍候", autoClose: false }); setTimeout(() => notifications.update({ id, loading: false, color: "teal", title: "完成", message: "已处理", autoClose: 2000 }), 1500) }}>loading→done</Button></Group></Demo>
          <Demo name="Notification" mantine="Notification（静态）"><Stack gap="sm">{[["blue", "信息"], ["green", "成功"], ["yellow", "警告"], ["red", "错误"]].map(([c, t]) => <Notification key={c} color={c} title={t} withBorder>通知内容 · {t}</Notification>)}<Notification loading title="加载中" withCloseButton={false}>正在同步...</Notification></Stack></Demo>
          <Demo name="Dialog" mantine="Modal / modals.openConfirmModal / Dialog"><Group gap="xs"><Button size="xs" variant="default" onClick={() => setModal("basic")}>普通</Button><Button size="xs" variant="default" onClick={() => modals.openConfirmModal({ title: "确认操作", children: <Text size="sm">确定要继续吗？</Text>, labels: { confirm: "确定", cancel: "取消" }, confirmProps: { color: "red" } })}>确认</Button><Button size="xs" variant="default" onClick={() => setModal("full")}>全屏</Button><Button size="xs" variant="default" onClick={() => setModal("scroll")}>可滚动</Button><Button size="xs" variant="default" onClick={() => setDialog((v) => !v)}>Dialog</Button></Group></Demo>
          <Demo name="Drawer" mantine="Drawer — 4 方向"><Group gap="xs">{(["left", "right", "top", "bottom"] as const).map((p) => <Button key={p} size="xs" variant="default" onClick={() => setDrawer(p)}>{p}</Button>)}</Group></Demo>
          <Demo name="Progress" mantine="Progress / RingProgress / SemiCircleProgress / Stepper"><Stack gap="sm">{sizes.map((s) => <Progress key={s} size={s} value={40 + sizes.indexOf(s) * 10} />)}<Progress value={70} striped animated color="teal" /><Progress.Root size="xl"><Progress.Section value={35} color="cyan"><Progress.Label>Web</Progress.Label></Progress.Section><Progress.Section value={28} color="pink"><Progress.Label>iOS</Progress.Label></Progress.Section><Progress.Section value={15} color="orange"><Progress.Label>API</Progress.Label></Progress.Section></Progress.Root><Group><RingProgress size={90} thickness={8} sections={[{ value: 40, color: "blue" }, { value: 25, color: "teal" }]} label={<Text ta="center" size="xs">65%</Text>} /><SemiCircleProgress value={62} label="62%" size={120} /></Group><Stepper active={1} size="xs"><Stepper.Step label="第一步" /><Stepper.Step label="第二步" /><Stepper.Step label="第三步" /></Stepper></Stack></Demo>
          <Demo name="Skeleton" mantine="Skeleton"><Group align="flex-start"><Skeleton height={50} circle /><Stack gap="xs" style={{ flex: 1 }}><Skeleton height={12} radius="xl" /><Skeleton height={12} radius="xl" width="70%" /><Skeleton height={80} radius="md" /></Stack></Group></Demo>
          <Demo name="Spinner" mantine="Loader / LoadingOverlay"><Stack gap="sm"><Group>{sizes.map((s) => <Loader key={s} size={s} />)}</Group><Group><Loader type="bars" /><Loader type="dots" /><Loader color="teal" /></Group><Button size="xs" variant="default" onClick={() => { setOverlay(true); setTimeout(() => setOverlay(false), 1500) }}>LoadingOverlay</Button><Paper withBorder p="md" pos="relative" h={80}><LoadingOverlay visible={overlay} /><Text size="sm">被遮罩的内容</Text></Paper></Stack></Demo>
          <Demo name="Result" mantine="ThemeIcon + Title + Text + Button（组合）"><Stack align="center" gap="xs" py="sm"><ThemeIcon size={48} radius="xl" color="teal" variant="light"><Icon name="check" size={24} /></ThemeIcon><Title order={4}>操作成功</Title><Text size="sm" c={muted}>项目已创建。</Text><Group><Button size="xs" variant="default">返回</Button><Button size="xs">继续</Button></Group></Stack></Demo>
          <Demo name="Popconfirm" mantine="Popover + Button（组合）"><Group><Popover opened={popconfirm} onChange={setPopconfirm} width={220} withArrow position="top"><Popover.Target><Button size="xs" color="red" variant="light" onClick={() => setPopconfirm((v) => !v)}>删除</Button></Popover.Target><Popover.Dropdown><Group gap="xs" wrap="nowrap" align="flex-start"><Icon name="alert-circle" size={16} /><Text size="sm">确定删除此项？</Text></Group><Group justify="flex-end" gap="xs" mt="sm"><Button size="compact-xs" variant="default" onClick={() => setPopconfirm(false)}>取消</Button><Button size="compact-xs" color="red" onClick={() => { setPopconfirm(false); toast("red", "已删除") }}>确定</Button></Group></Popover.Dropdown></Popover></Group></Demo>
        </SimpleGrid>
      </Stack>

      {/* 导航 */}
      <Stack gap="md" id="navigation" style={{ scrollMarginTop: 80 }}>
        <Title order={2} size="h3">导航</Title>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Demo name="Menu" mantine="Menu / NavLink（垂直、内嵌、折叠）"><Group align="flex-start" wrap="wrap"><Menu shadow="md" width={200}><Menu.Target><Button variant="default" size="xs">Menu</Button></Menu.Target><Menu.Dropdown><Menu.Label>应用</Menu.Label><Menu.Item leftSection={<Icon name="settings" size={14} />}>设置</Menu.Item><Menu.Item leftSection={<Icon name="bell" size={14} />} rightSection={<Kbd size="xs">⌘K</Kbd>}>通知</Menu.Item><Menu.Sub><Menu.Sub.Target><Menu.Sub.Item>更多</Menu.Sub.Item></Menu.Sub.Target><Menu.Sub.Dropdown><Menu.Item>子项 A</Menu.Item><Menu.Item>子项 B</Menu.Item></Menu.Sub.Dropdown></Menu.Sub><Menu.Divider /><Menu.Item color="red" leftSection={<Icon name="trash" size={14} />}>删除</Menu.Item><Menu.Item disabled>禁用</Menu.Item></Menu.Dropdown></Menu><Paper withBorder w={200} p={4}>{nav.slice(0, 3).map((n, i) => <NavLink key={n.path} label={n.label} leftSection={<Icon name={n.icon} size={15} />} childrenOffset={28} defaultOpened={i === 0} active={i === 0}><NavLink label="子菜单 1" /><NavLink label="子菜单 2" /></NavLink>)}</Paper></Group></Demo>
          <Demo name="Dropdown" mantine="Menubar（水平菜单栏）"><Menubar>{["文件", "编辑", "视图"].map((m) => <Menubar.Menu key={m}><Menubar.Target><Button variant="subtle" size="xs" color="gray">{m}</Button></Menubar.Target><Menubar.Dropdown><Menu.Item>新建</Menu.Item><Menu.Item>打开</Menu.Item><Menu.Divider /><Menu.Item>退出</Menu.Item></Menubar.Dropdown></Menubar.Menu>)}</Menubar></Demo>
          <Demo name="Breadcrumb" mantine="Breadcrumbs"><Stack gap="sm"><Breadcrumbs>{["首页", "订单", orders[0].id].map((b, i) => <Anchor key={b} size="sm" href="#" c={i === 2 ? muted : undefined}>{b}</Anchor>)}</Breadcrumbs><Breadcrumbs separator={<Icon name="chevron-right" size={12} />} separatorMargin="xs"><Anchor size="sm" href="#"><Icon name="home" size={14} /></Anchor><Anchor size="sm" href="#">设置</Anchor><Text size="sm">团队</Text></Breadcrumbs></Stack></Demo>
          <Demo name="Tabs" mantine="Tabs — default / outline / pills / vertical"><Stack gap="md">{(["default", "outline", "pills"] as const).map((v) => <Tabs key={v} variant={v} defaultValue="a"><Tabs.List><Tabs.Tab value="a" leftSection={<Icon name="home" size={14} />}>{v}</Tabs.Tab><Tabs.Tab value="b">第二</Tabs.Tab><Tabs.Tab value="c" disabled>禁用</Tabs.Tab></Tabs.List></Tabs>)}<Tabs orientation="vertical" defaultValue="a" h={80}><Tabs.List><Tabs.Tab value="a">垂直 A</Tabs.Tab><Tabs.Tab value="b">垂直 B</Tabs.Tab></Tabs.List><Tabs.Panel value="a" pl="md"><Text size="sm">面板 A</Text></Tabs.Panel><Tabs.Panel value="b" pl="md"><Text size="sm">面板 B</Text></Tabs.Panel></Tabs><Tabs defaultValue="a" inverted><Tabs.Panel value="a" pb="xs"><Text size="sm">inverted</Text></Tabs.Panel><Tabs.List grow><Tabs.Tab value="a">A</Tabs.Tab><Tabs.Tab value="b">B</Tabs.Tab></Tabs.List></Tabs></Stack></Demo>
          <Demo name="Pagination" mantine="Pagination"><Stack gap="sm">{sizes.map((s) => <Pagination key={s} size={s} total={10} defaultValue={3} />)}<Pagination total={20} siblings={2} boundaries={2} withEdges /><Pagination total={5} disabled /><Pagination.Root total={10}><Group gap={4}><Pagination.First /><Pagination.Previous /><Pagination.Items /><Pagination.Next /><Pagination.Last /></Group></Pagination.Root></Stack></Demo>
          <Demo name="Steps" mantine="Stepper"><Stack gap="lg"><Stepper active={1} size="sm"><Stepper.Step label="账户" description="创建账户" /><Stepper.Step label="验证" description="验证邮箱" loading /><Stepper.Step label="完成" description="开始使用" /></Stepper><Stepper active={2} size="xs" iconSize={28} color="teal"><Stepper.Step icon={<Icon name="user" size={14} />} /><Stepper.Step icon={<Icon name="send" size={14} />} /><Stepper.Step icon={<Icon name="check" size={14} />} /></Stepper><Stepper active={1} orientation="vertical" size="xs"><Stepper.Step label="步骤 1" /><Stepper.Step label="步骤 2" /><Stepper.Step label="步骤 3" /></Stepper></Stack></Demo>
          <Demo name="Anchor" mantine="TableOfContents（scroll spy）"><TableOfContents variant="light" size="sm" radius="sm" scrollSpyOptions={{ selector: "h2" }} getControlProps={({ data }) => ({ onClick: () => data.getNode().scrollIntoView(), children: data.value })} /></Demo>
          <Demo name="BackTop" mantine="Affix + Transition + useWindowScroll（组合）"><Text size="sm" c={muted}>向下滚动后右下角出现「回到顶部」按钮。</Text></Demo>
          <Demo name="Affix" mantine="Affix"><Text size="sm" c={muted}>Affix 固定定位：右下角悬浮按钮即为 Affix 渲染。</Text></Demo>
          <Demo name="Navbar" mantine="AppShell.Header（见页面顶栏）"><Paper withBorder p="xs"><Group justify="space-between"><Group gap="xs"><ThemeIcon size="sm" radius="md"><Text size="xs" fw={700}>A</Text></ThemeIcon><Text size="sm" fw={600}>Acme</Text></Group><Group gap="xs">{nav.slice(0, 3).map((n) => <Button key={n.path} size="compact-xs" variant="subtle" color="gray">{n.label}</Button>)}</Group></Group></Paper></Demo>
          <Demo name="Sidebar" mantine="AppShell.Navbar + NavLink（见页面侧栏）"><Paper withBorder p={4} w={200}>{nav.slice(0, 4).map((n, i) => <NavLink key={n.path} label={n.label} leftSection={<Icon name={n.icon} size={15} />} active={i === 0} />)}</Paper></Demo>
          <Demo name="CommandPalette" mantine="@mantine/spotlight"><Button size="xs" variant="default" leftSection={<Icon name="search" size={14} />} rightSection={<Kbd size="xs">⌘K</Kbd>} onClick={spotlight.open}>打开命令面板</Button></Demo>
        </SimpleGrid>
      </Stack>

      {/* 布局 */}
      <Stack gap="md" id="layout" style={{ scrollMarginTop: 80 }}>
        <Title order={2} size="h3">布局</Title>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Demo name="Grid" mantine="Grid / SimpleGrid"><Grid gap="xs">{[12, 6, 6, 4, 4, 4, 3, 3, 3, 3].map((span, i) => <Grid.Col key={i} span={{ base: 12, xs: span }}><Center h={32} bg={placeholderBg} style={{ borderRadius: 4 }}><Text size="xs">{span}</Text></Center></Grid.Col>)}</Grid></Demo>
          <Demo name="Stack" mantine="Stack / Group / Flex / Space"><Stack gap="xs">{[1, 2].map((i) => <Center key={i} h={28} bg={placeholderBg} style={{ borderRadius: 4 }}><Text size="xs">Stack {i}</Text></Center>)}</Stack><Space h="md" /><Group grow>{[1, 2, 3].map((i) => <Center key={i} h={28} bg={placeholderBg} style={{ borderRadius: 4 }}><Text size="xs">Group {i}</Text></Center>)}</Group><Space h="md" /><Flex gap="xs" wrap="wrap" justify="space-between">{[1, 2, 3].map((i) => <Center key={i} h={28} w={80} bg={placeholderBg} style={{ borderRadius: 4 }}><Text size="xs">Flex {i}</Text></Center>)}</Flex></Demo>
          <Demo name="Layout" mantine="AppShell（本页外层即 AppShell）"><Paper withBorder h={140} style={{ overflow: "hidden" }}><Stack gap={0} h="100%"><Center h={28} bg={placeholderBg}><Text size="xs">Header</Text></Center><Flex h={112}><Center w={60} bg={placeholderBg}><Text size="xs">Nav</Text></Center><Center style={{ flex: 1 }}><Text size="xs">Main</Text></Center></Flex></Stack></Paper></Demo>
          <Demo name="Container" mantine="Container"><Stack gap="xs">{(["xs", "sm", "md"] as const).map((s) => <Container key={s} size={s} w="100%" px={0}><Center h={28} bg={placeholderBg} style={{ borderRadius: 4 }}><Text size="xs">Container {s}</Text></Center></Container>)}</Stack></Demo>
          <Demo name="AspectRatio" mantine="AspectRatio"><Group grow><AspectRatio ratio={16 / 9}><Center bg={placeholderBg} style={{ borderRadius: 8 }}><Text size="xs">16:9</Text></Center></AspectRatio><AspectRatio ratio={1}><Center bg={placeholderBg} style={{ borderRadius: 8 }}><Text size="xs">1:1</Text></Center></AspectRatio></Group></Demo>
          <Demo name="Resizable" mantine="Splitter"><Splitter style={{ height: 120 }}><Splitter.Pane defaultSize="50%" min="20%"><Center h="100%" bg={placeholderBg}><Text size="xs">左侧面板</Text></Center></Splitter.Pane><Splitter.Pane defaultSize="50%" min="20%"><Center h="100%"><Text size="xs">右侧面板</Text></Center></Splitter.Pane></Splitter></Demo>
          <Demo name="ScrollArea" mantine="ScrollArea"><ScrollArea h={120} type="always" offsetScrollbars><Stack gap="xs">{orders.slice(0, 12).map((o) => <Text key={o.id} size="sm">{o.id} · {o.customer}</Text>)}</Stack></ScrollArea></Demo>
          <Demo name="Accordion" mantine="Accordion / Collapse"><Stack gap="sm">{(["default", "contained", "filled", "separated"] as const).map((v) => <Accordion key={v} variant={v} defaultValue="a"><Accordion.Item value="a"><Accordion.Control icon={<Icon name="info" size={14} />}>{v} 面板</Accordion.Control><Accordion.Panel><Text size="sm">内容</Text></Accordion.Panel></Accordion.Item><Accordion.Item value="b"><Accordion.Control>第二项</Accordion.Control><Accordion.Panel><Text size="sm">内容 2</Text></Accordion.Panel></Accordion.Item></Accordion>)}<Collapse expanded><Text size="sm" c={muted}>Collapse 已展开</Text></Collapse></Stack></Demo>
        </SimpleGrid>
      </Stack>

      {/* 其他 */}
      <Stack gap="md" id="other" style={{ scrollMarginTop: 80 }}>
        <Title order={2} size="h3">其他</Title>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Demo name="ThemeProvider" mantine="MantineProvider / useMantineColorScheme"><Group><SegmentedControl value={colorScheme} onChange={(v) => setColorScheme(v as "light" | "dark" | "auto")} data={[{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }, { value: "auto", label: "自动" }]} /><Group gap={4}>{colors.map((c) => <Button key={c} size="compact-xs" color={c}>{c}</Button>)}</Group></Group><Text size="xs" c={muted} mt="sm">默认主题：primaryColor blue，未自定义配色；URL ?theme= 控制初始 colorScheme。</Text></Demo>
          <Demo name="Watermark" />
          <Demo name="Tour" />
          <Demo name="FloatButton" mantine="Affix + ActionIcon（组合）"><Text size="sm" c={muted}>右下角固定的圆形操作按钮（Affix 渲染）。</Text></Demo>
        </SimpleGrid>
      </Stack>

      <Modal opened={modal === "basic"} onClose={() => setModal(null)} title="普通对话框" centered><Text size="sm">这是一个普通 Modal。</Text><Group justify="flex-end" mt="md"><Button variant="default" onClick={() => setModal(null)}>关闭</Button></Group></Modal>
      <Modal opened={modal === "full"} onClose={() => setModal(null)} title="全屏对话框" fullScreen><Text size="sm">fullScreen Modal。</Text></Modal>
      <Modal opened={modal === "scroll"} onClose={() => setModal(null)} title="可滚动对话框" scrollAreaComponent={ScrollArea.Autosize}><Stack>{orders.slice(0, 30).map((o) => <Text key={o.id} size="sm">{o.id} · {o.customer} · {money(o.amount)}</Text>)}</Stack></Modal>
      <Dialog opened={dialog} withCloseButton onClose={() => setDialog(false)} size="lg" radius="md"><Text size="sm" fw={500} mb="xs">非阻塞 Dialog</Text><Group align="flex-end"><TextInput placeholder="you@example.com" style={{ flex: 1 }} /><Button size="sm" onClick={() => setDialog(false)}>订阅</Button></Group></Dialog>
      <Drawer opened={!!drawer} onClose={() => setDrawer(null)} position={drawer ?? "right"} title={`Drawer · ${drawer}`}><Text size="sm">Drawer 内容。</Text></Drawer>
      <Spotlight actions={nav.map((n) => ({ id: n.path, label: n.label, description: n.path, leftSection: <Icon name={n.icon} size={16} />, onClick: () => { window.location.href = `/apps/mantine${n.path}` } }))} nothingFound="无结果" highlightQuery searchProps={{ leftSection: <Icon name="search" size={16} />, placeholder: "搜索页面..." }} />
      <Affix position={{ bottom: 20, right: 20 }}>
        <Stack gap="xs" align="flex-end">
          <Transition transition="slide-up" mounted={scroll.y > 200}>{(style) => <Button leftSection={<Icon name="arrow-up" size={14} />} style={style} size="xs" variant="default" onClick={() => scrollTo({ y: 0 })}>回到顶部</Button>}</Transition>
          <ActionIcon size="xl" radius="xl" aria-label="新建" onClick={() => toast("blue", "FloatButton")}><Icon name="plus" size={20} /></ActionIcon>
        </Stack>
      </Affix>
    </Stack>
  )
}
