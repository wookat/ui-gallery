import { h, type VNode } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function statusVariant(value: string) {
  return ['paid', 'shipped', 'active'].includes(value) ? 'default' : ['pending', 'due'].includes(value) ? 'secondary' : 'destructive'
}

export const PageHeader = (props: { title: string; description?: string; action?: VNode }) => h('div', { class: 'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between' }, [
  h('div', { class: 'space-y-1' }, [
    h('p', { class: 'text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground' }, 'ACME CONSOLE'),
    h('h1', { class: 'text-3xl font-semibold tracking-tight' }, props.title),
    props.description ? h('p', { class: 'text-sm text-muted-foreground' }, props.description) : null,
  ]),
  props.action ?? null,
])

// 40px 热区：用透明边框撑开元素盒，背景裁切到 padding-box，视觉尺寸与库默认一致。
export const checkboxHit = '-mx-3 size-10 rounded-2xl border-[12px] border-transparent bg-clip-padding shadow-[inset_0_0_0_1px_var(--input)] data-checked:border-transparent data-checked:shadow-none aria-invalid:border-transparent aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)]'
export const switchHit = '-mx-[11px] data-[size=default]:h-10 data-[size=default]:w-[52px] border-x-[11px] border-y-[12px] border-transparent bg-clip-padding'

export const StatusBadge = (props: { value: string }) => h(Badge, { variant: statusVariant(props.value) }, () => props.value)
export const SectionDivider = (props: { label: string }) => h('div', { class: 'flex items-center gap-3 text-xs text-muted-foreground' }, [h(Separator, { class: 'flex-1' }), h('span', props.label), h(Separator, { class: 'flex-1' })])
