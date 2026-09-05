<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import { MessagePlugin, type PrimaryTableCol, type TableRowData } from "tdesign-vue-next"
import team from "@ui-gallery/spec/mock/team.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import Icon from "@/components/Icon.vue"
import { initials, roleLabel, statusLabel, statusTheme } from "@/pages/shared"

const tab = ref("profile")
const tabs = [
  { value: "profile", label: "个人资料", icon: "user" },
  { value: "security", label: "账号安全", icon: "shield" },
  { value: "notifications", label: "通知", icon: "bell" },
  { value: "team", label: "团队", icon: "users" },
  { value: "billing", label: "计费", icon: "credit-card" },
]

const profile = reactive({ name: team[0].name, bio: "", language: "zh-CN", timezone: "Asia/Shanghai" })
const languageOptions = [{ label: "简体中文", value: "zh-CN" }, { label: "English", value: "en-US" }, { label: "日本語", value: "ja-JP" }]
const timezoneOptions = ["Asia/Shanghai", "Asia/Tokyo", "Asia/Singapore", "Europe/London", "Europe/Berlin", "America/New_York", "America/Los_Angeles"].map((z) => ({ label: z, value: z }))

const password = reactive({ current: "", next: "", confirm: "" })
const twoFactor = ref(true)
const activeSessions = ref(sessions)

const notify = reactive<Record<string, boolean>>({ orders: true, refunds: true, digest: false, mentions: true, security: true, marketing: false })
const channel = ref("email")
const notifyGroups = [
  { title: "业务", items: [{ key: "orders", label: "新订单", desc: "有新订单创建时提醒" }, { key: "refunds", label: "退款申请", desc: "客户发起退款时提醒" }, { key: "digest", label: "每日摘要", desc: "每天早上 9 点汇总" }] },
  { title: "协作与安全", items: [{ key: "mentions", label: "@提及", desc: "有人在评论中提到你" }, { key: "security", label: "安全提醒", desc: "新设备登录、密码变更" }, { key: "marketing", label: "产品更新", desc: "新功能与活动通知" }] },
]

const members = ref(team.map((m) => ({ ...m })))
const invite = ref("")
const roleOptions = Object.entries(roleLabel).map(([value, label]) => ({ value, label }))
const memberColumns: PrimaryTableCol<TableRowData>[] = [
  { colKey: "name", title: "成员", width: 240 },
  { colKey: "role", title: "角色", width: 150 },
  { colKey: "lastActive", title: "最近活跃", width: 120 },
  { colKey: "op", title: "", width: 72, align: "right" },
]
function removeMember(email: string) {
  members.value = members.value.filter((m) => m.email !== email)
  MessagePlugin.success("成员已移除")
}
function sendInvite() {
  if (!/^\S+@\S+\.\S+$/.test(invite.value)) return MessagePlugin.error("请输入有效邮箱")
  MessagePlugin.success(`邀请已发送至 ${invite.value}`)
  invite.value = ""
}

const yearly = ref(false)
const currentPlan = plans.find((p) => p.recommended) ?? plans[0]
const invoiceColumns: PrimaryTableCol<TableRowData>[] = [
  { colKey: "id", title: "发票号", width: 120 },
  { colKey: "date", title: "日期", width: 120 },
  { colKey: "amount", title: "金额", width: 100, align: "right" },
  { colKey: "status", title: "状态", width: 100 },
  { colKey: "op", title: "", width: 80, align: "right" },
]
const priceOf = (p: (typeof plans)[number]) => (p.price === null ? "联系销售" : `¥${yearly.value ? Math.round(p.price * 10) : p.price}`)
const unit = computed(() => (yearly.value ? "/年" : "/月"))

const deleteOpen = ref(false)
const deleteText = ref("")
function deleteAccount() {
  deleteOpen.value = false
  deleteText.value = ""
  MessagePlugin.warning("删除请求已提交（演示）")
}
</script>

