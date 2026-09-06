import { Rating as KobalteRating } from "@kobalte/core/rating"
import { Icon } from "@/icons"

export function Rating(props: { value?: number; defaultValue?: number; onChange?: (value: number) => void; allowHalf?: boolean; readOnly?: boolean; disabled?: boolean; label?: string; size?: number }) {
  return (
    <KobalteRating value={props.value} defaultValue={props.defaultValue} onChange={props.onChange} allowHalf={props.allowHalf} readOnly={props.readOnly} disabled={props.disabled} aria-label={props.label ?? "评分"} class="grid gap-1">
      <KobalteRating.Label class="sr-only">{props.label ?? "评分"}</KobalteRating.Label>
      <KobalteRating.Control class="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <KobalteRating.Item aria-label={`${index + 1} 星`} class="group text-zinc-300 dark:text-zinc-600">
            <KobalteRating.ItemControl class="relative block">
              <Icon name="star" size={props.size ?? 20} class="fill-current" />
              <span class="absolute inset-0 hidden overflow-hidden text-amber-500 group-data-[checked]:block group-data-[highlighted]:block group-data-[half]:block group-data-[half]:w-1/2 dark:text-amber-400" aria-hidden="true">
                <Icon name="star" size={props.size ?? 20} class="fill-current" />
              </span>
            </KobalteRating.ItemControl>
          </KobalteRating.Item>
        ))}
      </KobalteRating.Control>
      <KobalteRating.HiddenInput />
    </KobalteRating>
  )
}
