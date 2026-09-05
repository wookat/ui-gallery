import type { ReactNode } from "react"
import { Blockquote, Code, Heading, Highlight, Kbd, Link, List, Mark, Separator, Stack, Text } from "@chakra-ui/react"

export type ComponentDemo = { name: string; node: ReactNode }

export const typographyDemos: ComponentDemo[] = [
  { name: "Typography", node: <Stack gap="3"><Heading as="h1" size="4xl">h1 页面标题</Heading><Heading as="h2" size="3xl">h2 区块标题</Heading><Heading as="h3" size="2xl">h3 卡片标题</Heading><Heading as="h4" size="xl">h4 小节标题</Heading><Heading as="h5" size="lg">h5 标签标题</Heading><Heading as="h6" size="md">h6 辅助标题</Heading><Text>正文文本、辅助文本与 <Highlight query="重点">重点内容</Highlight>。</Text></Stack> },
  { name: "Kbd", node: <Stack direction="row" align="center"><Kbd>⌘</Kbd><Kbd>K</Kbd><Text color="fg.muted">打开命令面板</Text></Stack> },
  { name: "Code", node: <Stack direction="row" gap="3"><Code>npm run dev</Code><Code variant="outline">const total = 42</Code></Stack> },
  { name: "Link", node: <Stack direction="row" gap="4"><Link href="#component-Link">带下划线链接</Link><Link href="#component-Link" variant="plain">无下划线链接</Link><Link href="https://chakra-ui.com" target="_blank">外部链接 ↗</Link></Stack> },
  { name: "List", node: <Stack direction={{ base: "column", md: "row" }} gap="8"><List.Root><List.Item>有序/无序列表</List.Item><List.Item>团队协作</List.Item></List.Root><List.Root as="ol"><List.Item>第一步</List.Item><List.Item>第二步</List.Item></List.Root></Stack> },
  { name: "Blockquote", node: <Blockquote.Root><Blockquote.Content>好的界面让复杂的事情变得简单。</Blockquote.Content><Blockquote.Caption>— Acme Console</Blockquote.Caption></Blockquote.Root> },
  { name: "Mark", node: <Text>这里是 <Mark>标记文本</Mark>，用于突出关键信息。</Text> },
  { name: "Highlight", node: <Text><Highlight query={["Chakra", "组件"]}>Chakra 组件使用语义化 token。</Highlight></Text> },
  { name: "Divider", node: <Stack gap="3"><Text>上方内容</Text><Separator variant="solid" /><Text>下方内容</Text><Separator orientation="vertical" height="6" /></Stack> },
]
