import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"

export function LoginPage() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 440 }}>
        <CardHeader
          avatar={
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontWeight: 700,
              }}
            >
              A
            </Box>
          }
          title="Acme Console"
          subheader={
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" color="text.primary">
                欢迎回来
              </Typography>
              <Typography variant="body2">
                登录 Acme Console，继续你的工作。
              </Typography>
            </Box>
          }
        />
        <CardContent>
          <Stack spacing={3}>
            <Alert severity="error" icon={<Icon name="alert-circle" />}>
              密码错误时会在这里显示验证错误。
            </Alert>
            <Box
              component="form"
              onSubmit={(event) => {
                event.preventDefault()
                setLoading(true)
                window.setTimeout(() => setLoading(false), 700)
              }}
            >
              <Stack spacing={2.5}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="邮箱"
                  placeholder="you@example.com"
                  helperText="使用工作邮箱登录。"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon name="mail" size={18} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="密码"
                  type={visible ? "text" : "password"}
                  placeholder="••••••••"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon name="lock" size={18} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setVisible((value) => !value)}
                            edge="end"
                          >
                            <Icon name={visible ? "eye-off" : "eye"} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormControlLabel control={<Checkbox />} label="记住我" />
                  <Link to="#forgot">忘记密码？</Link>
                </Stack>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? (
                    <Icon
                      name="loader"
                      sx={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    "登录"
                  )}
                </Button>
              </Stack>
            </Box>
            <Divider>或</Divider>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Icon name="globe" />}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Icon name="github" />}
              >
                GitHub
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Icon name="message-circle" />}
              >
                微信
              </Button>
            </Stack>
          </Stack>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            还没有账户？ <Link to="#register">立即注册</Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
