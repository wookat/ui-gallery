<script lang="ts">
  import { href, navigate } from "$lib/router.svelte"
  import type { HTMLAnchorAttributes } from "svelte/elements"

  let {
    to,
    children,
    class: className = "",
    onclick,
    ...restProps
  }: {
    to: string
    children: import("svelte").Snippet
    class?: string
    onclick?: (event: MouseEvent) => void
    [key: string]: unknown
  } = $props()
</script>

<a
  href={href(to)}
  class={className}
  {...restProps as HTMLAnchorAttributes}
  onclick={(event) => {
    event.preventDefault()
    onclick?.(event)
    navigate(to)
  }}
>
  {@render children()}
</a>
