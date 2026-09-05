export const BASENAME = "/apps/skeleton"

function strip(pathname: string): string {
  const path = pathname.startsWith(BASENAME) ? pathname.slice(BASENAME.length) : pathname
  const clean = path.replace(/\/+$/, "")
  return clean === "" ? "/" : clean
}

class Router {
  path = $state(strip(window.location.pathname))

  constructor() {
    window.addEventListener("popstate", () => {
      this.path = strip(window.location.pathname)
    })
  }

  href(path: string): string {
    return `${BASENAME}${path === "/" ? "" : path}${window.location.search}`
  }

  navigate(path: string) {
    history.pushState({}, "", this.href(path))
    this.path = strip(window.location.pathname)
    window.scrollTo(0, 0)
  }
}

export const router = new Router()

export function link(node: HTMLAnchorElement) {
  const handler = (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.button !== 0) return
    const href = node.getAttribute("href")
    if (!href || !href.startsWith(BASENAME)) return
    event.preventDefault()
    router.navigate(strip(href.split(/[?#]/)[0]))
  }
  node.addEventListener("click", handler)
  return { destroy: () => node.removeEventListener("click", handler) }
}
