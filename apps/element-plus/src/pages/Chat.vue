<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { marked } from "marked"
import { ElMessage } from "element-plus"
import chat from "@ui-gallery/spec/mock/chat.json"
import Icon from "@/icons/Icon.vue"
import { useMobile } from "@/composables/useMobile"
const mobile = useMobile()
const conversationsOpen = ref(false)
const active = ref(chat.conversations[0].id)
const draft = ref("")
const model = ref(chat.models[0])
const copied = ref(false)
const selected = computed(() => chat.conversations.find((item) => item.id === active.value))
const messagesEl = ref<HTMLElement>()
const scrollToLatest = () => {
  const el = messagesEl.value
  if (el) el.scrollTop = el.scrollHeight
}
onMounted(() => {
  nextTick(scrollToLatest)
  document.fonts?.ready.then(() => nextTick(scrollToLatest))
  const el = messagesEl.value
  if (el && "ResizeObserver" in window) {
    const observer = new ResizeObserver(scrollToLatest)
    for (const child of el.children) observer.observe(child)
    el.addEventListener("wheel", () => observer.disconnect(), { once: true, passive: true })
    el.addEventListener("touchstart", () => observer.disconnect(), { once: true, passive: true })
    onBeforeUnmount(() => observer.disconnect())
  }
})
watch(active, () => nextTick(scrollToLatest))
type Conversation = (typeof chat.conversations)[number]
const groupOf = (item: Conversation) => (/刚刚|分钟|小时|今天/.test(item.time) ? "今天" : /昨天|^周/.test(item.time) ? "本周" : "更早")
const groups = computed(() =>
  ["今天", "本周", "更早"]
    .map((label) => ({ label, items: chat.conversations.filter((item) => groupOf(item) === label) }))
    .filter((group) => group.items.length),
)
const render = (content: string) => marked.parse(content) as string
const selectConversation = (id: string, closeDrawer = false) => {
  active.value = id
  if (closeDrawer) conversationsOpen.value = false
}
const send = () => {
  if (!draft.value.trim()) return
  ElMessage.success("消息已发送（演示）")
  draft.value = ""
}
const copy = (text: string) => {
  navigator.clipboard?.writeText(text)
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1200)
}
</script>

<template>
  <div class="page chat-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">AI 对话</h1>
        <p class="page-subtitle">与团队智能助手协作，保留完整上下文。</p>
      </div>
      <el-button v-if="mobile" @click="conversationsOpen = true"><Icon name="message-square" />对话列表</el-button>
    </div>
    <el-drawer v-if="mobile" v-model="conversationsOpen" title="对话" direction="ltr" size="290px"><div class="conversation-list">
      <el-input placeholder="搜索对话"><template #prefix><Icon name="search" /></template></el-input><el-button type="primary" class="full-width new-chat"><Icon name="plus" />新建对话</el-button><template v-for="group in groups" :key="group.label"><div class="group-label">{{ group.label }}</div><el-button
        v-for="item in group.items"
        :key="item.id"
        class="conversation"
        :type="active === item.id ? 'primary' : 'default'"
        plain
        @click="selectConversation(item.id, true)"
      ><span>{{ item.title }}<small>{{ item.time }}</small></span><el-badge v-if="item.unread" :value="item.unread" /></el-button></template></div></el-drawer>
    <el-card class="chat-card"><aside v-if="!mobile" class="conversation-pane">
                                 <div class="conversation-heading">
                                   <b>对话</b><el-button text><Icon name="plus" /></el-button>
                                 </div>
                                 <el-input placeholder="搜索对话"><template #prefix><Icon name="search" /></template></el-input><el-button type="primary" class="full-width new-chat"><Icon name="plus" />新建对话</el-button>
                                 <div class="conversation-list">
                                   <template v-for="group in groups" :key="group.label"><div class="group-label">{{ group.label }}</div><el-button
                                     v-for="item in group.items"
                                     :key="item.id"
                                     class="conversation"
                                     :type="active === item.id ? 'primary' : 'default'"
                                     plain
                                     @click="active = item.id"
                                   ><span>{{ item.title }}<small>{{ item.time }}</small></span><el-badge v-if="item.unread" :value="item.unread" /></el-button></template>
                                 </div>
                               </aside>
      <section class="chat-main">
        <header class="chat-header">
          <div>
            <b>{{ selected?.title }}</b><small>GPT-5 · 已连接</small>
          </div>
          <el-select v-model="model" style="width: 150px"><el-option v-for="item in chat.models" :key="item" :label="item" :value="item" /></el-select>
        </header>
        <div ref="messagesEl" class="messages">
          <template v-if="selected?.id === chat.conversations[0].id"><div v-for="(message, index) in chat.messages" :key="index" class="message" :class="message.role">
            <el-avatar>{{ message.role === "user" ? "林" : "AI" }}</el-avatar>
            <div class="message-body">
              <div class="message-meta">{{ message.role === "user" ? "林晓" : "AI 助手" }} · 刚刚</div>
              <div v-if="message.role === 'assistant'" class="bubble markdown" v-html="render(message.content)" />
              <div v-else class="bubble">{{ message.content }}</div>
              <div v-if="message.role === 'assistant' && message.content.includes('```')" class="code-actions">
                <el-button @click="copy(message.content)"><Icon name="copy" />{{ copied ? "已复制" : "复制代码" }}</el-button>
              </div>
              <div v-if="message.sources" class="sources">
                <el-tag v-for="source in message.sources" :key="source" size="small" effect="plain"><Icon name="paperclip" />{{ source }}</el-tag>
              </div>
              <el-collapse v-if="message.tool" class="tool"><el-collapse-item :title="`工具调用 · ${message.tool.name}`">
                <pre>{{ JSON.stringify(message.tool.args, null, 2) }}</pre>
              </el-collapse-item></el-collapse><span v-if="message.streaming" class="typing">● ● ●</span>
            </div>
          </div></template>
          <div v-else class="chat-empty">
            <Icon name="sparkles" :size="36" />
            <h2>你好，林晓，今天想聊什么？</h2>
            <p class="muted">{{ selected?.title }} · 从一个建议开始，或直接在下方输入。</p>
            <div class="suggestion-cards">
              <el-card
                v-for="suggestion in chat.suggestions"
                :key="suggestion"
                shadow="hover"
                class="suggestion-card"
                @click="draft = suggestion"
              ><Icon name="message-square" /><span>{{ suggestion }}</span></el-card>
            </div>
          </div>
        </div>
        <div class="composer">
          <div class="suggestions">
            <el-tag v-for="suggestion in chat.suggestions" :key="suggestion" round effect="plain" @click="draft = suggestion">{{
              suggestion
            }}</el-tag>
          </div>
          <el-input
            v-model="draft"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 7 }"
            maxlength="2000"
            show-word-limit
            placeholder="向 AI 助手提问..."
            @keydown.enter.exact.prevent="send"
          />
          <div class="composer-foot">
            <div class="composer-left">
              <el-button text aria-label="附件"><Icon name="paperclip" /></el-button><span class="muted"><kbd>Enter</kbd> 发送</span>
            </div>
            <el-button type="primary" @click="send"><Icon name="send" />发送</el-button>
          </div>
        </div>
      </section>
    </el-card>
  </div>
