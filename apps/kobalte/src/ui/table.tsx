import type { ParentProps } from "solid-js"
export function Table(props: ParentProps<{ class?: string }>) { return <div class="max-w-full overflow-x-auto"><table class={`w-full text-sm ${props.class ?? ""}`}>{props.children}</table></div> }
export function TableHeader(props: ParentProps) { return <thead class="border-b border-zinc-200 dark:border-zinc-800">{props.children}</thead> }
export function TableBody(props: ParentProps) { return <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">{props.children}</tbody> }
export function TableRow(props: ParentProps<{ class?: string; onClick?: () => void }>) { return <tr class={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${props.class ?? ""}`} onClick={() => props.onClick?.()}>{props.children}</tr> }
export function TableHead(props: ParentProps<{ class?: string; onClick?: () => void }>) { return <th class={`whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 ${props.class ?? ""}`} onClick={() => props.onClick?.()}>{props.children}</th> }
export function TableCell(props: ParentProps<{ class?: string; onClick?: (event: MouseEvent) => void }>) { return <td class={`whitespace-nowrap px-3 py-3 ${props.class ?? ""}`} onClick={(event) => props.onClick?.(event)}>{props.children}</td> }
