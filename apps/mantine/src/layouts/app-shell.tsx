import { useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  ActionIcon,
  Anchor,
  AppShell as MantineAppShell,
  Avatar,
  Badge,
  Breadcrumbs,
  Burger,
  Group,
  Indicator,
  Menu,
  NavLink,
  Popover,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Icon } from "@ui-gallery/icons-react"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { useThemeToggle } from "@/theme"

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <UnstyledButton component={Link} to="/">
      <Group gap="xs" wrap="nowrap">
        <ThemeIcon size="md" radius="md">
          <Text fw={700} size="sm">A</Text>
        </ThemeIcon>
        {compact ? null : <Text fw={600}>Acme Console</Text>}
      </Group>
    </UnstyledButton>
  )
}

function Navigation({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <Stack gap={2}>
      {nav.map((item) => {
        const link = (
          <NavLink
            key={item.key}
            component={Link}
            to={item.path}
            onClick={onNavigate}
            active={location.pathname === item.path}
            label={collapsed ? undefined : item.label}
            leftSection={<Icon name={item.icon} size={16} />}
            rightSection={!collapsed && item.badge ? <Badge size="xs" circle>{item.badge}</Badge> : undefined}
            px={collapsed ? "xs" : "sm"}
            style={{ borderRadius: "var(--mantine-radius-sm)" }}
          />
        )
        return collapsed ? (
          <Tooltip key={item.key} label={item.label} position="right">
            {link}
          </Tooltip>
        ) : (
          link
        )
      })}
    </Stack>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure()
  const [collapsed, setCollapsed] = useState(false)
  const { computed, toggle } = useThemeToggle()
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const unread = notifications.filter((n) => n.unread).length

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{ width: collapsed ? 72 : 260, breakpoint: "sm", collapsed: { mobile: !mobileOpened } }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" aria-label="打开导航" />
            <Breadcrumbs visibleFrom="xs">
              <Anchor component={Link} to="/" size="sm">Acme Console</Anchor>
              <Text size="sm">{current}</Text>
            </Breadcrumbs>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <TextInput placeholder="搜索..." leftSection={<Icon name="search" size={15} />} visibleFrom="md" w={220} size="sm" aria-label="全局搜索" />
            <Popover width={320} position="bottom-end" shadow="md">
              <Popover.Target>
                <Indicator label={unread} size={16} disabled={!unread} offset={4}>
                  <ActionIcon variant="subtle" color="gray" aria-label="通知"><Icon name="bell" size={18} /></ActionIcon>
                </Indicator>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack gap="xs">
                  <Text fw={600} size="sm">通知</Text>
                  {notifications.map((n) => (
                    <Group key={n.title} justify="space-between" wrap="nowrap">
                      <div>
                        <Text size="sm" fw={n.unread ? 600 : 400}>{n.title}</Text>
                        <Text size="xs" c="dimmed">{n.time}</Text>
                      </div>
                      {n.unread ? <Badge size="xs" variant="dot">未读</Badge> : null}
                    </Group>
                  ))}
                </Stack>
              </Popover.Dropdown>
            </Popover>
            <Tooltip label="切换主题">
              <ActionIcon variant="subtle" color="gray" onClick={toggle} aria-label="切换主题"><Icon name={computed === "dark" ? "sun" : "moon"} size={18} /></ActionIcon>
            </Tooltip>
            <Menu position="bottom-end" width={200}>
              <Menu.Target>
                <UnstyledButton aria-label="账户菜单"><Avatar radius="xl" color="blue">林</Avatar></UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>林晓 · m0@acme.dev</Menu.Label>
                <Menu.Item component={Link} to="/settings" leftSection={<Icon name="user" size={14} />}>个人资料</Menu.Item>
                <Menu.Item component={Link} to="/settings" leftSection={<Icon name="settings" size={14} />}>账户设置</Menu.Item>
                <Menu.Item leftSection={<Icon name="users" size={14} />}>切换团队</Menu.Item>
                <Menu.Item leftSection={<Icon name="circle-help" size={14} />}>帮助中心</Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" component={Link} to="/login" leftSection={<Icon name="log-out" size={14} />}>退出登录</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="sm">
        <MantineAppShell.Section>
          <Group justify={collapsed ? "center" : "space-between"} wrap="nowrap" mb="sm">
            <Brand compact={collapsed} />
            <ActionIcon variant="subtle" color="gray" visibleFrom="sm" onClick={() => setCollapsed((v) => !v)} aria-label="折叠侧栏">
              <Icon name={collapsed ? "chevron-right" : "chevron-left"} size={16} />
            </ActionIcon>
          </Group>
        </MantineAppShell.Section>
        <MantineAppShell.Section grow component={ScrollArea}>
          {!collapsed ? <Text size="xs" c="dimmed" fw={600} px="sm" mb={4}>工作区</Text> : null}
          <Navigation collapsed={collapsed} onNavigate={closeMobile} />
        </MantineAppShell.Section>
        <MantineAppShell.Section>
          <UnstyledButton component={Link} to="/settings" w="100%">
            <Group gap="sm" wrap="nowrap" justify={collapsed ? "center" : "flex-start"}>
              <Avatar radius="xl" color="blue" size="sm">林</Avatar>
              {!collapsed ? (
                <div style={{ minWidth: 0 }}>
                  <Text size="sm" fw={500} truncate>林晓</Text>
                  <Text size="xs" c="dimmed" truncate>m0@acme.dev</Text>
                </div>
              ) : null}
            </Group>
          </UnstyledButton>
        </MantineAppShell.Section>
      </MantineAppShell.Navbar>

      <MantineAppShell.Main style={{ minWidth: 0 }}>{children}</MantineAppShell.Main>
    </MantineAppShell>
  )
}
