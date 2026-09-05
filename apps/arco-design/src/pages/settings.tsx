import { useState } from "react"
import { Avatar, Button, Card, Descriptions, Form, Input, List, Message, Modal, Select, Space, Switch, Table, Tabs, Tag, Typography, Upload } from "@arco-design/web-react"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import { Icon } from "@/components/icon"
import { useIsMobile } from "@/hooks/use-mobile"
import { PageHeader } from "./shared"

export function SettingsPage() {
  const isMobile = useIsMobile()
  const [dangerOpen, setDangerOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  return (
    <>
      <PageHeader title="设置" description="管理你的个人资料、通知和团队偏好。" />
      <Tabs defaultActiveTab="profile" tabPosition={isMobile ? "top" : "left"} type={isMobile ? "line" : undefined} className="settings-tabs">
        <Tabs.TabPane key="profile" title="个人资料"><Card title="个人资料"><Form layout="vertical"><Form.Item label="头像"><Upload showUploadList={false}><Avatar size={64}>林</Avatar></Upload></Form.Item><Form.Item label="姓名"><Input defaultValue="林晓" /></Form.Item><Form.Item label="简介"><Input.TextArea defaultValue="产品与增长负责人。" /></Form.Item><Form.Item label="语言"><Select defaultValue="zh-CN" options={[{ label: "简体中文", value: "zh-CN" }, { label: "English", value: "en-US" }]} /></Form.Item><Form.Item label="时区"><Select defaultValue="Asia/Shanghai" options={[{ label: "中国上海 (UTC+8)", value: "Asia/Shanghai" }, { label: "Europe/Berlin (UTC+1)", value: "Europe/Berlin" }]} /></Form.Item><Button type="primary" onClick={() => Message.success("资料已保存")}>保存更改</Button></Form></Card></Tabs.TabPane>
        <Tabs.TabPane key="security" title="账号安全"><Card title="修改密码"><Form layout="vertical"><Form.Item label="当前密码"><Input.Password /></Form.Item><Form.Item label="新密码"><Input.Password /></Form.Item><Form.Item label="确认新密码"><Input.Password /></Form.Item><Button type="primary">更新密码</Button></Form></Card><Card title="两步验证" style={{ marginTop: 16 }}><div className="between"><Typography.Text>使用身份验证器保护账户</Typography.Text><Switch /></div><div className="qr-placeholder"><Icon name="grid" size={40} /><Typography.Text type="secondary">二维码占位</Typography.Text></div></Card><Card title="活跃会话" style={{ marginTop: 16 }}><List dataSource={sessions} render={(item) => <List.Item key={item.device} actions={[<Button key="logout" type="text">注销</Button>]}><List.Item.Meta title={item.device} description={`${item.location} · ${item.time}`} /></List.Item>} /></Card></Tabs.TabPane>
        <Tabs.TabPane key="notifications" title="通知"><Card title="通知偏好"><div className="stack">{["订单状态变化", "团队活动动态", "产品更新", "安全提醒"].map((label) => <div className="between" key={label}><div><Typography.Text>{label}</Typography.Text><Typography.Text type="secondary" style={{ display: "block" }}>通过邮件和站内消息接收通知</Typography.Text></div><Switch defaultChecked /></div>)}<Tag color="blue">邮件 · 推送 · 站内</Tag></div></Card></Tabs.TabPane>
        <Tabs.TabPane key="team" title="团队"><Card title="团队成员"><Table rowKey="email" pagination={false} scroll={{ x: 560 }} data={team} columns={[{ title: "成员", render: (_, record) => <Space><Avatar size={24}>{record.name.slice(0, 1)}</Avatar>{record.name}</Space> }, { title: "邮箱", dataIndex: "email" }, { title: "角色", render: (_, record) => <Select size="small" defaultValue={record.role} options={["owner", "admin", "member", "viewer"].map((role) => ({ label: role, value: role }))} /> }, { title: "最近活跃", dataIndex: "lastActive" }, { title: "操作", render: () => <Button type="text" status="danger">移除</Button> }]} /><Input.Search searchButton="邀请" placeholder="输入邮箱邀请成员" style={{ marginTop: 16 }} /></Card></Tabs.TabPane>
        <Tabs.TabPane key="billing" title="计费"><Card title="当前计划"><Descriptions column={2} data={[{ label: "计划", value: "Pro" }, { label: "下次续费", value: "2026-10-05" }, { label: "席位", value: "12" }, { label: "状态", value: <Tag color="green">有效</Tag> }]} /></Card><div className="grid grid-3">{plans.map((plan) => <Card key={plan.name} title={plan.name} extra={plan.recommended ? <Tag color="arcoblue">推荐</Tag> : null}><Typography.Title heading={3}>{plan.price === null ? "定制" : plan.price === 0 ? "免费" : `¥${plan.price}`}</Typography.Title><Typography.Text type="secondary">{plan.features.join(" · ")}</Typography.Text><Button long style={{ marginTop: 16 }} type={plan.recommended ? "primary" : "secondary"}>选择方案</Button></Card>)}</div><Card title="发票记录" style={{ marginTop: 16 }}><div className="scroll-x"><Table rowKey="id" pagination={false} scroll={{ x: 480 }} columns={[{ title: "发票", dataIndex: "id" }, { title: "日期", dataIndex: "date" }, { title: "金额", dataIndex: "amount" }, { title: "状态", dataIndex: "status" }]} data={invoices} /></div></Card></Tabs.TabPane>
      </Tabs>
      <Card title="危险区" className="danger-card"><Typography.Text type="secondary">删除账户后，所有数据将被永久移除。</Typography.Text><Button status="danger" style={{ marginTop: 12 }} onClick={() => setDangerOpen(true)}>删除账户</Button></Card>
      <Modal title="删除账户" visible={dangerOpen} onCancel={() => { setDangerOpen(false); setConfirmText("") }} onOk={() => { if (confirmText !== "DELETE") return; setDangerOpen(false); setConfirmText(""); Message.success("已提交删除请求") }} okButtonProps={{ disabled: confirmText !== "DELETE", status: "danger" }}><Typography.Paragraph>请输入 DELETE 确认操作。</Typography.Paragraph><Input value={confirmText} onChange={setConfirmText} placeholder="DELETE" /></Modal>
    </>
  )
}
