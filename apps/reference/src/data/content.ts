/**
 * 文案层：唯一来源是仓库根 content/*.md 中的表格。
 *   - 表头含 `key` + `文案`：t("login.submit") / t("dashboard.asOf", { time: "今天 17:30" })
 *   - 表头含 `status` + `文案` + `语义色`：orderStatus[status] → { label, tone }
 * 新增屏幕 = 新增 content/<screen>.md，由下方 glob 自动纳入；页面里禁止写死文案。
 * key 规则：md 内已带 `shell.` / `dashboard.` 前缀的原样使用，否则补 `<screen>.` 前缀。
 */
import type { Tone } from "@/components/ui/badge"

const files = import.meta.glob("../../../../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

const table = new Map<string, string>()
export const orderStatus: Record<string, { label: string; tone: Tone }> = {}

const splitRow = (line: string) => line.split("|").slice(1, -1).map((c) => c.trim())
const toneOf = (cell: string): Tone => {
  if (/弱/.test(cell)) return "muted"
  const m = cell.match(/^(info|warning|danger|success|neutral|muted)/)
  return m ? (m[1] as Tone) : "neutral"
}

for (const [path, md] of Object.entries(files)) {
  const screen = path.match(/\/([^/]+)\.md$/)?.[1]
  if (!screen || screen === "README") continue
  let header: string[] | null = null
  for (const line of md.split("\n")) {
    if (!line.startsWith("|")) {
      header = null
      continue
    }
    const cells = splitRow(line)
    if (!header) {
      header = cells
      continue
    }
    if (cells.every((c) => /^-*$/.test(c))) continue
    const textCol = header.indexOf("文案")
    const text = cells[textCol]
    if (textCol < 0 || text === undefined) continue
    const keyCol = header.indexOf("key")
    const statusCol = header.indexOf("status")
    if (keyCol >= 0 && cells[keyCol]) {
      const key = cells[keyCol]
      table.set(/^(shell|dashboard)\./.test(key) ? key : `${screen}.${key}`, text)
    } else if (statusCol >= 0 && cells[statusCol]) {
      orderStatus[cells[statusCol]] = { label: text, tone: toneOf(cells[header.indexOf("语义色")] ?? "") }
    }
  }
}

export function t(key: string, vars: Record<string, string | number> = {}): string {
  const raw = table.get(key)
  if (raw === undefined) {
    if (import.meta.env.DEV) console.warn(`[content] 缺少文案 ${key}`)
    return key
  }
  return raw.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`))
}

export const hasText = (key: string) => table.has(key)
