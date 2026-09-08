import * as React from "react"
import { cn } from "@/lib/cn"
import { CircleAlertIcon, CircleCheckIcon, FileIcon, UploadIcon, XIcon } from "lucide-react"

import { IconButton } from "@/components/ui/icon-button"
import { Progress } from "@/components/ui/progress"

type FileDropzoneProps = Omit<React.ComponentProps<"input">, "type" | "onChange"> & {
  /** 主文案 / 次要说明（accept、大小上限等） */
  title: string
  hint: string
  /** 拖入中替换主文案（hifi「松开即上传」），此时不显示 hint */
  dragoverTitle?: string
  /** 强制拖入中外观（演示矩阵用） */
  dragover?: boolean
  onFiles: (files: File[]) => void
  invalid?: boolean
}

/** 拖放上传：hifi .dropzone —— 虚线 border-strong、radius.lg、居中 #i-upload（托盘上箭头）+ 文案；dragover 转 primary + primary-soft 底；整块是 label 包住 input[type=file] */
function FileDropzone({ title, hint, dragoverTitle, dragover, onFiles, invalid, className, disabled, id, ...props }: FileDropzoneProps) {
  const [hovering, setOver] = React.useState(false)
  const over = dragover || hovering
  const inputId = React.useId()
  const finalId = id ?? inputId
  return (
    <label
      htmlFor={finalId}
      data-slot="file-dropzone"
      data-dragover={over || undefined}
      aria-invalid={invalid || undefined}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        if (!disabled) onFiles(Array.from(e.dataTransfer.files))
      }}
      className={cn(
        "flex min-h-[calc(var(--size-hit)*3)] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-(length:--border-width-focus) border-dashed border-border-strong bg-surface p-6 text-center transition-colors duration-(--motion-fast) ease-std hover:border-primary has-focus-visible:border-primary data-dragover:border-primary data-dragover:bg-primary-soft aria-invalid:border-danger has-disabled:cursor-not-allowed has-disabled:bg-surface-muted has-disabled:text-fg-muted [&_svg]:size-icon-lg [&_svg]:text-fg-muted data-dragover:[&_svg]:text-primary",
        className,
      )}
    >
      <UploadIcon aria-hidden />
      <span className="text-role-label">{over && dragoverTitle ? dragoverTitle : title}</span>
      {over && dragoverTitle ? null : <span className="text-role-caption text-fg-muted">{hint}</span>}
      <input id={finalId} type="file" className="sr-only" disabled={disabled} onChange={(e) => onFiles(Array.from(e.target.files ?? []))} {...props} />
    </label>
  )
}

type FileItemProps = React.ComponentProps<"li"> & {
  name: string
  /** 已格式化的大小文案（调用方用 formatFileSize） */
  size: string
  status: "done" | "uploading" | "error"
  progress?: number
  error?: string
  onRemove?: () => void
  removeLabel?: string
  /** 移除前的附加动作（error 态「重试」等） */
  actions?: React.ReactNode
  /** 状态文案：uploading 为进度文字（已带百分比），done 为勾图标的可访问名 */
  statusLabels?: { uploading?: string; done?: string }
  /** 图标块内的图标（按文件类型区分时由调用方传入，如 FileTextIcon / ImageIcon）；缺省 done/uploading 为 FileIcon、error 为 CircleAlertIcon */
  icon?: React.ReactNode
}

/**
 * 文件行：hifi .file —— 分隔线列表行（avatar-md 图标块 / 名称 + 元信息 / 右侧动作）；
 * done 元信息为 success 勾 + 大小，uploading 为进度文字 + 轨道，error 为 danger 文案（图标块转 danger-soft）。
 */
function FileItem({ name, size, status, progress = 0, error, onRemove, removeLabel, actions, statusLabels, icon, className, ...props }: FileItemProps) {
  return (
    <li
      data-slot="file-item"
      data-status={status}
      className={cn("grid min-h-hit grid-cols-[var(--size-avatar-md)_minmax(0,1fr)_auto] items-center gap-3 border-b py-2 last:border-b-0", className)}
      {...props}
    >
      <span className={cn("grid size-avatar-md place-items-center rounded-sm [&_svg]:size-icon-sm", status === "error" ? "bg-danger-soft text-danger" : "bg-surface-muted text-fg-muted")}>
        {icon ?? (status === "error" ? <CircleAlertIcon aria-hidden /> : <FileIcon aria-hidden />)}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-role-label">{name}</span>
        <span className={cn("flex flex-wrap items-center gap-2 text-role-caption tabular-nums [&_svg]:size-icon-sm", status === "error" ? "text-danger" : "text-fg-muted")}>
          {status === "done" ? (
            <>
              <CircleCheckIcon aria-hidden className="text-success" />
              {statusLabels?.done ? <span className="sr-only">{statusLabels.done}</span> : null}
              <span>{size}</span>
            </>
          ) : status === "uploading" ? (
            <>
              {statusLabels?.uploading ? <span>{statusLabels.uploading}</span> : null}
              <Progress value={progress} aria-label={name} className="h-track max-w-[calc(var(--size-form-max)/2)] flex-1 basis-20" />
            </>
          ) : (
            <span>{error ?? size}</span>
          )}
        </span>
      </span>
      <span className="-mr-2 flex items-center gap-1">
        {actions}
        {onRemove && removeLabel ? (
          <IconButton label={removeLabel} onClick={onRemove}>
            <XIcon />
          </IconButton>
        ) : null}
      </span>
    </li>
  )
}

export { FileDropzone, FileItem, type FileDropzoneProps, type FileItemProps }
