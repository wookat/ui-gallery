import { useState } from "react"
import Alert from "@cloudscape-design/components/alert"
import Autosuggest from "@cloudscape-design/components/autosuggest"
import Badge from "@cloudscape-design/components/badge"
import Box from "@cloudscape-design/components/box"
import Button from "@cloudscape-design/components/button"
import Cards from "@cloudscape-design/components/cards"
import Checkbox from "@cloudscape-design/components/checkbox"
import ColumnLayout from "@cloudscape-design/components/column-layout"
import Container from "@cloudscape-design/components/container"
import ContentLayout from "@cloudscape-design/components/content-layout"
import FileUpload from "@cloudscape-design/components/file-upload"
import FormField from "@cloudscape-design/components/form-field"
import Header from "@cloudscape-design/components/header"
import Input from "@cloudscape-design/components/input"
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs"
import Modal from "@cloudscape-design/components/modal"
import SegmentedControl from "@cloudscape-design/components/segmented-control"
import Select, { type SelectProps } from "@cloudscape-design/components/select"
import SpaceBetween from "@cloudscape-design/components/space-between"
import StatusIndicator from "@cloudscape-design/components/status-indicator"
import Table from "@cloudscape-design/components/table"
import Tabs from "@cloudscape-design/components/tabs"
import Textarea from "@cloudscape-design/components/textarea"
import Toggle from "@cloudscape-design/components/toggle"

import invoices from "@ui-gallery/spec/mock/invoices.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"

import { AppIcon, iconProps } from "@/lib/icons"
import { label, money, OrderStatus, PageHeader, PersonAvatar } from "./shared"

type Member = (typeof team)[number]
type Plan = (typeof plans)[number]

const LANGS: SelectProps.Option[] = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en-US", label: "English" },
  { value: "ja-JP", label: "日本語" },
]
const TIMEZONES = ["Asia/Shanghai", "Asia/Tokyo", "Europe/London", "America/New_York", "America/Los_Angeles"]
const ROLE_OPTIONS = Array.from(new Set(team.map((m) => m.role))).map((r) => ({ value: r, label: label(r) }))
const CHANNEL_OPTIONS = [
  { id: "email", text: "邮件" },
  { id: "push", text: "推送" },
  { id: "inapp", text: "站内" },
]

const me = team[0]

function Profile() {
  const [avatar, setAvatar] = useState<File[]>([])
  const [name, setName] = useState(me.name)
  const [bio, setBio] = useState("")
  const [lang, setLang] = useState(LANGS[0])
  const [tz, setTz] = useState(TIMEZONES[0])
  return (
    <Container header={<Header variant="h2">个人资料</Header>} footer={<Button variant="primary">保存</Button>}>
      <SpaceBetween size="l">
        <FormField label="头像" description="PNG/JPG，2MB 以内">
          <SpaceBetween direction="horizontal" size="m" alignItems="center">
            <PersonAvatar name={me.name} size="large" />
            <FileUpload
              value={avatar}
              onChange={({ detail }) => setAvatar(detail.value)}
              accept="image/*"
              i18nStrings={{
                uploadButtonText: () => "上传头像",
                dropzoneText: () => "拖拽图片到此处",
                removeFileAriaLabel: () => "移除",
                limitShowFewer: "收起",
                limitShowMore: "更多",
                errorIconAriaLabel: "错误",
              }}
            />
          </SpaceBetween>
        </FormField>
        <ColumnLayout columns={2}>
          <FormField label="姓名">
            <Input value={name} onChange={({ detail }) => setName(detail.value)} />
          </FormField>
          <FormField label="邮箱" description="登录邮箱不可修改">
            <Input value={me.email} disabled />
          </FormField>
          <FormField label="语言">
            <Select selectedOption={lang} onChange={({ detail }) => setLang(detail.selectedOption)} options={LANGS} />
          </FormField>
          <FormField label="时区">
            <Autosuggest
              value={tz}
              onChange={({ detail }) => setTz(detail.value)}
              options={TIMEZONES.map((t) => ({ value: t }))}
              enteredTextLabel={(v) => `使用 “${v}”`}
              ariaLabel="时区"
            />
          </FormField>
        </ColumnLayout>
        <FormField label="简介" constraintText={`${bio.length}/160`} stretch>
          <Textarea value={bio} onChange={({ detail }) => setBio(detail.value)} rows={3} placeholder="介绍一下你自己" />
        </FormField>
      </SpaceBetween>
    </Container>
  )
}

