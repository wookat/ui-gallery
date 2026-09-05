import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "@/layouts/app-shell"
import { ComponentsPage } from "@/pages/components"
import { ChatPage } from "@/pages/chat"
import { DashboardPage } from "@/pages/dashboard"
import { FormPage } from "@/pages/form"
import { LandingPage } from "@/pages/landing"
import { LoginPage } from "@/pages/login"
import { OrdersPage } from "@/pages/orders"
import { SettingsPage } from "@/pages/settings"

function useUrlSettings() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const explicit = params.get("theme")
    const dark = explicit === "dark" || (!explicit && window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light")
    const fonts: Record<string, string> = {
      inter: "'Inter Variable', sans-serif",
      geist: "'Geist Variable', sans-serif",
      "noto-sans-sc": "'Noto Sans SC Variable', sans-serif",
      "lxgw-wenkai": "'LXGW WenKai Screen', serif",
    }
    const font = fonts[params.get("font") ?? ""]
    if (font) document.documentElement.style.setProperty("--bs-body-font-family", font)
    else document.documentElement.style.removeProperty("--bs-body-font-family")
  }, [])
}

function App() {
  useUrlSettings()
  return <BrowserRouter basename="/apps/react-bootstrap"><Routes><Route path="/login" element={<LoginPage />} /><Route path="/landing" element={<LandingPage />} /><Route element={<AppShell><DashboardPage /></AppShell>} path="/" /><Route element={<AppShell><OrdersPage /></AppShell>} path="/orders" /><Route element={<AppShell><FormPage /></AppShell>} path="/form" /><Route element={<AppShell><SettingsPage /></AppShell>} path="/settings" /><Route element={<AppShell><ComponentsPage /></AppShell>} path="/components" /><Route element={<AppShell><ChatPage /></AppShell>} path="/chat" /><Route path="*" element={<Navigate to="/" replace />} /></Routes></BrowserRouter>
}

export default App
