<script setup lang="ts">
import { computed, ref } from 'vue'
import { marked } from 'marked'
import chat from '@ui-gallery/spec/mock/chat.json'
import Icon from '@/components/Icon.vue'
import PageHeader from '@/components/PageHeader.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const draft = ref('')
const model = ref(chat.models[0])
const copied = ref(false)
const rendered = (value: string) => marked.parse(value) as string
const first = computed(() => chat.conversations[0]!)
function copy(value: string) { navigator.clipboard?.writeText(value); copied.value = true; window.setTimeout(() => copied.value = false, 1200) }
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="AI 对话" description="与团队智能助手协作，保留完整上下文。" />
    <div class="grid min-h-[620px] overflow-hidden rounded-xl border lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside class="border-b bg-muted/20 p-4 lg:border-r lg:border-b-0"><div class="flex items-center justify-between"><h2 class="font-semibold">对话</h2><Button size="icon" variant="ghost"><Icon name="plus" /></Button></div><InputGroup class="mt-4"><InputGroupAddon><Icon name="search" :size="15" /></InputGroupAddon><InputGroupInput placeholder="搜索对话" /></InputGroup><Button class="mt-3 w-full"><Icon name="plus" />新建对话</Button><ScrollArea class="mt-4 h-64 lg:h-[440px]"><div class="grid gap-1"><Button v-for="item in chat.conversations" :key="item.id" class="h-auto justify-start px-3 py-2 text-left" :variant="item.id === first.id ? 'secondary' : 'ghost'"><span class="min-w-0 flex-1"><span class="block truncate">{{ item.title }}</span><span class="block text-xs text-muted-foreground">{{ item.time }}</span></span><Badge v-if="item.unread">{{ item.unread }}</Badge></Button></div></ScrollArea></aside>
      <section class="flex min-w-0 flex-col"><header class="flex items-center justify-between gap-3 border-b px-4 py-3"><div class="min-w-0"><p class="truncate font-medium">{{ first.title }}</p><p class="text-xs text-muted-foreground">{{ model }} · 已连接</p></div><Select v-model="model"><SelectTrigger class="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem v-for="item in chat.models" :key="item" :value="item">{{ item }}</SelectItem></SelectContent></Select></header><ScrollArea class="min-h-0 flex-1 p-4"><div class="space-y-6"><div v-for="(message, index) in chat.messages" :key="`${message.role}-${index}`" class="flex gap-3" :class="message.role === 'user' ? 'flex-row-reverse text-right' : ''"><Avatar class="size-8 shrink-0"><AvatarFallback>{{ message.role === 'user' ? '林' : 'AI' }}</AvatarFallback></Avatar><div class="min-w-0 max-w-[90%]"><div class="mb-1 flex items-center gap-2 text-xs text-muted-foreground" :class="message.role === 'user' ? 'justify-end' : ''"><span>{{ message.role === 'user' ? '林晓' : 'AI 助手' }}</span><span>刚刚</span></div><div class="rounded-xl bg-muted p-3 text-left text-sm"><div v-if="message.role === 'assistant'" class="prose prose-sm max-w-none dark:prose-invert" v-html="rendered(message.content)" /><span v-else>{{ message.content }}</span><Button v-if="message.role === 'assistant'" size="xs" variant="ghost" class="mt-2" @click="copy(message.content)"><Icon name="copy" />{{ copied ? '已复制' : '复制' }}</Button></div><div v-if="message.sources" class="mt-2 flex flex-wrap gap-2"><Badge v-for="source in message.sources" :key="source" variant="outline"><Icon name="paperclip" />{{ source }}</Badge></div><Card v-if="message.tool" class="mt-3"><CardHeader class="py-3"><CardTitle class="text-sm"><Icon name="check" />工具调用 · {{ message.tool.name }}</CardTitle></CardHeader><CardContent><pre class="overflow-auto text-xs">{{ JSON.stringify(message.tool.args, null, 2) }}</pre></CardContent></Card></div></div></div></ScrollArea><div class="border-t p-4"><div class="mb-3 flex flex-wrap gap-2"><Button v-for="suggestion in chat.suggestions" :key="suggestion" size="sm" variant="outline" @click="draft = suggestion">{{ suggestion }}</Button></div><div class="flex items-end gap-2"><Textarea v-model="draft" class="min-h-20 resize-none" placeholder="输入消息..." /><Button size="icon-lg" aria-label="发送"><Icon name="send" /></Button></div><p class="mt-2 text-xs text-muted-foreground">Enter 发送 · Shift + Enter 换行 · {{ draft.length }}/2000</p></div></section>
    </div>
  </div>
</template>
