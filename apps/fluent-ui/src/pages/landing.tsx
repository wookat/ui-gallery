import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Body1,
  Button,
  Caption1,
  Card,
  Display,
  Divider,
  Hamburger,
  LargeTitle,
  Link,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Subtitle1,
  Subtitle2,
  Switch,
  Text,
  Title1,
  Title3,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from "@fluentui/react-components"
import { Icon } from "@/lib/icon"
import { Brand } from "@/layouts/app-shell"
import { useThemeMode } from "@/lib/theme"
import { useControlSize, useIsMobile, useLayoutStyles } from "./shared"

const useStyles = makeStyles({
  root: { minHeight: "100vh", backgroundColor: tokens.colorNeutralBackground1, color: tokens.colorNeutralForeground1 },
  nav: { position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacingHorizontalM, padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`, borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, backgroundColor: tokens.colorNeutralBackground1 },
  navLinks: { display: "flex", gap: tokens.spacingHorizontalL, "@media (max-width: 767px)": { display: "none" } },
  section: { maxWidth: "1120px", margin: "0 auto", padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalL}`, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalXL },
  hero: { textAlign: "center", alignItems: "center", gap: tokens.spacingVerticalL },
  heroTitle: { maxWidth: "960px", "@media (max-width: 767px)": { fontSize: tokens.fontSizeHero800, lineHeight: tokens.lineHeightHero800 } },
  ctaRow: { display: "flex", gap: tokens.spacingHorizontalS, flexWrap: "wrap", justifyContent: "center" },
  shot: { width: "100%", aspectRatio: "16 / 9", borderRadius: tokens.borderRadiusXLarge, border: `1px solid ${tokens.colorNeutralStroke2}`, backgroundColor: tokens.colorNeutralBackground3, display: "grid", placeItems: "center", color: tokens.colorNeutralForeground3, boxShadow: tokens.shadow16 },
  logos: { display: "flex", gap: tokens.spacingHorizontalXL, flexWrap: "wrap", justifyContent: "center", opacity: 0.7 },
  logo: { display: "flex", alignItems: "center", gap: tokens.spacingHorizontalXS, fontWeight: tokens.fontWeightSemibold },
  features: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" },
  feature: { padding: tokens.spacingHorizontalL, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS },
  featureIcon: { width: "40px", height: "40px", borderRadius: tokens.borderRadiusMedium, display: "grid", placeItems: "center", backgroundColor: tokens.colorBrandBackground2, color: tokens.colorBrandForeground2 },
  split: { display: "grid", gap: tokens.spacingHorizontalXL, alignItems: "center", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" },
  band: { backgroundColor: tokens.colorBrandBackground, color: tokens.colorNeutralForegroundOnBrand },
  numbers: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", textAlign: "center" },
  pricing: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", alignItems: "stretch" },
  plan: { padding: tokens.spacingHorizontalL, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM },
  planHot: { ...shorthands.borderColor(tokens.colorBrandStroke1), boxShadow: `0 0 0 1px ${tokens.colorBrandStroke1}` },
  quotes: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" },
  quote: { padding: tokens.spacingHorizontalL, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM },
  footer: { borderTop: `1px solid ${tokens.colorNeutralStroke2}`, color: tokens.colorNeutralForeground3 },
  footerGrid: { display: "grid", gap: tokens.spacingHorizontalL, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))" },
  col: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalXS },
  center: { textAlign: "center" },
})

const companies = landing.testimonials.map((t) => t.company)

