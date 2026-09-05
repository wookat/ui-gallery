import { useEffect, useMemo, useState } from "react"
import { useCollection } from "@cloudscape-design/collection-hooks"
import Alert from "@cloudscape-design/components/alert"
import Box from "@cloudscape-design/components/box"
import Button from "@cloudscape-design/components/button"
import ButtonDropdown from "@cloudscape-design/components/button-dropdown"
import Cards from "@cloudscape-design/components/cards"
import CollectionPreferences, { type CollectionPreferencesProps } from "@cloudscape-design/components/collection-preferences"
import ContentLayout from "@cloudscape-design/components/content-layout"
import DateRangePicker, { type DateRangePickerProps } from "@cloudscape-design/components/date-range-picker"
import Drawer from "@cloudscape-design/components/drawer"
import Flashbar, { type FlashbarProps } from "@cloudscape-design/components/flashbar"
import FormField from "@cloudscape-design/components/form-field"
import Grid from "@cloudscape-design/components/grid"
import Header from "@cloudscape-design/components/header"
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs"
import Link from "@cloudscape-design/components/link"
import Modal from "@cloudscape-design/components/modal"
import Multiselect, { type MultiselectProps } from "@cloudscape-design/components/multiselect"
import Pagination from "@cloudscape-design/components/pagination"
import Select, { type SelectProps } from "@cloudscape-design/components/select"
import SpaceBetween from "@cloudscape-design/components/space-between"
import Table, { type TableProps } from "@cloudscape-design/components/table"
import Tabs from "@cloudscape-design/components/tabs"
import Textarea from "@cloudscape-design/components/textarea"
import TextFilter from "@cloudscape-design/components/text-filter"

import ordersData from "@ui-gallery/spec/mock/orders.json"

import { iconProps } from "@/lib/icons"
import { useIsMobile } from "@/lib/use-mobile"
import { label, money, OrderStatus, PageHeader, PersonAvatar } from "./shared"

type Order = (typeof ordersData)[number]
type Mode = "default" | "empty" | "loading" | "error"

const STATUSES = Array.from(new Set(ordersData.map((o) => o.status)))
const CHANNELS = Array.from(new Set(ordersData.map((o) => o.channel)))
const ALL_STATUS: SelectProps.Option = { value: "all", label: "全部状态" }

const columnDefinitions: TableProps.ColumnDefinition<Order>[] = [
  { id: "id", header: "订单号", cell: (o) => o.id, sortingField: "id", isRowHeader: true, width: 130 },
  {
    id: "customer",
    header: "客户",
    sortingField: "customer",
    cell: (o) => (
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <PersonAvatar name={o.customer} size="small" />
        <div>
          <div>{o.customer}</div>
          <Box variant="small" color="text-body-secondary">
            {o.email}
          </Box>
        </div>
      </SpaceBetween>
    ),
  },
  { id: "product", header: "产品", cell: (o) => o.product, sortingField: "product" },
  { id: "channel", header: "渠道", cell: (o) => o.channel, sortingField: "channel" },
  { id: "status", header: "状态", cell: (o) => <OrderStatus status={o.status} />, sortingField: "status" },
  { id: "date", header: "日期", cell: (o) => o.date, sortingField: "date" },
  {
    id: "amount",
    header: <Box textAlign="right">金额</Box>,
    cell: (o) => <Box textAlign="right">{money(o.amount, o.currency)}</Box>,
    sortingField: "amount",
  },
]

const DEFAULT_PREFS: CollectionPreferencesProps.Preferences = {
  pageSize: 10,
  wrapLines: false,
  stripedRows: false,
  contentDisplay: columnDefinitions.map((c) => ({ id: c.id!, visible: true })),
}

