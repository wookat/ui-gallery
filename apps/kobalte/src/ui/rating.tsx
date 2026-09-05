import { Rating as KobalteRating } from "@kobalte/core/rating"
import { Icon } from "@/icons"

export function Rating(props: { value?: number; defaultValue?: number; allowHalf?: boolean; readOnly?: boolean; disabled?: boolean; label?: string; size?: number }) {
  return (
    <KobalteRating value={props.value} defaultValue={props.defaultValue} allowHalf={props.allowHalf} readOnly={props.readOnly} disabled={props.disabled} aria-label={props.label ?? "评分"} class="grid gap-1">
      <KobalteRating.Label class="sr-only">{props.label ?? "评分"}</KobalteRating.Label>
      <KobalteRating.Control class="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <KobalteRating.Item aria-label={`${index + 1} 星`} class="text-zinc-300 dark:text-zinc-600 data-[checked]:text-amber-500 data-[highlighted]:text-amber-500 data-[half]:text-amber-500">
            <KobalteRating.ItemControl>
              <Icon name="star" size={props.size ?? 20} class="fill-current" />
            </KobalteRating.ItemControl>
          </KobalteRating.Item>
        ))}
      </KobalteRating.Control>
      <KobalteRating.HiddenInput />
    </KobalteRating>
  )
}
