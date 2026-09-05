import type { Component } from "vue"
import {
  ArrowRight, Bell, Boxes, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Copy, Download,
  Eye, EyeOff, FilePlus2, Filter, Globe2, Home, LayoutDashboard, Link as LinkIcon, LoaderCircle, LockKeyhole,
  LogIn, LogOut, Mail, Menu, MessageSquare, Moon, MoreHorizontal, Paperclip, Pencil, Plus, Search, Send, Settings,
  Shield, ShoppingCart, SlidersHorizontal, Sparkles, Star, Sun, Trash2, Upload, User, X, Zap,
} from "lucide-vue-next"

export type IconName = string

const icons: Record<string, Component> = {
  search: Search, bell: Bell, menu: Menu, sun: Sun, moon: Moon, "chevron-down": ChevronDown, "chevron-right": ChevronRight,
  "chevron-left": ChevronRight, plus: Plus, trash: Trash2, edit: Pencil, eye: Eye, "eye-off": EyeOff, mail: Mail, lock: LockKeyhole,
  user: User, logout: LogOut, "log-in": LogIn, settings: Settings, download: Download, filter: Filter, send: Send, paperclip: Paperclip,
  copy: Copy, check: Check, x: X, "layout-dashboard": LayoutDashboard, "shopping-cart": ShoppingCart, "file-plus": FilePlus2,
  "message-square": MessageSquare, boxes: Boxes, globe: Globe2, zap: Zap, shield: Shield, star: Star, home: Home, clock: Clock3,
  more: MoreHorizontal, calendar: CalendarDays, link: LinkIcon, loader: LoaderCircle, sparkles: Sparkles, "arrow-right": ArrowRight,
  info: CircleHelp, upload: Upload, sliders: SlidersHorizontal,
}

export function iconComponent(set: "native" | "lucide" | "tabler" | "phosphor" | "heroicons", name: string): Component | null {
  if (set === "native") return null
  return icons[name] ?? CircleHelp
}
