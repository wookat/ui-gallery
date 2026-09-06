import * as React from "react"
import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("block text-role-label text-fg select-none peer-disabled:text-fg-muted", className)}
      {...props}
    />
  )
}

export { Label }
