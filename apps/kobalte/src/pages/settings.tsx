/* eslint-disable solid/prefer-for */
import { createSignal, For, Show } from "solid-js"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import { Icon } from "@/icons"
import { Avatar } from "@/ui/avatar"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card"
import { Dialog } from "@/ui/dialog"
import { Select } from "@/ui/select"
import { Separator } from "@/ui/separator"
import { Switch } from "@/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { Tabs } from "@/ui/tabs"
import { TextArea, TextField } from "@/ui/text-field"
import { Combobox } from "@/ui/combobox"
import { toast } from "@/ui/toast"
import { PageHeader, StatusBadge } from "./shared"
import { SegmentedControl } from "@kobalte/core/segmented-control"

export function SettingsPage() {
  const [billingYearly, setBillingYearly] = createSignal(false)
  const [deleteOpen, setDeleteOpen] = createSignal(false)
  const [confirmText, setConfirmText] = createSignal("")
  const [twoFactor, setTwoFactor] = createSignal(false)
  const [profileName, setProfileName] = createSignal("林晓")
  const [profileBio, setProfileBio] = createSignal("负责 Acme Console 的产品与团队协作。")
  const [tab, setTab] = createSignal("profile")
  const save = () => toast.success("设置已保存")
  const price = (value: number | null) => value === null ? "联系我们" : `¥${(billingYearly() ? value * 10 : value).toLocaleString()} / ${billingYearly() ? "年" : "月"}`
  return <div class="space-y-6">
    <PageHeader title="设置" description="管理个人资料、团队、通知与订阅。" />
    <Tabs.Root value={tab()} onChange={setTab} orientation="vertical" class="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)]">
      <Tabs.List class="flex gap-1 overflow-x-auto border-b border-zinc-200 pb-2 md:grid md:h-fit md:border-b-0 md:border-r md:pb-0 md:pr-3 dark:border-zinc-800">
        <For each={[["profile", "个人资料"], ["security", "账号安全"], ["notifications", "通知"], ["team", "团队"], ["billing", "计费"]]}>{(item) => <Tabs.Trigger value={item[0]} class="min-h-10 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm data-[selected]:bg-zinc-100 data-[selected]:font-medium dark:data-[selected]:bg-zinc-800">{item[1]}</Tabs.Trigger>}</For>
      </Tabs.List>
      <div class="min-w-0">
        <Tabs.Content value="profile" class="space-y-5"><Card><CardHeader><CardTitle>个人资料</CardTitle><CardDescription>更新公开资料和偏好设置。</CardDescription></CardHeader><CardContent class="grid gap-5"><div class="flex items-center gap-4"><Avatar name={profileName()} size="lg" /><Button variant="outline"><Icon name="upload" />上传头像</Button></div><TextField label="姓名" value={profileName()} onInput={(event) => setProfileName(event.currentTarget.value)} /><TextArea label="简介" value={profileBio()} onInput={(event) => setProfileBio(event.currentTarget.value)} rows={3} /><div class="grid gap-5 sm:grid-cols-2"><Select label="语言" options={[{ value: "zh", label: "简体中文" }, { value: "en", label: "English" }]} value="zh" /><Combobox label="时区" options={[{ value: "shanghai", label: "Asia/Shanghai" }, { value: "tokyo", label: "Asia/Tokyo" }, { value: "new-york", label: "America/New_York" }]} value="shanghai" /></div><Button onClick={save}>保存更改</Button></CardContent></Card></Tabs.Content>
        <Tabs.Content value="security" class="space-y-5"><Card><CardHeader><CardTitle>修改密码</CardTitle></CardHeader><CardContent class="grid max-w-xl gap-4"><TextField label="当前密码" type="password" /><TextField label="新密码" type="password" /><TextField label="确认新密码" type="password" /><Button onClick={save}>更新密码</Button></CardContent></Card><Card><CardHeader><CardTitle>两步验证</CardTitle><CardDescription>为账号增加额外的登录保护。</CardDescription></CardHeader><CardContent class="space-y-4"><Switch label="启用两步验证" checked={twoFactor()} onChange={setTwoFactor} /><Show when={twoFactor()}><div class="grid size-40 place-items-center rounded-lg border border-zinc-300 bg-[linear-gradient(45deg,#71717a_25%,transparent_25%,transparent_75%,#71717a_75%),linear-gradient(45deg,#71717a_25%,transparent_25%,transparent_75%,#71717a_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px] dark:border-zinc-700"><span class="rounded bg-white px-2 py-1 text-xs dark:bg-zinc-900">QR</span></div></Show></CardContent></Card><Card><CardHeader><CardTitle>活跃会话</CardTitle></CardHeader><CardContent class="grid gap-3"><For each={sessions}>{(session) => <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"><div><p class="font-medium">{session.device}</p><p class="text-sm text-zinc-500 dark:text-zinc-400">{session.location} · {session.time}</p></div><div class="flex items-center gap-2">{session.current ? <Badge>当前</Badge> : <Button size="sm" variant="outline">注销</Button>}</div></div>}</For></CardContent></Card></Tabs.Content>
        <Tabs.Content value="notifications" class="space-y-5"><Card><CardHeader><CardTitle>通知偏好</CardTitle></CardHeader><CardContent class="space-y-5"><Segmented /><Separator /><div class="grid gap-4"><Switch label="订单状态变化" checked /><Switch label="团队动态" checked /><Switch label="产品更新" /></div></CardContent></Card></Tabs.Content>
        <Tabs.Content value="team" class="space-y-5"><Card><CardHeader><CardTitle>团队成员</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>成员</TableHead><TableHead>角色</TableHead><TableHead>最近活跃</TableHead><TableHead /></TableRow></TableHeader><TableBody><For each={team}>{(member) => <TableRow><TableCell><div class="flex items-center gap-2"><Avatar name={member.name} /> <div><p>{member.name}</p><p class="text-xs text-zinc-500 dark:text-zinc-400">{member.email}</p></div></div></TableCell><TableCell><Select options={[{ value: "owner", label: "所有者" }, { value: "admin", label: "管理员" }, { value: "member", label: "成员" }, { value: "viewer", label: "访客" }]} value={member.role} /></TableCell><TableCell>{member.lastActive}</TableCell><TableCell><Button size="sm" variant="ghost">移除</Button></TableCell></TableRow>}</For></TableBody></Table></CardContent></Card><Card><CardHeader><CardTitle>邀请成员</CardTitle></CardHeader><CardContent class="flex flex-col gap-3 sm:flex-row"><TextField label="邮箱地址" placeholder="name@example.com" /><Button class="sm:mt-6">发送邀请</Button></CardContent></Card></Tabs.Content>
        <Tabs.Content value="billing" class="space-y-5"><div class="flex items-center justify-between"><div><h2 class="text-lg font-semibold">订阅计划</h2><p class="text-sm text-zinc-500">选择适合团队的方案。</p></div><Switch label="按年计费（省 2 个月）" checked={billingYearly()} onChange={setBillingYearly} /></div><div class="grid gap-4 lg:grid-cols-3"><For each={plans}>{(plan) => <Card class={plan.recommended ? "border-blue-600 ring-1 ring-blue-600" : ""}><CardHeader><div class="flex items-center justify-between"><CardTitle>{plan.name}</CardTitle>{plan.recommended ? <Badge>推荐</Badge> : null}</div><CardDescription class="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{price(plan.price)}</CardDescription></CardHeader><CardContent class="grid gap-3">{plan.features.map((feature) => <p class="flex items-center gap-2 text-sm"><Icon name="circle-check" class="text-emerald-600" size={16} />{feature}</p>)}<Button variant={plan.recommended ? "primary" : "outline"}>{plan.price === null ? "联系我们" : "选择计划"}</Button></CardContent></Card>}</For></div><Card><CardHeader><CardTitle>发票</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>编号</TableHead><TableHead>日期</TableHead><TableHead>金额</TableHead><TableHead>状态</TableHead></TableRow></TableHeader><TableBody><For each={invoices}>{(invoice) => <TableRow><TableCell>{invoice.id}</TableCell><TableCell>{invoice.date}</TableCell><TableCell>¥{invoice.amount.toLocaleString()}</TableCell><TableCell><StatusBadge value={invoice.status} /></TableCell></TableRow>}</For></TableBody></Table></CardContent></Card></Tabs.Content>
        <Card class="mt-6 border-red-200 dark:border-red-900"><CardHeader><CardTitle class="text-red-600">危险区</CardTitle><CardDescription>删除账号后，所有项目和数据将无法恢复。</CardDescription></CardHeader><CardContent><Button variant="destructive" onClick={() => setDeleteOpen(true)}>删除账号</Button></CardContent></Card>
      </div>
    </Tabs.Root>
    <Dialog.Root open={deleteOpen()} onOpenChange={setDeleteOpen}><Dialog.Portal><Dialog.Overlay class="fixed inset-0 z-50 bg-black/40" /><Dialog.Content class="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"><Dialog.Title class="text-lg font-semibold">确认删除账号</Dialog.Title><Dialog.Description class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">请输入 DELETE 以确认此操作。</Dialog.Description><TextField class="mt-4" label="确认文字" value={confirmText()} onInput={(event) => setConfirmText(event.currentTarget.value)} /><div class="mt-5 flex justify-end gap-2"><Dialog.CloseButton class="rounded-md border px-3 py-2 text-sm">取消</Dialog.CloseButton><Button variant="destructive" disabled={confirmText() !== "DELETE"}>永久删除</Button></div></Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>
}

function Segmented() {
  const [value, setValue] = createSignal("email")
  return <SegmentedControl value={value()} onChange={setValue} class="flex w-fit rounded-md border border-zinc-200 p-1 dark:border-zinc-700">
    <SegmentedControl.Item value="email" class="rounded px-3 py-1.5 text-sm data-[checked]:bg-zinc-900 data-[checked]:text-white dark:data-[checked]:bg-zinc-100 dark:data-[checked]:text-zinc-900"><SegmentedControl.ItemInput /><SegmentedControl.ItemControl><SegmentedControl.ItemLabel>邮件</SegmentedControl.ItemLabel></SegmentedControl.ItemControl></SegmentedControl.Item>
    <SegmentedControl.Item value="push" class="rounded px-3 py-1.5 text-sm data-[checked]:bg-zinc-900 data-[checked]:text-white dark:data-[checked]:bg-zinc-100 dark:data-[checked]:text-zinc-900"><SegmentedControl.ItemInput /><SegmentedControl.ItemControl><SegmentedControl.ItemLabel>推送</SegmentedControl.ItemLabel></SegmentedControl.ItemControl></SegmentedControl.Item>
    <SegmentedControl.Item value="inbox" class="rounded px-3 py-1.5 text-sm data-[checked]:bg-zinc-900 data-[checked]:text-white dark:data-[checked]:bg-zinc-100 dark:data-[checked]:text-zinc-900"><SegmentedControl.ItemInput /><SegmentedControl.ItemControl><SegmentedControl.ItemLabel>站内</SegmentedControl.ItemLabel></SegmentedControl.ItemControl></SegmentedControl.Item>
  </SegmentedControl>
}
