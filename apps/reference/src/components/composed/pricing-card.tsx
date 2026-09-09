import * as React from "react"
import { cn } from "@/lib/cn"
import { CheckIcon, MinusIcon, XIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/badge"

type PricingCardProps = React.ComponentProps<typeof Card> & {
  name: string
  /** 计划一句话说明（landing .plan-desc） */
  description?: React.ReactNode
  /** 推荐角标位置：start 贴左（settings）· center 顶部居中（landing） */
  badgeAlign?: "start" | "center"
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
 * 定价卡：hifi .plan —— Card 骨架，recommended 时 primary 描边 + 顶部角标（[data-pricing-badge]，left 默认 space.6 = Card 内距，内距改小时由调用方一并覆盖）；
 * 价格 display 字阶；特性行勾 / 横杠（不含项 fg-muted）；动作插槽 action 全宽贴底。
 * 默认节奏按 landing 稿（块间 space.6、header 内 space.2）；settings 稿的 space.4 节奏（价格与副价紧贴）由调用方 className 覆盖（gap-4 [&_header]:gap-0 [&_header>p:first-of-type]:mt-4）。
 */
function PricingCard({ name, description, badgeAlign = "start", price, suffix, note, features, featureLabels, excludedIcon = "minus", recommended, recommendedLabel, current, action, className, ...props }: PricingCardProps) {
  const Excluded = excludedIcon === "x" ? XIcon : MinusIcon
  return (
    <Card
      data-slot="pricing-card"
      data-recommended={recommended || undefined}
      data-current={current || undefined}
      className={cn("relative flex flex-col gap-6", recommended && "border-primary shadow-md", className)}
      {...props}
    >
      {recommended && recommendedLabel ? (
        <Tag tone="info" dot={false} data-pricing-badge="" className={cn("absolute -top-3", badgeAlign === "center" ? "left-1/2 -translate-x-1/2" : "left-6")}>
          {recommendedLabel}
        </Tag>
      ) : null}
      <header className="flex flex-col gap-2">
        <h3 className="text-role-title">{name}</h3>
        {description ? <p className="text-role-body text-fg-muted">{description}</p> : null}
        <p className="flex flex-wrap items-baseline gap-1">
          <span className="text-role-display tabular-nums">{price}</span>
          <span className="text-role-body text-fg-muted">{suffix}</span>
        </p>
        {note ? <p className="min-h-[calc(var(--font-size-xs)*var(--font-line-height-snug))] text-role-caption text-fg-muted">{note}</p> : null}
      </header>
      <ul className="flex flex-1 flex-col gap-2">
        {features.map((f) => (
          <li key={f.label} className={cn("flex items-start gap-2 text-role-body [&_svg]:mt-[calc((var(--font-size-md)*var(--font-line-height-body)-var(--size-icon-sm))/2)] [&_svg]:size-icon-sm [&_svg]:shrink-0", f.included ? "[&_svg]:text-success" : "text-fg-muted [&_svg]:text-fg-disabled")}>
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
