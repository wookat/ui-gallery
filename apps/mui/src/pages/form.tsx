import { useState } from "react"
import type { Dayjs } from "dayjs"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import landing from "@ui-gallery/spec/mock/landing.json"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Slider,
  Stack as MuiStack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { Icon } from "@/components/icon"
import { FlexStack as Stack } from "@/components/flex-stack"
import { PageHeader } from "./shared"

const steps = ["基本信息", "详细配置", "确认提交"]

export function FormPage() {
  const [step, setStep] = useState(0)
  const [success, setSuccess] = useState(false)
  const [touched, setTouched] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [desc, setDesc] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("+86")
  const [checks, setChecks] = useState<string[]>([])
  const [date, setDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [time, setTime] = useState<Dayjs | null>(null)
  const [multi, setMulti] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [agree, setAgree] = useState(false)
  const validFirst = Boolean(
    name && email.includes("@") && phone && desc && checks.length
  )
  const validSecond = Boolean(date && endDate)
  const chooseFiles = (list: FileList | null) =>
    list && setFiles((current) => [...current, ...Array.from(list)])
  const next = () => {
    setTouched(true)
    if (step === 0 && validFirst) {
      setTouched(false)
      setStep(1)
    }
    if (step === 1 && validSecond) {
      setTouched(false)
      setStep(2)
    }
  }
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
      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Card>
        <CardHeader title={steps[step]} />
        <CardContent>
          {step === 0 ? (
            <Stack spacing={2.5}>
              <TextField
                required
                label="项目名称"
                value={name}
                onChange={(event) => setName(event.target.value)}
                error={touched && !name}
                helperText={touched && !name ? "请输入项目名称" : undefined}
              />
              <Autocomplete
                options={["Pro plan", "Team plan"]}
                slotProps={{
                  popupIndicator: { sx: { width: 40, height: 40 } },
                  clearIndicator: { sx: { width: 40, height: 40 } },
                }}
                renderInput={(params) => (
                  <TextField {...params} label="项目类型" required />
                )}
              />
              <TextField
                required
                label="邮箱"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={touched && !email.includes("@")}
                helperText={
                  touched && !email.includes("@")
                    ? "请输入有效邮箱"
                    : "使用工作邮箱登录。"
                }
              />
              <MuiStack direction="row" spacing={1}>
                <FormControl sx={{ minWidth: 100 }}>
                  <InputLabel>区号</InputLabel>
                  <Select
                    value={country}
                    label="区号"
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    <MenuItem value="+86">+86</MenuItem>
                    <MenuItem value="+1">+1</MenuItem>
                    <MenuItem value="+44">+44</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  required
                  fullWidth
                  label="电话"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  error={touched && !phone}
                  helperText={touched && !phone ? "请输入电话" : undefined}
                />
              </MuiStack>
              <TextField
                required
                multiline
                minRows={3}
                label="描述"
                value={desc}
                onChange={(event) => setDesc(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 500 } }}
                helperText={
                  touched && !desc ? "请输入描述" : `${desc.length}/500`
                }
                error={touched && !desc}
              />
              <FormGroup>
                {landing.features.slice(0, 3).map((feature) => (
                  <FormControlLabel
                    key={feature.title}
                    control={
                      <Checkbox
                        checked={checks.includes(feature.title)}
                        onChange={(event) =>
                          setChecks((current) =>
                            event.target.checked
                              ? [...current, feature.title]
                              : current.filter(
                                  (value) => value !== feature.title
                                )
                          )
                        }
                      />
                    }
                    label={feature.title}
                  />
                ))}
              </FormGroup>
              {touched && !checks.length ? (
                <FormHelperText error>至少选择一项功能</FormHelperText>
              ) : null}
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={next}
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
              <FormControl fullWidth>
                <InputLabel>通知频率</InputLabel>
                <Select defaultValue="daily" label="通知频率">
                  <MenuItem value="daily">每日</MenuItem>
                  <MenuItem value="weekly">每周</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>关注范围</InputLabel>
                <Select
                  multiple
                  value={multi}
                  label="关注范围"
                  onChange={(event) =>
                    setMulti(
                      typeof event.target.value === "string"
                        ? event.target.value.split(",")
                        : event.target.value
                    )
                  }
                  renderValue={(selected) => (
                    <MuiStack direction="row" spacing={0.5}>
                      {selected.map((value) => (
                        <Chip key={value} size="small" label={value} />
                      ))}
                    </MuiStack>
                  )}
                >
                  {landing.features.map((feature) => (
                    <MenuItem key={feature.title} value={feature.title}>
                      {feature.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <MuiStack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <DatePicker
                  label="开始"
                  value={date}
                  onChange={setDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: touched && !date,
                    },
                    openPickerButton: { sx: { width: 40, height: 40 } },
                  }}
                />
                <DatePicker
                  label="结束"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: touched && !endDate,
                    },
                    openPickerButton: { sx: { width: 40, height: 40 } },
                  }}
                />
              </MuiStack>
              {touched && !validSecond ? (
                <FormHelperText error>请选择日期范围</FormHelperText>
              ) : null}
              <TimePicker
                label="提醒时间"
                value={time}
                onChange={setTime}
                slotProps={{
                  textField: { fullWidth: true },
                  openPickerButton: { sx: { width: 40, height: 40 } },
                }}
              />
              <TextField
                label="颜色选择"
                type="color"
                defaultValue="#1976d2"
                slotProps={{ htmlInput: { "aria-label": "颜色选择" } }}
              />
              <Box>
                <Typography variant="body2">采样比例</Typography>
                <Slider
                  defaultValue={[20, 60]}
                  valueLabelDisplay="auto"
                  disableSwap
                />
                <FormHelperText>选择项目数据采样比例。</FormHelperText>
              </Box>
              <Box>
                <Typography variant="body2">评分</Typography>
                <Rating defaultValue={4} />
              </Box>
              <Box
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  chooseFiles(event.dataTransfer.files)
                }}
                sx={{
                  border: 1,
                  borderStyle: "dashed",
                  borderColor: "divider",
                  p: 3,
                  textAlign: "center",
                }}
              >
                <Button component="label" startIcon={<Icon name="upload" />}>
                  上传文件
                  <input
                    hidden
                    type="file"
                    multiple
                    onChange={(event) => chooseFiles(event.target.files)}
                  />
                </Button>
                <List dense>
                  {files.map((file, index) => (
                    <ListItem
                      key={`${file.name}-${index}`}
                      secondaryAction={
                        <IconButton
                          aria-label="删除"
                          onClick={() =>
                            setFiles((current) =>
                              current.filter(
                                (_, fileIndex) => fileIndex !== index
                              )
                            )
                          }
                        >
                          <Icon name="trash" size={24} />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={file.name} />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Autocomplete
                multiple
                freeSolo
                slotProps={{
                  popupIndicator: { sx: { width: 40, height: 40 } },
                  clearIndicator: { sx: { width: 40, height: 40 } },
                }}
                options={landing.features.map((feature) => feature.title)}
                value={tags}
                onChange={(_, value) => setTags(value)}
                renderValue={(value, getItemProps) =>
                  (value as string[]).map((option, index) => (
                    <Chip
                      label={option}
                      {...getItemProps({ index })}
                      key={option}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} label="标签" />}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>字段说明</Typography>
                <Tooltip title="配置完成后可在确认步骤检查。">
                  <IconButton aria-label="帮助">
                    <Icon name="circle-help" size={24} />
                  </IconButton>
                </Tooltip>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Button variant="outlined" onClick={() => setStep(0)}>
                  上一步
                </Button>
                <Button variant="contained" onClick={next}>
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
                <Typography color="text.secondary">电话</Typography>
                <Typography>
                  {country} {phone || "未填写"}
                </Typography>
                <Typography color="text.secondary">描述</Typography>
                <Typography>{desc || "未填写"}</Typography>
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
