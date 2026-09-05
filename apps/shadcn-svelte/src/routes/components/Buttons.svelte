<script lang="ts">
  import { LoaderCircle, Plus, Search } from "@lucide/svelte"
  import { Button } from "$lib/components/ui/button"
  import * as ButtonGroup from "$lib/components/ui/button-group"
  import * as InputGroup from "$lib/components/ui/input-group"
  import * as Toggle from "$lib/components/ui/toggle"
  import * as ToggleGroup from "$lib/components/ui/toggle-group"

  let { name }: { name: string } = $props()
  const variants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
</script>

{#if name === "Button" || name === "IconButton"}
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      {#each variants as variant}<Button {variant}>{variant}</Button>{/each}
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <Button size="sm">小</Button><Button>默认</Button><Button size="lg">大</Button>
      <Button size="icon" aria-label="新增"><Plus /></Button>
      <Button size="icon-sm" aria-label="搜索"><Search /></Button>
      <Button disabled>禁用</Button>
      <Button disabled><LoaderCircle class="animate-spin" />加载中</Button>
    </div>
  </div>
{:else if name === "ButtonGroup"}
  <div class="space-y-3">
    <ButtonGroup.Root
      ><Button variant="outline">上一页</Button><Button variant="outline">下一页</Button
      ></ButtonGroup.Root
    >
    <ButtonGroup.Root class="max-w-full"
      ><InputGroup.Input placeholder="组合输入与按钮" /><Button variant="outline">提交</Button
      ></ButtonGroup.Root
    >
  </div>
{:else if name === "Toggle"}
  <div class="flex flex-wrap gap-2">
    <Toggle.Root variant="outline">收藏</Toggle.Root><Toggle.Root size="sm">紧凑</Toggle.Root
    ><Toggle.Root disabled>禁用</Toggle.Root>
  </div>
{:else if name === "ToggleGroup" || name === "Segmented"}
  <ToggleGroup.Root type="single" variant="outline" value="week">
    <ToggleGroup.Item value="day">日</ToggleGroup.Item><ToggleGroup.Item value="week"
      >周</ToggleGroup.Item
    ><ToggleGroup.Item value="month">月</ToggleGroup.Item>
  </ToggleGroup.Root>
{:else}
  <div class="flex flex-wrap gap-2">
    <Button>操作按钮</Button><Button variant="outline">次要操作</Button>
  </div>
{/if}
