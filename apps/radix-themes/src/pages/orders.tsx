import { useMemo, useState } from "react"
import {
  AlertDialog,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  DataList,
  Dialog,
  DropdownMenu,
  Flex,
  IconButton,
  Popover,
  Select,
  Skeleton,
  Table,
  Tabs,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes"
import orders from "@ui-gallery/spec/mock/orders.json"
import { Icon } from "@/icons"
import { useToast } from "@/toast"
import { PageHeader, StatusBadge } from "./shared"

type Order = (typeof orders)[number]

function RowActions({
  order,
  onDelete,
}: {
  order: Order
  onDelete: (o: Order) => void
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          size="3"
          variant="ghost"
          aria-label="更多操作"
          style={{ minHeight: "40px", minWidth: "40px" }}
        >
          <Icon name="more-horizontal" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>编辑</DropdownMenu.Item>
        <DropdownMenu.Item color="red" onSelect={() => onDelete(order)}>
          删除
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export function OrdersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState<Order | null>(null)
  const [deleting, setDeleting] = useState<Order | null>(null)
  const [state, setState] = useState("normal")
  const { show } = useToast()
  const filtered = useMemo(
    () =>
      orders
        .filter(
          (item) =>
            `${item.id} ${item.customer}`
              .toLowerCase()
              .includes(query.toLowerCase()) &&
            (status === "all" || item.status === status)
        )
        .sort((a, b) => (sortAsc ? a.amount - b.amount : b.amount - a.amount)),
    [query, sortAsc, status]
  )
  return (
    <Box>
      <PageHeader
        title="订单管理"
        description="搜索、筛选并查看全部订单。"
        action={
          <Button size="3" variant="outline">
            <Icon name="download" />
            导出
          </Button>
        }
      />
      <Card>
        <Flex direction="column" gap="4">
          <Flex gap="3" wrap="wrap">
            <TextField.Root
              size="3"
              placeholder="搜索订单号..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={{ flex: "1 1 220px", minWidth: 0 }}
            >
              <TextField.Slot>
                <Icon name="search" size={16} />
              </TextField.Slot>
            </TextField.Root>
            <Select.Root size="3" value={status} onValueChange={setStatus}>
              <Select.Trigger placeholder="状态" />
              <Select.Content>
                <Select.Item value="all">全部状态</Select.Item>
                {["paid", "pending", "shipped", "refunded", "failed"].map(
                  (value) => (
                    <Select.Item key={value} value={value}>
                      {value}
                    </Select.Item>
                  )
                )}
              </Select.Content>
            </Select.Root>
            <TextField.Root size="3" type="date" />
            <TextField.Root size="3" type="date" />
            <Popover.Root>
              <Popover.Trigger>
                <Button size="3" variant="soft">
                  <Icon name="filter" />
                  渠道
                </Button>
              </Popover.Trigger>
              <Popover.Content>
                <Flex direction="column" gap="2">
                  <Text weight="bold">渠道</Text>
                  {["web", "ios", "android", "api"].map((channel) => (
                    <Flex key={channel} gap="2" align="center">
                      <Checkbox defaultChecked />
                      <Text>{channel}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Popover.Content>
            </Popover.Root>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button size="3" variant="outline">
                  <Icon name="sliders" />列
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.CheckboxItem checked>
                  客户
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem checked>
                  金额
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem checked>
                  状态
                </DropdownMenu.CheckboxItem>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
          <Flex gap="2">
            <Button
              size="3"
              variant={state === "normal" ? "soft" : "ghost"}
              onClick={() => setState("normal")}
            >
              正常
            </Button>
            <Button
              size="3"
              variant={state === "empty" ? "soft" : "ghost"}
              onClick={() => setState("empty")}
            >
              空
            </Button>
            <Button
              size="3"
              variant={state === "loading" ? "soft" : "ghost"}
              onClick={() => setState("loading")}
            >
              加载
            </Button>
            <Button
              size="3"
              variant={state === "error" ? "soft" : "ghost"}
              onClick={() => setState("error")}
            >
              错误
            </Button>
          </Flex>
          {state === "empty" ? (
            <Flex direction="column" align="center" gap="3" p="8">
              <Icon name="archive" size={32} />
              <Text color="gray">没有找到订单</Text>
              <Button
                size="3"
                variant="outline"
                onClick={() => {
                  setQuery("")
                  setStatus("all")
                }}
              >
                清除筛选
              </Button>
            </Flex>
          ) : state === "loading" ? (
            <Flex direction="column" gap="3">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} loading>
                  <Box height="40px" />
                </Skeleton>
              ))}
            </Flex>
          ) : state === "error" ? (
            <Flex direction="column" gap="3" align="start">
              <Badge color="red">加载失败</Badge>
              <Text color="gray">订单数据暂时无法加载。</Text>
              <Button size="3" onClick={() => setState("normal")}>
                重试
              </Button>
            </Flex>
          ) : (
            <>
              <Box
                display={{ initial: "none", sm: "block" }}
                style={{ overflowX: "auto", minWidth: 0 }}
              >
                <Table.Root variant="surface">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>
                        <Checkbox checked="indeterminate" size="3" />
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        onClick={() => setSortAsc((value) => !value)}
                      >
                        订单{" "}
                        <Icon
                          name={sortAsc ? "arrow-up" : "arrow-down"}
                          size={14}
                        />
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>客户</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>状态</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>日期</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell align="right">
                        金额
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>操作</Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {filtered.slice(0, 10).map((order) => (
                      <Table.Row
                        key={order.id}
                        onClick={() => setSelected(order)}
                        style={{ cursor: "pointer" }}
                      >
                        <Table.Cell>
                          <Checkbox
                            size="3"
                            onClick={(event) => event.stopPropagation()}
                          />
                        </Table.Cell>
                        <Table.Cell>{order.id}</Table.Cell>
                        <Table.Cell>{order.customer}</Table.Cell>
                        <Table.Cell>
                          <StatusBadge value={order.status} />
                        </Table.Cell>
                        <Table.Cell>{order.date}</Table.Cell>
                        <Table.Cell align="right">
                          ¥{order.amount.toLocaleString()}
                        </Table.Cell>
                        <Table.Cell
                          onClick={(event) => event.stopPropagation()}
                        >
                          <RowActions order={order} onDelete={setDeleting} />
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
              <Flex
                direction="column"
                gap="2"
                display={{ initial: "flex", sm: "none" }}
                style={{ minWidth: 0 }}
              >
                {filtered.slice(0, 10).map((order) => (
                  <Card
                    key={order.id}
                    onClick={() => setSelected(order)}
                    style={{ cursor: "pointer", minWidth: 0 }}
                  >
                    <Flex direction="column" gap="2" style={{ minWidth: 0 }}>
                      <Flex justify="between" gap="2" style={{ minWidth: 0 }}>
                        <Text weight="medium" style={{ minWidth: 0 }}>
                          {order.id}
                        </Text>
                        <StatusBadge value={order.status} />
                      </Flex>
                      <Flex justify="between" gap="2" style={{ minWidth: 0 }}>
                        <Text
                          size="2"
                          color="gray"
                          style={{ minWidth: 0, overflowWrap: "anywhere" }}
                        >
                          {order.customer} · {order.date}
                        </Text>
                        <Text weight="medium">
                          ¥{order.amount.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex justify="end">
                        <Box onClick={(event) => event.stopPropagation()}>
                          <RowActions order={order} onDelete={setDeleting} />
                        </Box>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            </>
          )}
          {state === "normal" ? (
            <Flex justify="between" align="center">
              <Text size="2" color="gray">
                共 {filtered.length} 条
              </Text>
              <Flex gap="2">
                <Button
                  size="3"
                  variant="soft"
                  style={{ minHeight: "40px", minWidth: "40px" }}
                >
                  1
                </Button>
                <Button
                  size="3"
                  variant="ghost"
                  style={{ minHeight: "40px", minWidth: "40px" }}
                >
                  2
                </Button>
                <Select.Root size="3" defaultValue="10">
                  <Select.Trigger placeholder="10 / 页" />
                  <Select.Content>
                    <Select.Item value="10">10 / 页</Select.Item>
                    <Select.Item value="20">20 / 页</Select.Item>
                    <Select.Item value="50">50 / 页</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Flex>
          ) : null}
        </Flex>
      </Card>
      <AlertDialog.Root
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialog.Content>
          <AlertDialog.Title>删除订单？</AlertDialog.Title>
          <AlertDialog.Description>此操作无法撤销。</AlertDialog.Description>
          <Flex justify="end" gap="3" mt="4">
            <AlertDialog.Cancel>
              <Button size="3" variant="soft">
                取消
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                size="3"
                color="red"
                onClick={() => {
                  show("订单已删除")
                  setDeleting(null)
                }}
              >
                确认删除
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
      <Dialog.Root
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <Dialog.Content
          style={{
            position: "fixed",
            inset: "0 0 0 auto",
            width: "min(420px, 100vw)",
            maxWidth: "100vw",
            height: "100vh",
            borderRadius: 0,
            overflowY: "auto",
            transform: "none",
          }}
        >
          <Dialog.Title>{selected?.id ?? "订单详情"}</Dialog.Title>
          <Dialog.Description>查看订单完整信息。</Dialog.Description>
          {selected ? (
            <Flex direction="column" gap="4" mt="5">
              <DataList.Root>
                <DataList.Item>
                  <DataList.Label>客户</DataList.Label>
                  <DataList.Value>{selected.customer}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>邮箱</DataList.Label>
                  <DataList.Value>{selected.email}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>状态</DataList.Label>
                  <DataList.Value>
                    <StatusBadge value={selected.status} />
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>金额</DataList.Label>
                  <DataList.Value>
                    ¥{selected.amount.toLocaleString()}
                  </DataList.Value>
                </DataList.Item>
              </DataList.Root>
              <Tabs.Root defaultValue="details">
                <Tabs.List size="2">
                  <Tabs.Trigger value="details">详情</Tabs.Trigger>
                  <Tabs.Trigger value="notes">备注</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="notes" mt="3">
                  <TextArea size="3" placeholder="备注" />
                </Tabs.Content>
              </Tabs.Root>
              <Button
                size="3"
                color="red"
                onClick={() => {
                  const order = selected
                  setSelected(null)
                  setDeleting(order)
                }}
              >
                删除订单
              </Button>
            </Flex>
          ) : null}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  )
}
