<script setup lang="ts">
import { computed, nextTick, onMounted, onUpdated, ref } from "vue"
import { marked } from "marked"
import Avatar from "primevue/avatar"
import Accordion from "primevue/accordion"
import AccordionPanel from "primevue/accordionpanel"
import AccordionHeader from "primevue/accordionheader"
import AccordionContent from "primevue/accordioncontent"
import Badge from "primevue/badge"
import Button from "primevue/button"
import Drawer from "primevue/drawer"
import IconField from "primevue/iconfield"
import InputIcon from "primevue/inputicon"
import InputText from "primevue/inputtext"
import Select from "primevue/select"
import Textarea from "primevue/textarea"
import Chip from "primevue/chip"
import PageHeader from "@/components/PageHeader.vue"
import chat from "@ui-gallery/spec/mock/chat.json"

marked.use({ async: false })
type Message = { role: string; content: string; sources?: string[]; tool?: { name: string; args: Record<string, string>; status: string }; streaming?: boolean; time?: string }
const conversations = ref(chat.conversations.map((item) => ({ ...item })))
const messages = ref<Message[]>(chat.messages as Message[])
const activeConversation = ref(conversations.value[0].id)
const conversationSearch = ref("")
const draft = ref("")
const model = ref(chat.models[0])
const mobileOpen = ref(false)
const filteredConversations = computed(() => conversations.value.filter((item) => item.title.includes(conversationSearch.value)))
const groupedConversations = computed(() => {
  const groups = [
    { label: "今天", items: filteredConversations.value.filter((item) => item.time === "刚刚" || item.time.includes("分钟") || item.time.includes("小时")) },
    { label: "昨天", items: filteredConversations.value.filter((item) => item.time === "昨天") },
    { label: "更早", items: filteredConversations.value.filter((item) => item.time !== "刚刚" && !item.time.includes("分钟") && !item.time.includes("小时") && item.time !== "昨天") },
  ]
  return groups.filter((group) => group.items.length)
})
const activeConversationTitle = computed(() => conversations.value.find((item) => item.id === activeConversation.value)?.title ?? "新对话")
const rendered = (content: string) => marked.parse(content, { async: false }) as string
function createConversation() { const id = `new-${Date.now()}`; conversations.value.unshift({ id, title: "新对话", time: "刚刚", unread: 0 }); activeConversation.value = id; messages.value = [] }
function send() { const text = draft.value.trim(); if (!text) return; messages.value.push({ role: "user", content: text }); draft.value = ""; nextTick(() => messages.value.push({ role: "assistant", content: "我会基于当前工作区的数据继续分析。", sources: ["stats.json"] })) }
function copyCode(event: Event) { const code = (event.currentTarget as HTMLElement).closest(".code-wrap")?.querySelector("code")?.textContent ?? ""; navigator.clipboard?.writeText(code) }
function wrapCodeBlocks() { document.querySelectorAll(".chat-page .markdown pre").forEach((pre) => { if (pre.parentElement?.classList.contains("code-wrap")) return; const wrap = document.createElement("div"); wrap.className = "code-wrap"; pre.replaceWith(wrap); wrap.append(pre); const button = document.createElement("button"); button.className = "copy-code"; button.type = "button"; button.textContent = "复制"; button.addEventListener("click", copyCode); wrap.append(button) }) }
onMounted(() => nextTick(wrapCodeBlocks))
onUpdated(() => nextTick(wrapCodeBlocks))
</script>

