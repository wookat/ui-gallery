<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import Icon from '@/components/Icon.vue'
import PageHeader from '@/components/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Combobox, ComboboxAnchor, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox'
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Calendar } from '@/components/ui/calendar'

const step = ref('basic')
const submitted = ref(false)
const projectName = ref('')
const nameError = ref('')
const date = ref()
const tags = ref<string[]>([])
const progress = computed(() => submitted.value ? 100 : step.value === 'basic' ? 33 : step.value === 'config' ? 66 : 82)
const steps = [{ value: 'basic', title: '基本信息', description: '项目名称与联系人' }, { value: 'config', title: '详细配置', description: '计划与工作方式' }, { value: 'review', title: '确认', description: '检查并提交' }]

function nextFromBasic() {
  if (!projectName.value.trim()) {
    nameError.value = '请输入项目名称。'
    return
  }
  nameError.value = ''
  step.value = 'config'
}

function submit() {
  submitted.value = true
  toast.success('项目创建成功', { description: '你的工作区已经准备就绪。' })
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader title="新建项目" description="通过多步表单配置一个新的工作区。" />
    <Stepper class="w-full"><StepperItem v-for="(item, index) in steps" :key="item.value" :step="index + 1" :value="item.value"><StepperTrigger><StepperIndicator>{{ index + 1 }}</StepperIndicator><div class="hidden text-left sm:block"><StepperTitle>{{ item.title }}</StepperTitle><StepperDescription>{{ item.description }}</StepperDescription></div></StepperTrigger><StepperSeparator v-if="index < steps.length - 1" /></StepperItem></Stepper>
    <Progress :model-value="progress" />
    <Tabs v-model="step">
      <TabsList class="sr-only"><TabsTrigger v-for="item in steps" :key="item.value" :value="item.value">{{ item.title }}</TabsTrigger></TabsList>
      <TabsContent value="basic"><Card><CardHeader><CardTitle>基本信息</CardTitle><CardDescription>告诉我们项目的基础信息。</CardDescription></CardHeader><CardContent class="space-y-6"><FieldSet class="grid gap-5 sm:grid-cols-2"><Field><FieldLabel>项目名称 <span class="text-destructive">*</span></FieldLabel><FieldContent><Input v-model="projectName" placeholder="例如：增长控制台" :aria-invalid="!!nameError" /><p v-if="nameError" class="text-sm text-destructive">{{ nameError }}</p><FieldDescription>这是团队成员看到的项目名称。</FieldDescription></FieldContent></Field><Field><FieldLabel>项目类型</FieldLabel><FieldContent><Combobox><ComboboxAnchor class="w-full"><ComboboxInput placeholder="搜索并选择计划" /><ComboboxTrigger /></ComboboxAnchor><ComboboxList><ComboboxItem value="pro">Pro plan</ComboboxItem><ComboboxItem value="team">Team plan</ComboboxItem></ComboboxList></Combobox></FieldContent></Field><Field><FieldLabel>负责人邮箱</FieldLabel><FieldContent><Input type="email" placeholder="you@example.com" /><FieldDescription>请输入有效的工作邮箱。</FieldDescription></FieldContent></Field><Field class="sm:col-span-2"><FieldLabel>项目说明</FieldLabel><FieldContent><Textarea placeholder="描述你的项目目标..." /><FieldDescription>最多 500 个字符。</FieldDescription></FieldContent></Field></FieldSet><div class="flex justify-end"><Button @click="nextFromBasic">下一步<Icon name="arrow-right" /></Button></div></CardContent></Card></TabsContent>
      <TabsContent value="config"><Card><CardHeader><CardTitle>配置选项</CardTitle><CardDescription>选择计划、权限与通知。</CardDescription></CardHeader><CardContent class="space-y-6"><Field><FieldLabel>计划</FieldLabel><FieldContent><RadioGroup default-value="team" class="grid gap-3 sm:grid-cols-2"><label class="flex items-center gap-3 rounded-lg border p-4"><RadioGroupItem value="pro" /><span><span class="font-medium">Pro</span><span class="block text-xs text-muted-foreground">适合小型团队</span></span></label><label class="flex items-center gap-3 rounded-lg border p-4"><RadioGroupItem value="team" /><span><span class="font-medium">Team</span><span class="block text-xs text-muted-foreground">适合协作团队</span></span></label></RadioGroup></FieldContent></Field><div class="grid gap-5 sm:grid-cols-2"><Field><FieldLabel>席位数量</FieldLabel><FieldContent><NumberField :min="1"><NumberFieldContent><NumberFieldDecrement /><NumberFieldInput /><NumberFieldIncrement /></NumberFieldContent></NumberField></FieldContent></Field><Field><FieldLabel>地区</FieldLabel><FieldContent><Select default-value="cn"><SelectTrigger><SelectValue placeholder="选择地区" /></SelectTrigger><SelectContent><SelectItem value="cn">中国大陆</SelectItem><SelectItem value="sg">新加坡</SelectItem><SelectItem value="de">法兰克福</SelectItem></SelectContent></Select></FieldContent></Field></div><Field><FieldLabel>提醒日期</FieldLabel><FieldContent><Popover><PopoverTrigger as-child><Button variant="outline"><Icon name="calendar" />{{ date ? date.toLocaleDateString() : '选择日期' }}</Button></PopoverTrigger><PopoverContent class="w-auto p-0"><Calendar v-model="date" mode="single" /></PopoverContent></Popover></FieldContent></Field><Field><FieldLabel>预算 / 优先级</FieldLabel><FieldContent><Slider :max="100" :step="1" /></FieldContent></Field><Field><FieldLabel>评分</FieldLabel><FieldContent><ToggleGroup type="multiple"><ToggleGroupItem v-for="star in 5" :key="star" :value="String(star)" aria-label="评分">★</ToggleGroupItem></ToggleGroup></FieldContent></Field><div class="space-y-3"><FieldLabel>标签</FieldLabel><TagsInput v-model="tags"><TagsInputItem v-for="tag in tags" :key="tag" :value="tag"><TagsInputItemText /><TagsInputItemDelete /></TagsInputItem><TagsInputInput placeholder="添加标签..." /></TagsInput></div><div class="grid gap-5 sm:grid-cols-2"><Field><FieldLabel>颜色</FieldLabel><FieldContent><Input type="color" class="h-9 p-1" /></FieldContent></Field><Field><FieldLabel>时间</FieldLabel><FieldContent><Input type="time" /></FieldContent></Field></div><div class="flex items-center justify-between rounded-lg border p-4"><div><p class="font-medium">接收项目通知</p><p class="text-sm text-muted-foreground">通过邮件接收项目更新。</p></div><Switch default-checked /></div><div class="flex justify-between"><Button variant="outline" @click="step = 'basic'">上一步</Button><Button @click="step = 'review'">下一步<Icon name="arrow-right" /></Button></div></CardContent></Card></TabsContent>
      <TabsContent value="review"><Card><CardHeader><CardTitle>确认提交</CardTitle><CardDescription>检查配置后提交。</CardDescription></CardHeader><CardContent class="space-y-6"><div class="grid gap-4 rounded-lg border p-4 text-sm"><div class="flex justify-between"><span class="text-muted-foreground">项目名称</span><span>{{ projectName || '未填写' }}</span></div><div class="flex justify-between"><span class="text-muted-foreground">计划</span><span>Team</span></div><div class="flex justify-between"><span class="text-muted-foreground">标签</span><span>{{ tags.join('、') || '未设置' }}</span></div></div><div class="flex items-center gap-2"><Checkbox default-checked /><span class="text-sm">我同意服务条款与隐私政策</span></div><div class="flex justify-between"><Button variant="outline" @click="step = 'config'">上一步</Button><Button @click="submit"><Icon name="check" />提交项目</Button></div></CardContent></Card></TabsContent>
    </Tabs>
    <Card v-if="submitted" class="border-primary"><CardContent class="grid place-items-center gap-3 py-12 text-center"><Icon name="check" :size="36" class="text-primary" /><h2 class="text-xl font-semibold">项目创建成功</h2><p class="text-sm text-muted-foreground">你的工作区已经准备就绪。</p><Button @click="submitted = false">创建另一个项目</Button></CardContent></Card>
    <Card class="border-dashed"><CardHeader><CardTitle class="text-base">安全验证码</CardTitle><CardDescription>用于确认工作区邀请。</CardDescription></CardHeader><CardContent><InputOTP :maxlength="6"><InputOTPGroup><InputOTPSlot v-for="index in 6" :key="index" :index="index - 1" /></InputOTPGroup></InputOTP></CardContent></Card>
  </div>
</template>
