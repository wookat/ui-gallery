// Icon adapter for Svelte: maps the shared gallery icon names onto four icon families.
// The family is selected with `?icons=` (spec) or `?icon=` (alias); default is lucide,
// which is also the family recommended by Skeleton's own documentation.
import type { Component, SvelteComponent } from "svelte"

import LucideActivity from "@lucide/svelte/icons/activity"
import LucideCircleAlert from "@lucide/svelte/icons/circle-alert"
import LucideArchive from "@lucide/svelte/icons/archive"
import LucideArrowDown from "@lucide/svelte/icons/arrow-down"
import LucideArrowLeft from "@lucide/svelte/icons/arrow-left"
import LucideArrowRight from "@lucide/svelte/icons/arrow-right"
import LucideArrowUp from "@lucide/svelte/icons/arrow-up"
import LucideChartBar from "@lucide/svelte/icons/chart-bar"
import LucideBell from "@lucide/svelte/icons/bell"
import LucideBot from "@lucide/svelte/icons/bot"
import LucideBoxes from "@lucide/svelte/icons/boxes"
import LucideCalendar from "@lucide/svelte/icons/calendar"
import LucideCheck from "@lucide/svelte/icons/check"
import LucideChevronDown from "@lucide/svelte/icons/chevron-down"
import LucideChevronLeft from "@lucide/svelte/icons/chevron-left"
import LucideChevronRight from "@lucide/svelte/icons/chevron-right"
import LucideChevronUp from "@lucide/svelte/icons/chevron-up"
import LucideCircleHelp from "@lucide/svelte/icons/circle-help"
import LucideClipboard from "@lucide/svelte/icons/clipboard"
import LucideClock from "@lucide/svelte/icons/clock"
import LucideCopy from "@lucide/svelte/icons/copy"
import LucideDownload from "@lucide/svelte/icons/download"
import LucideEllipsis from "@lucide/svelte/icons/ellipsis"
import LucideFilePlus from "@lucide/svelte/icons/file-plus"
import LucideFilter from "@lucide/svelte/icons/filter"
import LucideGlobe from "@lucide/svelte/icons/globe"
import LucideGrid from "@lucide/svelte/icons/layout-grid"
import LucideHeart from "@lucide/svelte/icons/heart"
import LucideHouse from "@lucide/svelte/icons/house"
import LucideInbox from "@lucide/svelte/icons/inbox"
import LucideInfo from "@lucide/svelte/icons/info"
import LucideLayoutDashboard from "@lucide/svelte/icons/layout-dashboard"
import LucideLink from "@lucide/svelte/icons/link"
import LucideList from "@lucide/svelte/icons/list"
import LucideLoader from "@lucide/svelte/icons/loader-circle"
import LucideLock from "@lucide/svelte/icons/lock"
import LucideLogIn from "@lucide/svelte/icons/log-in"
import LucideLogOut from "@lucide/svelte/icons/log-out"
import LucideMenu from "@lucide/svelte/icons/menu"
import LucideMessageCircle from "@lucide/svelte/icons/message-circle"
import LucideMessageSquare from "@lucide/svelte/icons/message-square"
import LucideMic from "@lucide/svelte/icons/mic"
import LucideMinus from "@lucide/svelte/icons/minus"
import LucideMoon from "@lucide/svelte/icons/moon"
import LucidePaperclip from "@lucide/svelte/icons/paperclip"
import LucidePencil from "@lucide/svelte/icons/pencil"
import LucidePlay from "@lucide/svelte/icons/play"
import LucidePlug from "@lucide/svelte/icons/plug"
import LucidePlus from "@lucide/svelte/icons/plus"
import LucideRefresh from "@lucide/svelte/icons/refresh-cw"
import LucideSearch from "@lucide/svelte/icons/search"
import LucideSend from "@lucide/svelte/icons/send"
import LucideSettings from "@lucide/svelte/icons/settings"
import LucideShield from "@lucide/svelte/icons/shield"
import LucideShoppingCart from "@lucide/svelte/icons/shopping-cart"
import LucideSliders from "@lucide/svelte/icons/sliders-horizontal"
import LucideSparkles from "@lucide/svelte/icons/sparkles"
import LucideStar from "@lucide/svelte/icons/star"
import LucideSun from "@lucide/svelte/icons/sun"
import LucideTag from "@lucide/svelte/icons/tag"
import LucideTrash from "@lucide/svelte/icons/trash-2"
import LucideUpload from "@lucide/svelte/icons/upload"
import LucideUser from "@lucide/svelte/icons/user"
import LucideUsers from "@lucide/svelte/icons/users"
import LucideX from "@lucide/svelte/icons/x"
import LucideZap from "@lucide/svelte/icons/zap"
import LucideEye from "@lucide/svelte/icons/eye"
import LucideEyeOff from "@lucide/svelte/icons/eye-off"
import LucideMail from "@lucide/svelte/icons/mail"
import LucideCreditCard from "@lucide/svelte/icons/credit-card"
import LucideFolder from "@lucide/svelte/icons/folder"
import LucideFile from "@lucide/svelte/icons/file"
import LucideCircleCheck from "@lucide/svelte/icons/circle-check"
import LucideTriangleAlert from "@lucide/svelte/icons/triangle-alert"
import LucideChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down"
import LucideArrowUpDown from "@lucide/svelte/icons/arrow-up-down"
import LucideSmartphone from "@lucide/svelte/icons/smartphone"
import LucideBold from "@lucide/svelte/icons/bold"
import LucideItalic from "@lucide/svelte/icons/italic"
import LucideUnderline from "@lucide/svelte/icons/underline"
import LucideImage from "@lucide/svelte/icons/image"
import LucideMaximize from "@lucide/svelte/icons/maximize-2"
import LucideWrench from "@lucide/svelte/icons/wrench"

