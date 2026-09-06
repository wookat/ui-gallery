import { useState } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarGroup, Button, Card, Collapse, Col, Drawer, Menu, Row, Select, Space, Switch, Tag, Typography } from "tdesign-react"
import { useIsMobile } from "@/url-settings"
import { Icon } from "@/components/icon"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"

export function LandingPage() {
  return <div>
    <LayoutHeader />
    <main>
      <section className="landing-section landing-hero"><div className="stack"><Tag theme="primary">ACME CONSOLE · 2026</Tag><Typography.Title level="h1">{landing.hero.title}</Typography.Title><Typography.Paragraph>{landing.hero.subtitle}</Typography.Paragraph><Space><Link to="/login"><Button theme="primary" size="large">{landing.hero.primary} <Icon name="arrow-right" /></Button></Link><Button variant="outline" size="large">{landing.hero.secondary}</Button></Space><div className="inline"><AvatarGroup max={3}><Avatar>林</Avatar><Avatar>王</Avatar><Avatar>A</Avatar><Avatar>M</Avatar></AvatarGroup><Typography.Text>{landing.hero.social}</Typography.Text></div></div><Card><ProductShot label="产品截图" /></Card></section>
      <section className="landing-section" style={{ paddingTop: 24 }}><div className="grid-three">{["Northwind", "Contoso", "Globex", "Fabrikam", "Initech", "Umbrella"].map((name) => <Typography.Text key={name} style={{ textAlign: "center", color: "var(--td-text-color-secondary)" }}>{name}</Typography.Text>)}</div></section>
      <section id="features" className="landing-section"><div className="page-heading"><div><Typography.Title level="h2">一个地方，完成所有工作</Typography.Title><Typography.Paragraph>从数据到决策，让每一步都更清晰。</Typography.Paragraph></div></div><div className="grid-three">{landing.features.map((item) => <Card key={item.title}><div className="stack"><Tag shape="round"><Icon name={item.icon} /></Tag><Typography.Title level="h4">{item.title}</Typography.Title><Typography.Paragraph>{item.desc}</Typography.Paragraph></div></Card>)}</div></section>
      <section className="landing-section"><div className="stack">{["看见全局", "自动化协作", "AI 就在身边"].map((title, index) => <Row gutter={[32, 24]} align="middle" key={title}><Col xs={24} md={12}><Card><ProductShot label={title} /></Card></Col><Col xs={24} md={12}><div className="stack"><Tag>0{index + 1} / WORKSPACE</Tag><Typography.Title level="h2">{title}</Typography.Title><Typography.Paragraph>{landing.features[index + 1].desc} 汇聚有用的洞察，让团队快速行动并持续交付。</Typography.Paragraph><Button variant="text">了解更多 <Icon name="arrow-right" /></Button></div></Col></Row>)}</div></section>
      <section className="landing-section"><div className="grid-four">{landing.numbers.map((item) => <div style={{ textAlign: "center" }} key={item.label}><Typography.Title level="h2">{item.value}</Typography.Title><Typography.Text>{item.label}</Typography.Text></div>)}</div></section>
      <section id="pricing" className="landing-section"><div className="page-heading"><div><Typography.Title level="h2">选择适合你的方案</Typography.Title><Typography.Paragraph>简单透明，随时升级。</Typography.Paragraph></div><Switch label={["月", "年"]} /></div><div className="grid-three">{plans.map((plan) => <Card key={plan.name} title={<div className="inline" style={{ justifyContent: "space-between" }}><span>{plan.name}</span>{plan.recommended && <Tag theme="primary">推荐</Tag>}</div>} bordered><Typography.Title level="h2">{plan.price === null ? "定制" : plan.price === 0 ? "免费" : `¥${plan.price}`}<Typography.Text> / 月</Typography.Text></Typography.Title><div className="stack">{plan.features.map((feature) => <Typography.Text key={feature}><Icon name="check" /> {feature}</Typography.Text>)}</div><Button block theme={plan.recommended ? "primary" : "default"} style={{ marginTop: 20 }}>开始使用</Button></Card>)}</div></section>
      <section className="landing-section"><Typography.Title level="h2">他们已经在改变工作方式</Typography.Title><div className="landing-testimonials">{landing.testimonials.map((item) => <Card key={item.name}><Typography.Paragraph>“{item.quote}”</Typography.Paragraph><Typography.Text>{item.name} · {item.company}</Typography.Text></Card>)}</div></section>
      <section id="faq" className="landing-section"><Typography.Title level="h2">常见问题</Typography.Title><Collapse>{landing.faq.map((item) => <Collapse.Panel key={item.q} header={item.q} value={item.q}>{item.a}</Collapse.Panel>)}</Collapse></section>
      <section className="landing-section"><Card theme="poster1"><div className="stack"><Typography.Title level="h2">准备好让团队更高效了吗？</Typography.Title><Typography.Paragraph>从今天开始，把工作放进一个控制台。</Typography.Paragraph><Link to="/login"><Button theme="primary">免费开始</Button></Link></div></Card></section>
    </main>
    <footer className="landing-section" style={{ paddingTop: 24, paddingBottom: 24 }}><div className="grid-four"><div><Typography.Title level="h4">Acme Console</Typography.Title><Typography.Text>© 2026 Acme Console</Typography.Text><div className="inline"><Button shape="circle" icon={<Icon name="github" />} /><Button shape="circle" icon={<Icon name="globe" />} /></div></div>{["产品", "资源", "公司", "社交"].map((title) => <div className="stack" key={title}><Typography.Text strong>{title}</Typography.Text><Link to="/dashboard">概览</Link><Link to="/components">组件</Link><Link to="/settings">设置</Link></div>)}<Select options={[{ label: "简体中文", value: "zh-CN" }]} defaultValue="zh-CN" /></div></footer>
  </div>
}

function ProductShot({ label }: { label: string }) {
  return <div className="landing-shot" role="img" aria-label={label}><span /><span /><span /></div>
}

const landingLinks = [{ href: "#features", label: "产品" }, { href: "#pricing", label: "价格" }, { href: "#faq", label: "帮助中心" }]

function LayoutHeader() {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  return (
    <header className="landing-header" style={{ position: "sticky", top: 0, zIndex: 2 }}>
      <Link className="app-brand" to="/landing"><span className="app-brand-mark">A</span><span>Acme Console</span></Link>
      <div className="landing-header-spacer" />
      <Menu.HeadMenu className="desktop-only" value="features">{landingLinks.map((item) => <Menu.MenuItem key={item.href} value={item.href.slice(1)}><a href={item.href}>{item.label}</a></Menu.MenuItem>)}</Menu.HeadMenu>
      <Link to="/login"><Button theme="primary">免费开始</Button></Link>
      <Button className="mobile-only" variant="text" shape="square" size="large" aria-label="打开菜单" onClick={() => setOpen(true)}><Icon name="list" /></Button>
      <Drawer visible={isMobile && open} placement="right" size="280px" header="Acme Console" footer={false} onClose={() => setOpen(false)}>
        <Menu value="features" onChange={() => setOpen(false)}>{landingLinks.map((item) => <Menu.MenuItem key={item.href} value={item.href.slice(1)}><a href={item.href}>{item.label}</a></Menu.MenuItem>)}</Menu>
        <Link to="/login" style={{ display: "block", marginTop: 16 }}><Button block theme="primary">免费开始</Button></Link>
      </Drawer>
    </header>
  )
}
