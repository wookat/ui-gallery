import { useState } from "react"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import {
  Avatar,
  Badge,
  Body1,
  Button,
  Caption1,
  Card,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Field,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Option,
  Radio,
  RadioGroup,
  Switch,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
  Textarea,
  Title3,
  Toast,
  ToastTitle,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  useToastController,
} from "@fluentui/react-components"
import { Icon } from "@/lib/icon"
import { Money, PageHeader, SectionCard, StatusBadge, useIsMobile, useLayoutStyles } from "./shared"

const useStyles = makeStyles({
  layout: { display: "grid", gap: tokens.spacingHorizontalL, gridTemplateColumns: "200px minmax(0, 1fr)", "@media (max-width: 1023px)": { gridTemplateColumns: "minmax(0, 1fr)" } },
  side: { position: "sticky", top: "72px", alignSelf: "start" },
  grid: { display: "grid", gap: tokens.spacingHorizontalM, gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" },
  danger: { border: `1px solid ${tokens.colorPaletteRedBorder1}` },
  plan: { padding: tokens.spacingHorizontalL, display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS, height: "100%" },
  planActive: { ...shorthands.borderColor(tokens.colorBrandStroke1), boxShadow: `0 0 0 1px ${tokens.colorBrandStroke1}` },
  switchRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: tokens.spacingHorizontalM, padding: `${tokens.spacingVerticalS} 0`, borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, ":last-child": { borderBottom: "none" } },
})

const sections = [
  { key: "profile", label: "个人资料", icon: "user" },
  { key: "security", label: "安全", icon: "shield" },
  { key: "notifications", label: "通知", icon: "bell" },
  { key: "team", label: "团队", icon: "users" },
  { key: "billing", label: "计费", icon: "credit-card" },
]
const roleLabel: Record<string, string> = { owner: "所有者", admin: "管理员", member: "成员", viewer: "只读" }

