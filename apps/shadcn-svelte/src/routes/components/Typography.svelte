<script lang="ts">
  import { Kbd, Group as KbdGroup } from "$lib/components/ui/kbd"
  import { Root as Separator } from "$lib/components/ui/separator"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import * as Tabs from "$lib/components/ui/tabs"
  import { setMode } from "mode-watcher"

  let { name }: { name: string } = $props()
</script>

{#if name === "Typography"}
  <div class="space-y-4">
    <h1 class="text-3xl font-bold">标题一级</h1>
    <h2 class="text-2xl font-semibold">标题二级</h2>
    <h3 class="text-xl font-semibold">标题三级</h3>
    <h4 class="text-lg font-semibold">标题四级</h4>
    <h5 class="text-base font-semibold">标题五级</h5>
    <h6 class="text-sm font-semibold">标题六级</h6>
    <p class="text-sm text-muted-foreground">正文使用舒适的行高，适合展示说明和状态信息。</p>
    <blockquote class="border-l-2 pl-4 text-sm text-muted-foreground italic">
      把复杂工作拆成清晰的下一步。
    </blockquote>
    <div class="grid gap-4 sm:grid-cols-2">
      <ul class="list-disc pl-5 text-sm">
        <li>列表项目一</li>
        <li>列表项目二</li>
      </ul>
      <ol class="list-decimal pl-5 text-sm">
        <li>先查看数据</li>
        <li>再执行动作</li>
      </ol>
    </div>
    <p class="text-sm">
      可用 <code class="rounded bg-muted px-1.5 py-0.5">inline code</code> 标记字段。
    </p>
  </div>
{:else if name === "Code"}
  <pre class="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100"><code
      >const status = "ready"
render(status)</code
    ></pre>
{:else if name === "Kbd"}
  <div class="flex flex-wrap items-center gap-2 text-sm">
    <KbdGroup><Kbd>⌘</Kbd><Kbd>+</Kbd><Kbd>K</Kbd></KbdGroup>
    <span class="text-muted-foreground">打开命令面板</span>
  </div>
{:else if name === "Link"}
  <div class="flex flex-wrap gap-3">
    <Button variant="link">查看详情</Button>
    <a href="#components" class="text-sm text-primary underline underline-offset-4">锚点链接</a>
  </div>
{:else if name === "Divider"}
  <div class="space-y-4">
    <Separator />
    <div class="flex h-8 items-center gap-4">
      <span>左侧</span><Separator orientation="vertical" /><span>右侧</span>
    </div>
  </div>
{:else if name === "ThemeProvider"}
  <Card.Root>
    <Card.Header
      ><Card.Title>主题模式</Card.Title><Card.Description
        >调用 mode-watcher 的 setMode。</Card.Description
      ></Card.Header
    >
    <Card.Content class="flex flex-wrap gap-2">
      <Button size="sm" onclick={() => setMode("light")}>浅色</Button>
      <Button size="sm" variant="outline" onclick={() => setMode("dark")}>深色</Button>
      <Button size="sm" variant="ghost" onclick={() => setMode("system")}>跟随系统</Button>
    </Card.Content>
  </Card.Root>
{:else}
  <div class="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
    排版组合展示：标题、文本、代码与键盘提示。
  </div>
{/if}
