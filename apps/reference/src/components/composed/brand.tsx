import { cn } from "@/lib/cn"

/** 品牌图形标：hifi .brand-mark —— primary 底 + on-primary 线条几何图（无位图、无第三方商标） */
function BrandMark({ className }: { className?: string }) {
  return (
    <span aria-hidden data-slot="brand-mark" className={cn("grid size-avatar-md shrink-0 place-items-center rounded-md bg-primary text-on-primary", className)}>
      <svg viewBox="0 0 24 24" className="size-icon-md" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17 12 5l8 12" />
        <path d="M8 17h8" />
      </svg>
    </span>
  )
}

export { BrandMark }
