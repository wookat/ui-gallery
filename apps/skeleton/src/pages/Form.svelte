<script lang="ts">
  import { FileUpload, RatingGroup, Slider, Steps, TagsInput, Tooltip, Portal } from "@skeletonlabs/skeleton-svelte"
  import team from "@ui-gallery/spec/mock/team.json"
  import plans from "@ui-gallery/spec/mock/plans.json"
  import Icon from "../lib/Icon.svelte"
  import { link, router } from "../lib/router.svelte"
  import { toaster } from "../lib/toaster"

  const stepsMeta = [
    { title: "基本信息", description: "名称与负责人" },
    { title: "详细配置", description: "资源、优先级与标签" },
    { title: "确认提交", description: "核对信息" },
  ]

  let step = $state(0)
  let submitted = $state(false)
  let submitting = $state(false)

  let name = $state("")
  let description = $state("")
  let owner = $state("")
  let plan = $state(plans[0].name)
  let visibility = $state("private")
  let budget = $state([50])
  let priority = $state(3)
  let color = $state("#2563eb")
  let tags = $state<string[]>(["内部"])
  let files = $state<File[]>([])
  let agree = $state(false)
  let notify = $state(true)
  let errors = $state<Record<string, string>>({})

  const selectedPlan = $derived(plans.find((p) => p.name === plan) ?? plans[0])

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (step === 0) {
      if (name.trim().length < 2) next.name = "项目名称至少 2 个字符"
      if (!owner) next.owner = "请选择负责人"
      if (description.length > 200) next.description = "描述不超过 200 字"
    }
    if (step === 1) {
      if (tags.length === 0) next.tags = "至少添加一个标签"
    }
    if (step === 2 && !agree) next.agree = "请先同意服务条款"
    errors = next
    return Object.keys(next).length === 0
  }

  function next() {
    if (!validate()) return
    step = Math.min(step + 1, 2)
  }
  function back() {
    errors = {}
    step = Math.max(step - 1, 0)
  }
  async function submit() {
    if (!validate()) return
    submitting = true
    await new Promise((r) => setTimeout(r, 800))
    submitting = false
    submitted = true
    toaster.success({ title: "项目已创建", description: name })
  }
  function reset() {
    step = 0
    submitted = false
    name = ""
    description = ""
    owner = ""
    tags = ["内部"]
    files = []
    agree = false
    errors = {}
  }
</script>

<header>
  <h1 class="h3">新建项目</h1>
  <p class="text-sm opacity-70">通过三步向导创建一个新项目。</p>
</header>

