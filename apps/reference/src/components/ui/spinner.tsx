import { cn } from "cn"
import { LoaderCircleIcon } from "lucide-react"

/** 加载指示：hifi .spinner —— 转速 = motion.slow × 3 */
function Spinner({ className, ...props }: React.ComponentProps<typeof LoaderCircleIcon>) {
  return (
    <LoaderCircleIcon
      role="status"
      aria-hidden
      data-slot="spinner"
      className={cn("size-icon-sm animate-spin [animation-duration:calc(var(--motion-slow)*3)]", className)}
      {...props}
    />
  )
}

export { Spinner }
