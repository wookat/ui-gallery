import * as React from "react"
import { BellIcon, LayoutGridIcon, ListIcon, MailIcon, MonitorIcon, MoreHorizontalIcon, ReceiptTextIcon, ShieldIcon, SmartphoneIcon, Trash2Icon, UserIcon, XIcon } from "lucide-react"

import { AnchorNav } from "@/components/composed/anchor-nav"
import { Avatar } from "@/components/composed/avatar"
import { ChatBubble, Composer, ConversationItem, SourceChip, SuggestionChip, ToolCall } from "@/components/composed/chat"
import { CodeBlock } from "@/components/composed/code-block"
import { MemberRow } from "@/components/composed/member-row"
import { PageHeader, Toolbar, ToolbarSpacer } from "@/components/composed/page-header"
import { PricingCard } from "@/components/composed/pricing-card"
import { Result } from "@/components/composed/result"
import { SearchInput } from "@/components/composed/search-input"
import { SessionRow } from "@/components/composed/session-row"
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
import { OTPInput } from "@/components/ui/otp-input"
import { Pagination } from "@/components/ui/pagination"
import { RadioField, RadioGroup } from "@/components/ui/radio-group"
import { Segmented, SegmentedItem } from "@/components/ui/segmented"
import { Select } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider, SliderValues } from "@/components/ui/slider"
import { Switch, SwitchField } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TagInput } from "@/components/ui/tag-input"
import { orderStatus, t } from "@/data/content"
import { channelLabel, mock } from "@/data/mock"
import { formatCurrency, formatCurrencyWhole, formatDateTime, formatFullDateTime, formatInteger, formatMonthDay, formatRelativeToAsOf, formatTime } from "@/lib/format"

import { bind, demo, DemoBox, GRID_2, GRID_3, K, Matrix as KitMatrix, Row, TABLE_PAGE_COUNT, TABLE_PAGE_SIZE, TABLE_TOTAL, type OverlayProps, type State } from "./kit"

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
export type FormPart = "select" | "choice" | "date" | "misc"

export function FormControlsSection({ part, ...overlay }: OverlayProps & { part: FormPart }) {
  const [supplier, setSupplier] = React.useState<string | null>(form.draft.supplierId)
  const [settlement, setSettlement] = React.useState(form.draft.settlement)
  const [urgent, setUrgent] = React.useState(form.draft.urgent)
  const [freight, setFreight] = React.useState<number[]>([...form.draft.freightRange])
  const [date, setDate] = React.useState<string | null>(form.draft.arrivalDate)
  const [tags, setTags] = React.useState<string[]>(form.tagSuggestions.slice(0, 2))
  const [otp, setOtp] = React.useState("")
  const [otpErr, setOtpErr] = React.useState("")
  const is = (...parts: FormPart[]) => parts.includes(part)
  return (
    <>
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
      <div className={GRID_3}>
        <DemoBox caption={`TagInput（${K("state.default")} / ${K("state.disabled")} / ${K("state.error")}）`}>
          <TagInput value={tags} onChange={setTags} placeholder={t("form.tags.placeholder")} removeLabel={(tag) => t("form.tags.remove", { tag })} aria-label={t("form.tags.label")} max={5} />
          <TagInput value={form.tagSuggestions.slice(0, 2)} onChange={() => {}} removeLabel={(tag) => t("form.tags.remove", { tag })} aria-label={t("form.tags.label")} disabled />
          <TagInput value={[]} onChange={() => {}} placeholder={t("form.tags.placeholder")} removeLabel={(tag) => t("form.tags.remove", { tag })} aria-label={t("form.tags.label")} invalid />
        </DemoBox>
        <DemoBox caption={`OTPInput（${K("state.default")} / ${K("state.error")} / ${K("state.disabled")}）`}>
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
        </DemoBox>
        <DemoBox caption={`FileDropzone（${K("state.default")} / ${C("state.dragover")}）+ FileItem（${C("state.uploading")} / ${K("state.success")} / ${K("state.error")}）`}>
          <FileDropzone title={t("form.attachments.dropzone")} hint={t("form.attachments.accept")} dragoverTitle={C("sample.dropzone.dragover")} onFiles={() => {}} accept={form.attachments.accept.join(",")} multiple />
          <FileDropzone title={t("form.attachments.dropzone")} hint={t("form.attachments.accept")} dragoverTitle={C("sample.dropzone.dragover")} dragover onFiles={() => {}} />
          <ul className="flex w-full flex-col gap-2">
            {form.attachments.samples.map((f) => (
              <FileItem key={f.name} name={f.name} size={fileSize(f.sizeKB)} status={f.status === "uploading" ? "uploading" : "done"} progress={"progress" in f ? f.progress : undefined} removeLabel={t("form.attachments.remove", { name: f.name })} onRemove={() => {}} />
            ))}
            <FileItem name={form.attachments.errorSample.name} size={fileSize(form.attachments.errorSample.sizeKB)} status="error" error={form.attachments.errorSample.error} removeLabel={t("form.attachments.remove", { name: form.attachments.errorSample.name })} onRemove={() => {}} />
          </ul>
        </DemoBox>
      </div>
        </>
      )}
    </>
  )
}

