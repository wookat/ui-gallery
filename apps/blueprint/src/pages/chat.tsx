import { useRef, useState, type ComponentProps } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button, Card, Classes, Code, Collapse, Divider, Drawer, H3, H4, HTMLSelect, HTMLTable, InputGroup, Menu, MenuDivider, MenuItem, NonIdealState, Pre, Tag, TextArea, Tooltip } from "@blueprintjs/core"
import chat from "@ui-gallery/spec/mock/chat.json"
import { icon } from "@/lib/icons"
import { toast } from "@/lib/toaster"
import { Avatar } from "@/pages/shared"

type Message = (typeof chat.messages)[number]

function CodeBlock({ children, className }: ComponentProps<"code">) {
  const isBlock = Boolean(className)
  const text = String(children ?? "")
  if (!isBlock) return <Code>{children}</Code>
  return (
    <div style={{ position: "relative" }}>
      <Pre style={{ margin: 0, paddingTop: 28 }}>{text.trimEnd()}</Pre>
      <Tag minimal style={{ position: "absolute", top: 6, left: 8 }}>{className?.replace("language-", "")}</Tag>
      <Tooltip content="复制代码" placement="left"><Button minimal icon={icon("copy")} aria-label="复制代码" className="code-copy" style={{ position: "absolute", top: 4, right: 4 }} onClick={() => void toast("已复制", "primary")} /></Tooltip>
    </div>
  )
}

function ToolCall({ tool }: { tool: NonNullable<Message["tool"]> }) {
  const [open, setOpen] = useState(false)
  return (
    <Card style={{ padding: 0 }}>
      <Button minimal fill alignText="left" icon={icon("plug")} rightIcon={icon(open ? "chevron-up" : "chevron-down")} onClick={() => setOpen(!open)}>
        <span className="row" style={{ gap: 6 }}>调用工具 <Code>{tool.name}</Code> <Tag minimal intent={tool.status === "done" ? "success" : "primary"} round>{tool.status === "done" ? "完成" : "运行中"}</Tag></span>
      </Button>
      <Collapse isOpen={open}><Pre style={{ margin: 0, fontSize: 12 }}>{JSON.stringify(tool.args, null, 2)}</Pre></Collapse>
    </Card>
  )
}

