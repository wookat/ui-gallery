<script lang="ts">
  import { setMode } from "mode-watcher"
  import { currentPath } from "$lib/router.svelte"
  import { currentTheme } from "$lib/settings"
  import Link from "$lib/Link.svelte"
  import Icon from "$lib/icons/Icon.svelte"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as Badge from "$lib/components/ui/badge"
  import * as Breadcrumb from "$lib/components/ui/breadcrumb"
  import { Button } from "$lib/components/ui/button"
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu"
  import * as InputGroup from "$lib/components/ui/input-group"
  import * as Popover from "$lib/components/ui/popover"
  import * as Sidebar from "$lib/components/ui/sidebar"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { IsMobile } from "$lib/hooks/is-mobile.svelte"
  import nav from "@ui-gallery/spec/mock/nav.json"
  import notifications from "@ui-gallery/spec/mock/notifications.json"

  let { children }: { children: import("svelte").Snippet } = $props()
  const isMobile = new IsMobile()
  const pageTitle = $derived(nav.find((item) => item.path === currentPath.value)?.label ?? "仪表盘")

  function changeTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark"
    setMode(next)
    const url = new URL(window.location.href)
    url.searchParams.set("theme", next)
    window.history.replaceState({}, "", url)
  }
</script>

<Sidebar.Provider data-mobile={isMobile.current}>
  <Sidebar.Root collapsible="icon">
    <Sidebar.Header>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton size="lg" tooltipContent="Acme Console">
            {#snippet child({ props })}
              <Link to="/" {...props}>
                <span
                  class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                >
                  <Icon name="sparkles" size={16} />
                </span>
                <span class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">Acme Console</span>
                  <span class="truncate text-xs text-muted-foreground">shadcn-svelte</span>
                </span>
              </Link>
            {/snippet}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>工作台</Sidebar.GroupLabel>
        <Sidebar.Menu>
          {#each nav as item (item.key)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={currentPath.value === item.path}
                tooltipContent={item.label}
              >
                {#snippet child({ props })}
                  <Link to={item.path} {...props}>
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </Link>
                {/snippet}
              </Sidebar.MenuButton>
              {#if item.badge}
                <Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
              {/if}
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton size="lg" tooltipContent="账户菜单">
            {#snippet child({ props })}
              <button {...props} type="button">
                <Avatar.Root class="size-8 rounded-lg">
                  <Avatar.Fallback class="rounded-lg">AC</Avatar.Fallback>
                </Avatar.Root>
                <span class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">Acme Team</span>
                  <span class="truncate text-xs text-muted-foreground">admin@example.com</span>
                </span>
                <Icon name="chevrons-up-down" size={16} class="ml-auto" />
              </button>
            {/snippet}
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
    <Sidebar.Rail />
  </Sidebar.Root>

  <Sidebar.Inset>
    <header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <Sidebar.Trigger class="-ml-1 size-10" />
      <Breadcrumb.Root class="hidden sm:block">
        <Breadcrumb.List>
          <Breadcrumb.Item><Breadcrumb.Link href="/">工作台</Breadcrumb.Link></Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item><Breadcrumb.Page>{pageTitle}</Breadcrumb.Page></Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <InputGroup.Root class="ml-auto hidden w-64 md:flex">
        <InputGroup.Addon><Icon name="search" size={16} /></InputGroup.Addon>
        <InputGroup.Input placeholder="搜索..." aria-label="搜索" />
        <InputGroup.Addon align="inline-end"
          ><kbd class="rounded border px-1.5 text-[10px] text-muted-foreground">⌘K</kbd
          ></InputGroup.Addon
        >
      </InputGroup.Root>
      <Popover.Root>
        <Popover.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              variant="ghost"
              size="icon"
              class="relative size-10"
              aria-label="通知"
            >
              <Icon name="bell" size={16} />
              <Badge.Badge class="absolute top-1 right-1 size-1.5 rounded-full p-0"></Badge.Badge>
            </Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-80" align="end">
          <h3 class="font-semibold">通知</h3>
          <p class="text-xs text-muted-foreground">最近的消息和提醒</p>
          <div class="mt-3 divide-y">
            {#each notifications as notification}
              <div class="flex gap-3 py-3 text-sm">
                <span
                  class:invisible={!notification.unread}
                  class="mt-1 size-2 shrink-0 rounded-full bg-primary"
                ></span>
                <div>
                  <p>{notification.title}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            {/each}
          </div>
        </Popover.Content>
      </Popover.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              variant="ghost"
              size="icon"
              class="size-10"
              aria-label="切换主题"
              onclick={changeTheme}
            >
              {#if currentTheme() === "dark"}<Icon name="sun" size={16} />{:else}<Icon
                  name="moon"
                  size={16}
                />{/if}
            </Button>
          {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Content>切换主题</Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              variant="ghost"
              class="relative size-10 rounded-full p-0"
              aria-label="账户"
            >
              <Avatar.Root class="size-8"><Avatar.Fallback>AC</Avatar.Fallback></Avatar.Root>
            </Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56" align="end">
          <DropdownMenu.Label
            ><div class="flex flex-col space-y-1">
              <span class="font-medium">Acme Team</span><span class="text-xs text-muted-foreground"
                >admin@example.com</span
              >
            </div></DropdownMenu.Label
          >
          <DropdownMenu.Separator />
          <DropdownMenu.Item><Icon name="user" size={16} class="mr-2" />个人资料</DropdownMenu.Item>
          <DropdownMenu.Item><Icon name="settings" size={16} class="mr-2" />设置</DropdownMenu.Item>
          <DropdownMenu.Item><Icon name="bell" size={16} class="mr-2" />通知偏好</DropdownMenu.Item>
          <DropdownMenu.Item
            ><Icon name="log-out" size={16} class="mr-2" />退出登录</DropdownMenu.Item
          >
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </header>
    <main class="min-w-0 flex-1 space-y-6 p-4 sm:p-6">{@render children()}</main>
  </Sidebar.Inset>
</Sidebar.Provider>
