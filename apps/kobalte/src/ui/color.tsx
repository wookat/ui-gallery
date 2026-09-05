import { ColorArea } from "@kobalte/core/color-area"
import { ColorField } from "@kobalte/core/color-field"
import { ColorSlider } from "@kobalte/core/color-slider"
import { ColorSwatch } from "@kobalte/core/color-swatch"
import { parseColor } from "@kobalte/core/colors"

export const defaultColor = parseColor("#2563eb")

export function ColorPicker(props: { label?: string }) {
  return (
    <div class="grid gap-3">
      <ColorArea value={defaultColor} class="relative h-36 w-48 overflow-hidden rounded-md">
        <ColorArea.Background class="absolute inset-0 bg-[linear-gradient(to_top,#000,transparent),linear-gradient(to_right,#fff,transparent)]" />
        <ColorArea.Thumb class="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow ring-1 ring-zinc-900" />
        <ColorArea.HiddenInputX />
        <ColorArea.HiddenInputY />
      </ColorArea>
      <ColorSlider value={defaultColor} channel="hue" colorSpace="hsl" class="grid gap-1">
        <ColorSlider.Label class="text-xs font-medium">{props.label ?? "色相"}</ColorSlider.Label>
        <ColorSlider.Track class="relative h-3 rounded-full bg-[linear-gradient(to_right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)]">
          <ColorSlider.Thumb class="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow ring-1 ring-zinc-900" />
        </ColorSlider.Track>
      </ColorSlider>
      <div class="flex items-end gap-3">
        <ColorField value="#2563eb" class="grid gap-1">
          <ColorField.Label class="text-xs font-medium">HEX</ColorField.Label>
          <ColorField.Input class="h-9 w-28 rounded-md border border-zinc-300 bg-white px-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-900" />
        </ColorField>
        <ColorSwatch value={defaultColor} class="size-8 rounded-full border border-zinc-300" />
      </div>
    </div>
  )
}
