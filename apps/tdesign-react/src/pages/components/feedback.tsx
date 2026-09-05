import { useState, type ReactNode } from "react"
import {
  Alert,
  Button,
  Card,
  Dialog,
  DialogPlugin,
  Drawer,
  Empty,
  Loading,
  MessagePlugin,
  NotificationPlugin,
  Popconfirm,
  Progress,
  QRCode,
  Skeleton,
  Tag,
  Typography,
} from "tdesign-react"
import { Icon } from "@/components/icon"
import { DemoPanel, DemoRow } from "./types"

function AlertDemo() {
  const themes = ["info", "success", "warning", "error"] as const
  return (
    <DemoPanel>
      {themes.map((theme) => (
        <Alert
          key={theme}
          theme={theme}
          close
          title={`${theme} 标题`}
          message="提示内容支持操作按钮，并可以展开长文本。"
          operation={<Button variant="text">操作</Button>}
          maxLine={1}
        />
      ))}
    </DemoPanel>
  )
}

function ToastDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Button onClick={() => MessagePlugin.info("info")}>info</Button>
        <Button onClick={() => MessagePlugin.success("success")}>success</Button>
        <Button onClick={() => MessagePlugin.warning("warning")}>warning</Button>
        <Button onClick={() => MessagePlugin.error("error")}>error</Button>
        <Button onClick={() => MessagePlugin.question("question")}>question</Button>
        <Button onClick={() => MessagePlugin.loading("loading")}>loading</Button>
        <Button onClick={() => MessagePlugin.success({ content: "closable", duration: 0, closeBtn: true })}>closable</Button>
      </DemoRow>
    </DemoPanel>
  )
}

function NotificationDemo() {
  const [placement, setPlacement] = useState<"top-right" | "top-left" | "bottom-right" | "bottom-left">("top-right")
  return (
    <DemoPanel>
      <select value={placement} onChange={(event) => setPlacement(event.target.value as typeof placement)}>
        <option value="top-right">top-right</option>
        <option value="top-left">top-left</option>
        <option value="bottom-right">bottom-right</option>
        <option value="bottom-left">bottom-left</option>
      </select>
      <DemoRow>
        {(["info", "success", "warning", "error"] as const).map((theme) => (
          <Button key={theme} onClick={() => NotificationPlugin[theme]({ title: theme, content: "通知内容", placement, footer: <Button variant="text">查看</Button> })}>
            {theme}
          </Button>
        ))}
      </DemoRow>
    </DemoPanel>
  )
}

function DialogDemo() {
  const [visible, setVisible] = useState(false)
  return (
    <DemoPanel>
      <DemoRow>
        <Button onClick={() => setVisible(true)}>normal controlled</Button>
        <Button onClick={() => DialogPlugin.alert({ header: "Alert", body: "DialogPlugin 内容" })}>DialogPlugin.alert</Button>
        <Button onClick={() => DialogPlugin.confirm({ header: "Confirm", body: "DialogPlugin 确认" })}>confirm</Button>
        <Button onClick={() => DialogPlugin.alert({ header: "Full screen", body: "全屏对话框", mode: "full-screen" })}>full-screen</Button>
      </DemoRow>
      <Dialog
        visible={visible}
        header="受控 Dialog"
        placement="center"
        onClose={() => setVisible(false)}
        confirmBtn="确定"
        cancelBtn="取消"
      >
        <Typography.Paragraph>
          这是一个可滚动的对话框内容。{Array.from({ length: 4 }, (_, index) => `长内容 ${index + 1}。`)}
        </Typography.Paragraph>
      </Dialog>
    </DemoPanel>
  )
}

function DrawerDemo() {
  const [placement, setPlacement] = useState<"left" | "right" | "top" | "bottom">("right")
  const [visible, setVisible] = useState(false)
  return (
    <DemoPanel>
      <DemoRow>
        {(["left", "right", "top", "bottom"] as const).map((item) => (
          <Button key={item} onClick={() => { setPlacement(item); setVisible(true) }}>
            {item}
          </Button>
        ))}
      </DemoRow>
      <Drawer
        visible={visible}
        placement={placement}
        size="medium"
        showOverlay
        header="抽屉标题"
        footer={<Button theme="primary" onClick={() => setVisible(false)}>完成</Button>}
        onClose={() => setVisible(false)}
      >
        抽屉内容
      </Drawer>
    </DemoPanel>
  )
}

function ProgressDemo() {
  return (
    <DemoPanel>
      <Progress percentage={35} theme="line" status="active" />
      <Progress percentage={70} theme="line" status="success" label={<Tag theme="success">完成</Tag>} />
      <Progress percentage={50} theme="plump" status="warning" />
      <DemoRow>
        <Progress percentage={60} theme="circle" size="small" />
        <Progress percentage={80} theme="circle" size="medium" />
        <Progress percentage={100} theme="circle" size="large" status="error" />
      </DemoRow>
    </DemoPanel>
  )
}

function SkeletonDemo() {
  return (
    <DemoPanel>
      <Skeleton theme="text" animation="gradient" />
      <Skeleton theme="paragraph" animation="flashed" />
      <Skeleton theme="avatar" />
      <Skeleton theme="tab" />
      <Skeleton theme="article" />
    </DemoPanel>
  )
}

function SpinnerDemo() {
  const [loading, setLoading] = useState(false)
  return (
    <DemoPanel>
      <DemoRow>
        <Loading size="small" />
        <Loading size="medium" text="加载中" />
        <Loading size="large" inheritColor />
        <Button onClick={() => setLoading((value) => !value)}>切换卡片 Loading</Button>
      </DemoRow>
      <Card loading={loading}>Loading 包裹内容</Card>
    </DemoPanel>
  )
}

function ResultDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Empty type="success" description="操作成功" />
        <Empty type="fail" description="操作失败" />
      </DemoRow>
      <Button theme="primary">继续</Button>
    </DemoPanel>
  )
}

function PopconfirmDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <Popconfirm content="确认保存吗？" theme="default"><Button>default</Button></Popconfirm>
        <Popconfirm content="确认警告吗？" theme="warning" icon={<Icon name="alert-circle" />}><Button theme="warning">warning</Button></Popconfirm>
        <Popconfirm content="确认删除吗？" theme="danger" confirmBtn={<Button theme="danger">删除</Button>} cancelBtn={<Button>取消</Button>}><Button theme="danger">danger</Button></Popconfirm>
      </DemoRow>
    </DemoPanel>
  )
}

function QRCodeDemo() {
  return (
    <DemoPanel>
      <DemoRow>
        <QRCode value="Acme Console" size={80} level="L" />
        <QRCode value="Acme Console" size={120} level="H" icon="Acme" />
        <QRCode value="Acme Console" status="loading" />
        <QRCode value="Acme Console" status="expired" />
        <QRCode value="Acme Console" status="scanned" />
      </DemoRow>
    </DemoPanel>
  )
}

export const feedbackDemos = {
  Alert: AlertDemo,
  Toast: ToastDemo,
  Notification: NotificationDemo,
  Dialog: DialogDemo,
  Drawer: DrawerDemo,
  Progress: ProgressDemo,
  Skeleton: SkeletonDemo,
  Spinner: SpinnerDemo,
  Result: ResultDemo,
  Popconfirm: PopconfirmDemo,
  QRCode: QRCodeDemo,
} satisfies Record<string, () => ReactNode>
