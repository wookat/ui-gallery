import * as React from "react"
import { cn } from "@/lib/cn"

type PageHeaderProps = React.ComponentProps<"header"> & {
  title: React.ReactNode
  description?: React.ReactNode
  /** 标题上方的面包屑 / 返回链接 */
  breadcrumb?: React.ReactNode
  /** 右侧动作区（≤768 换到下一行并撑满） */
  actions?: React.ReactNode
  /** 标题右侧的 Tag / 计数 */
  extra?: React.ReactNode
}

/** 页头：hifi .page-header —— 标题 heading 字阶 + caption 描述，右侧动作；375 纵向堆叠 */
function PageHeader({ title, description, breadcrumb, actions, extra, className, ...props }: PageHeaderProps) {
  return (
    <header data-slot="page-header" className={cn("flex flex-wrap items-start justify-between gap-4", className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {breadcrumb}
        <div className="flex min-h-hit flex-wrap items-center gap-3">
          <h1 className="text-role-heading wrap-anywhere">{title}</h1>
          {extra}
        </div>
        {description ? <p className="text-role-body text-fg-muted">{description}</p> : null}
      </div>
      {actions ? <div data-slot="page-header-actions" className="flex flex-wrap items-center gap-3 mobile:w-full mobile:[&>*]:flex-1">{actions}</div> : null}
    </header>
  )
}

/** 工具条：hifi .toolbar —— 筛选 / 搜索 / 视图切换一行排布，space.3 间距，375 换行；ToolbarSpacer 把后续项推到右侧 */
function Toolbar({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="toolbar" data-slot="toolbar" className={cn("flex min-h-hit w-full flex-wrap items-center gap-3", className)} {...props} />
}

function ToolbarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="toolbar-group" className={cn("flex min-w-0 flex-wrap items-center gap-2", className)} {...props} />
}

function ToolbarSpacer() {
  return <span aria-hidden data-slot="toolbar-spacer" className="flex-1 mobile:hidden" />
}

export { PageHeader, Toolbar, ToolbarGroup, ToolbarSpacer, type PageHeaderProps }
