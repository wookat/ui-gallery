<script lang="ts">
  import { Avatar, Dialog, Portal, Tabs } from "@skeletonlabs/skeleton-svelte"
  import team from "@ui-gallery/spec/mock/team.json"
  import sessions from "@ui-gallery/spec/mock/sessions.json"
  import invoices from "@ui-gallery/spec/mock/invoices.json"
  import plans from "@ui-gallery/spec/mock/plans.json"
  import Icon from "../lib/Icon.svelte"
  import StatusBadge from "../lib/StatusBadge.svelte"
  import { initials, money } from "../lib/format"
  import { toaster } from "../lib/toaster"

  const me = team[0]
  const currentPlan = plans.find((p) => p.recommended) ?? plans[0]

  let tab = $state("profile")
  let name = $state(me.name)
  let email = $state(me.email)
  let bio = $state("")
  let twoFactor = $state(true)
  let notif = $state({ orderEmail: true, orderPush: true, weekly: false, marketing: false, security: true })
  let inviteEmail = $state("")
  let inviteRole = $state("member")
  let members = $state([...team])
  let deleteOpen = $state(false)
  let confirmText = $state("")
  let saving = $state(false)

  const roles: Record<string, string> = { owner: "所有者", admin: "管理员", member: "成员", viewer: "只读" }

  async function save() {
    saving = true
    await new Promise((r) => setTimeout(r, 600))
    saving = false
    toaster.success({ title: "已保存", description: "个人资料已更新" })
  }
  function invite(event: SubmitEvent) {
    event.preventDefault()
    if (!inviteEmail.includes("@")) return
    members = [...members, { name: inviteEmail.split("@")[0], email: inviteEmail, role: inviteRole, lastActive: "已邀请" }]
    toaster.success({ title: "邀请已发送", description: inviteEmail })
    inviteEmail = ""
  }
  function removeMember(email: string) {
    members = members.filter((m) => m.email !== email)
    toaster.warning({ title: "成员已移除", description: email })
  }
  function deleteAccount() {
    deleteOpen = false
    toaster.error({ title: "账号已计划删除", description: "30 天内可恢复" })
  }
</script>

<header>
  <h1 class="h3">设置</h1>
  <p class="text-sm opacity-70">管理你的账号、团队与计费信息。</p>
</header>

