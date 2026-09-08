import * as React from "react"
import { cn } from "@/lib/cn"
import { Slider as SliderPrimitive } from "radix-ui"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** 每个滑块的可访问名（与 value 数量一致） */
  thumbLabels: readonly string[]
}

/** 滑块：hifi .slider —— size.hit 高的可拖区、size.track 轨道 neutral-soft、区间 primary、滑块 icon.lg 圆 + primary 粗边 */
function Slider({ className, thumbLabels, ...props }: SliderProps) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex h-hit w-full max-w-form-max touch-none items-center select-none data-[disabled]:disabled-look data-[orientation=vertical]:h-full data-[orientation=vertical]:w-hit data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track data-slot="slider-track" className="relative h-track w-full grow overflow-hidden rounded-full bg-neutral-soft data-[orientation=vertical]:h-full data-[orientation=vertical]:w-track">
        <SliderPrimitive.Range data-slot="slider-range" className="absolute h-full rounded-full bg-primary data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {thumbLabels.map((label) => (
        <SliderPrimitive.Thumb
          key={label}
          data-slot="slider-thumb"
          aria-label={label}
          className="block size-icon-lg rounded-full border-(length:--border-width-focus) border-primary bg-surface shadow-sm transition-transform duration-(--motion-fast) ease-std after:absolute after:top-1/2 after:left-1/2 after:size-hit after:-translate-1/2 after:content-[''] hover:scale-110 focus-visible:scale-110"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

/** 滑块两端数值：hifi .slider-values */
function SliderValues({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="slider-values" className={cn("flex w-full max-w-form-max justify-between text-role-caption text-fg-muted tabular-nums", className)} {...props} />
}

export { Slider, SliderValues, type SliderProps }
