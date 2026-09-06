import { Tooltip } from "@kobalte/core/tooltip"
import { Icon } from "@/icons"

export function FieldHint(props: { text: string }) {
  return <Tooltip openDelay={100}><Tooltip.Trigger type="button" class="ml-1 inline-grid size-10 -my-3 place-items-center align-middle text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" aria-label="字段说明"><Icon name="info" size={14} /></Tooltip.Trigger><Tooltip.Portal><Tooltip.Content class="z-50 max-w-60 rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs text-white shadow dark:bg-zinc-100 dark:text-zinc-900">{props.text}<Tooltip.Arrow /></Tooltip.Content></Tooltip.Portal></Tooltip>
}
