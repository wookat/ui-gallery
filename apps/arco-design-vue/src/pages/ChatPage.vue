<script setup lang="ts">
import { computed, ref } from "vue"
import { Message } from "@arco-design/web-vue"
import MarkdownIt from "markdown-it"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/lib/icons"

type ChatMessage = (typeof chat.messages)[number]

const md = new MarkdownIt({ html: false, linkify: false })
const active = ref(chat.conversations[0]!.id)
const model = ref(chat.models[0]!)
const draft = ref("")
const listOpen = ref(false)
const empty = ref(false)

const messages = computed<ChatMessage[]>(() => (empty.value ? [] : chat.messages))

interface Block {
  type: "markdown" | "code" | "table"
  content: string
  lang?: string
  header?: string[]
  rows?: string[][]
}

function splitBlocks(text: string): Block[] {
  const blocks: Block[] = []
  const lines = text.split("\n")
  let buffer: string[] = []
  const flush = () => {
    if (buffer.join("").trim()) blocks.push({ type: "markdown", content: buffer.join("\n") })
    buffer = []
  }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    if (line.startsWith("```")) {
      flush()
      const lang = line.slice(3).trim()
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i]!.startsWith("```")) code.push(lines[i++]!)
      blocks.push({ type: "code", lang, content: code.join("\n") })
    } else if (line.startsWith("|")) {
      flush()
      const tableLines: string[] = []
      while (i < lines.length && lines[i]!.startsWith("|")) tableLines.push(lines[i++]!)
      i--
      const cells = (row: string) => row.split("|").slice(1, -1).map((cell) => cell.trim())
      blocks.push({ type: "table", content: "", header: cells(tableLines[0]!), rows: tableLines.slice(2).map(cells) })
    } else {
      buffer.push(line)
    }
  }
  flush()
  return blocks
}

function render(text: string) {
  return md.render(text)
}

function copy(text: string) {
  navigator.clipboard?.writeText(text)
  Message.success("已复制")
}

function send() {
  if (!draft.value.trim()) return
  Message.info("演示模式：消息不会真正发送")
  draft.value = ""
}
</script>

