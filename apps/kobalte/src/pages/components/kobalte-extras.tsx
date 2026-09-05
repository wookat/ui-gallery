import { For } from "solid-js";
import { AlertDialog } from "@kobalte/core/alert-dialog"
import { Collapsible } from "@kobalte/core/collapsible"
import { ContextMenu } from "@kobalte/core/context-menu"
import { HoverCard } from "@kobalte/core/hover-card"
import { Listbox } from "@kobalte/core/listbox"
import { Menubar } from "@kobalte/core/menubar"
import { Meter } from "@kobalte/core/meter"
import { NavigationMenu } from "@kobalte/core/navigation-menu"
import { Search } from "@kobalte/core/search"
import { ToggleButton } from "@kobalte/core/toggle-button"
import { ToggleGroup } from "@kobalte/core/toggle-group"
import { ColorWheel } from "@kobalte/core/color-wheel"
import { ColorChannelField } from "@kobalte/core/color-channel-field"
import { ColorPicker, defaultColor } from "@/ui/color"
import { TimeField } from "@/ui/time-field"
import { Button } from "@/ui/button"
import { DemoCard, DemoFrame } from "./shared"

const listOptions = ["选项 A", "选项 B", "选项 C"]
const menuItems = ["新建", "打开", "导出"]

function MenuItems() {
  return <><For each={menuItems}>{(item) => <Menubar.Item class="rounded px-3 py-1.5 text-sm data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800">{item}</Menubar.Item>}</For></>
}