import TablerActivity from "@tabler/icons-svelte/icons/activity"
import TablerAlertCircle from "@tabler/icons-svelte/icons/alert-circle"
import TablerArchive from "@tabler/icons-svelte/icons/archive"
import TablerArrowDown from "@tabler/icons-svelte/icons/arrow-down"
import TablerArrowLeft from "@tabler/icons-svelte/icons/arrow-left"
import TablerArrowRight from "@tabler/icons-svelte/icons/arrow-right"
import TablerArrowUp from "@tabler/icons-svelte/icons/arrow-up"
import TablerChartBar from "@tabler/icons-svelte/icons/chart-bar"
import TablerBell from "@tabler/icons-svelte/icons/bell"
import TablerRobot from "@tabler/icons-svelte/icons/robot"
import TablerPackages from "@tabler/icons-svelte/icons/packages"
import TablerCalendar from "@tabler/icons-svelte/icons/calendar"
import TablerCheck from "@tabler/icons-svelte/icons/check"
import TablerChevronDown from "@tabler/icons-svelte/icons/chevron-down"
import TablerChevronLeft from "@tabler/icons-svelte/icons/chevron-left"
import TablerChevronRight from "@tabler/icons-svelte/icons/chevron-right"
import TablerChevronUp from "@tabler/icons-svelte/icons/chevron-up"
import TablerHelpCircle from "@tabler/icons-svelte/icons/help-circle"
import TablerClipboard from "@tabler/icons-svelte/icons/clipboard"
import TablerClock from "@tabler/icons-svelte/icons/clock"
import TablerCopy from "@tabler/icons-svelte/icons/copy"
import TablerDownload from "@tabler/icons-svelte/icons/download"
import TablerDots from "@tabler/icons-svelte/icons/dots"
import TablerFilePlus from "@tabler/icons-svelte/icons/file-plus"
import TablerFilter from "@tabler/icons-svelte/icons/filter"
import TablerWorld from "@tabler/icons-svelte/icons/world"
import TablerLayoutGrid from "@tabler/icons-svelte/icons/layout-grid"
import TablerHeart from "@tabler/icons-svelte/icons/heart"
import TablerHome from "@tabler/icons-svelte/icons/home"
import TablerInbox from "@tabler/icons-svelte/icons/inbox"
import TablerInfoCircle from "@tabler/icons-svelte/icons/info-circle"
import TablerLayoutDashboard from "@tabler/icons-svelte/icons/layout-dashboard"
import TablerLink from "@tabler/icons-svelte/icons/link"
import TablerList from "@tabler/icons-svelte/icons/list"
import TablerLoader from "@tabler/icons-svelte/icons/loader-2"
import TablerLock from "@tabler/icons-svelte/icons/lock"
import TablerLogin from "@tabler/icons-svelte/icons/login"
import TablerLogout from "@tabler/icons-svelte/icons/logout"
import TablerMenu from "@tabler/icons-svelte/icons/menu-2"
import TablerMessageCircle from "@tabler/icons-svelte/icons/message-circle"
import TablerMessage from "@tabler/icons-svelte/icons/message"
import TablerMicrophone from "@tabler/icons-svelte/icons/microphone"
import TablerMinus from "@tabler/icons-svelte/icons/minus"
import TablerMoon from "@tabler/icons-svelte/icons/moon"
import TablerPaperclip from "@tabler/icons-svelte/icons/paperclip"
import TablerPencil from "@tabler/icons-svelte/icons/pencil"
import TablerPlayerPlay from "@tabler/icons-svelte/icons/player-play"
import TablerPlug from "@tabler/icons-svelte/icons/plug"
import TablerPlus from "@tabler/icons-svelte/icons/plus"
import TablerRefresh from "@tabler/icons-svelte/icons/refresh"
import TablerSearch from "@tabler/icons-svelte/icons/search"
import TablerSend from "@tabler/icons-svelte/icons/send"
import TablerSettings from "@tabler/icons-svelte/icons/settings"
import TablerShield from "@tabler/icons-svelte/icons/shield"
import TablerShoppingCart from "@tabler/icons-svelte/icons/shopping-cart"
import TablerAdjustments from "@tabler/icons-svelte/icons/adjustments-horizontal"
import TablerSparkles from "@tabler/icons-svelte/icons/sparkles"
import TablerStar from "@tabler/icons-svelte/icons/star"
import TablerSun from "@tabler/icons-svelte/icons/sun"
import TablerTag from "@tabler/icons-svelte/icons/tag"
import TablerTrash from "@tabler/icons-svelte/icons/trash"
import TablerUpload from "@tabler/icons-svelte/icons/upload"
import TablerUser from "@tabler/icons-svelte/icons/user"
import TablerUsers from "@tabler/icons-svelte/icons/users"
import TablerX from "@tabler/icons-svelte/icons/x"
import TablerBolt from "@tabler/icons-svelte/icons/bolt"
import TablerEye from "@tabler/icons-svelte/icons/eye"
import TablerEyeOff from "@tabler/icons-svelte/icons/eye-off"
import TablerMail from "@tabler/icons-svelte/icons/mail"
import TablerCreditCard from "@tabler/icons-svelte/icons/credit-card"
import TablerFolder from "@tabler/icons-svelte/icons/folder"
import TablerFile from "@tabler/icons-svelte/icons/file"
import TablerCircleCheck from "@tabler/icons-svelte/icons/circle-check"
import TablerAlertTriangle from "@tabler/icons-svelte/icons/alert-triangle"
import TablerSelector from "@tabler/icons-svelte/icons/selector"
import TablerArrowsSort from "@tabler/icons-svelte/icons/arrows-sort"
import TablerDeviceMobile from "@tabler/icons-svelte/icons/device-mobile"
import TablerBold from "@tabler/icons-svelte/icons/bold"
import TablerItalic from "@tabler/icons-svelte/icons/italic"
import TablerUnderline from "@tabler/icons-svelte/icons/underline"
import TablerPhoto from "@tabler/icons-svelte/icons/photo"
import TablerMaximize from "@tabler/icons-svelte/icons/maximize"
import TablerTool from "@tabler/icons-svelte/icons/tool"

