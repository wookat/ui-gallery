import { cn } from "cn"

/** 品牌图形标：hifi login .brand .mark —— primary 底（radius.md）+ on-primary 三横线几何图（无位图、无第三方商标） */
function BrandMark({ className }: { className?: string }) {
  return (
    <span aria-hidden data-slot="brand-mark" className={cn("grid size-avatar-md shrink-0 place-items-center rounded-md bg-primary text-on-primary", className)}>
      <svg viewBox="0 0 32 32" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M9 11h14M9 16h9M9 21h14" />
      </svg>
    </span>
  )
}

export { BrandMark }
