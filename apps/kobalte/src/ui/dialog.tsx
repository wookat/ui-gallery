import { Dialog as KobalteDialog } from "@kobalte/core/dialog"

export const Dialog = Object.assign(KobalteDialog, { Root: KobalteDialog })

export function Drawer(props: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: unknown }) {
  return <KobalteDialog open={props.open} onOpenChange={props.onOpenChange}><KobalteDialog.Portal><KobalteDialog.Overlay class="fixed inset-0 z-40 bg-black/40" /><KobalteDialog.Content class="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"><KobalteDialog.Title class="text-lg font-semibold">{props.title}</KobalteDialog.Title>{props.description ? <KobalteDialog.Description class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{props.description}</KobalteDialog.Description> : null}<div class="mt-6">{props.children as never}</div><KobalteDialog.CloseButton class="absolute right-4 top-4" aria-label="关闭">×</KobalteDialog.CloseButton></KobalteDialog.Content></KobalteDialog.Portal></KobalteDialog>
}