function Bubble({ message }: { message: Message }) {
  const user = message.role === "user"
  return (
    <div className={`bubble ${user ? "user" : ""}`}>
      {user ? <Avatar name="林晓" /> : <span className="avatar" style={{ background: "#238551" }}>{icon("bot")}</span>}
      <div className="stack-sm min0">
        {message.tool ? <ToolCall tool={message.tool} /> : null}
        <Card elevation={0} style={user ? { background: "#2d72d2", color: "#fff" } : undefined}>
          <Markdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock, table: (p) => <HTMLTable compact striped bordered {...p} />, blockquote: (p) => <blockquote className={Classes.BLOCKQUOTE} {...p} /> }}>{message.content}</Markdown>
          {message.streaming ? <span className="caret" /> : null}
        </Card>
        {message.sources ? <div className="row">{message.sources.map((s) => <Tag key={s} minimal round icon={icon("link", 12)} interactive>{s}</Tag>)}</div> : null}
        <div className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`} style={{ textAlign: user ? "right" : "left" }}>{user ? "刚刚" : "AI · 刚刚"}</div>
      </div>
    </div>
  )
}

function ConversationList({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const [q, setQ] = useState("")
  const items = chat.conversations.filter((c) => c.title.includes(q))
  const groups = [{ title: "今天", match: (t: string) => t.includes("刚刚") || t.includes("小时") || t.includes("分钟") }, { title: "更早", match: () => true }]
  const used = new Set<string>()
  return (
    <div className="chat-list">
      <div className="row" style={{ flexWrap: "nowrap" }}><InputGroup fill leftIcon={icon("search")} placeholder="搜索会话" value={q} onChange={(e) => setQ(e.target.value)} /><Tooltip content="新建会话"><Button icon={icon("plus")} intent="primary" aria-label="新建会话" onClick={() => onSelect("")} /></Tooltip></div>
      <Menu style={{ background: "transparent", padding: 0 }}>
        {groups.map((g) => {
          const rows = items.filter((c) => !used.has(c.id) && g.match(c.time))
          rows.forEach((c) => used.add(c.id))
          if (!rows.length) return null
          return (
            <div key={g.title}>
              <MenuDivider title={g.title} />
              {rows.map((c) => <MenuItem key={c.id} text={c.title} label={c.time} active={c.id === active} onClick={() => onSelect(c.id)} labelElement={c.unread ? <Tag round intent="primary" style={{ marginLeft: 6 }}>{c.unread}</Tag> : undefined} icon={icon("message-square")} />)}
            </div>
          )
        })}
      </Menu>
    </div>
  )
}

export function ChatPage() {
  const [active, setActive] = useState(chat.conversations[0].id)
  const [drawer, setDrawer] = useState(false)
  const [input, setInput] = useState("")
  const [model, setModel] = useState(chat.models[0])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const title = chat.conversations.find((c) => c.id === active)?.title
  const send = () => { if (!input.trim()) return; void toast("消息已发送（演示）", "primary"); setInput("") }
  const select = (id: string) => { setActive(id); setDrawer(false) }

  return (
    <div className="chat">
      <Card className="chat-list-panel" style={{ padding: 12 }}><ConversationList active={active} onSelect={select} /></Card>
      <Drawer isOpen={drawer} onClose={() => setDrawer(false)} position="left" size="300px" title="会话"><div style={{ padding: 12 }}><ConversationList active={active} onSelect={select} /></div></Drawer>
      <Card className="chat-main" style={{ padding: 0 }}>
        <div className="row-between" style={{ padding: "10px 16px", flexWrap: "nowrap" }}>
          <span className="row min0" style={{ flexWrap: "nowrap" }}><Button className="mobile-only" minimal icon={icon("menu")} aria-label="会话列表" onClick={() => setDrawer(true)} /><H4 className="truncate" style={{ margin: 0 }}>{title ?? "新会话"}</H4></span>
          <span className="row" style={{ flexWrap: "nowrap" }}><Tag minimal icon={icon("bot", 12)}>{model}</Tag><Button minimal icon={icon("more-horizontal")} aria-label="更多" /></span>
        </div>
        <Divider style={{ margin: 0 }} />
        <div className="chat-stream">
          {title ? chat.messages.map((m, i) => <Bubble key={i} message={m} />) : (
            <NonIdealState icon={<span className="avatar lg" style={{ background: "#238551" }}>{icon("sparkles", 24)}</span>} title={<H3>你好，我是 Acme 助手</H3>} description="可以问我任何关于订单、收入与团队的问题。" action={
              <div className="grid" style={{ width: "100%", maxWidth: 640, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>{chat.suggestions.map((s) => <Card key={s} interactive className="row" style={{ padding: 12 }} onClick={() => setInput(s)}>{icon("sparkles")}<span>{s}</span></Card>)}</div>
            } layout="vertical" />
          )}
        </div>
        <div className="chat-input">
          <div className="row">{chat.suggestions.map((s) => <Tag key={s} minimal round interactive onClick={() => setInput(s)}>{s}</Tag>)}</div>
          <TextArea inputRef={textareaRef} fill autoResize value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入消息，Enter 发送，Shift+Enter 换行" rows={1} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }} />
          <div className="row-between">
            <span className="row"><Tooltip content="添加附件"><Button minimal icon={icon("paperclip")} aria-label="附件" /></Tooltip><HTMLSelect minimal value={model} onChange={(e) => setModel(e.currentTarget.value)} options={chat.models} /></span>
            <span className="row"><span className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>{input.length} / 2000 · ⏎ 发送</span><Button intent="primary" icon={icon("send")} disabled={!input.trim()} onClick={send}>发送</Button></span>
          </div>
        </div>
      </Card>
    </div>
  )
}
