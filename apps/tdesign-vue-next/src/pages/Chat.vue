<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import { marked } from "marked"
import { MessagePlugin, type TextareaValue } from "tdesign-vue-next"
import chat from "@ui-gallery/spec/mock/chat.json"
import Icon from "@/components/Icon.vue"

type Message = (typeof chat.messages)[number]
const route = useRoute()
const empty = ref(route.query.state === "empty")
const drawer = ref(false)
const keyword = ref("")
const activeId = ref(chat.conversations[0].id)
const model = ref(chat.models[0])
const draft = ref("")
const copiedIndex = ref<number | null>(null)
const toolOpen = ref<(string | number)[]>([])

const conversations = computed(() => chat.conversations.filter((c) => c.title.toLowerCase().includes(keyword.value.trim().toLowerCase())))
const groups = computed(() => {
  const today = conversations.value.filter((c) => c.time === "刚刚" || c.time === "昨天")
  const earlier = conversations.value.filter((c) => !today.includes(c))
  return [{ title: "最近", items: today }, { title: "更早", items: earlier }].filter((g) => g.items.length)
})
const active = computed(() => chat.conversations.find((c) => c.id === activeId.value) ?? chat.conversations[0])
const messages = computed<Message[]>(() => (empty.value ? [] : chat.messages))

marked.setOptions({ gfm: true, breaks: true })
const render = (md: string) => marked.parse(md, { async: false })
const codeOf = (md: string) => md.match(/```[\w-]*\n([\s\S]*?)```/)?.[1]?.trim()

async function copy(text: string, i: number) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    /* clipboard may be unavailable in headless environments */
  }
  copiedIndex.value = i
  MessagePlugin.success("已复制")
  setTimeout(() => (copiedIndex.value = null), 1200)
}
function send(text = draft.value) {
  if (!text.trim()) return
  empty.value = false
  draft.value = ""
  MessagePlugin.info(`已发送：${text.slice(0, 20)}${text.length > 20 ? "…" : ""}`)
}
function onKeydown(_v: TextareaValue, ctx: { e: KeyboardEvent }) {
  if (ctx.e.key === "Enter" && (ctx.e.metaKey || ctx.e.ctrlKey)) {
    ctx.e.preventDefault()
    send()
  }
}
</script>

