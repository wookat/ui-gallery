import * as React from "react"
import { cn } from "@/lib/cn"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  showLabel: string
  hideLabel: string
  /** 只禁用显隐切换（hifi loading / success：输入框 readonly、眼睛 disabled） */
  toggleDisabled?: boolean
}

/** 密码框：Input + 右侧 size.hit 的显隐切换（hifi .control.has-eye / .eye） */
function PasswordInput({ className, showLabel, hideLabel, disabled, toggleDisabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false)
  return (
    <div data-slot="password-input" className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-hit", className)} disabled={disabled} {...props} />
      <button
        type="button"
        aria-pressed={visible}
        aria-label={visible ? hideLabel : showLabel}
        disabled={disabled || toggleDisabled}
        onClick={() => setVisible((v) => !v)}
        className="absolute top-0 right-0 grid size-hit place-items-center rounded-md text-fg-muted transition-colors duration-(--motion-fast) ease-std hover:not-disabled:text-fg disabled:cursor-not-allowed disabled:text-fg-disabled [&_svg]:size-icon-md"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

export { PasswordInput }
