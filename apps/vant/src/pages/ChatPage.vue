<script setup lang="ts">
import { computed, ref } from "vue"
import MarkdownIt from "markdown-it"
import chat from "@ui-gallery/spec/mock/chat.json"
import AppIcon from "@/components/AppIcon.vue"

const draft = ref("")
const empty = ref(false)
const drawer = ref(false)
const selected = ref(chat.conversations[0].id)
const model = ref(chat.models[0])
const modelPopup = ref(false)
const conversationQuery = ref("")
const copied = ref(false)
const md = new MarkdownIt({ html: false, linkify: true, typographer: true })
const activeConversation = computed(() => chat.conversations.find((item) => item.id === selected.value) ?? chat.conversations[0])
const headerTitle = computed(() => empty.value ? "新对话" : activeConversation.value.title)
const headerTime = computed(() => empty.value ? "" : activeConversation.value.time)
const conversations = computed(() => chat.conversations.filter((item) => item.title.toLowerCase().includes(conversationQuery.value.toLowerCase())))
const modelColumns = chat.models.map((text) => ({ text, value: text }))
const renderMarkdown = (value: string) => md.render(value)
const startNewConversation = () => { draft.value = ""; empty.value = true }
const selectConversation = (id: string) => { selected.value = id; empty.value = false; drawer.value = false }
const copy = async (value: string) => {
  try {
    await navigator.clipboard?.writeText(value)
    copied.value = true
    window.setTimeout(() => copied.value = false, 1200)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="page-title"><div><h1>AI 对话</h1><p>与团队智能助手协作</p></div><van-button class="mobile-only" type="primary" @click="drawer = true"><AppIcon name="menu" />对话</van-button></div>
    <div class="chat-layout">
      <aside class="chat-sidebar">
        <div class="between"><strong>对话</strong><van-button plain aria-label="新建对话" @click="startNewConversation"><AppIcon name="plus" /></van-button></div>
        <van-search v-model="conversationQuery" placeholder="搜索对话" />
        <van-button block type="primary" class="new-chat" @click="startNewConversation"><AppIcon name="plus" />新建对话</van-button>
        <van-cell v-for="item in conversations" :key="item.id" :title="item.title" :label="item.time" :class="{ active: item.id === selected }" @click="selectConversation(item.id)">
          <template #value><van-badge v-if="item.unread" :content="item.unread" /></template>
        </van-cell>
      </aside>
      <section class="chat-main">
        <header class="between" style="padding: 14px 18px; border-bottom: 1px solid var(--van-border-color)"><div class="chat-title"><strong>{{ headerTitle }}</strong><small v-if="headerTime" class="muted">{{ headerTime }}</small></div><van-button plain class="model-button" @click="modelPopup = true"><AppIcon name="bot" :size="16" />{{ model }}<AppIcon name="chevron-down" :size="14" /></van-button></header>
        <div v-if="empty" class="chat-messages"><van-empty description="开始一段新对话"><div class="suggestion-grid"><van-button v-for="item in chat.suggestions" :key="item" plain @click="draft = item; empty = false">{{ item }}</van-button></div></van-empty></div>
        <div v-else class="chat-messages">
          <article v-for="(message, index) in chat.messages" :key="`${message.role}-${index}`" class="message" :class="{ user: message.role === 'user' }">
            <span class="message-avatar">{{ message.role === "user" ? "林" : "AI" }}</span>
            <div class="bubble"><small class="bubble-meta">{{ message.role === "user" ? "林晓" : "AI 助手" }} · 刚刚</small><div v-if="message.role === 'assistant'" class="markdown" v-html="renderMarkdown(message.content)" /><div v-else>{{ message.content }}</div><div v-if="message.role === 'assistant'" class="inline"><van-tag v-for="source in message.sources" :key="source" plain size="medium" class="source-tag">{{ source }}</van-tag><van-button v-if="message.content.includes('SELECT')" plain size="small" @click="copy(message.content)"><AppIcon name="copy" />{{ copied ? "已复制" : "复制" }}</van-button></div><van-collapse v-if="message.tool" :model-value="[]"><van-collapse-item :title="`工具调用 · ${message.tool.name}`" name="tool"><pre>{{ JSON.stringify(message.tool.args, null, 2) }}</pre></van-collapse-item></van-collapse><div v-if="message.streaming" class="inline muted"><van-loading type="spinner" size="14" />正在输入...</div></div>
          </article>
        </div>
        <div class="composer"><div class="inline suggestion-row"><van-button v-for="suggestion in chat.suggestions" :key="suggestion" plain round size="small" @click="draft = suggestion">{{ suggestion }}</van-button></div><van-field v-model="draft" type="textarea" autosize rows="2" maxlength="2000" show-word-limit placeholder="向 AI 助手提问..."><template #left-icon><AppIcon name="paperclip" /></template><template #button><van-button type="primary" round @click="draft = ''"><AppIcon name="send" /></van-button></template></van-field><small class="muted">Enter 发送 · Shift + Enter 换行</small></div>
      </section>
    </div>
    <van-popup v-model:show="drawer" position="left" :style="{ width: '82%', height: '100%' }"><div class="chat-sidebar" style="height: 100%"><div class="between"><strong>对话</strong><van-button plain @click="drawer = false">关闭</van-button></div><van-search v-model="conversationQuery" placeholder="搜索对话" /><van-cell v-for="item in conversations" :key="item.id" :title="item.title" :label="item.time" @click="selectConversation(item.id)"><template #value><van-badge v-if="item.unread" :content="item.unread" /></template></van-cell></div></van-popup>
    <van-popup v-model:show="modelPopup" position="bottom"><van-picker :columns="modelColumns" @confirm="(item) => { model = String(item.selectedValues[0]); modelPopup = false }" /></van-popup>
  </div>
</template>

<style>
.new-chat { margin: 10px 0; }
.chat-sidebar .van-cell.active { background: var(--van-primary-color-light); }
.chat-sidebar .van-cell { border-radius: 8px; margin: 2px 0; }
.chat-title { display: grid; min-width: 0; }
.chat-title strong { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.model-button { flex: 0 0 auto; }
.model-button .van-button__text { display: inline-flex; align-items: center; gap: 6px; }
.chat-sidebar .van-cell__title { flex: 1 1 auto; min-width: 0; }
.chat-sidebar .van-cell__title span { display: block; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.chat-sidebar .van-cell__value { flex: 0 0 auto; display: inline-flex; align-items: center; margin-right: 6px; }
.suggestion-row { margin-bottom: 10px; overflow-x: auto; flex-wrap: nowrap; }
.suggestion-row .van-button { flex: 0 0 auto; white-space: nowrap; }
.suggestion-grid { display: grid; gap: 8px; max-width: 320px; }
.suggestion-grid .van-button { white-space: normal; height: auto; min-height: 42px; }
.message pre { overflow: auto; }
.markdown pre code, .message pre { white-space: pre-wrap; word-break: break-word; }
.bubble-meta { display: block; margin-bottom: 4px; color: var(--van-text-color-2); }
.bubble .source-tag { color: var(--van-text-color-2); border-color: currentColor; }
.message.user .bubble-meta { color: rgba(255, 255, 255, 0.92); }
.message-avatar { display: grid; place-items: center; flex: 0 0 auto; width: 32px; height: 32px; border-radius: 50%; background: var(--van-primary-color); color: #fff; font-size: 12px; }
</style>
