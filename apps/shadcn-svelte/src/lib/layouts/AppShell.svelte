<script lang="ts">
  import nav from "@ui-gallery/spec/mock/nav.json"
  import notifications from "@ui-gallery/spec/mock/notifications.json"
  import { Icon } from "$lib/icons"
  import { currentTheme, applyUrlSettings } from "$lib/settings"
  import { currentPath, navigate } from "$lib/router.svelte"
  import Link from "$lib/Link.svelte"
  import type { Snippet } from "svelte"

  let { children }: { children: Snippet } = $props()
  let open = $state(false)
  let theme = $state<"dark" | "light">("light")
  let notificationsOpen = $state(false)

  $effect(() => {
    theme = currentTheme()
  })

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    navigate(`${currentPath.value}?${params}`)
    applyUrlSettings()
    theme = next
  }
</script>

<div class="flex min-h-screen w-full bg-background text-foreground">
  {#if open}
    <button
      class="fixed inset-0 z-30 bg-black/40 md:hidden"
      aria-label="关闭导航"
      onclick={() => (open = false)}
    ></button>
  {/if}
  <aside
    class:translate-x-0={open}
    class="fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col border-r bg-background transition-transform md:static md:translate-x-0"
  >
    <div class="flex h-16 items-center gap-2 border-b px-4 font-semibold">
      <span class="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"
        >A</span
      >
      <span>Acme Console</span>
    </div>
    <nav class="flex-1 space-y-1 p-3">
      <p class="px-3 pb-2 text-xs font-medium text-muted-foreground">工作区</p>
      {#each nav as item}
        <Link
          to={item.path}
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent {currentPath.value ===
          item.path
            ? 'bg-accent font-medium'
            : ''}"
          onclick={() => (open = false)}
        >
          <Icon name={item.icon} size={17} />
          <span class="min-w-0 flex-1 truncate">{item.label}</span>
          {#if item.badge}<span class="text-xs text-muted-foreground">{item.badge}</span>{/if}
        </Link>
      {/each}
    </nav>
    <div class="border-t p-3">
      <Link to="/settings" class="flex items-center gap-3 rounded-md p-2 hover:bg-accent">
        <span class="grid size-8 place-items-center rounded-full bg-secondary text-sm">林</span>
        <span
          ><strong class="block text-sm">林晓</strong><small class="text-muted-foreground"
            >管理员</small
          ></span
        >
      </Link>
    </div>
  </aside>

  <div class="min-w-0 flex-1">
    <header
      class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6"
    >
      <button
        class="rounded-md p-2 hover:bg-accent md:hidden"
        aria-label="打开导航"
        onclick={() => (open = true)}><Icon name="menu" /></button
      >
      <div class="hidden items-center gap-2 text-sm sm:flex">
        <Link to="/" class="text-muted-foreground hover:text-foreground">Acme Console</Link><span
          >/</span
        ><span>{nav.find((item) => item.path === currentPath.value)?.label ?? "仪表盘"}</span>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <label
          class="hidden items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground md:flex"
          ><Icon name="search" size={15} /><input
            class="w-40 bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder="搜索..."
          /></label
        >
        <div class="relative">
          <button
            class="relative rounded-md p-2 hover:bg-accent"
            aria-label="通知"
            onclick={() => (notificationsOpen = !notificationsOpen)}><Icon name="bell" /></button
          >
          <span class="absolute top-1 right-1 size-2 rounded-full bg-destructive"></span>
          {#if notificationsOpen}
            <div
              class="absolute top-11 right-0 z-30 w-72 rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg"
            >
              <strong class="mb-2 block text-sm">通知</strong>
              {#each notifications as item}<div class="border-t py-2 text-sm">
                  <div>{item.title}</div>
                  <small class="text-muted-foreground">{item.time}</small>
                </div>{/each}
            </div>
          {/if}
        </div>
        <button class="rounded-md p-2 hover:bg-accent" aria-label="切换主题" onclick={toggleTheme}
          ><Icon name={theme === "dark" ? "sun" : "moon"} /></button
        >
        <details class="relative">
          <summary
            class="grid size-9 cursor-pointer list-none place-items-center rounded-full bg-secondary text-sm"
            >林</summary
          >
          <div
            class="absolute top-11 right-0 z-30 w-44 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg"
          >
            <p class="px-2 py-1 text-sm font-semibold">林晓</p>
            <Link to="/settings" class="block rounded px-2 py-1 text-sm hover:bg-accent"
              >账户设置</Link
            >
            <button class="block w-full rounded px-2 py-1 text-left text-sm hover:bg-accent"
              >个人资料</button
            >
            <button class="block w-full rounded px-2 py-1 text-left text-sm hover:bg-accent"
              >团队管理</button
            >
            <button class="block w-full rounded px-2 py-1 text-left text-sm hover:bg-accent"
              >帮助中心</button
            >
            <button class="block w-full rounded px-2 py-1 text-left text-sm hover:bg-accent"
              >退出登录</button
            >
          </div>
        </details>
      </div>
    </header>
    <main class="min-w-0 space-y-6 p-4 sm:p-6">{@render children()}</main>
  </div>
</div>
