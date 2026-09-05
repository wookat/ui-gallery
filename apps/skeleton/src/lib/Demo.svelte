<script lang="ts">
  import type { Snippet } from "svelte"
  let { id, title, status, note, children }: { id: string; title: string; status: "implemented" | "composed" | "missing" | "native"; note?: string; children?: Snippet } = $props()
  const cls: Record<typeof status, string> = {
    implemented: "preset-tonal-success",
    composed: "preset-tonal-warning",
    missing: "preset-tonal-error",
    native: "preset-tonal-secondary",
  }
</script>

<section {id} class="card bg-surface-50-950 border border-surface-200-800 p-4 space-y-3 scroll-mt-24 min-w-0" aria-labelledby={`${id}-title`}>
  <header class="flex flex-wrap items-center justify-between gap-2">
    <h2 id={`${id}-title`} class="h6">{title}</h2>
    <span class="badge {cls[status]}">{status}</span>
  </header>
  {#if note}<p class="text-xs opacity-60">{note}</p>{/if}
  {#if children}
    <div class="space-y-3 min-w-0">{@render children()}</div>
  {/if}
</section>