import PhPulse from "phosphor-svelte/lib/PulseIcon"
import PhWarningCircle from "phosphor-svelte/lib/WarningCircleIcon"
import PhArchive from "phosphor-svelte/lib/ArchiveIcon"
import PhArrowDown from "phosphor-svelte/lib/ArrowDownIcon"
import PhArrowLeft from "phosphor-svelte/lib/ArrowLeftIcon"
import PhArrowRight from "phosphor-svelte/lib/ArrowRightIcon"
import PhArrowUp from "phosphor-svelte/lib/ArrowUpIcon"
import PhChartBar from "phosphor-svelte/lib/ChartBarIcon"
import PhBell from "phosphor-svelte/lib/BellIcon"
import PhRobot from "phosphor-svelte/lib/RobotIcon"
import PhPackage from "phosphor-svelte/lib/PackageIcon"
import PhCalendar from "phosphor-svelte/lib/CalendarIcon"
import PhCheck from "phosphor-svelte/lib/CheckIcon"
import PhCaretDown from "phosphor-svelte/lib/CaretDownIcon"
import PhCaretLeft from "phosphor-svelte/lib/CaretLeftIcon"
import PhCaretRight from "phosphor-svelte/lib/CaretRightIcon"
import PhCaretUp from "phosphor-svelte/lib/CaretUpIcon"
import PhQuestion from "phosphor-svelte/lib/QuestionIcon"
import PhClipboard from "phosphor-svelte/lib/ClipboardIcon"
import PhClock from "phosphor-svelte/lib/ClockIcon"
import PhCopy from "phosphor-svelte/lib/CopyIcon"
import PhDownload from "phosphor-svelte/lib/DownloadSimpleIcon"
import PhDotsThree from "phosphor-svelte/lib/DotsThreeIcon"
import PhFilePlus from "phosphor-svelte/lib/FilePlusIcon"
import PhFunnel from "phosphor-svelte/lib/FunnelIcon"
import PhGlobe from "phosphor-svelte/lib/GlobeIcon"
import PhGridFour from "phosphor-svelte/lib/GridFourIcon"
import PhHeart from "phosphor-svelte/lib/HeartIcon"
import PhHouse from "phosphor-svelte/lib/HouseIcon"
import PhTray from "phosphor-svelte/lib/TrayIcon"
import PhInfo from "phosphor-svelte/lib/InfoIcon"
import PhSquaresFour from "phosphor-svelte/lib/SquaresFourIcon"
import PhLink from "phosphor-svelte/lib/LinkIcon"
import PhList from "phosphor-svelte/lib/ListIcon"
import PhSpinner from "phosphor-svelte/lib/SpinnerIcon"
import PhLock from "phosphor-svelte/lib/LockIcon"
import PhSignIn from "phosphor-svelte/lib/SignInIcon"
import PhSignOut from "phosphor-svelte/lib/SignOutIcon"
import PhChatCircle from "phosphor-svelte/lib/ChatCircleIcon"
import PhChatText from "phosphor-svelte/lib/ChatTextIcon"
import PhMicrophone from "phosphor-svelte/lib/MicrophoneIcon"
import PhMinus from "phosphor-svelte/lib/MinusIcon"
import PhMoon from "phosphor-svelte/lib/MoonIcon"
import PhPaperclip from "phosphor-svelte/lib/PaperclipIcon"
import PhPencil from "phosphor-svelte/lib/PencilSimpleIcon"
import PhPlay from "phosphor-svelte/lib/PlayIcon"
import PhPlugs from "phosphor-svelte/lib/PlugsIcon"
import PhPlus from "phosphor-svelte/lib/PlusIcon"
import PhArrowsClockwise from "phosphor-svelte/lib/ArrowsClockwiseIcon"
import PhMagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlassIcon"
import PhPaperPlaneTilt from "phosphor-svelte/lib/PaperPlaneTiltIcon"
import PhGear from "phosphor-svelte/lib/GearIcon"
import PhShield from "phosphor-svelte/lib/ShieldIcon"
import PhShoppingCart from "phosphor-svelte/lib/ShoppingCartIcon"
import PhSliders from "phosphor-svelte/lib/SlidersHorizontalIcon"
import PhSparkle from "phosphor-svelte/lib/SparkleIcon"
import PhStar from "phosphor-svelte/lib/StarIcon"
import PhSun from "phosphor-svelte/lib/SunIcon"
import PhTag from "phosphor-svelte/lib/TagIcon"
import PhTrash from "phosphor-svelte/lib/TrashIcon"
import PhUpload from "phosphor-svelte/lib/UploadSimpleIcon"
import PhUser from "phosphor-svelte/lib/UserIcon"
import PhUsers from "phosphor-svelte/lib/UsersIcon"
import PhX from "phosphor-svelte/lib/XIcon"
import PhLightning from "phosphor-svelte/lib/LightningIcon"
import PhEye from "phosphor-svelte/lib/EyeIcon"
import PhEyeSlash from "phosphor-svelte/lib/EyeSlashIcon"
import PhEnvelope from "phosphor-svelte/lib/EnvelopeIcon"
import PhCreditCard from "phosphor-svelte/lib/CreditCardIcon"
import PhFolder from "phosphor-svelte/lib/FolderIcon"
import PhFile from "phosphor-svelte/lib/FileIcon"
import PhCheckCircle from "phosphor-svelte/lib/CheckCircleIcon"
import PhWarning from "phosphor-svelte/lib/WarningIcon"
import PhCaretUpDown from "phosphor-svelte/lib/CaretUpDownIcon"
import PhArrowsDownUp from "phosphor-svelte/lib/ArrowsDownUpIcon"
import PhDeviceMobile from "phosphor-svelte/lib/DeviceMobileIcon"
import PhTextB from "phosphor-svelte/lib/TextBIcon"
import PhTextItalic from "phosphor-svelte/lib/TextItalicIcon"
import PhTextUnderline from "phosphor-svelte/lib/TextUnderlineIcon"
import PhImage from "phosphor-svelte/lib/ImageIcon"
import PhArrowsOut from "phosphor-svelte/lib/ArrowsOutIcon"
import PhWrench from "phosphor-svelte/lib/WrenchIcon"


