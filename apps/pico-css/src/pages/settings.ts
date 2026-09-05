import sessions from "@ui-gallery/spec/mock/sessions.json"
import team from "@ui-gallery/spec/mock/team.json"
import plans from "@ui-gallery/spec/mock/plans.json"
import invoices from "@ui-gallery/spec/mock/invoices.json"
import { icon } from "../icons"

const tabs = [
  ["profile", "个人资料"], ["security", "账号安全"], ["notifications", "通知"], ["team", "团队"], ["billing", "计费"],
] as const

export function render(): string {
  const tab = new URLSearchParams(window.location.search).get("tab") ?? "profile"
  return `<div class="page-heading"><div><h1>设置</h1><p>管理你的账户、团队与订阅设置。</p></div></div>
    <div class="settings-layout"><div class="settings-tabs" role="navigation" aria-label="设置分区"><ul>${tabs.map(([key, label]) => `<li><a data-settings-tab="${key}" aria-current="${key === tab ? "page" : "false"}" class="${key === tab ? "active" : ""}" href="?tab=${key}">${label}</a></li>`).join("")}</ul></div>
    <section class="settings-panel">${panel(tab)}</section></div>`
}

function panel(tab: string): string {
  if (tab === "security") return `<article><header><h2>账号安全</h2><p>保护你的账户与登录会话。</p></header><form id="password-form" class="form-grid"><label>当前密码<input type="password" required /></label><label>新密码<input type="password" minlength="8" required /></label><button>保存密码</button></form><hr><label class="switch-row"><span><strong>双因素认证</strong><small>登录时要求额外的验证码</small></span><input type="checkbox" role="switch" checked></label><div class="qr-placeholder" aria-label="二维码占位">${icon("grid", 48)}</div><h3>登录会话</h3><figure class="overflow-auto"><table class="striped"><thead><tr><th>设备</th><th>位置</th><th>操作</th></tr></thead><tbody>${sessions.map((s) => `<tr><td>${s.device}${s.current ? "（当前）" : ""}</td><td>${s.location} · ${s.time}</td><td><button class="outline" ${s.current ? "disabled" : ""}>${s.current ? "当前会话" : "注销"}</button></td></tr>`).join("")}</tbody></table></figure></article>`
  if (tab === "notifications") return `<article><header><h2>通知偏好</h2><p>选择你希望接收的通知。</p></header><div class="segmented" role="group" aria-label="通知渠道"><button>邮件</button><button class="outline">推送</button><button class="outline">站内</button></div>${["项目更新", "账单提醒", "团队活动", "产品新闻"].map((label, i) => `<label class="switch-row"><span><strong>${label}</strong><small>通过选定渠道接收重要提醒</small></span><input type="checkbox" role="switch" ${i < 3 ? "checked" : ""}></label>`).join("")}</article>`
  if (tab === "team") return `<article><header><h2>团队成员</h2><p>管理团队访问权限。</p></header><figure class="overflow-auto"><table class="striped"><thead><tr><th>成员</th><th>角色</th><th>最近活跃</th><th></th></tr></thead><tbody>${team.map((m) => `<tr><td><span class="avatar">${m.name.slice(0, 1)}</span> ${m.name}<small>${m.email}</small></td><td><select aria-label="${m.name} 角色"><option ${m.role === "owner" ? "selected" : ""}>owner</option><option ${m.role === "admin" ? "selected" : ""}>admin</option><option ${m.role === "member" ? "selected" : ""}>member</option><option ${m.role === "viewer" ? "selected" : ""}>viewer</option></select></td><td>${m.lastActive}</td><td><button class="outline">移除</button></td></tr>`).join("")}</tbody></table></figure><form role="group" id="invite-form"><input placeholder="输入邮箱邀请成员" type="email" required><button>邀请</button></form></article>`
  if (tab === "billing") return `<article><header><h2>计费</h2><p>当前计划与发票记录。</p></header><article class="plan-current"><strong>当前计划：Pro</strong><span>¥99 / 月 · 下次续费 2026-10-01</span></article><div class="grid plan-grid">${plans.map((p) => `<article><header><h3>${p.name} ${p.recommended ? "<mark>推荐</mark>" : ""}</h3><p class="stat-value">${p.price === null ? "联系我们" : p.price === 0 ? "免费" : `¥${p.price}`}<small>${p.price ? " / 月" : ""}</small></p></header><ul>${p.features.map((f) => `<li>${f}</li>`).join("")}</ul><button class="${p.recommended ? "" : "outline"}">${p.price === null ? "联系销售" : "选择方案"}</button></article>`).join("")}</div><h3>发票记录</h3><figure class="overflow-auto"><table class="striped"><thead><tr><th>编号</th><th>日期</th><th>金额</th><th>状态</th></tr></thead><tbody>${invoices.map((i) => `<tr><td>${i.id}</td><td>${i.date}</td><td>¥${i.amount}</td><td><mark>${i.status === "paid" ? "已支付" : "待支付"}</mark></td></tr>`).join("")}</tbody></table></figure><article class="danger-zone"><h3>危险区</h3><p>删除账号将永久移除所有数据。</p><button class="contrast" id="delete-account">删除账号</button></article></article>`
  return `<article><header><h2>个人资料</h2><p>更新你的公开账户信息。</p></header><div class="profile-hero"><span class="avatar avatar-large">林</span><div><strong>林晓</strong><small>m0@acme.dev</small></div><label class="outline button">上传<input type="file" hidden></label></div><form id="profile-form" class="form-grid"><label>姓名<input value="林晓" required></label><label>语言<select><option>简体中文</option><option>English</option></select></label><label class="span-2">简介<textarea rows="3" placeholder="介绍一下自己"></textarea></label><label>时区<input list="zones" value="Asia/Shanghai"><datalist id="zones"><option>Asia/Shanghai</option><option>UTC</option></datalist></label><button>保存更改</button></form></article>`
}

export function mount(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("[data-settings-tab]").forEach((tab) => tab.addEventListener("click", (event) => {
    event.preventDefault()
    const key = tab.dataset.settingsTab
    if (key) {
      const params = new URLSearchParams(window.location.search)
      params.set("tab", key)
      history.pushState({}, "", `${window.location.pathname}?${params}`)
    }
    const rerender = root.querySelector<HTMLElement>("#root")
    void rerender
    window.dispatchEvent(new PopStateEvent("popstate"))
  }))
  root.querySelector("#delete-account")?.addEventListener("click", () => {
    const dialog = document.createElement("dialog")
    dialog.innerHTML = `<form method="dialog"><h3>删除账号</h3><p>请输入 DELETE 以确认。</p><input pattern="DELETE" required aria-label="确认文字"><button value="cancel">取消</button><button value="confirm">确认删除</button></form>`
    document.body.append(dialog); dialog.showModal(); dialog.addEventListener("close", () => dialog.remove())
  })
}
