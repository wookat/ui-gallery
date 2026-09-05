import { useMemo, useState } from "react"
import { ActionIcon, Alert, Avatar, Button, Card, Center, Checkbox, Drawer, EmptyState, Group, Loader, Menu, Modal, MultiSelect, Pagination, Popover, Select, Stack, Switch, Table, Tabs, Text, TextInput, Textarea, UnstyledButton, DataList } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { notifications } from "@mantine/notifications"
import { Icon } from "@ui-gallery/icons-react"
import orders from "@ui-gallery/spec/mock/orders.json"
import { muted, PageHeader, StatusBadge, money } from "./shared"
import { useFakeLoading } from "./dashboard"

type Order = (typeof orders)[number]
type SortKey = "id" | "customer" | "amount" | "date" | "status"
const columns: { key: SortKey | "product" | "channel"; label: string; align?: "right" }[] = [
  { key: "id", label: "订单号" },
  { key: "customer", label: "客户" },
  { key: "product", label: "商品" },
  { key: "channel", label: "渠道" },
  { key: "status", label: "状态" },
  { key: "date", label: "日期" },
  { key: "amount", label: "金额", align: "right" },
]
const statuses = [...new Set(orders.map((o) => o.status))]
const channels = [...new Set(orders.map((o) => o.channel))]