function Security() {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [twoFactor, setTwoFactor] = useState(true)
  const [revoked, setRevoked] = useState<string[]>([])
  const mismatch = confirm && next !== confirm ? "两次输入的密码不一致" : undefined
  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">修改密码</Header>} footer={<Button variant="primary" disabled={!current || !next || !!mismatch}>更新密码</Button>}>
        <ColumnLayout columns={3}>
          <FormField label="当前密码">
            <Input type="password" value={current} onChange={({ detail }) => setCurrent(detail.value)} />
          </FormField>
          <FormField label="新密码" constraintText="至少 8 位，包含数字">
            <Input type="password" value={next} onChange={({ detail }) => setNext(detail.value)} />
          </FormField>
          <FormField label="确认新密码" errorText={mismatch}>
            <Input type="password" value={confirm} onChange={({ detail }) => setConfirm(detail.value)} />
          </FormField>
        </ColumnLayout>
      </Container>
      <Container header={<Header variant="h2">两步验证</Header>}>
        <ColumnLayout columns={2}>
          <SpaceBetween size="s">
            <Toggle checked={twoFactor} onChange={({ detail }) => setTwoFactor(detail.checked)}>
              启用两步验证
            </Toggle>
            <Box color="text-body-secondary">使用身份验证器 App 扫描右侧二维码，登录时需输入 6 位验证码。</Box>
            <StatusIndicator type={twoFactor ? "success" : "warning"}>{twoFactor ? "已启用" : "未启用"}</StatusIndicator>
          </SpaceBetween>
          <div className="gallery-qr" aria-label="二维码占位" role="img">
            <AppIcon name="key" size="large" />
          </div>
        </ColumnLayout>
      </Container>
      <Table
        variant="container"
        header={<Header variant="h2" counter={`(${sessions.length - revoked.length})`}>活跃会话</Header>}
        items={sessions.filter((s) => !revoked.includes(s.device))}
        trackBy="device"
        columnDefinitions={[
          { id: "device", header: "设备", cell: (s) => s.device, isRowHeader: true },
          { id: "location", header: "位置", cell: (s) => s.location },
          { id: "last", header: "最近活动", cell: (s) => (s.current ? <StatusIndicator type="success">当前会话</StatusIndicator> : s.time) },
          {
            id: "actions",
            header: "操作",
            cell: (s) => (
              <Button variant="inline-link" disabled={s.current} onClick={() => setRevoked((r) => [...r, s.device])}>
                注销
              </Button>
            ),
          },
        ]}
      />
    </SpaceBetween>
  )
}

function Notifications() {
  const [channel, setChannel] = useState("email")
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(notifications.map((n) => [n.title, n.unread])))
  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={<SegmentedControl selectedId={channel} onChange={({ detail }) => setChannel(detail.selectedId)} options={CHANNEL_OPTIONS} label="通知渠道" />}
        >
          通知偏好
        </Header>
      }
    >
      <ColumnLayout columns={1} borders="horizontal">
        {notifications.map((n) => (
          <SpaceBetween key={n.title} direction="horizontal" size="m" alignItems="center">
            <Toggle checked={enabled[n.title]} onChange={({ detail }) => setEnabled((e) => ({ ...e, [n.title]: detail.checked }))} ariaLabel={n.title} />
            <div>
              <Box variant="strong">{n.title}</Box>
              <Box variant="small" color="text-body-secondary">
                {n.time} · {CHANNEL_OPTIONS.find((c) => c.id === channel)?.text}
              </Box>
            </div>
          </SpaceBetween>
        ))}
      </ColumnLayout>
    </Container>
  )
}

function Team() {
  const [members, setMembers] = useState<Member[]>(team)
  const [invite, setInvite] = useState("")
  return (
    <Table
      variant="container"
      items={members}
      trackBy="email"
      header={
        <Header
          variant="h2"
          counter={`(${members.length})`}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Input value={invite} onChange={({ detail }) => setInvite(detail.value)} placeholder="邮箱邀请成员" type="email" inputMode="email" />
              <Button variant="primary" {...iconProps("plus")} disabled={!invite}>
                邀请
              </Button>
            </SpaceBetween>
          }
        >
          团队成员
        </Header>
      }
      columnDefinitions={[
        {
          id: "name",
          header: "成员",
          isRowHeader: true,
          cell: (m) => (
            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
              <PersonAvatar name={m.name} size="small" />
              <div>
                <div>{m.name}</div>
                <Box variant="small" color="text-body-secondary">
                  {m.email}
                </Box>
              </div>
            </SpaceBetween>
          ),
        },
        {
          id: "role",
          header: "角色",
          cell: (m) => (
            <Select
              selectedOption={{ value: m.role, label: label(m.role) }}
              options={ROLE_OPTIONS}
              disabled={m.role === "owner"}
              expandToViewport
              onChange={({ detail }) =>
                setMembers((all) => all.map((x) => (x.email === m.email ? { ...x, role: detail.selectedOption.value ?? x.role } : x)))
              }
              ariaLabel={`${m.name} 的角色`}
            />
          ),
        },
        { id: "last", header: "最近活动", cell: (m) => m.lastActive },
        {
          id: "actions",
          header: "操作",
          cell: (m) => (
            <Button variant="inline-icon" {...iconProps("trash")} ariaLabel={`移除 ${m.name}`} disabled={m.role === "owner"} onClick={() => setMembers((all) => all.filter((x) => x.email !== m.email))} />
          ),
        },
      ]}
    />
  )
}

