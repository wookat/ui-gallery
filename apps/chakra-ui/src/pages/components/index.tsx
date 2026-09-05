import contract from "@ui-gallery/spec/contract.json"
import { Badge, Button, Card, Flex, Link, SimpleGrid, Stack, Text, Wrap } from "@chakra-ui/react"
import { coverage } from "../../coverage"
import { PageHeader } from "../shared"
import { buttonDemos } from "./buttons"
import { dataDisplayDemos } from "./data-display"
import { feedbackDemos } from "./feedback"
import { formDemos } from "./forms"
import { layoutDemos } from "./layout"
import { navigationDemos } from "./navigation"
import type { ComponentDemo } from "./typography"
import { typographyDemos } from "./typography"
import { otherDemos } from "./other"

const categories: Array<[string, ComponentDemo[]]> = [
  ["Typography & Buttons", [...typographyDemos, ...buttonDemos.filter((item) => ["Button", "ButtonGroup", "IconButton"].includes(item.name))]],
  ["Forms", formDemos],
  ["Data Display", dataDisplayDemos],
  ["Feedback", feedbackDemos],
  ["Navigation", navigationDemos],
  ["Layout", layoutDemos],
  ["Other", otherDemos],
]
const allDemos = new Map(categories.flatMap(([, demos]) => demos.map((demo) => [demo.name, demo] as const)))
const labels = contract.components as string[]

function statusColor(name: string) { return coverage[name] === "missing" ? "red" : coverage[name] === "composed" ? "blue" : "green" }

export function ComponentsPage() {
  return <Stack gap="8"><PageHeader title="组件全集" description="每个契约组件都展示真实 Chakra UI v3 控件、变体和交互状态。" action={<Button asChild variant="outline"><a href="#component-index">组件索引</a></Button>} /><Card.Root><Card.Body><Stack gap="4"><Text fontWeight="medium">覆盖状态</Text><Flex gap="2" wrap="wrap"><Badge colorPalette="green">implemented {Object.values(coverage).filter((status) => status === "implemented").length}</Badge><Badge colorPalette="blue">composed {Object.values(coverage).filter((status) => status === "composed").length}</Badge><Badge colorPalette="red">missing {Object.values(coverage).filter((status) => status === "missing").length}</Badge></Flex><Wrap id="component-index" gap="2">{labels.map((name) => <Link key={name} href={`#component-${name}`} px="3" minH="10" display="inline-flex" alignItems="center" rounded="full" borderWidth="1px" fontSize="xs">{name}</Link>)}</Wrap></Stack></Card.Body></Card.Root>{categories.map(([category, demos]) => <Stack key={category} gap="4"><Text fontSize="xl" fontWeight="bold">{category}</Text><SimpleGrid columns={{ base: 1, lg: 2 }} gap="4">{labels.filter((name) => category === "Other" ? !allDemos.has(name) || demos.some((demo) => demo.name === name) : demos.some((demo) => demo.name === name)).map((name) => <Card.Root id={`component-${name}`} key={name} scrollMarginTop="20"><Card.Header><Flex justify="space-between" align="center"><Card.Title fontSize="md">{name}</Card.Title><Badge colorPalette={statusColor(name)}>{coverage[name] ?? "composed"}</Badge></Flex></Card.Header><Card.Body>{allDemos.get(name)!.node}</Card.Body></Card.Root>)}</SimpleGrid></Stack>)}</Stack>
}
