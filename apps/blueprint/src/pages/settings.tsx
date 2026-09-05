import { useState } from "react"
import { Button, Card, Classes, Dialog, DialogBody, DialogFooter, Divider, FormGroup, H4, HTMLSelect, HTMLTable, InputGroup, MenuItem, SegmentedControl, Switch, Tab, Tabs, Tag, TextArea } from "@blueprintjs/core"
import { Suggest } from "@blueprintjs/select"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import { icon } from "@/lib/icons"
import { toast } from "@/lib/toaster"
import { Avatar, PageHeader, SectionCard, StatusTag, money } from "@/pages/shared"

const TIMEZONES = ["Asia/Shanghai", "Asia/Tokyo", "Asia/Singapore", "Europe/London", "Europe/Berlin", "America/New_York"]
const ROLE_LABEL: Record<string, string> = { owner: "所有者", admin: "管理员", member: "成员", viewer: "只读" }

function Profile() {
  const [timezone, setTimezone] = useState<string | null>("Asia/Shanghai")
  return (
    <SectionCard title="个人资料" description="其他成员看到的公开信息">
      <div className="row"><Avatar name="林晓" size="lg" /><div className="row"><Button icon={icon("upload")} outlined>上传头像</Button><Button minimal>移除</Button></div></div>
      <div className="grid-2">
        <FormGroup label="姓名"><InputGroup defaultValue="林晓" /></FormGroup>
        <FormGroup label="语言"><HTMLSelect fill defaultValue="zh-CN" options={[{ value: "zh-CN", label: "简体中文" }, { value: "en-US", label: "English" }, { value: "ja-JP", label: "日本語" }]} /></FormGroup>
      </div>
      <FormGroup label="简介" helperText="最多 160 字"><TextArea fill rows={3} defaultValue="产品负责人，关注数据与体验。" /></FormGroup>
      <FormGroup label="时区">
        <Suggest<string> items={TIMEZONES} selectedItem={timezone} inputValueRenderer={(i) => i} itemPredicate={(q, i) => i.toLowerCase().includes(q.toLowerCase())} itemRenderer={(i, { handleClick, modifiers }) => <MenuItem key={i} text={i} onClick={handleClick} active={modifiers.active} roleStructure="listoption" />} onItemSelect={setTimezone} noResults={<MenuItem disabled text="无匹配" />} popoverProps={{ minimal: true }} inputProps={{ leftIcon: icon("globe") }} />
      </FormGroup>
      <div className="row" style={{ justifyContent: "flex-end" }}><Button minimal>取消</Button><Button intent="primary" onClick={() => void toast("资料已保存")}>保存</Button></div>
    </SectionCard>
  )
}

