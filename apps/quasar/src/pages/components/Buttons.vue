<script setup lang="ts">
import { ref } from "vue"
import AppIcon from "../../icons/AppIcon.vue"
import DemoBlock from "./DemoBlock.vue"

const names = ["QBtn", "QBtnGroup", "QBtnToggle", "QBtnDropdown", "QFab", "QFabAction", "QRouteTab"]
const toggle = ref("one")
const fab = ref(false)
const aliases: Record<string, string[]> = {
  QBtn: ["Button", "IconButton"],
  QBtnGroup: ["ButtonGroup"],
  QBtnDropdown: ["Dropdown"],
  QFab: ["FloatButton"],
  QBtnToggle: ["Segmented"],
}
</script>

<template>
  <DemoBlock v-for="name in names" :id="name" :ids="aliases[name]" :key="name" :title="name">
    <template v-if="name === 'QBtn'">
      <div class="row q-gutter-sm items-center">
        <q-btn color="primary" label="主按钮" />
        <q-btn flat color="primary" label="Flat" />
        <q-btn outline color="primary" label="Outline" />
        <q-btn push color="secondary" label="Push" />
        <q-btn unelevated color="accent" label="Unelevated" />
        <q-btn rounded color="positive" label="Rounded" />
        <q-btn glossy color="warning" label="Glossy" />
        <q-btn disable color="negative" label="禁用" />
        <q-btn :loading="true" color="primary" label="加载中"><template #loading><q-spinner-dots /></template></q-btn>
      </div>
      <div class="row q-gutter-sm items-center q-mt-md">
        <q-btn v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :size="size" color="primary" :label="size" />
        <q-btn no-caps color="primary" label="no-caps" />
        <q-btn href="#q-input" flat color="primary" label="链接按钮" />
      </div>
      <div class="row q-gutter-sm items-center q-mt-md">
        <q-btn flat color="primary" label="Flat row" />
        <q-btn outline color="secondary" label="Outline row" />
        <q-btn push color="accent" label="Push row" />
        <q-btn unelevated color="positive" label="Unelevated row" />
        <q-btn rounded color="warning" label="Rounded row" />
        <q-btn glossy color="negative" label="Glossy row" />
      </div>
      <div class="row q-gutter-sm items-center q-mt-md">
        <q-btn v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="`round-${size}`" round dense :size="size" color="primary"><AppIcon name="plus" /></q-btn>
      </div>
    </template>
    <template v-else-if="name === 'QBtnGroup'">
      <div class="q-gutter-md">
        <q-btn-group><q-btn label="左" /><q-btn label="中" /><q-btn label="右" /></q-btn-group>
        <q-btn-group outline><q-btn label="Outline" /><q-btn label="Group" /></q-btn-group>
        <q-btn-group spread rounded color="primary"><q-btn label="平均" /><q-btn label="分布" /></q-btn-group>
      </div>
    </template>
    <template v-else-if="name === 'QBtnToggle'">
      <div class="q-gutter-md">
        <q-btn-toggle v-model="toggle" color="primary" :options="[{ label: '日', value: 'one' }, { label: '周', value: 'two' }, { label: '月', value: 'three' }]" />
        <q-btn-toggle v-model="toggle" outline spread no-caps :options="[{ label: '邮件', value: 'one' }, { label: '推送', value: 'two' }]" />
      </div>
    </template>
    <template v-else-if="name === 'QBtnDropdown'">
      <q-btn-dropdown color="primary" label="操作"><q-list><q-item v-close-popup clickable><q-item-section>编辑</q-item-section></q-item><q-item v-close-popup clickable><q-item-section>复制</q-item-section></q-item></q-list></q-btn-dropdown>
      <q-btn-dropdown outline class="q-ml-sm" label="更多"><q-list><q-item v-close-popup clickable><q-item-section>查看详情</q-item-section></q-item></q-list></q-btn-dropdown>
    </template>
    <template v-else-if="name === 'QFab' || name === 'QFabAction'">
      <div class="relative-position" style="height: 160px"><q-btn color="primary" round class="absolute-bottom-right" @click="fab = !fab"><AppIcon name="plus" /></q-btn><q-fab v-model="fab" color="secondary" direction="up" class="absolute-bottom-left"><template #icon><AppIcon name="menu" /></template><q-fab-action color="primary" @click="fab = false"><AppIcon name="edit" /></q-fab-action><q-fab-action color="accent" @click="fab = false"><AppIcon name="send" /></q-fab-action></q-fab></div>
    </template>
    <template v-else>
      <q-tabs model-value="first" dense inline-label><q-route-tab name="first" label="首页" to="/" /><q-route-tab name="orders" label="订单" to="/orders" /></q-tabs>
    </template>
  </DemoBlock>
</template>
