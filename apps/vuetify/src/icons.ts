// Icon adapter: `?icons=native|lucide|tabler|phosphor|heroicons` (also accepts `?icon=`).
// `native` uses Vuetify's bundled Material Design Icons (@mdi/font); the other sets
// are rendered through their official Vue packages.
import type { IconValue } from "vuetify/lib/composables/icons.mjs"
import { aliases as mdiAliases } from "vuetify/iconsets/mdi"
import * as L from "lucide-vue-next"
import * as T from "@tabler/icons-vue"
import * as P from "@phosphor-icons/vue"
import * as H from "@heroicons/vue/24/outline"

export type IconSet = "native" | "lucide" | "tabler" | "phosphor" | "heroicons"
export const ICON_SETS: IconSet[] = ["native", "lucide", "tabler", "phosphor", "heroicons"]

type Entry = [mdi: string, lucide: unknown, tabler: unknown, phosphor: unknown, heroicons: unknown]

export const icons = {
  activity: ["mdi-pulse", L.Activity, T.IconActivity, P.PhPulse, H.BoltIcon],
  "alert-circle": ["mdi-alert-circle-outline", L.CircleAlert, T.IconAlertCircle, P.PhWarningCircle, H.ExclamationCircleIcon],
  "alert-triangle": ["mdi-alert-outline", L.TriangleAlert, T.IconAlertTriangle, P.PhWarning, H.ExclamationTriangleIcon],
  archive: ["mdi-archive-outline", L.Archive, T.IconArchive, P.PhArchive, H.ArchiveBoxIcon],
  "arrow-down": ["mdi-arrow-down", L.ArrowDown, T.IconArrowDown, P.PhArrowDown, H.ArrowDownIcon],
  "arrow-left": ["mdi-arrow-left", L.ArrowLeft, T.IconArrowLeft, P.PhArrowLeft, H.ArrowLeftIcon],
  "arrow-right": ["mdi-arrow-right", L.ArrowRight, T.IconArrowRight, P.PhArrowRight, H.ArrowRightIcon],
  "arrow-up": ["mdi-arrow-up", L.ArrowUp, T.IconArrowUp, P.PhArrowUp, H.ArrowUpIcon],
  "chevrons-left": ["mdi-page-first", L.ChevronsLeft, T.IconChevronsLeft, P.PhCaretDoubleLeft, H.ChevronDoubleLeftIcon],
  "chevrons-right": ["mdi-page-last", L.ChevronsRight, T.IconChevronsRight, P.PhCaretDoubleRight, H.ChevronDoubleRightIcon],
  "chevrons-up-down": ["mdi-unfold-more-horizontal", L.ChevronsUpDown, T.IconArrowsUpDown, P.PhArrowsVertical, H.ChevronUpDownIcon],
  "bar-chart": ["mdi-chart-bar", L.ChartBar, T.IconChartBar, P.PhChartBar, H.ChartBarIcon],
  bell: ["mdi-bell-outline", L.Bell, T.IconBell, P.PhBell, H.BellIcon],
  bot: ["mdi-robot-outline", L.Bot, T.IconRobot, P.PhRobot, H.CpuChipIcon],
  boxes: ["mdi-package-variant-closed", L.Boxes, T.IconBox, P.PhCube, H.CubeIcon],
  calendar: ["mdi-calendar-month-outline", L.CalendarDays, T.IconCalendar, P.PhCalendar, H.CalendarDaysIcon],
  check: ["mdi-check", L.Check, T.IconCheck, P.PhCheck, H.CheckIcon],
  "check-circle": ["mdi-check-circle-outline", L.CircleCheck, T.IconCircleCheck, P.PhCheckCircle, H.CheckCircleIcon],
  circle: ["mdi-circle-outline", L.Circle, T.IconCircle, P.PhCircle, H.EllipsisHorizontalCircleIcon],
  "circle-dot": ["mdi-circle-medium", L.CircleDot, T.IconCircleDot, P.PhDot, H.RadioIcon],
  "chevron-down": ["mdi-chevron-down", L.ChevronDown, T.IconChevronDown, P.PhCaretDown, H.ChevronDownIcon],
  "chevron-left": ["mdi-chevron-left", L.ChevronLeft, T.IconChevronLeft, P.PhCaretLeft, H.ChevronLeftIcon],
  "chevron-right": ["mdi-chevron-right", L.ChevronRight, T.IconChevronRight, P.PhCaretRight, H.ChevronRightIcon],
  "chevron-up": ["mdi-chevron-up", L.ChevronUp, T.IconChevronUp, P.PhCaretUp, H.ChevronUpIcon],
  "circle-help": ["mdi-help-circle-outline", L.CircleHelp, T.IconHelpCircle, P.PhQuestion, H.QuestionMarkCircleIcon],
  clipboard: ["mdi-clipboard-outline", L.Clipboard, T.IconClipboard, P.PhClipboard, H.ClipboardIcon],
  clock: ["mdi-clock-outline", L.Clock3, T.IconClock, P.PhClock, H.ClockIcon],
  cloud: ["mdi-cloud-outline", L.Cloud, T.IconCloud, P.PhCloud, H.CloudIcon],
  code: ["mdi-code-tags", L.Code, T.IconCode, P.PhCode, H.CodeBracketIcon],
  copy: ["mdi-content-copy", L.Copy, T.IconCopy, P.PhCopy, H.DocumentDuplicateIcon],
  "credit-card": ["mdi-credit-card-outline", L.CreditCard, T.IconCreditCard, P.PhCreditCard, H.CreditCardIcon],
  database: ["mdi-database-outline", L.Database, T.IconDatabase, P.PhDatabase, H.CircleStackIcon],
  download: ["mdi-download-outline", L.Download, T.IconDownload, P.PhDownloadSimple, H.ArrowDownTrayIcon],
  edit: ["mdi-pencil-outline", L.Pencil, T.IconPencil, P.PhPencil, H.PencilIcon],
  ellipsis: ["mdi-dots-horizontal", L.Ellipsis, T.IconDots, P.PhDotsThree, H.EllipsisHorizontalIcon],
  eye: ["mdi-eye-outline", L.Eye, T.IconEye, P.PhEye, H.EyeIcon],
  "eye-off": ["mdi-eye-off-outline", L.EyeOff, T.IconEyeOff, P.PhEyeSlash, H.EyeSlashIcon],
  "file-plus": ["mdi-file-plus-outline", L.FilePlus, T.IconFilePlus, P.PhFilePlus, H.FolderPlusIcon],
  filter: ["mdi-filter-variant", L.Filter, T.IconFilter, P.PhFunnel, H.FunnelIcon],
  file: ["mdi-file-outline", L.File, T.IconFile, P.PhFile, H.DocumentIcon],
  github: ["mdi-github", L.Github, T.IconBrandGithub, P.PhGithubLogo, H.CodeBracketSquareIcon],
  globe: ["mdi-web", L.Globe, T.IconWorld, P.PhGlobe, H.GlobeAltIcon],
  google: ["mdi-google", L.Chrome, T.IconBrandGoogle, P.PhGoogleLogo, H.GlobeAltIcon],
  grid: ["mdi-view-grid-outline", L.Grid2x2, T.IconLayoutGrid, P.PhGridFour, H.Squares2X2Icon],
  heart: ["mdi-heart-outline", L.Heart, T.IconHeart, P.PhHeart, H.HeartIcon],
  home: ["mdi-home-outline", L.House, T.IconHome, P.PhHouse, H.HomeIcon],
  image: ["mdi-image-outline", L.Image, T.IconPhoto, P.PhImage, H.PhotoIcon],
  inbox: ["mdi-inbox-outline", L.Inbox, T.IconInbox, P.PhTray, H.InboxIcon],
  info: ["mdi-information-outline", L.Info, T.IconInfoCircle, P.PhInfo, H.InformationCircleIcon],
  languages: ["mdi-translate", L.Languages, T.IconLanguage, P.PhTranslate, H.LanguageIcon],
  layers: ["mdi-layers-outline", L.Layers, T.IconStack2, P.PhStack, H.Square3Stack3DIcon],
  "layout-dashboard": ["mdi-view-dashboard-outline", L.LayoutDashboard, T.IconLayoutDashboard, P.PhSquaresFour, H.RectangleGroupIcon],
  link: ["mdi-link-variant", L.Link2, T.IconLink, P.PhLink, H.LinkIcon],
  list: ["mdi-format-list-bulleted", L.List, T.IconList, P.PhList, H.ListBulletIcon],
  loader: ["mdi-loading", L.LoaderCircle, T.IconLoader2, P.PhCircleNotch, H.ArrowPathIcon],
  laptop: ["mdi-laptop", L.Laptop, T.IconDeviceLaptop, P.PhLaptop, H.ComputerDesktopIcon],
  lock: ["mdi-lock-outline", L.Lock, T.IconLock, P.PhLock, H.LockClosedIcon],
  "log-in": ["mdi-login", L.LogIn, T.IconLogin, P.PhSignIn, H.ArrowLeftOnRectangleIcon],
  "log-out": ["mdi-logout", L.LogOut, T.IconLogout, P.PhSignOut, H.ArrowRightOnRectangleIcon],
  mail: ["mdi-email-outline", L.Mail, T.IconMail, P.PhEnvelope, H.EnvelopeIcon],
  menu: ["mdi-menu", L.Menu, T.IconMenu2, P.PhListBullets, H.Bars3Icon],
  monitor: ["mdi-monitor", L.Monitor, T.IconDeviceDesktop, P.PhMonitor, H.ComputerDesktopIcon],
  "message-circle": ["mdi-message-outline", L.MessageCircle, T.IconMessageCircle, P.PhChatCircle, H.ChatBubbleLeftIcon],
  "message-square": ["mdi-message-text-outline", L.MessageSquare, T.IconMessage, P.PhChatText, H.ChatBubbleLeftRightIcon],
  mic: ["mdi-microphone-outline", L.Mic, T.IconMicrophone, P.PhMicrophone, H.MicrophoneIcon],
  minus: ["mdi-minus", L.Minus, T.IconMinus, P.PhMinus, H.MinusIcon],
  moon: ["mdi-weather-night", L.Moon, T.IconMoon, P.PhMoon, H.MoonIcon],
  palette: ["mdi-palette-outline", L.Palette, T.IconPalette, P.PhPalette, H.SwatchIcon],
  paperclip: ["mdi-paperclip", L.Paperclip, T.IconPaperclip, P.PhPaperclip, H.PaperClipIcon],
  pipette: ["mdi-eyedropper", L.Pipette, T.IconColorPicker, P.PhEyedropper, H.EyeDropperIcon],
  "pie-chart": ["mdi-chart-donut", L.PieChart, T.IconChartPie, P.PhChartPie, H.ChartPieIcon],
  play: ["mdi-play", L.Play, T.IconPlayerPlay, P.PhPlay, H.PlayIcon],
  plug: ["mdi-power-plug-outline", L.Plug, T.IconPlug, P.PhPlugs, H.PowerIcon],
  plus: ["mdi-plus", L.Plus, T.IconPlus, P.PhPlus, H.PlusIcon],
  refresh: ["mdi-refresh", L.RefreshCw, T.IconRefresh, P.PhArrowsClockwise, H.ArrowPathIcon],
  rocket: ["mdi-rocket-launch-outline", L.Rocket, T.IconRocket, P.PhRocket, H.RocketLaunchIcon],
  search: ["mdi-magnify", L.Search, T.IconSearch, P.PhMagnifyingGlass, H.MagnifyingGlassIcon],
  send: ["mdi-send-outline", L.Send, T.IconSend, P.PhPaperPlaneTilt, H.PaperAirplaneIcon],
  settings: ["mdi-cog-outline", L.Settings, T.IconSettings, P.PhGear, H.Cog6ToothIcon],
  shield: ["mdi-shield-outline", L.Shield, T.IconShield, P.PhShield, H.ShieldCheckIcon],
  "shopping-cart": ["mdi-cart-outline", L.ShoppingCart, T.IconShoppingCart, P.PhShoppingCart, H.ShoppingCartIcon],
  sliders: ["mdi-tune-variant", L.SlidersHorizontal, T.IconAdjustmentsHorizontal, P.PhSlidersHorizontal, H.AdjustmentsHorizontalIcon],
  smartphone: ["mdi-cellphone", L.Smartphone, T.IconDeviceMobile, P.PhDeviceMobile, H.DevicePhoneMobileIcon],
  square: ["mdi-checkbox-blank-outline", L.Square, T.IconSquare, P.PhSquare, H.Square2StackIcon],
  "square-check": ["mdi-checkbox-marked", L.SquareCheck, T.IconSquareCheck, P.PhCheckSquare, H.CheckIcon],
  "square-minus": ["mdi-minus-box", L.SquareMinus, T.IconSquareMinus, P.PhSquareHalf, H.MinusIcon],
  sparkles: ["mdi-creation-outline", L.Sparkles, T.IconSparkles, P.PhSparkle, H.SparklesIcon],
  star: ["mdi-star-outline", L.Star, T.IconStar, P.PhStar, H.StarIcon],
  "star-half": ["mdi-star-half-full", L.StarHalf, T.IconStarHalf, P.PhStarHalf, H.StarIcon],
  sun: ["mdi-white-balance-sunny", L.Sun, T.IconSun, P.PhSun, H.SunIcon],
  tag: ["mdi-tag-outline", L.Tag, T.IconTag, P.PhTag, H.TagIcon],
  terminal: ["mdi-console", L.Terminal, T.IconTerminal2, P.PhTerminal, H.CommandLineIcon],
  trash: ["mdi-delete-outline", L.Trash2, T.IconTrash, P.PhTrash, H.TrashIcon],
  "trending-down": ["mdi-trending-down", L.TrendingDown, T.IconTrendingDown, P.PhTrendDown, H.ArrowTrendingDownIcon],
  "trending-up": ["mdi-trending-up", L.TrendingUp, T.IconTrendingUp, P.PhTrendUp, H.ArrowTrendingUpIcon],
  upload: ["mdi-cloud-upload-outline", L.Upload, T.IconUpload, P.PhUploadSimple, H.CloudArrowUpIcon],
  user: ["mdi-account-outline", L.User, T.IconUser, P.PhUser, H.UserIcon],
  users: ["mdi-account-group-outline", L.Users, T.IconUsers, P.PhUsers, H.UserGroupIcon],
  wechat: ["mdi-wechat", L.MessageCircle, T.IconBrandWechat, P.PhWechatLogo, H.ChatBubbleLeftIcon],
  wrench: ["mdi-wrench-outline", L.Wrench, T.IconTool, P.PhWrench, H.WrenchIcon],
  x: ["mdi-close", L.X, T.IconX, P.PhX, H.XMarkIcon],
  "x-circle": ["mdi-close-circle", L.CircleX, T.IconCircleX, P.PhXCircle, H.XCircleIcon],
  zap: ["mdi-flash-outline", L.Zap, T.IconBolt, P.PhLightning, H.BoltIcon],
} satisfies Record<string, Entry>

