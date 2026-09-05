import {
  Activity, AlertCircle, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BarChart3,
  Bell, Bot, Boxes, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  CircleHelp, Clipboard, Clock3, Copy, Download, Edit3, Ellipsis, Eye, EyeOff, FilePlus,
  Filter, Globe, Grid2X2, Heart, Home, LayoutDashboard, Link2, List, LoaderCircle, Lock,
  LogIn, LogOut, Menu, MessageCircle, MessageSquare, Mic, Minus, MoreHorizontal, Moon,
  Paperclip, Pencil, Play, Plus, Plug, RefreshCw, Search, Send, Settings, Shield,
  ShoppingCart, SlidersHorizontal, Sparkles, Star, Sun, Tag, Trash2, Upload, User, Users, X, Zap,
} from '@lucide/vue'
import {
  IconActivity, IconAlertCircle, IconArchive, IconArrowDown, IconArrowLeft, IconArrowRight,
  IconArrowUp, IconBell, IconBox, IconCalendar, IconChartBar, IconCheck, IconChevronDown,
  IconChevronLeft, IconChevronRight, IconChevronUp, IconInfoCircle, IconClipboard, IconClock,
  IconCopy, IconDownload, IconEdit, IconDots, IconFilePlus, IconFilter, IconGlobe, IconGrid3x3,
  IconHeart, IconHome, IconLayoutDashboard, IconLink, IconList, IconLoader2, IconLock, IconLogin,
  IconLogout, IconMenu2, IconMessage, IconMessageCircle, IconMicrophone, IconMinus, IconMoon,
  IconPaperclip, IconPencil, IconPlayerPlay, IconPlus, IconRefresh, IconSearch, IconSend,
  IconSettings, IconShield, IconShoppingCart, IconAdjustmentsHorizontal, IconSparkles, IconStar,
  IconSun, IconTag, IconTrash, IconUpload, IconUser, IconUsers, IconX, IconZzz,
} from '@tabler/icons-vue'
import {
  PhArchive, PhArrowDown, PhArrowLeft, PhArrowRight, PhArrowUp, PhBell, PhCube, PhCalendar,
  PhChartBar, PhCheck, PhCaretDown, PhCaretLeft, PhCaretRight, PhCaretUp, PhCheckCircle,
  PhClipboard, PhClock, PhCopy, PhDownloadSimple, PhDotsThree, PhFilePlus, PhFaders, PhGear,
  PhGlobe, PhGridFour, PhHeart, PhHouse, PhLink, PhList, PhLock, PhMagicWand, PhPower,
  PhChatCircle, PhChatText,
  PhMagnifyingGlass, PhMicrophone, PhMinus, PhMoon, PhPaperclip, PhPencil, PhPlay, PhPlus,
  PhPlugs, PhRepeat, PhPaperPlaneTilt, PhPulse, PhShield, PhShoppingCart, PhSlidersHorizontal,
  PhSparkle, PhStar, PhSun, PhTag, PhTrash, PhUploadSimple, PhUser, PhUsers, PhX, PhLightning,
} from '@phosphor-icons/vue'
import {
  ArrowDownIcon as HeroArrowDown, ArrowLeftIcon as HeroArrowLeft, ArrowRightIcon as HeroArrowRight,
  ArrowUpIcon as HeroArrowUp, BellIcon as HeroBell, CalendarDaysIcon as HeroCalendar,
  ChartBarIcon as HeroChart, CheckIcon as HeroCheck, ChevronDownIcon as HeroChevronDown,
  ChevronLeftIcon as HeroChevronLeft, ChevronRightIcon as HeroChevronRight, ChevronUpIcon as HeroChevronUp,
  ClipboardIcon as HeroClipboard, ClockIcon as HeroClock, CloudArrowUpIcon as HeroUpload,
  Cog6ToothIcon as HeroSettings, EllipsisHorizontalIcon as HeroDots, FolderPlusIcon as HeroFilePlus,
  FunnelIcon as HeroFilter, GlobeAltIcon as HeroGlobe, HomeIcon as HeroHome,
  InformationCircleIcon as HeroInfo, LinkIcon as HeroLink, ListBulletIcon as HeroList,
  LockClosedIcon as HeroLock, MagnifyingGlassIcon as HeroSearch,
  MicrophoneIcon as HeroMicrophone, MinusIcon as HeroMinus, MoonIcon as HeroMoon,
  PaperClipIcon as HeroPaperclip, PencilIcon as HeroPencil, PlayIcon as HeroPlay, PlusIcon as HeroPlus,
  RectangleGroupIcon as HeroBoxes,
  ShoppingCartIcon as HeroCart, SparklesIcon as HeroSparkles, StarIcon as HeroStar, SunIcon as HeroSun,
  TagIcon as HeroTag, TrashIcon as HeroTrash, UserIcon as HeroUser, UserGroupIcon as HeroUsers,
  XMarkIcon as HeroX,
} from '@heroicons/vue/24/outline'

