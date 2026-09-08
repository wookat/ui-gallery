# settings（/settings）文案

> 引用方式：`settings.<key>`。应用壳文案复用 `dashboard.md` 的 `shell.*`；Tab 标签、选项、成员、计划、发票等数据见 `mock/settings.json`（其 `*Toast` / `*Empty` / `dangerZone` 字段为数据随附文案，此处不重复）。团队成员来自 `mock/team.json`。

## 页面与导航
| key | 文案 | 说明 |
|---|---|---|
| title | 设置 | h1 / 面包屑当前项 |
| tabs.aria | 设置分类 | 左侧竖向 Tabs（1024+）/ 顶部横向可滚动 Tabs（375、768）aria-label |
| tab.profile | 个人资料 | 与 `mock.tabs[].label` 一致 |
| tab.security | 账号安全 | |
| tab.notifications | 通知 | |
| tab.team | 团队 | |
| tab.billing | 计费 | |
| actions.save | 保存 | 各 Tab 表单主按钮 |
| actions.saving | 保存中… | |
| actions.reset | 重置 | 恢复为已保存值，无改动时禁用 |
| actions.unsaved | 有未保存的修改 | 表单底部粘性条文案 |
| actions.savingMsg | 正在保存… | 表单底部粘性条文案（提交中，hifi .savebar .msg） |
| error.title | 保存失败 | Alert（danger），正文用 mock 对应 `errorMessage` |
| error.retry | 重试 | |

## 个人资料
| key | 文案 | 说明 |
|---|---|---|
| profile.title | 个人资料 | 区块标题 |
| profile.description | 你的姓名与头像会显示在团队活动与备注中 | |
| profile.avatar.label | 头像 | 首字母头像（`initial` + `avatarHue`），无位图 |
| profile.avatar.hint | 头像由姓名末字自动生成，不支持上传图片 | |
| profile.avatar.aria | {name} 的头像 | |
| profile.name.label | 姓名 | |
| profile.name.required | 请填写姓名 | |
| profile.name.max | 姓名不超过 20 字 | |
| profile.email.label | 邮箱 | 只读，helper `profile.email.hint` |
| profile.email.hint | 登录邮箱不可修改，如需变更请联系管理员 | |
| profile.title.label | 职位 | |
| profile.bio.label | 简介 | Textarea，计数 `{n} / {max}` |
| profile.bio.placeholder | 一句话介绍你负责的工作 | |
| profile.language.label | 语言 | Select |
| profile.timezone.label | 时区 | Combobox |
| profile.timezone.placeholder | 搜索城市或 UTC 偏移 | |
| profile.timezone.empty | 没有匹配的时区 | |

## 账号安全
| key | 文案 | 说明 |
|---|---|---|
| security.password.title | 修改密码 | |
| security.password.updatedAt | 上次修改于 {date} | |
| security.password.current | 当前密码 | PasswordInput |
| security.password.new | 新密码 | |
| security.password.confirm | 确认新密码 | |
| security.password.mismatch | 两次输入的密码不一致 | |
| security.password.wrong | 当前密码不正确 | 服务端错误内联 |
| security.password.strength | 密码强度：{level} | 强度条 aria-live 文案 |
| security.password.rules | 密码要求 | 规则列表标题，项来自 mock.passwordRules，满足项打勾 |
| security.password.submit | 更新密码 | |
| security.password.toast | 密码已更新，其他设备需重新登录 | success |
| security.2fa.title | 两步验证 | |
| security.2fa.description | 登录时额外输入验证器应用生成的 6 位动态码 | |
| security.2fa.switch | 启用两步验证 | Switch aria-label |
| security.2fa.status.on | 已启用 | Tag success |
| security.2fa.status.off | 未启用 | Tag neutral |
| security.2fa.status.pending | 待验证 | Tag warning；开关已打开但尚未通过验证码（setup 中间态） |
| security.2fa.qr.aria | 两步验证二维码（示意） | 纯 CSS/SVG 图形容器 aria-label |
| security.2fa.manual | 无法扫码？手动输入密钥 | 折叠链接，展开显示 `manualKey` |
| security.2fa.code.label | 输入 6 位验证码 | OTP 输入 |
| security.2fa.code.invalid | 验证码不正确或已过期 | |
| security.2fa.verify | 验证并启用 | |
| security.2fa.toast | 两步验证已启用 | |
| security.2fa.disable.title | 关闭两步验证？ | Dialog |
| security.2fa.disable.description | 关闭后仅凭密码即可登录，账号安全性会降低。 | |
| security.2fa.disable.confirm | 关闭 | 危险按钮 |
| security.sessions.title | 活跃会话 | |
| security.sessions.description | 以下设备当前已登录你的账号 | |
| security.sessions.current | 当前设备 | Tag |
| security.sessions.lastActive | 最近活动 {time} | |
| security.sessions.revoke | 注销 | 行内按钮 |
| security.sessions.revokeAria | 注销 {device} 的会话 | |
| security.sessions.revokeAll | 注销其他所有会话 | 危险幽灵按钮 |
| security.sessions.toast | 已注销 {device} | |
| security.sessions.empty | 没有其他活跃会话 | 空态（与 mock 一致） |

