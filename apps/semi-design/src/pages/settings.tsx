import { useState } from "react"
import { Avatar, Badge, Button, Card, Form, Input, List, Modal, Progress, Select, Switch, Table, Tabs, Tag, Toast, Typography } from "@douyinfe/semi-ui"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import { Icon } from "@/icons"
import { PageHeader, SectionCard, StatusTag, money } from "./shared"

const { Text, Title } = Typography
const roleColor: Record<string, "blue" | "purple" | "grey"> = { owner: "purple", admin: "blue", member: "grey" }
const notifyRows = [
  { key: "orders", label: "订单动态", desc: "新订单、退款与发货更新" },
  { key: "mentions", label: "提及与评论", desc: "有人 @ 你或回复你的评论" },
  { key: "digest", label: "每周摘要", desc: "每周一发送经营周报" },
  { key: "security", label: "安全提醒", desc: "新设备登录、密码修改" },
]

export function SettingsPage() {
  const [confirm, setConfirm] = useState("")
  const [danger, setDanger] = useState(false)
  const pro = plans.find((plan) => plan.recommended) ?? plans[0]

  return (
    <div className="acme-page">
      <PageHeader title="设置" description="管理个人资料、安全、通知与团队。" />
      <Tabs type="line" collapsible tabPosition="top">
        <Tabs.TabPane tab="个人资料" itemKey="profile">
          <SectionCard title="个人资料" description="这些信息会展示给团队成员。">
            <div className="acme-row" style={{ marginBottom: 16 }}><Avatar size="large" color="light-blue">林</Avatar><div><Button theme="light" size="small">更换头像</Button><Text type="tertiary" size="small" style={{ display: "block", marginTop: 4 }}>PNG/JPG，2MB 以内</Text></div></div>
            <Form labelPosition="top" initValues={{ name: team[0].name, email: team[0].email, bio: "热爱把复杂的数据变成简单的决策。", timezone: "Asia/Shanghai" }} onSubmit={() => Toast.success("资料已保存")}>
              <div className="acme-grid-2 acme-grid"><Form.Input field="name" label="姓名" /><Form.Input field="email" label="邮箱" disabled /></div>
              <Form.TextArea field="bio" label="简介" rows={3} maxCount={120} />
              <Form.Select field="timezone" label="时区" style={{ width: 240, maxWidth: "100%" }} optionList={["Asia/Shanghai", "Asia/Tokyo", "Europe/London", "America/New_York"].map((value) => ({ value, label: value }))} />
              <Button htmlType="submit" theme="solid">保存更改</Button>
            </Form>
          </SectionCard>
        </Tabs.TabPane>
        <Tabs.TabPane tab="安全" itemKey="security">
          <div className="acme-page" style={{ gap: 16 }}>
            <SectionCard title="修改密码">
              <Form labelPosition="top" onSubmit={() => Toast.success("密码已更新")}>
                <Form.Input field="current" label="当前密码" mode="password" rules={[{ required: true, message: "请输入当前密码" }]} />
                <div className="acme-grid-2 acme-grid"><Form.Input field="next" label="新密码" mode="password" rules={[{ min: 8, message: "至少 8 位" }]} /><Form.Input field="again" label="确认新密码" mode="password" /></div>
                <Button htmlType="submit" theme="solid">更新密码</Button>
              </Form>
            </SectionCard>
            <SectionCard title="两步验证" extra={<Switch defaultChecked aria-label="两步验证" />}><Text type="secondary">已通过验证器应用开启，登录新设备时需要输入动态验证码。</Text></SectionCard>
            <SectionCard title="登录会话" description="当前登录的设备与位置。">
              <List dataSource={sessions} renderItem={(item) => <List.Item main={<div><Text strong>{item.device}</Text>{item.current ? <Tag color="green" size="small" style={{ marginLeft: 8 }}>当前设备</Tag> : null}<br /><Text type="tertiary" size="small">{item.location} · {item.time}</Text></div>} extra={item.current ? null : <Button theme="borderless" type="danger" size="small" onClick={() => Toast.success("已登出该设备")}>登出</Button>} />} />
            </SectionCard>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="通知" itemKey="notifications">
          <SectionCard title="通知偏好" description="按渠道选择接收方式。">
            <div className="acme-scroll-x">
              <Table size="small" pagination={false} rowKey="key" dataSource={notifyRows} columns={[
                { title: "事件", dataIndex: "label", render: (value: string, record: (typeof notifyRows)[number]) => <div><Text>{value}</Text><br /><Text type="tertiary" size="small">{record.desc}</Text></div> },
                { title: "邮件", dataIndex: "email", width: 80, render: () => <Switch defaultChecked size="small" aria-label="邮件" /> },
                { title: "推送", dataIndex: "push", width: 80, render: (_: unknown, record: (typeof notifyRows)[number]) => <Switch defaultChecked={record.key !== "digest"} size="small" aria-label="推送" /> },
                { title: "短信", dataIndex: "sms", width: 80, render: (_: unknown, record: (typeof notifyRows)[number]) => <Switch defaultChecked={record.key === "security"} size="small" aria-label="短信" /> },
              ]} />
            </div>
          </SectionCard>
        </Tabs.TabPane>
        <Tabs.TabPane tab="团队" itemKey="team">
          <SectionCard title="团队成员" description={`${team.length} 位成员`} extra={<Button theme="solid" size="small" icon={<Icon name="user-plus" />} onClick={() => Toast.info("邀请链接已复制")}>邀请</Button>}>
            <div className="acme-scroll-x">
              <Table size="small" scroll={{ x: 560 }} pagination={false} rowKey="email" dataSource={team} columns={[
                { title: "成员", dataIndex: "name", render: (value: string, record: (typeof team)[number]) => <span className="acme-row" style={{ flexWrap: "nowrap" }}><Avatar size="extra-small" color="light-blue">{value.slice(0, 1)}</Avatar><span><Text>{value}</Text><br /><Text type="tertiary" size="small">{record.email}</Text></span></span> },
                { title: "角色", dataIndex: "role", render: (value: string) => <Select size="small" defaultValue={value} style={{ width: 110 }} optionList={["owner", "admin", "member"].map((role) => ({ value: role, label: <Tag color={roleColor[role]} type="light">{role}</Tag> }))} /> },
                { title: "最近活跃", dataIndex: "lastActive" },
                { title: "", dataIndex: "actions", width: 60, render: () => <Button theme="borderless" type="danger" size="small" icon={<Icon name="trash" />} aria-label="移除成员" /> },
              ]} />
            </div>
          </SectionCard>
        </Tabs.TabPane>
        <Tabs.TabPane tab="计费" itemKey="billing">
          <div className="acme-page" style={{ gap: 16 }}>
            <SectionCard title="当前计划" extra={<Badge type="primary" count="推荐" />}>
              <div className="acme-between"><div><Title heading={4} style={{ margin: 0 }}>{pro.name}</Title><Text type="tertiary">{money(pro.price ?? 0)} / 月 · {pro.features.join(" · ")}</Text></div><Button theme="light">更换计划</Button></div>
              <div style={{ marginTop: 16 }}><div className="acme-between"><Text size="small">本月席位使用</Text><Text size="small" type="tertiary">{team.length} / 10</Text></div><Progress percent={team.length * 10} aria-label="席位使用" /></div>
            </SectionCard>
            <SectionCard title="支付方式"><div className="acme-between"><span className="acme-row"><Icon name="credit-card" size={20} /><Text>Visa •••• 4242 · 08/28</Text></span><Button theme="light" size="small">更新</Button></div></SectionCard>
            <SectionCard title="账单历史">
              <div className="acme-scroll-x">
                <Table size="small" scroll={{ x: 480 }} pagination={false} rowKey="id" dataSource={invoices} columns={[
                  { title: "账单号", dataIndex: "id" }, { title: "日期", dataIndex: "date" },
                  { title: "状态", dataIndex: "status", render: (value: string) => <StatusTag value={value} /> },
                  { title: "金额", dataIndex: "amount", align: "right", render: (value: number) => money(value) },
                  { title: "", dataIndex: "dl", width: 60, render: () => <Button theme="borderless" size="small" icon={<Icon name="download" />} aria-label="下载账单" /> },
                ]} />
              </div>
            </SectionCard>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="危险区域" itemKey="danger">
          <Card className="acme-danger-card" title={<Text type="danger" strong>删除工作区</Text>}>
            <Text type="secondary">删除后所有订单、成员与账单数据将永久移除，且无法恢复。</Text>
            <div style={{ marginTop: 16 }}><Button type="danger" theme="solid" onClick={() => setDanger(true)}>删除工作区</Button></div>
          </Card>
        </Tabs.TabPane>
      </Tabs>
      <Modal title="确认删除工作区" visible={danger} onCancel={() => { setDanger(false); setConfirm("") }} okText="永久删除" okType="danger" okButtonProps={{ disabled: confirm !== "acme" }} onOk={() => { setDanger(false); setConfirm(""); Toast.error("工作区已删除（演示）") }} centered>
        <Text>请输入工作区名称 <Text code>acme</Text> 以确认：</Text>
        <Input value={confirm} onChange={setConfirm} placeholder="acme" style={{ marginTop: 12 }} />
      </Modal>
    </div>
  )
}
