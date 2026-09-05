<script setup lang="ts">
import { computed, ref } from "vue"
import MarkdownIt from "markdown-it"
import { NCard, NList, NListItem, NThing, NBadge, NButton, NInput, NSelect, NAvatar, NFlex, NText, NTag, NCollapse, NCollapseItem, NCode, NSpace, NDrawer, NDrawerContent, NScrollbar, NEmpty, NTooltip, NSpin, NDivider, useMessage } from "naive-ui"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "../icons"
import { useIsMobile } from "../composables"

type Msg = (typeof chat.messages)[number]
const md = new MarkdownIt({ html: false, linkify: false })
const message = useMessage()
const isMobile = useIsMobile()
const active = ref(chat.conversations[0]!.id)
const listOpen = ref(false)
const draft = ref("")
const model = ref(chat.models[0]!)
const modelOptions = chat.models.map((m) => ({ label: m, value: m }))
const messages = ref<Msg[]>(chat.messages)
const activeTitle = computed(() => chat.conversations.find((c) => c.id === active.value)?.title ?? "")
const isEmpty = computed(() => active.value !== chat.conversations[0]!.id)
const render = (text: string) => md.render(text)
function send() {
  if (!draft.value.trim()) return
  message.info("演示环境：消息未发送")
  draft.value = ""
}
function copy(text: string) { navigator.clipboard?.writeText(text).catch(() => undefined); message.success("已复制") }
</script>

<template>
  <div :style="{ display: 'flex', gap: '16px', height: isMobile ? 'calc(100vh - 92px)' : 'calc(100vh - 112px)', minHeight: '520px' }">
    <NCard v-if="!isMobile" size="small" style="width: 280px; flex: none" content-style="padding: 0; display: flex; flex-direction: column; height: 100%">
      <div style="padding: 12px"><NButton block type="primary" secondary><template #icon><Icon name="plus" /></template>新对话</NButton></div>
      <NScrollbar style="flex: 1">
        <NList hoverable clickable>
          <NListItem v-for="c in chat.conversations" :key="c.id" :style="{ background: c.id === active ? 'rgba(24,160,88,.08)' : undefined }" @click="active = c.id">
            <NThing :title="c.title" :description="c.time" content-indented><template #avatar><Icon name="message-circle" :size="18" /></template><template #header-extra><NBadge :value="c.unread" :show="c.unread > 0" /></template></NThing>
          </NListItem>
        </NList>
      </NScrollbar>
    </NCard>
    <NDrawer v-model:show="listOpen" placement="left" width="280"><NDrawerContent title="对话" closable body-content-style="padding: 0"><NList hoverable clickable><NListItem v-for="c in chat.conversations" :key="c.id" @click="active = c.id; listOpen = false"><NThing :title="c.title" :description="c.time"><template #header-extra><NBadge :value="c.unread" :show="c.unread > 0" /></template></NThing></NListItem></NList></NDrawerContent></NDrawer>

    <NCard size="small" style="flex: 1; min-width: 0" content-style="padding: 0; display: flex; flex-direction: column; height: 100%">
      <NFlex align="center" justify="space-between" style="padding: 10px 14px; border-bottom: 1px solid var(--n-border-color, rgba(128,128,128,.2))">
        <NFlex align="center" :size="8" :wrap="false" style="min-width: 0">
          <NButton v-if="isMobile" quaternary circle size="small" aria-label="对话列表" @click="listOpen = true"><template #icon><Icon name="list" /></template></NButton>
          <NText strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{{ activeTitle }}</NText>
        </NFlex>
        <NSelect v-model:value="model" :options="modelOptions" size="small" style="width: 160px" />
      </NFlex>
      <NScrollbar style="flex: 1" content-style="padding: 16px">
        <NEmpty v-if="isEmpty" description="这个对话还没有消息" style="margin-top: 80px">
