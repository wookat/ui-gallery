import type { Component } from "vue"
import {
  LayoutDashboard, ShoppingCart, FilePlus, MessageSquare, Boxes, Globe, Settings, LogIn, Search, Bell, Sun, Moon, Menu,
  ChevronDown, ChevronRight, ChevronLeft, ChevronUp, ChevronsUpDown, User, LogOut, Mail, Lock, Eye, EyeOff, Github, Chrome, Apple,
  Plus, Download, Filter, Columns3, MoreHorizontal, Trash2, Pencil, Check, X, Copy, RefreshCw, AlertCircle, AlertTriangle, Info,
  CheckCircle2, Loader2, Calendar, Clock, Upload, Image, Paperclip, Send, Sparkles, Bot, FileText, Link, Star, Heart, TrendingUp,
  TrendingDown, Users, CreditCard, Shield, Smartphone, Monitor, Zap, ArrowRight, ArrowUpRight, ArrowLeft, Home, Package, Inbox,
  Layers, Grid2x2, Wrench, HelpCircle, ExternalLink, Keyboard, QrCode, Palette, Type,
  MoreVertical, Maximize2, XCircle, ChevronsLeft, ChevronsRight, Truck, MoveHorizontal, MessagesSquare,
} from "lucide-vue-next"
import type { IconName } from "./names"

export const lucideIcons: Record<IconName, Component> = {
  "layout-dashboard": LayoutDashboard, "shopping-cart": ShoppingCart, "file-plus": FilePlus, "message-square": MessageSquare, boxes: Boxes,
  globe: Globe, settings: Settings, "log-in": LogIn, search: Search, bell: Bell, sun: Sun, moon: Moon, menu: Menu, "chevron-down": ChevronDown,
  "chevron-right": ChevronRight, "chevron-left": ChevronLeft, "chevron-up": ChevronUp, "chevrons-up-down": ChevronsUpDown, user: User, "log-out": LogOut,
  mail: Mail, lock: Lock, eye: Eye, "eye-off": EyeOff, github: Github, chrome: Chrome, apple: Apple, plus: Plus, download: Download, filter: Filter,
  "columns-3": Columns3, "more-horizontal": MoreHorizontal, "trash-2": Trash2, pencil: Pencil, check: Check, x: X, copy: Copy, "refresh-cw": RefreshCw,
  "alert-circle": AlertCircle, "alert-triangle": AlertTriangle, info: Info, "check-circle-2": CheckCircle2, "loader-2": Loader2, calendar: Calendar,
  clock: Clock, upload: Upload, image: Image, paperclip: Paperclip, send: Send, sparkles: Sparkles, bot: Bot, "file-text": FileText, link: Link,
  star: Star, heart: Heart, "trending-up": TrendingUp, "trending-down": TrendingDown, users: Users, "credit-card": CreditCard, shield: Shield,
  smartphone: Smartphone, monitor: Monitor, zap: Zap, "arrow-right": ArrowRight, "arrow-up-right": ArrowUpRight, "arrow-left": ArrowLeft, home: Home,
  package: Package, inbox: Inbox, layers: Layers, "grid-2x2": Grid2x2, wrench: Wrench, "help-circle": HelpCircle, "external-link": ExternalLink,
  keyboard: Keyboard, "qr-code": QrCode, palette: Palette, type: Type, "bar-chart": TrendingUp, plug: Link,
  "more-vertical": MoreVertical, maximize: Maximize2, "x-circle": XCircle, "chevrons-left": ChevronsLeft, "chevrons-right": ChevronsRight, truck: Truck, "move-horizontal": MoveHorizontal, "messages-square": MessagesSquare,
}
