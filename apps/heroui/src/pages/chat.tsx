import { useMemo, useState, type ComponentProps, type ReactNode } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Avatar, Button, Card, Chip, Drawer, Header, ListBox, ScrollShadow, SearchField, Select, Skeleton, Spinner, TextArea, TextField, toast, Tooltip } from "@heroui/react"
import { Icon } from "@/components/icon"
import chat from "@ui-gallery/spec/mock/chat.json"

type Message = (typeof chat.messages)[number] & { sources?: string[]; tool?: { name: string; args: Record<string, string>; status: string }; streaming?: boolean }
type Conversation = (typeof chat.conversations)[number]
const messages = chat.messages as Message[]
const DRAFT_MAX = 2000

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (node && typeof node === "object" && "props" in node) return textOf((node.props as { children?: ReactNode }).children)
  return ""
}

function CodeBlock({ children, ...props }: ComponentProps<"pre">) {
  const copy = () => {
    void navigator.clipboard?.writeText(textOf(children)).then(() => toast.success("代码已复制"))
  }
  return (
    <div className="group relative min-w-0">
      <pre {...props}>{children}</pre>
      <Button isIconOnly size="sm" variant="secondary" aria-label="复制代码" className="absolute right-2 top-2 size-8 min-w-8" onPress={copy}>
        <Icon name="copy" size={14} />
      </Button>
    </div>
  )
}

function ConversationList({ items, active, onSelect }: { items: Conversation[]; active: string; onSelect: (id: string) => void }) {
  const groups = useMemo(() => {
    const today = items.filter((c) => c.time === "刚刚" || c.time.includes("分钟") || c.time.includes("小时"))
    const earlier = items.filter((c) => !today.includes(c))
    return [{ label: "今天", items: today }, { label: "更早", items: earlier }].filter((g) => g.items.length)
  }, [items])
  if (!items.length) return <p className="px-2 py-6 text-center text-sm text-muted">没有匹配的对话</p>
  return (
    <ListBox aria-label="对话列表" selectionMode="single" selectedKeys={[active]} onSelectionChange={(keys) => { const key = [...keys][0]; if (key) onSelect(String(key)) }}>
      {groups.map((group) => (
        <ListBox.Section key={group.label}>
          <Header className="px-2 pb-1 pt-3 text-xs font-medium text-muted">{group.label}</Header>
          {group.items.map((c) => (
            <ListBox.Item key={c.id} id={c.id} textValue={c.title}>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="min-w-0"><p className="truncate text-sm">{c.title}</p><p className="text-xs text-muted">{c.time}</p></div>
                {c.unread ? <Chip size="sm" color="accent">{c.unread}</Chip> : null}
              </div>
            </ListBox.Item>
          ))}
        </ListBox.Section>
      ))}
    </ListBox>
  )
}

