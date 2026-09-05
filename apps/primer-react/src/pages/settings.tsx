import { useEffect, useRef, useState } from "react"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import { ActionList, ActionMenu, Avatar, Banner, Button, ConfirmationDialog, Dialog, FormControl, Heading, IconButton, Label, NavList, Select, SegmentedControl, Text, TextInput, Textarea, ToggleSwitch } from "@primer/react"
import { Table } from "@primer/react/experimental"
import { Icon, iconFor } from "@/lib/icon"
import { avatarFor } from "@/lib/avatar"
import { PageHeader, StatusBadge } from "./shared"

const tabs = [
  { key: "profile", label: "个人资料", icon: "user" },
  { key: "security", label: "账号安全", icon: "shield-check" },
  { key: "notifications", label: "通知偏好", icon: "bell" },
  { key: "team", label: "团队成员", icon: "users" },
  { key: "billing", label: "订阅与账单", icon: "credit-card" },
] as const
type Tab = (typeof tabs)[number]["key"]
const me = team[0]
const roleLabel: Record<string, string> = { owner: "所有者", admin: "管理员", member: "成员", viewer: "只读" }
const notificationRows = [
  { key: "updates", label: "项目更新", description: "项目状态变更、里程碑完成" },
  { key: "billing", label: "账单提醒", description: "发票生成、付款失败" },
  { key: "team", label: "团队活动", description: "成员加入、权限变更" },
  { key: "news", label: "产品新闻", description: "新功能与版本发布" },
]

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="card stack-4">
      <div className="card-header"><Heading as="h2" className="card-title">{title}</Heading>{description ? <Text className="muted">{description}</Text> : null}</div>
      {children}
    </section>
  )
}

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile")
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [twoFactor, setTwoFactor] = useState(true)
  const [channel, setChannel] = useState(0)
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ updates: true, billing: true, team: true, news: false })
  const [members, setMembers] = useState(team)
  const [removing, setRemoving] = useState<(typeof team)[number] | null>(null)
  const [yearly, setYearly] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const passwordButton = useRef<HTMLButtonElement>(null)
  const deleteButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(t)
  }, [toast])

  const current = tabs.find((t) => t.key === tab)!

  return (
    <div className="page-stack">
      <PageHeader title="设置" description="管理你的账户、团队与订阅设置。" />
      <div className="settings-layout">
        <NavList aria-label="设置分类" className="settings-nav desktop-only-block">
          {tabs.map((t) => (
            <NavList.Item key={t.key} href={`#${t.key}`} aria-current={tab === t.key ? "page" : undefined} onClick={(e: React.MouseEvent) => { e.preventDefault(); setTab(t.key) }}>
              <NavList.LeadingVisual><Icon name={t.icon} /></NavList.LeadingVisual>
              {t.label}
            </NavList.Item>
          ))}
        </NavList>
        <div className="mobile-only-block settings-tabs">
          <FormControl>
            <FormControl.Label visuallyHidden>设置分类</FormControl.Label>
            <Select block value={tab} onChange={(e) => setTab(e.target.value as Tab)}>
              {tabs.map((t) => <Select.Option key={t.key} value={t.key}>{t.label}</Select.Option>)}
            </Select>
          </FormControl>
        </div>

        <div className="page-stack min-w-0" id={current.key}>
          {tab === "profile" ? (
            <Section title="个人资料" description="更新你的公开账户信息。">
              <div className="flex items-center gap-3 wrap">
                <Avatar src={avatarFor(me.name)} alt={me.name} size={64} className="avatar-fixed" />
                <div className="min-w-0"><Text as="div" weight="semibold">{me.name}</Text><Text as="div" className="muted">{me.email}</Text><Label style={{ marginTop: 4 }}>{roleLabel[me.role]}</Label></div>
                <div className="ml-auto flex gap-2"><Button leadingVisual={iconFor("upload")}>更换头像</Button><Button variant="invisible">移除</Button></div>
              </div>
              <div className="grid grid-2">
                <FormControl><FormControl.Label>姓名</FormControl.Label><TextInput defaultValue={me.name} block /></FormControl>
                <FormControl><FormControl.Label>邮箱</FormControl.Label><TextInput defaultValue={me.email} block leadingVisual={iconFor("mail")} /></FormControl>
                <FormControl><FormControl.Label>时区</FormControl.Label><Select defaultValue="asia-shanghai" block><Select.Option value="asia-shanghai">Asia/Shanghai (UTC+8)</Select.Option><Select.Option value="utc">UTC</Select.Option><Select.Option value="america-la">America/Los_Angeles</Select.Option></Select></FormControl>
                <FormControl><FormControl.Label>语言</FormControl.Label><Select defaultValue="zh-CN" block><Select.Option value="zh-CN">简体中文</Select.Option><Select.Option value="en">English</Select.Option><Select.Option value="ja">日本語</Select.Option></Select></FormControl>
              </div>
              <FormControl><FormControl.Label>个人简介</FormControl.Label><Textarea block rows={3} maxLength={160} placeholder="介绍一下你自己" /><FormControl.Caption>最多 160 字，将展示在团队目录中。</FormControl.Caption></FormControl>
              <div className="flex justify-between gap-2 wrap"><Button variant="invisible">重置</Button><Button variant="primary" onClick={() => setToast("个人资料已保存")}>保存更改</Button></div>
            </Section>
          ) : null}

          {tab === "security" ? (
            <>
              <Section title="账号安全" description="保护你的账户与登录会话。">
                <div className="flex items-center justify-between gap-3 card">
                  <div><Text as="div" id="password-label" weight="semibold">登录密码</Text><Text as="div" className="muted" size="small">上次修改于 3 个月前，建议定期更换。</Text></div>
                  <Button ref={passwordButton} leadingVisual={iconFor("key")} onClick={() => setPasswordOpen(true)}>修改密码</Button>
                </div>
                <div className="flex items-center justify-between gap-3 card">
                  <div><Text as="div" id="two-factor-label" weight="semibold">双因素认证</Text><Text as="div" className="muted" size="small">登录时要求额外的验证码。</Text></div>
                  <ToggleSwitch aria-labelledby="two-factor-label" checked={twoFactor} onChange={setTwoFactor} />
                </div>
                {twoFactor ? (
                  <div className="qr-row card">
                    <div className="qr-placeholder" role="img" aria-label="二维码占位" />
                    <div className="stack-3 min-w-0">
                      <Text weight="semibold">使用身份验证器扫描</Text>
                      <Text className="muted" size="small">推荐使用 1Password、Google Authenticator 等应用。无法扫描时可手动输入密钥。</Text>
                      <div className="flex gap-2 wrap"><Button size="small" leadingVisual={iconFor("copy")} onClick={() => setToast("密钥已复制")}>复制密钥</Button><Button size="small" variant="invisible">下载恢复码</Button></div>
                    </div>
                  </div>
                ) : null}
              </Section>
              <Section title="登录会话" description="当前已登录的设备。">
                <ActionList>
                  {sessions.map((session) => (
                    <ActionList.Item key={session.device}>
                      <ActionList.LeadingVisual><Icon name={session.device.includes("iPhone") ? "device-mobile" : "terminal"} /></ActionList.LeadingVisual>
                      {session.device}
                      <ActionList.Description variant="block">{session.location} · {session.time}</ActionList.Description>
                      <ActionList.TrailingVisual>{session.current ? <Label variant="success">当前会话</Label> : <Button size="small" variant="invisible" onClick={() => setToast(`已注销 ${session.device}`)}>注销</Button>}</ActionList.TrailingVisual>
                    </ActionList.Item>
                  ))}
                </ActionList>
                <div><Button variant="danger" leadingVisual={iconFor("log-out")} onClick={() => setToast("已注销其他所有设备")}>注销其他所有设备</Button></div>
              </Section>
            </>
          ) : null}

          {tab === "notifications" ? (
            <Section title="通知偏好" description="选择你希望接收的通知与渠道。">
              <FormControl>
                <FormControl.Label>通知渠道</FormControl.Label>
                <SegmentedControl aria-label="通知渠道" onChange={setChannel}>
                  <SegmentedControl.Button selected={channel === 0} leadingVisual={iconFor("mail")}>邮件</SegmentedControl.Button>
                  <SegmentedControl.Button selected={channel === 1} leadingVisual={iconFor("bell")}>站内</SegmentedControl.Button>
                  <SegmentedControl.Button selected={channel === 2} leadingVisual={iconFor("device-mobile")}>推送</SegmentedControl.Button>
                </SegmentedControl>
              </FormControl>
              <div className="stack-3">
                {notificationRows.map((row) => (
                  <div className="flex items-center justify-between gap-3 pref-row" key={row.key}>
                    <div><Text as="div" id={`pref-${row.key}`} weight="semibold">{row.label}</Text><Text as="div" className="muted" size="small">{row.description}</Text></div>
                    <ToggleSwitch size="small" aria-labelledby={`pref-${row.key}`} checked={prefs[row.key]} onChange={(on) => setPrefs({ ...prefs, [row.key]: on })} />
                  </div>
                ))}
              </div>
              <FormControl><FormControl.Label>免打扰时段</FormControl.Label><div className="flex items-center gap-2 range-row"><TextInput type="time" defaultValue="22:00" aria-label="开始" /><Text className="muted">至</Text><TextInput type="time" defaultValue="08:00" aria-label="结束" /></div><FormControl.Caption>该时段内仅接收紧急告警。</FormControl.Caption></FormControl>
              <div><Button variant="primary" onClick={() => setToast("通知偏好已保存")}>保存偏好</Button></div>
            </Section>
          ) : null}

          {tab === "team" ? (
            <Section title="团队成员" description={`${members.length} 位成员 · 管理团队访问权限。`}>
              <div className="flex items-center justify-between gap-2 wrap">
                <TextInput aria-label="搜索成员" placeholder="搜索成员" leadingVisual={iconFor("search")} />
                <Button variant="primary" leadingVisual={iconFor("plus")}>邀请成员</Button>
              </div>
              <div className="table-scroll">
                <Table aria-label="团队成员" gridTemplateColumns="minmax(200px, 1.5fr) minmax(130px, auto) minmax(120px, auto) 48px">
                  <Table.Head><Table.Row><Table.Header>成员</Table.Header><Table.Header>角色</Table.Header><Table.Header>最近活跃</Table.Header><Table.Header><span className="sr-only">操作</span></Table.Header></Table.Row></Table.Head>
                  <Table.Body>
                    {members.map((member) => (
                      <Table.Row key={member.email}>
                        <Table.Cell><div className="flex items-center gap-2"><Avatar src={avatarFor(member.name)} alt="" size={32} className="avatar-fixed" /><div className="min-w-0"><Text as="div" className="truncate">{member.name}</Text><Text as="div" size="small" className="muted truncate">{member.email}</Text></div></div></Table.Cell>
                        <Table.Cell>
                          <Select aria-label={`${member.name} 的角色`} size="small" defaultValue={member.role} disabled={member.role === "owner"}>
                            {Object.entries(roleLabel).map(([value, label]) => <Select.Option key={value} value={value}>{label}</Select.Option>)}
                          </Select>
                        </Table.Cell>
                        <Table.Cell>{member.lastActive}</Table.Cell>
                        <Table.Cell>
                          <ActionMenu>
                            <ActionMenu.Anchor><IconButton size="small" variant="invisible" aria-label={`${member.name} 更多操作`} icon={iconFor("kebab-horizontal")} /></ActionMenu.Anchor>
                            <ActionMenu.Overlay align="end">
                              <ActionList>
                                <ActionList.Item onSelect={() => setToast(`已向 ${member.name} 重新发送邀请`)}>重新发送邀请</ActionList.Item>
                                <ActionList.Item variant="danger" disabled={member.role === "owner"} onSelect={() => setRemoving(member)}>移出团队</ActionList.Item>
                              </ActionList>
                            </ActionMenu.Overlay>
                          </ActionMenu>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </Section>
          ) : null}

          {tab === "billing" ? (
            <>
              <Section title="订阅方案" description="当前方案与可选升级。">
                <div className="flex items-center gap-2">
                  <Text weight="semibold" id="billing-cycle-label">按年付费</Text>
                  <ToggleSwitch size="small" aria-labelledby="billing-cycle-label" checked={yearly} onChange={setYearly} />
                  <Label variant="success">省 20%</Label>
                </div>
                <div className="grid grid-3">
                  {plans.map((plan) => {
                    const currentPlan = plan.name === "Pro"
                    const price = plan.price === null ? "定制" : plan.price === 0 ? "免费" : `¥${yearly ? Math.round(plan.price * 12 * 0.8) : plan.price}`
                    return (
                      <div className={`card plan-card${currentPlan ? " selected" : ""}`} key={plan.name}>
                        <div className="flex items-center justify-between gap-2"><Text weight="semibold">{plan.name}</Text>{currentPlan ? <Label variant="accent">当前方案</Label> : plan.recommended ? <Label variant="success">推荐</Label> : null}</div>
                        <Heading as="h3" style={{ fontSize: 28, margin: "8px 0" }}>{price}{plan.price ? <Text className="muted" size="small" weight="normal">{yearly ? " /年" : " /月"}</Text> : null}</Heading>
                        <ul className="check-list">{plan.features.map((f) => <li key={f}><Icon name="check" size={14} />{f}</li>)}</ul>
                        <Button block variant={currentPlan ? "default" : "primary"} disabled={currentPlan}>{currentPlan ? "已订阅" : plan.price === null ? "联系销售" : "升级"}</Button>
                      </div>
                    )
                  })}
                </div>
              </Section>
              <Section title="发票记录" description="最近的账单与付款状态。">
                <div className="table-scroll">
                  <Table aria-label="发票记录" gridTemplateColumns="minmax(120px, 1fr) minmax(120px, 1fr) auto auto 48px">
                    <Table.Head><Table.Row><Table.Header>编号</Table.Header><Table.Header>日期</Table.Header><Table.Header>状态</Table.Header><Table.Header align="end">金额</Table.Header><Table.Header><span className="sr-only">下载</span></Table.Header></Table.Row></Table.Head>
                    <Table.Body>
                      {invoices.map((invoice) => (
                        <Table.Row key={invoice.id}>
                          <Table.Cell scope="row"><span className="mono">{invoice.id}</span></Table.Cell>
                          <Table.Cell>{invoice.date}</Table.Cell>
                          <Table.Cell><StatusBadge value={invoice.status} /></Table.Cell>
                          <Table.Cell align="end">¥{invoice.amount}</Table.Cell>
                          <Table.Cell><IconButton size="small" variant="invisible" aria-label={`下载 ${invoice.id}`} icon={iconFor("download")} /></Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              </Section>
              <section className="card danger-zone stack-4" aria-labelledby="danger-title">
                <div className="card-header"><Heading as="h2" id="danger-title" className="card-title" style={{ color: "var(--fgColor-danger)" }}>危险区</Heading><Text className="muted">以下操作不可逆，请谨慎执行。</Text></div>
                <div className="flex items-center justify-between gap-3 wrap">
                  <div><Text as="div" weight="semibold">转移所有权</Text><Text as="div" className="muted" size="small">将团队所有权转移给其他管理员。</Text></div>
                  <Button>转移所有权</Button>
                </div>
                <div className="flex items-center justify-between gap-3 wrap">
                  <div><Text as="div" weight="semibold">删除账户</Text><Text as="div" className="muted" size="small">永久删除账户、团队与全部数据。</Text></div>
                  <Button ref={deleteButton} variant="danger" leadingVisual={iconFor("trash")} onClick={() => setDeleteOpen(true)}>删除账户</Button>
                </div>
              </section>
            </>
          ) : null}
        </div>
      </div>

      {passwordOpen ? (
        <Dialog title="修改密码" subtitle="设置一个新的账户密码。" returnFocusRef={passwordButton} onClose={() => setPasswordOpen(false)} footerButtons={[{ content: "取消", buttonType: "default", onClick: () => setPasswordOpen(false) }, { content: "保存", buttonType: "primary", onClick: () => { setPasswordOpen(false); setToast("密码已更新") } }]}>
          <div className="stack-3">
            <FormControl required><FormControl.Label>当前密码</FormControl.Label><TextInput type="password" autoComplete="current-password" block /></FormControl>
            <FormControl required><FormControl.Label>新密码</FormControl.Label><TextInput type="password" autoComplete="new-password" block /><FormControl.Caption>至少 8 位，包含字母和数字。</FormControl.Caption></FormControl>
            <FormControl required><FormControl.Label>确认新密码</FormControl.Label><TextInput type="password" autoComplete="new-password" block /></FormControl>
          </div>
        </Dialog>
      ) : null}

      {deleteOpen ? (
        <Dialog title="删除账户" subtitle="此操作不可撤销" returnFocusRef={deleteButton} onClose={() => { setDeleteOpen(false); setConfirmText("") }} footerButtons={[{ content: "取消", buttonType: "default", onClick: () => { setDeleteOpen(false); setConfirmText("") } }, { content: "永久删除", buttonType: "danger", disabled: confirmText !== me.email, onClick: () => { setDeleteOpen(false); setConfirmText(""); setToast("账户删除请求已提交") } }]}>
          <div className="stack-3">
            <Banner variant="critical" title="所有项目、订单与团队数据都将被永久删除。" hideTitle={false} />
            <FormControl required><FormControl.Label>请输入你的邮箱 <span className="mono">{me.email}</span> 以确认</FormControl.Label><TextInput block value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={me.email} /></FormControl>
          </div>
        </Dialog>
      ) : null}

      {removing ? (
        <ConfirmationDialog title={`将 ${removing.name} 移出团队？`} confirmButtonType="danger" confirmButtonContent="移出" cancelButtonContent="取消" onClose={(gesture) => { if (gesture === "confirm") { setMembers(members.filter((m) => m.email !== removing.email)); setToast(`${removing.name} 已移出团队`) } setRemoving(null) }}>
          该成员将立即失去所有项目的访问权限。
        </ConfirmationDialog>
      ) : null}

      {toast ? <div className="toast" role="status" aria-live="polite"><Banner variant="success" title={toast} hideTitle={false} onDismiss={() => setToast(null)} /></div> : null}
    </div>
  )
}
