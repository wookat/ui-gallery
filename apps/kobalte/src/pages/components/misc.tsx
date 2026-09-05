/* eslint-disable */
import { createSignal } from "solid-js"
import { DemoCard, DemoFrame } from "./shared"
import { Button } from "@/ui/button"
import { Icon } from "@/icons"
import { toast } from "@/ui/toast"

export function MiscDemo(props: { name: string; status: string }) {
  const [step, setStep] = createSignal(1)
  if (props.name === "ThemeProvider") return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="flex items-center gap-3"><span>colorMode(): <strong>light / dark</strong></span><Button variant="outline" onClick={() => toast.info("主题", "主题切换由 ColorModeProvider 管理")}>切换主题</Button></div></DemoFrame></DemoCard>
  if (props.name === "Watermark") return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="relative grid h-32 place-items-center overflow-hidden rounded border"><div class="pointer-events-none absolute inset-0 grid rotate-[-25deg] grid-cols-4 gap-4 opacity-10">{Array.from({length:20},()=> <span class="text-xl font-bold">Acme Console</span>)}</div><span class="relative">机密工作区</span></div></DemoFrame></DemoCard>
  if (props.name === "Tour") return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="relative flex flex-wrap gap-2"><Button>步骤一</Button><Button>步骤二</Button><Button>步骤三</Button><div class="absolute left-0 top-12 z-10 w-56 rounded border bg-white p-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><p class="font-medium">Tour 步骤 {step()} / 3</p><p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Popover anchored to demo buttons。</p><div class="mt-2 flex justify-end gap-2"><Button size="sm" variant="ghost" disabled={step()===1} onClick={() => setStep(step()-1)}>上一步</Button><Button size="sm" onClick={() => step()===3 ? setStep(1) : setStep(step()+1)}>{step()===3?"完成":"下一步"}</Button></div></div></div></DemoFrame></DemoCard>
  return <DemoCard name={props.name} status={props.status}><DemoFrame><div class="relative h-36 rounded border"><div class="absolute bottom-3 right-3 flex gap-2"><Button size="icon" aria-label="帮助"><Icon name="help-circle" /></Button><Button size="icon" aria-label="新建"><Icon name="plus" /></Button></div><p class="p-3 text-sm">{props.name === "FloatButton" ? "Relative floating button group" : "Keyboard shortcut: ⌘K"}</p></div></DemoFrame></DemoCard>
}
