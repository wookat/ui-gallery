import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import chat from "@ui-gallery/spec/mock/chat.json"
import { ActionList, Avatar, Button, Heading, Label, Select, Text, Textarea, TextInput } from "@primer/react"
import { Table } from "@primer/react/experimental"
import { Icon, iconFor } from "@/lib/icon"
import { avatarSrc } from "@/lib/avatar"
import { PageHeader } from "./shared"

export function ChatPage() {
  const [draft, setDraft] = useState("")
  const [copied, setCopied] = useState(false)
  return (
    <div className="page-stack">
      <PageHeader title="AI 对话" description="与团队智能助手协作，保留完整上下文。" />
      <div className="chat-layout">
        <aside className="chat-sidebar"><div className="flex items-center justify-between"><Heading as="h2">对话</Heading><Button variant="invisible" aria-label="新建对话" leadingVisual={iconFor("plus")} /></div><TextInput className="mt-3" aria-label="搜索对话" placeholder="搜索对话" leadingVisual={iconFor("search")} block /><Button className="mt-3" block leadingVisual={iconFor("plus")}>新建对话</Button><ActionList className="mt-3">{chat.conversations.map((item) => <ActionList.Item key={item.id} active={item.id === chat.conversations[0].id}>{item.title}{item.unread ? <Label>{item.unread}</Label> : null}<ActionList.Description>{item.time}</ActionList.Description></ActionList.Item>)}</ActionList></aside>
        <section className="chat-main"><header className="flex items-center justify-between gap-3" style={{ padding: "12px 16px", borderBottom: "1px solid var(--borderColor-default)" }}><div><Text>{chat.conversations[0].title}</Text><Text as="p" className="muted">GPT-5 · 已连接</Text></div><Select defaultValue="gpt" aria-label="选择模型"><Select.Option value="gpt">GPT-5</Select.Option><Select.Option value="fast">Fast model</Select.Option></Select></header><div className="chat-scroll">{chat.messages.map((message, index) => <article className={`message ${message.role}`} key={`${message.role}-${index}`}><div className="flex items-center gap-2"><Avatar src={avatarSrc} alt={message.role === "user" ? "林" : "AI"} size={32} /><Text><strong>{message.role === "user" ? "林晓" : "AI 助手"}</strong> <span className="muted">刚刚</span></Text></div><div className="bubble" style={{ marginTop: 8 }}>{message.role === "assistant" ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ table({ children }) { return <div className="table-scroll"><Table gridTemplateColumns="repeat(3, minmax(120px, 1fr))">{children}</Table></div> }, thead({ children }) { return <Table.Head>{children}</Table.Head> }, tbody({ children }) { return <Table.Body>{children}</Table.Body> }, tr({ children }) { return <Table.Row>{children}</Table.Row> }, th({ children }) { return <Table.Header>{children}</Table.Header> }, td({ children }) { return <Table.Cell>{children}</Table.Cell> }, code({ children }) { const text = String(children).replace(/\n$/, ""); return <div><Button size="small" onClick={() => { navigator.clipboard?.writeText(text); setCopied(true) }}>{copied ? "已复制" : "复制"}</Button><pre><code>{children}</code></pre></div> } }}>{message.content}</ReactMarkdown> : message.content}</div>{message.sources ? <div className="flex wrap gap-2" style={{ marginTop: 8 }}>{message.sources.map((source) => <Label key={source}>{source}</Label>)}</div> : null}</article>)}</div><div style={{ padding: 16, borderTop: "1px solid var(--borderColor-default)" }}><div className="flex wrap gap-2" style={{ marginBottom: 12 }}>{chat.suggestions.map((suggestion) => <Button size="small" key={suggestion} onClick={() => setDraft(suggestion)}>{suggestion}</Button>)}</div><Textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="向 AI 助手提问..." block /><div className="flex justify-between" style={{ marginTop: 8 }}><Button variant="invisible" aria-label="添加附件" leadingVisual={iconFor("paperclip")} /><Button variant="primary" aria-label="发送消息" leadingVisual={iconFor("send")} /></div></div></section>
      </div>
      <div className="card stack-3" style={{ textAlign: "center" }}><Icon name="sparkles" size={32} /><Heading as="h2">流式响应占位</Heading><Text>真实请求接入时会在此展示 Skeleton 流式状态。</Text></div>
    </div>
  )
}
