import { Button, EmptyState, Flex, Float, IconButton, Stack, Text } from "@chakra-ui/react"
import { useColorMode } from "@/components/provider"
import { Icon as GalleryIcon } from "@ui-gallery/icons-react"
import type { ComponentDemo } from "./typography"

function Icon({ name, size = "18" }: { name: string; size?: string }) { return <GalleryIcon name={name} size={size} /> }

export const otherDemos: ComponentDemo[] = [
  { name: "ThemeProvider", node: <ThemeDemo /> },
  { name: "Watermark", node: <EmptyState.Root><EmptyState.Content><EmptyState.Title>Chakra v3 没有 Watermark</EmptyState.Title><EmptyState.Description>此覆盖决策标记为 missing。</EmptyState.Description></EmptyState.Content></EmptyState.Root> },
  { name: "Tour", node: <EmptyState.Root><EmptyState.Content><EmptyState.Title>Chakra v3 没有 Tour</EmptyState.Title><EmptyState.Description>可使用 Popover 与步骤状态组合实现。</EmptyState.Description></EmptyState.Content></EmptyState.Root> },
  { name: "FloatButton", node: <Float placement="bottom-end" offset="6"><IconButton aria-label="快速创建" rounded="full" shadow="lg"><Icon name="plus" /></IconButton></Float> },
]

function ThemeDemo() {
  const { colorMode, toggleColorMode } = useColorMode()
  return <Stack gap="3"><Text>当前主题：{colorMode}</Text><Flex gap="2"><Button colorPalette="red">Red</Button><Button colorPalette="green">Green</Button><Button colorPalette="blue">Blue</Button></Flex><Button variant="outline" onClick={toggleColorMode}>切换主题</Button></Stack>
}
