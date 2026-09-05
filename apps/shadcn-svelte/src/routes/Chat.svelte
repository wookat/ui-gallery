<script lang="ts">
  import { marked } from "marked"
  import { onMount } from "svelte"
  import Icon from "$lib/icons/Icon.svelte"
  import chat from "@ui-gallery/spec/mock/chat.json"
  import { Button } from "$lib/components/ui/button"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as Badge from "$lib/components/ui/badge"
  import * as Card from "$lib/components/ui/card"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import * as Empty from "$lib/components/ui/empty"
  import * as Message from "$lib/components/ui/message"
  import * as Sheet from "$lib/components/ui/sheet"

  let query = $state(""),
    input = $state(""),
    active = $state(chat.conversations[0].id)
  let mobileOpen = $state(false)
  let empty = $state(new URLSearchParams(window.location.search).get("state") === "empty")
  let streaming = $state(true)
  const visibleConversations = $derived(
    chat.conversations.filter((item) => item.title.includes(query) || !query)
  )
  function send() {
    if (!input.trim()) return
    input = ""
  }
  function copyMessage(content: unknown) {
    void navigator.clipboard?.writeText(String(content))
  }
  onMount(() => setTimeout(() => (streaming = false), 1800))
</script>

<div class="flex min-h-[calc(100vh-7rem)] overflow-hidden rounded-xl border bg-card">
  <aside class="hidden w-72 shrink-0 border-r md:flex md:flex-col">
    <div class="flex items-center justify-between border-b p-4">
      <h2 class="font-semibold">会话</h2>
      <Button size="icon" variant="ghost" aria-label="新建会话"
        ><Icon name="plus" size={16} /></Button
      >
    </div>
    <div class="p-3">
      <input
        bind:value={query}
        class="h-9 w-full rounded-md border bg-background px-3 text-sm"
        placeholder="搜索会话"
      />
    </div>
    <div class="space-y-1 overflow-y-auto px-2">
      {#each visibleConversations as conversation (conversation.id)}<button
          class="w-full rounded-lg p-3 text-left hover:bg-muted {active === conversation.id
            ? 'bg-muted'
            : ''}"
          onclick={() => (active = conversation.id)}
          ><div class="flex items-center justify-between text-sm font-medium">
            <span class="truncate">{conversation.title}</span>{#if conversation.unread}<Badge.Root
                class="ml-2">{conversation.unread}</Badge.Root
              >{/if}
          </div>
          <p class="mt-1 text-xs text-muted-foreground">{conversation.time}</p></button
        >{/each}
    </div>
  </aside>
  <section class="flex min-w-0 flex-1 flex-col">
    <header class="flex items-center gap-3 border-b p-4">
      <Button
        class="md:hidden"
        size="icon"
        variant="ghost"
        aria-label="打开会话"
        onclick={() => (mobileOpen = true)}><Icon name="menu" size={16} /></Button
      ><Avatar.Root class="size-8"
        ><Avatar.Fallback><Icon name="sparkles" size={16} /></Avatar.Fallback></Avatar.Root
      >
      <div>
        <h1 class="font-semibold">{empty ? "开始一段新对话" : "AI 助手"}</h1>
        <p class="text-xs text-muted-foreground">随时帮你分析业务数据</p>
      </div>
    </header>
    {#if empty}<Empty.Root class="flex-1 border-0"
        ><Empty.Header
          ><Empty.Media variant="icon"><Icon name="sparkles" size={18} /></Empty.Media><Empty.Title
            >你想了解什么？</Empty.Title
          ><Empty.Description>选择一个建议开始探索你的业务数据。</Empty.Description></Empty.Header
        >
        <div class="grid w-full max-w-xl gap-2 sm:grid-cols-2">
          {#each chat.suggestions as suggestion}<Button
              variant="outline"
              class="justify-start text-left whitespace-normal"
              onclick={() => (input = suggestion)}>{suggestion}</Button
            >{/each}
        </div></Empty.Root
      >{:else}<div class="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
        {#each chat.messages as message, i}<Message.Root
            class={message.role === "user" ? "flex-row-reverse" : ""}
            ><Message.Avatar
              ><Avatar.Root class="size-8"
                ><Avatar.Fallback>{message.role === "user" ? "我" : "AI"}</Avatar.Fallback
                ></Avatar.Root
              ></Message.Avatar
            ><Message.Content
              ><Message.Header
                ><span>{message.role === "user" ? "你" : "助手"}</span><span
                  class="text-xs text-muted-foreground">刚刚</span
                ></Message.Header
              >
              <div
                class="prose prose-sm dark:prose-invert max-w-none overflow-x-auto [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-2 [&_th]:text-left"
              >
                {@html marked.parse(String(message.content))}
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                class="mt-2"
                aria-label="复制内容"
                onclick={() => copyMessage(message.content)}><Icon name="copy" size={16} /></Button
              >
              {#if message.sources}<div class="mt-3 flex flex-wrap gap-1">
                  {#each message.sources as source}<Badge.Root variant="outline"
                      >{source}</Badge.Root
                    >{/each}
                </div>{/if}{#if message.tool}<Collapsible.Root class="mt-3 rounded-lg border p-3"
                  ><Collapsible.Trigger class="text-sm font-medium"
                    >工具调用 · {message.tool.name}</Collapsible.Trigger
                  ><Collapsible.Content class="pt-2 text-xs text-muted-foreground"
                    >{JSON.stringify(message.tool.args)}</Collapsible.Content
                  ></Collapsible.Root
                >{/if}{#if message.streaming && streaming}<span
                  class="ml-1 inline-block h-4 w-1 animate-pulse bg-primary align-middle"
                ></span>{/if}</Message.Content
            ></Message.Root
          >{/each}
      </div>{/if}
    <footer class="border-t p-3 sm:p-4">
      <div class="mx-auto max-w-3xl rounded-xl border bg-background p-2 shadow-sm">
        <textarea
          bind:value={input}
          rows="2"
          class="w-full resize-none bg-transparent p-2 text-sm outline-none"
          placeholder="输入消息..."
          onkeydown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              send()
            }
          }}
        ></textarea>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="添加附件"
              ><Icon name="paperclip" size={16} /></Button
            ><select
              class="h-8 w-36 rounded-md border bg-background px-2 text-xs"
              aria-label="选择模型"
              >{#each chat.models as model}<option value={model}>{model}</option>{/each}</select
            ><span class="hidden text-xs text-muted-foreground sm:inline"
              >Enter 发送 · Shift+Enter 换行</span
            >
          </div>
          <Button size="icon" aria-label="发送" onclick={send}
            ><Icon name="send" size={16} /></Button
          >
        </div>
      </div>
      <div class="mt-2 flex flex-wrap justify-center gap-2">
        {#each chat.suggestions as suggestion}<button
            class="text-xs text-muted-foreground hover:text-foreground"
            onclick={() => (input = suggestion)}>{suggestion}</button
          >{/each}
      </div>
    </footer>
  </section>
</div>

<Sheet.Root bind:open={mobileOpen}>
  <Sheet.Content side="left" class="w-80">
    <Sheet.Header
      ><Sheet.Title>会话</Sheet.Title><Sheet.Description>选择一个历史对话。</Sheet.Description
      ></Sheet.Header
    >
    <div class="mt-4 space-y-1">
      {#each visibleConversations as conversation (conversation.id)}
        <button
          class="w-full rounded-lg p-3 text-left text-sm hover:bg-muted"
          onclick={() => {
            active = conversation.id
            mobileOpen = false
          }}
        >
          <span class="font-medium">{conversation.title}</span>
          <span class="mt-1 block text-xs text-muted-foreground">{conversation.time}</span>
        </button>
      {/each}
    </div>
  </Sheet.Content>
</Sheet.Root>
