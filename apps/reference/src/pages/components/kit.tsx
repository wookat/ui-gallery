import * as React from "react"
import { cn } from "@/lib/cn"

import { t } from "@/data/content"

/**
 * /components 演示骨架（hifi design/hifi/components）：
 *   - DemoBox：虚线 .demo-box，caption 在顶部
 *   - Matrix：.matrix-wrap 横滚 + .matrix 表格，行 = 变体、列 = 状态
 *   - Stage / StageCol：.stage 横向换行 / .stage-col 纵向堆叠
 * hover / focus 通过 data-demo 属性驱动（theme.css @custom-variant），截图脚本无需真正移动鼠标。
 */
export const K = (key: string, vars?: Record<string, string | number>) => t(`components.${key}`, vars)

export const STATES = ["default", "hover", "focus", "disabled", "loading", "error"] as const
export type State = (typeof STATES)[number]
export const demo = (s: State) => (s === "hover" || s === "focus" ? s : undefined)

export type OverlayProps = { open: string | null; set: (patch: Record<string, string | null>) => void }
export const bind = ({ open, set }: OverlayProps, id: string) => ({
  open: open === id || undefined,
  onOpenChange: (o: boolean) => set({ open: o ? id : null }),
})

export const MATRIX_WRAP = "relative -mx-6 w-auto overflow-x-auto px-6 scroll-px-6 mobile:-mx-4 mobile:px-4 mobile:scroll-px-4 data-scrollable:scroll-shadow-x"
export const MATRIX_TH = "h-table-header border-b border-border whitespace-nowrap px-3 text-left align-middle text-role-caption font-medium text-fg-muted first:pl-0 last:pr-0"
export const MATRIX_ROW = "border-b border-border last:border-b-0"
export const MATRIX_ROW_TH = "py-3 pr-3 text-left align-middle whitespace-nowrap text-role-label text-fg"
export const MATRIX_TD = "px-3 py-3 align-middle whitespace-nowrap last:pr-0"
export const MATRIX_TD_WIDE = "min-w-[calc(var(--size-content-max)/5)]"

export function Dash() {
  return (
    <>
      <span aria-hidden className="text-fg-disabled">
        {K("matrix.na")}
      </span>
      <span className="sr-only">{K("matrix.naText")}</span>
    </>
  )
}

export function Caption({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("block text-role-caption text-fg-muted", className)} {...props} />
}

/** 虚线演示框：hifi .demo-box（caption 在上，内容左对齐；center 居中） */
export function DemoBox({ caption, center, className, children, ...props }: React.ComponentProps<"div"> & { caption?: React.ReactNode; center?: boolean }) {
  return (
    <div
      data-slot="demo-box"
      className={cn("flex min-w-0 flex-col gap-4 rounded-md border border-dashed border-border-strong p-4", center ? "items-center" : "items-start", "[&>[data-slot=matrix-wrap]]:mx-0 [&>[data-slot=matrix-wrap]]:w-full [&>[data-slot=matrix-wrap]]:self-stretch [&>[data-slot=matrix-wrap]]:px-0 [&>[data-slot=table-wrap]]:mx-0 [&>[data-slot=table-wrap]]:self-stretch [&>[data-slot=table-wrap]]:px-0", className)}
      {...props}
    >
      {caption ? <Caption>{caption}</Caption> : null}
      {children}
    </div>
  )
}

/** hifi .stage：横向换行、居中对齐 */
export function Stage({ className, start, end, ...props }: React.ComponentProps<"div"> & { start?: boolean; end?: boolean }) {
  return <div data-slot="stage" className={cn("flex w-full flex-wrap gap-4", start ? "items-start" : "items-center", end && "justify-end", className)} {...props} />
}