<template #icon><Icon name="message-square" :size="40" /></template>
          <template #extra><NFlex justify="center" :wrap="true"><NButton v-for="s in chat.suggestions" :key="s" size="small" secondary round @click="draft = s">{{ s }}</NButton></NFlex></template>
        </NEmpty>
        <NSpace v-else vertical :size="20">
          <NFlex v-for="(m, i) in messages" :key="i" :justify="m.role === 'user' ? 'end' : 'start'" :wrap="false" :size="10">
            <NAvatar v-if="m.role === 'assistant'" round :size="32" color="#18a058"><Icon name="bot" :size="18" /></NAvatar>
            <div :style="{ maxWidth: isMobile ? '92%' : '75%', minWidth: 0 }">
              <NCard v-if="m.role === 'user'" size="small" embedded :bordered="false" style="border-radius: 12px 12px 4px 12px">{{ m.content }}</NCard>
              <template v-else>
                <NCollapse v-if="m.tool" style="margin-bottom: 8px">
<NCollapseItem :name="'tool' + i">
                  <template #header><NFlex align="center" :size="6"><Icon name="wrench" :size="14" /><NText code>{{ m.tool.name }}</NText><NTag size="tiny" :type="m.tool.status === 'done' ? 'success' : 'warning'" round :bordered="false">{{ m.tool.status }}</NTag></NFlex></template>
                  <NCode :code="JSON.stringify(m.tool.args, null, 2)" language="json" word-wrap />
                </NCollapseItem>
</NCollapse>
                <!-- eslint-disable-next-line vue/no-v-html -- markdown-it 渲染本地 mock，html 已关闭 -->
                <div class="md" v-html="render(m.content)" />
                <NFlex v-if="m.streaming" align="center" :size="6"><NSpin :size="14" /><NText depth="3" style="font-size: 12px">生成中…</NText></NFlex>
                <NFlex align="center" :size="4" style="margin-top: 6px" :wrap="true">
                  <NTooltip><template #trigger><NButton quaternary size="tiny" aria-label="复制" @click="copy(m.content)"><template #icon><Icon name="copy" :size="14" /></template></NButton></template>复制</NTooltip>
                  <NTooltip><template #trigger><NButton quaternary size="tiny" aria-label="重新生成"><template #icon><Icon name="refresh" :size="14" /></template></NButton></template>重新生成</NTooltip>
                  <template v-if="m.sources"><NDivider vertical /><NText depth="3" style="font-size: 12px">来源：</NText><NTag v-for="s in m.sources" :key="s" size="tiny" :bordered="false">{{ s }}</NTag></template>
                </NFlex>
              </template>
            </div>
            <NAvatar v-if="m.role === 'user'" round :size="32">林</NAvatar>
          </NFlex>
        </NSpace>
      </NScrollbar>
      <div style="padding: 12px 14px; border-top: 1px solid rgba(128,128,128,.2)">
        <NFlex v-if="!isEmpty" :size="6" :wrap="true" style="margin-bottom: 8px"><NButton v-for="s in chat.suggestions.slice(0, isMobile ? 2 : 4)" :key="s" size="tiny" secondary round @click="draft = s">{{ s }}</NButton></NFlex>
        <NInput v-model:value="draft" type="textarea" placeholder="输入消息，Enter 发送，Shift+Enter 换行" :autosize="{ minRows: 1, maxRows: 5 }" @keydown.enter.exact.prevent="send" />
        <NFlex justify="space-between" align="center" style="margin-top: 8px">
          <NFlex :size="4"><NButton quaternary size="small" aria-label="附件"><template #icon><Icon name="paperclip" /></template></NButton><NButton quaternary size="small" aria-label="语音"><template #icon><Icon name="mic" /></template></NButton></NFlex>
          <NButton type="primary" size="small" :disabled="!draft.trim()" @click="send"><template #icon><Icon name="send" :size="14" /></template>发送</NButton>
        </NFlex>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.md :deep(p) { margin: 0 0 8px; }
.md :deep(table) { border-collapse: collapse; margin: 8px 0; font-size: 13px; display: block; overflow-x: auto; max-width: 100%; }
.md :deep(th), .md :deep(td) { border: 1px solid rgba(128,128,128,.3); padding: 4px 10px; text-align: left; }
.md :deep(pre) { background: rgba(128,128,128,.12); padding: 10px 12px; border-radius: 6px; overflow-x: auto; font-size: 13px; margin: 8px 0; }
.md :deep(code) { font-family: v-mono, SFMono-Regular, Menlo, Consolas, monospace; }
</style>
