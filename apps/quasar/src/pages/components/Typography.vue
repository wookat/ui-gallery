<script setup lang="ts">
import AppIcon from "../../icons/AppIcon.vue"
import DemoBlock from "./DemoBlock.vue"

const names = ["Typography", "QIcon", "QSeparator", "Kbd", "Code", "Link"]
const aliases: Record<string, string[]> = { QSeparator: ["Divider"] }
const titles: Record<string, string> = { QSeparator: "QSeparator / Divider" }
</script>

<template>
  <DemoBlock v-for="name in names" :id="name" :ids="aliases[name]" :key="name" :title="titles[name] ?? name">
    <template v-if="name === 'Typography'">
      <div class="typography-scale">
        <div class="text-h1">Heading 1</div>
        <div class="text-h2">Heading 2</div>
        <div class="text-h3">Heading 3</div>
        <div class="text-h4">Heading 4</div>
        <div class="text-h5">Heading 5</div>
        <div class="text-h6">Heading 6</div>
        <div class="text-subtitle1 q-mt-md">Subtitle 1</div>
        <div class="text-subtitle2">Subtitle 2</div>
        <div class="text-body1">Body 1：一段用于展示正文层级的中文内容。</div>
        <div class="text-body2">Body 2：一段用于展示辅助正文的中文内容。</div>
        <div class="text-caption">Caption text</div>
        <div class="text-overline">OVERLINE</div>
        <div class="row q-gutter-md q-mt-md items-center"><code class="component-code">const ready = true</code><kbd class="component-kbd">⌘ K</kbd></div>
        <blockquote class="text-grey-8 q-pl-md q-mt-md" style="border-left: 4px solid var(--q-primary)">默认主题提供清晰、稳定的内容层级。</blockquote>
        <div class="q-mt-md"><a href="#q-btn" class="text-primary">跳转到按钮</a></div>
        <ul><li>无序列表项目</li><li>第二个项目</li></ul>
        <ol><li>有序列表项目</li><li>第二个项目</li></ol>
      </div>
    </template>
    <template v-else-if="name === 'QIcon'">
      <div class="row q-gutter-md items-center">
        <AppIcon v-for="icon in ['home', 'search', 'settings', 'check-circle', 'sparkles']" :key="icon" :name="icon" :size="28" />
      </div>
      <div class="text-caption text-grey-7 q-mt-sm">Material 图标与 AppIcon 适配器均支持当前 URL 图标集。</div>
    </template>
    <template v-else-if="name === 'QSeparator'">
      <div class="text-caption q-mb-sm">Horizontal</div>
      <q-separator />
      <div class="row items-center q-my-md"><q-separator class="col" /><span class="q-px-md text-caption">with text</span><q-separator class="col" /></div>
      <div class="row" style="height: 48px"><q-separator vertical inset /></div>
    </template>
    <template v-else-if="name === 'Kbd'">
      <span class="component-kbd">Ctrl</span> + <span class="component-kbd">Enter</span>
    </template>
    <template v-else-if="name === 'Code'">
      <code class="component-code">npm run build</code>
    </template>
    <template v-else>
      <a href="#q-btn" class="text-primary">这是一个链接组件示例</a>
    </template>
  </DemoBlock>
</template>
