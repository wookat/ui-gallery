/* eslint-disable solid/prefer-for */
import { createSignal, For, Show } from "solid-js"
import { Icon } from "@/icons"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Checkbox } from "@/ui/checkbox"
import { Combobox } from "@/ui/combobox"
import { ColorPicker } from "@/ui/color"
import { DatePicker, DateRangePicker, type DateRange } from "@/ui/date-range"
import { FileField } from "@/ui/file-field"
import { NumberField } from "@/ui/number-field"
import { RadioGroup } from "@/ui/radio-group"
import { Rating } from "@/ui/rating"
import { Select } from "@/ui/select"
import { Separator } from "@/ui/separator"
import { Slider } from "@kobalte/core/slider"
import { Switch } from "@/ui/switch"
import { TextArea, TextField } from "@/ui/text-field"
import { TimeField } from "@/ui/time-field"
import { PageHeader } from "./shared"

const typeOptions = [{ value: "web", label: "Web 应用" }, { value: "mobile", label: "移动应用" }, { value: "internal", label: "内部工具" }]
const moduleOptions = ["团队协作", "数据分析", "自动化通知", "文件管理"]
const planOptions = [{ value: "starter", label: "Starter" }, { value: "pro", label: "Pro" }, { value: "enterprise", label: "Enterprise" }]
const channelOptions = [{ value: "email", label: "邮件" }, { value: "sms", label: "短信" }, { value: "slack", label: "Slack" }]
const ownerOptions = ["林晓", "王子涵", "Alex Chen", "Maria García"].map((value) => ({ value, label: value }))

