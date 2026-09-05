export function money(value: number, currency = "CNY"): string {
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency, maximumFractionDigits: 2 }).format(value)
}

export function number(value: number): string {
  return new Intl.NumberFormat("zh-CN").format(value)
}

export function initials(name: string): string {
  return name.trim().split(/\s+/).map((s) => s[0]).join("").slice(0, 2).toUpperCase()
}
