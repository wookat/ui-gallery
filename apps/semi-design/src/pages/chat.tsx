import { useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Avatar, Badge, Button, Card, Empty, Input, List, Select, Spin, Tag, TextArea, Toast, Tooltip, Typography } from "@douyinfe/semi-ui"
import { IllustrationConstruction, IllustrationConstructionDark } from "@douyinfe/semi-illustrations"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/icons"

type Message = (typeof chat.messages)[number] & { sources?: string[]; tool?: { name: string; args: Record<string, unknown>; status: string }; streaming?: boolean }
const { Text, Title } = Typography
const groups: { label: string; ids: string[] }[] = [{ label: "今天", ids: ["c1"] }, { label: "本周", ids: ["c2", "c3"] }, { label: "更早", ids: ["c4"] }]

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  return (
    <div className="acme-row" style={{ flexWrap: "nowrap", alignItems: "flex-start", flexDirection: isUser ? "row-reverse" : "row" }}>
      <Avatar size="small" color={isUser ? "light-blue" : "violet"}>{isUser ? "林" : <Icon name="bot" size={14} />}</Avatar>
      <div style={{ minWidth: 0, maxWidth: "min(720px, 100%)" }}>
        {message.tool ? <Card bodyStyle={{ padding: "6px 10px" }} style={{ marginBottom: 8 }}><span className="acme-row" style={{ flexWrap: "nowrap" }}><Icon name="wrench" size={14} /><Text code>{message.tool.name}({JSON.stringify(message.tool.args)})</Text><Tag size="small" color="green">{message.tool.status}</Tag></span></Card> : null}
        <div className={`acme-bubble${isUser ? " user" : ""}`}>
          <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
          {message.streaming ? <span className="acme-row" style={{ gap: 6 }}><Spin size="small" /><Text type="tertiary" size="small">生成中…</Text></span> : null}
        </div>
        {message.sources?.length ? <div className="acme-row" style={{ marginTop: 6 }}><Text type="tertiary" size="small">来源：</Text>{message.sources.map((source) => <Tag key={source} size="small" type="ghost">{source}</Tag>)}</div> : null}
        {!isUser && !message.streaming ? <div className="acme-row" style={{ marginTop: 4, gap: 0 }}><Tooltip content="复制"><Button size="small" theme="borderless" type="tertiary" icon={<Icon name="copy" size={14} />} aria-label="复制" onClick={() => Toast.success("已复制")} /></Tooltip><Tooltip content="重新生成"><Button size="small" theme="borderless" type="tertiary" icon={<Icon name="refresh-cw" size={14} />} aria-label="重新生成" /></Tooltip><Tooltip content="赞"><Button size="small" theme="borderless" type="tertiary" icon={<Icon name="thumbs-up" size={14} />} aria-label="赞" /></Tooltip></div> : null}
      </div>
    </div>
  )
}

export function ChatPage() {
  const [active, setActive] = useState("c1")
  const [draft, setDraft] = useState("")
  const [model, setModel] = useState(chat.models[0])
  const [search, setSearch] = useState("")
  const messages = active === "c1" ? (chat.messages as Message[]) : []
  return (
    <div className="acme-chat-layout">
      <Card className="acme-chat-aside" bodyStyle={{ padding: 12, display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
        <Button theme="solid" block icon={<Icon name="plus" />} onClick={() => setActive("new")}>新对话</Button>
        <Input prefix={<Icon name="search" />} placeholder="搜索对话" value={search} onChange={setSearch} showClear />
        <div style={{ overflowY: "auto", flex: 1 }}>
          {groups.map((group) => {
            const items = chat.conversations.filter((item) => group.ids.includes(item.id) && item.title.includes(search))
            if (!items.length) return null
            return <div key={group.label}><Text type="tertiary" size="small" style={{ display: "block", padding: "8px 8px 4px" }}>{group.label}</Text><List size="small" dataSource={items} split={false} renderItem={(item) => <List.Item style={{ padding: "8px", borderRadius: 6, cursor: "pointer", background: item.id === active ? "var(--semi-color-fill-0)" : undefined }} onClick={() => setActive(item.id)} main={<div className="acme-between" style={{ flexWrap: "nowrap" }}><span style={{ minWidth: 0 }}><Text ellipsis style={{ maxWidth: 160 }}>{item.title}</Text><br /><Text type="tertiary" size="small">{item.time}</Text></span>{item.unread ? <Badge count={item.unread} type="primary" /> : null}</div>} />} /></div>
          })}
        </div>
      </Card>
      <Card className="acme-chat-main" bodyStyle={{ padding: 0, display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
        <div className="acme-between" style={{ padding: "10px 16px", borderBottom: "1px solid var(--semi-color-border)", flexWrap: "nowrap" }}>
          <div className="acme-row" style={{ flexWrap: "nowrap", minWidth: 0 }}><Button className="acme-mobile-only" theme="borderless" type="tertiary" icon={<Icon name="menu" />} aria-label="对话列表" /><Text strong ellipsis>{chat.conversations.find((item) => item.id === active)?.title ?? "新对话"}</Text></div>
          <Select value={model} onChange={(value) => setModel(String(value))} size="small" style={{ width: 150 }} optionList={chat.models.map((value) => ({ value, label: value }))} aria-label="模型" />
        </div>
        <div className="acme-chat-stream">
          {messages.length ? messages.map((message, index) => <Bubble key={index} message={message} />) : (
            <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
              <Empty image={<IllustrationConstruction style={{ width: 150, height: 150 }} />} darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />} title={<Title heading={4} style={{ margin: 0 }}>今天想了解什么？</Title>} description="试试下面的问题，或直接输入。">
                <div className="acme-grid-2 acme-grid" style={{ gap: 8, marginTop: 8 }}>{chat.suggestions.map((item) => <Button key={item} theme="light" type="tertiary" onClick={() => setDraft(item)}>{item}</Button>)}</div>
              </Empty>
            </div>
          )}
        </div>
        <div style={{ padding: 12, borderTop: "1px solid var(--semi-color-border)" }}>
          {messages.length ? <div className="acme-row" style={{ marginBottom: 8 }}>{chat.suggestions.slice(0, 3).map((item) => <Tag key={item} style={{ cursor: "pointer" }} onClick={() => setDraft(item)}>{item}</Tag>)}</div> : null}
          <TextArea value={draft} onChange={setDraft} placeholder="输入问题，Shift + Enter 换行" autosize={{ minRows: 1, maxRows: 5 }} />
          <div className="acme-between" style={{ marginTop: 8, flexWrap: "nowrap" }}>
            <div className="acme-row" style={{ flexWrap: "nowrap" }}><Tooltip content="附件"><Button theme="borderless" type="tertiary" icon={<Icon name="paperclip" />} aria-label="附件" /></Tooltip><Tooltip content="语音"><Button theme="borderless" type="tertiary" icon={<Icon name="mic" />} aria-label="语音" /></Tooltip><Text type="tertiary" size="small" className="acme-desktop-only">{model}</Text></div>
            <Button theme="solid" icon={<Icon name="send" />} disabled={!draft.trim()} onClick={() => { Toast.info("演示模式：消息未发送"); setDraft("") }}>发送</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
