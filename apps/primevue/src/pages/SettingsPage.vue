<script setup lang="ts">
import { ref } from "vue"
import Avatar from "primevue/avatar"
import Button from "primevue/button"
import Card from "primevue/card"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Dialog from "primevue/dialog"
import FileUpload from "primevue/fileupload"
import InputGroup from "primevue/inputgroup"
import InputText from "primevue/inputtext"
import AutoComplete from "primevue/autocomplete"
import Password from "primevue/password"
import Select from "primevue/select"
import SelectButton from "primevue/selectbutton"
import Tab from "primevue/tab"
import TabList from "primevue/tablist"
import TabPanel from "primevue/tabpanel"
import TabPanels from "primevue/tabpanels"
import Tabs from "primevue/tabs"
import Tag from "primevue/tag"
import Textarea from "primevue/textarea"
import ToggleSwitch from "primevue/toggleswitch"
import { useToast } from "primevue/usetoast"
import PageHeader from "@/components/PageHeader.vue"
import SectionCard from "@/components/SectionCard.vue"
import StatusTag from "@/components/StatusTag.vue"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"

const toast = useToast()
const deleteDialog = ref(false)
const deleteText = ref("")
const billingCycle = ref("月")
const timezoneSuggestions = ref(["Asia/Shanghai", "Asia/Tokyo", "Europe/Berlin", "America/Los_Angeles"])
const profile = ref({ name: "林晓", bio: "负责 Acme Console 的产品与团队协作。", language: "简体中文", timezone: "Asia/Shanghai" })
const security = ref({ twoFactor: true, current: "", next: "", confirm: "" })
const roleOptions = ["owner", "admin", "member", "viewer"]
const notificationGroups = [
  { title: "产品更新", description: "新功能和版本发布", enabled: true },
  { title: "安全提醒", description: "登录与权限变更", enabled: true },
  { title: "团队动态", description: "评论、提及与任务更新", enabled: false },
]
function saveProfile() { toast.add({ severity: "success", summary: "资料已保存", life: 2200 }) }
function invite() { toast.add({ severity: "success", summary: "邀请已发送", detail: "邀请链接已准备", life: 2200 }) }
function removeMember(name: string) { toast.add({ severity: "info", summary: "已移除成员", detail: name, life: 2200 }) }
function confirmDelete() { deleteDialog.value = false; toast.add({ severity: "success", summary: "删除请求已提交", life: 2200 }); deleteText.value = "" }
</script>

