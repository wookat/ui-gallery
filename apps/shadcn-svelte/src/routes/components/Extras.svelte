<script lang="ts">
  import { Paperclip, Send, Sparkles } from "@lucide/svelte"
  import * as Attachment from "$lib/components/ui/attachment"
  import * as Bubble from "$lib/components/ui/bubble"
  import * as Collapsible from "$lib/components/ui/collapsible"
  import * as Field from "$lib/components/ui/field"
  import * as Item from "$lib/components/ui/item"
  import * as Marker from "$lib/components/ui/marker"
  import * as Message from "$lib/components/ui/message"
  import * as Menubar from "$lib/components/ui/menubar"
  import * as NavigationMenu from "$lib/components/ui/navigation-menu"
  import * as InputGroup from "$lib/components/ui/input-group"
  import * as HoverCard from "$lib/components/ui/hover-card"
  import * as ContextMenu from "$lib/components/ui/context-menu"
  import * as Label from "$lib/components/ui/label"
  import { Button } from "$lib/components/ui/button"
  import { Badge } from "$lib/components/ui/badge"
  import { Spinner } from "$lib/components/ui/spinner"

  let { name }: { name: string } = $props()
  let expanded = $state(false)
</script>

{#if name === "Collapsible"}
  <Collapsible.Root bind:open={expanded} class="rounded-lg border p-3"
    ><Collapsible.Trigger class="text-sm font-medium"
      >工具调用 {expanded ? "（收起）" : "（展开）"}</Collapsible.Trigger
    ><Collapsible.Content class="pt-3 text-sm text-muted-foreground"
      >已调用数据查询工具并返回 12 条结果。</Collapsible.Content
    ></Collapsible.Root
  >
{:else if name === "InputGroup"}
  <InputGroup.Root
    ><InputGroup.Text>https://</InputGroup.Text><InputGroup.Input
      placeholder="workspace.example"
    /><InputGroup.Button>复制</InputGroup.Button></InputGroup.Root
  >
{:else if name === "Field"}
  <Field.Group
    ><Field.Label>工作邮箱</Field.Label><Field.Content
      ><InputGroup.Input placeholder="name@example.com" /></Field.Content
    ><Field.Description>仅用于发送通知。</Field.Description></Field.Group
  >
{:else if name === "Item"}
  <Item.Root variant="outline"
    ><Item.Media variant="icon"><Paperclip /></Item.Media><Item.Content
      ><Item.Title>附件文件</Item.Title><Item.Description>刚刚上传 · 2.4 MB</Item.Description
      ></Item.Content
    ><Item.Actions><Button size="icon-sm" variant="ghost">×</Button></Item.Actions></Item.Root
  >
{:else if name === "Marker"}
  <Marker.Root
    ><Marker.Icon><Sparkles /></Marker.Icon><Marker.Content
      ><p class="font-medium">关键节点</p>
      <p class="text-xs text-muted-foreground">标记重要信息。</p></Marker.Content
    ></Marker.Root
  >
{:else if name === "Bubble" || name === "Message"}
  <Message.Root
    ><Message.Avatar
      ><div
        class="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Sparkles class="size-4" />
      </div></Message.Avatar
    ><Message.Content
      ><Message.Header>助手 · 刚刚</Message.Header><Bubble.Root
        ><Bubble.Content>这是一个简短的消息气泡。</Bubble.Content></Bubble.Root
      ></Message.Content
    ></Message.Root
  >
{:else if name === "Attachment"}
  <Attachment.Root
    ><Attachment.Media><Paperclip /></Attachment.Media><Attachment.Content
      ><Attachment.Title>需求文档.pdf</Attachment.Title><Attachment.Description
        >上传完成</Attachment.Description
      ></Attachment.Content
    ><Attachment.Actions><Button size="icon-sm" variant="ghost">×</Button></Attachment.Actions
    ></Attachment.Root
  >
{:else if name === "Sonner"}
  <Button onclick={() => alert("Sonner 已由应用壳接入")}>触发通知</Button>
{:else if name === "Menubar"}
  <Menubar.Root
    ><Menubar.Menu
      ><Menubar.Trigger>菜单</Menubar.Trigger><Menubar.Content
        ><Menubar.Item>菜单项</Menubar.Item></Menubar.Content
      ></Menubar.Menu
    ></Menubar.Root
  >
{:else if name === "NavigationMenu"}
  <NavigationMenu.Root
    ><NavigationMenu.List
      ><NavigationMenu.Item
        ><NavigationMenu.Link href="#components">导航链接</NavigationMenu.Link></NavigationMenu.Item
      ></NavigationMenu.List
    ></NavigationMenu.Root
  >
{:else if name === "HoverCard"}
  <HoverCard.Root
    ><HoverCard.Trigger class="text-sm underline">悬停查看详情</HoverCard.Trigger><HoverCard.Content
      ><p class="text-sm">这里可以放置用户资料或上下文信息。</p></HoverCard.Content
    ></HoverCard.Root
  >
{:else if name === "ContextMenu"}
  <ContextMenu.Root
    ><ContextMenu.Trigger class="rounded border border-dashed p-4 text-sm"
      >右键打开菜单</ContextMenu.Trigger
    ><ContextMenu.Content><ContextMenu.Item>复制内容</ContextMenu.Item></ContextMenu.Content
    ></ContextMenu.Root
  >
{:else if name === "Label"}
  <Label.Root for="demo-label">字段标签</Label.Root>
{:else}
  <div class="flex items-center gap-2 rounded-lg border p-4 text-sm">
    <Badge variant="secondary">registry</Badge><Spinner /><span>额外组件演示</span><Button
      size="icon-sm"
      variant="ghost"><Send /></Button
    >
  </div>
{/if}
