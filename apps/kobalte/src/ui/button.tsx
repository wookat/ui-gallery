import { Button as KobalteButton } from "@kobalte/core/button"
import { splitProps, type ParentProps } from "solid-js"
import { Icon } from "@/icons"

type ButtonProps = ParentProps<{
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive"
  size?: "sm" | "md" | "lg" | "icon"
  loading?: boolean
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  class?: string
  title?: string
  onClick?: (event: MouseEvent) => void
}>

const variants = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
  outline: "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
  ghost: "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
  link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400",
  destructive: "bg-red-600 text-white hover:bg-red-700",
}

const sizes = {
  sm: "h-10 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
  icon: "size-10",
}

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "size", "loading", "class", "children"])
  return (
    <KobalteButton
      {...rest}
      class={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 ${variants[local.variant ?? "primary"]} ${sizes[local.size ?? "md"]} ${local.class ?? ""}`}
      disabled={props.disabled || props.loading}
      aria-busy={props.loading}
    >
      {props.loading ? <Icon name="loader" size={16} class="animate-spin" /> : null}
      {local.children}
    </KobalteButton>
  )
}
