const basename = "/apps/shadcn-svelte"

function readPath() {
  const path = window.location.pathname
  return path.startsWith(basename) ? path.slice(basename.length) || "/" : path
}

export const currentPath = $state({ value: readPath() })

export function navigate(to: string) {
  const [path, query = ""] = to.split("?")
  const nextPath = path.startsWith("/") ? path : `/${path}`
  const search = query || window.location.search.slice(1)
  window.history.pushState({}, "", `${basename}${nextPath}${search ? `?${search}` : ""}`)
  currentPath.value = nextPath
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    currentPath.value = readPath()
  })
}

export function href(to: string) {
  return `${basename}${to}`
}
