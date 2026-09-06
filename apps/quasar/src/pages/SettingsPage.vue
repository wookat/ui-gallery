<script setup lang="ts">
import { ref } from "vue"
import { useQuasar } from "quasar"
import team from "@ui-gallery/spec/mock/team.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import AppIcon from "../icons/AppIcon.vue"
import PageHeader from "../components/PageHeader.vue"
import { statusColors } from "./shared"

const $q = useQuasar()
const tab = ref("profile")
const notificationMode = ref("mail")
const name = ref(team[0]?.name ?? "")
const bio = ref("Acme Console 管理员")
const language = ref("简体中文")
const timezone = ref("Asia/Shanghai")
const twoStep = ref(true)
const invite = ref("")
const deleteDialog = ref(false)
const deleteText = ref("")
const teamRows = team.map((member) => ({ ...member }))
const currentPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")
const roles = ["owner", "admin", "member", "viewer"]
const columns = [
  { name: "name", label: "成员", field: "name", align: "left" as const },
  { name: "role", label: "角色", field: "role", align: "left" as const },
  { name: "lastActive", label: "最近活跃", field: "lastActive", align: "left" as const },
  { name: "actions", label: "", field: "actions", align: "right" as const },
]
const invoiceColumns = [
  { name: "id", label: "发票", field: "id", align: "left" as const },
  { name: "date", label: "日期", field: "date", align: "left" as const },
  { name: "amount", label: "金额", field: "amount", align: "right" as const },
  { name: "status", label: "状态", field: "status", align: "left" as const },
]

function inviteMember() {
  if (!invite.value) return
  $q.notify({ type: "positive", message: "邀请已发送" })
  invite.value = ""
}
</script>

