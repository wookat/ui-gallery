import { BASENAME } from "./settings"

export type Route = "/login" | "/" | "/orders" | "/form" | "/settings" | "/components" | "/landing" | "/chat"
export const ROUTES: Route[] = ["/login", "/", "/orders", "/form", "/settings", "/components", "/landing", "/chat"]

export function currentRoute(): Route {
  let path = window.location.pathname
  if (path.startsWith(BASENAME)) path = path.slice(BASENAME.length)
  if (path.endsWith("/") && path.length > 1) path = path.slice(0, -1)
  if (path === "" || path === "/index.html") path = "/"
  return (ROUTES as string[]).includes(path) ? (path as Route) : "/"
}

export function href(route: string): string {
  return `${BASENAME}${route === "/" ? "/" : route}${window.location.search}`
}

export function navigate(route: string) {
  window.history.pushState(null, "", href(route))
  window.dispatchEvent(new PopStateEvent("popstate"))
}

export function interceptLinks(root: HTMLElement) {
  root.addEventListener("click", (event) => {
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[data-link]")
    if (!anchor) return
    event.preventDefault()
    navigate(anchor.dataset.link ?? "/")
  })
}
