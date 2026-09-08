import * as React from "react"
import { cn } from "@/lib/cn"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type PaginationProps = React.ComponentProps<"nav"> & {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  /** 上一页 / 下一页 / 「第 n 页」的可访问名 */
  labels: { prev: string; next: string; page: (n: number) => string }
  /** 右侧范围说明（如「第 1–20 条，共 731 条」） */
  range?: React.ReactNode
  /** 样本数据填不满的页码（aria-disabled，不伪造行） */
  isPageDisabled?: (page: number) => boolean
  /** 当前页两侧保留的页码数 */
  siblings?: number
  /** 覆盖页码序列（各稿折叠规则不同时由调用方给出，如 orders 的「1 2 3 4 … 37」） */
  pages?: (number | "…")[]
}

/** 页码序列：首尾恒显，当前页 ± siblings，其余折叠为省略号 */
function pageItems(page: number, pageCount: number, siblings: number): (number | "…")[] {
  if (pageCount <= 5 + siblings * 2) return Array.from({ length: pageCount }, (_, i) => i + 1)
  const start = Math.max(2, page - siblings)
  const end = Math.min(pageCount - 1, page + siblings)
  const items: (number | "…")[] = [1]
  if (start > 2) items.push("…")
  for (let i = start; i <= end; i++) items.push(i)
  if (end < pageCount - 1) items.push("…")
  items.push(pageCount)
  return items
}

/** 分页：hifi .pagination —— size.hit 方块页码、当前页 primary、省略号 fg-muted、range 靠右（≤768 换行到下一行） */
function Pagination({ page, pageCount, onPageChange, labels, range, isPageDisabled, siblings = 1, pages, className, ...props }: PaginationProps) {
  const btn =
    "inline-grid h-hit min-w-hit place-items-center rounded-md px-2 text-role-label text-fg-muted tabular-nums transition-colors duration-(--motion-fast) ease-std hover:not-disabled:not-aria-disabled:bg-surface-muted hover:not-disabled:not-aria-disabled:text-fg aria-[current=page]:bg-primary aria-[current=page]:text-on-primary aria-disabled:cursor-not-allowed disabled:disabled-look [&_svg]:size-icon-md"
  return (
    <nav data-slot="pagination" className={cn("flex w-full flex-wrap items-center gap-1", className)} {...props}>
      <button type="button" className={btn} aria-label={labels.prev} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeftIcon />
      </button>
      {(pages ?? pageItems(page, pageCount, siblings)).map((item, i) =>
        item === "…" ? (
          <span key={`e${i}`} data-slot="pagination-ellipsis" aria-hidden className="w-hit text-center text-fg-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            data-page={item}
            className={btn}
            aria-label={labels.page(item)}
            aria-current={item === page ? "page" : undefined}
            aria-disabled={isPageDisabled?.(item) || undefined}
            onClick={() => (isPageDisabled?.(item) ? undefined : onPageChange(item))}
          >
            {item}
          </button>
        ),
      )}
      <button type="button" className={btn} aria-label={labels.next} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        <ChevronRightIcon />
      </button>
      {range ? <span data-slot="pagination-range" className="ml-auto text-role-caption text-fg-muted tabular-nums mobile:mt-1 mobile:ml-0 mobile:basis-full">{range}</span> : null}
    </nav>
  )
}

export { Pagination, pageItems, type PaginationProps }
