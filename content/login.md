# login（/login）文案

> 引用方式：`login.<key>`。状态语见「校验与反馈」。

## 页面
| key | 文案 | 说明 |
|---|---|---|
| brand.name | Acme Console | 唯一品牌名；Logo 为文字标 + 几何图形，阶段 2 定 |
| brand.tagline | 订单、库存与团队，一处管好 | Logo 下方一行；1440 显示，375 隐藏 |
| title | 登录 | h1 |
| subtitle | 使用工作邮箱登录你的团队空间 | h1 下方 |
| email.label | 邮箱 | |
| email.placeholder | name@company.com | 仅示例格式，不是真实地址 |
| password.label | 密码 | |
| password.placeholder | 至少 8 位 | |
| password.show | 显示密码 | 眼睛按钮 aria-label |
| password.hide | 隐藏密码 | |
| remember.label | 30 天内记住我 | 复选框 |
| forgot.link | 忘记密码？ | 与复选框同一行右对齐 |
| submit | 登录 | 主按钮 |
| submit.loading | 登录中… | 提交中按钮文案，按钮禁用 + spinner |
| divider | 或使用以下方式 | 分隔线中文字 |
| oauth.google | 使用 Google 继续 | 次级按钮 |
| oauth.github | 使用 GitHub 继续 | 次级按钮 |
| oauth.wechat | 使用微信继续 | 次级按钮 |
| signup.prompt | 还没有团队空间？ | 底部 |
| signup.link | 免费注册 | 底部链接（本轮不可达，指向 `/signup`，实现为 `aria-disabled`） |
| footer.terms | 服务条款 | 页脚链接（不可达） |
| footer.privacy | 隐私政策 | 页脚链接（不可达） |
| footer.copyright | © 2026 Acme | 页脚 |

## 校验与反馈
| key | 触发条件 | 文案 | 呈现 |
|---|---|---|---|
| error.email.required | 邮箱为空且失焦/提交 | 请输入邮箱 | 字段下方内联错误 + 字段红边 |
| error.email.format | 不匹配 `^[^\s@]+@[^\s@]+\.[^\s@]+$` | 邮箱格式不正确，例如 name@company.com | 内联 |
| error.password.required | 密码为空且失焦/提交 | 请输入密码 | 内联 |
| error.password.short | 密码 < 8 位 | 密码至少 8 位 | 内联 |
| alert.invalid | 服务端返回 401 | 邮箱或密码不正确。连续 5 次失败后账号将锁定 15 分钟。 | 表单顶部 Alert（error 级，可关闭） |
| alert.locked | 服务端返回 423 | 账号已锁定，请 15 分钟后再试，或通过「忘记密码」重置。 | 顶部 Alert（error） |
| alert.network | 请求超时/断网 | 网络异常，请检查连接后重试。 | 顶部 Alert（warning），含「重试」按钮 |
| toast.success | 200 | 欢迎回来，若琳 | 跳转 `/` 后右上角 Toast（success），3 秒 |

## 演示账号（mock，见 `../mock/user.json`）
- 邮箱 `ruolin.shen@qimu-home.cn`，密码任意 ≥8 位 → 成功跳转 `/`
- 邮箱 `locked@qimu-home.cn` → `alert.locked`
- 其它任意邮箱 → `alert.invalid`
- 状态切换（供截图/审查）：`?state=default|invalid|loading|error`，`error` = 展示 `alert.invalid`
