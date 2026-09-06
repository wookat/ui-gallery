import { useState, type ReactElement } from "react"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import {
  Body1,
  Button,
  Caption1,
  Card,
  Checkbox,
  Combobox,
  Dropdown,
  Field,
  InfoLabel,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Option,
  Radio,
  RadioGroup,
  Rating,
  Slider,
  SpinButton,
  Switch,
  Tag,
  TagGroup,
  Text,
  Textarea,
  Title3,
  Tooltip,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from "@fluentui/react-components"
import { DatePicker } from "@fluentui/react-datepicker-compat"
import { TimePicker } from "@fluentui/react-timepicker-compat"
import { Icon } from "@/lib/icon"
import { PageHeader, SectionCard, useControlSize, useIsMobile, useLayoutStyles } from "./shared"

const useStyles = makeStyles({
  steps: { display: "flex", gap: tokens.spacingHorizontalS, alignItems: "center", flexWrap: "wrap" },
  step: { display: "flex", alignItems: "center", gap: tokens.spacingHorizontalXS, color: tokens.colorNeutralForeground3 },
  stepActive: { color: tokens.colorNeutralForeground1 },
  dot: { width: "28px", height: "28px", borderRadius: "50%", display: "grid", placeItems: "center", border: `1px solid ${tokens.colorNeutralStroke1}`, fontSize: tokens.fontSizeBase200, flexShrink: 0 },
  dotActive: { backgroundColor: tokens.colorBrandBackground, color: tokens.colorNeutralForegroundOnBrand, ...shorthands.borderColor(tokens.colorBrandBackground) },
  dotDone: { backgroundColor: tokens.colorPaletteGreenBackground3, color: tokens.colorNeutralForegroundOnBrand, ...shorthands.borderColor(tokens.colorPaletteGreenBackground3) },
  line: { flex: "1 1 24px", height: "1px", backgroundColor: tokens.colorNeutralStroke2, minWidth: "16px" },
  grid: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))" },
  full: { gridColumn: "1 / -1" },
  radioWrap: { flexWrap: "wrap" },
  color: { width: "48px", height: "32px", padding: 0, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: "transparent" },
  dropzone: { border: `1px dashed ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, padding: tokens.spacingVerticalXL, textAlign: "center", color: tokens.colorNeutralForeground3, display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.spacingVerticalXS, cursor: "pointer" },
  summary: { display: "grid", gridTemplateColumns: "minmax(80px, auto) 1fr", gap: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalL}` },
  success: { display: "flex", flexDirection: "column", alignItems: "center", gap: tokens.spacingVerticalM, padding: tokens.spacingVerticalXXXL, textAlign: "center" },
})

const stepTitles = ["基本信息", "偏好设置", "确认提交"]

type FormState = {
  name: string
  email: string
  phone: string
  countryCode: string
  channels: string[]
  age: number
  bio: string
  role: string
  plan: string
  owners: string[]
  tags: string[]
  date: Date | null | undefined
  time: Date | null | undefined
  rangeStart: Date | null | undefined
  rangeEnd: Date | null | undefined
  budgetMin: number
  budgetMax: number
  rating: number
  color: string
  notify: boolean
  marketing: boolean
  file: string
  agree: boolean
}

const initial: FormState = { name: "", email: "", phone: "", countryCode: "+86", channels: ["邮件"], age: 18, bio: "", role: "member", plan: "Pro", owners: [], tags: ["设计", "前端"], date: null, time: null, rangeStart: null, rangeEnd: null, budgetMin: 20, budgetMax: 60, rating: 4, color: "#0f6cbd", notify: true, marketing: false, file: "", agree: false }

const channelOptions = ["邮件", "短信", "站内"]