<template>
  <div class="page">
    <PageHeader title="设置" description="管理个人资料、团队与订阅" />
    <Tabs value="0" class="settings-tabs">
      <TabList><Tab value="0">个人资料</Tab><Tab value="1">账号安全</Tab><Tab value="2">通知</Tab><Tab value="3">团队</Tab><Tab value="4">计费</Tab></TabList>
      <TabPanels>
        <TabPanel value="0">
          <SectionCard title="个人资料" description="这些信息会显示在团队活动与邀请中">
            <div class="profile-layout"><div class="col items-center gap-3"><Avatar label="林" size="xlarge" shape="circle" /><FileUpload mode="basic" custom-upload choose-label="更换头像" auto /></div><div class="form-stack"><div class="field"><label for="settings-name">姓名</label><InputText id="settings-name" v-model="profile.name" fluid /></div><div class="field"><label for="settings-bio">简介</label><Textarea id="settings-bio" v-model="profile.bio" rows="4" auto-resize fluid /></div><div class="field"><label>语言</label><Select v-model="profile.language" :options="['简体中文', 'English', '日本語']" fluid /></div><div class="field"><label>时区</label><AutoComplete v-model="profile.timezone" :suggestions="timezoneSuggestions" dropdown fluid /></div><Button label="保存资料" class="self-start" @click="saveProfile" /></div></div>
          </SectionCard>
        </TabPanel>
        <TabPanel value="1">
          <div class="col gap-6"><SectionCard title="修改密码"><div class="form-stack narrow"><div class="field"><label>当前密码</label><Password v-model="security.current" :feedback="false" toggle-mask fluid input-class="w-full" /></div><div class="field"><label>新密码</label><Password v-model="security.next" toggle-mask fluid input-class="w-full" /></div><div class="field"><label>确认新密码</label><Password v-model="security.confirm" :feedback="false" toggle-mask fluid input-class="w-full" /></div><Button label="更新密码" class="self-start" @click="toast.add({ severity: 'success', summary: '密码已更新', life: 2200 })" /></div></SectionCard><SectionCard title="两步验证" description="为账号增加额外的安全保护"><div class="security-layout"><div class="col gap-2"><div class="flex items-center gap-2"><ToggleSwitch v-model="security.twoFactor" /><span>启用两步验证</span></div><small class="muted">使用身份验证器生成一次性验证码。</small></div><div class="qr-placeholder"><i class="pi pi-qrcode" /><span>二维码占位</span></div></div></SectionCard><SectionCard title="活跃会话"><div class="session-list"><div v-for="session in sessions" :key="session.device" class="session-row"><Avatar :label="session.device.includes('iPhone') ? 'i' : 'M'" shape="circle" /><div class="min-w-0 flex-1"><div>{{ session.device }}</div><div class="text-xs muted">{{ session.location }} · {{ session.time }}</div></div><Tag v-if="session.current" value="当前" severity="success" /><Button v-else label="注销" text size="small" severity="danger" @click="toast.add({ severity: 'info', summary: '会话已注销', life: 1800 })" /></div></div></SectionCard></div>
        </TabPanel>
        <TabPanel value="2">
          <SectionCard title="通知偏好" description="选择你希望接收的通知"><div class="notification-list"><div v-for="item in notificationGroups" :key="item.title" class="notification-row"><div><div class="font-medium">{{ item.title }}</div><div class="text-sm muted">{{ item.description }}</div></div><ToggleSwitch v-model="item.enabled" /></div></div><Divider class="my-4" /><div class="field"><label>通知渠道</label><SelectButton :options="['邮件', '推送', '站内']" :allow-empty="false" /></div></SectionCard>
        </TabPanel>
        <TabPanel value="3">
          <SectionCard title="团队成员" description="管理成员角色与访问权限" flush><div class="table-scroll"><DataTable :value="team" size="small" striped-rows><Column header="成员"><template #body="{ data }"><div class="flex items-center gap-2"><Avatar :label="data.name.slice(0, 1)" shape="circle" size="small" /><div><div>{{ data.name }}</div><div class="text-xs muted">{{ data.email }}</div></div></div></template></Column><Column header="角色"><template #body="{ data }"><Select v-model="data.role" :options="roleOptions" size="small" /></template></Column><Column field="lastActive" header="最近活跃" /><Column header="" style="width: 100px"><template #body="{ data }"><Button label="移除" text severity="danger" size="small" @click="removeMember(data.name)" /></template></Column></DataTable></div></SectionCard>
          <SectionCard title="邀请成员" class="mt-6"><InputGroup class="invite-group"><InputText placeholder="成员邮箱" /><Button label="邀请" icon="pi pi-send" @click="invite" /></InputGroup></SectionCard>
        </TabPanel>
        <TabPanel value="4">
          <div class="col gap-6"><Card><template #title>当前计划：Pro</template><template #content><div class="flex items-center justify-between gap-3 wrap"><div><div class="text-2xl font-bold">¥99 <span class="text-sm muted">/ 月</span></div><div class="text-sm muted mt-1">下一次扣款：2026-10-01</div></div><Tag value="使用中" severity="success" /></div></template></Card><div class="flex items-center justify-between"><span class="font-medium">选择计费周期</span><SelectButton v-model="billingCycle" :options="['月', '年']" :allow-empty="false" /></div><div class="grid grid-3"><Card v-for="plan in plans" :key="plan.name" class="plan-card"><template #title><div class="flex items-center justify-between gap-2"><span>{{ plan.name }}</span><Tag v-if="plan.recommended" value="推荐" /></div></template><template #content><div class="text-2xl font-bold mb-4">{{ plan.price === null ? "联系销售" : `¥${billingCycle === '年' ? plan.price * 10 : plan.price}` }}<span v-if="plan.price !== null" class="text-sm muted"> / {{ billingCycle }}</span></div><ul class="feature-list"><li v-for="feature in plan.features" :key="feature"><i class="pi pi-check" />{{ feature }}</li></ul><Button :label="plan.name === 'Pro' ? '当前计划' : '选择计划'" :outlined="plan.name !== 'Pro'" fluid /></template></Card></div><SectionCard title="发票记录" flush><div class="table-scroll"><DataTable :value="invoices" size="small"><Column field="id" header="发票号" /><Column field="date" header="日期" /><Column field="amount" header="金额"><template #body="{ data }">¥{{ data.amount }}</template></Column><Column field="status" header="状态"><template #body="{ data }"><StatusTag :status="data.status" /></template></Column><Column header=""><template #body><Button icon="pi pi-download" text rounded severity="secondary" aria-label="下载发票" /></template></Column></DataTable></div></SectionCard><Card class="danger-card"><template #title>危险区</template><template #content><div class="flex items-center justify-between gap-3 wrap"><div><div class="font-medium">删除账号</div><div class="text-sm muted">此操作不可撤销，请谨慎操作。</div></div><Button label="删除账号" severity="danger" outlined @click="deleteDialog = true" /></div></template></Card></div>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <Dialog v-model:visible="deleteDialog" modal header="删除账号" :style="{ width: 'min(420px, calc(100vw - 32px))' }"><p class="text-sm muted">请输入 DELETE 以确认删除账号。</p><InputText v-model="deleteText" class="mt-3" fluid placeholder="DELETE" /><template #footer><Button label="取消" severity="secondary" text @click="deleteDialog = false" /><Button label="确认删除" severity="danger" :disabled="deleteText !== 'DELETE'" @click="confirmDelete" /></template></Dialog>
  </div>
