import { QRCode, type QrCodeProps } from "tdesign-react"
import { useThemeTokens } from "@/url-settings"

export function ThemedQRCode(props: QrCodeProps) {
  const tokens = useThemeTokens(["--td-text-color-primary", "--td-bg-color-container"])
  return <QRCode color={tokens["--td-text-color-primary"] || undefined} bgColor={tokens["--td-bg-color-container"] || undefined} {...props} />
}
