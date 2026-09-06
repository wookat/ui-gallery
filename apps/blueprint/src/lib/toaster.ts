import type { ReactNode } from "react"
import { OverlayToaster, type Intent, type MaybeElement, type Toaster } from "@blueprintjs/core"

let instance: Promise<Toaster> | null = null

export function toaster() {
  instance ??= OverlayToaster.createAsync({ position: "top" })
  return instance
}

export async function toast(message: ReactNode, intent: Intent = "success", extra: { action?: { text: string; onClick?: () => void }; icon?: MaybeElement } = {}) {
  ;(await toaster()).show({ message, intent, ...extra })
}
