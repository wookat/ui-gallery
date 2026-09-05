import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import chat from "@ui-gallery/spec/mock/chat.json"
import team from "@ui-gallery/spec/mock/team.json"
import { ActionList, ActionMenu, Avatar, Button, CounterLabel, Details, Dialog, Heading, IconButton, Label, Select, Spinner, Text, Textarea, TextInput, Token, useDetails } from "@primer/react"
import { Table } from "@primer/react/experimental"
import { Icon, iconFor } from "@/lib/icon"
import { avatarFor } from "@/lib/avatar"
import { PageHeader } from "./shared"

type Message = {
  role: string
  content: string
  sources?: string[]
  tool?: { name: string; args: Record<string, unknown>; status: string }
  streaming?: boolean
  time?: string
}
const me = team[0]
const assistantAvatar = avatarFor("AI")

function CodeBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(t)
  }, [copied])
  return (
    <div className="code-block">
      <div className="code-block-bar"><Text size="small" className="muted">代码</Text><Button size="small" variant="invisible" leadingVisual={iconFor(copied ? "check" : "copy")} onClick={() => { navigator.clipboard?.writeText(text); setCopied(true) }}>{copied ? "已复制" : "复制"}</Button></div>
      <pre><code>{text}</code></pre>
    </div>
  )
}

