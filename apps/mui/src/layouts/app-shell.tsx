import { useEffect, useState } from "react"
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom"
import { useMediaQuery, useTheme } from "@mui/material"
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Breadcrumbs,
  Divider,
  Drawer,
  Dialog,
  DialogContent,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { useThemeMode } from "@/theme-context"

const drawerWidth = 240
const collapsedWidth = 72

function Brand() {
  return (
    <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            fontWeight: 700,
          }}
        >
          A
        </Box>
        <Typography sx={{ fontWeight: 600 }}>Acme Console</Typography>
      </Stack>
    </Link>
  )
}

function Navigation({
  onNavigate,
  collapsed,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const location = useLocation()
  return (
    <List disablePadding>
      {nav.map((item) => (
        <ListItemButton
          key={item.key}
          component={NavLink}
          to={item.path}
          onClick={onNavigate}
          selected={location.pathname === item.path}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            "&.active": { bgcolor: "action.selected" },
          }}
        >
          <Tooltip title={collapsed ? item.label : ""} placement="right">
            <ListItemIcon
              sx={{ minWidth: collapsed ? 0 : 38, justifyContent: "center" }}
            >
              <Icon name={item.icon} size={19} />
            </ListItemIcon>
          </Tooltip>
          {!collapsed ? <ListItemText primary={item.label} /> : null}
          {!collapsed && item.badge ? (
            <Typography variant="caption" color="text.secondary">
              {item.badge}
            </Typography>
          ) : null}
        </ListItemButton>
      ))}
    </List>
  )
}

function DrawerContent({
  onNavigate,
  collapsed,
  onToggle,
}: {
  onNavigate?: () => void
  collapsed?: boolean
  onToggle?: () => void
}) {
  return (
    <Box
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box sx={{ px: 1, py: 1.5 }}>
        {collapsed ? (
          <Tooltip title="Acme Console" placement="right">
            <Box>
              <Brand />
            </Box>
          </Tooltip>
        ) : (
          <Brand />
        )}
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
        工作区
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Navigation onNavigate={onNavigate} collapsed={collapsed} />
      </Box>
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 1 }} />
        <ListItemButton
          component={Link}
          to="/settings"
          onClick={onNavigate}
          sx={{ borderRadius: 1 }}
        >
          <Tooltip title={collapsed ? "林晓" : ""} placement="right">
            <Avatar
              sx={{
                width: 30,
                height: 30,
                mr: collapsed ? 0 : 1.5,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              林
            </Avatar>
          </Tooltip>
          {!collapsed ? (
            <ListItemText primary="林晓" secondary="管理员" />
          ) : null}
        </ListItemButton>
        {onToggle ? (
          <Tooltip
            title={collapsed ? "展开侧边栏" : "折叠侧边栏"}
            placement="right"
          >
            <IconButton aria-label="折叠侧边栏" onClick={onToggle}>
              <Icon
                name={collapsed ? "chevron-right" : "chevron-left"}
                size={24}
              />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
    </Box>
  )
}

export function AppShell() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [command, setCommand] = useState("")
  const [notificationsAnchor, setNotificationsAnchor] =
    useState<HTMLElement | null>(null)
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)
  const { mode, toggle } = useThemeMode()
  const location = useLocation()
  const navigate = useNavigate()
  const current =
    nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"
  const commandItems = nav.filter((item) => item.label.includes(command))

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  const changeTheme = () => {
    toggle()
    const params = new URLSearchParams(window.location.search)
    params.set("theme", mode === "dark" ? "light" : "dark")
    navigate(`${location.pathname}?${params.toString()}`)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          flexShrink: 0,
          width: mobile
            ? "100%"
            : `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          ml: mobile ? 0 : `${collapsed ? collapsedWidth : drawerWidth}px`,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ gap: 1, minWidth: 0 }}>
          {mobile ? (
            <IconButton
              aria-label="打开菜单"
              onClick={() => setMobileOpen(true)}
            >
              <Icon name="menu" size={24} />
            </IconButton>
          ) : null}
          <Breadcrumbs
            sx={{ display: { xs: "none", sm: "flex" }, minWidth: 0 }}
            aria-label="breadcrumb"
          >
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Acme Console
            </Link>
            <Typography color="text.primary">{current}</Typography>
          </Breadcrumbs>
          <Box sx={{ flex: 1, minWidth: 0 }} />
          <Button
            variant="outlined"
            size="small"
            startIcon={<Icon name="search" />}
            onClick={() => setCommandOpen(true)}
            sx={{ display: { xs: "none", md: "inline-flex" } }}
          >
            搜索… <Chip size="small" label="⌘K" sx={{ ml: 1 }} />
          </Button>
          <IconButton
            aria-label="搜索"
            onClick={() => setCommandOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <Icon name="search" size={24} />
          </IconButton>
          <Tooltip title="通知">
            <IconButton
              onClick={(event) => setNotificationsAnchor(event.currentTarget)}
            >
              <Badge
                badgeContent={
                  notifications.filter((item) => item.unread).length
                }
                color="primary"
              >
                <Icon name="bell" size={24} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="切换主题">
            <IconButton onClick={changeTheme}>
              <Icon name={mode === "dark" ? "sun" : "moon"} size={24} />
            </IconButton>
          </Tooltip>
          <IconButton
            aria-label="账户菜单"
            sx={{ p: 0.5 }}
            onClick={(event) => setProfileAnchor(event.currentTarget)}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              林
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      {!mobile ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              width: collapsed ? collapsedWidth : drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <DrawerContent
            collapsed={collapsed}
            onToggle={() => setCollapsed((value) => !value)}
          />
        </Drawer>
      ) : null}
      {mobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          <DrawerContent onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      ) : null}
      <Box
        component="main"
        sx={{
          width: mobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          ml: mobile ? 0 : `${drawerWidth}px`,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={() => setNotificationsAnchor(null)}
      >
        {notifications.map((item) => (
          <MenuItem
            key={item.title}
            onClick={() => setNotificationsAnchor(null)}
            sx={{ display: "block", minWidth: 280 }}
          >
            <Typography variant="body2">{item.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {item.time}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
      <Dialog
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            placeholder="搜索…"
          />
          <List>
            {commandItems.map((item) => (
              <ListItemButton
                key={item.key}
                onClick={() => {
                  navigate(item.path)
                  setCommandOpen(false)
                  setCommand("")
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
      >
        <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
          林晓
        </Typography>
        <Divider />
        <MenuItem
          component={Link}
          to="/settings"
          onClick={() => setProfileAnchor(null)}
        >
          账户设置
        </MenuItem>
        <MenuItem onClick={() => setProfileAnchor(null)}>
          <Icon name="log-out" size={18} />
          &nbsp;退出登录
        </MenuItem>
      </Menu>
    </Box>
  )
}
