import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ActionIcon, Avatar, Badge, Box, Button, Card, Chip, Collapse, CopyButton, Drawer, Group, Kbd, Loader, NavLink, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, Textarea, TextInput, ThemeIcon, Title, Tooltip, UnstyledButton } from "@mantine/core"
import { CodeHighlight } from "@mantine/code-highlight"
import { Icon } from "@ui-gallery/icons-react"
import chat from "@ui-gallery/spec/mock/chat.json"
import { muted } from "./shared"

type Message = (typeof chat.messages)[number] & { sources?: string[]; tool?: { name: string; args: Record<string, unknown>; status: string }; streaming?: boolean }

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <Text size="sm" mb="xs">{children}</Text>,
        table: ({ children }) => <Table.ScrollContainer minWidth={280} my="xs"><Table withTableBorder withColumnBorders fz="sm">{children}</Table></Table.ScrollContainer>,
        thead: ({ children }) => <Table.Thead>{children}</Table.Thead>,
        tbody: ({ children }) => <Table.Tbody>{children}</Table.Tbody>,
        tr: ({ children }) => <Table.Tr>{children}</Table.Tr>,
        th: ({ children }) => <Table.Th>{children}</Table.Th>,
        td: ({ children }) => <Table.Td>{children}</Table.Td>,
        code: ({ children, className }) => {
          const text = String(children).replace(/\n$/, "")
          const lang = /language-(\w+)/.exec(className ?? "")?.[1]
          return lang ? <CodeHighlight code={text} language={lang} radius="md" my="xs" /> : <Text component="code" fz="sm" style={{ fontFamily: "var(--mantine-font-family-monospace)", background: "var(--mantine-color-default)", padding: "0 4px", borderRadius: 4 }}>{children}</Text>
        },
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function ConversationList({ onPick }: { onPick?: () => void }) {
  const [q, setQ] = useState("")
  const items = chat.conversations.filter((c) => c.title.includes(q))
  return (
    <Stack gap="sm" h="100%">
      <Button variant="default" leftSection={<Icon name="plus" size={15} />} fullWidth>新建对话</Button>
      <TextInput placeholder="搜索对话" size="sm" leftSection={<Icon name="search" size={14} />} value={q} onChange={(e) => setQ(e.currentTarget.value)} />
      <Text size="xs" fw={600} c={muted} tt="uppercase">最近</Text>
      <Stack gap={2}>
        {items.map((c, i) => (
          <NavLink key={c.id} active={i === 0} label={c.title} description={c.time} onClick={onPick} rightSection={c.unread ? <Badge size="xs" circle>{c.unread}</Badge> : null} style={{ borderRadius: 8 }} />
        ))}
      </Stack>
    </Stack>
  )
}

