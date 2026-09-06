<script setup lang="ts">
import { computed, nextTick, ref } from "vue"
import { useRoute } from "vue-router"
import MarkdownIt from "markdown-it"
import chat from "@ui-gallery/spec/mock/chat.json"
import Icon from "@/components/Icon.vue"
import { resolveIcon } from "@/icons"

const route = useRoute()
const drawer = ref(false)
const conversation = ref(chat.conversations[0].id)
const input = ref("")
const model = ref(chat.models[0])
const messages = ref(chat.messages)
const markdown = new MarkdownIt({ breaks: true })
const copyTimers = new WeakMap<HTMLButtonElement, number>()
const empty = computed(() => route.query.state === "empty")
const activeConversation = computed(() => chat.conversations.find((item) => item.id === conversation.value) ?? chat.conversations[0])
const activeTitle = computed(() => activeConversation.value.title)
markdown.renderer.rules.fence = (tokens, index) => {
  const content = markdown.utils.escapeHtml(tokens[index].content)
  return `<div class="code-block"><button type="button" class="copy-btn" data-copy>复制</button><pre>${content}</pre></div>`
}
function render(content: string) {
  return markdown.render(content)
}
async function handleMessageClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof HTMLElement)) return
  const button = target.closest<HTMLButtonElement>("[data-copy]")
  const pre = button?.parentElement?.querySelector("pre")
  if (!button || !pre) return
  await navigator.clipboard.writeText(pre.textContent ?? "")
  button.textContent = "已复制"
  const previous = copyTimers.get(button)
  if (previous) window.clearTimeout(previous)
  copyTimers.set(button, window.setTimeout(() => {
    button.textContent = "复制"
    copyTimers.delete(button)
  }, 1500))
}
async function send() {
  if (!input.value.trim()) return
  messages.value = [...messages.value, { role: "user", content: input.value }, { role: "assistant", content: "我会根据你的问题查询相关数据并给出简要结论。" }]
  input.value = ""
  await nextTick()
}
</script>