/* ---------------- 浮层追加：Dialog / AlertDialog / Drawer ---------------- */
const cancelReasons = [...new Set(mock.ordersAll.flatMap((o) => ("cancelReason" in o && typeof o.cancelReason === "string" ? [o.cancelReason] : [])))]

export function OverlayExtras(overlay: OverlayProps) {
  const order = mock.ordersAll[0]
  return (
    <Row label="Dialog / AlertDialog" cols={["Dialog", "AlertDialog"]}>
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
    </Row>
  )
}

/** Drawer 示例（hifi 卡「Sheet · Drawer · Anchor」第 2 格；由 demos.OverlayDemo part="sheet" 引用） */
export function DrawerExample(overlay: OverlayProps) {
  const order = mock.ordersAll[0]
  const status = orderStatus[order.status]
  return (
    <DemoBox caption={C("sample.drawer.caption")} className="w-full">
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
    </DemoBox>
  )
}

const ANCHOR_ITEMS = ["profile", "notifications", "security", "billing", "danger"] as const

/** Anchor 页内导航示例（hifi .anchor-nav：设置分区，第 2 项 hover 态） */
export function AnchorExample() {
  const [active, setActive] = React.useState<string>(ANCHOR_ITEMS[0])
  return (
    <DemoBox caption={C("sample.anchor.caption")} className="w-full">
      <AnchorNav
        aria-label={C("sample.anchor.caption")}
        items={ANCHOR_ITEMS.map((id) => ({ id, label: C(`sample.anchor.${id}`), href: "#overlay", demo: id === "notifications" ? ("hover" as const) : undefined }))}
        activeId={active}
        onActivate={setActive}
      />
    </DemoBox>
  )
}

/* ---------------- 导航追加：Segmented / Stepper / Accordion ---------------- */
const ORDER_TABS = ["all", "pending_shipment", "refunding"] as const
/** hifi 孤立演示口径：全部 = TABLE_TOTAL（与 Pagination 演示同源）；待发货取 ordersSummary；退款中 = ordersAll 样本内计数 */
const orderTabCount = (key: (typeof ORDER_TABS)[number]) =>
  key === "all" ? TABLE_TOTAL : key === "refunding" ? mock.ordersAll.filter((o) => o.status === "refunding").length : mock.ordersSummary.byStatus[key]
const RECOMMENDED_PLAN = mock.settings.billing.plans.find((p) => p.recommended) ?? mock.settings.billing.plans[0]
/** 年付折省比例：1 − yearly / (monthly × 12)，按推荐套餐计算（2990 / 3588 → 17%） */
const YEARLY_SAVE_PERCENT = Math.round((1 - RECOMMENDED_PLAN.yearly / (RECOMMENDED_PLAN.monthly * 12)) * 100)
const SETTINGS_TAB_ICONS = { profile: UserIcon, notifications: BellIcon, security: ShieldIcon, billing: ReceiptTextIcon } as const
const SETTINGS_TABS = (Object.keys(SETTINGS_TAB_ICONS) as (keyof typeof SETTINGS_TAB_ICONS)[]).flatMap((key) => {
  const tab = mock.settings.tabs.find((x) => x.key === key)
  return tab ? [{ ...tab, key, Icon: SETTINGS_TAB_ICONS[key] }] : []
})
const PAID_ORDER = mock.ordersAll.find((o) => o.status === "pending_shipment" && o.paidAt) ?? mock.ordersAll[0]