<Tabs value={tab} onValueChange={(d) => (tab = d.value)} class="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
  <Tabs.List class="flex-nowrap overflow-x-auto whitespace-nowrap lg:overflow-visible lg:flex-col lg:items-stretch lg:border-0">
    <Tabs.Trigger value="profile" class="shrink-0 lg:justify-start gap-2"><Icon name="user" />个人资料</Tabs.Trigger>
    <Tabs.Trigger value="security" class="shrink-0 lg:justify-start gap-2"><Icon name="shield" />账号安全</Tabs.Trigger>
    <Tabs.Trigger value="notifications" class="shrink-0 lg:justify-start gap-2"><Icon name="bell" />通知</Tabs.Trigger>
    <Tabs.Trigger value="team" class="shrink-0 lg:justify-start gap-2"><Icon name="users" />团队</Tabs.Trigger>
    <Tabs.Trigger value="billing" class="shrink-0 lg:justify-start gap-2"><Icon name="credit-card" />计费</Tabs.Trigger>
    <Tabs.Indicator class="lg:hidden" />
  </Tabs.List>

  <div class="min-w-0">
    <Tabs.Content value="profile" class="space-y-4">
      <section class="card bg-surface-50-950 border border-surface-200-800 p-5 space-y-5">
        <h2 class="h5">个人资料</h2>
        <div class="flex items-center gap-4">
          <Avatar class="size-20"><Avatar.Fallback class="preset-filled-secondary-500 text-2xl">{initials(name)}</Avatar.Fallback></Avatar>
          <div class="space-y-2">
            <div class="flex gap-2">
              <button type="button" class="btn btn-sm preset-outlined-surface-500"><Icon name="upload" />上传头像</button>
              <button type="button" class="btn btn-sm hover:preset-tonal">移除</button>
            </div>
            <p class="text-xs opacity-60">支持 JPG、PNG，最大 2MB</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="label"><span class="label-text">姓名</span><input class="input" bind:value={name} /></label>
          <label class="label"><span class="label-text">邮箱</span><input class="input" type="email" bind:value={email} /></label>
          <label class="label"><span class="label-text">角色</span><input class="input" value={roles[me.role]} disabled /></label>
          <label class="label"><span class="label-text">时区</span>
            <select class="select"><option>Asia/Shanghai (UTC+8)</option><option>Asia/Tokyo (UTC+9)</option><option>UTC</option></select>
          </label>
        </div>
        <label class="label"><span class="label-text">个人简介</span><textarea class="textarea" rows="3" bind:value={bio} placeholder="介绍一下你自己…"></textarea></label>
        <footer class="flex justify-end gap-2">
          <button type="button" class="btn hover:preset-tonal">取消</button>
          <button type="button" class="btn preset-filled-primary-500" onclick={save} disabled={saving}>{#if saving}<Icon name="loader" class="animate-spin" />{/if}保存更改</button>
        </footer>
      </section>
    </Tabs.Content>

    <Tabs.Content value="security" class="space-y-4">
      <section class="card bg-surface-50-950 border border-surface-200-800 p-5 space-y-4">
        <h2 class="h5">修改密码</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label class="label"><span class="label-text">当前密码</span><input class="input" type="password" autocomplete="current-password" /></label>
          <label class="label"><span class="label-text">新密码</span><input class="input" type="password" autocomplete="new-password" /></label>
          <label class="label"><span class="label-text">确认新密码</span><input class="input" type="password" autocomplete="new-password" /></label>
        </div>
        <div class="flex justify-end"><button type="button" class="btn preset-filled-primary-500" onclick={() => toaster.success({ title: "密码已更新" })}>更新密码</button></div>
      </section>
      <section class="card bg-surface-50-950 border border-surface-200-800 p-5 space-y-3">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="h5">两步验证</h2>
            <p class="text-sm opacity-70">登录时需要额外输入验证码，提升账号安全性。</p>
          </div>
          <input class="switch" type="checkbox" role="switch" bind:checked={twoFactor} aria-label="两步验证" />
        </div>
        {#if twoFactor}<div class="card preset-tonal-success p-3 text-sm flex items-center gap-2"><Icon name="circle-check" />已启用（验证器应用）</div>{/if}
      </section>
      <section class="card bg-surface-50-950 border border-surface-200-800 p-5 space-y-3">
        <h2 class="h5">活跃会话</h2>
        <ul class="divide-y divide-surface-200-800">
          {#each sessions as s (s.device)}
            <li class="py-3 flex items-center gap-3">
              <Icon name={s.device.includes("iPhone") || s.device.includes("Android") ? "smartphone" : "globe"} class="size-5 opacity-60" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{s.device} {#if s.current}<span class="badge preset-tonal-success ml-1">当前</span>{/if}</p>
                <p class="text-xs opacity-60">{s.location} · {s.time}</p>
              </div>
              {#if !s.current}<button type="button" class="btn btn-sm preset-outlined-error-500" onclick={() => toaster.info({ title: "会话已注销", description: s.device })}>注销</button>{/if}
            </li>
          {/each}
        </ul>
      </section>
      <section class="card border-2 border-error-500 p-5 space-y-3">
        <h2 class="h5 text-error-500">危险区</h2>
        <p class="text-sm opacity-70">删除账号将永久移除所有数据，且无法恢复。</p>
        <button type="button" class="btn preset-filled-error-500" onclick={() => (deleteOpen = true)}><Icon name="trash" />删除账号</button>
      </section>
    </Tabs.Content>

    <Tabs.Content value="notifications" class="space-y-4">
      <section class="card bg-surface-50-950 border border-surface-200-800 p-5 space-y-1">
        <h2 class="h5 mb-3">通知偏好</h2>
        {#each [
          ["orderEmail", "订单邮件", "新订单、退款与支付失败时发送邮件"],
          ["orderPush", "订单推送", "浏览器与移动端即时推送"],
          ["weekly", "每周摘要", "每周一发送上周数据摘要"],
          ["marketing", "产品动态", "新功能与最佳实践"],
          ["security", "安全提醒", "异常登录与密码更改（建议开启）"],
        ] as const as [key, label, desc] (key)}
          <label class="flex items-center justify-between gap-4 py-3 border-b border-surface-200-800 last:border-0">
            <span><span class="block text-sm font-medium">{label}</span><span class="block text-xs opacity-60">{desc}</span></span>
            <input class="switch" type="checkbox" role="switch" bind:checked={notif[key]} />
          </label>
        {/each}
      </section>
    </Tabs.Content>

    <Tabs.Content value="team" class="space-y-4">
      <section class="card bg-surface-50-950 border border-surface-200-800 p-5 space-y-4">
        <h2 class="h5">邀请成员</h2>
        <form class="flex flex-col sm:flex-row gap-2" onsubmit={invite}>
          <input class="input flex-1" type="email" placeholder="colleague@example.com" bind:value={inviteEmail} required />
          <select class="select sm:w-32" bind:value={inviteRole}>
            <option value="admin">管理员</option><option value="member">成员</option><option value="viewer">只读</option>
          </select>
          <button type="submit" class="btn preset-filled-primary-500"><Icon name="send" />发送邀请</button>
        </form>
      </section>
      <section class="card bg-surface-50-950 border border-surface-200-800 overflow-hidden">
        <header class="p-4 border-b border-surface-200-800 flex items-center justify-between"><h2 class="h5">成员（{members.length}）</h2></header>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>成员</th><th class="hidden sm:table-cell">角色</th><th class="hidden md:table-cell">最近活跃</th><th class="text-right">操作</th></tr></thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
              {#each members as m (m.email)}
                <tr>
                  <td>
                    <div class="flex items-center gap-2">
                      <Avatar class="size-8"><Avatar.Fallback class="preset-filled-secondary-500 text-xs">{initials(m.name)}</Avatar.Fallback></Avatar>
                      <div class="min-w-0"><p class="font-medium truncate">{m.name}</p><p class="text-xs opacity-60 truncate">{m.email}</p></div>
                    </div>
                  </td>
                  <td class="hidden sm:table-cell"><span class="badge {m.role === 'owner' ? 'preset-filled-primary-500' : 'preset-tonal'}">{roles[m.role] ?? m.role}</span></td>
                  <td class="hidden md:table-cell opacity-70">{m.lastActive}</td>
                  <td class="text-right">
                    {#if m.role !== "owner"}<button type="button" class="btn btn-sm hover:preset-tonal-error" onclick={() => removeMember(m.email)}>移除</button>{/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    </Tabs.Content>

    <Tabs.Content value="billing" class="space-y-4">
      <section class="card bg-surface-50-950 border border-surface-200-800 p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="h5">当前套餐：{currentPlan.name}</h2>
            <p class="text-sm opacity-70">{currentPlan.price === null ? "联系销售" : `${money(currentPlan.price)} / 月`} · 下次扣费 {invoices[0].date}</p>
          </div>
          <button type="button" class="btn preset-outlined-surface-500">更换套餐</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          {#each plans as p (p.name)}
            <div class="card p-4 border {p.name === currentPlan.name ? 'border-primary-500 preset-tonal-primary' : 'border-surface-200-800'} space-y-2">
              <div class="flex items-center justify-between"><span class="font-medium">{p.name}</span>{#if p.recommended}<span class="badge preset-filled-primary-500">推荐</span>{/if}</div>
              <p class="text-2xl font-bold">{p.price === null ? "定制" : money(p.price)}</p>
              <ul class="text-sm opacity-80 space-y-1">{#each p.features as f (f)}<li class="flex gap-2"><Icon name="check" class="size-4 text-success-500 shrink-0" />{f}</li>{/each}</ul>
            </div>
          {/each}
        </div>
      </section>
      <section class="card bg-surface-50-950 border border-surface-200-800 overflow-hidden">
        <header class="p-4 border-b border-surface-200-800"><h2 class="h5">发票</h2></header>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>编号</th><th>日期</th><th>状态</th><th class="text-right">金额</th><th class="text-right"><span class="sr-only">下载</span></th></tr></thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
              {#each invoices as inv (inv.id)}
                <tr>
                  <td class="font-mono text-xs">{inv.id}</td>
                  <td>{inv.date}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td class="text-right tabular-nums">{money(inv.amount)}</td>
                  <td class="text-right"><button type="button" class="btn-icon min-w-10 min-h-10 hover:preset-tonal" aria-label="下载发票"><Icon name="download" /></button></td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
    </Tabs.Content>
  </div>
</Tabs>

<Dialog open={deleteOpen} onOpenChange={(d) => (deleteOpen = d.open)} role="alertdialog">
  <Portal>
    <Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
    <Dialog.Positioner class="fixed inset-0 z-50 grid place-items-center p-4">
      <Dialog.Content class="card bg-surface-50-950 p-6 w-full max-w-md space-y-4 shadow-xl">
        <Dialog.Title class="h5 text-error-500">删除账号</Dialog.Title>
        <Dialog.Description class="text-sm opacity-70">此操作不可撤销。请输入 <code class="code">DELETE</code> 以确认。</Dialog.Description>
        <input class="input" bind:value={confirmText} placeholder="DELETE" />
        <div class="flex justify-end gap-2">
          <Dialog.CloseTrigger class="btn preset-tonal">取消</Dialog.CloseTrigger>
          <button type="button" class="btn preset-filled-error-500" disabled={confirmText !== "DELETE"} onclick={deleteAccount}>永久删除</button>
        </div>
      </Dialog.Content>
    </Dialog.Positioner>
  </Portal>
</Dialog>
