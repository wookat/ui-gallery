<script lang="ts">
  import type { Snippet } from "svelte"
  import { AppBar, Avatar, Dialog, Menu, Navigation, Popover, Portal } from "@skeletonlabs/skeleton-svelte"
  import nav from "@ui-gallery/spec/mock/nav.json"
  import notifications from "@ui-gallery/spec/mock/notifications.json"
  import team from "@ui-gallery/spec/mock/team.json"
  import Icon from "../lib/Icon.svelte"
  import type { IconName } from "../lib/icons"
  import { link, router } from "../lib/router.svelte"
  import { isDark, setDark } from "../lib/settings"
  import { initials } from "../lib/format"

  let { children }: { children: Snippet } = $props()

  let dark = $state(isDark())
  let drawerOpen = $state(false)
  let collapsed = $state(false)
  const me = team[0]
  const unread = notifications.filter((n) => n.unread).length
  const current = $derived(nav.find((n) => n.path === router.path))

  function toggleTheme() {
    dark = !dark
    setDark(dark)
  }
</script>

{#snippet navItems()}
  <Navigation.Content class="w-full">
    <Navigation.Group>
      <Navigation.Label class="pl-2 text-xs uppercase tracking-wide opacity-60">导航</Navigation.Label>
      <Navigation.Menu>
        {#each nav as item (item.key)}
          <Navigation.TriggerAnchor
            href={router.href(item.path)}
            title={item.label}
            aria-label={item.label}
            aria-current={router.path === item.path ? "page" : undefined}
            class="gap-3 {collapsed ? 'lg:justify-center lg:px-0' : ''} {router.path === item.path ? 'preset-filled-primary-500' : ''}"
            onclick={(e: MouseEvent) => {
              e.preventDefault()
              drawerOpen = false
              router.navigate(item.path)
            }}
          >
            <Icon name={item.icon as IconName} class="size-4 shrink-0" />
            <Navigation.TriggerText class="flex-1 text-left {collapsed ? 'lg:hidden' : ''}">{item.label}</Navigation.TriggerText>
            {#if item.badge}
              <span class="badge preset-filled-error-500 text-xs {collapsed ? 'lg:hidden' : ''}">{item.badge}</span>
            {/if}
          </Navigation.TriggerAnchor>
        {/each}
      </Navigation.Menu>
    </Navigation.Group>
  </Navigation.Content>
{/snippet}

<div class="min-h-screen grid grid-cols-1 {collapsed ? 'lg:grid-cols-[80px_1fr]' : 'lg:grid-cols-[260px_1fr]'}">
  <Navigation layout="sidebar" data-collapsed={collapsed} class="hidden! lg:grid! w-full! grid-rows-[auto_1fr_auto] gap-4 h-screen sticky top-0 border-r border-surface-200-800 bg-surface-50-950! {collapsed ? 'px-2!' : ''}">
    <Navigation.Header class="flex items-center gap-2 px-2 {collapsed ? 'flex-col' : ''}">
      <span class="btn-icon preset-filled-primary-500 font-bold shrink-0">A</span>
      <div class="min-w-0 flex-1 {collapsed ? 'hidden' : ''}">
        <p class="font-bold leading-tight">Acme Console</p>
        <p class="text-xs opacity-60">Skeleton · Svelte</p>
      </div>
      <button
        type="button"
        class="btn-icon min-w-10 min-h-10 hover:preset-tonal shrink-0"
        aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
        aria-expanded={!collapsed}
        onclick={() => (collapsed = !collapsed)}
      >
        <Icon name={collapsed ? "chevron-right" : "chevron-left"} class="size-5" />
      </button>
    </Navigation.Header>
    {@render navItems()}
    <Navigation.Footer class="w-full">
      <div class="flex items-center gap-3 px-2 {collapsed ? 'justify-center' : ''}">
        <Avatar class="size-9">
          <Avatar.Fallback class="preset-filled-secondary-500">{initials(me.name)}</Avatar.Fallback>
        </Avatar>
        <div class="min-w-0 {collapsed ? 'hidden' : ''}">
          <p class="text-sm font-medium truncate">{me.name}</p>
          <p class="text-xs opacity-60 truncate">{me.email}</p>
        </div>
      </div>
    </Navigation.Footer>
  </Navigation>

  <div class="min-w-0 flex flex-col">
    <AppBar class="sticky top-0 z-30 border-b border-surface-200-800 bg-surface-50-950/90! backdrop-blur py-2!">
      <AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
        <AppBar.Lead class="flex items-center gap-2">
          <Dialog open={drawerOpen} onOpenChange={(d) => (drawerOpen = d.open)}>
            <Dialog.Trigger class="btn-icon min-w-10 min-h-10 hover:preset-tonal lg:hidden" aria-label="打开菜单">
              <Icon name="menu" class="size-5" />
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
              <Dialog.Positioner class="fixed inset-0 z-50 flex justify-start">
                <Dialog.Content class="h-screen w-72 max-w-[85vw] bg-surface-50-950 p-4 shadow-xl overflow-y-auto">
                  <header class="flex justify-between items-center mb-4">
                    <Dialog.Title class="font-bold">Acme Console</Dialog.Title>
                    <Dialog.CloseTrigger class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="关闭"><Icon name="x" /></Dialog.CloseTrigger>
                  </header>
                  <Navigation layout="sidebar" class="w-full! p-0! bg-transparent!">
                    {@render navItems()}
                  </Navigation>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog>
          <ol class="hidden sm:flex items-center gap-2 text-sm">
            <li><a class="anchor" href={router.href("/")} use:link>首页</a></li>
            {#if current && current.path !== "/"}
              <li class="opacity-50"><Icon name="chevron-right" class="size-3" /></li>
              <li aria-current="page" class="font-medium">{current.label}</li>
            {/if}
          </ol>
        </AppBar.Lead>
        <AppBar.Headline class="hidden md:block">
          <label class="relative block max-w-md mx-auto">
            <span class="sr-only">搜索</span>
            <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"><Icon name="search" /></span>
            <input class="input pl-9" type="search" placeholder="搜索订单、客户、文档…" />
            <kbd class="kbd absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline">⌘K</kbd>
          </label>
        </AppBar.Headline>
        <AppBar.Trail class="items-center">
          <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal md:hidden" aria-label="搜索"><Icon name="search" class="size-5" /></button>
          <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="切换主题" onclick={toggleTheme}>
            <Icon name={dark ? "sun" : "moon"} class="size-5" />
          </button>
          <Popover positioning={{ placement: "bottom-end" }}>
            <Popover.Trigger class="btn-icon min-w-10 min-h-10 hover:preset-tonal relative" aria-label="通知">
              <Icon name="bell" class="size-5" />
              {#if unread}
                <span class="badge-icon preset-filled-error-500 absolute -top-0.5 -right-0.5 size-4 text-[10px]">{unread}</span>
              {/if}
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner class="z-40">
                <Popover.Content class="card w-80 max-w-[90vw] p-2 bg-surface-100-900 shadow-xl">
                  <Popover.Title class="px-2 py-1 font-bold text-sm">通知</Popover.Title>
                  <ul class="divide-y divide-surface-200-800">
                    {#each notifications as n (n.title)}
                      <li class="px-2 py-2 flex gap-2 items-start">
                        <span class="mt-1.5 size-2 rounded-full {n.unread ? 'bg-primary-500' : 'bg-surface-300-700'}"></span>
                        <div class="min-w-0">
                          <p class="text-sm {n.unread ? 'font-medium' : 'opacity-70'}">{n.title}</p>
                          <p class="text-xs opacity-60">{n.time}</p>
                        </div>
                      </li>
                    {/each}
                  </ul>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover>
          <Menu positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger class="btn-icon min-w-10 min-h-10 rounded-full hover:preset-tonal" aria-label="账户菜单">
              <Avatar class="size-8">
                <Avatar.Fallback class="preset-filled-secondary-500 text-xs">{initials(me.name)}</Avatar.Fallback>
              </Avatar>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner class="z-40">
                <Menu.Content class="card p-1 bg-surface-100-900 shadow-xl min-w-44">
                  <Menu.Item value="profile" onclick={() => router.navigate("/settings")}>
                    <Icon name="user" /><Menu.ItemText>个人资料</Menu.ItemText>
                  </Menu.Item>
                  <Menu.Item value="settings" onclick={() => router.navigate("/settings")}>
                    <Icon name="settings" /><Menu.ItemText>设置</Menu.ItemText>
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item value="logout" onclick={() => router.navigate("/login")}>
                    <Icon name="log-out" /><Menu.ItemText>退出登录</Menu.ItemText>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu>
        </AppBar.Trail>
      </AppBar.Toolbar>
    </AppBar>

    <main class="flex-1 p-4 md:p-6 space-y-6 min-w-0">
      {@render children()}
    </main>
    <footer class="px-6 py-3 text-xs opacity-50 border-t border-surface-200-800">Skeleton · Acme Console</footer>
  </div>
</div>
