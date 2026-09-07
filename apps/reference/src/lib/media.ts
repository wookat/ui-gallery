import * as React from "react"

/** 读根元素上的令牌变量（design/tokens.css 输出到 :root），如 --breakpoint-md / --motion-skeleton */
export const tokenValue = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

export const tokenMs = (name: string) => parseFloat(tokenValue(name)) || 0

export const tokenPx = tokenMs

/** 元素内容宽度（ResizeObserver），用于按 hifi 算法按宽度筛 x 轴标签 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [width, setWidth] = React.useState(0)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

/** 与 hifi 同语义的「≤ 断点」媒体查询：useMaxWidth("--breakpoint-md") ⇔ @media (max-width: 768px) */
export function useMaxWidth(breakpointToken: string) {
  const query = React.useMemo(() => `(max-width: ${tokenValue(breakpointToken)})`, [breakpointToken])
  const subscribe = React.useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", cb)
      return () => mql.removeEventListener("change", cb)
    },
    [query],
  )
  return React.useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}
