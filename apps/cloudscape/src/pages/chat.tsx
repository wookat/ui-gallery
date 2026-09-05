import { useEffect, useRef, useState, type ComponentProps } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Avatar, ChatBubble, LoadingBar, SupportPromptGroup } from "@cloudscape-design/chat-components"
import CodeView from "@cloudscape-design/code-view/code-view"
import Badge from "@cloudscape-design/components/badge"
import Box from "@cloudscape-design/components/box"
import Button from "@cloudscape-design/components/button"
import ButtonGroup from "@cloudscape-design/components/button-group"
import Container from "@cloudscape-design/components/container"
import CopyToClipboard from "@cloudscape-design/components/copy-to-clipboard"
import Drawer from "@cloudscape-design/components/drawer"
import ExpandableSection from "@cloudscape-design/components/expandable-section"
import Grid from "@cloudscape-design/components/grid"
import Header from "@cloudscape-design/components/header"
import Link from "@cloudscape-design/components/link"
import PromptInput from "@cloudscape-design/components/prompt-input"
import Select, { type SelectProps } from "@cloudscape-design/components/select"
import SideNavigation from "@cloudscape-design/components/side-navigation"
import SpaceBetween from "@cloudscape-design/components/space-between"
import StatusIndicator from "@cloudscape-design/components/status-indicator"
import TextFilter from "@cloudscape-design/components/text-filter"

import chat from "@ui-gallery/spec/mock/chat.json"
import team from "@ui-gallery/spec/mock/team.json"

import { AppIcon, iconProps } from "@/lib/icons"
import { PersonAvatar } from "./shared"

type Message = (typeof chat.messages)[number]
const me = team[0]

const mdComponents: ComponentProps<typeof Markdown>["components"] = {
  code({ className, children }) {
    const text = String(children).replace(/\n$/, "")
    if (!className && !text.includes("\n")) return <Box variant="code" display="inline">{text}</Box>
    return (
      <CodeView
        content={text}
        lineNumbers
        wrapLines
        actions={<CopyToClipboard copyButtonAriaLabel="复制代码" copyErrorText="复制失败" copySuccessText="已复制" textToCopy={text} variant="icon" />}
      />
    )
  },
  pre({ children }) {
    return <>{children}</>
  },
  a({ href, children }) {
    return (
      <Link href={href} external>
        {children}
      </Link>
    )
  },
}

