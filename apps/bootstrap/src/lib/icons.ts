import { iconMap, type IconName } from "./icon-map"
import { iconFamily } from "./settings"

export type { IconName }

export function icon(name: IconName, cls = ""): string {
  const family = iconFamily()
  const raw = iconMap[family][name] ?? iconMap.bootstrap[name]
  return raw
    .replace(/^\s*<\?xml[^>]*>\s*/, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<svg\b([^>]*)>/, (_m, attrs: string) => {
      const kept = attrs
        .replace(/\s(width|height|class)="[^"]*"/g, "")
        .trim()
      return `<svg ${kept} width="1em" height="1em" class="app-icon${cls ? ` ${cls}` : ""}" aria-hidden="true" focusable="false">`
    })
}

export const isIconName = (value: string): value is IconName => value in iconMap.bootstrap
