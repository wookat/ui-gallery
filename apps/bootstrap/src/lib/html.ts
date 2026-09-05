export function esc(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export const each = <T>(items: readonly T[], fn: (item: T, index: number) => string) => items.map(fn).join("")

export const initials = (name: string) => {
  const parts = name.trim().split(/\s+/)
  const chars = parts.length > 1 ? parts.map((p) => p[0]).slice(0, 2).join("") : name.slice(0, 2)
  return chars.toUpperCase()
}

export const money = (value: number, currency = "CNY") =>
  new Intl.NumberFormat("zh-CN", { style: "currency", currency, maximumFractionDigits: 2 }).format(value)

export const avatar = (name: string, size = 32, cls = "") =>
  `<span class="app-avatar rounded-circle bg-secondary-subtle text-secondary-emphasis d-inline-flex align-items-center justify-content-center fw-semibold flex-shrink-0 ${cls}" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.4)}px" aria-label="${esc(name)}">${esc(initials(name))}</span>`
