/* eslint-disable */
import { DemoCard, DemoFrame, DemoLabel, IconButton } from "./shared"
import { Button } from "@/ui/button"
import { Icon } from "@/icons"

const variants = ["primary", "secondary", "outline", "ghost", "link", "destructive"] as const
const sizes = ["sm", "md", "lg"] as const

export function ButtonsDemo(props: { name: string; status: string }) {
  if (props.name === "IconButton") return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="grid gap-3 sm:grid-cols-3">{sizes.map((size) => <div class="flex items-center gap-2"><DemoLabel>{size}</DemoLabel><IconButton name="plus" label={`添加 ${size}`} size={size} /><IconButton name="settings" label={`设置 ${size}`} size={size} variant="ghost" /></div>)}</div></DemoFrame></DemoCard>
  if (props.name === "ButtonGroup") return <DemoCard name={props.name} status={props.status}><DemoFrame><DemoLabel>Attached buttons</DemoLabel><div class="mt-2 inline-flex [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none"><Button>列表</Button><Button variant="outline">看板</Button><Button variant="outline">分析</Button></div></DemoFrame></DemoCard>
  return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="min-w-[620px] space-y-4"><DemoLabel>6 variants × 3 sizes</DemoLabel><div class="grid grid-cols-[110px_repeat(3,minmax(120px,1fr))] items-center gap-2">{variants.map((variant) => <><span class="text-xs capitalize">{variant}</span>{sizes.map((size) => <Button variant={variant} size={size}>{variant} {size}</Button>)}</>)}</div><div class="flex flex-wrap gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800"><Button size="icon" aria-label="添加"><Icon name="plus" /></Button><Button loading>Loading</Button><Button disabled>Disabled</Button><Button variant="outline"><Icon name="download" size={15} />导出</Button></div></div></DemoFrame></DemoCard>
}
