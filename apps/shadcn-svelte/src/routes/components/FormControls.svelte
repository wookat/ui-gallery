<script lang="ts">
  import Icon from "$lib/icons/Icon.svelte"
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
  import { Input } from "$lib/components/ui/input"

  let { name }: { name: string } = $props()
  let checked = $state(false)
  let rating = $state(3)
  let range = $state([20, 60])
  let selected = $state("one")
  let tags = $state(["设计", "重要"])
  let selectedMembers = $state(["设计"])
  let autocomplete = $state("")
</script>

{#if name === "Input" || name === "NumberInput"}
  <div class="grid gap-3 sm:grid-cols-2">
    <InputGroup.Root
      ><InputGroup.Text><Icon name="search" size={16} /></InputGroup.Text><InputGroup.Input
        placeholder="搜索内容"
      /><InputGroup.Button aria-label="清除"><Icon name="x" size={16} /></InputGroup.Button
      ></InputGroup.Root
    >
    <InputGroup.Root
      ><InputGroup.Text>¥</InputGroup.Text><InputGroup.Input
        type="number"
        value="128"
      /><InputGroup.Button aria-label="增加"><Icon name="plus" size={16} /></InputGroup.Button
      ></InputGroup.Root
    >
    <InputGroup.Root
      ><InputGroup.Input type="password" value="secret" /><InputGroup.Button aria-label="显示密码"
        ><Icon name="eye" size={16} /></InputGroup.Button
      ></InputGroup.Root
    >
    <Input aria-invalid="true" placeholder="错误状态" />
  </div>
{:else if name === "Textarea"}
  <textarea
    class="min-h-24 w-full rounded-md border bg-background p-3 text-sm"
    placeholder="输入一段说明……"
  ></textarea>
{:else if name === "Select"}
  <Select.Root type="single"
    ><Select.Trigger class="w-40"><span>选择状态</span></Select.Trigger><Select.Content
      ><Select.Item value="one">进行中</Select.Item><Select.Item value="two">已完成</Select.Item
      ></Select.Content
    ></Select.Root
  >
{:else if name === "MultiSelect"}
  <div class="space-y-3">
    <Popover.Root
      ><Popover.Trigger
        ><Button variant="outline">选择成员 <Icon name="chevron-down" size={16} /></Button
        ></Popover.Trigger
      ><Popover.Content class="w-56 p-0"
        ><Command.Root
          ><Command.Input placeholder="搜索成员" /><Command.List
            ><Command.Empty>没有结果</Command.Empty><Command.Group
              >{#each ["设计", "产品", "研发"] as member}<Command.Item
                  onclick={() =>
                    (selectedMembers = selectedMembers.includes(member)
                      ? selectedMembers.filter((item) => item !== member)
                      : [...selectedMembers, member])}
                  ><Checkbox.Root
                    checked={selectedMembers.includes(member)}
                    class="mr-2"
                  />{member}</Command.Item
                >{/each}</Command.Group
            ></Command.List
          ></Command.Root
        ></Popover.Content
      ></Popover.Root
    >
    <div class="flex flex-wrap gap-2">
      {#each selectedMembers as member}<Badge.Root variant="secondary">{member}</Badge.Root>{/each}
    </div>
  </div>
{:else if name === "Combobox"}
  <Popover.Root
    ><Popover.Trigger
      ><Button variant="outline">选择负责人 <Icon name="chevron-down" size={16} /></Button
      ></Popover.Trigger
    ><Popover.Content class="w-56 p-0"
      ><Command.Root
        ><Command.Input placeholder="搜索负责人" /><Command.List
          ><Command.Empty>没有结果</Command.Empty><Command.Item>林晓</Command.Item><Command.Item
            >周宁</Command.Item
          ></Command.List
        ></Command.Root
      ></Popover.Content
    ></Popover.Root
  >
{:else if name === "Autocomplete"}
  <div class="space-y-2">
    <input
      bind:value={autocomplete}
      class="h-10 w-full max-w-sm rounded-md border bg-background px-3 text-sm"
      placeholder="输入关键词"
    />
    {#if autocomplete}
      <Command.Root class="max-w-sm rounded-md border"
        ><Command.List
          ><Command.Item>推荐：{autocomplete} 设计方案</Command.Item><Command.Item
            >推荐：{autocomplete} 项目</Command.Item
          ></Command.List
        ></Command.Root
      >
    {/if}
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
        ><Icon
          name="star"
          size={16}
          class={i < rating ? "fill-amber-400 text-amber-400" : ""}
        /></Toggle.Root
      >{/each}
  </div>
{:else if name === "DatePicker"}
  <Popover.Root
    ><Popover.Trigger
      ><Button variant="outline"><Icon name="calendar" size={16} />选择日期</Button
      ></Popover.Trigger
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
      <Icon name="upload" size={24} class="mx-auto mb-2" />拖拽文件到这里，或点击上传
    </div>
    <Item.Root
      ><Item.Media variant="icon"><Icon name="check" size={16} /></Item.Media><Item.Content
        ><Item.Title>设计稿.pdf</Item.Title><Item.Description>1.2 MB · 已上传</Item.Description
        ></Item.Content
      ><Item.Actions
        ><Button size="icon-sm" variant="ghost"><Icon name="x" size={16} /></Button></Item.Actions
      ></Item.Root
    >
  </div>
{:else if name === "Cascader"}
  <Popover.Root
    ><Popover.Trigger
      ><Button variant="outline">选择层级 <Icon name="chevron-down" size={16} /></Button
      ></Popover.Trigger
    ><Popover.Content class="w-48 p-2"
      ><button class="flex w-full justify-between rounded p-2 text-sm hover:bg-muted"
        >华东 <Icon name="chevron-down" size={16} /></button
      ><button class="flex w-full justify-between rounded p-2 text-sm hover:bg-muted"
        >华南 <Icon name="chevron-down" size={16} /></button
      ></Popover.Content
    ></Popover.Root
  >
{:else if name === "PinInput"}
  <InputOTP.Root maxlength={6} value="123456" aria-label="六位验证码">
    {#snippet children({ cells })}
      <InputOTP.Group>
        {#each cells.slice(0, 3) as cell (cell)}<InputOTP.Slot {cell} />{/each}
      </InputOTP.Group>
      <InputOTP.Separator />
      <InputOTP.Group>
        {#each cells.slice(3, 6) as cell (cell)}<InputOTP.Slot {cell} />{/each}
      </InputOTP.Group>
    {/snippet}
  </InputOTP.Root>
{:else if name === "Form"}
  <Field.Set>
    <Field.Group>
      <Field.Field>
        <Field.Label>项目名称 <span class="text-destructive">*</span></Field.Label>
        <Input placeholder="必填字段" />
        <Field.Description>垂直布局的帮助文案。</Field.Description>
      </Field.Field>
      <Field.Separator />
      <Field.Field orientation="horizontal">
        <Field.Label class="sm:w-28">负责人</Field.Label>
        <Input placeholder="水平布局" />
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Field.Label class="sm:w-28">状态</Field.Label>
        <Button variant="outline">内联布局</Button>
      </Field.Field>
    </Field.Group>
  </Field.Set>
{:else}
  <div class="rounded-lg border p-4 text-sm">
    <Tooltip.Root
      ><Tooltip.Trigger><Icon name="info" size={16} class="inline" /></Tooltip.Trigger
      ><Tooltip.Content>字段级说明</Tooltip.Content></Tooltip.Root
    > 组合表单控件演示
  </div>
{/if}
