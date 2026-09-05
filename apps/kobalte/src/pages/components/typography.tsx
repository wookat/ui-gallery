import { DemoCard, DemoFrame, DemoLabel } from "./shared"
import { Separator } from "@/ui/separator"

export function TypographyDemo(props: { name: string; status: string }) {
  return <DemoCard name={props.name} status={props.status}>
    <DemoFrame>
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2"><DemoLabel>Headings</DemoLabel><h1 class="text-3xl font-bold">Heading 1</h1><h2 class="text-2xl font-semibold">Heading 2</h2><h3 class="text-xl font-semibold">Heading 3</h3><h4 class="text-lg font-semibold">Heading 4</h4><h5 class="font-semibold">Heading 5</h5><h6 class="text-sm font-semibold">Heading 6</h6></div>
        <div class="space-y-3"><DemoLabel>Body</DemoLabel><p class="text-lg">Lead paragraph for an important introduction.</p><p>Regular paragraph with <a class="text-blue-600 underline" href="#component-Link">inline link</a> and <code class="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">code()</code>.</p><p class="text-sm text-zinc-500 dark:text-zinc-400">Muted helper text.</p><blockquote class="border-l-2 border-blue-600 pl-3 italic">A short blockquote for context.</blockquote><ul class="list-disc pl-5"><li>Unordered item</li><li>Another item</li></ul><ol class="list-decimal pl-5"><li>Ordered item</li><li>Another item</li></ol></div>
      </div>
      <Separator class="my-3" />
      <p class="text-sm">Keyboard shortcut <kbd class="rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-900">⌘ K</kbd> and <code class="rounded bg-zinc-200 px-2 py-1 font-mono text-xs dark:bg-zinc-800">npm run dev</code>.</p>
    </DemoFrame>
  </DemoCard>
}
