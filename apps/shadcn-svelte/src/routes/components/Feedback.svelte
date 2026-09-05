<script lang="ts">
  import { AlertCircle, CheckCircle2, Info, LoaderCircle, XCircle } from "@lucide/svelte"
  import { toast } from "svelte-sonner"
  import * as Alert from "$lib/components/ui/alert"
  import * as AlertDialog from "$lib/components/ui/alert-dialog"
  import * as Dialog from "$lib/components/ui/dialog"
  import * as Drawer from "$lib/components/ui/drawer"
  import * as Empty from "$lib/components/ui/empty"
  import * as Popover from "$lib/components/ui/popover"
  import * as Progress from "$lib/components/ui/progress"
  import * as Skeleton from "$lib/components/ui/skeleton"
  import * as Sheet from "$lib/components/ui/sheet"
  import * as Badge from "$lib/components/ui/badge"
  import { Button } from "$lib/components/ui/button"
  import { Spinner } from "$lib/components/ui/spinner"

  let { name }: { name: string } = $props()
</script>

{#if name === "Alert"}
  <div class="space-y-2">
    <Alert.Root
      ><Info /><Alert.Title>信息提示</Alert.Title><Alert.Description
        >这是一条普通说明。</Alert.Description
      ></Alert.Root
    >
    <Alert.Root variant="destructive"
      ><AlertCircle /><Alert.Title>错误提示</Alert.Title><Alert.Description
        >需要检查输入内容。</Alert.Description
      ></Alert.Root
    >
    <Alert.Root class="border-green-500 text-green-700"
      ><CheckCircle2 /><Alert.Title>成功提示</Alert.Title><Alert.Description
        >操作已经完成。</Alert.Description
      ></Alert.Root
    >
    <Alert.Root class="border-amber-500 text-amber-700"
      ><AlertCircle /><Alert.Title>注意提示</Alert.Title><Alert.Description
        >请确认下一步操作。</Alert.Description
      ></Alert.Root
    >
  </div>
{:else if name === "Toast" || name === "Notification"}
  <div class="flex flex-wrap gap-2">
    <Button size="sm" onclick={() => toast.success("保存成功", { description: "内容已经同步。" })}
      >成功</Button
    >
    <Button size="sm" variant="outline" onclick={() => toast.info("新的消息")}>信息</Button>
    <Button size="sm" variant="secondary" onclick={() => toast.warning("请稍后重试")}>警告</Button>
    <Button
      size="sm"
      variant="destructive"
      onclick={() =>
        toast.error("操作失败", {
          action: { label: "重试", onClick: () => toast.success("已重试") },
        })}>错误</Button
    >
  </div>
{:else if name === "Dialog"}
  <div class="flex flex-wrap gap-2">
    <Dialog.Root
      ><Dialog.Trigger><Button>打开 Dialog</Button></Dialog.Trigger><Dialog.Content
        ><Dialog.Header
          ><Dialog.Title>确认设置</Dialog.Title><Dialog.Description
            >这是普通对话框内容。</Dialog.Description
          ></Dialog.Header
        ><Dialog.Footer><Button>保存</Button></Dialog.Footer></Dialog.Content
      ></Dialog.Root
    >
    <AlertDialog.Root
      ><AlertDialog.Trigger><Button variant="destructive">确认删除</Button></AlertDialog.Trigger
      ><AlertDialog.Content
        ><AlertDialog.Header
          ><AlertDialog.Title>确定删除吗？</AlertDialog.Title><AlertDialog.Description
            >此操作无法撤销。</AlertDialog.Description
          ></AlertDialog.Header
        ><AlertDialog.Footer
          ><AlertDialog.Cancel>取消</AlertDialog.Cancel><AlertDialog.Action>确定</AlertDialog.Action
          ></AlertDialog.Footer
        ></AlertDialog.Content
      ></AlertDialog.Root
    >
  </div>
{:else if name === "Drawer"}
  <div class="flex flex-wrap gap-2">
    <Drawer.Root
      ><Drawer.Trigger><Button variant="outline">底部 Drawer</Button></Drawer.Trigger
      ><Drawer.Content
        ><div class="mx-auto w-full max-w-md p-5">
          <h3 class="font-semibold">移动操作</h3>
          <p class="mt-2 text-sm text-muted-foreground">vaul 底部抽屉适合移动端操作。</p>
        </div></Drawer.Content
      ></Drawer.Root
    >
    {#each ["top", "right", "bottom", "left"] as side}<Sheet.Root
        ><Sheet.Trigger><Button size="sm" variant="ghost">{side}</Button></Sheet.Trigger
        ><Sheet.Content side={side as "top" | "right" | "bottom" | "left"}
          ><Sheet.Header
            ><Sheet.Title>{side} Sheet</Sheet.Title><Sheet.Description
              >四方向抽屉示例。</Sheet.Description
            ></Sheet.Header
          ></Sheet.Content
        ></Sheet.Root
      >{/each}
  </div>
{:else if name === "Progress"}
  <div class="space-y-4">
    <Progress.Root value={35} /><Progress.Root value={75} />
    <div class="flex items-center gap-3">
      <svg viewBox="0 0 40 40" class="size-12 -rotate-90"
        ><circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="currentColor"
          stroke-opacity=".15"
          stroke-width="4"
        /><circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="currentColor"
          stroke-dasharray="100.5"
          stroke-dashoffset="25"
          stroke-linecap="round"
          stroke-width="4"
        /></svg
      ><span class="text-sm">步骤 3 / 4</span>
    </div>
  </div>
{:else if name === "Skeleton"}
  <div class="space-y-3 rounded-lg border p-4">
    <div class="flex items-center gap-3">
      <Skeleton.Root class="size-10 rounded-full" /><Skeleton.Root class="h-4 w-32" />
    </div>
    <Skeleton.Root class="h-20 w-full" /><Skeleton.Root class="h-4 w-2/3" />
  </div>
{:else if name === "Spinner"}
  <div class="flex items-center gap-5">
    <Spinner class="size-4" /><Spinner class="size-6" /><Spinner class="size-9" />
  </div>
{:else if name === "Result"}
  <Empty.Root
    ><Empty.Header
      ><Empty.Media variant="icon"><CheckCircle2 /></Empty.Media><Empty.Title>提交成功</Empty.Title
      ><Empty.Description>结果页可以承载后续操作。</Empty.Description></Empty.Header
    ><Button>返回列表</Button></Empty.Root
  >
{:else if name === "Popconfirm"}
  <Popover.Root
    ><Popover.Trigger><Button variant="destructive">删除记录</Button></Popover.Trigger
    ><Popover.Content
      ><p class="text-sm font-medium">确定删除这条记录？</p>
      <div class="mt-3 flex justify-end gap-2">
        <Button size="sm" variant="ghost">取消</Button><Button size="sm" variant="destructive"
          >确认</Button
        >
      </div></Popover.Content
    ></Popover.Root
  >
{:else}
  <div class="rounded-lg border p-4 text-sm text-muted-foreground">
    <XCircle class="mr-2 inline size-4" />反馈组件状态示例
  </div>
{/if}
