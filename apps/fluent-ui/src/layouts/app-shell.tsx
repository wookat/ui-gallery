import { useState, type ReactNode } from "react"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import {
  Avatar,
  Body1,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Caption1,
  CounterBadge,
  Hamburger,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  Persona,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  SearchBox,
  Subtitle2,
  Tooltip,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components"
import { Icon } from "@/lib/icon"
import { useThemeMode } from "@/lib/theme"
import { useControlSize, useIsMobile } from "@/pages/shared"

const useStyles = makeStyles({
  root: { display: "flex", minHeight: "100vh", backgroundColor: tokens.colorNeutralBackground3 },
  drawer: { height: "100vh", position: "sticky", top: 0, flexShrink: 0 },
  main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    height: "56px",
    paddingInline: tokens.spacingHorizontalL,
    minWidth: 0,
    overflowX: "clip",
    backgroundColor: tokens.colorNeutralBackground1,
    "@media (max-width: 767px)": { paddingInline: tokens.spacingHorizontalS },
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  spacer: { flex: 1 },
  content: { padding: tokens.spacingHorizontalL, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalL, minWidth: 0, "@media (max-width: 767px)": { padding: tokens.spacingHorizontalM } },
  brand: { display: "flex", alignItems: "center", gap: tokens.spacingHorizontalS, textDecoration: "none", color: tokens.colorNeutralForeground1, whiteSpace: "nowrap", flexShrink: 0 },
  brandMark: {
    width: "32px",
    height: "32px",
    display: "grid",
    placeItems: "center",
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontWeight: tokens.fontWeightSemibold,
  },
  navBadge: { marginLeft: "auto" },
  notificationList: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS, width: "280px", maxWidth: "80vw" },
  notification: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalXXS },
  desktopOnly: { "@media (max-width: 767px)": { display: "none" } },
  search: { width: "220px" },
  footerPersona: { paddingInline: tokens.spacingHorizontalS },
})

export function Brand() {
  const s = useStyles()
  return (
    <RouterLink className={s.brand} to="/">
      <span className={s.brandMark}>A</span>
      <Subtitle2>Acme Console</Subtitle2>
    </RouterLink>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const s = useStyles()
  const isMobile = useIsMobile()
  const ctl = useControlSize()
  const location = useLocation()
  const navigate = useNavigate()
  const { mode, setMode } = useThemeMode()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const current = nav.find((item) => item.path === location.pathname)
  const unread = notifications.filter((item) => item.unread).length

  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark"
    setMode(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  const go = (path: string) => {
    navigate(`${path}${window.location.search}`)
    setMobileOpen(false)
  }

  const drawerOpen = isMobile ? mobileOpen : !collapsed

  return (
    <div className={s.root}>
      <NavDrawer
        className={isMobile ? undefined : s.drawer}
        type={isMobile ? "overlay" : "inline"}
        open={drawerOpen}
        onOpenChange={(_, data) => (isMobile ? setMobileOpen(data.open) : setCollapsed(!data.open))}
        selectedValue={current?.key ?? "dashboard"}
        onNavItemSelect={(_, data) => {
          const item = nav.find((entry) => entry.key === data.value)
          if (item) go(item.path)
        }}
      >
        <NavDrawerHeader>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: tokens.spacingHorizontalS }}>
            <Brand />
            <Tooltip content="折叠导航" relationship="label">
              <Hamburger size={ctl} onClick={() => (isMobile ? setMobileOpen(false) : setCollapsed(true))} />
            </Tooltip>
          </div>
        </NavDrawerHeader>
        <NavDrawerBody>
          <NavSectionHeader>工作区</NavSectionHeader>
          {nav.slice(0, 4).map((item) => (
            <NavItem key={item.key} value={item.key} icon={<Icon name={item.icon} />}>
              {item.label}
              {"badge" in item && item.badge ? <CounterBadge className={s.navBadge} count={item.badge} size="small" /> : null}
            </NavItem>
          ))}
          <NavSectionHeader>系统</NavSectionHeader>
          {nav.slice(4).map((item) => (
            <NavItem key={item.key} value={item.key} icon={<Icon name={item.icon} />}>
              {item.label}
            </NavItem>
          ))}
        </NavDrawerBody>
        <NavDrawerFooter>
          <Persona className={s.footerPersona} name="林晓" secondaryText="owner@acme.dev" avatar={{ color: "colorful" }} presence={{ status: "available" }} />
        </NavDrawerFooter>
      </NavDrawer>
      <div className={s.main}>
        <header className={s.header} data-touch="">
          {(isMobile || collapsed) && (
            <Tooltip content="打开导航" relationship="label">
              <Hamburger size={ctl} onClick={() => (isMobile ? setMobileOpen(true) : setCollapsed(false))} />
            </Tooltip>
          )}
          <Breadcrumb aria-label="面包屑" className={s.desktopOnly}>
            <BreadcrumbItem>
              <BreadcrumbButton onClick={() => go("/")}>Acme Console</BreadcrumbButton>
            </BreadcrumbItem>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              <BreadcrumbButton current>{current?.label ?? "仪表盘"}</BreadcrumbButton>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className={s.spacer} />
          <SearchBox className={mergeClasses(s.search, s.desktopOnly)} placeholder="全局搜索..." size="medium" />
          <Popover positioning="below-end" withArrow>
            <PopoverTrigger disableButtonEnhancement>
              <Button appearance="subtle" size={ctl} icon={<Icon name="bell" />} aria-label="通知">
                {unread ? <CounterBadge count={unread} color="danger" size="small" /> : null}
              </Button>
            </PopoverTrigger>
            <PopoverSurface>
              <div className={s.notificationList}>
                <Subtitle2>通知</Subtitle2>
                {notifications.map((item) => (
                  <div className={s.notification} key={item.title}>
                    <Body1 style={{ fontWeight: item.unread ? tokens.fontWeightSemibold : undefined }}>{item.title}</Body1>
                    <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>{item.time}</Caption1>
                  </div>
                ))}
              </div>
            </PopoverSurface>
          </Popover>
          <Tooltip content="切换主题" relationship="label">
            <Button appearance="subtle" size={ctl} icon={<Icon name={mode === "dark" ? "sun" : "moon"} />} onClick={toggleTheme} />
          </Tooltip>
          <Menu positioning="below-end">
            <MenuTrigger disableButtonEnhancement>
              <Button appearance="transparent" size={ctl} icon={<Avatar name="林晓" color="colorful" size={32} />} aria-label="账户菜单" />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem icon={<Icon name="user" />} onClick={() => go("/settings")}>个人资料</MenuItem>
                <MenuItem icon={<Icon name="settings" />} onClick={() => go("/settings")}>账户设置</MenuItem>
                <MenuItem icon={<Icon name="credit-card" />}>计费</MenuItem>
                <MenuItem icon={<Icon name="circle-help" />}>帮助中心</MenuItem>
                <MenuDivider />
                <MenuItem icon={<Icon name="log-out" />} onClick={() => go("/login")}>退出登录</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </header>
        <main className={s.content} data-touch={location.pathname === "/components" ? undefined : ""}>{children}</main>
      </div>
    </div>
  )
}
