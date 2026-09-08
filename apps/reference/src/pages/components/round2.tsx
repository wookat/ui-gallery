import * as React from "react"
import { LayoutGridIcon, ListIcon, MoreHorizontalIcon } from "lucide-react"

import { ChatBubble, Composer, ConversationItem, SourceChip, SuggestionChip, ToolCall } from "@/components/composed/chat"
import { CodeBlock } from "@/components/composed/code-block"
import { PageHeader, Toolbar, ToolbarSpacer } from "@/components/composed/page-header"
import { PricingCard } from "@/components/composed/pricing-card"
import { Result } from "@/components/composed/result"
import { SearchInput } from "@/components/composed/search-input"
import { Stepper } from "@/components/composed/stepper"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CountBadge, Tag } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar, DatePicker } from "@/components/ui/calendar"
import { Combobox } from "@/components/ui/combobox"
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/ui/description-list"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerTrigger } from "@/components/ui/drawer"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { FileDropzone, FileItem } from "@/components/ui/file-dropzone"
import { IconButton } from "@/components/ui/icon-button"
import { NumberInput } from "@/components/ui/number-input"
import { OTPInput } from "@/components/ui/otp-input"
import { Pagination } from "@/components/ui/pagination"
import { RadioField, RadioGroup } from "@/components/ui/radio-group"
import { Segmented, SegmentedItem } from "@/components/ui/segmented"
import { Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider, SliderValues } from "@/components/ui/slider"
import { Switch, SwitchField } from "@/components/ui/switch"
import { TagInput } from "@/components/ui/tag-input"
import { CharCounter, Textarea } from "@/components/ui/textarea"
import { orderStatus, t } from "@/data/content"
import { channelLabel, mock } from "@/data/mock"
import { formatCurrency, formatCurrencyWhole, formatDateTime, formatInteger, formatMonthDay, formatTime } from "@/lib/format"

import { bind, demo, DemoBox, K, Matrix as KitMatrix, Row, TABLE_PAGE_COUNT, TABLE_PAGE_SIZE, TABLE_TOTAL, type OverlayProps, type State } from "./kit"

/**
 * /kitchen-sink 第 2 轮追加区块（orders / form / settings / components / landing / chat 六屏所需控件）。
 * 文案：components.* / 各屏 content；数据：mock（purchaseForm / suppliers / settings / landing / chat / ordersSummary）。
 * 浮层由 ?open=dialog|alert|drawer|combobox|date 展开（shots.json）。
 */
const C = K

const STATES = ["default", "hover", "focus", "disabled", "error"] as const

/** 单行状态矩阵（列 = 状态） */
function Matrix({ label, states = STATES, wide, render }: { label: string; states?: readonly State[]; wide?: boolean; render: (state: State) => React.ReactNode }) {
  return <KitMatrix caption={label} cols={states} wide={wide} rows={[{ label, render }]} />
}

