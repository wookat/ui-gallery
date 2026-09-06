import { createSignal, onMount, type ParentProps } from "solid-js"
export function Table(props: ParentProps<{ class?: string }>) {
  const [more, setMore] = createSignal(false)
  const [scroller, setScroller] = createSignal<HTMLDivElement>()
  const update = () => { const el = scroller(); if (el) setMore(el.scrollWidth - el.clientWidth - el.scrollLeft > 4) }
  onMount(() => {
    update()
    const el = scroller()
    if (el) new ResizeObserver(update).observe(el)
  })
  return <div class="max-w-full">
    <div class="relative">
      <div ref={setScroller} class="max-w-full overflow-x-auto" onScroll={update}><table class={`w-full text-sm ${props.class ?? ""}`}>{props.children}</table></div>
      <div class={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent transition-opacity dark:from-zinc-900 ${more() ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
    </div>
    <p class={`px-2 pb-2 text-xs text-zinc-500 dark:text-zinc-400 sm:hidden ${more() ? "" : "hidden"}`}>← 左右滑动查看更多列</p>
  </div>
}
export function TableHeader(props: ParentProps) { return <thead class="border-b border-zinc-200 dark:border-zinc-800">{props.children}</thead> }
export function TableBody(props: ParentProps) { return <tbody class="divide-y divide-zinc-100 dark:divide-zinc-800">{props.children}</tbody> }
export function TableRow(props: ParentProps<{ class?: string; onClick?: () => void }>) { return <tr class={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${props.class ?? ""}`} onClick={() => props.onClick?.()}>{props.children}</tr> }
export function TableHead(props: ParentProps<{ class?: string; onClick?: () => void }>) { return <th class={`whitespace-nowrap px-2 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:px-3 ${props.class ?? ""}`} onClick={() => props.onClick?.()}>{props.children}</th> }
export function TableCell(props: ParentProps<{ class?: string; onClick?: (event: MouseEvent) => void }>) { return <td class={`whitespace-nowrap px-2 py-3 sm:px-3 ${props.class ?? ""}`} onClick={(event) => props.onClick?.(event)}>{props.children}</td> }
