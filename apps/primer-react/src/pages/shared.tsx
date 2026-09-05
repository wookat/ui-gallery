import type { ReactNode } from "react"
import { CounterLabel, Heading, Label, Text } from "@primer/react"
import { Blankslate } from "@primer/react/experimental"

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">ACME CONSOLE</p>
        <Heading as="h1" style={{ fontSize: 32, margin: 0 }}>{title}</Heading>
        {description ? <Text as="p" className="muted" style={{ marginTop: 4 }}>{description}</Text> : null}
      </div>
      {action}
    </div>
  )
}

export function SectionCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="card">
      <div className="card-header">
        <Heading as="h2" className="card-title">{title}</Heading>
        {description ? <Text as="p" className="muted" style={{ margin: 0 }}>{description}</Text> : null}
      </div>
      {children}
    </section>
  )
}

export function StatusBadge({ value }: { value: string }) {
  const variant = ["paid", "shipped", "active"].includes(value) ? "success" : ["pending", "due"].includes(value) ? "attention" : "danger"
  return <Label variant={variant}>{value}</Label>
}

export function Count({ children }: { children: ReactNode }) {
  return <CounterLabel>{children}</CounterLabel>
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <Blankslate border size="small">{children}</Blankslate>
}
