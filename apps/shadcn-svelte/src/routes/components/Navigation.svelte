<script lang="ts">
  import {
    ChevronDown,
    Command as CommandIcon,
    Ellipsis,
    Home,
    LayoutDashboard,
    Menu,
    Settings,
  } from "@lucide/svelte"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb"
  import * as Command from "$lib/components/ui/command"
  import * as ContextMenu from "$lib/components/ui/context-menu"
  import * as Dropdown from "$lib/components/ui/dropdown-menu"
  import * as Menubar from "$lib/components/ui/menubar"
  import * as NavigationMenu from "$lib/components/ui/navigation-menu"
  import * as Pagination from "$lib/components/ui/pagination"
  import * as Sidebar from "$lib/components/ui/sidebar"
  import * as Tabs from "$lib/components/ui/tabs"
  import { Button } from "$lib/components/ui/button"
  import { Kbd } from "$lib/components/ui/kbd"

  let { name }: { name: string } = $props()
  let commandOpen = $state(false)
</script>

{#if name === "Menu" || name === "Dropdown"}
  <div class="flex flex-wrap items-center gap-3">
    <Menubar.Root
      ><Menubar.Menu
        ><Menubar.Trigger>项目</Menubar.Trigger><Menubar.Content
          ><Menubar.Item>新建项目 <Menubar.Shortcut>⌘N</Menubar.Shortcut></Menubar.Item
          ><Menubar.Item>导入数据</Menubar.Item><Menubar.Separator /><Menubar.Item
            >退出</Menubar.Item
          ></Menubar.Content
        ></Menubar.Menu
      ><Menubar.Menu
        ><Menubar.Trigger>视图</Menubar.Trigger><Menubar.Content
          ><Menubar.CheckboxItem checked>显示侧栏</Menubar.CheckboxItem><Menubar.RadioGroup
            value="comfortable"
            ><Menubar.RadioItem value="comfortable">舒适</Menubar.RadioItem><Menubar.RadioItem
              value="compact">紧凑</Menubar.RadioItem
            ></Menubar.RadioGroup
          ></Menubar.Content
        ></Menubar.Menu
      ></Menubar.Root
    >
    <Dropdown.Root
      ><Dropdown.Trigger><Button variant="outline">更多 <ChevronDown /></Button></Dropdown.Trigger
      ><Dropdown.Content
        ><Dropdown.Item>编辑 <Dropdown.Shortcut>⌘E</Dropdown.Shortcut></Dropdown.Item><Dropdown.Sub
          ><Dropdown.SubTrigger>移动到</Dropdown.SubTrigger><Dropdown.SubContent
            ><Dropdown.Item>设计</Dropdown.Item><Dropdown.Item>研发</Dropdown.Item
            ></Dropdown.SubContent
          ></Dropdown.Sub
        ><Dropdown.CheckboxItem checked>置顶</Dropdown.CheckboxItem></Dropdown.Content
      ></Dropdown.Root
    >
  </div>
{:else if name === "Breadcrumb"}
  <Breadcrumb.Root
    ><Breadcrumb.List
      ><Breadcrumb.Item><Breadcrumb.Link href="#components">首页</Breadcrumb.Link></Breadcrumb.Item
      ><Breadcrumb.Separator /><Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item
      ><Breadcrumb.Separator /><Breadcrumb.Item
        ><Breadcrumb.Page>当前页面</Breadcrumb.Page></Breadcrumb.Item
      ></Breadcrumb.List
    ></Breadcrumb.Root
  >
{:else if name === "Tabs"}
  <Tabs.Root value="overview" class="flex gap-5 sm:flex-row"
    ><Tabs.List class="sm:flex-col"
      ><Tabs.Trigger value="overview"><Home />概览</Tabs.Trigger><Tabs.Trigger value="details"
        ><Settings />详情</Tabs.Trigger
      ><Tabs.Trigger value="disabled" disabled>禁用</Tabs.Trigger></Tabs.List
    ><Tabs.Content value="overview">默认内容区域</Tabs.Content><Tabs.Content value="details"
      >带图标的详情区域</Tabs.Content
    ></Tabs.Root
  >
{:else if name === "Pagination"}
  <Pagination.Root count={10} perPage={1}
    ><Pagination.Content
      ><Pagination.Item><Pagination.Previous /></Pagination.Item><Pagination.Item
        ><button class="inline-flex size-9 items-center justify-center rounded-md border text-sm"
          >1</button
        ></Pagination.Item
      ><Pagination.Item
        ><button class="inline-flex size-9 items-center justify-center rounded-md text-sm">2</button
        ></Pagination.Item
      ><Pagination.Item><Pagination.Ellipsis /></Pagination.Item><Pagination.Item
        ><Pagination.Next /></Pagination.Item
      ></Pagination.Content
    ></Pagination.Root
  >
{:else if name === "Steps"}
  <div class="flex flex-wrap items-center gap-2 text-sm">
    <span
      class="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >1</span
    ><span>基本信息</span><span class="h-px w-8 bg-border"></span><span
      class="flex size-7 items-center justify-center rounded-full border">2</span
    ><span>确认</span>
  </div>
{:else if name === "Anchor"}
  <aside class="rounded-lg border p-3 text-sm">
    <p class="font-medium">本页导航</p>
    <a class="mt-2 block text-muted-foreground hover:text-foreground" href="#Typography">排版</a><a
      class="mt-1 block text-muted-foreground hover:text-foreground"
      href="#Button">按钮</a
    >
  </aside>
{:else if name === "BackTop"}
  <div class="flex items-center gap-3 text-sm">
    <span>滚动页面后</span><Button
      size="icon"
      class="fixed right-5 bottom-5 rounded-full shadow-lg"
      onclick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</Button
    >
  </div>
{:else if name === "Navbar"}
  <NavigationMenu.Root
    ><NavigationMenu.List
      ><NavigationMenu.Item
        ><NavigationMenu.Link href="#components">产品概览</NavigationMenu.Link></NavigationMenu.Item
      ><NavigationMenu.Item
        ><NavigationMenu.Trigger>资源</NavigationMenu.Trigger><NavigationMenu.Content class="p-4"
          ><p class="text-sm">帮助中心与团队文档</p></NavigationMenu.Content
        ></NavigationMenu.Item
      ></NavigationMenu.List
    ></NavigationMenu.Root
  >
{:else if name === "Sidebar"}
  <Sidebar.Provider class="min-h-0"
    ><Sidebar.Root collapsible="none" class="relative h-56 w-56"
      ><Sidebar.Header
        ><div class="flex items-center gap-2 px-2 font-semibold">
          <LayoutDashboard />工作台
        </div></Sidebar.Header
      ><Sidebar.Content
        ><Sidebar.Group
          ><Sidebar.GroupLabel>导航</Sidebar.GroupLabel><Sidebar.Menu
            ><Sidebar.MenuItem
              ><Sidebar.MenuButton isActive><Home /><span>概览</span></Sidebar.MenuButton
              ></Sidebar.MenuItem
            ><Sidebar.MenuItem
              ><Sidebar.MenuButton><Settings /><span>设置</span></Sidebar.MenuButton
              ></Sidebar.MenuItem
            ></Sidebar.Menu
          ></Sidebar.Group
        ></Sidebar.Content
      ></Sidebar.Root
    ></Sidebar.Provider
  >
{:else if name === "CommandPalette"}
  <div class="space-y-3">
    <Button variant="outline" onclick={() => (commandOpen = true)}
      ><CommandIcon />打开命令面板 <Kbd>⌘K</Kbd></Button
    ><Command.Dialog bind:open={commandOpen}
      ><Command.Input placeholder="搜索命令" /><Command.List
        ><Command.Empty>没有匹配命令</Command.Empty><Command.Group heading="常用命令"
          ><Command.Item>创建项目</Command.Item><Command.Item>打开设置</Command.Item></Command.Group
        ></Command.List
      ></Command.Dialog
    >
  </div>
{:else if name === "ContextMenu"}
  <ContextMenu.Root
    ><ContextMenu.Trigger
      class="flex h-20 items-center justify-center rounded-lg border border-dashed text-sm"
      >在此处右键点击</ContextMenu.Trigger
    ><ContextMenu.Content
      ><ContextMenu.Item>复制</ContextMenu.Item><ContextMenu.Item>重命名</ContextMenu.Item
      ></ContextMenu.Content
    ></ContextMenu.Root
  >
{:else}
  <div class="flex items-center gap-2 rounded-lg border p-4 text-sm">
    <Menu class="size-4" />导航组件组合示例 <Ellipsis class="ml-auto size-4" />
  </div>
{/if}
