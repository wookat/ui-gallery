/* eslint-disable */
import { createSignal, For, Show, onMount } from "solid-js"
import { useLocation } from "@solidjs/router"
import { marked } from "marked"
import { Collapsible } from "@kobalte/core/collapsible"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/icons"
import { Avatar } from "@/ui/avatar"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Drawer } from "@/ui/dialog"
import { Select } from "@/ui/select"
import { TextArea, TextField } from "@/ui/text-field"
import { toast } from "@/ui/toast"

type ToolCall = { name: string; args: Record<string, string>; status: string }
function getTool(item: unknown): ToolCall | undefined {
  return (item as { tool?: ToolCall }).tool
}

function MarkdownMessage(props: { content: string }) {
  let container!: HTMLDivElement
  onMount(() => {
    container?.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector("button")) return
      const button = document.createElement("button")
      button.type = "button"
      button.textContent = "复制"
      button.className = "absolute right-2 top-2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-zinc-300 bg-white/90 px-3 text-xs text-zinc-700 dark:border-zinc-600 dark:bg-zinc-900/90 dark:text-zinc-200"
      pre.classList.add("relative", "overflow-x-auto", "whitespace-pre-wrap", "break-words", "rounded-lg", "bg-zinc-900", "p-4", "pt-14", "text-zinc-100")
      button.addEventListener("click", async () => {
        await navigator.clipboard?.writeText(pre.textContent ?? "")
        toast.success("代码已复制")
      })
      pre.append(button)
    })
  })
  return <div ref={container} class="prose prose-sm max-w-none dark:prose-invert [&_a]:text-blue-600 [&_code]:rounded [&_code]:bg-zinc-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs dark:[&_code]:bg-zinc-700 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:w-full [&_table]:border [&_table]:border-zinc-300 dark:[&_table]:border-zinc-700 [&_th]:border [&_th]:border-zinc-300 [&_th]:bg-zinc-100 [&_th]:p-2 dark:[&_th]:border-zinc-700 dark:[&_th]:bg-zinc-800 [&_td]:border [&_td]:border-zinc-300 [&_td]:p-2 dark:[&_td]:border-zinc-700" innerHTML={marked.parse(props.content) as string} />
}

export function ChatPage() {
  const location = useLocation()
  const [drawer, setDrawer] = createSignal(false)
  const [message, setMessage] = createSignal("")
  const empty = () => new URLSearchParams(location.search).get("state") === "empty"
  const suggestions = () => chat.suggestions?.slice(0, 4) ?? chat.conversations.slice(0, 4).map((item) => item.title)
  const grow = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    const target = event.currentTarget as unknown as HTMLTextAreaElement
    target.style.height = "auto"
    const lineHeight = Number.parseFloat(getComputedStyle(target).lineHeight) || 24
    target.style.height = `${Math.min(target.scrollHeight, lineHeight * 6)}px`
    setMessage(target.value)
  }
  return <div class="flex min-h-[calc(100vh-8rem)] min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
    <aside class="hidden w-72 shrink-0 border-r border-zinc-200 p-4 md:block dark:border-zinc-800"><ConversationList /></aside>
    <Drawer open={drawer()} onOpenChange={setDrawer} title="对话" description="选择一个对话"><ConversationList /></Drawer>
    <section class="flex min-w-0 flex-1 flex-col">
      <div class="flex h-14 items-center gap-2 border-b border-zinc-200 px-4 dark:border-zinc-800"><Button variant="ghost" size="icon" class="md:hidden" aria-label="打开对话列表" onClick={() => setDrawer(true)}><Icon name="panel-left" /></Button><span class="font-medium">AI 助手</span></div>
      <Show when={!empty()} fallback={<div class="flex flex-1 flex-col items-center justify-center p-6 text-center"><div class="grid size-12 place-items-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950"><Icon name="sparkles" /></div><h1 class="mt-4 text-2xl font-semibold">你好，有什么可以帮你？</h1><div class="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2"><For each={suggestions()}>{(item) => <button class="rounded-lg border p-3 text-left text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800" onClick={() => setMessage(item)}>{item}</button>}</For></div></div>}>
        <div class="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6"><For each={chat.messages}>{(item) => <div class={`flex gap-3 ${item.role === "user" ? "flex-row-reverse" : ""}`}><Avatar name={item.role === "user" ? "我" : "AI"} /><div class={`min-w-0 max-w-[85%] rounded-xl p-3 text-sm ${item.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}><Show when={item.role === "assistant"} fallback={<p class="whitespace-pre-wrap">{item.content}</p>}><MarkdownMessage content={item.content} /></Show><Show when={getTool(item)}><Collapsible class="mt-3 rounded border border-zinc-300 dark:border-zinc-700"><Collapsible.Trigger class="flex min-h-10 w-full items-center justify-between p-2 text-left text-xs"><span>工具调用 · {getTool(item)?.name}</span><span>⌄</span></Collapsible.Trigger><Collapsible.Content class="border-t p-2 text-xs"><pre class="overflow-auto">{JSON.stringify(getTool(item), null, 2)}</pre></Collapsible.Content></Collapsible></Show><Show when={item.sources}><div class="mt-3 flex flex-wrap gap-1"><For each={item.sources}>{(source) => <Badge variant="secondary">{String(source)}</Badge>}</For></div></Show>{("time" in item && item.time) ? <span class="mt-2 block text-xs text-zinc-500 dark:text-zinc-400">{String(item.time)}</span> : null}<Show when={item.streaming}><span class="ml-1 inline-block h-4 w-1 animate-pulse bg-current" /></Show></div></div>}</For></div>
      </Show>
      <div class="border-t border-zinc-200 p-3 dark:border-zinc-800"><div class="flex items-end gap-2"><Button variant="ghost" size="icon" aria-label="添加附件"><Icon name="paperclip" /></Button><TextArea class="min-w-0 flex-1" rows={2} placeholder="输入消息..." value={message()} onInput={grow} /><Button size="icon" aria-label="发送"><Icon name="send" /></Button></div><div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"><div class="w-44"><Select class="w-auto min-w-40" options={chat.models.map((model) => ({ value: model, label: model }))} value={chat.models[0]} /></div><span class="hidden sm:inline">Enter 发送 · Shift+Enter 换行</span><span class="ml-auto">{message().length} / 4000</span></div><div class="mt-2 flex gap-2 overflow-x-auto"><For each={suggestions()}>{(item) => <button class="min-h-10 whitespace-nowrap rounded-full border px-3 text-xs dark:border-zinc-700" onClick={() => setMessage(item)}>{item}</button>}</For></div></div>
    </section>
  </div>
}

function ConversationList() {
  return <div class="grid min-w-0 gap-4"><div class="flex items-center justify-between"><h2 class="font-semibold">对话</h2><Button size="sm"><Icon name="plus" size={14} />新建</Button></div><TextField placeholder="搜索对话" aria-label="搜索对话" /><div><p class="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">今天</p><div class="grid gap-1"><For each={chat.conversations}>{(conversation) => <button class="flex min-w-0 items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"><Icon name="message-square" size={16} /><span class="min-w-0 flex-1 truncate">{conversation.title}</span><span class="text-xs text-zinc-500 dark:text-zinc-400">{conversation.time}</span><Show when={conversation.unread}><Badge>{conversation.unread}</Badge></Show></button>}</For></div></div></div>
}