## 通知
| key | 文案 | 说明 |
|---|---|---|
| notifications.title | 通知偏好 | |
| notifications.description | 按事件分别设置邮件、推送与站内三种接收方式 | 三列均可开关（mock 中「账单与发票」站内=off），文案不再声称站内始终显示 |
| notifications.channel.aria | 接收方式 | Segmented（邮件 / 推送 / 站内）aria-label |
| notifications.item.aria | {item}：{channel} | 每个 Switch aria-label |
| notifications.enableAll | 全部开启 | 分组右侧链接按钮 |
| notifications.disableAll | 全部关闭 | |
| notifications.quiet.title | 免打扰时段 | |
| notifications.quiet.description | 该时段内推送通知静默，次日早上汇总 | |
| notifications.quiet.range | {from} – {to} | |
| notifications.empty | 该接收方式下没有可配置的通知 | Segmented 切到无项时 |

## 团队
| key | 文案 | 说明 |
|---|---|---|
| team.title | 团队成员 | |
| team.seats | 已用 {used} / {total} 席位 | 标题右侧 |
| team.invite.label | 邀请成员 | |
| team.invite.placeholder | 输入邮箱，回车添加 | TagInput |
| team.invite.role | 角色 | Select |
| team.invite.submit | 发送邀请 | |
| team.invite.invalid | 邮箱格式不正确 | |
| team.invite.duplicate | {email} 已是成员 | |
| team.invite.toast | 已向 {n} 位成员发送邀请 | |
| team.pending.title | 待接受邀请 | |
| team.pending.invitedAt | {date} 由 {name} 邀请 | |
| team.pending.resend | 重新发送 | |
| team.pending.revoke | 撤回 | |
| team.table.aria | 成员列表 | |
| team.col.member | 成员 | 头像 + 姓名 + 邮箱 |
| team.col.role | 角色 | Select，当前用户行禁用并 Tooltip `team.roleSelf` |
| team.col.joinedAt | 加入时间 | |
| team.col.lastActive | 最近活动 | |
| team.col.actions | 操作 | 视觉隐藏 |
| team.roleSelf | 不能修改自己的角色 | |
| team.you | 你 | 当前用户姓名后 Tag |
| team.remove | 移除 | 危险幽灵按钮 |
| team.remove.aria | 移除成员 {name} | |
| team.remove.title | 移除 {name}？ | Dialog，正文用 mock `removeConfirm` |
| team.remove.confirm | 移除 | |
| team.remove.toast | 已移除 {name} | |
| team.role.toast | {name} 的角色已改为 {role} | |
| team.empty | 还没有其他成员，邀请同事一起使用 | 空态（仅自己时） |

## 计费
| key | 文案 | 说明 |
|---|---|---|
| billing.current.title | 当前计划 | |
| billing.current.plan | {plan} · {cycle} | 「专业版 · 年付」 |
| billing.current.renews | 下次续费 {date} | |
| billing.current.seats | 含 {n} 个席位 | |
| billing.current.payment | 付款方式 | |
| billing.current.change | 更换付款方式 | 链接按钮（本轮不可达） |
| billing.current.cancel | 取消订阅 | 危险幽灵（本轮不可达） |
| billing.cycle.monthly | 按月付 | Switch 两侧文案 |
| billing.cycle.yearly | 按年付 | |
| billing.cycle.aria | 切换计费周期 | |
| billing.cycle.saveBadge | 省 2 个月 | 年付侧 Tag |
| billing.plan.recommended | 推荐 | 卡片角标 |
| billing.plan.current | 当前计划 | 当前档按钮替换为禁用态文字 |
| billing.plan.price.monthly | ¥{n} / 月 | |
| billing.plan.price.yearly | ¥{n} / 年 | 副文案 `billing.plan.price.yearlyPerMonth` |
| billing.plan.price.yearlyPerMonth | 折合 ¥{n} / 月 | |
| billing.plan.upgrade | 升级到{plan} | |
| billing.plan.downgrade | 降级到{plan} | |
| billing.plan.contact | 联系销售 | 企业版 |
| billing.plan.included | 包含 | 功能勾选视觉隐藏文字 |
| billing.plan.excluded | 不包含 | |
| billing.invoices.title | 发票 | |
| billing.invoices.col.id | 编号 | |
| billing.invoices.col.date | 开具日期 | |
| billing.invoices.col.description | 说明 | |
| billing.invoices.col.amount | 金额 | 右对齐 |
| billing.invoices.col.status | 状态 | Tag，标签见 mock.invoiceStatuses |
| billing.invoices.download | 下载 PDF | 行内按钮 aria-label 「下载发票 {id}」 |
| billing.invoices.downloadAria | 下载发票 {id} | |
| billing.invoices.empty | 还没有发票，首次扣款后会显示在这里 | 与 mock 一致 |

