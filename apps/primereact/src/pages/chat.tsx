import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Avatar } from "primereact/avatar"
import { Badge } from "primereact/badge"
import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { InputTextarea } from "primereact/inputtextarea"
import { Panel } from "primereact/panel"
import { ProgressSpinner } from "primereact/progressspinner"
import { Sidebar } from "primereact/sidebar"
import { Skeleton } from "primereact/skeleton"
import { Tag } from "primereact/tag"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { Icon } from "@/components/icon"
import { PageHeader } from "@/components/shared"

export function ChatPage() {
  const [draft, setDraft] = useState(""), [mobileOpen, setMobileOpen] = useState(false), [newConversation, setNewConversation] = useState(false)
  const list = <aside className="p-3 h-full surface-section"><div className="flex justify-content-between align-items-center"><strong>对话</strong><Button text icon={<Icon name="plus" />} /></div><IconField iconPosition="left" className="w-full mt-3"><InputIcon className="pi pi-search" /><InputText className="w-full" placeholder="搜索对话" /></IconField><Button label="新建对话" icon={<Icon name="plus" />} className="w-full mt-3" onClick={() => setNewConversation(true)} /><div className="flex flex-column gap-1 mt-3">{chat.conversations.map((item, index) => <Button key={item.id} text className={`justify-content-start text-left ${index === 0 ? "surface-200" : ""}`}><span className="flex-1 min-w-0"><span className="block white-space-nowrap overflow-hidden text-overflow-ellipsis">{item.title}</span><small className="muted">{item.time}</small></span>{item.unread ? <Badge value={item.unread} /> : null}</Button>)}</div></aside>
  return <div className="flex flex-column gap-5"><PageHeader title="AI 对话" description="与团队智能助手协作，保留完整上下文。" /><div className="surface-card border-1 surface-border border-round overflow-hidden flex chat-frame"><div className="hidden md:block w-18rem flex-shrink-0">{list}</div><Sidebar visible={mobileOpen} onHide={() => setMobileOpen(false)} className="w-18rem">{list}</Sidebar><section className="flex-1 min-w-0 flex flex-column"><header className="flex align-items-center justify-content-between border-bottom-1 surface-border p-3"><Button text icon={<Icon name="menu" />} className="md:hidden" onClick={() => setMobileOpen(true)} /><div><strong>{newConversation ? "新对话" : chat.conversations[0].title}</strong><small className="block muted">GPT-5 · 已连接</small></div><Dropdown options={chat.models} value="gpt-5" className="w-10rem" /></header>{newConversation ? <div className="flex-1 flex flex-column align-items-center justify-content-center p-4"><Avatar icon="pi pi-sparkles" size="xlarge" shape="circle" /><h2>开始一段新对话</h2><div className="grid">{chat.suggestions.map((s) => <Button outlined className="col-12 md:col-6" label={s} key={s} onClick={() => setDraft(s)} />)}</div></div> : <><div className="flex-1 overflow-auto p-3 flex flex-column gap-4">{chat.messages.map((message, index) => <div className={`flex gap-2 ${message.role === "user" ? "justify-content-end" : ""}`} key={`${message.role}-${index}`}><Avatar label={message.role === "user" ? "林" : "AI"} shape="circle" /><div className={`border-round p-3 chat-bubble ${message.role === "user" ? "surface-200" : "surface-100 border-1 surface-border"}`}><small className="muted">{message.role === "user" ? "林晓" : "AI 助手"} · 刚刚</small><div className="mt-2"><ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown></div>{message.sources ? <div className="flex flex-wrap gap-2 mt-2">{message.sources.map((source) => <Tag key={source} value={source} icon="pi pi-paperclip" />)}</div> : null}{message.tool ? <Panel header={`工具调用 · ${message.tool.name}`} toggleable collapsed className="mt-3"><pre className="text-xs">{JSON.stringify(message.tool.args, null, 2)}</pre></Panel> : null}{message.streaming ? <div className="flex align-items-center gap-2 mt-2"><Skeleton width="8rem" /><ProgressSpinner style={{ width: 20, height: 20 }} /></div> : null}</div></div>)}</div><div className="border-top-1 surface-border p-3"><div className="flex flex-wrap gap-2 mb-2">{chat.suggestions.map((s) => <Tag key={s} value={s} onClick={() => setDraft(s)} />)}</div><div className="flex gap-2"><Button text icon={<Icon name="paperclip" />} /><InputTextarea value={draft} onChange={(e) => setDraft(e.target.value)} autoResize rows={2} className="flex-1" placeholder="输入消息..." /><Button icon={<Icon name="send" />} label="发送" /></div><small className="muted">{draft.length} / 2000 · Enter 发送，Shift+Enter 换行</small></div></>}</section></div></div>
}