function Security() {
  const [twoFactor, setTwoFactor] = useState(true)
  return (
    <div className="stack">
      <SectionCard title="修改密码">
        <div className="grid-3">
          <FormGroup label="当前密码"><InputGroup type="password" leftIcon={icon("lock")} /></FormGroup>
          <FormGroup label="新密码"><InputGroup type="password" leftIcon={icon("key")} /></FormGroup>
          <FormGroup label="确认新密码"><InputGroup type="password" leftIcon={icon("key")} /></FormGroup>
        </div>
        <div className="row" style={{ justifyContent: "flex-end" }}><Button intent="primary" onClick={() => void toast("密码已更新")}>更新密码</Button></div>
      </SectionCard>
      <SectionCard title="两步验证" description="登录时需要额外的一次性验证码" action={<Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.currentTarget.checked)} large style={{ margin: 0 }} />}>
        {twoFactor ? <div className="row"><div className="placeholder" style={{ width: 120, height: 120 }}>QR</div><div className={Classes.TEXT_MUTED}>使用验证器应用扫描二维码，然后输入 6 位验证码完成绑定。<div style={{ marginTop: 8 }}><InputGroup placeholder="000000" style={{ width: 140 }} rightElement={<Button minimal intent="primary">验证</Button>} /></div></div></div> : <div className={Classes.TEXT_MUTED}>两步验证已关闭。</div>}
      </SectionCard>
      <SectionCard title="活跃会话" action={<Button intent="danger" outlined icon={icon("log-out")}>登出其他会话</Button>}>
        <div className="stack-sm">
          {sessions.map((s) => (
            <div key={s.device} className="row-between" style={{ padding: "6px 0" }}>
              <span className="row"><span className="avatar" style={{ background: "transparent", color: "inherit", border: "1px solid rgba(17,20,24,0.15)" }}>{icon("globe")}</span><span><div>{s.device} {s.current ? <Tag minimal intent="success" round>当前</Tag> : null}</div><div className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>{s.location} · {s.time}</div></span></span>
              {s.current ? null : <Button minimal small icon={icon("x")}>登出</Button>}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function Notifications() {
  const [channel, setChannel] = useState("email")
  const groups = [
    { title: "订单", items: ["新订单", "支付成功", "退款申请"] },
    { title: "团队", items: ["有人提到我", "新成员加入", "权限变更"] },
    { title: "系统", items: ["产品更新", "安全提醒", "账单提醒"] },
  ]
  return (
    <SectionCard title="通知偏好" action={<SegmentedControl value={channel} onValueChange={setChannel} options={[{ label: "邮件", value: "email" }, { label: "推送", value: "push" }, { label: "站内", value: "inapp" }]} small />}>
      {groups.map((g, gi) => (
        <div key={g.title}>
          {gi > 0 ? <Divider style={{ margin: "8px 0 16px" }} /> : null}
          <H4>{g.title}</H4>
          {g.items.map((item, i) => <Switch key={item} defaultChecked={i !== 2} alignIndicator="right" label={item} />)}
        </div>
      ))}
    </SectionCard>
  )
}

function Team() {
  const [members, setMembers] = useState(team)
  const [invite, setInvite] = useState("")
  return (
    <SectionCard title="团队成员" description={`${members.length} 位成员`} action={
      <div className="row"><InputGroup placeholder="邮箱" value={invite} onChange={(e) => setInvite(e.target.value)} leftIcon={icon("mail")} /><Button intent="primary" icon={icon("plus")} disabled={!invite} onClick={() => { void toast(`已邀请 ${invite}`); setInvite("") }}>邀请</Button></div>
    }>
      <div className="scroll-x">
        <HTMLTable className="fill" striped>
          <thead><tr><th>成员</th><th>角色</th><th>最近活跃</th><th /></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email}>
                <td><span className="row" style={{ flexWrap: "nowrap" }}><Avatar name={m.name} size="sm" /><span><div>{m.name}</div><div className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}>{m.email}</div></span></span></td>
                <td><HTMLSelect minimal defaultValue={m.role} disabled={m.role === "owner"} options={Object.entries(ROLE_LABEL).map(([value, label]) => ({ value, label }))} /></td>
                <td className={Classes.TEXT_MUTED}>{m.lastActive}</td>
                <td className="text-right">{m.role === "owner" ? null : <Button minimal small intent="danger" icon={icon("trash")} onClick={() => setMembers((x) => x.filter((y) => y.email !== m.email))} aria-label="移除" />}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </div>
    </SectionCard>
  )
}

function Billing() {
  const current = plans.find((p) => p.recommended) ?? plans[0]
  return (
    <div className="stack">
      <SectionCard title="当前计划" description={`${current.name} · ${current.price === null ? "定制" : money(current.price)} / 月，下次扣费 2026-10-01`} action={<Button outlined>管理订阅</Button>}>
        <div className="grid-3">
          {plans.map((p) => (
            <Card key={p.name} className="stack-sm" elevation={p.recommended ? 2 : 0} style={{ borderColor: p.recommended ? "#2d72d2" : undefined, position: "relative" }}>
              {p.recommended ? <Tag intent="primary" round style={{ position: "absolute", top: 12, right: 12 }}>推荐</Tag> : null}
              <H4 style={{ margin: 0 }}>{p.name}</H4>
              <div style={{ fontSize: 24, fontWeight: 600 }}>{p.price === null ? "联系我们" : p.price === 0 ? "免费" : money(p.price)}<span className={`${Classes.TEXT_MUTED} ${Classes.TEXT_SMALL}`}> / 月</span></div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <Button fill intent={p.recommended ? "primary" : "none"} disabled={p.name === current.name} outlined={!p.recommended}>{p.name === current.name ? "当前计划" : "切换"}</Button>
            </Card>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="发票">
        <div className="scroll-x">
          <HTMLTable className="fill" striped>
            <thead><tr><th>编号</th><th>日期</th><th>状态</th><th className="text-right">金额</th><th /></tr></thead>
            <tbody>{invoices.map((i) => <tr key={i.id}><td><strong>{i.id}</strong></td><td className={Classes.TEXT_MUTED}>{i.date}</td><td><StatusTag value={i.status} /></td><td className="text-right">{money(i.amount)}</td><td className="text-right"><Button minimal small icon={icon("download")} aria-label="下载" /></td></tr>)}</tbody>
          </HTMLTable>
        </div>
      </SectionCard>
    </div>
  )
}

function DangerZone() {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState("")
  return (
    <>
      <Card className="danger-card row-between">
        <div><H4 style={{ margin: 0, color: "#cd4246" }}>危险区域</H4><div className={Classes.TEXT_MUTED}>删除账户将永久移除所有数据，无法恢复。</div></div>
        <Button intent="danger" icon={icon("trash")} onClick={() => setOpen(true)}>删除账户</Button>
      </Card>
      <Dialog isOpen={open} onClose={() => setOpen(false)} title="删除账户" icon={icon("alert-circle")}>
        <DialogBody>
          <p>此操作不可撤销。请输入 <code>DELETE</code> 以确认。</p>
          <InputGroup value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="DELETE" intent={confirm && confirm !== "DELETE" ? "danger" : "none"} />
        </DialogBody>
        <DialogFooter actions={<><Button onClick={() => setOpen(false)}>取消</Button><Button intent="danger" disabled={confirm !== "DELETE"} onClick={() => { setOpen(false); setConfirm(""); void toast("账户删除请求已提交", "danger") }}>永久删除</Button></>} />
      </Dialog>
    </>
  )
}

export function SettingsPage() {
  const [tab, setTab] = useState("profile")
  return (
    <>
      <PageHeader title="设置" description="管理个人资料、安全、通知、团队与计费。" />
      <div className="scroll-x">
        <Tabs id="settings" selectedTabId={tab} onChange={(id) => setTab(String(id))} animate={false} large renderActiveTabPanelOnly>
          <Tab id="profile" title="个人资料" icon={icon("user")} panel={<Profile />} />
          <Tab id="security" title="账户安全" icon={icon("shield")} panel={<Security />} />
          <Tab id="notifications" title="通知" icon={icon("bell")} panel={<Notifications />} />
          <Tab id="team" title="团队" icon={icon("users")} panel={<Team />} />
          <Tab id="billing" title="计费" icon={icon("tag")} panel={<Billing />} />
        </Tabs>
      </div>
      <DangerZone />
    </>
  )
}
