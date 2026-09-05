<script lang="ts">
  let { status }: { status: string } = $props()

  const map: Record<string, { label: string; cls: string }> = {
    paid: { label: "已支付", cls: "preset-tonal-success" },
    pending: { label: "待处理", cls: "preset-tonal-warning" },
    refunded: { label: "已退款", cls: "preset-tonal-surface" },
    failed: { label: "失败", cls: "preset-tonal-error" },
    shipped: { label: "已发货", cls: "preset-tonal-primary" },
    cancelled: { label: "已取消", cls: "preset-tonal-error" },
    due: { label: "待付款", cls: "preset-tonal-warning" },
    active: { label: "启用", cls: "preset-tonal-success" },
  }
  const item = $derived(map[status] ?? { label: status, cls: "preset-tonal" })
</script>

<span class="badge {item.cls}">{item.label}</span>
