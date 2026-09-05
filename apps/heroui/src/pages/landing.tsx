import { useNavigate } from "react-router-dom"
import { Accordion, Avatar, Button, Card, Chip, Separator } from "@heroui/react"
import { Icon } from "@/components/icon"
import landing from "@ui-gallery/spec/mock/landing.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import series from "@ui-gallery/spec/mock/series.json"
import stats from "@ui-gallery/spec/mock/stats.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import { StatusBadge } from "./shared"
import { Brand } from "@/layouts/app-shell"

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Brand />
          <nav className="hidden gap-6 text-sm text-muted md:flex"><a href="#features">功能</a><a href="#pricing">定价</a><a href="#faq">常见问题</a></nav>
          <div className="flex gap-2"><Button variant="ghost" size="sm" onPress={() => navigate("/login")}>登录</Button><Button size="sm" onPress={() => navigate("/login")}>{landing.hero.primary}</Button></div>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <Chip variant="soft" color="accent" className="mb-4">{landing.hero.social}</Chip>
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{landing.hero.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{landing.hero.subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Button size="lg" onPress={() => navigate("/login")}>{landing.hero.primary}<Icon name="arrow-right" size={16} /></Button><Button size="lg" variant="secondary" onPress={() => navigate("/")}>{landing.hero.secondary}</Button></div>
        <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-surface-secondary shadow-xl" aria-label="产品截图占位" role="img">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-danger/70" /><span className="size-2.5 rounded-full bg-warning/70" /><span className="size-2.5 rounded-full bg-success/70" />
            <span className="ml-3 rounded-md bg-surface px-3 py-0.5 text-xs text-muted">acme.dev/console</span>
          </div>
          <div className="grid text-left md:grid-cols-[160px_minmax(0,1fr)]">
            <div className="hidden flex-col gap-1 border-r border-border p-3 md:flex">
              {["仪表盘", "订单", "客户", "报表", "AI 助手", "设置"].map((item, index) => (
                <span key={item} className={`rounded-md px-3 py-1.5 text-xs ${index === 0 ? "bg-surface font-medium" : "text-muted"}`}>{item}</span>
              ))}
            </div>
            <div className="grid min-w-0 gap-3 p-3 sm:p-4">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map((item) => (
                  <div key={item.key} className="rounded-xl bg-surface p-3">
                    <p className="truncate text-xs text-muted">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold">{item.unit === "CNY" ? "¥" : ""}{item.value.toLocaleString()}</p>
                    <p className={`text-xs ${item.delta >= 0 ? "text-success" : "text-danger"}`}>{item.delta >= 0 ? "+" : ""}{item.delta}%</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <div className="rounded-xl bg-surface p-3">
                  <p className="text-xs text-muted">收入趋势</p>
                  <div className="mt-3 flex h-28 items-end gap-2">
                    {series.revenue.map((value, index) => (
                      <div key={series.months[index]} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                        <div className="w-full rounded-t-md bg-accent/80" style={{ height: `${(value / Math.max(...series.revenue)) * 100}%` }} />
                        <span className="text-[10px] text-muted">{series.months[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden rounded-xl bg-surface p-3 sm:block">
                  <p className="text-xs text-muted">最近订单</p>
                  <ul className="mt-2 divide-y divide-border text-xs">
                    {orders.slice(0, 4).map((order) => (
                      <li key={order.id} className="flex items-center justify-between gap-2 py-1.5"><span className="truncate">{order.id} · {order.customer}</span><StatusBadge value={order.status} /></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-semibold">一切功能，一个控制台</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landing.features.map((feature) => (
            <Card key={feature.title}>
              <Card.Header>
                <div className="mb-2 grid size-10 place-items-center rounded-lg bg-accent-soft text-accent-soft-foreground"><Icon name={feature.icon} size={20} /></div>
                <Card.Title>{feature.title}</Card.Title>
                <Card.Description>{feature.desc}</Card.Description>
              </Card.Header>
            </Card>
          ))}
        </div>
      </section>
      <section className="border-y border-border bg-surface-secondary">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {landing.numbers.map((item) => <div key={item.label} className="text-center"><p className="text-4xl font-semibold">{item.value}</p><p className="mt-1 text-sm text-muted">{item.label}</p></div>)}
        </div>
      </section>
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-semibold">简单透明的定价</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.recommended ? "border-accent shadow-lg" : undefined}>
              <Card.Header>
                <div className="flex items-center justify-between"><Card.Title>{plan.name}</Card.Title>{plan.recommended ? <Chip color="accent" size="sm">推荐</Chip> : null}</div>
                <p className="text-3xl font-semibold">{plan.price === null ? "定制" : plan.price === 0 ? "¥0" : `¥${plan.price}`}<span className="text-sm font-normal text-muted">{plan.price ? " /月" : ""}</span></p>
              </Card.Header>
              <Card.Content><ul className="space-y-2 text-sm">{plan.features.map((f) => <li key={f} className="flex items-center gap-2"><Icon name="check" size={14} />{f}</li>)}</ul></Card.Content>
              <Card.Footer><Button fullWidth variant={plan.recommended ? "primary" : "secondary"}>{plan.price === null ? "联系销售" : "开始使用"}</Button></Card.Footer>
            </Card>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-semibold">客户怎么说</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landing.testimonials.map((item) => (
            <Card key={item.name} className="min-w-0">
              <Card.Content className="space-y-4">
                <p className="text-sm">“{item.quote}”</p>
                <div className="flex items-center gap-3"><Avatar size="sm"><Avatar.Fallback>{item.name.slice(0, 1)}</Avatar.Fallback></Avatar><div><p className="text-sm font-medium">{item.name}</p><p className="text-xs text-muted">{item.company}</p></div></div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>
      <section id="faq" className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-3xl font-semibold">常见问题</h2>
        <Accordion className="mt-8">
          {landing.faq.map((item, index) => (
            <Accordion.Item key={item.q} id={`faq-${index}`}>
              <Accordion.Heading><Accordion.Trigger>{item.q}<Accordion.Indicator /></Accordion.Trigger></Accordion.Heading>
              <Accordion.Panel><Accordion.Body>{item.a}</Accordion.Body></Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl bg-accent px-6 py-14 text-center text-accent-foreground">
          <h2 className="text-3xl font-semibold">{landing.hero.title}</h2>
          <p className="mt-2 opacity-90">{landing.hero.subtitle}</p>
          <Button className="mt-6" variant="secondary" size="lg" onPress={() => navigate("/login")}>{landing.hero.primary}</Button>
        </div>
      </section>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <Brand />
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <p>© 2026 Acme Console · HeroUI 参考实现</p>
        </div>
      </footer>
    </div>
  )
}
