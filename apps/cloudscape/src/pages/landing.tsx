import { useState } from "react"
import Badge from "@cloudscape-design/components/badge"
import Box from "@cloudscape-design/components/box"
import Button from "@cloudscape-design/components/button"
import ButtonDropdown from "@cloudscape-design/components/button-dropdown"
import Cards from "@cloudscape-design/components/cards"
import ColumnLayout from "@cloudscape-design/components/column-layout"
import Container from "@cloudscape-design/components/container"
import ExpandableSection from "@cloudscape-design/components/expandable-section"
import Grid from "@cloudscape-design/components/grid"
import Header from "@cloudscape-design/components/header"
import Link from "@cloudscape-design/components/link"
import Select, { type SelectProps } from "@cloudscape-design/components/select"
import SpaceBetween from "@cloudscape-design/components/space-between"
import StatusIndicator from "@cloudscape-design/components/status-indicator"
import Toggle from "@cloudscape-design/components/toggle"
import TopNavigation from "@cloudscape-design/components/top-navigation"

import landing from "@ui-gallery/spec/mock/landing.json"
import nav from "@ui-gallery/spec/mock/nav.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import team from "@ui-gallery/spec/mock/team.json"

import { APP_TITLE } from "@/layouts/app-shell"
import { AppIcon, iconProps } from "@/lib/icons"
import { useAppNav } from "@/lib/nav"
import { isDarkFromUrl, toggleThemeInUrl } from "@/lib/settings"
import { money, PersonAvatar } from "./shared"

type Testimonial = (typeof landing.testimonials)[number]

const SECTIONS = [
  { id: "features", label: "功能" },
  { id: "product", label: "产品" },
  { id: "pricing", label: "定价" },
  { id: "testimonials", label: "客户" },
  { id: "faq", label: "FAQ" },
]
const LANGS: SelectProps.Option[] = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en-US", label: "English" },
]
const FOOTER_COLUMNS: { title: string; links: string[] }[] = [
  { title: "产品", links: nav.slice(0, 4).map((n) => n.label) },
  { title: "资源", links: nav.slice(4).map((n) => n.label) },
  { title: "公司", links: SECTIONS.slice(0, 3).map((s) => s.label) },
  { title: "支持", links: SECTIONS.slice(3).map((s) => s.label) },
]

function Section({ id, title, subtitle, children }: { id: string; title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="gallery-hidden-anchor">
      <Box padding={{ vertical: "xxl", horizontal: "l" }}>
        <SpaceBetween size="xl">
          {title && (
            <Box textAlign="center">
              <Header variant="h1" description={subtitle}>
                {title}
              </Header>
            </Box>
          )}
          {children}
        </SpaceBetween>
      </Box>
    </section>
  )
}