<template>
  <div class="q-gutter-y-lg">
    <PageHeader title="设置" description="管理个人资料、团队与账单。" />
    <div class="row q-col-gutter-lg items-start">
      <div class="col-12 col-md-3">
        <q-tabs v-model="tab" :vertical="$q.screen.gt.sm" :scrollable="$q.screen.lt.md" outside-arrows mobile-arrows align="left" inline-label no-caps active-color="primary" indicator-color="primary" class="settings-tabs text-grey-8">
          <q-tab name="profile" label="个人资料" />
          <q-tab name="security" label="账号安全" />
          <q-tab name="notifications" label="通知" />
          <q-tab name="team" label="团队" />
          <q-tab name="billing" label="计费" />
        </q-tabs>
      </div>
      <div class="col-12 col-md-9">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="profile" class="q-pa-none">
            <q-card bordered><q-card-section><div class="text-h6">个人资料</div></q-card-section><q-card-section class="q-gutter-y-md">
              <div class="row items-center q-gutter-md"><q-avatar size="72px" color="primary" text-color="white">林</q-avatar><q-btn outline label="上传头像" /></div>
              <q-input v-model="name" label="姓名" />
              <q-input v-model="bio" label="个人简介" type="textarea" />
              <div class="row q-col-gutter-md"><div class="col-12 col-sm-6"><q-select v-model="language" label="语言" :options="['简体中文', 'English', '日本語']" /></div><div class="col-12 col-sm-6"><q-select v-model="timezone" label="时区" use-input :options="['Asia/Shanghai', 'Asia/Tokyo', 'Europe/London']" /></div></div>
              <q-btn color="primary" label="保存更改" />
            </q-card-section></q-card>
          </q-tab-panel>

          <q-tab-panel name="security" class="q-pa-none q-gutter-md">
            <q-card bordered><q-card-section><div class="text-h6">账号安全</div></q-card-section><q-card-section class="q-gutter-y-md">
              <q-input v-model="currentPassword" label="当前密码" type="password" />
              <q-input v-model="newPassword" label="新密码" type="password" />
              <q-input v-model="confirmPassword" label="确认新密码" type="password" />
              <q-btn color="primary" label="更新密码" />
              <q-separator />
              <q-toggle v-model="twoStep" label="启用两步验证" />
              <div class="qr-placeholder">QR</div>
            </q-card-section></q-card>
            <q-card bordered><q-card-section><div class="text-h6">活跃会话</div></q-card-section><q-list separator><q-item v-for="session in sessions" :key="session.device"><q-item-section avatar><AppIcon name="globe" /></q-item-section><q-item-section><q-item-label>{{ session.device }}</q-item-label><q-item-label caption>{{ session.location }} · {{ session.time }}</q-item-label></q-item-section><q-item-section side><q-badge v-if="session.current" color="positive">当前</q-badge><q-btn v-else flat dense label="注销" /></q-item-section></q-item></q-list></q-card>
          </q-tab-panel>

          <q-tab-panel name="notifications" class="q-pa-none">
            <q-card bordered><q-card-section><div class="text-h6">通知</div></q-card-section><q-card-section class="q-gutter-y-md">
              <div v-for="(label, index) in ['订单状态更新', '团队活动提醒', '每周业务报告', '产品更新']" :key="label" class="row items-center justify-between"><div><div>{{ label }}</div><div class="text-caption text-grey-7">接收相关消息通知</div></div><q-toggle :model-value="index !== 3" /></div>
              <q-separator /><q-btn-toggle spread v-model="notificationMode" toggle-color="primary" :options="[{ label: '邮件', value: 'mail' }, { label: '推送', value: 'push' }, { label: '站内', value: 'inbox' }]" />
            </q-card-section></q-card>
          </q-tab-panel>

          <q-tab-panel name="team" class="q-pa-none q-gutter-md">
            <q-card bordered><q-card-section><div class="text-h6">团队成员</div></q-card-section><div class="table-scroll"><q-table flat :rows="teamRows" :columns="columns" row-key="email">
              <template #body-cell-name="slot"><q-td :props="slot"><div class="row items-center q-gutter-sm"><q-avatar size="30px" color="primary" text-color="white">{{ String(slot.value).slice(0, 1) }}</q-avatar><div><div>{{ slot.value }}</div><div class="text-caption text-grey-7">{{ slot.row.email }}</div></div></div></q-td></template>
              <template #body-cell-role="slot"><q-td :props="slot"><q-select v-model="slot.row.role" dense borderless :options="roles" /></q-td></template>
              <template #body-cell-actions="slot"><q-td :props="slot"><q-btn flat round><AppIcon name="trash" /></q-btn></q-td></template>
            </q-table></div><q-card-section><div class="row q-col-gutter-sm"><div class="col"><q-input v-model="invite" dense outlined label="成员邮箱" /></div><div class="col-auto"><q-btn color="primary" label="邀请" @click="inviteMember" /></div></div></q-card-section></q-card>
          </q-tab-panel>

          <q-tab-panel name="billing" class="q-pa-none q-gutter-md">
            <q-card bordered><q-card-section><div class="text-h6">当前方案</div><div class="text-h4 q-mt-sm">Pro</div><div class="text-body2 text-grey-7">适合成长中的团队</div></q-card-section></q-card>
            <div class="row q-col-gutter-md"><div v-for="plan in plans" :key="plan.name" class="col-12 col-md-4"><q-card bordered class="full-height"><q-card-section><div class="row items-center justify-between"><div class="text-h6">{{ plan.name }}</div><q-badge v-if="plan.recommended" color="primary">推荐</q-badge></div><div class="text-h4 q-mt-md">{{ plan.price === null ? "联系我们" : `¥${plan.price}` }}</div><q-list dense class="q-mt-md"><q-item v-for="feature in plan.features" :key="feature"><q-item-section avatar><AppIcon name="check-circle" color="positive" /></q-item-section><q-item-section>{{ feature }}</q-item-section></q-item></q-list><q-btn outline color="primary" class="full-width q-mt-md" label="选择方案" /></q-card-section></q-card></div></div>
            <q-card bordered><q-card-section><div class="text-h6">发票</div></q-card-section><div class="table-scroll"><q-table flat :rows="invoices" :columns="invoiceColumns" row-key="id"><template #body-cell-amount="slot"><q-td :props="slot">¥{{ slot.value }}</q-td></template><template #body-cell-status="slot"><q-td :props="slot"><q-chip dense :color="statusColors[slot.value] ?? 'grey'" text-color="white">{{ slot.value }}</q-chip></q-td></template></q-table></div></q-card>
          </q-tab-panel>
        </q-tab-panels>
        <q-card bordered class="border-negative q-mt-lg"><q-card-section><div class="text-h6 text-negative">危险区</div><div class="text-body2 text-grey-7 q-mt-sm">删除账号后所有数据将无法恢复。</div><q-btn outline color="negative" label="删除账号" class="q-mt-md" @click="deleteDialog = true" /></q-card-section></q-card>
      </div>
    </div>
    <q-dialog v-model="deleteDialog"><q-card style="width: min(100%, 420px)"><q-card-section><div class="text-h6">确认删除账号</div><div class="text-body2 q-mt-sm">请输入 DELETE 以确认。</div><q-input v-model="deleteText" class="q-mt-md" /></q-card-section><q-card-actions align="right"><q-btn flat label="取消" v-close-popup /><q-btn color="negative" label="确认删除" :disable="deleteText !== 'DELETE'" /></q-card-actions></q-card></q-dialog>
  </div>
</template>