export function FormPage() {
  const s = useStyles()
  const l = useLayoutStyles()
  const isMobile = useIsMobile()
  const ctl = useControlSize()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initial)
  const [touched, setTouched] = useState(false)
  const [done, setDone] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }))

  const errors = {
    name: form.name.trim().length < 2 ? "姓名至少 2 个字符" : undefined,
    email: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) ? "请输入有效邮箱" : undefined,
    phone: form.phone && !/^1\d{10}$/.test(form.phone) ? "请输入 11 位手机号" : undefined,
    agree: !form.agree ? "请先同意服务条款" : undefined,
  }
  const step0Valid = !errors.name && !errors.email && !errors.phone
  const err = (key: keyof typeof errors) => (touched ? errors[key] : undefined)
  const state = (key: keyof typeof errors) => (touched && errors[key] ? "error" : "none")

  const next = () => {
    setTouched(true)
    if (step === 0 && !step0Valid) return
    if (step === 2 && errors.agree) return
    if (step === 2) return setDone(true)
    setTouched(false)
    setStep(step + 1)
  }

  if (done) {
    return (
      <div className={l.stack}>
        <PageHeader title="多步表单" description="提交成功" />
        <Card className={s.success}>
          <Icon name="check-circle" size={48} />
          <Title3>提交成功</Title3>
          <Body1 className={l.muted}>我们已收到你的信息，{form.name} 的账户将在 24 小时内完成审核。</Body1>
          <Button appearance="primary" size={ctl} onClick={() => { setForm(initial); setStep(0); setDone(false); setTouched(false) }}>再填一份</Button>
        </Card>
      </div>
    )
  }

  const stepper = (
    <div className={s.steps}>
      {stepTitles.map((title, index) => (
        <div key={title} style={{ display: "contents" }}>
          <div className={mergeClasses(s.step, index === step ? s.stepActive : "")}>
            <span className={mergeClasses(s.dot, index === step ? s.dotActive : index < step ? s.dotDone : "")}>{index < step ? <Icon name="check" size={14} /> : index + 1}</span>
            <Caption1>{title}</Caption1>
          </div>
          {index < stepTitles.length - 1 ? <span className={s.line} /> : null}
        </div>
      ))}
    </div>
  )

  const withHelp = (label: string, help: string): ReactElement => <InfoLabel info={help}>{label}</InfoLabel>

  return (
    <div className={l.stack}>
      <PageHeader title="多步表单" description={`第 ${step + 1} / 3 步 · ${stepTitles[step]}`} />
      {stepper}
      {step === 0 ? (
        <SectionCard title="基本信息" description="带有必填校验的常见字段">
          <div className={s.grid}>
            <Field label="姓名" required validationMessage={err("name")} validationState={state("name")}><Input size={ctl} value={form.name} onChange={(_, d) => set("name", d.value)} placeholder="林晓" /></Field>
            <Field label="邮箱" required validationMessage={err("email")} validationState={state("email")}><Input size={ctl} type="email" value={form.email} onChange={(_, d) => set("email", d.value)} placeholder="you@example.com" contentBefore={<Icon name="mail" size={16} />} /></Field>
            <Field label="手机号" validationMessage={err("phone")} validationState={state("phone")} hint="选填，用于接收短信通知">
              <div className={l.row} style={{ flexWrap: "nowrap" }}>
                <Dropdown size={ctl} value={form.countryCode} selectedOptions={[form.countryCode]} onOptionSelect={(_, d) => set("countryCode", d.optionValue ?? form.countryCode)} style={{ width: 96, minWidth: 96 }}>
                  {["+86", "+1", "+65", "+49"].map((cc) => <Option key={cc} value={cc}>{cc}</Option>)}
                </Dropdown>
                <Input size={ctl} type="tel" value={form.phone} onChange={(_, d) => set("phone", d.value)} placeholder="13800000000" style={{ flex: 1, minWidth: 0 }} />
              </div>
            </Field>
            <Field label="年龄">
              {isMobile ? (
                <div className={l.row} style={{ flexWrap: "nowrap" }}>
                  <Button size="large" icon={<Icon name="minus" />} aria-label="减少" onClick={() => set("age", Math.max(0, form.age - 1))} />
                  <Input size="large" type="number" value={String(form.age)} readOnly style={{ width: 96, textAlign: "center" }} aria-label="年龄" />
                  <Button size="large" icon={<Icon name="plus" />} aria-label="增加" onClick={() => set("age", Math.min(120, form.age + 1))} />
                </div>
              ) : (
                <SpinButton value={form.age} min={0} max={120} onChange={(_, d) => set("age", d.value ?? form.age)} />
              )}
            </Field>
            <Field label="通知渠道">
              <div className={l.row}>
                {channelOptions.map((c) => (
                  <Checkbox key={c} size={isMobile ? "large" : "medium"} label={c} checked={form.channels.includes(c)} onChange={(_, d) => set("channels", d.checked ? [...form.channels, c] : form.channels.filter((x) => x !== c))} />
                ))}
              </div>
            </Field>
            <Field label="角色" required>
              <RadioGroup layout="horizontal" className={s.radioWrap} value={form.role} onChange={(_, d) => set("role", d.value)}>
                <Radio value="owner" label="Owner" /><Radio value="admin" label="Admin" /><Radio value="member" label="Member" /><Radio value="viewer" label="Viewer" />
              </RadioGroup>
            </Field>
            <Field label={withHelp("计划", "可随时在设置 → 计费中更改")}>
              <Dropdown size={ctl} value={form.plan} selectedOptions={[form.plan]} onOptionSelect={(_, d) => set("plan", d.optionValue ?? form.plan)}>
                {plans.map((p) => <Option key={p.name} value={p.name}>{p.name}</Option>)}
              </Dropdown>
            </Field>
            <Field label="简介" className={s.full} hint={`${form.bio.length} / 200`}><Textarea value={form.bio} onChange={(_, d) => set("bio", d.value.slice(0, 200))} placeholder="介绍一下你的团队..." resize="vertical" /></Field>
            <Field label="只读字段"><Input size={ctl} value="ACME-2026" readOnly /></Field>
            <Field label="禁用字段"><Input size={ctl} value="不可编辑" disabled /></Field>
          </div>
        </SectionCard>
      ) : step === 1 ? (
        <SectionCard title="偏好设置" description="选择、日期、滑块、评分等复杂控件">
          <div className={s.grid}>
            <Field label="负责人（多选）">
              <Dropdown size={ctl} multiselect placeholder="选择成员" selectedOptions={form.owners} onOptionSelect={(_, d) => set("owners", d.selectedOptions)}>
                {team.map((m) => <Option key={m.email} value={m.name}>{m.name}</Option>)}
              </Dropdown>
            </Field>
            <Field label="搜索城市（Combobox）">
              <Combobox size={ctl} placeholder="输入以搜索" freeform>
                {["上海", "杭州", "北京", "深圳", "新加坡", "法兰克福"].map((c) => <Option key={c}>{c}</Option>)}
              </Combobox>
            </Field>
            <Field label="开始日期"><DatePicker size={ctl} value={form.date} onSelectDate={(d) => set("date", d)} placeholder="选择日期" /></Field>
            <Field label="提醒时间"><TimePicker size={ctl} placeholder="选择时间" selectedTime={form.time ?? undefined} onTimeChange={(_, d) => set("time", d.selectedTime)} /></Field>
            <Field label="日期范围" className={s.full}>
              <div className={l.row}>
                <DatePicker size={ctl} value={form.rangeStart} onSelectDate={(d) => set("rangeStart", d)} placeholder="开始" maxDate={form.rangeEnd ?? undefined} />
                <Icon name="arrow-right" size={16} />
                <DatePicker size={ctl} value={form.rangeEnd} onSelectDate={(d) => set("rangeEnd", d)} placeholder="结束" minDate={form.rangeStart ?? undefined} />
              </div>
            </Field>
            <Field label={`预算区间 ¥${form.budgetMin}k – ¥${form.budgetMax}k`} className={s.full}>
              <div className={l.stackS}>
                <Slider min={0} max={100} step={5} value={form.budgetMin} onChange={(_, d) => setForm((prev) => ({ ...prev, budgetMin: Math.min(d.value, prev.budgetMax) }))} aria-label="预算下限" />
                <Slider min={0} max={100} step={5} value={form.budgetMax} onChange={(_, d) => setForm((prev) => ({ ...prev, budgetMax: Math.max(d.value, prev.budgetMin) }))} aria-label="预算上限" />
              </div>
            </Field>
            <Field label="满意度"><Rating value={form.rating} onChange={(_, d) => set("rating", d.value)} /></Field>
            <Field label="品牌色">
              <div className={l.row}>
                <input type="color" aria-label="品牌色" className={s.color} value={form.color} onChange={(e) => set("color", e.target.value)} />
                <Text font="monospace">{form.color}</Text>
              </div>
            </Field>
            <Field label="标签" className={s.full} hint="回车添加">
              <div className={l.stackS}>
                <TagGroup onDismiss={(_, d) => set("tags", form.tags.filter((t) => t !== d.value))} aria-label="标签">
                  {form.tags.map((t) => <Tag key={t} value={t} dismissible dismissIcon={{ "aria-label": `移除 ${t}` }}>{t}</Tag>)}
                </TagGroup>
                <Input size={ctl} value={tagInput} onChange={(_, d) => setTagInput(d.value)} placeholder="添加标签" onKeyDown={(e) => { if (e.key === "Enter" && tagInput.trim()) { e.preventDefault(); set("tags", [...new Set([...form.tags, tagInput.trim()])]); setTagInput("") } }} />
              </div>
            </Field>
            <Field label="附件" className={s.full}>
              <label className={s.dropzone}>
                <Icon name="upload" size={28} />
                <Body1>{form.file || "拖拽文件到此处，或点击上传"}</Body1>
                <Caption1>支持 PNG / PDF，最大 10MB</Caption1>
                <input type="file" style={{ display: "none" }} onChange={(e) => set("file", e.target.files?.[0]?.name ?? "")} />
              </label>
            </Field>
            <Switch label="邮件通知" checked={form.notify} onChange={(_, d) => set("notify", d.checked)} />
            <Tooltip content="营销邮件每月最多 2 封" relationship="description"><Switch label="接收产品更新" checked={form.marketing} onChange={(_, d) => set("marketing", d.checked)} /></Tooltip>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="确认提交" description="请核对以下信息">
          <div className={l.stackM}>
            <div className={s.summary}>
              <Caption1 className={l.muted}>姓名</Caption1><Body1>{form.name}</Body1>
              <Caption1 className={l.muted}>邮箱</Caption1><Body1>{form.email}</Body1>
              <Caption1 className={l.muted}>手机号</Caption1><Body1>{form.phone ? `${form.countryCode} ${form.phone}` : "—"}</Body1>
              <Caption1 className={l.muted}>角色</Caption1><Body1>{form.role}</Body1>
              <Caption1 className={l.muted}>计划</Caption1><Body1>{form.plan}</Body1>
              <Caption1 className={l.muted}>负责人</Caption1><Body1>{form.owners.join("、") || "—"}</Body1>
              <Caption1 className={l.muted}>标签</Caption1><Body1>{form.tags.join("、") || "—"}</Body1>
              <Caption1 className={l.muted}>通知渠道</Caption1><Body1>{form.channels.join("、") || "—"}</Body1>
              <Caption1 className={l.muted}>预算区间</Caption1><Body1>¥{form.budgetMin}k – ¥{form.budgetMax}k</Body1>
              <Caption1 className={l.muted}>满意度</Caption1><Body1>{form.rating} / 5</Body1>
              <Caption1 className={l.muted}>通知</Caption1><Body1>{form.notify ? "开" : "关"} · 产品更新 {form.marketing ? "开" : "关"}</Body1>
            </div>
            {touched && errors.agree ? <MessageBar intent="warning"><MessageBarBody><MessageBarTitle>还差一步</MessageBarTitle>{errors.agree}</MessageBarBody></MessageBar> : null}
            <Field validationMessage={err("agree")} validationState={state("agree")}><Checkbox size={isMobile ? "large" : "medium"} label="我已阅读并同意服务条款与隐私政策" checked={form.agree} onChange={(_, d) => set("agree", Boolean(d.checked))} required /></Field>
          </div>
        </SectionCard>
      )}
      <div className={l.rowBetween}>
        <Button size={ctl} disabled={step === 0} icon={<Icon name="chevron-left" />} onClick={() => setStep(step - 1)}>上一步</Button>
        <div className={l.row}>
          <Button appearance="subtle" size={ctl} onClick={() => { setForm(initial); setTouched(false) }}>重置</Button>
          <Button appearance="primary" size={ctl} iconPosition="after" icon={<Icon name={step === 2 ? "check" : "chevron-right"} />} onClick={next}>{step === 2 ? "提交" : "下一步"}</Button>
        </div>
      </div>
    </div>
  )
}
