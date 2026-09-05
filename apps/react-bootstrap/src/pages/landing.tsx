import { useState } from "react"
import { Link } from "react-router-dom"
import { Accordion, Badge, Button, Card, Col, Container, Form, Nav, Navbar, Offcanvas, Row } from "react-bootstrap"
import { Icon } from "@ui-gallery/icons-react"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { AvatarGroup, Brand, Section, SplitFeature } from "@/pages/shared"

export function LandingPage() {
  const [yearly, setYearly] = useState(false)
  return <>
    <Navbar expand="lg" className="border-bottom px-3">
      <Container><Brand /><Navbar.Toggle aria-controls="landing-nav" />
        <Navbar.Offcanvas id="landing-nav" placement="end">
          <Offcanvas.Header closeButton><Offcanvas.Title>Acme Console</Offcanvas.Title></Offcanvas.Header>
          <Offcanvas.Body><Nav className="mx-auto"><Nav.Link href="#features">特性</Nav.Link><Nav.Link href="#solutions">方案</Nav.Link><Nav.Link href="#pricing">定价</Nav.Link><Nav.Link href="#faq">FAQ</Nav.Link><Nav.Link href="#testimonials">客户故事</Nav.Link></Nav><Link className="btn btn-primary" to="/login">免费开始</Link></Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
    <Container>
      <Row className="align-items-center py-5 g-4"><Col lg={6}><Badge bg="primary-subtle" text="primary" className="mb-3">新一代团队工作台</Badge><h1 className="display-4 fw-bold">{landing.hero.title}</h1><p className="lead text-secondary">{landing.hero.subtitle}</p><div className="d-flex flex-wrap gap-2"><Link className="btn btn-primary btn-lg" to="/login">{landing.hero.primary}</Link><Button size="lg" variant="outline-secondary">{landing.hero.secondary}</Button></div><div className="d-flex align-items-center gap-3 mt-4"><AvatarGroup names={["林晓", "Alex", "Maria"]} /><span className="text-secondary">{landing.hero.social}</span></div></Col><Col lg={6}><div className="hero-placeholder bg-body-secondary rounded-4 d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}><Icon name="layout-dashboard" size={48} /></div></Col></Row>
      <div className="d-flex flex-wrap justify-content-around gap-3 border-top border-bottom py-4 text-secondary fw-semibold">{["Northwind", "Contoso", "Globex", "Fabrikam", "Initech", "Umbrella"].map((name) => <span key={name}>{name}</span>)}</div>
      <Section title="为团队而生" className="py-5"><Row id="features" className="g-3">{landing.features.map((feature) => <Col md={6} lg={4} key={feature.title}><Card className="h-100 border-0 bg-body-tertiary"><Card.Body><Icon name={feature.icon} className="text-primary mb-3" size={25} /><h2 className="h5">{feature.title}</h2><p className="text-secondary mb-0">{feature.desc}</p></Card.Body></Card></Col>)}</Row></Section>
      <section id="solutions"><SplitFeature title="统一视图" text="所有业务数据一屏掌握，让团队在同一上下文中协作。" /><SplitFeature title="智能协作" text="让 AI 成为每个团队成员的助手，自动生成洞察与行动。" reverse /><SplitFeature title="安全可靠" text="企业级权限、审计日志与稳定的基础设施。" /></section>
      <Row className="bg-primary text-white rounded-4 py-4 my-5 text-center">{landing.numbers.map((number) => <Col sm={6} lg={3} key={number.label}><div className="fs-2 fw-bold">{number.value}</div><div>{number.label}</div></Col>)}</Row>
      <Section title="简单透明的定价" className="py-5"><div id="pricing" className="d-flex justify-content-center mb-4"><Form.Check type="switch" label={yearly ? "按年付费（价格 × 10 /年）" : "按月付费"} checked={yearly} onChange={(event) => setYearly(event.target.checked)} /></div><Row className="g-3">{plans.map((plan) => <Col md={4} key={plan.name}><Card className={`h-100 ${plan.recommended ? "border-primary shadow" : ""}`}><Card.Body><div className="d-flex justify-content-between"><h2 className="h5">{plan.name}</h2>{plan.recommended && <Badge>推荐</Badge>}</div><div className="display-6 fw-semibold my-3">{plan.price === null ? "定制" : plan.price === 0 ? "免费" : `¥${yearly ? plan.price * 10 : plan.price}`}<small className="fs-6 text-secondary">{plan.price ? yearly ? "/年" : "/月" : ""}</small></div><ul className="list-unstyled">{plan.features.map((feature) => <li key={feature} className="mb-2">✓ {feature}</li>)}</ul><Button className="w-100" variant={plan.recommended ? "primary" : "outline-primary"}>选择计划</Button></Card.Body></Card></Col>)}</Row></Section>
      <Section title="客户怎么说" className="py-5"><Row id="testimonials" className="g-3">{landing.testimonials.map((item) => <Col md={6} lg={4} key={item.name}><Card className="h-100"><Card.Body><p>“{item.quote}”</p><div className="d-flex align-items-center gap-2"><span className="rounded-circle bg-primary-subtle p-2">{item.name.slice(0, 1)}</span><small>{item.name} · {item.company}</small></div></Card.Body></Card></Col>)}</Row></Section>
      <Section title="常见问题" className="py-5"><Accordion id="faq">{landing.faq.map((item, index) => <Accordion.Item eventKey={String(index)} key={item.q}><Accordion.Header>{item.q}</Accordion.Header><Accordion.Body>{item.a}</Accordion.Body></Accordion.Item>)}</Accordion></Section>
      <div className="bg-primary text-white rounded-4 p-4 p-md-5 text-center mb-5"><h2>准备好开始了吗？</h2><p>加入 1,000+ 个高效团队。</p><Link className="btn btn-light" to="/login">免费开始</Link></div>
    </Container>
    <footer className="footer-links border-top py-5"><Container><Row className="g-4"><Col md={4}><Brand /><p className="text-secondary mt-3">© 2026 Acme Console</p><div className="d-flex gap-2"><Button variant="outline-secondary" aria-label="github"><Icon name="github" /></Button><Button variant="outline-secondary" aria-label="globe"><Icon name="globe" /></Button></div></Col>{["产品", "资源", "公司", "支持"].map((title) => <Col xs={6} md key={title}><h2 className="h6">{title}</h2><a className="d-block text-secondary" href="#features">特性</a><a className="d-block text-secondary" href="#pricing">定价</a><a className="d-block text-secondary" href="#faq">帮助中心</a></Col>)}<Col xs={6} md={2}><Form.Select aria-label="语言"><option>简体中文</option><option>English</option></Form.Select></Col></Row></Container></footer>
  </>
}
