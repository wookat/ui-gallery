import type { Component } from "vue"
import {
  ArrowRight, BarChart3, Bell, Boxes, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Copy, Download,
  Eye, EyeOff, FilePlus2, Filter, Globe2, Home, LayoutDashboard, Link as LucideLinkIcon, LoaderCircle, LockKeyhole, LogIn, LogOut,
  Mail, Menu, MessageSquare, Moon, MoreHorizontal, Paperclip, Pencil, Plus, Search, Send, Settings, Shield, ShoppingCart,
  SlidersHorizontal, Sparkles, Star, Sun, Trash2, Upload, User, X, Zap,
} from "lucide-vue-next"
import {
  IconAdjustmentsHorizontal, IconArrowRight, IconBell, IconBolt, IconBox, IconCalendar, IconChartBar, IconCheck, IconMenu2,
  IconChevronDown, IconChevronLeft, IconChevronRight, IconClock, IconCopy, IconDots, IconDownload, IconEye, IconEyeOff,
  IconFilePlus, IconFilter, IconHelpCircle, IconHome, IconLayoutDashboard, IconLink, IconLoader2, IconLock, IconLogin,
  IconLogout, IconMail, IconMessage, IconMoon, IconPencil, IconPaperclip, IconPlus, IconSearch, IconSend, IconSettings,
  IconShield, IconShoppingCart, IconSparkles, IconStar, IconSun, IconTrash, IconUpload, IconUser, IconWorld, IconX,
} from "@tabler/icons-vue"
import {
  PhArrowRight, PhBell, PhCalendar, PhCaretDown, PhCaretLeft, PhCaretRight, PhChartBar, PhChatCircle, PhCheck,
  PhCircleNotch, PhClock, PhCopy, PhCube, PhDotsThree, PhDownloadSimple, PhEnvelope, PhEye, PhEyeSlash, PhFilePlus,
  PhFunnel, PhGear, PhGlobe, PhHouse, PhLightning, PhLink, PhList, PhLock, PhMagnifyingGlass, PhMoon, PhPaperclip,
  PhPaperPlaneRight, PhPencilSimple, PhPlus, PhQuestion, PhShield, PhShoppingCart, PhSignIn, PhSignOut, PhSliders,
  PhSparkle, PhStar, PhSun, PhTrash, PhUploadSimple, PhUser, PhX, PhSquaresFour,
} from "@phosphor-icons/vue"
import {
  AdjustmentsHorizontalIcon, ArrowDownTrayIcon, ArrowLeftOnRectangleIcon, ArrowPathIcon, ArrowRightIcon,
  ArrowRightOnRectangleIcon, ArrowUpTrayIcon, Bars3Icon, BellIcon, BoltIcon, CalendarDaysIcon, ChartBarIcon,
  CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChatBubbleLeftIcon, Cog6ToothIcon, CubeIcon,
  DocumentDuplicateIcon, DocumentPlusIcon, EllipsisHorizontalIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon, GlobeAltIcon,
  FunnelIcon, HomeIcon, LinkIcon as HeroLinkIcon, LockClosedIcon, MagnifyingGlassIcon, MoonIcon, PaperAirplaneIcon, PaperClipIcon,
  PencilIcon, PlusIcon, QuestionMarkCircleIcon, ShieldCheckIcon, ShoppingCartIcon, SparklesIcon, StarIcon, SunIcon,
  Squares2X2Icon, TrashIcon, UserIcon, XMarkIcon, ClockIcon,
} from "@heroicons/vue/24/outline"

export type IconName = string
export type IconSet = "native" | "lucide" | "tabler" | "phosphor" | "heroicons"

const nativeMap: Record<string, string> = {
  search: "search", bell: "bell", menu: "wap-nav", sun: "sun-o", moon: "underway", "chevron-down": "arrow-down",
  "chevron-right": "arrow", "chevron-left": "arrow-left", plus: "plus", trash: "delete-o", edit: "edit", eye: "eye-o",
  "eye-off": "closed-eye", mail: "envelop-o", lock: "lock", user: "contact", logout: "logout", "log-in": "logistics",
  settings: "setting-o", download: "down-arrow", filter: "filter-o", send: "guide-o", paperclip: "clip", copy: "description",
  check: "success", x: "cross", "layout-dashboard": "apps-o", "shopping-cart": "shopping-cart-o", "file-plus": "description",
  "message-square": "chat-o", boxes: "apps-o", globe: "location-o", zap: "flash", shield: "shield-o", star: "star-o",
  home: "wap-home-o", clock: "clock-o", more: "ellipsis", calendar: "calendar-o", link: "link", loader: "replay",
  sparkles: "gem-o", "arrow-right": "arrow", info: "info-o", upload: "upgrade", sliders: "setting-o", "bar-chart": "bar-chart-o",
}

