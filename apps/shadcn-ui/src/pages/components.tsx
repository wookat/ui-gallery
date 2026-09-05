import { Icon } from "@ui-gallery/icons-react"
import contract from "@ui-gallery/spec/contract.json"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DirectionProvider } from "@/components/ui/direction"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item"
import { Kbd } from "@/components/ui/kbd"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { Message, MessageAvatar, MessageContent, MessageGroup } from "@/components/ui/message"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { coverage } from "../coverage"
import { PageHeader } from "./shared"

const registryExtras = ["Menubar", "ContextMenu", "HoverCard", "NavigationMenu", "Collapsible", "Item", "InputGroup", "Field", "Marker", "Direction", "Bubble", "Message", "Attachment", "Questionnaire"]

function BasicControls() {
  return <div className="grid gap-3"><div className="flex flex-wrap gap-2"><Button>默认</Button><Button variant="secondary">次要</Button><Button variant="outline">描边</Button><Button variant="ghost">幽灵</Button><Button variant="destructive">危险</Button></div><div className="flex flex-wrap gap-2"><Button size="sm">小号</Button><Button>默认尺寸</Button><Button size="lg">大号</Button><Button disabled>禁用</Button><Button><Icon name="loader" className="animate-spin" />加载</Button></div></div>
}

