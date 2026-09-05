<script setup lang="ts">
import { VisArea, VisAxis, VisXYContainer } from '@unovis/vue'
import Icon from '@/components/Icon.vue'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Attachment, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } from '@/components/ui/attachment'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bubble, BubbleContent, BubbleGroup } from '@/components/ui/bubble'
import { Button } from '@/components/ui/button'
import { ChartContainer } from '@/components/ui/chart'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Label } from '@/components/ui/label'
import { Marker, MarkerContent, MarkerIcon } from '@/components/ui/marker'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { Message, MessageAvatar, MessageContent, MessageGroup } from '@/components/ui/message'
import { MessageScroller, MessageScrollerContent, MessageScrollerProvider, MessageScrollerViewport } from '@/components/ui/message-scroller'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Questionnaire, QuestionnaireChoice, QuestionnaireChoices, QuestionnaireDescription, QuestionnaireItem, QuestionnaireTitle } from '@/components/ui/questionnaire'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'
import { Stepper, StepperIndicator, StepperItem, StepperTrigger } from '@/components/ui/stepper'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemText } from '@/components/ui/tags-input'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const extras = ['Menubar', 'ContextMenu', 'HoverCard', 'NavigationMenu', 'Collapsible', 'Item', 'InputGroup', 'Field', 'Marker', 'Bubble', 'Message', 'MessageScroller', 'Attachment', 'Questionnaire', 'NativeSelect', 'Toggle', 'ToggleGroup', 'TagsInput', 'InputOTP', 'RangeCalendar', 'Sheet', 'AlertDialog', 'Chart', 'Sidebar', 'Label', 'Stepper']
const chartData = [{ x: 0, y: 12 }, { x: 1, y: 18 }, { x: 2, y: 15 }]
const chartConfig = { value: { label: 'Value', color: 'var(--primary)' } }
</script>

