import { Button, ButtonGroup, Flex, IconButton, Stack, Text } from "@chakra-ui/react"
import { Icon as GalleryIcon } from "@ui-gallery/icons-react"
import type { ComponentDemo } from "./typography"

const variants = ["solid", "subtle", "surface", "outline", "ghost", "plain"] as const
const sizes = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl"] as const
function Icon({ name, size = "16" }: { name: string; size?: string }) { return <GalleryIcon name={name} size={size} /> }

export const buttonDemos: ComponentDemo[] = [
  { name: "Button", node: <Stack gap="4"><Text fontWeight="medium">Variants × sizes</Text>{variants.map((variant) => <Flex key={variant} gap="2" wrap="wrap" align="center"><Text width="16" fontSize="sm">{variant}</Text>{sizes.map((size) => <Button key={size} size={size} variant={variant}>{size}</Button>)}</Flex>)}<Flex gap="2" wrap="wrap"><Button loading loadingText="保存中">保存</Button><Button disabled>禁用按钮</Button><Button colorPalette="red">删除</Button></Flex></Stack> },
  { name: "ButtonGroup", node: <Stack gap="3"><ButtonGroup attached><Button>上一步</Button><Button variant="outline">下一步</Button></ButtonGroup><ButtonGroup size="sm"><Button>编辑</Button><Button variant="outline">分享</Button><Button variant="ghost">更多</Button></ButtonGroup></Stack> },
  { name: "IconButton", node: <Flex gap="2" wrap="wrap">{variants.map((variant) => <IconButton key={variant} aria-label={`${variant} 操作`} variant={variant}><Icon name="plus" /></IconButton>)}<IconButton aria-label="加载中" loading><Icon name="refresh-cw" /></IconButton></Flex> },
]
