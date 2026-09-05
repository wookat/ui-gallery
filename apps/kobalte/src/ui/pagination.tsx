import { Pagination as KobaltePagination } from "@kobalte/core/pagination"

export function Pagination(props: { page: number; count: number; pageSize: number; onPageChange: (page: number) => void }) {
  const pages = Math.max(1, Math.ceil(props.count / props.pageSize))
  return <KobaltePagination count={pages} page={props.page} onPageChange={props.onPageChange} itemComponent={(item) => <KobaltePagination.Item page={item.page} class="grid size-8 place-items-center rounded-md text-sm data-[current]:bg-zinc-900 data-[current]:text-white dark:data-[current]:bg-zinc-100 dark:data-[current]:text-zinc-900">{item.page}</KobaltePagination.Item>} ellipsisComponent={() => <span>…</span>} class="flex items-center justify-end gap-1">
    <KobaltePagination.Previous class="grid size-8 place-items-center rounded-md border text-sm data-[disabled]:opacity-40" aria-label="上一页">‹</KobaltePagination.Previous>
    <KobaltePagination.Items />
    <KobaltePagination.Next class="grid size-8 place-items-center rounded-md border text-sm data-[disabled]:opacity-40" aria-label="下一页">›</KobaltePagination.Next>
  </KobaltePagination>
}