<template>
  <section class="space-y-4">
    <div><h2 class="text-2xl font-semibold">Registry extras</h2><p class="text-sm text-muted-foreground">contract 未列出的官方 registry 组件，均提供真实 shadcn-vue 演示。</p></div>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div v-for="name in extras" :key="name" class="min-w-0 rounded-lg border p-4">
        <h3 class="mb-3 text-sm font-medium">{{ name }}</h3>
        <Menubar v-if="name === 'Menubar'"><MenubarMenu><MenubarTrigger>菜单</MenubarTrigger><MenubarContent><MenubarItem>操作</MenubarItem></MenubarContent></MenubarMenu></Menubar>
        <ContextMenu v-else-if="name === 'ContextMenu'"><ContextMenuTrigger class="rounded border p-3 text-sm">右键此处</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>操作</ContextMenuItem></ContextMenuContent></ContextMenu>
        <HoverCard v-else-if="name === 'HoverCard'"><HoverCardTrigger as-child><Button variant="link">悬停查看</Button></HoverCardTrigger><HoverCardContent>HoverCard 内容</HoverCardContent></HoverCard>
        <NavigationMenu v-else-if="name === 'NavigationMenu'"><NavigationMenuList><NavigationMenuItem><NavigationMenuLink href="#component-index">导航</NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu>
        <Collapsible v-else-if="name === 'Collapsible'"><CollapsibleTrigger as-child><Button variant="outline">展开</Button></CollapsibleTrigger><CollapsibleContent class="pt-2 text-sm">Collapsible 内容</CollapsibleContent></Collapsible>
        <Item v-else-if="name === 'Item'"><ItemContent><ItemTitle>Item 标题</ItemTitle><ItemDescription>Item 描述</ItemDescription></ItemContent></Item>
        <InputGroup v-else-if="name === 'InputGroup'"><InputGroupAddon><Icon name="search" /></InputGroupAddon><InputGroupInput placeholder="组合输入框" /></InputGroup>
        <Field v-else-if="name === 'Field'"><FieldLabel>字段标签</FieldLabel><FieldContent><Input placeholder="字段值" /></FieldContent></Field>
        <Marker v-else-if="name === 'Marker'"><MarkerIcon><Icon name="check" /></MarkerIcon><MarkerContent>Marker 内容</MarkerContent></Marker>
        <BubbleGroup v-else-if="name === 'Bubble'"><Bubble><BubbleContent>Bubble 消息</BubbleContent></Bubble></BubbleGroup>
        <MessageGroup v-else-if="name === 'Message'"><Message align="start"><MessageAvatar><Avatar><AvatarFallback>AI</AvatarFallback></Avatar></MessageAvatar><MessageContent>Message 内容</MessageContent></Message></MessageGroup>
        <MessageScrollerProvider v-else-if="name === 'MessageScroller'"><MessageScroller class="h-16"><MessageScrollerViewport><MessageScrollerContent><p class="p-2 text-xs">MessageScroller 内容</p></MessageScrollerContent></MessageScrollerViewport></MessageScroller></MessageScrollerProvider>
        <Attachment v-else-if="name === 'Attachment'"><AttachmentMedia><Icon name="file" /></AttachmentMedia><AttachmentContent><AttachmentTitle>报告.pdf</AttachmentTitle><AttachmentDescription>128 KB · 已上传</AttachmentDescription></AttachmentContent></Attachment>
        <Questionnaire v-else-if="name === 'Questionnaire'" :items="[{ name: 'choice' }]"><QuestionnaireItem name="choice"><QuestionnaireTitle>选择一个选项</QuestionnaireTitle><QuestionnaireDescription>Questionnaire 组件示例</QuestionnaireDescription><QuestionnaireChoices><QuestionnaireChoice value="one">选项一</QuestionnaireChoice></QuestionnaireChoices></QuestionnaireItem></Questionnaire>
        <NativeSelect v-else-if="name === 'NativeSelect'" class="w-full"><NativeSelectOption value="one">选项一</NativeSelectOption><NativeSelectOption value="two">选项二</NativeSelectOption></NativeSelect>
        <Toggle v-else-if="name === 'Toggle'">粗体</Toggle>
        <ToggleGroup v-else-if="name === 'ToggleGroup'" type="single" default-value="center"><ToggleGroupItem value="left">左</ToggleGroupItem><ToggleGroupItem value="center">中</ToggleGroupItem><ToggleGroupItem value="right">右</ToggleGroupItem></ToggleGroup>
        <TagsInput v-else-if="name === 'TagsInput'" :model-value="['标签']"><TagsInputItem value="标签"><TagsInputItemText /></TagsInputItem><TagsInputInput placeholder="添加标签..." /></TagsInput>
        <InputOTP v-else-if="name === 'InputOTP'" :maxlength="4"><InputOTPGroup><InputOTPSlot v-for="slot in 4" :key="slot" :index="slot - 1" /></InputOTPGroup></InputOTP>
        <RangeCalendar v-else-if="name === 'RangeCalendar'" />
        <Sheet v-else-if="name === 'Sheet'"><SheetTrigger as-child><Button variant="outline">打开 Sheet</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Sheet 内容</SheetTitle></SheetHeader><p class="p-4 text-sm">侧边面板示例。</p></SheetContent></Sheet>
        <AlertDialog v-else-if="name === 'AlertDialog'"><AlertDialogTrigger as-child><Button variant="outline">打开确认框</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>确认操作</AlertDialogTitle><AlertDialogDescription>这是一个 AlertDialog。</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction>确认</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        <ChartContainer v-else-if="name === 'Chart'" :config="chartConfig" class="h-72 overflow-hidden"><VisXYContainer :data="chartData" :height="240"><VisArea :x="(d: any) => d.x" :y="(d: any) => d.y" color="var(--primary)" opacity="0.25" /><VisAxis type="x" /><VisAxis type="y" /></VisXYContainer></ChartContainer>
        <SidebarProvider v-else-if="name === 'Sidebar'" class="h-64 overflow-hidden"><Sidebar collapsible="none"><SidebarContent><SidebarGroup><SidebarGroupLabel>工作区</SidebarGroupLabel><SidebarGroupContent><SidebarMenu><SidebarMenuItem><SidebarMenuButton>侧边栏项目</SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent></Sidebar></SidebarProvider>
        <Label v-else-if="name === 'Label'">Label 标签</Label>
        <Stepper v-else-if="name === 'Stepper'" :model-value="1"><StepperItem :step="1"><StepperTrigger><StepperIndicator>1</StepperIndicator>开始</StepperTrigger></StepperItem></Stepper>
      </div>
    </div>
  </section>
</template>
