import { h, type FunctionalComponent } from "vue"
import {
  AppstoreOutlined, ArrowDownOutlined, ArrowUpOutlined, BellOutlined, BarChartOutlined, RobotOutlined,
  CheckOutlined, CloseOutlined, CopyOutlined, DeleteOutlined, DownloadOutlined, EditOutlined,
  FileAddOutlined, FileTextOutlined, FilterOutlined, GlobalOutlined, LayoutOutlined,
  LinkOutlined, LoginOutlined, MenuOutlined, MessageOutlined,
  MoreOutlined, PaperClipOutlined, PlusOutlined, ReloadOutlined, SearchOutlined,
  SendOutlined, SettingOutlined, ShoppingCartOutlined, SafetyOutlined, StarOutlined,
  TagOutlined, ThunderboltOutlined, UploadOutlined, UserOutlined, TeamOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons-vue"
import * as Lucide from "lucide-vue-next"
import * as Tabler from "@tabler/icons-vue"
import * as Phosphor from "@phosphor-icons/vue"
import {
  ArrowDownIcon, ArrowUpIcon, BellIcon, ChartBarIcon, CheckIcon, ChevronDownIcon, ChevronLeftIcon,
  ChevronRightIcon, ChevronUpIcon, ClipboardIcon, CloudArrowUpIcon, Cog6ToothIcon, EllipsisHorizontalIcon,
  FolderPlusIcon, FunnelIcon, GlobeAltIcon, HomeIcon, InformationCircleIcon, LinkIcon, ListBulletIcon,
  LockClosedIcon, MagnifyingGlassIcon, MoonIcon, PaperClipIcon, PencilIcon, PlusIcon,
  PaperAirplaneIcon, PowerIcon, RocketLaunchIcon, ShieldCheckIcon, ShoppingCartIcon, SparklesIcon, StarIcon,
  SunIcon, TagIcon, TrashIcon, UserIcon, UserGroupIcon, XMarkIcon,
} from "@heroicons/vue/24/outline"

type IconProps = { name: string; size?: number | string; spin?: boolean }
const native: Record<string, any> = {
  "layout-dashboard": LayoutOutlined, "shopping-cart": ShoppingCartOutlined, "file-plus": FileAddOutlined,
  "message-square": MessageOutlined, boxes: AppstoreOutlined, globe: GlobalOutlined, settings: SettingOutlined,
  "log-in": LoginOutlined, zap: ThunderboltOutlined, shield: SafetyOutlined, "bar-chart": BarChartOutlined,
  bot: RobotOutlined, plug: LinkOutlined, search: SearchOutlined, bell: BellOutlined, menu: MenuOutlined,
  moon: MoreOutlined, sun: MoreOutlined, user: UserOutlined, users: TeamOutlined, plus: PlusOutlined,
  check: CheckOutlined, x: CloseOutlined, copy: CopyOutlined, download: DownloadOutlined, edit: EditOutlined,
  trash: DeleteOutlined, refresh: ReloadOutlined, upload: UploadOutlined, send: SendOutlined, paperclip: PaperClipOutlined,
  filter: FilterOutlined, tag: TagOutlined, star: StarOutlined, "arrow-up": ArrowUpOutlined, "arrow-down": ArrowDownOutlined,
  "more-horizontal": MoreOutlined, "circle-help": QuestionCircleOutlined, "file-text": FileTextOutlined,
}
const lucide: Record<string, any> = Lucide as any
const tabler: Record<string, any> = Tabler as any
const phosphor: Record<string, any> = Phosphor as any
const hero: Record<string, any> = {
  "layout-dashboard": HomeIcon, "shopping-cart": ShoppingCartIcon, "file-plus": FolderPlusIcon,
  "message-square": ListBulletIcon, boxes: ListBulletIcon, globe: GlobeAltIcon, settings: Cog6ToothIcon,
  "log-in": PowerIcon, zap: RocketLaunchIcon, shield: ShieldCheckIcon, "bar-chart": ChartBarIcon, bot: SparklesIcon,
  plug: LinkIcon, search: MagnifyingGlassIcon, bell: BellIcon, menu: ListBulletIcon, moon: MoonIcon, sun: SunIcon,
  user: UserIcon, users: UserGroupIcon, plus: PlusIcon, check: CheckIcon, x: XMarkIcon, copy: ClipboardIcon,
  download: CloudArrowUpIcon, edit: PencilIcon, trash: TrashIcon, refresh: ArrowPathIcon, upload: CloudArrowUpIcon,
  send: PaperAirplaneIcon, paperclip: PaperClipIcon, filter: FunnelIcon, tag: TagIcon, star: StarIcon,
  "arrow-up": ArrowUpIcon, "arrow-down": ArrowDownIcon, "more-horizontal": EllipsisHorizontalIcon,
  "circle-help": InformationCircleIcon, "chevron-down": ChevronDownIcon, "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon, "chevron-up": ChevronUpIcon, link: LinkIcon, lock: LockClosedIcon,
}
// Heroicons exports ArrowPathIcon under a stable name in the supported package.
import { ArrowPathIcon } from "@heroicons/vue/24/outline"
const selected: "native" | "lucide" | "tabler" | "phosphor" | "heroicons" = (() => {
  const value = new URLSearchParams(window.location.search).get("icons") ?? new URLSearchParams(window.location.search).get("icon")
  return value === "tabler" || value === "phosphor" || value === "heroicons" || value === "lucide" ? value : "native"
})()
function lookup(name: string) {
  if (selected === "tabler") return tabler[`Icon${name.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`] ?? tabler.IconHelpCircle
  if (selected === "phosphor") return phosphor[name.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")] ?? phosphor.Question
  if (selected === "heroicons") return hero[name] ?? InformationCircleIcon
  if (selected === "lucide") {
    const key = name.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")
    return lucide[key] ?? Lucide.CircleHelp
  }
  return native[name] ?? QuestionCircleOutlined
}
export const Icon: FunctionalComponent<IconProps> = (props) => {
  const Component = lookup(props.name)
  return h(Component, { style: { fontSize: `${props.size ?? 16}px`, width: `${props.size ?? 16}px`, height: `${props.size ?? 16}px` }, spin: props.spin })
}
Icon.props = ["name", "size", "spin"]
