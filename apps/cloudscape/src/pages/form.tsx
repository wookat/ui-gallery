import { useState } from "react"
import Autosuggest from "@cloudscape-design/components/autosuggest"
import Box from "@cloudscape-design/components/box"
import Button from "@cloudscape-design/components/button"
import Checkbox from "@cloudscape-design/components/checkbox"
import ColumnLayout from "@cloudscape-design/components/column-layout"
import Container from "@cloudscape-design/components/container"
import ContentLayout from "@cloudscape-design/components/content-layout"
import DatePicker from "@cloudscape-design/components/date-picker"
import DateRangePicker, { type DateRangePickerProps } from "@cloudscape-design/components/date-range-picker"
import FileUpload from "@cloudscape-design/components/file-upload"
import FormField from "@cloudscape-design/components/form-field"
import Header from "@cloudscape-design/components/header"
import Input from "@cloudscape-design/components/input"
import KeyValuePairs from "@cloudscape-design/components/key-value-pairs"
import Multiselect, { type MultiselectProps } from "@cloudscape-design/components/multiselect"
import Popover from "@cloudscape-design/components/popover"
import RadioGroup from "@cloudscape-design/components/radio-group"
import Select, { type SelectProps } from "@cloudscape-design/components/select"
import Slider from "@cloudscape-design/components/slider"
import SpaceBetween from "@cloudscape-design/components/space-between"
import StatusIndicator from "@cloudscape-design/components/status-indicator"
import Textarea from "@cloudscape-design/components/textarea"
import TimeInput from "@cloudscape-design/components/time-input"
import Toggle from "@cloudscape-design/components/toggle"
import TokenGroup from "@cloudscape-design/components/token-group"
import Wizard from "@cloudscape-design/components/wizard"

import nav from "@ui-gallery/spec/mock/nav.json"
import orders from "@ui-gallery/spec/mock/orders.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import team from "@ui-gallery/spec/mock/team.json"

import { AppIcon, iconProps } from "@/lib/icons"
import { useAppNav } from "@/lib/nav"
import { label, PageHeader } from "./shared"

const COUNTRY_CODES = ["+86", "+1", "+44", "+81"]
const PRODUCTS = Array.from(new Set(orders.map((o) => o.product)))
const CHANNELS = Array.from(new Set(orders.map((o) => o.channel)))
const ROLES = Array.from(new Set(team.map((m) => m.role)))
const SWATCHES = ["#0972d3", "#037f0c", "#d91515", "#8d6605", "#5f2fb6"]

function Required() {
  return <Box color="text-status-error" display="inline">*</Box>
}

function Hint({ text }: { text: string }) {
  return (
    <Popover dismissButton={false} position="top" size="small" triggerType="custom" content={text}>
      <Button variant="inline-icon" ariaLabel="说明" {...iconProps("circle-help")} />
    </Popover>
  )
}

