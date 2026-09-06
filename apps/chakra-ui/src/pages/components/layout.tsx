import { Accordion, AspectRatio, Box, Container, Flex, Grid, ScrollArea, Splitter, Stack, Text } from "@chakra-ui/react"
import type { ComponentDemo } from "./typography"

export const layoutDemos: ComponentDemo[] = [
  { name: "Grid", node: <Grid templateColumns="repeat(3, 1fr)" gap="2">{["A", "B", "C", "D", "E", "F"].map((item) => <Box key={item} bg="bg.subtle" p="4" rounded="l2">{item}</Box>)}</Grid> },
  { name: "Stack", node: <Stack gap="3"><Flex gap="3"><Box p="3" bg="bg.subtle">HStack 1</Box><Box p="3" bg="bg.subtle">HStack 2</Box></Flex><Stack direction="row" wrap="wrap" gap="2"><Box p="3" bg="bg.subtle">Wrap 1</Box><Box p="3" bg="bg.subtle">Wrap 2</Box><Box p="3" bg="bg.subtle">Wrap 3</Box></Stack></Stack> },
  { name: "Layout", node: <Grid templateColumns="180px 1fr" templateRows="48px 120px" gap="2"><Box gridColumn="1 / -1" bg="bg.subtle" p="3">Header</Box><Box bg="bg.subtle" p="3">Sidebar</Box><Box bg="bg.panel" borderWidth="1px" p="3">Content</Box></Grid> },
  { name: "Container", node: <Container maxW="md" borderWidth="1px" p="5" rounded="l2"><Text>Container max width md</Text></Container> },
  { name: "AspectRatio", node: <AspectRatio ratio={16 / 9} maxW="420px" bg="bg.subtle" rounded="l2" display="grid" placeItems="center"><Text>16:9 AspectRatio</Text></AspectRatio> },
  { name: "Resizable", node: <Splitter.Root panels={[{ id: "one" }, { id: "two" }]} defaultSize={[50, 50]} minH="120px" borderWidth="1px"><Splitter.Panel id="one" p="4">可调整面板 A</Splitter.Panel><Splitter.ResizeTrigger id="one:two" /><Splitter.Panel id="two" p="4">可调整面板 B</Splitter.Panel></Splitter.Root> },
  { name: "ScrollArea", node: <ScrollArea.Root height="120px" borderWidth="1px" rounded="l2"><ScrollArea.Viewport><ScrollArea.Content p="3"><Stack gap="3">{Array.from({ length: 8 }, (_, index) => <Text key={index}>ScrollArea 内容 {index + 1}</Text>)}</Stack></ScrollArea.Content></ScrollArea.Viewport><ScrollArea.Scrollbar orientation="vertical"><ScrollArea.Thumb /></ScrollArea.Scrollbar></ScrollArea.Root> },
  { name: "Accordion", node: <Stack gap="3"><Accordion.Root variant="outline" collapsible><Accordion.Item value="one"><Accordion.ItemTrigger>Outline Accordion<Accordion.ItemIndicator /></Accordion.ItemTrigger><Accordion.ItemContent>说明内容</Accordion.ItemContent></Accordion.Item></Accordion.Root><Accordion.Root variant="subtle" collapsible><Accordion.Item value="two"><Accordion.ItemTrigger>Subtle Accordion<Accordion.ItemIndicator /></Accordion.ItemTrigger><Accordion.ItemContent>更多内容</Accordion.ItemContent></Accordion.Item></Accordion.Root></Stack> },
]