export function FormPage() {
  const [step, setStep] = createSignal(1)
  const [done, setDone] = createSignal(false)
  const [name, setName] = createSignal("")
  const [email, setEmail] = createSignal("")
  const [phone, setPhone] = createSignal("")
  const [budget, setBudget] = createSignal(10000)
  const [description, setDescription] = createSignal("")
  const [type, setType] = createSignal("web")
  const [publicProject, setPublicProject] = createSignal(true)
  const [modules, setModules] = createSignal<string[]>([])
  const [plan, setPlan] = createSignal("pro")
  const [channels, setChannels] = createSignal<string[]>(["email"])
  const [owner, setOwner] = createSignal<string | null>(null)
  const [startDate, setStartDate] = createSignal<string | null>(null)
  const [startTime, setStartTime] = createSignal("09:30")
  const [range, setRange] = createSignal<DateRange>({ start: null, end: null })
  const [scope, setScope] = createSignal([20, 70])
  const [score, setScore] = createSignal(4)
  const [tags, setTags] = createSignal<string[]>([])
  const [tagInput, setTagInput] = createSignal("")
  const [agree, setAgree] = createSignal(false)
  const [touched, setTouched] = createSignal(false)
  const addTag = (event: KeyboardEvent) => { if (event.key === "Enter" && tagInput().trim()) { event.preventDefault(); setTags((items) => [...items, tagInput().trim()]); setTagInput("") } }
  const validEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email())
  const toggleModule = (item: string, checked: boolean) => setModules((items) => checked ? [...items, item] : items.filter((value) => value !== item))
  const next = () => { if (step() === 1 && (!name() || !validEmail())) { setTouched(true); return } setTouched(false); setStep((value) => Math.min(3, value + 1)) }
  const labelFor = (options: { value: string; label: string }[], value: string | null | undefined) => options.find((option) => option.value === value)?.label ?? "未填写"
  const summary = (value: string | null | undefined) => value || "未填写"
  return <div class="space-y-6"><PageHeader title="新建项目" description="填写项目资料并配置团队工作方式。" /><div class="grid gap-2 sm:grid-cols-3">{["基本信息", "详细配置", "确认"].map((label, index) => <div class="flex items-center gap-2"><span class={`grid size-8 place-items-center rounded-full text-sm ${step() > index + 1 ? "bg-emerald-600 text-white" : step() === index + 1 ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800"}`}>{step() > index + 1 ? "✓" : index + 1}</span><span class="text-sm">{label}</span>{index < 2 ? <Separator class="hidden flex-1 sm:block" /> : null}</div>)}</div><Card><CardHeader><CardTitle>{step() === 1 ? "基本信息" : step() === 2 ? "详细配置" : done() ? "创建成功" : "确认项目"}</CardTitle></CardHeader><CardContent class="space-y-6"><Show when={!done()} fallback={<div class="grid place-items-center gap-4 py-12 text-center"><span class="grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950"><Icon name="check" size={32} /></span><h2 class="text-xl font-semibold">项目创建成功</h2><p class="text-sm text-zinc-500 dark:text-zinc-400">项目资料已保存，可以开始协作。</p><Button variant="outline" onClick={() => { setDone(false); setStep(1) }}>返回</Button></div>}><Show when={step() === 1}><div class="grid gap-5 sm:grid-cols-2"><TextField label="项目名称" required value={name()} onInput={(event) => setName(event.currentTarget.value)} error={touched() && !name() ? "请输入项目名称" : undefined} placeholder="例如：Q4 发布计划" /><NumberField label="预算（元）" hint="含税预算，可后续调整" value={budget()} min={0} max={1000000} onChange={setBudget} /><TextField label="邮箱" hint="用于接收项目通知" type="email" required value={email()} onInput={(event) => setEmail(event.currentTarget.value)} description="我们不会公开你的邮箱" error={touched() && !validEmail() ? (email() ? "邮箱格式不正确" : "请输入邮箱") : undefined} /><div class="grid grid-cols-[100px_1fr] items-end gap-2"><Select label="区号" options={["+86", "+1", "+81", "+44"].map((value) => ({ value, label: value }))} value="+86" /><TextField label="电话" value={phone()} onInput={(event) => setPhone(event.currentTarget.value)} placeholder="手机号码" /></div></div><TextArea label="项目描述" value={description()} maxLength={200} onInput={(event) => setDescription(event.currentTarget.value)} description={`${description().length}/200`} rows={4} /><RadioGroup label="项目类型" value={type()} onChange={setType} options={typeOptions} /><div class="grid gap-3"><p class="text-sm font-medium">功能模块</p><div class="grid gap-2 sm:grid-cols-2"><For each={moduleOptions}>{(item) => <Checkbox label={item} checked={modules().includes(item)} onChange={(checked) => toggleModule(item, checked)} />}</For></div></div><Switch label="公开项目" checked={publicProject()} onChange={setPublicProject} /></Show><Show when={step() === 2}><div class="grid gap-5 sm:grid-cols-2"><Select label="计划版本" options={planOptions} value={plan()} onChange={(value) => setPlan(String(value ?? "pro"))} /><Select label="通知渠道（可多选）" multiple options={channelOptions} value={channels()} onChange={(value) => setChannels(Array.isArray(value) ? value : value ? [value] : [])} /><Combobox label="负责人" options={ownerOptions} value={owner() ?? undefined} onChange={setOwner} /><DatePicker label="开始日期" value={startDate()} onChange={setStartDate} /><TimeField label="开始时间" onChange={(value) => setStartTime(`${String(value.hour ?? 0).padStart(2, "0")}:${String(value.minute ?? 0).padStart(2, "0")}`)} /><DateRangePicker label="日期范围" value={range()} onChange={setRange} class="sm:col-span-1" /><div class="sm:col-span-2"><label class="mb-2 block text-sm font-medium">交付范围</label><Slider value={scope()} onChange={setScope} minValue={0} maxValue={100}><Slider.Track class="relative h-2 rounded bg-zinc-200 dark:bg-zinc-700"><Slider.Fill class="absolute h-full rounded bg-blue-600" /><Slider.Thumb class="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-blue-600 bg-white" /><Slider.Thumb class="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-blue-600 bg-white" /></Slider.Track></Slider><p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">当前范围：{scope()[0] ?? 20}% – {scope()[1] ?? 70}%</p></div><div><p class="mb-2 block text-sm font-medium">项目评分</p><Rating value={score()} onChange={setScore} label="项目评分" /></div><div><p class="mb-2 block text-sm font-medium">主题颜色</p><ColorPicker label="色相" /></div></div><FileField label="上传文件" /><div><TextField label="添加标签，按 Enter 确认" value={tagInput()} onInput={(event) => setTagInput(event.currentTarget.value)} onKeyDown={addTag as never} /><div class="mt-2 flex flex-wrap gap-2"><For each={tags()}>{(tag) => (<Badge variant="outline">{tag}<button type="button" class="ml-1 grid size-10 place-items-center" onClick={() => setTags((items) => items.filter((item) => item !== tag))}>×</button></Badge>)}</For></div></div></Show><Show when={step() === 3}><dl class="grid gap-x-6 gap-y-3 rounded-lg border border-zinc-200 p-4 text-sm sm:grid-cols-2 dark:border-zinc-800"><div><dt class="text-zinc-500 dark:text-zinc-400">项目名称</dt><dd class="font-medium">{summary(name())}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">邮箱</dt><dd class="font-medium">{summary(email())}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">电话</dt><dd class="font-medium">{summary(phone())}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">预算</dt><dd class="font-medium">¥{budget().toLocaleString()}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">项目类型</dt><dd class="font-medium">{labelFor(typeOptions, type())}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">功能模块</dt><dd class="font-medium">{modules().join("、") || "未选择"}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">公开项目</dt><dd class="font-medium">{publicProject() ? "是" : "否"}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">计划版本</dt><dd class="font-medium">{labelFor(planOptions, plan())}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">通知渠道</dt><dd class="font-medium">{channels().map((channel) => labelFor(channelOptions, channel)).join("、") || "未填写"}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">负责人</dt><dd class="font-medium">{summary(owner())}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">开始日期</dt><dd class="font-medium">{summary(startDate())}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">开始时间</dt><dd class="font-medium">{summary(startTime())}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">日期范围</dt><dd class="font-medium">{range().start && range().end ? `${range().start} → ${range().end}` : "未填写"}</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">交付范围</dt><dd class="font-medium">{scope()[0] ?? 20}% – {scope()[1] ?? 70}%</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">项目评分</dt><dd class="font-medium">{score()} / 5</dd></div><div><dt class="text-zinc-500 dark:text-zinc-400">标签</dt><dd class="font-medium">{tags().join("、") || "未填写"}</dd></div></dl><Checkbox label="我同意项目服务条款" checked={agree()} onChange={setAgree} /></Show><div class="flex justify-between gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800"><Button variant="outline" disabled={step() === 1} onClick={() => setStep((value) => value - 1)}>上一步</Button><Show when={step() < 3} fallback={<Button disabled={!agree()} onClick={() => setDone(true)}><Icon name="check" />提交项目</Button>}><Button onClick={next}>下一步<Icon name="arrow-right" /></Button></Show></div></Show></CardContent></Card></div>
}