export function OrdersPage() {
  const isMobile = useIsMobile()
  const [mode, setMode] = useState<Mode>("loading")
  const [status, setStatus] = useState<SelectProps.Option>(ALL_STATUS)
  const [channels, setChannels] = useState<readonly MultiselectProps.Option[]>([])
  const [range, setRange] = useState<DateRangePickerProps.Value | null>(null)
  const [prefs, setPrefs] = useState(DEFAULT_PREFS)
  const [selected, setSelected] = useState<Order | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null)
  const [note, setNote] = useState("")
  const [flash, setFlash] = useState<FlashbarProps.MessageDefinition[]>([])
  const [removed, setRemoved] = useState<string[]>([])

  useEffect(() => {
    const t = window.setTimeout(() => setMode("default"), 600)
    return () => window.clearTimeout(t)
  }, [])

  const source = useMemo(() => {
    if (mode === "empty") return []
    return ordersData.filter((o) => {
      if (removed.includes(o.id)) return false
      if (status.value !== "all" && o.status !== status.value) return false
      if (channels.length && !channels.some((c) => c.value === o.channel)) return false
      if (range?.type === "absolute" && (o.date < range.startDate.slice(0, 10) || o.date > range.endDate.slice(0, 10))) return false
      return true
    })
  }, [mode, removed, status, channels, range])

  const [clearRequested, setClearRequested] = useState(0)
  const { items, collectionProps, filterProps, paginationProps, filteredItemsCount, actions } = useCollection(source, {
    filtering: {
      empty: (
        <Box textAlign="center" padding="l">
          <SpaceBetween size="s">
            <Box variant="strong">还没有订单</Box>
            <Box color="text-body-secondary">创建第一个订单后会出现在这里</Box>
            <Button variant="primary" {...iconProps("plus")} onClick={() => setMode("default")}>
              新建订单
            </Button>
          </SpaceBetween>
        </Box>
      ),
      noMatch: (
        <Box textAlign="center" padding="l">
          <SpaceBetween size="s">
            <Box variant="strong">没有匹配的订单</Box>
            <Button onClick={() => setClearRequested((n) => n + 1)}>清除筛选</Button>
          </SpaceBetween>
        </Box>
      ),
    },
    pagination: { pageSize: prefs.pageSize },
    sorting: { defaultState: { sortingColumn: columnDefinitions[5], isDescending: true } },
    selection: { trackBy: "id" },
  })

  useEffect(() => {
    if (clearRequested) actions.setFiltering("")
  }, [clearRequested, actions])

  const confirmDelete = () => {
    if (!pendingDelete) return
    setRemoved((r) => [...r, pendingDelete.id])
    setFlash([
      {
        id: "deleted",
        type: "success",
        dismissible: true,
        content: `订单 ${pendingDelete.id} 已删除`,
        onDismiss: () => setFlash([]),
      },
    ])
    setPendingDelete(null)
    if (selected?.id === pendingDelete.id) setSelected(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const actionItems = [
    { id: "edit", text: "编辑", ...iconProps("pencil") },
    { id: "delete", text: "删除", ...iconProps("trash") },
  ]
  const onAction = (o: Order, id: string) => {
    if (id === "delete") setPendingDelete(o)
    else setSelected(o)
  }
  const actionColumn: TableProps.ColumnDefinition<Order> = {
    id: "actions",
    header: "操作",
    width: 80,
    cell: (o) => (
      <ButtonDropdown
        variant="inline-icon"
        ariaLabel={`${o.id} 操作`}
        expandToViewport
        items={actionItems}
        onItemClick={({ detail }) => onAction(o, detail.id)}
      />
    ),
  }
  const modeSwitcher = (
    <ButtonDropdown
      items={[
        { id: "default", text: "默认" },
        { id: "empty", text: "空态" },
        { id: "loading", text: "加载" },
        { id: "error", text: "错误" },
      ]}
      onItemClick={({ detail }) => setMode(detail.id as Mode)}
    >
      状态演示
    </ButtonDropdown>
  )
  const sharedHeader = (
    <Header
      variant="awsui-h1-sticky"
      counter={collectionProps.selectedItems?.length ? `(${collectionProps.selectedItems.length}/${source.length})` : `(${source.length})`}
      description="点击行查看详情；使用工具栏筛选与导出"
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          {modeSwitcher}
          <Button {...iconProps("download")} disabled={!source.length}>
            导出
          </Button>
          <Button variant="primary" {...iconProps("plus")}>
            新建订单
          </Button>
        </SpaceBetween>
      }
    >
      订单
    </Header>
  )
  const sharedFilter = (
    <Grid
      gridDefinition={[
        { colspan: { default: 12, s: 4 } },
        { colspan: { default: 6, s: 2 } },
        { colspan: { default: 6, s: 3 } },
        { colspan: { default: 12, s: 3 } },
      ]}
    >
      <TextFilter
        {...filterProps}
        filteringPlaceholder="搜索订单号 / 客户 / 产品"
        filteringAriaLabel="搜索订单"
        countText={filteredItemsCount !== undefined ? `${filteredItemsCount} 条匹配` : ""}
      />
      <Select
        selectedOption={status}
        onChange={({ detail }) => setStatus(detail.selectedOption)}
        options={[ALL_STATUS, ...STATUSES.map((s) => ({ value: s, label: label(s) }))]}
        ariaLabel="状态筛选"
      />
      <Multiselect
        selectedOptions={channels}
        onChange={({ detail }) => setChannels(detail.selectedOptions)}
        options={CHANNELS.map((c) => ({ value: c, label: c }))}
        placeholder="渠道"
        ariaLabel="渠道筛选"
        inlineTokens
      />
      <DateRangePicker
        value={range}
        onChange={({ detail }) => setRange(detail.value)}
        dateOnly
        placeholder="日期范围"
        relativeOptions={[
          { key: "7d", amount: 7, unit: "day", type: "relative" },
          { key: "30d", amount: 30, unit: "day", type: "relative" },
        ]}
        isValidRange={() => ({ valid: true })}
        expandToViewport
      />
    </Grid>
  )
  const sharedPagination = <Pagination {...paginationProps} />
  const sharedPreferences = (
    <CollectionPreferences
      title="表格偏好"
      confirmLabel="确认"
      cancelLabel="取消"
      preferences={prefs}
      onConfirm={({ detail }) => setPrefs(detail)}
      pageSizePreference={{
        title: "每页条数",
        options: [5, 10, 20].map((n) => ({ value: n, label: `${n} 条` })),
      }}
      wrapLinesPreference={{ label: "自动换行", description: "单元格文本换行显示" }}
      stripedRowsPreference={{ label: "斑马纹", description: "交替行背景" }}
      contentDisplayPreference={{
        title: "列显示",
        options: columnDefinitions.map((c) => ({ id: c.id!, label: typeof c.header === "string" ? c.header : "金额" })),
      }}
    />
  )
  const table = (
    <Table<Order>
      {...collectionProps}
      variant="full-page"
      stickyHeader
      resizableColumns
      selectionType="multi"
      loading={mode === "loading"}
      loadingText="加载订单"
      items={items}
      trackBy="id"
      wrapLines={prefs.wrapLines}
      stripedRows={prefs.stripedRows}
      columnDisplay={[...(prefs.contentDisplay ?? []), { id: "actions", visible: true }]}
      columnDefinitions={[...columnDefinitions, actionColumn]}
      onRowClick={({ detail }) => setSelected(detail.item)}
      ariaLabels={{
        selectionGroupLabel: "选择订单",
        allItemsSelectionLabel: () => "全选",
        itemSelectionLabel: (_, item) => `选择 ${item.id}`,
      }}
      header={sharedHeader}
      filter={sharedFilter}
      pagination={sharedPagination}
      preferences={sharedPreferences}
    />
  )
  const cards = (
    <Cards<Order>
      {...collectionProps}
      variant="full-page"
      selectionType="multi"
      loading={mode === "loading"}
      loadingText="加载订单"
      items={items}
      trackBy="id"
      cardsPerRow={[{ cards: 1 }]}
      ariaLabels={{ selectionGroupLabel: "选择订单", itemSelectionLabel: (_, item) => `选择 ${item.id}` }}
      header={sharedHeader}
      filter={sharedFilter}
      pagination={sharedPagination}
      preferences={sharedPreferences}
      cardDefinition={{
        header: (o) => (
          <Link
            fontSize="heading-m"
            onFollow={(e) => {
              e.preventDefault()
              setSelected(o)
            }}
            href="#"
          >
            {o.id}
          </Link>
        ),
        sections: [
          {
            id: "customer",
            header: "客户",
            content: (o) => (
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <PersonAvatar name={o.customer} size="small" />
                <span>{o.customer}</span>
              </SpaceBetween>
            ),
          },
          { id: "product", header: "产品", content: (o) => o.product },
          { id: "channel", header: "渠道", content: (o) => o.channel },
          { id: "status", header: "状态", content: (o) => <OrderStatus status={o.status} /> },
          { id: "date", header: "日期", content: (o) => o.date },
          { id: "amount", header: "金额", content: (o) => money(o.amount, o.currency) },
          {
            id: "actions",
            header: "操作",
            content: (o) => (
              <ButtonDropdown
                variant="normal"
                ariaLabel={`${o.id} 操作`}
                expandToViewport
                items={actionItems}
                onItemClick={({ detail }) => onAction(o, detail.id)}
              >
                操作
              </ButtonDropdown>
            ),
          },
        ],
      }}
    />
  )

  return (
    <ContentLayout
      notifications={flash.length ? <Flashbar items={flash} /> : undefined}
      header={mode === "error" ? <PageHeader title="订单" actions={modeSwitcher} /> : undefined}
    >
      {mode === "error" ? (
        <Alert
          type="error"
          header="订单列表加载失败"
          action={
            <Button {...iconProps("refresh")} onClick={() => setMode("default")}>
              重试
            </Button>
          }
        >
          服务暂时不可用，请稍后重试。
        </Alert>
      ) : (
        isMobile ? cards : table
      )}

      <Drawer
        position="fixed"
        placement="end"
        zIndex={2000}
        open={!!selected}
        backdrop
        onClose={() => setSelected(null)}
        header={<Header variant="h2">{selected?.id}</Header>}
        ariaLabel="订单详情"
        closeAction={{ ariaLabel: "关闭详情" }}
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="primary" onClick={() => setSelected(null)}>
              保存
            </Button>
            <Button onClick={() => selected && setPendingDelete(selected)} {...iconProps("trash")}>
              删除
            </Button>
          </SpaceBetween>
        }
      >
        {selected && (
          <Tabs
            tabs={[
              {
                id: "detail",
                label: "详情",
                content: (
                  <KeyValuePairs
                    columns={2}
                    items={[
                      { label: "客户", value: selected.customer },
                      { label: "邮箱", value: selected.email },
                      { label: "产品", value: selected.product },
                      { label: "金额", value: money(selected.amount, selected.currency) },
                      { label: "状态", value: <OrderStatus status={selected.status} /> },
                      { label: "渠道", value: selected.channel },
                      { label: "日期", value: selected.date },
                    ]}
                  />
                ),
              },
              {
                id: "note",
                label: "备注",
                content: (
                  <FormField label="内部备注" stretch constraintText={`${note.length}/200`}>
                    <Textarea value={note} onChange={({ detail }) => setNote(detail.value)} rows={5} placeholder="记录沟通情况…" />
                  </FormField>
                ),
              },
            ]}
          />
        )}
      </Drawer>

      <Modal
        visible={!!pendingDelete}
        onDismiss={() => setPendingDelete(null)}
        header="删除订单"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setPendingDelete(null)}>
                取消
              </Button>
              <Button variant="primary" onClick={confirmDelete}>
                删除
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <Alert type="warning">确定删除订单 {pendingDelete?.id}？该操作无法撤销。</Alert>
      </Modal>
    </ContentLayout>
  )
}
