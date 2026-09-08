import * as React from "react"
import { cn } from "@/lib/cn"
import { CircleAlertIcon, FileIcon, UploadCloudIcon, XIcon } from "lucide-react"

import { IconButton } from "@/components/ui/icon-button"
import { Progress } from "@/components/ui/progress"

type FileDropzoneProps = Omit<React.ComponentProps<"input">, "type" | "onChange"> & {
  /** 主文案 / 次要说明（accept、大小上限等） */
  title: string
  hint: string
  onFiles: (files: File[]) => void
  invalid?: boolean
}

/** 拖放上传：hifi .dropzone —— 虚线 border-strong、radius.lg、居中图标 + 文案；dragover 转 primary + primary-soft 底；整块是 label 包住 input[type=file] */
function FileDropzone({ title, hint, onFiles, invalid, className, disabled, id, ...props }: FileDropzoneProps) {
  const [over, setOver] = React.useState(false)
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
        "flex min-h-[calc(var(--size-control-lg)*3)] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-surface p-6 text-center transition-colors duration-(--motion-fast) ease-std hover:border-primary has-focus-visible:border-primary data-dragover:border-primary data-dragover:bg-primary-soft aria-invalid:border-danger has-disabled:cursor-not-allowed has-disabled:bg-surface-muted has-disabled:text-fg-muted [&_svg]:size-icon-lg [&_svg]:text-fg-muted data-dragover:[&_svg]:text-primary",
        className,
      )}
    >
      <UploadCloudIcon aria-hidden />
      <span className="text-role-label">{title}</span>
      <span className="text-role-caption text-fg-muted">{hint}</span>
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
}

/** 文件行：hifi .file —— 图标 + 名称 / 大小、uploading 显示进度条、error 显示 danger 文案、右侧移除 */
function FileItem({ name, size, status, progress = 0, error, onRemove, removeLabel, actions, className, ...props }: FileItemProps) {
  return (
    <li data-slot="file-item" data-status={status} className={cn("flex items-center gap-3 rounded-md border px-3 py-2", status === "error" && "border-danger", className)} {...props}>
      <span className={cn("grid size-icon-lg shrink-0 place-items-center [&_svg]:size-icon-md", status === "error" ? "text-danger" : "text-fg-muted")}>
        {status === "error" ? <CircleAlertIcon aria-hidden /> : <FileIcon aria-hidden />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-role-body">{name}</span>
        {status === "uploading" ? (
          <Progress value={progress} aria-label={name} className="h-track" />
        ) : (
          <span className={cn("text-role-caption", status === "error" ? "text-danger" : "text-fg-muted")}>{status === "error" && error ? error : size}</span>
        )}
      </span>
      {actions}
      {onRemove && removeLabel ? (
        <IconButton label={removeLabel} onClick={onRemove}>
          <XIcon />
        </IconButton>
      ) : null}
    </li>
  )
}

export { FileDropzone, FileItem, type FileDropzoneProps, type FileItemProps }