</template>

<style scoped>
.settings-tabs { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 16px; align-items: start; }
.settings-tabs :deep(.p-tablist) { overflow: visible; }
.settings-tabs :deep(.p-tablist-tab-list) { flex-direction: column; align-items: stretch; gap: 2px; border: 0; }
.settings-tabs :deep(.p-tab) { justify-content: flex-start; width: 100%; }
.settings-tabs :deep(.p-tablist-active-bar) { display: none; }
.settings-tabs :deep(.p-tabpanels) { min-width: 0; padding-top: 0; }
.profile-layout { display: grid; grid-template-columns: 160px minmax(0, 560px); gap: 32px; }
.form-stack { display: flex; flex-direction: column; gap: 16px; min-width: 0; } .narrow { max-width: 520px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.security-layout { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; }
.qr-placeholder { width: 160px; height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; border: 1px dashed var(--p-primary-color); color: var(--p-primary-color); }
.qr-placeholder i { font-size: 2.5rem; }
.session-list, .notification-list { display: flex; flex-direction: column; gap: 4px; }
.session-row, .notification-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--p-content-border-color); }
.notification-row { justify-content: space-between; }
.feature-list { display: flex; flex-direction: column; gap: 10px; padding: 0; margin: 0 0 20px; list-style: none; } .feature-list i { color: var(--p-green-500); margin-right: 8px; }
.danger-card { border: 1px solid var(--p-red-500); }
@media (max-width: 767px) { .settings-tabs { display: block; } .settings-tabs :deep(.p-tablist) { width: 100%; overflow-x: auto; } .settings-tabs :deep(.p-tablist-tab-list) { flex-direction: row; min-width: max-content; border-bottom: 1px solid var(--p-tabs-tablist-border-color); } .settings-tabs :deep(.p-tab) { width: auto; justify-content: center; } .settings-tabs :deep(.p-tablist-active-bar) { display: block; } .settings-tabs :deep(.p-tabpanels) { padding-top: 16px; } .profile-layout { grid-template-columns: 1fr; } .invite-group { flex-wrap: wrap; } }
</style>