</template>

<style scoped>
.chat-card {
  padding: 0;
  overflow: hidden;
}
.chat-card > :deep(.el-card__body) {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  height: calc(100vh - 190px);
  min-height: 480px;
  padding: 0;
}
.conversation-pane {
  min-width: 0;
  overflow: hidden;
  padding: 16px;
  border-right: 1px solid var(--el-border-color);
}
.conversation-heading,
.chat-header,
.composer-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.new-chat {
  margin: 12px 0;
}
.conversation-list {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}
.conversation {
  display: flex;
  width: 100%;
  min-width: 0;
  height: auto;
  justify-content: space-between;
  margin-left: 0 !important;
  padding: 10px;
  text-align: left;
}
.conversation :deep(.el-badge__content.is-fixed) {
  position: static;
  transform: none;
  margin-left: 6px;
}
.conversation span {
  display: grid;
  gap: 4px;
  min-width: 0;
  flex: 1;
  overflow-wrap: anywhere;
}
.conversation small {
  color: var(--el-text-color-secondary);
}
.group-label {
  margin: 8px 0 2px;
  padding: 0 4px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.group-label:first-child {
  margin-top: 0;
}
.chat-main {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
}
.chat-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
}
.chat-header div {
  display: grid;
  gap: 4px;
}
.chat-header small {
  color: var(--el-text-color-secondary);
}
.messages {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 24px;
}
.message {
  display: flex;
  gap: 10px;
  max-width: 850px;
  min-width: 0;
  margin-bottom: 24px;
}
.message.user {
  flex-direction: row-reverse;
  margin-left: auto;
  text-align: right;
}
.message-body {
  max-width: 80%;
  min-width: 0;
}
.message-meta {
  margin-bottom: 6px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
.bubble {
  max-width: 100%;
  overflow-wrap: anywhere;
  padding: 12px 15px;
  border-radius: 12px;
  background: var(--el-fill-color-light);
  text-align: left;
  line-height: 1.65;
}
.user .bubble {
  color: #fff;
  background: var(--el-color-primary);
}
.markdown :deep(pre) {
  max-width: 100%;
  overflow-x: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  padding: 12px;
  border-radius: 8px;
  background: var(--el-bg-color-overlay);
}
.markdown :deep(table) {
  border-collapse: collapse;
}
.markdown :deep(th),
.markdown :deep(td) {
  padding: 6px 10px;
  border: 1px solid var(--el-border-color);
}
.sources {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}
.tool {
  margin-top: 10px;
}
.tool pre {
  overflow: auto;
  font-size: 12px;
}
.code-actions {
  margin-top: 5px;
}
.typing {
  display: inline-block;
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  animation: pulse 1.2s infinite;
}
.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  text-align: center;
}
.chat-empty h2 {
  margin: 8px 0 0;
  font-size: 22px;
}
.chat-empty p {
  margin: 0;
}
.suggestion-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 560px;
  margin-top: 16px;
}
.suggestion-card {
  cursor: pointer;
}
.suggestion-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 14px;
  height: auto;
  text-align: left;
}
.composer {
  padding: 16px;
  border-top: 1px solid var(--el-border-color);
}
.suggestions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.suggestions .el-tag {
  cursor: pointer;
}
.composer-foot {
  padding-top: 8px;
}
.composer-left {
  display: flex;
  align-items: center;
  gap: 4px;
}
.muted :deep(.el-icon) {
  vertical-align: middle;
}
kbd {
  padding: 2px 5px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 1;
  }
}
@media (max-width: 767px) {
  .chat-card {
    overflow: visible;
  }
  .chat-card > :deep(.el-card__body) {
    display: block;
    height: auto;
    min-height: 0;
  }
  .chat-main {
    display: block;
  }
  .messages {
    max-height: 55vh;
    padding: 16px;
  }
  .chat-empty {
    min-height: 320px;
  }
  .message-body {
    max-width: 88%;
  }
  .suggestion-cards {
    grid-template-columns: 1fr;
  }
}
</style>
