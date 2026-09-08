import { useSearchParams } from "react-router-dom"

import { isPeriod, type Period } from "@/data/mock"

/**
 * 屏幕状态：由 URL 查询串驱动，供截图矩阵（tools/shoot.mjs）与人工审查复现。
 *   ?state=loading|empty|error|success（各屏可自定义合法值；默认取 defaults[0]）
 *   ?period=day|week|month           ?open=<overlay id>        ?toast=<id>
 *   ?alert=invalid|locked|network（login error 态的 Alert 变体）
 * 页面只读这里的返回值决定渲染哪种状态，不再各自解析 location。
 */
export function useScreenState<S extends string>(states: readonly S[]) {
  const [params, setParams] = useSearchParams()
  const raw = params.get("state")
  const state: S = raw && (states as readonly string[]).includes(raw) ? (raw as S) : states[0]
  const period: Period = isPeriod(params.get("period")) ? (params.get("period") as Period) : "month"
  const open = params.get("open")
  const toast = params.get("toast")
  const alert = params.get("alert")
  const hold = params.has("hold")

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k)
      else next.set(k, v)
    }
    setParams(next, { replace: true })
  }

  return { state, period, open, toast, alert, hold, set }
}
