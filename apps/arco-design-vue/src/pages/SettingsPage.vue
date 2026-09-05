<script setup lang="ts">
import { reactive, ref } from "vue"
import { Message } from "@arco-design/web-vue"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import PageHeader from "@/components/PageHeader.vue"
import StatusTag from "@/components/StatusTag.vue"
import { Icon } from "@/lib/icons"
import { useIsMobile } from "@/lib/useIsMobile"

const tab = ref("profile")
const profile = reactive({ name: team[0]!.name, email: team[0]!.email, bio: "", timezone: "Asia/Shanghai", language: "zh-CN" })
const security = reactive({ current: "", next: "", confirm: "", twoFactor: true })
const notify = reactive({ email: true, push: false, sms: false, weekly: true, mentions: true, marketing: false })
const inviteEmail = ref("")
const deleteVisible = ref(false)
const deleteInput = ref("")
const saving = ref(false)
const isMobile = useIsMobile()

function save() {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    Message.success("设置已保存")
  }, 600)
}

const teamColumns = [
  { title: "成员", dataIndex: "name", slotName: "name" },
  { title: "角色", dataIndex: "role", slotName: "role", width: 140 },
  { title: "最近活跃", dataIndex: "lastActive", width: 120 },
  { title: "", dataIndex: "actions", slotName: "actions", width: 60 },
]
const invoiceColumns = [
  { title: "发票号", dataIndex: "id" },
  { title: "日期", dataIndex: "date" },
  { title: "金额", dataIndex: "amount", slotName: "amount", align: "right" as const },
  { title: "状态", dataIndex: "status", slotName: "status" },
  { title: "", dataIndex: "actions", slotName: "actions", width: 80 },
]
</script>

