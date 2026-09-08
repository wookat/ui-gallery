import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon, MinusIcon, XIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/badge"

type PricingCardProps = React.ComponentProps<typeof Card> & {
  name: string
  /** 已格式化价格（formatCurrencyWhole）与后缀（content pricing.perMonth / perYear） */
  price: string
  suffix: string
  /** 副价（年付折合月价等） */
  note?: React.ReactNode
  features: readonly { label: string; included: boolean }[]
  /** 包含 / 不包含 的视觉隐藏文字 */
  featureLabels: { included: string; excluded: string }
  /** 不含项图标：components 稿横杠（默认）/ settings 稿叉 */
  excludedIcon?: "minus" | "x"
  recommended?: boolean
  recommendedLabel?: string
  current?: boolean
  action: React.ReactNode
}

/**
 * 定价卡：hifi components .plan —— Card 骨架、块间 space.4；recommended 时 primary 描边 + hairline 外圈 + 顶部角标（[data-pricing-badge]，left 默认 space.6 = Card 内距，内距改小时由调用方一并覆盖）；
 * 价格 display 字阶；特性行勾 / 横杠（不含项 fg-muted）；动作插槽 action 全宽贴底。
 */
function PricingCard({ name, price, suffix, note, features, featureLabels, excludedIcon = "minus", recommended, recommendedLabel, current, action, className, ...props }: PricingCardProps) {
  const Excluded = excludedIcon === "x" ? XIcon : MinusIcon
  return (
    <Card
      data-slot="pricing-card"
      data-recommended={recommended || undefined}
      data-current={current || undefined}
      className={cn("relative flex flex-col gap-4", recommended && "border-primary shadow-[0_0_0_var(--border-width-hairline)_var(--color-role-primary)]", className)}
      {...props}
    >
      {recommended && recommendedLabel ? (
        <Tag tone="info" dot={false} data-pricing-badge="" className="absolute -top-3 left-6">
          {recommendedLabel}
        </Tag>
      ) : null}
      <h3 className="text-role-title">{name}</h3>
      <div>
        <p className="flex flex-wrap items-baseline gap-1">
          <span className="text-role-display tabular-nums">{price}</span>
          <span className="text-role-body text-fg-muted">{suffix}</span>
        </p>
        {note ? <p className="min-h-[calc(var(--font-size-xs)*var(--font-line-height-snug))] text-role-caption text-fg-muted">{note}</p> : null}
      </div>
      <ul className="flex flex-1 flex-col gap-2">
        {features.map((f) => (
          <li key={f.label} className={cn("flex items-start gap-2 text-role-body [&_svg]:mt-[calc(var(--space-1)/2)] [&_svg]:size-icon-sm [&_svg]:shrink-0", f.included ? "[&_svg]:text-success" : "text-fg-muted [&_svg]:text-fg-disabled")}>
            {f.included ? <CheckIcon aria-hidden /> : <Excluded aria-hidden />}
            <span className="sr-only">{f.included ? featureLabels.included : featureLabels.excluded}</span>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>
      <div className="[&>*]:w-full">{action}</div>
    </Card>
  )
}

export { PricingCard, type PricingCardProps }
