import { Navigate, useLocation } from "react-router-dom"

/** 旧路由 /kitchen-sink → /components（content components.redirectNotice 由 ?from=kitchen-sink 触发）；保留目录只为静态托管落一份 index.html */
export default function KitchenSinkRedirect() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  params.set("from", "kitchen-sink")
  return <Navigate to={{ pathname: "/components", search: `?${params}` }} replace />
}
