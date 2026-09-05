import { Image as KobalteImage } from "@kobalte/core/image"

export function Avatar(props: { name: string; size?: "sm" | "md" | "lg"; class?: string }) {
  const size = (value?: "sm" | "md" | "lg") => value === "lg" ? "size-12 text-base" : value === "sm" ? "size-6 text-[10px]" : "size-8 text-xs"
  return <KobalteImage class={`grid ${size(props.size)} shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-200 font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100 ${props.class ?? ""}`}><KobalteImage.Fallback>{props.name.slice(0, 1)}</KobalteImage.Fallback></KobalteImage>
}
