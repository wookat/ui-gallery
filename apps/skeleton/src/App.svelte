<script lang="ts">
  import { Toast } from "@skeletonlabs/skeleton-svelte"
  import { router } from "./lib/router.svelte"
  import { toaster } from "./lib/toaster"
  import AppShell from "./layouts/AppShell.svelte"
  import LoginPage from "./pages/Login.svelte"
  import DashboardPage from "./pages/Dashboard.svelte"
  import OrdersPage from "./pages/Orders.svelte"
  import FormPage from "./pages/Form.svelte"
  import SettingsPage from "./pages/Settings.svelte"
  import ComponentsPage from "./pages/Components.svelte"
  import LandingPage from "./pages/Landing.svelte"
  import ChatPage from "./pages/Chat.svelte"

  const shellPages = {
    "/": DashboardPage,
    "/orders": OrdersPage,
    "/form": FormPage,
    "/settings": SettingsPage,
    "/components": ComponentsPage,
    "/chat": ChatPage,
  } as const

  const path = $derived(router.path)
  const ShellPage = $derived(path in shellPages ? shellPages[path as keyof typeof shellPages] : null)
</script>

{#if path === "/login"}
  <LoginPage />
{:else if path === "/landing"}
  <LandingPage />
{:else if ShellPage}
  <AppShell>
    <ShellPage />
  </AppShell>
{:else}
  <main class="min-h-screen grid place-items-center p-6">
    <div class="card preset-tonal p-8 text-center space-y-4">
      <h1 class="h3">404</h1>
      <a class="btn preset-filled" href={router.href("/")}>返回仪表盘</a>
    </div>
  </main>
{/if}

<Toast.Group {toaster}>
  {#snippet children(toast)}
    <Toast {toast}>
      <Toast.Message>
        <Toast.Title>{toast.title}</Toast.Title>
        <Toast.Description>{toast.description}</Toast.Description>
      </Toast.Message>
      <Toast.CloseTrigger />
    </Toast>
  {/snippet}
</Toast.Group>
