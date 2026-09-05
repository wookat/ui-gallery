import { useState } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarGroup, Button, Card, Carousel, Collapse, SideSheet, Tag, Typography } from "@douyinfe/semi-ui"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { Icon } from "@/icons"
import { Brand } from "@/layouts/app-shell"
import { useTheme } from "@/theme"

const { Title, Text, Paragraph } = Typography
const logos = ["Northwind", "Contoso", "Globex", "Fabrikam", "Initech", "Umbrella"]
const splits = ["看见全局", "自动化协作", "AI 就在身边"]

export function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = [
    { href: "#features", label: "产品" },
    { href: "#numbers", label: "数据" },
    { href: "#pricing", label: "价格" },
    { href: "#testimonials", label: "评价" },
    { href: "#faq", label: "FAQ" },
  ]
  return (
    <div style={{ background: "var(--semi-color-bg-0)" }}>
      <header className="acme-landing-section" style={{ padding: "12px 24px", borderBottom: "1px solid var(--semi-color-border)", position: "sticky", top: 0, zIndex: 10, background: "var(--semi-color-bg-1)" }}>
        <div className="acme-landing-inner acme-between" style={{ flexWrap: "nowrap" }}>
          <Brand />
          <nav className="acme-row acme-desktop-only" style={{ gap: 20 }}>{links.map((link) => <Typography.Text key={link.href} link={{ href: link.href }}>{link.label}</Typography.Text>)}</nav>
          <div className="acme-row" style={{ flexWrap: "nowrap" }}>
            <Button className="acme-mobile-only" theme="borderless" type="tertiary" icon={<Icon name="menu" />} aria-label="打开菜单" onClick={() => setMobileOpen(true)} />
            <Button theme="borderless" type="tertiary" icon={<Icon name={theme === "dark" ? "sun" : "moon"} />} aria-label="切换主题" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
            <Link to="/login"><Button theme="borderless" type="tertiary" className="acme-desktop-only">登录</Button></Link>
            <Link to="/login"><Button theme="solid">开始使用</Button></Link>
          </div>
        </div>
      </header>
      <SideSheet title="导航" placement="right" width={260} visible={mobileOpen} onCancel={() => setMobileOpen(false)}>
        <div className="acme-page" style={{ gap: 8 }}>
          {links.map((link) => <Typography.Text key={link.href} link={{ href: link.href }} onClick={() => setMobileOpen(false)}>{link.label}</Typography.Text>)}
          <Link to="/login" onClick={() => setMobileOpen(false)}><Button theme="solid" block>登录</Button></Link>
        </div>
      </SideSheet>
      <main>
        <section className="acme-landing-section">
          <div className="acme-landing-inner acme-split">
            <div className="acme-page" style={{ gap: 20 }}>
              <Tag color="blue" type="light">ACME CONSOLE · 2026</Tag>
              <Title heading={1} style={{ fontSize: "clamp(32px, 6vw, 60px)", lineHeight: 1.1, margin: 0 }}>{landing.hero.title}</Title>
              <Paragraph type="secondary" style={{ fontSize: 18, maxWidth: 520 }}>{landing.hero.subtitle}</Paragraph>
              <div className="acme-row"><Link to="/login"><Button theme="solid" size="large">{landing.hero.primary} <Icon name="arrow-right" /></Button></Link><Button size="large">{landing.hero.secondary}</Button></div>
              <div className="acme-row"><AvatarGroup size="small">{["林", "王", "A", "M"].map((name) => <Avatar key={name} color="light-blue">{name}</Avatar>)}</AvatarGroup><Text type="tertiary">{landing.hero.social}</Text></div>
            </div>
            <Card bodyStyle={{ padding: 12 }}><div className="acme-hero-shot"><div className="acme-hero-side" /><div className="acme-page" style={{ gap: 12 }}><div className="acme-hero-block" style={{ flex: 1 }} /><div className="acme-grid-3 acme-grid" style={{ gap: 12, height: 60 }}><div className="acme-hero-block" /><div className="acme-hero-block" /><div className="acme-hero-block" /></div></div></div></Card>
          </div>
        </section>
        <section style={{ borderTop: "1px solid var(--semi-color-border)", borderBottom: "1px solid var(--semi-color-border)", background: "var(--semi-color-fill-0)", padding: "24px 16px" }}>
          <div className="acme-landing-inner acme-logo-cloud">{logos.map((name) => <Text key={name} type="tertiary" strong>{name}</Text>)}</div>
        </section>
        <section id="features" className="acme-landing-section">
          <div className="acme-landing-inner acme-page">
            <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}><Text type="tertiary">为团队打造</Text><Title heading={2}>一个地方，完成所有工作</Title><Text type="secondary">从数据到决策，让每一步都更清晰。</Text></div>
            <div className="acme-grid-3 acme-grid">{landing.features.map((item) => <Card key={item.title} bodyStyle={{ padding: 20 }}><div className="acme-brand-mark" style={{ background: "var(--semi-color-fill-0)", color: "var(--semi-color-text-0)", width: 40, height: 40, marginBottom: 12 }}><Icon name={item.icon} size={20} /></div><Title heading={5} style={{ margin: "0 0 6px" }}>{item.title}</Title><Text type="secondary">{item.desc}</Text></Card>)}</div>
          </div>
        </section>
        <section className="acme-landing-section" style={{ paddingTop: 0 }}>
          <div className="acme-landing-inner acme-page" style={{ gap: 48 }}>
            {splits.map((title, index) => (
              <div className="acme-split" key={title}>
                <div style={{ order: index % 2 ? 2 : 1 }}><Tag>0{index + 1} / WORKSPACE</Tag><Title heading={2} style={{ marginTop: 12 }}>{title}</Title><Paragraph type="secondary">把分散的信息汇聚为有用的洞察，让团队快速行动并持续交付。</Paragraph><Button theme="borderless" style={{ paddingLeft: 0 }}>了解更多 <Icon name="arrow-right" /></Button></div>
                <Card style={{ order: index % 2 ? 1 : 2 }} bodyStyle={{ padding: 12 }}><div className="acme-demo-box" style={{ aspectRatio: "1.5", display: "grid", placeItems: "center", background: "var(--semi-color-fill-0)", borderRadius: 8 }}><Icon name={landing.features[index + 1].icon} size={52} /></div></Card>
              </div>
            ))}
          </div>
        </section>
        <section id="numbers" style={{ borderTop: "1px solid var(--semi-color-border)", borderBottom: "1px solid var(--semi-color-border)", padding: "40px 16px" }}>
          <div className="acme-landing-inner acme-grid-4 acme-grid" style={{ textAlign: "center" }}>{landing.numbers.map((item) => <div key={item.label}><Title heading={2} style={{ margin: 0 }}>{item.value}</Title><Text type="tertiary">{item.label}</Text></div>)}</div>
        </section>
        <section id="pricing" className="acme-landing-section">
          <div className="acme-landing-inner acme-page">
            <div style={{ textAlign: "center" }}><Title heading={2}>选择适合你的方案</Title><Text type="secondary">简单透明，随时升级。</Text></div>
            <div className="acme-grid-3 acme-grid">{plans.map((plan) => <Card key={plan.name} style={plan.recommended ? { borderColor: "var(--semi-color-primary)" } : undefined} title={<div className="acme-between"><span>{plan.name}</span>{plan.recommended ? <Tag color="blue" type="solid">最受欢迎</Tag> : null}</div>}><Title heading={2} style={{ margin: "0 0 12px" }}>{plan.price === null ? "定制" : plan.price === 0 ? "免费" : `¥${plan.price}`}{plan.price ? <Text type="tertiary" size="normal"> / 月</Text> : null}</Title><Text type="secondary" style={{ display: "block", marginBottom: 16 }}>{plan.features.join(" · ")}</Text><Button block theme={plan.recommended ? "solid" : "light"}>开始使用</Button></Card>)}</div>
          </div>
        </section>
        <section id="testimonials" className="acme-landing-section" style={{ paddingTop: 0 }}>
          <div className="acme-landing-inner acme-page" style={{ maxWidth: 800 }}>
            <Title heading={2} style={{ textAlign: "center" }}>他们已经在改变工作方式</Title>
            <Carousel style={{ height: 200, borderRadius: 12 }} theme="primary" autoPlay={{ interval: 4000 }} showIndicator arrowType="hover" indicatorType="dot">
              {landing.testimonials.map((item) => <div key={item.name} style={{ height: "100%", display: "grid", placeItems: "center", padding: "24px 56px", background: "var(--semi-color-bg-1)", border: "1px solid var(--semi-color-border)", textAlign: "center" }}><div><Text style={{ fontSize: 18 }}>“{item.quote}”</Text><div className="acme-row" style={{ justifyContent: "center", marginTop: 16 }}><Avatar size="small" color="light-blue">{item.name.slice(0, 1)}</Avatar><Text type="secondary">{item.name} · {item.company}</Text></div></div></div>)}
            </Carousel>
          </div>
        </section>
        <section id="faq" className="acme-landing-section" style={{ paddingTop: 0 }}>
          <div className="acme-landing-inner acme-page" style={{ maxWidth: 720 }}>
            <Title heading={2} style={{ textAlign: "center" }}>常见问题</Title>
            <Collapse accordion>{landing.faq.map((item) => <Collapse.Panel key={item.q} header={item.q} itemKey={item.q}><Text type="secondary">{item.a}</Text></Collapse.Panel>)}</Collapse>
          </div>
        </section>
        <section className="acme-landing-section" style={{ paddingTop: 0 }}>
          <div className="acme-landing-inner"><Card bodyStyle={{ padding: 40, textAlign: "center" }}><Title heading={2}>准备好开始了吗？</Title><Text type="secondary">{landing.hero.social}</Text><div className="acme-row" style={{ justifyContent: "center", marginTop: 20 }}><Link to="/login"><Button theme="solid" size="large">{landing.hero.primary}</Button></Link><Button theme="light" size="large">{landing.hero.secondary}</Button></div></Card></div>
        </section>
      </main>
      <footer style={{ borderTop: "1px solid var(--semi-color-border)", padding: "24px 16px" }}>
        <div className="acme-landing-inner acme-between"><Text type="tertiary">© 2026 Acme Console</Text><div className="acme-row" style={{ gap: 16 }}>{links.map((link) => <Typography.Text key={link.href} link={{ href: link.href }}>{link.label}</Typography.Text>)}</div></div>
      </footer>
    </div>
  )
}
