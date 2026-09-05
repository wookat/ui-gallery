<script lang="ts">
  import {
    CalendarDays,
    Check,
    ChevronDown,
    Eye,
    Info,
    Minus,
    Plus,
    Search,
    Star,
    Upload,
    X,
  } from "@lucide/svelte"
  import * as Calendar from "$lib/components/ui/calendar"
  import * as Checkbox from "$lib/components/ui/checkbox"
  import * as Command from "$lib/components/ui/command"
  import * as Field from "$lib/components/ui/field"
  import * as InputGroup from "$lib/components/ui/input-group"
  import * as InputOTP from "$lib/components/ui/input-otp"
  import * as Popover from "$lib/components/ui/popover"
  import * as RadioGroup from "$lib/components/ui/radio-group"
  import * as Select from "$lib/components/ui/select"
  import * as Slider from "$lib/components/ui/slider"
  import * as Switch from "$lib/components/ui/switch"
  import * as Toggle from "$lib/components/ui/toggle"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import * as Badge from "$lib/components/ui/badge"
  import * as Item from "$lib/components/ui/item"
  import * as RangeCalendar from "$lib/components/ui/range-calendar"
  import { Button } from "$lib/components/ui/button"
  import { Separator } from "$lib/components/ui/separator"

  let { name }: { name: string } = $props()
  let checked = $state(false)
  let rating = $state(3)
  let range = $state([20, 60])
  let selected = $state("one")
  let tags = $state(["设计", "重要"])
</script>

