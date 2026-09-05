import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Card, Classes, Collapse, Divider, Drawer, H1, H2, H3, H4, HTMLSelect, Icon, Navbar, NavbarGroup, NavbarHeading, SegmentedControl, Tag } from "@blueprintjs/core"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import team from "@ui-gallery/spec/mock/team.json"
import { icon } from "@/lib/icons"
import { withParams } from "@/lib/settings"
import { Avatar, money } from "@/pages/shared"

const LINKS = ["产品", "解决方案", "价格", "文档", "博客"]
const LOGOS = ["Northwind", "Contoso", "Fabrikam", "Globex", "Initech", "Umbrella"]

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Card style={{ padding: 0 }}>
      <Button fill minimal alignText="left" large rightIcon={icon(open ? "chevron-up" : "chevron-down")} onClick={() => setOpen(!open)} style={{ padding: "12px 16px" }}>{q}</Button>
      <Collapse isOpen={open}><div className={Classes.TEXT_MUTED} style={{ padding: "0 16px 14px" }}>{a}</div></Collapse>
    </Card>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)
  const [yearly, setYearly] = useState(false)
  const cta = () => navigate(withParams("/login"))
  return (
    <div>
      <Navbar fixedToTop>
        <div className="container row-between" style={{ height: "100%", flexWrap: "nowrap" }}>
          <NavbarGroup align="left"><span className="avatar" style={{ borderRadius: 6, marginRight: 8 }}>A</span><NavbarHeading>Acme Console</NavbarHeading></NavbarGroup>
          <NavbarGroup align="right" className="desktop-only" style={{ float: "none" }}>
            {LINKS.map((l) => <Button key={l} minimal>{l}</Button>)}
            <Button intent="primary" style={{ marginLeft: 8 }} onClick={cta}>{landing.hero.primary}</Button>
          </NavbarGroup>
          <NavbarGroup align="right" className="mobile-only" style={{ float: "none" }}>
            <Button className="mobile-only" intent="primary" onClick={cta} style={{ marginRight: 4 }}>{landing.hero.primary}</Button>
            <Button className="mobile-only" minimal icon={icon("menu")} aria-label="菜单" onClick={() => setMenu(true)} />
          </NavbarGroup>
        </div>
      </Navbar>
      <Drawer isOpen={menu} onClose={() => setMenu(false)} position="right" size="260px" title="菜单">
        <div className="stack-sm" style={{ padding: 12 }}>{LINKS.map((l) => <Button key={l} minimal fill alignText="left">{l}</Button>)}<Button intent="primary" fill onClick={cta}>{landing.hero.primary}</Button></div>
      </Drawer>

      <div style={{ paddingTop: 50 }}>
        <section className="container hero stack" style={{ alignItems: "center" }}>
          <Tag minimal round intent="primary" icon={icon("sparkles", 12)}>全新 AI 助手已上线</Tag>
          <H1 style={{ margin: 0 }}>{landing.hero.title}</H1>
          <p className={Classes.TEXT_LARGE + " muted"} style={{ maxWidth: 620, margin: 0 }}>{landing.hero.subtitle}</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Button large intent="primary" rightIcon={icon("arrow-right")} onClick={cta}>{landing.hero.primary}</Button>
            <Button large outlined icon={icon("play")}>{landing.hero.secondary}</Button>
          </div>
          <div className="row" style={{ justifyContent: "center" }}>
            <span className="avatar-group">{team.slice(0, 5).map((m) => <Avatar key={m.email} name={m.name} size="sm" />)}</span>
            <span className={Classes.TEXT_MUTED}>{landing.hero.social}</span>
          </div>
          <Card elevation={3} className="placeholder" style={{ width: "100%", maxWidth: 960, aspectRatio: "16 / 9", marginTop: 16 }}>
            <span className="row"><Icon icon="dashboard" size={28} /> 产品截图占位</span>
          </Card>
        </section>

        <section className="container section stack">
          <p className={Classes.TEXT_MUTED} style={{ textAlign: "center", margin: 0 }}>受到各类团队信赖</p>
          <div className="logo-cloud">{LOGOS.map((l) => <Card key={l} style={{ padding: 12, fontWeight: 600 }}>{l}</Card>)}</div>
        </section>

        <section className="container section stack">
          <div style={{ textAlign: "center" }}><H2>一个控制台，覆盖全部工作流</H2></div>
          <div className="grid-3">
            {landing.features.map((f) => (
              <Card key={f.title} className="stack-sm"><span className="avatar" style={{ borderRadius: 8 }}>{icon(f.icon === "bar-chart" ? "activity" : f.icon)}</span><H4 style={{ margin: 0 }}>{f.title}</H4><p className={Classes.TEXT_MUTED} style={{ margin: 0 }}>{f.desc}</p></Card>
            ))}
          </div>
        </section>

        <section className="container section stack" style={{ gap: 48 }}>
          {landing.features.slice(0, 3).map((f, i) => (
            <div key={f.title} className={`split ${i % 2 ? "reverse" : ""}`}>
              <div className="stack-sm"><Tag minimal intent="primary">{`0${i + 1}`}</Tag><H3 style={{ margin: 0 }}>{f.title}</H3><p className={Classes.TEXT_LARGE + " muted"} style={{ margin: 0 }}>{f.desc}</p><Button minimal rightIcon={icon("arrow-right")} intent="primary" style={{ alignSelf: "flex-start" }}>了解更多</Button></div>
              <div className="placeholder" style={{ aspectRatio: "4 / 3" }}>{icon(f.icon === "bar-chart" ? "activity" : f.icon, 40)}</div>
            </div>
          ))}
        </section>

        <section className="section" style={{ background: "rgba(45,114,210,0.08)" }}>
          <div className="container numbers">{landing.numbers.map((n) => <div key={n.label}><div style={{ fontSize: 32, fontWeight: 700 }}>{n.value}</div><div className={Classes.TEXT_MUTED}>{n.label}</div></div>)}</div>
        </section>

        <section className="container section stack">
          <div style={{ textAlign: "center" }}><H2>简单透明的价格</H2></div>
          <div className="pricing-toggle"><SegmentedControl value={yearly ? "yearly" : "monthly"} onValueChange={(v) => setYearly(v === "yearly")} options={[{ label: "按月", value: "monthly" }, { label: "按年（省 20%）", value: "yearly" }]} /></div>
          <div className="grid-3">
            {plans.map((p) => (
              <Card key={p.name} className="stack" elevation={p.recommended ? 3 : 1} style={{ position: "relative", borderColor: p.recommended ? "#2d72d2" : undefined }}>
                {p.recommended ? <Tag intent="primary" round style={{ position: "absolute", top: 12, right: 12 }}>推荐</Tag> : null}
                <H3 style={{ margin: 0 }}>{p.name}</H3>
                <div style={{ fontSize: 32, fontWeight: 700 }}>{p.price === null ? "联系我们" : p.price === 0 ? "免费" : money(yearly ? Math.round(p.price * 0.8) : p.price)}<span className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}> / 月</span></div>
                <Divider />
                <div className="stack-sm">{p.features.map((f) => <div key={f} className="row"><Icon icon="tick" intent="success" />{f}</div>)}</div>
                <Button fill large intent={p.recommended ? "primary" : "none"} outlined={!p.recommended} onClick={cta}>{p.price === null ? "联系销售" : p.price === 0 ? "免费开始" : "开始试用"}</Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="container section stack">
          <div style={{ textAlign: "center" }}><H2>用户怎么说</H2></div>
          <div className="grid-3">
            {landing.testimonials.map((t) => <Card key={t.name} className="stack-sm"><div className="row">{[1, 2, 3, 4, 5].map((n) => <Icon key={n} icon="star" intent="warning" size={12} />)}</div><p style={{ margin: 0 }}>“{t.quote}”</p><div className="row"><Avatar name={t.name} size="sm" /><span><strong>{t.name}</strong> <span className={Classes.TEXT_MUTED}>· {t.company}</span></span></div></Card>)}
          </div>
        </section>

        <section className="container section stack" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: "center" }}><H2>常见问题</H2></div>
          {landing.faq.map((f) => <Faq key={f.q} q={f.q} a={f.a} />)}
        </section>

        <section className="container section">
          <Card elevation={2} className="stack" style={{ textAlign: "center", alignItems: "center", background: "#2d72d2", color: "#fff", padding: 48 }}>
            <H2 style={{ color: "#fff", margin: 0 }}>{landing.hero.title}</H2>
            <p style={{ margin: 0, opacity: 0.9 }}>{landing.hero.social}</p>
            <Button large onClick={cta} rightIcon={icon("arrow-right")}>{landing.hero.primary}</Button>
          </Card>
        </section>

        <footer className="container section stack">
          <Divider />
          <div className="footer-grid">
            <div className="stack-sm"><strong>Acme Console</strong><span className={Classes.TEXT_MUTED}>{landing.hero.subtitle}</span><span className="row"><Button minimal icon={icon("github")} aria-label="GitHub" /><Button minimal icon={icon("globe")} aria-label="Website" /><Button minimal icon={icon("mail")} aria-label="Email" /></span></div>
            {[["产品", ["功能", "价格", "更新日志", "路线图"]], ["资源", ["文档", "API", "社区", "状态"]], ["公司", ["关于", "博客", "招聘", "联系我们"]]].map(([title, items]) => (
              <div key={title as string} className="stack-sm footer-links"><strong>{title}</strong>{(items as string[]).map((i) => <a key={i} href="#" onClick={(e) => e.preventDefault()} className={Classes.TEXT_MUTED}>{i}</a>)}</div>
            ))}
          </div>
          <Divider />
          <div className="row-between"><span className={Classes.TEXT_MUTED}>© 2026 Acme Console</span><HTMLSelect minimal defaultValue="zh-CN" options={[{ value: "zh-CN", label: "简体中文" }, { value: "en-US", label: "English" }, { value: "ja-JP", label: "日本語" }]} /></div>
        </footer>
      </div>
    </div>
  )
}
