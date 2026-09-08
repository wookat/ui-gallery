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
}

/** 代码块：hifi .code —— surface-muted 底、radius.md、mono caption、顶栏语言标签 + 复制按钮（复制后短暂显示勾并播报 copied） */
function CodeBlock({ code, language, labels, copyAs = "icon", className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), tokenMs("--motion-skeleton"))
    return () => window.clearTimeout(id)
  }, [copied])
  return (
    <figure data-slot="code-block" className={cn("relative min-w-0 overflow-hidden rounded-md border bg-surface-muted", className)} {...props}>
      <figcaption className={cn("flex h-hit items-center justify-between border-b pl-3", copyAs === "text" && "pr-1")}>
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
      <pre tabIndex={0} className="overflow-x-auto p-3 font-mono text-role-caption leading-body text-fg">
        <code>{code}</code>
      </pre>
    </figure>
  )
}

export { CodeBlock, type CodeBlockProps }