{#if submitted}
  <section class="card bg-surface-50-950 border border-surface-200-800 p-10 text-center space-y-4 max-w-2xl mx-auto">
    <span class="mx-auto grid place-items-center size-16 rounded-full preset-tonal-success"><Icon name="circle-check" class="size-8" /></span>
    <h2 class="h4">项目「{name}」创建成功</h2>
    <p class="opacity-70">负责人 {owner} · {selectedPlan.name} · {tags.length} 个标签 · {files.length} 个附件</p>
    <div class="flex flex-wrap justify-center gap-2">
      <a class="btn preset-filled-primary-500" href={router.href("/")} use:link>返回仪表盘</a>
      <button type="button" class="btn preset-outlined-surface-500" onclick={reset}>再建一个</button>
    </div>
  </section>
{:else}
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
    <section class="card bg-surface-50-950 border border-surface-200-800 p-4 md:p-6 space-y-6">
      <Steps {step} count={3} onStepChange={(d) => (step = d.step)} linear>
        <Steps.List class="grid grid-cols-3 gap-2">
          {#each stepsMeta as s, i (s.title)}
            <Steps.Item index={i} class="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <Steps.Trigger class="flex items-center gap-2">
                <Steps.Indicator class="size-8 shrink-0 rounded-full grid place-items-center text-sm font-bold {i < step ? 'preset-filled-success-500' : i === step ? 'preset-filled-primary-500' : 'preset-tonal'}">
                  {#if i < step}<Icon name="check" />{:else}{i + 1}{/if}
                </Steps.Indicator>
                <span class="hidden sm:block">
                  <span class="block text-sm font-medium">{s.title}</span>
                  <span class="block text-xs opacity-60">{s.description}</span>
                </span>
              </Steps.Trigger>
              {#if i < 2}<Steps.Separator class="hidden sm:block flex-1 h-px bg-surface-200-800" />{/if}
            </Steps.Item>
          {/each}
        </Steps.List>

        <Steps.Content index={0} class="space-y-5 pt-4">
          <label class="label">
            <span class="label-text">项目名称 <span class="text-error-500">*</span></span>
            <input class="input" class:!border-error-500={errors.name} placeholder="例如：Q4 增长实验" bind:value={name} aria-invalid={!!errors.name} />
            {#if errors.name}<p class="text-error-500 text-xs">{errors.name}</p>{/if}
          </label>
          <label class="label">
            <span class="label-text flex justify-between"><span>项目描述</span><span class="opacity-60 text-xs">{description.length}/200</span></span>
            <textarea class="textarea" class:!border-error-500={errors.description} rows="3" placeholder="简要描述项目目标…" bind:value={description}></textarea>
            {#if errors.description}<p class="text-error-500 text-xs">{errors.description}</p>{/if}
          </label>
          <label class="label">
            <span class="label-text">负责人 <span class="text-error-500">*</span></span>
            <select class="select" class:!border-error-500={errors.owner} bind:value={owner} aria-invalid={!!errors.owner}>
              <option value="">请选择</option>
              {#each team as m (m.email)}<option value={m.name}>{m.name} · {m.role}</option>{/each}
            </select>
            {#if errors.owner}<p class="text-error-500 text-xs">{errors.owner}</p>{/if}
          </label>
          <fieldset class="fieldset space-y-2">
            <legend class="legend text-sm">可见性</legend>
            <div class="flex flex-wrap gap-4">
              {#each [["private", "私有", "仅项目成员可见"], ["team", "团队", "团队所有成员可见"], ["public", "公开", "任何人可见"]] as [v, l, d] (v)}
                <label class="flex items-start gap-2 text-sm">
                  <input class="radio mt-0.5" type="radio" name="visibility" value={v} bind:group={visibility} />
                  <span><span class="block font-medium">{l}</span><span class="block text-xs opacity-60">{d}</span></span>
                </label>
              {/each}
            </div>
          </fieldset>
        </Steps.Content>

        <Steps.Content index={1} class="space-y-6 pt-4">
          <div class="space-y-2">
            <span class="label-text text-sm">套餐</span>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {#each plans as p (p.name)}
                <label class="card p-3 cursor-pointer border {plan === p.name ? 'border-primary-500 preset-tonal-primary' : 'border-surface-200-800 hover:preset-tonal'}">
                  <input class="sr-only" type="radio" name="plan" value={p.name} bind:group={plan} />
                  <span class="flex items-center justify-between"><span class="font-medium">{p.name}</span>{#if p.recommended}<span class="badge preset-filled-primary-500">推荐</span>{/if}</span>
                  <span class="block text-lg font-bold">{p.price === null ? "联系销售" : `¥${p.price}`}<span class="text-xs opacity-60">{p.price === null ? "" : "/月"}</span></span>
                  <span class="block text-xs opacity-60">{p.features.join(" · ")}</span>
                </label>
              {/each}
            </div>
          </div>

          <Slider value={budget} onValueChange={(d) => (budget = d.value)} min={0} max={200} step={5} class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <Slider.Label class="flex items-center gap-1">
                月预算（千元）
                <Tooltip positioning={{ placement: "top" }}>
                  <Tooltip.Trigger class="opacity-60" aria-label="帮助"><Icon name="circle-help" class="size-3.5" /></Tooltip.Trigger>
                  <Portal><Tooltip.Positioner class="z-40"><Tooltip.Content class="card preset-filled p-2 text-xs max-w-56">预算用于计算每月资源配额，可随时在设置中调整。</Tooltip.Content></Tooltip.Positioner></Portal>
                </Tooltip>
              </Slider.Label>
              <Slider.ValueText class="tabular-nums font-medium" />
            </div>
            <Slider.Control>
              <Slider.Track><Slider.Range /></Slider.Track>
              <Slider.Thumb index={0}><Slider.HiddenInput /></Slider.Thumb>
            </Slider.Control>
            <Slider.MarkerGroup class="text-xs opacity-60">
              <Slider.Marker value={0}>0</Slider.Marker>
              <Slider.Marker value={100}>100</Slider.Marker>
              <Slider.Marker value={200}>200</Slider.Marker>
            </Slider.MarkerGroup>
          </Slider>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <RatingGroup value={priority} onValueChange={(d) => (priority = d.value)} count={5} class="space-y-2">
              <RatingGroup.Label class="text-sm">优先级（{priority}/5）</RatingGroup.Label>
              <RatingGroup.Control class="flex gap-1">
                <RatingGroup.Context>
                  {#snippet children(api)}
                    {#each api().items as index (index)}
                      <RatingGroup.Item {index} class="cursor-pointer">
                        {#snippet empty()}<Icon name="star" class="size-6 opacity-40" />{/snippet}
                        {#snippet half()}<Icon name="star" class="size-6 text-warning-500" />{/snippet}
                        {#snippet full()}<Icon name="star" class="size-6 fill-warning-500 text-warning-500" />{/snippet}
                      </RatingGroup.Item>
                    {/each}
                  {/snippet}
                </RatingGroup.Context>
                <RatingGroup.HiddenInput />
              </RatingGroup.Control>
            </RatingGroup>

            <label class="label">
              <span class="label-text">主题色</span>
              <div class="flex items-center gap-3">
                <input class="input w-14 h-10 p-1" type="color" bind:value={color} aria-label="选择颜色" />
                <input class="input font-mono flex-1" bind:value={color} />
              </div>
            </label>
          </div>

          <TagsInput value={tags} onValueChange={(d) => (tags = d.value)} class="space-y-2">
            <TagsInput.Label class="text-sm">标签 <span class="text-error-500">*</span></TagsInput.Label>
            <TagsInput.Control class="input flex flex-wrap gap-1 min-h-10 h-auto items-center">
              <TagsInput.Context>
                {#snippet children(api)}
                  {#each api().value as value, index (value)}
                    <TagsInput.Item {index} {value} class="chip preset-tonal-primary gap-1">
                      <TagsInput.ItemPreview class="flex items-center gap-1">
                        <TagsInput.ItemText>{value}</TagsInput.ItemText>
                        <TagsInput.ItemDeleteTrigger aria-label={`删除 ${value}`}><Icon name="x" class="size-3" /></TagsInput.ItemDeleteTrigger>
                      </TagsInput.ItemPreview>
                      <TagsInput.ItemInput />
                    </TagsInput.Item>
                  {/each}
                {/snippet}
              </TagsInput.Context>
              <TagsInput.Input placeholder="输入后回车添加…" class="flex-1 min-w-24 bg-transparent outline-none" />
            </TagsInput.Control>
            <TagsInput.HiddenInput />
            {#if errors.tags}<p class="text-error-500 text-xs">{errors.tags}</p>{/if}
          </TagsInput>

          <FileUpload maxFiles={5} accept="image/*,.pdf" onFileChange={(d) => (files = d.acceptedFiles)} class="space-y-2">
            <FileUpload.Label class="text-sm">附件</FileUpload.Label>
            <FileUpload.Dropzone class="card border-2 border-dashed border-surface-300-700 p-6 text-center hover:preset-tonal cursor-pointer">
              <Icon name="upload" class="size-6 mx-auto opacity-60" />
              <p class="text-sm mt-2">拖拽文件到此处，或 <span class="anchor">点击选择</span></p>
              <p class="text-xs opacity-60">支持图片与 PDF，最多 5 个文件</p>
              <FileUpload.HiddenInput />
            </FileUpload.Dropzone>
            <FileUpload.ItemGroup class="space-y-1">
              <FileUpload.Context>
                {#snippet children(api)}
                  {#each api().acceptedFiles as file (file.name)}
                    <FileUpload.Item {file} class="flex items-center gap-2 text-sm card preset-tonal p-2">
                      <Icon name="file" />
                      <FileUpload.ItemName class="flex-1 truncate" />
                      <FileUpload.ItemSizeText class="opacity-60 text-xs" />
                      <FileUpload.ItemDeleteTrigger class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="移除"><Icon name="x" class="size-3" /></FileUpload.ItemDeleteTrigger>
                    </FileUpload.Item>
                  {/each}
                {/snippet}
              </FileUpload.Context>
            </FileUpload.ItemGroup>
          </FileUpload>
        </Steps.Content>

        <Steps.Content index={2} class="space-y-5 pt-4">
          <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm card preset-tonal p-4">
            <dt class="opacity-60">项目名称</dt><dd class="font-medium">{name || "—"}</dd>
            <dt class="opacity-60">描述</dt><dd>{description || "—"}</dd>
            <dt class="opacity-60">负责人</dt><dd>{owner || "—"}</dd>
            <dt class="opacity-60">可见性</dt><dd>{visibility}</dd>
            <dt class="opacity-60">套餐</dt><dd>{selectedPlan.name}{selectedPlan.price === null ? "" : ` · ¥${selectedPlan.price}/月`}</dd>
            <dt class="opacity-60">预算</dt><dd>{budget[0]} 千元/月</dd>
            <dt class="opacity-60">优先级</dt><dd>{"★".repeat(priority)}{"☆".repeat(5 - priority)}</dd>
            <dt class="opacity-60">主题色</dt><dd class="flex items-center gap-2"><span class="size-4 rounded" style:background={color}></span>{color}</dd>
            <dt class="opacity-60">标签</dt><dd class="flex flex-wrap gap-1">{#each tags as t (t)}<span class="chip preset-tonal-primary">{t}</span>{/each}</dd>
            <dt class="opacity-60">附件</dt><dd>{files.length} 个文件</dd>
          </dl>
          <label class="flex items-center justify-between gap-3 text-sm">
            <span>创建后通知团队成员</span>
            <input class="switch" type="checkbox" role="switch" bind:checked={notify} />
          </label>
          <label class="flex items-start gap-2 text-sm">
            <input class="checkbox mt-0.5" type="checkbox" bind:checked={agree} />
            <span>我已阅读并同意 <a class="anchor" href={router.href("/form")} use:link>服务条款</a> 与 <a class="anchor" href={router.href("/form")} use:link>隐私政策</a></span>
          </label>
          {#if errors.agree}<p class="text-error-500 text-xs">{errors.agree}</p>{/if}
        </Steps.Content>
      </Steps>

      <footer class="flex items-center justify-between gap-2 pt-4 border-t border-surface-200-800">
        <button type="button" class="btn preset-outlined-surface-500" onclick={back} disabled={step === 0}><Icon name="arrow-left" /><span>上一步</span></button>
        {#if step < 2}
          <button type="button" class="btn preset-filled-primary-500" onclick={next}><span>下一步</span><Icon name="arrow-right" /></button>
        {:else}
          <button type="button" class="btn preset-filled-primary-500" onclick={submit} disabled={submitting} aria-busy={submitting}>
            {#if submitting}<Icon name="loader" class="animate-spin" /><span>提交中…</span>{:else}<Icon name="check" /><span>创建项目</span>{/if}
          </button>
        {/if}
      </footer>
    </section>

    <aside class="card bg-surface-50-950 border border-surface-200-800 p-4 space-y-3 text-sm lg:sticky lg:top-20">
      <h2 class="h6">填写提示</h2>
      <ul class="space-y-2 opacity-80">
        <li class="flex gap-2"><Icon name="info" class="size-4 shrink-0 mt-0.5" /><span>项目名称应简洁明确，便于团队检索。</span></li>
        <li class="flex gap-2"><Icon name="info" class="size-4 shrink-0 mt-0.5" /><span>预算可在创建后随时调整。</span></li>
        <li class="flex gap-2"><Icon name="info" class="size-4 shrink-0 mt-0.5" /><span>标签用于筛选与聚合报表。</span></li>
      </ul>
      <hr class="hr" />
      <p class="opacity-60">当前进度：第 {step + 1} / 3 步</p>
      <div class="progress"><div class="h-full bg-primary-500 rounded-full transition-all" style:width={`${((step + 1) / 3) * 100}%`}></div></div>
    </aside>
  </div>
{/if}
