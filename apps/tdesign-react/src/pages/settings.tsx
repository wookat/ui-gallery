import { useState } from "react"
import { Avatar, Button, Card, DialogPlugin, Form, Input, List, MessagePlugin, Radio, Select, Switch, Tabs, Table, Tag, Textarea, Typography, Upload } from "tdesign-react"
import { Icon } from "@/components/icon"
import { ThemedQRCode } from "@/components/themed-qrcode"
import { useIsMobile } from "@/url-settings"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"

export function SettingsPage() {
  const [tab, setTab] = useState("profile")
  const isMobile = useIsMobile()
  const [deleteText, setDeleteText] = useState("")
  const destroyAccount = () => {
    const dialog = DialogPlugin.confirm({ header: "删除账号", body: <div className="stack"><Typography.Paragraph>此操作不可撤销，请输入“删除”确认。</Typography.Paragraph><Input value={deleteText} onChange={setDeleteText} placeholder="输入删除" /></div>, confirmBtn: { content: "确认删除", theme: "danger", disabled: deleteText !== "删除" }, onConfirm: () => { MessagePlugin.success("已提交删除申请"); dialog.destroy() } })
  }
  const teamColumns = [{ colKey: "name", title: "成员", cell: ({ row }: { row: typeof team[number] }) => <div className="inline"><Avatar size="28px">{row.name.slice(0, 1)}</Avatar>{row.name}</div> }, { colKey: "email", title: "邮箱" }, { colKey: "role", title: "角色", cell: ({ row }: { row: typeof team[number] }) => <Select value={row.role} options={["owner", "admin", "member", "viewer"].map((value) => ({ label: value, value }))} /> }, { colKey: "lastActive", title: "最近活跃" }, { colKey: "op", title: "操作", cell: () => <Button variant="text" theme="danger">移除</Button> }]
  return (
    <div className="stack">
      <div className="page-heading"><div><Typography.Title level="h2">设置</Typography.Title><Typography.Paragraph>管理个人资料、团队与订阅。</Typography.Paragraph></div></div>
      <Tabs value={tab} placement={isMobile ? "top" : "left"} onChange={(value) => setTab(String(value))}>
        <Tabs.TabPanel value="profile" label="个人资料"><Card title="个人资料"><Form layout="vertical" initialData={{ name: "林晓", bio: "负责 Acme Console 的增长与运营。", language: "zh-CN", timezone: "Asia/Shanghai" }}><Form.FormItem label="头像" name="avatar"><Upload autoUpload={false} theme="custom" triggerButtonProps={{ size: isMobile ? "large" : "medium" }} /></Form.FormItem><Form.FormItem label="姓名" name="name"><Input /></Form.FormItem><Form.FormItem label="简介" name="bio"><Textarea /></Form.FormItem><Form.FormItem label="语言" name="language"><Select options={[{ label: "简体中文", value: "zh-CN" }, { label: "English", value: "en-US" }]} /></Form.FormItem><Form.FormItem label="时区" name="timezone"><Select filterable options={["Asia/Shanghai", "Asia/Tokyo", "Europe/Berlin"].map((value) => ({ label: value, value }))} /></Form.FormItem><Button theme="primary">保存更改</Button></Form></Card></Tabs.TabPanel>
        <Tabs.TabPanel value="security" label="账号安全"><div className="stack"><Card title="修改密码"><Form layout="vertical"><Form.FormItem label="当前密码" rules={[{ required: true, message: "请输入当前密码" }]}><Input type="password" /></Form.FormItem><Form.FormItem label="新密码" rules={[{ required: true, message: "请输入新密码" }]}><Input type="password" /></Form.FormItem><Button theme="primary">更新密码</Button></Form></Card><Card title="两步验证"><div className="inline"><Switch /><span>启用两步验证</span><ThemedQRCode value="https://example.com/acme-console" size={100} /></div></Card><Card title="活跃会话"><List>{sessions.map((session) => <List.ListItem key={session.device} action={<Button variant="text" disabled={session.current}>注销</Button>}><List.ListItemMeta title={session.device} description={`${session.location} · ${session.time}`} /></List.ListItem>)}</List></Card></div></Tabs.TabPanel>
        <Tabs.TabPanel value="notifications" label="通知"><Card title="通知偏好"><div className="stack"><Typography.Title level="h4">通知渠道</Typography.Title><div className="inline"><Radio.Group variant="default-filled" defaultValue="email"><Radio value="email">邮件</Radio><Radio value="push">推送</Radio><Radio value="inbox">站内</Radio></Radio.Group></div>{["新订单", "团队动态", "系统维护"].map((label) => <div className="inline" style={{ justifyContent: "space-between" }} key={label}><span>{label}</span><Switch defaultValue /></div>)}</div></Card></Tabs.TabPanel>
        <Tabs.TabPanel value="team" label="团队"><Card title="团队成员"><div className="inline" style={{ marginBottom: 16 }}><Input placeholder="成员邮箱" /><Button theme="primary">邀请</Button></div><div className="table-scroll"><Table rowKey="email" data={team} columns={teamColumns} /></div></Card></Tabs.TabPanel>
        <Tabs.TabPanel value="billing" label="计费"><div className="stack"><div className="grid-three">{plans.map((plan) => <Card key={plan.name} title={<div className="inline" style={{ justifyContent: "space-between" }}><span>{plan.name}</span>{plan.recommended && <Tag theme="primary">推荐</Tag>}</div>} bordered><Typography.Title level="h3">{plan.price === null ? "定制" : plan.price === 0 ? "免费" : `¥${plan.price}/月`}</Typography.Title><div className="stack">{plan.features.map((feature) => <div key={feature}><Icon name="check" /> {feature}</div>)}</div><Button block theme={plan.recommended ? "primary" : "default"} style={{ marginTop: 16 }}>选择方案</Button></Card>)}</div><Card title="发票"><Table rowKey="id" data={invoices} columns={[{ colKey: "id", title: "发票号" }, { colKey: "date", title: "日期" }, { colKey: "amount", title: "金额", cell: ({ row }: { row: typeof invoices[number] }) => `¥${row.amount}` }, { colKey: "status", title: "状态", cell: ({ row }: { row: typeof invoices[number] }) => <Tag theme={row.status === "paid" ? "success" : "warning"}>{row.status === "paid" ? "已支付" : "待支付"}</Tag> }]} /></Card></div></Tabs.TabPanel>
      </Tabs>
      <Card className="danger-card" title="危险区"><div className="inline" style={{ justifyContent: "space-between" }}><Typography.Paragraph>删除账号将永久移除所有数据。</Typography.Paragraph><Button theme="danger" onClick={destroyAccount}>删除账号</Button></div></Card>
    </div>
  )
}
