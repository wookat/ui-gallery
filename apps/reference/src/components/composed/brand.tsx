import { cn } from "@/lib/cn"

/**
 * 品牌图形标：primary 底（radius.md）+ on-primary 线条几何图（无位图、无第三方商标）。
 * 三份 hifi 的图形不同：login .brand .mark 为三横线（viewBox 32、stroke 2.5）；dashboard .brand-mark 为屋形（viewBox 24、icon-md）；
 * landing .brand-mark 为「A」形实心路径（viewBox 24、icon-md、fill）。
 */
type BrandMarkProps = { className?: string; variant?: "lines" | "house" | "a" }

function BrandMark({ className, variant = "lines" }: BrandMarkProps) {
  return (
    <span aria-hidden data-slot="brand-mark" className={cn("grid size-avatar-md shrink-0 place-items-center rounded-md bg-primary text-on-primary", className)}>
      {variant === "a" ? (
        <svg viewBox="0 0 24 24" className="size-icon-md" fill="currentColor">
          <path d="M12 3 3 19h6l3-5 3 5h6L12 3Zm0 6.5L14.2 13H9.8L12 9.5Z" />
        </svg>
      ) : variant === "house" ? (
        <svg viewBox="0 0 24 24" className="size-icon-md" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 11 12 4l8 7" />
          <path d="M6 10v9h12v-9" />
          <path d="M9 19v-5h6v5" />
        </svg>
      ) : (
        <svg viewBox="0 0 32 32" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M9 11h14M9 16h9M9 21h14" />
        </svg>
      )}
    </span>
  )
}

export { BrandMark }
