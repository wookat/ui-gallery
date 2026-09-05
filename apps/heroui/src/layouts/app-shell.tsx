import { useState, type ReactNode } from "react"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import { Avatar, Breadcrumbs, Button, Drawer, Dropdown, Label, SearchField, Separator, Surface, Tooltip } from "@heroui/react"
import { Icon } from "@ui-gallery/icons-react"
import nav from "@ui-gallery/spec/mock/nav.json"

export function Brand() {
  return (
    <RouterLink className="flex items-center gap-2 font-semibold text-foreground no-underline" to="/">
      <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground">A</span>
      <span>Acme Console</span>
    </RouterLink>
  )
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <nav aria-label="主导航" className="grid gap-1">
      {nav.map((item) => {
        const active = location.pathname === item.path
        return (
          <RouterLink
            key={item.key}
            to={item.path}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm no-underline transition-colors ${active ? "bg-accent-soft text-accent-soft-foreground font-medium" : "text-muted hover:bg-surface-secondary hover:text-foreground"}`}
          >
            <Icon name={item.icon} size={16} />
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge ? <span className="rounded-full bg-accent px-1.5 text-xs text-accent-foreground">{item.badge}</span> : null}
          </RouterLink>
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
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"

  return (
    <div className="flex min-h-svh w-full bg-background text-foreground">
      <Surface variant="secondary" className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col rounded-none border-r border-border md:flex">
        <div className="p-4"><Brand /></div>
        <div className="flex-1 overflow-y-auto px-3">
          <p className="px-3 pb-2 text-xs font-medium text-muted">工作区</p>
          <Navigation />
        </div>
        <Separator />
        <RouterLink to="/settings" className="flex items-center gap-2 p-4 text-sm text-foreground no-underline">
          <Avatar size="sm"><Avatar.Fallback>林</Avatar.Fallback></Avatar>
          <span>林晓</span>
        </RouterLink>
      </Surface>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
          <Drawer isOpen={mobileOpen} onOpenChange={setMobileOpen}>
            <Button isIconOnly variant="ghost" size="sm" aria-label="打开菜单" className="md:hidden"><Icon name="menu" /></Button>
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
            <Tooltip>
              <Button isIconOnly variant="ghost" size="sm" aria-label="切换主题" onPress={toggle}><Icon name={isDark ? "sun" : "moon"} /></Button>
              <Tooltip.Content>切换主题</Tooltip.Content>
            </Tooltip>
            <Dropdown>
              <Button isIconOnly variant="ghost" size="sm" className="rounded-full" aria-label="用户菜单">
                <Avatar size="sm"><Avatar.Fallback>林</Avatar.Fallback></Avatar>
              </Button>
              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu aria-label="用户菜单" onAction={(key) => { if (key === "settings") navigate("/settings"); if (key === "logout") navigate("/login") }}>
                  <Dropdown.Section>
                    <Dropdown.Item id="name" isDisabled><Label>林晓</Label></Dropdown.Item>
                    <Dropdown.Item id="settings"><Label>账户设置</Label></Dropdown.Item>
                    <Dropdown.Item id="logout"><Icon name="log-out" size={16} /><Label>退出登录</Label></Dropdown.Item>
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
