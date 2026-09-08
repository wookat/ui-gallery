# landing（/landing）文案 —— Acme 营销落地页

> 引用方式：`landing.<key>`。无应用壳。标题、副标题、特性、分屏、数据带、定价、评价、FAQ、Footer 链接等**内容**全部在 `mock/landing.json`（它就是本页的文案数据源，一处维护），此处只放结构性标签、aria 与交互态文案。

## Navbar
| key | 文案 | 说明 |
|---|---|---|
| nav.aria | 主导航 | header nav aria-label |
| nav.home | Acme Console 首页 | Logo 链接 aria-label |
| nav.menu.open | 打开菜单 | 375 汉堡按钮 |
| nav.menu.close | 关闭菜单 | Sheet 关闭按钮 |
| nav.menu.title | 菜单 | Sheet 可访问标题 |
| nav.login | 登录 | 次级按钮 → `/login` |
| nav.trial | 免费试用 | 主按钮（Navbar 内短文案；Hero 用 mock `cta.trial` 全文） |
| nav.sticky | 已吸顶 | 滚动吸顶后实底态的视觉隐藏状态文字（可省略，仅供截图状态说明） |
| skip | 跳到主内容 | 首个焦点 |

## Hero
| key | 文案 | 说明 |
|---|---|---|
| hero.eyebrow | 全渠道订单与库存运营后台 | 标题上方小字 |
| hero.illustration.aria | Acme Console 仪表盘示意图 | 纯 CSS/SVG 抽象图 `role="img"` |
| hero.avatars.aria | 使用 Acme 的团队成员头像 | 首字母头像群 |
| hero.noCard | 无需绑卡 · 5 分钟接入 | 按钮下方小字 |

## 客户 Logo 云
| key | 文案 | 说明 |
|---|---|---|
| customers.title | 这些品牌正在用 Acme 管订单 | 区块标题（可视觉弱化） |
| customers.aria | 客户名单 | ul aria-label；每项为文字 wordmark，无图片 |

## 特性 / 分屏 / 数据带
| key | 文案 | 说明 |
|---|---|---|
| features.eyebrow | 产品 | |
| features.title | 从下单到发货，每一步都在一个后台 | |
| features.subtitle | 六个核心能力覆盖中小品牌全渠道运营的日常 | |
| solutions.eyebrow | 解决方案 | |
| solutions.title | 三个场景，看它怎么用 | |
| solutions.visual.aria | {title} 功能示意图 | 每段分屏右/左侧抽象图 |
| solutions.learnMore | 了解更多 | 每段底部链接（锚到 FAQ） |
| solutions.inventory.lowStock | {n} 个 SKU 低于安全线 | 分屏②抽象图预警 Tag；n = 图中低于安全线的柱数（mock `solutions[1].visual`：2） |
| solutions.assistant.answer | {name}{sku}，近 7 天因缺货延迟发货 {n} 单，当前库存 {stock} / 安全线 {safety}。 | 分屏③助理答复气泡；字段取 mock/skus.json 缺货最多项（name / sku / weekStockoutOrders / stock / safetyStock） |
| stats.aria | 平台数据 | 数据带 aria-label |
| stats.footnote | 数据截至 2026 年 8 月 | |

## 定价
| key | 文案 | 说明 |
|---|---|---|
| pricing.eyebrow | 定价 | |
| pricing.title | 简单透明，按团队规模选 | |
| pricing.subtitle | 所有计划都含 14 天免费试用，随时升降级 | |
| pricing.toggle.aria | 计费周期 | Switch aria-label；两侧文案见 mock `toggle` |
| pricing.perMonth | / 月 | 价格后缀 |
| pricing.perYear | / 年 | |
| pricing.yearlyPerMonth | 折合 ¥{n} / 月 | 年付时副文案 |
| pricing.recommended | 最受欢迎 | 推荐 badge |
| pricing.included | 包含 | 勾选图标视觉隐藏文字 |
| pricing.compare | 查看完整功能对比 | 三卡下方链接（不可达） |

## 评价 / FAQ / CTA
| key | 文案 | 说明 |
|---|---|---|
| testimonials.eyebrow | 客户评价 | |
| testimonials.title | 运营的人怎么说 | |
| testimonials.aria | 客户评价列表 | |
| testimonials.quote.aria | {name}，{company}{title} | 卡片 aria-label |
| faq.eyebrow | 常见问题 | |
| faq.title | 还有疑问？ | |
| faq.aria | 常见问题 | Accordion aria-label |
| faq.more | 没找到答案？联系我们 | 底部链接（mailto 不可达 → Tooltip `shell.nav.disabled.tip`） |
| cta.aria | 立即开始 | CTA 横幅 section aria-label |

## Footer
| key | 文案 | 说明 |
|---|---|---|
| footer.aria | 页脚 | |
| footer.brand.description | Acme Console 是 UI Gallery 的参考应用，用于演示设计系统在真实业务界面中的还原效果。 | Logo 下说明 |
| footer.social.aria | 社交媒体 | |
| footer.language.label | 语言 | Select 视觉隐藏 label |
| footer.links.disabled | 演示站点，链接不可用 | 所有 Footer 链接 `aria-disabled` 的 Tooltip |

## 状态
| key | 文案 | 说明 |
|---|---|---|
| state.default | 默认 | 顶部透明 Navbar |
| state.scrolled | 滚动后 | Navbar 吸顶、实底 + hairline + shadow.sm |
| state.pricing.monthly | 月付 | 定价切换态 |
| state.pricing.yearly | 年付 | |
| state.menu.open | 菜单展开 | 375 Sheet 打开 |
