<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion"
  import * as AspectRatio from "$lib/components/ui/aspect-ratio"
  import * as Resizable from "$lib/components/ui/resizable"
  import * as ScrollArea from "$lib/components/ui/scroll-area"
  import { Separator } from "$lib/components/ui/separator"

  let { name }: { name: string } = $props()
</script>

{#if name === "Grid"}
  <div class="grid gap-3 sm:grid-cols-3">
    {#each ["一", "二", "三"] as item}<div class="rounded-lg border p-4 text-center">
        {item}号卡片
      </div>{/each}
  </div>
{:else if name === "Stack"}
  <div class="flex flex-col gap-3 rounded-lg border p-4">
    <div class="rounded bg-muted p-3">第一项</div>
    <Separator />
    <div class="rounded bg-muted p-3">第二项</div>
    <Separator />
    <div class="rounded bg-muted p-3">第三项</div>
  </div>
{:else if name === "Layout"}
  <div
    class="grid min-h-40 grid-cols-[96px_1fr] grid-rows-[40px_1fr] overflow-hidden rounded-lg border"
  >
    <div class="col-span-2 border-b bg-muted p-3 text-sm">页头</div>
    <div class="border-r bg-muted/50 p-3 text-xs">侧栏</div>
    <div class="p-4 text-sm">内容区域</div>
  </div>
{:else if name === "Container"}
  <div class="mx-auto max-w-3xl rounded-lg border p-6 text-center text-sm">居中的内容容器</div>
{:else if name === "AspectRatio"}
  <AspectRatio.Root ratio={16 / 9}
    ><div class="flex size-full items-center justify-center rounded-lg bg-primary/15 text-sm">
      16:9 内容区域
    </div></AspectRatio.Root
  >
{:else if name === "Resizable"}
  <div class="overflow-x-auto">
    <Resizable.PaneGroup direction="horizontal" class="min-h-48 min-w-[420px] rounded-lg border"
      ><Resizable.Pane defaultSize={50} class="p-4 text-sm">左侧面板</Resizable.Pane
      ><Resizable.Handle /><Resizable.Pane defaultSize={50}
        ><Resizable.PaneGroup direction="vertical" class="h-full"
          ><Resizable.Pane class="p-4 text-sm">右上嵌套</Resizable.Pane><Resizable.Handle
          /><Resizable.Pane class="p-4 text-sm">右下嵌套</Resizable.Pane></Resizable.PaneGroup
        ></Resizable.Pane
      ></Resizable.PaneGroup
    >
  </div>
{:else if name === "ScrollArea"}
  <ScrollArea.Root class="h-36 rounded-md border p-4"
    ><div class="space-y-2">
      {#each Array(12) as _, i}<p class="text-sm">滚动列表项目 {i + 1}</p>{/each}
    </div>
    <ScrollArea.Scrollbar orientation="vertical" /></ScrollArea.Root
  >
{:else if name === "Accordion"}
  <Accordion.Root type="multiple"
    ><Accordion.Item value="one"
      ><Accordion.Trigger>单个条目</Accordion.Trigger><Accordion.Content
        >内容可以展开和收起。</Accordion.Content
      ></Accordion.Item
    ><Accordion.Item value="two"
      ><Accordion.Trigger>多个条目</Accordion.Trigger><Accordion.Content
        >多个条目可同时打开。</Accordion.Content
      ></Accordion.Item
    ></Accordion.Root
  >
{:else}
  <div class="grid gap-2 sm:grid-cols-3">
    <div class="h-16 rounded bg-primary/10"></div>
    <div class="h-16 rounded bg-primary/20"></div>
    <div class="h-16 rounded bg-primary/30"></div>
  </div>
{/if}
