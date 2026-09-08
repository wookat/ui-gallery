import * as React from "react"
import { cn } from "@/lib/cn"
import {
  ArrowLeftRightIcon,
  BellIcon,
  ChartColumnIcon,
  CircleQuestionMarkIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  type LucideIcon,
  MenuIcon,
  MoonIcon,
  PackageIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  ReceiptTextIcon,
  RotateCcwIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  SunIcon,
  TruckIcon,
  UserIcon,
  WarehouseIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Avatar } from "@/components/composed/avatar"
import { BrandMark } from "@/components/composed/brand"
import { NavGroupLabel, NavItem } from "@/components/composed/nav-item"
import { NotificationItem } from "@/components/composed/notification-item"
import { SearchInput } from "@/components/composed/search-input"
import { useTheme } from "@/components/theme-provider"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuHeader, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { notYet } from "@/components/ui/sonner"
import { t } from "@/data/content"
import { mock, navBadge, navBadgeLabel, navBadgeTone, type NavItem as NavItemDef } from "@/data/mock"
import { useMaxWidth } from "@/lib/media"

/** hifi #searchKbd：Apple 平台显示 ⌘K，其余 Ctrl K */
const isApple = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)

/** mock/nav.json icon 名 → lucide */
const navIcons: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboardIcon,
  "receipt-text": ReceiptTextIcon,
  "rotate-ccw": RotateCcwIcon,
  package: PackageIcon,
  warehouse: WarehouseIcon,
  truck: TruckIcon,
  "chart-column": ChartColumnIcon,
  settings: SettingsIcon,
}

type ShellProps = {
  children: React.ReactNode
  /** 空态：品牌下方显示「未命名团队」、导航角标与未读数归零 */
  empty?: boolean
  /** URL ?sidebar=rail|expanded；缺省时 ≤1024 且 >768 为 rail */
  sidebar: string | null
  /** URL ?open=notifications|account|drawer；截图矩阵用，置空即关闭 */
  open: string | null
  setOpen: (v: string | null) => void
  /** 侧栏收起/展开后需要重绘的内容（图表）通知 */
  onSidebarToggle?: () => void
}

