import { useMemo, useState, type ComponentProps } from "react"
import { Alert, AlertDialog, Button, Calendar, Card, Checkbox, Drawer, Dropdown, EmptyState, Input, Label, ListBox, Pagination, Popover, Select, Skeleton, Table, TextField, toast } from "@heroui/react"
import { Icon } from "@/components/icon"
import orders from "@ui-gallery/spec/mock/orders.json"
import { PageHeader, StatusBadge } from "./shared"

type Order = (typeof orders)[number]
type TableContentProps = ComponentProps<typeof Table.Content>
type Selection = Parameters<NonNullable<TableContentProps["onSelectionChange"]>>[0]
type SortDescriptor = Parameters<NonNullable<TableContentProps["onSortChange"]>>[0]
const statuses = ["all", "paid", "pending", "shipped", "failed"]

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [selected, setSelected] = useState<Order | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [columns, setColumns] = useState(new Set(["customer", "amount", "status"]))
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())
  const [sort, setSort] = useState<SortDescriptor>({ column: "date", direction: "descending" })
  const showCustomer = columns.has("customer")
  const filtered = useMemo(() => {
    const list = orders.filter((order) => order.id.toLowerCase().includes(query.toLowerCase()) && (status === "all" || order.status === status))
    const dir = sort.direction === "ascending" ? 1 : -1
    return [...list].sort((a, b) => {
      if (sort.column === "amount") return (a.amount - b.amount) * dir
      const key = sort.column === "customer" ? "customer" : sort.column === "id" ? "id" : "date"
      return a[key].localeCompare(b[key]) * dir
    })
  }, [query, status, sort])
  const selectedCount = selectedKeys === "all" ? filtered.length : selectedKeys.size
  const remove = () => { toast.success("订单已删除"); setSelected(null) }

  return (
    <div className="space-y-6">
      <PageHeader title="订单管理" description="搜索、筛选并查看全部订单。" action={<Button variant="secondary"><Icon name="download" size={16} />导出</Button>} />
      <Alert status="accent">
        <Alert.Indicator />
        <Alert.Content><Alert.Title>本地数据集</Alert.Title><Alert.Description>所有订单来自 packages/spec/mock/orders.json，无运行时网络请求。</Alert.Description></Alert.Content>
      </Alert>
      <Card>
        <Card.Content className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_180px_200px_auto]">
            <TextField aria-label="搜索订单号" value={query} onChange={setQuery}><Input placeholder="搜索订单号..." /></TextField>
            <Select aria-label="状态" value={status} onChange={(key) => setStatus(String(key))}>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>{statuses.map((item) => <ListBox.Item key={item} id={item} textValue={item}>{item === "all" ? "全部状态" : item}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox>
              </Select.Popover>
            </Select>
            <Popover>
              <Button variant="secondary" className="justify-start font-normal"><Icon name="calendar" size={16} />{date ?? "日期范围"}</Button>
              <Popover.Content>
                <Popover.Dialog aria-label="选择日期">
                  <Calendar aria-label="订单日期" onChange={(value) => setDate(value ? value.toString() : null)}>
                    <Calendar.Header><Calendar.Heading /><Calendar.NavButton slot="previous" /><Calendar.NavButton slot="next" /></Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
                      <Calendar.GridBody>{(d) => <Calendar.Cell date={d} />}</Calendar.GridBody>
                    </Calendar.Grid>
                  </Calendar>
                </Popover.Dialog>
              </Popover.Content>
            </Popover>
            <Dropdown>
              <Button variant="secondary"><Icon name="sliders" size={16} />列</Button>
              <Dropdown.Popover>
                <Dropdown.Menu aria-label="显示列" selectionMode="multiple" selectedKeys={columns} onSelectionChange={(keys) => setColumns(new Set([...keys].map(String)))}>
                  <Dropdown.Item id="customer"><Label>客户</Label><Dropdown.ItemIndicator /></Dropdown.Item>
                  <Dropdown.Item id="amount"><Label>金额</Label><Dropdown.ItemIndicator /></Dropdown.Item>
                  <Dropdown.Item id="status"><Label>状态</Label><Dropdown.ItemIndicator /></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
          {filtered.length ? (
            <>
              <div className="hidden md:block">
                <Table>
                  <Table.ScrollContainer>
                    <Table.Content aria-label="订单列表" selectionMode="multiple" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} sortDescriptor={sort} onSortChange={setSort}>
                      <Table.Header>
                        <Table.Column width={48} minWidth={48}><Checkbox slot="selection" aria-label="全选"><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control></Checkbox></Table.Column>
                        <Table.Column id="id" isRowHeader allowsSorting>{({ sortDirection }) => <Table.SortableColumnHeader sortDirection={sortDirection}>订单号</Table.SortableColumnHeader>}</Table.Column>
                        {showCustomer ? <Table.Column id="customer" allowsSorting>{({ sortDirection }) => <Table.SortableColumnHeader sortDirection={sortDirection}>客户</Table.SortableColumnHeader>}</Table.Column> : null}
                        <Table.Column id="status">状态</Table.Column>
                        <Table.Column id="date" allowsSorting>{({ sortDirection }) => <Table.SortableColumnHeader sortDirection={sortDirection}>日期</Table.SortableColumnHeader>}</Table.Column>
                        <Table.Column id="amount" allowsSorting className="text-right">{({ sortDirection }) => <Table.SortableColumnHeader sortDirection={sortDirection}>金额</Table.SortableColumnHeader>}</Table.Column>
                        <Table.Column id="actions" className="text-right">操作</Table.Column>
                      </Table.Header>
                      <Table.Body>
                        {filtered.map((order) => (
                          <Table.Row key={order.id} id={order.id}>
                            <Table.Cell><Checkbox slot="selection" aria-label={`选择 ${order.id}`}><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control></Checkbox></Table.Cell>
                            <Table.Cell className="font-medium">{order.id}</Table.Cell>
                            {showCustomer ? <Table.Cell>{order.customer}</Table.Cell> : null}
                            <Table.Cell><StatusBadge value={order.status} /></Table.Cell>
                            <Table.Cell>{order.date}</Table.Cell>
                            <Table.Cell className="text-right">¥{order.amount.toLocaleString()}</Table.Cell>
                            <Table.Cell className="text-right"><Button size="sm" variant="ghost" onPress={() => setSelected(order)}>详情</Button></Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              </div>
              {selectedCount > 0 ? <p className="hidden text-sm text-muted md:block">已选择 {selectedCount} 条订单</p> : null}
              <div className="grid gap-3 md:hidden">
                {filtered.map((order) => (
                  <Card key={order.id} className="cursor-pointer" onClick={() => setSelected(order)}>
                    <Card.Header className="flex-row items-center justify-between"><Card.Title className="text-base">{order.id}</Card.Title><StatusBadge value={order.status} /></Card.Header>
                    <Card.Content className="flex justify-between text-sm text-muted"><span>{order.customer}</span><span>¥{order.amount.toLocaleString()}</span></Card.Content>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <EmptyState className="py-12">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-surface-secondary text-muted"><Icon name="inbox" /></div>
              <h3 className="mt-4 font-semibold">没有找到订单</h3>
              <p className="mt-1 text-sm text-muted">调整搜索或筛选条件后重试。</p>
              <Button className="mt-4" variant="secondary" onPress={() => { setQuery(""); setStatus("all") }}>清除筛选</Button>
            </EmptyState>
          )}
          <Pagination>
            <Pagination.Summary>共 {filtered.length} 条</Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item><Pagination.Previous><Pagination.PreviousIcon /></Pagination.Previous></Pagination.Item>
              <Pagination.Item><Pagination.Link isActive>1</Pagination.Link></Pagination.Item>
              <Pagination.Item><Pagination.Link>2</Pagination.Link></Pagination.Item>
              <Pagination.Item><Pagination.Next><Pagination.NextIcon /></Pagination.Next></Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Card.Content>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-16 rounded-lg" /><Skeleton className="h-16 rounded-lg" /></div>
      <Drawer isOpen={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Drawer.Backdrop>
          <Drawer.Content placement="right">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header><Drawer.Heading>{selected?.id ?? "订单详情"}</Drawer.Heading><p className="text-sm text-muted">查看订单的完整信息与操作。</p></Drawer.Header>
              <Drawer.Body>
                {selected ? (
                  <div className="space-y-5">
                    <div className="grid gap-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted">客户</span><span>{selected.customer}</span></div>
                      <div className="flex justify-between"><span className="text-muted">状态</span><StatusBadge value={selected.status} /></div>
                      <div className="flex justify-between"><span className="text-muted">金额</span><span>¥{selected.amount.toLocaleString()}</span></div>
                    </div>
                    <div className="flex items-center gap-2 text-sm"><Checkbox name="handled" variant="secondary"><Checkbox.Content><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control><Label>标记为已处理</Label></Checkbox.Content></Checkbox></div>
                    <AlertDialog>
                      <Button variant="danger" fullWidth><Icon name="trash" size={16} />删除订单</Button>
                      <AlertDialog.Backdrop>
                        <AlertDialog.Container>
                          <AlertDialog.Dialog>
                            <AlertDialog.Header><AlertDialog.Icon status="danger" /><AlertDialog.Heading>确认删除订单？</AlertDialog.Heading></AlertDialog.Header>
                            <AlertDialog.Body>此操作无法撤销。</AlertDialog.Body>
                            <AlertDialog.Footer><Button slot="close" variant="secondary">取消</Button><Button slot="close" variant="danger" onPress={remove}>确认删除</Button></AlertDialog.Footer>
                          </AlertDialog.Dialog>
                        </AlertDialog.Container>
                      </AlertDialog.Backdrop>
                    </AlertDialog>
                  </div>
                ) : null}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </div>
  )
}
