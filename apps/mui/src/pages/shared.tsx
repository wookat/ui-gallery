import type { ReactNode } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
} from "@mui/material"
import type { CardProps } from "@mui/material"
import { FlexStack as Stack } from "@/components/flex-stack"

export const STATUS_LABELS: Record<string, string> = {
  paid: "已支付",
  pending: "待支付",
  shipped: "已发货",
  failed: "失败",
  refunded: "已退款",
  active: "活跃",
  due: "待付",
  overdue: "逾期",
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ sm: "flex-end" }}
      justifyContent="space-between"
    >
      <Box>
        <Typography variant="overline" color="text.secondary">
          ACME CONSOLE
        </Typography>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {description ? (
          <Typography color="text.secondary">{description}</Typography>
        ) : null}
      </Box>
      {action}
    </Stack>
  )
}

export function SectionCard({
  title,
  description,
  children,
  ...props
}: { title: string; description?: string; children: ReactNode } & CardProps) {
  return (
    <Card {...props}>
      <CardHeader title={title} subheader={description} />
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function StatusBadge({ value }: { value: string }) {
  const color = ["paid", "shipped", "active"].includes(value)
    ? "success"
    : ["pending", "due"].includes(value)
      ? "warning"
      : "error"
  return (
    <Chip
      size="small"
      label={STATUS_LABELS[value] ?? value}
      color={color}
      variant="outlined"
    />
  )
}
