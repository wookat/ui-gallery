<script setup lang="ts">
import { h, ref } from "vue"
import { NCard, NTabs, NTabPane, NForm, NFormItem, NInput, NSelect, NButton, NAvatar, NUpload, NSwitch, NList, NListItem, NThing, NDataTable, NTag, NFlex, NSpace, NText, NGrid, NGi, NH3, NModal, NQrCode, NRadioGroup, NRadioButton, NDivider, NInputGroup, NBadge, useMessage, useThemeVars, type DataTableColumns } from "naive-ui"
import team from "@ui-gallery/spec/mock/team.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import PageHeader from "../components/PageHeader.vue"
import StatusTag from "../components/StatusTag.vue"
import { Icon } from "../icons"
import { useIsMobile } from "../composables"

const isMobile = useIsMobile()
const message = useMessage()
const themeVars = useThemeVars()
const tab = ref("profile")
const profile = ref({ name: "林晓", bio: "Acme Console 产品负责人", lang: "zh-CN", tz: "Asia/Shanghai" })
const langs = [{ label: "简体中文", value: "zh-CN" }, { label: "English", value: "en-US" }, { label: "日本語", value: "ja-JP" }]
const zones = ["Asia/Shanghai", "Asia/Tokyo", "Asia/Singapore", "Europe/Berlin", "America/New_York", "UTC"].map((z) => ({ label: z, value: z }))
const password = ref({ current: "", next: "", confirm: "" })
const twoFactor = ref(true)
const notif = ref({ orders: true, mentions: true, digest: false, security: true, marketing: false })
const channel = ref("email")
const roles = ["owner", "admin", "member", "viewer"].map((r) => ({ label: r, value: r }))
const members = ref(team.map((m) => ({ ...m })))
const invite = ref("")
const yearly = ref(false)
const deleteOpen = ref(false)
const confirmText = ref("")

type Member = (typeof members.value)[number]
const memberColumns: DataTableColumns<Member> = [
  { title: "成员", key: "name", render: (row) => h(NFlex, { align: "center", wrap: false }, () => [h(NAvatar, { round: true, size: "small" }, () => row.name[0]), h("div", [h("div", row.name), h(NText, { depth: 3, style: "font-size:12px" }, () => row.email)])]) },
  { title: "角色", key: "role", width: 140, render: (row) => h(NSelect, { value: row.role, options: roles, size: "medium", onUpdateValue: (v: string) => { row.role = v } }) },
  { title: "最近活跃", key: "lastActive" },
  { title: "", key: "actions", width: 80, render: (row) => h(NButton, { size: "medium", quaternary: true, type: "error", onClick: () => message.warning(`已移除 ${row.name}`) }, () => "移除") },
]
type Invoice = (typeof invoices)[number]
const invoiceColumns: DataTableColumns<Invoice> = [
  { title: "发票号", key: "id" }, { title: "日期", key: "date" },
  { title: "金额", key: "amount", align: "right", render: (row) => `$${row.amount}` },
  { title: "状态", key: "status", render: (row) => h(StatusTag, { value: row.status }) },
  { title: "", key: "dl", width: 60, render: () => h(NButton, { size: "medium", quaternary: true, "aria-label": "下载" }, { icon: () => h(Icon, { name: "download", size: 14 }) }) },
]
</script>