export function OrdersPage() {
  const loading = useFakeLoading()
  const viewState = new URLSearchParams(window.location.search).get("state")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [channelFilter, setChannelFilter] = useState<string[]>([])
  const [range, setRange] = useState<[string | null, string | null]>([null, null])
  const [visible, setVisible] = useState<Record<string, boolean>>(Object.fromEntries(columns.map((c) => [c.key, true])))
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "date", dir: -1 })
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState("10")
  const [detail, setDetail] = useState<Order | null>(null)
  const [deleting, setDeleting] = useState<Order | null>(null)
  const [error, setError] = useState(viewState === "error")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders
      .filter((o) => (!q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.includes(q)) && (!status || o.status === status) && (!channelFilter.length || channelFilter.includes(o.channel)) && (!range[0] || o.date >= range[0]) && (!range[1] || o.date <= range[1]))
      .sort((a, b) => (a[sort.key] > b[sort.key] ? sort.dir : a[sort.key] < b[sort.key] ? -sort.dir : 0))
  }, [query, status, channelFilter, range, sort])
  const size = Number(pageSize)
  const pageCount = Math.max(1, Math.ceil(filtered.length / size))
  const rows = viewState === "empty" ? [] : filtered.slice((page - 1) * size, page * size)
  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id))
  const someSelected = rows.some((r) => selected.includes(r.id))

  const toggleSort = (key: SortKey) => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }))
  const toggleAll = () => setSelected(allSelected ? selected.filter((id) => !rows.some((r) => r.id === id)) : [...new Set([...selected, ...rows.map((r) => r.id)])])
  const toggleRow = (id: string, checked?: boolean) => setSelected((current) => checked === undefined ? (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]) : checked ? [...new Set([...current, id])] : current.filter((value) => value !== id))
  const confirmDelete = () => {
    setDeleting(null)
    notifications.show({ title: "已删除", message: `订单 ${deleting?.id} 已删除`, color: "teal", icon: <Icon name="check" size={16} /> })
  }

  return (
    <Stack gap="lg">
      <PageHeader title="订单" description={`共 ${orders.length} 笔订单`} action={<Button leftSection={<Icon name="plus" size={16} />}>新建订单</Button>} />

      <Card withBorder radius="md" padding="md">
        <Group gap="sm" wrap="wrap">
          <TextInput placeholder="搜索订单号 / 客户" leftSection={<Icon name="search" size={15} />} value={query} onChange={(e) => setQuery(e.currentTarget.value)} w={{ base: "100%", sm: 220 }} />
          <Select placeholder="状态" data={statuses} value={status} onChange={setStatus} clearable w={{ base: "100%", sm: 140 }} />
          <DatePickerInput type="range" placeholder="日期范围" value={range} onChange={setRange} clearable leftSection={<Icon name="calendar" size={15} />} w={{ base: "100%", sm: 240 }} valueFormat="MM-DD" />
          <MultiSelect placeholder="渠道" data={channels} value={channelFilter} onChange={setChannelFilter} clearable w={{ base: "100%", sm: 200 }} />
          <Group gap="xs" ml={{ sm: "auto" }}>
            <Button variant="default" leftSection={<Icon name="download" size={15} />}>导出</Button>
            <Popover position="bottom-end" width={200}>
              <Popover.Target><Button variant="default" leftSection={<Icon name="sliders" size={15} />}>列</Button></Popover.Target>
              <Popover.Dropdown>
                <Stack gap="xs">
                  {columns.map((c) => <Switch key={c.key} size="sm" label={c.label} checked={visible[c.key]} onChange={(e) => setVisible({ ...visible, [c.key]: e.currentTarget.checked })} />)}
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Group>
      </Card>

      {error ? (
        <Alert color="red" variant="light" title="加载失败" icon={<Icon name="alert-circle" size={16} />}>
          <Group justify="space-between">
            <Text size="sm">无法获取订单数据，请检查网络后重试。</Text>
            <Button size="xs" color="red" variant="light" leftSection={<Icon name="refresh" size={14} />} onClick={() => setError(false)}>重试</Button>
          </Group>
        </Alert>
      ) : null}

      <Card withBorder radius="md" padding={0}>
        {loading ? (
          <Center py={80}><Stack align="center" gap="sm"><Loader /><Text size="sm" c={muted}>加载订单...</Text></Stack></Center>
        ) : rows.length === 0 ? (
          <EmptyState py={60} icon={<Icon name="shopping-cart" size={28} />} title="暂无订单" description="调整筛选条件，或创建第一笔订单。">
            <EmptyState.Actions><Button leftSection={<Icon name="plus" size={16} />}>新建订单</Button></EmptyState.Actions>
          </EmptyState>
        ) : (
          <Table.ScrollContainer minWidth={960}>
            <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="md" styles={{ th: { whiteSpace: "nowrap" }, td: { whiteSpace: "nowrap" } }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={40} style={{ cursor: "pointer" }} onClick={toggleAll}><Checkbox size="md" aria-label="全选" checked={allSelected} indeterminate={someSelected && !allSelected} onClick={(e) => e.stopPropagation()} onChange={toggleAll} /></Table.Th>
                  {columns.filter((c) => visible[c.key]).map((c) => (
                    <Table.Th key={c.key} ta={c.align}>
                      {c.key === "product" || c.key === "channel" ? c.label : (
                        <UnstyledButton onClick={() => toggleSort(c.key as SortKey)} fz="sm" fw={600} mih={{ base: 40, sm: 0 }} display="flex" style={{ alignItems: "center" }}>
                          <Group gap={4} wrap="nowrap" justify={c.align === "right" ? "flex-end" : undefined}>{c.label}<Icon name={sort.key === c.key ? (sort.dir === 1 ? "chevron-up" : "chevron-down") : "minus"} size={12} /></Group>
                        </UnstyledButton>
                      )}
                    </Table.Th>
                  ))}
                  <Table.Th w={60} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((o) => (
                  <Table.Tr key={o.id} bg={selected.includes(o.id) ? "var(--mantine-primary-color-light)" : undefined} onClick={() => setDetail(o)} style={{ cursor: "pointer" }}>
                    <Table.Td onClick={(e) => { e.stopPropagation(); toggleRow(o.id) }} style={{ cursor: "pointer" }}><Checkbox size="md" aria-label={`选择 ${o.id}`} checked={selected.includes(o.id)} onClick={(e) => e.stopPropagation()} onChange={(e) => toggleRow(o.id, e.currentTarget.checked)} /></Table.Td>
                    {visible.id ? <Table.Td><Text size="sm" fw={500}>{o.id}</Text></Table.Td> : null}
                    {visible.customer ? <Table.Td><Group gap="xs" wrap="nowrap"><Avatar size="sm" radius="xl" color="blue">{o.customer.slice(0, 1)}</Avatar><div><Text size="sm">{o.customer}</Text><Text size="xs" c={muted}>{o.email}</Text></div></Group></Table.Td> : null}
                    {visible.product ? <Table.Td><Text size="sm">{o.product}</Text></Table.Td> : null}
                    {visible.channel ? <Table.Td><Text size="sm" tt="uppercase" c={muted}>{o.channel}</Text></Table.Td> : null}
                    {visible.status ? <Table.Td><StatusBadge value={o.status} /></Table.Td> : null}
                    {visible.date ? <Table.Td><Text size="sm">{o.date}</Text></Table.Td> : null}
                    {visible.amount ? <Table.Td ta="right"><Text size="sm" ff="monospace">{money(o.amount, o.currency)}</Text></Table.Td> : null}
                    <Table.Td onClick={(e) => e.stopPropagation()}>
                      <Menu position="bottom-end">
                        <Menu.Target><ActionIcon size={40} variant="subtle" color="gray" aria-label="操作"><Icon name="more-horizontal" size={16} /></ActionIcon></Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<Icon name="pencil" size={14} />} onClick={() => setDetail(o)}>编辑</Menu.Item>
                          <Menu.Item color="red" leftSection={<Icon name="trash" size={14} />} onClick={() => setDeleting(o)}>删除</Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
        <Group justify="space-between" p="md" wrap="wrap" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
          <Text size="sm" c={muted}>已选 {selected.length} / {filtered.length} 条</Text>
          <Group gap="sm">
            <Select size="xs" w={110} data={["5", "10", "20"].map((v) => ({ value: v, label: `${v} 条/页` }))} value={pageSize} onChange={(v) => { setPageSize(v ?? "10"); setPage(1) }} />
            <Pagination size="sm" total={pageCount} value={page} onChange={setPage} />
          </Group>
        </Group>
      </Card>

      <Drawer opened={!!detail} onClose={() => setDetail(null)} position="right" size="md" title={detail ? `订单 ${detail.id}` : ""}>
        {detail ? (
          <Stack gap="md">
            <Group><StatusBadge value={detail.status} /><Text size="sm" c={muted}>{detail.date}</Text></Group>
            <DataList withDivider labelWidth={80}>
              <DataList.Item><DataList.ItemLabel>客户</DataList.ItemLabel><DataList.ItemValue>{detail.customer}</DataList.ItemValue></DataList.Item>
              <DataList.Item><DataList.ItemLabel>邮箱</DataList.ItemLabel><DataList.ItemValue>{detail.email}</DataList.ItemValue></DataList.Item>
              <DataList.Item><DataList.ItemLabel>商品</DataList.ItemLabel><DataList.ItemValue>{detail.product}</DataList.ItemValue></DataList.Item>
              <DataList.Item><DataList.ItemLabel>渠道</DataList.ItemLabel><DataList.ItemValue>{detail.channel}</DataList.ItemValue></DataList.Item>
              <DataList.Item><DataList.ItemLabel>金额</DataList.ItemLabel><DataList.ItemValue>{money(detail.amount, detail.currency)}</DataList.ItemValue></DataList.Item>
            </DataList>
            <Tabs defaultValue="items">
              <Tabs.List><Tabs.Tab value="items">明细</Tabs.Tab><Tabs.Tab value="history">历史</Tabs.Tab><Tabs.Tab value="notes">备注</Tabs.Tab></Tabs.List>
              <Tabs.Panel value="items" pt="md"><Text size="sm">{detail.product} × 1 — {money(detail.amount, detail.currency)}</Text></Tabs.Panel>
              <Tabs.Panel value="history" pt="md"><Text size="sm" c={muted}>{detail.date} 创建 · 状态 {detail.status}</Text></Tabs.Panel>
              <Tabs.Panel value="notes" pt="md"><Textarea placeholder="添加备注..." autosize minRows={3} /></Tabs.Panel>
            </Tabs>
            <Group justify="flex-end"><Button variant="default" onClick={() => setDetail(null)}>关闭</Button><Button color="red" variant="light" onClick={() => { setDeleting(detail); setDetail(null) }}>删除</Button></Group>
          </Stack>
        ) : null}
      </Drawer>

      <Modal opened={!!deleting} onClose={() => setDeleting(null)} title="确认删除" centered>
        <Text size="sm">确定删除订单 <Text span fw={600}>{deleting?.id}</Text> 吗？此操作不可撤销。</Text>
        <Group justify="flex-end" mt="lg"><Button variant="default" onClick={() => setDeleting(null)}>取消</Button><Button color="red" onClick={confirmDelete}>删除</Button></Group>
      </Modal>
    </Stack>
  )
}