export function FormPage() {
  const { go } = useAppNav()
  const [step, setStep] = useState(0)
  const [attempted, setAttempted] = useState<Record<number, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // step 1
  const [name, setName] = useState("")
  const [budget, setBudget] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState<SelectProps.Option>({ value: COUNTRY_CODES[0] })
  const [phone, setPhone] = useState("")
  const [desc, setDesc] = useState("")
  const [plan, setPlan] = useState<string | null>(null)
  const [channels, setChannels] = useState<string[]>([])
  const [publicProject, setPublicProject] = useState(true)
  // step 2
  const [product, setProduct] = useState<SelectProps.Option | null>(null)
  const [roles, setRoles] = useState<readonly MultiselectProps.Option[]>([])
  const [owner, setOwner] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [range, setRange] = useState<DateRangePickerProps.Value | null>(null)
  const [priority, setPriority] = useState(50)
  const [rating, setRating] = useState(0)
  const [color, setColor] = useState(SWATCHES[0])
  const [files, setFiles] = useState<File[]>([])
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  // step 3
  const [agree, setAgree] = useState(false)

  const e1 = {
    name: name.trim().length < 2 ? "项目名称至少 2 个字符" : undefined,
    budget: budget === "" || Number.isNaN(Number(budget)) || Number(budget) < 0 ? "请输入非负数字" : undefined,
    email: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "邮箱格式不正确" : undefined,
    phone: !/^\d{6,15}$/.test(phone) ? "电话为 6–15 位数字" : undefined,
    desc: desc.length > 200 ? "最多 200 字" : undefined,
    plan: !plan ? "请选择计划" : undefined,
    channels: channels.length === 0 ? "至少选择一个渠道" : undefined,
  }
  const e2 = {
    product: !product ? "请选择产品" : undefined,
    owner: owner && !team.some((m) => m.name === owner) ? "请选择团队成员" : !owner ? "请选择负责人" : undefined,
    date: !/^\d{4}-\d{2}-\d{2}$/.test(date) ? "请选择日期" : undefined,
    time: !/^\d{2}:\d{2}$/.test(time) ? "请选择时间" : undefined,
    rating: rating === 0 ? "请打分" : undefined,
  }
  const e3 = { agree: !agree ? "请先同意条款" : undefined }
  const valid = (errors: Record<string, string | undefined>) => Object.values(errors).every((v) => !v)
  const show = (i: number, err?: string) => (attempted[i] ? err : undefined)

  const tryNavigate = (target: number) => {
    const errors = [e1, e2, e3][step]
    if (target > step && !valid(errors)) {
      setAttempted((a) => ({ ...a, [step]: true }))
      return
    }
    setStep(target)
  }

  const submit = () => {
    if (!valid(e3)) {
      setAttempted((a) => ({ ...a, 2: true }))
      return
    }
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setDone(true)
    }, 900)
  }

  if (done) {
    return (
      <ContentLayout header={<PageHeader title="新建项目" />}>
        <Container>
          <Box textAlign="center" padding="xxl">
            <SpaceBetween size="m" alignItems="center">
              <AppIcon name="check" size="large" />
              <Header variant="h2">项目「{name}」已创建</Header>
              <StatusIndicator type="success">已提交，负责人 {owner} 将收到通知</StatusIndicator>
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="primary" onClick={() => go("/")}>
                  返回{nav[0].label}
                </Button>
                <Button onClick={() => go("/orders")}>查看订单</Button>
              </SpaceBetween>
            </SpaceBetween>
          </Box>
        </Container>
      </ContentLayout>
    )
  }

  return (
    <Wizard
      i18nStrings={{
        stepNumberLabel: (n) => `第 ${n} 步`,
        collapsedStepsLabel: (n, total) => `第 ${n} / ${total} 步`,
        skipToButtonLabel: (s) => `跳到 ${s.title}`,
        navigationAriaLabel: "步骤",
        cancelButton: "取消",
        previousButton: "上一步",
        nextButton: "下一步",
        submitButton: "提交",
        optional: "可选",
      }}
      activeStepIndex={step}
      onNavigate={({ detail }) => tryNavigate(detail.requestedStepIndex)}
      onCancel={() => go("/")}
      onSubmit={submit}
      isLoadingNextStep={submitting}
      steps={[
        {
          title: "基本信息",
          description: "项目名称、联系方式与偏好",
          content: (
            <Container header={<Header variant="h2">基本信息</Header>}>
              <SpaceBetween size="l">
                <ColumnLayout columns={2}>
                  <FormField label={<>项目名称 <Required /></>} errorText={show(0, e1.name)} description="对外展示的名称">
                    <Input value={name} onChange={({ detail }) => setName(detail.value)} placeholder="例如：落地页改版" />
                  </FormField>
                  <FormField label={<>预算（元） <Required /></>} errorText={show(0, e1.budget)} constraintText="非负整数">
                    <Input type="number" inputMode="numeric" value={budget} onChange={({ detail }) => setBudget(detail.value)} />
                  </FormField>
                  <FormField label={<>联系邮箱 <Required /></>} errorText={show(0, e1.email)}>
                    <Input type="email" value={email} onChange={({ detail }) => setEmail(detail.value)} placeholder="name@company.com" />
                  </FormField>
                  <FormField label={<>联系电话 <Required /></>} errorText={show(0, e1.phone)}>
                    <SpaceBetween direction="horizontal" size="xs">
                      <Select
                        selectedOption={code}
                        onChange={({ detail }) => setCode(detail.selectedOption)}
                        options={COUNTRY_CODES.map((c) => ({ value: c }))}
                        ariaLabel="国家码"
                      />
                      <Input type="text" inputMode="tel" value={phone} onChange={({ detail }) => setPhone(detail.value)} placeholder="手机号" />
                    </SpaceBetween>
                  </FormField>
                </ColumnLayout>
                <FormField label="项目描述" errorText={show(0, e1.desc)} constraintText={`${desc.length}/200`} stretch>
                  <Textarea value={desc} onChange={({ detail }) => setDesc(detail.value)} rows={3} placeholder="一句话说明目标" />
                </FormField>
                <FormField label={<>订阅计划 <Required /></>} errorText={show(0, e1.plan)}>
                  <RadioGroup
                    value={plan}
                    onChange={({ detail }) => setPlan(detail.value)}
                    items={plans.map((p) => ({
                      value: p.name,
                      label: p.name,
                      description: p.price === null ? "联系销售" : `¥${p.price}/月 · ${p.features[0]}`,
                    }))}
                  />
                </FormField>
                <FormField label={<>投放渠道 <Required /></>} errorText={show(0, e1.channels)}>
                  <SpaceBetween direction="horizontal" size="l">
                    {CHANNELS.map((c) => (
                      <Checkbox
                        key={c}
                        checked={channels.includes(c)}
                        onChange={({ detail }) => setChannels((v) => (detail.checked ? [...v, c] : v.filter((x) => x !== c)))}
                      >
                        {c}
                      </Checkbox>
                    ))}
                  </SpaceBetween>
                </FormField>
                <Toggle checked={publicProject} onChange={({ detail }) => setPublicProject(detail.checked)}>
                  公开给全团队可见
                </Toggle>
              </SpaceBetween>
            </Container>
          ),
        },
        {
          title: "详细配置",
          description: "产品、人员、时间与附件",
          content: (
            <Container header={<Header variant="h2">详细配置</Header>}>
              <SpaceBetween size="l">
                <ColumnLayout columns={2}>
                  <FormField label={<>关联产品 <Required /></>} errorText={show(1, e2.product)}>
                    <Select
                      selectedOption={product}
                      onChange={({ detail }) => setProduct(detail.selectedOption)}
                      options={PRODUCTS.map((p) => ({ value: p }))}
                      placeholder="选择产品"
                    />
                  </FormField>
                  <FormField label="可见角色" description="多选">
                    <Multiselect
                      selectedOptions={roles}
                      onChange={({ detail }) => setRoles(detail.selectedOptions)}
                      options={ROLES.map((r) => ({ value: r, label: label(r) }))}
                      placeholder="选择角色"
                    />
                  </FormField>
                  <FormField label={<>负责人 <Required /> <Hint text="输入姓名自动补全团队成员" /></>} errorText={show(1, e2.owner)}>
                    <Autosuggest
                      value={owner}
                      onChange={({ detail }) => setOwner(detail.value)}
                      options={team.map((m) => ({ value: m.name, description: m.email }))}
                      placeholder="搜索成员"
                      enteredTextLabel={(v) => `使用 “${v}”`}
                      ariaLabel="负责人"
                    />
                  </FormField>
                  <FormField label={<>开始日期 <Required /></>} errorText={show(1, e2.date)}>
                    <DatePicker value={date} onChange={({ detail }) => setDate(detail.value)} placeholder="YYYY/MM/DD" openCalendarAriaLabel={() => "打开日历"} />
                  </FormField>
                  <FormField label={<>提醒时间 <Required /></>} errorText={show(1, e2.time)}>
                    <TimeInput value={time} onChange={({ detail }) => setTime(detail.value)} format="hh:mm" placeholder="hh:mm" />
                  </FormField>
                  <FormField label="活动周期">
                    <DateRangePicker
                      value={range}
                      onChange={({ detail }) => setRange(detail.value)}
                      dateOnly
                      placeholder="选择区间"
                      relativeOptions={[
                        { key: "1w", amount: 1, unit: "week", type: "relative" },
                        { key: "1m", amount: 1, unit: "month", type: "relative" },
                      ]}
                      isValidRange={() => ({ valid: true })}
                    />
                  </FormField>
                </ColumnLayout>
                <FormField label={`优先级：${priority}`} description="0–100，越高越优先" stretch>
                  <Slider value={priority} onChange={({ detail }) => setPriority(detail.value)} min={0} max={100} step={5} referenceValues={[25, 50, 75]} />
                </FormField>
                <FormField label={<>重要程度 <Required /></>} errorText={show(1, e2.rating)}>
                  <SpaceBetween direction="horizontal" size="xxs">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Button
                        key={n}
                        variant="inline-icon"
                        ariaLabel={`${n} 星`}
                        iconName={n <= rating ? "star-filled" : "star"}
                        onClick={() => setRating(n)}
                      />
                    ))}
                  </SpaceBetween>
                </FormField>
                <FormField label="主题色" description="用于项目标识">
                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    {SWATCHES.map((c) => (
                      <Button key={c} variant={c === color ? "primary" : "normal"} onClick={() => setColor(c)} ariaLabel={c}>
                        <span className="gallery-swatch" style={{ background: c, display: "inline-block" }} />
                      </Button>
                    ))}
                    <input className="gallery-color-input" type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="自定义颜色" />
                    <Box variant="code">{color}</Box>
                  </SpaceBetween>
                </FormField>
                <FormField label="附件" description="拖拽或点击上传，最多 5 个" stretch>
                  <FileUpload
                    value={files}
                    onChange={({ detail }) => setFiles(detail.value)}
                    multiple
                    showFileSize
                    showFileLastModified
                    tokenLimit={5}
                    constraintText="支持 PDF / PNG / CSV"
                    i18nStrings={{
                      uploadButtonText: (multi) => (multi ? "选择文件" : "选择文件"),
                      dropzoneText: (multi) => (multi ? "拖拽文件到此处" : "拖拽文件到此处"),
                      removeFileAriaLabel: (i) => `移除第 ${i + 1} 个文件`,
                      limitShowFewer: "收起",
                      limitShowMore: "更多",
                      errorIconAriaLabel: "错误",
                    }}
                  />
                </FormField>
                <FormField label="标签" description="回车添加" stretch>
                  <SpaceBetween size="xs">
                    <Input
                      value={tagInput}
                      onChange={({ detail }) => setTagInput(detail.value)}
                      onKeyDown={(e) => {
                        if (e.detail.key === "Enter" && tagInput.trim()) {
                          e.preventDefault()
                          setTags((t) => Array.from(new Set([...t, tagInput.trim()])))
                          setTagInput("")
                        }
                      }}
                      placeholder="输入标签后回车"
                    />
                    <TokenGroup
                      items={tags.map((t) => ({ label: t, dismissLabel: `移除 ${t}` }))}
                      onDismiss={({ detail }) => setTags((t) => t.filter((_, i) => i !== detail.itemIndex))}
                    />
                  </SpaceBetween>
                </FormField>
              </SpaceBetween>
            </Container>
          ),
        },
        {
          title: "确认",
          description: "检查信息并提交",
          content: (
            <SpaceBetween size="l">
              <Container header={<Header variant="h2">摘要</Header>}>
                <KeyValuePairs
                  columns={3}
                  items={[
                    { label: "项目名称", value: name || "—" },
                    { label: "预算", value: budget ? `¥${Number(budget).toLocaleString("zh-CN")}` : "—" },
                    { label: "联系邮箱", value: email || "—" },
                    { label: "联系电话", value: phone ? `${code.value} ${phone}` : "—" },
                    { label: "订阅计划", value: plan ?? "—" },
                    { label: "投放渠道", value: channels.join(", ") || "—" },
                    { label: "关联产品", value: product?.value ?? "—" },
                    { label: "负责人", value: owner || "—" },
                    { label: "开始日期", value: date ? `${date} ${time}` : "—" },
                    { label: "优先级", value: String(priority) },
                    { label: "重要程度", value: `${rating} / 5` },
                    { label: "附件", value: `${files.length} 个` },
                  ]}
                />
              </Container>
              <Container>
                <FormField errorText={show(2, e3.agree)}>
                  <Checkbox checked={agree} onChange={({ detail }) => setAgree(detail.checked)}>
                    我已阅读并同意服务条款与隐私政策
                  </Checkbox>
                </FormField>
              </Container>
            </SpaceBetween>
          ),
        },
      ]}
    />
  )
}