function Demo({ name }: { name: string }) {
  if (coverage[name] === "missing") return <Empty className="border-0 py-4"><EmptyHeader><EmptyMedia variant="icon"><Icon name="circle-help" /></EmptyMedia><EmptyTitle>shadcn 无此组件</EmptyTitle><EmptyDescription>该 contract 项目已明确标记为 missing。</EmptyDescription></EmptyHeader></Empty>
  if (name === "Typography" || name === "Code") return <div className="space-y-2"><h3 className="text-2xl font-semibold">标题文字</h3><p className="text-sm text-muted-foreground">正文、辅助说明与代码样式。</p><code className="rounded bg-muted px-2 py-1 text-xs">const ui = "shadcn"</code></div>
  if (name === "Button" || name === "ButtonGroup" || name === "IconButton") return name === "ButtonGroup" ? <ButtonGroup><Button>保存</Button><Button variant="outline">取消</Button></ButtonGroup> : <BasicControls />
  if (["Input", "NumberInput", "Autocomplete"].includes(name)) return <Input type={name === "NumberInput" ? "number" : "text"} placeholder="输入内容..." disabled={name === "NumberInput"} />
  if (name === "InputGroup") return <InputGroup><InputGroupAddon><Icon name="search" /></InputGroupAddon><InputGroupInput placeholder="组合输入框" /></InputGroup>
  if (name === "Textarea") return <Textarea placeholder="多行文本..." />
  if (["Select", "MultiSelect", "Cascader"].includes(name)) return <Select defaultValue="one"><SelectTrigger><SelectValue placeholder="选择一个选项" /></SelectTrigger><SelectContent><SelectItem value="one">选项一</SelectItem><SelectItem value="two">选项二</SelectItem></SelectContent></Select>
  if (name === "Combobox") return <Combobox items={[{ value: "one", label: "选项一" }, { value: "two", label: "选项二" }]}><ComboboxTrigger><ComboboxValue placeholder="组合框" /></ComboboxTrigger><ComboboxContent><ComboboxInput /><ComboboxList><ComboboxItem value="one">选项一</ComboboxItem><ComboboxItem value="two">选项二</ComboboxItem></ComboboxList></ComboboxContent></Combobox>
  if (name === "Checkbox") return <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked />已选择</label>
  if (name === "Radio") return <RadioGroup defaultValue="one"><label className="flex items-center gap-2 text-sm"><RadioGroupItem value="one" />选项一</label><label className="flex items-center gap-2 text-sm"><RadioGroupItem value="two" />选项二</label></RadioGroup>
  if (name === "Switch") return <Switch defaultChecked />
  if (name === "Slider") return <Slider defaultValue={[60]} />
  if (name === "Rating") return <ToggleGroup type="multiple" defaultValue={["1", "2", "3", "4"]}>{["1", "2", "3", "4", "5"].map((value) => <ToggleGroupItem value={value} key={value}>★</ToggleGroupItem>)}</ToggleGroup>
  if (name === "DatePicker" || name === "TimePicker" || name === "DateRangePicker") return <Popover><PopoverTrigger asChild><Button variant="outline"><Icon name="calendar" />选择日期</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" /></PopoverContent></Popover>
  if (name === "Upload") return <Button variant="outline"><Icon name="upload" />上传文件</Button>
  if (name === "PinInput") return <InputOTP maxLength={6}><InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((index) => <InputOTPSlot index={index} key={index} />)}</InputOTPGroup></InputOTP>
  if (name === "Form") return <Field><FieldLabel>字段标签</FieldLabel><FieldContent><Input placeholder="字段值" /></FieldContent></Field>
  if (["Table", "DataGrid", "List"].includes(name)) return <Table><TableHeader><TableRow><TableHead>名称</TableHead><TableHead>状态</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>ORD-2401</TableCell><TableCell><Badge>已支付</Badge></TableCell></TableRow><TableRow><TableCell>ORD-2402</TableCell><TableCell><Badge variant="secondary">处理中</Badge></TableCell></TableRow></TableBody></Table>
  if (name === "Descriptions") return <dl className="grid grid-cols-2 gap-2 text-sm"><dt className="text-muted-foreground">状态</dt><dd>已完成</dd><dt className="text-muted-foreground">负责人</dt><dd>林晓</dd></dl>
  if (["Card", "Statistic"].includes(name)) return <Card><CardHeader><CardTitle>{name === "Statistic" ? "¥128,400" : "卡片标题"}</CardTitle><CardDescription>CardHeader / CardContent / CardFooter</CardDescription></CardHeader><CardContent>真实 shadcn Card 结构</CardContent></Card>
  if (name === "Avatar" || name === "AvatarGroup") return <AvatarGroup><Avatar><AvatarFallback>林</AvatarFallback></Avatar><Avatar><AvatarFallback>王</AvatarFallback></Avatar><AvatarGroupCount>+3</AvatarGroupCount></AvatarGroup>
  if (["Badge", "Tag", "Segmented"].includes(name)) return <div className="flex flex-wrap gap-2"><Badge>默认</Badge><Badge variant="secondary">次要</Badge><Badge variant="outline">标签</Badge></div>
  if (name === "Timeline") return <div className="space-y-3 border-l pl-4 text-sm"><p>创建项目</p><p>邀请团队</p><p>完成发布</p></div>
  if (name === "Calendar") return <Calendar mode="single" />
  if (name === "Image") return <AspectRatio ratio={16 / 9} className="grid place-items-center rounded-lg bg-muted"><Icon name="image" /></AspectRatio>
  if (name === "Carousel") return <Carousel><CarouselContent><CarouselItem><Card><CardContent className="p-6">第一张卡片</CardContent></Card></CarouselItem><CarouselItem><Card><CardContent className="p-6">第二张卡片</CardContent></Card></CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel>
  if (name === "Alert") return <Alert><Icon name="info" /><AlertTitle>提示</AlertTitle><AlertDescription>这是一条 Alert 消息。</AlertDescription></Alert>
  if (name === "Toast" || name === "Notification") return <Button variant="outline">触发通知</Button>
  if (name === "Dialog") return <Dialog><DialogTrigger asChild><Button variant="outline">打开 Dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>真实 Dialog</DialogTitle><DialogDescription>由 shadcn Dialog 渲染。</DialogDescription></DialogHeader><Button>确认</Button></DialogContent></Dialog>
  if (name === "Drawer") return <Button variant="outline">打开 Drawer</Button>
  if (name === "Progress") return <Progress value={65} />
  if (name === "Skeleton") return <div className="space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/2" /></div>
  if (name === "Spinner") return <Icon name="loader" className="animate-spin" />
  if (name === "Result") return <Empty className="border-0 py-4"><EmptyHeader><EmptyMedia variant="icon"><Icon name="check" /></EmptyMedia><EmptyTitle>操作成功</EmptyTitle></EmptyHeader></Empty>
  if (name === "Popconfirm" || name === "Dropdown") return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">打开菜单</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>编辑</DropdownMenuItem><DropdownMenuItem>删除</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
  if (name === "Breadcrumb") return <nav className="text-sm text-muted-foreground">首页 / 设置 / 账户</nav>
  if (name === "Tabs") return <Tabs defaultValue="one"><TabsList><TabsTrigger value="one">概览</TabsTrigger><TabsTrigger value="two">详情</TabsTrigger></TabsList><TabsContent value="one">Tab 内容</TabsContent></Tabs>
  if (name === "Pagination") return <ButtonGroup><Button size="sm" variant="outline">上一页</Button><Button size="sm">1</Button><Button size="sm" variant="outline">下一页</Button></ButtonGroup>
  if (name === "Steps") return <div className="flex gap-2"><Badge>1 已完成</Badge><Badge variant="secondary">2 进行中</Badge><Badge variant="outline">3 待办</Badge></div>
  if (name === "Navbar") return <div className="flex items-center justify-between rounded-lg border p-3"><span className="font-medium">导航栏</span><Button size="sm">操作</Button></div>
  if (name === "Sidebar") return <div className="rounded-lg border p-3 text-sm">Sidebar 区块</div>
  if (name === "CommandPalette") return <InputGroup><InputGroupAddon><Icon name="search" /></InputGroupAddon><InputGroupInput placeholder="搜索命令..." /></InputGroup>
  if (name === "Grid" || name === "Stack" || name === "Layout" || name === "Container") return <div className="grid grid-cols-3 gap-2"><div className="h-8 rounded bg-muted" /><div className="h-8 rounded bg-muted" /><div className="h-8 rounded bg-muted" /></div>
  if (name === "AspectRatio") return <AspectRatio ratio={16 / 9} className="grid place-items-center rounded-lg bg-muted">16:9</AspectRatio>
  if (name === "Resizable") return <ResizablePanelGroup orientation="horizontal" className="min-h-20 rounded-lg border"><ResizablePanel defaultSize={50}><div className="grid h-full place-items-center">左</div></ResizablePanel><ResizableHandle /><ResizablePanel defaultSize={50}><div className="grid h-full place-items-center">右</div></ResizablePanel></ResizablePanelGroup>
  if (name === "ScrollArea") return <ScrollArea className="h-24 rounded border p-3"><p className="text-sm">ScrollArea 内容</p><p className="text-sm">滚动查看更多内容</p></ScrollArea>
  if (name === "Accordion") return <Accordion type="single" collapsible><AccordionItem value="one"><AccordionTrigger>Accordion 项目</AccordionTrigger><AccordionContent>内容</AccordionContent></AccordionItem></Accordion>
  if (name === "ThemeProvider") return <Badge variant="outline">当前主题由 ThemeProvider 管理</Badge>
  if (name === "FloatButton") return <Button size="icon" className="rounded-full"><Icon name="plus" /></Button>
  if (name === "Kbd") return <Kbd>⌘ K</Kbd>
  if (name === "Divider") return <Separator />
  if (name === "Link") return <a href="#component-Link">链接组件示例</a>
  if (name === "Tooltip") return <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="outline">悬停查看</Button></TooltipTrigger><TooltipContent>Tooltip 内容</TooltipContent></Tooltip></TooltipProvider>
  if (name === "Popover") return <Popover><PopoverTrigger asChild><Button variant="outline">打开 Popover</Button></PopoverTrigger><PopoverContent>Popover 内容</PopoverContent></Popover>
  if (name === "Empty") return <Empty className="border-0 py-4"><EmptyHeader><EmptyMedia variant="icon"><Icon name="inbox" /></EmptyMedia><EmptyTitle>暂无内容</EmptyTitle></EmptyHeader></Empty>
  return <Card><CardContent className="p-4 text-sm text-muted-foreground">组合示例：使用多个 shadcn primitives 构成 {name}。</CardContent></Card>
}