function MessageView({ msg, index }: { msg: Message; index: number }) {
  const isUser = msg.role === "user"
  const tool = "tool" in msg ? msg.tool : undefined
  const sources = "sources" in msg ? msg.sources : undefined
  const streaming = "streaming" in msg && msg.streaming
  return (
    <ChatBubble
      type={isUser ? "outgoing" : "incoming"}
      ariaLabel={`${isUser ? me.name : "助手"} 消息 ${index + 1}`}
      showLoadingBar={streaming}
      avatar={isUser ? <PersonAvatar name={me.name} /> : <Avatar color="gen-ai" iconName="gen-ai" ariaLabel="助手" tooltipText="Acme 助手" loading={streaming} />}
      actions={
        isUser ? undefined : (
          <ButtonGroup
            variant="icon"
            ariaLabel="消息操作"
            items={[
              { type: "icon-button", id: "copy", text: "复制", ...iconProps("copy"), popoverFeedback: <StatusIndicator type="success">已复制</StatusIndicator> },
              { type: "icon-button", id: "up", text: "有帮助", iconName: "thumbs-up" },
              { type: "icon-button", id: "down", text: "没帮助", iconName: "thumbs-down" },
            ]}
          />
        )
      }
    >
      <SpaceBetween size="s">
        {tool && (
          <ExpandableSection headerText={`工具调用 · ${tool.name}`} variant="footer" headerActions={<StatusIndicator type={tool.status === "done" ? "success" : "in-progress"}>{tool.status === "done" ? "完成" : "运行中"}</StatusIndicator>}>
            <CodeView content={JSON.stringify(tool.args, null, 2)} wrapLines />
          </ExpandableSection>
        )}
        <div className="gallery-markdown">
          <Markdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {msg.content}
          </Markdown>
        </div>
        {streaming && <StatusIndicator type="in-progress">正在生成…</StatusIndicator>}
        {sources && (
          <SpaceBetween direction="horizontal" size="xxs" alignItems="center">
            <Box variant="small" color="text-body-secondary">
              来源
            </Box>
            {sources.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </SpaceBetween>
        )}
      </SpaceBetween>
    </ChatBubble>
  )
}

function ConversationList({ active, onSelect, onNew }: { active: string | null; onSelect: (id: string) => void; onNew: () => void }) {
  const [query, setQuery] = useState("")
  const list = chat.conversations.filter((c) => c.title.includes(query))
  const groups = [
    { title: "今天", items: list.filter((c) => c.time === "刚刚" || c.time === "昨天") },
    { title: "更早", items: list.filter((c) => c.time !== "刚刚" && c.time !== "昨天") },
  ]
  return (
    <SpaceBetween size="s">
      <Button variant="primary" fullWidth {...iconProps("plus")} onClick={onNew}>
        新建对话
      </Button>
      <TextFilter filteringText={query} onChange={({ detail }) => setQuery(detail.filteringText)} filteringPlaceholder="搜索对话" filteringAriaLabel="搜索对话" />
      <SideNavigation
        activeHref={active ? `#${active}` : undefined}
        onFollow={(e) => {
          e.preventDefault()
          onSelect(e.detail.href.slice(1))
        }}
        items={groups
          .filter((g) => g.items.length)
          .map((g) => ({
            type: "section",
            text: g.title,
            items: g.items.map((c) => ({
              type: "link",
              text: `${c.title} · ${c.time}`,
              href: `#${c.id}`,
              info: c.unread ? <Badge color="red">{c.unread}</Badge> : undefined,
            })),
          }))}
      />
    </SpaceBetween>
  )
}

export function ChatPage() {
  const [active, setActive] = useState<string | null>(chat.conversations[0].id)
  const [draft, setDraft] = useState("")
  const [model, setModel] = useState<SelectProps.Option>({ value: chat.models[0] })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(chat.messages)
  const scrollRef = useRef<HTMLDivElement>(null)
  const empty = active === null

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, active])

  const send = (text: string) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: "user", content: text.trim() }])
    setDraft("")
    if (active === null) setActive(chat.conversations[0].id)
  }
  const select = (id: string) => {
    setActive(id)
    setMessages(chat.messages)
    setDrawerOpen(false)
  }
  const startNew = () => {
    setActive(null)
    setMessages([])
    setDrawerOpen(false)
  }

  const composer = (
    <PromptInput
      value={draft}
      onChange={({ detail }) => setDraft(detail.value)}
      onAction={() => send(draft)}
      placeholder="输入问题，Enter 发送，Shift+Enter 换行"
      ariaLabel="消息输入"
      actionButtonAriaLabel="发送"
      actionButtonIconName="send"
      disableActionButton={!draft.trim()}
      minRows={1}
      maxRows={6}
      secondaryActions={
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
          <Button variant="icon" {...iconProps("paperclip")} ariaLabel="附件" />
          <Select selectedOption={model} onChange={({ detail }) => setModel(detail.selectedOption)} options={chat.models.map((m) => ({ value: m }))} ariaLabel="模型" expandToViewport />
        </SpaceBetween>
      }
      secondaryContent={
        <Box variant="small" color="text-body-secondary">
          {draft.length} 字 · <kbd className="gallery-kbd">Enter</kbd> 发送
        </Box>
      }
    />
  )

  const prompts = (
    <SupportPromptGroup
      ariaLabel="建议问题"
      alignment={empty ? "vertical" : "horizontal"}
      items={chat.suggestions.map((s, i) => ({ id: `s${i}`, text: s }))}
      onItemClick={({ detail }) => send(chat.suggestions[Number(detail.id.slice(1))])}
    />
  )

  return (
    <>
      <Grid gridDefinition={[{ colspan: { default: 12, s: 3 } }, { colspan: { default: 12, s: 9 } }]}>
        <div className="gallery-desktop-only">
          <Container header={<Header variant="h2">对话</Header>}>
            <ConversationList active={active} onSelect={select} onNew={startNew} />
          </Container>
        </div>
        <Container
          header={
            <Header
              variant="h2"
              description={empty ? undefined : `模型 ${model.value}`}
              actions={
                <div className="gallery-mobile-only">
                  <Button {...iconProps("menu")} ariaLabel="打开会话列表" onClick={() => setDrawerOpen(true)} />
                </div>
              }
            >
              {empty ? "新对话" : chat.conversations.find((c) => c.id === active)?.title}
            </Header>
          }
          footer={
            <SpaceBetween size="s">
              {!empty && prompts}
              {composer}
            </SpaceBetween>
          }
        >
          {empty ? (
            <Box textAlign="center" padding={{ vertical: "xxl" }}>
              <SpaceBetween size="l" alignItems="center">
                <AppIcon name="sparkles" size="large" />
                <Header variant="h1" description="用自然语言查询订单、收入和团队数据">
                  你好，{me.name}
                </Header>
                {prompts}
              </SpaceBetween>
            </Box>
          ) : (
            <div ref={scrollRef} className="gallery-chat-scroll">
              <SpaceBetween size="m">
                {messages.map((m, i) => (
                  <MessageView key={i} msg={m} index={i} />
                ))}
                {messages.length > 0 && "streaming" in messages[messages.length - 1] && <LoadingBar variant="gen-ai" />}
              </SpaceBetween>
            </div>
          )}
        </Container>
      </Grid>
      <Drawer
        position="fixed"
        placement="start"
        zIndex={2000}
        open={drawerOpen}
        backdrop
        onClose={() => setDrawerOpen(false)}
        header={<Header variant="h2">对话</Header>}
        ariaLabel="会话列表"
        closeAction={{ ariaLabel: "关闭" }}
      >
        <ConversationList active={active} onSelect={select} onNew={startNew} />
      </Drawer>
    </>
  )
}