export function ChatPage() {
  const [draft, setDraft] = useState("")
  const [model, setModel] = useState<string | null>(chat.models[0])
  const [drawer, setDrawer] = useState(false)
  const [open, setOpen] = useState<Record<number, boolean>>({})
  const empty = new URLSearchParams(window.location.search).get("state") === "empty"
  const messages = chat.messages as Message[]

  return (
    <Box style={{ display: "flex", gap: "var(--mantine-spacing-md)", height: "calc(100dvh - 60px - 2 * var(--mantine-spacing-md))", minHeight: 480 }}>
      <Paper withBorder radius="md" p="md" w={260} visibleFrom="md" style={{ flexShrink: 0 }}><ConversationList /></Paper>
      <Drawer opened={drawer} onClose={() => setDrawer(false)} title="对话" size="xs"><ConversationList onPick={() => setDrawer(false)} /></Drawer>

      <Paper withBorder radius="md" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Group justify="space-between" p="sm" wrap="nowrap" style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}>
          <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
            <ActionIcon size={40} variant="subtle" color="gray" hiddenFrom="md" onClick={() => setDrawer(true)} aria-label="对话列表"><Icon name="menu" size={18} /></ActionIcon>
            <div style={{ minWidth: 0 }}><Text fw={600} size="sm" truncate>{chat.conversations[0].title}</Text><Text size="xs" c={muted}>{model} · 已连接</Text></div>
          </Group>
          <Select size="xs" w={150} data={chat.models} value={model} onChange={setModel} allowDeselect={false} />
        </Group>

        <ScrollArea style={{ flex: 1 }} p="md">
          {empty ? (
            <Stack align="center" justify="center" gap="lg" py={60}>
              <ThemeIcon size={56} radius="xl" variant="light"><Icon name="sparkles" size={28} /></ThemeIcon>
              <Title order={3}>今天想了解什么？</Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} w="100%" maw={560}>
                {chat.suggestions.map((s) => <UnstyledButton key={s} onClick={() => setDraft(s)}><Card withBorder radius="md" padding="md"><Text size="sm">{s}</Text></Card></UnstyledButton>)}
              </SimpleGrid>
            </Stack>
          ) : (
            <Stack gap="lg">
              {messages.map((m, i) => {
                const user = m.role === "user"
                return (
                  <Group key={i} align="flex-start" wrap="nowrap" justify={user ? "flex-end" : "flex-start"}>
                    {user ? null : <Avatar radius="xl" color="blue" size="sm"><Icon name="bot" size={16} /></Avatar>}
                    <Stack gap={6} maw="85%" align={user ? "flex-end" : "flex-start"} style={{ minWidth: 0 }}>
                      <Group gap="xs"><Text size="xs" fw={500}>{user ? "林晓" : "AI 助手"}</Text><Text size="xs" c={muted}>刚刚</Text></Group>
                      {m.tool ? (
                        <Card withBorder radius="md" padding="xs" w="100%">
                          <UnstyledButton onClick={() => setOpen({ ...open, [i]: !open[i] })} w="100%">
                            <Group justify="space-between" wrap="nowrap"><Group gap="xs"><Icon name="plug" size={14} /><Text size="xs" fw={500}>工具调用 · {m.tool.name}</Text><Badge size="xs" color="green" variant="light">{m.tool.status}</Badge></Group><Icon name={open[i] ? "chevron-up" : "chevron-down"} size={14} /></Group>
                          </UnstyledButton>
                          <Collapse expanded={!!open[i]}><CodeHighlight mt="xs" code={JSON.stringify(m.tool.args, null, 2)} language="json" radius="sm" /></Collapse>
                        </Card>
                      ) : null}
                      <Paper radius="md" px="md" py="sm" bg={user ? "var(--mantine-primary-color-filled)" : "var(--mantine-color-default)"} c={user ? "white" : undefined} style={{ maxWidth: "100%", overflow: "hidden" }}>
                        {user ? <Text size="sm">{m.content}</Text> : <Markdown content={m.content} />}
                        {m.streaming ? <Group gap={6} mt={4}><Loader size={12} type="dots" /><Text size="xs" c={muted}>正在生成...</Text></Group> : null}
                      </Paper>
                      {m.sources ? <Group gap={6}>{m.sources.map((s) => <Chip key={s} size="xs" variant="outline" checked={false} icon={<Icon name="paperclip" size={10} />}>{s}</Chip>)}</Group> : null}
                      {user ? null : <Group gap={2}><CopyButton value={m.content}>{({ copied, copy }) => <Tooltip label={copied ? "已复制" : "复制"}><ActionIcon size={40} variant="subtle" color="gray" onClick={copy} aria-label="复制"><Icon name={copied ? "check" : "copy"} size={15} /></ActionIcon></Tooltip>}</CopyButton><ActionIcon size={40} variant="subtle" color="gray" aria-label="赞"><Icon name="heart" size={15} /></ActionIcon><ActionIcon size={40} variant="subtle" color="gray" aria-label="踩"><Icon name="arrow-down" size={15} /></ActionIcon><ActionIcon size={40} variant="subtle" color="gray" aria-label="重试"><Icon name="refresh" size={15} /></ActionIcon></Group>}
                    </Stack>
                    {user ? <Avatar radius="xl" color="initials" name="林晓" size="sm" /> : null}
                  </Group>
                )
              })}
            </Stack>
          )}
        </ScrollArea>

        <Box p="sm" style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}>
          {empty ? null : <ScrollArea type="never" mb="xs"><Group gap="xs" wrap="nowrap">{chat.suggestions.map((s) => <Chip key={s} size="xs" variant="light" checked={false} onClick={() => setDraft(s)}>{s}</Chip>)}</Group></ScrollArea>}
          <Paper withBorder radius="md" p="xs">
            <Textarea variant="unstyled" autosize minRows={1} maxRows={6} placeholder="向 AI 助手提问..." value={draft} onChange={(e) => setDraft(e.currentTarget.value)} px={4} />
            <Group justify="space-between" mt={4} wrap="nowrap">
              <Group gap={4}><ActionIcon size={40} variant="subtle" color="gray" aria-label="附件"><Icon name="paperclip" size={16} /></ActionIcon><Text size="xs" c={muted} visibleFrom="sm">{draft.length}/2000 · <Kbd size="xs">Enter</Kbd> 发送，<Kbd size="xs">Shift</Kbd>+<Kbd size="xs">Enter</Kbd> 换行</Text></Group>
              <Button size="xs" rightSection={<Icon name="send" size={14} />} disabled={!draft.trim()} onClick={() => setDraft("")}>发送</Button>
            </Group>
          </Paper>
        </Box>
      </Paper>
    </Box>
  )
}
