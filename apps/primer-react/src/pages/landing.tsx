import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import team from "@ui-gallery/spec/mock/team.json"
import { Avatar, AvatarStack, Button, Details, Dialog, Heading, IconButton, Label, Select, Text, ToggleSwitch, useDetails } from "@primer/react"
import { Icon, iconFor } from "@/lib/icon"
import { avatarFor } from "@/lib/avatar"

const navLinks = [
  { href: "#features", label: "产品" },
  { href: "#solutions", label: "解决方案" },
  { href: "#pricing", label: "价格" },
  { href: "#testimonials", label: "客户" },
  { href: "#faq", label: "FAQ" },
]
const logos = ["Northwind", "Contoso", "Globex", "Fabrikam", "Initech", "Umbrella"]
const footerColumns = [
  { title: "产品", links: ["功能", "价格", "更新日志", "路线图"] },
  { title: "解决方案", links: ["电商", "SaaS", "企业", "创业团队"] },
  { title: "资源", links: ["文档", "API", "帮助中心", "状态页"] },
  { title: "公司", links: ["关于我们", "博客", "招聘", "联系我们"] },
]

function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const { getDetailsProps, open } = useDetails({ defaultOpen })
  return (
    <Details {...getDetailsProps()} className="faq-item">
      <Details.Summary className="faq-summary"><span>{q}</span><Icon name={open ? "chevron-up" : "chevron-down"} /></Details.Summary>
      <Text as="p" className="muted faq-answer">{a}</Text>
    </Details>
  )
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [yearly, setYearly] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link className="brand flex items-center gap-2" to="/"><span className="brand-mark">A</span>Acme Console</Link>
          <nav className="desktop-only-flex landing-links" aria-label="主导航">
            {navLinks.map((l) => <a key={l.href} href={l.href} className="landing-link">{l.label}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <Button className="desktop-only-flex" variant="invisible" as={Link} to="/login">登录</Button>
            <Button variant="primary" as={Link} to="/login">开始使用</Button>
            <IconButton ref={menuButton} className="mobile-only" size="large" aria-label="打开菜单" icon={iconFor("menu")} onClick={() => setMenuOpen(true)} />
          </div>
        </div>
      </header>
      {menuOpen ? (
        <Dialog title="菜单" position="right" width="small" returnFocusRef={menuButton} onClose={() => setMenuOpen(false)}>
          <nav className="stack-3" aria-label="移动端导航">
            {navLinks.map((l) => <a key={l.href} href={l.href} className="landing-link mobile-link" onClick={() => setMenuOpen(false)}>{l.label}</a>)}
            <Button block as={Link} to="/login">登录</Button>
            <Button block variant="primary" as={Link} to="/login">开始使用</Button>
          </nav>
        </Dialog>
      ) : null}

      <main>
        <section className="hero">
          <div className="hero-grid">
            <div className="stack-4">
              <div><Label variant="accent" size="large">ACME CONSOLE · 2026</Label></div>
              <Heading as="h1">{landing.hero.title}</Heading>
              <Text as="p" className="muted hero-subtitle">{landing.hero.subtitle}</Text>
              <div className="flex wrap gap-2">
                <Button size="large" variant="primary" as={Link} to="/login" trailingVisual={iconFor("arrow-right")}>{landing.hero.primary}</Button>
                <Button size="large" leadingVisual={iconFor("play")}>{landing.hero.secondary}</Button>
              </div>
              <div className="flex items-center gap-3 muted">
                <AvatarStack>{team.slice(0, 4).map((m) => <Avatar key={m.email} src={avatarFor(m.name)} alt={m.name} size={28} />)}</AvatarStack>
                <Text size="small">{landing.hero.social}</Text>
              </div>
            </div>
            <div className="card hero-mock" aria-hidden="true">
              <div className="hero-mock-bar"><span /><span /><span /></div>
              <div className="hero-mock-body">
                <div className="hero-mock-side"><span /><span /><span /><span /></div>
                <div className="stack-3">
                  <div className="grid grid-3"><div className="card mock-stat" /><div className="card mock-stat" /><div className="card mock-stat" /></div>
                  <div className="card mock-chart"><span style={{ height: "40%" }} /><span style={{ height: "60%" }} /><span style={{ height: "50%" }} /><span style={{ height: "80%" }} /><span style={{ height: "70%" }} /><span style={{ height: "95%" }} /></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="logo-row" aria-label="客户 Logo">
          {logos.map((name) => <span key={name} className="logo-placeholder"><Icon name="organization" size={16} />{name}</span>)}
        </section>

        <section id="features" className="landing-section stack-5">
          <div className="section-title">
            <Text className="eyebrow">为团队打造</Text>
            <Heading as="h2">一个地方，完成所有工作</Heading>
            <Text className="muted">从数据到决策，让每一步都更清晰。</Text>
          </div>
          <div className="grid grid-3">
            {landing.features.map((item) => (
              <section className="card stack-3 feature-card" key={item.title}>
                <div className="brand-mark"><Icon name={item.icon} /></div>
                <Heading as="h3" style={{ fontSize: 18 }}>{item.title}</Heading>
                <Text className="muted">{item.desc}</Text>
              </section>
            ))}
          </div>
        </section>

        <section id="solutions" className="landing-section stack-5">
          {["看见全局", "自动化协作", "AI 就在身边"].map((title, index) => (
            <div className={`grid grid-2 items-center split-feature${index % 2 ? " reverse" : ""}`} key={title}>
              <div className="stack-3">
                <div><Label>0{index + 1} / WORKSPACE</Label></div>
                <Heading as="h2" style={{ fontSize: 28 }}>{title}</Heading>
                <Text as="p" className="muted" style={{ margin: 0 }}>{landing.features[index + 3]?.desc ?? landing.features[index].desc}</Text>
                <ul className="check-list">{landing.features.slice(index, index + 3).map((f) => <li key={f.title}><Icon name="check-circle-fill" size={14} />{f.title}</li>)}</ul>
                <div><Button variant="link" trailingVisual={iconFor("arrow-right")}>了解更多</Button></div>
              </div>
              <div className="feature-visual"><Icon name={landing.features[index + 1].icon} size={56} /></div>
            </div>
          ))}
        </section>

        <section className="stat-row" aria-label="关键数据">
          {landing.numbers.map((item) => <div key={item.label}><Heading as="h2" style={{ fontSize: 36 }}>{item.value}</Heading><Text className="muted">{item.label}</Text></div>)}
        </section>

        <section id="pricing" className="landing-section stack-5">
          <div className="section-title">
            <Heading as="h2">选择适合你的方案</Heading>
            <Text className="muted">简单透明，随时升级。</Text>
            <div className="flex items-center justify-center gap-2" style={{ marginTop: 16 }}>
              <Text id="pricing-cycle" weight={yearly ? "normal" : "semibold"}>按月</Text>
              <ToggleSwitch aria-labelledby="pricing-cycle" checked={yearly} onChange={setYearly} size="small" />
              <Text weight={yearly ? "semibold" : "normal"}>按年</Text>
              <Label variant="success">省 20%</Label>
            </div>
          </div>
          <div className="grid grid-3 pricing-grid">
            {plans.map((plan) => (
              <section className={`card stack-3 plan-card${plan.recommended ? " selected" : ""}`} key={plan.name}>
                <div className="flex items-center justify-between gap-2"><Heading as="h3" style={{ fontSize: 18 }}>{plan.name}</Heading>{plan.recommended ? <Label variant="accent">最受欢迎</Label> : null}</div>
                <div className="flex items-end gap-1">
                  <Text as="p" weight="semibold" style={{ fontSize: 36, margin: 0, lineHeight: 1.1 }}>{plan.price === null ? "定制" : plan.price === 0 ? "免费" : `¥${yearly ? Math.round(plan.price * 12 * 0.8) : plan.price}`}</Text>
                  {plan.price ? <Text className="muted">{yearly ? "/年" : "/月"}</Text> : null}
                </div>
                <ul className="check-list">{plan.features.map((f) => <li key={f}><Icon name="check" size={14} />{f}</li>)}</ul>
                <Button variant={plan.recommended ? "primary" : "default"} block as={Link} to="/login">{plan.price === null ? "联系销售" : "开始使用"}</Button>
              </section>
            ))}
          </div>
        </section>

        <section id="testimonials" className="landing-section stack-5">
          <div className="section-title"><Heading as="h2">他们已经在改变工作方式</Heading></div>
          <div className="grid grid-3">
            {landing.testimonials.map((item) => (
              <section className="card stack-3" key={item.name}>
                <div className="flex gap-1" aria-label="5 星评价">{[1, 2, 3, 4, 5].map((n) => <Icon key={n} name="star-fill" size={14} className="star active" />)}</div>
                <Text as="p" style={{ margin: 0 }}>“{item.quote}”</Text>
                <div className="flex items-center gap-2"><Avatar src={avatarFor(item.name)} alt="" size={32} /><div><Text as="div" weight="semibold">{item.name}</Text><Text as="div" className="muted" size="small">{item.company}</Text></div></div>
              </section>
            ))}
          </div>
        </section>

        <section id="faq" className="landing-section stack-4 faq-section">
          <div className="section-title"><Heading as="h2">常见问题</Heading></div>
          <div className="faq-list">{landing.faq.map((item, i) => <FaqItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0} />)}</div>
        </section>

        <section className="cta-banner">
          <Heading as="h2">准备好让团队更高效了吗？</Heading>
          <Text as="p">从今天开始，把工作放进一个控制台。</Text>
          <Button size="large" as={Link} to="/login" trailingVisual={iconFor("arrow-right")}>免费开始</Button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="stack-3">
            <Link className="brand flex items-center gap-2" to="/"><span className="brand-mark">A</span>Acme Console</Link>
            <Text className="muted" size="small">{landing.hero.subtitle}</Text>
            <div className="flex gap-1">
              <IconButton size="large" variant="invisible" aria-label="GitHub" icon={iconFor("mark-github")} />
              <IconButton size="large" variant="invisible" aria-label="社区" icon={iconFor("message-square")} />
              <IconButton size="large" variant="invisible" aria-label="视频" icon={iconFor("video")} />
              <IconButton size="large" variant="invisible" aria-label="邮件" icon={iconFor("mail")} />
            </div>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title} className="stack-2">
              <Text weight="semibold">{col.title}</Text>
              {col.links.map((l) => <a key={l} href="#" className="footer-link">{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <Text className="muted" size="small">© 2026 Acme Console · 本页为演示页面</Text>
          <Select aria-label="语言" size="small" defaultValue="zh-CN">
            <Select.Option value="zh-CN">简体中文</Select.Option>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="ja">日本語</Select.Option>
          </Select>
        </div>
      </footer>
    </div>
  )
}