<template>
  <NSpace vertical :size="20">
    <PageHeader title="设置" description="管理个人资料、安全、通知、团队与计费。" />
    <NTabs v-model:value="tab" :placement="isMobile ? 'top' : 'left'" type="line" animated :pane-style="isMobile ? '' : 'padding-left: 24px'">
      <NTabPane name="profile" tab="个人资料">
        <NCard title="个人资料" size="small">
          <NForm :model="profile" label-placement="top">
            <NFlex align="center" style="margin-bottom: 16px"><NAvatar round :size="64">林</NAvatar><NUpload :default-upload="false" :show-file-list="false" accept="image/*"><NButton secondary size="medium"><template #icon><Icon name="upload" :size="14" /></template>上传头像</NButton></NUpload></NFlex>
            <NGrid cols="1 m:2" responsive="screen" :x-gap="16">
              <NGi><NFormItem label="姓名"><NInput v-model:value="profile.name" /></NFormItem></NGi>
              <NGi><NFormItem label="语言"><NSelect v-model:value="profile.lang" :options="langs" /></NFormItem></NGi>
              <NGi :span="2"><NFormItem label="简介"><NInput v-model:value="profile.bio" type="textarea" :autosize="{ minRows: 2 }" show-count :maxlength="120" /></NFormItem></NGi>
              <NGi :span="2"><NFormItem label="时区"><NSelect v-model:value="profile.tz" :options="zones" filterable placeholder="搜索时区" /></NFormItem></NGi>
            </NGrid>
            <NFlex justify="end"><NButton type="primary" @click="message.success('资料已保存')">保存更改</NButton></NFlex>
          </NForm>
        </NCard>
      </NTabPane>
      <NTabPane name="security" tab="账号安全">
        <NSpace vertical :size="16">
          <NCard title="修改密码" size="small">
            <NForm :model="password" label-placement="top">
              <NGrid cols="1 m:3" responsive="screen" :x-gap="16">
                <NGi><NFormItem label="当前密码"><NInput v-model:value="password.current" type="password" show-password-on="click" /></NFormItem></NGi>
                <NGi><NFormItem label="新密码"><NInput v-model:value="password.next" type="password" show-password-on="click" /></NFormItem></NGi>
                <NGi><NFormItem label="确认新密码"><NInput v-model:value="password.confirm" type="password" show-password-on="click" :status="password.confirm && password.confirm !== password.next ? 'error' : undefined" /></NFormItem></NGi>
              </NGrid>
              <NFlex justify="end"><NButton type="primary" @click="message.success('密码已更新')">更新密码</NButton></NFlex>
            </NForm>
          </NCard>
          <NCard title="两步验证" size="small">
            <NFlex justify="space-between" align="center" :wrap="true">
              <div><NText strong>启用两步验证</NText><br /><NText depth="3">使用验证器 App 扫描二维码绑定</NText></div>
              <NSwitch v-model:value="twoFactor" />
            </NFlex>
            <NFlex v-if="twoFactor" align="center" style="margin-top: 16px"><NQrCode value="otpauth://totp/Acme:linxiao?secret=DEMO" :size="120" /><NText depth="3" style="max-width: 320px">二维码仅为占位示例，绑定后请妥善保存恢复码。</NText></NFlex>
          </NCard>
          <NCard title="活跃会话" size="small" content-style="padding: 0">
            <NList hoverable>
              <NListItem v-for="s in sessions" :key="s.device">
                <NThing :title="s.device" :description="s.location + ' · ' + s.time"><template #header-extra><NTag v-if="s.current" type="success" size="small" round :bordered="false">当前设备</NTag></template></NThing>
                <template #suffix><NButton size="medium" secondary :disabled="s.current" @click="message.success('会话已注销')">注销</NButton></template>
              </NListItem>
            </NList>
          </NCard>
        </NSpace>
      </NTabPane>
      <NTabPane name="notify" tab="通知">
        <NCard title="通知偏好" size="small">
          <NRadioGroup v-model:value="channel" style="margin-bottom: 16px"><NRadioButton value="email">邮件</NRadioButton><NRadioButton value="push">推送</NRadioButton><NRadioButton value="inapp">站内</NRadioButton></NRadioGroup>
          <NList>
            <NListItem v-for="(label, key) in { orders: '新订单与退款', mentions: '有人提到我', digest: '每周经营摘要', security: '安全告警', marketing: '产品更新与活动' }" :key="key">
              <NThing :title="label" :description="`通过${channel === 'email' ? '邮件' : channel === 'push' ? '推送' : '站内消息'}接收`" />
              <template #suffix><NSwitch v-model:value="notif[key]" /></template>
            </NListItem>
          </NList>
        </NCard>
      </NTabPane>
      <NTabPane name="team" tab="团队">
        <NCard title="团队成员" size="small">
          <NInputGroup style="margin-bottom: 16px"><NInput v-model:value="invite" placeholder="输入邮箱邀请成员" /><NButton type="primary" @click="message.success('邀请已发送')"><template #icon><Icon name="plus" /></template>邀请</NButton></NInputGroup>
          <NDataTable :columns="memberColumns" :data="members" :bordered="false" :scroll-x="600" size="small" />
        </NCard>
      </NTabPane>
      <NTabPane name="billing" tab="计费">
        <NSpace vertical :size="16">
          <NCard title="当前计划" size="small">
            <NFlex justify="space-between" align="center" :wrap="true">
              <div><NH3 style="margin: 0">Pro · $99 / 月</NH3><NText depth="3">下次扣费：2026-10-01 · 已用 12 / 50 席位</NText></div>
              <NFlex><NButton secondary>管理支付方式</NButton><NButton type="primary">升级</NButton></NFlex>
            </NFlex>
          </NCard>
          <NFlex align="center" justify="center"><NText>月付</NText><NSwitch v-model:value="yearly" /><NText>年付 <NTag size="small" type="success" round :bordered="false">省 20%</NTag></NText></NFlex>
          <NGrid cols="1 m:3" responsive="screen" :x-gap="16" :y-gap="16">
            <NGi v-for="p in plans" :key="p.name">
              <NBadge :value="p.recommended ? '推荐' : undefined" type="success" style="width: 100%">
                <NCard :title="p.name" size="small" :segmented="{ content: true }" style="width: 100%">
                  <template #header-extra><NText strong>{{ p.price === null ? "联系我们" : p.price === 0 ? "免费" : `$${yearly ? Math.round(p.price * 12 * 0.8) : p.price}/${yearly ? "年" : "月"}` }}</NText></template>
                  <NSpace vertical :size="6"><NFlex v-for="f in p.features" :key="f" align="center" :size="6" :wrap="false"><Icon name="check" :size="14" /><NText>{{ f }}</NText></NFlex></NSpace>
                  <template #footer><NButton block :type="p.recommended ? 'primary' : 'default'" :secondary="!p.recommended">{{ p.price === null ? "联系销售" : "选择" }}</NButton></template>
                </NCard>
              </NBadge>
            </NGi>
          </NGrid>
          <NCard title="发票" size="small" content-style="padding: 0 0 8px"><NDataTable :columns="invoiceColumns" :data="invoices" :bordered="false" size="small" :scroll-x="480" /></NCard>
        </NSpace>
      </NTabPane>
    </NTabs>
    <NDivider />
    <NCard title="危险区" size="small" :style="{ borderColor: themeVars.errorColor }">
      <NFlex justify="space-between" align="center" :wrap="true">
        <div><NText strong>删除账号</NText><br /><NText depth="3">永久删除账号及所有数据，此操作不可撤销。</NText></div>
        <NButton type="error" @click="deleteOpen = true"><template #icon><Icon name="trash" /></template>删除账号</NButton>
      </NFlex>
    </NCard>
    <NModal v-model:show="deleteOpen" preset="dialog" type="error" title="确认删除账号" positive-text="永久删除" negative-text="取消" :positive-button-props="{ disabled: confirmText !== 'DELETE', type: 'error' }" @positive-click="deleteOpen = false; message.error('账号已删除（演示）')">
      <NText>请输入 <NText code>DELETE</NText> 以确认。</NText>
      <NInput v-model:value="confirmText" placeholder="DELETE" style="margin-top: 12px" />
    </NModal>
  </NSpace>
</template>
