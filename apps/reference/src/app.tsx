import type { ComponentType } from "react"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

/**
 * 文件式路由：src/pages/<id>/index.tsx 自动成为 /<id>；
 * 页面可 `export const path = "/"` 覆盖路径（如 dashboard）。新增屏幕不需要改这里。
 * 页面自行决定是否包在布局（如 AppShell）里，没有公共注册表。
 */
type PageModule = { default: ComponentType; path?: string }

const modules = import.meta.glob<PageModule>("./pages/*/index.tsx", { eager: true })

export const pages = Object.entries(modules)
  .map(([file, mod]) => {
    const id = file.match(/\.\/pages\/([^/]+)\/index\.tsx$/)?.[1]
    if (!id) throw new Error(`非法页面路径 ${file}`)
    return { id, path: mod.path ?? `/${id}`, Component: mod.default }
  })
  .sort((a, b) => a.path.localeCompare(b.path))

const fallback = pages.find((p) => p.path === "/") ?? pages[0]

const router = createBrowserRouter(
  [
    ...pages.map(({ path, Component }) => ({ path, element: <Component /> })),
    ...(fallback && fallback.path !== "/" ? [{ path: "/", element: <Navigate to={fallback.path} replace /> }] : []),
    { path: "*", element: <Navigate to={fallback?.path ?? "/"} replace /> },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") },
)

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        <RouterProvider router={router} />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}