export type IconName =
  | "activity" | "alert-circle" | "archive" | "arrow-down" | "arrow-left" | "arrow-right" | "arrow-up"
  | "bar-chart" | "bell" | "bot" | "boxes" | "calendar" | "check" | "chevron-down" | "chevron-left"
  | "chevron-right" | "chevron-up" | "circle-help" | "clipboard" | "clock" | "copy" | "download"
  | "ellipsis-horizontal" | "file-plus" | "filter" | "globe" | "grid" | "heart" | "home" | "inbox" | "info"
  | "layout-dashboard" | "link" | "list" | "loader" | "lock" | "log-in" | "log-out" | "menu"
  | "message-circle" | "message-square" | "mic" | "minus" | "moon" | "paperclip" | "pencil" | "play"
  | "plug" | "plus" | "refresh" | "search" | "send" | "settings" | "shield" | "shopping-cart" | "sliders"
  | "sparkles" | "star" | "sun" | "tag" | "trash" | "upload" | "user" | "users" | "x" | "zap" | "eye"
  | "eye-off" | "mail" | "credit-card" | "folder" | "file" | "circle-check" | "triangle-alert"
  | "chevrons-up-down" | "arrow-up-down" | "smartphone" | "bold" | "italic" | "underline" | "image"
  | "maximize" | "wrench"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconComponent = Component<any> | typeof SvelteComponent<any>