export type IconName = keyof typeof icons
export const iconNames = Object.keys(icons) as IconName[]

export function currentIconSet(): IconSet {
  const params = new URLSearchParams(window.location.search)
  const value = params.get("icons") ?? params.get("icon")
  return (ICON_SETS as string[]).includes(value ?? "") ? (value as IconSet) : "native"
}

/** Resolve an icon name to something `<v-icon :icon>` accepts for the active set. */
export function resolveIcon(name: IconName, set: IconSet = currentIconSet()): IconValue {
  const entry: Entry = icons[name]
  switch (set) {
    case "lucide": return entry[1] as IconValue
    case "tabler": return entry[2] as IconValue
    case "phosphor": return entry[3] as IconValue
    case "heroicons": return entry[4] as IconValue
    default: return entry[0]
  }
}

export function buildAliases(set: IconSet): Record<string, IconValue> {
  const result = { ...mdiAliases } as Record<string, IconValue>
  if (set === "native") return result
  const replacements: Record<string, IconName> = {
    collapse: "chevron-up",
    complete: "check",
    cancel: "x-circle",
    delete: "x-circle",
    clear: "x-circle",
    error: "x-circle",
    close: "x",
    success: "check-circle",
    info: "info",
    warning: "alert-circle",
    prev: "chevron-left",
    next: "chevron-right",
    checkboxOn: "square-check",
    checkboxOff: "square",
    checkboxIndeterminate: "square-minus",
    delimiter: "circle",
    sortAsc: "arrow-up",
    sortDesc: "arrow-down",
    expand: "chevron-down",
    subgroup: "chevron-down",
    dropdown: "chevron-down",
    treeviewCollapse: "chevron-down",
    tableGroupCollapse: "chevron-down",
    treeviewExpand: "chevron-right",
    tableGroupExpand: "chevron-right",
    menu: "menu",
    radioOn: "circle-dot",
    radioOff: "circle",
    edit: "edit",
    ratingEmpty: "star",
    ratingFull: "star",
    ratingHalf: "star-half",
    loading: "loader",
    first: "chevrons-left",
    last: "chevrons-right",
    unfold: "chevrons-up-down",
    file: "paperclip",
    plus: "plus",
    minus: "minus",
    calendar: "calendar",
    eyeDropper: "pipette",
    upload: "upload",
    color: "palette",
    search: "search",
    arrowup: "arrow-up",
    arrowdown: "arrow-down",
    arrowleft: "arrow-left",
    arrowright: "arrow-right",
    play: "play",
  }
  for (const [alias, name] of Object.entries(replacements)) result[alias] = resolveIcon(name, set)
  return result
}
