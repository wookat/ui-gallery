import { useState } from "react"
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
  Breadcrumbs,
  Divider,
  Drawer,
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
} from "@mui/material"
import nav from "@ui-gallery/spec/mock/nav.json"
import notifications from "@ui-gallery/spec/mock/notifications.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { useThemeMode } from "@/theme-context"

const drawerWidth = 240

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

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
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
          <ListItemIcon sx={{ minWidth: 38 }}>
            <Icon name={item.icon} size={19} />
          </ListItemIcon>
          <ListItemText primary={item.label} />
          {item.badge ? (
            <Typography variant="caption" color="text.secondary">
              {item.badge}
            </Typography>
          ) : null}
        </ListItemButton>
      ))}
    </List>
  )
}

function DrawerContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      <Box sx={{ px: 1, py: 1.5 }}>
        <Brand />
      </Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
        工作区
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Navigation onNavigate={onNavigate} />
      </Box>
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 1 }} />
        <ListItemButton
          component={Link}
          to="/settings"
          onClick={onNavigate}
          sx={{ borderRadius: 1 }}
        >
          <Avatar sx={{ width: 30, height: 30, mr: 1.5 }}>林</Avatar>
          <ListItemText primary="林晓" secondary="管理员" />
        </ListItemButton>
      </Box>
    </Box>
  )
}

export function AppShell() {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsAnchor, setNotificationsAnchor] =
    useState<HTMLElement | null>(null)
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)
  const { mode, toggle } = useThemeMode()
  const location = useLocation()
  const navigate = useNavigate()
  const current =
    nav.find((item) => item.path === location.pathname)?.label ?? "仪表盘"

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
          width: mobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          ml: mobile ? 0 : `${drawerWidth}px`,
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
              <Icon name="menu" />
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
          <TextField
            size="small"
            placeholder="搜索..."
            sx={{ display: { xs: "none", md: "block" }, width: 220 }}
            slotProps={{
              input: { startAdornment: <Icon name="search" size={18} /> },
            }}
          />
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
                <Icon name="bell" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="切换主题">
            <IconButton onClick={changeTheme}>
              <Icon name={mode === "dark" ? "sun" : "moon"} />
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={(event) => setProfileAnchor(event.currentTarget)}
          >
            <Avatar sx={{ width: 32, height: 32 }}>林</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      {!mobile ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <DrawerContent />
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