type IconMap = Record<IconName, IconComponent>

const lucide: IconMap = {
  activity: LucideActivity, "alert-circle": LucideCircleAlert, archive: LucideArchive, "arrow-down": LucideArrowDown,
  "arrow-left": LucideArrowLeft, "arrow-right": LucideArrowRight, "arrow-up": LucideArrowUp, "bar-chart": LucideChartBar,
  bell: LucideBell, bot: LucideBot, boxes: LucideBoxes, calendar: LucideCalendar, check: LucideCheck,
  "chevron-down": LucideChevronDown, "chevron-left": LucideChevronLeft, "chevron-right": LucideChevronRight,
  "chevron-up": LucideChevronUp, "circle-help": LucideCircleHelp, clipboard: LucideClipboard, clock: LucideClock,
  copy: LucideCopy, download: LucideDownload, "ellipsis-horizontal": LucideEllipsis, "file-plus": LucideFilePlus,
  filter: LucideFilter, globe: LucideGlobe, grid: LucideGrid, heart: LucideHeart, home: LucideHouse, inbox: LucideInbox,
  info: LucideInfo, "layout-dashboard": LucideLayoutDashboard, link: LucideLink, list: LucideList, loader: LucideLoader,
  lock: LucideLock, "log-in": LucideLogIn, "log-out": LucideLogOut, menu: LucideMenu, "message-circle": LucideMessageCircle,
  "message-square": LucideMessageSquare, mic: LucideMic, minus: LucideMinus, moon: LucideMoon, paperclip: LucidePaperclip,
  pencil: LucidePencil, play: LucidePlay, plug: LucidePlug, plus: LucidePlus, refresh: LucideRefresh, search: LucideSearch,
  send: LucideSend, settings: LucideSettings, shield: LucideShield, "shopping-cart": LucideShoppingCart, sliders: LucideSliders,
  sparkles: LucideSparkles, star: LucideStar, sun: LucideSun, tag: LucideTag, trash: LucideTrash, upload: LucideUpload,
  user: LucideUser, users: LucideUsers, x: LucideX, zap: LucideZap, eye: LucideEye, "eye-off": LucideEyeOff, mail: LucideMail,
  "credit-card": LucideCreditCard, folder: LucideFolder, file: LucideFile, "circle-check": LucideCircleCheck,
  "triangle-alert": LucideTriangleAlert, "chevrons-up-down": LucideChevronsUpDown, "arrow-up-down": LucideArrowUpDown,
  smartphone: LucideSmartphone, bold: LucideBold, italic: LucideItalic, underline: LucideUnderline, image: LucideImage,
  maximize: LucideMaximize, wrench: LucideWrench,
}