function NavList({ rail, empty, current, onNavigate }: { rail: boolean; empty: boolean; current: string; onNavigate?: () => void }) {
  return (
    <nav aria-label={t("shell.nav.aria")} className={cn("flex flex-1 flex-col gap-4 overflow-y-auto pt-2 pb-4", rail ? "items-center px-2" : "px-3")}>
      {mock.nav.map((g) => (
        <div key={g.group} className="flex flex-col">
          <NavGroupLabel id={`ng-${g.group}`} className={cn(rail && "sr-only")}>
            {g.groupLabel}
          </NavGroupLabel>
          <ul aria-labelledby={`ng-${g.group}`} className="flex flex-col gap-1">
            {g.items.map((it: NavItemDef) => (
              <li key={it.key}>
                <NavItem
                  icon={navIcons[it.icon] ?? LayoutDashboardIcon}
                  label={it.label}
                  rail={rail}
                  active={it.key === current}
                  href={it.implemented ? it.path : undefined}
                  role={it.implemented ? undefined : "link"}
                  data-path={it.implemented ? undefined : it.path}
                  disabledTip={it.implemented ? undefined : t("shell.nav.disabled.tip")}
                  count={empty ? 0 : navBadge(it)}
                  countTone={navBadgeTone(it)}
                  countLabel={navBadgeLabel(it)}
                  onClick={it.implemented ? onNavigate : undefined}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function Brand({ empty, rail, className }: { empty: boolean; rail?: boolean; className?: string }) {
  return (
    <div className={cn("flex h-topbar shrink-0 items-center gap-3 px-4", rail && "justify-center px-0", className)}>
      <BrandMark variant="house" />
      {rail ? null : (
        <div className="flex min-w-0 flex-col leading-none">
          <strong className="truncate text-role-label">{t("shell.brand")}</strong>
          <span className="truncate text-role-caption text-fg-muted">{empty ? t("dashboard.empty.workspace") : mock.user.workspace.name}</span>
        </div>
      )}
    </div>
  )
}

/** 应用壳：hifi .app —— 侧栏（expanded / rail / ≤768 抽屉）+ 顶栏 + 内容区 */
function AppShell({ children, empty = false, sidebar, open, setOpen, onSidebarToggle }: ShellProps) {
  const mobile = useMaxWidth("--breakpoint-md")
  const tablet = useMaxWidth("--breakpoint-lg")
  const { resolved, toggle } = useTheme()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = React.useState<boolean | null>(null)
  const rail = collapsed ?? (sidebar === "rail" || (sidebar !== "expanded" && tablet && !mobile))

  const [read, setRead] = React.useState(false)
  const items = empty ? [] : mock.notifications.items
  const unread = read ? 0 : items.filter((n) => n.unread).length
  const bellLabel = unread ? t("shell.notifications.ariaCount", { n: unread }) : t("shell.notifications.title")

  const overlay = (key: string) => ({
    open: open === key || undefined,
    onOpenChange: (o: boolean) => {
      if (!o && open === key) setOpen(null)
    },
  })
  /** ?open= 打开的浮层与 hifi 一致不抢焦点（用户点击打开时仍由 Radix 聚焦首项） */
  const urlOpened = (key: string) => (e: Event) => {
    if (open === key) e.preventDefault()
  }
  const drawerOpen = open === "drawer" && mobile
  const collapseLabel = rail ? t("shell.nav.expand") : t("shell.nav.collapse")

  return (
    <div className="flex min-h-svh bg-bg text-fg">
      <a
        href="#main"
        className="fixed top-2 left-2 z-50 inline-flex min-h-hit -translate-y-[calc(var(--size-topbar)+var(--space-8))] items-center rounded-md bg-primary px-4 py-2 text-role-label text-on-primary focus:translate-y-0"
      >
        {t("shell.skip")}
      </a>
      <aside
        aria-label={t("shell.nav.aria")}
        data-sidebar={rail ? "rail" : "expanded"}
        className={cn("sticky top-0 flex h-svh shrink-0 flex-col border-r bg-surface mobile:hidden", rail ? "w-sidebar-rail" : "w-sidebar-expanded")}
      >
        <Brand empty={empty} rail={rail} />
        <NavList rail={rail} empty={empty} current="dashboard" />
        <div className={cn("border-t p-3", rail && "flex justify-center px-2")}>
          <NavItem
            icon={rail ? PanelLeftOpenIcon : PanelLeftCloseIcon}
            label={collapseLabel}
            rail={rail}
            role="button"
            aria-pressed={rail}
            className="w-full"
            onClick={(e) => {
              e.preventDefault()
              setCollapsed(!rail)
              onSidebarToggle?.()
            }}
          />
        </div>
      </aside>

      <Sheet open={drawerOpen} onOpenChange={(o) => setOpen(o ? "drawer" : null)}>
        <SheetContent
          title={t("shell.nav.aria")}
          closeLabel={t("shell.nav.collapse")}
          onOpenAutoFocus={(e) => {
            const first = e.currentTarget instanceof HTMLElement ? e.currentTarget.querySelector<HTMLAnchorElement>("nav a[href]") : null
            if (first) {
              e.preventDefault()
              first.focus()
            }
          }}
        >
          <Brand empty={empty} className="pr-hit" />
          <NavList rail={false} empty={empty} current="dashboard" onNavigate={() => setOpen(null)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header data-slot="topbar" className="sticky top-0 z-20 flex h-topbar shrink-0 items-center gap-3 border-b bg-surface px-6 mobile:gap-2 mobile:px-4">
          <IconButton label={t("shell.nav.open")} aria-expanded={drawerOpen} className="hidden mobile:inline-flex" onClick={() => setOpen("drawer")}>
            <MenuIcon />
          </IconButton>
          <Breadcrumb aria-label={t("shell.breadcrumb.aria")} className="min-w-0 flex-1">
            <BreadcrumbList>
              <BreadcrumbItem className="mobile:hidden">{t("shell.breadcrumb.root")}</BreadcrumbItem>
              <BreadcrumbSeparator className="mobile:hidden" />
              <BreadcrumbItem>
                <BreadcrumbPage className="mobile:text-role-title">{t("shell.breadcrumb.current")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex shrink-0 items-center gap-2 mobile:gap-0">
            <SearchInput
              aria-label={t("shell.search.aria")}
              placeholder={t("shell.search.placeholder")}
              shortcut={isApple ? "⌘K" : "Ctrl K"}
              className="mr-2 w-popover tablet:w-sidebar-expanded mobile:hidden"
            />
            <IconButton label={t("shell.search.aria")} className="hidden mobile:inline-flex" onClick={() => notYet(t("shell.search.aria"))}>
              <SearchIcon />
            </IconButton>

            <Popover {...overlay("notifications")}>
              <PopoverTrigger asChild>
                <IconButton label={bellLabel} count={unread} aria-haspopup="dialog">
                  <BellIcon />
                </IconButton>
              </PopoverTrigger>
              <PopoverContent aria-label={t("shell.notifications.title")} onOpenAutoFocus={urlOpened("notifications")}>
                <PopoverHeader>
                  <h2 className="text-role-title">{t("shell.notifications.title")}</h2>
                  <Button variant="ghost" disabled={unread === 0} onClick={() => setRead(true)}>
                    {t("shell.notifications.markAll")}
                  </Button>
                </PopoverHeader>
                {items.length ? (
                  <div className="flex flex-col">
                    {items.map((n) => (
                      <NotificationItem key={n.id} kind={n.type} title={n.title} time={n.relative} unread={!read && n.unread} />
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-6 text-center text-role-body text-fg-muted">{t("shell.notifications.empty")}</p>
                )}
                <PopoverFooter className="text-center">
                  <Button variant="ghost" block asChild>
                    <a href="#" role="link" aria-disabled onClick={(e) => e.preventDefault()}>
                      {t("shell.notifications.viewAll")}
                    </a>
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>

            <IconButton label={resolved === "dark" ? t("shell.theme.toLight") : t("shell.theme.toDark")} onClick={toggle}>
              {resolved === "dark" ? <SunIcon /> : <MoonIcon />}
            </IconButton>

            <DropdownMenu {...overlay("account")}>
              <DropdownMenuTrigger asChild>
                <IconButton label={t("shell.account.aria")} shape="round" aria-haspopup="menu">
                  <Avatar aria-hidden size="sm" initial={mock.user.initial} hue={mock.user.avatarHue} />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent aria-label={t("shell.account.aria")}>
                <DropdownMenuHeader>
                  <Avatar aria-hidden initial={mock.user.initial} hue={mock.user.avatarHue} />
                  <div className="min-w-0 leading-none">
                    <strong className="block truncate text-role-label">{mock.user.name}</strong>
                    <span className="block truncate text-role-caption text-fg-muted">{mock.user.email}</span>
                  </div>
                </DropdownMenuHeader>
                <DropdownMenuItem onSelect={() => notYet(t("shell.account.menu.profile"))}>
                  <UserIcon /> {t("shell.account.menu.profile")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => notYet(t("shell.account.menu.security"))}>
                  <ShieldIcon /> {t("shell.account.menu.security")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => notYet(t("shell.account.menu.switch"))}>
                  <ArrowLeftRightIcon /> {t("shell.account.menu.switch")}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => notYet(t("shell.account.menu.help"))}>
                  <CircleQuestionMarkIcon /> {t("shell.account.menu.help")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="danger" onSelect={() => navigate("/login")}>
                  <LogOutIcon /> {t("shell.account.menu.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main id="main" className="mx-auto flex w-full max-w-content-max flex-1 flex-col gap-6 p-6 mobile:gap-4 mobile:p-4">
          {children}
        </main>
      </div>
    </div>
  )
}

export { AppShell }