/** hifi .stage-col：纵向堆叠、拉伸 */
export function StageCol({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="stage-col" className={cn("flex min-w-0 flex-col gap-4", className)} {...props} />
}

export const GRID_2 = "grid w-full grid-cols-2 gap-4 mobile:grid-cols-1"
export const GRID_3 = "grid w-full grid-cols-3 gap-4 tablet:grid-cols-2 mobile:grid-cols-1"

/** 内容宽于容器时置 data-scrollable（hifi .is-scrollable：两侧横滚阴影） */
export function useScrollable<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [scrollable, setScrollable] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScrollable(el.scrollWidth > el.clientWidth + 1)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, scrollable] as const
}

export function MatrixWrap({ className, label, kind = "matrix-wrap", ...props }: React.ComponentProps<"div"> & { label: string; kind?: "matrix-wrap" | "table-wrap" }) {
  const [ref, scrollable] = useScrollable<HTMLDivElement>()
  return <div ref={ref} data-slot={kind} data-scrollable={scrollable || undefined} tabIndex={0} role="region" aria-label={label} className={cn(MATRIX_WRAP, className)} {...props} />
}

export type MatrixRow<S extends string> = {
  label: React.ReactNode
  /** 行头下方等宽小字（props 用法） */
  mono?: React.ReactNode
  render: (col: S) => React.ReactNode
}

type MatrixProps<S extends string> = {
  /** 表格 caption；同时作为横滚 region 的 aria-label */
  caption: string
  /** 首列表头（hifi「变体」「类型」「尺寸」…） */
  head?: string
  cols: readonly S[]
  colLabel?: (col: S) => React.ReactNode
  rows: MatrixRow<S>[]
  /** 单元格加最小宽（hifi td.wide）；传函数则按列判断 */
  wide?: boolean | ((col: S) => boolean)
  /** 单元格允许换行（hifi td.wrap） */
  wrap?: boolean
  className?: string
}

/** 状态矩阵：hifi .matrix —— 行 = 变体，列 = 状态，.matrix-wrap 横滚 */
export function Matrix<S extends string>({ caption, head = K("matrix.variant"), cols, colLabel, rows, wide, wrap, className }: MatrixProps<S>) {
  const label = colLabel ?? ((c: S) => K(`state.${c}`))
  const isWide = (c: S) => (typeof wide === "function" ? wide(c) : !!wide)
  return (
    <MatrixWrap label={caption} className={className}>
      <table className="w-full border-collapse">
        <caption className="pb-2 text-left text-role-caption text-fg-muted">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className={MATRIX_TH}>
              {head}
            </th>
            {cols.map((c) => (
              <th key={c} scope="col" className={MATRIX_TH}>
                {label(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={MATRIX_ROW}>
              <th scope="row" className={MATRIX_ROW_TH}>
                {r.label}
                {r.mono ? <span className="block font-mono text-role-caption font-regular text-fg-muted">{r.mono}</span> : null}
              </th>
              {cols.map((c) => (
                <td key={c} data-state-col={c} className={cn(MATRIX_TD, isWide(c) && MATRIX_TD_WIDE, wrap && "whitespace-normal", "[&>*]:min-w-0")}>
                  {r.render(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </MatrixWrap>
  )
}

/**
 * 兼容旧演示体的行：
 *   - 给 cols：单行矩阵（表头 = cols，行头 = label）
 *   - 不给 cols：虚线 DemoBox + caption + Stage
 */
export function Row({ label, children, cols, wide, head }: { label: string; children: React.ReactNode; cols?: string[]; wide?: boolean; head?: string }) {
  if (cols) {
    const kids = React.Children.toArray(children)
    return (
      <Matrix
        caption={label}
        head={head ?? K("matrix.variant")}
        cols={cols}
        colLabel={(c) => c}
        wide={wide}
        rows={[{ label, render: (c) => kids[cols.indexOf(c)] }]}
      />
    )
  }
  return (
    <DemoBox caption={label}>
      <Stage>{children}</Stage>
    </DemoBox>
  )
}

/** hifi 孤立组件演示的分页口径：234 条 / 每页 20 → 12 页（与 orders 屏的 731 条无关） */
export const TABLE_PAGE_SIZE = 20
export const TABLE_PAGE_COUNT = 12
export const TABLE_TOTAL = 234
