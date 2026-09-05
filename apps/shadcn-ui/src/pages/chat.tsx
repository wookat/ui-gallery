import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Icon } from "@ui-gallery/icons-react"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Attachment, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle } from "@/components/ui/attachment"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Message, MessageAvatar, MessageContent, MessageGroup, MessageHeader } from "@/components/ui/message"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "./shared"

export function ChatPage() {
  const [draft, setDraft] = useState("")
  const [copied, setCopied] = useState(false)
  return (
    <div className="space-y-6">
      <PageHeader title="AI 对话" description="与团队智能助手协作，保留完整上下文。" />
      <div className="grid min-h-[620px] overflow-hidden rounded-xl border lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b bg-muted/20 p-4 lg:border-r lg:border-b-0"><div className="flex items-center justify-between"><h2 className="font-semibold">对话</h2><Button size="icon" variant="ghost"><Icon name="plus" /></Button></div><InputGroup className="mt-4"><InputGroupAddon><Icon name="search" size={15} /></InputGroupAddon><InputGroupInput placeholder="搜索对话" /></InputGroup><Button className="mt-3 w-full"><Icon name="plus" />新建对话</Button><ScrollArea className="mt-4 h-64 lg:h-[440px]"><div className="grid gap-1">{chat.conversations.map((item) => <Button className="h-auto justify-start px-3 py-2 text-left" variant={item.id === chat.conversations[0].id ? "secondary" : "ghost"} key={item.id}><span className="min-w-0 flex-1"><span className="block truncate">{item.title}</span><span className="block text-xs text-muted-foreground">{item.time}</span></span>{item.unread ? <Badge>{item.unread}</Badge> : null}</Button>)}</div></ScrollArea></aside>
        <section className="flex min-w-0 flex-col"><header className="flex items-center justify-between border-b px-4 py-3"><div><p className="font-medium">{chat.conversations[0].title}</p><p className="text-xs text-muted-foreground">GPT-5 · 已连接</p></div><Select defaultValue="gpt"><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="gpt">GPT-5</SelectItem><SelectItem value="fast">Fast model</SelectItem></SelectContent></Select></header><ScrollArea className="min-h-0 flex-1 p-4"><MessageGroup>{chat.messages.map((message, index) => <Message className="mb-6" key={`${message.role}-${index}`} align={message.role === "user" ? "end" : "start"}><MessageAvatar><Avatar><AvatarFallback>{message.role === "user" ? "林" : "AI"}</AvatarFallback></Avatar></MessageAvatar><MessageContent><MessageHeader>{message.role === "user" ? "林晓" : "AI 助手"}<span className="text-xs text-muted-foreground">刚刚</span></MessageHeader><BubbleGroup><Bubble variant={message.role === "user" ? "default" : "muted"} align={message.role === "user" ? "end" : "start"}><BubbleContent>{message.role === "assistant" ? <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code({ children }) { const text = String(children).replace(/\n$/, ""); return <div className="relative rounded-lg bg-muted p-3 font-mono text-xs"><Button className="absolute right-2 top-2" size="xs" variant="ghost" onClick={() => { navigator.clipboard?.writeText(text); setCopied(true) }}><Icon name="copy" />{copied ? "已复制" : "复制"}</Button><code>{children}</code></div> } }}>{message.content}</ReactMarkdown> : message.content}</BubbleContent></Bubble></BubbleGroup>{message.sources ? <div className="mt-2 flex flex-wrap gap-2">{message.sources.map((source) => <Badge variant="outline" key={source}><Icon name="paperclip" />{source}</Badge>)}</div> : null}{message.tool ? <Card className="mt-3"><CardHeader className="py-3"><CardTitle className="text-sm"><Icon name="check" />工具调用 · {message.tool.name}</CardTitle></CardHeader><CardContent><pre className="overflow-auto text-xs">{JSON.stringify(message.tool.args, null, 2)}</pre></CardContent></Card> : null}</MessageContent></Message>)}</MessageGroup></ScrollArea><div className="border-t p-4"><div className="mb-3 flex flex-wrap gap-2">{chat.suggestions.map((suggestion) => <Button size="sm" variant="outline" key={suggestion} onClick={() => setDraft(suggestion)}>{suggestion}</Button>)}</div><AttachmentGroup className="mb-3"><Attachment><AttachmentMedia><Icon name="paperclip" /></AttachmentMedia><AttachmentContent><AttachmentTitle>project-notes.md</AttachmentTitle><AttachmentDescription>12 KB · 已就绪</AttachmentDescription></AttachmentContent></Attachment></AttachmentGroup><div className="rounded-lg border p-2"><Textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="向 AI 助手提问..." className="min-h-20 resize-none border-0 shadow-none focus-visible:ring-0" /><div className="flex items-center justify-between"><Button variant="ghost" size="icon"><Icon name="paperclip" /></Button><Button size="icon"><Icon name="send" /></Button></div></div></div></section>
      </div>
      <Empty className="border"><EmptyHeader><EmptyMedia variant="icon"><Icon name="sparkles" /></EmptyMedia><EmptyTitle>流式响应占位</EmptyTitle><EmptyDescription>真实请求接入时会在此展示 Skeleton 流式状态。</EmptyDescription></EmptyHeader><div className="space-y-2"><Skeleton className="h-3 w-64" /><Skeleton className="h-3 w-48" /></div></Empty>
    </div>
  )
}