export function NavExtras({ part }: { part: "tabs" | "menu" }) {
  const [view, setView] = React.useState("list")
  const [cycle, setCycle] = React.useState("yearly")
  const statusLabels = { done: t("form.stepper.status.done"), current: t("form.stepper.status.current"), todo: t("form.stepper.status.todo"), error: K("state.error") }
  const shipSteps = [
    { key: "paid", label: C("sample.stepper.paid"), description: PAID_ORDER.paidAt ? formatFullDateTime(PAID_ORDER.paidAt) : undefined },
    { key: "shipFailed", label: C("sample.stepper.shipFailed"), description: C("sample.stepper.shipFailedHint") },
    { key: "delivered", label: C("sample.stepper.delivered") },
  ]
  return (
    <>
      {part === "tabs" && (
        <>
      <Row label="Tabs line / vertical" cols={["line", "vertical"]}>
        <Tabs variant="line" defaultValue="all">
          <TabsList aria-label={C("sample.tabs.orders.aria")}>
            {ORDER_TABS.map((key) => (
              <TabsTrigger key={key} value={key} data-demo={key === "refunding" ? "focus" : undefined}>
                {key === "all" ? C("sample.tabs.orders.all") : orderStatus[key]?.label}
                <span className="font-mono text-role-caption tabular-nums">{formatInteger(orderTabCount(key))}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {ORDER_TABS.map((key) => (
            <TabsContent key={key} value={key} forceMount hidden className="hidden" />
          ))}
        </Tabs>
        <Tabs variant="vertical" defaultValue={SETTINGS_TABS[0]?.key}>
          <TabsList aria-label={C("sample.tabs.settings.aria")}>
            {SETTINGS_TABS.map(({ key, label, Icon }) => (
              <TabsTrigger key={key} value={key}>
                <Icon />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {SETTINGS_TABS.map(({ key }) => (
            <TabsContent key={key} value={key} forceMount hidden className="hidden" />
          ))}
        </Tabs>
      </Row>
      <Row label="Segmented" cols={[K("state.default"), K("state.disabled"), "icon", t("settings.billing.cycle.aria")]}>
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
        <Segmented type="single" value={cycle} onValueChange={(v) => v && setCycle(v)} aria-label={t("settings.billing.cycle.aria")}>
          <SegmentedItem value="monthly">{t("settings.billing.cycle.monthly")}</SegmentedItem>
          <SegmentedItem value="yearly">
            {t("settings.billing.cycle.yearly")}
            <Tag tone="success" dot={false}>
              {C("sample.segmented.savePercent", { n: formatInteger(YEARLY_SAVE_PERCENT) })}
            </Tag>
          </SegmentedItem>
        </Segmented>
      </Row>
      <Row label="Stepper" wide cols={[`${K("state.active")} · 2/3`, K("state.error"), K("state.success"), "vertical"]}>
        <Stepper steps={form.steps} current={1} statusLabels={statusLabels} aria-label={t("form.stepper.aria")} compactLabel={t("form.stepper.step", { n: 2 })} />
        <Stepper steps={form.steps} current={1} errorAt={1} statusLabels={statusLabels} aria-label={t("form.stepper.aria")} />
        <Stepper steps={form.steps} current={3} statusLabels={statusLabels} aria-label={t("form.stepper.aria")} />
        <Stepper orientation="vertical" steps={shipSteps} current={1} errorAt={1} statusLabels={statusLabels} aria-label={C("sample.stepper.verticalAria")} />
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

/** MemberRow 示例：当前用户（角色禁用 + 「你」）/ 普通成员（可改角色 + 移除）/ 待接受邀请（data-pending） */
function MemberRows() {
  const team = mock.settings.team
  const me = mock.team.find((m) => m.id === mock.user.id) ?? mock.team[0]
  const candidates = mock.team.filter((m) => m.id !== me.id && m.role !== "admin")
  const stateOf = (id: string) => team.members.find((m) => m.id === id)
  const other = candidates.find((m) => {
    const s = stateOf(m.id)
    return s ? formatRelativeToAsOf(s.lastActiveAt) !== null : false
  }) ?? candidates[0] ?? mock.team[1]
  const otherState = stateOf(other.id)
  const invite = team.pendingInvites[0]
  const inviter = mock.team.find((m) => m.id === invite?.invitedBy)
  const [otherRole, setOtherRole] = React.useState(other.role)
  const [inviteRole, setInviteRole] = React.useState(invite?.role ?? team.roles[1].key)
  const lastActive = otherState ? formatRelativeToAsOf(otherState.lastActiveAt) ?? formatTime(otherState.lastActiveAt) : null
  return (
    <DemoBox caption={C("sample.member.caption")} className="w-full">
      <div className="flex w-full flex-col">
        <MemberRow
          avatar={<Avatar initial={me.initial} hue={me.avatarHue} aria-hidden />}
          name={me.name}
          meta={me.email}
          roles={team.roles}
          role={me.role}
          roleLabel={C("sample.member.roleAria", { name: me.name })}
          roleDisabled
          status={t("settings.team.you")}
        />
        <MemberRow
          avatar={<Avatar initial={other.initial} hue={other.avatarHue} aria-hidden />}
          name={other.name}
          meta={other.email}
          roles={team.roles}
          role={otherRole}
          roleLabel={C("sample.member.roleAria", { name: other.name })}
          onRoleChange={setOtherRole}
          status={lastActive ? C("sample.member.lastActive", { time: lastActive }) : undefined}
          action={
            <IconButton label={t("settings.team.remove.aria", { name: other.name })}>
              <Trash2Icon />
            </IconButton>
          }
        />
        {invite ? (
          <MemberRow
            pending
            avatar={
              <Avatar initial="" aria-hidden>
                <MailIcon />
              </Avatar>
            }
            name={invite.email}
            meta={C("sample.member.inviteSent", { date: formatMonthDay(invite.invitedAt), name: inviter?.name ?? "" })}
            roles={team.roles}
            role={inviteRole}
            roleLabel={C("sample.member.inviteRoleAria", { email: invite.email })}
            onRoleChange={setInviteRole}
            status={<Tag dot={false}>{C("sample.member.pending")}</Tag>}
            action={
              <IconButton label={C("sample.member.revokeInvite", { email: invite.email })}>
                <XIcon />
              </IconButton>
            }
          />
        ) : null}
      </div>
    </DemoBox>
  )
}

/** SessionRow 示例：当前会话（success Tag + 相对时间）/ 其他会话（注销）/ 注销中（aria-busy） */
function SessionRows() {
  const sessions = mock.settings.security.sessions
  const iconOf = (device: string) => (/iphone|android|移动端/i.test(device) ? <SmartphoneIcon /> : <MonitorIcon />)
  return (
    <DemoBox caption={C("sample.session.caption")} className="w-full">
      <div className="flex w-full flex-col">
        {sessions.map((s, i) => {
          const isSameDay = s.lastActiveAt.slice(0, 10) === today
          const busy = !s.current && i === sessions.length - 1
          return (
            <SessionRow
              key={s.id}
              icon={iconOf(s.device)}
              device={s.device}
              badge={s.current ? <Tag tone="success">{t("settings.security.sessions.current")}</Tag> : undefined}
              meta={[s.location, s.ip, !s.current && !isSameDay ? formatDateTime(s.lastActiveAt) : null].filter(Boolean).join(" · ")}
              trailing={
                s.current ? (
                  C("sample.session.justNow")
                ) : (
                  <Button variant="ghost" size="sm" loading={busy} aria-label={busy ? undefined : t("settings.security.sessions.revokeAria", { device: s.device })}>
                    {busy ? C("sample.session.revoking") : t("settings.security.sessions.revoke")}
                  </Button>
                )
              }
            />
          )
        })}
      </div>
      <div className="flex w-full justify-end">
        <Button variant="danger">{t("settings.security.sessions.revokeAll")}</Button>
      </div>
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
        <>
      <DemoBox caption={`${C("sample.pricing.caption")} · ${yearly ? t("landing.state.pricing.yearly") : t("landing.state.pricing.monthly")}`} className="w-full">
        <div className="flex w-full flex-col gap-6">
          <SwitchField id="pricing-cycle" label={t("landing.pricing.toggle.aria")} hint={mock.landing.pricing.toggle.yearlyBadge} checked={yearly} onCheckedChange={setYearly} className="max-w-form-max" />
          <div className="grid gap-6 pt-3 md:grid-cols-3">
            {mock.settings.billing.plans.map((p) => (
              <PricingCard
                key={p.key}
                name={p.label}
                description={mock.landing.pricing.plans.find((x) => x.key === p.key)?.description}
                meta="inline"
                price={formatCurrencyWhole(yearly ? p.yearly : p.monthly)}
                suffix={yearly ? t("landing.pricing.perYear") : t("landing.pricing.perMonth")}
                note={yearly ? [C("sample.pricing.perMonthApprox", { n: formatInteger(Math.round(p.yearly / 12)) }), p.recommended ? mock.landing.pricing.toggle.yearlyBadge : null].filter(Boolean).join(" · ") : undefined}
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
          <p className="text-role-caption text-fg-muted">{mock.landing.pricing.footnote}</p>
        </div>
      </DemoBox>
      <div className={GRID_2}>
        <MemberRows />
        <SessionRows />
      </div>
        </>
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
            <SuggestionChip key={s.key} appearance="suggestion">
              {s.label}
            </SuggestionChip>
          ))}
          <SuggestionChip appearance="suggestion" disabled>
            {mock.chat.suggestions[3].label}
          </SuggestionChip>
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
