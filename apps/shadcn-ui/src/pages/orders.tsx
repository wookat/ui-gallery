import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Icon } from "@ui-gallery/icons-react"
import orders from "@ui-gallery/spec/mock/orders.json"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader, StatusBadge } from "./shared"

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [selected, setSelected] = useState<(typeof orders)[number] | null>(null)
  const [date, setDate] = useState<Date | undefined>()
  const [showCustomer, setShowCustomer] = useState(true)
  const filtered = useMemo(() => orders.filter((order) => order.id.toLowerCase().includes(query.toLowerCase()) && (status === "all" || order.status === status)), [query, status])
  const remove = () => { toast.success("订单已删除"); setSelected(null) }
  return (
    <div className="space-y-6">
      <PageHeader title="订单管理" description="搜索、筛选并查看全部订单。" action={<Button variant="outline"><Icon name="download" />导出</Button>} />
      <Alert><Icon name="info" /><AlertTitle>本地数据集</AlertTitle><AlertDescription>所有订单来自 packages/spec/mock/orders.json，无运行时网络请求。</AlertDescription></Alert>
      <Card><CardContent className="space-y-4 pt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索订单号..." />
          <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue placeholder="状态" /></SelectTrigger><SelectContent><SelectItem value="all">全部状态</SelectItem><SelectItem value="paid">paid</SelectItem><SelectItem value="pending">pending</SelectItem><SelectItem value="shipped">shipped</SelectItem><SelectItem value="failed">failed</SelectItem></SelectContent></Select>
          <Popover><PopoverTrigger asChild><Button variant="outline" className="justify-start font-normal"><Icon name="calendar" />{date ? date.toLocaleDateString() : "日期范围"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent></Popover>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><Icon name="sliders" />列</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>显示列</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuCheckboxItem checked={showCustomer} onCheckedChange={setShowCustomer}>客户</DropdownMenuCheckboxItem><DropdownMenuCheckboxItem checked>金额</DropdownMenuCheckboxItem><DropdownMenuCheckboxItem checked>状态</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu>
        </div>
        {filtered.length ? <><div className="hidden overflow-x-auto md:block"><Table><TableHeader><TableRow><TableHead className="w-10"><Checkbox /></TableHead><TableHead>订单号</TableHead>{showCustomer ? <TableHead>客户</TableHead> : null}<TableHead>状态</TableHead><TableHead>日期</TableHead><TableHead className="text-right">金额</TableHead><TableHead className="text-right">操作</TableHead></TableRow></TableHeader><TableBody>{filtered.map((order) => <TableRow key={order.id}><TableCell><Checkbox /></TableCell><TableCell className="font-medium">{order.id}</TableCell>{showCustomer ? <TableCell>{order.customer}</TableCell> : null}<TableCell><StatusBadge value={order.status} /></TableCell><TableCell>{order.date}</TableCell><TableCell className="text-right">¥{order.amount.toLocaleString()}</TableCell><TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => setSelected(order)}>详情</Button></TableCell></TableRow>)}</TableBody></Table></div><div className="grid gap-3 md:hidden">{filtered.map((order) => <Card key={order.id} className="cursor-pointer" onClick={() => setSelected(order)}><CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle className="text-base">{order.id}</CardTitle><StatusBadge value={order.status} /></CardHeader><CardContent className="flex justify-between text-sm text-muted-foreground"><span>{order.customer}</span><span>¥{order.amount.toLocaleString()}</span></CardContent></Card>)}</div></> : <Empty><EmptyHeader><EmptyMedia variant="icon"><Icon name="inbox" /></EmptyMedia><EmptyTitle>没有找到订单</EmptyTitle><EmptyDescription>调整搜索或筛选条件后重试。</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" onClick={() => { setQuery(""); setStatus("all") }}>清除筛选</Button></EmptyContent></Empty>}
        <Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#" /></PaginationItem><PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem><PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem><PaginationItem><PaginationNext href="#" /></PaginationItem></PaginationContent></Pagination>
      </CardContent></Card>
      <div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}><SheetContent><SheetHeader><SheetTitle>{selected?.id ?? "订单详情"}</SheetTitle><SheetDescription>查看订单的完整信息与操作。</SheetDescription></SheetHeader>{selected ? <div className="space-y-5 p-4"><div className="grid gap-3"><div className="flex justify-between"><span className="text-muted-foreground">客户</span><span>{selected.customer}</span></div><div className="flex justify-between"><span className="text-muted-foreground">状态</span><StatusBadge value={selected.status} /></div><div className="flex justify-between"><span className="text-muted-foreground">金额</span><span>¥{selected.amount.toLocaleString()}</span></div></div><AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" className="w-full"><Icon name="trash" />删除订单</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>确认删除订单？</AlertDialogTitle><AlertDialogDescription>此操作无法撤销。</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={remove}>确认删除</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div> : null}</SheetContent></Sheet>
    </div>
  )
}
