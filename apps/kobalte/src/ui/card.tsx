import type { ParentProps } from "solid-js"

export function Card(props: ParentProps<{ class?: string; id?: string }>) { return <section id={props.id} class={`min-w-0 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${props.class ?? ""}`}>{props.children}</section> }
export function CardHeader(props: ParentProps<{ class?: string }>) { return <header class={`space-y-1 p-5 ${props.class ?? ""}`}>{props.children}</header> }
export function CardTitle(props: ParentProps<{ class?: string }>) { return <h2 class={`font-semibold tracking-tight ${props.class ?? ""}`}>{props.children}</h2> }
export function CardDescription(props: ParentProps<{ class?: string }>) { return <p class={`text-sm text-zinc-500 dark:text-zinc-400 ${props.class ?? ""}`}>{props.children}</p> }
export function CardContent(props: ParentProps<{ class?: string }>) { return <div class={`p-5 pt-0 ${props.class ?? ""}`}>{props.children}</div> }
export function CardFooter(props: ParentProps<{ class?: string }>) { return <footer class={`p-5 pt-0 ${props.class ?? ""}`}>{props.children}</footer> }
