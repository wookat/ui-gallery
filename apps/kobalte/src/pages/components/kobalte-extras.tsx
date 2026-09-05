/* eslint-disable */
import { DemoCard, DemoFrame } from "./shared"
import { Button } from "@/ui/button"
import { Checkbox } from "@/ui/checkbox"
import { TextField } from "@/ui/text-field"
import { toast } from "@/ui/toast"

export function KobalteExtrasDemo(props: { name: string; status: string }) {
  if (props.name === "QRCode") return <DemoCard name={props.name} status="missing"><DemoFrame><p class="text-sm text-zinc-500">Kobalte 无此原语，未实现；二维码需要由业务侧接入生成器。</p></DemoFrame></DemoCard>
  if (props.name === "AlertDialog") return <DemoCard name={props.name} status={props.status}><DemoFrame><Button onClick={() => toast.warning("AlertDialog", "确认操作已打开")}>打开 AlertDialog</Button></DemoFrame></DemoCard>
  if (props.name === "Collapsible") return <DemoCard name={props.name} status={props.status}><DemoFrame><details class="rounded border p-3"><summary class="cursor-pointer font-medium">展开 Collapsible</summary><p class="mt-3 text-sm text-zinc-500">可折叠内容。</p></details></DemoFrame></DemoCard>
  if (props.name === "ContextMenu") return <DemoCard name={props.name} status={props.status}><DemoFrame><div onContextMenu={(event) => { event.preventDefault(); toast.info("ContextMenu", "右键菜单已触发") }} class="grid h-24 place-items-center rounded border border-dashed text-sm">在此区域右键</div></DemoFrame></DemoCard>
  if (props.name === "HoverCard") return <DemoCard name={props.name} status={props.status}><DemoFrame><span class="group relative cursor-help underline">悬停查看详情<span class="invisible absolute bottom-full left-0 mb-2 w-48 rounded border bg-white p-3 text-xs opacity-0 shadow transition group-hover:visible group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900">HoverCard 内容</span></span></DemoFrame></DemoCard>
  if (props.name === "Listbox") return <DemoCard name={props.name} status={props.status}><DemoFrame><select multiple class="h-24 rounded border p-2 dark:bg-zinc-900"><option>列表项 A</option><option>列表项 B</option><option>列表项 C</option></select></DemoFrame></DemoCard>
  if (props.name === "Menubar" || props.name === "NavigationMenu") return <DemoCard name={props.name} status={props.status}><DemoFrame><nav class="flex gap-4 rounded border p-3 text-sm"><a href="#component-Menu">产品</a><a href="#component-Navbar">文档</a><a href="#component-CommandPalette">帮助</a></nav></DemoFrame></DemoCard>
  if (props.name === "Meter") return <DemoCard name={props.name} status={props.status}><DemoFrame><label class="grid gap-2 text-sm">存储使用 68%<meter min="0" max="100" value="68" class="h-3 w-full" /></label></DemoFrame></DemoCard>
  if (props.name === "Search") return <DemoCard name={props.name} status={props.status}><DemoFrame><TextField label="搜索原语" placeholder="输入搜索词..." prefix="⌕" /></DemoFrame></DemoCard>
  if (props.name === "ToggleButton" || props.name === "ToggleGroup") return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="flex gap-2"><Button variant="outline" onClick={(event) => (event.currentTarget as HTMLElement).classList.toggle("bg-zinc-200")}>粗体</Button><Button variant="outline">斜体</Button><Button variant="outline">下划线</Button></div></DemoFrame></DemoCard>
  if (props.name === "ColorWheel") return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="size-32 rounded-full bg-[conic-gradient(#ef4444,#f59e0b,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444)] p-5"><div class="size-full rounded-full bg-white dark:bg-zinc-900" /></div></DemoFrame></DemoCard>
  if (props.name === "ColorChannelField") return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="grid max-w-xs gap-2"><TextField label="Red" value="239" type="number" /><TextField label="Green" value="68" type="number" /><TextField label="Blue" value="68" type="number" /></div></DemoFrame></DemoCard>
  if (props.name === "TimeField") return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="flex items-end gap-2"><TextField label="小时 segment" value="09" /><span>:</span><TextField label="分钟 segment" value="30" /></div></DemoFrame></DemoCard>
  return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="flex flex-wrap gap-3"><Checkbox label="原语选项" checked /><Button onClick={() => toast.info(props.name, "已交互")}>测试</Button></div></DemoFrame></DemoCard>
}
