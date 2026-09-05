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
  const menuItems: MenuProps["items"] = nav.map((item) => ({
    key: item.path,
    icon: <Icon name={item.icon} />,
    label: item.label,
    onClick: () => {
      navigate(item.path)
      setMobileOpen(false)
    },
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
    <Flex vertical style={{ height: "100%" }}>
      <Flex align="center" justify="space-between" style={{ padding: 20 }}>
        <Link
          to="/"
          style={{ color: "inherit", fontWeight: 700, fontSize: 18 }}
        >
          Acme Console
        </Link>
        <Button
          type="text"
          size="small"
          icon={<Icon name="chevron-left" />}
          onClick={() => setCollapsed((value) => !value)}
          aria-label="折叠导航"
        />
      </Flex>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
      <div style={{ marginTop: "auto", padding: 16 }}>
        <Card size="small">
          <Space>
            {avatar(team[0].name)}
            <span>{team[0].name}</span>
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
        breakpoint="md"
        collapsedWidth={0}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={248}
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
              <Avatar style={{ cursor: "pointer" }}>
                {team[0].name.slice(0, 1)}
              </Avatar>
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