<template>
  <div>
    <template v-if="route.query.state === 'loading'"><v-skeleton-loader type="card, list-item-three-line@4, article" /></template>
    <template v-else-if="route.query.state === 'error'"><v-alert type="error" variant="tonal" title="助手暂时不可用">请稍后重试。<template #append><v-btn variant="outlined">重试</v-btn></template></v-alert></template>
    <template v-else>
      <div class="d-flex align-center justify-space-between mb-4"><div><h1 class="text-h5">{{ activeTitle }}</h1><p class="text-body-2 text-medium-emphasis mt-1">与 Acme AI 对话</p></div><v-btn class="d-md-none" variant="outlined" @click="drawer = true"><Icon name="message-square" />会话</v-btn></div>
      <v-row>
        <v-col cols="12" md="3" class="d-none d-md-block"><v-card height="100%"><v-card-text><v-text-field label="搜索会话" :prepend-inner-icon="resolveIcon('search')" density="compact" hide-details /><v-btn block color="primary" class="my-4"><Icon name="plus" />新建会话</v-btn></v-card-text><v-list lines="two"><v-list-subheader>最近会话</v-list-subheader><v-list-item v-for="item in chat.conversations" :key="item.id" :active="item.id === conversation" :title="item.title" :subtitle="item.time" rounded="lg" @click="conversation = item.id"><template #append><v-badge v-if="item.unread" :content="item.unread" color="primary" inline /></template></v-list-item></v-list></v-card></v-col>
        <v-col cols="12" md="9"><v-card class="chat-card"><v-card-text class="message-list" @click="handleMessageClick"><template v-if="empty"><div class="text-center py-6"><v-avatar color="primary" size="64" class="mb-5"><Icon name="bot" size="32" /></v-avatar><h1 class="text-h5">你好，我是 Acme AI 助手</h1><p class="text-body-1 text-medium-emphasis mt-2">从业务数据中获得清晰、可执行的答案。</p><v-row class="mt-6 justify-center"><v-col v-for="suggestion in chat.suggestions" :key="suggestion" cols="12" sm="6" md="3"><v-card variant="outlined" class="pa-4 h-100 text-left" @click="input = suggestion"><span class="text-body-2">{{ suggestion }}</span></v-card></v-col></v-row></div></template><template v-else><div v-for="(message, index) in messages" :key="`${message.role}-${index}`" class="d-flex mb-5" :class="message.role === 'user' ? 'justify-end' : 'justify-start'"><v-avatar :color="message.role === 'user' ? 'secondary' : 'primary'" size="32" class="mt-1 flex-shrink-0">{{ message.role === 'user' ? '林' : 'A' }}</v-avatar><div class="mx-3 message-wrap" :class="message.role === 'user' ? 'user-message' : ''"><div class="text-caption text-medium-emphasis mb-1">{{ message.role === 'user' ? '你' : 'Acme AI' }}<span class="text-caption text-medium-emphasis ms-2">{{ activeConversation.time }}</span></div><v-sheet :color="message.role === 'user' ? 'primary' : undefined" :class="message.role === 'user' ? 'text-white' : ''" rounded="lg" class="pa-3 message-bubble"><!-- eslint-disable vue/no-v-html --><div v-html="render(message.content)" /><!-- eslint-enable vue/no-v-html --><div v-if="message.streaming" class="d-flex align-center ga-2 mt-2 text-caption"><v-progress-circular indeterminate size="16" width="2" />正在输入…</div></v-sheet><div v-if="'sources' in message && message.sources" class="d-flex flex-wrap ga-1 mt-2"><v-chip v-for="source in message.sources" :key="source" size="x-small" variant="outlined"><Icon name="link" size="12" />{{ source }}</v-chip></div><v-expansion-panels v-if="'tool' in message && message.tool" variant="accordion" class="mt-2"><v-expansion-panel :title="`工具调用：${message.tool.name}`"><v-expansion-panel-text><code>{{ JSON.stringify(message.tool.args) }}</code></v-expansion-panel-text></v-expansion-panel></v-expansion-panels></div></div></template></v-card-text><v-divider /><v-card-text><div class="d-flex align-end ga-2"><v-btn icon variant="text" aria-label="添加附件"><Icon name="paperclip" /></v-btn><v-textarea v-model="input" auto-grow rows="1" max-rows="6" hide-details label="输入消息" @keydown.enter.exact.prevent="send" /><v-btn icon color="primary" :disabled="!input.trim()" aria-label="发送" @click="send"><Icon name="send" /></v-btn></div><div class="d-flex flex-wrap align-center ga-2 mt-3"><v-select v-model="model" :items="chat.models" density="compact" hide-details variant="outlined" class="flex-shrink-0" style="width: 180px" /><div class="d-flex flex-wrap ga-1"><v-chip v-for="suggestion in chat.suggestions" :key="suggestion" size="small" variant="tonal" @click="input = suggestion">{{ suggestion }}</v-chip></div></div><div class="text-caption text-medium-emphasis mt-2">Enter 发送 · Shift+Enter 换行 · {{ input.length }} 字</div></v-card-text></v-card></v-col>
      </v-row>
    </template>
    <v-navigation-drawer v-model="drawer" temporary location="start"><v-list><v-list-subheader>最近会话</v-list-subheader><v-list-item v-for="item in chat.conversations" :key="item.id" :title="item.title" :subtitle="item.time" @click="conversation = item.id; drawer = false" /></v-list></v-navigation-drawer>
  </div>
</template>

<style scoped>
.chat-card { min-width: 0; }
.message-list { min-height: 460px; max-height: 600px; overflow-y: auto; }
.message-wrap { max-width: min(720px, 82%); min-width: 0; }
.message-bubble :deep(.code-block) { position: relative; margin: 8px 0; }
.message-bubble :deep(.code-block > pre) { margin: 0; padding-top: 44px; }
.message-bubble :deep(.copy-btn) { position: absolute; top: 8px; right: 8px; z-index: 1; min-height: 40px; padding: 0 8px; border: 0; border-radius: 6px; color: rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-on-surface), .08); cursor: pointer; }
.message-bubble :deep(pre) { overflow-x: auto; padding: 12px; border-radius: 8px; background: rgba(var(--v-theme-on-surface), .08); }
.message-bubble :deep(table) { width: 100%; border-collapse: collapse; margin-top: 8px; }
.message-bubble :deep(th), .message-bubble :deep(td) { border: 1px solid rgba(var(--v-border-color), .35); padding: 6px 8px; text-align: left; }
.user-message { text-align: right; }
</style>