const lucide: Record<string, Component> = {
  search: Search, bell: Bell, menu: Menu, sun: Sun, moon: Moon, "chevron-down": ChevronDown, "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft, plus: Plus, trash: Trash2, edit: Pencil, eye: Eye, "eye-off": EyeOff, mail: Mail, lock: LockKeyhole,
  user: User, logout: LogOut, "log-in": LogIn, settings: Settings, download: Download, filter: Filter, send: Send, paperclip: Paperclip,
  copy: Copy, check: Check, x: X, "layout-dashboard": LayoutDashboard, "shopping-cart": ShoppingCart, "file-plus": FilePlus2,
  "message-square": MessageSquare, boxes: Boxes, globe: Globe2, zap: Zap, shield: Shield, star: Star, home: Home, clock: Clock3,
  more: MoreHorizontal, calendar: CalendarDays, link: LucideLinkIcon, loader: LoaderCircle, sparkles: Sparkles, "arrow-right": ArrowRight,
  info: CircleHelp, upload: Upload, sliders: SlidersHorizontal, "bar-chart": BarChart3,
}
const tabler: Record<string, Component> = {
  search: IconSearch, bell: IconBell, menu: IconMenu2, sun: IconSun, moon: IconMoon, "chevron-down": IconChevronDown,
  "chevron-right": IconChevronRight, "chevron-left": IconChevronLeft, plus: IconPlus, trash: IconTrash, edit: IconPencil,
  eye: IconEye, "eye-off": IconEyeOff, mail: IconMail, lock: IconLock, user: IconUser, logout: IconLogout, "log-in": IconLogin,
  settings: IconSettings, download: IconDownload, filter: IconFilter, send: IconSend, paperclip: IconPaperclip, copy: IconCopy,
  check: IconCheck, x: IconX, "layout-dashboard": IconLayoutDashboard, "shopping-cart": IconShoppingCart, "file-plus": IconFilePlus,
  "message-square": IconMessage, boxes: IconBox, globe: IconWorld, zap: IconBolt, shield: IconShield, star: IconStar,
  home: IconHome, clock: IconClock, more: IconDots, calendar: IconCalendar, link: IconLink, loader: IconLoader2, sparkles: IconSparkles,
  "arrow-right": IconArrowRight, info: IconHelpCircle, upload: IconUpload, sliders: IconAdjustmentsHorizontal, "bar-chart": IconChartBar,
}
const phosphor: Record<string, Component> = {
  search: PhMagnifyingGlass, bell: PhBell, menu: PhList, sun: PhSun, moon: PhMoon, "chevron-down": PhCaretDown,
  "chevron-right": PhCaretRight, "chevron-left": PhCaretLeft, plus: PhPlus, trash: PhTrash, edit: PhPencilSimple, eye: PhEye,
  "eye-off": PhEyeSlash, mail: PhEnvelope, lock: PhLock, user: PhUser, logout: PhSignOut, "log-in": PhSignIn, settings: PhGear,
  download: PhDownloadSimple, filter: PhFunnel, send: PhPaperPlaneRight, paperclip: PhPaperclip, copy: PhCopy, check: PhCheck,
  x: PhX, "layout-dashboard": PhSquaresFour, "shopping-cart": PhShoppingCart, "file-plus": PhFilePlus, "message-square": PhChatCircle,
  boxes: PhCube, globe: PhGlobe, zap: PhLightning, shield: PhShield, star: PhStar, home: PhHouse, clock: PhClock, more: PhDotsThree,
  calendar: PhCalendar, link: PhLink, loader: PhCircleNotch, sparkles: PhSparkle, "arrow-right": PhArrowRight, info: PhQuestion,
  upload: PhUploadSimple, sliders: PhSliders, "bar-chart": PhChartBar,
}
const heroicons: Record<string, Component> = {
  search: MagnifyingGlassIcon, bell: BellIcon, menu: Bars3Icon, sun: SunIcon, moon: MoonIcon, "chevron-down": ChevronDownIcon,
  "chevron-right": ChevronRightIcon, "chevron-left": ChevronLeftIcon, plus: PlusIcon, trash: TrashIcon, edit: PencilIcon,
  eye: EyeIcon, "eye-off": EyeSlashIcon, mail: EnvelopeIcon, lock: LockClosedIcon, user: UserIcon, logout: ArrowRightOnRectangleIcon,
  "log-in": ArrowLeftOnRectangleIcon, settings: Cog6ToothIcon, download: ArrowDownTrayIcon, filter: FunnelIcon, send: PaperAirplaneIcon,
  paperclip: PaperClipIcon, copy: DocumentDuplicateIcon, check: CheckIcon, x: XMarkIcon, "layout-dashboard": Squares2X2Icon,
  "shopping-cart": ShoppingCartIcon, "file-plus": DocumentPlusIcon, "message-square": ChatBubbleLeftIcon, boxes: CubeIcon,
  globe: GlobeAltIcon, zap: BoltIcon, shield: ShieldCheckIcon, star: StarIcon, home: HomeIcon, clock: ClockIcon,
  more: EllipsisHorizontalIcon, calendar: CalendarDaysIcon, link: HeroLinkIcon, loader: ArrowPathIcon, sparkles: SparklesIcon,
  "arrow-right": ArrowRightIcon, info: QuestionMarkCircleIcon, upload: ArrowUpTrayIcon, sliders: AdjustmentsHorizontalIcon,
  "bar-chart": ChartBarIcon,
}

const sets: Record<Exclude<IconSet, "native" | "lucide">, Record<string, Component>> = { tabler, phosphor, heroicons }

export function iconComponent(set: IconSet, name: string): Component | null {
  if (set === "native") return null
  if (set === "lucide") return lucide[name] ?? null
  return sets[set][name] ?? null
}

export function nativeIcon(name: string): string {
  return nativeMap[name] ?? name
}
