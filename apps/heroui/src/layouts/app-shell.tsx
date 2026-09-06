import { useState, type ReactNode } from "react"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import { Avatar, Badge, Breadcrumbs, Button, Description, Drawer, Dropdown, Label, Popover, SearchField, Separator, Surface, Tooltip } from "@heroui/react"
import { Icon } from "@/components/icon"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import team from "@ui-gallery/spec/mock/team.json"

export function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <RouterLink className="flex min-h-10 items-center gap-2 font-semibold text-foreground no-underline" to="/">
      <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground">A</span>
      {collapsed ? null : <span>Acme Console</span>}
    </RouterLink>
  )
}

function Navigation({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  const location = useLocation()
  return (
    <nav aria-label="主导航" className="grid gap-1">
      {nav.map((item) => {
        const active = location.pathname === item.path
        return (
          <Tooltip key={item.key}>
            <RouterLink
              to={item.path}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              aria-label={collapsed ? item.label : undefined}
              className={`flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm no-underline transition-colors ${collapsed ? "justify-center" : ""} ${active ? "bg-accent-soft text-accent-soft-foreground font-medium" : "text-muted hover:bg-surface-secondary hover:text-foreground"}`}
            >
              <Icon name={item.icon} size={16} />
              {collapsed ? null : <span className="flex-1 truncate">{item.label}</span>}
              {!collapsed && item.badge ? <span className="rounded-full bg-accent px-1.5 text-xs text-accent-foreground">{item.badge}</span> : null}
            </RouterLink>
            {collapsed ? <Tooltip.Content placement="right">{item.label}</Tooltip.Content> : null}
          </Tooltip>
        )
      })}
    </nav>
  )
}

function useThemeToggle() {
  const location = useLocation()
  const navigate = useNavigate()
  const isDark = document.documentElement.classList.contains("dark")
  return {
    isDark,
    toggle() {
      const next = isDark ? "light" : "dark"
      document.documentElement.classList.toggle("dark", next === "dark")
      document.documentElement.classList.toggle("light", next === "light")
      const params = new URLSearchParams(window.location.search)
      params.set("theme", next)
      navigate(`${location.pathname}?${params.toString()}`)
    },
  }
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggle } = useThemeToggle()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const unread = notifications.filter((item) => item.unread).length
  const owner = team.find((member) => member.role === "owner") ?? team[0]

  return (
    <div className="flex min-h-svh w-full bg-background text-foreground">
      <Surface variant="secondary" className={`sticky top-0 hidden h-svh shrink-0 flex-col rounded-none border-r border-border transition-[width] md:flex ${collapsed ? "w-16" : "w-60"}`}>
        <div className={`flex flex-col gap-2 ${collapsed ? "items-center p-2" : "p-4"}`}><Brand collapsed={collapsed} /><Button isIconOnly variant="ghost" className="min-h-10 min-w-10" aria-label={collapsed ? "展开侧栏" : "折叠侧栏"} onPress={() => setCollapsed((value) => !value)}><Icon name={collapsed ? "chevron-right" : "chevron-left"} size={16} /></Button></div>
        <div className="flex-1 overflow-y-auto px-3">
          {collapsed ? null : <p className="px-3 pb-2 text-xs font-medium text-muted">工作区</p>}
          <Navigation collapsed={collapsed} />
        </div>
        <Separator />
        <RouterLink to="/settings" aria-label="个人设置" className={`flex min-h-10 items-center gap-2 p-4 text-sm text-foreground no-underline ${collapsed ? "justify-center" : ""}`}>
          <Avatar size="sm"><Avatar.Fallback>林</Avatar.Fallback></Avatar>
          {collapsed ? null : <span>林晓</span>}
        </RouterLink>
      </Surface>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <Drawer isOpen={mobileOpen} onOpenChange={setMobileOpen}>
            <Button isIconOnly variant="ghost" size="md" aria-label="打开菜单" className="min-h-10 min-w-10 md:hidden"><Icon name="menu" /></Button>
            <Drawer.Backdrop>
              <Drawer.Content placement="left" className="w-72">
                <Drawer.Dialog>
                  <Drawer.CloseTrigger />
                  <Drawer.Header><Drawer.Heading><Brand /></Drawer.Heading><p className="text-sm text-muted">导航菜单</p></Drawer.Header>
                  <Drawer.Body><Navigation onNavigate={() => setMobileOpen(false)} /></Drawer.Body>
                </Drawer.Dialog>
              </Drawer.Content>
            </Drawer.Backdrop>
          </Drawer>
          <Breadcrumbs className="hidden sm:flex">
            <Breadcrumbs.Item onPress={() => navigate("/")}>Acme Console</Breadcrumbs.Item>
            <Breadcrumbs.Item>{current}</Breadcrumbs.Item>
          </Breadcrumbs>
          <div className="ml-auto flex items-center gap-2">
            <SearchField aria-label="搜索" className="hidden w-56 md:flex">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="搜索..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <Popover>
              <Badge.Anchor>
                <Button isIconOnly variant="ghost" aria-label={`通知，${unread} 条未读`}>
                  <Icon name="bell" size={18} />
                </Button>
                {unread > 0 && <Badge color="danger" size="sm">{unread}</Badge>}
              </Badge.Anchor>
              <Popover.Content placement="bottom end" className="w-80 max-w-[calc(100vw-2rem)]">
                <Popover.Dialog aria-label="通知列表">
                  <div className="flex items-center justify-between">
                    <Popover.Heading>通知</Popover.Heading>
                    <span className="text-xs text-muted">{unread} 条未读</span>
                  </div>
                  <ul className="mt-3 divide-y divide-border">
                    {notifications.map((item) => (
                      <li key={item.title} className="flex items-start gap-3 py-3">
                        <span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.unread ? "bg-accent" : "bg-transparent"}`} aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                          <p className={`truncate text-sm ${item.unread ? "font-medium" : "text-muted"}`}>{item.title}</p>
                          <p className="text-xs text-muted">{item.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" size="sm" className="mt-2 w-full" onPress={() => navigate("/settings")}>查看全部通知</Button>
                </Popover.Dialog>
              </Popover.Content>
            </Popover>
            <Tooltip>
              <Button isIconOnly variant="ghost" aria-label="切换主题" onPress={toggle}>
                <Icon name={isDark ? "sun" : "moon"} size={18} />
              </Button>
              <Tooltip.Content>切换主题</Tooltip.Content>
            </Tooltip>
            <Dropdown>
              <Button isIconOnly variant="ghost" className="rounded-full" aria-label="用户菜单">
                <Avatar size="sm"><Avatar.Fallback>林</Avatar.Fallback></Avatar>
              </Button>
              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu aria-label="用户菜单" onAction={(key) => { if (key === "profile" || key === "settings" || key === "billing") navigate("/settings"); if (key === "logout") navigate("/login") }}>
                  <Dropdown.Section>
                    <Dropdown.Item id="name" isDisabled textValue={owner.name}><Label>{owner.name}</Label><Description>{owner.email}</Description></Dropdown.Item>
                  </Dropdown.Section>
                  <Dropdown.Section>
                    <Dropdown.Item id="profile" textValue="个人资料"><Icon name="user" size={16} /><Label>个人资料</Label></Dropdown.Item>
                    <Dropdown.Item id="settings" textValue="账户设置"><Icon name="settings" size={16} /><Label>账户设置</Label></Dropdown.Item>
                    <Dropdown.Item id="billing" textValue="计费与计划"><Icon name="shopping-cart" size={16} /><Label>计费与计划</Label></Dropdown.Item>
                  </Dropdown.Section>
                  <Dropdown.Section>
                    <Dropdown.Item id="logout" textValue="退出登录"><Icon name="log-out" size={16} /><Label>退出登录</Label></Dropdown.Item>
                  </Dropdown.Section>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </header>
        <main className="min-w-0 space-y-6 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
