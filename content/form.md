# form（/form）文案 —— 新建采购单

> 引用方式：`form.<key>`。应用壳文案复用 `dashboard.md` 的 `shell.*`。选项、校验文案的数据源与示例草稿在 `mock/purchase-form.json`（校验语句在其 `validation` 字段，不在此重复）；供应商见 `mock/suppliers.json`，SKU 见 `mock/skus.json`。

## 页面与步骤
| key | 文案 | 说明 |
|---|---|---|
| title | 新建采购单 | h1 / 面包屑当前项；面包屑上级「采购」不可点 |
| subtitle | 采购单号 {po} 将在提交后生成 | `{po}` = `poNumberNext` |
| stepper.aria | 采购单填写步骤 | ol aria-label |
| stepper.step | 第 {n} 步，共 3 步 | 375 下用文字代替横向步骤条 |
| stepper.status.done | 已完成 | 步骤图标视觉隐藏文字 |
| stepper.status.current | 当前步骤 | |
| stepper.status.todo | 未开始 | |
| stepper.status.error | 有待修正项 | 当前步存在校验错误时的读屏后缀 |
| step1.title | 基本信息 | 与 `mock.steps[0].label` 一致 |
| step1.description | 选择供应商并填写联系与结算方式 | |
| step2.title | 商品与配送 | |
| step2.description | 添加采购商品，指定收货仓库与到货要求 | |
| step3.title | 确认提交 | |
| step3.description | 核对信息并同意采购条款 | |
| nav.prev | 上一步 | |
| nav.next | 下一步 | |
| nav.saveDraft | 保存草稿 | 幽灵按钮；Toast `toast.draftSaved` |
| nav.submit | 提交采购单 | 第 3 步主按钮 |
| nav.submitting | 提交中… | loading 态文案（按钮保持宽度） |
| required | 必填 | 必填星号的视觉隐藏文字 |
| optional | 选填 | 标签右侧弱化文字 |

## 步骤 1：基本信息
| key | 文案 | 说明 |
|---|---|---|
| supplier.label | 供应商 | Combobox |
| supplier.placeholder | 搜索供应商名称 | |
| supplier.empty | 没有匹配的供应商 | |
| supplier.meta | {region} · 常规交期 {days} 天 | 选项副文案 |
| supplier.selectedHint | 结算方式已按该供应商默认值填入，可修改 | 选中后 helper |
| contact.label | 联系人 | Input，选中供应商后自动填入 |
| contact.placeholder | 姓名 | |
| phone.label | 联系电话 | 国家码 Select + Input |
| phone.country.aria | 国家或地区代码 | |
| phone.placeholder | 11 位手机号 | |
| email.label | 邮箱 | |
| email.placeholder | name@company.cn | |
| email.hint | 采购单 PDF 会发送到该邮箱 | |
| note.label | 备注 | Textarea |
| note.placeholder | 工艺要求、包装方式、交期沟通记录… | |
| note.counter | {n} / {max} | 字数统计，超限变 danger 色 |
| settlement.label | 结算方式 | RadioGroup，选项来自 mock |
| invoice.label | 需要开具发票 | Checkbox |
| invoice.hint | 开票信息见采购条款第 4 条 | |
| urgent.label | 加急采购 | Switch |
| urgent.hint | 加急单会通知供应商优先排产，到货日期可早于常规交期 | |