<template>
  <div class="chat-page">
    <PageHeader title="AI 助手" description="与工作区数据对话，快速获得洞察"><Button class="mobile-only" icon="pi pi-comments" label="会话" outlined @click="mobileOpen = true" /></PageHeader>
    <div class="chat-layout">
      <aside class="conversation-sidebar desktop-only"><div class="flex items-center justify-between gap-2 mb-3"><strong>会话</strong><Button label="新建" icon="pi pi-plus" size="small" @click="createConversation" /></div><IconField class="w-full mb-3"><InputIcon class="pi pi-search" /><InputText v-model="conversationSearch" placeholder="搜索会话" fluid /></IconField><div class="conversation-list"><template v-for="group in groupedConversations" :key="group.label"><div class="conversation-group text-xs muted">{{ group.label }}</div><button v-for="item in group.items" :key="item.id" class="conversation-item" :class="{ active: item.id === activeConversation }" @click="activeConversation = item.id"><span class="min-w-0 flex-1"><strong class="truncate">{{ item.title }}</strong><small>{{ item.time }}</small></span><Badge v-if="item.unread" :value="item.unread" severity="danger" /></button></template></div></aside>
      <Drawer v-model:visible="mobileOpen" header="会话" class="mobile-conversations" position="left"><Button label="新建会话" icon="pi pi-plus" fluid outlined @click="createConversation(); mobileOpen = false" /><div class="conversation-list mt-3"><template v-for="group in groupedConversations" :key="group.label"><div class="conversation-group text-xs muted">{{ group.label }}</div><button v-for="item in group.items" :key="item.id" class="conversation-item" :class="{ active: item.id === activeConversation }" @click="activeConversation = item.id; mobileOpen = false"><span class="min-w-0 flex-1"><strong class="truncate">{{ item.title }}</strong><small>{{ item.time }}</small></span><Badge v-if="item.unread" :value="item.unread" severity="danger" /></button></template></div></Drawer>
      <section class="chat-main">
        <div class="chat-heading"><div><strong>{{ activeConversationTitle }}</strong><div class="text-xs muted">Acme Console 数据助手</div></div><Select v-model="model" :options="chat.models" size="small" /></div>
        <div v-if="messages.length" class="message-stream"><article v-for="(message, index) in messages" :key="`${index}-${message.content}`" class="message-row" :class="message.role"><Avatar :label="message.role === 'user' ? '林' : 'A'" shape="circle" /><div class="message-content"><div class="message-meta text-xs muted">{{ message.role === "user" ? "林晓" : "Acme 助手" }} · {{ message.time ?? "刚刚" }}</div><div class="message-bubble"><div class="markdown" v-html="rendered(message.content)" /><div v-if="message.streaming" class="typing"><span /><span /><span />正在生成…</div><div v-if="message.sources?.length" class="sources"><span class="text-xs muted">引用来源</span><Chip v-for="source in message.sources" :key="source" :label="source" /></div></div><Accordion v-if="message.tool" class="tool-card"><AccordionPanel value="0"><AccordionHeader>工具调用 · {{ message.tool.name }}</AccordionHeader><AccordionContent><pre class="text-xs">{{ JSON.stringify(message.tool.args, null, 2) }}</pre><span class="text-xs muted">状态：{{ message.tool.status }}</span></AccordionContent></AccordionPanel></Accordion></div></article></div>
        <div v-else class="empty-state chat-empty"><i class="pi pi-sparkles" style="font-size: 2rem" /><h2>你好，我是 Acme 助手</h2><p>选择一个建议，开始探索你的工作区数据。</p><div class="suggestion-grid"><Button v-for="suggestion in chat.suggestions" :key="suggestion" :label="suggestion" severity="secondary" outlined @click="draft = suggestion" /></div></div>
        <div class="composer"><div class="suggestions"><Chip v-for="suggestion in chat.suggestions" :key="suggestion" :label="suggestion" class="suggestion-chip" @click="draft = suggestion" /></div><div class="composer-row"><Button icon="pi pi-paperclip" text rounded severity="secondary" aria-label="添加附件" /><Textarea v-model="draft" auto-resize rows="1" maxlength="2000" placeholder="输入消息，按 Enter 发送" fluid @keydown.enter.exact.prevent="send" /><Button icon="pi pi-send" rounded aria-label="发送" :disabled="!draft.trim()" @click="send" /></div><div class="flex justify-between text-xs muted"><span>{{ draft.length }}/2000</span><span><span class="kbd">Enter</span> 发送 · <span class="kbd">Shift+Enter</span> 换行</span></div></div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.chat-layout { display: grid; grid-template-columns: 260px minmax(0, 1fr); min-height: calc(100vh - 150px); border: 1px solid var(--p-content-border-color); border-radius: var(--p-content-border-radius); overflow: hidden; }
