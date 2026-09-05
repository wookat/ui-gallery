import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  Alert,
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
  TextField,
  Typography,
} from "@mui/material"
import chat from "@ui-gallery/spec/mock/chat.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { PageHeader } from "./shared"

export function ChatPage() {
  const [draft, setDraft] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const sessions = (
    <Box sx={{ width: 260, p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontWeight: 600 }}>对话</Typography>
        <IconButton>
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
      >
        新建对话
      </Button>
      <List sx={{ mt: 1 }}>
        {chat.conversations.map((item, index) => (
          <ListItemButton
            key={item.id}
            selected={index === 0}
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
                  {chat.conversations[0].title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  GPT-5 · 已连接
                </Typography>
              </Box>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>模型</InputLabel>
                <Select defaultValue="gpt" label="模型">
                  <MenuItem value="gpt">GPT-5</MenuItem>
                  <MenuItem value="fast">Fast model</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: "auto" }}>
              <Stack spacing={3}>
                {chat.messages.map((message, index) => (
                  <Stack
                    key={`${message.role}-${index}`}
                    direction={message.role === "user" ? "row-reverse" : "row"}
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
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
                    </Box>
                  </Stack>
                ))}
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar>
                    <Icon name="bot" />
                  </Avatar>
                  <Stack spacing={1} width={200}>
                    <Skeleton />
                    <Skeleton width="70%" />
                    <CircularProgress size={16} />
                  </Stack>
                </Stack>
              </Stack>
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
                <IconButton>
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
                  color="primary"
                  onClick={() => {
                    setSent(true)
                    setDraft("")
                  }}
                >
                  <Icon name="send" />
                </IconButton>
                <IconButton sx={{ display: { xs: "none", sm: "inline-flex" } }}>
                  <Icon name="mic" />
                </IconButton>
              </Stack>
              {sent ? (
                <Alert
                  severity="success"
                  sx={{ mt: 1 }}
                  onClose={() => setSent(false)}
                >
                  消息已发送（本地演示）
                </Alert>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Card>
      <Alert severity="info" icon={<Icon name="sparkles" />}>
        流式响应占位：真实请求接入时会在此展示 Skeleton 流式状态。
      </Alert>
    </Stack>
  )
}
