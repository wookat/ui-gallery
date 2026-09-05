import type { ReactNode } from "react"
import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core"

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
      <Stack gap={4}>
        <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: "0.2em" }}>ACME CONSOLE</Text>
        <Title order={1} size="h2">{title}</Title>
        {description ? <Text size="sm" c="dimmed">{description}</Text> : null}
      </Stack>
      {action}
    </Group>
  )
}

export function SectionCard({ title, description, children, right }: { title: string; description?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <Card withBorder radius="md" padding="lg">
      <Card.Section withBorder inheritPadding py="sm" mb="md">
        <Group justify="space-between" wrap="nowrap">
          <div>
            <Text fw={600}>{title}</Text>
            {description ? <Text size="sm" c="dimmed">{description}</Text> : null}
          </div>
          {right}
        </Group>
      </Card.Section>
      {children}
    </Card>
  )
}

export const statusColor = (value: string) =>
  ["paid", "shipped", "active", "done", "owner"].includes(value) ? "green" : ["pending", "due", "admin"].includes(value) ? "yellow" : ["refunded", "failed", "cancelled"].includes(value) ? "red" : "gray"

export function StatusBadge({ value }: { value: string }) {
  return <Badge variant="light" color={statusColor(value)}>{value}</Badge>
}

export const money = (amount: number, currency = "CNY") =>
  new Intl.NumberFormat("zh-CN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount)
