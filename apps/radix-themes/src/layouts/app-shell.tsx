import { useState, type ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import team from "@ui-gallery/spec/mock/team.json"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Dialog,
  DropdownMenu,
  Flex,
  IconButton,
  Popover,
  Text,
  TextField,
} from "@radix-ui/themes"
import { Icon } from "@/icons"
import { useTheme } from "@/theme-provider"

function Brand() {
  return (
    <Link to="/" className="rt-brand">
      <Flex align="center" gap="2">
        <Box>
          <Button size="2">A</Button>
        </Box>
        <Text weight="bold">Acme Console</Text>
      </Flex>
    </Link>
  )
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <Flex direction="column" gap="1">
      {nav.map((item) => (
        <Button
          size="3"
          key={item.key}
          asChild
          variant={location.pathname === item.path ? "soft" : "ghost"}
          color={location.pathname === item.path ? "indigo" : undefined}
          onClick={onNavigate}
          style={{
            width: "100%",
            minHeight: "40px",
            boxSizing: "border-box",
            justifyContent: "flex-start",
          }}
        >
          <Link to={item.path}>
            <Icon name={item.icon} />
            <Text>{item.label}</Text>
            {item.badge ? (
              <Badge size="1" variant="soft">
                {item.badge}
              </Badge>
            ) : null}
          </Link>
        </Button>
      ))}
    </Flex>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { appearance, toggle } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const current =
    nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  return (
    <Flex className="rt-page" style={{ minHeight: "100vh" }}>
      <Box
        asChild
        display={{ initial: "none", md: "block" }}
        width="260px"
        p="4"
        style={{ borderRight: "1px solid var(--gray-a5)", flexShrink: 0 }}
      >
        <aside>
          <Flex direction="column" gap="6" height="100%">
            <Brand />
            <Box>
              <Text size="1" color="gray">
                工作区
              </Text>
              <Box mt="3">
                <Navigation />
              </Box>
            </Box>
            <Box mt="auto">
              <Card size="1">
                <Flex align="center" gap="2">
                  <Avatar size="2" fallback="林" />
                  <Flex direction="column" gap="1">
                    <Text size="2" weight="medium">
                      {team[0].name}
                    </Text>
                    <Text size="1" color="gray">
                      {team[0].email}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            </Box>
            <IconButton
              size="3"
              variant="ghost"
              onClick={() => setCollapsed((value) => !value)}
              style={{ minHeight: "40px", minWidth: "40px" }}
            >
              <Icon name={collapsed ? "chevron-right" : "chevron-left"} />
            </IconButton>
          </Flex>
        </aside>
      </Box>
      <Flex direction="column" flexGrow="1" minWidth="0">
        <Flex
          asChild
          align="center"
          gap="3"
          p={{ initial: "3", md: "4" }}
          style={{ borderBottom: "1px solid var(--gray-a5)" }}
        >
          <header>
            <Flex
              display={{ initial: "flex", md: "none" }}
              align="center"
              gap="2"
            >
              <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
                <Dialog.Trigger>
                  <IconButton
                    size="3"
                    variant="ghost"
                    style={{ minHeight: "40px", minWidth: "40px" }}
                  >
                    <Icon name="menu" />
                  </IconButton>
                </Dialog.Trigger>
                <Dialog.Content
                  style={{
                    position: "fixed",
                    inset: "0 auto 0 0",
                    width: "280px",
                    maxHeight: "100vh",
                    borderRadius: 0,
                    transform: "none",
                  }}
                >
                  <Dialog.Title>
                    <Brand />
                  </Dialog.Title>
                  <Box mt="5">
                    <Navigation onNavigate={() => setMobileOpen(false)} />
                  </Box>
                </Dialog.Content>
              </Dialog.Root>
              <Text weight="bold">Acme Console</Text>
            </Flex>
            <Flex
              display={{ initial: "none", md: "flex" }}
              align="center"
              gap="2"
            >
              <Link to="/">Acme Console</Link>
              <Icon name="chevron-right" />
              <Text color="gray">{current}</Text>
            </Flex>
            <Box
              display={{ initial: "none", md: "block" }}
              style={{ marginLeft: "auto" }}
            >
              <TextField.Root
                placeholder="搜索..."
                style={{ maxWidth: "280px" }}
              >
                <TextField.Slot>
                  <Icon name="search" size={16} />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            <Popover.Root>
              <Popover.Trigger>
                <IconButton
                  size="3"
                  variant="ghost"
                  style={{ minHeight: "40px", minWidth: "40px" }}
                >
                  <Icon name="bell" />
                  <Badge size="1" color="red">
                    {notifications.filter((item) => item.unread).length}
                  </Badge>
                </IconButton>
              </Popover.Trigger>
              <Popover.Content width="320px">
                <Flex direction="column" gap="3">
                  {notifications.map((item) => (
                    <Box key={item.title}>
                      <Text size="2" weight={item.unread ? "bold" : "regular"}>
                        {item.title}
                      </Text>
                      <Text size="1" color="gray" as="div">
                        {item.time}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              </Popover.Content>
            </Popover.Root>
            <IconButton
              size="3"
              variant="ghost"
              onClick={toggle}
              style={{ minHeight: "40px", minWidth: "40px" }}
            >
              <Icon name={appearance === "dark" ? "sun" : "moon"} />
            </IconButton>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton
                  size="3"
                  variant="ghost"
                  style={{ minHeight: "40px", minWidth: "40px" }}
                >
                  <Avatar size="2" fallback="林" />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Label>林晓</DropdownMenu.Label>
                <DropdownMenu.Item asChild>
                  <Link to="/settings">个人资料</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link to="/settings">账户设置</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link to="/settings">团队</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>帮助</DropdownMenu.Item>
                <DropdownMenu.Item>退出登录</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </header>
        </Flex>
        <Box asChild p={{ initial: "4", md: "6" }} flexGrow="1">
          <main>{children}</main>
        </Box>
      </Flex>
    </Flex>
  )
}