<template>
  <div class="chat">
    <aside class="chat-list hide-mobile">
      <div class="between" style="padding: 12px 12px 8px">
        <strong>对话</strong>
        <a-button type="primary" size="small"><template #icon><Icon name="plus" /></template>新对话</a-button>
      </div>
      <div style="padding: 0 12px 8px"><a-input-search placeholder="搜索对话" size="small" allow-clear /></div>
      <a-menu :selected-keys="[active]" @menu-item-click="(key: string) => (active = key)">
        <a-menu-item v-for="conversation in chat.conversations" :key="conversation.id">
          <div class="between" style="gap: 8px">
            <span class="truncate">{{ conversation.title }}</span>
            <a-badge v-if="conversation.unread" :count="conversation.unread" :dot-style="{ fontSize: '10px' }" />
          </div>
          <div class="muted small">{{ conversation.time }}</div>
        </a-menu-item>
      </a-menu>
    </aside>

    <section class="chat-main">
      <header class="chat-header between">
        <a-space size="small">
          <a-button class="show-mobile" type="text" size="small" @click="listOpen = true"><template #icon><Icon name="menu" /></template></a-button>
          <strong class="truncate">{{ chat.conversations.find((c) => c.id === active)?.title }}</strong>
        </a-space>
        <a-space size="small">
          <a-select v-model="model" size="small" style="width: 160px">
            <a-option v-for="item in chat.models" :key="item" :value="item">{{ item }}</a-option>
          </a-select>
          <a-tooltip content="切换空状态"><a-button type="text" size="small" @click="empty = !empty"><template #icon><Icon name="refresh" /></template></a-button></a-tooltip>
        </a-space>
      </header>

      <div class="chat-stream">
        <div v-if="!messages.length" class="chat-empty">
          <a-avatar :size="56" shape="square" :style="{ backgroundColor: 'rgb(var(--primary-1))', color: 'rgb(var(--primary-6))' }"><Icon name="bot" :size="28" /></a-avatar>
          <a-typography-title :heading="5" style="margin: 16px 0 4px">开始新的对话</a-typography-title>
          <a-typography-text type="secondary">用自然语言查询业务数据，或从下面的建议开始。</a-typography-text>
          <div class="grid grid-2" style="margin-top: 24px; max-width: 560px; width: 100%">
            <a-card v-for="suggestion in chat.suggestions" :key="suggestion" hoverable size="small" @click="draft = suggestion">{{ suggestion }}</a-card>
          </div>
        </div>

        <div v-for="(message, index) in messages" :key="index" class="chat-message" :class="message.role">
          <a-avatar :size="32" :style="message.role === 'assistant' ? { backgroundColor: 'rgb(var(--primary-6))' } : {}">
            <Icon v-if="message.role === 'assistant'" name="bot" :size="18" /><template v-else>林</template>
          </a-avatar>
          <div class="chat-bubble-wrap">
            <div class="chat-bubble">
              <template v-for="(block, blockIndex) in splitBlocks(message.content)" :key="blockIndex">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-if="block.type === 'markdown'" class="markdown" v-html="render(block.content)" />
                <div v-else-if="block.type === 'table'" class="scroll-x" style="margin: 8px 0">
                  <a-table :columns="block.header!.map((title, i) => ({ title, dataIndex: String(i) }))" :data="block.rows!.map((row) => Object.fromEntries(row.map((cell, i) => [String(i), cell])))" :pagination="false" size="small" />
                </div>
                <div v-else class="code-block">
                  <div class="between code-head"><span>{{ block.lang || "text" }}</span><a-button type="text" size="mini" @click="copy(block.content)"><template #icon><Icon name="copy" :size="12" /></template>复制</a-button></div>
                  <pre><code>{{ block.content }}</code></pre>
                </div>
              </template>
              <span v-if="'streaming' in message && message.streaming" class="cursor" />
            </div>
            <a-card v-if="'tool' in message && message.tool" size="small" class="tool-card" :bordered="true">
              <div class="between">
                <a-space size="small"><Icon name="terminal" :size="14" /><a-typography-text code>{{ message.tool.name }}</a-typography-text></a-space>
                <a-tag size="small" :color="message.tool.status === 'done' ? 'green' : 'orange'">{{ message.tool.status }}</a-tag>
              </div>
              <pre class="tool-args">{{ JSON.stringify(message.tool.args) }}</pre>
            </a-card>
            <a-space v-if="'sources' in message && message.sources" wrap size="mini" style="margin-top: 6px">
              <a-tag v-for="source in message.sources" :key="source" size="small" bordered><template #icon><Icon name="file-text" :size="12" /></template>{{ source }}</a-tag>
            </a-space>
            <a-space v-if="message.role === 'assistant'" size="mini" class="chat-actions">
              <a-button type="text" size="mini" @click="copy(message.content)"><template #icon><Icon name="copy" :size="12" /></template></a-button>
              <a-button type="text" size="mini"><template #icon><Icon name="thumbs-up" :size="12" /></template></a-button>
              <a-button type="text" size="mini"><template #icon><Icon name="thumbs-down" :size="12" /></template></a-button>
              <a-button type="text" size="mini"><template #icon><Icon name="refresh" :size="12" /></template></a-button>
            </a-space>
          </div>
        </div>
      </div>

      <footer class="chat-input">
        <a-space v-if="messages.length" wrap size="mini" style="margin-bottom: 8px">
          <a-tag v-for="suggestion in chat.suggestions" :key="suggestion" checkable @check="draft = suggestion">{{ suggestion }}</a-tag>
        </a-space>
        <div class="chat-composer">
          <a-textarea v-model="draft" placeholder="输入消息，Enter 发送，Shift+Enter 换行" :auto-size="{ minRows: 1, maxRows: 5 }" @keydown.enter.exact.prevent="send" />
          <div class="between" style="margin-top: 8px">
            <a-space size="mini">
              <a-tooltip content="附件"><a-button type="text" size="small"><template #icon><Icon name="paperclip" /></template></a-button></a-tooltip>
              <a-tooltip content="语音"><a-button type="text" size="small"><template #icon><Icon name="mic" /></template></a-button></a-tooltip>
              <a-tag size="small" bordered class="hide-mobile">{{ model }}</a-tag>
            </a-space>
            <a-button type="primary" size="small" :disabled="!draft.trim()" @click="send"><template #icon><Icon name="send" /></template>发送</a-button>
          </div>
        </div>
        <div class="muted small" style="text-align: center; margin-top: 6px">AI 可能会出错，请核对重要信息。</div>
      </footer>
    </section>

    <a-drawer :visible="listOpen" placement="left" :width="280" :footer="false" title="对话" @cancel="listOpen = false">
      <a-menu :selected-keys="[active]" @menu-item-click="(key: string) => { active = key; listOpen = false }">
        <a-menu-item v-for="conversation in chat.conversations" :key="conversation.id">{{ conversation.title }}</a-menu-item>
      </a-menu>
    </a-drawer>
  </div>