export type IconComponent = any
export type IconProps = { size?: number | string; class?: string; strokeWidth?: number; weight?: string; color?: string }

export const lucide: Record<string, IconComponent> = {
  activity: Activity, 'alert-circle': AlertCircle, archive: Archive, 'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft, 'arrow-right': ArrowRight, 'arrow-up': ArrowUp, 'bar-chart': BarChart3,
  bell: Bell, bot: Bot, boxes: Boxes, calendar: CalendarDays, check: Check, 'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft, 'chevron-right': ChevronRight, 'chevron-up': ChevronUp,
  'circle-help': CircleHelp, clipboard: Clipboard, clock: Clock3, copy: Copy, download: Download,
  edit: Edit3, 'ellipsis-horizontal': Ellipsis, eye: Eye, 'eye-off': EyeOff, 'file-plus': FilePlus,
  filter: Filter, globe: Globe, grid: Grid2X2, heart: Heart, home: Home, 'layout-dashboard': LayoutDashboard,
  link: Link2, list: List, loader: LoaderCircle, lock: Lock, 'log-in': LogIn, 'log-out': LogOut,
  menu: Menu, 'message-circle': MessageCircle, 'message-square': MessageSquare, mic: Mic, minus: Minus,
  'more-horizontal': MoreHorizontal, moon: Moon, paperclip: Paperclip, pencil: Pencil, play: Play,
  plus: Plus, plug: Plug, refresh: RefreshCw, search: Search, send: Send, settings: Settings,
  shield: Shield, 'shopping-cart': ShoppingCart, sliders: SlidersHorizontal, sparkles: Sparkles,
  star: Star, sun: Sun, tag: Tag, trash: Trash2, upload: Upload, user: User, users: Users, x: X, zap: Zap,
}

export const tabler: Record<string, IconComponent> = {
  activity: IconActivity, 'alert-circle': IconAlertCircle, archive: IconArchive, 'arrow-down': IconArrowDown,
  'arrow-left': IconArrowLeft, 'arrow-right': IconArrowRight, 'arrow-up': IconArrowUp, 'bar-chart': IconChartBar,
  bell: IconBell, bot: IconZzz, boxes: IconBox, calendar: IconCalendar, check: IconCheck,
  'chevron-down': IconChevronDown, 'chevron-left': IconChevronLeft, 'chevron-right': IconChevronRight,
  'chevron-up': IconChevronUp, 'circle-help': IconInfoCircle, clipboard: IconClipboard, clock: IconClock,
  copy: IconCopy, download: IconDownload, edit: IconEdit, 'ellipsis-horizontal': IconDots, 'file-plus': IconFilePlus,
  filter: IconFilter, globe: IconGlobe, grid: IconGrid3x3, heart: IconHeart, home: IconHome,
  'layout-dashboard': IconLayoutDashboard, link: IconLink, list: IconList, loader: IconLoader2, lock: IconLock,
  'log-in': IconLogin, 'log-out': IconLogout, menu: IconMenu2, 'message-circle': IconMessageCircle,
  'message-square': IconMessage, mic: IconMicrophone, minus: IconMinus, 'more-horizontal': IconDots,
  moon: IconMoon, paperclip: IconPaperclip, pencil: IconPencil, play: IconPlayerPlay, plus: IconPlus,
  plug: IconLink, refresh: IconRefresh, search: IconSearch, send: IconSend, settings: IconSettings,
  shield: IconShield, 'shopping-cart': IconShoppingCart, sliders: IconAdjustmentsHorizontal,
  sparkles: IconSparkles, star: IconStar, sun: IconSun, tag: IconTag, trash: IconTrash, upload: IconUpload,
  user: IconUser, users: IconUsers, x: IconX, zap: IconZzz,
}

