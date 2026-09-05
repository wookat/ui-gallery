import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Avatar, Badge, Button, Card, Drawer, Empty, Input, List, Select, Skeleton, Space, Spin, Tag, Typography } from "@arco-design/web-react"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/components/icon"
import { useIsMobile } from "@/hooks/use-mobile"
import { PageHeader } from "./shared"

function ConversationList() {
  return <div className="chat-sidebar"><div className="between"><Typography.Title heading={4}>对话</Typography.Title><Button type="text" icon={<Icon name="plus" />} /></div><Input.Search placeholder="搜索对话" /><Button type="primary" long icon={<Icon name="plus" />}>新建对话</Button><List dataSource={chat.conversations} render={(item, index) => <List.Item key={item.id} className={index === 0 ? "chat-selected" : ""}><List.Item.Meta title={item.title} description={item.time} />{item.unread ? <Badge count={item.unread} /> : null}</List.Item>} /></div>
}

export function ChatPage() {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [draft, setDraft] = useState("")
  return <>
    <PageHeader title="AI 对话" description="与团队智能助手协作，保留完整上下文。" />
    <div className="chat-layout">
      {!isMobile ? <aside><ConversationList /></aside> : null}
      <section className="chat-thread"><header className="between chat-thread-header"><div className="row">{isMobile ? <Button type="text" icon={<Icon name="menu" />} aria-label="打开会话列表" onClick={() => setSidebarOpen(true)} /> : null}<div><Typography.Text bold>{chat.conversations[0].title}</Typography.Text><Typography.Text type="secondary" style={{ display: "block" }}>GPT-5 · 已连接</Typography.Text></div></div><Select defaultValue="gpt" options={[{ label: "GPT-5", value: "gpt" }, { label: "Fast model", value: "fast" }]} /></header><div className="chat-messages">{chat.messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><Avatar>{message.role === "user" ? "林" : "AI"}</Avatar><div className="chat-bubble"><Typography.Text bold>{message.role === "user" ? "林晓" : "AI 助手"}</Typography.Text>{message.role === "assistant" ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown> : <Typography.Paragraph>{message.content}</Typography.Paragraph>}{message.sources ? <Space wrap>{message.sources.map((source) => <Tag key={source} icon={<Icon name="paperclip" />}>{source}</Tag>)}</Space> : null}{message.tool ? <Card size="small" title={`工具调用 · ${message.tool.name}`}><pre>{JSON.stringify(message.tool.args, null, 2)}</pre></Card> : null}</div></div>)}</div><div className="chat-composer"><Space wrap>{chat.suggestions.map((suggestion) => <Button size="small" key={suggestion} onClick={() => setDraft(suggestion)}>{suggestion}</Button>)}</Space><Input.TextArea value={draft} onChange={setDraft} placeholder="向 AI 助手提问..." autoSize={{ minRows: 3, maxRows: 6 }} /><div className="between"><Typography.Text type="secondary">Shift + Enter 换行</Typography.Text><Button type="primary" icon={<Icon name="send" />}>发送</Button></div></div></section>
      <Drawer placement="left" width={300} title="对话" visible={sidebarOpen} onCancel={() => setSidebarOpen(false)} footer={null}><ConversationList /></Drawer>
    </div>
    <Empty className="chat-empty" icon={<Icon name="sparkles" />} description={<><Typography.Title heading={4}>流式响应占位</Typography.Title><Typography.Text type="secondary">真实请求接入时会在此展示流式状态。</Typography.Text><Skeleton text={{ rows: 2 }} /></>} />
    <Spin dot tip="AI 正在输入..." />
  </>
}
