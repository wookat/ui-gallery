import { createEffect, createSignal, For, Show, type ParentProps } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import { useColorMode } from "@kobalte/core/color-mode"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Icon } from "@/icons"
import { Avatar } from "@/ui/avatar"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Breadcrumbs } from "@/ui/breadcrumbs"
import { Drawer } from "@/ui/dialog"
import { DropdownMenu } from "@/ui/dropdown-menu"
import { Popover } from "@/ui/popover"
import { TextField } from "@/ui/text-field"
import { Tooltip } from "@/ui/tooltip"

export function AppShell(props: ParentProps) {
  const colorMode = useColorMode()
  const location = useLocation()
  const [collapsed, setCollapsed] = createSignal(false)
  const [mobileOpen, setMobileOpen] = createSignal(false)
  createEffect(() => {
    const dark = colorMode.colorMode() === "dark"
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.classList.toggle("light", !dark)
  })
  const current = () => nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const toggleTheme = () => {
    const next = colorMode.colorMode() === "dark" ? "light" : "dark"
    colorMode.toggleColorMode()
    const url = new URL(window.location.href)
    url.searchParams.set("theme", next)
    window.history.replaceState({}, "", url)
    document.documentElement.classList.toggle("dark", next === "dark")
  }
  const links = () => (
    <nav class="grid gap-1">
      <For each={nav.filter((item) => item.path !== "/login" && item.path !== "/landing")}>
        {(item) => (
          <Tooltip.Root openDelay={300}>
            <Tooltip.Trigger as="div">
              <A href={item.path} onClick={() => setMobileOpen(false)} class={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === item.path ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}>
                <Icon name={item.icon} size={18} />
                <Show when={!collapsed()}>
                  <span class="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.badge ? <Badge variant="secondary">{item.badge}</Badge> : null}
                </Show>
              </A>
            </Tooltip.Trigger>
            <Show when={collapsed()}><Tooltip.Portal><Tooltip.Content class="z-50 rounded bg-zinc-900 px-2 py-1 text-xs text-white">{item.label}</Tooltip.Content></Tooltip.Portal></Show>
          </Tooltip.Root>
        )}
      </For>
    </nav>
  )
  return (
    <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <aside class={`fixed inset-y-0 left-0 z-30 hidden border-r border-zinc-200 bg-white transition-[width] lg:flex lg:flex-col dark:border-zinc-800 dark:bg-zinc-900 ${collapsed() ? "w-16" : "w-64"}`}>
        <div class="flex h-16 items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800"><span class="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-900 font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">A</span><Show when={!collapsed()}><span class="font-semibold">Acme Console</span></Show></div>
        <div class="flex-1 space-y-6 overflow-y-auto p-3"><Show when={!collapsed()}><p class="px-3 text-xs font-medium uppercase tracking-wider text-zinc-500">工作区</p></Show>{links()}</div>
        <div class="space-y-2 border-t border-zinc-200 p-3 dark:border-zinc-800"><A href="/settings" class="flex items-center gap-3 rounded-md p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"><Avatar name="林晓" /><Show when={!collapsed()}><span class="min-w-0 truncate">林晓</span></Show></A><Button variant="ghost" size="icon" class="w-full" aria-label="折叠侧边栏" onClick={() => setCollapsed((value) => !value)}><Icon name={collapsed() ? "chevron-right" : "chevron-left"} size={16} /></Button></div>
      </aside>
      <div class="lg:pl-64" classList={{ "lg:pl-16": collapsed() }}>
        <header class="sticky top-0 z-20 flex h-16 min-w-0 items-center gap-3 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 sm:px-6">
          <Button variant="ghost" size="icon" class="lg:hidden" aria-label="打开导航" onClick={() => setMobileOpen(true)}><Icon name="menu" size={20} /></Button>
          <div class="hidden min-w-0 sm:flex"><Breadcrumbs items={["Acme Console", current()]} /></div>
          <div class="ml-auto flex min-w-0 items-center gap-2">
            <div class="hidden w-48 md:block"><TextField placeholder="搜索..." aria-label="全局搜索" /></div>
            <Popover.Root>
              <Popover.Trigger as={Button} variant="ghost" size="icon" class="relative" aria-label="通知"><Icon name="bell" size={18} /><Badge class="absolute -right-1 -top-1 px-1">2</Badge></Popover.Trigger>
              <Popover.Portal><Popover.Content class="z-50 w-80 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><p class="mb-3 font-medium">通知</p><div class="grid gap-3"><For each={notifications}>{(item) => <div class="border-b border-zinc-100 pb-3 text-sm last:border-0 dark:border-zinc-800"><p>{item.title}</p><p class="mt-1 text-xs text-zinc-500">{item.time}</p></div>}</For></div></Popover.Content></Popover.Portal>
            </Popover.Root>
            <Button variant="ghost" size="icon" aria-label="切换主题" onClick={toggleTheme}><Icon name={colorMode.colorMode() === "dark" ? "sun" : "moon"} size={18} /></Button>
            <DropdownMenu.Root><DropdownMenu.Trigger as={Button} variant="ghost" class="rounded-full p-1" aria-label="用户菜单"><Avatar name="林晓" /></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content class="z-50 min-w-48 rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"><For each={["个人资料", "账户设置", "切换团队", "帮助", "退出登录"]}>{(item) => <DropdownMenu.Item class="cursor-pointer rounded px-3 py-2 text-sm data-[highlighted]:bg-zinc-100 dark:data-[highlighted]:bg-zinc-800">{item}</DropdownMenu.Item>}</For></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>
          </div>
        </header>
        <main class="min-w-0 space-y-6 p-4 sm:p-6">{props.children}</main>
      </div>
      <Drawer open={mobileOpen()} onOpenChange={setMobileOpen} title="Acme Console" description="导航"><div class="grid gap-5">{links()}</div></Drawer>
    </div>
  )
}
