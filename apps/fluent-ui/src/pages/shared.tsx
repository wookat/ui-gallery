import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react"
import type * as React from "react"
import { Badge, Body1, Caption1, Card, CardHeader, Divider, Subtitle1, Text, Title2, makeStyles, tokens } from "@fluentui/react-components"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return isMobile
}

export function useControlSize(): "medium" | "large" {
  return useIsMobile() ? "large" : "medium"
}

export function useElementWidth(): [React.RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(160)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const update = () => setWidth(Math.max(1, Math.round(element.getBoundingClientRect().width)))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}

export const useLayoutStyles = makeStyles({
  stack: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalL, minWidth: 0 },
  stackS: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS, minWidth: 0 },
  stackM: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalM, minWidth: 0 },
  row: { display: "flex", alignItems: "center", gap: tokens.spacingHorizontalS, flexWrap: "wrap", minWidth: 0 },
  rowBetween: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacingHorizontalM, flexWrap: "wrap", minWidth: 0 },
  grid2: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" },
  grid3: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" },
  grid4: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))" },
  muted: { color: tokens.colorNeutralForeground3 },
  scrollX: { overflowX: "auto", maxWidth: "100%" },
  fullWidth: { width: "100%" },
  card: { padding: tokens.spacingHorizontalL },
  tabTouch: { minWidth: "48px", justifyContent: "center" },
})

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactElement }) {
  const s = useLayoutStyles()
  return (
    <div className={s.rowBetween}>
      <div className={s.stackS} style={{ gap: tokens.spacingVerticalXXS }}>
        <Caption1 className={s.muted} style={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>Acme Console</Caption1>
        <Title2 as="h1">{title}</Title2>
        {description ? <Body1 className={s.muted}>{description}</Body1> : null}
      </div>
      {action}
    </div>
  )
}

export function SectionCard({ title, description, action, children, style }: { title: string; description?: string; action?: ReactElement; children: ReactNode; style?: React.CSSProperties }) {
  const s = useLayoutStyles()
  return (
    <Card className={s.card} style={style}>
      <CardHeader header={<Subtitle1 as="h2">{title}</Subtitle1>} description={description ? <Caption1 className={s.muted}>{description}</Caption1> : undefined} action={action} />
      {children}
    </Card>
  )
}

const statusColor: Record<string, "success" | "warning" | "danger" | "informative" | "brand"> = {
  paid: "success",
  shipped: "brand",
  active: "success",
  pending: "warning",
  due: "warning",
  refunded: "danger",
  cancelled: "danger",
  failed: "danger",
}

export function StatusBadge({ value }: { value: string }) {
  return <Badge appearance="tint" color={statusColor[value] ?? "informative"}>{value}</Badge>
}

export function SectionDivider({ label }: { label: string }) {
  return <Divider>{label}</Divider>
}

export function Money({ value }: { value: number }) {
  return <Text font="numeric">¥{value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
}
