import { useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Avatar, Button, Card, Chip, ListBox, ScrollShadow, Select, Skeleton, Spinner, TextArea, TextField, Tooltip } from "@heroui/react"
import { Icon } from "@ui-gallery/icons-react"
import chat from "@ui-gallery/spec/mock/chat.json"

type Message = (typeof chat.messages)[number] & { sources?: string[]; tool?: { name: string; args: Record<string, string>; status: string }; streaming?: boolean }
const messages = chat.messages as Message[]

export function ChatPage() {
  const [active, setActive] = useState(chat.conversations[0].id)
  const [draft, setDraft] = useState("")
  const [model, setModel] = useState(chat.models[0])
  const current = chat.conversations.find((c) => c.id === active)
  const empty = active !== chat.conversations[0].id

  return (
    <div className="grid h-[calc(100svh-8rem)] min-h-[560px] grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <Card className="hidden lg:flex lg:flex-col">
        <Card.Header className="flex-row items-center justify-between"><Card.Title>对话</Card.Title><Button isIconOnly size="sm" variant="ghost" aria-label="新对话"><Icon name="plus" size={16} /></Button></Card.Header>
        <Card.Content className="flex-1 overflow-y-auto">
          <ListBox aria-label="对话列表" selectionMode="single" selectedKeys={[active]} onSelectionChange={(keys) => { const key = [...keys][0]; if (key) setActive(String(key)) }}>
            {chat.conversations.map((c) => (
              <ListBox.Item key={c.id} id={c.id} textValue={c.title}>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="min-w-0"><p className="truncate text-sm">{c.title}</p><p className="text-xs text-muted">{c.time}</p></div>
                  {c.unread ? <Chip size="sm" color="accent">{c.unread}</Chip> : null}
                </div>
              </ListBox.Item>
            ))}
          </ListBox>
        </Card.Content>
      </Card>
      <Card className="flex min-h-0 min-w-0 flex-col">
        <Card.Header className="flex-row flex-wrap items-center justify-between gap-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Select aria-label="切换对话" value={active} onChange={(key) => setActive(String(key))} className="w-36 lg:hidden">
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover><ListBox>{chat.conversations.map((c) => <ListBox.Item key={c.id} id={c.id} textValue={c.title}>{c.title}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover>
            </Select>
            <Card.Title className="hidden text-base lg:block">{current?.title}</Card.Title>
          </div>
          <Select aria-label="模型" value={model} onChange={(key) => setModel(String(key))} className="w-36">
            <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
            <Select.Popover><ListBox>{chat.models.map((m) => <ListBox.Item key={m} id={m} textValue={m}>{m}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover>
          </Select>
        </Card.Header>
        <ScrollShadow className="min-h-0 flex-1 p-4">
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent-soft-foreground"><Icon name="bot" /></div>
              <p className="font-medium">开始新的对话</p>
              <p className="text-sm text-muted">试试下面的建议，或直接提问。</p>
              <div className="flex flex-wrap justify-center gap-2">{chat.suggestions.map((s) => <Button key={s} size="sm" variant="secondary" onPress={() => setDraft(s)}>{s}</Button>)}</div>
              <div className="mt-6 w-full max-w-md space-y-2"><Skeleton className="h-4 w-full rounded-lg" /><Skeleton className="h-4 w-3/4 rounded-lg" /></div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.role === "assistant" ? <Avatar size="sm"><Avatar.Fallback>AI</Avatar.Fallback></Avatar> : null}
                  <div className={`min-w-0 max-w-[85%] space-y-2 ${message.role === "user" ? "order-first" : ""}`}>
                    {message.tool ? (
                      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-surface-secondary px-3 py-2 text-xs">
                        <Icon name="terminal" size={14} className="shrink-0" /><code className="min-w-0 break-all">{message.tool.name}({JSON.stringify(message.tool.args)})</code>
                        <Chip size="sm" color="success" className="ml-auto shrink-0">{message.tool.status}</Chip>
                      </div>
                    ) : null}
                    <div className={`prose-chat rounded-2xl px-4 py-3 text-sm ${message.role === "user" ? "bg-accent text-accent-foreground" : "bg-surface-secondary"}`}>
                      <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                      {message.streaming ? <span className="mt-2 inline-flex items-center gap-2 text-xs text-muted"><Spinner size="sm" />生成中…</span> : null}
                    </div>
                    {message.sources ? <div className="flex flex-wrap gap-1">{message.sources.map((s) => <Tooltip key={s}><Chip size="sm" variant="secondary">{s}</Chip><Tooltip.Content>数据来源</Tooltip.Content></Tooltip>)}</div> : null}
                  </div>
                  {message.role === "user" ? <Avatar size="sm"><Avatar.Fallback>林</Avatar.Fallback></Avatar> : null}
                </div>
              ))}
            </div>
          )}
        </ScrollShadow>
        <Card.Footer className="flex-col items-stretch gap-3 border-t border-border">
          <div className="flex flex-wrap gap-2">{chat.suggestions.slice(0, 3).map((s) => <Chip key={s} size="sm" variant="secondary" className="cursor-pointer" onClick={() => setDraft(s)}>{s}</Chip>)}</div>
          <div className="flex items-end gap-2">
            <TextField aria-label="消息" value={draft} onChange={setDraft} className="flex-1"><TextArea placeholder="输入消息，Enter 发送…" rows={2} /></TextField>
            <Button isIconOnly aria-label="发送" isDisabled={!draft} onPress={() => setDraft("")}><Icon name="send" size={16} /></Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  )
}
