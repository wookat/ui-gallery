import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  App,
  Avatar,
  Badge,
  Button,
  Card,
  Collapse,
  Drawer,
  Flex,
  Grid,
  Input,
  Layout,
  List,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/icons"
import { ChatShellHeader } from "@/layouts/app-shell"
import { userLabel } from "@/pages/shared"

export function ChatPage() {
  const [empty, setEmpty] = useState(false)
  const [text, setText] = useState("")
  const [drawer, setDrawer] = useState(false)
  const { message } = App.useApp()
  const { token } = theme.useToken()
  const mobile = Grid.useBreakpoint().md === false
  const modelSelect = (
    <Select
      defaultValue={chat.models[0]}
      options={chat.models.map((model) => ({ value: model }))}
      style={{ width: mobile ? "100%" : 160 }}
      aria-label="模型"
    />
  )
  const recentConversations = chat.conversations.filter(
    (item) => item.time === "刚刚" || item.time === "昨天"
  )
  const earlierConversations = chat.conversations.filter(
    (item) => !recentConversations.includes(item)
  )
  const conversation = (
    <>
      <Input.Search placeholder="搜索会话" />
      <Button
        type="primary"
        block
        icon={<Icon name="plus" />}
        style={{ marginBlock: 12 }}
      >
        新建会话
      </Button>
      {recentConversations.length > 0 ? (
        <List
          header="最近"
          dataSource={recentConversations}
          renderItem={conversationItem}
        />
      ) : null}
      {earlierConversations.length > 0 ? (
        <List
          header="更早"
          dataSource={earlierConversations}
          renderItem={conversationItem}
        />
      ) : null}
    </>
  )
  function conversationItem(item: (typeof chat.conversations)[number]) {
    return (
      <List.Item>
        <List.Item.Meta title={item.title} description={item.time} />
        <Badge count={item.unread || 0} />
      </List.Item>
    )
  }
  const markdownComponents = {
    pre: ({ children }: { children?: React.ReactNode }) => (
      <Card
        size="small"
        className="markdown-code"
        extra={
          <Button
            size="small"
            icon={<Icon name="copy" />}
            onClick={() => {
              void navigator.clipboard?.writeText(String(children))
              message.success("已复制")
            }}
          >
            复制
          </Button>
        }
      >
        <pre>{children}</pre>
      </Card>
    ),
  }
  return (
    <Layout className="chat-layout">
      <Layout.Sider
        width={280}
        theme="light"
        breakpoint="md"
        collapsedWidth={0}
        className="desktop-only"
        style={{ padding: 16 }}
      >
        {conversation}
      </Layout.Sider>
      <Layout.Content style={{ padding: 16 }}>
        <Flex vertical style={{ height: "100%" }} gap={16}>
          <Flex justify="space-between">
            <ChatShellHeader>AI 助手</ChatShellHeader>
            <Space>
              <Button onClick={() => setEmpty((value) => !value)}>
                清空对话
              </Button>
              <Button
                className="mobile-only"
                icon={<Icon name="menu" />}
                onClick={() => setDrawer(true)}
                aria-label="会话列表"
              />
            </Space>
          </Flex>
          {empty ? (
            <Card style={{ flex: 1, display: "grid", placeItems: "center" }}>
              <Space direction="vertical" align="center">
                <Typography.Title>你好，我是 Acme 助手</Typography.Title>
                <Typography.Text type="secondary">
                  选择一个建议开始对话
                </Typography.Text>
                <Space wrap>
                  {chat.suggestions.map((suggestion) => (
                    <Card
                      key={suggestion}
                      hoverable
                      size="small"
                      onClick={() => setText(suggestion)}
                    >
                      {suggestion}
                    </Card>
                  ))}
                </Space>
              </Space>
            </Card>
          ) : (
            <Card style={{ flex: 1 }}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {chat.messages.map((item, index) => (
                  <Flex
                    key={`${item.role}-${index}`}
                    gap={12}
                    align="start"
                    justify={item.role === "user" ? "end" : "start"}
                  >
                    <Avatar>{item.role === "user" ? "我" : "A"}</Avatar>
                    <div style={{ maxWidth: mobile ? "88%" : "80%", minWidth: 0 }}>
                      <Flex
                        gap={8}
                        justify={item.role === "user" ? "end" : "start"}
                        style={{ marginBottom: 4 }}
                      >
                        <Typography.Text style={{ fontSize: 12 }}>
                          {item.role === "user" ? userLabel() : "AI 助手"}
                        </Typography.Text>
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          {chat.conversations[0].time}
                        </Typography.Text>
                      </Flex>
                      <Card
                        size="small"
                        style={{
                          background:
                            item.role === "user"
                              ? token.colorPrimaryBg
                              : undefined,
                        }}
                      >
                        <div className="markdown-body">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {item.content}
                          </ReactMarkdown>
                        </div>
                        {item.sources ? (
                          <Space wrap>
                            {item.sources.map((source) => (
                              <Tag key={source}>{source}</Tag>
                            ))}
                          </Space>
                        ) : null}
                        {item.tool ? (
                          <Collapse
                            items={[
                              {
                                key: "tool",
                                label: `工具调用 · ${item.tool.name}`,
                                children: JSON.stringify(item.tool.args),
                              },
                            ]}
                          />
                        ) : null}
                        {item.streaming ? (
                          <Space>
                            <Spin size="small" />
                            生成中…
                          </Space>
                        ) : null}
                      </Card>
                    </div>
                  </Flex>
                ))}
              </Space>
            </Card>
          )}
          <Space wrap>
            {chat.suggestions.map((suggestion) => (
              <Tag
                key={suggestion}
                color="blue"
                onClick={() => setText(suggestion)}
                style={{ cursor: "pointer" }}
              >
                {suggestion}
              </Tag>
            ))}
          </Space>
          {mobile ? modelSelect : null}
          <Space.Compact block className="chat-input-bar">
            <Button icon={<Icon name="paperclip" />} aria-label="附件" />
            <Input.TextArea
              value={text}
              onChange={(event) => setText(event.target.value)}
              autoSize={{ minRows: 1, maxRows: 4 }}
              placeholder="输入消息..."
            />
            {mobile ? null : modelSelect}
            <Button
              type="primary"
              icon={<Icon name="send" />}
              aria-label="发送"
              onClick={() => {
                if (text) {
                  message.success("已发送")
                  setText("")
                }
              }}
            >
              {mobile ? null : "发送"}
            </Button>
          </Space.Compact>
          <Flex justify="space-between">
            <Typography.Text type="secondary">
              Enter 发送 · Shift+Enter 换行
            </Typography.Text>
            <Typography.Text type="secondary">
              {text.length}/2000
            </Typography.Text>
          </Flex>
        </Flex>
      </Layout.Content>
      <Drawer
        title="会话"
        placement="left"
        open={drawer}
        onClose={() => setDrawer(false)}
      >
        {conversation}
      </Drawer>
    </Layout>
  )
}