{#if name === "Input" || name === "NumberInput"}
  <div class="grid gap-3 sm:grid-cols-2">
    <InputGroup.Root
      ><InputGroup.Text><Search /></InputGroup.Text><InputGroup.Input
        placeholder="搜索内容"
      /><InputGroup.Button aria-label="清除"><X /></InputGroup.Button></InputGroup.Root
    >
    <InputGroup.Root
      ><InputGroup.Text>¥</InputGroup.Text><InputGroup.Input
        type="number"
        value="128"
      /><InputGroup.Button aria-label="增加"><Plus /></InputGroup.Button></InputGroup.Root
    >
    <InputGroup.Root
      ><InputGroup.Input type="password" value="secret" /><InputGroup.Button aria-label="显示密码"
        ><Eye /></InputGroup.Button
      ></InputGroup.Root
    >
    <InputGroup.Input aria-invalid="true" placeholder="错误状态" />
  </div>
{:else if name === "Textarea"}
  <textarea
    class="min-h-24 w-full rounded-md border bg-background p-3 text-sm"
    placeholder="输入一段说明……"
  ></textarea>
{:else if name === "Select" || name === "MultiSelect" || name === "Combobox" || name === "Autocomplete"}
  <div class="flex flex-wrap gap-3">
    <Select.Root type="single"
      ><Select.Trigger class="w-40"><span>选择状态</span></Select.Trigger><Select.Content
        ><Select.Item value="one">进行中</Select.Item><Select.Item value="two">已完成</Select.Item
        ></Select.Content
      ></Select.Root
    >
    <Popover.Root
      ><Popover.Trigger><Button variant="outline">组合搜索 <ChevronDown /></Button></Popover.Trigger
      ><Popover.Content class="p-0"
        ><Command.Root
          ><Command.Input placeholder="搜索选项" /><Command.List
            ><Command.Empty>没有结果</Command.Empty><Command.Group heading="推荐"
              ><Command.Item>设计</Command.Item><Command.Item>研发</Command.Item></Command.Group
            ></Command.List
          ></Command.Root
        ></Popover.Content
      ></Popover.Root
    >
  </div>
{:else if name === "NativeSelect"}
  <select class="h-9 w-full rounded-md border bg-background px-3 text-sm"
    ><option>选择一个选项</option><option>选项一</option><option>选项二</option></select
  >
{:else if name === "Checkbox"}
  <div class="flex flex-wrap items-center gap-4">
    <label class="flex items-center gap-2 text-sm"><Checkbox.Root bind:checked />接受通知</label>
    <label class="flex items-center gap-2 text-sm"
      ><Checkbox.Root checked indeterminate />半选状态</label
    >
    <label class="flex items-center gap-2 text-sm"><Checkbox.Root disabled />禁用</label>
  </div>
{:else if name === "Radio"}
  <RadioGroup.Root bind:value={selected} class="flex flex-wrap gap-4">
    <label class="inline-flex items-center gap-2 text-sm whitespace-nowrap"
      ><RadioGroup.Item value="one" />邮件</label
    >
    <label class="inline-flex items-center gap-2 text-sm whitespace-nowrap"
      ><RadioGroup.Item value="two" />推送</label
    >
  </RadioGroup.Root>
{:else if name === "Switch"}
  <div class="flex flex-wrap gap-4">
    <label class="inline-flex items-center gap-2 text-sm whitespace-nowrap"
      ><Switch.Root size="sm" />紧凑</label
    >
    <label class="inline-flex items-center gap-2 text-sm whitespace-nowrap"
      ><Switch.Root />默认</label
    >
    <label class="inline-flex items-center gap-2 text-sm whitespace-nowrap"
      ><Switch.Root disabled />禁用</label
    >
  </div>
{:else if name === "Slider"}
  <div class="space-y-4">
    <Slider.Root type="single" value={50} min={0} max={100} /><Slider.Root
      type="multiple"
      bind:value={range}
      min={0}
      max={100}
    />
    <div class="w-10">
      <Slider.Root type="single" orientation="vertical" value={40} min={0} max={100} />
    </div>
  </div>
{:else if name === "Rating"}
  <div class="flex gap-1">
    {#each Array(5) as _, i}<Toggle.Root
        variant="default"
        size="sm"
        pressed={i < rating}
        onclick={() => (rating = i + 1)}
        aria-label={`评分 ${i + 1}`}
        ><Star class={i < rating ? "fill-amber-400 text-amber-400" : ""} /></Toggle.Root
      >{/each}
  </div>
{:else if name === "DatePicker"}
  <Popover.Root
    ><Popover.Trigger><Button variant="outline"><CalendarDays />选择日期</Button></Popover.Trigger
    ><Popover.Content class="w-auto p-0"><Calendar.Calendar type="single" /></Popover.Content
    ></Popover.Root
  >
{:else if name === "DateRangePicker"}
  <Popover.Root
    ><Popover.Trigger><Button variant="outline">日期范围</Button></Popover.Trigger><Popover.Content
      class="w-auto p-0"><RangeCalendar.RangeCalendar /></Popover.Content
    ></Popover.Root
  >
{:else if name === "TimePicker"}
  <input type="time" value="09:30" class="h-9 rounded-md border bg-background px-3 text-sm" />
{:else if name === "ColorPicker"}
  <div class="flex items-center gap-3 text-sm">
    <input
      type="color"
      value="#2563eb"
      class="size-10 rounded border"
    />原生颜色选择器（库中未提供）
  </div>
{:else if name === "Upload"}
  <div class="space-y-3">
    <div class="rounded-lg border-2 border-dashed p-6 text-center text-sm">
      <Upload class="mx-auto mb-2" />拖拽文件到这里，或点击上传
    </div>
    <Item.Root
      ><Item.Media variant="icon"><Check /></Item.Media><Item.Content
        ><Item.Title>设计稿.pdf</Item.Title><Item.Description>1.2 MB · 已上传</Item.Description
        ></Item.Content
      ><Item.Actions><Button size="icon-sm" variant="ghost"><X /></Button></Item.Actions></Item.Root
    >
  </div>
{:else if name === "Cascader"}
  <Popover.Root
    ><Popover.Trigger><Button variant="outline">选择层级 <ChevronDown /></Button></Popover.Trigger
    ><Popover.Content class="w-48 p-2"
      ><button class="flex w-full justify-between rounded p-2 text-sm hover:bg-muted"
        >华东 <ChevronDown /></button
      ><button class="flex w-full justify-between rounded p-2 text-sm hover:bg-muted"
        >华南 <ChevronDown /></button
      ></Popover.Content
    ></Popover.Root
  >
{:else if name === "PinInput"}
  <InputOTP.Root maxlength={6} value="123456" aria-label="六位验证码" />
{:else if name === "Form"}
  <Field.Set class="space-y-4"
    ><Field.Group
      ><Field.Label>项目名称 <span class="text-destructive">*</span></Field.Label><Field.Content
        ><InputGroup.Input placeholder="必填字段" /></Field.Content
      ><Field.Description>垂直布局的帮助文案。</Field.Description></Field.Group
    ><Separator /><Field.Group class="sm:flex sm:items-center"
      ><Field.Label class="sm:w-28">负责人</Field.Label><Field.Content
        ><InputGroup.Input placeholder="水平布局" /></Field.Content
      ></Field.Group
    ><Field.Group class="sm:flex sm:items-center"
      ><Field.Label class="sm:w-28">状态</Field.Label><Field.Content
        ><Button variant="outline">内联布局</Button></Field.Content
      ></Field.Group
    ></Field.Set
  >
{:else}
  <div class="rounded-lg border p-4 text-sm">
    <Tooltip.Root
      ><Tooltip.Trigger><Info class="inline size-4" /></Tooltip.Trigger><Tooltip.Content
        >字段级说明</Tooltip.Content
      ></Tooltip.Root
    > 组合表单控件演示
  </div>
{/if}
