import { useRef, useState, type ComponentProps } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Avatar, Badge, Button, Card, Drawer, Input, List, Message, Select, Skeleton, Space, Spin, Tag, Typography } from "@arco-design/web-react"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/components/icon"
import { useIsMobile } from "@/hooks/use-mobile"
import { PageHeader } from "./shared"

const NEW_CONVERSATION = "new"

function CodeBlock({ children, ...rest }: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null)
  const copy = () => {
    void navigator.clipboard?.writeText(ref.current?.textContent ?? "")
    Message.success("代码已复制")
  }
  return <div className="chat-code"><pre ref={ref} {...rest}>{children}</pre><Button className="chat-code-copy hit-area" type="secondary" icon={<Icon name="copy" />} onClick={copy} aria-label="复制代码" /></div>
}

function ConversationList({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return <div className="chat-sidebar"><div className="between"><Typography.Title heading={4}>对话</Typography.Title><Button type="text" className="hit-area" icon={<Icon name="plus" />} aria-label="新建对话" onClick={() => onSelect(NEW_CONVERSATION)} /></div><Input.Search placeholder="搜索对话" /><Button type="primary" long size="large" className="hit-area" icon={<Icon name="plus" />} onClick={() => onSelect(NEW_CONVERSATION)}>新建对话</Button><List dataSource={chat.conversations} render={(item) => <List.Item key={item.id} className={item.id === active ? "chat-selected" : ""} onClick={() => onSelect(item.id)} style={{ cursor: "pointer" }}><List.Item.Meta title={item.title} description={item.time} />{item.unread ? <Badge count={item.unread} /> : null}</List.Item>} /></div>
}

export function ChatPage() {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [active, setActive] = useState(chat.conversations[0].id)
  const conversation = chat.conversations.find((item) => item.id === active)
  const isEmpty = active === NEW_CONVERSATION
  const select = (id: string) => { setActive(id); setSidebarOpen(false) }
  return <>
    <PageHeader title="AI 对话" description="与团队智能助手协作，保留完整上下文。" />
    <div className="chat-layout">
      {!isMobile ? <aside><ConversationList active={active} onSelect={select} /></aside> : null}
      <section className="chat-thread">
        <header className="between chat-thread-header"><div className="row">{isMobile ? <Button type="text" size="large" className="hit-area" icon={<Icon name="menu" />} aria-label="打开会话列表" onClick={() => setSidebarOpen(true)} /> : null}<div><Typography.Text bold>{conversation?.title ?? "新对话"}</Typography.Text><Typography.Text type="secondary" style={{ display: "block" }}>GPT-5 · 已连接</Typography.Text></div></div><Select defaultValue="gpt" options={[{ label: "GPT-5", value: "gpt" }, { label: "Fast model", value: "fast" }]} /></header>
        {isEmpty ? <div className="chat-empty"><div style={{ textAlign: "center" }}><Avatar size={48} style={{ backgroundColor: "rgb(var(--primary-6))" }}><Icon name="sparkles" size={24} /></Avatar><Typography.Title heading={3}>今天想了解什么？</Typography.Title><Typography.Text type="secondary">选择一个建议开始，或直接输入问题。</Typography.Text><div className="chat-suggestion-grid">{chat.suggestions.map((suggestion) => <Card key={suggestion} size="small" hoverable onClick={() => setDraft(suggestion)}><Typography.Text>{suggestion}</Typography.Text></Card>)}</div></div></div> : <div className="chat-messages">{chat.messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><Avatar style={message.role === "assistant" ? { backgroundColor: "rgb(var(--primary-6))" } : undefined}>{message.role === "user" ? "林" : "AI"}</Avatar><div className="chat-bubble"><Typography.Text bold>{message.role === "user" ? "林晓" : "AI 助手"}</Typography.Text>{message.role === "assistant" ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: CodeBlock }}>{message.content}</ReactMarkdown> : <Typography.Paragraph>{message.content}</Typography.Paragraph>}{message.sources ? <Space wrap>{message.sources.map((source) => <Tag key={source} icon={<Icon name="paperclip" />}>{source}</Tag>)}</Space> : null}{message.tool ? <Card size="small" title={`工具调用 · ${message.tool.name}`}><pre>{JSON.stringify(message.tool.args, null, 2)}</pre></Card> : null}{message.streaming ? <div className="row"><Spin size={14} /><Typography.Text type="secondary">AI 正在输入...</Typography.Text></div> : null}</div></div>)}</div>}
        <div className="chat-composer"><Space wrap>{chat.suggestions.map((suggestion) => <Button className="hit-area" key={suggestion} onClick={() => setDraft(suggestion)}>{suggestion}</Button>)}</Space><Input.TextArea value={draft} onChange={setDraft} placeholder="向 AI 助手提问..." autoSize={{ minRows: 3, maxRows: 6 }} /><div className="between"><Space><Button type="text" className="hit-area" icon={<Icon name="paperclip" />} aria-label="添加附件" /><Typography.Text type="secondary">{draft.length} 字 · Shift + Enter 换行</Typography.Text></Space><Button type="primary" size="large" className="hit-area" icon={<Icon name="send" />}>发送</Button></div></div>
      </section>
      <Drawer placement="left" width={300} title="对话" visible={sidebarOpen} onCancel={() => setSidebarOpen(false)} footer={null}><ConversationList active={active} onSelect={select} /></Drawer>
    </div>
    {isEmpty ? <Card title="流式响应占位"><Skeleton animation text={{ rows: 2 }} /></Card> : null}
  </>
}
