import { zhCN } from "date-fns/locale"
import { useState } from "react"
import { Button, Callout, Card, Checkbox, Classes, ControlGroup, Divider, FormGroup, H4, HTMLSelect, HTMLTable, Icon, InputGroup, MenuItem, NonIdealState, NumericInput, Radio, RadioGroup, RangeSlider, Switch, Tag, TagInput, TextArea, Tooltip } from "@blueprintjs/core"
import { DateInput, DateRangeInput, TimePicker, type DateRange } from "@blueprintjs/datetime"
import { MultiSelect, Suggest } from "@blueprintjs/select"
import team from "@ui-gallery/spec/mock/team.json"
import { icon } from "@/lib/icons"
import { PageHeader } from "@/pages/shared"

const STEPS = ["基本信息", "详细配置", "确认"]
const REGIONS = ["华东", "华北", "华南", "西南", "海外"]
const TIMEZONES = ["Asia/Shanghai", "Asia/Tokyo", "Asia/Singapore", "Europe/London", "Europe/Berlin", "America/New_York", "America/Los_Angeles"]
const fmt = (d: Date) => d.toISOString().slice(0, 10)
const parse = (s: string) => { const d = new Date(s); return Number.isNaN(d.getTime()) ? false : d }

type Basic = { name: string; seats: number | undefined; email: string; country: string; phone: string; bio: string; type: string; channels: string[]; notify: boolean }

function Stepper({ current }: { current: number }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => (
        <div key={label} className="step" style={{ flex: i < STEPS.length - 1 ? 1 : "none" }}>
          <Tag round large intent={i < current ? "success" : i === current ? "primary" : "none"} minimal={i > current} icon={i < current ? icon("check", 12) : undefined}>{i < current ? "" : i + 1}</Tag>
          <span style={{ fontWeight: i === current ? 600 : 400 }} className={`step-label ${i > current ? Classes.TEXT_MUTED : ""}`}>{label}</span>
          {i < STEPS.length - 1 ? <span className="line" /> : null}
        </div>
      ))}
    </div>
  )
}

function Rating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <span className="row" role="radiogroup" aria-label="评分" style={{ gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Button key={n} minimal small onClick={() => onChange(n)} aria-label={`${n} 星`} icon={<Icon icon={n <= value ? "star" : "star-empty"} intent={n <= value ? "warning" : "none"} />} />
      ))}
    </span>
  )
}

