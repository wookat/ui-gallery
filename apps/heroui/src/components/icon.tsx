import type { ComponentType } from "react"
import { Icon as SharedIcon } from "@ui-gallery/icons-react"
import {
  Bold,
  ExternalLink,
  Eye,
  EyeOff,
  Inbox,
  Info,
  Italic,
  Mail,
  Terminal,
} from "lucide-react"
import {
  IconArrowUpRight,
  IconBold,
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandWechat,
  IconEye,
  IconEyeOff,
  IconInbox,
  IconInfoCircle,
  IconItalic,
  IconMail,
  IconTerminal2,
} from "@tabler/icons-react"
import {
  ArrowSquareOut,
  Envelope,
  Eye as PhEye,
  EyeSlash,
  GithubLogo,
  GoogleLogo,
  Info as PhInfo,
  Terminal as PhTerminal,
  TextB,
  TextItalic,
  Tray,
  WechatLogo,
} from "@phosphor-icons/react"
import {
  ArrowTopRightOnSquareIcon,
  BoldIcon,
  CommandLineIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  InboxIcon,
  InformationCircleIcon,
  ItalicIcon,
} from "@heroicons/react/24/outline"

type IconProps = {
  name: string
  size?: number | string
  className?: string
  strokeWidth?: number
}

type SvgIcon = ComponentType<{ className?: string; width?: number | string; height?: number | string; "aria-hidden"?: boolean | "true" }>

type Family = "lucide" | "tabler" | "phosphor" | "heroicons"

/**
 * 共享图标包 @ui-gallery/icons-react 缺少的名称在这里补齐（禁止改 packages/）。
 * 品牌图标 lucide/heroicons 没有提供，统一回退到 tabler 的 brand 图标。
 */
const extra: Record<Family, Record<string, SvgIcon>> = {
  lucide: {
    bold: Bold,
    "external-link": ExternalLink,
    eye: Eye,
    "eye-off": EyeOff,
    github: IconBrandGithub,
    google: IconBrandGoogle,
    inbox: Inbox,
    info: Info,
    italic: Italic,
    mail: Mail,
    terminal: Terminal,
    wechat: IconBrandWechat,
  },
  tabler: {
    bold: IconBold,
    "external-link": IconArrowUpRight,
    eye: IconEye,
    "eye-off": IconEyeOff,
    github: IconBrandGithub,
    google: IconBrandGoogle,
    inbox: IconInbox,
    info: IconInfoCircle,
    italic: IconItalic,
    mail: IconMail,
    terminal: IconTerminal2,
    wechat: IconBrandWechat,
  },
  phosphor: {
    bold: TextB,
    "external-link": ArrowSquareOut,
    eye: PhEye,
    "eye-off": EyeSlash,
    github: GithubLogo,
    google: GoogleLogo,
    inbox: Tray,
    info: PhInfo,
    italic: TextItalic,
    mail: Envelope,
    terminal: PhTerminal,
    wechat: WechatLogo,
  },
  heroicons: {
    bold: BoldIcon,
    "external-link": ArrowTopRightOnSquareIcon,
    eye: EyeIcon,
    "eye-off": EyeSlashIcon,
    github: IconBrandGithub,
    google: IconBrandGoogle,
    inbox: InboxIcon,
    info: InformationCircleIcon,
    italic: ItalicIcon,
    mail: EnvelopeIcon,
    terminal: CommandLineIcon,
    wechat: IconBrandWechat,
  },
}

function family(): Family {
  if (typeof window === "undefined") return "lucide"
  const value = new URLSearchParams(window.location.search).get("icons")
  return value === "tabler" || value === "phosphor" || value === "heroicons" ? value : "lucide"
}

export function Icon({ name, size = 24, className, strokeWidth }: IconProps) {
  const Extra = extra[family()][name]
  if (Extra) return <Extra aria-hidden="true" width={size} height={size} className={className} />
  return <SharedIcon name={name} size={size} className={className} strokeWidth={strokeWidth} />
}
