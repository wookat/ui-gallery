<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked } from 'marked'
import chat from '@ui-gallery/spec/mock/chat.json'
import Icon from '@/components/Icon.vue'
import PageHeader from '@/components/PageHeader.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

type Message = (typeof chat.messages)[number]
const draft = ref('')
const messages = ref<Message[]>([...chat.messages])
const activeId = ref<string | null>(chat.conversations[0]?.id ?? null)
const model = ref(chat.models[0])
const copied = ref(false)
const rendered = (value: string) => marked.parse(value) as string
const first = computed(() => chat.conversations[0]!)
const activeConversation = computed(() => chat.conversations.find(item => item.id === activeId.value))
function startConversation() {
  activeId.value = null
  draft.value = ''
}
function openConversation(id: string) {
  activeId.value = id
  messages.value = [...chat.messages]
}
function send() {
  const content = draft.value.trim()
  if (!content) return
  if (!activeId.value) {
    activeId.value = 'new'
    messages.value = []
  }
  messages.value = [...messages.value, { role: 'user', content } as Message]
  draft.value = ''
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault()
    send()
  }
}
function copy(value: string) { navigator.clipboard?.writeText(value); copied.value = true; window.setTimeout(() => copied.value = false, 1200) }
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="AI 对话" description="与团队智能助手协作，保留完整上下文。" />
    <div class="grid min-h-[620px] overflow-hidden rounded-xl border lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside class="hidden border-b bg-muted/20 p-4 lg:block lg:border-r lg:border-b-0"><div class="flex items-center justify-between"><h2 class="font-semibold">对话</h2><Button size="icon" variant="ghost" class="min-h-10 min-w-10" @click="startConversation"><Icon name="plus" /></Button></div><InputGroup class="mt-4"><InputGroupAddon><Icon name="search" :size="15" /></InputGroupAddon><InputGroupInput placeholder="搜索对话" /></InputGroup><Button class="mt-3 min-h-10 w-full" @click="startConversation"><Icon name="plus" />新建对话</Button><ScrollArea class="mt-4 h-[440px]"><div class="grid gap-1"><Button v-for="item in chat.conversations" :key="item.id" class="h-auto min-h-10 justify-start px-3 py-2 text-left" :variant="item.id === activeId ? 'secondary' : 'ghost'" @click="openConversation(item.id)"><span class="min-w-0 flex-1"><span class="block truncate">{{ item.title }}</span><span class="block text-xs text-muted-foreground">{{ item.time }}</span></span><Badge v-if="item.unread">{{ item.unread }}</Badge></Button></div></ScrollArea></aside>
      <section class="flex min-w-0 flex-col"><header class="flex items-center justify-between gap-3 border-b px-4 py-3"><Sheet><SheetTrigger as-child><Button size="icon" variant="outline" class="min-h-10 min-w-10 lg:hidden" aria-label="打开对话列表"><Icon name="menu" /></Button></SheetTrigger><SheetContent side="left"><SheetHeader><SheetTitle>对话</SheetTitle></SheetHeader><div class="p-4"><InputGroup><InputGroupAddon><Icon name="search" :size="15" /></InputGroupAddon><InputGroupInput placeholder="搜索对话" /></InputGroup><Button class="mt-3 min-h-10 w-full" @click="startConversation"><Icon name="plus" />新建对话</Button><div class="mt-4 grid gap-1"><Button v-for="item in chat.conversations" :key="item.id" class="h-auto min-h-10 justify-start px-3 py-2 text-left" :variant="item.id === activeId ? 'secondary' : 'ghost'" @click="openConversation(item.id)"><span class="min-w-0 flex-1"><span class="block truncate">{{ item.title }}</span><span class="block text-xs text-muted-foreground">{{ item.time }}</span></span><Badge v-if="item.unread">{{ item.unread }}</Badge></Button></div></div></SheetContent></Sheet><div class="min-w-0"><p class="truncate font-medium">{{ activeConversation?.title ?? '新对话' }}</p><p class="text-xs text-muted-foreground">{{ model }} · 已连接</p></div><Select v-model="model"><SelectTrigger class="min-h-10 w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem v-for="item in chat.models" :key="item" :value="item">{{ item }}</SelectItem></SelectContent></Select></header><ScrollArea class="min-h-0 flex-1 p-4"><div v-if="activeId" class="space-y-6"><div v-for="(message, index) in messages" :key="`${message.role}-${index}`" class="flex gap-3" :class="message.role === 'user' ? 'flex-row-reverse text-right' : ''"><Avatar class="size-8 shrink-0"><AvatarFallback>{{ message.role === 'user' ? '林' : 'AI' }}</AvatarFallback></Avatar><div class="min-w-0 max-w-[90%]"><div class="mb-1 flex items-center gap-2 text-xs text-muted-foreground" :class="message.role === 'user' ? 'justify-end' : ''"><span>{{ message.role === 'user' ? '林晓' : 'AI 助手' }}</span><span>刚刚</span><Badge v-if="message.streaming" variant="secondary">生成中…</Badge></div><div class="rounded-xl bg-muted p-3 text-left text-sm"><div v-if="message.role === 'assistant'" class="[&_table]:w-full [&_table]:text-left [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-background [&_pre]:p-3" v-html="rendered(message.content)"></div><span v-else>{{ message.content }}</span><span v-if="message.streaming" class="ml-1 inline-block h-4 w-1 animate-pulse bg-foreground align-middle"></span><Button v-if="message.role === 'assistant'" size="xs" variant="ghost" class="mt-2 min-h-10" @click="copy(message.content)"><Icon name="copy" />{{ copied ? '已复制' : '复制' }}</Button></div><div v-if="message.sources" class="mt-2 flex flex-wrap gap-2"><Badge v-for="source in message.sources" :key="source" variant="outline"><Icon name="paperclip" />{{ source }}</Badge></div><Collapsible v-if="message.tool" class="mt-3 rounded-lg border"><CollapsibleTrigger as-child><Button variant="ghost" class="min-h-10 w-full justify-between"><span><Icon name="check" />工具调用 · {{ message.tool.name }}</span><span class="text-xs text-muted-foreground">{{ message.tool.status }}</span></Button></CollapsibleTrigger><CollapsibleContent><CardContent><pre class="overflow-auto text-xs">{{ JSON.stringify(message.tool.args, null, 2) }}</pre></CardContent></CollapsibleContent></Collapsible></div></div></div><Empty v-else class="border-0"><EmptyHeader><EmptyMedia variant="icon"><Icon name="sparkles" /></EmptyMedia><EmptyTitle>有什么可以帮你？</EmptyTitle><EmptyDescription>选择一个建议开始，或直接输入问题。</EmptyDescription></EmptyHeader><div class="grid gap-3 sm:grid-cols-2"><Card v-for="suggestion in chat.suggestions" :key="suggestion" class="cursor-pointer transition-colors hover:bg-muted" @click="draft = suggestion"><CardContent class="p-4 text-sm">{{ suggestion }}</CardContent></Card></div></Empty></ScrollArea><div class="border-t p-4"><div class="mb-3 flex flex-wrap gap-2"><Button v-for="suggestion in chat.suggestions" :key="suggestion" size="sm" variant="outline" class="min-h-10" @click="draft = suggestion">{{ suggestion }}</Button></div><div class="flex items-end gap-2"><Textarea v-model="draft" class="min-h-20 resize-none" placeholder="输入消息..." maxlength="2000" @keydown="onKeydown" /><Button size="icon-lg" class="min-h-10 min-w-10" aria-label="发送" :disabled="!draft.trim()" @click="send"><Icon name="send" /></Button></div><p class="mt-2 text-xs text-muted-foreground">Enter 发送 · Shift + Enter 换行 · {{ draft.length }}/2000</p></div></section>
    </div>
  </div>
</template>
