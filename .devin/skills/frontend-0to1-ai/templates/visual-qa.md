# 视觉 QA 单（阶段 3 高保真审查 / 阶段 6 实现审查通用）

审查对象：`<screen>` @ `<branch>`/`<commit>`　审查员：独立会话（不得是实现者）　只审不改。

## A. 逐视口 × 主题 × 状态
| 视口 | 主题 | 状态 | 与基准（design/hifi/<screen>/ref）对照 | 结论 |
|---|---|---|---|---|
| 1440 | light | default | 并排图路径 / pixelmatch 差异 % | PASS / 差异点 |
| 1440 | dark | default | | |
| 375 | light | default | | |
| 375 | dark | default | | |
| 任一 | 任一 | loading / empty / error / success | 三态是否真实存在、样式来自 token | |

## B. 六项打分（每项 PASS 或列出差异点 + 标注截图）
1. 布局骨架（栅格、区域划分、顺序）
2. 间距节奏（8pt 网格、组内/组间比例）
3. 字阶与层级（标题/正文/辅助文字级差、行高、字重）
4. 色彩（仅 token 色；语义色用法；暗色映射无白块）
5. 组件形态（圆角/边框/阴影/控件高度与设计稿一致）
6. 交互反馈（hover / focus-visible / active / disabled；动效时长与 token 一致）

## C. 硬指标（任一不过 = blocking）
- [ ] 375px 无横向溢出（scrollWidth ≤ 375）
- [ ] 全部可点击元素热区 ≥ 40×40
- [ ] 正文对比度 ≥ 4.5:1，大字/图标 ≥ 3:1（axe-core 或脚本实测）
- [ ] 键盘可达：Tab 顺序合理、焦点环可见
- [ ] console error = 0
- [ ] 无 lorem ipsum / 占位图 / 随机数字
- [ ] 无硬编码色值/字号（grep `#[0-9a-f]{3,8}` / `px` 于页面层）

## D. 结论
verdict：pass / fix　blocking_issues：[「/route 视口 主题：现象」…]　minor_issues：[…]
