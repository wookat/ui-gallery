/* eslint-disable solid/prefer-for */
import { For } from "solid-js"
import contract from "@ui-gallery/spec/contract.json"
import { coverage } from "@/coverage"
import { ButtonsDemo } from "./components/buttons"
import { DataDisplayDemo } from "./components/data-display"
import { FeedbackDemo } from "./components/feedback"
import { FormsDemo } from "./components/forms"
import { KobalteExtrasDemo } from "./components/kobalte-extras"
import { LayoutDemo } from "./components/layout"
import { MiscDemo } from "./components/misc"
import { NavigationDemo } from "./components/navigation"
import { sectionNames } from "./components/shared"
import { TypographyDemo } from "./components/typography"

const groups = [
  ["Typography & content", sectionNames.typography],
  ["Buttons", sectionNames.buttons],
  ["Forms", sectionNames.forms],
  ["Data display", sectionNames.data],
  ["Feedback", sectionNames.feedback],
  ["Navigation", sectionNames.navigation],
  ["Layout", sectionNames.layout],
  ["Other", sectionNames.misc],
] as const

function Demo(props: { name: string }) {
  const status = coverage[props.name] ?? "composed"
  if (props.name === "QRCode") return <KobalteExtrasDemo name={props.name} status={status} />
  if (sectionNames.typography.includes(props.name as never)) return <TypographyDemo name={props.name} status={status} />
  if (sectionNames.buttons.includes(props.name as never)) return <ButtonsDemo name={props.name} status={status} />
  if (sectionNames.forms.includes(props.name as never)) return <FormsDemo name={props.name} status={status} />
  if (sectionNames.data.includes(props.name as never)) return <DataDisplayDemo name={props.name} status={status} />
  if (sectionNames.feedback.includes(props.name as never)) return <FeedbackDemo name={props.name} status={status} />
  if (sectionNames.navigation.includes(props.name as never)) return <NavigationDemo name={props.name} status={status} />
  if (sectionNames.layout.includes(props.name as never)) return <LayoutDemo name={props.name} status={status} />
  if (sectionNames.misc.includes(props.name as never)) return <MiscDemo name={props.name} status={status} />
  return <KobalteExtrasDemo name={props.name} status={status} />
}

export function ComponentsPage() {
  return <div class="space-y-10">
    <header class="space-y-3"><h1 class="text-2xl font-bold">组件总览</h1><p class="text-sm text-zinc-500">按契约顺序展示 84 个组件的真实交互演示。</p><nav class="flex flex-wrap gap-2">{contract.components.map((name) => <a href={`#component-${name}`} class="rounded-full border border-zinc-200 px-2.5 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">{name}</a>)}<For each={["AlertDialog","Collapsible","ContextMenu","HoverCard","Listbox","Menubar","Meter","NavigationMenu","Search","ToggleButton","ToggleGroup","ColorWheel","ColorChannelField","TimeField"]}>{(name) => <a href="#kobalte-extras" class="rounded-full border border-blue-200 px-2.5 py-1 text-xs text-blue-700 dark:border-blue-900 dark:text-blue-300">{name}</a>}</For></nav></header>
    <For each={groups}>{(group) => <section class="space-y-5"><h2 class="border-b pb-2 text-xl font-semibold dark:border-zinc-800">{group[0]}</h2><div class="grid gap-5">{group[1].map((name) => <Demo name={name} />)}</div></section>}</For>
    <section id="kobalte-extras" class="space-y-5"><h2 class="border-b pb-2 text-xl font-semibold dark:border-zinc-800">Kobalte 原语补充</h2><div class="grid gap-5 sm:grid-cols-2"><For each={["AlertDialog","Collapsible","ContextMenu","HoverCard","Listbox","Menubar","Meter","NavigationMenu","Search","ToggleButton","ToggleGroup","ColorWheel","ColorChannelField","TimeField"]}>{(name) => <KobalteExtrasDemo name={name} status="implemented" />}</For></div></section>
  </div>
}
