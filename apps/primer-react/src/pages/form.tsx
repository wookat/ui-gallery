import { useRef, useState, type ChangeEvent, type DragEvent } from "react"
import { ActionList, Autocomplete, Button, Checkbox, CheckboxGroup, FormControl, Heading, IconButton, Label, Radio, RadioGroup, Select, SelectPanel, Text, TextInput, TextInputWithTokens, Textarea, ToggleSwitch, Tooltip, type SelectPanelItemInput } from "@primer/react"
import { Blankslate } from "@primer/react/experimental"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import { Icon, iconFor } from "@/lib/icon"
import { PageHeader } from "./shared"

const steps = [
  { key: "basic", label: "基本信息", description: "名称、联系人与类型" },
  { key: "config", label: "详细配置", description: "计划、时间与资源" },
  { key: "review", label: "确认提交", description: "核对并提交" },
] as const

const countryCodes = ["+86", "+1", "+44", "+81"]
const regionItems: SelectPanelItemInput[] = ["华东", "华北", "华南", "西南", "海外"].map((r) => ({ id: r, text: r }))
const ownerItems = team.map((m) => ({ id: m.email, text: m.name }))

type Form = {
  name: string; budget: string; email: string; countryCode: string; phone: string; description: string
  type: string; features: string[]; publicProject: boolean
  plan: string; regions: SelectPanelItemInput[]; owner: string; startDate: string; time: string; rangeStart: string; rangeEnd: string
  sampling: number; rating: number; color: string; files: string[]; tags: { id: number; text: string }[]
  agree: boolean
}

const initial: Form = {
  name: "", budget: "", email: "", countryCode: "+86", phone: "", description: "",
  type: "analytics", features: ["dashboard"], publicProject: false,
  plan: "Pro", regions: [], owner: "", startDate: "", time: "09:30", rangeStart: "", rangeEnd: "",
  sampling: 60, rating: 4, color: "#0969da", files: [], tags: [{ id: 1, text: "growth" }, { id: 2, text: "q3" }],
  agree: false,
}

type Errors = Partial<Record<keyof Form, string>>

function validateBasic(f: Form): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = "请输入项目名称"
  else if (f.name.trim().length < 2) e.name = "项目名称至少 2 个字符"
  if (f.budget && (Number.isNaN(Number(f.budget)) || Number(f.budget) < 0)) e.budget = "预算必须是非负数字"
  if (!f.email.trim()) e.email = "请输入联系邮箱"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "邮箱格式不正确"
  if (f.phone && !/^\d{6,15}$/.test(f.phone)) e.phone = "电话仅允许 6–15 位数字"
  if (f.description.length > 200) e.description = "描述不能超过 200 字"
  return e
}

function validateConfig(f: Form): Errors {
  const e: Errors = {}
  if (!f.regions.length) e.regions = "请至少选择一个区域"
  if (!f.owner) e.owner = "请选择负责人"
  if (!f.startDate) e.startDate = "请选择开始日期"
  if (f.rangeStart && f.rangeEnd && f.rangeStart > f.rangeEnd) e.rangeEnd = "结束日期不能早于开始日期"
  if (f.rating < 1) e.rating = "请给出优先级评分"
  return e
}

function Help({ text }: { text: string }) {
  return (
    <Tooltip text={text} direction="n">
      <IconButton size="small" variant="invisible" aria-label="帮助" icon={iconFor("question")} className="help-icon" />
    </Tooltip>
  )
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="stepper" aria-label="表单步骤">
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo"
        return (
          <li key={s.key} className={`step ${state}`} aria-current={state === "active" ? "step" : undefined}>
            <span className="step-index" aria-hidden="true">{state === "done" ? <Icon name="check" size={12} /> : i + 1}</span>
            <span className="step-text"><Text as="div" weight="semibold">{s.label}</Text><Text as="div" size="small" className="muted">{s.description}</Text></span>
          </li>
        )
      })}
    </ol>
  )
}

