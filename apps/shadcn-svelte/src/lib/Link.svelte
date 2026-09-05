<script lang="ts">
  import { href, navigate } from "$lib/router.svelte"

  let {
    to,
    children,
    class: className = "",
    onclick,
  }: {
    to: string
    children: import("svelte").Snippet
    class?: string
    onclick?: (event: MouseEvent) => void
  } = $props()
</script>

<a
  href={href(to)}
  class={className}
  onclick={(event) => {
    event.preventDefault()
    onclick?.(event)
    navigate(to)
  }}
>
  {@render children()}
</a>
