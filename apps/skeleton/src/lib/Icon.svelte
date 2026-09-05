<script lang="ts">
  import { families, type IconName } from "./icons"
  import { iconFamily } from "./settings"
  import HeroIcon from "./HeroIcon.svelte"

  let { name, class: className = "size-4", size }: { name: IconName; class?: string; size?: number | string } = $props()

  const family = iconFamily()
  const Component = $derived(family === "heroicons" ? null : (families[family][name] ?? families.lucide["circle-help"]))
</script>

{#if Component}
  <Component class={className} {size} aria-hidden="true" />
{:else}
  <HeroIcon {name} class={className} {size} />
{/if}
