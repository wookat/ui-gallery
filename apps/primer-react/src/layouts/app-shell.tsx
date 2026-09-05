import { useRef, useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import nav from "@ui-gallery/spec/mock/nav.json"
import { ActionList, ActionMenu, Avatar, Dialog, Header, IconButton, PageLayout, TextInput } from "@primer/react"
import { Icon, iconFor } from "@/lib/icon"
import { useColorMode } from "@/lib/color-mode"
import { avatarSrc } from "@/lib/avatar"

function Brand() {
  return <Link className="brand flex items-center gap-2" to="/"><span className="brand-mark">A</span><span>Acme Console</span></Link>
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <ActionList>
      <ActionList.GroupHeading as="h2">工作区</ActionList.GroupHeading>
      {nav.map((item) => (
        <ActionList.Item key={item.key} active={location.pathname === item.path} onSelect={() => { navigate(item.path); onNavigate?.() }}>
          <span className="flex items-center gap-2"><Icon name={item.icon} /><span>{item.label}</span>{item.badge ? <span className="ml-auto">{item.badge}</span> : null}</span>
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { mode, setMode } = useColorMode()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark"
    setMode(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    navigate(`${location.pathname}?${params.toString()}`)
  }
  return (
    <PageLayout>
      <PageLayout.Sidebar className="shell-sidebar" aria-label="主导航" sticky>
        <div className="stack-4">
          <Brand />
          <Navigation />
          <ActionList>
            <ActionList.Item onSelect={() => navigate("/settings")}><span className="flex items-center gap-2"><Icon name="user" />林晓</span></ActionList.Item>
          </ActionList>
        </div>
      </PageLayout.Sidebar>
      <PageLayout.Content className="shell-main" width="full" padding="none">
        <Header className="shell-header flex items-center gap-3" aria-label="页面导航">
          <IconButton ref={mobileButtonRef} className="mobile-only" aria-label="打开导航菜单" icon={iconFor("menu")} onClick={() => setMobileOpen(true)} />
          <div className="desktop-only muted">{`Acme Console / ${current}`}</div>
          <div className="ml-auto flex items-center gap-2">
            <TextInput className="desktop-only" aria-label="搜索" placeholder="搜索..." leadingVisual={iconFor("search")} />
            <IconButton aria-label="切换主题" icon={iconFor(mode === "dark" ? "sun" : "moon")} onClick={toggleTheme} />
            <ActionMenu>
              <ActionMenu.Button aria-label="打开账户菜单" trailingVisual={iconFor("chevron-down")}>
                <Avatar src={avatarSrc} alt="林晓" size={32} />
              </ActionMenu.Button>
              <ActionMenu.Overlay align="end">
                <ActionList>
                  <ActionList.GroupHeading as="h2">林晓</ActionList.GroupHeading>
                  <ActionList.LinkItem href="/settings">账户设置</ActionList.LinkItem>
                  <ActionList.Item><span className="flex items-center gap-2"><Icon name="log-out" />退出登录</span></ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </div>
        </Header>
        <main className="page-content">{children}</main>
      </PageLayout.Content>
      {mobileOpen ? (
        <Dialog title="导航菜单" position="left" returnFocusRef={mobileButtonRef} onClose={() => setMobileOpen(false)}>
          <div style={{ marginBottom: 24 }}><Brand /></div>
          <Navigation onNavigate={() => setMobileOpen(false)} />
        </Dialog>
      ) : null}
    </PageLayout>
  )
}
