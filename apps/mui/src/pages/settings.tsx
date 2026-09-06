import { useState } from "react"
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { PageHeader, StatusBadge } from "./shared"

export function SettingsPage() {
  const [tab, setTab] = useState("profile")
  const [saved, setSaved] = useState(false)
  const [danger, setDanger] = useState(false)
  const [dangerText, setDangerText] = useState("")
  const [channel, setChannel] = useState("email")
  const theme = useTheme()
  const compact = useMediaQuery(theme.breakpoints.down("sm"))
  const channelLabels: Record<string, string> = {
    email: "邮件",
    push: "推送",
    inbox: "站内",
  }
  return (
    <Stack spacing={3}>
      <PageHeader title="设置" description="管理你的账户、团队与订阅设置。" />
      <Tabs
        value={tab}
        onChange={(_, value: string) => setTab(value)}
        variant={compact ? "fullWidth" : "scrollable"}
        scrollButtons="auto"
        sx={
          compact ? { "& .MuiTab-root": { minWidth: 0, px: 0.5 } } : undefined
        }
      >
        <Tab value="profile" label="个人资料" />
        <Tab value="security" label="安全" />
        <Tab value="notifications" label="通知" />
        <Tab value="team" label="团队" />
        <Tab value="billing" label="账单" />
      </Tabs>
      {tab === "profile" ? (
        <Card>
          <CardHeader title="个人资料" subheader="更新你的公开账户信息。" />
          <CardContent>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 64, height: 64 }}>林</Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>林晓</Typography>
                  <Typography variant="body2" color="text.secondary">
                    admin@acme.dev
                  </Typography>
                </Box>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{ ml: "auto" }}
                >
                  更换头像
                  <input hidden type="file" />
                </Button>
              </Stack>
              <Divider />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="姓名" defaultValue="林晓" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="邮箱"
                    defaultValue="admin@acme.dev"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>时区</InputLabel>
                    <Select defaultValue="china" label="时区">
                      <MenuItem value="china">中国时区</MenuItem>
                      <MenuItem value="utc">UTC</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="职位" defaultValue="产品负责人" />
                </Grid>
              </Grid>
              <Button variant="contained" onClick={() => setSaved(true)}>
                保存更改
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : null}
      {tab === "security" ? (
        <Stack spacing={2}>
          <Card>
            <CardHeader title="安全设置" subheader="保护你的账户与登录会话。" />
            <CardContent>
              <Stack spacing={2.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 2,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>双因素认证</Typography>
                    <Typography variant="body2" color="text.secondary">
                      登录时要求额外的验证码
                    </Typography>
                  </Box>
                  <Switch defaultChecked />
                </Stack>
                <Box
                  sx={{
                    border: 1,
                    borderStyle: "dashed",
                    borderColor: "divider",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    二维码占位 · 使用身份验证器扫描
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                  onClick={() => setSaved(true)}
                >
                  修改密码
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="登录会话" />
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>设备</TableCell>
                    <TableCell>位置</TableCell>
                    <TableCell>状态</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.device}>
                      <TableCell>{session.device}</TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={session.current ? "当前会话" : "已登录"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      ) : null}
      {tab === "notifications" ? (
        <Card>
          <CardHeader title="通知偏好" subheader="选择你希望接收的通知。" />
          <CardContent>
            <Stack spacing={2}>
              <ToggleButtonGroup
                exclusive
                value={channel}
                onChange={(_, value) => value && setChannel(value)}
                size="small"
              >
                <ToggleButton value="email">邮件</ToggleButton>
                <ToggleButton value="push">推送</ToggleButton>
                <ToggleButton value="inbox">站内</ToggleButton>
              </ToggleButtonGroup>
              {["项目更新", "账单提醒", "团队活动", "产品新闻"].map(
                (label, index) => (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    key={label}
                    sx={{
                      pb: 2,
                      borderBottom: index === 3 ? 0 : 1,
                      borderColor: "divider",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        通过{channelLabels[channel]}接收重要提醒
                      </Typography>
                    </Box>
                    <Switch defaultChecked={index < 3} />
                  </Stack>
                )
              )}
            </Stack>
          </CardContent>
        </Card>
      ) : null}
      {tab === "team" ? (
        <Card>
          <CardHeader title="团队成员" subheader="管理团队访问权限。" />
          <CardContent>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>成员</TableCell>
                    <TableCell>角色</TableCell>
                    <TableCell>最近活跃</TableCell>
                    <TableCell>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {team.map((member) => (
                    <TableRow key={member.email}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {member.name.slice(0, 1)}
                          </Avatar>
                          {member.name}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={member.role}
                        />
                      </TableCell>
                      <TableCell>{member.lastActive}</TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<Icon name="edit" />}>
                          编辑
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              startIcon={<Icon name="plus" />}
            >
              邀请成员
            </Button>
          </CardContent>
        </Card>
      ) : null}
      {tab === "billing" ? (
        <Stack spacing={2}>
          <Card>
            <CardHeader title="订阅方案" subheader="当前与可用方案。" />
            <CardContent>
              <Grid container spacing={2}>
                {plans.map((plan) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={plan.name}>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: plan.recommended
                          ? "primary.main"
                          : "divider",
                        borderRadius: 1,
                        p: 2,
                        height: "100%",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontWeight: 600 }}>
                          {plan.name}
                        </Typography>
                        {plan.recommended ? (
                          <Chip size="small" color="primary" label="推荐" />
                        ) : null}
                      </Stack>
                      <Typography variant="h5" sx={{ mt: 1 }}>
                        {plan.price === null
                          ? "定制"
                          : plan.price === 0
                            ? "免费"
                            : `¥${plan.price}`}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {plan.features.join(" · ")}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="发票记录" />
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>编号</TableCell>
                    <TableCell>日期</TableCell>
                    <TableCell>金额</TableCell>
                    <TableCell>状态</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>¥{invoice.amount}</TableCell>
                      <TableCell>
                        <StatusBadge value={invoice.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      ) : null}
      <Card variant="outlined" sx={{ borderColor: "error.main" }}>
        <CardHeader
          title="危险区"
          subheader="删除账户后所有数据将被永久删除。"
        />
        <CardContent>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              setDangerText("")
              setDanger(true)
            }}
          >
            删除账户
          </Button>
        </CardContent>
      </Card>
      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
      >
        <Alert severity="success" onClose={() => setSaved(false)}>
          设置已保存
        </Alert>
      </Snackbar>
      <Dialog open={danger} onClose={() => setDanger(false)}>
        <DialogTitle>确定删除账户？</DialogTitle>
        <DialogContent>
          <Typography>所有数据将被永久删除。</Typography>
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="输入 删除 以确认"
            value={dangerText}
            onChange={(event) => setDangerText(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDanger(false)}>取消</Button>
          <Button
            color="error"
            disabled={dangerText !== "删除"}
            onClick={() => setDanger(false)}
          >
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
