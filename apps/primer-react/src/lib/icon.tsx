import type { ComponentType } from "react"
import { Icon as GalleryIcon } from "@ui-gallery/icons-react"
import {
  AlertIcon,
  ArchiveIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClockIcon,
  CommentDiscussionIcon,
  CommentIcon,
  CopilotIcon,
  CopyIcon,
  DashIcon,
  DownloadIcon,
  FileAddedIcon,
  FilterIcon,
  GearIcon,
  GlobeIcon,
  GraphIcon,
  HeartIcon,
  HomeIcon,
  InboxIcon,
  InfoIcon,
  KebabHorizontalIcon,
  LinkIcon,
  ListUnorderedIcon,
  LockIcon,
  MoonIcon,
  PackageIcon,
  PaperAirplaneIcon,
  PaperclipIcon,
  PasteIcon,
  PencilIcon,
  PeopleIcon,
  PersonIcon,
  PlayIcon,
  PlugIcon,
  PlusIcon,
  PulseIcon,
  QuestionIcon,
  RowsIcon,
  SearchIcon,
  ShieldIcon,
  SignInIcon,
  SignOutIcon,
  SlidersIcon,
  SparkleFillIcon,
  StarIcon,
  SunIcon,
  SyncIcon,
  TableIcon,
  TagIcon,
  ThreeBarsIcon,
  TrashIcon,
  TypographyIcon,
  UnmuteIcon,
  UploadIcon,
  XIcon,
  ZapIcon,
} from "@primer/octicons-react"

type OcticonProps = { size?: number | "small" | "medium" | "large"; className?: string; fill?: string; "aria-label"?: string }
type Octicon = ComponentType<OcticonProps>

export const octicons: Record<string, Octicon> = {
  activity: PulseIcon,
  "alert-circle": AlertIcon,
  archive: ArchiveIcon,
  "arrow-down": ArrowDownIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-up": ArrowUpIcon,
  "bar-chart": GraphIcon,
  bell: BellIcon,
  bot: CopilotIcon,
  boxes: PackageIcon,
  calendar: CalendarIcon,
  check: CheckIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-up": ChevronUpIcon,
  "circle-help": QuestionIcon,
  clipboard: PasteIcon,
  clock: ClockIcon,
  copy: CopyIcon,
  download: DownloadIcon,
  edit: PencilIcon,
  "ellipsis-horizontal": KebabHorizontalIcon,
  "file-plus": FileAddedIcon,
  filter: FilterIcon,
  globe: GlobeIcon,
  grid: TableIcon,
  heart: HeartIcon,
  home: HomeIcon,
  inbox: InboxIcon,
  info: InfoIcon,
  "layout-dashboard": RowsIcon,
  link: LinkIcon,
  list: ListUnorderedIcon,
  loader: SyncIcon,
  lock: LockIcon,
  "log-in": SignInIcon,
  "log-out": SignOutIcon,
  menu: ThreeBarsIcon,
  "message-circle": CommentIcon,
  "message-square": CommentDiscussionIcon,
  mic: UnmuteIcon,
  minus: DashIcon,
  "more-horizontal": KebabHorizontalIcon,
  moon: MoonIcon,
  paperclip: PaperclipIcon,
  pencil: PencilIcon,
  play: PlayIcon,
  plus: PlusIcon,
  plug: PlugIcon,
  refresh: SyncIcon,
  search: SearchIcon,
  send: PaperAirplaneIcon,
  settings: GearIcon,
  shield: ShieldIcon,
  "shopping-cart": PackageIcon,
  sliders: SlidersIcon,
  sparkles: SparkleFillIcon,
  star: StarIcon,
  sun: SunIcon,
  tag: TagIcon,
  type: TypographyIcon,
  trash: TrashIcon,
  upload: UploadIcon,
  user: PersonIcon,
  users: PeopleIcon,
  x: XIcon,
  zap: ZapIcon,
}

export function iconFamily(): string {
  const value = new URLSearchParams(window.location.search).get("icons")
  return value === "lucide" || value === "tabler" || value === "phosphor" || value === "heroicons" ? value : "native"
}

export type IconProps = { name: string; size?: number; className?: string }

/** Octicons by default (Primer's native icon set); `?icons=lucide|tabler|phosphor|heroicons` routes to the shared adapter. */
export function Icon({ name, size = 16, className }: IconProps) {
  if (iconFamily() !== "native") return <GalleryIcon name={name} size={size} className={className} />
  const Component = octicons[name] ?? QuestionIcon
  return <Component size={size} className={className} />
}

/** Returns an Octicon-compatible component for Primer props such as `leadingVisual`. */
export function iconFor(name: string): Octicon {
  if (iconFamily() !== "native") {
    const Adapter = (props: OcticonProps) => <GalleryIcon name={name} size={typeof props.size === "number" ? props.size : 16} className={props.className} />
    return Adapter
  }
  return octicons[name] ?? QuestionIcon
}
