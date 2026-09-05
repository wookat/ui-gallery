import type { ReactNode } from "react"
import { Badge, Box, Button, Card, DatePicker, Flex, Heading, Portal, Separator, Stack, Text } from "@chakra-ui/react"

export function DatePickerField({ selectionMode = "single", inline = false }: { selectionMode?: "single" | "range"; inline?: boolean }) {
  const content = (
    <DatePicker.Content>
      <DatePicker.View view="day">
        <DatePicker.ViewControl>
          <DatePicker.PrevTrigger />
          <DatePicker.ViewTrigger />
          <DatePicker.NextTrigger />
        </DatePicker.ViewControl>
        <DatePicker.DayTable />
      </DatePicker.View>
    </DatePicker.Content>
  )

  return (
    <DatePicker.Root selectionMode={selectionMode} open={inline ? true : undefined} closeOnSelect={inline ? false : undefined} width="full">
      <DatePicker.Control>
        <DatePicker.Input index={0} placeholder={selectionMode === "range" ? "开始日期" : "选择日期"} />
        {selectionMode === "range" ? <DatePicker.Input index={1} placeholder="结束日期" /> : null}
        <DatePicker.Trigger asChild><Button variant="ghost">日期</Button></DatePicker.Trigger>
      </DatePicker.Control>
      {inline ? content : <Portal><DatePicker.Positioner>{content}</DatePicker.Positioner></Portal>}
    </DatePicker.Root>
  )
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <Flex align={{ base: "start", md: "end" }} justify="space-between" gap="4" direction={{ base: "column", md: "row" }}>
      <Stack gap="1">
        <Text fontSize="xs" fontWeight="bold" letterSpacing="0.2em" color="fg.muted">ACME CONSOLE</Text>
        <Heading size="2xl">{title}</Heading>
        {description ? <Text color="fg.muted">{description}</Text> : null}
      </Stack>
      {action}
    </Flex>
  )
}

export function SectionCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card.Root>
      <Card.Header><Card.Title>{title}</Card.Title>{description ? <Card.Description>{description}</Card.Description> : null}</Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card.Root>
  )
}

export function StatusBadge({ value }: { value: string }) {
  const colorPalette = ["paid", "shipped", "active"].includes(value) ? "green" : ["pending", "due"].includes(value) ? "yellow" : "red"
  return <Badge colorPalette={colorPalette}>{value}</Badge>
}

export function SectionDivider({ label }: { label: string }) {
  return <Flex align="center" gap="3" color="fg.muted" fontSize="xs"><Separator flex="1" /><Text>{label}</Text><Separator flex="1" /></Flex>
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return <Flex align="center" gap="2" fontWeight="semibold" whiteSpace="nowrap"><Flex boxSize="8" align="center" justify="center" rounded="l2" bg="colorPalette.solid" color="colorPalette.contrast">A</Flex>{compact ? null : <Text>Acme Console</Text>}</Flex>
}

export function EmptyResult({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <Stack align="center" gap="3" py="10" textAlign="center"><Heading size="md">{title}</Heading><Text color="fg.muted">{description}</Text>{action}</Stack>
}

export function DataTable({ children }: { children: ReactNode }) {
  return <Box overflowX="auto" maxW="100%">{children}</Box>
}
