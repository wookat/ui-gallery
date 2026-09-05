<script lang="ts">
  import type { IconName } from "./icons"
  import { heroSvg } from "./hero-map"

  let { name, class: className = "", size }: { name: IconName; class?: string; size?: number | string } = $props()

  const svg = $derived(
    heroSvg(name).replace("<svg", `<svg class="${className}" ${size ? `width="${size}" height="${size}"` : ""} aria-hidden="true"`),
  )
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- static SVG from the heroicons package -->
{@html svg}