const tabler: IconMap = {
  activity: TablerActivity, "alert-circle": TablerAlertCircle, archive: TablerArchive, "arrow-down": TablerArrowDown,
  "arrow-left": TablerArrowLeft, "arrow-right": TablerArrowRight, "arrow-up": TablerArrowUp, "bar-chart": TablerChartBar,
  bell: TablerBell, bot: TablerRobot, boxes: TablerPackages, calendar: TablerCalendar, check: TablerCheck,
  "chevron-down": TablerChevronDown, "chevron-left": TablerChevronLeft, "chevron-right": TablerChevronRight,
  "chevron-up": TablerChevronUp, "circle-help": TablerHelpCircle, clipboard: TablerClipboard, clock: TablerClock,
  copy: TablerCopy, download: TablerDownload, "ellipsis-horizontal": TablerDots, "file-plus": TablerFilePlus,
  filter: TablerFilter, globe: TablerWorld, grid: TablerLayoutGrid, heart: TablerHeart, home: TablerHome, inbox: TablerInbox,
  info: TablerInfoCircle, "layout-dashboard": TablerLayoutDashboard, link: TablerLink, list: TablerList, loader: TablerLoader,
  lock: TablerLock, "log-in": TablerLogin, "log-out": TablerLogout, menu: TablerMenu, "message-circle": TablerMessageCircle,
  "message-square": TablerMessage, mic: TablerMicrophone, minus: TablerMinus, moon: TablerMoon, paperclip: TablerPaperclip,
  pencil: TablerPencil, play: TablerPlayerPlay, plug: TablerPlug, plus: TablerPlus, refresh: TablerRefresh, search: TablerSearch,
  send: TablerSend, settings: TablerSettings, shield: TablerShield, "shopping-cart": TablerShoppingCart, sliders: TablerAdjustments,
  sparkles: TablerSparkles, star: TablerStar, sun: TablerSun, tag: TablerTag, trash: TablerTrash, upload: TablerUpload,
  user: TablerUser, users: TablerUsers, x: TablerX, zap: TablerBolt, eye: TablerEye, "eye-off": TablerEyeOff, mail: TablerMail,
  "credit-card": TablerCreditCard, folder: TablerFolder, file: TablerFile, "circle-check": TablerCircleCheck,
  "triangle-alert": TablerAlertTriangle, "chevrons-up-down": TablerSelector, "arrow-up-down": TablerArrowsSort,
  smartphone: TablerDeviceMobile, bold: TablerBold, italic: TablerItalic, underline: TablerUnderline, image: TablerPhoto,
  maximize: TablerMaximize, wrench: TablerTool,
}