function renderExtras(name: string, status: string) {
  if (name === "QRCode") return <DemoCard name={name} status="missing"><DemoFrame><p class="text-sm text-zinc-500 dark:text-zinc-400">Kobalte 无此原语，未实现；二维码需要由业务侧接入生成器。</p></DemoFrame></DemoCard>
  if (name === "AlertDialog") return <DemoCard name={name} status={status}><DemoFrame><AlertDialog><AlertDialog.Trigger as={Button}>打开 AlertDialog</AlertDialog.Trigger><AlertDialog.Portal><AlertDialog.Overlay class="fixed inset-0 z-40 bg-black/40" /><AlertDialog.Content class="fixed left-1/2 top-1/2 z-50 w-[min(90vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900"><AlertDialog.Title class="text-lg font-semibold">确认操作</AlertDialog.Title><AlertDialog.Description class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">此操作需要确认。</AlertDialog.Description><AlertDialog.CloseButton class="mt-5 rounded-md bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">关闭</AlertDialog.CloseButton></AlertDialog.Content></AlertDialog.Portal></AlertDialog></DemoFrame></DemoCard>
  if (name === "Collapsible") return <DemoCard name={name} status={status}><DemoFrame><Collapsible><Collapsible.Trigger class="rounded border px-3 py-2 text-sm">展开 Collapsible</Collapsible.Trigger><Collapsible.Content class="mt-3 text-sm text-zinc-500 dark:text-zinc-400">可折叠内容。</Collapsible.Content></Collapsible></DemoFrame></DemoCard>
  if (name === "ContextMenu") return <DemoCard name={name} status={status}><DemoFrame><ContextMenu><ContextMenu.Trigger class="grid h-24 w-full place-items-center rounded border border-dashed text-sm">在此区域右键</ContextMenu.Trigger><ContextMenu.Portal><ContextMenu.Content class="z-50 min-w-40 rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><For each={menuItems}>{(item) => <ContextMenu.Item class="rounded px-3 py-2 text-sm data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800">{item}</ContextMenu.Item>}</For></ContextMenu.Content></ContextMenu.Portal></ContextMenu></DemoFrame></DemoCard>
  if (name === "HoverCard") return <DemoCard name={name} status={status}><DemoFrame><HoverCard><HoverCard.Trigger class="underline">悬停查看详情</HoverCard.Trigger><HoverCard.Portal><HoverCard.Content class="z-50 w-48 rounded border border-zinc-200 bg-white p-3 text-xs shadow-lg dark:border-zinc-700 dark:bg-zinc-900">HoverCard 内容</HoverCard.Content></HoverCard.Portal></HoverCard></DemoFrame></DemoCard>
  if (name === "Listbox") return <DemoCard name={name} status={status}><DemoFrame><Listbox options={listOptions} optionValue={(option) => option} optionTextValue={(option) => option} defaultValue={["选项 A"]} selectionMode="multiple" class="w-48 rounded border p-1" renderItem={(option) => <Listbox.Item item={option} class="flex items-center justify-between rounded px-3 py-2 text-sm data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800"><Listbox.ItemLabel>{option.rawValue}</Listbox.ItemLabel><Listbox.ItemIndicator>✓</Listbox.ItemIndicator></Listbox.Item>} /></DemoFrame></DemoCard>
  if (name === "Menubar") return <DemoCard name={name} status={status}><DemoFrame><Menubar class="flex gap-1 rounded border p-1"><Menubar.Menu><Menubar.Trigger class="rounded px-3 py-1.5 text-sm data-[expanded]:bg-zinc-100 dark:data-[expanded]:bg-zinc-800">文件</Menubar.Trigger><Menubar.Portal><Menubar.Content class="z-50 rounded-md border bg-white p-1 shadow-lg dark:bg-zinc-900"><MenuItems /></Menubar.Content></Menubar.Portal></Menubar.Menu><Menubar.Menu><Menubar.Trigger class="rounded px-3 py-1.5 text-sm data-[expanded]:bg-zinc-100 dark:data-[expanded]:bg-zinc-800">编辑</Menubar.Trigger><Menubar.Portal><Menubar.Content class="z-50 rounded-md border bg-white p-1 shadow-lg dark:bg-zinc-900"><MenuItems /></Menubar.Content></Menubar.Portal></Menubar.Menu></Menubar></DemoFrame></DemoCard>
  if (name === "NavigationMenu") return <DemoCard name={name} status={status}><DemoFrame><NavigationMenu class="flex gap-4"><NavigationMenu.Menu><NavigationMenu.Trigger class="text-sm">产品</NavigationMenu.Trigger><NavigationMenu.Portal><NavigationMenu.Content class="z-50 rounded-md border bg-white p-3 shadow-lg dark:bg-zinc-900"><NavigationMenu.Item as="a" href="#component-Button">按钮</NavigationMenu.Item><NavigationMenu.Item as="a" href="#component-Input">输入框</NavigationMenu.Item></NavigationMenu.Content></NavigationMenu.Portal></NavigationMenu.Menu><NavigationMenu.Menu><NavigationMenu.Trigger class="text-sm">文档</NavigationMenu.Trigger><NavigationMenu.Portal><NavigationMenu.Content class="z-50 rounded-md border bg-white p-3 shadow-lg dark:bg-zinc-900"><NavigationMenu.Item as="a" href="#component-Form">表单</NavigationMenu.Item><NavigationMenu.Item as="a" href="#component-Table">表格</NavigationMenu.Item></NavigationMenu.Content></NavigationMenu.Portal></NavigationMenu.Menu></NavigationMenu></DemoFrame></DemoCard>
  if (name === "Meter") return <DemoCard name={name} status={status}><DemoFrame><Meter value={68} minValue={0} maxValue={100} class="grid gap-2"><div class="flex justify-between text-sm"><Meter.Label>存储使用</Meter.Label><Meter.ValueLabel /></div><Meter.Track class="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"><Meter.Fill class="h-full rounded-full bg-blue-600" /></Meter.Track></Meter></DemoFrame></DemoCard>
  if (name === "Search") return <DemoCard name={name} status={status}><DemoFrame><Search options={listOptions} optionValue={(option) => option} optionTextValue={(option) => option}><Search.Control class="flex h-9 items-center gap-2 rounded border px-3"><Search.Indicator /><Search.Input class="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="输入搜索词..." /><Search.Icon /></Search.Control><Search.Portal><Search.Content class="z-50 mt-1 rounded border bg-white p-1 shadow-lg dark:bg-zinc-900"><Search.Listbox /></Search.Content></Search.Portal></Search></DemoFrame></DemoCard>
  if (name === "ToggleButton") return <DemoCard name={name} status={status}><DemoFrame><ToggleButton class="rounded border px-3 py-2 text-sm data-[pressed]:bg-zinc-200 dark:data-[pressed]:bg-zinc-800">粗体</ToggleButton></DemoFrame></DemoCard>
  if (name === "ToggleGroup") return <DemoCard name={name} status={status}><DemoFrame><ToggleGroup multiple defaultValue={["bold"]} class="flex gap-2"><ToggleGroup.Item value="bold" class="rounded border px-3 py-2 text-sm data-[pressed]:bg-zinc-200 dark:data-[pressed]:bg-zinc-800">粗体</ToggleGroup.Item><ToggleGroup.Item value="italic" class="rounded border px-3 py-2 text-sm data-[pressed]:bg-zinc-200 dark:data-[pressed]:bg-zinc-800">斜体</ToggleGroup.Item><ToggleGroup.Item value="underline" class="rounded border px-3 py-2 text-sm data-[pressed]:bg-zinc-200 dark:data-[pressed]:bg-zinc-800">下划线</ToggleGroup.Item></ToggleGroup></DemoFrame></DemoCard>
  if (name === "ColorWheel") return <DemoCard name={name} status={status}><DemoFrame><ColorWheel value={defaultColor} class="relative size-36"><ColorWheel.Track class="absolute inset-0 rounded-full bg-[conic-gradient(#ef4444,#f59e0b,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444)]" /><ColorWheel.Thumb class="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-zinc-900" /><ColorWheel.Input /></ColorWheel></DemoFrame></DemoCard>
  if (name === "ColorChannelField") return <DemoCard name={name} status={status}><DemoFrame><div class="grid max-w-xs gap-2"><For each={["red", "green", "blue"] as const}>{(channel) => <ColorChannelField channel={channel} value={defaultColor}><ColorChannelField.Label class="text-sm capitalize">{channel}</ColorChannelField.Label><ColorChannelField.Input class="h-9 rounded border px-2 text-sm dark:bg-zinc-900" /></ColorChannelField>}</For></div></DemoFrame></DemoCard>
  if (name === "TimeField") return <DemoCard name={name} status={status}><DemoFrame><TimeField label="时间" /></DemoFrame></DemoCard>
  return <DemoCard name={name} status={status}><DemoFrame><ColorPicker /></DemoFrame></DemoCard>
}

export function KobalteExtrasDemo(props: { name: string; status: string }) {
  return <>{renderExtras(props.name, props.status)}</>
}