export function FormPage() {
  const [step, setStep] = useState(0)
  const [touched, setTouched] = useState(false)
  const [basic, setBasic] = useState<Basic>({ name: "", seats: 5, email: "", country: "+86", phone: "", bio: "", type: "team", channels: ["email"], notify: true })
  const [region, setRegion] = useState("华东")
  const [members, setMembers] = useState<string[]>([team[0].name])
  const [timezone, setTimezone] = useState<string | null>(null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<Date>(new Date(2026, 8, 5, 9, 30))
  const [range, setRange] = useState<DateRange>([null, null])
  const [budget, setBudget] = useState<[number, number]>([20, 60])
  const [rating, setRating] = useState(4)
  const [color, setColor] = useState("#2d72d2")
  const [files, setFiles] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>(["核心", "Q4"])
  const [agree, setAgree] = useState(false)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const errors = {
    name: basic.name.trim().length < 2 ? "项目名称至少 2 个字符" : undefined,
    seats: basic.seats === undefined || basic.seats < 1 || basic.seats > 500 ? "席位数需在 1–500 之间" : undefined,
    email: !/^\S+@\S+\.\S+$/.test(basic.email) ? "请输入有效邮箱" : undefined,
    phone: !/^\d{6,15}$/.test(basic.phone) ? "请输入 6–15 位数字" : undefined,
    bio: basic.bio.length > 200 ? "描述不能超过 200 字" : undefined,
  }
  const basicValid = Object.values(errors).every((e) => !e)
  const step2Valid = timezone !== null && date !== null
  const err = (key: keyof typeof errors) => (touched ? errors[key] : undefined)
  const intent = (key: keyof typeof errors) => (err(key) ? "danger" : "none")

  const next = () => {
    setTouched(true)
    if (step === 0 && !basicValid) return
    if (step === 1 && !step2Valid) return
    setTouched(false)
    setStep(step + 1)
  }
  const submit = () => {
    setSubmitting(true)
    window.setTimeout(() => { setSubmitting(false); setDone(true) }, 900)
  }
  const req = <span className={Classes.TEXT_MUTED} style={{ color: "#cd4246" }}>*</span>

  if (done) {
    return (
      <Card style={{ padding: 48 }}>
        <NonIdealState icon={<Icon icon="tick-circle" intent="success" size={48} />} title="项目已创建" description={`「${basic.name}」已创建成功，邀请邮件已发送给 ${members.length} 位成员。`} action={<Button intent="primary" icon={icon("plus")} onClick={() => { setDone(false); setStep(0); setAgree(false) }}>再创建一个</Button>} />
      </Card>
    )
  }

  return (
    <>
      <PageHeader title="创建项目" description="三步完成项目配置，带 * 为必填。" />
      <Card className="stack" style={{ maxWidth: 880 }}>
        <Stepper current={step} />
        <Divider />
        {step === 0 ? (
          <div className="stack">
            <div className="grid-2">
              <FormGroup label="项目名称" labelInfo={req} helperText={err("name") ?? "用于展示在控制台与发票中"} intent={intent("name")}>
                <InputGroup value={basic.name} onChange={(e) => setBasic({ ...basic, name: e.target.value })} placeholder="例如：Acme 落地页改版" intent={intent("name")} leftIcon={icon("boxes")} />
              </FormGroup>
              <FormGroup label="席位数" labelInfo={req} helperText={err("seats") ?? "1–500"} intent={intent("seats")}>
                <NumericInput value={basic.seats} min={1} max={500} onValueChange={(n, s) => setBasic({ ...basic, seats: s === "" ? undefined : n })} fill intent={intent("seats")} />
              </FormGroup>
              <FormGroup label="联系邮箱" labelInfo={req} helperText={err("email")} intent={intent("email")}>
                <InputGroup type="email" value={basic.email} onChange={(e) => setBasic({ ...basic, email: e.target.value })} placeholder="owner@acme.dev" intent={intent("email")} leftIcon={icon("mail")} />
              </FormGroup>
              <FormGroup label="联系电话" labelInfo={req} helperText={err("phone")} intent={intent("phone")}>
                <ControlGroup fill>
                  <HTMLSelect value={basic.country} onChange={(e) => setBasic({ ...basic, country: e.currentTarget.value })} options={["+86", "+852", "+886", "+1", "+44", "+81"]} style={{ flex: "0 0 90px" }} />
                  <InputGroup type="tel" value={basic.phone} onChange={(e) => setBasic({ ...basic, phone: e.target.value })} placeholder="13800000000" intent={intent("phone")} />
                </ControlGroup>
              </FormGroup>
            </div>
            <FormGroup label="项目描述" helperText={err("bio") ?? `${basic.bio.length} / 200`} intent={intent("bio")}>
              <TextArea fill rows={3} value={basic.bio} onChange={(e) => setBasic({ ...basic, bio: e.target.value })} placeholder="简要说明项目目标" intent={intent("bio")} />
            </FormGroup>
            <div className="grid-3">
              <FormGroup label="项目类型">
                <RadioGroup selectedValue={basic.type} onChange={(e) => setBasic({ ...basic, type: e.currentTarget.value })}>
                  <Radio label="个人" value="personal" />
                  <Radio label="团队" value="team" />
                  <Radio label="企业" value="enterprise" />
                </RadioGroup>
              </FormGroup>
              <FormGroup label="通知渠道">
                {["email", "sms", "push"].map((c) => (
                  <Checkbox key={c} label={{ email: "邮件", sms: "短信", push: "推送" }[c]} checked={basic.channels.includes(c)} onChange={() => setBasic({ ...basic, channels: basic.channels.includes(c) ? basic.channels.filter((x) => x !== c) : [...basic.channels, c] })} />
                ))}
              </FormGroup>
              <FormGroup label="每周摘要">
                <Switch checked={basic.notify} onChange={(e) => setBasic({ ...basic, notify: e.currentTarget.checked })} label={basic.notify ? "开启" : "关闭"} />
              </FormGroup>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="stack">
            <div className="grid-2">
              <FormGroup label="部署区域" helperText="数据将存放在所选区域">
                <HTMLSelect fill value={region} onChange={(e) => setRegion(e.currentTarget.value)} options={REGIONS} />
              </FormGroup>
              <FormGroup label="成员" labelInfo={<Tooltip content="可从团队中选择多个成员"><Icon icon="help" size={12} className={Classes.TEXT_MUTED} /></Tooltip>}>
                <MultiSelect<string>
                  items={team.map((m) => m.name)}
                  selectedItems={members}
                  itemRenderer={(item, { handleClick, modifiers }) => <MenuItem key={item} text={item} onClick={handleClick} active={modifiers.active} selected={members.includes(item)} roleStructure="listoption" shouldDismissPopover={false} />}
                  tagRenderer={(item) => item}
                  onItemSelect={(item) => setMembers((m) => (m.includes(item) ? m.filter((x) => x !== item) : [...m, item]))}
                  onRemove={(item) => setMembers((m) => m.filter((x) => x !== item))}
                  placeholder="选择成员"
                  noResults={<MenuItem disabled text="无结果" />}
                  popoverProps={{ minimal: true }}
                  fill
                />
              </FormGroup>
              <FormGroup label="时区" labelInfo={req} helperText={touched && !timezone ? "请选择时区" : "输入以搜索"} intent={touched && !timezone ? "danger" : "none"}>
                <Suggest<string>
                  items={TIMEZONES}
                  selectedItem={timezone}
                  inputValueRenderer={(item) => item}
                  itemPredicate={(q, item) => item.toLowerCase().includes(q.toLowerCase())}
                  itemRenderer={(item, { handleClick, modifiers }) => <MenuItem key={item} text={item} onClick={handleClick} active={modifiers.active} roleStructure="listoption" />}
                  onItemSelect={setTimezone}
                  noResults={<MenuItem disabled text="无匹配时区" />}
                  inputProps={{ placeholder: "Asia/Shanghai", leftIcon: icon("globe") }}
                  popoverProps={{ minimal: true }}
                  fill
                />
              </FormGroup>
              <FormGroup label="启动日期" labelInfo={req} helperText={touched && !date ? "请选择日期" : undefined} intent={touched && !date ? "danger" : "none"}>
                <DateInput locale={zhCN} value={date} onChange={setDate} formatDate={fmt} parseDate={parse} placeholder="YYYY-MM-DD" fill popoverProps={{ minimal: true }} />
              </FormGroup>
              <FormGroup label="每日同步时间">
                <TimePicker value={time} onChange={setTime} showArrowButtons />
              </FormGroup>
              <FormGroup label="活动周期">
                <DateRangeInput locale={zhCN} value={range} onChange={setRange} formatDate={fmt} parseDate={parse} allowSingleDayRange shortcuts={false} startInputProps={{ placeholder: "开始" }} endInputProps={{ placeholder: "结束" }} popoverProps={{ minimal: true }} />
              </FormGroup>
              <FormGroup label="预算范围（万元）" helperText={`${budget[0]} – ${budget[1]} 万元`}>
                <div style={{ padding: "0 12px" }}><RangeSlider min={0} max={100} stepSize={5} labelStepSize={25} value={budget} onChange={setBudget} /></div>
              </FormGroup>
              <FormGroup label="优先级评分">
                <Rating value={rating} onChange={setRating} />
              </FormGroup>
              <FormGroup label="品牌色">
                <ControlGroup>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="品牌色" style={{ width: 40, height: 30, border: "none", background: "transparent", padding: 0 }} />
                  <InputGroup value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 120 }} />
                </ControlGroup>
              </FormGroup>
              <FormGroup label="标签" helperText="回车添加标签">
                <TagInput values={tags} onChange={(v) => setTags(v as string[])} placeholder="添加标签…" leftIcon={icon("tag")} tagProps={{ minimal: true }} addOnBlur />
              </FormGroup>
            </div>
            <FormGroup label="附件" helperText="支持 PDF / PNG，单个不超过 10 MB">
              <Card className="dropzone stack-sm" style={{ alignItems: "center", borderStyle: "dashed" }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setFiles((f) => [...f, ...Array.from(e.dataTransfer.files).map((x) => x.name)]) }}>
                <Icon icon="cloud-upload" size={32} className={Classes.TEXT_MUTED} />
                <div>拖拽文件到此处，或</div>
                <label className={`${Classes.BUTTON} ${Classes.OUTLINED}`}>
                  <input type="file" multiple hidden onChange={(e) => setFiles((f) => [...f, ...Array.from(e.target.files ?? []).map((x) => x.name)])} />
                  <Icon icon="folder-open" /> 选择文件
                </label>
                {files.length ? <div className="row">{files.map((f) => <Tag key={f} minimal icon={icon("clipboard", 12)} onRemove={() => setFiles((x) => x.filter((y) => y !== f))}>{f}</Tag>)}</div> : null}
              </Card>
            </FormGroup>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="stack">
            <Callout intent="primary" icon={icon("alert-circle")}>请核对以下信息，提交后可在设置中修改。</Callout>
            <H4 style={{ margin: 0 }}>基本信息</H4>
            <HTMLTable compact className="fill" striped>
              <tbody>
                <tr><td className={Classes.TEXT_MUTED} style={{ width: 160 }}>项目名称</td><td>{basic.name}</td></tr>
                <tr><td className={Classes.TEXT_MUTED}>席位数</td><td>{basic.seats}</td></tr>
                <tr><td className={Classes.TEXT_MUTED}>联系方式</td><td>{basic.email} · {basic.country} {basic.phone}</td></tr>
                <tr><td className={Classes.TEXT_MUTED}>类型 / 通知</td><td>{basic.type} · {basic.channels.join(", ")} · 每周摘要{basic.notify ? "开" : "关"}</td></tr>
              </tbody>
            </HTMLTable>
            <H4 style={{ margin: 0 }}>详细配置</H4>
            <HTMLTable compact className="fill" striped>
              <tbody>
                <tr><td className={Classes.TEXT_MUTED} style={{ width: 160 }}>区域 / 时区</td><td>{region} · {timezone}</td></tr>
                <tr><td className={Classes.TEXT_MUTED}>成员</td><td>{members.join("、")}</td></tr>
                <tr><td className={Classes.TEXT_MUTED}>启动日期 / 同步</td><td>{date} · {time.getHours().toString().padStart(2, "0")}:{time.getMinutes().toString().padStart(2, "0")}</td></tr>
                <tr><td className={Classes.TEXT_MUTED}>预算 / 评分</td><td>{budget[0]}–{budget[1]} 万元 · {rating} 星</td></tr>
                <tr><td className={Classes.TEXT_MUTED}>品牌色 / 标签</td><td><span className="row"><span style={{ width: 14, height: 14, background: color, borderRadius: 3, display: "inline-block" }} />{color} · {tags.map((t) => <Tag key={t} minimal>{t}</Tag>)}</span></td></tr>
              </tbody>
            </HTMLTable>
            <Checkbox checked={agree} onChange={(e) => setAgree(e.currentTarget.checked)} label="我已阅读并同意服务条款与隐私政策" />
          </div>
        ) : null}

        <Divider />
        <div className="row-between">
          <Button icon={icon("arrow-left")} disabled={step === 0} onClick={() => setStep(step - 1)}>上一步</Button>
          {step < 2 ? (
            <Button intent="primary" rightIcon={icon("arrow-right")} onClick={next}>下一步</Button>
          ) : (
            <Button intent="success" icon={icon("check")} disabled={!agree} loading={submitting} onClick={submit}>提交</Button>
          )}
        </div>
      </Card>
    </>
  )
}
