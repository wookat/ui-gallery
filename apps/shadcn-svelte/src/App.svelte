<script lang="ts">
  import type { Component } from "svelte"
  import { currentPath } from "$lib/router.svelte"
  import AppShell from "$lib/layouts/AppShell.svelte"
  import Login from "./routes/Login.svelte"
  import Dashboard from "./routes/Dashboard.svelte"
  import Orders from "./routes/Orders.svelte"
  import Form from "./routes/Form.svelte"
  import Settings from "./routes/Settings.svelte"
  import Components from "./routes/Components.svelte"
  import Landing from "./routes/Landing.svelte"
  import Chat from "./routes/Chat.svelte"

  const pages: Record<string, Component> = {
    "/": Dashboard,
    "/orders": Orders,
    "/form": Form,
    "/settings": Settings,
    "/components": Components,
    "/chat": Chat,
  }
  const page = $derived(pages[currentPath.value] ?? Dashboard)
</script>

{#if currentPath.value === "/login"}
  <Login />
{:else if currentPath.value === "/landing"}
  <Landing />
{:else}
  <AppShell><svelte:component this={page} /></AppShell>
{/if}
