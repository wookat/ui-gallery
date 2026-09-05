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

export const StatusBadge = (props: { value: string }) => h(Badge, { variant: statusVariant(props.value) }, () => props.value)
export const SectionDivider = (props: { label: string }) => h('div', { class: 'flex items-center gap-3 text-xs text-muted-foreground' }, [h(Separator, { class: 'flex-1' }), h('span', props.label), h(Separator, { class: 'flex-1' })])