<template>
  <div class="ug-page ug-chat-page">
    <div class="ug-between">
      <div><t-typography-title level="h4" class="ug-title">AI 助手</t-typography-title><span class="ug-muted">与团队智能助手协作，保留完整上下文。</span></div>
      <t-button class="ug-mobile-only" variant="outline" size="large" @click="drawer = true"><template #icon><Icon name="list" /></template>会话</t-button>
    </div>

    <div class="ug-chat">
      <aside class="ug-chat-side ug-desktop-only">
        <div class="ug-between ug-chat-side-head">
          <span class="ug-chat-side-title">会话</span>
          <t-button variant="text" shape="square" size="large" aria-label="新建会话" @click="empty = true"><Icon name="plus" /></t-button>
        </div>
        <t-input v-model="keyword" placeholder="搜索会话" clearable size="small"><template #prefix-icon><Icon name="search" :size="14" /></template></t-input>
        <div v-for="g in groups" :key="g.title" class="ug-chat-group">
          <div class="ug-muted ug-small ug-chat-group-title">{{ g.title }}</div>
          <button v-for="c in g.items" :key="c.id" type="button" class="ug-conv" :class="{ 'ug-conv--active': c.id === activeId && !empty }" @click="activeId = c.id; empty = false">
            <Icon name="message-circle" :size="16" class="ug-muted" />
            <span class="ug-conv-title">{{ c.title }}</span>
            <span class="ug-muted ug-small">{{ c.time }}</span>
            <t-badge v-if="c.unread" :count="c.unread" size="small" class="ug-conv-badge" />
          </button>
        </div>
        <t-empty v-if="!conversations.length" size="small" title="无匹配会话" />
      </aside>

      <section class="ug-chat-main">
        <header class="ug-chat-head ug-between">
          <div class="ug-chat-head-text"><div class="ug-chat-head-title ug-ellipsis">{{ empty ? "新会话" : active.title }}</div><span class="ug-muted ug-small ug-ellipsis">{{ model }} · 已连接</span></div>
          <t-select v-model="model" :options="chat.models.map((m) => ({ label: m, value: m }))" auto-width borderless class="ug-chat-head-model" />
        </header>

        <div class="ug-chat-stream">
          <div v-if="empty" class="ug-chat-empty">
            <div class="ug-chat-empty-icon"><Icon name="sparkles" :size="24" /></div>
            <t-typography-title level="h5" class="ug-title">有什么可以帮你？</t-typography-title>
            <p class="ug-muted">选择一个建议开始，或直接输入问题。</p>
            <div class="ug-grid-2 ug-suggest-grid">
              <t-card v-for="s in chat.suggestions" :key="s" :bordered="true" hover-shadow class="ug-suggest-card" @click="send(s)">
                <div class="ug-row"><Icon name="lightbulb" class="ug-muted" /><span>{{ s }}</span></div>
              </t-card>
            </div>
          </div>

          <template v-else>
            <div v-for="(m, i) in messages" :key="i" class="ug-msg" :class="`ug-msg--${m.role}`">
              <t-avatar v-if="m.role === 'assistant'" size="small" class="ug-msg-avatar--ai"><template #icon><Icon name="bot" :size="14" /></template></t-avatar>
              <t-avatar v-else size="small">林</t-avatar>
              <div class="ug-msg-body">
                <div class="ug-msg-meta ug-muted ug-small">{{ m.role === "assistant" ? "助手" : "你" }} · {{ i === messages.length - 1 && "streaming" in m && m.streaming ? "正在输入…" : `${9 + i}:${String(12 + i * 3).padStart(2, "0")}` }}</div>
                <div class="ug-bubble">
                  <t-collapse v-if="'tool' in m && m.tool" v-model="toolOpen" borderless class="ug-tool" expand-icon-placement="right">
                    <t-collapse-panel :value="`tool-${i}`">
                      <template #header><span class="ug-row"><Icon name="tool" :size="14" /><code class="ug-code">{{ m.tool.name }}</code><t-tag size="small" theme="success" variant="light">{{ m.tool.status === "done" ? "已完成" : m.tool.status }}</t-tag></span></template>
                      <pre class="ug-pre">{{ JSON.stringify(m.tool.args, null, 2) }}</pre>
                    </t-collapse-panel>
                  </t-collapse>
                  <!-- eslint-disable-next-line vue/no-v-html -- content comes from repo mock JSON, not user input -->
                  <div class="ug-md" v-html="render(m.content)" />
                  <span v-if="'streaming' in m && m.streaming" class="ug-cursor" aria-hidden="true" />
                  <div v-if="codeOf(m.content) || ('sources' in m && m.sources)" class="ug-between ug-bubble-foot">
                    <div class="ug-row">
                      <template v-if="'sources' in m && m.sources"><span class="ug-muted ug-small">来源</span><t-tag v-for="s in m.sources" :key="s" size="small" variant="outline" shape="round">{{ s }}</t-tag></template>
                    </div>
                    <t-button v-if="codeOf(m.content)" size="small" variant="text" @click="copy(codeOf(m.content)!, i)"><template #icon><Icon :name="copiedIndex === i ? 'check' : 'copy'" :size="14" /></template>{{ copiedIndex === i ? "已复制" : "复制代码" }}</t-button>
                  </div>
                </div>
                <div v-if="m.role === 'assistant'" class="ug-row ug-msg-actions">
                  <t-button size="large" variant="text" shape="square" aria-label="赞"><Icon name="thumbs-up" :size="16" /></t-button>
                  <t-button size="large" variant="text" shape="square" aria-label="踩"><Icon name="thumbs-down" :size="16" /></t-button>
                  <t-button size="large" variant="text" shape="square" aria-label="复制" @click="copy(m.content, i)"><Icon name="copy" :size="16" /></t-button>
                  <t-button size="large" variant="text" shape="square" aria-label="重新生成"><Icon name="refresh" :size="16" /></t-button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <footer class="ug-chat-input">
          <div class="ug-row ug-chips">
            <t-tag v-for="s in chat.suggestions" :key="s" shape="round" variant="outline" class="ug-chip" @click="send(s)">{{ s }}</t-tag>
          </div>
          <div class="ug-composer">
            <t-textarea v-model="draft" placeholder="输入消息，Ctrl/⌘ + Enter 发送" :autosize="{ minRows: 1, maxRows: 6 }" :maxlength="2000" @keydown="onKeydown" />
            <div class="ug-between ug-composer-bar">
              <div class="ug-row">
                <t-button variant="text" shape="square" size="large" aria-label="附件"><Icon name="paperclip" /></t-button>
                <t-select v-model="model" :options="chat.models.map((m) => ({ label: m, value: m }))" size="small" auto-width />
                <span class="ug-muted ug-small ug-desktop-only">{{ draft.length }} / 2000</span>
              </div>
              <t-button theme="primary" size="large" :disabled="!draft.trim()" @click="send()"><template #icon><Icon name="send" :size="14" /></template>发送</t-button>
            </div>
          </div>
        </footer>
      </section>
    </div>

    <t-drawer v-model:visible="drawer" placement="left" size="300px" header="会话" :footer="false">
      <t-input v-model="keyword" placeholder="搜索会话" clearable size="small" style="margin-bottom: 12px" />
      <t-list :split="true">
        <t-list-item v-for="c in conversations" :key="c.id" @click="activeId = c.id; empty = false; drawer = false">
          <t-list-item-meta :title="c.title" :description="c.time" />
          <template #action><t-badge v-if="c.unread" :count="c.unread" size="small" /></template>
        </t-list-item>
      </t-list>
    </t-drawer>
  </div>
