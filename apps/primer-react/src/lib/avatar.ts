/**
 * Generated initials avatars (inline SVG data URI) so Avatar/AvatarGroup render a visible
 * placeholder without shipping binary images or hitting the network. Colors are taken from the
 * Primer primitives base scale so they read correctly in both color modes.
 */
const palette = ["#0969da", "#1a7f37", "#9a6700", "#bc4c00", "#8250df", "#bf3989", "#cf222e", "#57606a"]

function hash(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0
  return h
}

function initials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return "?"
  if (/^[\u4e00-\u9fa5]/.test(trimmed)) return trimmed.slice(0, 1)
  const parts = trimmed.split(/[\s._-]+/).filter(Boolean)
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join("")
}

export function avatarFor(name: string): string {
  const color = palette[hash(name) % palette.length]
  const text = initials(name)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
    `<rect width="96" height="96" fill="${color}"/>` +
    `<text x="48" y="54" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Noto Sans SC, sans-serif" font-size="${text.length > 1 ? 36 : 44}" font-weight="600" fill="#ffffff">${text}</text>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/** Default avatar for the signed-in demo user. */
export const avatarSrc = avatarFor("UI Gallery")

/** Generic square placeholder used by the Image demo card. */
export function placeholderImage(label: string, width = 640, height = 360): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0969da"/><stop offset="1" stop-color="#8250df"/></linearGradient></defs>` +
    `<rect width="${width}" height="${height}" fill="url(#g)"/>` +
    `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Inter, Noto Sans SC, sans-serif" font-size="28" fill="#ffffff">${label}</text>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
