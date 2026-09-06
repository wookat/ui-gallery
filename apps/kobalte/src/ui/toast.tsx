import { Toast, toaster } from "@kobalte/core/toast"

function makeToast(title: string, description: string | undefined, className: string) {
  return toaster.show((props) => (
    <Toast {...props} class={`relative flex items-start gap-3 rounded-lg border p-4 pr-12 text-sm shadow-lg text-zinc-900 dark:text-zinc-100 ${className}`}>
      <div class="grid gap-1"><Toast.Title class="font-medium">{title}</Toast.Title>{description ? <Toast.Description class="text-zinc-500 dark:text-zinc-400">{description}</Toast.Description> : null}</div>
      <Toast.CloseButton aria-label="关闭" class="absolute right-2 top-2 grid size-10 place-items-center rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">×</Toast.CloseButton>
    </Toast>
  ))
}

export const toast = {
  success: (title: string, description?: string) => makeToast(title, description, "border-emerald-200 bg-white dark:border-emerald-900 dark:bg-zinc-900"),
  error: (title: string, description?: string) => makeToast(title, description, "border-red-200 bg-white dark:border-red-900 dark:bg-zinc-900"),
  info: (title: string, description?: string) => makeToast(title, description, "border-blue-200 bg-white dark:border-blue-900 dark:bg-zinc-900"),
  warning: (title: string, description?: string) => makeToast(title, description, "border-amber-200 bg-white dark:border-amber-900 dark:bg-zinc-900"),
}
