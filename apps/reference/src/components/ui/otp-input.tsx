import * as React from "react"
import { cn } from "@/lib/cn"

type OTPInputProps = {
  length?: number
  value: string
  onChange: (next: string) => void
  /** 第 n 位的可访问名 */
  cellLabel: (index: number) => string
  disabled?: boolean
  invalid?: boolean
  className?: string
} & Pick<React.ComponentProps<"div">, "aria-labelledby" | "aria-describedby">

/** 验证码：hifi .otp —— length 个 size.hit 宽 × control.lg 高的等宽格，聚焦 primary，错误 danger；自动前进 / Backspace 回退 / 粘贴分发 */
function OTPInput({ length = 6, value, onChange, cellLabel, disabled, invalid, className, ...aria }: OTPInputProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([])
  const chars = Array.from({ length }, (_, i) => value[i] ?? "")
  const focus = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus()
  const setAt = (i: number, ch: string) => {
    const next = chars.slice()
    next[i] = ch
    onChange(next.join(""))
  }
  return (
    <div data-slot="otp-input" role="group" className={cn("flex gap-2", className)} {...aria}>
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={ch}
          disabled={disabled}
          aria-label={cellLabel(i + 1)}
          aria-invalid={invalid || undefined}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "")
            if (v.length > 1) {
              onChange((value.slice(0, i) + v).slice(0, length))
              focus(i + v.length)
              return
            }
            setAt(i, v)
            if (v) focus(i + 1)
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !ch) {
              e.preventDefault()
              setAt(i - 1, "")
              focus(i - 1)
            } else if (e.key === "ArrowLeft") focus(i - 1)
            else if (e.key === "ArrowRight") focus(i + 1)
          }}
          onFocus={(e) => e.target.select()}
          className="h-control-lg w-hit rounded-md border border-border-strong bg-surface text-center font-mono text-role-title text-fg tabular-nums transition-colors duration-(--motion-fast) ease-std focus-visible:border-primary aria-invalid:border-(length:--border-width-accent) aria-invalid:border-danger aria-invalid:focus-visible:outline-danger disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-fg-muted"
        />
      ))}
    </div>
  )
}

export { OTPInput, type OTPInputProps }
