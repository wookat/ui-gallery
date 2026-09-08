# content/ — Acme Console 全部界面文案（唯一文案源）

- 每屏一份：`login.md`、`dashboard.md`（第 1 轮）；`orders.md`、`form.md`、`settings.md`、`components.md`、`landing.md`、`chat.md`（第 2 轮，Brief §11）。应用壳（侧边栏/顶栏）文案放在 `dashboard.md` 的「应用壳」一节，其他带壳屏幕复用 `shell.*`。
- `components.md` 取代 `kitchen-sink.md`（`/kitchen-sink` → `/components`）：旧 key 前缀 `kitchen-sink.` 改为 `components.`，文案不变；实现阶段完成迁移后删除 `kitchen-sink.md`，本阶段两份并存。
- 内容型文案（页面标题 / 说明、评价、FAQ、校验语、Toast、空态 / 错误语等成句文本）随数据放在对应 `../mock/<id>.json` 的随附字段，一处维护；`content/<id>.md` 只放结构性标签、aria 文本与状态语，并注明引用的 mock 字段。
- 每条文案带稳定 key（`login.title` 这类），设计稿与实现都按 key 引用，不得在页面里另写一套文案。
- 全部人写，中文语境；金额人民币、时间东八区。禁止 lorem ipsum、占位人名、随机数字。
- 品牌名只有「Acme Console」；示例租户「栖木家居」（杭州栖木家居有限公司）及其全部人名、邮箱、域名（`qimu-home.cn`）均为虚构，如与真实主体重名纯属巧合。
- 结构化数据（订单、统计、时间线等）在 `../mock/*.json`，文案里只写标签与状态语，不重复数据。