export const phosphor: Record<string, IconComponent> = {
  activity: PhPulse, 'alert-circle': PhCheckCircle, archive: PhArchive, 'arrow-down': PhArrowDown,
  'arrow-left': PhArrowLeft, 'arrow-right': PhArrowRight, 'arrow-up': PhArrowUp, 'bar-chart': PhChartBar,
  bell: PhBell, bot: PhMagicWand, boxes: PhCube, calendar: PhCalendar, check: PhCheck,
  'chevron-down': PhCaretDown, 'chevron-left': PhCaretLeft, 'chevron-right': PhCaretRight, 'chevron-up': PhCaretUp,
  'circle-help': PhCheckCircle, clipboard: PhClipboard, clock: PhClock, copy: PhCopy, download: PhDownloadSimple,
  edit: PhPencil, 'ellipsis-horizontal': PhDotsThree, 'file-plus': PhFilePlus, filter: PhFaders,
  globe: PhGlobe, grid: PhGridFour, heart: PhHeart, home: PhHouse, 'layout-dashboard': PhGridFour, link: PhLink,
  list: PhList, loader: PhRepeat, lock: PhLock, 'log-in': PhPower, 'log-out': PhPower, menu: PhList,
  'message-circle': PhChatCircle, 'message-square': PhChatText, mic: PhMicrophone, minus: PhMinus,
  'more-horizontal': PhDotsThree, moon: PhMoon, paperclip: PhPaperclip, pencil: PhPencil, play: PhPlay,
  plus: PhPlus, plug: PhPlugs, refresh: PhRepeat, search: PhMagnifyingGlass, send: PhPaperPlaneTilt,
  settings: PhGear, shield: PhShield, 'shopping-cart': PhShoppingCart, sliders: PhSlidersHorizontal,
  sparkles: PhSparkle, star: PhStar, sun: PhSun, tag: PhTag, trash: PhTrash, upload: PhUploadSimple,
  user: PhUser, users: PhUsers, x: PhX, zap: PhLightning,
}

export const heroicons: Record<string, IconComponent> = {
  activity: HeroChart, 'alert-circle': HeroInfo, archive: HeroList, 'arrow-down': HeroArrowDown,
  'arrow-left': HeroArrowLeft, 'arrow-right': HeroArrowRight, 'arrow-up': HeroArrowUp, 'bar-chart': HeroChart,
  bell: HeroBell, bot: HeroSparkles, boxes: HeroBoxes, calendar: HeroCalendar, check: HeroCheck,
  'chevron-down': HeroChevronDown, 'chevron-left': HeroChevronLeft, 'chevron-right': HeroChevronRight,
  'chevron-up': HeroChevronUp, 'circle-help': HeroInfo, clipboard: HeroClipboard, clock: HeroClock,
  download: HeroUpload, edit: HeroPencil, 'ellipsis-horizontal': HeroDots, 'file-plus': HeroFilePlus, filter: HeroFilter,
  globe: HeroGlobe, grid: HeroBoxes, home: HeroHome, 'layout-dashboard': HeroBoxes, link: HeroLink, list: HeroList,
  loader: HeroSparkles, lock: HeroLock, menu: HeroList, mic: HeroMicrophone, minus: HeroMinus, moon: HeroMoon,
  paperclip: HeroPaperclip, pencil: HeroPencil, play: HeroPlay, plus: HeroPlus, search: HeroSearch,
  settings: HeroSettings, shield: HeroInfo, 'shopping-cart': HeroCart, sparkles: HeroSparkles, star: HeroStar,
  sun: HeroSun, tag: HeroTag, trash: HeroTrash, upload: HeroUpload, user: HeroUser, users: HeroUsers, x: HeroX,
}

export function getIcon(name: string, family = 'lucide') {
  const selected = family === 'tabler' ? tabler : family === 'phosphor' ? phosphor : family === 'heroicons' ? heroicons : lucide
  return selected[name] ?? lucide[name] ?? Sparkles
}
