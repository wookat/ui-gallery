<script setup lang="ts">
import { toast } from 'vue-sonner'
import Icon from '@/components/Icon.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Checkbox } from '@/components/ui/checkbox'
import { Combobox, ComboboxAnchor, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Kbd } from '@/components/ui/kbd'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { PinInput, PinInputGroup, PinInputSlot } from '@/components/ui/pin-input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Spinner } from '@/components/ui/spinner'
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { coverage } from '@/lib/coverage'

defineProps<{ name: string, index: number }>()

function showToast(kind: 'success' | 'message') {
  if (kind === 'success')
    toast.success('操作成功', { description: '这是一个真实的 vue-sonner 通知。' })
  else
    toast.message('通知消息', { description: 'Toast 与 Notification 使用同一套反馈能力。' })
}
</script>

<template>
  <Empty v-if="coverage[name] === 'missing'" class="border-0 py-4"><EmptyHeader><EmptyMedia variant="icon"><Icon name="circle-help" /></EmptyMedia><EmptyTitle>shadcn-vue 无此组件</EmptyTitle><EmptyDescription>该 contract 项目已明确标记为 missing。</EmptyDescription></EmptyHeader></Empty>
  <div v-else-if="name === 'Typography'" class="space-y-2"><h1 class="text-2xl font-semibold">标题文字</h1><h3 class="text-lg font-medium">层级标题</h3><p class="text-sm text-muted-foreground">正文、辅助说明与列表内容。</p></div>
  <div v-else-if="name === 'Code'" class="rounded-lg bg-muted p-3 font-mono text-xs">const ui = "shadcn-vue"</div>
  <div v-else-if="name === 'Button'" class="grid gap-3"><div class="flex flex-wrap gap-2"><Button>默认</Button><Button variant="secondary">次要</Button><Button variant="outline">描边</Button><Button variant="ghost">幽灵</Button><Button variant="destructive">危险</Button><Button variant="link">链接</Button></div><div class="flex flex-wrap gap-2"><Button size="sm">小号</Button><Button>默认</Button><Button size="lg">大号</Button><Button disabled>禁用</Button><Button><Spinner />加载</Button><Button size="icon" aria-label="添加"><Icon name="plus" /></Button></div></div>
  <ButtonGroup v-else-if="name === 'ButtonGroup'"><Button>保存</Button><Button variant="outline">取消</Button></ButtonGroup>
  <div v-else-if="name === 'IconButton'" class="flex gap-2"><Button size="icon" aria-label="新增"><Icon name="plus" /></Button><Button size="icon" variant="outline" disabled aria-label="删除"><Icon name="trash" /></Button></div>
  <div v-else-if="name === 'Input'" class="grid gap-2 sm:grid-cols-2"><Input placeholder="输入内容..." /><Input disabled placeholder="禁用输入" /><Input aria-invalid placeholder="格式错误" /><InputGroup><InputGroupAddon><Icon name="search" /></InputGroupAddon><InputGroupInput placeholder="带前缀图标" /></InputGroup></div>
  <Textarea v-else-if="name === 'Textarea'" placeholder="多行文本..." />
  <NumberField v-else-if="name === 'NumberInput'" :default-value="5" :min="0"><NumberFieldContent><NumberFieldDecrement /><NumberFieldInput /><NumberFieldIncrement /></NumberFieldContent></NumberField>
  <Select v-else-if="name === 'Select'"><SelectTrigger><SelectValue placeholder="选择一个选项" /></SelectTrigger><SelectContent><SelectItem value="one">选项一</SelectItem><SelectItem value="two">选项二</SelectItem></SelectContent></Select>
  <div v-else-if="name === 'MultiSelect'" class="flex flex-wrap gap-2"><Badge variant="secondary">选项一 ×</Badge><Badge variant="secondary">选项二 ×</Badge></div>
  <Combobox v-else-if="name === 'Combobox' || name === 'Autocomplete'"><ComboboxAnchor class="w-full"><ComboboxInput placeholder="搜索并选择" /><ComboboxTrigger /></ComboboxAnchor><ComboboxList><ComboboxItem value="one">选项一</ComboboxItem><ComboboxItem value="two">选项二</ComboboxItem></ComboboxList></Combobox>
  <label v-else-if="name === 'Checkbox'" class="flex items-center gap-2 text-sm"><Checkbox default-checked />已选择</label>
  <RadioGroup v-else-if="name === 'Radio'" default-value="one" class="grid gap-2"><label class="flex items-center gap-2 text-sm"><RadioGroupItem value="one" />选项一</label><label class="flex items-center gap-2 text-sm"><RadioGroupItem value="two" />选项二</label></RadioGroup>
  <Switch v-else-if="name === 'Switch'" default-checked />
  <Slider v-else-if="name === 'Slider'" :default-value="[60]" />
  <ToggleGroup v-else-if="name === 'Rating'" type="multiple" :default-value="['1', '2', '3', '4']"><ToggleGroupItem v-for="star in 5" :key="star" :value="String(star)">★</ToggleGroupItem></ToggleGroup>
  <div v-else-if="name === 'DatePicker' || name === 'TimePicker'" class="flex flex-wrap gap-2"><Popover><PopoverTrigger as-child><Button variant="outline"><Icon name="calendar" />选择日期</Button></PopoverTrigger><PopoverContent class="w-auto p-0"><Calendar mode="single" /></PopoverContent></Popover><Input v-if="name === 'TimePicker'" type="time" class="w-32" /></div>
  <Popover v-else-if="name === 'DateRangePicker'"><PopoverTrigger as-child><Button variant="outline"><Icon name="calendar" />选择日期范围</Button></PopoverTrigger><PopoverContent class="w-auto p-0"><RangeCalendar /></PopoverContent></Popover>
  <div v-else-if="name === 'Upload'" class="flex items-center gap-2"><Button variant="outline" as-child><label><Icon name="upload" />上传文件<input type="file" class="sr-only"></label></Button><span class="text-xs text-muted-foreground">支持拖拽上传</span></div>
  <DropdownMenu v-else-if="name === 'Cascader'"><DropdownMenuTrigger as-child><Button variant="outline">选择级联选项</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuSub><DropdownMenuSubTrigger>华东地区</DropdownMenuSubTrigger><DropdownMenuSubContent><DropdownMenuItem>上海</DropdownMenuItem><DropdownMenuItem>杭州</DropdownMenuItem></DropdownMenuSubContent></DropdownMenuSub></DropdownMenuContent></DropdownMenu>
  <PinInput v-else-if="name === 'PinInput'"><PinInputGroup><PinInputSlot v-for="slot in 4" :key="slot" :index="slot - 1" /></PinInputGroup></PinInput>
  <Field v-else-if="name === 'Form'"><FieldLabel>字段标签</FieldLabel><FieldContent><Input placeholder="字段值" /><FieldDescription>字段帮助文案。</FieldDescription></FieldContent></Field>
  <Table v-else-if="name === 'Table' || name === 'DataGrid' || name === 'List'"><TableHeader><TableRow><TableHead>名称</TableHead><TableHead>状态</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>ORD-2401</TableCell><TableCell><Badge>已支付</Badge></TableCell></TableRow><TableRow><TableCell>ORD-2402</TableCell><TableCell><Badge variant="secondary">处理中</Badge></TableCell></TableRow></TableBody></Table>
  <dl v-else-if="name === 'Descriptions'" class="grid grid-cols-2 gap-2 text-sm"><dt class="text-muted-foreground">状态</dt><dd>已完成</dd><dt class="text-muted-foreground">负责人</dt><dd>林晓</dd></dl>
  <Card v-else-if="name === 'Card' || name === 'Statistic'"><CardHeader><CardTitle>{{ name === 'Statistic' ? '¥128,430' : '卡片标题' }}</CardTitle><CardDescription>{{ name === 'Statistic' ? '本月收入' : '真实 shadcn Card 结构' }}</CardDescription></CardHeader><CardContent>{{ name === 'Statistic' ? '较上月增长 12.4%' : '真实 shadcn Card 结构' }}<Badge v-if="name === 'Statistic'" class="ml-2">+12.4%</Badge></CardContent></Card>
  <AvatarGroup v-else-if="name === 'Avatar' || name === 'AvatarGroup'"><Avatar><AvatarFallback>林</AvatarFallback></Avatar><Avatar><AvatarFallback>王</AvatarFallback></Avatar><AvatarGroupCount>+3</AvatarGroupCount></AvatarGroup>
  <div v-else-if="name === 'Badge' || name === 'Tag'" class="flex flex-wrap gap-2"><Badge>默认</Badge><Badge variant="secondary">次要</Badge><Badge variant="outline">标签</Badge><Badge variant="destructive">危险</Badge></div>
  <div v-else-if="name === 'Timeline'" class="space-y-3 border-l pl-4 text-sm"><p>创建项目</p><p>邀请团队</p><p>完成发布</p></div>
  <Calendar v-else-if="name === 'Calendar'" mode="single" />
  <AspectRatio v-else-if="name === 'Image'" :ratio="16 / 9" class="grid place-items-center rounded-lg bg-muted"><Icon name="image" /></AspectRatio>
  <Carousel v-else-if="name === 'Carousel'"><CarouselContent><CarouselItem><Card><CardContent class="p-6">第一张卡片</CardContent></Card></CarouselItem><CarouselItem><Card><CardContent class="p-6">第二张卡片</CardContent></Card></CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>
  <Empty v-else-if="name === 'Empty'"><EmptyHeader><EmptyMedia variant="icon"><Icon name="inbox" /></EmptyMedia><EmptyTitle>暂无内容</EmptyTitle><EmptyDescription>当前没有可展示的数据。</EmptyDescription></EmptyHeader></Empty>
  <TooltipProvider v-else-if="name === 'Tooltip'"><Tooltip><TooltipTrigger as-child><Button variant="outline">悬停查看</Button></TooltipTrigger><TooltipContent>Tooltip 内容</TooltipContent></Tooltip></TooltipProvider>
  <Popover v-else-if="name === 'Popover'"><PopoverTrigger as-child><Button variant="outline">打开 Popover</Button></PopoverTrigger><PopoverContent>Popover 内容</PopoverContent></Popover>
  <div v-else-if="name === 'Segmented'" class="flex gap-1"><Button size="sm">日</Button><Button size="sm" variant="outline">周</Button><Button size="sm" variant="outline">月</Button></div>
  <div v-else-if="name === 'Alert'" class="grid gap-2"><Alert><Icon name="info" /><AlertTitle>提示</AlertTitle><AlertDescription>这是一条默认 Alert 消息。</AlertDescription></Alert><Alert variant="destructive"><Icon name="alert-circle" /><AlertTitle>危险</AlertTitle><AlertDescription>这是一条危险 Alert 消息。</AlertDescription></Alert><Alert><Icon name="check" /><AlertTitle>成功</AlertTitle><AlertDescription>图标组合的成功提示。</AlertDescription></Alert><Alert><Icon name="circle-help" /><AlertTitle>信息</AlertTitle><AlertDescription>图标组合的信息提示。</AlertDescription></Alert></div>
  <div v-else-if="name === 'Toast' || name === 'Notification'" class="flex gap-2"><Button variant="outline" @click="showToast('success')">成功通知</Button><Button variant="outline" @click="showToast('message')">消息通知</Button></div>
  <Dialog v-else-if="name === 'Dialog'"><DialogTrigger as-child><Button variant="outline">打开 Dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>真实 Dialog</DialogTitle><DialogDescription>由 shadcn-vue Dialog 渲染。</DialogDescription></DialogHeader><Button>确认</Button></DialogContent></Dialog>
  <Drawer v-else-if="name === 'Drawer'"><DrawerTrigger as-child><Button variant="outline">打开 Drawer</Button></DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>真实 Drawer</DrawerTitle><DrawerDescription>由 vaul-vue Drawer 渲染。</DrawerDescription></DrawerHeader><div class="p-4"><Input placeholder="抽屉中的输入" /></div></DrawerContent></Drawer>
  <Progress v-else-if="name === 'Progress'" :model-value="65" />
  <div v-else-if="name === 'Skeleton'" class="space-y-2"><Skeleton class="h-4 w-2/3" /><Skeleton class="h-4 w-1/2" /></div>
  <Spinner v-else-if="name === 'Spinner'" class="size-5" />
  <Empty v-else-if="name === 'Result'"><EmptyHeader><EmptyMedia variant="icon"><Icon name="check" /></EmptyMedia><EmptyTitle>操作成功</EmptyTitle><EmptyDescription>你的操作已完成。</EmptyDescription></EmptyHeader></Empty>
  <DropdownMenu v-else-if="name === 'Popconfirm' || name === 'Dropdown'"><DropdownMenuTrigger as-child><Button variant="outline">打开菜单</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>编辑</DropdownMenuItem><DropdownMenuItem>删除</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
  <div v-else-if="name === 'Menu'" class="rounded-lg border p-2"><Button variant="ghost" size="sm">菜单项</Button><Button variant="ghost" size="sm">另一个菜单项</Button></div>
  <Breadcrumb v-else-if="name === 'Breadcrumb'"><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#component-index">首页</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>设置</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
  <div v-else-if="name === 'Tabs'" class="grid gap-3"><Tabs default-value="one"><TabsList><TabsTrigger value="one">概览</TabsTrigger><TabsTrigger value="two">详情</TabsTrigger></TabsList><TabsContent value="one" class="pt-2 text-sm">默认 Tab 内容</TabsContent></Tabs><Tabs default-value="one"><TabsList variant="line"><TabsTrigger value="one">线性概览</TabsTrigger><TabsTrigger value="two">线性详情</TabsTrigger></TabsList></Tabs></div>
  <Pagination v-else-if="name === 'Pagination'" :items-per-page="10" :total="30" :default-page="1"><PaginationContent v-slot="{ items }"><PaginationPrevious /><template v-for="item in items" :key="item.type"><PaginationItem v-if="item.type === 'page'" :value="item.value"><PaginationLink :is-active="item.value === 1">{{ item.value }}</PaginationLink></PaginationItem></template><PaginationNext /></PaginationContent></Pagination>
  <Stepper v-else-if="name === 'Steps'" :model-value="1" class="w-full"><StepperItem v-for="(title, step) in ['完成', '进行中', '待办']" :key="title" :step="step + 1"><StepperTrigger><StepperIndicator>{{ step + 1 }}</StepperIndicator><div class="hidden sm:block"><StepperTitle>{{ title }}</StepperTitle><StepperDescription>步骤说明</StepperDescription></div></StepperTrigger><StepperSeparator v-if="step < 2" /></StepperItem></Stepper>
  <div v-else-if="name === 'Anchor' || name === 'BackTop' || name === 'Affix'" class="flex items-center gap-2"><a href="#component-index" class="text-sm text-primary underline">返回索引</a><Button size="sm" variant="outline">固定操作</Button></div>
  <div v-else-if="name === 'Navbar'" class="flex items-center justify-between rounded-lg border p-3"><span class="font-medium">导航栏</span><Button size="sm">操作</Button></div>
  <div v-else-if="name === 'Sidebar'" class="h-64 overflow-hidden rounded-lg border"><SidebarProvider class="min-h-0 h-full"><Sidebar collapsible="none" class="h-full"><SidebarContent><SidebarGroup><SidebarGroupLabel>工作区</SidebarGroupLabel><SidebarGroupContent><SidebarMenu><SidebarMenuItem><SidebarMenuButton>概览</SidebarMenuButton></SidebarMenuItem><SidebarMenuItem><SidebarMenuButton>设置</SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent></Sidebar></SidebarProvider></div>
  <Command v-else-if="name === 'CommandPalette'" class="rounded-lg border"><CommandInput placeholder="搜索命令..." /><CommandList><CommandEmpty>没有结果</CommandEmpty><CommandGroup heading="命令"><CommandItem value="dashboard">打开仪表盘</CommandItem><CommandItem value="settings">打开设置</CommandItem></CommandGroup></CommandList></Command>
  <div v-else-if="name === 'Grid' || name === 'Stack' || name === 'Layout' || name === 'Container'" class="grid grid-cols-3 gap-2"><div v-for="cell in 3" :key="cell" class="h-8 rounded bg-muted" /></div>
  <AspectRatio v-else-if="name === 'AspectRatio'" :ratio="16 / 9" class="grid place-items-center rounded-lg bg-muted">16:9</AspectRatio>
  <ResizablePanelGroup v-else-if="name === 'Resizable'" direction="horizontal" class="min-h-20 rounded-lg border"><ResizablePanel :default-size="50"><div class="grid h-full place-items-center">左</div></ResizablePanel><ResizableHandle /><ResizablePanel :default-size="50"><div class="grid h-full place-items-center">右</div></ResizablePanel></ResizablePanelGroup>
  <ScrollArea v-else-if="name === 'ScrollArea'" class="h-24 rounded border p-3"><p class="text-sm">ScrollArea 内容</p><p class="text-sm">滚动查看更多内容</p></ScrollArea>
  <Accordion v-else-if="name === 'Accordion'" type="single" collapsible><AccordionItem value="one"><AccordionTrigger>Accordion 项目</AccordionTrigger><AccordionContent>可展开的内容。</AccordionContent></AccordionItem></Accordion>
  <Badge v-else-if="name === 'ThemeProvider'" variant="outline">当前主题由 ThemeProvider 管理</Badge>
  <Button v-else-if="name === 'FloatButton'" size="icon" class="rounded-full"><Icon name="plus" /></Button>
  <Kbd v-else-if="name === 'Kbd'">⌘ K</Kbd>
  <Separator v-else-if="name === 'Divider'" />
  <a v-else-if="name === 'Link'" href="#component-Link" class="text-primary underline">链接组件示例</a>
  <div v-else class="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">组合示例：使用多个 shadcn primitives 构成 {{ name }}。</div>
</template>