<template>
  <div class="ug-page">
    <div>
      <t-typography-title level="h4" class="ug-title">设置</t-typography-title>
      <span class="ug-muted">管理个人资料、安全、通知、团队与计费。</span>
    </div>

    <div class="ug-settings">
      <t-tabs v-model="tab" :placement="'left'" class="ug-settings-tabs ug-desktop-only">
        <t-tab-panel v-for="t in tabs" :key="t.value" :value="t.value"><template #label><span class="ug-row"><Icon :name="t.icon" />{{ t.label }}</span></template></t-tab-panel>
      </t-tabs>
      <t-tabs v-model="tab" class="ug-mobile-only ug-settings-tabs-top">
        <t-tab-panel v-for="t in tabs" :key="t.value" :value="t.value" :label="t.label" />
      </t-tabs>

      <div class="ug-settings-body">
        <template v-if="tab === 'profile'">
          <t-card :bordered="true" title="个人资料" subtitle="更新你的公开信息">
            <t-form label-align="top" :data="profile" @submit.prevent>
              <t-form-item label="头像">
                <div class="ug-row">
                  <t-avatar size="64px" shape="round">{{ initials(profile.name) }}</t-avatar>
                  <t-upload theme="custom" accept="image/*" :auto-upload="false"><t-button variant="outline" size="small"><template #icon><Icon name="upload" /></template>上传头像</t-button></t-upload>
                  <t-button variant="text" size="small" theme="danger">移除</t-button>
                </div>
              </t-form-item>
              <div class="ug-grid-2">
                <t-form-item label="姓名" name="name"><t-input v-model="profile.name" /></t-form-item>
                <t-form-item label="邮箱"><t-input :model-value="team[0].email" readonly /></t-form-item>
              </div>
              <t-form-item label="简介" name="bio" help="最多 160 字"><t-textarea v-model="profile.bio" :maxlength="160" placeholder="介绍一下你自己…" :autosize="{ minRows: 3 }" /></t-form-item>
              <div class="ug-grid-2">
                <t-form-item label="语言" name="language"><t-select v-model="profile.language" :options="languageOptions" /></t-form-item>
                <t-form-item label="时区" name="timezone"><t-select v-model="profile.timezone" :options="timezoneOptions" filterable /></t-form-item>
              </div>
              <t-space><t-button theme="primary" @click="MessagePlugin.success('资料已保存')">保存更改</t-button><t-button variant="outline">取消</t-button></t-space>
            </t-form>
          </t-card>
        </template>

        <template v-else-if="tab === 'security'">
          <t-card :bordered="true" title="修改密码">
            <t-form label-align="top" :data="password" @submit.prevent>
              <t-form-item label="当前密码" name="current"><t-input v-model="password.current" type="password" /></t-form-item>
              <div class="ug-grid-2">
                <t-form-item label="新密码" name="next" help="至少 8 位，含字母与数字"><t-input v-model="password.next" type="password" /></t-form-item>
                <t-form-item label="确认新密码" name="confirm" :status="password.confirm && password.confirm !== password.next ? 'error' : undefined" :tips="password.confirm && password.confirm !== password.next ? '两次输入不一致' : ''"><t-input v-model="password.confirm" type="password" /></t-form-item>
              </div>
              <t-button theme="primary">更新密码</t-button>
            </t-form>
          </t-card>
          <t-card :bordered="true" title="两步验证">
            <template #actions><t-switch v-model="twoFactor" /></template>
            <div class="ug-2fa">
              <div class="ug-qr"><t-qrcode value="otpauth://totp/AcmeConsole:demo" :size="120" :status="twoFactor ? 'active' : 'expired'" /></div>
              <div>
                <p>使用身份验证器扫描二维码，或手动输入密钥。</p>
                <t-input value="ACME-DEMO-KEY" readonly class="ug-2fa-key"><template #suffix-icon><Icon name="copy" /></template></t-input>
                <t-tag :theme="twoFactor ? 'success' : 'warning'" variant="light" size="small">{{ twoFactor ? "已启用" : "未启用" }}</t-tag>
              </div>
            </div>
          </t-card>
          <t-card :bordered="true" title="活跃会话">
            <t-list :split="true">
              <t-list-item v-for="s in activeSessions" :key="s.device">
                <t-list-item-meta :title="s.device" :description="`${s.location} · ${s.time}`">
                  <template #image><t-avatar shape="round"><Icon :name="s.device.includes('iPhone') ? 'smartphone' : 'monitor'" /></t-avatar></template>
                </t-list-item-meta>
                <template #action>
                  <t-tag v-if="s.current" theme="success" variant="light" size="small">当前设备</t-tag>
                  <t-button v-else variant="outline" size="small" @click="activeSessions = activeSessions.filter((x) => x !== s)">注销</t-button>
                </template>
              </t-list-item>
            </t-list>
          </t-card>
        </template>

        <template v-else-if="tab === 'notifications'">
          <t-card :bordered="true" title="通知渠道">
            <t-radio-group v-model="channel" variant="default-filled">
              <t-radio-button value="email">邮件</t-radio-button>
              <t-radio-button value="push">推送</t-radio-button>
              <t-radio-button value="inapp">站内</t-radio-button>
            </t-radio-group>
          </t-card>
          <t-card v-for="g in notifyGroups" :key="g.title" :bordered="true" :title="g.title">
            <t-list :split="true">
              <t-list-item v-for="i in g.items" :key="i.key">
                <t-list-item-meta :title="i.label" :description="i.desc" />
                <template #action><t-switch v-model="notify[i.key]" /></template>
              </t-list-item>
            </t-list>
          </t-card>
        </template>

        <template v-else-if="tab === 'team'">
          <t-card :bordered="true" title="邀请成员">
            <div class="ug-invite">
              <t-input v-model="invite" placeholder="colleague@company.com" clearable><template #prefix-icon><Icon name="mail" /></template></t-input>
              <t-button theme="primary" @click="sendInvite"><template #icon><Icon name="send" /></template>发送邀请</t-button>
            </div>
          </t-card>
          <t-card :bordered="true" :title="`成员（${members.length}）`">
            <t-table row-key="email" :data="members" :columns="memberColumns" hover table-layout="fixed">
              <template #name="{ row }"><div class="ug-row"><t-avatar size="small">{{ initials(row.name) }}</t-avatar><div class="ug-ellipsis"><div>{{ row.name }}</div><div class="ug-muted ug-small">{{ row.email }}</div></div></div></template>
              <template #role="{ row }"><t-select v-model="row.role" :options="roleOptions" size="small" :disabled="row.role === 'owner'" /></template>
              <template #op="{ row }">
                <t-popconfirm content="确定移除该成员吗？" theme="danger" @confirm="removeMember(row.email)">
                  <t-button variant="text" size="small" shape="square" theme="danger" :disabled="row.role === 'owner'" aria-label="移除"><Icon name="trash" /></t-button>
                </t-popconfirm>
              </template>
            </t-table>
          </t-card>
        </template>

        <template v-else-if="tab === 'billing'">
          <t-card :bordered="true" title="当前计划">
            <template #actions><t-tag theme="primary" variant="light">{{ currentPlan.name }}</t-tag></template>
            <div class="ug-between">
              <div><div class="ug-price">¥{{ currentPlan.price }}<span class="ug-muted ug-small">/月</span></div><span class="ug-muted">下次扣款 {{ invoices[0].date }}</span></div>
              <t-space><t-button variant="outline">管理付款方式</t-button><t-button theme="primary">升级</t-button></t-space>
            </div>
          </t-card>
          <div class="ug-between">
            <span class="ug-muted">按 {{ yearly ? "年" : "月" }} 计费</span>
            <t-switch v-model="yearly" :label="['年付', '月付']" size="large" />
          </div>
          <div class="ug-grid-3">
            <t-card v-for="p in plans" :key="p.name" :bordered="true" :class="{ 'ug-plan--rec': p.recommended }" :title="p.name">
              <template v-if="p.recommended" #actions><t-tag theme="primary" size="small">推荐</t-tag></template>
              <div class="ug-price">{{ priceOf(p) }}<span v-if="p.price !== null" class="ug-muted ug-small">{{ unit }}</span></div>
              <ul class="ug-features"><li v-for="f in p.features" :key="f" class="ug-row"><Icon name="check" class="ug-check" />{{ f }}</li></ul>
              <t-button block :theme="p.recommended ? 'primary' : 'default'" :variant="p.recommended ? 'base' : 'outline'">{{ p.name === currentPlan.name ? "当前计划" : p.price === null ? "联系我们" : "选择" }}</t-button>
            </t-card>
          </div>
          <t-card :bordered="true" title="发票">
            <t-table row-key="id" :data="invoices" :columns="invoiceColumns" size="small" hover table-layout="fixed">
              <template #amount="{ row }"><span class="ug-mono">¥{{ row.amount }}</span></template>
              <template #status="{ row }"><t-tag :theme="statusTheme[row.status]" variant="light-outline" size="small">{{ statusLabel[row.status] }}</t-tag></template>
              <template #op><t-button variant="text" size="small" shape="square" aria-label="下载"><Icon name="download" /></t-button></template>
            </t-table>
          </t-card>
        </template>

        <t-card :bordered="true" title="危险区" class="ug-danger">
          <div class="ug-between">
            <div><div>删除账号</div><span class="ug-muted ug-small">删除后所有数据将被永久移除，无法恢复。</span></div>
            <t-button theme="danger" variant="outline" @click="deleteOpen = true"><template #icon><Icon name="trash" /></template>删除账号</t-button>
          </div>
        </t-card>
      </div>
    </div>

    <t-dialog v-model:visible="deleteOpen" theme="danger" header="确认删除账号" :confirm-btn="{ content: '永久删除', theme: 'danger', disabled: deleteText !== 'DELETE' }" cancel-btn="取消" @confirm="deleteAccount">
      <p class="ug-muted">此操作不可逆。请输入 <b>DELETE</b> 以确认。</p>
      <t-input v-model="deleteText" placeholder="DELETE" style="margin-top: 12px" />
    </t-dialog>
  </div>
</template>

<style>
.ug-settings { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 16px; align-items: start; }
.ug-settings-tabs .t-tabs__nav { min-width: 200px; }
.ug-settings-body { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ug-2fa { display: flex; gap: 20px; flex-wrap: wrap; align-items: flex-start; }
.ug-2fa-key { margin: 8px 0; max-width: 260px; }
.ug-invite { display: flex; gap: 8px; }
.ug-price { font-size: 28px; font-weight: 600; }
.ug-features { list-style: none; padding: 0; margin: 12px 0 16px; display: grid; gap: 8px; }
.ug-check { color: var(--td-success-color); }
.ug-plan--rec { border-color: var(--td-brand-color); }
.ug-danger { border-color: var(--td-error-color-3); }
.ug-danger .t-card__title { color: var(--td-error-color); }
@media (max-width: 767px) {
  .ug-settings { grid-template-columns: minmax(0, 1fr); }
  .ug-invite { flex-direction: column; }
}
</style>
