<script lang="ts">
  import { marked } from "marked"
  import { Avatar, Collapsible } from "@skeletonlabs/skeleton-svelte"
  import chat from "@ui-gallery/spec/mock/chat.json"
  import team from "@ui-gallery/spec/mock/team.json"
  import Icon from "../lib/Icon.svelte"
  import { initials } from "../lib/format"
  import { toaster } from "../lib/toaster"

  type Message = (typeof chat.messages)[number]

  const me = team[0]
  let active = $state(chat.conversations[0].id)
  let query = $state("")
  let draft = $state("")
  let model = $state(chat.models[0])
  let messages = $state<Message[]>([...chat.messages])
  let sidebarOpen = $state(false)

  const conversations = $derived(chat.conversations.filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase())))
  const activeConversation = $derived(chat.conversations.find((c) => c.id === active))
  const activeTitle = $derived(activeConversation?.title ?? "新对话")
  const stamp = $derived(activeConversation?.time ?? chat.conversations[0].time)

  marked.setOptions({ gfm: true, breaks: true })
  function render(md: string): string {
    return marked.parse(md, { async: false })
  }

  function send(text = draft) {
    const content = text.trim()
    if (!content) return
    messages = [...messages, { role: "user", content }]
    draft = ""
  }
  function newChat() {
    messages = []
    active = ""
    sidebarOpen = false
  }
  function pick(id: string) {
    active = id
    messages = id === chat.conversations[0].id ? [...chat.messages] : []
    sidebarOpen = false
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 h-[calc(100dvh-8rem)] min-h-[520px] -m-4 md:-m-6 p-0">
  <aside class="{sidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col border-r border-surface-200-800 bg-surface-50-950 min-h-0 fixed lg:static inset-0 z-40 lg:z-auto w-full lg:w-auto">
    <div class="p-3 space-y-2 border-b border-surface-200-800">
      <div class="flex items-center gap-2">
        <button type="button" class="btn preset-filled-primary-500 flex-1" onclick={newChat}><Icon name="plus" />新建对话</button>
        <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal lg:hidden" aria-label="关闭" onclick={() => (sidebarOpen = false)}><Icon name="x" /></button>
      </div>
      <label class="relative block">
        <span class="sr-only">搜索会话</span>
        <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"><Icon name="search" /></span>
        <input class="input pl-9" type="search" placeholder="搜索会话…" bind:value={query} />
      </label>
    </div>
    <ul class="flex-1 overflow-y-auto p-2 space-y-1">
      {#each conversations as c (c.id)}
        <li>
          <button type="button" class="w-full text-left rounded-container px-3 py-2 flex items-center gap-2 {active === c.id ? 'preset-tonal-primary' : 'hover:preset-tonal'}" onclick={() => pick(c.id)} aria-current={active === c.id ? "true" : undefined}>
            <Icon name="message-circle" class="size-4 shrink-0 opacity-60" />
            <span class="flex-1 min-w-0"><span class="block text-sm truncate">{c.title}</span><span class="block text-xs opacity-60">{c.time}</span></span>
            {#if c.unread}<span class="badge preset-filled-primary-500 text-xs">{c.unread}</span>{/if}
          </button>
        </li>
      {:else}
        <li class="p-6 text-center text-sm opacity-60"><Icon name="inbox" class="size-6 mx-auto mb-2" />没有匹配的会话</li>
      {/each}
    </ul>
  </aside>

  <section class="flex flex-col min-h-0 min-w-0 bg-surface-50-950">
    <header class="flex items-center justify-between gap-2 px-4 py-3 border-b border-surface-200-800">
      <div class="flex items-center gap-2 min-w-0">
        <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal lg:hidden" aria-label="会话列表" onclick={() => (sidebarOpen = true)}><Icon name="list" /></button>
        <h1 class="font-medium truncate">{activeTitle}</h1>
      </div>
      <select class="select w-40" bind:value={model} aria-label="模型">
        {#each chat.models as m (m)}<option value={m}>{m}</option>{/each}
      </select>
    </header>

    <div class="flex-1 overflow-y-auto p-4 space-y-5">
      {#if messages.length === 0}
        <div class="h-full grid place-items-center text-center">
          <div class="space-y-3 max-w-md">
            <span class="mx-auto grid place-items-center size-14 rounded-full preset-tonal-primary"><Icon name="bot" class="size-7" /></span>
            <h2 class="h4">有什么可以帮你？</h2>
            <p class="text-sm opacity-70">用自然语言查询业务数据、生成报告或撰写邮件。</p>
            <div class="flex flex-wrap justify-center gap-2">
              {#each chat.suggestions as s (s)}<button type="button" class="chip preset-outlined-surface-500 hover:preset-tonal" onclick={() => send(s)}>{s}</button>{/each}
            </div>
          </div>
        </div>
      {:else}
        {#each messages as m, i (i)}
          {#if m.role === "user"}
            <div class="flex justify-end gap-3">
              <div class="space-y-1 max-w-[85%] md:max-w-[70%] flex flex-col items-end">
                <div class="card preset-filled-primary-500 px-4 py-2 whitespace-pre-wrap">{m.content}</div>
                <time class="text-xs opacity-60">{stamp}</time>
              </div>
              <Avatar class="size-8 shrink-0"><Avatar.Fallback class="preset-filled-secondary-500 text-xs">{initials(me.name)}</Avatar.Fallback></Avatar>
            </div>
          {:else}
            <div class="flex gap-3">
              <Avatar class="size-8 shrink-0"><Avatar.Fallback class="preset-tonal-primary"><Icon name="bot" /></Avatar.Fallback></Avatar>
              <div class="space-y-2 max-w-[90%] md:max-w-[75%] min-w-0">
                {#if "tool" in m && m.tool}
                  <Collapsible class="card preset-tonal border border-surface-200-800 text-sm">
                    <Collapsible.Trigger class="flex w-full items-center gap-2 px-3 py-2 text-left">
                      <Icon name="wrench" class="size-4" />
                      <span class="font-mono">{m.tool.name}</span>
                      <span class="badge preset-tonal-success ml-auto">{m.tool.status}</span>
                      <Collapsible.Indicator class="[&[data-state=open]]:rotate-180 transition"><Icon name="chevron-down" /></Collapsible.Indicator>
                    </Collapsible.Trigger>
                    <Collapsible.Content class="px-3 pb-3">
                      <pre class="pre text-xs">{JSON.stringify(m.tool.args, null, 2)}</pre>
                    </Collapsible.Content>
                  </Collapsible>
                {/if}
                <div class="card bg-surface-100-900 px-4 py-3 prose-chat overflow-x-auto">
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -- markdown from trusted mock data -->
                  {@html render(m.content)}
                  {#if "streaming" in m && m.streaming}<span class="inline-block w-2 h-4 bg-primary-500 animate-pulse align-text-bottom ml-0.5" aria-label="正在生成"></span>{/if}
                </div>
                {#if "sources" in m && m.sources}
                  <div class="flex flex-wrap items-center gap-1 text-xs">
                    <span class="opacity-60">来源：</span>
                    {#each m.sources as s (s)}<span class="chip preset-outlined-surface-500"><Icon name="file" class="size-3" />{s}</span>{/each}
                  </div>
                {/if}
                <div class="flex items-center gap-1">
                  <time class="text-xs opacity-60 mr-1">{stamp}</time>
                  <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="复制" onclick={() => toaster.info({ title: "已复制" })}><Icon name="copy" class="size-4" /></button>
                  <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="重新生成"><Icon name="refresh" class="size-4" /></button>
                  <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="赞"><Icon name="heart" class="size-4" /></button>
                </div>
              </div>
            </div>
          {/if}
        {/each}
      {/if}
    </div>

    <footer class="border-t border-surface-200-800 p-3 space-y-2">
      {#if messages.length}
        <div class="flex flex-wrap gap-2 pb-1">
          {#each chat.suggestions as s (s)}<button type="button" class="chip preset-outlined-surface-500 hover:preset-tonal" onclick={() => send(s)}>{s}</button>{/each}
        </div>
      {/if}
      <form class="card bg-surface-100-900 border border-surface-200-800 p-2 space-y-2" onsubmit={(e) => { e.preventDefault(); send() }}>
        <textarea class="w-full bg-transparent resize-none outline-none px-2 py-1 text-sm" rows="2" placeholder="输入消息，Enter 发送，Shift+Enter 换行" bind:value={draft} onkeydown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}></textarea>
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1">
            <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="添加附件" onclick={() => toaster.info({ title: "附件", description: "已打开文件选择器" })}><Icon name="paperclip" /></button>
            <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="语音输入"><Icon name="mic" /></button>
            <span class="text-xs opacity-60 hidden sm:inline">模型：{model}</span>
          </div>
          <button type="submit" class="btn min-h-10 preset-filled-primary-500" disabled={!draft.trim()}><Icon name="send" />发送</button>
        </div>
      </form>
    </footer>
  </section>
</div>

<style>
  .prose-chat :global(p + p) { margin-top: 0.5rem; }
  .prose-chat :global(table) { width: 100%; font-size: 0.875rem; margin-top: 0.5rem; border-collapse: collapse; }
  .prose-chat :global(th), .prose-chat :global(td) { padding: 0.375rem 0.5rem; border-bottom: 1px solid color-mix(in oklab, currentColor 15%, transparent); text-align: left; }
  .prose-chat :global(pre) { margin-top: 0.5rem; padding: 0.75rem; border-radius: 0.5rem; background: color-mix(in oklab, currentColor 8%, transparent); white-space: pre-wrap; overflow-wrap: anywhere; font-size: 0.8125rem; }
  .prose-chat :global(code) { font-family: ui-monospace, monospace; }
</style>
