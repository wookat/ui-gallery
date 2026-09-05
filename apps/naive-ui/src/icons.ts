// Icon adapter for Vue: reads `?icons=lucide|tabler|phosphor|heroicons` and maps
// a framework-agnostic icon name onto the matching component of that family.
import { defineComponent, h, type Component } from "vue"
import * as L from "lucide-vue-next"
import * as T from "@tabler/icons-vue"
import * as P from "@phosphor-icons/vue"
import * as H from "@heroicons/vue/24/outline"

type Family = "lucide" | "tabler" | "phosphor" | "heroicons"
type Table = Record<string, Component>

const names = [
  "layout-dashboard", "shopping-cart", "file-plus", "message-square", "boxes", "globe", "settings", "log-in", "log-out",
  "zap", "shield", "bar-chart", "bot", "plug", "search", "bell", "moon", "sun", "menu", "user", "users", "plus", "send",
  "paperclip", "copy", "check", "trash", "pencil", "download", "sliders", "calendar", "mail", "lock", "eye", "eye-off",
  "github", "chevron-down", "chevron-left", "chevron-right", "chevron-up", "x", "inbox", "info", "alert-circle", "star",
  "upload", "filter", "refresh", "more-horizontal", "sparkles", "loader", "image", "arrow-up", "arrow-down", "arrow-right",
  "home", "tag", "clock", "link", "list", "heart", "mic", "circle-help", "message-circle", "wrench", "twitter", "linkedin",
  "youtube", "credit-card", "languages", "qr-code", "smartphone", "rocket", "trending-up", "trending-down", "panel-left",
  "wechat", "google",
] as const
export type IconName = (typeof names)[number]

function table(list: Component[]): Table {
  if (list.length !== names.length) throw new Error("icon table length mismatch")
  const out: Table = {}
  names.forEach((name, index) => { out[name] = list[index]! })
  return out
}

const lucide = table([
  L.LayoutDashboard, L.ShoppingCart, L.FilePlus, L.MessageSquare, L.Boxes, L.Globe, L.Settings, L.LogIn, L.LogOut,
  L.Zap, L.Shield, L.ChartBar, L.Bot, L.Plug, L.Search, L.Bell, L.Moon, L.Sun, L.Menu, L.User, L.Users, L.Plus, L.Send,
  L.Paperclip, L.Copy, L.Check, L.Trash2, L.Pencil, L.Download, L.SlidersHorizontal, L.CalendarDays, L.Mail, L.Lock, L.Eye, L.EyeOff,
  L.Github, L.ChevronDown, L.ChevronLeft, L.ChevronRight, L.ChevronUp, L.X, L.Inbox, L.Info, L.CircleAlert, L.Star,
  L.Upload, L.Filter, L.RefreshCw, L.Ellipsis, L.Sparkles, L.LoaderCircle, L.Image, L.ArrowUp, L.ArrowDown, L.ArrowRight,
  L.Home, L.Tag, L.Clock3, L.Link2, L.List, L.Heart, L.Mic, L.CircleHelp, L.MessageCircle, L.Wrench, L.Twitter, L.Linkedin,
  L.Youtube, L.CreditCard, L.Languages, L.QrCode, L.Smartphone, L.Rocket, L.TrendingUp, L.TrendingDown, L.PanelLeft,
  L.MessageCircle, L.Globe,
])

const tabler = table([
  T.IconLayoutDashboard, T.IconShoppingCart, T.IconFilePlus, T.IconMessage, T.IconBox, T.IconWorld, T.IconSettings, T.IconLogin, T.IconLogout,
  T.IconBolt, T.IconShield, T.IconChartBar, T.IconRobot, T.IconPlug, T.IconSearch, T.IconBell, T.IconMoon, T.IconSun, T.IconMenu2, T.IconUser, T.IconUsers, T.IconPlus, T.IconSend,
  T.IconPaperclip, T.IconCopy, T.IconCheck, T.IconTrash, T.IconPencil, T.IconDownload, T.IconAdjustmentsHorizontal, T.IconCalendar, T.IconMail, T.IconLock, T.IconEye, T.IconEyeOff,
  T.IconBrandGithub, T.IconChevronDown, T.IconChevronLeft, T.IconChevronRight, T.IconChevronUp, T.IconX, T.IconInbox, T.IconInfoCircle, T.IconAlertCircle, T.IconStar,
  T.IconUpload, T.IconFilter, T.IconRefresh, T.IconDots, T.IconSparkles, T.IconLoader2, T.IconPhoto, T.IconArrowUp, T.IconArrowDown, T.IconArrowRight,
  T.IconHome, T.IconTag, T.IconClock, T.IconLink, T.IconList, T.IconHeart, T.IconMicrophone, T.IconHelpCircle, T.IconMessageCircle, T.IconTool, T.IconBrandX, T.IconBrandLinkedin,
  T.IconBrandYoutube, T.IconCreditCard, T.IconLanguage, T.IconQrcode, T.IconDeviceMobile, T.IconRocket, T.IconTrendingUp, T.IconTrendingDown, T.IconLayoutSidebar,
  T.IconBrandWechat, T.IconBrandGoogle,
])