const today = mock.meta.asOf.slice(0, 10)
const form = mock.purchaseForm
const supplierOptions = mock.suppliers.items.map((s) => ({ value: s.id, label: s.name, hint: t("form.supplier.meta", { region: s.region, days: s.leadTimeDays }) }))
const fileSize = (kb: number) => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${formatInteger(kb)} KB`)
const calendarLabels = { prevMonth: K("sample.calendar.prev"), nextMonth: K("sample.calendar.next") }

/* ---------------- 表单控件 ---------------- */
export type FormPart = "input" | "select" | "choice" | "date" | "misc"

export function FormControlsSection({ part, ...overlay }: OverlayProps & { part: FormPart }) {
  const [qty, setQty] = React.useState(form.draft.items[0].qty)
  const [supplier, setSupplier] = React.useState<string | null>(form.draft.supplierId)
  const [settlement, setSettlement] = React.useState(form.draft.settlement)
  const [urgent, setUrgent] = React.useState(form.draft.urgent)
  const [freight, setFreight] = React.useState<number[]>([...form.draft.freightRange])
  const [date, setDate] = React.useState<string | null>(form.draft.arrivalDate)
  const [tags, setTags] = React.useState<string[]>(form.tagSuggestions.slice(0, 2))
  const [otp, setOtp] = React.useState("")
  const [otpErr, setOtpErr] = React.useState("")
  const note = form.draft.note
  const is = (...parts: FormPart[]) => parts.includes(part)
  return (
    <>
      {is("input") && (
        <>
      <Matrix
        label="Textarea"
        wide
        render={(s) => (
          <Textarea aria-label={t("form.note.label")} placeholder={t("form.note.placeholder")} defaultValue={s === "default" ? undefined : note} data-demo={demo(s)} disabled={s === "disabled"} aria-invalid={s === "error" || undefined} rows={2} />
        )}
      />
      <Row label="Textarea · counter" cols={[K("state.default"), K("state.error")]}>
        <Field className="w-full">
          <FieldLabel htmlFor="ta-counter">{t("form.note.label")}</FieldLabel>
          <Textarea id="ta-counter" defaultValue={note} rows={2} />
          <CharCounter value={note.length} max={200} />
        </Field>
        <Field className="w-full">
          <FieldLabel htmlFor="ta-over">{t("settings.profile.bio.label")}</FieldLabel>
          <Textarea id="ta-over" aria-invalid defaultValue={mock.settings.profile.bio} rows={2} />
          <CharCounter value={mock.settings.profile.bio.length} max={mock.settings.profile.bioMax} />
        </Field>
      </Row>
      <Matrix
        label="NumberInput"
        states={["default", "focus", "disabled", "error"]}
        render={(s) => <NumberInput value={qty} onChange={setQty} min={1} max={999} decrementLabel={K("sample.number.dec")} incrementLabel={K("sample.number.inc")} aria-label={t("form.items.col.qty")} data-demo={demo(s)} disabled={s === "disabled"} aria-invalid={s === "error" || undefined} />}
      />
        </>
      )}
      {is("select") && (
        <>
      <Matrix
        label="Select"
        wide
        render={(s) => (
          <Select defaultValue={s === "default" ? undefined : form.deliverySlots[0].key} placeholder={C("sample.select.placeholder")} disabled={s === "disabled"} invalid={s === "error"} aria-label={t("form.slot.label")} data-demo={demo(s)}>
            {form.deliverySlots.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </Select>
        )}
      />
      <Matrix
        label="Combobox"
        wide
        render={(s) => (
          <Combobox
            options={supplierOptions}
            value={s === "default" ? supplier : null}
            onChange={setSupplier}
            placeholder={t("form.supplier.placeholder")}
            searchPlaceholder={t("form.supplier.placeholder")}
            emptyText={t("form.supplier.empty")}
            disabled={s === "disabled"}
            invalid={s === "error"}
            aria-label={t("form.supplier.label")}
            {...(s === "default" ? bind(overlay, "combobox") : {})}
            className={s === "hover" ? "border-fg-muted" : s === "focus" ? "border-primary" : undefined}
          />
        )}
      />
        </>
      )}
      {is("choice") && (
        <>
      <Row label="RadioGroup" cols={[K("state.default"), K("state.disabled"), K("state.error")]}>
        <RadioGroup value={settlement} onValueChange={setSettlement} aria-label={t("form.settlement.label")}>
          {form.settlementMethods.slice(0, 3).map((m) => (
            <RadioField key={m.key} id={`radio-${m.key}`} value={m.key} label={m.label} hint={m.hint} />
          ))}
        </RadioGroup>
        <RadioGroup defaultValue={form.settlementMethods[0].key} disabled aria-label={t("form.settlement.label")}>
          {form.settlementMethods.slice(0, 2).map((m) => (
            <RadioField key={m.key} id={`radio-dis-${m.key}`} value={m.key} label={m.label} />
          ))}
        </RadioGroup>
        <RadioGroup aria-label={t("form.settlement.label")} aria-invalid>
          {form.settlementMethods.slice(3).map((m) => (
            <RadioField key={m.key} id={`radio-err-${m.key}`} value={m.key} label={m.label} aria-invalid />
          ))}
        </RadioGroup>
      </Row>
      <Matrix
        label="Switch"
        states={["default", "hover", "focus", "disabled"]}
        render={(s) => <Switch checked={s === "default" ? urgent : s !== "disabled"} onCheckedChange={setUrgent} aria-label={t("form.urgent.label")} data-demo={demo(s)} disabled={s === "disabled"} />}
      />
      <Row label="SwitchField" wide cols={[K("state.checked"), K("state.default")]}>
        <SwitchField id="sw-urgent" label={t("form.urgent.label")} hint={t("form.urgent.hint")} checked={urgent} onCheckedChange={setUrgent} />
        <SwitchField id="sw-notify" label={mock.settings.notifications.groups[0].items[0].label} hint={mock.settings.notifications.groups[0].items[0].description} defaultChecked={false} />
      </Row>
        </>
      )}
      {is("date") && (
        <>
      <Row label="Slider" wide cols={[K("state.default"), K("state.disabled")]}>
        <div className="flex w-full flex-col">
          <Slider value={freight} onValueChange={setFreight} min={form.freight.min} max={form.freight.max} step={form.freight.step} minStepsBetweenThumbs={1} thumbLabels={[t("form.freight.label"), t("form.freight.label")]} aria-label={t("form.freight.label")} />
          <SliderValues>
            <span>{formatCurrencyWhole(freight[0])}</span>
            <span>{formatCurrencyWhole(freight[1])}</span>
          </SliderValues>
        </div>
        <Slider defaultValue={[form.freight.defaultRange[0]]} min={form.freight.min} max={form.freight.max} step={form.freight.step} disabled thumbLabels={[t("form.freight.label")]} />
      </Row>
      <Row label="DatePicker / Calendar" wide cols={[K("state.default"), K("state.disabled"), "Calendar · range"]}>
        <Field className="w-full">
          <FieldLabel htmlFor="dp">{t("form.arrivalDate.label")}</FieldLabel>
          <DatePicker id="dp" value={date} onChange={setDate} placeholder={t("form.arrivalDate.placeholder")} today={today} min={today} format={formatMonthDay} labels={calendarLabels} {...bind(overlay, "date")} />
          <FieldDescription>{t("form.arrivalDate.hint", { days: mock.suppliers.items[1].leadTimeDays, date: formatMonthDay(form.draft.arrivalDate) })}</FieldDescription>
        </Field>
        <DatePicker value={null} onChange={() => {}} placeholder={t("form.arrivalDate.placeholder")} today={today} labels={calendarLabels} disabled />
        <Calendar value={[mock.ordersSummary.scope.range[0], mock.ordersSummary.scope.range[1]]} onChange={() => {}} today={today} max={today} labels={calendarLabels} />
      </Row>
        </>
      )}
      {is("misc") && (
        <>
      <Row label="TagInput" wide cols={[K("state.default"), K("state.disabled"), K("state.error")]}>
        <TagInput value={tags} onChange={setTags} placeholder={t("form.tags.placeholder")} removeLabel={(tag) => t("form.tags.remove", { tag })} aria-label={t("form.tags.label")} max={5} />
        <TagInput value={form.tagSuggestions.slice(0, 2)} onChange={() => {}} removeLabel={(tag) => t("form.tags.remove", { tag })} aria-label={t("form.tags.label")} disabled />
        <TagInput value={[]} onChange={() => {}} placeholder={t("form.tags.placeholder")} removeLabel={(tag) => t("form.tags.remove", { tag })} aria-label={t("form.tags.label")} invalid />
      </Row>
      <Row label="OTPInput" wide cols={[K("state.default"), K("state.error"), K("state.disabled")]}>
        <Field>
          <FieldLabel id="otp-label">{t("settings.security.2fa.code.label")}</FieldLabel>
          <OTPInput value={otp} onChange={setOtp} cellLabel={(n) => `${t("settings.security.2fa.code.label")} ${n}`} aria-labelledby="otp-label" />
        </Field>
        <Field>
          <FieldLabel id="otp-err-label">{t("settings.security.2fa.code.label")}</FieldLabel>
          <OTPInput value={otpErr} onChange={setOtpErr} invalid cellLabel={(n) => `${t("settings.security.2fa.code.label")} ${n}`} aria-labelledby="otp-err-label" aria-describedby="otp-err-msg" />
          <p id="otp-err-msg" role="alert" className="text-role-caption text-danger">
            {t("settings.security.2fa.code.invalid")}
          </p>
        </Field>
        <OTPInput value="" onChange={() => {}} disabled cellLabel={(n) => `${t("settings.security.2fa.code.label")} ${n}`} />
      </Row>
      <Row label="FileDropzone / FileItem" wide cols={[K("state.default"), C("state.dragover"), K("state.error")]}>
        <div className="flex w-full flex-col gap-2">
          <FileDropzone title={t("form.attachments.dropzone")} hint={t("form.attachments.accept")} onFiles={() => {}} accept={form.attachments.accept.join(",")} multiple />
          <ul className="flex flex-col gap-2">
            {form.attachments.samples.map((f) => (
              <FileItem key={f.name} name={f.name} size={fileSize(f.sizeKB)} status={f.status === "uploading" ? "uploading" : "done"} progress={"progress" in f ? f.progress : undefined} removeLabel={t("form.attachments.remove", { name: f.name })} onRemove={() => {}} />
            ))}
          </ul>
        </div>
        <FileDropzone title={t("form.attachments.dropzone")} hint={t("form.attachments.accept")} onFiles={() => {}} data-dragover className="data-dragover:border-primary data-dragover:bg-primary-soft" />
        <ul className="flex w-full flex-col gap-2">
          <FileItem name={form.attachments.errorSample.name} size={fileSize(form.attachments.errorSample.sizeKB)} status="error" error={form.attachments.errorSample.error} removeLabel={t("form.attachments.remove", { name: form.attachments.errorSample.name })} onRemove={() => {}} />
        </ul>
      </Row>
        </>
      )}
    </>
  )
}

/* ---------------- 浮层追加：Dialog / AlertDialog / Drawer ---------------- */
const cancelReasons = [...new Set(mock.ordersAll.flatMap((o) => ("cancelReason" in o && typeof o.cancelReason === "string" ? [o.cancelReason] : [])))]

export function OverlayExtras(overlay: OverlayProps) {
  const order = mock.ordersAll[0]
  const status = orderStatus[order.status]
  return (
    <Row label="Dialog / AlertDialog / Drawer" cols={["Dialog", "AlertDialog", "Drawer"]}>
      <Dialog {...bind(overlay, "dialog")}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            {C("sample.dialog.open")}
          </Button>
        </DialogTrigger>
        <DialogContent closeLabel={K("sample.dialog.close")}>
          <DialogHeader>
            <DialogTitle>{t("orders.dialog.cancel.title", { id: order.id })}</DialogTitle>
            <DialogDescription>{t("orders.dialog.cancel.description", { amount: formatCurrency(order.amount).replace("¥", "") })}</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="dlg-reason">{t("orders.dialog.cancel.reason")}</FieldLabel>
            <Select id="dlg-reason" defaultValue={cancelReasons[0]} placeholder={C("sample.select.placeholder")}>
              {cancelReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">{t("orders.dialog.cancel.back")}</Button>
            </DialogClose>
            <Button variant="danger">{t("orders.dialog.cancel.confirm")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog {...bind(overlay, "alert")}>
        <AlertDialogTrigger asChild>
          <Button variant="secondary" size="sm">
            {t("settings.team.remove")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.team.remove.title", { name: mock.team[1].name })}</AlertDialogTitle>
            <AlertDialogDescription>{mock.settings.team.removeConfirm.replace("{name}", mock.team[1].name)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("orders.dialog.cancel.back")}</AlertDialogCancel>
            <AlertDialogAction>{t("settings.team.remove.confirm")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Drawer {...bind(overlay, "drawer")}>
        <DrawerTrigger asChild>
          <Button variant="secondary" size="sm">
            {C("sample.drawer.open")}
          </Button>
        </DrawerTrigger>
        <DrawerContent title={t("orders.drawer.title", { id: order.id })} description={t("orders.drawer.aria")} closeLabel={t("orders.drawer.close")} headerExtra={<Tag tone={status.tone}>{status.label}</Tag>}>
          <DrawerBody>
            <DescriptionList>
              <DescriptionTerm>{t("orders.drawer.field.customer")}</DescriptionTerm>
              <DescriptionDetails>{order.customer.name}</DescriptionDetails>
              <DescriptionTerm>{t("orders.drawer.field.address")}</DescriptionTerm>
              <DescriptionDetails>{order.address}</DescriptionDetails>
              <DescriptionTerm>{t("orders.drawer.field.placedAt")}</DescriptionTerm>
              <DescriptionDetails>{formatMonthDay(order.placedAt)} {formatTime(order.placedAt)}</DescriptionDetails>
              <DescriptionTerm>{t("orders.drawer.field.amount")}</DescriptionTerm>
              <DescriptionDetails className="tabular-nums">{formatCurrency(order.amount)}</DescriptionDetails>
            </DescriptionList>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="secondary">{t("orders.drawer.action.urgent")}</Button>
            <Button>{t("orders.drawer.action.ship")}</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Row>
  )
}

/* ---------------- 导航追加：Segmented / Stepper / Accordion ---------------- */
export function NavExtras({ part }: { part: "tabs" | "menu" }) {
  const [view, setView] = React.useState("list")
  const statusLabels = { done: t("form.stepper.status.done"), current: t("form.stepper.status.current"), todo: t("form.stepper.status.todo"), error: K("state.error") }
  return (
    <>
      {part === "tabs" && (
        <>
      <Row label="Segmented" cols={[K("state.default"), K("state.disabled"), "icon"]}>
        <Segmented type="single" value={view} onValueChange={(v) => v && setView(v)} aria-label={C("sample.segmented.aria")}>
          <SegmentedItem value="list">{K("sample.segmented.list")}</SegmentedItem>
          <SegmentedItem value="cards">{K("sample.segmented.cards")}</SegmentedItem>
        </Segmented>
        <Segmented type="single" defaultValue="list" disabled aria-label={C("sample.segmented.aria")}>
          <SegmentedItem value="list">{K("sample.segmented.list")}</SegmentedItem>
          <SegmentedItem value="cards">{K("sample.segmented.cards")}</SegmentedItem>
        </Segmented>
        <Segmented type="single" defaultValue="list" aria-label={C("sample.segmented.aria")}>
          <SegmentedItem value="list" data-icon aria-label={K("sample.segmented.list")}>
            <ListIcon />
          </SegmentedItem>
          <SegmentedItem value="cards" data-icon aria-label={K("sample.segmented.cards")}>
            <LayoutGridIcon />
          </SegmentedItem>
        </Segmented>
      </Row>
      <Row label="Stepper" wide cols={[`${K("state.active")} · 2/3`, K("state.error"), K("state.success")]}>
        <Stepper steps={form.steps} current={1} statusLabels={statusLabels} aria-label={t("form.stepper.aria")} compactLabel={t("form.stepper.step", { n: 2 })} />
        <Stepper steps={form.steps} current={1} errorAt={1} statusLabels={statusLabels} aria-label={t("form.stepper.aria")} />
        <Stepper steps={form.steps} current={3} statusLabels={statusLabels} aria-label={t("form.stepper.aria")} />
      </Row>
        </>
      )}
      {part === "menu" && (
      <Row label="Accordion" wide cols={[C("state.open"), K("state.disabled")]}>
        <Accordion type="single" collapsible defaultValue={mock.landing.faq[0].q} aria-label={t("landing.faq.aria")}>
          {mock.landing.faq.slice(0, 3).map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Accordion type="single" collapsible disabled aria-label={t("landing.faq.aria")}>
          {mock.landing.faq.slice(3, 5).map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Row>
      )}
    </>
  )
}

/* ---------------- 表格追加：Pagination ---------------- */
export function TableExtras() {
  const [page, setPage] = React.useState(1)
  const labels = { prev: t("orders.pagination.prev"), next: t("orders.pagination.next"), page: (n: number) => t(n === page ? "orders.pagination.current" : "orders.pagination.page", { n }) }
  return (
    <Pagination
      aria-label={K("sample.pagination.aria")}
      page={page}
      pageCount={TABLE_PAGE_COUNT}
      onPageChange={setPage}
      labels={labels}
      range={t("orders.pagination.range", { from: formatInteger((page - 1) * TABLE_PAGE_SIZE + 1), to: formatInteger(Math.min(page * TABLE_PAGE_SIZE, TABLE_TOTAL)), total: formatInteger(TABLE_TOTAL) })}
    />
  )
}

/* ---------------- 列表追加：DescriptionList ---------------- */
export function ListExtras() {
  const supplier = mock.suppliers.items[1]
  return (
    <Row label="DescriptionList" wide cols={["cols=1", "cols=2"]}>
      <DescriptionList>
        <DescriptionTerm>{t("form.supplier.label")}</DescriptionTerm>
        <DescriptionDetails>{supplier.name}</DescriptionDetails>
        <DescriptionTerm>{t("form.settlement.label")}</DescriptionTerm>
        <DescriptionDetails>{form.settlementMethods.find((m) => m.key === supplier.settlement)?.label}</DescriptionDetails>
      </DescriptionList>
      <DescriptionList cols={2}>
        <DescriptionTerm>{t("form.summary.field.arrival")}</DescriptionTerm>
        <DescriptionDetails>{formatMonthDay(form.draft.arrivalDate)}</DescriptionDetails>
        <DescriptionTerm>{t("form.summary.field.attachments")}</DescriptionTerm>
        <DescriptionDetails>{form.attachments.samples.length}</DescriptionDetails>
        <DescriptionTerm>{t("form.tags.label")}</DescriptionTerm>
        <DescriptionDetails className="flex flex-wrap gap-1">
          {form.tagSuggestions.slice(0, 2).map((tag) => (
            <Tag key={tag} dot={false}>
              {tag}
            </Tag>
          ))}
        </DescriptionDetails>
        <DescriptionTerm>{t("form.items.col.qty")}</DescriptionTerm>
        <DescriptionDetails className="tabular-nums">{formatInteger(form.draft.items.reduce((n, i) => n + i.qty, 0))}</DescriptionDetails>
      </DescriptionList>
    </Row>
  )
}

/* ---------------- 布局：PageHeader / Toolbar ---------------- */
export function LayoutSection() {
  const [density, setDensity] = React.useState("default")
  const pendingCount = mock.ordersSummary.byStatus.pending_shipment
  const appliedFilters = [mock.ordersSummary.scope.label, orderStatus.pending_shipment?.label].filter(Boolean)
  return (
    <DemoBox className="w-full">
      <PageHeader
        className="w-full"
        headingLevel="h4"
        breadcrumb={
          <Breadcrumb aria-label={K("sample.pageHeader.crumbs")}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#layout">{t("orders.title")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{orderStatus.pending_shipment?.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        title={K("sample.pageHeader.title")}
        description={K("sample.pageHeader.meta", { n: formatInteger(pendingCount), time: formatDateTime(mock.meta.asOf) })}
        actions={
          <>
            <Button variant="secondary">{t("orders.export")}</Button>
            <Button>{K("sample.pageHeader.print")}</Button>
          </>
        }
      />
      <Toolbar aria-label={K("sample.toolbar.aria")} className="w-full">
        <SearchInput placeholder={t("orders.search.placeholder")} aria-label={t("orders.search.placeholder")} className="w-form-max max-w-full" />
        <Select defaultValue="all" aria-label={K("sample.toolbar.channel")} wrapClassName="w-auto">
          <option value="all">{K("sample.toolbar.channelAll")}</option>
          {Object.entries(mock.ordersSummary.byChannel).map(([key]) => (
            <option key={key} value={key}>
              {channelLabel(key)}
            </option>
          ))}
        </Select>
        <Button variant="secondary">
          {K("sample.toolbar.filter")}
          {appliedFilters.length > 0 ? <CountBadge>{appliedFilters.length}</CountBadge> : null}
        </Button>
        <Separator orientation="vertical" className="h-icon-md" />
        <Segmented type="single" value={density} onValueChange={(v) => v && setDensity(v)} aria-label={K("sample.toolbar.density")}>
          <SegmentedItem value="default">{K("sample.toolbar.density.default")}</SegmentedItem>
          <SegmentedItem value="compact">{K("sample.toolbar.density.compact")}</SegmentedItem>
        </Segmented>
        <ToolbarSpacer />
        <span className="text-role-caption text-fg-muted">{t("orders.selection.count", { n: 1 })}</span>
        <Button variant="ghost">{K("sample.toolbar.markShip")}</Button>
      </Toolbar>
    </DemoBox>
  )
}

/* ---------------- 复合：Result / PricingCard / Chat ---------------- */
export type ComposedPart = "state" | "pricing" | "chat" | "md"

export function ComposedSection({ part }: { part: ComposedPart }) {
  const [draft, setDraft] = React.useState("")
  const [yearly, setYearly] = React.useState(true)
  const c1 = mock.chat.messages.c_1
  const c2 = mock.chat.messages.c_2
  const assistant = c1[1]
  const csvMessage = c1[3]
  const code = csvMessage.markdown?.match(/```csv\n([\s\S]*?)```/)?.[1] ?? ""
  const conversations = mock.chat.conversations.slice(0, 3)
  const userMsg = c2[0]
  const tools = c2[1].toolCalls ?? []
  const tool0 = tools[0]
  const tool1 = tools[1]
  const running = mock.chat.streamingSample.toolCalls[0]
  const toolLabels = { aria: (name: string) => t("chat.tool.aria", { name }), args: t("chat.tool.args"), result: t("chat.tool.result"), expand: t("chat.tool.expand"), collapse: t("chat.tool.collapse") }
  const codeLabels = { copy: t("chat.code.copy"), copied: t("chat.code.copied") }
  const sourceLabel = (s: { type: string; label: string }) => (s.type === "order" ? t("chat.sources.order", { id: s.label }) : t("chat.sources.snapshot", { label: s.label }))
  return (
    <>
      {part === "state" && (
      <Row label="Result" wide cols={[K("state.success"), K("state.error")]}>
        <Result
          status="success"
          title={form.success.title}
          description={form.success.description}
          actions={
            <>
              <Button>{form.success.primaryAction}</Button>
              <Button variant="secondary">{form.success.secondaryAction}</Button>
            </>
          }
        >
          <DescriptionList>
            <DescriptionTerm>{t("form.supplier.label")}</DescriptionTerm>
            <DescriptionDetails>{mock.suppliers.items[1].name}</DescriptionDetails>
            <DescriptionTerm>{t("form.summary.field.arrival")}</DescriptionTerm>
            <DescriptionDetails>{formatMonthDay(form.draft.arrivalDate)}</DescriptionDetails>
          </DescriptionList>
        </Result>
        <Result status="error" title={t("chat.error.title")} description={mock.chat.errorState.message} actions={<Button variant="secondary">{mock.chat.errorState.retry}</Button>} />
      </Row>
      )}

      {part === "pricing" && (
      <Row label={`PricingCard · ${yearly ? t("landing.state.pricing.yearly") : t("landing.state.pricing.monthly")}`}>
        <div className="flex w-full flex-col gap-6">
          <SwitchField id="pricing-cycle" label={t("landing.pricing.toggle.aria")} hint={mock.landing.pricing.toggle.yearlyBadge} checked={yearly} onCheckedChange={setYearly} className="max-w-form-max" />
          <div className="grid gap-6 pt-3 md:grid-cols-3">
            {mock.settings.billing.plans.map((p) => (
              <PricingCard
                key={p.key}
                name={p.label}
                price={formatCurrencyWhole(yearly ? p.yearly : p.monthly)}
                suffix={yearly ? t("landing.pricing.perYear") : t("landing.pricing.perMonth")}
                note={yearly ? t("landing.pricing.yearlyPerMonth", { n: formatInteger(Math.round(p.yearly / 12)) }) : undefined}
                features={p.features}
                featureLabels={{ included: t("landing.pricing.included"), excluded: K("state.disabled") }}
                recommended={p.recommended}
                recommendedLabel={t("landing.pricing.recommended")}
                current={p.key === mock.settings.billing.plan}
                action={
                  p.key === mock.settings.billing.plan ? (
                    <Button variant="secondary" disabled>
                      {t("settings.billing.plan.current")}
                    </Button>
                  ) : (
                    <Button variant={p.recommended ? "primary" : "secondary"}>{p.key === "business" ? t("settings.billing.plan.contact") : t("settings.billing.plan.upgrade", { plan: p.label })}</Button>
                  )
                }
              />
            ))}
          </div>
        </div>
      </Row>
      )}

      {part === "chat" && (
        <>
      <Row label="ChatBubble" wide cols={["user", "assistant", C("state.streaming"), K("state.error")]}>
        <ChatBubble role="user" avatar={{ initial: mock.user.initial, hue: mock.user.avatarHue, name: mock.user.name }} time={formatTime(userMsg.at)}>
          {userMsg.text}
        </ChatBubble>
        <ChatBubble
          role="assistant"
          time={formatTime(assistant.at)}
          footer={
            <div role="group" aria-label={t("chat.sources.aria")} className="flex flex-wrap gap-x-2 gap-y-3">
              {(assistant.sources ?? []).slice(0, 2).map((s) => (
                <SourceChip key={s.label} type={s.type === "order" ? "order" : "snapshot"} label={s.label} href={s.href} aria-label={sourceLabel(s)} onClick={(e) => e.preventDefault()} />
              ))}
            </div>
          }
          actions={
            <Button variant="ghost" size="sm">
              {t("chat.message.copy")}
            </Button>
          }
        >
          {assistant.markdown?.split("\n\n")[0]}
        </ChatBubble>
        <ChatBubble role="assistant" streaming streamingLabel={t("chat.streaming.aria")} cursor={t("chat.streaming.cursor")}>
          {mock.chat.streamingSample.partialMarkdown.split("\n\n")[0]}
        </ChatBubble>
        <ChatBubble role="assistant" error={mock.chat.errorState.message} actions={<Button variant="ghost" size="sm">{t("chat.message.regenerate")}</Button>}>
          {userMsg.text}
        </ChatBubble>
      </Row>

      <Row label="ToolCall" wide cols={[C("state.running"), `${K("state.success")} · ${C("state.open")}`, K("state.error")]}>
        <ToolCall name={running.name} args={running.args} status="running" summary={t("chat.tool.running", { name: running.name })} labels={{ ...toolLabels, aria: toolLabels.aria(running.name) }} />
        {tool0 ? (
          <ToolCall
            name={tool0.name}
            args={tool0.args}
            result={tool0.result}
            status="done"
            defaultOpen
            summary={t("chat.tool.done", { name: tool0.name, duration: `${(tool0.durationMs / 1000).toFixed(1)} s` })}
            labels={{ ...toolLabels, aria: toolLabels.aria(tool0.name) }}
          />
        ) : null}
        {tool1 ? <ToolCall name={tool1.name} args={tool1.args} status="error" summary={t("chat.tool.failed", { name: tool1.name })} labels={{ ...toolLabels, aria: toolLabels.aria(tool1.name) }} /> : null}
      </Row>

      <Row label="SuggestionChip / SourceChip" wide cols={["SuggestionChip", "SourceChip"]}>
        <div role="group" aria-label={t("chat.suggestions.aria")} className="flex flex-wrap gap-2">
          {mock.chat.suggestions.slice(0, 3).map((s) => (
            <SuggestionChip key={s.key}>{s.label}</SuggestionChip>
          ))}
          <SuggestionChip disabled>{mock.chat.suggestions[3].label}</SuggestionChip>
        </div>
        <div role="group" aria-label={t("chat.sources.aria")} className="flex flex-wrap gap-x-2 gap-y-3">
          {(assistant.sources ?? []).map((s) => (
            <SourceChip key={s.label} type={s.type === "order" ? "order" : "snapshot"} label={s.label} href={s.href} aria-label={sourceLabel(s)} onClick={(e) => e.preventDefault()} />
          ))}
        </div>
      </Row>

      <Row label="Composer" wide cols={[K("state.default"), C("state.streaming"), K("state.disabled")]}>
        <Composer value={draft} onChange={setDraft} onSubmit={() => setDraft("")} placeholder={mock.chat.composer.placeholder} hint={mock.chat.composer.hint} labels={{ send: t("chat.composer.send"), stop: t("chat.streaming.stop"), attach: t("chat.composer.attach") }} maxRows={mock.chat.composer.maxRows} />
        <Composer value="" onChange={() => {}} onSubmit={() => {}} streaming placeholder={mock.chat.composer.placeholder} labels={{ send: t("chat.composer.send"), stop: t("chat.streaming.stop") }} />
        <Composer value="" onChange={() => {}} onSubmit={() => {}} disabled placeholder={mock.chat.composer.placeholder} labels={{ send: t("chat.composer.send"), stop: t("chat.streaming.stop"), attach: t("chat.composer.attach") }} />
      </Row>

      <Row label="ConversationItem">
        <nav aria-label={t("chat.sidebar.group.today")} className="flex w-conversation-list max-w-full flex-col gap-1">
          {conversations.map((c, i) => (
            <ConversationItem
              key={c.id}
              href="#composed"
              title={c.title}
              time={formatTime(c.updatedAt)}
              active={i === 0}
              unread={c.unread}
              action={
                <IconButton label={K("sample.icon.more")}>
                  <MoreHorizontalIcon />
                </IconButton>
              }
            />
          ))}
        </nav>
      </Row>
        </>
      )}

      {part === "md" && (
      <Row label="CodeBlock">
        <CodeBlock code={code.trimEnd()} language={t("chat.code.language", { lang: "csv" })} labels={codeLabels} className="w-full" />
      </Row>
      )}
    </>
  )
}
