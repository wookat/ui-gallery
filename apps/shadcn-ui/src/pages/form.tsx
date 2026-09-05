import { useState } from "react"
import { Icon } from "@ui-gallery/icons-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "./shared"

const options = [{ value: "pro", label: "Pro plan" }, { value: "team", label: "Team plan" }]

export function FormPage() {
  const [step, setStep] = useState("details")
  const [date, setDate] = useState<Date | undefined>()
  return (
    <div className="space-y-6">
      <PageHeader title="创建项目" description="用三步完成一个新的工作区配置。" />
      <Tabs value={step} onValueChange={setStep}><div className="w-full overflow-x-auto"><TabsList className="grid w-max min-w-full grid-cols-3 sm:w-[520px] sm:min-w-0"><TabsTrigger value="details">1. 基本信息</TabsTrigger><TabsTrigger value="config">2. 配置选项</TabsTrigger><TabsTrigger value="review">3. 确认提交</TabsTrigger></TabsList></div>
        <TabsContent value="details"><Card><CardHeader><CardTitle>基本信息</CardTitle><CardDescription>告诉我们项目的基础信息。</CardDescription></CardHeader><CardContent><FieldSet className="grid gap-5 sm:grid-cols-2"><Field><FieldLabel htmlFor="project-name">项目名称</FieldLabel><FieldContent><Input id="project-name" placeholder="例如：增长分析" /></FieldContent></Field><Field><FieldLabel>项目类型</FieldLabel><FieldContent><Combobox items={options}><ComboboxTrigger className="flex w-full items-center justify-between [&_[data-slot=combobox-value]]:min-w-0 [&_[data-slot=combobox-value]]:truncate [&_[data-slot=combobox-value]]:whitespace-nowrap"><ComboboxValue placeholder="选择类型" /></ComboboxTrigger><ComboboxContent><ComboboxInput placeholder="搜索类型" /><ComboboxList><ComboboxItem value="pro">Pro plan</ComboboxItem><ComboboxItem value="team">Team plan</ComboboxItem></ComboboxList></ComboboxContent></Combobox></FieldContent></Field><Field className="sm:col-span-2"><FieldLabel htmlFor="project-description">描述</FieldLabel><FieldContent><Textarea id="project-description" placeholder="描述你的项目目标..." /><FieldDescription>最多 500 个字符。</FieldDescription></FieldContent></Field></FieldSet><div className="mt-6 flex justify-end"><Button onClick={() => setStep("config")}>下一步<Icon name="arrow-right" /></Button></div></CardContent></Card></TabsContent>
        <TabsContent value="config"><Card><CardHeader><CardTitle>配置选项</CardTitle><CardDescription>选择计划、权限与通知。</CardDescription></CardHeader><CardContent className="space-y-6"><Field><FieldLabel>计划</FieldLabel><FieldContent><RadioGroup defaultValue="team" className="grid gap-3 sm:grid-cols-2"><label className="flex items-center gap-3 rounded-lg border p-4"><RadioGroupItem value="pro" /><span><span className="font-medium">Pro</span><span className="block text-xs text-muted-foreground">适合小型团队</span></span></label><label className="flex items-center gap-3 rounded-lg border p-4"><RadioGroupItem value="team" /><span><span className="font-medium">Team</span><span className="block text-xs text-muted-foreground">适合协作团队</span></span></label></RadioGroup></FieldContent></Field><div className="grid gap-5 sm:grid-cols-2"><Field><FieldLabel>通知频率</FieldLabel><FieldContent><Select defaultValue="daily"><SelectTrigger className="w-full"><SelectValue className="truncate whitespace-nowrap" /></SelectTrigger><SelectContent><SelectItem value="daily">每日</SelectItem><SelectItem value="weekly">每周</SelectItem></SelectContent></Select></FieldContent></Field><Field><FieldLabel>原生选择器</FieldLabel><FieldContent><NativeSelect defaultValue="zh"><NativeSelectOption value="zh">中文</NativeSelectOption><NativeSelectOption value="en">English</NativeSelectOption></NativeSelect></FieldContent></Field></div><Field><FieldLabel>提醒时间</FieldLabel><FieldContent><Popover><PopoverTrigger asChild><Button variant="outline" className="justify-start font-normal"><Icon name="calendar" />{date ? date.toLocaleDateString() : "选择日期"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent></Popover></FieldContent></Field><Field><FieldLabel>采样比例</FieldLabel><FieldContent><Slider defaultValue={[60]} max={100} step={1} /></FieldContent></Field><div className="flex items-center justify-between rounded-lg border p-4"><div><p className="font-medium">通知开关</p><p className="text-sm text-muted-foreground">接收项目活动提醒</p></div><Switch defaultChecked /></div><div className="space-y-2"><p className="text-sm font-medium">验证码</p><InputOTP maxLength={6}><InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup></InputOTP></div><div className="flex flex-wrap items-center gap-2"><Toggle pressed><Icon name="bold" /></Toggle><ToggleGroup type="single" defaultValue="center"><ToggleGroupItem value="left">左</ToggleGroupItem><ToggleGroupItem value="center">中</ToggleGroupItem><ToggleGroupItem value="right">右</ToggleGroupItem></ToggleGroup><Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon"><Icon name="info" /></Button></TooltipTrigger><TooltipContent>组合控件示例</TooltipContent></Tooltip><Badge>组合示例</Badge></div><div className="flex justify-between"><Button variant="outline" onClick={() => setStep("details")}>上一步</Button><Button onClick={() => setStep("review")}>下一步</Button></div></CardContent></Card></TabsContent>
        <TabsContent value="review"><Card><CardHeader><CardTitle>确认提交</CardTitle><CardDescription>检查配置后提交。</CardDescription></CardHeader><CardContent className="space-y-6"><InputGroup><InputGroupAddon><Icon name="check" /></InputGroupAddon><InputGroupInput readOnly value="项目配置已准备完成" /></InputGroup><Progress value={82} /><div className="flex items-center gap-2"><Checkbox defaultChecked /><span className="text-sm">我同意服务条款与隐私政策</span></div><div className="flex justify-between"><Button variant="outline" onClick={() => setStep("config")}>上一步</Button><Button onClick={() => setStep("success")}>提交项目</Button></div></CardContent></Card></TabsContent>
        <TabsContent value="success"><Empty className="border"><EmptyHeader><EmptyMedia variant="icon"><Icon name="check" /></EmptyMedia><EmptyTitle>项目创建成功</EmptyTitle><EmptyDescription>你的工作区已经准备就绪。</EmptyDescription></EmptyHeader><Button>进入项目</Button></Empty></TabsContent>
      </Tabs>
    </div>
  )
}