export function LandingPage() {
  const { href, follow, go } = useAppNav()
  const [yearly, setYearly] = useState(false)
  const [lang, setLang] = useState(LANGS[0])
  const [dark, setDark] = useState(isDarkFromUrl())

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <div>
      <div className="gallery-landing-nav">
        <TopNavigation
          identity={{
            href: href("/landing"),
            title: APP_TITLE,
            onFollow: (e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            },
          }}
          utilities={[
            ...SECTIONS.map((s) => ({
              type: "button" as const,
              text: s.label,
              onClick: () => jump(s.id),
            })),
            {
              type: "button",
              ...iconProps(dark ? "sun" : "moon"),
              ariaLabel: "切换主题",
              onClick: () => {
                toggleThemeInUrl()
                setDark((d) => !d)
              },
            },
            { type: "button", text: "登录", href: href("/login"), onFollow: follow },
            { type: "button", variant: "primary-button", text: landing.hero.primary, onClick: () => go("/login") },
          ]}
          i18nStrings={{ overflowMenuTriggerText: "菜单", overflowMenuTitleText: "导航" }}
        />
      </div>

      <div className="gallery-hero awsui-context-content-header">
        <Box padding={{ vertical: "xxxl", horizontal: "l" }}>
          <Grid gridDefinition={[{ colspan: { default: 12, m: 6 } }, { colspan: { default: 12, m: 6 } }]}>
            <SpaceBetween size="l">
              <Badge color="blue">{APP_TITLE} · 2026</Badge>
              <Box variant="h1" fontSize="display-l" fontWeight="bold">
                {landing.hero.title}
              </Box>
              <Box fontSize="heading-m">
                {landing.hero.subtitle}
              </Box>
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="primary" onClick={() => go("/login")} iconAlign="right" {...iconProps("arrow-right")}>
                  {landing.hero.primary}
                </Button>
                <Button onClick={() => jump("product")}>{landing.hero.secondary}</Button>
              </SpaceBetween>
              <SpaceBetween direction="horizontal" size="s" alignItems="center">
                <span className="gallery-avatar-stack">
                  {team.slice(0, 4).map((m) => (
                    <PersonAvatar key={m.email} name={m.name} size="small" />
                  ))}
                </span>
                <Box>{landing.hero.social}</Box>
              </SpaceBetween>
            </SpaceBetween>
            <Container>
              <div className="gallery-aspect-video" aria-label="产品截图占位" role="img">
                <AppIcon name="layout-dashboard" size="large" />
              </div>
            </Container>
          </Grid>
        </Box>
      </div>

      <Section id="logos">
        <ColumnLayout columns={4} minColumnWidth={120}>
          {landing.testimonials.map((t) => (
            <Box key={t.company} textAlign="center" color="text-body-secondary" fontWeight="bold" fontSize="heading-s">
              {t.company}
            </Box>
          ))}
        </ColumnLayout>
      </Section>

      <Section id="features" title="一个地方，完成所有工作" subtitle="从数据到决策，让每一步都更清晰">
        <Cards
          items={landing.features}
          trackBy="title"
          cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 900, cards: 3 }]}
          cardDefinition={{
            header: (f) => (
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <AppIcon name={f.icon} size="medium" />
                <span>{f.title}</span>
              </SpaceBetween>
            ),
            sections: [{ id: "desc", content: (f) => f.desc }],
          }}
        />
      </Section>

      <Section id="product">
        <SpaceBetween size="xxl">
          {landing.features.slice(0, 3).map((f, i) => (
            <Grid key={f.title} gridDefinition={[{ colspan: { default: 12, s: 6 }, push: { s: i % 2 ? 6 : 0 } }, { colspan: { default: 12, s: 6 }, pull: { s: i % 2 ? 6 : 0 } }]}>
              <SpaceBetween size="s">
                <Badge>0{i + 1}</Badge>
                <Header variant="h2">{f.title}</Header>
                <Box color="text-body-secondary">{f.desc}</Box>
                <Link href="#features" onFollow={(e) => { e.preventDefault(); jump("features") }}>
                  了解更多
                </Link>
              </SpaceBetween>
              <Container>
                <div className="gallery-aspect-video" role="img" aria-label={`${f.title} 示意`}>
                  <AppIcon name={f.icon} size="large" />
                </div>
              </Container>
            </Grid>
          ))}
        </SpaceBetween>
      </Section>

      <div className="gallery-hero awsui-context-content-header">
        <Box padding={{ vertical: "xxl", horizontal: "l" }}>
          <ColumnLayout columns={4} minColumnWidth={140}>
            {landing.numbers.map((n) => (
              <Box key={n.label} textAlign="center">
                <Box variant="awsui-value-large">
                  {n.value}
                </Box>
                <Box>{n.label}</Box>
              </Box>
            ))}
          </ColumnLayout>
        </Box>
      </div>

      <Section id="pricing" title="定价" subtitle="按需选择，随时升级">
        <Box textAlign="center">
          <Toggle checked={yearly} onChange={({ detail }) => setYearly(detail.checked)}>
            按年付费（省 20%）
          </Toggle>
        </Box>
        <Cards
          items={plans}
          trackBy="name"
          cardsPerRow={[{ cards: 1 }, { minWidth: 700, cards: 3 }]}
          cardDefinition={{
            header: (p) => (
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <span>{p.name}</span>
                {p.recommended && <Badge color="green">推荐</Badge>}
              </SpaceBetween>
            ),
            sections: [
              {
                id: "price",
                content: (p) => (
                  <Box variant="awsui-value-large">
                    {p.price === null ? "定制" : `${money(yearly ? Math.round(p.price * 12 * 0.8) : p.price)}/${yearly ? "年" : "月"}`}
                  </Box>
                ),
              },
              {
                id: "features",
                content: (p) => (
                  <SpaceBetween size="xxs">
                    {p.features.map((f) => (
                      <StatusIndicator key={f} type="success">
                        {f}
                      </StatusIndicator>
                    ))}
                  </SpaceBetween>
                ),
              },
              { id: "cta", content: (p) => <Button variant={p.recommended ? "primary" : "normal"} fullWidth onClick={() => go("/login")}>{p.price === null ? "联系销售" : landing.hero.primary}</Button> },
            ],
          }}
        />
      </Section>

      <Section id="testimonials" title="他们已经在改变工作方式">
        <Cards<Testimonial>
          items={landing.testimonials}
          trackBy="name"
          cardsPerRow={[{ cards: 1 }, { minWidth: 600, cards: 2 }, { minWidth: 900, cards: 3 }]}
          cardDefinition={{
            sections: [
              { id: "quote", content: (t) => <Box fontSize="heading-s">“{t.quote}”</Box> },
              {
                id: "who",
                content: (t) => (
                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    <PersonAvatar name={t.name} />
                    <div>
                      <Box variant="strong">{t.name}</Box>
                      <Box variant="small" color="text-body-secondary">
                        {t.company}
                      </Box>
                    </div>
                  </SpaceBetween>
                ),
              },
            ],
          }}
        />
      </Section>

      <Section id="faq" title="常见问题">
        <Grid gridDefinition={[{ colspan: { default: 12, s: 8 }, offset: { s: 2 } }]}>
          <Container>
            {landing.faq.map((item, i) => (
              <ExpandableSection key={item.q} headerText={item.q} defaultExpanded={i === 0} variant="footer">
                {item.a}
              </ExpandableSection>
            ))}
          </Container>
        </Grid>
      </Section>

      <Section id="cta">
        <div className="gallery-hero awsui-context-content-header" style={{ borderRadius: 16 }}>
          <Box padding="xxl" textAlign="center">
            <SpaceBetween size="m" alignItems="center">
              <Box variant="h2">
                {landing.hero.title}
              </Box>
              <Box>{landing.hero.social}</Box>
              <Button variant="primary" onClick={() => go("/login")}>
                {landing.hero.primary}
              </Button>
            </SpaceBetween>
          </Box>
        </div>
      </Section>

      <footer>
        <Box padding={{ vertical: "xl", horizontal: "l" }}>
          <SpaceBetween size="l">
            <ColumnLayout columns={4} minColumnWidth={140}>
              {FOOTER_COLUMNS.map((col) => (
                <SpaceBetween key={col.title} size="xs">
                  <Box variant="strong">{col.title}</Box>
                  {col.links.map((l) => (
                    <Link key={l} href="#" variant="secondary" onFollow={(e) => e.preventDefault()}>
                      {l}
                    </Link>
                  ))}
                </SpaceBetween>
              ))}
            </ColumnLayout>
            <Grid gridDefinition={[{ colspan: { default: 12, s: 4 } }, { colspan: { default: 12, s: 4 } }, { colspan: { default: 12, s: 4 } }]}>
              <Box color="text-body-secondary">© 2026 {APP_TITLE}</Box>
              <SpaceBetween direction="horizontal" size="xs">
                {["globe", "message-circle", "link"].map((n) => (
                  <Button key={n} variant="icon" {...iconProps(n)} ariaLabel={n} />
                ))}
                <ButtonDropdown variant="icon" ariaLabel="更多" items={SECTIONS.map((s) => ({ id: s.id, text: s.label }))} onItemClick={({ detail }) => jump(detail.id)} />
              </SpaceBetween>
              <Select selectedOption={lang} onChange={({ detail }) => setLang(detail.selectedOption)} options={LANGS} ariaLabel="语言" />
            </Grid>
          </SpaceBetween>
        </Box>
      </footer>
    </div>
  )
}