function Billing() {
  const current = plans.find((p) => p.recommended) ?? plans[0]
  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2" actions={<Button>管理订阅</Button>}>当前计划</Header>}>
        <KeyValuePairs
          columns={3}
          items={[
            { label: "计划", value: <SpaceBetween direction="horizontal" size="xs" alignItems="center"><span>{current.name}</span><Badge color="blue">当前</Badge></SpaceBetween> },
            { label: "月费", value: current.price === null ? "联系销售" : money(current.price) },
            { label: "下次账单", value: invoices[0]?.date ?? "—" },
          ]}
        />
      </Container>
      <Cards<Plan>
        items={plans}
        trackBy="name"
        cardsPerRow={[{ cards: 1 }, { minWidth: 600, cards: 3 }]}
        header={<Header variant="h2">计划对比</Header>}
        cardDefinition={{
          header: (p) => (
            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
              <span>{p.name}</span>
              {p.recommended && <Badge color="green">推荐</Badge>}
            </SpaceBetween>
          ),
          sections: [
            { id: "price", content: (p) => <Box variant="awsui-value-large">{p.price === null ? "定制" : `${money(p.price)}/月`}</Box> },
            {
              id: "features",
              content: (p) => (
                <SpaceBetween size="xxs">
                  {p.features.map((f) => (
                    <StatusIndicator key={f} type="success">
                      {f}
                    </StatusIndicator>
                  ))}
                </SpaceBetween>
              ),
            },
            { id: "cta", content: (p) => <Button variant={p.recommended ? "primary" : "normal"} fullWidth>{p.name === current.name ? "当前计划" : p.price === null ? "联系销售" : "选择"}</Button> },
          ],
        }}
      />
      <Table
        variant="container"
        header={<Header variant="h2" counter={`(${invoices.length})`}>发票</Header>}
        items={invoices}
        trackBy="id"
        columnDefinitions={[
          { id: "id", header: "编号", cell: (i) => i.id, isRowHeader: true },
          { id: "date", header: "日期", cell: (i) => i.date },
          { id: "amount", header: <Box textAlign="right">金额</Box>, cell: (i) => <Box textAlign="right">{money(i.amount)}</Box> },
          { id: "status", header: "状态", cell: (i) => <OrderStatus status={i.status} /> },
          { id: "dl", header: "下载", cell: () => <Button variant="inline-icon" {...iconProps("download")} ariaLabel="下载发票" /> },
        ]}
      />
    </SpaceBetween>
  )
}

function DangerZone() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState("")
  const [ack, setAck] = useState(false)
  return (
    <>
      <div className="gallery-danger">
        <Container header={<Header variant="h2" description="以下操作不可撤销，请谨慎处理">危险区</Header>}>
          <SpaceBetween direction="horizontal" size="m" alignItems="center">
            <Box>删除账号将永久移除所有数据、订单与团队成员关系。</Box>
            <Button onClick={() => setOpen(true)} {...iconProps("trash")}>
              删除账号
            </Button>
          </SpaceBetween>
        </Container>
      </div>
      <Modal
        visible={open}
        onDismiss={() => setOpen(false)}
        header="确认删除账号"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button variant="primary" disabled={confirm !== "DELETE" || !ack} onClick={() => setOpen(false)}>
                永久删除
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="m">
          <Alert type="error">此操作无法撤销。</Alert>
          <FormField label="请输入 DELETE 以确认" stretch>
            <Input value={confirm} onChange={({ detail }) => setConfirm(detail.value)} />
          </FormField>
          <Checkbox checked={ack} onChange={({ detail }) => setAck(detail.checked)}>
            我了解数据将被永久删除
          </Checkbox>
        </SpaceBetween>
      </Modal>
    </>
  )
}

export function SettingsPage() {
  return (
    <ContentLayout header={<PageHeader title="设置" description="管理个人资料、安全、通知、团队与计费" />}>
      <SpaceBetween size="xl">
        <Tabs
          variant="container"
          tabs={[
            { id: "profile", label: "个人资料", content: <Profile /> },
            { id: "security", label: "账号安全", content: <Security /> },
            { id: "notifications", label: "通知", content: <Notifications /> },
            { id: "team", label: "团队", content: <Team /> },
            { id: "billing", label: "计费", content: <Billing /> },
          ]}
        />
        <DangerZone />
      </SpaceBetween>
    </ContentLayout>
  )
}
