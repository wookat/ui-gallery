<script lang="ts">
  import landing from "@ui-gallery/spec/mock/landing.json"
  import plans from "@ui-gallery/spec/mock/plans.json"
  import Icon from "$lib/icons/Icon.svelte"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import * as Badge from "$lib/components/ui/badge"
  import * as Accordion from "$lib/components/ui/accordion"
  import * as AspectRatio from "$lib/components/ui/aspect-ratio"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as Sheet from "$lib/components/ui/sheet"
  let yearly = $state(false)
  let mobileOpen = $state(false)
</script>

<div class="min-h-screen bg-background">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
    <a href="/" class="flex items-center gap-2 font-semibold"
      ><span
        class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        ><Icon name="sparkles" size={16} /></span
      >Acme Console</a
    >
    <div class="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
      <a href="#features">功能</a><a href="#product">产品</a><a href="#pricing">定价</a><a
        href="#stories">客户故事</a
      ><a href="#faq">FAQ</a>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="ghost" class="hidden sm:inline-flex">登录</Button><Button
        class="hidden sm:inline-flex">免费开始</Button
      ><Button
        variant="ghost"
        size="icon"
        class="md:hidden"
        aria-label="菜单"
        onclick={() => (mobileOpen = true)}><Icon name="menu" size={16} /></Button
      >
    </div>
  </nav>
  <main>
    <section
      class="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 pb-20 lg:grid-cols-2 lg:pt-24"
    >
      <div>
        <Badge.Root variant="secondary">新一代团队工作台</Badge.Root>
        <h1 class="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">{landing.hero.title}</h1>
        <p class="mt-5 text-lg text-muted-foreground">{landing.hero.subtitle}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <Button size="lg"
            >{landing.hero.primary}<Icon name="arrow-right" size={16} class="ml-2" /></Button
          ><Button size="lg" variant="outline">{landing.hero.secondary}</Button>
        </div>
        <div class="mt-8 flex items-center gap-3">
          <div class="flex -space-x-2">
            {#each ["林", "王", "A", "M", "陈"] as initial}<Avatar.Root
                class="size-9 border-2 border-background"
                ><Avatar.Fallback>{initial}</Avatar.Fallback></Avatar.Root
              >{/each}
          </div>
          <span class="text-sm text-muted-foreground">{landing.hero.social}</span>
        </div>
      </div>
      <AspectRatio.Root
        ratio={16 / 10}
        class="overflow-hidden rounded-2xl border bg-muted shadow-2xl"
        ><div class="flex h-full flex-col p-5">
          <div class="mb-5 flex gap-2">
            <span class="size-3 rounded-full bg-red-400"></span><span
              class="size-3 rounded-full bg-yellow-400"
            ></span><span class="size-3 rounded-full bg-green-400"></span>
          </div>
          <div class="grid flex-1 grid-cols-3 gap-3">
            <div class="col-span-2 rounded-lg bg-background p-4">
              <div class="h-3 w-1/3 rounded bg-muted"></div>
              <div class="mt-6 h-24 rounded bg-primary/15"></div>
              <div class="mt-3 h-3 w-2/3 rounded bg-muted"></div>
            </div>
            <div class="rounded-lg bg-background p-4">
              <div class="h-3 w-1/2 rounded bg-muted"></div>
              <div class="mt-4 space-y-3">
                <div class="h-3 rounded bg-muted"></div>
                <div class="h-3 rounded bg-muted"></div>
                <div class="h-3 rounded bg-muted"></div>
              </div>
            </div>
          </div>
        </div></AspectRatio.Root
      >
    </section>
    <section aria-label="合作团队" class="border-b py-8">
      <div
        class="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 text-sm font-semibold text-muted-foreground/60"
      >
        {#each ["Northstar", "Mosaic", "Orbit", "Acme Labs", "Vela", "Juniper"] as logo}<span
            >{logo}</span
          >{/each}
      </div>
    </section>
    <section class="border-y bg-muted/30 py-10">
      <div class="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 text-center sm:grid-cols-4">
        {#each landing.numbers as number}<div>
            <p class="text-3xl font-bold">{number.value}</p>
            <p class="mt-1 text-sm text-muted-foreground">{number.label}</p>
          </div>{/each}
      </div>
    </section>
    <section id="features" class="mx-auto max-w-6xl px-4 py-20">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-bold">一套工具，连接整个团队</h2>
        <p class="mt-3 text-muted-foreground">从数据到协作，所有工作都在一个清晰的界面里完成。</p>
      </div>
      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each landing.features as feature}<Card.Root
            ><Card.Header
              ><div
                class="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
              >
                <Icon name={feature.icon} />
              </div>
              <Card.Title>{feature.title}</Card.Title><Card.Description
                >{feature.desc}</Card.Description
              ></Card.Header
            ></Card.Root
          >{/each}
      </div>
    </section>
    <section id="product" class="mx-auto max-w-6xl space-y-16 px-4 py-12">
      <div class="grid items-center gap-10 md:grid-cols-2">
        <div class="rounded-2xl bg-muted p-10">
          <div class="h-48 rounded-xl bg-background shadow-inner"></div>
        </div>
        <div>
          <Badge.Root variant="outline">统一视图</Badge.Root>
          <h2 class="mt-4 text-3xl font-bold">让复杂工作变得简单</h2>
          <p class="mt-4 text-muted-foreground">
            清晰的模块和实时状态，让每个人都能快速找到下一步。
          </p>
        </div>
      </div>
      <div class="grid items-center gap-10 md:grid-cols-2">
        <div class="order-2 md:order-1">
          <Badge.Root variant="outline">智能协作</Badge.Root>
          <h2 class="mt-4 text-3xl font-bold">洞察就在行动之前</h2>
          <p class="mt-4 text-muted-foreground">把团队经验沉淀为可复用的工作流。</p>
        </div>
        <div class="order-1 rounded-2xl bg-primary/10 p-10 md:order-2">
          <div class="h-48 rounded-xl bg-background shadow-inner"></div>
        </div>
      </div>
    </section>
    <section id="pricing" class="bg-muted/30 px-4 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="text-center">
          <h2 class="text-3xl font-bold">选择适合你的计划</h2>
          <div
            class="mt-5 inline-flex items-center gap-2 rounded-full border bg-background p-1 text-sm"
          >
            <button
              class:font-semibold={!yearly}
              class="rounded-full px-3 py-1"
              onclick={() => (yearly = false)}>按月</button
            ><button
              class:font-semibold={yearly}
              class="rounded-full px-3 py-1"
              onclick={() => (yearly = true)}>按年</button
            >
          </div>
        </div>
        <div class="mt-10 grid gap-5 md:grid-cols-3">
          {#each plans as plan}<Card.Root
              class={`relative ${plan.recommended ? "border-primary" : ""}`}
              ><Card.Header
                >{#if plan.recommended}<Badge.Root class="absolute top-5 right-5">推荐</Badge.Root
                  >{/if}<Card.Title>{plan.name}</Card.Title><Card.Description
                  >适合不同规模的团队</Card.Description
                ></Card.Header
              ><Card.Content
                ><p class="text-3xl font-bold">
                  {plan.price === null
                    ? "联系销售"
                    : `¥${yearly ? Math.round(plan.price * 10) : plan.price}`}<span
                    class="text-sm font-normal text-muted-foreground"
                    >{plan.price === null ? "" : "/年"}</span
                  >
                </p>
                <ul class="mt-6 space-y-3 text-sm">
                  {#each plan.features as feature}<li class="flex gap-2">
                      <Icon name="check" size={16} class="text-primary" />{feature}
                    </li>{/each}
                </ul>
                <Button class="mt-8 w-full" variant={plan.recommended ? "default" : "outline"}
                  >选择计划</Button
                ></Card.Content
              ></Card.Root
            >{/each}
        </div>
      </div>
    </section>
    <section id="stories" class="mx-auto max-w-6xl px-4 py-20">
      <h2 class="text-center text-3xl font-bold">团队正在这样使用</h2>
      <div class="mt-10 grid gap-4 md:grid-cols-3">
        {#each landing.testimonials as testimonial}<Card.Root
            ><Card.Content class="pt-6"
              ><p>“{testimonial.quote}”</p>
              <p class="mt-5 text-sm font-medium">{testimonial.name}</p>
              <p class="text-xs text-muted-foreground">{testimonial.company}</p></Card.Content
            ></Card.Root
          >{/each}
      </div>
    </section>
    <section id="faq" class="mx-auto max-w-3xl px-4 pb-20">
      <h2 class="text-center text-3xl font-bold">常见问题</h2>
      <Accordion.Root type="single" class="mt-8"
        >{#each landing.faq as faq, i}<Accordion.Item value={String(i)}
            ><Accordion.Trigger>{faq.q}</Accordion.Trigger><Accordion.Content
              >{faq.a}</Accordion.Content
            ></Accordion.Item
          >{/each}</Accordion.Root
      >
    </section>
    <section
      id="cta"
      class="mx-4 mb-20 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:mx-auto sm:max-w-6xl"
    >
      <h2 class="text-3xl font-bold">准备好开始了吗？</h2>
      <p class="mx-auto mt-3 max-w-xl text-primary-foreground/80">
        用一个清晰的工作台，让团队把时间留给真正重要的事情。
      </p>
      <Button class="mt-6 bg-background text-foreground hover:bg-background/90">免费开始</Button>
    </section>
  </main>
  <footer class="border-t">
    <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-4">
      <div>
        <p class="font-semibold">Acme Console</p>
        <p class="mt-2 text-sm text-muted-foreground">让团队专注于重要的事。</p>
      </div>
      {#each ["产品", "资源", "公司"] as title}<div>
          <p class="font-medium">{title}</p>
          <div class="mt-3 space-y-2 text-sm text-muted-foreground">
            <a class="block" href="#features">功能介绍</a><a class="block" href="#pricing"
              >价格方案</a
            ><a class="block" href="#faq">帮助中心</a>
          </div>
        </div>{/each}
    </div>
    <div class="mx-auto max-w-6xl border-t px-4 py-5 text-sm text-muted-foreground">
      © 2025 Acme Console · 简体中文
    </div>
  </footer>
</div>

<Sheet.Root bind:open={mobileOpen}>
  <Sheet.Content side="left">
    <Sheet.Header
      ><Sheet.Title>Acme Console</Sheet.Title><Sheet.Description
        >快速访问落地页内容。</Sheet.Description
      ></Sheet.Header
    >
    <nav class="mt-6 grid gap-4 text-sm">
      <a href="#features" onclick={() => (mobileOpen = false)}>功能</a>
      <a href="#product" onclick={() => (mobileOpen = false)}>产品</a>
      <a href="#pricing" onclick={() => (mobileOpen = false)}>定价</a>
      <a href="#stories" onclick={() => (mobileOpen = false)}>客户故事</a>
      <a href="#faq" onclick={() => (mobileOpen = false)}>FAQ</a>
    </nav>
  </Sheet.Content>
</Sheet.Root>
