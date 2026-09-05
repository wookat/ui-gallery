import { onMounted, onUnmounted, ref } from 'vue'

export type IconFamily = 'lucide' | 'tabler' | 'phosphor' | 'heroicons'
export type FontFamily = 'default' | 'inter' | 'geist' | 'noto-sans-sc' | 'lxgw-wenkai'

const fonts: Record<Exclude<FontFamily, 'default'>, string> = {
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  'noto-sans-sc': "'Noto Sans SC Variable', sans-serif",
  'lxgw-wenkai': "'LXGW WenKai Screen', serif",
}

function readParams() {
  const params = new URLSearchParams(window.location.search)
  const theme = params.get('theme') === 'dark' ? 'dark' : 'light'
  const fontParam = params.get('font')
  const font: FontFamily = fontParam && ['default', 'inter', 'geist', 'noto-sans-sc', 'lxgw-wenkai'].includes(fontParam)
    ? fontParam as FontFamily
    : 'default'
  const iconParam = params.get('icons') ?? params.get('icon')
  const icon: IconFamily = iconParam && ['lucide', 'tabler', 'phosphor', 'heroicons'].includes(iconParam)
    ? iconParam as IconFamily
    : 'lucide'
  return { theme, font, icon }
}

export function useGalleryParams() {
  const iconFamily = ref<IconFamily>('lucide')

  const apply = () => {
    const { theme, font, icon } = readParams()
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme !== 'dark')
    if (font === 'default') {
      document.documentElement.style.removeProperty('--font-sans')
    } else {
      document.documentElement.style.setProperty('--font-sans', fonts[font])
    }
    iconFamily.value = icon
  }

  onMounted(() => {
    apply()
    window.addEventListener('popstate', apply)
  })
  onUnmounted(() => window.removeEventListener('popstate', apply))
  apply()
  return { iconFamily, apply }
}

export function currentIconFamily(): IconFamily {
  if (typeof window === 'undefined') return 'lucide'
  const params = new URLSearchParams(window.location.search)
  const value = params.get('icons') ?? params.get('icon')
  return ['lucide', 'tabler', 'phosphor', 'heroicons'].includes(value ?? '')
    ? value as IconFamily
    : 'lucide'
}
