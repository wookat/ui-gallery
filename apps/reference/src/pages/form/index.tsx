import * as React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FilmIcon,
  ImageIcon,
  InfoIcon,
  PencilIcon,
  PlusIcon,
  RefreshCwIcon,
  SaveIcon,
  SendIcon,
  Trash2Icon,
  TriangleAlertIcon,
  WarehouseIcon,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/cn"
import { formatCurrency, formatCurrencyWhole, formatInteger } from "@/lib/format"
import { tokenMs } from "@/lib/media"
import { t } from "@/data/content"
import { mock, type NavItem } from "@/data/mock"
import { useScreenState } from "@/data/screen-state"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/ui/description-list"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { FileDropzone, FileItem } from "@/components/ui/file-dropzone"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tag } from "@/components/ui/badge"
import { TagInput } from "@/components/ui/tag-input"
import { CharCounter, Textarea } from "@/components/ui/textarea"
import { Result } from "@/components/composed/result"
import { Stepper } from "@/components/composed/stepper"
import { AppShell } from "@/pages/dashboard/shell"

import {
  addDays,
  byKey,
  doneAttachments,
  formatFileSize,
  goodsQty,
  goodsTotal,
  grandTotal,
  initialModel,
  nextId,
  PF,
  rowField,
  rowSubtotal,
  skuOf,
  supplierOf,
  TODAY,
  TOMORROW,
  V,
  validate,
  type Attachment,
  type FormState,
  type Model,
  type Row,
  type Step,
} from "./model"

export const path = "/form"

const STATES = ["default", "invalid", "loading", "success", "error"] as const satisfies readonly FormState[]
const STEP_KEYS = ["step1", "step2", "step3"] as const

type Local = "terms" | "leave" | null

/** hifi form .dialog：无边框、radius.lg，375 下仍居中（不走组件的底部弹层） */
const CENTERED_DIALOG =
  "rounded-lg border-0 mobile:top-1/2 mobile:bottom-auto mobile:left-1/2 mobile:w-[calc(100vw-var(--space-4)*2)] mobile:max-w-dialog mobile:-translate-1/2 mobile:rounded-lg mobile:px-4 mobile:py-5"
/** hifi openDialog：初始焦点给对话框内第一个 button（头部 ×） */
const focusDialogClose = (e: Event) => {
  const close = e.currentTarget instanceof HTMLElement ? e.currentTarget.querySelector<HTMLElement>("[data-slot=dialog-close-icon],[data-slot=alert-dialog-close-icon]") : null
  if (close) {
    e.preventDefault()
    close.focus()
  }
}
/** hifi FICON：按扩展名选文件图标（缺省 file-text） */
const FILE_ICONS: Record<string, LucideIcon> = { pdf: FileTextIcon, xlsx: FileSpreadsheetIcon, jpg: ImageIcon, png: ImageIcon, mp4: FilmIcon }
const FileTypeIcon = ({ name }: { name: string }) => {
  const Icon = FILE_ICONS[name.split(".").pop()?.toLowerCase() ?? ""] ?? FileTextIcon
  return <Icon aria-hidden />
}
const CARD = "min-w-0 rounded-lg border bg-surface p-6 text-fg shadow-sm tablet:p-4"
/** hifi .aside .row：桌面左右对齐；≤1024 非 rail 与 ≤768 改为上下堆叠的 2 列网格单元 */
const ASIDE_ROW = "flex items-baseline justify-between gap-4 tablet:flex-col tablet:items-start tablet:gap-1 rail:tablet:flex-row rail:tablet:items-baseline rail:tablet:gap-4 mobile:flex-col! mobile:items-start! mobile:gap-1!"
const ASIDE_DT = "shrink-0 text-role-body text-fg-muted tablet:text-role-caption rail:tablet:text-role-body mobile:text-role-caption!"
const ASIDE_DD = "min-w-0 text-right wrap-anywhere tablet:text-left rail:tablet:text-right mobile:text-left!"
/** hifi .sum-section：描边卡，space-4 × space-5 内距 */
const SUM_SECTION = "grid gap-3 rounded-md border px-5 py-4 mobile:gap-2 mobile:px-4 mobile:py-3"
/** hifi .dl / .dl-2：dt 为 body 字号、与 dd 同基线；≤768 列距收窄为 space-4 */
const SUM_DL = "mobile:gap-x-4 [&>dd]:min-h-0 [&>dt]:pt-0 [&>dt]:text-role-body"
/** hifi form .alert-body：min-height control-md 垂直居中，动作区 md 幽灵钮与之同高 */
const ALERT = "gap-y-3 pr-4 mobile:-mb-2 [&>[data-slot=alert-body]]:min-h-control-md [&>[data-slot=alert-body]]:content-center [&>[data-slot=alert-body]]:gap-1"
/** 同行动作区（hifi .alert-actions margin-right -space-2，与正文同高） */
const ALERT_INLINE = `${ALERT} [&>[data-slot=alert-actions]]:my-0 [&>[data-slot=alert-actions]]:-mr-2`
const PARENT_NAV = mock.nav.flatMap((g): NavItem[] => g.items).find((it) => it.key === "purchasing")

const Required = () => (
  <>
    <span aria-hidden className="ml-1 text-danger">
      *
    </span>
    <span className="sr-only">{t("form.required")}</span>
  </>
)
const Optional = () => <span className="ml-2 text-role-caption font-normal text-fg-muted">{t("form.optional")}</span>

const PanelHead = ({ id, title, description }: { id: string; title: string; description: string }) => (
  <div className="grid gap-1">
    <h2 id={id} className="text-role-heading">
      {title}
    </h2>
    <p className="text-role-caption text-fg-muted">{description}</p>
  </div>
)

const SummaryHead = ({ id, title, onEdit, disabled }: { id: string; title: string; onEdit: () => void; disabled: boolean }) => (
  <div className="flex min-h-hit items-center justify-between gap-3">
    <h3 id={id} className="text-role-title">
      {title}
    </h3>
    <Button type="button" variant="ghost" disabled={disabled} onClick={onEdit} className="-mr-3">
      <PencilIcon aria-hidden />
      {t("form.summary.edit")}
    </Button>
  </div>
)

/**
 * 新建采购单（hifi form）：三步表单 + 右侧摘要卡；URL：?state=default|invalid|loading|success|error &step=1|2|3
 * &open=terms|leave|supplier|sku|drawer|notifications|account &toast=draft|row &fail=1 &sidebar=rail|expanded。
 * 错误只在 touched 字段上显示（blur / 下一步 / 提交时整步 touched），首错聚焦到可见控件。
 */
