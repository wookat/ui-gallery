import type { ComponentType, SVGProps } from "react"
import {
  ArchiveIcon,
  BellIcon,
  CalendarIcon,
  ChatBubbleIcon,
  CheckCircledIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClipboardCopyIcon,
  ComponentInstanceIcon,
  CopyIcon,
  Cross2Icon,
  DashboardIcon,
  DotsHorizontalIcon,
  DownloadIcon,
  EnvelopeClosedIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  ExternalLinkIcon,
  FileIcon,
  FilePlusIcon,
  GearIcon,
  GitHubLogoIcon,
  GlobeIcon,
  HamburgerMenuIcon,
  InfoCircledIcon,
  Link2Icon,
  LightningBoltIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  MoonIcon,
  MixerHorizontalIcon,
  PaperPlaneIcon,
  Pencil1Icon,
  PersonIcon,
  PlusIcon,
  QuestionMarkCircledIcon,
  ReloadIcon,
  SpeakerLoudIcon,
  StarFilledIcon,
  StarIcon,
  SunIcon,
  TrashIcon,
  ActivityLogIcon,
  BackpackIcon,
  CaretSortIcon,
  ClockIcon,
  UploadIcon,
} from "@radix-ui/react-icons"
import {
  EyeIcon as HeroEye,
  EyeSlashIcon as HeroEyeSlash,
} from "@heroicons/react/24/outline"
import { Eye as PhEye, EyeSlash as PhEyeSlash } from "@phosphor-icons/react"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { Eye, EyeOff } from "lucide-react"
import { Icon as SharedIcon } from "@ui-gallery/icons-react"

type IconType = ComponentType<SVGProps<SVGSVGElement>>
type Props = SVGProps<SVGSVGElement> & { name: string; size?: number | string }

const native = {
  activity: ActivityLogIcon,
  "alert-circle": InfoCircledIcon,
  archive: ArchiveIcon,
  "arrow-down": ChevronDownIcon,
  "arrow-left": ChevronLeftIcon,
  "arrow-right": ChevronRightIcon,
  "arrow-up": ChevronUpIcon,
  "bar-chart": DashboardIcon,
  bell: BellIcon,
  bot: ComponentInstanceIcon,
  boxes: ComponentInstanceIcon,
  calendar: CalendarIcon,
  check: CheckIcon,
  "check-circle": CheckCircledIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-up": ChevronUpIcon,
  clipboard: ClipboardCopyIcon,
  clock: ClockIcon,
  copy: CopyIcon,
  download: DownloadIcon,
  edit: Pencil1Icon,
  "external-link": ExternalLinkIcon,
  eye: EyeOpenIcon,
  "eye-off": EyeClosedIcon,
  "file-plus": FilePlusIcon,
  file: FileIcon,
  github: GitHubLogoIcon,
  filter: MixerHorizontalIcon,
  globe: GlobeIcon,
  grid: ComponentInstanceIcon,
  heart: StarIcon,
  home: DashboardIcon,
  inbox: ArchiveIcon,
  image: ComponentInstanceIcon,
  info: InfoCircledIcon,
  "layout-dashboard": DashboardIcon,
  link: Link2Icon,
  loader: ReloadIcon,
  lock: LockClosedIcon,
  "log-in": PersonIcon,
  "log-out": PersonIcon,
  menu: HamburgerMenuIcon,
  "message-circle": ChatBubbleIcon,
  "message-square": ChatBubbleIcon,
  mail: EnvelopeClosedIcon,
  mic: SpeakerLoudIcon,
  minus: MinusIcon,
  "more-horizontal": DotsHorizontalIcon,
  moon: MoonIcon,
  paperclip: Link2Icon,
  pencil: Pencil1Icon,
  plus: PlusIcon,
  plug: ComponentInstanceIcon,
  refresh: ReloadIcon,
  search: MagnifyingGlassIcon,
  send: PaperPlaneIcon,
  settings: GearIcon,
  shield: LockClosedIcon,
  "shopping-cart": BackpackIcon,
  sliders: MixerHorizontalIcon,
  sparkles: StarFilledIcon,
  star: StarIcon,
  sun: SunIcon,
  tag: ArchiveIcon,
  trash: TrashIcon,
  upload: UploadIcon,
  user: PersonIcon,
  users: PersonIcon,
  x: Cross2Icon,
  zap: LightningBoltIcon,
  "chevrons-up-down": CaretSortIcon,
  "alert-triangle": InfoCircledIcon,
  "x-circle": Cross2Icon,
  "inbox-icon": ArchiveIcon,
} as unknown as Record<string, IconType>

const overrides: Record<string, Record<string, IconType>> = {
  lucide: { eye: Eye, "eye-off": EyeOff },
  tabler: { eye: IconEye, "eye-off": IconEyeOff },
  phosphor: {
    eye: PhEye as unknown as IconType,
    "eye-off": PhEyeSlash as unknown as IconType,
  },
  heroicons: {
    eye: HeroEye,
    "eye-off": HeroEyeSlash,
  },
}

export function Icon({ name, size = 18, ...props }: Props) {
  const params = new URLSearchParams(window.location.search)
  const family = params.get("icons") ?? params.get("icon")
  const shared =
    family === "tabler" || family === "phosphor" || family === "heroicons"
      ? family
      : "lucide"
  if (family !== "native") {
    const Override = overrides[shared][name]
    if (Override) {
      return (
        <Override
          width={size}
          height={size}
          aria-hidden="true"
          {...(props as SVGProps<SVGSVGElement>)}
        />
      )
    }
    return <SharedIcon name={name} size={size} />
  }
  const Component = native[name] ?? QuestionMarkCircledIcon
  return (
    <Component
      width={size}
      height={size}
      {...(props as SVGProps<SVGSVGElement>)}
    />
  )
}