export function FormPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Form>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [regionFilter, setRegionFilter] = useState("")
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const set = <K extends keyof Form>(key: K, value: Form[K]) => { setForm((f) => ({ ...f, [key]: value })); setErrors((e) => ({ ...e, [key]: undefined })) }

  const next = () => {
    const e = step === 0 ? validateBasic(form) : validateConfig(form)
    setErrors(e)
    if (Object.values(e).some(Boolean)) return
    setStep(step + 1)
  }
  const submit = () => {
    if (!form.agree) { setErrors({ agree: "提交前请同意服务条款" }); return }
    setSubmitted(true)
  }
  const addFiles = (list: FileList | null) => { if (list) set("files", [...form.files, ...Array.from(list).map((f) => f.name)]) }
  const onDrop = (event: DragEvent) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files) }
  const owner = ownerItems.find((o) => o.id === form.owner)
  const plan = plans.find((p) => p.name === form.plan)

  if (submitted) {
    return (
      <div className="page-stack">
        <PageHeader title="新建项目" description="通过分步表单创建一个新的工作区项目。" />
        <Blankslate border>
          <Blankslate.Visual><span className="success-badge"><Icon name="check" size={24} /></span></Blankslate.Visual>
          <Blankslate.Heading>项目「{form.name}」创建成功</Blankslate.Heading>
          <Blankslate.Description>{`已选择 ${form.plan} 计划，负责人 ${owner?.text ?? "未指定"}，${form.regions.length} 个区域。`}</Blankslate.Description>
          <div className="flex items-center justify-center gap-2 wrap"><Button variant="primary" onClick={() => { setSubmitted(false); setForm(initial); setStep(0) }}>再创建一个</Button><Button>进入项目</Button></div>
        </Blankslate>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader title="新建项目" description="通过分步表单创建一个新的工作区项目。" />
      <Stepper current={step} />

      {step === 0 ? (
        <form className="card stack-4" noValidate onSubmit={(e) => { e.preventDefault(); next() }}>
          <div className="card-header"><Heading as="h2" className="card-title">基本信息</Heading><Text className="muted">告诉我们项目的基础信息，带 * 的为必填项。</Text></div>
          <div className="grid grid-2">
            <FormControl required>
              <FormControl.Label>项目名称</FormControl.Label>
              <TextInput block placeholder="例如：增长分析" value={form.name} onChange={(e) => set("name", e.target.value)} validationStatus={errors.name ? "error" : undefined} />
              {errors.name ? <FormControl.Validation variant="error">{errors.name}</FormControl.Validation> : <FormControl.Caption>将作为工作区内的唯一标识。</FormControl.Caption>}
            </FormControl>
            <FormControl>
              <FormControl.Label>预算（元）</FormControl.Label>
              <TextInput block type="number" min={0} step={100} placeholder="0" leadingVisual={() => <span>¥</span>} value={form.budget} onChange={(e) => set("budget", e.target.value)} validationStatus={errors.budget ? "error" : undefined} />
              {errors.budget ? <FormControl.Validation variant="error">{errors.budget}</FormControl.Validation> : null}
            </FormControl>
            <FormControl required>
              <FormControl.Label>联系邮箱</FormControl.Label>
              <TextInput block type="email" placeholder="name@company.com" leadingVisual={iconFor("mail")} value={form.email} onChange={(e) => set("email", e.target.value)} validationStatus={errors.email ? "error" : undefined} />
              {errors.email ? <FormControl.Validation variant="error">{errors.email}</FormControl.Validation> : null}
            </FormControl>
            <FormControl>
              <FormControl.Label>联系电话</FormControl.Label>
              <div className="flex gap-2 phone-row">
                <Select aria-label="国家码" value={form.countryCode} onChange={(e) => set("countryCode", e.target.value)}>{countryCodes.map((c) => <Select.Option key={c} value={c}>{c}</Select.Option>)}</Select>
                <TextInput block type="tel" inputMode="numeric" placeholder="13800000000" value={form.phone} onChange={(e) => set("phone", e.target.value)} validationStatus={errors.phone ? "error" : undefined} />
              </div>
              {errors.phone ? <FormControl.Validation variant="error">{errors.phone}</FormControl.Validation> : null}
            </FormControl>
          </div>
          <FormControl>
            <FormControl.Label>项目描述</FormControl.Label>
            <Textarea block rows={3} maxLength={200} placeholder="描述这个项目的目标与范围..." value={form.description} onChange={(e) => set("description", e.target.value)} validationStatus={errors.description ? "error" : undefined} />
            <FormControl.Caption>{form.description.length} / 200 字</FormControl.Caption>
          </FormControl>
          <div className="grid grid-2">
            <RadioGroup name="type" onChange={(value) => value && set("type", value)}>
              <RadioGroup.Label>项目类型</RadioGroup.Label>
              <FormControl><Radio value="analytics" checked={form.type === "analytics"} /><FormControl.Label>数据分析</FormControl.Label></FormControl>
              <FormControl><Radio value="marketing" checked={form.type === "marketing"} /><FormControl.Label>市场营销</FormControl.Label></FormControl>
              <FormControl><Radio value="platform" checked={form.type === "platform"} /><FormControl.Label>平台工程</FormControl.Label></FormControl>
            </RadioGroup>
            <CheckboxGroup onChange={(values) => set("features", values)}>
              <CheckboxGroup.Label>启用功能</CheckboxGroup.Label>
              <FormControl><Checkbox value="dashboard" checked={form.features.includes("dashboard")} /><FormControl.Label>看板</FormControl.Label></FormControl>
              <FormControl><Checkbox value="alerts" checked={form.features.includes("alerts")} /><FormControl.Label>告警</FormControl.Label></FormControl>
              <FormControl><Checkbox value="export" checked={form.features.includes("export")} /><FormControl.Label>数据导出</FormControl.Label></FormControl>
            </CheckboxGroup>
          </div>
          <div className="flex items-center justify-between gap-3 card">
            <div><Text as="div" id="public-label" weight="semibold">公开项目</Text><Text as="div" className="muted" size="small">允许组织内所有成员查看。</Text></div>
            <ToggleSwitch aria-labelledby="public-label" checked={form.publicProject} onChange={(on) => set("publicProject", on)} />
          </div>
          <div className="flex justify-between"><span /><Button type="submit" variant="primary" trailingVisual={iconFor("arrow-right")}>下一步</Button></div>
        </form>
      ) : null}

      {step === 1 ? (
        <form className="card stack-4" noValidate onSubmit={(e) => { e.preventDefault(); next() }}>
          <div className="card-header"><Heading as="h2" className="card-title">详细配置</Heading><Text className="muted">选择计划、区域、时间与资源。</Text></div>
          <RadioGroup name="plan" onChange={(value) => value && set("plan", value)}>
            <RadioGroup.Label>计划</RadioGroup.Label>
            <div className="grid grid-3">
              {plans.map((p) => (
                <label key={p.name} className={`card plan-option${form.plan === p.name ? " selected" : ""}`}>
                  <span className="flex items-center gap-2"><Radio value={p.name} checked={form.plan === p.name} /><Text weight="semibold">{p.name}</Text>{p.recommended ? <Label variant="accent">推荐</Label> : null}</span>
                  <Text as="div" className="muted" size="small">{p.price === null ? "联系销售" : p.price === 0 ? "免费" : `¥${p.price}/月`}</Text>
                </label>
              ))}
            </div>
          </RadioGroup>
          <div className="grid grid-2">
            <FormControl required>
              <FormControl.Label>部署区域<Help text="数据将存储在所选区域，可多选。" /></FormControl.Label>
              <SelectPanel
                title="选择区域"
                placeholder="搜索区域"
                renderAnchor={({ children, ...anchorProps }) => <Button {...anchorProps} block alignContent="start" trailingAction={iconFor("triangle-down")} aria-invalid={errors.regions ? true : undefined}>{children || (form.regions.length ? form.regions.map((r) => r.text).join("、") : "选择一个或多个区域")}</Button>}
                open={regionOpen}
                onOpenChange={setRegionOpen}
                items={regionItems.filter((r) => r.text?.includes(regionFilter))}
                selected={form.regions}
                onSelectedChange={(next: SelectPanelItemInput[]) => set("regions", next)}
                filterValue={regionFilter}
                onFilterChange={setRegionFilter}
                overlayProps={{ width: "small", height: "xsmall" }}
              />
              {errors.regions ? <FormControl.Validation variant="error">{errors.regions}</FormControl.Validation> : null}
            </FormControl>
            <FormControl required>
              <FormControl.Label>负责人<Help text="输入姓名进行搜索，从团队成员中选择。" /></FormControl.Label>
              <Autocomplete>
                <Autocomplete.Input block placeholder="搜索团队成员" leadingVisual={iconFor("user")} validationStatus={errors.owner ? "error" : undefined} />
                <Autocomplete.Overlay>
                  <Autocomplete.Menu items={ownerItems} selectedItemIds={form.owner ? [form.owner] : []} selectionVariant="single" aria-labelledby="owner-label" onSelectedChange={(items) => { const list = Array.isArray(items) ? items : items ? [items] : []; set("owner", list[0] ? String(list[0].id) : "") }} />
                </Autocomplete.Overlay>
              </Autocomplete>
              {errors.owner ? <FormControl.Validation variant="error">{errors.owner}</FormControl.Validation> : <FormControl.Caption>{owner ? `已选择：${owner.text}` : "支持模糊匹配"}</FormControl.Caption>}
            </FormControl>
            <FormControl required>
              <FormControl.Label>开始日期</FormControl.Label>
              <TextInput block type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} validationStatus={errors.startDate ? "error" : undefined} />
              {errors.startDate ? <FormControl.Validation variant="error">{errors.startDate}</FormControl.Validation> : null}
            </FormControl>
            <FormControl>
              <FormControl.Label>每日同步时间</FormControl.Label>
              <TextInput block type="time" value={form.time} onChange={(e) => set("time", e.target.value)} leadingVisual={iconFor("clock")} />
            </FormControl>
            <FormControl>
              <FormControl.Label>统计周期<Help text="选择报表覆盖的日期范围。" /></FormControl.Label>
              <div className="flex gap-2 items-center range-row">
                <TextInput block type="date" aria-label="周期开始" value={form.rangeStart} onChange={(e) => set("rangeStart", e.target.value)} />
                <Text className="muted">至</Text>
                <TextInput block type="date" aria-label="周期结束" value={form.rangeEnd} onChange={(e) => set("rangeEnd", e.target.value)} validationStatus={errors.rangeEnd ? "error" : undefined} />
              </div>
              {errors.rangeEnd ? <FormControl.Validation variant="error">{errors.rangeEnd}</FormControl.Validation> : null}
            </FormControl>
            <FormControl>
              <FormControl.Label>主题色<Help text="用于项目图标与图表主色。" /></FormControl.Label>
              <div className="flex items-center gap-2">
                <input type="color" className="color-input" aria-label="选择主题色" value={form.color} onChange={(e) => set("color", e.target.value)} />
                <TextInput className="mono" value={form.color} onChange={(e) => set("color", e.target.value)} aria-label="主题色十六进制值" />
              </div>
            </FormControl>
          </div>
          <div className="grid grid-2">
            <FormControl>
              <FormControl.Label>采样比例：{form.sampling}%<Help text="Primer 未提供 Slider 组件，此处使用系统 range 控件并套用 Primer 强调色。" /></FormControl.Label>
              <input type="range" className="range-input" min={0} max={100} step={5} value={form.sampling} onChange={(e: ChangeEvent<HTMLInputElement>) => set("sampling", Number(e.target.value))} aria-valuetext={`${form.sampling}%`} />
              <FormControl.Caption>数值越高统计越精确，成本也越高。</FormControl.Caption>
            </FormControl>
            <FormControl required>
              <FormControl.Label>优先级评分</FormControl.Label>
              <div className="rating" role="radiogroup" aria-label="优先级评分">
                {[1, 2, 3, 4, 5].map((n) => (
                  <IconButton key={n} variant="invisible" role="radio" aria-checked={form.rating === n} aria-label={`${n} 星`} icon={iconFor(n <= form.rating ? "star-fill" : "star")} className={n <= form.rating ? "star active" : "star"} onClick={() => set("rating", n)} />
                ))}
                <Text className="muted" size="small">{form.rating} / 5</Text>
              </div>
              {errors.rating ? <FormControl.Validation variant="error">{errors.rating}</FormControl.Validation> : null}
            </FormControl>
          </div>
          <FormControl>
            <FormControl.Label>附件</FormControl.Label>
            <div
              className={`dropzone${dragging ? " dragging" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <Icon name="upload" size={24} />
              <Text as="div" weight="semibold">拖拽文件到此处，或</Text>
              <Button size="small" onClick={() => fileInput.current?.click()}>选择文件</Button>
              <Text as="div" size="small" className="muted">支持 PDF、CSV、PNG，单个不超过 10 MB</Text>
              <input ref={fileInput} type="file" multiple hidden onChange={(e) => addFiles(e.target.files)} />
            </div>
            {form.files.length ? (
              <ActionList className="file-list">
                {form.files.map((f, i) => (
                  <ActionList.Item key={`${f}-${i}`}>
                    <ActionList.LeadingVisual><Icon name="file" /></ActionList.LeadingVisual>
                    {f}
                    <ActionList.TrailingAction label="移除" icon={iconFor("x")} onClick={() => set("files", form.files.filter((_, j) => j !== i))} />
                  </ActionList.Item>
                ))}
              </ActionList>
            ) : null}
          </FormControl>
          <FormControl>
            <FormControl.Label>标签<Help text="回车添加标签，Backspace 删除。" /></FormControl.Label>
            <TextInputWithTokens block tokens={form.tags} onTokenRemove={(id) => set("tags", form.tags.filter((t) => t.id !== id))} onKeyDown={(e) => { const target = e.currentTarget; if (e.key === "Enter" && target.value.trim()) { e.preventDefault(); set("tags", [...form.tags, { id: Date.now(), text: target.value.trim() }]); target.value = "" } }} placeholder="输入后回车添加" />
          </FormControl>
          <div className="flex justify-between"><Button leadingVisual={iconFor("arrow-left")} onClick={() => setStep(0)}>上一步</Button><Button type="submit" variant="primary" trailingVisual={iconFor("arrow-right")}>下一步</Button></div>
        </form>
      ) : null}

      {step === 2 ? (
        <form className="card stack-4" noValidate onSubmit={(e) => { e.preventDefault(); submit() }}>
          <div className="card-header"><Heading as="h2" className="card-title">确认提交</Heading><Text className="muted">请核对以下信息，提交后可在项目设置中修改。</Text></div>
          <dl className="descriptions descriptions-3">
            <div><dt>项目名称</dt><dd>{form.name}</dd></div>
            <div><dt>项目类型</dt><dd>{form.type === "analytics" ? "数据分析" : form.type === "marketing" ? "市场营销" : "平台工程"}</dd></div>
            <div><dt>预算</dt><dd>{form.budget ? `¥${Number(form.budget).toLocaleString()}` : "—"}</dd></div>
            <div><dt>联系邮箱</dt><dd>{form.email}</dd></div>
            <div><dt>联系电话</dt><dd>{form.phone ? `${form.countryCode} ${form.phone}` : "—"}</dd></div>
            <div><dt>公开项目</dt><dd>{form.publicProject ? "是" : "否"}</dd></div>
            <div><dt>计划</dt><dd>{plan ? `${plan.name}${plan.price ? ` · ¥${plan.price}/月` : ""}` : form.plan}</dd></div>
            <div><dt>部署区域</dt><dd>{form.regions.map((r) => r.text).join("、") || "—"}</dd></div>
            <div><dt>负责人</dt><dd>{owner?.text ?? "—"}</dd></div>
            <div><dt>开始日期</dt><dd>{form.startDate || "—"}</dd></div>
            <div><dt>同步时间</dt><dd>{form.time}</dd></div>
            <div><dt>统计周期</dt><dd>{form.rangeStart || form.rangeEnd ? `${form.rangeStart || "…"} ~ ${form.rangeEnd || "…"}` : "—"}</dd></div>
            <div><dt>采样比例</dt><dd>{form.sampling}%</dd></div>
            <div><dt>优先级</dt><dd>{"★".repeat(form.rating)}{"☆".repeat(5 - form.rating)}</dd></div>
            <div><dt>主题色</dt><dd className="flex items-center gap-2"><span className="color-swatch" style={{ background: form.color }} aria-hidden="true" /><span className="mono">{form.color}</span></dd></div>
            <div><dt>附件</dt><dd>{form.files.length ? `${form.files.length} 个文件` : "—"}</dd></div>
            <div><dt>标签</dt><dd className="flex gap-2 wrap">{form.tags.length ? form.tags.map((t) => <Label key={t.id}>{t.text}</Label>) : "—"}</dd></div>
            <div><dt>启用功能</dt><dd>{form.features.length ? form.features.join("、") : "—"}</dd></div>
          </dl>
          <FormControl required>
            <Checkbox checked={form.agree} onChange={(e) => set("agree", e.target.checked)} validationStatus={errors.agree ? "error" : undefined} />
            <FormControl.Label>我已阅读并同意服务条款与隐私政策</FormControl.Label>
            {errors.agree ? <FormControl.Validation variant="error">{errors.agree}</FormControl.Validation> : null}
          </FormControl>
          <div className="flex justify-between"><Button leadingVisual={iconFor("arrow-left")} onClick={() => setStep(1)}>上一步</Button><Button type="submit" variant="primary" leadingVisual={iconFor("check")}>提交项目</Button></div>
        </form>
      ) : null}
    </div>
  )
}