<template>
  <div class="page">
    <PageHeader title="设置" description="管理个人资料、安全、通知、团队与账单。" />

    <a-tabs v-model:active-key="tab" :position="isMobile ? 'top' : 'left'" :size="isMobile ? 'small' : 'medium'" type="rounded" lazy-load class="settings-tabs">
      <a-tab-pane key="profile" title="个人资料">
        <a-card :bordered="true" class="settings-card">
          <a-form :model="profile" layout="vertical">
            <div class="row" style="margin-bottom: 20px">
              <a-avatar :size="72" :style="{ backgroundColor: 'rgb(var(--primary-6))' }">
                {{ profile.name.slice(0, 1) }}
                <template #trigger-icon><Icon name="camera" :size="14" /></template>
              </a-avatar>
              <a-upload action="/" :auto-upload="false" :show-file-list="false">
                <template #upload-button><a-button size="small">更换头像</a-button></template>
              </a-upload>
              <a-button size="small" type="text" status="danger">移除</a-button>
            </div>
            <div class="grid grid-2" style="gap: 0 16px">
              <a-form-item field="name" label="姓名"><a-input v-model="profile.name" /></a-form-item>
              <a-form-item field="email" label="邮箱"><a-input v-model="profile.email" disabled /></a-form-item>
              <a-form-item field="timezone" label="时区">
                <a-select v-model="profile.timezone">
                  <a-option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</a-option>
                  <a-option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</a-option>
                  <a-option value="Europe/London">Europe/London (UTC+0)</a-option>
                </a-select>
              </a-form-item>
              <a-form-item field="language" label="语言">
                <a-select v-model="profile.language">
                  <a-option value="zh-CN">简体中文</a-option>
                  <a-option value="en-US">English</a-option>
                </a-select>
              </a-form-item>
            </div>
            <a-form-item field="bio" label="简介"><a-textarea v-model="profile.bio" placeholder="介绍一下自己…" :max-length="160" show-word-limit /></a-form-item>
            <a-space>
              <a-button type="primary" :loading="saving" @click="save">保存修改</a-button>
              <a-button>取消</a-button>
            </a-space>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="security" title="安全">
        <div class="stack" style="gap: 16px">
          <a-card title="修改密码" :bordered="true" class="settings-card">
            <a-form :model="security" layout="vertical">
              <a-form-item label="当前密码"><a-input-password v-model="security.current" /></a-form-item>
              <div class="grid grid-2" style="gap: 0 16px">
                <a-form-item label="新密码"><a-input-password v-model="security.next" /></a-form-item>
                <a-form-item label="确认新密码"><a-input-password v-model="security.confirm" /></a-form-item>
              </div>
              <a-button type="primary" @click="save">更新密码</a-button>
            </a-form>
          </a-card>
          <a-card title="两步验证" :bordered="true" class="settings-card">
            <div class="between">
              <div class="stack" style="gap: 2px">
                <span>使用验证器 App</span>
                <span class="muted small">登录时需要输入 6 位一次性验证码。</span>
              </div>
              <a-switch v-model="security.twoFactor" />
            </div>
            <a-divider />
            <a-typography-text type="secondary" class="small">备用验证码</a-typography-text>
            <div style="margin-top: 8px"><a-verification-code :length="6" size="small" style="max-width: 280px" /></div>
          </a-card>
          <a-card title="活跃会话" :bordered="true" class="settings-card">
            <a-list :bordered="false" size="small">
              <a-list-item v-for="session in sessions" :key="session.device">
                <a-list-item-meta :title="session.device" :description="`${session.location} · ${session.time}`">
                  <template #avatar><a-avatar shape="square"><Icon :name="session.device.includes('iPhone') ? 'smartphone' : 'monitor'" /></a-avatar></template>
                </a-list-item-meta>
                <template #actions>
                  <a-tag v-if="session.current" color="green" size="small">当前设备</a-tag>
                  <a-button v-else size="mini" type="text" status="danger">退出</a-button>
                </template>
              </a-list-item>
            </a-list>
          </a-card>
        </div>
      </a-tab-pane>

      <a-tab-pane key="notifications" title="通知">
        <a-card :bordered="true" class="settings-card">
          <div class="stack" style="gap: 0">
            <div v-for="(label, key) in { email: '邮件通知', push: '推送通知', sms: '短信通知', weekly: '每周摘要', mentions: '被提及时通知', marketing: '产品动态与优惠' }" :key="key" class="between setting-row">
              <div class="stack" style="gap: 2px">
                <span>{{ label }}</span>
                <span class="muted small">{{ key === "weekly" ? "每周一上午发送团队数据概览。" : key === "marketing" ? "偶尔发送新功能与活动信息。" : "重要事件发生时立即通知。" }}</span>
              </div>
              <a-switch v-model="notify[key]" />
            </div>
          </div>
          <a-divider />
          <a-button type="primary" @click="save">保存偏好</a-button>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="team" title="团队">
        <a-card :bordered="true" class="settings-card">
          <div class="row" style="margin-bottom: 16px">
            <a-input v-model="inviteEmail" placeholder="输入邮箱邀请成员" style="flex: 1; min-width: 200px" />
            <a-select default-value="member" style="width: 120px">
              <a-option value="admin">管理员</a-option>
              <a-option value="member">成员</a-option>
              <a-option value="viewer">访客</a-option>
            </a-select>
            <a-button type="primary"><template #icon><Icon name="user-plus" /></template>邀请</a-button>
          </div>
          <a-table :columns="teamColumns" :data="team" :pagination="false" :scroll="{ x: 560 }">
            <template #name="{ record }">
              <a-space size="small">
                <a-avatar :size="28">{{ record.name.slice(0, 1) }}</a-avatar>
                <div class="stack" style="gap: 0"><span>{{ record.name }}</span><span class="muted small">{{ record.email }}</span></div>
              </a-space>
            </template>
            <template #role="{ record }">
              <a-select :default-value="record.role" size="small" :disabled="record.role === 'owner'" style="width: 110px">
                <a-option value="owner">所有者</a-option>
                <a-option value="admin">管理员</a-option>
                <a-option value="member">成员</a-option>
                <a-option value="viewer">访客</a-option>
              </a-select>
            </template>
            <template #actions>
              <a-dropdown position="br">
                <a-button type="text" size="small"><template #icon><Icon name="more-horizontal" /></template></a-button>
                <template #content><a-doption>重发邀请</a-doption><a-doption style="color: rgb(var(--red-6))">移除</a-doption></template>
              </a-dropdown>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="billing" title="账单">
        <div class="stack" style="gap: 16px">
          <div class="grid grid-3">
            <a-card v-for="plan in plans" :key="plan.name" :bordered="true" :class="{ 'plan-recommended': plan.recommended }" hoverable>
              <div class="between">
                <a-typography-title :heading="5" style="margin: 0">{{ plan.name }}</a-typography-title>
                <a-tag v-if="plan.recommended" color="arcoblue" size="small">当前方案</a-tag>
              </div>
              <div style="margin: 12px 0">
                <span style="font-size: 28px; font-weight: 600">{{ plan.price === null ? "联系我们" : `¥${plan.price}` }}</span>
                <span v-if="plan.price !== null" class="muted small"> / 月</span>
              </div>
              <div class="stack" style="gap: 6px; margin-bottom: 16px">
                <div v-for="feature in plan.features" :key="feature" class="row small" style="gap: 6px"><Icon name="check" :size="14" style="color: rgb(var(--green-6))" />{{ feature }}</div>
              </div>
              <a-button long :type="plan.recommended ? 'primary' : 'outline'" :disabled="plan.recommended">{{ plan.recommended ? "当前方案" : plan.price === null ? "联系销售" : "切换" }}</a-button>
            </a-card>
          </div>
          <a-card title="付款方式" :bordered="true" class="settings-card">
            <div class="between">
              <a-space><Icon name="credit-card" /><span>•••• •••• •••• 4242</span><span class="muted small">08/28</span></a-space>
              <a-button size="small">更换</a-button>
            </div>
          </a-card>
          <a-card title="发票历史" :bordered="true">
            <a-table :columns="invoiceColumns" :data="invoices" :pagination="{ pageSize: 5, simple: true }" :scroll="{ x: 480 }">
              <template #amount="{ record }">¥{{ record.amount }}</template>
              <template #status="{ record }"><StatusTag :value="record.status" /></template>
              <template #actions><a-button type="text" size="small"><template #icon><Icon name="download" /></template></a-button></template>
            </a-table>
          </a-card>
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-card :bordered="true" class="danger-zone">
      <div class="between" style="flex-wrap: wrap; gap: 12px">
        <div class="stack" style="gap: 2px">
          <a-typography-text bold type="danger">删除账户</a-typography-text>
          <span class="muted small">永久删除账户及其所有数据，此操作不可撤销。</span>
        </div>
        <a-button status="danger" @click="deleteVisible = true">删除账户</a-button>
      </div>
    </a-card>

    <a-modal v-model:visible="deleteVisible" title="确认删除账户" :ok-button-props="{ status: 'danger', disabled: deleteInput !== 'DELETE' }" ok-text="永久删除" @ok="Message.error('账户删除请求已提交')" @cancel="deleteInput = ''">
      <a-alert type="warning" style="margin-bottom: 12px">此操作将删除所有项目、订单与成员数据。</a-alert>
      <p class="small">请输入 <a-typography-text code>DELETE</a-typography-text> 以确认：</p>
      <a-input v-model="deleteInput" placeholder="DELETE" />
    </a-modal>
  </div>
</template>

<style scoped>
.settings-card {
  max-width: 860px;
}

.danger-zone {
  max-width: 860px;
}

.setting-row {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border-1);
}

.setting-row:last-child {
  border-bottom: 0;
}

.plan-recommended {
  border-color: rgb(var(--primary-6));
}

.danger-zone {
  border-color: rgb(var(--red-3));
}

@media (max-width: 767px) {
  .settings-tabs :deep(.arco-tabs-nav-tab) {
    white-space: nowrap;
  }

  .settings-tabs :deep(.arco-tabs-nav-type-rounded .arco-tabs-tab) {
    padding: 3px 12px;
    margin: 0 3px;
  }
}
</style>
