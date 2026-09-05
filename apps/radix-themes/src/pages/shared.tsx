import type { ReactNode } from "react"
import { Badge, Flex, Heading, Text } from "@radix-ui/themes"

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <Flex align="start" justify="between" gap="4" mb="5" wrap="wrap"><div><Heading size="7">{title}</Heading>{description ? <Text color="gray" as="p" mt="1">{description}</Text> : null}</div>{action}</Flex>
}

export function StatusBadge({ value }: { value: string }) {
  const color = value === "paid" || value === "shipped" ? "green" : value === "failed" || value === "refunded" ? "red" : "amber"
  return <Badge color={color}>{value}</Badge>
}

export function FieldLabel({ children, required = false }: { children: ReactNode; required?: boolean }) {
  return <Text as="label" size="2" weight="medium">{children}{required ? <Text color="red"> *</Text> : null}</Text>
}

export function Help({ children }: { children: ReactNode }) {
  return <Text size="1" color="gray">{children}</Text>
}
