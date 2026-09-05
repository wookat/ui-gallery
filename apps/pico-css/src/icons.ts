import { rawIcon } from "./icons/generated"
import type { IconFamily } from "./settings"

let currentFamily: IconFamily = "lucide"

export function setIconFamily(family: IconFamily): void {
  currentFamily = family
}

export function family(): IconFamily {
  return currentFamily
}

export function icon(name: string, size = 16): string {
  const svg = rawIcon(name, currentFamily, size)
  return svg.replace("<svg", `<svg aria-hidden="true" width="${size}" height="${size}" class="icon"`)
}
