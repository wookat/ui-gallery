import { useState } from "react"
import { Alert, Button, Drawer, Message, Modal, Notification, Popconfirm, Popover, Progress, Result, Skeleton, Space, Spin, Typography } from "@arco-design/web-react"
import type { DemoProps } from "./shared"
import { sizes } from "./shared"

export function FeedbackDemo({ name }: DemoProps) {
  switch (name) {
    case "Popover": return <Space wrap>{["top", "bottom", "left", "right"].map((position) => <Popover key={position} position={position as "top" | "bottom" | "left" | "right"} title={`标题 ${position}`} content="Popover 内容"><Button>{position}</Button></Popover>)}</Space>
    case "Alert": return <Space direction="vertical" style={{ width: "100%" }}><Alert type="info" showIcon title="信息" content="信息提示" closable /><Alert type="success" showIcon banner title="成功" content="操作成功" /><Alert type="warning" showIcon title="警告" content="请注意" action={<Button size="mini">撤销</Button>} /><Alert type="error" showIcon banner closable title="错误" content="操作失败" /></Space>
    case "Toast": return <Space wrap>{["success", "info", "warning", "error", "loading"].map((type) => <Button key={type} onClick={() => { Message[type as "success" | "info" | "warning" | "error" | "loading"]({ content: type, closable: true, duration: 3000, position: "top" }) }}>{type}</Button>)}</Space>
    case "Notification": return <Space wrap>{["info", "success", "warning", "error"].map((type) => <Button key={type} onClick={() => { Notification[type as "info" | "success" | "warning" | "error"]({ title: type, content: "通知内容", duration: type === "error" ? 0 : 3000, closable: true }) }}>{type}</Button>)}</Space>
    case "Dialog": return <ModalDemo />
    case "Drawer": return <DrawerDemo />
    case "Progress": return <Space direction="vertical" style={{ width: "100%" }}>{sizes.map((size) => <Space key={size}><Progress size={size} percent={65} /><Progress size={size} type="circle" percent={72} status={size === "large" ? "success" : "normal"} /><Progress size={size} percent={75} status="warning" showText={false} /></Space>)}</Space>
    case "Skeleton": return <SkeletonDemo />
    case "Spinner": return <Space direction="vertical"><Spin size={20} /><Spin size={32} tip="加载中..." /><Spin dot /><Spin loading block delay={200}><Typography.Text>被包裹的内容</Typography.Text></Spin></Space>
    case "Result": return <Space direction="vertical" style={{ width: "100%" }}>{(["success", "error", "warning", "403", "404", "500"] as const).map((status) => <Result key={status} status={status} title={`Result ${status}`} extra={<Button>返回</Button>} />)}</Space>
    case "Popconfirm": return <Space wrap>{["top", "bottom", "left", "right"].map((position) => <Popconfirm key={position} position={position as "top" | "bottom" | "left" | "right"} title="确定删除吗？" icon={<span>!</span>} okButtonProps={{ status: "danger" }}><Button status="danger">{position}</Button></Popconfirm>)}</Space>
    default: return null
  }
}

function ModalDemo() {
  const [visible, setVisible] = useState(false)
  return <Space wrap><Button onClick={() => setVisible(true)}>基础 Modal</Button><Modal visible={visible} title="基础 Modal" onCancel={() => setVisible(false)} onOk={() => setVisible(false)} simple>内容</Modal>{(["confirm", "info", "success", "warning", "error"] as const).map((type) => <Button key={type} onClick={() => { Modal[type]({ title: type, content: "操作内容" }) }}>{type}</Button>)}<Button onClick={() => { Modal.info({ title: "简单对话框", content: "简单示例" }) }}>simple</Button></Space>
}

function DrawerDemo() {
  const [placement, setPlacement] = useState<"left" | "right" | "top" | "bottom">("right")
  const [visible, setVisible] = useState(false)
  return <Space wrap>{(["left", "right", "top", "bottom"] as const).map((item) => <Button key={item} onClick={() => { setPlacement(item); setVisible(true) }}>{item}</Button>)}<Drawer visible={visible} placement={placement} title="Drawer" maskClosable={false} onCancel={() => setVisible(false)} footer={<Space><Button onClick={() => setVisible(false)}>取消</Button><Button type="primary" onClick={() => setVisible(false)}>确定</Button></Space>}>抽屉内容</Drawer></Space>
}

function SkeletonDemo() {
  const [loading, setLoading] = useState(true)
  return <Space direction="vertical"><Button onClick={() => setLoading((value) => !value)}>切换加载</Button><Skeleton loading={loading} animation text={{ rows: 3 }}><Typography.Text>真实内容已加载</Typography.Text></Skeleton><Skeleton animation image={{ shape: "circle" }} text={{ rows: 2 }} /></Space>
}