const phosphor = table([
  P.PhSquaresFour, P.PhShoppingCart, P.PhFilePlus, P.PhChatText, P.PhCube, P.PhGlobe, P.PhGear, P.PhSignIn, P.PhSignOut,
  P.PhLightning, P.PhShield, P.PhChartBar, P.PhRobot, P.PhPlugs, P.PhMagnifyingGlass, P.PhBell, P.PhMoon, P.PhSun, P.PhList, P.PhUser, P.PhUsers, P.PhPlus, P.PhPaperPlaneTilt,
  P.PhPaperclip, P.PhCopy, P.PhCheck, P.PhTrash, P.PhPencil, P.PhDownloadSimple, P.PhSliders, P.PhCalendar, P.PhEnvelope, P.PhLock, P.PhEye, P.PhEyeSlash,
  P.PhGithubLogo, P.PhCaretDown, P.PhCaretLeft, P.PhCaretRight, P.PhCaretUp, P.PhX, P.PhTray, P.PhInfo, P.PhWarningCircle, P.PhStar,
  P.PhUploadSimple, P.PhFunnel, P.PhArrowsClockwise, P.PhDotsThree, P.PhSparkle, P.PhCircleNotch, P.PhImage, P.PhArrowUp, P.PhArrowDown, P.PhArrowRight,
  P.PhHouse, P.PhTag, P.PhClock, P.PhLink, P.PhListBullets, P.PhHeart, P.PhMicrophone, P.PhQuestion, P.PhChatCircle, P.PhWrench, P.PhXLogo, P.PhLinkedinLogo,
  P.PhYoutubeLogo, P.PhCreditCard, P.PhTranslate, P.PhQrCode, P.PhDeviceMobile, P.PhRocket, P.PhTrendUp, P.PhTrendDown, P.PhSidebar,
  P.PhWechatLogo, P.PhGoogleLogo,
])

const heroicons = table([
  H.Squares2X2Icon, H.ShoppingCartIcon, H.DocumentPlusIcon, H.ChatBubbleLeftIcon, H.CubeIcon, H.GlobeAltIcon, H.Cog6ToothIcon, H.ArrowRightOnRectangleIcon, H.ArrowLeftOnRectangleIcon,
  H.BoltIcon, H.ShieldCheckIcon, H.ChartBarIcon, H.CpuChipIcon, H.PuzzlePieceIcon, H.MagnifyingGlassIcon, H.BellIcon, H.MoonIcon, H.SunIcon, H.Bars3Icon, H.UserIcon, H.UsersIcon, H.PlusIcon, H.PaperAirplaneIcon,
  H.PaperClipIcon, H.ClipboardIcon, H.CheckIcon, H.TrashIcon, H.PencilIcon, H.ArrowDownTrayIcon, H.AdjustmentsHorizontalIcon, H.CalendarDaysIcon, H.EnvelopeIcon, H.LockClosedIcon, H.EyeIcon, H.EyeSlashIcon,
  H.CodeBracketIcon, H.ChevronDownIcon, H.ChevronLeftIcon, H.ChevronRightIcon, H.ChevronUpIcon, H.XMarkIcon, H.InboxIcon, H.InformationCircleIcon, H.ExclamationCircleIcon, H.StarIcon,
  H.ArrowUpTrayIcon, H.FunnelIcon, H.ArrowPathIcon, H.EllipsisHorizontalIcon, H.SparklesIcon, H.ArrowPathIcon, H.PhotoIcon, H.ArrowUpIcon, H.ArrowDownIcon, H.ArrowRightIcon,
  H.HomeIcon, H.TagIcon, H.ClockIcon, H.LinkIcon, H.ListBulletIcon, H.HeartIcon, H.MicrophoneIcon, H.QuestionMarkCircleIcon, H.ChatBubbleOvalLeftIcon, H.WrenchIcon, H.GlobeAltIcon, H.LinkIcon,
  H.PlayIcon, H.CreditCardIcon, H.LanguageIcon, H.QrCodeIcon, H.DevicePhoneMobileIcon, H.RocketLaunchIcon, H.ArrowTrendingUpIcon, H.ArrowTrendingDownIcon, H.Bars3BottomLeftIcon,
  H.ChatBubbleOvalLeftIcon, H.GlobeAltIcon,
])

const families: Record<Family, Table> = { lucide, tabler, phosphor, heroicons }

export function iconFamily(): Family {
  if (typeof window === "undefined") return "lucide"
  const value = new URLSearchParams(window.location.search).get("icons")
  return value === "tabler" || value === "phosphor" || value === "heroicons" ? value : "lucide"
}

export function iconComponent(name: string): Component {
  const map = families[iconFamily()]
  return map[name] ?? map["circle-help"]!
}

export const Icon = defineComponent({
  name: "GalleryIcon",
  props: { name: { type: String, required: true }, size: { type: Number, default: 18 } },
  setup(props) {
    return () => h(iconComponent(props.name), { "aria-hidden": "true", width: props.size, height: props.size, size: props.size, style: { width: `${props.size}px`, height: `${props.size}px`, flexShrink: 0 } })
  },
})

// Renders a naive-ui `icon` slot / prop render function.
export function renderIcon(name: string, size = 18) {
  return () => h(Icon, { name, size })
}