export default function FormPage() {
  const { state, open, toast: toastQ, hold, set } = useScreenState(STATES)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const sidebar = params.get("sidebar")
  const stepParam = Number(params.get("step"))
  const initialStep: Step = stepParam === 2 || stepParam === 3 ? stepParam : state === "loading" || state === "error" ? 3 : 1
  const forceFail = params.has("fail")

  const [init] = React.useState(() => {
    const model = initialModel(state, initialStep)
    const touched = new Set(state === "invalid" ? validate(model, initialStep).map((e) => e.field) : [])
    return { model, touched }
  })
  const [model, setModel] = React.useState(init.model)
  const [touched, setTouched] = React.useState(init.touched)
  const [step, setStep] = React.useState<Step>(initialStep)
  const [reached, setReached] = React.useState<Step>(initialStep)
  const [dirty, setDirty] = React.useState(true)
  const [local, setLocal] = React.useState<Local>(null)
  /** ?open= 驱动的浮层被关闭后，URL 更新前先同步关闭，保证焦点归还时序确定 */
  const [dismissed, setDismissed] = React.useState<Local>(null)
  const [leaveTo, setLeaveTo] = React.useState("/dashboard")
  const [submitAlert, setSubmitAlert] = React.useState(state === "error")
  const timer = React.useRef<number | null>(null)
  const pendingFocus = React.useRef<string | null>(null)

  const loading = state === "loading"
  const success = state === "success"
  const errors = React.useMemo(() => validate(model, step).filter((e) => touched.has(e.field)), [model, step, touched])
  const errorOf = (field: string) => errors.find((e) => e.field === field)?.message
  const supplier = supplierOf(model.supplierId)
  const warehouse = byKey(PF.warehouses, model.warehouse)
  const slot = byKey(PF.deliverySlots, model.slot)
  const settlement = byKey(PF.settlementMethods, model.settlement)
  const suggestDate = supplier ? addDays(TODAY, supplier.leadTimeDays) : null
  const arrivalEarly = !!supplier && !!suggestDate && !!model.arrivalDate && model.arrivalDate >= TOMORROW && model.arrivalDate < suggestDate
  const freightText = t("form.freight.value", { min: formatInteger(model.freight[0]), max: formatInteger(model.freight[1]) })
  const countText = t("form.items.count", { n: model.items.length, qty: goodsQty(model) })
  const steps = STEP_KEYS.map((k, i) => ({ key: PF.steps[i].key, label: t(`form.${k}.title`), description: t(`form.${k}.description`) }))
  const statusLabels = { done: t("form.stepper.status.done"), current: t("form.stepper.status.current"), todo: t("form.stepper.status.todo"), error: t("form.stepper.status.error") }

  const update = (patch: Partial<Model>) => {
    setModel((m) => ({ ...m, ...patch }))
    setDirty(true)
  }
  const touch = (...fields: string[]) => setTouched((s) => new Set([...s, ...fields]))
  /** 焦点落到操作条按钮时不触发 blur 校验，避免「下一步」前错误闪现 */
  const blurTouch = (field: string) => (e: React.FocusEvent<HTMLElement>) => {
    const to = e.relatedTarget
    if (to instanceof HTMLElement && to.closest("[data-slot=form-actions]")) return
    touch(field)
  }

  const focusById = (id: string) => {
    const el = [document.getElementById(id), document.getElementById(`${id}-m`)].find((n) => n && n.offsetParent !== null)
    if (!el) return false
    el.focus({ preventScroll: true })
    const r = el.getBoundingClientRect()
    if (r.top < 0 || r.bottom > window.innerHeight) el.scrollIntoView({ block: "center" })
    return true
  }
  React.useEffect(() => {
    if (pendingFocus.current && focusById(pendingFocus.current)) pendingFocus.current = null
  })
  React.useEffect(() => {
    if (open === null) setDismissed(null)
  }, [open])
  const focusFirstError = (errs: readonly { focusId: string }[]) => {
    if (errs[0]) pendingFocus.current = errs[0].focusId
  }

  const goStep = (n: Step) => {
    setStep(n)
    setReached((r) => (n > r ? n : r))
    setTouched(new Set())
    window.scrollTo({ top: 0 })
  }
  const advance = (to?: Step) => {
    const errs = validate(model, step)
    if (errs.length) {
      touch(...errs.map((e) => e.field))
      focusFirstError(errs)
      return
    }
    goStep(to ?? ((step + 1) as Step))
  }
  const onStepChange = (i: number) => {
    const n = (i + 1) as Step
    if (n > step) advance(n)
    else if (n !== step) goStep(n)
  }

  const submit = () => {
    if (loading) return
    const errs = validate(model, 3)
    if (errs.length) {
      touch(...errs.map((e) => e.field))
      focusFirstError(errs)
      return
    }
    setSubmitAlert(false)
    set({ state: "loading" })
    timer.current = window.setTimeout(() => {
      if (forceFail) {
        set({ state: "error" })
        setSubmitAlert(true)
        pendingFocus.current = "retryBtn"
      } else {
        setDirty(false)
        set({ state: "success" })
        pendingFocus.current = "viewPo"
      }
    }, tokenMs("--motion-slow") * 4)
  }
  React.useEffect(() => () => window.clearTimeout(timer.current ?? undefined), [])

  const reset = () => {
    setModel(initialModel("default", 1))
    setTouched(new Set())
    setStep(1)
    setReached(1)
    setDirty(true)
    setSubmitAlert(false)
    set({ state: null, step: null, open: null, toast: null, fail: null })
    window.scrollTo({ top: 0 })
  }

  const overlay = (key: Exclude<Local, null>) => ({
    open: (open === key && dismissed !== key) || local === key,
    onOpenChange: (o: boolean) => {
      if (o) {
        setLocal(key)
        setDismissed(null)
      } else {
        setLocal(null)
        if (open === key) {
          setDismissed(key)
          set({ open: null })
        }
      }
    },
  })
  const beforeLeave = (to: string) => {
    if (!dirty || success) return true
    setLeaveTo(to)
    setLocal("leave")
    return false
  }

  React.useEffect(() => {
    if (toastQ === "draft") toast.success(t("form.toast.draftSaved"), { duration: hold ? Infinity : tokenMs("--timing-toast-stay") })
    if (toastQ === "row") toast(t("form.toast.rowAdded"), { duration: hold ? Infinity : tokenMs("--timing-toast-stay") })
  }, [toastQ, hold])
  React.useEffect(() => {
    if (open === "supplier" && step === 1) focusById("supplier")
    if (open === "sku" && step === 2 && model.items[0]) focusById(rowField(model.items[0].id, "sku"))
    // 仅首帧按 ?open= 聚焦
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const supplierOptions: ComboboxOption[] = mock.suppliers.items.map((s) => ({
    value: s.id,
    label: s.name,
    hint: t("form.supplier.meta", { region: s.region, days: s.leadTimeDays }),
    keywords: `${s.legalName} ${s.region}`,
  }))
  const skuOptions: ComboboxOption[] = mock.skus.items.map((k) => ({
    value: k.sku,
    label: k.name,
    hint: (
      <>
        <span className="font-mono text-xs">{k.sku}</span>
        <span>{t("form.items.sku.meta", { stock: k.stock, safety: k.safetyStock })}</span>
        {k.lowStock ? <Tag tone="warning">{t("form.items.sku.lowStock")}</Tag> : null}
      </>
    ),
    trailing: formatCurrency(k.cost),
    keywords: k.sku,
  }))

  const pickSupplier = (id: string | null) => {
    const s = supplierOf(id)
    if (!s) return
    update({ supplierId: s.id, contact: s.contact, phone: s.phoneDemo, email: s.email, settlement: s.settlement })
  }
  const setRow = (id: number, patch: Partial<Row>) => update({ items: model.items.map((r) => (r.id === id ? { ...r, ...patch } : r)) })
  const removeRow = (id: number) => update({ items: model.items.filter((r) => r.id !== id) })
  const addRow = () => {
    const row: Row = { id: nextId(), sku: "", qty: 1, unitPrice: "" }
    update({ items: [...model.items, row] })
    toast(t("form.toast.rowAdded"), { duration: tokenMs("--timing-toast-stay") })
    pendingFocus.current = rowField(row.id, "sku")
  }
  const setAttachment = (id: number, patch: Partial<Attachment>) => update({ items: model.items, attachments: model.attachments.map((a) => (a.id === id ? { ...a, ...patch } : a)) })
  const addFiles = (files: File[]) => {
    const room = PF.attachments.maxFiles - model.attachments.length
    const added: Attachment[] = files.slice(0, Math.max(0, room)).map((f) => ({ id: nextId(), name: f.name, sizeKB: Math.round(f.size / 1024), status: "done", progress: 100 }))
    if (added.length) update({ attachments: [...model.attachments, ...added] })
  }
  const restTags = PF.tagSuggestions.filter((x) => !model.tags.includes(x))

  const numValue = (v: number | "") => (v === "" ? "" : String(v))
  const parseNum = (s: string) => (s === "" ? "" : Number(s))

  /** 商品行三控件（表格与卡片共用；卡片用 `-m` 后缀 id，首错聚焦取可见者） */
  const skuControl = (r: Row, i: number, suffix: string) => (
    <Combobox
      id={`${rowField(r.id, "sku")}${suffix}`}
      variant="input"
      options={skuOptions}
      value={r.sku || null}
      onChange={(v) => {
        const k = skuOf(v ?? "")
        if (k) setRow(r.id, { sku: k.sku, unitPrice: k.cost })
      }}
      onBlur={blurTouch(rowField(r.id, "sku"))}
      placeholder={t("form.items.sku.placeholder")}
      searchPlaceholder={t("form.items.sku.placeholder")}
      emptyText={t("form.items.sku.empty")}
      invalid={!!errorOf(rowField(r.id, "sku"))}
      aria-label={t("form.items.row.aria", { n: i + 1, field: t("form.items.col.sku") })}
      aria-describedby={errorOf(rowField(r.id, "sku")) ? `${rowField(r.id, "sku")}-err${suffix}` : undefined}
    />
  )
  const skuMeta = (r: Row) => {
    const k = skuOf(r.sku)
    if (!k) return null
    return (
      <span className="flex flex-wrap items-center gap-2 text-role-caption text-fg-muted">
        <span className="font-mono text-xs">{k.sku}</span>
        <span className="whitespace-nowrap">{t("form.items.sku.meta", { stock: k.stock, safety: k.safetyStock })}</span>
        {k.lowStock ? <Tag tone="warning">{t("form.items.sku.lowStock")}</Tag> : null}
      </span>
    )
  }
  const numControl = (r: Row, i: number, key: "qty" | "unitPrice", suffix: string) => {
    const field = rowField(r.id, key)
    const label = t(`form.items.col.${key}`)
    return (
      <div className="relative">
        {key === "unitPrice" ? (
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 grid w-hit place-items-center text-fg-muted">
            ¥
          </span>
        ) : null}
        <Input
          id={`${field}${suffix}`}
          type="number"
          inputMode={key === "qty" ? "numeric" : "decimal"}
          min={key === "qty" ? V.qtyRange[0] : V.unitPriceMin}
          max={key === "qty" ? V.qtyRange[1] : undefined}
          step={key === "qty" ? 1 : 0.01}
          value={numValue(r[key])}
          onChange={(e) => setRow(r.id, { [key]: parseNum(e.target.value) })}
          onBlur={blurTouch(field)}
          aria-label={t("form.items.row.aria", { n: i + 1, field: label })}
          aria-invalid={!!errorOf(field) || undefined}
          aria-describedby={errorOf(field) ? `${field}-err${suffix}` : undefined}
          className={cn("tabular-nums", key === "unitPrice" && "pl-hit")}
        />
      </div>
    )
  }
  const rowErrors = (r: Row, suffix: string) =>
    (["sku", "qty", "unitPrice"] as const).map((k) => (
      <FieldError key={k} id={`${rowField(r.id, k)}-err${suffix}`}>
        {errorOf(rowField(r.id, k))}
      </FieldError>
    ))

  const itemsError = errorOf("items")
  const termsLabel = t("form.terms.label").split("《")

  return (
    <AppShell
      sidebar={sidebar}
      open={open}
      setOpen={(v) => set({ open: v })}
      current="form"
      breadcrumb={{ parent: PARENT_NAV?.label, current: t("form.title") }}
      busy={loading}
      beforeLeave={beforeLeave}
    >
      {success ? (
        <>
          <h1 className="sr-only">{t("form.title")}</h1>
        <Result
          status="success"
          className="gap-3 py-16 mobile:px-4 mobile:py-12 [&>h2]:text-role-display mobile:[&>h2]:text-role-heading [&>div:not(:last-child)]:mt-0 mobile:[&>div:last-child]:w-full mobile:[&>div:last-child]:flex-col mobile:[&>div:last-child]:items-stretch"
          figure={
            <svg aria-hidden viewBox="0 0 128 128" className="mb-4 size-empty-figure shrink-0">
              <circle cx="64" cy="64" r="48" className="fill-success-soft" />
              <circle cx="64" cy="64" r="60" fill="none" strokeWidth={1.5} strokeDasharray="4 6" className="stroke-success opacity-60" />
              <path d="M44 66 58 80 86 50" fill="none" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" className="stroke-success" />
              <circle cx="108" cy="30" r="4" className="fill-primary" />
              <circle cx="20" cy="96" r="3" className="fill-warning" />
            </svg>
          }
          title={t("form.success.title")}
          description={(() => {
            const desc =
              supplier && warehouse && slot
                ? t("form.success.description", { po: "\u0000", supplier: supplier.name, contact: model.contact, date: model.arrivalDate ?? "", slot: slot.label.split(" ")[0], warehouse: warehouse.label })
                : PF.success.description.replace(PF.poNumberNext, "\u0000")
            const [a, b] = desc.split("\u0000")
            return (
              <>
                {a}
                <span className="font-mono tabular-nums">{PF.poNumberNext}</span>
                {b}
              </>
            )
          })()}
          actions={
            <>
              <Button id="viewPo" type="button" onClick={() => toast.info(t("shell.nav.disabled.tip"), { duration: tokenMs("--timing-toast-stay") })}>
                <EyeIcon aria-hidden />
                {t("form.success.primary")}
              </Button>
              <Button type="button" variant="secondary" onClick={reset}>
                <PlusIcon aria-hidden />
                {t("form.success.secondary")}
              </Button>
            </>
          }
        >
          <p className="text-center text-role-caption text-fg-muted">{t("form.success.sentTo", { email: model.email })}</p>
        </Result>
        </>
      ) : (
        <>
          <header data-slot="page-header" className="flex flex-wrap items-end justify-between gap-4 mobile:flex-col mobile:items-stretch">
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="text-role-display mobile:text-role-heading">{t("form.title")}</h1>
              <p className="text-role-caption wrap-anywhere text-fg-muted">
                {(() => {
                  const [a, b] = t("form.subtitle", { po: "\u0000" }).split("\u0000")
                  return (
                    <>
                      {a}
                      <span className="font-mono text-sm leading-snug tabular-nums">{PF.poNumberNext}</span>
                      {b}
                    </>
                  )
                })()}
              </p>
            </div>
          </header>
          <Stepper
            aria-label={t("form.stepper.aria")}
            steps={steps}
            current={step - 1}
            reached={reached - 1}
            errorAt={errors.length ? step - 1 : undefined}
            statusLabels={statusLabels}
            disabled={loading}
            onStepChange={onStepChange}
            className="mobile:hidden"
          />
          <div aria-hidden className="hidden flex-col gap-2 mobile:flex">
            <div className="flex items-baseline justify-between gap-3">
              <strong className={cn("text-role-title", errors.length ? "text-danger" : "text-fg")}>{steps[step - 1].label}</strong>
              <span className="text-role-caption text-fg-muted tabular-nums">{t("form.stepper.step", { n: step })}</span>
            </div>
            <div className="h-track overflow-hidden rounded-full bg-surface-muted">
              <span className={cn("block h-full rounded-full bg-primary transition-[width] duration-(--motion-base) ease-std", step === 1 && "w-1/3", step === 2 && "w-2/3", step === 3 && "w-full")} />
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_calc(var(--size-content-max)/4)] items-start gap-6 tablet:grid-cols-1 tablet:gap-4 rail:tablet:grid-cols-[minmax(0,1fr)_calc(var(--size-content-max)/4)] rail:tablet:gap-6 mobile:grid-cols-1!">
            <form
              data-slot="card"
              noValidate
              autoComplete="off"
              aria-busy={loading || undefined}
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
              className={cn(CARD, "flex flex-col gap-6 tablet:order-2 rail:tablet:order-none mobile:order-2! mobile:pb-0")}
            >
                {errors.length ? (
                  <Alert
                    variant="danger"
                    className={ALERT_INLINE}
                    actions={
                      <Button type="button" variant="ghost" onClick={() => focusFirstError(errors)} className="text-danger hover:not-disabled:text-danger">
                        {t("form.invalid.goto")}
                      </Button>
                    }
                  >
                    <strong className="text-role-label text-danger">{t("form.invalid.summary", { n: errors.length })}</strong>
                  </Alert>
                ) : null}
                {state === "error" && submitAlert ? (
                  <Alert
                    variant="danger"
                    className={ALERT}
                    closeLabel={t("form.error.dismiss")}
                    onClose={() => {
                      setSubmitAlert(false)
                      set({ state: null })
                    }}
                    wrapActions
                    actions={
                      <Button id="retryBtn" type="button" variant="secondary" onClick={submit}>
                        <RefreshCwIcon aria-hidden />
                        {t("form.error.retry")}
                      </Button>
                    }
                  >
                    <strong className="text-role-label text-danger">{t("form.error.title")}</strong>
                    <AlertDescription>{V.submitError}</AlertDescription>
                  </Alert>
                ) : null}

                <fieldset disabled={loading} inert={loading || undefined} className="m-0 flex min-w-0 flex-col gap-6 border-0 p-0 aria-disabled:opacity-100">
                  {step === 1 ? (
                    <section aria-labelledby="p1Title" className="flex flex-col gap-6 mobile:gap-4">
                      <PanelHead id="p1Title" title={steps[0].label} description={steps[0].description} />
                      <div className="grid grid-cols-2 items-start gap-6 tablet:gap-4 mobile:grid-cols-1">
                        <Field className="col-span-2 mobile:col-span-1">
                          <FieldLabel htmlFor="supplier">
                            {t("form.supplier.label")}
                            <Required />
                          </FieldLabel>
                          <Combobox
                            id="supplier"
                            variant="input"
                            options={supplierOptions}
                            value={model.supplierId}
                            onChange={pickSupplier}
                            onBlur={blurTouch("supplier")}
                            placeholder={t("form.supplier.placeholder")}
                            searchPlaceholder={t("form.supplier.placeholder")}
                            emptyText={t("form.supplier.empty")}
                            invalid={!!errorOf("supplier")}
                            aria-describedby={cn(supplier && "supplierHint", errorOf("supplier") && "supplierErr") || undefined}
                          />
                          {supplier ? (
                            <FieldDescription id="supplierHint" className="flex items-center gap-1 [&_svg]:size-icon-sm">
                              <InfoIcon aria-hidden />
                              {t("form.supplier.selectedHint")}
                            </FieldDescription>
                          ) : null}
                          <FieldError id="supplierErr">{errorOf("supplier")}</FieldError>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="contact">
                            {t("form.contact.label")}
                            <Required />
                          </FieldLabel>
                          <Input
                            id="contact"
                            value={model.contact}
                            onChange={(e) => update({ contact: e.target.value })}
                            onBlur={blurTouch("contact")}
                            placeholder={t("form.contact.placeholder")}
                            aria-invalid={!!errorOf("contact") || undefined}
                            aria-describedby={errorOf("contact") ? "contactErr" : undefined}
                          />
                          <FieldError id="contactErr">{errorOf("contact")}</FieldError>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="phone">
                            {t("form.phone.label")}
                            <Required />
                          </FieldLabel>
                          <div className="grid grid-cols-[max-content_minmax(0,1fr)] gap-2 rail:tablet:grid-cols-1">
                            <Select id="phoneCountry" aria-label={t("form.phone.country.aria")} value={model.phoneCountryCode} onChange={(e) => update({ phoneCountryCode: e.target.value })}>
                              {PF.phoneCountryCodes.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.code} {c.label}
                                </option>
                              ))}
                            </Select>
                            <Input
                              id="phone"
                              type="tel"
                              inputMode="numeric"
                              maxLength={11}
                              value={model.phone}
                              onChange={(e) => update({ phone: e.target.value.replace(/\D/g, "") })}
                              onBlur={blurTouch("phone")}
                              placeholder={t("form.phone.placeholder")}
                              aria-invalid={!!errorOf("phone") || undefined}
                              aria-describedby={errorOf("phone") ? "phoneErr" : undefined}
                              className="tabular-nums"
                            />
                          </div>
                          <FieldError id="phoneErr">{errorOf("phone")}</FieldError>
                        </Field>
                        <Field className="col-span-2 mobile:col-span-1">
                          <FieldLabel htmlFor="email">
                            {t("form.email.label")}
                            <Required />
                          </FieldLabel>
                          <Input
                            id="email"
                            type="email"
                            value={model.email}
                            onChange={(e) => update({ email: e.target.value })}
                            onBlur={blurTouch("email")}
                            placeholder={t("form.email.placeholder")}
                            aria-invalid={!!errorOf("email") || undefined}
                            aria-describedby={cn("emailHint", errorOf("email") && "emailErr")}
                          />
                          <FieldDescription id="emailHint">{t("form.email.hint")}</FieldDescription>
                          <FieldError id="emailErr">{errorOf("email")}</FieldError>
                        </Field>
                        <fieldset className="col-span-2 m-0 grid gap-2 border-0 p-0 mobile:col-span-1" aria-describedby={errorOf("settlement") ? "settlementErr" : undefined}>
                          <legend className="block text-role-label text-fg">
                            {t("form.settlement.label")}
                            <Required />
                          </legend>
                          <RadioGroup
                            value={model.settlement}
                            onValueChange={(v) => update({ settlement: v })}
                            aria-invalid={!!errorOf("settlement") || undefined}
                            className="grid grid-cols-[repeat(auto-fill,minmax(calc(var(--size-form-max)/2),1fr))] gap-3 mobile:grid-cols-1"
                          >
                            {PF.settlementMethods.map((o) => (
                              <label
                                key={o.key}
                                htmlFor={`settlement-${o.key}`}
                                className={cn(
                                  "flex min-h-hit cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-role-body transition-colors duration-(--motion-fast) ease-std hover:border-fg-muted has-checked:border-primary has-checked:bg-primary-soft has-disabled:cursor-not-allowed",
                                  errorOf("settlement") && "border-danger",
                                )}
                              >
                                <RadioGroupItem id={`settlement-${o.key}`} value={o.key} onBlur={blurTouch("settlement")} className="mt-hairline" />
                                <span className="flex min-w-0 flex-col gap-1">
                                  <strong className="text-role-label">{o.label}</strong>
                                  <span className="text-role-caption text-fg-muted">{o.hint}</span>
                                </span>
                              </label>
                            ))}
                          </RadioGroup>
                          <FieldError id="settlementErr">{errorOf("settlement")}</FieldError>
                        </fieldset>
                        <label htmlFor="invoice" className="flex min-h-hit cursor-pointer items-start gap-3 py-2 text-role-body select-none has-disabled:cursor-not-allowed">
                          <Checkbox id="invoice" checked={model.needInvoice} onCheckedChange={(c) => update({ needInvoice: c === true })} aria-describedby="invoiceHint" className="mt-hairline" />
                          <span className="flex flex-col gap-1">
                            <strong className="text-role-label">{t("form.invoice.label")}</strong>
                            <span id="invoiceHint" className="text-role-caption text-fg-muted">
                              {t("form.invoice.hint")}
                            </span>
                          </span>
                        </label>
                        <label htmlFor="urgent" className="flex min-h-hit cursor-pointer items-start justify-between gap-4 py-2 text-role-body select-none has-disabled:cursor-not-allowed">
                          <span className="flex min-w-0 flex-col gap-1">
                            <strong className="text-role-label">{t("form.urgent.label")}</strong>
                            <span id="urgentHint" className="text-role-caption text-fg-muted">
                              {t("form.urgent.hint")}
                            </span>
                          </span>
                          <span className="inline-grid size-hit shrink-0 place-items-center">
                            <Switch id="urgent" checked={model.urgent} onCheckedChange={(c) => update({ urgent: c })} aria-describedby="urgentHint" />
                          </span>
                        </label>
                        <Field className="col-span-2 mobile:col-span-1">
                          <div className="flex items-center justify-between gap-3">
                            <FieldLabel htmlFor="note">
                              {t("form.note.label")}
                              <Optional />
                            </FieldLabel>
                            <CharCounter id="noteCounter" value={model.note.length} max={V.noteMax}>
                              {t("form.note.counter", { n: model.note.length, max: V.noteMax })}
                            </CharCounter>
                          </div>
                          <Textarea
                            id="note"
                            rows={3}
                            value={model.note}
                            onChange={(e) => update({ note: e.target.value })}
                            onBlur={blurTouch("note")}
                            placeholder={t("form.note.placeholder")}
                            aria-invalid={!!errorOf("note") || undefined}
                            aria-describedby={cn("noteCounter", errorOf("note") && "noteErr")}
                          />
                          <FieldError id="noteErr">{errorOf("note")}</FieldError>
                        </Field>
                      </div>
                    </section>
                  ) : null}

                  {step === 2 ? (
                    <section aria-labelledby="p2Title" className="flex flex-col gap-6 mobile:gap-4">
                      <PanelHead id="p2Title" title={steps[1].label} description={steps[1].description} />
                      <div id="items" className="flex flex-col gap-3">
                        <div className="flex items-end justify-between gap-3">
                          <h3 className="text-role-title">{t("form.items.title")}</h3>
                          <span className="text-role-caption text-fg-muted tabular-nums">{countText}</span>
                        </div>
                        <Table className="table-fixed mobile:hidden [&_td]:px-2 [&_th]:h-table-header [&_th]:px-2 tablet:[&_td]:px-1 tablet:[&_th]:px-1">
                          <TableHeader>
                            <TableRow className="hover:[&>td]:bg-transparent">
                              <TableHead scope="col">{t("form.items.col.sku")}</TableHead>
                              <TableHead scope="col" className="w-20 tablet:w-[calc(var(--space-16)+var(--space-2))]">
                                {t("form.items.col.qty")}
                              </TableHead>
                              <TableHead scope="col" className="w-[calc(var(--space-20)+var(--space-12))] tablet:w-[calc(var(--space-20)+var(--space-6))]">
                                {t("form.items.col.unitPrice")}
                              </TableHead>
                              <TableHead scope="col" className="w-[calc(var(--space-20)+var(--space-8))] text-right tablet:w-[calc(var(--space-20)+var(--space-4))]">
                                {t("form.items.col.subtotal")}
                              </TableHead>
                              <TableHead scope="col" className="w-hit">
                                <span className="sr-only">{t("form.items.col.remove")}</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {model.items.map((r, i) => {
                              const hasRowError = !!(errorOf(rowField(r.id, "sku")) || errorOf(rowField(r.id, "qty")) || errorOf(rowField(r.id, "unitPrice")))
                              return (
                                <React.Fragment key={r.id}>
                                  <TableRow className={cn("hover:[&>td]:bg-transparent", hasRowError && "[&>td]:border-b-0 [&>td]:pb-2")}>
                                    <TableCell className="whitespace-normal align-top">
                                      <div className="grid gap-2">
                                        {skuControl(r, i, "")}
                                        {skuMeta(r)}
                                      </div>
                                    </TableCell>
                                    <TableCell className="align-top">{numControl(r, i, "qty", "")}</TableCell>
                                    <TableCell className="align-top">{numControl(r, i, "unitPrice", "")}</TableCell>
                                    <TableCell className="text-right align-top text-role-label tabular-nums [&]:pt-[calc(var(--space-3)+(var(--size-control-md)-var(--font-size-sm)*var(--font-line-height-snug))/2)]">
                                      {formatCurrency(rowSubtotal(r))}
                                    </TableCell>
                                    <TableCell className="align-top">
                                      <IconButton label={t("form.items.removeRow", { n: i + 1 })} onClick={() => removeRow(r.id)} className="hover:not-disabled:bg-danger-soft hover:not-disabled:text-danger">
                                        <Trash2Icon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                  {hasRowError ? (
                                    <TableRow className="hover:[&>td]:bg-transparent">
                                      <TableCell colSpan={5} className="whitespace-normal pt-0">
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">{rowErrors(r, "")}</div>
                                      </TableCell>
                                    </TableRow>
                                  ) : null}
                                </React.Fragment>
                              )
                            })}
                          </TableBody>
                        </Table>
                        <div className="hidden flex-col gap-3 mobile:flex">
                          {model.items.map((r, i) => (
                            <div key={r.id} className="grid grid-cols-2 gap-x-3 gap-y-3 rounded-md border p-3">
                              <Field className="col-span-2">
                                <span className="text-role-label">{t("form.items.col.sku")}</span>
                                {skuControl(r, i, "-m")}
                                {skuMeta(r)}
                                <FieldError id={`${rowField(r.id, "sku")}-err-m`}>{errorOf(rowField(r.id, "sku"))}</FieldError>
                              </Field>
                              <Field>
                                <span className="text-role-label">{t("form.items.col.qty")}</span>
                                {numControl(r, i, "qty", "-m")}
                                <FieldError id={`${rowField(r.id, "qty")}-err-m`}>{errorOf(rowField(r.id, "qty"))}</FieldError>
                              </Field>
                              <Field>
                                <span className="text-role-label">{t("form.items.col.unitPrice")}</span>
                                {numControl(r, i, "unitPrice", "-m")}
                                <FieldError id={`${rowField(r.id, "unitPrice")}-err-m`}>{errorOf(rowField(r.id, "unitPrice"))}</FieldError>
                              </Field>
                              <div className="col-span-2 flex items-center gap-3 border-t pt-2">
                                <span className="text-role-caption text-fg-muted">{t("form.items.col.subtotal")}</span>
                                <span className="flex-1 text-right text-role-title tabular-nums">{formatCurrency(rowSubtotal(r))}</span>
                                <IconButton label={t("form.items.removeRow", { n: i + 1 })} onClick={() => removeRow(r.id)} className="-mr-2 hover:not-disabled:bg-danger-soft hover:not-disabled:text-danger">
                                  <Trash2Icon />
                                </IconButton>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FieldError id="itemsErr">{itemsError}</FieldError>
                        <div className="flex flex-wrap items-center justify-between gap-4 mobile:flex-col-reverse mobile:items-stretch mobile:gap-3">
                          <Button id="addRow" type="button" variant="ghost" onClick={addRow} aria-describedby={itemsError ? "itemsErr" : undefined} className="-ml-3 mobile:ml-0 mobile:justify-start">
                            <PlusIcon aria-hidden />
                            {t("form.items.add")}
                          </Button>
                          <div className="flex flex-col items-end gap-1 text-right tabular-nums mobile:items-start mobile:text-left">
                            <span className="text-role-caption text-fg-muted">{countText}</span>
                            <strong className="text-role-title">
                              {t("form.items.total")} {formatCurrency(goodsTotal(model))}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div role="presentation" className="mt-2 h-hairline bg-border" />

                      <div className="grid grid-cols-2 items-start gap-6 tablet:gap-4 mobile:grid-cols-1">
                        <Field>
                          <FieldLabel htmlFor="warehouse">
                            {t("form.warehouse.label")}
                            <Required />
                          </FieldLabel>
                          <Select
                            id="warehouse"
                            leading={<WarehouseIcon />}
                            value={model.warehouse}
                            onChange={(e) => update({ warehouse: e.target.value })}
                            onBlur={blurTouch("warehouse")}
                            invalid={!!errorOf("warehouse")}
                            aria-describedby={cn(warehouse && "warehouseHint", errorOf("warehouse") && "warehouseErr") || undefined}
                          >
                            {PF.warehouses.map((w) => (
                              <option key={w.key} value={w.key}>
                                {w.label}
                              </option>
                            ))}
                          </Select>
                          {warehouse ? <FieldDescription id="warehouseHint">{t("form.warehouse.address", { address: warehouse.address })}</FieldDescription> : null}
                          <FieldError id="warehouseErr">{errorOf("warehouse")}</FieldError>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="arrival">
                            {t("form.arrivalDate.label")}
                            <Required />
                          </FieldLabel>
                          <DatePicker
                            id="arrival"
                            value={model.arrivalDate}
                            onChange={(d) => {
                              update({ arrivalDate: d })
                              touch("arrival")
                            }}
                            today={TODAY}
                            min={TOMORROW}
                            placeholder={t("form.arrivalDate.placeholder")}
                            labels={{ prevMonth: t("form.arrivalDate.prevMonth"), nextMonth: t("form.arrivalDate.nextMonth") }}
                            iconPosition="leading"
                            invalid={!!errorOf("arrival")}
                            aria-describedby={cn(supplier && "arrivalHint", errorOf("arrival") && "arrivalErr") || undefined}
                          />
                          {supplier && suggestDate ? (
                            arrivalEarly ? (
                              <FieldDescription id="arrivalHint" className="flex items-start gap-1 text-warning [&_svg]:mt-hairline [&_svg]:size-icon-sm [&_svg]:shrink-0">
                                <TriangleAlertIcon aria-hidden />
                                <span>{V.arrivalLeadTime.replace("{days}", String(supplier.leadTimeDays))}</span>
                              </FieldDescription>
                            ) : (
                              <FieldDescription id="arrivalHint" className="tabular-nums">
                                {t("form.arrivalDate.hint", { days: supplier.leadTimeDays, date: suggestDate })}
                              </FieldDescription>
                            )
                          ) : null}
                          <FieldError id="arrivalErr">{errorOf("arrival")}</FieldError>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="slot">
                            {t("form.slot.label")}
                            <Required />
                          </FieldLabel>
                          <Select id="slot" value={model.slot} onChange={(e) => update({ slot: e.target.value })} onBlur={blurTouch("slot")} invalid={!!errorOf("slot")} aria-describedby={errorOf("slot") ? "slotErr" : undefined}>
                            {PF.deliverySlots.map((s) => (
                              <option key={s.key} value={s.key}>
                                {s.label}
                              </option>
                            ))}
                          </Select>
                          <FieldError id="slotErr">{errorOf("slot")}</FieldError>
                        </Field>
                        <Field className="col-span-2 mobile:col-span-1">
                          <div className="flex items-center justify-between gap-3">
                            <span id="freightLabel" className="text-role-label">
                              {t("form.freight.label")}
                            </span>
                            <span id="freightValue" className="text-role-label tabular-nums">
                              {freightText}
                            </span>
                          </div>
                          <div id="range" role="group" aria-labelledby="freightLabel" className="grid gap-2 px-2">
                            <Slider
                              min={PF.freight.min}
                              max={PF.freight.max}
                              step={PF.freight.step}
                              minStepsBetweenThumbs={1}
                              value={model.freight}
                              onValueChange={(v) => update({ freight: [v[0] ?? model.freight[0], v[1] ?? model.freight[1]] })}
                              thumbLabels={[t("form.freight.min"), t("form.freight.max")]}
                              aria-describedby="freightHint"
                            />
                            <div aria-hidden className="flex justify-between text-role-caption text-fg-muted tabular-nums">
                              <span>{formatCurrencyWhole(PF.freight.min)}</span>
                              <span>{formatCurrencyWhole(PF.freight.max)}</span>
                            </div>
                          </div>
                          <FieldDescription id="freightHint">{t("form.freight.hint")}</FieldDescription>
                        </Field>
                        <Field className="col-span-2 mobile:col-span-1">
                          <span id="attachLabel" className="text-role-label">
                            {t("form.attachments.label")}
                            <Optional />
                          </span>
                          <FileDropzone
                            id="dropzone"
                            title={t("form.attachments.dropzone")}
                            hint={t("form.attachments.accept")}
                            accept={PF.attachments.accept.join(",")}
                            multiple
                            onFiles={addFiles}
                            aria-labelledby="attachLabel"
                            className="bg-bg [&_svg]:text-primary"
                          />
                          {model.attachments.length ? (
                            <ul aria-label={t("form.attachments.label")} className="mt-2 grid">
                              {model.attachments.map((a) => (
                                <FileItem
                                  key={a.id}
                                  name={a.name}
                                  size={formatFileSize(a.sizeKB)}
                                  status={a.status}
                                  progress={a.progress}
                                  error={a.error}
                                  icon={<FileTypeIcon name={a.name} />}
                                  statusLabels={{ uploading: t("form.attachments.uploading", { percent: a.progress ?? 0 }), done: t("form.attachments.done") }}
                                  removeLabel={t("form.attachments.remove", { name: a.name })}
                                  onRemove={() => update({ attachments: model.attachments.filter((x) => x.id !== a.id) })}
                                  actions={
                                    a.status === "error" ? (
                                      <Button type="button" variant="ghost" size="sm" onClick={() => setAttachment(a.id, { status: "uploading", progress: 0, error: undefined })}>
                                        {t("form.attachments.retry")}
                                      </Button>
                                    ) : undefined
                                  }
                                />
                              ))}
                            </ul>
                          ) : null}
                        </Field>
                        <Field className="col-span-2 mobile:col-span-1">
                          <FieldLabel htmlFor="tagInput">
                            {t("form.tags.label")}
                            <Optional />
                          </FieldLabel>
                          <TagInput id="tagInput" value={model.tags} onChange={(tags) => update({ tags })} removeLabel={(tag) => t("form.tags.remove", { tag })} placeholder={t("form.tags.placeholder")} chipTone="primary" />
                          {restTags.length ? (
                            <div className="flex min-h-hit flex-wrap items-center gap-x-2 gap-y-3 py-1.5 text-role-caption text-fg-muted">
                              <span>{t("form.tags.suggestions")}</span>
                              {restTags.map((x) => (
                                <button
                                  key={x}
                                  type="button"
                                  onClick={() => update({ tags: [...model.tags, x] })}
                                  className="hit-area inline-flex h-chip items-center rounded-full border bg-surface px-3 text-role-caption text-fg transition-colors duration-(--motion-fast) ease-std hover:border-primary hover:bg-primary-soft hover:text-on-primary-soft"
                                >
                                  {x}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </Field>
                      </div>
                    </section>
                  ) : null}

                  {step === 3 ? (
                    <section aria-labelledby="p3Title" className="flex flex-col gap-6 mobile:gap-4">
                      <PanelHead id="p3Title" title={t("form.summary.title")} description={steps[2].description} />
                      <div className="flex flex-col gap-4">
                        <section aria-labelledby="sumBasicTitle" className={SUM_SECTION}>
                          <SummaryHead id="sumBasicTitle" title={t("form.summary.section.basic")} onEdit={() => goStep(1)} disabled={loading} />
                          <DescriptionList cols={2} className={SUM_DL}>
                            <DescriptionTerm>{t("form.summary.field.supplier")}</DescriptionTerm>
                            <DescriptionDetails className="col-[2/-1]">{supplier?.name ?? "—"}</DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.contact")}</DescriptionTerm>
                            <DescriptionDetails className="tabular-nums">
                              {model.contact || "—"}
                              {model.phone ? ` · ${model.phoneCountryCode} ${model.phone}` : ""}
                            </DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.email")}</DescriptionTerm>
                            <DescriptionDetails className="wrap-anywhere">{model.email || "—"}</DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.settlement")}</DescriptionTerm>
                            <DescriptionDetails>{settlement?.label ?? "—"}</DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.invoice")}</DescriptionTerm>
                            <DescriptionDetails>{model.needInvoice ? t("form.yes") : t("form.no")}</DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.urgent")}</DescriptionTerm>
                            <DescriptionDetails>{model.urgent ? t("form.bool.true") : t("form.bool.false")}</DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.note")}</DescriptionTerm>
                            <DescriptionDetails className="col-[2/-1]">{model.note || "—"}</DescriptionDetails>
                          </DescriptionList>
                        </section>
                        <section aria-labelledby="sumGoodsTitle" className={SUM_SECTION}>
                          <SummaryHead id="sumGoodsTitle" title={t("form.summary.section.goods")} onEdit={() => goStep(2)} disabled={loading} />
                          <Table className="[&_th]:px-2">
                            <TableHeader>
                              <TableRow className="hover:[&>td]:bg-transparent">
                                <TableHead scope="col" className="px-2">{t("form.items.col.sku")}</TableHead>
                                <TableHead scope="col" className="px-2 text-right">
                                  {t("form.items.col.qty")}
                                </TableHead>
                                <TableHead scope="col" className="px-2 text-right mobile:hidden">
                                  {t("form.items.col.unitPrice")}
                                </TableHead>
                                <TableHead scope="col" className="px-2 text-right">
                                  {t("form.items.col.subtotal")}
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {model.items.map((r) => {
                                const k = skuOf(r.sku)
                                return (
                                  <TableRow key={r.id} className="hover:[&>td]:bg-transparent">
                                    <TableCell className="h-table-row-compact p-2 whitespace-normal">
                                      <span>{k ? k.name : r.sku || "—"}</span>
                                      <span className="block font-mono text-role-caption text-fg-muted">{r.sku}</span>
                                    </TableCell>
                                    <TableCell className="h-table-row-compact p-2 text-right tabular-nums">{r.qty || 0}</TableCell>
                                    <TableCell className="h-table-row-compact p-2 text-right tabular-nums mobile:hidden">{formatCurrency(Number(r.unitPrice) || 0)}</TableCell>
                                    <TableCell className="h-table-row-compact p-2 text-right tabular-nums">{formatCurrency(rowSubtotal(r))}</TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </section>
                        <section aria-labelledby="sumDeliveryTitle" className={SUM_SECTION}>
                          <SummaryHead id="sumDeliveryTitle" title={t("form.summary.section.delivery")} onEdit={() => goStep(2)} disabled={loading} />
                          <DescriptionList cols={2} className={SUM_DL}>
                            <DescriptionTerm>{t("form.summary.field.warehouse")}</DescriptionTerm>
                            <DescriptionDetails className="col-[2/-1]">
                              {warehouse ? (
                                <>
                                  {warehouse.label}
                                  <span className="block text-role-caption text-fg-muted">{warehouse.address}</span>
                                </>
                              ) : (
                                "—"
                              )}
                            </DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.arrival")}</DescriptionTerm>
                            <DescriptionDetails className="tabular-nums">
                              {model.arrivalDate ?? "—"}
                              {slot ? ` ${slot.label}` : ""}
                            </DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.freight")}</DescriptionTerm>
                            <DescriptionDetails className="tabular-nums">{freightText}</DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.attachments")}</DescriptionTerm>
                            <DescriptionDetails className="tabular-nums">{t("form.summary.attachmentsCount", { n: doneAttachments(model).length })}</DescriptionDetails>
                            <DescriptionTerm>{t("form.summary.field.tags")}</DescriptionTerm>
                            <DescriptionDetails>
                              {model.tags.length ? (
                                <span className="flex flex-wrap gap-2">
                                  {model.tags.map((x) => (
                                    <Tag key={x} tone="neutral">
                                      {x}
                                    </Tag>
                                  ))}
                                </span>
                              ) : (
                                "—"
                              )}
                            </DescriptionDetails>
                          </DescriptionList>
                        </section>
                        <dl className="grid gap-2 rounded-md bg-surface-muted px-5 py-4 tabular-nums mobile:px-4 mobile:py-3">
                          <div className="flex items-center justify-between gap-6">
                            <dt className="text-fg-muted">{t("form.summary.total.goods")}</dt>
                            <dd className="whitespace-nowrap">{formatCurrency(goodsTotal(model))}</dd>
                          </div>
                          <div className="flex items-center justify-between gap-6">
                            <dt className="text-fg-muted">{t("form.summary.total.freight")}</dt>
                            <dd className="whitespace-nowrap">{freightText}</dd>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between gap-4 border-t pt-2">
                            <dt className="text-role-label">{t("form.summary.total.grand")}</dt>
                            <dd className="text-role-heading whitespace-nowrap">{formatCurrency(grandTotal(model))}</dd>
                          </div>
                        </dl>
                        <Field id="fTerms" className="mt-2">
                          <label htmlFor="terms" className="flex min-h-hit cursor-pointer items-center gap-3 text-role-body select-none has-disabled:cursor-not-allowed">
                            <Checkbox
                              id="terms"
                              checked={model.terms}
                              onCheckedChange={(c) => {
                                setModel((m) => ({ ...m, terms: c === true }))
                                if (c === true) setTouched(new Set())
                              }}
                              aria-invalid={!!errorOf("terms") || undefined}
                              aria-describedby={errorOf("terms") ? "termsErr" : undefined}
                            />
                            <span className="text-role-label">
                              {termsLabel[0]}
                              <button
                                type="button"
                                aria-haspopup="dialog"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setLocal("terms")
                                }}
                                className="inline-flex min-h-hit items-center rounded-sm text-link underline-offset-4 hover:underline"
                              >
                                《{termsLabel[1]}
                              </button>
                            </span>
                          </label>
                          <FieldError id="termsErr">{errorOf("terms")}</FieldError>
                        </Field>
                      </div>
                    </section>
                  ) : null}
                </fieldset>

                <div
                  data-slot="form-actions"
                  className="mt-2 flex items-center gap-3 border-t pt-5 mobile:sticky mobile:bottom-0 mobile:z-10 mobile:-mx-4 mobile:mt-0 mobile:bg-surface mobile:px-4 mobile:py-3"
                >
                  <Button type="button" variant="secondary" disabled={step === 1 || loading} onClick={() => goStep((step - 1) as Step)} aria-label={t("form.nav.prev")} className="mobile:px-3">
                    <ArrowLeftIcon aria-hidden />
                    <span className="mobile:hidden">{t("form.nav.prev")}</span>
                  </Button>
                  <span className="flex-1 mobile:hidden" />
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={loading}
                    onClick={() => {
                      setDirty(false)
                      toast.success(t("form.toast.draftSaved"), { duration: tokenMs("--timing-toast-stay") })
                    }}
                    className="mobile:ml-auto"
                  >
                    <SaveIcon aria-hidden />
                    {t("form.nav.saveDraft")}
                  </Button>
                  {step < 3 ? (
                    <Button type="button" disabled={loading} onClick={() => advance()} className="mobile:flex-1">
                      {t("form.nav.next")}
                      <ArrowRightIcon aria-hidden />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      loading={loading}
                      aria-disabled={!model.terms && !loading ? true : undefined}
                      className="mobile:flex-1 aria-disabled:cursor-not-allowed aria-disabled:border-border aria-disabled:bg-surface aria-disabled:text-fg-muted aria-disabled:hover:bg-surface"
                    >
                      {loading ? null : <SendIcon aria-hidden />}
                      {loading ? t("form.nav.submitting") : t("form.nav.submit")}
                    </Button>
                  )}
                </div>
            </form>

            <aside
              data-slot="card"
              aria-label={t("form.aside.aria")}
              inert={loading || undefined}
              className={cn(
                CARD,
                "sticky top-[calc(var(--size-topbar)+var(--space-6))] flex flex-col gap-4 tablet:static tablet:order-1 tablet:gap-3 rail:tablet:sticky rail:tablet:order-none rail:tablet:gap-4 mobile:static! mobile:order-1! mobile:gap-3!",
              )}
            >
                <div className="font-mono text-sm text-fg-muted tabular-nums">{PF.poNumberNext}</div>
                <dl className="grid gap-3 tablet:grid-cols-2 tablet:gap-x-4 rail:tablet:grid-cols-1 mobile:grid-cols-2!">
                  <div className={ASIDE_ROW}>
                    <dt className={ASIDE_DT}>{t("form.summary.field.supplier")}</dt>
                    <dd className={ASIDE_DD}>{supplier?.name ?? "—"}</dd>
                  </div>
                  <div className={ASIDE_ROW}>
                    <dt className={ASIDE_DT}>{t("form.summary.total.goods")}</dt>
                    <dd className={cn(ASIDE_DD, "tabular-nums")}>
                      <span>{formatCurrency(goodsTotal(model))}</span>
                      <span className="mt-1 block text-role-caption text-fg-muted tablet:hidden rail:tablet:block mobile:hidden!">{countText}</span>
                    </dd>
                  </div>
                  <div className={ASIDE_ROW}>
                    <dt className={ASIDE_DT}>{t("form.summary.total.freight")}</dt>
                    <dd className={cn(ASIDE_DD, "tabular-nums")}>{freightText}</dd>
                  </div>
                  <div className={cn(ASIDE_ROW, "mt-1 border-t pt-3 tablet:mt-0 tablet:border-t-0 tablet:pt-0 rail:tablet:mt-1 rail:tablet:border-t rail:tablet:pt-3 mobile:mt-0! mobile:border-t-0! mobile:pt-0!")}>
                    <dt className={cn(ASIDE_DT, "text-role-label text-fg tablet:text-role-caption tablet:font-medium rail:tablet:text-role-label mobile:text-role-caption! mobile:font-medium!")}>{t("form.summary.total.grand")}</dt>
                    <dd className={cn(ASIDE_DD, "text-role-heading tabular-nums tablet:text-role-title rail:tablet:text-role-heading mobile:text-role-title!")}>{formatCurrency(grandTotal(model))}</dd>
                  </div>
                </dl>
            </aside>
          </div>
        </>
      )}

      <Dialog {...overlay("terms")}>
        <DialogContent closeLabel={t("form.terms.dialog.closeAria")} aria-describedby={undefined} onOpenAutoFocus={focusDialogClose} className={CENTERED_DIALOG}>
          <DialogHeader>
            <DialogTitle>{t("form.terms.dialog.title")}</DialogTitle>
          </DialogHeader>
          <ol className="flex flex-col gap-3 text-role-body text-fg">
            {PF.terms.map((line, i) => (
              <li key={line} className="grid grid-cols-[var(--size-avatar-sm)_minmax(0,1fr)] items-start gap-3">
                <span aria-hidden className="inline-flex size-avatar-sm items-center justify-center rounded-full bg-primary-soft text-role-caption font-semibold text-on-primary-soft">
                  {i + 1}
                </span>
                <p className="wrap-anywhere">{line}</p>
              </li>
            ))}
          </ol>
          <DialogFooter className="mt-0 mobile:flex-col-reverse mobile:items-stretch">
            <DialogClose asChild>
              <Button type="button">{t("form.terms.dialog.close")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog {...overlay("leave")}>
        <AlertDialogContent closeLabel={t("form.leave.closeAria")} onOpenAutoFocus={focusDialogClose} className={CENTERED_DIALOG}>
          <AlertDialogHeader className="gap-4 pr-hit">
            <AlertDialogTitle>{t("form.leave.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("form.leave.description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-0 mobile:flex-col-reverse mobile:items-stretch">
            <AlertDialogCancel>{t("form.leave.stay")}</AlertDialogCancel>
            <AlertDialogAction variant="danger" onClick={() => navigate(leaveTo)}>
              {t("form.leave.leave")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  )
}