export function LandingPage() {
  const s = useStyles()
  const l = useLayoutStyles()
  const isMobile = useIsMobile()
  const ctl = useControlSize()
  const { mode, setMode } = useThemeMode()
  const [yearly, setYearly] = useState(false)
  const search = typeof window === "undefined" ? "" : window.location.search

  return (
    <div className={s.root}>
      <header className={s.nav}>
        <Brand />
        <nav className={s.navLinks} aria-label="主导航">
          {["产品", "价格", "文档", "博客"].map((item) => <Link key={item} href="#" appearance="subtle">{item}</Link>)}
        </nav>
        <div className={l.row}>
          {isMobile ? <Menu positioning="below-end"><MenuTrigger disableButtonEnhancement><Hamburger size="large" aria-label="打开菜单" /></MenuTrigger><MenuPopover><MenuList>{["产品", "价格", "文档", "博客"].map((item) => <MenuItem key={item}>{item}</MenuItem>)}</MenuList></MenuPopover></Menu> : null}
          <Button appearance="subtle" size={ctl} icon={<Icon name={mode === "dark" ? "sun" : "moon"} />} aria-label="切换主题" onClick={() => setMode(mode === "dark" ? "light" : "dark")} />
          {!isMobile ? <RouterLink to={`/login${search}`} style={{ textDecoration: "none" }}><Button appearance="secondary" size={ctl}>登录</Button></RouterLink> : null}
          <RouterLink to={`/${search}`} style={{ textDecoration: "none" }}><Button appearance="primary" size={ctl}>{landing.hero.primary}</Button></RouterLink>
        </div>
      </header>

      <section className={mergeClasses(s.section, s.hero)}>
        <Badge appearance="tint" color="brand" size="large">Acme Console 2.0 现已发布</Badge>
        <div className={l.stackS} style={{ alignItems: "center" }}>
          <Display as="h1" className={s.heroTitle}>{landing.hero.title}</Display>
          <Subtitle1 as="p" className={l.muted} style={{ maxWidth: 620 }}>{landing.hero.subtitle}</Subtitle1>
        </div>
        <div className={s.ctaRow}>
          <RouterLink to={`/${search}`} style={{ textDecoration: "none" }}><Button appearance="primary" size="large" iconPosition="after" icon={<Icon name="arrow-right" />}>{landing.hero.primary}</Button></RouterLink>
          <Button size="large" icon={<Icon name="play" />}>{landing.hero.secondary}</Button>
        </div>
        <Caption1 className={l.muted}>{landing.hero.social}</Caption1>
        <div className={s.shot}><Icon name="layout-dashboard" size={48} /></div>
        <div className={s.logos}>{companies.map((c) => <span key={c} className={s.logo}><Icon name="box" size={18} />{c}</span>)}</div>
      </section>

      <Divider />

      <section className={s.section}>
        <div className={s.center}><Title1 as="h2">为什么选择 Acme Console</Title1><Body1 className={l.muted} block>一套工具，覆盖从订单到洞察的全部流程。</Body1></div>
        <div className={s.features}>
          {landing.features.map((f) => (
            <Card key={f.title} className={s.feature}>
              <span className={s.featureIcon}><Icon name={f.icon} size={20} /></span>
              <Subtitle2>{f.title}</Subtitle2>
              <Body1 className={l.muted}>{f.desc}</Body1>
            </Card>
          ))}
        </div>
      </section>

      <section className={s.section}>
        {landing.features.slice(0, 2).map((f, index) => (
          <div className={s.split} key={f.title} style={{ direction: index % 2 ? "rtl" : "ltr" }}>
            <div className={s.shot} style={{ aspectRatio: "4 / 3", direction: "ltr" }}><Icon name={f.icon} size={40} /></div>
            <div className={l.stackM} style={{ direction: "ltr" }}>
              <Badge appearance="outline">{f.title}</Badge>
              <Title3 as="h3">{f.title}</Title3>
              <Body1 className={l.muted}>{f.desc}</Body1>
              <Link href="#">了解更多 →</Link>
            </div>
          </div>
        ))}
      </section>

      <section className={s.band}>
        <div className={mergeClasses(s.section, s.numbers)}>
          {landing.numbers.map((n) => <div key={n.label}><LargeTitle as="p">{n.value}</LargeTitle><Body1>{n.label}</Body1></div>)}
        </div>
      </section>

      <section className={s.section} id="pricing">
        <div className={s.center}><Title1 as="h2">简单透明的价格</Title1></div>
        <div className={s.ctaRow}><Text>按月</Text><Switch checked={yearly} onChange={(_, d) => setYearly(d.checked)} aria-label="按年计费" /><Text>按年</Text><Badge appearance="tint" color="success">省 20%</Badge></div>
        <div className={s.pricing}>
          {plans.map((p) => (
            <Card key={p.name} className={mergeClasses(s.plan, p.recommended ? s.planHot : "")}>
              <div className={l.rowBetween}><Subtitle2>{p.name}</Subtitle2>{p.recommended ? <Badge appearance="filled" color="brand">推荐</Badge> : null}</div>
              <Title1>{p.price === null ? "联系我们" : p.price === 0 ? "免费" : `¥${yearly ? Math.round(p.price * 0.8) : p.price}`}<Caption1 className={l.muted}>{p.price ? " /月" : ""}</Caption1></Title1>
              <div className={l.stackS}>{p.features.map((f) => <div className={l.row} key={f}><Icon name="check" size={16} /><Body1>{f}</Body1></div>)}</div>
              <Button appearance={p.recommended ? "primary" : "outline"} style={{ marginTop: "auto" }}>{p.price === null ? "联系销售" : "开始使用"}</Button>
            </Card>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.center}><Title1 as="h2">客户怎么说</Title1></div>
        <div className={s.quotes}>
          {landing.testimonials.map((t) => (
            <Card key={t.name} className={s.quote}>
              <div className={l.row}>{Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" size={14} />)}</div>
              <Body1>“{t.quote}”</Body1>
              <div className={l.row}><Avatar name={t.name} color="colorful" size={32} /><div><Text weight="semibold" block>{t.name}</Text><Caption1 className={l.muted}>{t.company}</Caption1></div></div>
            </Card>
          ))}
        </div>
      </section>

      <section className={s.section} style={{ maxWidth: 760 }}>
        <div className={s.center}><Title1 as="h2">常见问题</Title1></div>
        <Accordion collapsible defaultOpenItems={["0"]}>
          {landing.faq.map((item, index) => (
            <AccordionItem key={item.q} value={String(index)}>
              <AccordionHeader>{item.q}</AccordionHeader>
              <AccordionPanel><Body1 className={l.muted}>{item.a}</Body1></AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className={s.section}>
        <Card className={mergeClasses(s.plan, s.center)} style={{ alignItems: "center", backgroundColor: tokens.colorNeutralBackground3 }}>
          <Title1 as="h2">准备好开始了吗？</Title1>
          <Body1 className={l.muted}>{landing.hero.social}</Body1>
          <div className={s.ctaRow}>
            <RouterLink to={`/${search}`} style={{ textDecoration: "none" }}><Button appearance="primary" size="large">{landing.hero.primary}</Button></RouterLink>
            <Button size="large">{landing.hero.secondary}</Button>
          </div>
        </Card>
      </section>

      <footer className={s.footer}>
        <div className={mergeClasses(s.section, s.footerGrid)}>
          <div className={s.col}><Brand /><Caption1>{landing.hero.subtitle}</Caption1></div>
          {[["产品", ["功能", "价格", "更新日志", "路线图"]], ["资源", ["文档", "API", "状态", "社区"]], ["公司", ["关于", "博客", "招聘", "联系"]]].map(([title, items]) => (
            <div className={s.col} key={String(title)}>
              <Text weight="semibold">{title}</Text>
              {(items as string[]).map((item) => <Link key={item} href="#" appearance="subtle">{item}</Link>)}
            </div>
          ))}
        </div>
        <Divider />
        <div className={s.section} style={{ paddingTop: tokens.spacingVerticalM, paddingBottom: tokens.spacingVerticalM, flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: tokens.spacingHorizontalM }}>
          <Caption1>© 2026 Acme Console · Fluent UI React v9 Gallery</Caption1>
          <div className={l.row}><Icon name="github" size={18} /><Icon name="twitter" size={18} /><Icon name="mail" size={18} /></div>
        </div>
      </footer>
    </div>
  )
}
