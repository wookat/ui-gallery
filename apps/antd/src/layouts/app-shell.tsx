import { useState, type ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  App,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Drawer,
  Dropdown,
  Flex,
  Input,
  Layout,
  List,
  Menu,
  Popover,
  Space,
  Typography,
  theme,
} from "antd"
import type { MenuProps } from "antd"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import team from "@ui-gallery/spec/mock/team.json"
import { Icon } from "@/icons"
import { useThemeSettings, avatar } from "@/pages/shared"

export function AppShell({ children }: { children: ReactNode }) {
  const { dark, setDark } = useThemeSettings()
  const { token } = theme.useToken()
  const { message } = App.useApp()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const current =
    nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const navGroups: Array<{ label: string; keys: string[] }> = [
    { label: "工作区", keys: ["dashboard", "orders", "form", "chat"] },
    { label: "资源", keys: ["components", "landing"] },
    { label: "系统", keys: ["settings", "login"] },
  ]
  const menuItems: MenuProps["items"] = navGroups.map((group) => ({
    type: "group",
    key: group.label,
    label: group.label,
    children: nav
      .filter((item) => group.keys.includes(item.key))
      .map((item) => ({
        key: item.path,
        icon: <Icon name={item.icon} />,
        label: item.badge ? (
          <Flex justify="space-between" align="center">
            <span>{item.label}</span>
            <Badge count={item.badge} size="small" />
          </Flex>
        ) : (
          item.label
        ),
        onClick: () => {
          navigate(item.path)
          setMobileOpen(false)
        },
      })),
  }))
  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next ? "dark" : "light")
    window.history.replaceState(
      {},
      "",
      `${location.pathname}?${params.toString()}`
    )
    window.dispatchEvent(new Event("themechange"))
  }
  const navigation = (
    <Flex vertical style={{ height: "100%", minHeight: 0 }}>
      <Flex
        align="center"
        justify="space-between"
        style={{ padding: "16px 20px", flexShrink: 0 }}
      >
        <Link
          to="/"
          style={{ color: "inherit", fontWeight: 700, fontSize: 18 }}
        >
          Acme Console
        </Link>
        <Button
          className="desktop-only"
          type="text"
          icon={<Icon name="chevron-left" />}
          onClick={() => setCollapsed((value) => !value)}
          aria-label="折叠导航"
        />
      </Flex>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderInlineEnd: 0 }}
        />
      </div>
      <div style={{ padding: 16, flexShrink: 0 }}>
        <Card size="small">
          <Space>
            {avatar(team[0].name)}
            <div>
              <div>{team[0].name}</div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {team[0].role}
              </Typography.Text>
            </div>
          </Space>
        </Card>
      </div>
    </Flex>
  )
  const noticeContent = (
    <List
      size="small"
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta title={item.title} description={item.time} />
          {item.unread ? <Badge status="processing" /> : null}
        </List.Item>
      )}
    />
  )
  const accountItems: MenuProps["items"] = [
    "个人资料",
    "账号设置",
    "快捷键",
    "帮助中心",
    "退出登录",
  ].map((label) => ({
    key: label,
    label,
    onClick: () => {
      if (label === "退出登录") message.info("演示环境不会退出登录")
      if (label === "账号设置") navigate("/settings")
    },
  }))
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        theme="light"
        breakpoint="md"
        collapsedWidth={0}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={248}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {navigation}
      </Layout.Sider>
      <Layout className="shell-main">
        <Layout.Header
          style={{
            paddingInline: 16,
            background: token.colorBgContainer,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Button
            className="mobile-only"
            icon={<Icon name="menu" />}
            onClick={() => setMobileOpen(true)}
            aria-label="打开导航"
          />
          <Button
            className="desktop-only"
            type="text"
            icon={<Icon name="menu" />}
            onClick={() => setCollapsed((value) => !value)}
            aria-label="折叠导航"
          />
          <Breadcrumb
            items={[
              { title: <Link to="/">Acme Console</Link> },
              { title: current },
            ]}
          />
          <Input.Search
            className="desktop-only"
            placeholder="搜索..."
            style={{ maxWidth: 300, marginLeft: "auto" }}
          />
          <Space style={{ marginLeft: "auto" }}>
            <Popover
              title="通知"
              content={noticeContent}
              trigger="click"
              placement="bottomRight"
            >
              <Badge count={notifications.filter((item) => item.unread).length}>
                <Button
                  type="text"
                  icon={<Icon name="bell" />}
                  aria-label="通知"
                />
              </Badge>
            </Popover>
            <Button
              type="text"
              icon={<Icon name={dark ? "sun" : "moon"} />}
              onClick={toggleTheme}
              aria-label="切换主题"
            />
            <Dropdown menu={{ items: accountItems }} trigger={["click"]}>
              <Button
                type="text"
                shape="circle"
                aria-label="账号菜单"
                icon={<Avatar size="small">{team[0].name.slice(0, 1)}</Avatar>}
              />
            </Dropdown>
          </Space>
        </Layout.Header>
        <Layout.Content className="app-content" style={{ padding: 24 }}>
          <div className="page">{children}</div>
        </Layout.Content>
      </Layout>
      <Drawer
        title="Acme Console"
        placement="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        styles={{ body: { padding: 0 } }}
      >
        {navigation}
      </Drawer>
    </Layout>
  )
}

export function ChatShellHeader({ children }: { children: ReactNode }) {
  return (
    <Typography.Title level={3} style={{ margin: 0 }}>
      {children}
    </Typography.Title>
  )
}
