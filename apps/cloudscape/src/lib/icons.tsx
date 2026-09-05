import type { ReactNode } from "react"
import CloudIcon, { type IconProps as CloudIconProps } from "@cloudscape-design/components/icon"
import IconProvider, { type IconProviderProps } from "@cloudscape-design/components/icon-provider"
import { Icon as GalleryIcon } from "@ui-gallery/icons-react"

import { iconFamilyFromUrl } from "./settings"

export const iconFamily = iconFamilyFromUrl()
export const useNativeIcons = iconFamily === "native"

/** gallery (lucide-style) name -> Cloudscape built-in icon name */
const NATIVE: Record<string, CloudIconProps.Name> = {
  activity: "status-in-progress",
  "alert-circle": "status-warning",
  archive: "folder",
  "arrow-down": "arrow-down",
  "arrow-left": "arrow-left",
  "arrow-right": "arrow-right",
  "arrow-up": "arrow-up",
  "bar-chart": "view-vertical",
  bell: "notification",
  bot: "gen-ai",
  boxes: "multiscreen",
  calendar: "calendar",
  check: "check",
  "chevron-down": "angle-down",
  "chevron-left": "angle-left",
  "chevron-right": "angle-right",
  "chevron-up": "angle-up",
  "circle-help": "support",
  clipboard: "copy",
  clock: "history",
  copy: "copy",
  download: "download",
  edit: "edit",
  "ellipsis-horizontal": "ellipsis",
  "file-plus": "add-plus",
  filter: "filter",
  globe: "globe",
  grid: "grid-view",
  heart: "heart",
  home: "grid-view",
  "layout-dashboard": "grid-view",
  link: "external",
  list: "list-view",
  loader: "status-in-progress",
  lock: "lock-private",
  "log-in": "user-profile",
  "log-out": "sign-out",
  menu: "menu",
  "message-circle": "contact",
  "message-square": "contact",
  mic: "microphone",
  minus: "subtract-minus",
  "more-horizontal": "ellipsis",
  moon: "light-dark",
  paperclip: "file",
  pencil: "edit",
  play: "play",
  plus: "add-plus",
  plug: "share",
  refresh: "refresh",
  search: "search",
  send: "send",
  settings: "settings",
  shield: "security",
  "shopping-cart": "ticket",
  sliders: "settings",
  sparkles: "gen-ai",
  star: "star",
  sun: "light-dark",
  tag: "flag",
  trash: "remove",
  upload: "upload",
  user: "user-profile",
  users: "group",
  x: "close",
  zap: "suggestions",
}

/** Cloudscape built-in name used inside components -> gallery name for the external icon family */
const EXTERNAL: Partial<Record<CloudIconProps.Name, string>> = {
  "add-plus": "plus",
  "angle-down": "chevron-down",
  "angle-left": "chevron-left",
  "angle-right": "chevron-right",
  "angle-up": "chevron-up",
  "arrow-down": "arrow-down",
  "arrow-left": "arrow-left",
  "arrow-right": "arrow-right",
  "arrow-up": "arrow-up",
  calendar: "calendar",
  "caret-down-filled": "chevron-down",
  "caret-up-filled": "chevron-up",
  "caret-down": "chevron-down",
  "caret-up": "chevron-up",
  check: "check",
  close: "x",
  contact: "message-square",
  copy: "copy",
  download: "download",
  edit: "pencil",
  ellipsis: "more-horizontal",
  external: "link",
  filter: "filter",
  folder: "archive",
  "gen-ai": "sparkles",
  globe: "globe",
  "grid-view": "layout-dashboard",
  group: "users",
  heart: "heart",
  history: "clock",
  "light-dark": "moon",
  "list-view": "list",
  "lock-private": "lock",
  menu: "menu",
  microphone: "mic",
  multiscreen: "boxes",
  notification: "bell",
  play: "play",
  refresh: "refresh",
  remove: "trash",
  search: "search",
  security: "shield",
  send: "send",
  settings: "settings",
  share: "plug",
  "sign-out": "log-out",
  star: "star",
  "status-in-progress": "loader",
  "status-warning": "alert-circle",
  "subtract-minus": "minus",
  suggestions: "zap",
  support: "circle-help",
  ticket: "shopping-cart",
  upload: "upload",
  "user-profile": "user",
  "view-vertical": "bar-chart",
}

export function toNative(name: string): CloudIconProps.Name {
  return NATIVE[name] ?? "status-info"
}

/** Icon rendered by gallery name; lucide by default, Cloudscape built-in when ?icons=native. */
export function AppIcon({ name, size = "normal" }: { name: string; size?: CloudIconProps.Size }) {
  if (useNativeIcons) return <CloudIcon name={toNative(name)} size={size} />
  return <CloudIcon svg={<GalleryIcon name={name} />} size={size} />
}

/** Props helper for Cloudscape components that accept iconName / iconSvg. */
export function iconProps(name: string): { iconName?: CloudIconProps.Name; iconSvg?: ReactNode } {
  if (useNativeIcons) return { iconName: toNative(name) }
  return { iconSvg: <GalleryIcon name={name} /> }
}

const externalIcons: IconProviderProps.Icons | null = useNativeIcons
  ? null
  : Object.fromEntries(Object.entries(EXTERNAL).map(([cloud, gallery]) => [cloud, <GalleryIcon name={gallery} />]))

export function GalleryIconProvider({ children }: { children: ReactNode }) {
  if (!externalIcons) return <>{children}</>
  return <IconProvider icons={externalIcons}>{children}</IconProvider>
}
