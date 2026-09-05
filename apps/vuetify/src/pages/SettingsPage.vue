<script setup lang="ts">
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useDisplay, useTheme } from "vuetify"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import Icon from "@/components/Icon.vue"

const route = useRoute()
const { mdAndUp } = useDisplay()
const theme = useTheme()
const tab = ref("profile")
const removeDialog = ref(false)
const deleteText = ref("")
const saved = ref(false)
const noticeMode = ref("邮件")
const channels = ["邮件", "推送", "站内"]
const save = () => { saved.value = true; window.setTimeout(() => { saved.value = false }, 1800) }
</script>

<template>
  <div>
    <template v-if="route.query.state === 'loading'"><v-skeleton-loader type="heading, card, table" /></template>
    <template v-else-if="route.query.state === 'error'"><v-alert type="error" variant="tonal" title="设置加载失败">请重试。</v-alert></template>
    <template v-else>
      <div class="mb-5"><h1 class="text-h5 text-sm-h4">设置</h1><p class="text-body-2 text-medium-emphasis mt-1">管理个人资料、团队与订阅偏好。</p></div>
      <v-row>
        <v-col cols="12" md="3"><v-tabs v-model="tab" :direction="mdAndUp ? 'vertical' : 'horizontal'" show-arrows class="settings-tabs"><v-tab value="profile">个人资料</v-tab><v-tab value="security">账号安全</v-tab><v-tab value="notifications">通知</v-tab><v-tab value="team">团队</v-tab><v-tab value="billing">计费</v-tab></v-tabs></v-col>
        <v-col cols="12" md="9"><v-window v-model="tab">
          <v-window-item value="profile"><v-card title="个人资料" subtitle="更新你的公开信息"><v-card-text><div class="d-flex align-center ga-4 mb-5"><v-avatar size="72" color="secondary" text="林" /><v-btn variant="outlined"><Icon name="upload" />上传头像</v-btn></div><v-row><v-col cols="12" md="6"><v-text-field label="姓名" model-value="林晓" /></v-col><v-col cols="12" md="6"><v-select label="语言" :items="['简体中文', 'English', '日本語']" model-value="简体中文" /></v-col><v-col cols="12"><v-textarea label="简介" model-value="负责 Acme Console 的产品与团队协作。" /></v-col><v-col cols="12"><v-autocomplete label="时区" :items="['Asia/Shanghai', 'Asia/Tokyo', 'Europe/Berlin']" model-value="Asia/Shanghai" /></v-col></v-row><v-btn color="primary" @click="save">保存修改</v-btn></v-card-text></v-card></v-window-item>
          <v-window-item value="security"><v-card title="账号安全" subtitle="保护你的账户与登录会话"><v-card-text><v-row><v-col cols="12" md="4"><v-text-field label="当前密码" type="password" /></v-col><v-col cols="12" md="4"><v-text-field label="新密码" type="password" /></v-col><v-col cols="12" md="4"><v-text-field label="确认密码" type="password" /></v-col></v-row><v-switch label="启用两步验证" color="primary" /><div class="d-flex flex-wrap align-center ga-4 my-4"><v-sheet border rounded class="d-flex align-center justify-center" width="160" height="160"><Icon name="grid" size="32" /></v-sheet><div><div class="text-subtitle-1">扫码绑定验证器</div><div class="text-body-2 text-medium-emphasis">使用身份验证器应用保护账户。</div></div></div><v-divider class="my-4" /><div class="text-subtitle-1 mb-2">活跃会话</div><v-list lines="two"><v-list-item v-for="session in sessions" :key="session.device" :title="session.device" :subtitle="`${session.location} · ${session.time}`"><template #prepend><v-avatar color="primary" variant="tonal"><Icon name="smartphone" /></v-avatar></template><template #append><v-chip v-if="session.current" size="small" :color="theme.global.current.value.dark ? 'success' : 'success-darken-2'">当前会话</v-chip><v-btn v-else variant="text" size="small">注销</v-btn></template></v-list-item></v-list></v-card-text></v-card></v-window-item>
          <v-window-item value="notifications"><v-card title="通知偏好"><v-card-text><v-btn-toggle v-model="noticeMode" mandatory divided class="mb-5"><v-btn v-for="mode in channels" :key="mode" :value="mode">{{ mode }}</v-btn></v-btn-toggle><v-list lines="two"><v-list-item title="订单更新" subtitle="订单状态发生变化时通知"><template #append><v-switch hide-details color="primary" /></template></v-list-item><v-list-item title="团队活动" subtitle="有人评论、提及或加入团队时通知"><template #append><v-switch hide-details color="primary" /></template></v-list-item><v-list-item title="产品更新" subtitle="获取新功能和服务公告"><template #append><v-switch hide-details color="primary" /></template></v-list-item></v-list></v-card-text></v-card></v-window-item>
          <v-window-item value="team"><v-card title="团队成员" subtitle="管理团队访问权限"><v-card-text><div class="d-flex flex-wrap ga-2 mb-4"><v-text-field label="邀请成员邮箱" density="compact" hide-details /><v-btn color="primary">邀请</v-btn></div><v-data-table :headers="[{ title: '成员', key: 'name' }, { title: '角色', key: 'role' }, { title: '最近活跃', key: 'lastActive' }, { title: '', key: 'actions' }]" :items="team" density="comfortable"><template #[`item.name`]="{ item }"><div class="d-flex align-center ga-2"><v-avatar size="28" color="primary" variant="tonal">{{ item.name.slice(0, 1) }}</v-avatar><div><div>{{ item.name }}</div><div class="text-caption text-medium-emphasis">{{ item.email }}</div></div></div></template><template #[`item.role`]="{ item }"><v-select :items="['owner', 'admin', 'member', 'viewer']" :model-value="item.role" density="compact" hide-details /></template><template #[`item.actions`]="{}"><v-btn variant="text" color="error" size="small">移除</v-btn></template></v-data-table></v-card-text></v-card></v-window-item>
          <v-window-item value="billing"><v-card title="计费" subtitle="管理当前计划与发票"><v-card-text><v-card variant="tonal" color="primary" class="pa-4 mb-5"><div class="d-flex justify-space-between"><div><div class="text-overline">当前计划</div><div class="text-h5">Pro</div></div><v-chip>每月 ¥99</v-chip></div></v-card><v-row><v-col v-for="plan in plans" :key="plan.name" cols="12" sm="4"><v-card height="100%" variant="outlined" class="pa-4"><div class="d-flex justify-space-between align-start"><span class="text-h6">{{ plan.name }}</span><v-chip v-if="plan.recommended" size="small" color="primary">推荐</v-chip></div><div class="text-h5 my-3">{{ plan.price === null ? "联系我们" : `¥${plan.price}/月` }}</div><v-list density="compact"><v-list-item v-for="feature in plan.features" :key="feature" :title="feature"><template #prepend><Icon name="check" size="16" /></template></v-list-item></v-list></v-card></v-col></v-row><div class="text-subtitle-1 mt-6 mb-2">发票记录</div><v-data-table :headers="[{ title: '编号', key: 'id' }, { title: '日期', key: 'date' }, { title: '金额', key: 'amount' }, { title: '状态', key: 'status' }]" :items="invoices" density="comfortable" /></v-card-text></v-card></v-window-item>
        </v-window></v-col>
      </v-row>
      <v-card color="error" variant="outlined" class="mt-6" title="危险区" subtitle="删除账号后所有数据将无法恢复"><template #append><v-btn color="error" variant="outlined" @click="removeDialog = true">删除账号</v-btn></template></v-card>
      <v-snackbar v-model="saved" color="success">设置已保存</v-snackbar>
      <v-dialog v-model="removeDialog" max-width="440"><v-card title="确认删除账号"><v-card-text>请输入 DELETE 以确认删除。</v-card-text><v-card-text><v-text-field v-model="deleteText" label="确认文字" /></v-card-text><v-card-actions><v-spacer /><v-btn variant="text" @click="removeDialog = false">取消</v-btn><v-btn color="error" :disabled="deleteText !== 'DELETE'" @click="removeDialog = false">永久删除</v-btn></v-card-actions></v-card></v-dialog>
    </template>
  </div>
</template>

<style scoped>
.settings-tabs :deep(.v-tab) { justify-content: flex-start; }
@media (max-width: 959px) {
  .settings-tabs { overflow-x: auto; }
  .settings-tabs :deep(.v-slide-group__content) { flex-direction: row; }
  .settings-tabs :deep(.v-tab) { min-width: 110px; }
}
</style>
