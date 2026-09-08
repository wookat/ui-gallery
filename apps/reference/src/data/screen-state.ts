import * as React from "react"
import { useLocation, useSearchParams } from "react-router-dom"

import { isPeriod, type Period } from "@/data/mock"

type Patch = Record<string, string | null>

/**
 * 屏幕状态：由 URL 查询串驱动，供截图矩阵（tools/shoot.mjs）与人工审查复现。
 *   ?state=loading|empty|error|success（各屏可自定义合法值；默认取 defaults[0]）
 *   ?period=day|week|month           ?open=<overlay id>        ?toast=<id>
 *   ?alert=invalid|locked|network（login error 态的 Alert 变体）
 * 页面只读这里的返回值决定渲染哪种状态，不再各自解析 location。
 *
 * set(patch) 在同一事件内可连续调用：后一次基于前一次的结果合并，而不是各自基于渲染时的旧 params 互相覆盖
 * （如菜单项 onSelect 打开抽屉后 Radix 紧接着 onOpenChange(false) 关菜单）。patch 也可为函数，接收合并后的当前参数。
 */
export function useScreenState<S extends string>(states: readonly S[]) {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const pending = React.useRef<{ key: string; next: URLSearchParams } | null>(null)
  const raw = params.get("state")
  const state: S = raw && (states as readonly string[]).includes(raw) ? (raw as S) : states[0]
  const period: Period = isPeriod(params.get("period")) ? (params.get("period") as Period) : "month"
  const open = params.get("open")
  const toast = params.get("toast")
  const alert = params.get("alert")
  const hold = params.has("hold")

  const set = (patch: Patch | ((current: URLSearchParams) => Patch)) => {
    const base = pending.current?.key === location.key ? pending.current.next : params
    const next = new URLSearchParams(base)
    const entries = typeof patch === "function" ? patch(new URLSearchParams(next)) : patch
    for (const [k, v] of Object.entries(entries)) {
      if (v === null) next.delete(k)
      else next.set(k, v)
    }
    pending.current = { key: location.key, next }
    setParams(next, { replace: true })
  }

  return { state, period, open, toast, alert, hold, set }
}