## 危险区
| key | 文案 | 说明 |
|---|---|---|
| danger.title | 危险区 | Card 标题（danger 边框） |
| danger.delete.title | 删除团队空间 | 与 mock.dangerZone 一致 |
| danger.delete.button | 删除团队空间 | 危险按钮 |
| danger.dialog.title | 删除「{workspace}」？ | |
| danger.dialog.description | 将永久删除全部订单、库存、成员与账单数据，且不可恢复。 | |
| danger.dialog.input | 请输入「{phrase}」以确认 | 输入完全匹配前确认按钮禁用 |
| danger.dialog.mismatch | 输入内容不匹配 | |
| danger.dialog.confirm | 永久删除 | 危险按钮 |
| danger.dialog.back | 取消 | |
| danger.toast | 已提交删除申请，24 小时内可在邮件中撤销 | warning |

## 实现阶段补齐（hifi 已有文案，content 原缺 key；仅追加）

| key | 文案 | 备注 |
|---|---|---|
| profile.title.hint | 如「运营主管」「仓储主管」 | 职位 hint |
| profile.language.hint | 界面语言，切换后立即生效 | |
| profile.bio.max | 最多 {n} 字 | 简介 hint 左侧 |
| profile.timezone.hint | 用于任务提醒与报表时间显示 | |
| security.password.confirmHint | 再输入一次新密码 | |
| security.password.strengthNone | — | 未输入时的强度占位 |
| security.2fa.copy | 复制密钥 | iconbtn aria-label |
| security.2fa.copied | 密钥已复制 | Toast |
| security.2fa.verifying | 验证中… | 验证按钮 busy 文案 |
| security.2fa.disable.toast | 两步验证已关闭 | warning Toast |
| security.2fa.dialog.back | 取消 | 2FA Dialog 次按钮 |
| security.sessions.now | 现在 | 当前设备「最近活动 现在」 |
| security.sessions.revokeAll.toast | 已注销其他所有会话 | |
| notifications.channel.all | 全部 | seg 第一项 |
| notifications.col.event | 事件 | 表头 |
| notifications.quiet.from | 开始 | time 输入 label |
| notifications.quiet.to | 结束 | |
| notifications.quiet.toast | 免打扰时段已更新为 {from} – {to} | |
| team.invite.sending | 发送中… | |
| team.invite.removeAria | 移除 {email} | chip × |
| team.joinedAt | 加入 {date} | 移动卡片 |
| team.lastActive | 最近活动 {time} | |
| team.pending.description | 被邀请人 7 天内接受有效 | |
| team.pending.status | 待接受 | warning Tag |
| team.pending.empty | 没有待接受的邀请 | |
| team.pending.resend.toast | 已重新发送邀请至 {email} | |
| team.pending.revoke.toast | 已撤回对 {email} 的邀请 | |
| team.remove.back | 取消 | |
| billing.current.manage | 管理订阅 | 次按钮 |
| billing.change.title | 更换计划 | |
| billing.change.description | 升级即时生效，降级于当前周期结束后生效 | |
| billing.plan.yearlyNote | 按年付 ¥{n} / 年 | 月付视图下的副价 |
| billing.plan.toYearly | 改为按年付 | |
| billing.plan.toMonthly | 改为按月付 | |
| billing.plan.toast | 已切换到{plan}（{cycle}），升级即时生效 | |
| billing.cycle.monthlyShort | 月付 | Tag / Toast |
| billing.cycle.yearlyShort | 年付 | |
| billing.plan.unit.monthly | / 月 | 价格单位 |
| billing.plan.unit.yearly | / 年 | |
| billing.invoices.description | 每次扣款后自动开具，可下载 PDF | |
| billing.invoices.downloadShort | PDF | 移动卡片按钮 |
| danger.dialog.hint | 输入完全匹配前无法确认（含空格） | |
| leave.title | 离开页面？ | 有未保存改动时切换 Tab / 导航 |
| leave.description | 修改尚未保存，离开后将丢失。 | |
| leave.stay | 继续编辑 | |
| leave.leave | 放弃并离开 | 危险按钮 |
| leave.closeAria | 关闭 | |
| dialog.closeAria | 关闭 | Dialog 右上角 × |
| team.seats.aria | 席位使用 | progressbar aria-label |
| team.role.aria | {name} 的角色 | 成员行 Select aria-label |
