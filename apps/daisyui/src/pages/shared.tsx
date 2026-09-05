import type { ReactNode } from "react"
import { Icon } from "@ui-gallery/icons-react"

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-base-content/60">ACME CONSOLE</p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-base-content/60">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function SectionCard({ title, description, children, className = "" }: { title: string; description?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`card min-w-0 max-w-full border border-base-300 bg-base-100 ${className}`}>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {description ? <p className="text-sm text-base-content/60">{description}</p> : null}
        <div className="mt-4">{children}</div>
      </div>
    </section>
  )
}

export function StatusBadge({ value }: { value: string }) {
  const tone = ["paid", "shipped", "active"].includes(value)
    ? "badge-success"
    : ["pending", "due"].includes(value)
      ? "badge-warning"
      : "badge-error"
  return <span className={`badge ${tone}`}>{value}</span>
}

export function Avatar({ name, className = "" }: { name: string; className?: string }) {
  return <div className={`avatar avatar-placeholder ${className}`}><div className="w-8 rounded-full bg-base-300 text-sm"><span>{name.slice(0, 1)}</span></div></div>
}

export function IconButton({ name, label, className = "", onClick }: { name: string; label?: string; className?: string; onClick?: () => void }) {
  return <button className={`btn btn-ghost btn-square ${className}`} aria-label={label ?? name} onClick={onClick}><Icon name={name} size={16} /></button>
}
