/** 兼容 `?icon=` 与仓库既有 `?icons=`：packages/icons-react 只读 `icons`，这里把 `icon` 同步过去 */
export function normalizeIconParam() {
  const url = new URL(window.location.href)
  const icon = url.searchParams.get("icon")
  if (icon && !url.searchParams.has("icons")) {
    url.searchParams.set("icons", icon)
    window.history.replaceState(window.history.state, "", url)
  }
}
