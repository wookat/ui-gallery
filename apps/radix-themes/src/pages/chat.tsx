import { useState } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Collapsible } from "radix-ui"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Code,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Select,
  Spinner,
  Table,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/icons"

function MarkdownMessage({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    void navigator.clipboard?.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }
  const components: Components = {
    p: ({ children }) => (
      <Text as="p" mb="3">
        {children}
      </Text>
    ),
    blockquote: ({ children }) => (
      <Box pl="3" style={{ borderLeft: "2px solid var(--accent-9)" }}>
        {children}
      </Box>
    ),
    table: ({ children }) => (
      <Box style={{ overflowX: "auto", minWidth: 0 }}>
        <Table.Root variant="surface">{children}</Table.Root>
      </Box>
    ),
    thead: ({ children }) => <Table.Header>{children}</Table.Header>,
    tbody: ({ children }) => <Table.Body>{children}</Table.Body>,
    tr: ({ children }) => <Table.Row>{children}</Table.Row>,
    th: ({ children }) => (
      <Table.ColumnHeaderCell style={{ whiteSpace: "nowrap" }}>
        {children}
      </Table.ColumnHeaderCell>
    ),
    td: ({ children }) => (
      <Table.Cell style={{ whiteSpace: "nowrap" }}>{children}</Table.Cell>
    ),
    code: ({ children }) => <Code variant="soft">{children}</Code>,
    pre: ({ children }) => (
      <Card size="1" mt="3" mb="3">
        <Flex align="start" gap="2">
          <Box
            style={{
              minWidth: 0,
              flexGrow: 1,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {children}
          </Box>
          <IconButton size="1" variant="ghost" onClick={copy}>
            <Icon name={copied ? "check" : "copy"} />
          </IconButton>
        </Flex>
      </Card>
    ),
  }
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  )
}

function ToolCall({ tool }: { tool: (typeof chat.messages)[number]["tool"] }) {
  if (!tool) return null
  const color =
    tool.status === "done" ? "green" : tool.status === "error" ? "red" : "amber"
  return (
    <Collapsible.Root>
      <Card size="1" mt="3">
        <Collapsible.Trigger asChild>
          <Button
            variant="ghost"
            size="1"
            style={{ width: "100%", justifyContent: "flex-start" }}
          >
            <Flex align="center" gap="2" width="100%">
              <Icon name="chevron-down" size={14} />
              <Text weight="medium">{tool.name}</Text>
              <Badge color={color} ml="auto">
                {tool.status}
              </Badge>
            </Flex>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Code
            variant="soft"
            style={{
              display: "block",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {JSON.stringify(tool.args, null, 2)}
          </Code>
        </Collapsible.Content>
      </Card>
    </Collapsible.Root>
  )
}

export function ChatPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [empty, setEmpty] = useState(false)
  const [input, setInput] = useState("")
  const conversations = (
    <Flex direction="column" gap="3">
      <TextField.Root placeholder="搜索会话">
        <TextField.Slot>
          <Icon name="search" size={15} />
        </TextField.Slot>
      </TextField.Root>
      <Button>
        <Icon name="plus" />
        新建
      </Button>
      {chat.conversations.map((conversation) => (
        <Button
          key={conversation.id}
          variant="ghost"
          style={{ justifyContent: "start" }}
        >
          <Flex direction="column" align="start" gap="1" width="100%">
            <Flex justify="between" width="100%">
              <Text>{conversation.title}</Text>
              {conversation.unread ? (
                <Badge size="1">{conversation.unread}</Badge>
              ) : null}
            </Flex>
            <Text size="1" color="gray">
              {conversation.time}
            </Text>
          </Flex>
        </Button>
      ))}
    </Flex>
  )
  return (
    <Flex
      style={{ minHeight: "calc(100vh - 40px)", minWidth: 0 }}
      gap={{ initial: "0", md: "4" }}
    >
      <Box
        width="280px"
        display={{ initial: "none", md: "block" }}
        style={{ flexShrink: 0 }}
      >
        <Card style={{ height: "100%" }}>{conversations}</Card>
      </Box>
      <Box display={{ initial: "block", md: "none" }}>
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger>
            <IconButton variant="soft">
              <Icon name="menu" />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Content
            style={{
              position: "fixed",
              inset: "0 auto 0 0",
              width: "280px",
              maxHeight: "100vh",
              borderRadius: 0,
              transform: "none",
            }}
          >
            <Dialog.Title>会话</Dialog.Title>
            <Box mt="4">{conversations}</Box>
          </Dialog.Content>
        </Dialog.Root>
      </Box>
      <Flex direction="column" flexGrow="1" minWidth="0">
        <Flex justify="between" align="center" gap="3">
          <Box>
            <Heading size="6">AI 助手</Heading>
            <Text color="gray" size="2">
              本地数据对话演示
            </Text>
          </Box>
          <Button variant="soft" onClick={() => setEmpty((value) => !value)}>
            清空对话
          </Button>
        </Flex>
        {empty ? (
          <Flex
            direction="column"
            align="center"
            gap="5"
            p={{ initial: "5", md: "9" }}
          >
            <Heading size="7">欢迎</Heading>
            <Text color="gray">选择一个建议开始对话</Text>
            <GridSuggestions onSelect={setInput} />
          </Flex>
        ) : (
          <Flex direction="column" gap="4" flexGrow="1" mt="4" minWidth="0">
            {chat.messages.map((message, index) => (
              <Flex
                key={`${message.role}-${index}`}
                justify={message.role === "user" ? "end" : "start"}
                gap="3"
                style={{ minWidth: 0 }}
              >
                <Avatar
                  size="2"
                  fallback={message.role === "user" ? "林" : "A"}
                />
                <Card
                  variant={message.role === "user" ? "surface" : "classic"}
                  style={{ maxWidth: "min(720px, 85%)", minWidth: 0 }}
                >
                  <MarkdownMessage content={message.content} />
                  {message.sources ? (
                    <Flex gap="2" mt="3" wrap="wrap">
                      {message.sources.map((source) => (
                        <Badge key={source}>{source}</Badge>
                      ))}
                    </Flex>
                  ) : null}
                  <ToolCall tool={message.tool} />
                  {message.streaming ? (
                    <Flex align="center" gap="2" mt="2">
                      <Spinner size="1" />
                      <Text size="1" color="gray">
                        正在生成
                      </Text>
                      <Text className="rt-blink">▍</Text>
                    </Flex>
                  ) : null}
                </Card>
              </Flex>
            ))}
          </Flex>
        )}
        <Flex direction="column" gap="2" mt="auto">
          {!empty ? (
            <Flex gap="2" wrap="wrap">
              {chat.suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  size="2"
                  variant="soft"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </Flex>
          ) : null}
          <Flex direction="column" gap="2" style={{ minWidth: 0 }}>
            <TextArea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="输入消息..."
              rows={2}
              style={{ width: "100%" }}
            />
            <Flex gap="2" align="center" justify="between" wrap="wrap">
              <Flex gap="2" align="center">
                <IconButton variant="soft">
                  <Icon name="paperclip" />
                </IconButton>
                <Select.Root defaultValue={chat.models[0]}>
                  <Select.Trigger />
                  <Select.Content>
                    {chat.models.map((model) => (
                      <Select.Item key={model} value={model}>
                        {model}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>
              <Button onClick={() => setInput("")}>
                <Icon name="send" />
                发送
              </Button>
            </Flex>
          </Flex>
          <Text size="1" color="gray">
            Enter 发送 · Shift+Enter 换行 · {input.length}/2000
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

function GridSuggestions({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <Flex wrap="wrap" justify="center" gap="3">
      {chat.suggestions.map((suggestion) => (
        <Card
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          style={{ cursor: "pointer" }}
        >
          <Text>{suggestion}</Text>
        </Card>
      ))}
    </Flex>
  )
}