const phosphor: IconMap = {
  activity: PhPulse, "alert-circle": PhWarningCircle, archive: PhArchive, "arrow-down": PhArrowDown, "arrow-left": PhArrowLeft,
  "arrow-right": PhArrowRight, "arrow-up": PhArrowUp, "bar-chart": PhChartBar, bell: PhBell, bot: PhRobot, boxes: PhPackage,
  calendar: PhCalendar, check: PhCheck, "chevron-down": PhCaretDown, "chevron-left": PhCaretLeft, "chevron-right": PhCaretRight,
  "chevron-up": PhCaretUp, "circle-help": PhQuestion, clipboard: PhClipboard, clock: PhClock, copy: PhCopy, download: PhDownload,
  "ellipsis-horizontal": PhDotsThree, "file-plus": PhFilePlus, filter: PhFunnel, globe: PhGlobe, grid: PhGridFour, heart: PhHeart,
  home: PhHouse, inbox: PhTray, info: PhInfo, "layout-dashboard": PhSquaresFour, link: PhLink, list: PhList, loader: PhSpinner,
  lock: PhLock, "log-in": PhSignIn, "log-out": PhSignOut, menu: PhList, "message-circle": PhChatCircle, "message-square": PhChatText,
  mic: PhMicrophone, minus: PhMinus, moon: PhMoon, paperclip: PhPaperclip, pencil: PhPencil, play: PhPlay, plug: PhPlugs, plus: PhPlus,
  refresh: PhArrowsClockwise, search: PhMagnifyingGlass, send: PhPaperPlaneTilt, settings: PhGear, shield: PhShield,
  "shopping-cart": PhShoppingCart, sliders: PhSliders, sparkles: PhSparkle, star: PhStar, sun: PhSun, tag: PhTag, trash: PhTrash,
  upload: PhUpload, user: PhUser, users: PhUsers, x: PhX, zap: PhLightning, eye: PhEye, "eye-off": PhEyeSlash, mail: PhEnvelope,
  "credit-card": PhCreditCard, folder: PhFolder, file: PhFile, "circle-check": PhCheckCircle, "triangle-alert": PhWarning,
  "chevrons-up-down": PhCaretUpDown, "arrow-up-down": PhArrowsDownUp, smartphone: PhDeviceMobile, bold: PhTextB,
  italic: PhTextItalic, underline: PhTextUnderline, image: PhImage, maximize: PhArrowsOut, wrench: PhWrench,
}

export const families = { lucide, tabler, phosphor }