</template>

<style scoped>
.chat {
  display: flex;
  height: calc(100vh - 60px - 48px);
  min-height: 520px;
  margin: -24px;
  border-top: 1px solid var(--color-border-1);
}

.chat-list {
  width: 260px;
  flex-shrink: 0;
  border-right: 1px solid var(--color-border-1);
  background: var(--color-bg-2);
  overflow-y: auto;
}

.chat-list :deep(.arco-menu-item) {
  height: auto;
  line-height: 1.4;
  padding: 8px 12px;
}

.chat-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border-1);
  background: var(--color-bg-2);
}

.chat-stream {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.chat-message {
  display: flex;
  gap: 12px;
  max-width: 820px;
  width: 100%;
  margin: 0 auto;
}

.chat-message.user {
  flex-direction: row-reverse;
}

.chat-bubble-wrap {
  min-width: 0;
  max-width: calc(100% - 44px);
}

.chat-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  background: var(--color-fill-2);
  line-height: 1.6;
}

.user .chat-bubble {
  background: rgb(var(--primary-6));
  color: #fff;
}

.markdown :deep(p) {
  margin: 0 0 6px;
}

.markdown :deep(p:last-child) {
  margin: 0;
}

.code-block {
  margin: 6px 0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-bg-1);
  border: 1px solid var(--color-border-2);
}

.code-head {
  padding: 4px 8px;
  font-size: 12px;
  color: var(--color-text-3);
  border-bottom: 1px solid var(--color-border-2);
}

.code-block pre {
  margin: 0;
  padding: 10px 12px;
  overflow-x: auto;
  font-size: 13px;
}

.tool-card {
  margin-top: 8px;
}

.tool-args {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--color-text-3);
  white-space: pre-wrap;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 14px;
  vertical-align: -2px;
  background: rgb(var(--primary-6));
  animation: blink 1s steps(2) infinite;
}

@keyframes blink {
  to {
    opacity: 0;
  }
}

.chat-actions {
  margin-top: 4px;
  opacity: 0.7;
}

.chat-input {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border-1);
  background: var(--color-bg-2);
}

.chat-composer {
  max-width: 820px;
  margin: 0 auto;
  padding: 10px 12px;
  border: 1px solid var(--color-border-2);
  border-radius: 12px;
  background: var(--color-bg-1);
}

.chat-composer :deep(.arco-textarea-wrapper) {
  border: 0;
  background: transparent;
}

.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media (max-width: 767px) {
  .chat {
    margin: -16px;
    height: calc(100vh - 60px - 32px);
  }
}
</style>