</template>

<style>
.ug-chat { display: grid; grid-template-columns: 260px minmax(0, 1fr); border: 1px solid var(--td-component-stroke); border-radius: var(--td-radius-large); overflow: hidden; background: var(--td-bg-color-container); min-height: 640px; }
.ug-chat-side { border-right: 1px solid var(--td-component-stroke); padding: 12px; background: var(--td-bg-color-secondarycontainer); display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.ug-chat-side-title { font-weight: 600; }
.ug-chat-group { display: flex; flex-direction: column; gap: 2px; }
.ug-chat-group-title { padding: 6px 8px 2px; }
.ug-conv { display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; align-items: center; gap: 8px; width: 100%; padding: 8px; border: 0; border-radius: var(--td-radius-medium); background: transparent; color: inherit; cursor: pointer; text-align: left; font: inherit; }
.ug-conv:hover { background: var(--td-bg-color-container-hover); }
.ug-conv--active { background: var(--td-brand-color-light); color: var(--td-brand-color); }
.ug-conv-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ug-conv-badge .t-badge--dot, .ug-conv-badge .t-badge--circle { position: static; transform: none; }
.ug-chat-main { display: flex; flex-direction: column; min-width: 0; }
.ug-chat-head { padding: 12px 16px; border-bottom: 1px solid var(--td-component-stroke); flex-wrap: nowrap; }
.ug-chat-head-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.ug-chat-head-title { font-weight: 600; }
.ug-chat-head-model { flex: 0 0 auto; max-width: 50%; }
.ug-chat-stream { flex: 1; padding: 20px 16px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; max-height: 520px; }
.ug-chat-empty { margin: auto; text-align: center; max-width: 560px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.ug-chat-empty-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--td-brand-color-light); color: var(--td-brand-color); display: grid; place-items: center; }
.ug-suggest-grid { width: 100%; gap: 12px; margin-top: 8px; }
.ug-suggest-card { cursor: pointer; text-align: left; }
.ug-msg { display: flex; gap: 10px; max-width: 820px; }
.ug-msg--user { align-self: flex-end; flex-direction: row-reverse; }
.ug-msg-body { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.ug-msg--user .ug-msg-body { align-items: flex-end; }
.ug-msg-avatar--ai { background: var(--td-brand-color) !important; }
.ug-bubble { padding: 10px 14px; border-radius: 12px; background: var(--td-bg-color-secondarycontainer); min-width: 0; max-width: 100%; overflow-x: auto; }
.ug-msg--user .ug-bubble { background: var(--td-brand-color); color: #fff; }
.ug-msg-actions { opacity: 0.7; gap: 0; margin: -4px 0 0 -8px; }
.ug-md p { margin: 0 0 8px; }
.ug-md p:last-child { margin-bottom: 0; }
.ug-md table { border-collapse: collapse; margin: 8px 0; font-size: 13px; }
.ug-md th, .ug-md td { border: 1px solid var(--td-component-stroke); padding: 4px 10px; text-align: left; }
.ug-md pre { margin: 0; padding: 10px 12px; border-radius: 8px; background: var(--td-bg-color-page); overflow-x: auto; font-size: 13px; line-height: 1.5; }
.ug-md code { font-family: var(--td-font-family, monospace); font-size: 13px; }
.ug-code { font-size: 12px; padding: 0 4px; border-radius: 4px; background: var(--td-bg-color-page); }
.ug-pre { margin: 0; font-size: 12px; white-space: pre-wrap; }
.ug-tool { margin-bottom: 8px; }
.ug-tool .t-collapse-panel__header { padding: 6px 8px; }
.ug-tool .t-collapse-panel__body { background: transparent; }
.ug-bubble-foot { margin-top: 8px; }
.ug-cursor { display: inline-block; width: 8px; height: 14px; background: var(--td-brand-color); vertical-align: -2px; margin-left: 2px; animation: ug-blink 1s steps(2) infinite; }
@keyframes ug-blink { to { opacity: 0; } }
.ug-chat-input { border-top: 1px solid var(--td-component-stroke); padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }
.ug-chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
.ug-chip { cursor: pointer; flex-shrink: 0; }
.ug-composer { border: 1px solid var(--td-component-stroke); border-radius: var(--td-radius-large); padding: 6px 8px; }
.ug-composer .t-textarea__inner { border: 0; box-shadow: none; background: transparent; resize: none; }
.ug-composer-bar { padding: 4px 4px 0; }
@media (max-width: 1023px) {
  .ug-chat { grid-template-columns: minmax(0, 1fr); }
  .ug-chat-side { display: none; }
  .ug-chat-page .ug-mobile-only { display: inline-flex; }
}
@media (max-width: 767px) {
  .ug-chat { min-height: 0; }
  .ug-chat-stream { max-height: max(240px, calc(100dvh - 400px)); padding: 16px 12px; }
  .ug-suggest-grid { grid-template-columns: minmax(0, 1fr); }
}
</style>
