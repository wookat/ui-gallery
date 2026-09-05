import { Toast, toaster } from "@kobalte/core/toast"

function makeToast(title: string, description: string | undefined, className: string) {
  return toaster.show((props) => (
    <Toast {...props} class={className}>
      <Toast.Title>{title}</Toast.Title>
      {description ? <Toast.Description>{description}</Toast.Description> : null}
      <Toast.CloseButton aria-label="关闭">×</Toast.CloseButton>
    </Toast>
  ))
}

export const toast = {
  success: (title: string, description?: string) => makeToast(title, description, "border-emerald-200 bg-white dark:border-emerald-900 dark:bg-zinc-900"),
  error: (title: string, description?: string) => makeToast(title, description, "border-red-200 bg-white dark:border-red-900 dark:bg-zinc-900"),
  info: (title: string, description?: string) => makeToast(title, description, "border-blue-200 bg-white dark:border-blue-900 dark:bg-zinc-900"),
  warning: (title: string, description?: string) => makeToast(title, description, "border-amber-200 bg-white dark:border-amber-900 dark:bg-zinc-900"),
}
