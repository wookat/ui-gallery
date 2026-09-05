<script lang="ts">
  import { Accordion, Avatar, Dialog, Portal } from "@skeletonlabs/skeleton-svelte"
  import landing from "@ui-gallery/spec/mock/landing.json"
  import nav from "@ui-gallery/spec/mock/nav.json"
  import plans from "@ui-gallery/spec/mock/plans.json"
  import stats from "@ui-gallery/spec/mock/stats.json"
  import team from "@ui-gallery/spec/mock/team.json"
  import Icon from "../lib/Icon.svelte"
  import type { IconName } from "../lib/icons"
  import { link, router } from "../lib/router.svelte"
  import { initials, money, number } from "../lib/format"
  import { isDark, setDark } from "../lib/settings"

  let dark = $state(isDark())
  let menuOpen = $state(false)
  let yearly = $state(false)
  const logos = landing.testimonials.map((t) => t.company)
  const navLinks = [
    ["#features", "功能"],
    ["#pricing", "定价"],
    ["#testimonials", "客户"],
    ["#faq", "FAQ"],
  ]
  const footerColumns: [string, [string, string][]][] = [
    ["产品", navLinks.map(([href, label]) => [href, label])],
    ["控制台", nav.slice(0, 4).map((n) => [router.href(n.path), n.label])],
    ["方案", plans.map((p) => ["#pricing", p.name])],
  ]
</script>

