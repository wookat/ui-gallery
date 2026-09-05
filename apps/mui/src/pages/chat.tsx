import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { PageHeader } from "./shared"

function copyChildren(children: unknown): string {
  if (Array.isArray(children)) return children.map(copyChildren).join("")
  if (typeof children === "string" || typeof children === "number")
    return String(children)
  return ""
}

export function ChatPage() {
  const [draft, setDraft] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeConversation, setActiveConversation] = useState<string | null>(
    "c1"
  )
  const [streaming, setStreaming] = useState(true)
  const [sent, setSent] = useState(false)
  const active = chat.conversations.find(
    (item) => item.id === activeConversation
  )
  const sessions = (
    <Box sx={{ width: 260, p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 600 }}>对话</Typography>
        <IconButton
          aria-label="新建对话"
          onClick={() => setActiveConversation(null)}
        >
          <Icon name="plus" />
        </IconButton>
      </Stack>
      <TextField
        fullWidth
        size="small"
        sx={{ mt: 2 }}
        placeholder="搜索对话"
        slotProps={{
          input: { startAdornment: <Icon name="search" size={18} /> },
        }}
      />
      <Button
        fullWidth
        sx={{ mt: 1.5 }}
        variant="contained"
        startIcon={<Icon name="plus" />}
        onClick={() => setActiveConversation(null)}
      >
        新建对话
      </Button>
      <List sx={{ mt: 1 }}>
        {chat.conversations.map((item) => (
          <ListItemButton
            key={item.id}
            selected={item.id === activeConversation}
            onClick={() => {
              setActiveConversation(item.id)
              setMobileOpen(false)
            }}
            sx={{ borderRadius: 1 }}
          >
            <ListItemText
              primary={item.title}
              secondary={item.time}
              sx={{ minWidth: 0 }}
            />
            {item.unread ? (
              <Badge badgeContent={item.unread} color="primary" />
            ) : null}
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
  const markdownComponents = {
    table: ({ children }: { children?: React.ReactNode }) => (
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">{children}</Table>
      </TableContainer>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => (
      <TableHead>{children}</TableHead>
    ),
    tbody: ({ children }: { children?: React.ReactNode }) => (
      <TableBody>{children}</TableBody>
    ),
    tr: ({ children }: { children?: React.ReactNode }) => (
      <TableRow>{children}</TableRow>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
      <TableCell component="th">{children}</TableCell>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
      <TableCell>{children}</TableCell>
    ),
    pre: ({ children }: { children?: React.ReactNode }) => {
      const text = copyChildren(children)
      return (
        <Box sx={{ position: "relative" }}>
          <Box component="pre" sx={{ m: 0, overflow: "auto", p: 1 }}>
            {children}
          </Box>
          <IconButton
            aria-label="复制"
            size="small"
            sx={{ position: "absolute", top: 2, right: 2 }}
            onClick={() => navigator.clipboard?.writeText(text)}
          >
            <Icon name="copy" />
          </IconButton>
        </Box>
      )
    },
  }
  return (
    <Stack spacing={3}>
      <PageHeader
        title="AI 对话"
        description="与团队智能助手协作，保留完整上下文。"
        action={
          <Button
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            onClick={() => setMobileOpen(true)}
            startIcon={<Icon name="message-square" />}
          >
            会话
          </Button>
        }
      />
      <Card sx={{ minHeight: 620, overflow: "hidden" }}>
        <Box sx={{ display: "flex", minHeight: 620 }}>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              borderRight: 1,
              borderColor: "divider",
            }}
          >
            {sessions}
          </Box>
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          >
            {sessions}
          </Drawer>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {active?.title ?? "开始新的对话"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  GPT-5 · 已连接
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">流式</Typography>
                <Switch
                  checked={streaming}
                  onChange={(event) => setStreaming(event.target.checked)}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>模型</InputLabel>
                  <Select defaultValue="gpt" label="模型">
                    <MenuItem value="gpt">GPT-5</MenuItem>
                    <MenuItem value="fast">Fast model</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
            <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: "auto" }}>
              {active ? (
                <Stack spacing={3}>
                  {chat.messages.map((message, index) => (
                    <Stack
                      key={`${message.role}-${index}`}
                      direction={
                        message.role === "user" ? "row-reverse" : "row"
                      }
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Avatar>{message.role === "user" ? "林" : "AI"}</Avatar>
                      <Box sx={{ maxWidth: "min(720px, 85%)", minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                          {message.role === "user" ? "林晓" : "AI 助手"} · 刚刚
                        </Typography>
                        <Paper
                          sx={{
                            mt: 0.5,
                            p: 1.5,
                            bgcolor:
                              message.role === "user"
                                ? "primary.main"
                                : "action.hover",
                            color:
                              message.role === "user"
                                ? "primary.contrastText"
                                : "text.primary",
                            overflow: "auto",
                          }}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </Paper>
                        {message.sources ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                            sx={{ mt: 1 }}
                          >
                            {message.sources.map((source) => (
                              <Chip
                                key={source}
                                size="small"
                                icon={<Icon name="paperclip" size={14} />}
                                label={source}
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        ) : null}
                        {message.tool ? (
                          <Card sx={{ mt: 1 }}>
                            <CardHeader
                              title={
                                <Typography variant="body2">
                                  工具调用 · {message.tool.name}
                                </Typography>
                              }
                            />
                            <CardContent>
                              <Box
                                component="pre"
                                sx={{ m: 0, overflow: "auto", fontSize: 12 }}
                              >
                                {JSON.stringify(message.tool.args, null, 2)}
                              </Box>
                            </CardContent>
                          </Card>
                        ) : null}
                        {streaming && message.streaming ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mt: 1 }}
                          >
                            <Skeleton width={120} />
                            <CircularProgress size={16} />
                          </Stack>
                        ) : null}
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Stack
                  spacing={3}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ minHeight: 420 }}
                >
                  <Typography variant="h4">开始新的对话</Typography>
                  <GridSuggestions
                    onSelect={(value) => {
                      setDraft(value)
                      setActiveConversation("c1")
                    }}
                  />
                </Stack>
              )}
            </Box>
            <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 1.5 }}
              >
                {chat.suggestions.map((suggestion) => (
                  <Chip
                    key={suggestion}
                    label={suggestion}
                    onClick={() => setDraft(suggestion)}
                    variant="outlined"
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={1} alignItems="flex-end">
                <IconButton aria-label="附件">
                  <Icon name="paperclip" />
                </IconButton>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="向 AI 助手提问..."
                />
                <IconButton
                  aria-label="发送"
                  color="primary"
                  onClick={() => {
                    setSent(true)
                    setDraft("")
                  }}
                >
                  <Icon name="send" />
                </IconButton>
              </Stack>
              {sent ? (
                <Typography variant="caption" color="text.secondary">
                  消息已发送（本地演示）
                </Typography>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Card>
    </Stack>
  )
}

function GridSuggestions({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 1,
        width: "100%",
      }}
    >
      {chat.suggestions.map((suggestion) => (
        <Card
          key={suggestion}
          variant="outlined"
          onClick={() => onSelect(suggestion)}
          sx={{ cursor: "pointer" }}
        >
          <CardContent>
            <Typography>{suggestion}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
