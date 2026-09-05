import { useState, type ReactNode } from "react"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import team from "@ui-gallery/spec/mock/team.json"
import { useColorMode } from "@/components/provider"
import {
  Avatar, Badge, Box, Breadcrumb, Button, Card, Drawer, Flex, Float, Heading, IconButton, Input, InputGroup,
  Menu, Popover, Portal, Stack, Text, Tooltip,
} from "@chakra-ui/react"
import { Logo } from "@/pages/shared"
import { Icon as GalleryIcon } from "@ui-gallery/icons-react"

function Icon({ name, width, height, size }: { name: string; width?: string; height?: string; size?: string | number }) {
  return <GalleryIcon name={name} size={size ?? width ?? height} />
}

function NavItems({ close }: { close?: () => void }) {
  const location = useLocation()
  return (
    <Stack gap="1">
      {nav.map((item) => (
        <Button key={item.key} asChild variant={location.pathname === item.path ? "subtle" : "ghost"} justifyContent="start" width="full" onClick={close}>
          <RouterLink to={item.path}><Icon name={item.icon} width="16" height="16" /><Text flex="1" textAlign="start">{item.label}</Text>{item.badge ? <Badge>{item.badge}</Badge> : null}</RouterLink>
        </Button>
      ))}
    </Stack>
  )
}

function MobileNav() {
  return (
    <Drawer.Root placement="start">
      <Drawer.Trigger asChild><IconButton aria-label="打开导航" hideFrom="md" variant="ghost"><Icon name="menu" width="20" height="20" /></IconButton></Drawer.Trigger>
      <Portal><Drawer.Backdrop /><Drawer.Positioner><Drawer.Content><Drawer.Header><Drawer.Title><Logo /></Drawer.Title></Drawer.Header><Drawer.Body><NavItems /></Drawer.Body></Drawer.Content></Drawer.Positioner></Portal>
    </Drawer.Root>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()
  const [collapsed, setCollapsed] = useState(false)
  const current = nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const toggleTheme = () => {
    const next = colorMode === "dark" ? "light" : "dark"
    toggleColorMode()
    const params = new URLSearchParams(window.location.search)
    params.set("theme", next)
    navigate(`${location.pathname}?${params.toString()}`)
  }
  return (
    <Flex minH="100vh" bg="bg.subtle">
      <Box as="aside" hideBelow="md" width={collapsed ? "16" : "64"} borderEndWidth="1px" bg="bg.panel" p="4" transition="width 0.2s">
        <Flex align="center" justify="space-between" mb="8"><RouterLink to="/"><Logo compact={collapsed} /></RouterLink><IconButton aria-label="折叠侧栏" size="sm" variant="ghost" onClick={() => setCollapsed((value) => !value)}><Icon name="chevron-left" width="16" height="16" /></IconButton></Flex>
        {!collapsed ? <Text fontSize="xs" color="fg.muted" mb="2">工作区</Text> : null}
        <NavItems />
        <Card.Root mt="auto" variant="subtle"><Card.Body p="3"><Flex align="center" gap="2"><Avatar.Root size="sm"><Avatar.Fallback name={team[0].name} /></Avatar.Root>{!collapsed ? <Box><Text fontSize="sm" fontWeight="medium">{team[0].name}</Text><Text fontSize="xs" color="fg.muted">{team[0].email}</Text></Box> : null}</Flex></Card.Body></Card.Root>
      </Box>
      <Box flex="1" minW="0">
        <Flex as="header" position="sticky" top="0" zIndex="10" h="16" align="center" gap="3" borderBottomWidth="1px" bg="bg.panel/95" px={{ base: "4", md: "6" }} backdropFilter="blur(8px)">
          <MobileNav />
          <Breadcrumb.Root hideBelow="sm"><Breadcrumb.List><Breadcrumb.Item><Breadcrumb.Link asChild><RouterLink to="/">Acme Console</RouterLink></Breadcrumb.Link></Breadcrumb.Item><Breadcrumb.Separator /><Breadcrumb.Item><Breadcrumb.CurrentLink>{current}</Breadcrumb.CurrentLink></Breadcrumb.Item></Breadcrumb.List></Breadcrumb.Root>
          <Box flex="1" />
          <InputGroup maxW="240px" hideBelow="md" startElement={<Icon name="search" width="16" height="16" />}><Input placeholder="搜索..." /></InputGroup>
          <Popover.Root>
            <Popover.Trigger asChild><IconButton aria-label="通知" variant="ghost"><Float placement="top-end"><Icon name="bell" width="18" height="18" /><Float offsetX="1" offsetY="1"><Badge size="xs">2</Badge></Float></Float></IconButton></Popover.Trigger>
            <Portal><Popover.Positioner><Popover.Content><Popover.Arrow /><Popover.Body><Stack gap="3"><Heading size="sm">通知</Heading>{notifications.map((item) => <Box key={item.title}><Text fontSize="sm">{item.title}</Text><Text fontSize="xs" color="fg.muted">{item.time}</Text></Box>)}</Stack></Popover.Body></Popover.Content></Popover.Positioner></Portal>
          </Popover.Root>
          <Tooltip.Root><Tooltip.Trigger asChild><IconButton aria-label="切换主题" variant="ghost" onClick={toggleTheme}><Icon name={colorMode === "dark" ? "sun" : "moon"} width="18" height="18" /></IconButton></Tooltip.Trigger><Portal><Tooltip.Positioner><Tooltip.Content>切换主题</Tooltip.Content></Tooltip.Positioner></Portal></Tooltip.Root>
          <Menu.Root>
            <Menu.Trigger asChild><IconButton aria-label="账户菜单" variant="ghost"><Avatar.Root size="sm"><Avatar.Fallback name="林晓" /></Avatar.Root></IconButton></Menu.Trigger>
            <Portal><Menu.Positioner><Menu.Content><Menu.Item value="profile">林晓</Menu.Item><Menu.Item value="settings" asChild><RouterLink to="/settings">账户设置</RouterLink></Menu.Item><Menu.Item value="help">帮助中心</Menu.Item><Menu.Item value="shortcut">快捷键</Menu.Item><Menu.Item value="logout">退出登录</Menu.Item></Menu.Content></Menu.Positioner></Portal>
          </Menu.Root>
        </Flex>
        <Box as="main" minW="0" p={{ base: "4", md: "6" }}>{children}</Box>
      </Box>
    </Flex>
  )
}
