<script setup lang="ts">
import { computed, ref } from "vue"
import { showConfirmDialog, showToast } from "vant"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import AppIcon from "@/components/AppIcon.vue"

const active = ref("profile")
const deleteText = ref("")
const showDelete = ref(false)
const timezonePopup = ref(false)
const timezoneQuery = ref("")
const rolePopup = ref(false)
const role = ref("成员")
const timezones = ["Asia/Shanghai", "Asia/Tokyo", "America/Los_Angeles", "Europe/London"]
const roles = ["管理员", "成员", "访客"].map((text) => ({ text, value: text }))
const filteredTimezones = () => timezones.filter((item) => item.toLowerCase().includes(timezoneQuery.value.toLowerCase()))
const sections = [{ text: "个人资料", value: "profile" }, { text: "账号安全", value: "security" }, { text: "通知", value: "notifications" }, { text: "团队", value: "team" }, { text: "计费", value: "billing" }]
const activeIndex = computed({
  get: () => Math.max(0, sections.findIndex((section) => section.value === active.value)),
  set: (index: number) => { active.value = sections[index]?.value ?? "profile" },
})
const removeAccount = async () => { if (deleteText.value !== "DELETE") return; await showConfirmDialog({ title: "删除账号", message: "此操作无法撤销" }); showToast("账号删除请求已提交"); showDelete.value = false }
const allowDelete = () => deleteText.value === "DELETE"
</script>

