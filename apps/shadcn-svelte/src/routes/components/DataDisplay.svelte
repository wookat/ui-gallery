<script lang="ts">
  import {
    ArrowDown,
    ArrowUp,
    Check,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    MoreHorizontal,
    Star,
  } from "@lucide/svelte"
  import * as AspectRatio from "$lib/components/ui/aspect-ratio"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as Badge from "$lib/components/ui/badge"
  import * as Card from "$lib/components/ui/card"
  import * as Carousel from "$lib/components/ui/carousel"
  import * as Dialog from "$lib/components/ui/dialog"
  import * as Empty from "$lib/components/ui/empty"
  import * as HoverCard from "$lib/components/ui/hover-card"
  import * as Popover from "$lib/components/ui/popover"
  import * as Progress from "$lib/components/ui/progress"
  import * as Table from "$lib/components/ui/table"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { Button } from "$lib/components/ui/button"
  import { Separator } from "$lib/components/ui/separator"

  let { name }: { name: string } = $props()
</script>

{#if name === "Table" || name === "DataGrid"}
  <div class="overflow-x-auto">
    <Table.Root class="min-w-[520px]">
      <Table.Caption>本周团队数据</Table.Caption>
      <Table.Header
        ><Table.Row
          ><Table.Head>项目</Table.Head><Table.Head>负责人</Table.Head><Table.Head
            class="text-right">进度 <ArrowDown class="inline size-3" /></Table.Head
          ><Table.Head></Table.Head></Table.Row
        ></Table.Header
      >
      <Table.Body
        ><Table.Row
          ><Table.Cell>网站重构</Table.Cell><Table.Cell>林然</Table.Cell><Table.Cell
            class="text-right">82%</Table.Cell
          ><Table.Cell
            ><Button size="icon-sm" variant="ghost"><MoreHorizontal /></Button></Table.Cell
          ></Table.Row
        ><Table.Row
          ><Table.Cell>数据清理</Table.Cell><Table.Cell>周宁</Table.Cell><Table.Cell
            class="text-right">64%</Table.Cell
          ><Table.Cell
            ><Button size="icon-sm" variant="ghost"><MoreHorizontal /></Button></Table.Cell
          ></Table.Row
        ></Table.Body
      >
      <Table.Footer
        ><Table.Row
          ><Table.Cell colspan={4}>共 2 条记录 · DataGrid 为 Table 组合</Table.Cell></Table.Row
        ></Table.Footer
      >
    </Table.Root>
  </div>
{:else if name === "Descriptions"}
  <dl class="grid gap-3 text-sm sm:grid-cols-2">
    <div>
      <dt class="text-muted-foreground">项目名称</dt>
      <dd class="font-medium">季度规划</dd>
    </div>
    <div>
      <dt class="text-muted-foreground">创建时间</dt>
      <dd class="font-medium">2025-06-20</dd>
    </div>
    <div>
      <dt class="text-muted-foreground">状态</dt>
      <dd><Badge.Root>进行中</Badge.Root></dd>
    </div>
    <div>
      <dt class="text-muted-foreground">负责人</dt>
      <dd class="font-medium">林然</dd>
    </div>
  </dl>
{:else if name === "List"}
  <div class="space-y-2">
    {#each ["设计评审", "上线检查", "复盘会议"] as item}<div
        class="flex items-center justify-between rounded-lg border p-3 text-sm"
      >
        <span>{item}</span><Badge.Root variant="secondary">待处理</Badge.Root>
      </div>{/each}
  </div>
{:else if name === "Card"}
  <div class="grid gap-3 sm:grid-cols-3">
    <Card.Root
      ><Card.Header
        ><Card.Title>默认卡片</Card.Title><Card.Description>简洁信息容器。</Card.Description
        ></Card.Header
      ><Card.Content>内容区域</Card.Content></Card.Root
    >
    <Card.Root class="overflow-hidden"
      ><AspectRatio.Root ratio={16 / 9}
        ><div class="flex size-full items-center justify-center bg-muted">
          <ImageIcon />
        </div></AspectRatio.Root
      ><Card.Content class="p-4">带比例媒体</Card.Content></Card.Root
    >
    <Card.Root
      ><Card.Header><Card.Title>横向卡片</Card.Title></Card.Header><Card.Footer
        ><Button size="sm">确认</Button><Button size="sm" variant="ghost">取消</Button></Card.Footer
      ></Card.Root
    >
  </div>
{:else if name === "Avatar" || name === "AvatarGroup"}
  <div class="flex flex-wrap items-center gap-5">
    <Avatar.Root class="size-8"><Avatar.Fallback>小</Avatar.Fallback></Avatar.Root>
    <Avatar.Root class="size-10"><Avatar.Fallback>中</Avatar.Fallback></Avatar.Root>
    <Avatar.Root class="size-14"><Avatar.Fallback>大</Avatar.Fallback></Avatar.Root>
    <Avatar.Group
      ><Avatar.Root class="size-9"><Avatar.Fallback>林</Avatar.Fallback></Avatar.Root><Avatar.Root
        class="size-9"><Avatar.Fallback>周</Avatar.Fallback></Avatar.Root
      ><Avatar.GroupCount>+8</Avatar.GroupCount></Avatar.Group
    >
  </div>
{:else if name === "Badge" || name === "Tag"}
  <div class="flex flex-wrap gap-2">
    <Badge.Root>默认</Badge.Root><Badge.Root variant="secondary">次要</Badge.Root><Badge.Root
      variant="outline">描边 <button aria-label="移除">×</button></Badge.Root
    ><Badge.Root variant="destructive">危险</Badge.Root>
  </div>
{:else if name === "Statistic"}
  <Card.Root
    ><Card.Content class="flex items-end justify-between p-5"
      ><div>
        <p class="text-sm text-muted-foreground">本月收入</p>
        <p class="mt-1 text-3xl font-bold">¥128,420</p>
      </div>
      <Badge.Root variant="secondary"><ArrowUp class="size-3" />12.8%</Badge.Root></Card.Content
    ></Card.Root
  >
{:else if name === "Timeline"}
  <div class="space-y-4 border-l pl-4 text-sm">
    {#each ["提交设计稿", "完成开发", "发布预览"] as item, i}<div class="relative">
        <span class="absolute -left-[1.35rem] mt-1 size-2 rounded-full bg-primary"></span>
        <p class="font-medium">{item}</p>
        <p class="text-xs text-muted-foreground">今天 {10 + i}:30</p>
      </div>{/each}
  </div>
{:else if name === "Tree"}
  <div class="rounded-lg border p-3 text-sm">
    <p>▾ 工作区</p>
    <p class="pl-5">▾ 设计系统</p>
    <p class="pl-10 text-muted-foreground">按钮规范</p>
  </div>
{:else if name === "Calendar"}
  <div class="rounded-lg border p-3">
    <p class="mb-3 text-sm font-medium">六月 2025</p>
    <div class="grid grid-cols-7 gap-1 text-center text-xs">
      {#each Array(30) as _, i}<span
          class={`rounded p-1 ${i === 19 ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >{i + 1}</span
        >{/each}
    </div>
  </div>
{:else if name === "Image"}
  <Dialog.Root
    ><Dialog.Trigger
      ><button class="block overflow-hidden rounded-lg border"
        ><AspectRatio.Root ratio={16 / 9}
          ><div
            class="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/60"
          >
            <ImageIcon />
          </div></AspectRatio.Root
        ></button
      ></Dialog.Trigger
    ><Dialog.Content
      ><Dialog.Header
        ><Dialog.Title>图片预览</Dialog.Title><Dialog.Description
          >点击图片查看大图。</Dialog.Description
        ></Dialog.Header
      >
      <div class="flex h-56 items-center justify-center rounded-lg bg-muted">
        <ImageIcon class="size-12" />
      </div></Dialog.Content
    ></Dialog.Root
  >
{:else if name === "Carousel"}
  <Carousel.Root class="w-full max-w-sm"
    ><Carousel.Content
      ><Carousel.Item
        ><div class="flex aspect-video items-center justify-center rounded-lg bg-primary/10">
          第一张
        </div></Carousel.Item
      ><Carousel.Item
        ><div class="flex aspect-video items-center justify-center rounded-lg bg-primary/20">
          第二张
        </div></Carousel.Item
      ></Carousel.Content
    ><Carousel.Previous /><Carousel.Next /></Carousel.Root
  >
{:else if name === "Empty"}
  <Empty.Root
    ><Empty.Header
      ><Empty.Media variant="icon"><Star /></Empty.Media><Empty.Title>暂无内容</Empty.Title
      ><Empty.Description>完成第一个任务后，结果会显示在这里。</Empty.Description></Empty.Header
    ><Button>创建任务</Button></Empty.Root
  >
{:else if name === "Tooltip"}
  <Tooltip.Root
    ><Tooltip.Trigger><Button variant="outline">悬停查看提示</Button></Tooltip.Trigger
    ><Tooltip.Content>这是一个 tooltip 示例</Tooltip.Content></Tooltip.Root
  >
{:else if name === "Popover" || name === "HoverCard"}
  <Popover.Root
    ><Popover.Trigger><Button variant="outline">打开浮层</Button></Popover.Trigger><Popover.Content
      ><p class="text-sm font-medium">浮层标题</p>
      <p class="mt-1 text-xs text-muted-foreground">浮层中可以放置更多上下文。</p></Popover.Content
    ></Popover.Root
  >
{:else if name === "QRCode"}
  <Empty.Root
    ><Empty.Header
      ><Empty.Title>shadcn-svelte 无此组件</Empty.Title><Empty.Description
        >二维码由业务侧接入第三方方案。</Empty.Description
      ></Empty.Header
    ></Empty.Root
  >
{:else}
  <div class="space-y-2">
    <Progress.Root value={72} /><Separator />
    <p class="text-sm text-muted-foreground">数据展示组件组合示例。</p>
  </div>
{/if}
