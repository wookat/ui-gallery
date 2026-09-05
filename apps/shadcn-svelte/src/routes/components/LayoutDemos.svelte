<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion"
  import * as AspectRatio from "$lib/components/ui/aspect-ratio"
  import * as Resizable from "$lib/components/ui/resizable"
  import * as ScrollArea from "$lib/components/ui/scroll-area"

  let { name }: { name: string } = $props()
</script>

{#if name === "Grid" || name === "Stack" || name === "Layout" || name === "Container"}
  <div class="space-y-3 rounded-lg border p-4">
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {#each Array(4) as _, i}<div class="rounded bg-primary/15 p-4 text-center text-xs">
          Grid {i + 1}
        </div>{/each}
    </div>
    <div class="flex flex-wrap gap-2">
      <div class="rounded bg-muted px-4 py-2">Stack A</div>
      <div class="rounded bg-muted px-4 py-2">Stack B</div>
      <div class="rounded bg-muted px-4 py-2">Stack C</div>
    </div>
  </div>
{:else if name === "AspectRatio"}
  <AspectRatio.Root ratio={16 / 9}
    ><div class="flex size-full items-center justify-center rounded-lg bg-primary/15 text-sm">
      16:9 内容区域
    </div></AspectRatio.Root
  >
{:else if name === "Resizable"}
  <div class="overflow-x-auto">
    <Resizable.PaneGroup direction="horizontal" class="min-w-[420px] rounded-lg border"
      ><Resizable.Pane defaultSize={50} class="p-4 text-sm">左侧面板</Resizable.Pane
      ><Resizable.Handle /><Resizable.Pane defaultSize={50}
        ><Resizable.PaneGroup direction="vertical"
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
