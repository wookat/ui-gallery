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

function renderDemo(name: string) {
  const status = coverage[name] ?? "composed"
  if (name === "QRCode") return <KobalteExtrasDemo name={name} status={status} />
  if (sectionNames.typography.includes(name as never)) return <TypographyDemo name={name} status={status} />
  if (sectionNames.buttons.includes(name as never)) return <ButtonsDemo name={name} status={status} />
  if (sectionNames.forms.includes(name as never)) return <FormsDemo name={name} status={status} />
  if (sectionNames.data.includes(name as never)) return <DataDisplayDemo name={name} status={status} />
  if (sectionNames.feedback.includes(name as never)) return <FeedbackDemo name={name} status={status} />
  if (sectionNames.navigation.includes(name as never)) return <NavigationDemo name={name} status={status} />
  if (sectionNames.layout.includes(name as never)) return <LayoutDemo name={name} status={status} />
  if (sectionNames.misc.includes(name as never)) return <MiscDemo name={name} status={status} />
  return <KobalteExtrasDemo name={name} status={status} />
}

export function ComponentsPage() {
  return <div class="space-y-10">
    <header class="space-y-3"><h1 class="text-2xl font-bold">组件总览</h1><p class="text-sm text-zinc-500 dark:text-zinc-400">按契约顺序展示 84 个组件的真实交互演示。</p><nav class="flex flex-wrap gap-2">{contract.components.map((name) => <a href={`#component-${name}`} class="inline-flex min-h-10 items-center rounded-full border border-zinc-200 px-3 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">{name}</a>)}<For each={["AlertDialog","Collapsible","ContextMenu","HoverCard","Listbox","Menubar","Meter","NavigationMenu","Search","ToggleButton","ToggleGroup","ColorWheel","ColorChannelField","TimeField"]}>{(name) => <a href="#kobalte-extras" class="inline-flex min-h-10 items-center rounded-full border border-blue-200 px-3 text-xs text-blue-700 dark:border-blue-900 dark:text-blue-300">{name}</a>}</For></nav></header>
    <For each={groups}>{(group) => <section class="space-y-5"><h2 class="border-b pb-2 text-xl font-semibold dark:border-zinc-800">{group[0]}</h2><div class="grid gap-5">{group[1].map((name) => <Demo name={name} />)}</div></section>}</For>
    <section id="kobalte-extras" class="space-y-5"><h2 class="border-b pb-2 text-xl font-semibold dark:border-zinc-800">Kobalte 原语补充</h2><div class="grid gap-5 sm:grid-cols-2"><For each={["AlertDialog","Collapsible","ContextMenu","HoverCard","Listbox","Menubar","Meter","NavigationMenu","Search","ToggleButton","ToggleGroup","ColorWheel","ColorChannelField","TimeField"]}>{(name) => <KobalteExtrasDemo name={name} status="implemented" />}</For></div></section>
  </div>
}

function Demo(props: { name: string }) {
  return <>{renderDemo(props.name)}</>
}
