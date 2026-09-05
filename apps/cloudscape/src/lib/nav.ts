import { useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const BASENAME = "/apps/cloudscape"

type FollowEvent = CustomEvent<{ href?: string; external?: boolean }>

export function useAppNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const search = location.search
  const href = useCallback((path: string) => `${BASENAME}${path}${search}`, [search])
  const go = useCallback((path: string) => navigate(`${path}${search}`), [navigate, search])
  const follow = useCallback(
    (event: FollowEvent) => {
      const target = event.detail.href
      if (!target || event.detail.external) return
      event.preventDefault()
      const path = target.split("?")[0].replace(BASENAME, "") || "/"
      go(path)
    },
    [go]
  )
  return { href, follow, go, pathname: location.pathname }
}
