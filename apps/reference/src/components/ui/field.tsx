import * as React from "react"
import { cn } from "@/lib/cn"
import { CircleAlertIcon } from "lucide-react"

import { Label } from "@/components/ui/label"

/** 表单字段：Label（上）+ 控件 + 行内错误（hifi .field / .err）；错误文案用 aria-describedby 关联 */
function Field({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field" className={cn("grid gap-2", className)} {...props} />
}

function FieldLabel(props: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" {...props} />
}

function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  if (!children) return null
  return (
    <p
      role="alert"
      data-slot="field-error"
      className={cn("flex items-start gap-1 text-role-caption text-danger [&_svg]:mt-px [&_svg]:size-icon-sm [&_svg]:shrink-0", className)}
      {...props}
    >
      <CircleAlertIcon aria-hidden />
      <span>{children}</span>
    </p>
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="field-description" className={cn("text-role-caption text-fg-muted", className)} {...props} />
}

export { Field, FieldLabel, FieldError, FieldDescription }