.conversation-sidebar { border-right: 1px solid var(--p-content-border-color); padding: 16px; background: var(--p-content-background); }
.conversation-list { display: flex; flex-direction: column; gap: 4px; } .conversation-group { padding: 8px 10px 4px; font-weight: 600; text-transform: uppercase; letter-spacing: .02em; } .conversation-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px; border: 0; border-radius: var(--p-content-border-radius); background: transparent; color: var(--p-text-color); text-align: left; cursor: pointer; } .conversation-item:hover, .conversation-item.active { background: var(--p-highlight-background); } .conversation-item strong, .conversation-item small { display: block; } .conversation-item small { color: var(--p-text-muted-color); font-size: 11px; margin-top: 2px; }
.chat-main { display: flex; flex-direction: column; min-width: 0; background: var(--p-surface-50); } .dark .chat-main { background: var(--p-surface-950); }
.chat-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 20px; border-bottom: 1px solid var(--p-content-border-color); background: var(--p-content-background); }
.message-stream { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; } .message-row { display: flex; align-items: flex-start; gap: 10px; max-width: min(780px, 100%); } .message-row.user { margin-left: auto; flex-direction: row-reverse; } .message-content { min-width: 0; max-width: 100%; flex: 0 1 auto; } .message-bubble { padding: 12px 14px; max-width: 100%; overflow: hidden; border: 1px solid var(--p-content-border-color); border-radius: 14px; background: var(--p-content-background); } .message-row.user .message-bubble { background: var(--p-highlight-background); }
.markdown :deep(p) { margin: 0 0 10px; } .markdown :deep(p:last-child) { margin-bottom: 0; } .markdown :deep(table) { width: 100%; border-collapse: collapse; margin-top: 10px; } .markdown :deep(th), .markdown :deep(td) { padding: 6px 8px; border: 1px solid var(--p-content-border-color); text-align: left; } .markdown :deep(code) { padding: 2px 4px; border-radius: 4px; background: var(--p-surface-100); color: var(--p-text-color); } .dark .markdown :deep(code) { background: var(--p-surface-800); } .markdown :deep(.code-wrap) { position: relative; max-width: 100%; min-width: 0; } .markdown :deep(pre) { margin: 10px 0; padding: 12px; padding-top: 42px; max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; background: var(--p-surface-900); color: var(--p-surface-0); border-radius: 8px; } .dark .markdown :deep(pre) { background: var(--p-surface-950); border: 1px solid var(--p-surface-700); } .markdown :deep(pre code) { padding: 0; background: transparent; color: inherit; white-space: pre; } .markdown :deep(.copy-code) { position: absolute; top: 8px; right: 8px; min-width: 40px; min-height: 40px; border: 1px solid var(--p-surface-600); background: transparent; color: var(--p-surface-0); padding: 6px 12px; border-radius: 6px; cursor: pointer; }
.sources { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 10px; } .tool-card { margin-top: 8px; } .tool-card pre { white-space: pre-wrap; margin: 0; }
.composer { padding: 12px 20px 16px; border-top: 1px solid var(--p-content-border-color); background: var(--p-content-background); } .suggestions { display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 6px; margin-bottom: 8px; scrollbar-width: none; } .suggestions::-webkit-scrollbar { display: none; } .suggestion-chip { flex: none; cursor: pointer; white-space: nowrap; } .composer-row { display: flex; align-items: flex-end; gap: 8px; } .composer-row > .p-button { flex: none; width: 2.5rem; height: 2.5rem; } .composer-row :deep(textarea) { max-height: 140px; } .chat-empty { flex: 1; min-height: 360px; }
.message-meta { margin-bottom: 4px; } .message-row.user .message-meta { text-align: right; }
.typing { display: flex; align-items: center; gap: 5px; } .typing span { width: 6px; height: 6px; border-radius: 50%; background: var(--p-primary-color); animation: pulse 1s infinite; } .typing span:nth-child(2) { animation-delay: .15s; } .typing span:nth-child(3) { animation-delay: .3s; } @keyframes pulse { 50% { opacity: .25; transform: translateY(-2px); } }
.suggestion-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; max-width: 520px; }
@media (max-width: 767px) { .chat-layout { display: block; border: 0; min-height: calc(100vh - 130px); } .chat-heading { padding: 12px; } .message-stream { padding: 16px 8px; } .composer { padding: 10px 8px 12px; } .suggestion-grid { grid-template-columns: 1fr; } }
</style>
