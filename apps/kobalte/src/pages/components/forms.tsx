import { createSignal, Show, For } from "solid-js"
import { DemoCard, DemoFrame, DemoLabel, IconButton } from "./shared"
import { Icon } from "@/icons"
import { Button } from "@/ui/button"
import { Checkbox } from "@/ui/checkbox"
import { ColorPicker } from "@/ui/color"
import { FileField } from "@/ui/file-field"
import { Rating } from "@/ui/rating"
import { Switch } from "@/ui/switch"
import { TimeField } from "@/ui/time-field"
import { Combobox } from "@/ui/combobox"
import { Select } from "@/ui/select"
import { Slider } from "@kobalte/core/slider"
import { RadioGroup } from "@/ui/radio-group"
import { TextArea, TextField } from "@/ui/text-field"

const options = [{ value: "a", label: "选项 A" }, { value: "b", label: "选项 B" }, { value: "c", label: "选项 C" }]

function PinInput() {
  const inputs: HTMLInputElement[] = []
  return <div class="flex gap-2">{Array.from({ length: 6 }, (_, index) => <TextField class="w-10" ariaLabel={`验证码第 ${index + 1} 位`} maxLength={1} inputMode="numeric" onInput={(event) => { if (event.currentTarget.value && inputs[index + 1]) inputs[index + 1].focus() }} ref={(element) => { inputs[index] = element }} />)}</div>
}

