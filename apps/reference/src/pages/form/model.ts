import { t } from "@/data/content"
import { mock } from "@/data/mock"

const PF = mock.purchaseForm
const V = PF.validation

export type Supplier = (typeof mock.suppliers.items)[number]
export type Sku = (typeof mock.skus.items)[number]

export type Row = { id: number; sku: string; qty: number | ""; unitPrice: number | "" }
export type Attachment = { id: number; name: string; sizeKB: number; status: "done" | "uploading" | "error"; progress: number; error?: string }

export type Model = {
  supplierId: string | null
  contact: string
  phoneCountryCode: string
  phone: string
  email: string
  note: string
  settlement: string
  needInvoice: boolean
  urgent: boolean
  items: Row[]
  warehouse: string
  arrivalDate: string | null
  slot: string
  freight: [number, number]
  attachments: Attachment[]
  tags: string[]
  terms: boolean
}

/** 校验项：field 为字段键（Alert 计数 / touched 依据），focusId 为首错聚焦的控件 id */
export type FieldError = { field: string; message: string; focusId: string }

export type Step = 1 | 2 | 3
export type FormState = "default" | "invalid" | "loading" | "success" | "error"

/** 单号日期 = 业务当日（与 hifi 一致，保证截图确定性） */
export const TODAY = PF.poNumberNext.replace(/^PO-(\d{4})(\d{2})(\d{2})-.*$/, "$1-$2-$3")

export const addDays = (isoDate: string, n: number) => {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export const TOMORROW = addDays(TODAY, 1)

export const supplierOf = (id: string | null) => mock.suppliers.items.find((s) => s.id === id) ?? null
export const skuOf = (code: string) => mock.skus.items.find((s) => s.sku === code) ?? null
export const byKey = <T extends { key: string }>(arr: readonly T[], key: string) => arr.find((o) => o.key === key) ?? null

export const rowSubtotal = (r: Row) => (Number(r.qty) || 0) * (Number(r.unitPrice) || 0)
export const goodsTotal = (m: Model) => m.items.reduce((s, r) => s + rowSubtotal(r), 0)
export const goodsQty = (m: Model) => m.items.reduce((s, r) => s + (Number(r.qty) || 0), 0)
export const grandTotal = (m: Model) => goodsTotal(m) + m.freight[1]
export const doneAttachments = (m: Model) => m.attachments.filter((a) => a.status === "done")

let seq = 0
export const nextId = () => ++seq

const sampleStatus = (s: string): Attachment["status"] => (s === "uploading" ? "uploading" : "done")

/** 初始模型 = 草稿 PO-20260906-003；invalid 态按步预置错误样本（与 hifi 初始化一致） */
export function initialModel(state: FormState, step: Step): Model {
  const d = PF.draft
  const m: Model = {
    supplierId: d.supplierId,
    contact: d.contact,
    phoneCountryCode: d.phoneCountryCode,
    phone: d.phone,
    email: d.email,
    note: d.note,
    settlement: d.settlement,
    needInvoice: d.needInvoice,
    urgent: d.urgent,
    items: d.items.map((r) => ({ id: nextId(), sku: r.sku, qty: r.qty, unitPrice: r.unitPrice })),
    warehouse: d.warehouse,
    arrivalDate: d.arrivalDate,
    slot: d.slot,
    freight: [d.freightRange[0], d.freightRange[1]],
    attachments: [
      ...PF.attachments.samples.map((a) => ({ id: nextId(), name: a.name, sizeKB: a.sizeKB, status: sampleStatus(a.status), progress: "progress" in a && typeof a.progress === "number" ? a.progress : 100 })),
      { id: nextId(), name: PF.attachments.errorSample.name, sizeKB: PF.attachments.errorSample.sizeKB, status: "error", progress: 0, error: PF.attachments.errorSample.error },
    ],
    tags: [...d.tags],
    terms: state === "loading" || state === "error",
  }
  if (state === "invalid") {
    if (step === 1) {
      m.supplierId = null
      m.phone = "1370000"
      m.email = "sales@zhangli-wood"
    }
    if (step === 2) {
      m.items[1].qty = 0
      m.arrivalDate = TODAY
    }
  }
  return m
}

export const rowField = (id: number, key: "sku" | "qty" | "unitPrice") => `row-${id}-${key}`

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validate(m: Model, step: Step): FieldError[] {
  const errs: FieldError[] = []
  const push = (field: string, message: string, focusId = field) => errs.push({ field, message, focusId })
  if (step === 1) {
    if (!m.supplierId) push("supplier", V.supplier)
    if (!m.contact.trim()) push("contact", V.contact)
    if (!/^\d{11}$/.test(m.phone)) push("phone", V.phone)
    if (!EMAIL.test(m.email)) push("email", V.email)
    if (!m.settlement) push("settlement", V.settlement, `settlement-${PF.settlementMethods[0].key}`)
    if (m.note.length > V.noteMax) push("note", V.noteMaxMessage)
  }
  if (step === 2) {
    if (!m.items.length) push("items", V.itemsMin, "addRow")
    for (const r of m.items) {
      if (!r.sku) push(rowField(r.id, "sku"), t("form.items.sku.required"))
      const qn = Number(r.qty)
      if (!(Number.isInteger(qn) && qn >= V.qtyRange[0] && qn <= V.qtyRange[1])) push(rowField(r.id, "qty"), V.qtyMessage)
      if (!(Number(r.unitPrice) >= V.unitPriceMin)) push(rowField(r.id, "unitPrice"), V.unitPriceMessage)
    }
    if (!m.warehouse) push("warehouse", V.warehouse)
    if (!m.arrivalDate || m.arrivalDate < TOMORROW) push("arrival", V.arrivalDate)
    if (!m.slot) push("slot", V.slot)
  }
  if (step === 3) {
    if (!m.terms) push("terms", V.terms)
  }
  return errs
}

export const formatFileSize = (kb: number) => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`)

export { PF, V }
