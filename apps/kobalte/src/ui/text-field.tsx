import { TextField as KobalteTextField } from "@kobalte/core/text-field"
import { createSignal, splitProps, type JSX, type ParentProps } from "solid-js"
import { Icon } from "@/icons"
import { FieldHint } from "@/ui/hint"

type TextFieldProps = ParentProps<{
  id?: string
  name?: string
  label?: string
  hint?: string
  description?: string
  error?: string
  placeholder?: string
  value?: string
  type?: string
  required?: boolean
  disabled?: boolean
  class?: string
  prefix?: JSX.Element
  suffix?: JSX.Element
  onKeyDown?: (event: KeyboardEvent) => void
  onInput?: (event: InputEvent & { currentTarget: HTMLInputElement }) => void
  ariaLabel?: string
  maxLength?: number
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search"
  ref?: (element: HTMLInputElement) => void
}>

export function TextField(props: TextFieldProps) {
  const [visible, setVisible] = createSignal(false)
  const [local] = splitProps(props, ["class", "prefix", "suffix", "children"])
  const isPassword = () => props.type === "password"
  return (
    <KobalteTextField
      id={props.id}
      name={props.name}
      required={props.required}
      disabled={props.disabled}
      validationState={props.error ? "invalid" : "valid"}
      class={`${props.label ? "grid gap-1.5" : ""} ${local.class ?? ""}`}
    >
      {props.label ? <KobalteTextField.Label class="inline-flex items-center text-sm font-medium text-zinc-800 dark:text-zinc-200">{props.label}{props.required ? <span class="ml-1 text-red-600 dark:text-red-400">*</span> : null}{props.hint ? <FieldHint text={props.hint} /> : null}</KobalteTextField.Label> : null}
      <div class="flex min-h-10 items-center rounded-md border border-zinc-300 bg-white px-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 data-[invalid]:border-red-500 dark:border-zinc-700 dark:bg-zinc-900">
        {props.prefix ? <span class="mr-2 text-zinc-500 dark:text-zinc-400">{props.prefix}</span> : null}
        <KobalteTextField.Input
          class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 disabled:opacity-50 dark:text-zinc-100"
          placeholder={props.placeholder}
          value={props.value}
          type={isPassword() && !visible() ? "password" : isPassword() ? "text" : props.type}
          onInput={props.onInput}
          onKeyDown={props.onKeyDown}
          aria-label={props.ariaLabel ?? props.label}
          maxLength={props.maxLength}
          inputMode={props.inputMode}
          ref={props.ref}
        />
        {isPassword() ? <button type="button" class="ml-1 -mr-3 grid size-10 shrink-0 place-items-center rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" aria-label={visible() ? "隐藏密码" : "显示密码"} onClick={() => setVisible((value) => !value)}><Icon name={visible() ? "eye-off" : "eye"} size={16} /></button> : null}
        {props.suffix ? <span class="ml-2 text-zinc-500 dark:text-zinc-400">{props.suffix}</span> : null}
      </div>
      {props.description ? <KobalteTextField.Description class="text-xs text-zinc-500 dark:text-zinc-400">{props.description}</KobalteTextField.Description> : null}
      {props.error ? <KobalteTextField.ErrorMessage class="text-xs text-red-600 dark:text-red-400">{props.error}</KobalteTextField.ErrorMessage> : null}
      {props.children}
    </KobalteTextField>
  )
}

export function TextArea(props: TextFieldProps & { rows?: number; maxLength?: number }) {
  return (
    <KobalteTextField class={`grid min-w-0 gap-1.5 ${props.class ?? ""}`} validationState={props.error ? "invalid" : "valid"}>
      {props.label ? <KobalteTextField.Label class="inline-flex items-center text-sm font-medium">{props.label}{props.required ? <span class="ml-1 text-red-600 dark:text-red-400">*</span> : null}{props.hint ? <FieldHint text={props.hint} /> : null}</KobalteTextField.Label> : null}
      <KobalteTextField.TextArea rows={props.rows ?? 4} maxLength={props.maxLength} class="min-w-0 max-w-full w-full rounded-md border border-zinc-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" placeholder={props.placeholder} onInput={props.onInput} aria-label={props.label} />
      {props.description ? <KobalteTextField.Description class="text-xs text-zinc-500 dark:text-zinc-400">{props.description}</KobalteTextField.Description> : null}
      {props.error ? <KobalteTextField.ErrorMessage class="text-xs text-red-600 dark:text-red-400">{props.error}</KobalteTextField.ErrorMessage> : null}
    </KobalteTextField>
  )
}