function renderForms(name: string, status: string) {
  const [slider, setSlider] = createSignal(42)
  const [range, setRange] = createSignal([20, 70])
  if (name === "Mention") return <DemoCard name={name} status="missing"><DemoFrame><p class="text-sm text-zinc-500 dark:text-zinc-400">Kobalte 无此原语，未实现；可用 Combobox 实现 @ 提及体验。</p></DemoFrame></DemoCard>
  if (name === "PinInput") return <DemoCard name={name} status={status}><DemoFrame><PinInput /></DemoFrame></DemoCard>
  if (name === "Form") return <DemoCard name={name} status={status}><DemoFrame><div class="grid gap-4 md:grid-cols-3"><div class="space-y-2"><DemoLabel>Horizontal</DemoLabel><TextField label="姓名" value="林晓" /><Button size="sm">保存</Button></div><div class="space-y-2"><DemoLabel>Vertical</DemoLabel><TextField label="邮箱" placeholder="name@example.com" /><Button size="sm">提交</Button></div><div class="flex items-end gap-2"><div class="flex-1"><DemoLabel>Inline</DemoLabel><TextField label="邀请码" /></div><Button size="sm">验证</Button></div></div></DemoFrame></DemoCard>
  if (name === "Upload") return <DemoCard name={name} status={status}><DemoFrame><FileField label="文件上传" /></DemoFrame></DemoCard>
  if (name === "Transfer") return <DemoCard name={name} status={status}><DemoFrame><div class="flex items-center gap-3"><select multiple class="h-28 min-w-32 rounded border bg-white p-2 text-sm dark:bg-zinc-900"><option>订单</option><option>客户</option><option>发票</option></select><div class="grid gap-1"><Button size="icon" aria-label="移动到右侧">→</Button><Button size="icon" variant="outline" aria-label="移动到左侧">←</Button></div><select multiple class="h-28 min-w-32 rounded border bg-white p-2 text-sm dark:bg-zinc-900"><option>报表</option></select></div></DemoFrame></DemoCard>
  if (name === "Cascader") return <DemoCard name={name} status={status}><DemoFrame><div class="flex flex-wrap items-end gap-3"><Select label="省" options={[{ value: "zj", label: "浙江省" }, { value: "gd", label: "广东省" }]} value="zj" /><span class="pb-2">›</span><Select label="市" options={[{ value: "hz", label: "杭州市" }, { value: "sz", label: "深圳市" }]} value="hz" /></div></DemoFrame></DemoCard>
  if (name === "ColorPicker") return <DemoCard name={name} status={status}><DemoFrame><ColorPicker /><p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">ColorArea · ColorSlider · ColorField · ColorSwatch</p></DemoFrame></DemoCard>
  if (name === "DatePicker" || name === "DateRangePicker") return <DemoCard name={name} status={status}><DemoFrame><div class="flex flex-wrap gap-3"><TextField label="开始日期" type="date" value="2026-09-01" /><Show when={name === "DateRangePicker"}><TextField label="结束日期" type="date" value="2026-09-30" /></Show></div><div class="mt-4 grid max-w-sm grid-cols-7 gap-1 text-center text-xs"><For each={["一","二","三","四","五","六","日"]}>{(day) => <span class="font-medium text-zinc-500 dark:text-zinc-400">{day}</span>}</For>{Array.from({ length: 30 }, (_, i) => <button class={`rounded p-1 ${i === 14 ? "bg-blue-600 text-white" : "hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}>{i + 1}</button>)}</div></DemoFrame></DemoCard>
  if (name === "TimePicker") return <DemoCard name={name} status={status}><DemoFrame><TimeField label="开始时间" /></DemoFrame></DemoCard>
  if (name === "Rating") return <DemoCard name={name} status={status}><DemoFrame><div class="grid gap-3"><Rating defaultValue={2} label="可交互评分" /><Rating value={3.5} allowHalf readOnly label="只读评分 3.5" /><Rating value={3} disabled label="禁用评分" /></div></DemoFrame></DemoCard>
  if (name === "Slider") return <DemoCard name={name} status={status}><DemoFrame><div class="grid gap-5 sm:grid-cols-2"><Slider value={[slider()]} onChange={(value) => setSlider(value[0] ?? 0)} minValue={0} maxValue={100}><Slider.Label>单值 {slider()}</Slider.Label><Slider.Track class="relative h-2 rounded bg-zinc-200 dark:bg-zinc-700"><Slider.Fill class="absolute h-full rounded bg-blue-600" /><Slider.Thumb class="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-blue-600 bg-white" /></Slider.Track></Slider><Slider value={range()} onChange={setRange} minValue={0} maxValue={100}><Slider.Label>范围 {range().join("–")}</Slider.Label><Slider.Track class="relative h-2 rounded bg-zinc-200 dark:bg-zinc-700"><Slider.Fill class="absolute h-full rounded bg-blue-600" /><Slider.Thumb class="absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-blue-600 bg-white" /></Slider.Track></Slider></div></DemoFrame></DemoCard>
  if (name === "Radio") return <DemoCard name={name} status={status}><DemoFrame><RadioGroup label="项目类型" options={[{ value: "web", label: "Web" }, { value: "mobile", label: "移动端" }, { value: "internal", label: "内部" }]} value="web" /></DemoFrame></DemoCard>
  if (name === "Checkbox") return <DemoCard name={name} status={status}><DemoFrame><div class="flex flex-wrap gap-4"><Checkbox label="未选中" /><Checkbox label="已选中" checked /><Checkbox label="不确定" indeterminate /><Checkbox label="禁用" disabled /><Checkbox label="错误" class="text-red-600" /></div></DemoFrame></DemoCard>
  if (name === "Switch") return <DemoCard name={name} status={status}><DemoFrame><div class="grid gap-3 sm:grid-cols-2"><Switch label="默认已选" checked /><Switch label="未选中" /><Switch label="带描述" checked description="保存后立即生效" /><Switch label="禁用" disabled description="当前不可用" /></div></DemoFrame></DemoCard>
  if (name === "NumberInput") return <DemoCard name={name} status={status}><DemoFrame><div class="grid gap-3 sm:grid-cols-4"><TextField label="默认" type="number" value="12" /><TextField label="1–100 · 步进 5" type="number" value="25" description="min 1 · max 100 · step 5" /><TextField label="金额" prefix="¥" type="number" value="12,480" /><TextField label="禁用/错误" type="number" disabled error="范围不正确" /></div></DemoFrame></DemoCard>
  if (name === "Textarea") return <DemoCard name={name} status={status}><DemoFrame><div class="grid gap-3 sm:grid-cols-3"><TextArea label="默认" rows={3} placeholder="写点内容..." /><TextArea label="带计数" rows={3} maxLength={200} value="已输入的描述" description="12 / 200" /><TextArea label="错误/禁用" rows={3} disabled error="内容不能为空" /></div></DemoFrame></DemoCard>
  if (name === "MultiSelect") return <DemoCard name={name} status={status}><DemoFrame><Select label="渠道（多选）" options={options} value={["a", "b"]} multiple /></DemoFrame></DemoCard>
  if (name === "Combobox" || name === "Autocomplete") return <DemoCard name={name} status={status}><DemoFrame><div class="grid max-w-md gap-3"><Combobox label={name === "Autocomplete" ? "可自定义值" : "过滤城市"} options={[{ value: "hangzhou", label: "杭州" }, { value: "shanghai", label: "上海" }, { value: "shenzhen", label: "深圳" }]} placeholder="输入过滤..." /><p class="text-xs text-zinc-500 dark:text-zinc-400">输入内容后过滤选项，{name === "Autocomplete" ? "允许自定义值" : "仅选择已有值"}。</p></div></DemoFrame></DemoCard>
  return <DemoCard name={name} status={status}><DemoFrame><div class="grid gap-3 sm:grid-cols-3"><TextField label="默认" placeholder="请输入" prefix={<Icon name="search" size={16} />} /><TextField label="密码" type="password" value="secret" /><TextField label="只读/禁用" value="readonly" disabled description="说明文字" /><TextField label="错误" value="bad" error="请输入有效内容" suffix={<IconButton name="x" label="清除" size="sm" variant="ghost" />} /></div><div class="mt-3 flex flex-wrap gap-2"><Button size="sm">搜索</Button><Button size="sm" variant="outline">3 sizes: sm / md / lg</Button></div></DemoFrame></DemoCard>
}

export function FormsDemo(props: { name: string; status: string }) {
  return <>{renderForms(props.name, props.status)}</>
}
