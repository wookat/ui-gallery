import * as React from "react"
import { cn } from "@/lib/cn"
import { SearchIcon } from "lucide-react"

import { Kbd } from "@/components/ui/kbd"

type SearchInputProps = React.ComponentProps<"input"> & {
  shortcut?: string
}

/** 顶栏搜索：hifi .search —— surface-muted 槽、hover 出 hairline、focus-within 转 surface */
function SearchInput({ className, shortcut, ...props }: SearchInputProps) {
  return (
    <div
      data-slot="search"
      className={cn(
        "flex h-control-md w-popover items-center gap-2 rounded-md bg-surface-muted px-3 text-fg-muted shadow-[inset_0_0_0_var(--border-width-hairline)_transparent] transition-[box-shadow,background-color] duration-(--motion-fast) ease-std hover:shadow-[inset_0_0_0_var(--border-width-hairline)_var(--color-role-border)] focus-within:bg-surface focus-within:text-fg",
        className,
      )}
    >
      <SearchIcon aria-hidden className="size-icon-md shrink-0" />
      <input
        type="search"
        className="min-w-0 flex-1 self-stretch truncate rounded-sm border-0 bg-transparent text-role-body text-fg outline-offset-0 placeholder:text-fg-muted"
        {...props}
      />
      {shortcut ? <Kbd aria-hidden>{shortcut}</Kbd> : null}
    </div>
  )
}

export { SearchInput }
