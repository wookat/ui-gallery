import { useState, useRef } from "react"
import orders from "@ui-gallery/spec/mock/orders.json"
import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dropdown } from "primereact/dropdown"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import { MultiSelect } from "primereact/multiselect"
import { Paginator } from "primereact/paginator"
import { Sidebar } from "primereact/sidebar"
import { TabPanel, TabView } from "primereact/tabview"
import { Tag } from "primereact/tag"
import { Toast } from "primereact/toast"
import { InputTextarea } from "primereact/inputtextarea"
import { Icon } from "@/components/icon"
import { EmptyState, PageHeader, StatusTag } from "@/components/shared"

export function OrdersPage() {
  const [selected, setSelected] = useState<(typeof orders)[number] | null>(null), [state, setState] = useState("normal"), toast = useRef<Toast>(null)
  const [query, setQuery] = useState("")
  const filtered = orders.filter((item) => item.id.toLowerCase().includes(query.toLowerCase()) || item.customer.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
  const remove = () => toast.current?.show({ severity: "success", summary: "已删除", detail: "订单已移除", life: 2400 })
  return <div className="flex flex-column gap-5"><Toast ref={toast} /><ConfirmDialog /><PageHeader title="订单" description="管理订单、状态与客户信息。" action={<Button outlined icon={<Icon name="download" />} label="导出" />} /><div className="flex flex-wrap gap-2"><IconField iconPosition="left"><InputIcon className="pi pi-search" /><InputText value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索订单或客户" /></IconField><Dropdown options={["全部状态", "paid", "pending", "failed"]} placeholder="状态" className="w-10rem" /><Calendar selectionMode="range" placeholder="日期范围" className="w-12rem" /><MultiSelect options={["web", "ios", "android", "api"]} placeholder="渠道" className="w-10rem" /><Button text icon={<Icon name="filter" />} aria-label="筛选" /></div><div className="flex gap-2"><Button label="正常" outlined={state !== "normal"} onClick={() => setState("normal")} /><Button label="空态" outlined={state !== "empty"} onClick={() => setState("empty")} /><Button label="加载" outlined={state !== "loading"} onClick={() => setState("loading")} /><Button label="错误" outlined={state !== "error"} onClick={() => setState("error")} /></div><div className="surface-card border-round border-1 surface-border table-scroll p-3"><small className="muted md:hidden">← 左右滑动查看更多列 →</small>{state === "empty" ? <EmptyState title="没有匹配订单" description="调整筛选条件后重试。" /> : state === "loading" ? <div className="p-4 flex flex-column gap-3"><div className="p-skeleton h-2rem" /><div className="p-skeleton h-2rem" /><div className="p-skeleton h-2rem" /></div> : state === "error" ? <div className="p-4"><Tag severity="danger" value="加载失败" /><p>订单服务暂时不可用。</p><Button label="重试" onClick={() => setState("normal")} /></div> : <><DataTable value={filtered} selectionMode="single" onSelectionChange={(e) => setSelected(e.value)} paginator rows={5} rowsPerPageOptions={[5, 10, 20]} stripedRows><Column selectionMode="multiple" headerStyle={{ width: "3rem" }} /><Column field="id" header="订单号" sortable /><Column field="customer" header="客户" /><Column field="status" header="状态" body={(row) => <StatusTag value={row.status} />} sortable /><Column field="date" header="日期" sortable /><Column field="amount" header="金额" body={(row) => <span className="block text-right">¥{row.amount.toLocaleString()}</span>} sortable /><Column header="操作" body={(row) => <Button text icon={<Icon name="trash" />} severity="danger" onClick={() => confirmDialog({ message: `确认删除 ${row.id}？`, header: "删除订单", icon: "pi pi-exclamation-triangle", accept: remove })} />} /></DataTable><Paginator first={0} rows={5} totalRecords={filtered.length} /></>}</div><Sidebar visible={Boolean(selected)} position="right" onHide={() => setSelected(null)} className="w-full md:w-30rem">{selected ? <div className="flex flex-column gap-4"><h2>{selected.id}</h2><dl className="grid"><dt className="col-5 muted">客户</dt><dd className="col-7 m-0">{selected.customer}</dd><dt className="col-5 muted">状态</dt><dd className="col-7 m-0"><StatusTag value={selected.status} /></dd><dt className="col-5 muted">金额</dt><dd className="col-7 m-0">¥{selected.amount.toLocaleString()}</dd><dt className="col-5 muted">产品</dt><dd className="col-7 m-0">{selected.product}</dd></dl><TabView><TabPanel header="详情"><p className="muted">订单来自 {selected.channel} 渠道。</p></TabPanel><TabPanel header="备注"><InputTextarea rows={4} className="w-full" placeholder="添加备注..." /></TabPanel></TabView><Button severity="danger" label="删除订单" icon={<Icon name="trash" />} onClick={() => confirmDialog({ message: "此操作无法撤销。", accept: remove })} /></div> : null}</Sidebar></div>
}
