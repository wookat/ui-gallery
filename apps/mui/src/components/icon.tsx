import type { ComponentType } from "react"
import type { SvgIconProps } from "@mui/material/SvgIcon"
import { Icon as GalleryIcon } from "@ui-gallery/icons-react"
import AlertCircle from "@mui/icons-material/ErrorOutlineOutlined"
import ArrowRight from "@mui/icons-material/ArrowForward"
import ArrowLeft from "@mui/icons-material/ArrowBack"
import BarChart from "@mui/icons-material/BarChart"
import Bold from "@mui/icons-material/FormatBold"
import Bot from "@mui/icons-material/SmartToy"
import Boxes from "@mui/icons-material/Inventory2"
import Calendar from "@mui/icons-material/CalendarMonth"
import Check from "@mui/icons-material/Check"
import CircleHelp from "@mui/icons-material/HelpOutlineOutlined"
import Copy from "@mui/icons-material/ContentCopy"
import Download from "@mui/icons-material/Download"
import Edit from "@mui/icons-material/Edit"
import FilePlus from "@mui/icons-material/NoteAdd"
import Github from "@mui/icons-material/Code"
import Globe from "@mui/icons-material/Language"
import Image from "@mui/icons-material/Image"
import Inbox from "@mui/icons-material/Inbox"
import Info from "@mui/icons-material/InfoOutlined"
import LayoutDashboard from "@mui/icons-material/Dashboard"
import Loader from "@mui/icons-material/Autorenew"
import Lock from "@mui/icons-material/Lock"
import LogIn from "@mui/icons-material/Login"
import LogOut from "@mui/icons-material/Logout"
import Menu from "@mui/icons-material/Menu"
import MessageCircle from "@mui/icons-material/ChatBubbleOutlineOutlined"
import MessageSquare from "@mui/icons-material/Chat"
import Paperclip from "@mui/icons-material/AttachFile"
import Plug from "@mui/icons-material/Power"
import Plus from "@mui/icons-material/Add"
import Search from "@mui/icons-material/Search"
import Send from "@mui/icons-material/Send"
import Settings from "@mui/icons-material/Settings"
import Shield from "@mui/icons-material/Shield"
import ShoppingCart from "@mui/icons-material/ShoppingCart"
import Sliders from "@mui/icons-material/Tune"
import Sparkles from "@mui/icons-material/AutoAwesome"
import Trash from "@mui/icons-material/Delete"
import Upload from "@mui/icons-material/Upload"
import Zap from "@mui/icons-material/Bolt"
import Sun from "@mui/icons-material/LightMode"
import Moon from "@mui/icons-material/DarkMode"
import Minus from "@mui/icons-material/Remove"
import Bell from "@mui/icons-material/Notifications"
import ChevronDown from "@mui/icons-material/ExpandMore"
import ChevronRight from "@mui/icons-material/ChevronRight"
import MoreHorizontal from "@mui/icons-material/MoreHoriz"
import User from "@mui/icons-material/Person"
import X from "@mui/icons-material/Close"
import Eye from "@mui/icons-material/Visibility"
import EyeOff from "@mui/icons-material/VisibilityOff"
import Star from "@mui/icons-material/Star"
import Home from "@mui/icons-material/Home"
import Mail from "@mui/icons-material/Mail"
import Filter from "@mui/icons-material/FilterList"
import ArrowUp from "@mui/icons-material/ArrowUpward"
import ArrowDown from "@mui/icons-material/ArrowDownward"
import Mic from "@mui/icons-material/Mic"
import Smile from "@mui/icons-material/SentimentSatisfiedAlt"

const NATIVE: Record<string, ComponentType<SvgIconProps>> = {
  "alert-circle": AlertCircle,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "bar-chart": BarChart,
  bell: Bell,
  bold: Bold,
  bot: Bot,
  boxes: Boxes,
  calendar: Calendar,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "circle-help": CircleHelp,
  copy: Copy,
  download: Download,
  edit: Edit,
  eye: Eye,
  "eye-off": EyeOff,
  "file-plus": FilePlus,
  filter: Filter,
  github: Github,
  globe: Globe,
  home: Home,
  image: Image,
  inbox: Inbox,
  info: Info,
  "layout-dashboard": LayoutDashboard,
  loader: Loader,
  lock: Lock,
  "log-in": LogIn,
  "log-out": LogOut,
  mail: Mail,
  menu: Menu,
  "message-circle": MessageCircle,
  "message-square": MessageSquare,
  mic: Mic,
  moon: Moon,
  minus: Minus,
  "more-horizontal": MoreHorizontal,
  paperclip: Paperclip,
  plug: Plug,
  plus: Plus,
  search: Search,
  send: Send,
  settings: Settings,
  shield: Shield,
  "shopping-cart": ShoppingCart,
  sliders: Sliders,
  smile: Smile,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  trash: Trash,
  upload: Upload,
  user: User,
  x: X,
  zap: Zap,
}

export type IconFamily =
  "native" | "lucide" | "tabler" | "phosphor" | "heroicons"

/** `?icon=` (page-spec 用词) 与 `?icons=` (packages/icons-react 实际读取的参数) 同时支持 */
export function iconFamily(): IconFamily {
  if (typeof window === "undefined") return "native"
  const params = new URLSearchParams(window.location.search)
  const value = params.get("icon") ?? params.get("icons")
  if (
    value === "lucide" ||
    value === "tabler" ||
    value === "phosphor" ||
    value === "heroicons"
  )
    return value
  return "native"
}

// icons-react 只读 `icons`；若用户传 `icon=`，同步到 URL 让适配器识别
if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search)
  if (params.get("icon") && !params.get("icons")) {
    const url = new URL(window.location.href)
    url.searchParams.set("icons", params.get("icon")!)
    window.history.replaceState(null, "", url)
  }
}

export interface IconProps {
  name: string
  size?: number
  className?: string
  sx?: SvgIconProps["sx"]
  color?: SvgIconProps["color"]
}

export function Icon({ name, size = 20, className, sx, color }: IconProps) {
  if (iconFamily() === "native") {
    const Native = NATIVE[name] ?? CircleHelp
    return (
      <Native
        className={className}
        color={color}
        sx={{ fontSize: size, ...sx }}
      />
    )
  }
  return <GalleryIcon name={name} size={size} className={className} />
}
