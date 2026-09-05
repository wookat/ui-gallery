<script lang="ts">
  import { Camera, Lock, Trash2 } from "@lucide/svelte"
  import sessions from "@ui-gallery/spec/mock/sessions.json"
  import team from "@ui-gallery/spec/mock/team.json"
  import plans from "@ui-gallery/spec/mock/plans.json"
  import invoices from "@ui-gallery/spec/mock/invoices.json"
  import { Button } from "$lib/components/ui/button"
  import * as Card from "$lib/components/ui/card"
  import * as Avatar from "$lib/components/ui/avatar"
  import * as Tabs from "$lib/components/ui/tabs"
  import * as Switch from "$lib/components/ui/switch"
  import * as Dialog from "$lib/components/ui/alert-dialog"
  import * as Badge from "$lib/components/ui/badge"
  let tab = $state("profile"),
    dangerOpen = $state(false),
    confirmText = $state("")
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-semibold">设置</h1>
    <p class="text-sm text-muted-foreground">管理个人资料、团队和账单。</p>
  </div>
  <Tabs.Root bind:value={tab} class="items-start md:flex-row"
    ><Tabs.List
      class="h-auto w-full shrink-0 justify-start overflow-x-auto md:h-fit md:w-44 md:flex-col md:items-stretch [&>[data-slot=tabs-trigger]]:shrink-0 md:[&>[data-slot=tabs-trigger]]:w-full"
      ><Tabs.Trigger value="profile">个人资料</Tabs.Trigger><Tabs.Trigger value="security"
        >账号安全</Tabs.Trigger
      ><Tabs.Trigger value="notifications">通知</Tabs.Trigger><Tabs.Trigger value="team"
        >团队</Tabs.Trigger
      ><Tabs.Trigger value="billing">计费</Tabs.Trigger></Tabs.List
    >
    <div class="min-w-0 flex-1">
      <Tabs.Content value="profile"
        ><Card.Root
          ><Card.Header
            ><Card.Title>个人资料</Card.Title><Card.Description
              >更新你的头像和个人信息。</Card.Description
            ></Card.Header
          ><Card.Content class="space-y-5"
            ><div class="flex items-center gap-4">
              <Avatar.Root class="size-16"><Avatar.Fallback>AC</Avatar.Fallback></Avatar.Root
              ><Button variant="outline"><Camera class="mr-2 size-4" />上传头像</Button>
            </div>
            <label class="block space-y-2 text-sm font-medium"
              >姓名<input class="h-9 w-full rounded-md border px-3" value="Acme Team" /></label
            ><label class="block space-y-2 text-sm font-medium"
              >简介<textarea class="min-h-24 w-full rounded-md border p-3"
                >负责 Acme Console 的团队协作。</textarea
              ></label
            >
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="space-y-2 text-sm font-medium"
                >语言<select class="h-9 w-full rounded-md border bg-background px-3"
                  ><option>简体中文</option><option>English</option></select
                ></label
              ><label class="space-y-2 text-sm font-medium"
                >时区<select class="h-9 w-full rounded-md border bg-background px-3"
                  ><option>Asia/Shanghai</option><option>America/Los_Angeles</option></select
                ></label
              >
            </div></Card.Content
          ><Card.Footer><Button>保存更改</Button></Card.Footer></Card.Root
        ></Tabs.Content
      >
      <Tabs.Content value="security"
        ><div class="space-y-4">
          <Card.Root
            ><Card.Header><Card.Title>账号安全</Card.Title></Card.Header><Card.Content
              class="space-y-4"
              ><label class="block space-y-2 text-sm"
                >当前密码<input type="password" class="h-9 w-full rounded-md border px-3" /></label
              ><label class="block space-y-2 text-sm"
                >新密码<input type="password" class="h-9 w-full rounded-md border px-3" /></label
              ><Button>修改密码</Button>
              <div class="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p class="font-medium">两步验证</p>
                  <p class="text-sm text-muted-foreground">为账号增加额外保护。</p>
                </div>
                <Switch.Root />
              </div>
              <div
                class="flex size-32 items-center justify-center border-4 border-foreground bg-muted text-center text-xs"
              >
                二维码占位
              </div></Card.Content
            ></Card.Root
          ><Card.Root
            ><Card.Header><Card.Title>活跃会话</Card.Title></Card.Header><Card.Content
              class="space-y-3"
              >{#each sessions as session}<div
                  class="flex items-center justify-between border-b py-3 last:border-0"
                >
                  <div>
                    <p class="font-medium">{session.device}</p>
                    <p class="text-xs text-muted-foreground">{session.location} · {session.time}</p>
                  </div>
                  <Button variant="outline" size="sm">注销</Button>
                </div>{/each}</Card.Content
            ></Card.Root
          >
        </div></Tabs.Content
      >
      <Tabs.Content value="notifications"
        ><Card.Root
          ><Card.Header><Card.Title>通知偏好</Card.Title></Card.Header><Card.Content
            class="space-y-1"
            >{#each ["产品更新", "团队活动", "安全提醒", "账单通知"] as item}<div
                class="flex items-center justify-between border-b py-4 last:border-0"
              >
                <span>{item}</span><Switch.Root />
              </div>{/each}
            <div class="pt-4">
              <p class="mb-3 text-sm font-medium">接收方式</p>
              <div class="flex gap-2">
                <Button variant="secondary">邮件</Button><Button variant="outline">推送</Button
                ><Button variant="outline">站内</Button>
              </div>
            </div></Card.Content
          ></Card.Root
        ></Tabs.Content
      >
      <Tabs.Content value="team"
        ><Card.Root
          ><Card.Header
            ><Card.Title>团队成员</Card.Title><Card.Description>管理团队权限。</Card.Description
            ></Card.Header
          ><Card.Content
            ><div class="mb-4 flex gap-2">
              <input
                class="h-9 flex-1 rounded-md border px-3 text-sm"
                placeholder="输入邮箱邀请成员"
              /><Button>邀请</Button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <tbody
                  >{#each team as member}<tr class="border-b last:border-0"
                      ><td class="py-3"
                        ><div class="flex items-center gap-2">
                          <Avatar.Root class="size-8"
                            ><Avatar.Fallback>{member.name.slice(0, 1)}</Avatar.Fallback
                            ></Avatar.Root
                          >{member.name}
                        </div></td
                      ><td>{member.email}</td><td
                        ><select class="rounded border bg-background px-2 py-1"
                          ><option>{member.role}</option><option>成员</option></select
                        ></td
                      ><td class="text-right"><Button variant="ghost" size="sm">移除</Button></td
                      ></tr
                    >{/each}</tbody
                >
              </table>
            </div></Card.Content
          ></Card.Root
        ></Tabs.Content
      >
      <Tabs.Content value="billing"
        ><div class="space-y-4">
          <Card.Root
            ><Card.Header><Card.Title>当前计划</Card.Title></Card.Header><Card.Content
              ><div class="flex items-center justify-between">
                <div>
                  <p class="text-2xl font-bold">Pro</p>
                  <p class="text-sm text-muted-foreground">适合成长中的团队</p>
                </div>
                <Badge.Root>当前计划</Badge.Root>
              </div></Card.Content
            ></Card.Root
          >
          <div class="grid gap-4 md:grid-cols-3">
            {#each plans as plan}<Card.Root class={plan.recommended ? "border-primary" : ""}
                ><Card.Header
                  ><Card.Title>{plan.name}</Card.Title>{#if plan.recommended}<Badge.Root
                      >推荐</Badge.Root
                    >{/if}</Card.Header
                ><Card.Content
                  ><p class="mb-4 text-2xl font-bold">
                    ¥{plan.price}<span class="text-sm font-normal text-muted-foreground">/月</span>
                  </p>
                  <ul class="space-y-2 text-sm">
                    {#each plan.features as feature}<li>✓ {feature}</li>{/each}
                  </ul></Card.Content
                ></Card.Root
              >{/each}
          </div>
          <Card.Root
            ><Card.Header><Card.Title>发票记录</Card.Title></Card.Header><Card.Content
              ><div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead
                    ><tr class="border-b text-left"
                      ><th class="py-2">编号</th><th>日期</th><th>金额</th><th>状态</th></tr
                    ></thead
                  ><tbody
                    >{#each invoices as invoice}<tr class="border-b last:border-0"
                        ><td class="py-2">{invoice.id}</td><td>{invoice.date}</td><td
                          >{invoice.amount}</td
                        ><td>{invoice.status}</td></tr
                      >{/each}</tbody
                  >
                </table>
              </div></Card.Content
            ></Card.Root
          >
        </div></Tabs.Content
      >
    </div></Tabs.Root
  >
  <Card.Root class="border-destructive"
    ><Card.Header
      ><Card.Title class="text-destructive">危险区域</Card.Title><Card.Description
        >删除账号后所有数据无法恢复。</Card.Description
      ></Card.Header
    ><Card.Footer
      ><Button variant="destructive" onclick={() => (dangerOpen = true)}
        ><Trash2 class="mr-2 size-4" />删除账号</Button
      ></Card.Footer
    ></Card.Root
  >
</div>
<Dialog.Root bind:open={dangerOpen}
  ><Dialog.Content
    ><Dialog.Header
      ><Dialog.Title>确认删除账号</Dialog.Title><Dialog.Description
        >请输入 DELETE 以确认。</Dialog.Description
      ></Dialog.Header
    ><input
      bind:value={confirmText}
      class="h-9 w-full rounded-md border px-3"
      placeholder="DELETE"
    /><Dialog.Footer
      ><Dialog.Cancel>取消</Dialog.Cancel><Dialog.Action disabled={confirmText !== "DELETE"}
        >确认删除</Dialog.Action
      ></Dialog.Footer
    ></Dialog.Content
  ></Dialog.Root
>