<div class="min-h-screen bg-surface-50-950">
  <header class="sticky top-0 z-30 border-b border-surface-200-800 bg-surface-50-950/90 backdrop-blur">
    <nav class="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4" aria-label="主导航">
      <a class="flex items-center gap-2 font-bold" href={router.href("/landing")} use:link>
        <span class="btn-icon btn-icon-sm preset-filled-primary-500">A</span>Acme Console
      </a>
      <ul class="hidden md:flex items-center gap-6 text-sm">
        {#each navLinks as [href, label] (href)}<li><a class="hover:text-primary-500" {href}>{label}</a></li>{/each}
      </ul>
      <div class="flex items-center gap-2">
        <button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="切换主题" onclick={() => { dark = !dark; setDark(dark) }}><Icon name={dark ? "sun" : "moon"} class="size-5" /></button>
        <a class="btn btn-sm hover:preset-tonal hidden sm:inline-flex" href={router.href("/login")} use:link>登录</a>
        <a class="btn btn-sm preset-filled-primary-500 hidden sm:inline-flex" href={router.href("/login")} use:link>{landing.hero.primary}</a>
        <Dialog open={menuOpen} onOpenChange={(d) => (menuOpen = d.open)}>
          <Dialog.Trigger class="btn-icon min-w-10 min-h-10 hover:preset-tonal md:hidden" aria-label="菜单"><Icon name="menu" class="size-5" /></Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
            <Dialog.Positioner class="fixed inset-0 z-50 flex justify-end">
              <Dialog.Content class="h-screen w-72 max-w-[85vw] bg-surface-50-950 p-4 shadow-xl space-y-4">
                <div class="flex justify-between items-center"><Dialog.Title class="font-bold">菜单</Dialog.Title><Dialog.CloseTrigger class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="关闭"><Icon name="x" /></Dialog.CloseTrigger></div>
                <ul class="space-y-1">
                  {#each navLinks as [href, label] (href)}<li><a class="btn hover:preset-tonal w-full justify-start" {href} onclick={() => (menuOpen = false)}>{label}</a></li>{/each}
                </ul>
                <hr class="hr" />
                <a class="btn preset-outlined-surface-500 w-full" href={router.href("/login")} use:link>登录</a>
                <a class="btn preset-filled-primary-500 w-full" href={router.href("/login")} use:link>{landing.hero.primary}</a>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog>
      </div>
    </nav>
  </header>

  <main>
    <section class="mx-auto max-w-6xl px-4 py-16 md:py-24 text-center space-y-6">
      <span class="badge preset-tonal-primary"><Icon name="sparkles" class="size-3" />{landing.hero.social}</span>
      <h1 class="h1 max-w-3xl mx-auto">{landing.hero.title}</h1>
      <p class="text-lg opacity-70 max-w-2xl mx-auto">{landing.hero.subtitle}</p>
      <div class="flex flex-col sm:flex-row justify-center gap-3">
        <a class="btn btn-lg preset-filled-primary-500" href={router.href("/login")} use:link>{landing.hero.primary}<Icon name="arrow-right" /></a>
        <a class="btn btn-lg preset-outlined-surface-500" href={router.href("/")} use:link><Icon name="play" />{landing.hero.secondary}</a>
      </div>
      <div class="card bg-surface-100-900 border border-surface-200-800 p-3 md:p-6 mt-8 text-left shadow-xl max-w-4xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          {#each stats as s (s.key)}
            <div class="card bg-surface-50-950 p-3 space-y-1">
              <p class="text-xs opacity-60">{s.label}</p>
              <p class="text-lg font-bold tabular-nums">{s.unit === "CNY" ? money(s.value) : s.unit === "%" ? `${s.value}%` : number(s.value)}</p>
              <p class="text-xs {s.delta >= 0 ? 'text-success-500' : 'text-error-500'}">{s.delta >= 0 ? "+" : ""}{s.delta}%</p>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <section class="border-y border-surface-200-800 bg-surface-100-900 py-8" aria-label="客户">
      <div class="mx-auto max-w-6xl px-4 flex flex-wrap justify-center gap-x-10 gap-y-4 opacity-60 font-semibold uppercase tracking-wider text-sm">
        {#each logos as l (l)}<span class="flex items-center gap-2"><Icon name="grid" class="size-4" />{l}</span>{/each}
      </div>
    </section>

    <section id="features" class="mx-auto max-w-6xl px-4 py-16 space-y-10">
      <div class="text-center space-y-2"><h2 class="h2">一切所需，尽在一处</h2><p class="opacity-70">面向现代团队的核心能力</p></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each landing.features as f (f.title)}
          <article class="card bg-surface-50-950 border border-surface-200-800 p-5 space-y-3 hover:shadow-lg transition">
            <span class="inline-grid place-items-center size-10 rounded-lg preset-tonal-primary"><Icon name={f.icon as IconName} class="size-5" /></span>
            <h3 class="h5">{f.title}</h3>
            <p class="text-sm opacity-70">{f.desc}</p>
          </article>
        {/each}
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div class="space-y-4">
        <span class="badge preset-tonal-secondary">实时看板</span>
        <h2 class="h2">数据驱动每一次决策</h2>
        <p class="opacity-70">收入、订单、转化率一屏掌握，支持多维筛选与导出，AI 助手随时回答业务问题。</p>
        <ul class="space-y-2 text-sm">
          {#each landing.features.slice(0, 3) as f (f.title)}<li class="flex gap-2"><Icon name="circle-check" class="size-4 text-success-500 shrink-0 mt-0.5" />{f.desc}</li>{/each}
        </ul>
        <a class="btn preset-filled-primary-500" href={router.href("/")} use:link>进入控制台<Icon name="arrow-right" /></a>
      </div>
      <div class="card bg-surface-100-900 border border-surface-200-800 p-4 space-y-3">
        {#each team.slice(0, 4) as m (m.email)}
          <div class="flex items-center gap-3 card bg-surface-50-950 p-3">
            <Avatar class="size-9"><Avatar.Fallback class="preset-filled-secondary-500 text-xs">{initials(m.name)}</Avatar.Fallback></Avatar>
            <div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">{m.name}</p><p class="text-xs opacity-60">{m.role}</p></div>
            <span class="text-xs opacity-60">{m.lastActive}</span>
          </div>
        {/each}
      </div>
    </section>

    <section class="bg-primary-500 text-primary-contrast-500 py-12">
      <div class="mx-auto max-w-6xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {#each landing.numbers as n (n.label)}
          <div><p class="text-3xl md:text-4xl font-bold">{n.value}</p><p class="text-sm opacity-80">{n.label}</p></div>
        {/each}
      </div>
    </section>

    <section id="pricing" class="mx-auto max-w-6xl px-4 py-16 space-y-10">
      <div class="text-center space-y-4">
        <h2 class="h2">简单透明的定价</h2>
        <label class="inline-flex items-center gap-3 text-sm">
          <span>按月</span><input class="switch" type="checkbox" role="switch" bind:checked={yearly} aria-label="按年计费" /><span>按年 <span class="badge preset-tonal-success">省 20%</span></span>
        </label>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {#each plans as p (p.name)}
          <article class="card p-6 space-y-4 flex flex-col {p.recommended ? 'preset-filled-primary-500 shadow-xl md:-my-4' : 'bg-surface-50-950 border border-surface-200-800'}">
            <div class="flex items-center justify-between"><h3 class="h4">{p.name}</h3>{#if p.recommended}<span class="badge preset-filled-surface-50-950">最受欢迎</span>{/if}</div>
            <p class="text-4xl font-bold">
              {#if p.price === null}定制{:else}¥{yearly ? Math.round(p.price * 0.8) : p.price}<span class="text-base font-normal opacity-70">/月</span>{/if}
            </p>
            <ul class="space-y-2 text-sm flex-1">{#each p.features as f (f)}<li class="flex gap-2"><Icon name="check" class="size-4 shrink-0 mt-0.5" />{f}</li>{/each}</ul>
            <a class="btn w-full {p.recommended ? 'preset-filled-surface-50-950' : 'preset-outlined-surface-500'}" href={router.href("/login")} use:link>{p.price === null ? "联系销售" : "开始使用"}</a>
          </article>
        {/each}
      </div>
    </section>

    <section id="testimonials" class="bg-surface-100-900 py-16">
      <div class="mx-auto max-w-6xl px-4 space-y-10">
        <h2 class="h2 text-center">客户怎么说</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each landing.testimonials as t (t.name)}
            <blockquote class="card bg-surface-50-950 border border-surface-200-800 p-5 space-y-3">
              <div class="flex gap-0.5 text-warning-500">{#each { length: 5 }, i (i)}<Icon name="star" class="size-4 fill-current" />{/each}</div>
              <p>“{t.quote}”</p>
              <footer class="flex items-center gap-2 text-sm">
                <Avatar class="size-8"><Avatar.Fallback class="preset-filled-tertiary-500 text-xs">{initials(t.name)}</Avatar.Fallback></Avatar>
                <span><span class="font-medium">{t.name}</span> <span class="opacity-60">· {t.company}</span></span>
              </footer>
            </blockquote>
          {/each}
        </div>
      </div>
    </section>

    <section id="faq" class="mx-auto max-w-3xl px-4 py-16 space-y-8">
      <h2 class="h2 text-center">常见问题</h2>
      <Accordion multiple class="card bg-surface-50-950 border border-surface-200-800 divide-y divide-surface-200-800">
        {#each landing.faq as item, i (item.q)}
          <Accordion.Item value={String(i)}>
            <Accordion.ItemTrigger class="flex w-full items-center justify-between gap-3 p-4 text-left font-medium hover:preset-tonal">
              {item.q}
              <Accordion.ItemIndicator class="[&[data-state=open]]:rotate-180 transition"><Icon name="chevron-down" /></Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent class="px-4 pb-4 text-sm opacity-80">{item.a}</Accordion.ItemContent>
          </Accordion.Item>
        {/each}
      </Accordion>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-16">
      <div class="card preset-filled-primary-500 p-8 md:p-12 text-center space-y-4">
        <h2 class="h2">准备好开始了吗？</h2>
        <p class="opacity-80">{landing.hero.social}</p>
        <div class="flex flex-col sm:flex-row justify-center gap-3">
          <a class="btn btn-lg preset-filled-surface-50-950" href={router.href("/login")} use:link>{landing.hero.primary}</a>
          <a class="btn btn-lg preset-outlined" href={router.href("/chat")} use:link>{landing.hero.secondary}</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="border-t border-surface-200-800 bg-surface-100-900">
    <div class="mx-auto max-w-6xl px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
      <div class="col-span-2 md:col-span-1 space-y-2">
        <p class="font-bold flex items-center gap-2"><span class="btn-icon btn-icon-sm preset-filled-primary-500">A</span>Acme Console</p>
        <p class="opacity-60">{landing.hero.subtitle}</p>
      </div>
      {#each footerColumns as [title, links] (title)}
        <div class="space-y-2">
          <p class="font-medium">{title}</p>
          <ul class="space-y-1 opacity-70">{#each links as [href, label] (label)}<li><a class="hover:text-primary-500" {href} use:link>{label}</a></li>{/each}</ul>
        </div>
      {/each}
    </div>
    <div class="border-t border-surface-200-800 py-4 text-center text-xs opacity-60">© 2026 Acme Console · Skeleton</div>
  </footer>
</div>