function RegistryExtras() {
  return <section className="space-y-4"><div><h2 className="text-2xl font-semibold">Registry 补充</h2><p className="text-sm text-muted-foreground">contract 未列出的官方 registry 组件。</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{registryExtras.map((name) => <Card key={name}><CardHeader><CardTitle className="text-base">{name}</CardTitle></CardHeader><CardContent>{name === "Menubar" ? <Menubar><MenubarMenu><MenubarTrigger>菜单</MenubarTrigger><MenubarContent><MenubarItem>操作</MenubarItem></MenubarContent></MenubarMenu></Menubar> : name === "ContextMenu" ? <ContextMenu><ContextMenuTrigger className="rounded border p-3 text-sm">右键此处</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>操作</ContextMenuItem></ContextMenuContent></ContextMenu> : name === "HoverCard" ? <HoverCard><HoverCardTrigger asChild><Button variant="link">悬停</Button></HoverCardTrigger><HoverCardContent>HoverCard 内容</HoverCardContent></HoverCard> : name === "NavigationMenu" ? <NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuLink href="#component-index">导航</NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu> : name === "Collapsible" ? <Collapsible><CollapsibleTrigger asChild><Button variant="outline">展开</Button></CollapsibleTrigger><CollapsibleContent className="pt-2 text-sm">Collapsible 内容</CollapsibleContent></Collapsible> : name === "Item" ? <Item><ItemContent><ItemTitle>Item 标题</ItemTitle><ItemDescription>Item 描述</ItemDescription></ItemContent></Item> : name === "Marker" ? <Marker><MarkerIcon><Icon name="check" /></MarkerIcon><MarkerContent>Marker 内容</MarkerContent></Marker> : name === "Direction" ? <DirectionProvider dir="rtl"><Badge>RTL Direction</Badge></DirectionProvider> : name === "Bubble" ? <BubbleGroup><Bubble><BubbleContent>Bubble 消息</BubbleContent></Bubble></BubbleGroup> : name === "Message" ? <MessageGroup><Message align="start"><MessageAvatar><Avatar><AvatarFallback>AI</AvatarFallback></Avatar></MessageAvatar><MessageContent>Message 内容</MessageContent></Message></MessageGroup> : <InputGroup><InputGroupInput placeholder={`${name} 示例`} /></InputGroup>}</CardContent></Card>)}</div></section>
}

export function ComponentsPage() {
  return <div className="space-y-8"><PageHeader title="组件全集" description="官方 registry 组件、contract 覆盖与组合示例。" action={<Button asChild variant="outline"><a href="#component-index">组件索引</a></Button>} /><div id="component-index" className="flex flex-wrap gap-2">{(contract.components as string[]).map((name) => <a className="rounded-full border px-3 py-1 text-xs no-underline hover:bg-muted" href={`#component-${name}`} key={name}>{name}</a>)}</div><TooltipProvider><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{(contract.components as string[]).map((name) => <Card className="scroll-mt-20" id={`component-${name}`} key={name}><CardHeader><div className="flex items-center justify-between gap-2"><CardTitle className="text-base">{name}</CardTitle><Badge variant={coverage[name] === "missing" ? "destructive" : coverage[name] === "composed" ? "secondary" : "default"}>{coverage[name]}</Badge></div><CardDescription>default · disabled · loading · error variants</CardDescription></CardHeader><CardContent>{Demo({ name })}</CardContent></Card>)}</div></TooltipProvider><RegistryExtras /></div>
}
