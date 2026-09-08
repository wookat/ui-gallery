import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { tokenMs } from "@/lib/media"

type CodeBlockProps = React.ComponentProps<"figure"> & {
  code: string
  /** 语言标签（content chat.code.language） */
  language?: string
  labels: { copy: string; copied: string }
  /** 复制控件形态：chat hifi 为图标按钮（默认），components hifi 为「复制」文字 ghost 按钮 */
  copyAs?: "icon" | "text"
  /** JSX 用法片段的三色着色（components hifi .codeblock pre .k/.s/.a：标签名 primary、属性值 success、注释 fg-muted）；chat 的 CSV / 命令块保持单色 */
  highlight?: "jsx"
}

type Token = { kind: "k" | "s" | "a" | "plain"; text: string }

const TAG_RE = /^<\/?([A-Za-z][\w.]*)/

function closeBrace(code: string, open: number) {
  let depth = 0
  for (let i = open; i < code.length; i++) {
    if (code[i] === "{") depth++
    else if (code[i] === "}" && --depth === 0) return i
  }
  return code.length - 1
}

function endOf(code: string, from: number, ch: string) {
  const j = code.indexOf(ch, from)
  return j === -1 ? code.length - 1 : j
}

/** 无依赖的 JSX 片段分词：`<Tag` / `</Tag` → k；`="…"` / `={…}` → s；`// …` 至行尾 → a；其余原样 */
function tokenizeJsx(code: string): Token[] {
  const out: Token[] = []
  let plain = ""
  const flush = () => {
    if (plain) out.push({ kind: "plain", text: plain })
    plain = ""
  }
  let i = 0
  while (i < code.length) {
    const ch = code[i]
    if (ch === "/" && code[i + 1] === "/") {
      flush()
      const j = endOf(code, i, "\n")
      const end = code[j] === "\n" ? j : j + 1
      out.push({ kind: "a", text: code.slice(i, end) })
      i = end
      continue
    }
    if (ch === "<") {
      const m = TAG_RE.exec(code.slice(i))
      if (m) {
        plain += m[0].slice(0, m[0].length - m[1].length)
        flush()
        out.push({ kind: "k", text: m[1] })
        i += m[0].length
        continue
      }
    }
    if (ch === "=" && (code[i + 1] === '"' || code[i + 1] === "{")) {
      plain += "="
      flush()
      const end = code[i + 1] === '"' ? endOf(code, i + 2, '"') : closeBrace(code, i + 1)
      out.push({ kind: "s", text: code.slice(i + 1, end + 1) })
      i = end + 1
      continue
    }
    if (ch === '"') {
      const end = endOf(code, i + 1, '"')
      plain += code.slice(i, end + 1)
      i = end + 1
      continue
    }
    plain += ch
    i++
  }
  flush()
  return out
}

const TOKEN_CLASS = { k: "text-primary", s: "text-success", a: "text-fg-muted", plain: undefined } as const

/** 代码块：hifi .code —— surface-muted 底、radius.md、mono caption、顶栏语言标签 + 复制按钮（复制后短暂显示勾并播报 copied） */
function CodeBlock({ code, language, labels, copyAs = "icon", highlight, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), tokenMs("--motion-skeleton"))
    return () => window.clearTimeout(id)
  }, [copied])
  return (
    <figure data-slot="code-block" className={cn("relative min-w-0 overflow-hidden rounded-md border bg-surface-muted", className)} {...props}>
      <figcaption className={cn("flex h-hit items-center justify-between border-b", copyAs === "text" ? "pl-4 pr-2" : "pl-3 pr-1")}>
        <span className="font-mono text-role-caption text-fg-muted">{language}</span>
        {copyAs === "text" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              void navigator.clipboard?.writeText(code)
              setCopied(true)
            }}
          >
            {copied ? <CheckIcon className="text-success" /> : null}
            {copied ? labels.copied : labels.copy}
          </Button>
        ) : (
          <IconButton
            label={copied ? labels.copied : labels.copy}
            onClick={() => {
              void navigator.clipboard?.writeText(code)
              setCopied(true)
            }}
          >
            {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
          </IconButton>
        )}
        <span role="status" className="sr-only">
          {copied ? labels.copied : ""}
        </span>
      </figcaption>
      <pre tabIndex={0} className={cn("overflow-x-auto font-mono text-role-code text-fg", copyAs === "text" ? "p-4" : "px-4 py-3")}>
        <code>
          {highlight === "jsx"
            ? tokenizeJsx(code).map((tk, idx) =>
                tk.kind === "plain" ? (
                  <React.Fragment key={idx}>{tk.text}</React.Fragment>
                ) : (
                  <span key={idx} className={TOKEN_CLASS[tk.kind]}>
                    {tk.text}
                  </span>
                ),
              )
            : code}
        </code>
      </pre>
    </figure>
  )
}

export { CodeBlock, type CodeBlockProps }