## 步骤 2：商品与配送
| key | 文案 | 说明 |
|---|---|---|
| items.title | 采购商品 | 区块标题 |
| items.col.sku | 商品 | SKU Combobox 列 |
| items.col.qty | 数量 | Number |
| items.col.unitPrice | 采购单价 | 默认 `skus.cost`，可改 |
| items.col.subtotal | 小计 | 只读，= 数量 × 单价 |
| items.col.remove | 删除 | 图标按钮 aria-label「删除第 {n} 行」 |
| items.removeRow | 删除第 {n} 行 | |
| items.sku.placeholder | 搜索 SKU 或商品名 | |
| items.sku.empty | 没有匹配的商品 | |
| items.sku.meta | 库存 {stock} / 安全线 {safety} | 选项副文案；`lowStock` 时加 warning 点 |
| items.sku.lowStock | 库存预警 | 选项 Tag |
| items.sku.required | 请选择商品 | 商品行未选 SKU 的行内错误（hifi 行内写死，此处补 key） |
| items.row.aria | 第 {n} 行{field} | 表格内控件 aria-label（hifi「第 1 行商品」「第 1 行数量」） |
| items.add | 添加商品行 | |
| items.total | 商品合计 | 表尾 |
| items.count | {n} 种商品，{qty} 件 | 表尾副文案 |
| warehouse.label | 收货仓库 | Select |
| warehouse.address | 收货地址：{address} | 选中后 helper |
| arrivalDate.label | 期望到货日期 | DatePicker |
| arrivalDate.placeholder | 选择日期 | |
| arrivalDate.hint | 供应商常规交期 {days} 天，建议不早于 {date} | |
| arrivalDate.prevMonth | 上个月 | Calendar 月份切换 aria-label |
| arrivalDate.nextMonth | 下个月 | |
| slot.label | 收货时段 | Select，选项来自 mock.deliverySlots |
| freight.label | 运费预算区间 | 双滑块 Slider |
| freight.value | ¥{min} – ¥{max} | 滑块当前值 |
| freight.min | 运费预算下限 | 左滑块 aria-label |
| freight.max | 运费预算上限 | 右滑块 aria-label |
| freight.hint | 大件家具走德邦物流，江浙沪整车约 ¥400–800 | |
| attachments.label | 附件 | 拖拽区 |
| attachments.dropzone | 拖拽文件到此处，或点击选择 | |
| attachments.accept | 支持 PDF / XLSX / JPG / PNG，单个不超过 10 MB，最多 5 个 | |
| attachments.uploading | 上传中 {percent}% | 文件行 |
| attachments.done | 已上传 | 视觉隐藏文字 |
| attachments.remove | 移除 {name} | |
| attachments.retry | 重试 | 失败行 |
| tags.label | 标签 | TagInput |
| tags.placeholder | 输入后回车添加 | |
| tags.remove | 移除标签 {tag} | |
| tags.suggestions | 常用： | 建议 Chip 前缀 |

## 步骤 3：确认提交
| key | 文案 | 说明 |
|---|---|---|
| summary.title | 请核对采购单 | |
| summary.edit | 修改 | 每个区块右上角链接按钮，跳回对应步骤 |
| summary.section.basic | 基本信息 | |
| summary.section.goods | 商品 | |
| summary.section.delivery | 配送 | |
| summary.field.supplier | 供应商 | 描述列表项 |
| summary.field.contact | 联系人 | 「{contact} · {phone}」 |
| summary.field.email | 邮箱 | |
| summary.field.settlement | 结算方式 | |
| summary.field.invoice | 开票 | 「需要」/「不需要」 |
| summary.field.urgent | 加急 | 「是」/「否」 |
| summary.field.note | 备注 | 无则「—」 |
| summary.field.warehouse | 收货仓库 | |
| summary.field.arrival | 期望到货 | 「{date} {slot}」 |
| summary.field.freight | 运费预算 | |
| summary.field.attachments | 附件 | 「{n} 个文件」 |
| summary.field.tags | 标签 | |
| summary.attachmentsCount | {n} 个文件 | 摘要「附件」取值（只计已上传） |
| aside.aria | 采购单摘要 | 右侧摘要卡 aria-label |
| summary.total.goods | 商品合计 | |
| summary.total.freight | 运费预算 | 显示区间 |
| summary.total.grand | 预计总额 | 商品合计 + 运费上限，加粗 |
| terms.label | 我已阅读并同意《采购条款》 | Checkbox；书名号部分为链接按钮，打开 Dialog |
| terms.dialog.title | 采购条款 | |
| terms.dialog.close | 我知道了 | |
| terms.dialog.closeAria | 关闭 | Dialog 右上角 × 的可访问名 |
| yes | 需要 | |
| no | 不需要 | |
| bool.true | 是 | |
| bool.false | 否 | |

## 状态
| key | 文案 | 说明 |
|---|---|---|
| invalid.summary | 还有 {n} 项需要修正 | 步骤顶部 Alert（danger），点击定位到首个错误 |
| invalid.goto | 查看 | Alert 内链接 |
| error.title | 提交失败 | Alert（danger），文案 `validation.submitError` |
| error.retry | 重新提交 | |
| error.dismiss | 关闭提示 | |
| toast.draftSaved | 草稿已保存 | success |
| toast.rowAdded | 已添加商品行 | |
| success.title | 采购单已提交 | Result 图形 + 标题，数据见 `mock.success` |
| success.primary | 查看采购单 | 主按钮（本轮不可达，Toast `shell.nav.disabled.tip`） |
| success.secondary | 再建一张 | 次级按钮，回到第 1 步并清空 |
| success.sentTo | 已发送至 {email} | 副文案 |
| success.description | {po} 已发送给 {supplier}（{contact}），预计 {date} {slot}到达{warehouse}。 | 按当前填写值拼出的结果描述（mock.success.description 为默认值样例） |
| leave.title | 离开页面？ | 有未保存改动时切换导航的 Dialog |
| leave.description | 采购单尚未提交，离开后填写内容将丢失。 | |
| leave.stay | 继续填写 | |
| leave.leave | 放弃并离开 | 危险按钮 |
