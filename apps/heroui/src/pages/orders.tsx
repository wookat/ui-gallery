import { useMemo, useState, type ComponentProps } from "react"
import { Alert, AlertDialog, Button, Calendar, Card, Checkbox, Drawer, Dropdown, EmptyState, Input, Label, ListBox, Pagination, Popover, Select, Skeleton, Table, TextField, toast, ToggleButton, ToggleButtonGroup } from "@heroui/react"
import { Icon } from "@/components/icon"
import orders from "@ui-gallery/spec/mock/orders.json"
import { PageHeader, StatusBadge } from "./shared"

type Order = (typeof orders)[number]
type TableContentProps = ComponentProps<typeof Table.Content>
type Selection = Parameters<NonNullable<TableContentProps["onSelectionChange"]>>[0]
type SortDescriptor = Parameters<NonNullable<TableContentProps["onSortChange"]>>[0]
type LoadState = "loading" | "error" | "ready"
const statuses = [...new Set(orders.map((order) => order.status))]
const loadFromUrl = (): LoadState => {
  const value = new URLSearchParams(window.location.search).get("state")
  return value === "loading" || value === "error" ? value : "ready"
}

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<Set<string>>(new Set())
  const [load, setLoad] = useState<LoadState>(loadFromUrl)
  const [selected, setSelected] = useState<Order | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [columns, setColumns] = useState(new Set(["customer", "amount", "status"]))
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())
  const [sort, setSort] = useState<SortDescriptor>({ column: "date", direction: "descending" })
  const [page, setPage] = useState(1)
  const pageSize = 10
  const showCustomer = columns.has("customer")
  const filtered = useMemo(() => {
    const list = orders.filter((order) => order.id.toLowerCase().includes(query.toLowerCase()) && (!status.size || status.has(order.status)))
    const dir = sort.direction === "ascending" ? 1 : -1
    return [...list].sort((a, b) => {
      if (sort.column === "amount") return (a.amount - b.amount) * dir
      const key = sort.column === "customer" ? "customer" : sort.column === "id" ? "id" : "date"
      return a[key].localeCompare(b[key]) * dir
    })
  }, [query, status, sort])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pageCount)
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize)
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_240px_200px_auto]">
            <TextField aria-label="搜索订单号" value={query} onChange={(value) => { setQuery(value); setPage(1) }}><Input placeholder="搜索订单号..." /></TextField>
            <Select aria-label="状态" selectionMode="multiple" placeholder="全部状态" value={[...status]} onChange={(keys) => { setStatus(new Set(keys.map(String))); setPage(1) }}>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>{statuses.map((item) => <ListBox.Item key={item} id={item} textValue={item}>{item}<ListBox.ItemIndicator /></ListBox.Item>)}</ListBox>
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
            <ToggleButtonGroup selectionMode="single" selectedKeys={[load]} onSelectionChange={(keys) => { const [next] = [...keys]; if (next) setLoad(next as LoadState) }} aria-label="演示状态" className="sm:col-span-2 lg:col-span-1">
              <ToggleButton id="ready">就绪</ToggleButton>
              <ToggleButton id="loading">加载中</ToggleButton>
              <ToggleButton id="error">出错</ToggleButton>
            </ToggleButtonGroup>
          </div>
          {load === "loading" ? (
            <div className="space-y-3" aria-label="订单加载中">
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="flex gap-3"><Skeleton className="h-5 flex-1 rounded" /><Skeleton className="h-5 w-24 rounded" /><Skeleton className="h-5 w-20 rounded" /></div>)}
            </div>
          ) : load === "error" ? (
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content><Alert.Title>订单加载失败</Alert.Title><Alert.Description>暂时无法加载订单列表。</Alert.Description></Alert.Content>
              <Button variant="secondary" onPress={() => setLoad("ready")}>重试</Button>
            </Alert>
          ) : filtered.length ? (
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
                        {visible.map((order) => (
                          <Table.Row key={order.id} id={order.id} className="cursor-pointer" onClick={() => setSelected(order)}>
                            <Table.Cell><Checkbox slot="selection" variant="secondary" aria-label={`选择 ${order.id}`} onClick={(event) => event.stopPropagation()}><Checkbox.Control><Checkbox.Indicator /></Checkbox.Control></Checkbox></Table.Cell>
                            <Table.Cell className="font-medium">{order.id}</Table.Cell>
                            {showCustomer ? <Table.Cell>{order.customer}</Table.Cell> : null}
                            <Table.Cell><StatusBadge value={order.status} /></Table.Cell>
                            <Table.Cell>{order.date}</Table.Cell>
                            <Table.Cell className="text-right">¥{order.amount.toLocaleString()}</Table.Cell>
                            <Table.Cell className="text-right">
                              <Dropdown>
                                <Dropdown.Trigger><Button isIconOnly variant="ghost" size="sm" aria-label="操作" onClick={(event) => event.stopPropagation()}><Icon name="more-horizontal" size={16} /></Button></Dropdown.Trigger>
                                <Dropdown.Popover><Dropdown.Menu aria-label="订单操作" onAction={(key) => { if (key === "view") setSelected(order); if (key === "edit") toast.success(`已触发：编辑 ${order.id}`); if (key === "delete") toast.success(`已触发：删除 ${order.id}`) }}>
                                  <Dropdown.Item id="view"><Label>查看详情</Label></Dropdown.Item>
                                  <Dropdown.Item id="edit"><Label>编辑</Label></Dropdown.Item>
                                  <Dropdown.Item id="delete" variant="danger"><Label>删除</Label></Dropdown.Item>
                                </Dropdown.Menu></Dropdown.Popover>
                              </Dropdown>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              </div>
              {selectedCount > 0 ? <p className="hidden text-sm text-muted md:block">已选择 {selectedCount} 条订单</p> : null}
              <div className="grid gap-3 md:hidden">
                {visible.map((order) => (
                  <Card key={order.id} className="cursor-pointer" onClick={() => setSelected(order)} onKeyDown={(event) => { if (event.key === "Enter") setSelected(order) }}>
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
              <Button className="mt-4" variant="secondary" onPress={() => { setQuery(""); setStatus(new Set()); setPage(1) }}>清除筛选</Button>
            </EmptyState>
          )}
          {load === "ready" && filtered.length ? <Pagination>
            <Pagination.Summary>共 {filtered.length} 条</Pagination.Summary>
            <Pagination.Content>
              <Pagination.Item><Pagination.Previous className="min-h-10 min-w-10" isDisabled={current === 1} onPress={() => setPage((value) => Math.max(1, value - 1))}><Pagination.PreviousIcon /></Pagination.Previous></Pagination.Item>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((value) => <Pagination.Item key={value}><Pagination.Link className="min-h-10 min-w-10" isActive={current === value} onPress={() => setPage(value)}>{value}</Pagination.Link></Pagination.Item>)}
              <Pagination.Item><Pagination.Next className="min-h-10 min-w-10" isDisabled={current === pageCount} onPress={() => setPage((value) => Math.min(pageCount, value + 1))}><Pagination.NextIcon /></Pagination.Next></Pagination.Item>
            </Pagination.Content>
          </Pagination> : null}
        </Card.Content>
      </Card>
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
