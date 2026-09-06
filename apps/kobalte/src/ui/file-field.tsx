import { FileField as KobalteFileField } from "@kobalte/core/file-field"
import { Icon } from "@/icons"

export function FileField(props: { label?: string }) {
  return (
    <KobalteFileField multiple accept={["image/*", ".csv", ".pdf"]} class="grid gap-2">
      {props.label ? <KobalteFileField.Label class="text-sm font-medium">{props.label}</KobalteFileField.Label> : null}
      <KobalteFileField.Dropzone class="grid min-h-28 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-zinc-300 text-center text-sm hover:border-blue-500 dark:border-zinc-700">
        <span><Icon name="upload" class="mx-auto mb-2" />拖拽文件到这里，或 <KobalteFileField.Trigger class="text-blue-600 underline">点击上传</KobalteFileField.Trigger></span>
      </KobalteFileField.Dropzone>
      <KobalteFileField.HiddenInput />
      <KobalteFileField.ItemList class="grid gap-2 text-sm">
        {(file) => <KobalteFileField.Item class="flex items-center justify-between rounded border border-zinc-200 px-3 py-2 dark:border-zinc-700"><span class="min-w-0 truncate"><KobalteFileField.ItemName>{file.name}</KobalteFileField.ItemName> <KobalteFileField.ItemSize class="text-xs text-zinc-500 dark:text-zinc-400" /></span><KobalteFileField.ItemDeleteTrigger class="text-red-600 dark:text-red-400" aria-label={`移除 ${file.name}`}>移除</KobalteFileField.ItemDeleteTrigger></KobalteFileField.Item>}
      </KobalteFileField.ItemList>
    </KobalteFileField>
  )
}
