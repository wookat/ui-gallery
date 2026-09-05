import { useMemo, useState, type ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Badge, Button, Card, Col, Form, InputGroup, ListGroup, Offcanvas, Row, Spinner, Table, Collapse } from "react-bootstrap"
import { Icon } from "@ui-gallery/icons-react"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Avatar, EmptyState, PageTitle, ResponsivePage } from "@/pages/shared"

const markdownComponents: Components = {
  code({ children, className }) {
    return <CodeBlock className={className}>{children}</CodeBlock>
  },
  table({ children }) {
    return <Table size="sm" bordered responsive>{children}</Table>
  },
}

function CodeBlock({ children, className }: { children: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false)
  const source = String(children).replace(/\n$/, "")
  return <div className="position-relative"><pre className="bg-body-tertiary rounded p-3 overflow-auto"><code className={className}>{source}</code></pre><Button size="sm" variant="outline-secondary" className="position-absolute top-0 end-0 m-2" onClick={() => { void navigator.clipboard?.writeText(source); setCopied(true) }}>{copied ? "已复制" : "复制"}</Button></div>
}

export function ChatPage() {
  const [mobile, setMobile] = useState(false)
  const [query, setQuery] = useState("")
  const [text, setText] = useState("")
  const [collapsed, setCollapsed] = useState(true)
  const conversations = useMemo(() => chat.conversations.filter((item) => item.title.includes(query)), [query])
  return <ResponsivePage><PageTitle title="AI 助手" subtitle="用自然语言探索你的业务数据。" actions={<Button className="d-lg-none" onClick={() => setMobile(true)}><Icon name="list" className="me-1" />会话列表</Button>} /><Row className="chat-layout border rounded overflow-hidden g-0"><Col lg={3} className="d-none d-lg-flex flex-column border-end p-3"><ConversationList query={query} setQuery={setQuery} conversations={conversations} /></Col><Col className="d-flex flex-column min-width-0"><div className="chat-stream p-3 p-md-4 flex-grow-1">{chat.messages.length === 0 ? <EmptyState title="开始一段新对话" /> : chat.messages.map((message, index) => <div key={`${message.role}-${index}`} className={`d-flex gap-2 mb-3 ${message.role === "user" ? "justify-content-end" : ""}`}><Avatar name={message.role === "user" ? "林" : "AI"} /><Card className={message.role === "user" ? "bg-primary text-white" : ""} style={{ maxWidth: "min(720px, 88%)" }}><Card.Body className="p-3"><ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{message.content}</ReactMarkdown>{message.sources && <div className="d-flex gap-1 flex-wrap mt-2">{message.sources.map((source) => <Badge bg="secondary" pill key={source}>{source}</Badge>)}</div>}{message.tool && <><Button variant="link" size="sm" onClick={() => setCollapsed(!collapsed)}>工具调用：{message.tool.name}</Button><Collapse in={!collapsed}><div className="small bg-body-secondary rounded p-2">{JSON.stringify(message.tool.args)}</div></Collapse></>}{message.streaming && <div className="text-secondary small"><Spinner animation="grow" size="sm" /> 正在输入</div>}<small className="d-block text-secondary mt-2">刚刚</small></Card.Body></Card></div>)}</div><div className="border-top p-3"><InputGroup><Form.Control as="textarea" rows={2} value={text} onChange={(event) => setText(event.target.value)} placeholder="输入消息... Enter 发送，Shift+Enter 换行" /><Button variant="outline-secondary" aria-label="附件"><Icon name="paperclip" /></Button><Button aria-label="发送"><Icon name="send" /></Button></InputGroup><div className="d-flex flex-wrap gap-2 mt-2">{chat.suggestions.map((suggestion) => <Button size="sm" variant="outline-secondary" key={suggestion} onClick={() => setText(suggestion)}>{suggestion}</Button>)}</div><div className="d-flex justify-content-between"><small className="text-secondary mt-1">{text.length} / 4,000</small><small className="text-secondary mt-1">Enter 发送 / Shift+Enter 换行</small></div><Form.Select className="mt-2" aria-label="模型"><option value={chat.models[0]}>{chat.models[0]}</option>{chat.models.slice(1).map((model) => <option key={model}>{model}</option>)}</Form.Select></div></Col></Row><Card className="mt-4"><Card.Body><h2 className="h5">从这里开始</h2><Row className="g-2">{chat.suggestions.map((suggestion) => <Col sm={6} lg={3} key={suggestion}><Card className="h-100"><Card.Body><Button variant="link" className="p-0 text-start" onClick={() => setText(suggestion)}>{suggestion}</Button></Card.Body></Card></Col>)}</Row></Card.Body></Card><Offcanvas show={mobile} onHide={() => setMobile(false)}><Offcanvas.Header closeButton><Offcanvas.Title>会话列表</Offcanvas.Title></Offcanvas.Header><Offcanvas.Body><ConversationList query={query} setQuery={setQuery} conversations={conversations} /></Offcanvas.Body></Offcanvas></ResponsivePage>
}

function ConversationList({ query, setQuery, conversations }: { query: string; setQuery: (value: string) => void; conversations: typeof chat.conversations }) {
  return <><Button className="w-100 mb-3"><Icon name="plus" className="me-1" />新建对话</Button><Form.Control value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索会话" className="mb-3" /><ListGroup variant="flush">{conversations.map((conversation) => <ListGroup.Item action key={conversation.id} className="rounded mb-1"><div className="d-flex justify-content-between"><span className="text-truncate">{conversation.title}</span>{conversation.unread ? <Badge pill>{conversation.unread}</Badge> : null}</div><small className="text-secondary">{conversation.time}</small></ListGroup.Item>)}</ListGroup></>
}
