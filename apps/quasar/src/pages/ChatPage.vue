<script setup lang="ts">
import { computed, ref } from "vue"
import { useQuasar } from "quasar"
import { marked } from "marked"
import chat from "@ui-gallery/spec/mock/chat.json"
import AppIcon from "../icons/AppIcon.vue"

const $q = useQuasar()
const drawer = ref(false)
const selected = ref(chat.conversations[0]?.id ?? "")
const search = ref("")
const input = ref("")
const model = ref(chat.models[0])
const state = new URLSearchParams(window.location.search).get("state")
const conversations = computed(() => chat.conversations.filter((item) => item.title.includes(search.value)))

function markdown(value: string) {
  return marked.parse(value, { async: false }) as string
}

function code(value: string) {
  return value.match(/```(?:\w+)?\n([\s\S]*?)```/)?.[1] ?? ""
}

async function copy(value: string) {
  if (value && navigator.clipboard) await navigator.clipboard.writeText(value)
  $q.notify({ type: "positive", message: "代码已复制" })
}

function useSuggestion(value: string) {
  input.value = value
}

function send() {
  if (!input.value.trim()) return
  input.value = ""
  $q.notify({ type: "positive", message: "消息已发送" })
}
</script>

<template>
  <div class="chat-page">
    <q-card v-if="state === 'empty'" bordered class="chat-empty text-center q-pa-xl">
      <AppIcon name="sparkles" size="48" class="text-primary" />
      <div class="text-h5 q-mt-md">你好，我是 AI 助手</div>
      <div class="text-body2 text-grey-7 q-mt-sm">从一个问题开始探索你的业务数据。</div>
      <div class="row justify-center q-gutter-sm q-mt-lg"><q-card v-for="suggestion in chat.suggestions" :key="suggestion" bordered class="q-pa-md cursor-pointer" @click="useSuggestion(suggestion)">{{ suggestion }}</q-card></div>
    </q-card>
    <q-card v-else bordered class="chat-card">
      <q-drawer v-model="drawer" side="left" overlay bordered class="lt-md">
        <q-list padding><q-item-label header>对话</q-item-label><q-item v-for="item in conversations" :key="item.id" clickable :active="selected === item.id" active-class="text-primary" @click="selected = item.id; drawer = false"><q-item-section><q-item-label>{{ item.title }}</q-item-label><q-item-label caption>{{ item.time }}</q-item-label></q-item-section><q-item-section side><q-badge v-if="item.unread" rounded color="primary">{{ item.unread }}</q-badge></q-item-section></q-item></q-list>
      </q-drawer>
      <div class="row no-wrap fit">
        <aside class="chat-sidebar gt-sm"><div class="row items-center q-gutter-sm"><div class="text-h6">对话</div><q-space /><q-btn flat round dense @click="drawer = true"><AppIcon name="plus" /></q-btn></div><q-input v-model="search" dense outlined placeholder="搜索对话..." class="q-mt-md"><template #prepend><AppIcon name="search" :size="16" /></template></q-input><q-list class="q-mt-md"><q-item-label header>今天</q-item-label><q-item v-for="item in conversations.slice(0, 1)" :key="item.id" clickable :active="selected === item.id" active-class="text-primary" @click="selected = item.id"><q-item-section><q-item-label>{{ item.title }}</q-item-label><q-item-label caption>{{ item.time }}</q-item-label></q-item-section><q-item-section side><q-badge v-if="item.unread" rounded color="primary">{{ item.unread }}</q-badge></q-item-section></q-item><q-item-label header>更早</q-item-label><q-item v-for="item in conversations.slice(1)" :key="item.id" clickable :active="selected === item.id" active-class="text-primary" @click="selected = item.id"><q-item-section><q-item-label>{{ item.title }}</q-item-label><q-item-label caption>{{ item.time }}</q-item-label></q-item-section></q-item></q-list></aside>
        <main class="col chat-main"><div class="row items-center q-pa-md border-bottom"><q-btn class="lt-md" flat round dense @click="drawer = true"><AppIcon name="menu" /></q-btn><div class="text-h6 q-ml-sm">{{ conversations.find((item) => item.id === selected)?.title }}</div><q-space /><q-btn color="primary" label="新建" @click="selected = chat.conversations[0]?.id ?? ''" /></div><div class="chat-messages q-pa-md">
          <template v-for="(message, index) in chat.messages" :key="`${message.role}-${index}`">
            <q-chat-message v-if="message.role === 'user'" sent :text="[message.content]" stamp="刚刚" />
            <q-chat-message v-else stamp="刚刚">
              <template #avatar><q-avatar color="primary" text-color="white">A</q-avatar></template>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="markdown-body" v-html="markdown(message.content)" />
              <q-btn v-if="code(message.content)" flat dense no-caps @click="copy(code(message.content))"><AppIcon name="copy" :size="16" class="q-mr-xs" />复制代码</q-btn>
              <div v-if="message.sources" class="row q-gutter-xs q-mt-sm"><q-chip v-for="source in message.sources" :key="source" dense>{{ source }}</q-chip></div>
              <q-expansion-item v-if="message.tool" dense bordered class="q-mt-sm" label="工具调用">
                <template #header><q-item-section><div class="row items-center q-gutter-sm"><span>{{ message.tool.name }}</span><q-badge color="positive">{{ message.tool.status }}</q-badge></div></q-item-section></template>
                <pre>{{ JSON.stringify(message.tool.args, null, 2) }}</pre>
              </q-expansion-item>
              <q-spinner-dots v-if="message.streaming" color="primary" size="20px" />
            </q-chat-message>
          </template>
        </div><div class="chat-composer q-pa-md"><div class="row q-gutter-xs q-mb-sm"><q-chip v-for="suggestion in chat.suggestions" :key="suggestion" clickable @click="useSuggestion(suggestion)">{{ suggestion }}</q-chip></div><div class="row items-end q-gutter-sm"><q-btn flat round dense><AppIcon name="paperclip" /></q-btn><q-input v-model="input" type="textarea" autogrow :rows="1" label="输入消息" class="col" @keydown.enter.exact.prevent="send" /><q-select v-model="model" dense outlined :options="chat.models" style="width: 150px" /><q-btn round color="primary" @click="send"><AppIcon name="send" color="white" /></q-btn></div><div class="text-caption text-grey-7 q-mt-xs">Enter 发送 · Shift+Enter 换行 · {{ input.length }}/2000</div></div></main>
      </div>
    </q-card>
  </div>
</template>
