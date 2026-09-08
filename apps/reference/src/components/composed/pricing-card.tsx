import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon, MinusIcon } from "lucide-react"

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
  recommended?: boolean
  recommendedLabel?: string
  current?: boolean
  action: React.ReactNode
}

/** 定价卡：hifi .plan —— Card 骨架，recommended 时 primary 描边 + 顶部角标；价格 display 字阶；特性行勾 / 横杠（不含项 fg-muted） */
function PricingCard({ name, price, suffix, note, features, featureLabels, recommended, recommendedLabel, current, action, className, ...props }: PricingCardProps) {
  return (
    <Card
      data-slot="pricing-card"
      data-recommended={recommended || undefined}
      data-current={current || undefined}
      className={cn("relative flex flex-col gap-6", recommended && "border-primary shadow-md", className)}
      {...props}
    >
      {recommended && recommendedLabel ? (
        <Tag tone="info" dot={false} className="absolute -top-3 left-6">
          {recommendedLabel}
        </Tag>
      ) : null}
      <header className="flex flex-col gap-2">
        <h3 className="text-role-title">{name}</h3>
        <p className="flex items-baseline gap-1">
          <span className="text-role-display tabular-nums">{price}</span>
          <span className="text-role-body text-fg-muted">{suffix}</span>
        </p>
        {note ? <p className="text-role-caption text-fg-muted">{note}</p> : null}
      </header>
      <ul className="flex flex-1 flex-col gap-2">
        {features.map((f) => (
          <li key={f.label} className={cn("flex items-start gap-2 text-role-body [&_svg]:mt-[calc((var(--font-size-md)*var(--font-line-height-body)-var(--size-icon-sm))/2)] [&_svg]:size-icon-sm [&_svg]:shrink-0", f.included ? "[&_svg]:text-success" : "text-fg-muted [&_svg]:text-fg-disabled")}>
            {f.included ? <CheckIcon aria-hidden /> : <MinusIcon aria-hidden />}
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
