/* eslint-disable solid/prefer-for */
import { Breadcrumbs as KobalteBreadcrumbs } from "@kobalte/core/breadcrumbs"
export function Breadcrumbs(props: { items: string[] }) { return <KobalteBreadcrumbs class="flex items-center gap-2 text-sm text-zinc-500">{props.items.map((item, index) => <><KobalteBreadcrumbs.Link href="#">{item}</KobalteBreadcrumbs.Link>{index < props.items.length - 1 ? <KobalteBreadcrumbs.Separator>/</KobalteBreadcrumbs.Separator> : null}</>)}</KobalteBreadcrumbs> }
