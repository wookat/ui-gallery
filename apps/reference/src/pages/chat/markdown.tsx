import * as React from "react"
import { cn } from "@/lib/cn"

import { CodeBlock } from "@/components/composed/code-block"
import { t } from "@/data/content"

/** 与 hifi `inline()` 同规则：**加粗** + 单据号（AA-000000[-0]）mono 高亮 */
const REF_ID = /\b([A-Z]{2,}-\d{6,}(?:-\d+)?)\b/g

function refIds(s: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of s.matchAll(REF_ID)) {
    if (m.index > last) out.push(s.slice(last, m.index))
    out.push(
      <span key={`${key}-r${i++}`} className="font-mono text-sm whitespace-nowrap tabular-nums">
        {m[1]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < s.length) out.push(s.slice(last))
  return out
}

function inline(s: string, key: string): React.ReactNode[] {
  const parts = s.split(/\*\*(.+?)\*\*/g)
  return parts.flatMap((p, i): React.ReactNode[] => (i % 2 ? [<strong key={`${key}-b${i}`}>{refIds(p, `${key}-b${i}`)}</strong>] : refIds(p, `${key}-${i}`)))
}

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; lines: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "table"; head: string[]; align: ("left" | "right")[]; rows: string[][] }

function parse(md: string): Block[] {
  const lines = md.split("\n")
  const out: Block[] = []
  let i = 0
  const splitRow = (l: string) =>
    l
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim())
  while (i < lines.length) {
    const l = lines[i]
    if (!l.trim()) {
      i++
      continue
    }
    if (l.startsWith("```")) {
      const lang = l.slice(3).trim()
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++])
      i++
      out.push({ type: "code", lang, code: buf.join("\n") })
      continue
    }
    if (l.startsWith("|")) {
      const rows: string[] = []
      while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++])
      const head = splitRow(rows[0])
      const align = splitRow(rows[1] ?? "").map((c) => (/:$/.test(c) ? "right" : "left") as "left" | "right")
      out.push({ type: "table", head, align, rows: rows.slice(2).map(splitRow) })
      continue
    }
    if (/^- /.test(l)) {
      const items: string[] = []
      while (i < lines.length && /^- /.test(lines[i])) items.push(lines[i++].slice(2))
      out.push({ type: "ul", items })
      continue
    }
    if (/^> ?/.test(l)) {
      const q: string[] = []
      while (i < lines.length && /^> ?/.test(lines[i])) q.push(lines[i++].replace(/^> ?/, ""))
      out.push({ type: "quote", lines: q })
      continue
    }
    const p: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(```|\||- |> ?)/.test(lines[i])) p.push(lines[i++])
    out.push({ type: "p", text: p.join(" ") })
  }
  return out
}

/** hifi .md-table：hairline 圆角容器、横向滚动（tabindex）；≤768 溢出时下方显示滑动提示 */
function MdTable({ block }: { block: Extract<Block, { type: "table" }> }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setScrollable(el.scrollWidth > el.clientWidth + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <>
      <div ref={ref} tabIndex={scrollable ? 0 : undefined} role="region" aria-label={t("chat.markdown.table.aria")} className="max-w-full overflow-x-auto rounded-md border">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {block.head.map((h, ci) => (
                <th key={ci} className={cn("h-table-header border-b bg-surface-muted px-3 py-2 text-left text-role-caption font-medium whitespace-nowrap text-fg-muted", block.align[ci] === "right" && "text-right")}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((r, ri) => (
              <tr key={ri} className="hover:[&_td]:bg-bg">
                {r.map((c, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "h-table-row-compact border-b px-3 py-2 align-middle whitespace-nowrap [tr:last-child_&]:border-b-0",
                      block.align[ci] === "right" && "text-right tabular-nums",
                      ci === 0 && "font-mono text-sm",
                    )}
                  >
                    {inline(c, `t${ri}-${ci}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {scrollable ? <p className="-mt-1 text-role-caption text-fg-muted">{t("chat.markdown.table.scrollHint")}</p> : null}
    </>
  )
}

type MarkdownProps = React.ComponentProps<"div"> & {
  source: string
  /** 追加到末段落尾部（流式光标） */
  trailing?: React.ReactNode
}

/** 助理正文 Markdown（hifi .md 子集：段落 / 加粗 / 无序列表 / 引用 / 表格 / 代码块） */
function Markdown({ source, trailing, className, ...props }: MarkdownProps) {
  const blocks = React.useMemo(() => parse(source), [source])
  const lastP = blocks.length && blocks[blocks.length - 1].type === "p" ? blocks.length - 1 : -1
  return (
    <div data-slot="markdown" className={cn("flex min-w-0 flex-col gap-3 text-role-body text-fg [&_strong]:font-semibold", className)} {...props}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="wrap-anywhere">
                {inline(b.text, `p${i}`)}
                {i === lastP ? trailing : null}
              </p>
            )
          case "ul":
            return (
              <ul key={i} className="flex list-disc flex-col gap-1 pl-5">
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it, `l${i}-${j}`)}</li>
                ))}
              </ul>
            )
          case "quote":
            return (
              <blockquote key={i} className="border-l-(length:--border-width-accent) border-primary py-1 pl-4 text-fg-muted">
                <p>
                  {b.lines.map((ln, j) => (
                    <React.Fragment key={j}>
                      {j ? <br /> : null}
                      {inline(ln, `q${i}-${j}`)}
                    </React.Fragment>
                  ))}
                </p>
              </blockquote>
            )
          case "code":
            return <CodeBlock key={i} code={b.code} language={t("chat.code.language", { lang: b.lang })} labels={{ copy: t("chat.code.copy"), copied: t("chat.code.copied") }} className="w-full" />
          case "table":
            return <MdTable key={i} block={b} />
        }
      })}
      {lastP < 0 ? trailing : null}
    </div>
  )
}

/** 纯文本中的单据编号（SO-/PO-…）整体不折行，mono */
const withRefIds = (text: string) => refIds(text, "t")

export { Markdown, REF_ID, withRefIds }
