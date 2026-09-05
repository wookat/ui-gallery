<script setup lang="ts">
import { ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import { toast } from 'vue-sonner'
import { RouterLink } from 'vue-router'
import Icon from '@/components/Icon.vue'
import PageHeader from '@/components/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Combobox, ComboboxAnchor, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper'
import { Switch } from '@/components/ui/switch'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type RangeValue = { start: DateValue, end: DateValue }
const step = ref('basic')
const submitted = ref(false)
const projectName = ref('')
const description = ref('')
const email = ref('')
const phone = ref('')
const phoneCode = ref('+86')
const otp = ref('')
const seats = ref(1)
const plan = ref('team')
const notificationChannels = ref<string[]>([])
const receiveNotifications = ref(true)
const projectType = ref('')
const region = ref('')
const multiRegions = ref<string[]>([])
const tags = ref<string[]>([])
const date = ref<DateValue>()
const dateRange = ref<RangeValue>()
const droppedFiles = ref<File[]>([])
const budget = ref([60])
const rating = ref<string[]>([])
const color = ref('')
const time = ref('')
const agree = ref(false)
const nameError = ref('')
const agreeError = ref('')
const emailError = ref('')
const phoneError = ref('')
const dragover = ref(false)
const progress = () => step.value === 'basic' ? 33 : step.value === 'config' ? 66 : 100
const steps = [{ value: 'basic', title: '基本信息', description: '项目名称与联系人' }, { value: 'config', title: '详细配置', description: '计划与工作方式' }, { value: 'review', title: '确认', description: '检查并提交' }]
const channelOptions = ['邮件', '短信', '站内']
const regionOptions = ['中国大陆', '新加坡', '法兰克福']

function toggleChannel(channel: string, checked: boolean | 'indeterminate') {
  notificationChannels.value = checked === true ? [...new Set([...notificationChannels.value, channel])] : notificationChannels.value.filter(item => item !== channel)
}
function toggleRegion(item: string, checked: boolean | 'indeterminate') {
  multiRegions.value = checked === true ? [...new Set([...multiRegions.value, item])] : multiRegions.value.filter(value => value !== item)
}
function addFiles(files: FileList | null) {
  if (files) droppedFiles.value = [...droppedFiles.value, ...Array.from(files)]
  dragover.value = false
}
function validateBasic() {
  nameError.value = projectName.value.trim() ? '' : '请输入项目名称。'
  emailError.value = email.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? '' : email.value ? '请输入有效的邮箱地址。' : ''
  phoneError.value = phone.value && /^\d{6,15}$/.test(phone.value) ? '' : phone.value ? '请输入 6-15 位数字电话号码。' : ''
  return !nameError.value && !emailError.value && !phoneError.value
}
function nextFromBasic() {
  if (validateBasic()) step.value = 'config'
}
function submit() {
  const valid = validateBasic()
  agreeError.value = agree.value ? '' : '请同意服务条款。'
  if (!valid || agreeError.value) {
    step.value = agreeError.value ? 'review' : 'basic'
    return
  }
  submitted.value = true
  toast.success('项目创建成功', { description: '你的工作区已经准备就绪。' })
}
function reset() {
  step.value = 'basic'
  submitted.value = false
  projectName.value = ''
  description.value = ''
  email.value = ''
  phone.value = ''
  phoneCode.value = '+86'
  otp.value = ''
  seats.value = 1
  plan.value = 'team'
  notificationChannels.value = []
  receiveNotifications.value = true
  projectType.value = ''
  region.value = ''
  multiRegions.value = []
  tags.value = []
  date.value = undefined
  dateRange.value = undefined
  droppedFiles.value = []
  budget.value = [60]
  rating.value = []
  color.value = ''
  time.value = ''
  agree.value = false
  nameError.value = ''
  agreeError.value = ''
}
const valueOrUnset = (value: unknown) => value || '未填写'
const dateLabel = () => date.value?.toString() || '未设置'
const rangeLabel = () => dateRange.value ? `${dateRange.value.start} – ${dateRange.value.end}` : '未设置'
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="新建项目" description="通过多步表单配置一个新的工作区。" />
    <template v-if="!submitted">
      <Stepper class="w-full"><StepperItem v-for="(item, index) in steps" :key="item.value" :step="index + 1"><StepperTrigger @click="step = item.value"><StepperIndicator>{{ index + 1 }}</StepperIndicator><div class="hidden text-left sm:block"><StepperTitle>{{ item.title }}</StepperTitle><StepperDescription>{{ item.description }}</StepperDescription></div></StepperTrigger><StepperSeparator v-if="index < steps.length - 1" /></StepperItem></Stepper>
      <Progress :model-value="progress()" />
      <div v-if="step === 'basic'"><Card><CardHeader><CardTitle>基本信息</CardTitle><CardDescription>告诉我们项目的基础信息。</CardDescription></CardHeader><CardContent class="space-y-6"><FieldSet class="grid gap-5 sm:grid-cols-2">
        <Field><FieldLabel>项目名称 <span class="text-destructive">*</span><TooltipProvider><Tooltip><TooltipTrigger as-child><Icon name="info" :size="14" class="inline-block text-muted-foreground" /></TooltipTrigger><TooltipContent>团队成员会看到这个名称。</TooltipContent></Tooltip></TooltipProvider></FieldLabel><FieldContent><Input v-model="projectName" placeholder="例如：增长控制台" :aria-invalid="!!nameError" /><p v-if="nameError" class="text-sm text-destructive">{{ nameError }}</p><FieldDescription>使用简短、容易识别的项目名称。</FieldDescription></FieldContent></Field>
        <Field class="sm:col-span-2"><FieldLabel>项目说明</FieldLabel><FieldContent><Textarea v-model="description" maxlength="500" placeholder="描述你的项目目标..." /><p class="text-xs text-muted-foreground">{{ description.length }}/500</p></FieldContent></Field>
        <Field><FieldLabel>席位数量</FieldLabel><FieldContent><NumberField v-model="seats" :min="1"><NumberFieldContent><NumberFieldDecrement /><NumberFieldInput /><NumberFieldIncrement /></NumberFieldContent></NumberField></FieldContent></Field>
        <Field><FieldLabel>计划</FieldLabel><FieldContent><RadioGroup v-model="plan" class="grid gap-2 sm:grid-cols-2"><label class="flex items-center gap-2 rounded-lg border p-3"><RadioGroupItem value="pro" />Pro</label><label class="flex items-center gap-2 rounded-lg border p-3"><RadioGroupItem value="team" />Team</label></RadioGroup></FieldContent></Field>
        <Field class="sm:col-span-2"><FieldLabel>通知渠道</FieldLabel><FieldContent><div class="flex flex-wrap gap-4"><label v-for="channel in channelOptions" :key="channel" class="flex items-center gap-2 text-sm"><Checkbox :model-value="notificationChannels.includes(channel)" @update:model-value="toggleChannel(channel, $event)" />{{ channel }}</label></div></FieldContent></Field>
        <Field><FieldLabel>负责人邮箱 <TooltipProvider><Tooltip><TooltipTrigger as-child><Icon name="info" :size="14" class="inline-block text-muted-foreground" /></TooltipTrigger><TooltipContent>用于接收项目通知。</TooltipContent></Tooltip></TooltipProvider></FieldLabel><FieldContent><Input v-model="email" type="email" placeholder="you@example.com" :aria-invalid="!!emailError" /><p v-if="emailError" class="text-sm text-destructive">{{ emailError }}</p><FieldDescription>请输入有效的工作邮箱。</FieldDescription></FieldContent></Field>
        <Field><FieldLabel>电话 <TooltipProvider><Tooltip><TooltipTrigger as-child><Icon name="info" :size="14" class="inline-block text-muted-foreground" /></TooltipTrigger><TooltipContent>请输入数字，不含空格和短横线。</TooltipContent></Tooltip></TooltipProvider></FieldLabel><FieldContent><InputGroup><Select v-model="phoneCode"><SelectTrigger class="w-24"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="+86">+86</SelectItem><SelectItem value="+1">+1</SelectItem><SelectItem value="+81">+81</SelectItem></SelectContent></Select><InputGroupInput v-model="phone" inputmode="numeric" placeholder="手机号码" :aria-invalid="!!phoneError" /></InputGroup><p v-if="phoneError" class="text-sm text-destructive">{{ phoneError }}</p><FieldDescription>请输入 6-15 位数字电话号码。</FieldDescription></FieldContent></Field>
        <Field><FieldLabel>验证码</FieldLabel><FieldContent><InputOTP v-model="otp" :maxlength="6"><InputOTPGroup><InputOTPSlot v-for="index in 6" :key="index" :index="index - 1" /></InputOTPGroup></InputOTP><FieldDescription>输入发送到负责人邮箱或电话的 6 位验证码。</FieldDescription></FieldContent></Field>
        <div class="flex items-center justify-between rounded-lg border p-4 sm:col-span-2"><div><p class="font-medium">接收项目通知</p><p class="text-sm text-muted-foreground">通过邮件接收项目更新。</p></div><Switch v-model="receiveNotifications" /></div>
      </FieldSet><div class="flex justify-end"><Button class="min-h-10" @click="nextFromBasic">下一步<Icon name="arrow-right" /></Button></div></CardContent></Card></div>
      <div v-else-if="step === 'config'"><Card><CardHeader><CardTitle>详细配置</CardTitle><CardDescription>选择项目的工作方式。</CardDescription></CardHeader><CardContent class="space-y-6">
        <Field><FieldLabel>项目类型</FieldLabel><FieldContent><Combobox v-model="projectType"><ComboboxAnchor class="w-full"><ComboboxInput placeholder="搜索并选择类型" /><ComboboxTrigger /></ComboboxAnchor><ComboboxList><ComboboxItem value="产品">产品</ComboboxItem><ComboboxItem value="营销">营销</ComboboxItem><ComboboxItem value="研发">研发</ComboboxItem></ComboboxList></Combobox></FieldContent></Field>
        <Field><FieldLabel>地区</FieldLabel><FieldContent><Select v-model="region"><SelectTrigger class="min-h-10"><SelectValue placeholder="选择地区" /></SelectTrigger><SelectContent><SelectItem v-for="item in regionOptions" :key="item" :value="item">{{ item }}</SelectItem></SelectContent></Select></FieldContent></Field>
        <Field><FieldLabel>多选地区</FieldLabel><FieldContent><DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline" class="min-h-10">{{ multiRegions.length ? multiRegions.join('、') : '选择多个地区' }}</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuCheckboxItem v-for="item in regionOptions" :key="item" :model-value="multiRegions.includes(item)" @update:model-value="toggleRegion(item, $event)">{{ item }}</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu></FieldContent></Field>
        <div class="grid gap-5 sm:grid-cols-2"><Field><FieldLabel>日期</FieldLabel><FieldContent><Popover><PopoverTrigger as-child><Button variant="outline" class="min-h-10">{{ dateLabel() }}</Button></PopoverTrigger><PopoverContent class="w-auto p-0"><Calendar v-model="date" mode="single" /></PopoverContent></Popover></FieldContent></Field><Field><FieldLabel>日期范围</FieldLabel><FieldContent><Popover><PopoverTrigger as-child><Button variant="outline" class="min-h-10">{{ rangeLabel() }}</Button></PopoverTrigger><PopoverContent class="w-auto p-0"><RangeCalendar v-model="dateRange" /></PopoverContent></Popover></FieldContent></Field></div>
        <Field><FieldLabel>文件上传</FieldLabel><FieldContent><div class="rounded-lg border border-dashed p-6 text-center" :class="dragover ? 'bg-muted' : ''" @dragover.prevent="dragover = true" @dragleave="dragover = false" @drop.prevent="addFiles($event.dataTransfer?.files ?? null)"><label class="cursor-pointer text-sm"><Icon name="upload" />拖拽文件到此处，或点击选择<input type="file" multiple class="sr-only" @change="addFiles(($event.target as HTMLInputElement).files)" /></label><div v-if="droppedFiles.length" class="mt-3 grid gap-1 text-left text-xs text-muted-foreground"><span v-for="file in droppedFiles" :key="file.name">{{ file.name }}</span></div></div></FieldContent></Field>
        <Field><FieldLabel>预算</FieldLabel><FieldContent><Slider v-model="budget" :max="100" :step="1" /></FieldContent></Field><Field><FieldLabel>评分</FieldLabel><FieldContent><ToggleGroup v-model="rating" type="multiple"><ToggleGroupItem v-for="star in 5" :key="star" :value="String(star)" class="min-h-10 min-w-10">★</ToggleGroupItem></ToggleGroup></FieldContent></Field>
        <Field><FieldLabel>标签</FieldLabel><FieldContent><TagsInput v-model="tags"><TagsInputItem v-for="tag in tags" :key="tag" :value="tag"><TagsInputItemText /><TagsInputItemDelete /></TagsInputItem><TagsInputInput placeholder="添加标签..." /></TagsInput></FieldContent></Field><div class="grid gap-5 sm:grid-cols-2"><Field><FieldLabel>颜色</FieldLabel><FieldContent><Input v-model="color" type="color" class="h-9 p-1" /></FieldContent></Field><Field><FieldLabel>时间</FieldLabel><FieldContent><Input v-model="time" type="time" /></FieldContent></Field></div>
        <div class="flex justify-between"><Button variant="outline" class="min-h-10" @click="step = 'basic'">上一步</Button><Button class="min-h-10" @click="step = 'review'">下一步<Icon name="arrow-right" /></Button></div>
      </CardContent></Card></div>
      <div v-else><Card><CardHeader><CardTitle>确认提交</CardTitle><CardDescription>检查步骤 1–2 的全部配置后提交。</CardDescription></CardHeader><CardContent class="space-y-6"><dl class="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2"><template v-for="item in [{ label: '项目名称', value: valueOrUnset(projectName) }, { label: '项目说明', value: valueOrUnset(description) }, { label: '席位数量', value: seats }, { label: '计划', value: valueOrUnset(plan) }, { label: '通知渠道', value: notificationChannels.join('、') || '未设置' }, { label: '接收项目通知', value: receiveNotifications ? '是' : '否' }, { label: '邮箱', value: valueOrUnset(email) }, { label: '电话', value: phone ? `${phoneCode} ${phone}` : '未填写' }, { label: '验证码', value: valueOrUnset(otp) }, { label: '项目类型', value: valueOrUnset(projectType) }, { label: '地区', value: valueOrUnset(region) }, { label: '多选地区', value: multiRegions.join('、') || '未设置' }, { label: '日期', value: dateLabel() }, { label: '日期范围', value: rangeLabel() }, { label: '文件', value: droppedFiles.map(file => file.name).join('、') || '未设置' }, { label: '预算', value: `${budget[0]}%` }, { label: '评分', value: rating.join('、') || '未设置' }, { label: '颜色', value: valueOrUnset(color) }, { label: '时间', value: valueOrUnset(time) }, { label: '标签', value: tags.join('、') || '未设置' }]" :key="item.label"><dt class="text-muted-foreground">{{ item.label }}</dt><dd class="truncate sm:text-right">{{ item.value }}</dd></template></dl><label class="flex items-start gap-2 text-sm"><Checkbox v-model="agree" :aria-invalid="!!agreeError" /><span>我同意服务条款与隐私政策<span class="text-destructive"> *</span><span v-if="agreeError" class="block text-destructive">{{ agreeError }}</span></span></label><div class="flex justify-between"><Button variant="outline" class="min-h-10" @click="step = 'config'">上一步</Button><Button class="min-h-10" @click="submit"><Icon name="check" />提交项目</Button></div></CardContent></Card></div>
    </template>
    <Card v-else class="border-primary"><CardContent class="grid place-items-center gap-4 py-12 text-center"><Empty><EmptyHeader><EmptyMedia variant="icon"><Icon name="check" /></EmptyMedia><EmptyTitle>项目创建成功</EmptyTitle><EmptyDescription>你的工作区已经准备就绪。</EmptyDescription></EmptyHeader><div class="flex flex-wrap justify-center gap-2"><Button class="min-h-10" @click="reset">创建另一个项目</Button><Button variant="outline" class="min-h-10" as-child><RouterLink to="/">返回仪表盘</RouterLink></Button></div></Empty></CardContent></Card>
  </div>
</template>
