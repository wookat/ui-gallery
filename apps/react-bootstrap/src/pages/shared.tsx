import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { Badge, Button, Card, Col, Container, Form, ListGroup, Modal, Row, Spinner, Toast, ToastContainer } from "react-bootstrap"
import { Icon } from "@ui-gallery/icons-react"
import orders from "@ui-gallery/spec/mock/orders.json"

export function Brand() {
  return <Link to="/" className="navbar-brand fw-semibold d-flex align-items-center gap-2"><span className="bg-primary text-white rounded-3 px-2 py-1">A</span><span>Acme Console</span></Link>
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4"><div><h1 className="h3 mb-1">{title}</h1>{subtitle && <p className="text-secondary mb-0">{subtitle}</p>}</div>{actions}</div>
}

export function Section({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <section className={className}><h2 className="h5 mb-3">{title}</h2>{children}</section>
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return <span className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center flex-shrink-0" style={{ width: size, height: size, fontSize: size * 0.38 }}>{name.slice(0, 1)}</span>
}

export function AvatarGroup({ names }: { names: string[] }) {
  return <div className="d-flex">{names.map((name, index) => <span key={name} style={{ marginLeft: index ? -8 : 0, zIndex: names.length - index }} className="border border-2 border-body rounded-circle"><Avatar name={name} size={36} /></span>)}</div>
}

export function StatusBadge({ status }: { status: string }) {
  const variant = status === "paid" || status === "shipped" ? "success" : status === "pending" ? "warning" : status === "failed" ? "danger" : "secondary"
  const labels: Record<string, string> = { paid: "已支付", pending: "处理中", refunded: "已退款", failed: "失败", shipped: "已发货", due: "待支付" }
  return <Badge bg={variant}>{labels[status] ?? status}</Badge>
}

export function ResultView({ onPrimary, onSecondary }: { onPrimary: () => void; onSecondary: () => void }) {
  return <Card className="text-center border-0"><Card.Body className="py-5"><div className="display-5 text-success mb-3">✓</div><h2 className="h4">操作成功</h2><p className="text-secondary">你的内容已经保存。</p><div className="d-flex justify-content-center gap-2"><Button onClick={onPrimary}>返回工作台</Button><Button variant="outline-secondary" onClick={onSecondary}>继续创建</Button></div></Card.Body></Card>
}

export function EmptyState({ title = "暂无数据", action }: { title?: string; action?: ReactNode }) {
  return <div className="text-center py-5"><Icon name="inbox" size={34} className="text-secondary mb-3" /><h3 className="h5">{title}</h3><p className="text-secondary">这里还没有内容。</p>{action}</div>
}

export function OrderRows({ limit = 5 }: { limit?: number }) {
  return <>{orders.slice(0, limit).map((order) => <tr key={order.id}><td className="fw-semibold">{order.id}</td><td><div className="d-flex align-items-center gap-2"><Avatar name={order.customer} />{order.customer}</div></td><td>{order.product}</td><td><StatusBadge status={order.status} /></td><td className="text-end">¥{order.amount.toLocaleString()}</td></tr>)}</>
}

export function OrderCards({ limit = 5 }: { limit?: number }) {
  return <ListGroup variant="flush">{orders.slice(0, limit).map((order) => <ListGroup.Item key={order.id} className="d-flex align-items-center gap-3"><Avatar name={order.customer} /><div className="flex-grow-1 min-w-0"><div className="d-flex justify-content-between gap-2"><span className="fw-semibold text-nowrap">{order.id}</span><span className="text-nowrap">¥{order.amount.toLocaleString()}</span></div><div className="small text-secondary text-truncate">{order.customer} · {order.product}</div></div><StatusBadge status={order.status} /></ListGroup.Item>)}</ListGroup>
}

export function ToastNotice({ show, onClose, title = "已完成", children = "操作已成功。" }: { show: boolean; onClose: () => void; title?: string; children?: ReactNode }) {
  return <ToastContainer position="top-end" className="p-3"><Toast show={show} onClose={onClose} autohide delay={2600}><Toast.Header><strong className="me-auto">{title}</strong><small>刚刚</small></Toast.Header><Toast.Body>{children}</Toast.Body></Toast></ToastContainer>
}

export function DeleteModal({ show, onHide, onDelete }: { show: boolean; onHide: () => void; onDelete: () => void }) {
  const [value, setValue] = useState("")
  return <Modal show={show} onHide={onHide} centered><Modal.Header closeButton><Modal.Title>删除账号</Modal.Title></Modal.Header><Modal.Body><p>请输入 DELETE 以确认操作。</p><Form.Control value={value} onChange={(event) => setValue(event.target.value)} placeholder="DELETE" /></Modal.Body><Modal.Footer><Button variant="secondary" onClick={onHide}>取消</Button><Button variant="danger" disabled={value !== "DELETE"} onClick={onDelete}>永久删除</Button></Modal.Footer></Modal>
}

export function FieldLabel({ children, required = false, info }: { children: ReactNode; required?: boolean; info?: string }) {
  return <Form.Label>{children}{required && <span className="text-danger ms-1">*</span>}{info && <span className="ms-1" title={info}>ⓘ</span>}</Form.Label>
}

export function LoadingButton({ loading, children, type = "button", className }: { loading: boolean; children: ReactNode; type?: "button" | "submit"; className?: string }) {
  return <Button type={type} disabled={loading} className={className}>{loading && <Spinner animation="border" size="sm" className="me-2" />}{children}</Button>
}

export function ResponsivePage({ children }: { children: ReactNode }) {
  return <Container fluid className="app-content p-3 p-md-4">{children}</Container>
}

export function SplitFeature({ title, text, reverse = false }: { title: string; text: string; reverse?: boolean }) {
  return <Row className="align-items-center g-4 py-5"><Col lg={{ span: 6, order: reverse ? 2 : 1 }}><div className="hero-placeholder bg-body-secondary rounded-4 d-flex align-items-center justify-content-center"><Icon name="layout-dashboard" size={42} /></div></Col><Col lg={{ span: 6, order: reverse ? 1 : 2 }}><h2 className="h3">{title}</h2><p className="lead text-secondary">{text}</p></Col></Row>
}
