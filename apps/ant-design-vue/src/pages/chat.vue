<script setup lang="ts">
import { computed, ref } from "vue"
import { marked } from "marked"
import { message } from "ant-design-vue"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "../icons"
const draft = ref("")
const active = ref(chat.conversations[0].id)
const mobileOpen = ref(false)
const empty = new URLSearchParams(location.search).get("empty") === "1"
const current = computed(() => chat.conversations.find((item) => item.id === active.value))
function markdown(value: string) { return marked.parse(value) as string }
function copy(value: string) { navigator.clipboard?.writeText(value); message.success("已复制") }
</script>
<template>
  <div class="page"><div class="page-header"><div><h1>AI 对话</h1><p class="muted">与团队智能助手协作，保留完整上下文。</p></div><a-button class="mobile-menu" @click="mobileOpen = true"><Icon name="message-square" />会话</a-button></div>
    <a-drawer v-model:open="mobileOpen" title="会话"><div class="chat-list"><a-input-search placeholder="搜索对话" /><a-button block class="section">新建对话</a-button><a-list class="section" :data-source="chat.conversations"><template #renderItem="{ item }"><a-list-item :class="{ active: active === item.id }" @click="active = item.id; mobileOpen = false"><span>{{ item.title }}<small class="muted">{{ item.time }}</small></span><a-badge v-if="item.unread" :count="item.unread" /></a-list-item></template></a-list></div></a-drawer>
    <div class="chat-layout"><aside class="chat-list"><div class="section-title"><strong>对话</strong><a-button type="text" shape="circle"><Icon name="plus" /></a-button></div><a-input-search placeholder="搜索对话" /><a-button block class="section">新建对话</a-button><a-list class="section" :data-source="chat.conversations"><template #renderItem="{ item }"><a-list-item :class="{ active: active === item.id }" @click="active = item.id"><span>{{ item.title }}<small class="muted">{{ item.time }}</small></span><a-badge v-if="item.unread" :count="item.unread" /></a-list-item></template></a-list></aside>
      <section class="chat-main"><header class="chat-header"><strong>{{ current?.title ?? "新对话" }}</strong><a-select :default-value="chat.models[0]" style="width:150px"><a-select-option v-for="model in chat.models" :key="model" :value="model">{{ model }}</a-select-option></a-select></header>
        <div v-if="empty || !current" class="chat-messages"><a-empty description="开始一次新的对话"><template #image><Icon name="bot" :size="36" /></template><a-row :gutter="[12, 12]"><a-col v-for="item in chat.suggestions" :key="item" :xs="24" :sm="12"><a-card hoverable @click="draft = item">{{ item }}</a-card></a-col></a-row></a-empty></div>
        <div v-else class="chat-messages"><div v-for="(item, index) in chat.messages" :key="index" class="message" :class="{ user: item.role === 'user' }"><a-avatar>{{ item.role === 'user' ? '林' : 'AI' }}</a-avatar><div class="bubble"><div class="muted">{{ item.role === 'user' ? '林晓' : 'AI 助手' }} · 刚刚</div><div v-if="item.role === 'assistant'" class="markdown" v-html="markdown(item.content)" /><span v-else>{{ item.content }}</span><div v-if="item.streaming" class="muted">生成中<span class="cursor">▋</span></div><div v-if="item.sources" class="source-list"><a-tag v-for="source in item.sources" :key="source">{{ source }}</a-tag></div><a-collapse v-if="item.tool" class="section"><a-collapse-panel key="tool" :header="`工具调用 · ${item.tool.name}`"><pre>{{ JSON.stringify(item.tool.args, null, 2) }}</pre></a-collapse-panel></a-collapse><a-button v-if="item.role === 'assistant' && item.content.includes('```')" size="small" class="section" @click="copy(item.content)">复制</a-button></div></div></div>
        <div class="composer"><div class="suggestions"><a-tag v-for="suggestion in chat.suggestions" :key="suggestion" @click="draft = suggestion">{{ suggestion }}</a-tag></div><a-textarea v-model:value="draft" :auto-size="{ minRows: 2, maxRows: 5 }" placeholder="向 AI 助手提问..." /><div class="composer-actions"><span class="muted">{{ draft.length }} / 2000 · Enter 发送 / Shift+Enter 换行</span><a-space><a-button type="text"><Icon name="paperclip" /></a-button><a-button type="primary" shape="circle"><Icon name="send" /></a-button></a-space></div></div>
      </section>
    </div>
  </div>
</template>
<style scoped>.chat-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--ant-color-border); }.chat-list :deep(.ant-list-item) { cursor:pointer; border-radius:8px; padding:10px; }.chat-list :deep(.ant-list-item.active), .chat-list :deep(.ant-list-item:hover) { background:var(--ant-color-fill-quaternary); }.chat-list small { display:block; }.suggestions { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px; }.suggestions .ant-tag { cursor:pointer; }.composer-actions { display:flex; justify-content:space-between; align-items:center; margin-top:8px; }.markdown :deep(pre) { padding:12px; border-radius:8px; background:#111; color:#eee; overflow:auto; }.markdown :deep(table) { border-collapse:collapse; width:100%; }.markdown :deep(th), .markdown :deep(td) { border:1px solid var(--ant-color-border); padding:6px; }.source-list { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }.cursor { animation:blink 1s infinite; } @keyframes blink { 50% { opacity:0; } } @media (max-width:767px) { .chat-layout { display:block; }.chat-layout > .chat-list { display:none; } }</style>