function ToolCard({ tool }: { tool: NonNullable<Message["tool"]> }) {
  const { getDetailsProps, open } = useDetails({ defaultOpen: false })
  return (
    <Details {...getDetailsProps()} className="tool-card">
      <Details.Summary className="tool-summary">
        <Icon name="tools" />
        <span>调用工具 <span className="mono">{tool.name}</span></span>
        <Label variant={tool.status === "done" ? "success" : "attention"} size="small">{tool.status === "done" ? "已完成" : tool.status}</Label>
        <Icon name={open ? "chevron-up" : "chevron-down"} className="ml-auto" />
      </Details.Summary>
      <pre className="tool-args"><code>{JSON.stringify(tool.args, null, 2)}</code></pre>
    </Details>
  )
}

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table({ children }) { return <div className="table-scroll"><Table gridTemplateColumns="repeat(3, minmax(100px, 1fr))">{children}</Table></div> },
        thead({ children }) { return <Table.Head>{children}</Table.Head> },
        tbody({ children }) { return <Table.Body>{children}</Table.Body> },
        tr({ children }) { return <Table.Row>{children}</Table.Row> },
        th({ children }) { return <Table.Header>{children}</Table.Header> },
        td({ children }) { return <Table.Cell>{children}</Table.Cell> },
        pre({ children }) { return <>{children}</> },
        code({ children, className }) {
          const text = String(children).replace(/\n$/, "")
          if (!className && !text.includes("\n")) return <code className="inline-code">{children}</code>
          return <CodeBlock text={text} />
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function ConversationList({ active, onSelect }: { active: string | null; onSelect: (id: string | null) => void }) {
  const [query, setQuery] = useState("")
  const list = chat.conversations.filter((c) => c.title.includes(query))
  const groups = [
    { title: "今天", items: list.filter((c) => c.time === "刚刚") },
    { title: "更早", items: list.filter((c) => c.time !== "刚刚") },
  ]
  return (
    <div className="stack-3">
      <Button block variant="primary" leadingVisual={iconFor("plus")} onClick={() => onSelect(null)}>新建对话</Button>
      <TextInput aria-label="搜索对话" placeholder="搜索对话" leadingVisual={iconFor("search")} block value={query} onChange={(e) => setQuery(e.target.value)} />
      <ActionList>
        {groups.filter((g) => g.items.length).map((g) => (
          <ActionList.Group key={g.title}>
            <ActionList.GroupHeading as="h3">{g.title}</ActionList.GroupHeading>
            {g.items.map((item) => (
              <ActionList.Item key={item.id} active={item.id === active} onSelect={() => onSelect(item.id)}>
                <ActionList.LeadingVisual><Icon name="message-circle" /></ActionList.LeadingVisual>
                {item.title}
                <ActionList.Description variant="block">{item.time}</ActionList.Description>
                {item.unread ? <ActionList.TrailingVisual><CounterLabel scheme="primary">{item.unread}</CounterLabel></ActionList.TrailingVisual> : null}
              </ActionList.Item>
            ))}
          </ActionList.Group>
        ))}
      </ActionList>
    </div>
  )
}

export function ChatPage() {
  const [active, setActive] = useState<string | null>(chat.conversations[0].id)
  const [messages, setMessages] = useState<Message[]>(chat.messages.map((m, i) => ({ ...m, time: i < 2 ? "10:24" : "10:26" })))
  const [draft, setDraft] = useState("")
  const [model, setModel] = useState(chat.models[0])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const drawerButton = useRef<HTMLButtonElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const conversation = chat.conversations.find((c) => c.id === active)

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }) }, [messages, active])

  const send = (text?: string) => {
    const content = (text ?? draft).trim()
    if (!content || streaming) return
    setDraft("")
    if (!active) setActive(chat.conversations[0].id)
    const reply = chat.messages[1].content
    setMessages((prev) => [...prev, { role: "user", content, time: "现在" }, { role: "assistant", content: "", streaming: true, time: "现在" }])
    setStreaming(true)
    let i = 0
    const timer = window.setInterval(() => {
      i += 6
      const done = i >= reply.length
      setMessages((prev) => prev.map((m, idx) => (idx === prev.length - 1 ? { ...m, content: reply.slice(0, i), streaming: !done, sources: done ? chat.messages[1].sources : undefined } : m)))
      if (done) { window.clearInterval(timer); setStreaming(false) }
    }, 40)
  }
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className="page-stack">
      <PageHeader title="AI 对话" description="与团队智能助手协作，保留完整上下文。" />
      <div className="chat-layout">
        <aside className="chat-sidebar desktop-only-block" aria-label="会话列表">
          <ConversationList active={active} onSelect={(id) => { setActive(id); if (id === null) setMessages([]) }} />
        </aside>
        <section className="chat-main">
          <header className="chat-header">
            <IconButton ref={drawerButton} className="mobile-only" size="large" aria-label="打开会话列表" icon={iconFor("list")} onClick={() => setDrawerOpen(true)} />
            <div className="min-w-0">
              <Text as="div" weight="semibold" className="truncate">{conversation?.title ?? "新对话"}</Text>
              <Text as="div" className="muted" size="small">{model} · {streaming ? "正在生成…" : "已连接"}</Text>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Select aria-label="选择模型" size="small" value={model} onChange={(e) => setModel(e.target.value)}>{chat.models.map((m) => <Select.Option key={m} value={m}>{m}</Select.Option>)}</Select>
              <ActionMenu>
                <ActionMenu.Anchor><IconButton size="large" variant="invisible" aria-label="对话操作" icon={iconFor("kebab-horizontal")} /></ActionMenu.Anchor>
                <ActionMenu.Overlay align="end"><ActionList><ActionList.Item>重命名</ActionList.Item><ActionList.Item>导出 Markdown</ActionList.Item><ActionList.Divider /><ActionList.Item variant="danger" onSelect={() => { setMessages([]); setActive(null) }}>清空对话</ActionList.Item></ActionList></ActionMenu.Overlay>
              </ActionMenu>
            </div>
          </header>

          <div className="chat-scroll" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="chat-empty">
                <span className="brand-mark" style={{ width: 48, height: 48 }}><Icon name="sparkles" size={24} /></span>
                <Heading as="h2" style={{ fontSize: 24 }}>你好，{me.name}。今天想了解什么？</Heading>
                <Text className="muted">我可以帮你分析订单、撰写邮件或解释数据。</Text>
                <div className="grid grid-2 suggestion-grid">
                  {chat.suggestions.map((s, i) => (
                    <button type="button" key={s} className="card suggestion-card" onClick={() => send(s)}>
                      <Icon name={["bar-chart", "mail", "search", "sparkles"][i % 4]} />
                      <Text>{s}</Text>
                      <Icon name="arrow-right" size={12} className="muted" />
                    </button>
                  ))}
                </div>
              </div>
            ) : messages.map((message, index) => (
              <article className={`message ${message.role}`} key={`${message.role}-${index}`}>
                <div className="flex items-center gap-2">
                  <Avatar src={message.role === "user" ? avatarFor(me.name) : assistantAvatar} alt="" size={28} square={message.role !== "user"} />
                  <Text weight="semibold">{message.role === "user" ? me.name : "AI 助手"}</Text>
                  <Text className="muted" size="small">{message.time}</Text>
                </div>
                {message.tool ? <ToolCard tool={message.tool} /> : null}
                <div className="bubble">
                  {message.role === "assistant" ? (
                    message.streaming && !message.content ? (
                      <span className="typing" aria-label="正在输入"><span /><span /><span /></span>
                    ) : (
                      <>
                        <Markdown content={message.content} />
                        {message.streaming ? <span className="caret" aria-hidden="true" /> : null}
                      </>
                    )
                  ) : message.content}
                </div>
                {message.sources ? <div className="flex wrap gap-1 sources">{message.sources.map((source) => <Token key={source} text={source} leadingVisual={iconFor("file")} size="small" />)}</div> : null}
                {message.role === "assistant" && !message.streaming ? (
                  <div className="flex gap-1 message-actions">
                    <IconButton size="small" variant="invisible" aria-label="复制回答" icon={iconFor("copy")} onClick={() => navigator.clipboard?.writeText(message.content)} />
                    <IconButton size="small" variant="invisible" aria-label="重新生成" icon={iconFor("refresh")} />
                    <IconButton size="small" variant="invisible" aria-label="点赞" icon={iconFor("heart")} />
                  </div>
                ) : null}
              </article>
            ))}
            {streaming ? <div className="flex items-center gap-2 muted" role="status"><Spinner size="small" /><Text size="small">AI 正在生成回复…</Text></div> : null}
          </div>

          <div className="chat-composer">
            {messages.length > 0 ? <div className="flex wrap gap-2">{chat.suggestions.map((s) => <Button key={s} size="small" leadingVisual={iconFor("sparkles")} onClick={() => setDraft(s)}>{s}</Button>)}</div> : null}
            <Textarea className="composer-input" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} placeholder="向 AI 助手提问…（Enter 发送，Shift + Enter 换行）" block rows={2} resize="vertical" aria-label="消息输入" />
            <div className="flex items-center justify-between gap-2 wrap">
              <div className="flex items-center gap-1">
                <IconButton size="large" variant="invisible" aria-label="添加附件" icon={iconFor("paperclip")} />
                <IconButton size="large" variant="invisible" aria-label="语音输入" icon={iconFor("mic")} />
                <Text className="muted desktop-only" size="small">{draft.length} / 2000 · <kbd className="kbd">Enter</kbd> 发送 · <kbd className="kbd">Shift</kbd>+<kbd className="kbd">Enter</kbd> 换行</Text>
              </div>
              <Button variant="primary" leadingVisual={iconFor("send")} disabled={!draft.trim() || streaming} onClick={() => send()}>发送</Button>
            </div>
          </div>
        </section>
      </div>

      {drawerOpen ? (
        <Dialog title="会话列表" position="left" width="small" returnFocusRef={drawerButton} onClose={() => setDrawerOpen(false)}>
          <ConversationList active={active} onSelect={(id) => { setActive(id); if (id === null) setMessages([]); setDrawerOpen(false) }} />
        </Dialog>
      ) : null}
    </div>
  )
}
