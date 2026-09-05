import { useState } from "react"
import type { Dayjs } from "dayjs"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { PageHeader } from "./shared"

const steps = ["基本信息", "详细配置", "确认提交"]

export function FormPage() {
  const [step, setStep] = useState(0)
  const [success, setSuccess] = useState(false)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [time, setTime] = useState<Dayjs | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [agree, setAgree] = useState(false)

  if (success)
    return (
      <Stack spacing={3}>
        <PageHeader
          title="创建项目"
          description="用三步完成一个新的工作区配置。"
        />
        <Alert severity="success" icon={<Icon name="check" />}>
          <Typography sx={{ fontWeight: 600 }}>项目创建成功</Typography>
          你的工作区已经准备就绪。
        </Alert>
        <Button
          variant="contained"
          onClick={() => {
            setSuccess(false)
            setStep(0)
          }}
        >
          进入项目
        </Button>
      </Stack>
    )
  return (
    <Stack spacing={3}>
      <PageHeader
        title="创建项目"
        description="用三步完成一个新的工作区配置。"
      />
      <Stepper
        activeStep={step}
        orientation="vertical"
        sx={{ display: { xs: "flex", md: "none" } }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stepper
        activeStep={step}
        alternativeLabel
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Card>
        <CardHeader
          title={steps[step]}
          subheader={
            step === 0
              ? "告诉我们项目的基础信息。"
              : step === 1
                ? "选择计划、权限与通知。"
                : "检查配置后提交。"
          }
        />
        <CardContent>
          {step === 0 ? (
            <Stack spacing={2.5}>
              <TextField
                required
                label="项目名称"
                value={name}
                onChange={(event) => setName(event.target.value)}
                error={!name}
                helperText={!name ? "请输入项目名称" : undefined}
              />
              <Autocomplete
                options={["Pro plan", "Team plan"]}
                renderInput={(params) => (
                  <TextField {...params} label="项目类型" />
                )}
              />
              <TextField
                label="邮箱"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={Boolean(email) && !email.includes("@")}
                helperText={
                  email && !email.includes("@")
                    ? "请输入有效邮箱"
                    : "使用工作邮箱登录。"
                }
              />
              <TextField
                multiline
                minRows={3}
                label="描述"
                helperText="最多 500 个字符。"
              />
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  disabled={!name}
                  onClick={() => setStep(1)}
                  endIcon={<Icon name="arrow-right" />}
                >
                  下一步
                </Button>
              </Stack>
            </Stack>
          ) : null}
          {step === 1 ? (
            <Stack spacing={2.5}>
              <FormControl>
                <Typography variant="subtitle2">计划</Typography>
                <RadioGroup defaultValue="team" row>
                  <FormControlLabel
                    value="pro"
                    control={<Radio />}
                    label="Pro · 适合小型团队"
                  />
                  <FormControlLabel
                    value="team"
                    control={<Radio />}
                    label="Team · 适合协作团队"
                  />
                </RadioGroup>
              </FormControl>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>通知频率</InputLabel>
                  <Select defaultValue="daily" label="通知频率">
                    <MenuItem value="daily">每日</MenuItem>
                    <MenuItem value="weekly">每周</MenuItem>
                  </Select>
                </FormControl>
                <TextField fullWidth label="电话" placeholder="+86 138..." />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <DatePicker
                  label="提醒日期"
                  value={date}
                  onChange={setDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
                <TimePicker
                  label="提醒时间"
                  value={time}
                  onChange={setTime}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Stack>
              <Box>
                <Typography variant="body2">采样比例</Typography>
                <Slider defaultValue={60} valueLabelDisplay="auto" />
                <FormHelperText>选择项目数据采样比例。</FormHelperText>
              </Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>通知开关</Typography>
                  <Typography variant="body2" color="text.secondary">
                    接收项目活动提醒
                  </Typography>
                </Box>
                <Switch defaultChecked />
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => setStep(0)}>
                  上一步
                </Button>
                <Button variant="contained" onClick={() => setStep(2)}>
                  下一步
                </Button>
              </Stack>
            </Stack>
          ) : null}
          {step === 2 ? (
            <Stack spacing={2.5}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" },
                  gap: 1,
                }}
              >
                <Typography color="text.secondary">项目名称</Typography>
                <Typography>{name || "未填写"}</Typography>
                <Typography color="text.secondary">邮箱</Typography>
                <Typography>{email || "未填写"}</Typography>
                <Typography color="text.secondary">项目类型</Typography>
                <Typography>Team plan</Typography>
                <Typography color="text.secondary">通知</Typography>
                <Typography>每日</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agree}
                    onChange={(event) => setAgree(event.target.checked)}
                  />
                }
                label="我同意服务条款与隐私政策"
              />
              <Stack direction="row" justifyContent="space-between">
                <Button variant="outlined" onClick={() => setStep(1)}>
                  上一步
                </Button>
                <Button
                  variant="contained"
                  disabled={!agree}
                  onClick={() => setSuccess(true)}
                >
                  提交项目
                </Button>
              </Stack>
            </Stack>
          ) : null}
        </CardContent>
      </Card>
    </Stack>
  )
}