<template>
  <div class="page">
    <div class="page-title"><div><h1>设置</h1><p>管理账户、团队与订阅设置</p></div></div>
    <van-tabs v-model:active="active" class="settings-tabs mobile-only" swipeable>
      <van-tab v-for="section in sections" :key="section.value" :title="section.text" :name="section.value" />
    </van-tabs>
    <div class="settings-layout">
      <van-sidebar v-model="activeIndex" class="settings-sidebar"><van-sidebar-item v-for="section in sections" :key="section.value" :title="section.text" /></van-sidebar>
      <section class="settings-content">
        <div v-if="active === 'profile'" class="grid grid-2 profile-grid"><div class="card stack"><h2>个人资料</h2><van-uploader preview-size="64" /><van-field label="姓名" model-value="林晓" /><van-field label="简介" type="textarea" /><van-field label="语言" model-value="中文" is-link readonly /><van-field label="时区" model-value="Asia/Shanghai" is-link readonly @click="timezonePopup = true" /><van-button type="primary">保存更改</van-button></div><div class="stack"><div class="card"><h2>登录会话</h2><van-cell v-for="session in sessions" :key="session.device" :title="session.device" :label="`${session.location} · ${session.time}`"><template #value><van-tag v-if="session.current" type="success">当前</van-tag></template></van-cell></div><div class="card"><h2>团队</h2><van-cell v-for="member in team" :key="member.email" :title="member.name" :label="member.email" :value="member.role"><template #icon><span class="avatar-placeholder">{{ member.name.slice(0, 1) }}</span></template></van-cell></div></div></div>
        <div v-else-if="active === 'security'" class="stack"><div class="card stack"><h2>账号安全</h2><van-field label="当前密码" type="password" /><van-field label="新密码" type="password" /><van-button type="primary">修改密码</van-button><div class="qr-placeholder">二维码占位</div><van-cell title="两步验证" label="登录时要求额外验证码"><template #value><van-switch /></template></van-cell></div><div class="card"><h2>登录会话</h2><van-cell v-for="session in sessions" :key="session.device" :title="session.device" :label="`${session.location} · ${session.time}`"><template #value><van-tag :type="session.current ? 'success' : 'default'">{{ session.current ? "当前会话" : "注销" }}</van-tag></template></van-cell></div></div>
        <div v-else-if="active === 'notifications'" class="card"><h2>通知偏好</h2><van-tabs type="card"><van-tab title="邮件"><van-cell v-for="item in ['项目更新', '账单提醒', '每周摘要']" :key="item" :title="item"><template #right-icon><van-switch /></template></van-cell></van-tab><van-tab title="推送"><van-cell v-for="item in ['团队活动', '评论回复', '安全提醒']" :key="item" :title="item"><template #right-icon><van-switch /></template></van-cell></van-tab><van-tab title="站内"><van-cell v-for="item in ['产品新闻', '功能提示', '系统公告']" :key="item" :title="item"><template #right-icon><van-switch /></template></van-cell></van-tab></van-tabs></div>
        <div v-else-if="active === 'team'" class="card"><h2>团队成员</h2><div class="table-wrap"><div class="data-table"><div class="data-row head"><span>成员</span><span>邮箱</span><span>角色</span><span>活跃</span><span /></div><div v-for="member in team" :key="member.email" class="data-row"><span class="inline"><span class="avatar-placeholder">{{ member.name.slice(0, 1) }}</span>{{ member.name }}</span><span>{{ member.email }}</span><van-tag>{{ member.role }}</van-tag><span>{{ member.lastActive }}</span><van-button plain size="small">移除</van-button></div></div></div><van-field label="角色" :model-value="role" readonly is-link @click="rolePopup = true" /><van-field label="邀请" placeholder="邮箱"><template #button><van-button type="primary" size="small">邀请</van-button></template></van-field></div>
        <div v-else class="stack"><div class="card"><h2>当前方案</h2><van-tag type="primary">Pro</van-tag><p class="muted">当前订阅方案</p></div><div class="grid grid-3"><div v-for="plan in plans" :key="plan.name" class="card"><div class="between"><h3>{{ plan.name }}</h3><van-tag v-if="plan.recommended" type="success">推荐</van-tag></div><strong class="plan-price">{{ plan.price === null ? "定制" : plan.price === 0 ? "免费" : `¥${plan.price}` }}</strong><van-cell v-for="feature in plan.features" :key="feature" :title="feature"><template #icon><AppIcon name="check" :size="14" /></template></van-cell></div></div><div class="card"><h2>发票记录</h2><van-cell v-for="invoice in invoices" :key="invoice.id" :title="invoice.id" :label="invoice.date" :value="`¥${invoice.amount}`"><template #value><span>¥{{ invoice.amount }} </span><van-tag :type="invoice.status === 'paid' ? 'success' : 'warning'">{{ invoice.status }}</van-tag></template></van-cell></div><div class="card danger-card"><h2>危险区</h2><p class="muted">删除账号与所有数据</p><van-button type="danger" plain @click="showDelete = true">删除账号</van-button></div></div>
      </section>
    </div>
    <van-dialog v-model:show="showDelete" title="删除账号" show-cancel-button :before-close="allowDelete" @confirm="removeAccount"><van-field v-model="deleteText" placeholder="请输入 DELETE" :error="deleteText.length > 0 && deleteText !== 'DELETE'" :error-message="deleteText.length > 0 && deleteText !== 'DELETE' ? '请输入 DELETE 以确认' : ''" /></van-dialog>
    <van-popup v-model:show="timezonePopup" position="bottom"><van-search v-model="timezoneQuery" placeholder="搜索时区" /><van-cell v-for="zone in filteredTimezones()" :key="zone" :title="zone" is-link @click="timezonePopup = false" /></van-popup>
    <van-popup v-model:show="rolePopup" position="bottom"><van-picker :columns="roles" @confirm="(item) => { role = String(item.selectedValues[0]); rolePopup = false }" /></van-popup>
  </div>
</template>

<style scoped>
.settings-layout { display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 16px; margin-top: 16px; }
.settings-content { min-width: 0; }
.settings-sidebar { --van-sidebar-width: 160px; align-self: start; border-radius: 8px; overflow: hidden; border: 1px solid var(--van-border-color); }
.settings-sidebar :deep(.van-sidebar-item) { background: var(--van-background); }
.settings-sidebar :deep(.van-sidebar-item--select) { background: var(--van-background-2); color: var(--van-primary-color); }
.settings-sidebar :deep(.van-sidebar-item--select::before) { background: var(--van-primary-color); }
.profile-grid { align-items: start; }
.profile-grid .avatar-placeholder { margin-right: 10px; }

.qr-placeholder { display: grid; place-items: center; width: 140px; height: 140px; border: 1px dashed var(--van-border-color); margin: 10px auto; color: var(--van-text-color-2); }
.plan-price { display: block; font-size: 24px; margin: 12px 0; }
.danger-card { border-color: var(--van-danger-color); }
.avatar-placeholder { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--van-primary-color); color: #fff; font-size: 12px; }
@media (max-width: 767px) { .settings-layout { display: block; } .settings-sidebar { display: none; } }
</style>
