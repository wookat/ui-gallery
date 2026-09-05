import { useMemo, useState, type ReactNode } from "react"
import AppLayout from "@cloudscape-design/components/app-layout"
import Autosuggest from "@cloudscape-design/components/autosuggest"
import Badge from "@cloudscape-design/components/badge"
import Box from "@cloudscape-design/components/box"
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group"
import Flashbar, { type FlashbarProps } from "@cloudscape-design/components/flashbar"
import SideNavigation, { type SideNavigationProps } from "@cloudscape-design/components/side-navigation"
import SpaceBetween from "@cloudscape-design/components/space-between"
import TopNavigation, { type TopNavigationProps } from "@cloudscape-design/components/top-navigation"
import { Avatar } from "@cloudscape-design/chat-components"

import navData from "@ui-gallery/spec/mock/nav.json"
import notificationsData from "@ui-gallery/spec/mock/notifications.json"
import teamData from "@ui-gallery/spec/mock/team.json"

import { AppIcon, iconProps } from "@/lib/icons"
import { useAppNav } from "@/lib/nav"
import { isDarkFromUrl, toggleThemeInUrl } from "@/lib/settings"

type NavItem = { key: string; label: string; path: string; icon: string; badge?: number }
const nav = navData as NavItem[]
const me = teamData[0]

export const APP_TITLE = "Acme Console"

export function AppShell({ children, breadcrumb }: { children: ReactNode; breadcrumb?: string }) {
  const { href, follow, go, pathname } = useAppNav()
  const [navOpen, setNavOpen] = useState(true)
  const [search, setSearch] = useState("")
  const [flash, setFlash] = useState<FlashbarProps.MessageDefinition[]>([])
  const [, setDark] = useState(isDarkFromUrl())

  const current = nav.find((item) => item.path === pathname) ?? nav[0]
  const unread = notificationsData.filter((n) => n.unread).length

  const sideItems: SideNavigationProps.Item[] = useMemo(
    () => [
      {
        type: "section",
        text: "工作台",
        items: nav
          .filter((item) => item.key !== "login")
          .map((item) => ({
            type: "link",
            text: item.label,
            href: href(item.path),
            icon: <AppIcon name={item.icon} />,
            info: item.badge ? <Badge color="blue">{item.badge}</Badge> : undefined,
          })),
      },
      { type: "divider" },
      { type: "link", text: nav[nav.length - 1].label, href: href("/login"), icon: <AppIcon name="log-in" /> },
    ],
    [href]
  )

  const utilities: TopNavigationProps.Utility[] = [
    {
      type: "button",
      ariaLabel: "切换主题",
      ...iconProps("moon"),
      onClick: () => {
        toggleThemeInUrl()
        setDark(isDarkFromUrl())
      },
    },
    {
      type: "menu-dropdown",
      ariaLabel: "通知",
      ...iconProps("bell"),
      badge: unread > 0,
      title: `通知 · ${unread} 条未读`,
      items: notificationsData.map((n, i) => ({
        id: `n-${i}`,
        text: n.title,
        description: n.time,
        ...(n.unread ? { iconName: "status-info" as const } : {}),
      })),
      onItemClick: () =>
        setFlash([
          {
            type: "info",
            dismissible: true,
            content: notificationsData[0].title,
            id: "toast",
            onDismiss: () => setFlash([]),
          },
        ]),
    },
    {
      type: "menu-dropdown",
      text: me.name,
      description: me.email,
      ...iconProps("user"),
      items: [
        { id: "profile", text: "个人资料", ...iconProps("user") },
        { id: "settings", text: "设置", href: href("/settings"), ...iconProps("settings") },
        { id: "team", text: "团队", ...iconProps("users") },
        { id: "help", text: "帮助", external: true, href: "#", ...iconProps("circle-help") },
        { id: "logout", text: "退出登录", href: href("/login"), ...iconProps("log-out") },
      ],
      onItemFollow: (e) => follow(e as CustomEvent<{ href?: string; external?: boolean }>),
    },
  ]

  return (
    <>
      <div id="top-nav">
        <TopNavigation
          identity={{
            href: href("/"),
            title: APP_TITLE,
            onFollow: (e) => {
              e.preventDefault()
              go("/")
            },
          }}
          search={
            <Autosuggest
              value={search}
              onChange={({ detail }) => setSearch(detail.value)}
              options={nav.map((item) => ({ value: item.label, description: item.path }))}
              onSelect={({ detail }) => {
                const target = nav.find((item) => item.label === detail.value)
                if (target) go(target.path)
              }}
              placeholder="搜索页面、订单、成员…"
              ariaLabel="全局搜索"
              enteredTextLabel={(v) => `搜索 “${v}”`}
              empty="没有匹配结果"
            />
          }
          utilities={utilities}
          i18nStrings={{
            searchIconAriaLabel: "搜索",
            searchDismissIconAriaLabel: "关闭搜索",
            overflowMenuTriggerText: "更多",
            overflowMenuTitleText: "全部",
            overflowMenuBackIconAriaLabel: "返回",
            overflowMenuDismissIconAriaLabel: "关闭菜单",
          }}
        />
      </div>
      <AppLayout
        headerSelector="#top-nav"
        toolsHide
        navigationOpen={navOpen}
        onNavigationChange={({ detail }) => setNavOpen(detail.open)}
        navigationWidth={260}
        ariaLabels={{ navigation: "侧边导航", navigationToggle: "打开导航", navigationClose: "关闭导航" }}
        navigation={
          <>
            <SideNavigation
              activeHref={href(pathname)}
              header={{ href: href("/"), text: APP_TITLE }}
              items={sideItems}
              onFollow={follow}
            />
            <Box padding={{ horizontal: "l", vertical: "s" }}>
              <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                <Avatar ariaLabel={me.name} initials={me.name.slice(0, 1)} tooltipText={me.email} />
                <div>
                  <Box variant="strong">{me.name}</Box>
                  <Box variant="small" color="text-body-secondary">
                    {me.role}
                  </Box>
                </div>
              </SpaceBetween>
            </Box>
          </>
        }
        breadcrumbs={
          <BreadcrumbGroup
            ariaLabel="面包屑"
            items={[
              { text: APP_TITLE, href: href("/") },
              { text: breadcrumb ?? current.label, href: href(pathname) },
            ]}
            onFollow={follow}
          />
        }
        notifications={flash.length ? <Flashbar items={flash} /> : undefined}
        content={children}
      />
    </>
  )
}
