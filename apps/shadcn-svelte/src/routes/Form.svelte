<script lang="ts">
  import Icon from "$lib/icons/Icon.svelte"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import * as Badge from "$lib/components/ui/badge"
  import * as Checkbox from "$lib/components/ui/checkbox"
  import * as Radio from "$lib/components/ui/radio-group"
  import * as Switch from "$lib/components/ui/switch"
  import * as Slider from "$lib/components/ui/slider"
  import * as Popover from "$lib/components/ui/popover"
  import * as Calendar from "$lib/components/ui/calendar"
  import * as RangeCalendar from "$lib/components/ui/range-calendar"
  import * as Select from "$lib/components/ui/select"
  import * as Command from "$lib/components/ui/command"
  import * as Toggle from "$lib/components/ui/toggle"
  import * as Empty from "$lib/components/ui/empty"
  import * as Item from "$lib/components/ui/item"
  import * as Tooltip from "$lib/components/ui/tooltip"
  import { today, getLocalTimeZone } from "@internationalized/date"

  let step = $state(Number(new URLSearchParams(window.location.search).get("step") ?? "1"))
  let name = $state(""),
    email = $state(""),
    description = $state(""),
    range = $state([20, 60]),
    accepted = $state(false),
    done = $state(false)
  let tags = $state(["设计", "产品"])
  let error = $state("")
  let nameError = $state("")
  let emailError = $state("")
  let startDate = $state(today(getLocalTimeZone()))
  const steps = ["基本信息", "详细配置", "确认"]
  function next() {
    if (step === 1 && (!name || !email.includes("@"))) {
      error = "请填写必填字段并检查邮箱格式"
      nameError = name ? "" : "请输入项目名称"
      emailError = email.includes("@") ? "" : "请输入有效的邮箱地址"
      return
    }
    error = ""
    nameError = ""
    emailError = ""
    step = Math.min(3, step + 1)
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-semibold">创建项目</h1>
    <p class="text-sm text-muted-foreground">用三步完成项目初始化。</p>
  </div>
  <div class="mx-auto flex max-w-2xl items-center justify-between">
    {#each steps as label, i}<div class="flex items-center gap-2">
        <div
          class="flex size-8 items-center justify-center rounded-full {step >= i + 1
            ? 'bg-primary text-primary-foreground'
            : 'border text-muted-foreground'}"
        >
          {step > i + 1 ? "✓" : i + 1}
        </div>
        <span class="hidden text-sm sm:inline">{label}</span>
      </div>
      {#if i < 2}<div class="h-px flex-1 bg-border"></div>{/if}{/each}
  </div>
  <Card.Root class="mx-auto max-w-3xl"
    ><Card.Content class="space-y-6 p-6">
      {#if error}<p class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>{/if}
      {#if step === 1}
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="space-y-2 text-sm font-medium"
            >项目名称 *<input
              bind:value={name}
              aria-invalid={!!nameError}
              class="h-9 w-full rounded-md border px-3"
              placeholder="例如：增长计划"
            />{#if nameError}<p class="text-sm text-destructive">{nameError}</p>{/if}</label
          ><label class="space-y-2 text-sm font-medium"
            >预算<input
              type="number"
              class="h-9 w-full rounded-md border px-3"
              placeholder="10000"
            /></label
          ><label class="space-y-2 text-sm font-medium"
            >邮箱 *<input
              type="email"
              bind:value={email}
              aria-invalid={!!emailError}
              class="h-9 w-full rounded-md border px-3"
              placeholder="team@example.com"
            />{#if emailError}<p class="text-sm text-destructive">{emailError}</p>{/if}</label
          ><label class="space-y-2 text-sm font-medium"
            >联系电话<input
              type="tel"
              class="h-9 w-full rounded-md border px-3"
              placeholder="+86 138..."
            /></label
          >
        </div>
        <label class="space-y-2 text-sm font-medium"
          >项目说明<textarea
            bind:value={description}
            maxlength="200"
            class="min-h-28 w-full rounded-md border p-3"
            placeholder="简要介绍项目目标..."
          ></textarea><span class="block text-xs text-muted-foreground"
            >{description.length}/200</span
          ></label
        >
        <div class="space-y-3">
          <p class="text-sm font-medium">项目类型</p>
          <Radio.Root value="internal" class="flex items-center gap-2 whitespace-nowrap"
            ><Radio.Item value="internal" />内部项目</Radio.Root
          ><Radio.Root value="client" class="flex items-center gap-2 whitespace-nowrap"
            ><Radio.Item value="client" />客户项目</Radio.Root
          >
        </div>
        <div class="flex flex-wrap gap-4 text-sm">
          <label class="inline-flex items-center gap-2 whitespace-nowrap"
            ><Checkbox.Root />需要审批</label
          >
          <label class="inline-flex items-center gap-2 whitespace-nowrap"
            ><Switch.Root />启用通知</label
          >
        </div>
      {:else if step === 2}
        <div class="grid gap-5 sm:grid-cols-2">
          <label class="space-y-2 text-sm font-medium"
            >优先级<Select.Root type="single" value="standard"
              ><Select.Trigger class="w-full"><span>标准</span></Select.Trigger><Select.Content
                ><Select.Item value="standard">标准</Select.Item><Select.Item value="high"
                  >高</Select.Item
                ><Select.Item value="urgent">紧急</Select.Item></Select.Content
              ></Select.Root
            ></label
          >
          ><label class="space-y-2 text-sm font-medium"
            >开始时间<Select.Root type="single" value="09:00"
              ><Select.Trigger class="w-full"><span>09:00</span></Select.Trigger><Select.Content
                >{#each ["09:00", "09:30", "10:00", "10:30", "11:00"] as time}<Select.Item
                    value={time}>{time}</Select.Item
                  >{/each}</Select.Content
              ></Select.Root
            ></label
          ><label class="space-y-2 text-sm font-medium"
            >开始日期<Popover.Root
              ><Popover.Trigger class="w-full"
                ><Button variant="outline" class="w-full justify-start font-normal"
                  >{startDate.toString()}</Button
                ></Popover.Trigger
              ><Popover.Content class="w-auto p-0"
                ><Calendar.Calendar type="single" bind:value={startDate} /></Popover.Content
              ></Popover.Root
            ></label
          >
          ><label class="space-y-2 text-sm font-medium"
            >结束日期<Popover.Root
              ><Popover.Trigger class="w-full"
                ><Button variant="outline" class="w-full justify-start font-normal">选择日期</Button
                ></Popover.Trigger
              ><Popover.Content class="w-auto p-0"><RangeCalendar.RangeCalendar /></Popover.Content
              ></Popover.Root
            ></label
          >
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <div class="space-y-2 text-sm font-medium">
            <p>协作成员</p>
            <Popover.Root
              ><Popover.Trigger class="w-full"
                ><Button variant="outline" class="w-full justify-start font-normal">选择成员</Button
                ></Popover.Trigger
              ><Popover.Content class="w-64 p-0"
                ><Command.Root
                  ><Command.Input placeholder="搜索成员" /><Command.List
                    ><Command.Empty>没有结果</Command.Empty><Command.Group
                      >{#each ["设计", "产品", "研发"] as member}<Command.Item
                          ><Checkbox.Root class="mr-2" />{member}</Command.Item
                        >{/each}</Command.Group
                    ></Command.List
                  ></Command.Root
                ></Popover.Content
              ></Popover.Root
            >
          </div>
          <div class="space-y-2 text-sm font-medium">
            <p>负责人</p>
            <Popover.Root
              ><Popover.Trigger class="w-full"
                ><Button variant="outline" class="w-full justify-start font-normal"
                  >搜索负责人</Button
                ></Popover.Trigger
              ><Popover.Content class="w-64 p-0"
                ><Command.Root
                  ><Command.Input placeholder="搜索负责人" /><Command.List
                    ><Command.Empty>没有结果</Command.Empty><Command.Item>林晓</Command.Item
                    ><Command.Item>周宁</Command.Item></Command.List
                  ></Command.Root
                ></Popover.Content
              ></Popover.Root
            >
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm font-medium">
            预算范围 <Tooltip.Root
              ><Tooltip.Trigger
                ><Icon name="info" size={16} class="text-muted-foreground" /></Tooltip.Trigger
              ><Tooltip.Content>拖动两个滑块设置范围</Tooltip.Content></Tooltip.Root
            >
          </div>
          <Slider.Root type="multiple" bind:value={range} min={0} max={100} step={1} />
          <div class="flex justify-between text-xs text-muted-foreground">
            <span>{range[0]}%</span><span>{range[1]}%</span>
          </div>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium">标签</p>
          <div class="flex flex-wrap gap-2">
            {#each tags as tag}<Badge.Root variant="secondary"
                >{tag}<button
                  class="ml-1"
                  onclick={() => (tags = tags.filter((item) => item !== tag))}
                  ><Icon name="x" size={12} /></button
                ></Badge.Root
              >{/each}<input class="h-8 w-24 rounded border px-2 text-sm" placeholder="添加标签" />
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-sm font-medium">优先级评分</p>
          <div class="flex gap-1">
            {#each Array(5) as _, i}<Toggle.Root
                size="sm"
                variant="outline"
                aria-label={`${i + 1} 星`}><Icon name="star" size={16} /></Toggle.Root
              >{/each}
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-sm font-medium">颜色</p>
          <Radio.Root value="blue" class="flex gap-2">
            {#each ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-red-500"] as color}
              <Radio.Item value={color} class={`size-7 rounded-full border-2 ${color}`} />
            {/each}
          </Radio.Root>
        </div>
        <div class="rounded-lg border border-dashed p-8 text-center">
          <Icon name="upload" size={24} class="mx-auto mb-2 text-muted-foreground" />
          <p class="text-sm font-medium">拖拽文件到此处上传</p>
          <p class="text-xs text-muted-foreground">支持 PDF、PNG、DOCX</p>
        </div>
        <Item.Root variant="outline"
          ><Item.Media variant="icon"><Icon name="upload" size={18} /></Item.Media><Item.Content
            ><Item.Title>项目资料.pdf</Item.Title><Item.Description
              >2.4 MB · 已上传</Item.Description
            ></Item.Content
          ></Item.Root
        >
      {:else if !done}
        <h2 class="text-lg font-semibold">确认项目资料</h2>
        <dl class="grid gap-3 rounded-lg bg-muted/40 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-muted-foreground">项目名称</dt>
            <dd>{name || "未填写"}</dd>
          </div>
          <div>
            <dt class="text-muted-foreground">邮箱</dt>
            <dd>{email || "未填写"}</dd>
          </div>
          <div>
            <dt class="text-muted-foreground">项目说明</dt>
            <dd>{description || "未填写"}</dd>
          </div>
          <div>
            <dt class="text-muted-foreground">预算范围</dt>
            <dd>{range[0]}% - {range[1]}%</dd>
          </div>
        </dl>
        <label class="flex items-center gap-2 text-sm"
          ><Checkbox.Root bind:checked={accepted} />我已阅读并同意服务条款</label
        >
      {:else}<Empty.Root
          ><Empty.Header
            ><Empty.Media variant="icon"><Icon name="check" size={18} /></Empty.Media><Empty.Title
              >项目创建成功</Empty.Title
            ><Empty.Description>项目已创建，可以开始协作。</Empty.Description></Empty.Header
          ><Button onclick={() => (done = false)}>创建另一个项目</Button></Empty.Root
        >{/if}
    </Card.Content><Card.Footer class="justify-between"
      >{#if step > 1 && !done}<Button variant="outline" onclick={() => (step -= 1)}
          ><Icon name="chevron-left" size={16} class="mr-1" />上一步</Button
        >{:else}<span></span>{/if}{#if !done}{#if step < 3}<Button onclick={next}
            >下一步<Icon name="chevron-right" size={16} class="ml-1" /></Button
          >{:else}<Button disabled={!accepted} onclick={() => (done = true)}>提交项目</Button
          >{/if}{/if}</Card.Footer
    ></Card.Root
  >
</div>