export function ChatPage() {
  const [active, setActive] = useState(chat.conversations[0].id)
  const [draft, setDraft] = useState("")
  const [model, setModel] = useState(chat.models[0])
  const [search, setSearch] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const current = chat.conversations.find((c) => c.id === active)
  const empty = active !== chat.conversations[0].id
  const filteredConversations = chat.conversations.filter((c) => c.title.toLowerCase().includes(search.trim().toLowerCase()))
  const send = () => { if (draft.trim()) { toast.success("消息已发送"); setDraft("") } }

  const sidebar = (
    <>
      <SearchField aria-label="搜索对话" value={search} onChange={setSearch} className="mb-2">
        <SearchField.Group><SearchField.SearchIcon /><SearchField.Input placeholder="搜索对话..." /><SearchField.ClearButton /></SearchField.Group>
      </SearchField>
      <ConversationList items={filteredConversations} active={active} onSelect={(id) => { setActive(id); setDrawerOpen(false) }} />
    </>
  )

  return (
    <div className="grid h-[calc(100svh-8rem)] min-h-[560px] min-w-0 grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <Card className="hidden min-h-0 lg:flex lg:flex-col">
        <Card.Header className="flex-row items-center justify-between"><Card.Title>对话</Card.Title><Button isIconOnly size="sm" variant="ghost" aria-label="新对话" onPress={() => toast.success("已创建新对话")}><Icon name="plus" size={16} /></Button></Card.Header>
        <Card.Content className="min-h-0 flex-1 overflow-y-auto">{sidebar}</Card.Content>
      </Card>
      <Card className="flex min-h-0 min-w-0 flex-col">
        <Card.Header className="flex-row flex-wrap items-center justify-between gap-2 border-b border-border">
          <div className="flex min-w-0 items-center gap-2">
            <Drawer isOpen={drawerOpen} onOpenChange={setDrawerOpen}>
              <Button isIconOnly variant="ghost" size="sm" aria-label="打开对话列表" className="lg:hidden"><Icon name="list" size={18} /></Button>
              <Drawer.Backdrop>
                <Drawer.Content placement="left" className="w-80 max-w-[85vw]">
                  <Drawer.Dialog>
                    <Drawer.CloseTrigger />
                    <Drawer.Header><Drawer.Heading>对话</Drawer.Heading><p className="text-sm text-muted">搜索并切换会话</p></Drawer.Header>
                    <Drawer.Body>{sidebar}</Drawer.Body>
                    <Drawer.Footer><Button fullWidth variant="secondary" onPress={() => { toast.success("已创建新对话"); setDrawerOpen(false) }}><Icon name="plus" size={16} />新对话</Button></Drawer.Footer>
                  </Drawer.Dialog>
                </Drawer.Content>
              </Drawer.Backdrop>
            </Drawer>
            <Card.Title className="truncate text-base">{current?.title}</Card.Title>
          </div>
          <Select aria-label="模型" value={model} onChange={(key) => setModel(String(key))} className="w-36">
            <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
            <Select.Popover><ListBox>{chat.models.map((m) => <ListBox.Item key={m} id={m} textValue={m}>{m}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox></Select.Popover>
          </Select>
        </Card.Header>
        <ScrollShadow className="min-h-0 min-w-0 flex-1 p-4">
          {empty ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent-soft-foreground"><Icon name="bot" /></div>
              <p className="font-medium">开始新的对话</p>
              <p className="text-sm text-muted">试试下面的建议，或直接提问。</p>
              <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">{chat.suggestions.map((s) => <Button key={s} size="sm" variant="secondary" className="justify-start" onPress={() => setDraft(s)}><Icon name="sparkles" size={14} />{s}</Button>)}</div>
              <div className="mt-6 w-full max-w-md space-y-2"><Skeleton className="h-4 w-full rounded-lg" /><Skeleton className="h-4 w-3/4 rounded-lg" /></div>
            </div>
          ) : (
            <div className="min-w-0 space-y-6">
              {messages.map((message, index) => (
                <div key={index} className={`flex min-w-0 gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.role === "assistant" ? <Avatar size="sm" className="shrink-0"><Avatar.Fallback>AI</Avatar.Fallback></Avatar> : null}
                  <div className={`min-w-0 max-w-[85%] space-y-2 ${message.role === "user" ? "order-first" : ""}`}>
                    {message.tool ? (
                      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-surface-secondary px-3 py-2 text-xs">
                        <Icon name="terminal" size={14} className="shrink-0" /><code className="min-w-0 break-all">{message.tool.name}({JSON.stringify(message.tool.args)})</code>
                        <Chip size="sm" color="success" className="ml-auto shrink-0">{message.tool.status}</Chip>
                      </div>
                    ) : null}
                    <div className={`prose-chat min-w-0 max-w-full overflow-hidden rounded-2xl px-4 py-3 text-sm ${message.role === "user" ? "bg-accent text-accent-foreground" : "bg-surface-secondary"}`}>
                      <Markdown remarkPlugins={[remarkGfm]} components={{ pre: CodeBlock }}>{message.content}</Markdown>
                      {message.streaming ? <span className="mt-2 inline-flex items-center gap-2 text-xs text-muted"><Spinner size="sm" />生成中…</span> : null}
                    </div>
                    {message.sources ? <div className="flex flex-wrap gap-1">{message.sources.map((s) => <Tooltip key={s}><Chip size="sm" variant="secondary">{s}</Chip><Tooltip.Content>数据来源</Tooltip.Content></Tooltip>)}</div> : null}
                  </div>
                  {message.role === "user" ? <Avatar size="sm" className="shrink-0"><Avatar.Fallback>林</Avatar.Fallback></Avatar> : null}
                </div>
              ))}
            </div>
          )}
        </ScrollShadow>
        <Card.Footer className="flex-col items-stretch gap-3 border-t border-border">
          <div className="flex flex-wrap gap-2">{chat.suggestions.slice(0, 4).map((s) => <Chip key={s} size="sm" variant="secondary" className="cursor-pointer" onClick={() => setDraft(s)}>{s}</Chip>)}</div>
          <div className="flex items-end gap-2">
            <Tooltip>
              <Button isIconOnly variant="ghost" aria-label="添加附件" onPress={() => toast.success("附件选择器已打开")}><Icon name="paperclip" size={18} /></Button>
              <Tooltip.Content>添加附件</Tooltip.Content>
            </Tooltip>
            <TextField aria-label="消息" value={draft} onChange={setDraft} className="min-w-0 flex-1" maxLength={DRAFT_MAX}>
              <TextArea placeholder="输入消息，Enter 发送…" rows={2} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send() } }} />
            </TextField>
            <Button isIconOnly aria-label="发送" isDisabled={!draft.trim()} onPress={send}><Icon name="send" size={16} /></Button>
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Enter 发送 · Shift+Enter 换行</span>
            <span aria-live="polite">{draft.length}/{DRAFT_MAX}</span>
          </div>
        </Card.Footer>
      </Card>
    </div>
  )
}
