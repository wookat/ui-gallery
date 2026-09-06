import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { useSearchParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Avatar, Badge, Button, Checkbox, Drawer, IconButton, Input, InputGroup, List, Message, Panel, Placeholder, SelectPicker, Tag, Text, Whisper, Tooltip, Accordion, Loader, toaster } from "rsuite"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/components/icon"
import { PageHeader, StateSwitch } from "./shared"

export function ChatPage() {
  const [params] = useSearchParams()
  const [draft, setDraft] = useState("")
  const [drawer, setDrawer] = useState(false)
  if (params.get("state") === "loading") return <div className="page-stack"><PageHeader title="AI 对话" actions={<StateSwitch />} /><div className="demo-grid">{[1, 2, 3].map((item) => <Panel bordered key={item}><Placeholder.Paragraph rows={4} active graph="circle" /></Panel>)}</div></div>
  if (params.get("state") === "error") return <div className="page-stack"><PageHeader title="AI 对话" actions={<StateSwitch />} /><Message type="error" showIcon>对话加载失败，请重试。 <Button appearance="primary" size="sm">重试</Button></Message></div>
  if (params.get("state") === "empty") return <div className="page-stack"><PageHeader title="AI 对话" actions={<StateSwitch />} /><Panel bordered style={{ textAlign: "center", padding: 60 }}><Icon name="sparkles" size={36} /><h2>从一个问题开始</h2><Text muted>选择一个建议，开始探索你的业务数据。</Text><div className="demo-row" style={{ justifyContent: "center", marginTop: 24 }}>{chat.suggestions.map((item) => <Button key={item} onClick={() => setDraft(item)}>{item}</Button>)}</div></Panel></div>
  return <div className="page-stack"><PageHeader title="AI 对话" description="与团队智能助手协作，保留完整上下文。" actions={<StateSwitch />} /><Button className="mobile-only" onClick={() => setDrawer(true)}><Icon name="menu" /> 对话列表</Button><div className="chat-layout" style={{ border: "1px solid var(--rs-border-primary)", borderRadius: 8 }}><aside className="chat-sidebar"><ConversationList /></aside><Drawer open={drawer} placement="left" onClose={() => setDrawer(false)}><Drawer.Header><Drawer.Title>对话</Drawer.Title></Drawer.Header><Drawer.Body><ConversationList /></Drawer.Body></Drawer><section className="chat-main"><header style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: 16, borderBottom: "1px solid var(--rs-border-primary)" }}><div><b>{chat.conversations[0].title}</b><br /><Text muted size="sm">GPT-5 · 已连接</Text></div><SelectPicker cleanable={false} searchable={false} data={chat.models.map((model) => ({ label: model, value: model }))} defaultValue={chat.models[0]} /></header><div style={{ flex: 1, padding: 16, overflow: "auto" }}>{chat.messages.map((message, index) => <div key={`${message.role}-${index}`} style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}><div className={`message-bubble ${message.role === "user" ? "message-user" : "message-assistant"}`}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Avatar circle size="sm">{message.role === "user" ? "林" : "AI"}</Avatar><b>{message.role === "user" ? "林晓" : "AI 助手"}</b><Text muted size="sm">刚刚</Text></div>{message.role === "assistant" ? <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: CodeBlock }}>{message.content}</ReactMarkdown></div> : message.content}{message.streaming ? <div className="streaming-row"><Loader size="xs" /><Text muted size="sm">正在输入…</Text></div> : null}{message.sources ? <div className="demo-row" style={{ marginTop: 8 }}>{message.sources.map((source) => <Tag key={source}><Icon name="paperclip" /> {source}</Tag>)}</div> : null}</div>{message.tool ? <Accordion bordered style={{ marginTop: 8 }}><Accordion.Panel header={`工具调用 · ${message.tool.name}`}><pre style={{ overflow: "auto" }}>{JSON.stringify(message.tool.args, null, 2)}</pre></Accordion.Panel></Accordion> : null}</div>)}</div><footer style={{ padding: 16, borderTop: "1px solid var(--rs-border-primary)" }}><div className="demo-row">{chat.suggestions.map((suggestion) => <Tag key={suggestion} onClick={() => setDraft(suggestion)}>{suggestion}</Tag>)}</div><div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginTop: 12 }}><Input as="textarea" rows={3} value={draft} onChange={(value) => setDraft(value)} placeholder="向 AI 助手提问…" style={{ flex: 1 }} /><IconButton appearance="primary" size="lg" aria-label="发送" icon={<Icon name="send" />} /></div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}><Text muted size="sm">{draft.length} / 2000 · ⌘ + Enter 发送</Text><Whisper speaker={<Tooltip>上传附件</Tooltip>}><Button appearance="subtle" startIcon={<Icon name="paperclip" />}>附件</Button></Whisper></div></footer></section></div></div>
}
function ConversationList() {
  return <><InputGroup inside><InputGroup.Addon><Icon name="search" /></InputGroup.Addon><Input placeholder="搜索对话" /></InputGroup><Button appearance="primary" block style={{ margin: "12px 0" }}><Icon name="plus" /> 新建对话</Button><List hover>{chat.conversations.map((item) => <List.Item key={item.id}><div style={{ display: "flex", justifyContent: "space-between" }}><span><b>{item.title}</b><br /><Text muted size="sm">{item.time}</Text></span>{item.unread ? <Badge content={item.unread} /> : null}</div></List.Item>)}</List><Checkbox>仅显示未读</Checkbox></>
}

function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const text = extractText(children)
  const copy = () => { void navigator.clipboard?.writeText(text); toaster.push(<Message type="success" showIcon>代码已复制</Message>) }
  return <div className="code-block"><div className="code-toolbar"><Text muted size="sm">代码</Text><Button className="code-copy" size="xs" appearance="subtle" startIcon={<Icon name="copy" />} onClick={copy}>复制</Button></div><pre {...props}>{children}</pre></div>
}
function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(extractText).join("")
  if (node && typeof node === "object" && "props" in node) return extractText((node.props as { children?: ReactNode }).children)
  return ""
}