export function SettingsPage() {
  const s = useStyles()
  const l = useLayoutStyles()
  const isMobile = useIsMobile()
  const { dispatchToast } = useToastController("acme-toaster")
  const [section, setSection] = useState("profile")
  const [twoFactor, setTwoFactor] = useState(true)
  const [digest, setDigest] = useState("daily")
  const [confirmText, setConfirmText] = useState("")
  const [inviteOpen, setInviteOpen] = useState(false)
  const notify = (title: string) => dispatchToast(<Toast><ToastTitle>{title}</ToastTitle></Toast>, { intent: "success" })

  const nav = (
    <TabList vertical={!isMobile} selectedValue={section} onTabSelect={(_, d) => setSection(String(d.value))} className={isMobile ? undefined : s.side} size={isMobile ? "small" : "medium"} style={isMobile ? { overflowX: "auto", flexWrap: "nowrap" } : undefined}>
      {sections.map((item) => <Tab key={item.key} value={item.key} icon={<Icon name={item.icon} size={18} />}>{item.label}</Tab>)}
    </TabList>
  )

  return (
    <div className={l.stack}>
      <PageHeader title="设置" description="管理账户、团队与订阅。" />
      <div className={s.layout}>
        {nav}
        <div className={l.stack}>
          {section === "profile" ? (
            <>
              <SectionCard title="头像" description="PNG / JPG，不超过 2MB">
                <div className={l.row}>
                  <Avatar name={team[0].name} color="brand" size={64} />
                  <Button icon={<Icon name="upload" />}>上传</Button>
                  <Button appearance="subtle">移除</Button>
                </div>
              </SectionCard>
              <SectionCard title="个人资料" description="其他成员可以看到这些信息" action={<Button appearance="primary" onClick={() => notify("资料已保存")}>保存</Button>}>
                <div className={s.grid}>
                  <Field label="姓名"><Input defaultValue={team[0].name} /></Field>
                  <Field label="邮箱"><Input defaultValue={team[0].email} type="email" /></Field>
                  <Field label="角色"><Input value={roleLabel[team[0].role]} readOnly /></Field>
                  <Field label="时区"><Dropdown defaultValue="Asia/Shanghai" defaultSelectedOptions={["Asia/Shanghai"]}>{["Asia/Shanghai", "Asia/Singapore", "Europe/Frankfurt", "America/Los_Angeles"].map((tz) => <Option key={tz}>{tz}</Option>)}</Dropdown></Field>
                  <Field label="简介" style={{ gridColumn: "1 / -1" }}><Textarea placeholder="一句话介绍自己" resize="vertical" /></Field>
                </div>
              </SectionCard>
            </>
          ) : null}
          {section === "security" ? (
            <>
              <SectionCard title="修改密码" action={<Button appearance="primary" onClick={() => notify("密码已更新")}>更新密码</Button>}>
                <div className={s.grid}>
                  <Field label="当前密码"><Input type="password" /></Field>
                  <Field label="新密码" hint="至少 8 位，包含数字与字母"><Input type="password" /></Field>
                  <Field label="确认新密码"><Input type="password" /></Field>
                </div>
              </SectionCard>
              <SectionCard title="两步验证" description="登录时需要额外的验证码">
                <div className={s.switchRow}>
                  <div><Body1>启用两步验证</Body1><Caption1 className={l.muted} block>使用 Authenticator 应用生成验证码</Caption1></div>
                  <Switch checked={twoFactor} onChange={(_, d) => setTwoFactor(d.checked)} aria-label="两步验证" />
                </div>
                {twoFactor ? <Badge appearance="tint" color="success" icon={<Icon name="check" size={12} />}>已启用</Badge> : <Badge appearance="tint" color="warning">未启用</Badge>}
              </SectionCard>
              <SectionCard title="登录设备" description="当前登录中的会话" action={<Button appearance="subtle" onClick={() => notify("已退出其他设备")}>退出其他设备</Button>}>
                <div className={l.stackS}>
                  {sessions.map((item) => (
                    <div className={s.switchRow} key={item.device}>
                      <div className={l.row}>
                        <Icon name={item.device.includes("iPhone") ? "smartphone" : "monitor"} />
                        <div><Body1>{item.device}</Body1><Caption1 className={l.muted} block>{item.location} · {item.time}</Caption1></div>
                      </div>
                      {item.current ? <Badge appearance="tint" color="brand">当前设备</Badge> : <Button size="small" appearance="subtle" onClick={() => notify("已退出该设备")}>退出</Button>}
                    </div>
                  ))}
                </div>
              </SectionCard>
            </>
          ) : null}
          {section === "notifications" ? (
            <>
              <SectionCard title="邮件通知">
                {[["新订单", "有新订单创建时通知我", true], ["退款申请", "客户申请退款时通知我", true], ["团队动态", "成员加入或离开团队", false], ["产品更新", "新功能与改进", false]].map(([label, desc, on]) => (
                  <div className={s.switchRow} key={String(label)}>
                    <div><Body1>{label}</Body1><Caption1 className={l.muted} block>{desc}</Caption1></div>
                    <Switch defaultChecked={Boolean(on)} aria-label={String(label)} />
                  </div>
                ))}
              </SectionCard>
              <SectionCard title="摘要频率" description="选择接收汇总邮件的频率">
                <RadioGroup layout={isMobile ? "vertical" : "horizontal"} value={digest} onChange={(_, d) => setDigest(d.value)}>
                  <Radio value="realtime" label="实时" /><Radio value="daily" label="每日" /><Radio value="weekly" label="每周" /><Radio value="never" label="从不" />
                </RadioGroup>
              </SectionCard>
            </>
          ) : null}
          {section === "team" ? (
            <SectionCard title="团队成员" description={`${team.length} 位成员`} action={<Button appearance="primary" icon={<Icon name="user-plus" />} onClick={() => setInviteOpen(true)}>邀请成员</Button>}>
              <div className={l.scrollX}>
                <Table aria-label="团队成员" size={isMobile ? "small" : "medium"}>
                  <TableHeader><TableRow><TableHeaderCell>成员</TableHeaderCell><TableHeaderCell>角色</TableHeaderCell><TableHeaderCell>最近活跃</TableHeaderCell><TableHeaderCell style={{ width: 48 }} /></TableRow></TableHeader>
                  <TableBody>
                    {team.map((m) => (
                      <TableRow key={m.email}>
                        <TableCell><TableCellLayout media={<Avatar name={m.name} color="colorful" size={32} />} description={m.email} truncate>{m.name}</TableCellLayout></TableCell>
                        <TableCell><Badge appearance="outline" color={m.role === "owner" ? "brand" : "informative"}>{roleLabel[m.role]}</Badge></TableCell>
                        <TableCell>{m.lastActive}</TableCell>
                        <TableCell>
                          <Menu>
                            <MenuTrigger disableButtonEnhancement><Button appearance="subtle" size="small" icon={<Icon name="more-horizontal" />} aria-label={`${m.name} 操作`} /></MenuTrigger>
                            <MenuPopover><MenuList><MenuItem>更改角色</MenuItem><MenuItem>重发邀请</MenuItem><MenuItem onClick={() => notify(`已移除 ${m.name}`)}>移除</MenuItem></MenuList></MenuPopover>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Dialog open={inviteOpen} onOpenChange={(_, d) => setInviteOpen(d.open)}>
                <DialogSurface>
                  <DialogBody>
                    <DialogTitle>邀请成员</DialogTitle>
                    <DialogContent>
                      <div className={l.stackM}>
                        <Field label="邮箱" required><Input type="email" placeholder="teammate@acme.dev" /></Field>
                        <Field label="角色"><Dropdown defaultValue="成员" defaultSelectedOptions={["member"]}>{Object.entries(roleLabel).map(([k, v]) => <Option key={k} value={k}>{v}</Option>)}</Dropdown></Field>
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <DialogTrigger disableButtonEnhancement><Button>取消</Button></DialogTrigger>
                      <Button appearance="primary" onClick={() => { setInviteOpen(false); notify("邀请已发送") }}>发送邀请</Button>
                    </DialogActions>
                  </DialogBody>
                </DialogSurface>
              </Dialog>
            </SectionCard>
          ) : null}
          {section === "billing" ? (
            <>
              <SectionCard title="当前计划" description="Pro · 每月 ¥99 · 下次扣款 2026-10-01" action={<Button appearance="secondary">管理支付方式</Button>}>
                <div className={l.grid3}>
                  {plans.map((p) => (
                    <Card key={p.name} className={mergeClasses(s.plan, p.recommended ? s.planActive : "")}>
                      <div className={l.rowBetween}><Text weight="semibold">{p.name}</Text>{p.recommended ? <Badge appearance="filled" color="brand">当前</Badge> : null}</div>
                      <Title3>{p.price === null ? "联系我们" : p.price === 0 ? "免费" : `¥${p.price}/月`}</Title3>
                      <div className={l.stackS}>{p.features.map((f) => <div className={l.row} key={f}><Icon name="check" size={14} /><Caption1>{f}</Caption1></div>)}</div>
                      <Button appearance={p.recommended ? "primary" : "outline"} disabled={p.recommended} style={{ marginTop: "auto" }}>{p.recommended ? "使用中" : p.price === null ? "联系销售" : "切换"}</Button>
                    </Card>
                  ))}
                </div>
              </SectionCard>
              <SectionCard title="账单历史">
                <div className={l.scrollX}>
                  <Table aria-label="账单" size="small">
                    <TableHeader><TableRow><TableHeaderCell>编号</TableHeaderCell><TableHeaderCell>日期</TableHeaderCell><TableHeaderCell>状态</TableHeaderCell><TableHeaderCell style={{ textAlign: "right" }}>金额</TableHeaderCell><TableHeaderCell /></TableRow></TableHeader>
                    <TableBody>
                      {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell><Text weight="semibold">{inv.id}</Text></TableCell>
                          <TableCell>{inv.date}</TableCell>
                          <TableCell><StatusBadge value={inv.status} /></TableCell>
                          <TableCell style={{ textAlign: "right" }}><Money value={inv.amount} /></TableCell>
                          <TableCell><Button appearance="subtle" size="small" icon={<Icon name="download" />}>PDF</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </SectionCard>
            </>
          ) : null}
          <Card className={mergeClasses(l.card, s.danger)}>
            <div className={l.rowBetween}>
              <div><Text weight="semibold">删除账户</Text><Caption1 className={l.muted} block>永久删除账户与全部数据，此操作不可撤销。</Caption1></div>
              <Dialog onOpenChange={(_, d) => !d.open && setConfirmText("")}>
                <DialogTrigger disableButtonEnhancement><Button appearance="outline" icon={<Icon name="trash" />} style={{ color: tokens.colorPaletteRedForeground1 }}>删除账户</Button></DialogTrigger>
                <DialogSurface>
                  <DialogBody>
                    <DialogTitle>确定要删除账户吗？</DialogTitle>
                    <DialogContent>
                      <div className={l.stackM}>
                        <Body1>请输入 <Text font="monospace" weight="semibold">DELETE</Text> 以确认。</Body1>
                        <Field><Input value={confirmText} onChange={(_, d) => setConfirmText(d.value)} placeholder="DELETE" /></Field>
                      </div>
                    </DialogContent>
                    <DialogActions>
                      <DialogTrigger disableButtonEnhancement><Button>取消</Button></DialogTrigger>
                      <Button appearance="primary" disabled={confirmText !== "DELETE"} onClick={() => notify("账户删除请求已提交")}>永久删除</Button>
                    </DialogActions>
                  </DialogBody>
                </DialogSurface>
              </Dialog>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
