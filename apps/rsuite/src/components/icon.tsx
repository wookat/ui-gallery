import {
  AiCallout, AppSelect, Archive, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Audio, BarChart, Calendar,
  Check, CollaspedArrow, Copy, Creative, Dashboard, Danger, Edit, Exit, FileDownload, FileUpload,
  Funnel, Gear, Global, Grid, Growth, HelpOutline, Heart, Image as ImageIcon, InfoOutline, List,
  Lock, Menu, Message, Minus, More, Notice, Peoples, PlayOutline, Plus, PublicOpinion, Reload, Search,
  Send, SettingHorizontal, Shield, Spinner, Star, Tag as TagIcon, Time, Trash, UserInfo, Close,
} from "@rsuite/icons"
import { Icon as GalleryIcon } from "@ui-gallery/icons-react"
import type { ComponentType } from "react"
import { useTheme } from "@/components/theme-context"

type Props = { name: string; size?: number; spin?: boolean; className?: string }
type NativeComponent = ComponentType<{ style?: React.CSSProperties; className?: string }>

const map: Record<string, NativeComponent> = {
  activity: Growth, "alert-circle": Danger, archive: Archive,
  "arrow-down": ArrowDown, "arrow-left": ArrowLeft, "arrow-right": ArrowRight,
  "arrow-up": ArrowUp, "bar-chart": BarChart, bell: Notice,
  bot: AiCallout, boxes: AppSelect, calendar: Calendar, check: Check,
  "chevron-down": CollaspedArrow, "chevron-left": ArrowLeft, "chevron-right": ArrowRight,
  "chevron-up": ArrowUp, "circle-help": HelpOutline, clipboard: Copy,
  clock: Time, copy: Copy, download: FileDownload, edit: Edit,
  "ellipsis-horizontal": More, filter: Funnel, github: Global, globe: Global,
  grid: Grid, heart: Heart, home: Dashboard, image: ImageIcon,
  inbox: AppSelect, info: InfoOutline, "layout-dashboard": Dashboard, link: Global,
  list: List, loader: Spinner, lock: Lock, "log-in": UserInfo,
  "log-out": Exit, menu: Menu, "message-circle": Message, "message-square": Message,
  mic: Audio, minus: Minus, "more-horizontal": More, moon: Notice,
  paperclip: FileUpload, pencil: Edit, play: PlayOutline, plus: Plus,
  plug: PublicOpinion, refresh: Reload, search: Search, send: Send, settings: Gear,
  shield: Shield, "shopping-cart": AppSelect, sliders: SettingHorizontal, sparkles: Creative,
  star: Star, sun: Creative, tag: TagIcon, trash: Trash, upload: FileUpload,
  user: UserInfo, users: Peoples, x: Close, zap: Creative,
}

export function Icon({ name, size = 16, spin = false, className }: Props) {
  const { icons: set } = useTheme()
  if (set && ["lucide", "tabler", "phosphor", "heroicons"].includes(set)) {
    return <GalleryIcon name={name} size={size} className={className} />
  }
  const Component = map[name] ?? HelpOutline
  return <Component className={className} style={{ fontSize: size, ...(spin ? { animation: "rs-loader-spin 1s linear infinite" } : {}) }} />
}
