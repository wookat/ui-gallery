<script lang="ts">
  import * as Heroicons from "svelte-hero-icons"
  import * as Lucide from "@lucide/svelte"
  import * as Phosphor from "phosphor-svelte"
  import * as Tabler from "@tabler/icons-svelte"
  import type { Component } from "svelte"

  type Family = "lucide" | "tabler" | "phosphor" | "heroicons"
  type IconMap = Record<string, string>

  const names = [
    "activity",
    "alert-circle",
    "archive",
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "arrow-up",
    "bar-chart",
    "bell",
    "bot",
    "boxes",
    "calendar",
    "check",
    "chevron-down",
    "chevron-left",
    "chevron-right",
    "chevron-up",
    "circle-help",
    "clipboard",
    "clock",
    "copy",
    "download",
    "edit",
    "ellipsis-horizontal",
    "file-plus",
    "filter",
    "globe",
    "github",
    "grid",
    "heart",
    "home",
    "inbox",
    "info",
    "layout-dashboard",
    "link",
    "list",
    "loader",
    "lock",
    "log-in",
    "log-out",
    "menu",
    "message-circle",
    "message-square",
    "mic",
    "minus",
    "more-horizontal",
    "moon",
    "paperclip",
    "pencil",
    "play",
    "plus",
    "plug",
    "refresh",
    "search",
    "send",
    "settings",
    "shield",
    "shopping-cart",
    "sliders",
    "sparkles",
    "star",
    "sun",
    "tag",
    "trash",
    "upload",
    "user",
    "users",
    "x",
    "zap",
  ]

  const lucideNames: IconMap = Object.fromEntries(
    names.map((name) => [
      name,
      {
        "alert-circle": "AlertCircle",
        "bar-chart": "BarChart3",
        boxes: "Boxes",
        calendar: "CalendarDays",
        "circle-help": "CircleHelp",
        clock: "Clock3",
        edit: "Edit3",
        "ellipsis-horizontal": "Ellipsis",
        globe: "Globe",
        grid: "Grid2X2",
        link: "Link2",
        loader: "LoaderCircle",
        "more-horizontal": "MoreHorizontal",
        refresh: "RefreshCw",
        sliders: "SlidersHorizontal",
        trash: "Trash2",
        ...Object.fromEntries(
          names
            .filter(
              (name) =>
                ![
                  "alert-circle",
                  "bar-chart",
                  "boxes",
                  "calendar",
                  "circle-help",
                  "clock",
                  "edit",
                  "ellipsis-horizontal",
                  "globe",
                  "grid",
                  "link",
                  "loader",
                  "more-horizontal",
                  "refresh",
                  "sliders",
                  "trash",
                ].includes(name)
            )
            .map((name) => [
              name,
              name
                .split("-")
                .map((part) => part[0].toUpperCase() + part.slice(1))
                .join(""),
            ])
        ),
      }[name] ?? "CircleHelp",
    ])
  )

  const tablerNames: IconMap = Object.fromEntries(
    names.map((name) => [
      name,
      {
        "alert-circle": "IconAlertCircle",
        "bar-chart": "IconChartBar",
        boxes: "IconBox",
        calendar: "IconCalendar",
        "circle-help": "IconInfoCircle",
        clock: "IconClock",
        edit: "IconEdit",
        "ellipsis-horizontal": "IconDots",
        globe: "IconGlobe",
        grid: "IconGrid3x3",
        link: "IconLink",
        loader: "IconLoader2",
        "more-horizontal": "IconDots",
        refresh: "IconRefresh",
        sliders: "IconAdjustmentsHorizontal",
        trash: "IconTrash",
        zap: "IconZzz",
        ...Object.fromEntries(
          names
            .filter(
              (name) =>
                ![
                  "alert-circle",
                  "bar-chart",
                  "boxes",
                  "calendar",
                  "circle-help",
                  "clock",
                  "edit",
                  "ellipsis-horizontal",
                  "globe",
                  "grid",
                  "link",
                  "loader",
                  "more-horizontal",
                  "refresh",
                  "sliders",
                  "trash",
                  "zap",
                ].includes(name)
            )
            .map((name) => [
              name,
              `Icon${name
                .split("-")
                .map((part) => part[0].toUpperCase() + part.slice(1))
                .join("")}`,
            ])
        ),
      }[name] ?? "IconInfoCircle",
    ])
  )

  const phosphorNames: IconMap = Object.fromEntries(
    names.map((name) => [
      name,
      {
        activity: "Pulse",
        "alert-circle": "CheckCircle",
        archive: "Archive",
        "bar-chart": "ChartBar",
        boxes: "Cube",
        calendar: "Calendar",
        "circle-help": "CheckCircle",
        clock: "Clock",
        edit: "Pencil",
        "ellipsis-horizontal": "DotsThree",
        filter: "Faders",
        globe: "Globe",
        grid: "GridFour",
        home: "House",
        link: "Link",
        loader: "Repeat",
        "log-in": "Power",
        "log-out": "Power",
        menu: "List",
        "message-circle": "ChatCircle",
        "message-square": "ChatText",
        refresh: "Repeat",
        search: "MagnifyingGlass",
        send: "PaperPlaneTilt",
        settings: "Gear",
        sliders: "SlidersHorizontal",
        sparkles: "Sparkle",
        trash: "Trash",
        upload: "UploadSimple",
        zap: "Lightning",
        ...Object.fromEntries(
          names
            .filter(
              (name) =>
                ![
                  "activity",
                  "alert-circle",
                  "archive",
                  "bar-chart",
                  "boxes",
                  "calendar",
                  "circle-help",
                  "clock",
                  "edit",
                  "ellipsis-horizontal",
                  "filter",
                  "globe",
                  "grid",
                  "home",
                  "link",
                  "loader",
                  "log-in",
                  "log-out",
                  "menu",
                  "message-circle",
                  "message-square",
                  "refresh",
                  "search",
                  "send",
                  "settings",
                  "sliders",
                  "sparkles",
                  "trash",
                  "upload",
                  "zap",
                ].includes(name)
            )
            .map((name) => [
              name,
              name
                .split("-")
                .map((part) => part[0].toUpperCase() + part.slice(1))
                .join(""),
            ])
        ),
      }[name] ?? "Question",
    ])
  )

  const heroNames: IconMap = Object.fromEntries(
    names.map((name) => [
      name,
      {
        "alert-circle": "InformationCircleIcon",
        "bar-chart": "ChartBarIcon",
        boxes: "RectangleGroupIcon",
        calendar: "CalendarDaysIcon",
        "circle-help": "InformationCircleIcon",
        clock: "ClockIcon",
        edit: "PencilIcon",
        "ellipsis-horizontal": "EllipsisHorizontalIcon",
        filter: "FunnelIcon",
        globe: "GlobeAltIcon",
        grid: "RectangleGroupIcon",
        home: "HomeIcon",
        link: "LinkIcon",
        loader: "ArrowPathIcon",
        "log-in": "PowerIcon",
        "log-out": "PowerIcon",
        menu: "ListBulletIcon",
        "message-circle": "ChatBubbleLeftIcon",
        "message-square": "ChatBubbleLeftIcon",
        refresh: "ArrowPathIcon",
        search: "MagnifyingGlassIcon",
        send: "MegaphoneIcon",
        settings: "Cog6ToothIcon",
        sliders: "AdjustmentsHorizontalIcon",
        sparkles: "SparklesIcon",
        trash: "TrashIcon",
        upload: "CloudArrowUpIcon",
        zap: "RocketLaunchIcon",
        ...Object.fromEntries(
          names
            .filter(
              (name) =>
                ![
                  "alert-circle",
                  "bar-chart",
                  "boxes",
                  "calendar",
                  "circle-help",
                  "clock",
                  "edit",
                  "ellipsis-horizontal",
                  "filter",
                  "globe",
                  "grid",
                  "home",
                  "link",
                  "loader",
                  "log-in",
                  "log-out",
                  "menu",
                  "message-circle",
                  "message-square",
                  "refresh",
                  "search",
                  "send",
                  "settings",
                  "sliders",
                  "sparkles",
                  "trash",
                  "upload",
                  "zap",
                ].includes(name)
            )
            .map((name) => [
              name,
              `${name
                .split("-")
                .map((part) => part[0].toUpperCase() + part.slice(1))
                .join("")}Icon`,
            ])
        ),
      }[name] ?? "InformationCircleIcon",
    ])
  )

  const libraries: Record<Family, Record<string, Component>> = {
    lucide: Lucide as unknown as Record<string, Component>,
    tabler: Tabler as unknown as Record<string, Component>,
    phosphor: Phosphor as unknown as Record<string, Component>,
    heroicons: Heroicons as unknown as Record<string, Component>,
  }
  const maps: Record<Family, IconMap> = {
    lucide: lucideNames,
    tabler: tablerNames,
    phosphor: phosphorNames,
    heroicons: heroNames,
  }

  let {
    name,
    size = 18,
    class: className = "",
  }: { name: string; size?: number; class?: string } = $props()
  const family = $derived.by<Family>(() => {
    const value = new URLSearchParams(window.location.search).get("icons")
    return value === "tabler" || value === "phosphor" || value === "heroicons" ? value : "lucide"
  })
  const component = $derived(
    libraries[family][maps[family][name] ?? maps[family]["circle-help"]] ??
      libraries[family][maps[family]["circle-help"]] ??
      libraries.lucide.CircleHelp
  )
</script>

<svelte:component
  this={component}
  {size}
  width={size}
  height={size}
  class={className}
  aria-hidden="true"
/>
