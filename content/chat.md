# chat（/chat）文案 —— Acme 智能助理

> 引用方式：`chat.<key>`。应用壳文案复用 `dashboard.md` 的 `shell.*`。会话、消息、建议、模型、错误语、欢迎语等**内容**在 `mock/chat.json`（其 `emptyState` / `errorState` / `composer` / `suggestions` 为数据随附文案，此处不重复），这里只放结构标签、aria 与交互态。

## 页面与会话列表
| key | 文案 | 说明 |
|---|---|---|
| title | 智能助理 | h1 / 面包屑当前项 |
| sidebar.aria | 会话列表 | 左栏 aside aria-label；375 为 Sheet（`side=left`） |
| sidebar.open | 打开会话列表 | 375 顶部按钮 |
| sidebar.close | 关闭会话列表 | |
| sidebar.new | 新建会话 | 主按钮 |
| sidebar.search.placeholder | 搜索会话 | |
| sidebar.search.aria | 搜索会话 | |
| sidebar.search.empty | 没有匹配的会话 | |
| sidebar.group.today | 今天 | 与 mock.groups 一致 |
| sidebar.group.week | 本周 | |
| sidebar.group.earlier | 更早 | |
| sidebar.item.aria | {title}，{time}{unread} | `{unread}` = 「，有新回复」或空 |
| sidebar.item.unread | 有新回复 | 未读点视觉隐藏文字 |
| sidebar.item.meta | {time} · {n} 条 | 第二行元信息：time = hifi `listTime`（今天 HH:mm / 昨天 HH:mm / 本周 MM-dd HH:mm / 更早 MM-dd），n = `messageCount` |
| sidebar.item.yesterday | 昨天 {time} | 昨天的会话时间前缀 |
| sidebar.item.menu | 会话操作 | 悬停出现的 ⋯ 按钮 |
| sidebar.item.rename | 重命名 | |
| sidebar.item.delete | 删除会话 | 危险色 → Dialog |
| sidebar.delete.title | 删除会话「{title}」？ | |
| sidebar.delete.description | 删除后无法恢复，助理执行过的操作（如改单）不会撤销。 | |
| sidebar.delete.confirm | 删除 | |
| sidebar.delete.cancel | 取消 | 次级按钮 |
| sidebar.empty | 还没有会话，从右侧的建议开始 | 会话列表空态 |

## 消息流
| key | 文案 | 说明 |
|---|---|---|
| thread.aria | 消息记录 | main 内 `role="log"` aria-label，`aria-live="polite"` |
| thread.date | {date} | 日期分隔线（今天 / 昨天 / 09-04） |
| thread.today | 今天 | |
| thread.yesterday | 昨天 | |
| message.user.aria | 你在 {time} 说 | 用户气泡 aria-label |
| message.assistant.aria | 助理在 {time} 回复 | |
| message.assistant.name | Acme 助理 | 助手名（气泡上方，375 隐藏） |
| message.avatar.aria | Acme 助理 | 品牌标头像 `role="img"` |
| message.copy | 复制回复 | 气泡下操作 |
| message.copied | 已复制 | |
| message.regenerate | 重新生成 | |
| message.feedback.up | 有帮助 | |
| message.feedback.down | 没帮助 | |
| message.edit | 编辑并重发 | 用户气泡 |
| markdown.table.aria | 数据表 | Markdown 表格 aria-label（若无 caption） |
| markdown.table.scrollHint | 左右滑动查看更多 | 375 表格溢出提示 |
| code.copy | 复制代码 | 代码块右上角 |
| code.copied | 已复制 | |
| code.language | {lang} | 代码块语言标签 |
| sources.title | 来源 | Chip 组标题（视觉隐藏可） |
| sources.aria | 引用来源 | |
| sources.order | 订单 {id} | Chip aria-label，`type=order` |
| sources.doc | 文档：{label} | |
| sources.snapshot | 数据快照：{label} | |
| tool.aria | 工具调用：{name} | 折叠卡按钮 aria-label |
| tool.running | 正在{name}… | status=running |
| tool.done | {name} · {duration} | status=done，`{duration}` 如「0.6 秒」 |
| tool.failed | {name}失败 | |
| tool.duration | {n} 秒 | `tool.done` 的 `{duration}`：n = durationMs / 1000，保留 1 位小数 |
| tool.args | 参数 | 展开内标签 |
| tool.result | 结果 | |
| tool.expand | 展开详情 | |
| tool.collapse | 收起详情 | |
| streaming.aria | 助理正在输入 | 流式态气泡 `aria-busy` 视觉隐藏文字 |
| streaming.stop | 停止生成 | 输入区发送按钮在流式时替换为此 |
| streaming.cursor | ▍ | 打字光标字符（`aria-hidden`） |
| disclaimer | 助理答案基于数据快照，重要操作请核对 | 消息流底部小字（mock 有全文，此处为短版） |
| scrollToBottom | 回到最新消息 | 上滑后出现的浮动按钮 |

## 输入区
| key | 文案 | 说明 |
|---|---|---|
| composer.aria | 消息输入 | form aria-label |
| composer.label | 输入消息 | Textarea 视觉隐藏 label |
| composer.send | 发送 | 图标按钮 aria-label；空内容禁用 |
| composer.attach | 添加附件 | |
| composer.attach.accept | 支持 CSV / XLSX / PDF / PNG / JPG，不超过 10 MB | Tooltip |
| composer.attach.remove | 移除附件 {name} | |
| composer.attach.tooLarge | 文件超过 10 MB | 内联错误 |
| composer.model.aria | 选择模型 | Select |
| composer.model.label | 模型 | |
| composer.hint | Enter 发送，Shift + Enter 换行 | 与 mock.composer.hint 一致（375 隐藏） |
| composer.counter | {n} / 2000 | 接近上限时显示 |
| composer.max | 消息不超过 2000 字 | |
| suggestions.aria | 建议问题 | Chip 组；empty 态为 4 张卡 |
| suggestions.title | 试试这样问 | empty 态卡片组标题 |

## 状态
| key | 文案 | 说明 |
|---|---|---|
| empty.aria | 欢迎 | 欢迎区 section aria-label；标题与说明在 mock.emptyState |
| loading.aria | 正在加载历史消息 | 骨架屏（3 组气泡）`aria-busy` |
| loading.sidebar | 正在加载会话 | 左栏骨架 |
| history.unavailable.title | 历史消息未包含在演示数据中 | `historyAvailable: false` 的会话（c_6 / c_7）：骨架 `motion.duration.slow` 后停留为此空态 |
| history.unavailable.description | 这条会话共 {n} 条消息，最后更新于 {time}；演示站点只保留今天与本周的会话内容。 | n = `messageCount`，time = `updatedAt` 相对时间 |
| history.unavailable.daysAgo | {n} 天前 | `history.unavailable.description` 的 `{time}` 相对快照 meta.asOf |
| history.unavailable.back | 返回今天的会话 | 次级按钮 → `?conversation=c_1` |
| error.title | 回复失败 | Alert（danger）标题；正文 mock.errorState.message |
| error.retry | 重试 | |
| error.dismiss | 忽略 | |
| offline | 网络已断开，消息将在恢复后发送 | 顶部 warning 条 |
| sent.toast | 已把 {id} 标记为加急 | 工具调用「更新订单」成功后的 Toast |
