"""frontend-0to1-ai：用 AI 从 0 到 1 做前端的八阶段流水线（见同目录 SKILL.md）。

brief → ia/wireframe → tokens → hifi(每屏并行) → foundation → implement(每屏并行) → visual_qa → integrate
每个产出阶段配一个独立审查会话（审改分离），审查不过最多修 2 轮；后阶段直接消费前阶段的结构化输出。
同一 run_id 重跑即续跑（已完成阶段回放）。
FE01_EXTEND=1 为增量模式：在已有 Brief/IA/令牌/地基上只追加新屏幕（FE01_EXISTING_SCREENS 列出已上线屏幕，供回归）。
实现屏审查 2 轮仍不过 → 显式升级一轮（tech-lead 接手）→ 再不过则该屏不合入，并把未合入清单明确交给走查/审计/release，不靠门禁兜底。
"""
import asyncio
import json
import os

# 参数来源：环境变量优先；其次 ~/.fe01/config.json（{"FE01_REPO_SLUG": ..., ...}），便于 run_workflow 不带 env 时取值
_cfg_path = os.environ.get("FE01_CONFIG", os.path.expanduser("~/.fe01/config.json"))
if os.path.isfile(_cfg_path):
    with open(_cfg_path, encoding="utf-8") as f:
        for _k, _v in json.load(f).items():
            os.environ.setdefault(_k, str(_v))

REPO_SLUG = os.environ["FE01_REPO_SLUG"]
REPO = f"github.com/{REPO_SLUG}"
BASE = os.environ.get("FE01_BASE_BRANCH", "main")
INT = os.environ.get("FE01_INTEGRATION_BRANCH", "fe01/integration")
STACK = os.environ.get("FE01_STACK_HINT", "React 19 + Vite + TypeScript + Tailwind v4；基座优先无样式/低样式库（Radix / Base UI / shadcn / Ark）")
DEPLOY_CMD = os.environ.get("FE01_DEPLOY_CMD", "")
MAX_CONCURRENT = int(os.environ.get("FE01_MAX_CONCURRENT", "12"))
MAX_SCREENS = int(os.environ.get("FE01_MAX_SCREENS", "12"))
APP_DIR = os.environ.get("FE01_APP_DIR", ".").strip("/") or "."
SKILL_URL = os.environ.get("FE01_SKILL_URL", "https://github.com/wookat/company-os/tree/main/skills/frontend-0to1-ai")
EXTEND = os.environ.get("FE01_EXTEND", "").strip() in ("1", "true", "yes")
EXISTING = [s.strip() for s in os.environ.get("FE01_EXISTING_SCREENS", "").split(",") if s.strip()]

_brief_in = os.environ["FE01_BRIEF_INPUT"]
if os.path.isfile(_brief_in):
    with open(_brief_in, encoding="utf-8") as f:
        BRIEF_INPUT = f.read()
else:
    BRIEF_INPUT = _brief_in

META = {
    "name": f"fe01-{REPO_SLUG.split('/')[-1]}",
    "description": "AI 前端从 0 到 1：Brief → IA/线框 → 令牌 → 高保真 → 工程地基 → 按稿实现 → 视觉 QA → 集成上线（每阶段审改分离）",
    "product": REPO_SLUG,
    "phases": [
        {"title": "brief", "detail": "阶段 0：product-manager 写 docs/frontend/00-brief.md（屏幕清单/真实内容/约束）+ 独立审查", "labels": ["brief", "brief-review", "brief-fix"], "soft_time_limit_minutes": 40},
        {"title": "ia", "detail": "阶段 1：ux-researcher 写 01-ia.md + 灰度线框 HTML（1440/375）+ 审查", "labels": ["ia", "ia-review", "ia-fix"], "soft_time_limit_minutes": 45},
        {"title": "tokens", "detail": "阶段 2：ui-designer 写 design/tokens.json（W3C DTCG）→ tokens.css，对比度实测 + 审查", "labels": ["tokens", "tokens-review", "tokens-fix"], "soft_time_limit_minutes": 40},
        {"title": "hifi", "detail": "阶段 3：每屏一个 ui-designer 用 tokens.css 写高保真 HTML（全部状态/断点/亮暗）+ 基准截图 + 独立视觉审查", "labels": ["hifi-*", "hifi-review-*", "hifi-fix-*", "hifi-merge"], "soft_time_limit_minutes": 60},
        {"title": "foundation", "detail": "阶段 4：tech-lead 搭工程地基：令牌注入主题、组件映射表、/kitchen-sink、AGENTS.md、检查脚本 + 审查", "labels": ["foundation", "foundation-review", "foundation-fix"], "soft_time_limit_minutes": 60},
        {"title": "implement", "detail": "阶段 5：每屏一个 frontend-engineer 按稿实现（分支 fe01/screen-<id>），lint/typecheck/build/截图", "labels": ["impl-*", "impl-fix-*"], "soft_time_limit_minutes": 60},
        {"title": "visual_qa", "detail": "阶段 6：独立 ui-designer 逐屏对照 hifi 基准图六项打分 + 硬指标；不过回到 impl-fix", "labels": ["qa-*"], "soft_time_limit_minutes": 40},
        {"title": "integrate", "detail": "阶段 7：串行合入集成分支 → 体验官走查 + QA/合规审计（并行）→ 修 P0/P1 → 合 main → 部署 → handoff-context", "labels": ["merge-*", "ux-walkthrough", "qa-audit", "gates-fix*", "release"], "soft_time_limit_minutes": 45},
    ],
}

# ---------- schemas（小而稳定） ----------
SCREEN = {
    "type": "object",
    "properties": {"id": {"type": "string"}, "route": {"type": "string"}, "purpose": {"type": "string"}, "states": {"type": "array", "items": {"type": "string"}}},
    "required": ["id", "route", "purpose", "states"],
}
BRIEF_SCHEMA = {
    "type": "object",
    "properties": {"commit": {"type": "string"}, "brief_path": {"type": "string"}, "screens": {"type": "array", "items": SCREEN}, "stack": {"type": "string"}, "notes": {"type": "string"}},
    "required": ["commit", "brief_path", "screens", "stack", "notes"],
}
REVIEW_SCHEMA = {
    "type": "object",
    "properties": {"verdict": {"type": "string", "enum": ["pass", "fix"]}, "blocking_issues": {"type": "array", "items": {"type": "string"}}, "minor_issues": {"type": "array", "items": {"type": "string"}}},
    "required": ["verdict", "blocking_issues", "minor_issues"],
}
FIX_SCHEMA = {
    "type": "object",
    "properties": {"commit": {"type": "string"}, "fixed": {"type": "array", "items": {"type": "string"}}, "unfixed": {"type": "array", "items": {"type": "string"}}},
    "required": ["commit", "fixed", "unfixed"],
}
IA_SCHEMA = {
    "type": "object",
    "properties": {"commit": {"type": "string"}, "ia_path": {"type": "string"}, "wireframes": {"type": "array", "items": {"type": "string"}}, "notes": {"type": "string"}},
    "required": ["commit", "ia_path", "wireframes", "notes"],
}
TOKENS_SCHEMA = {
    "type": "object",
    "properties": {"commit": {"type": "string"}, "tokens_json": {"type": "string"}, "tokens_css": {"type": "string"}, "min_contrast": {"type": "number"}, "notes": {"type": "string"}},
    "required": ["commit", "tokens_json", "tokens_css", "min_contrast", "notes"],
}
HIFI_SCHEMA = {
    "type": "object",
    "properties": {"screen": {"type": "string"}, "branch": {"type": "string"}, "commit": {"type": "string"}, "hifi_path": {"type": "string"}, "ref_shots": {"type": "integer"}, "notes": {"type": "string"}},
    "required": ["screen", "branch", "commit", "hifi_path", "ref_shots", "notes"],
}
FOUNDATION_SCHEMA = {
    "type": "object",
    "properties": {"commit": {"type": "string"}, "base_library": {"type": "string"}, "components_doc": {"type": "string"}, "kitchen_sink_route": {"type": "string"}, "ai_context_path": {"type": "string"}, "check_commands": {"type": "array", "items": {"type": "string"}}, "gates_passed": {"type": "boolean"}, "notes": {"type": "string"}},
    "required": ["commit", "base_library", "components_doc", "kitchen_sink_route", "ai_context_path", "check_commands", "gates_passed", "notes"],
}
IMPL_SCHEMA = {
    "type": "object",
    "properties": {"screen": {"type": "string"}, "branch": {"type": "string"}, "commit": {"type": "string"}, "gates_passed": {"type": "boolean"}, "notes": {"type": "string"}},
    "required": ["screen", "branch", "commit", "gates_passed", "notes"],
}
MERGE_SCHEMA = {
    "type": "object",
    "properties": {"merged": {"type": "boolean"}, "commit": {"type": "string"}, "notes": {"type": "string"}},
    "required": ["merged", "commit", "notes"],
}
WALK_SCHEMA = {
    "type": "object",
    "properties": {"verdict": {"type": "string", "enum": ["pass", "fix"]}, "p0_p1": {"type": "array", "items": {"type": "string"}}, "p2_p3": {"type": "array", "items": {"type": "string"}}, "report_path": {"type": "string"}},
    "required": ["verdict", "p0_p1", "p2_p3", "report_path"],
}
RELEASE_SCHEMA = {
    "type": "object",
    "properties": {"main_commit": {"type": "string"}, "deployed_url": {"type": "string"}, "handoff_path": {"type": "string"}, "notes": {"type": "string"}},
    "required": ["main_commit", "deployed_url", "handoff_path", "notes"],
}

# ---------- 公共规则 ----------
COMMON = f"""
仓库：https://{REPO} ；集成分支 `{INT}`（不存在则从 `{BASE}` 切出）。方法论与模板：{SKILL_URL}（SKILL.md、templates/brief.md、templates/tokens.json、templates/ai-context.md、templates/visual-qa.md）——开工前先读；若目标仓库内有 `.devin/skills/frontend-0to1-ai/` 副本则优先读它。
目录约定：`docs/frontend/`、`design/`、`content/`、`mock/` 在仓库根；工程目录为 `{APP_DIR}/`（prompt 中的 `src/`、`tools/*.mjs`、`AGENTS.md`、`pnpm lint/typecheck/build` 均相对于该目录；`.` 表示就是仓库根）。
硬性规则：
- 只做本阶段的事：设计阶段（0–3）不得写业务实现代码；实现阶段不得改设计稿与令牌（有问题写进 notes 交回）。
- 禁止 lorem ipsum / 随机数字 / 占位人名头像；内容来自 docs/frontend/00-brief.md 指向的 content/ 与 mock/。
- 禁止硬编码颜色/字号/间距，一切来自 design/tokens.json 生成的 tokens.css / 主题。
- 不复制任何竞品/官网真实文案、图片、商标；字体只用 OFL/自有资产。
- 不启用 GitHub Actions；不放宽 pnpm minimumReleaseAge 等供应链策略（遇 ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION 降版本）。
- 不提交 PNG 基准图以外的生成物（dist、node_modules、shots 不入库；design/hifi/*/ref/*.png 允许）。
- 不开 PR、不推 {BASE}（只有 release 阶段可以）、不 force push、不用 `git add .`（显式列文件）。
- 宣称"完成"前必须实际运行本阶段门禁命令，并在 notes 写出运行结果。
- 时间盒：每个会话按本阶段 soft time limit 收敛——先保证全部必备产物与门禁真实跑过，再做细节微调；临近时限就提交并在 notes 如实写明未完成项，不要无限打磨。
"""
if EXTEND:
    COMMON += f"""
增量模式：本轮在已有 Brief / IA / 令牌 / 高保真 / 工程地基上**追加**屏幕。已上线屏幕：{', '.join(EXISTING) or '（见 docs/frontend/00-brief.md）'}。
- 不改已定屏幕的 brief 条目、线框、高保真稿、令牌现值与已实现页面（除非本轮新屏幕必需，且在 notes 说明影响面）；新增令牌只能追加，不能改旧值。
- 阶段起点先 `git fetch && git checkout {INT} && git merge --ff-only origin/{BASE} || git merge origin/{BASE}`，保证集成分支包含 {BASE} 上已发布内容。
"""


def screens_md(screens):
    return "\n".join(f"- `{s['id']}` {s['route']} — {s['purpose']}；状态：{', '.join(s['states'])}" for s in screens)


# ---------- prompts ----------
def brief_prompt():
    if EXTEND:
        step2 = f"2. 在已有 `docs/frontend/00-brief.md` 上**追加**本轮屏幕（≤{MAX_SCREENS} 屏，每屏 id/路由/目的/关键信息/必备状态 loading·empty·error·success），核心任务如需扩展只追加不改写；为新屏幕补 `content/<id>.md` 与 `mock/*.json`（与已有 mock 的实体、人名、金额口径一致）。"
        out_screens = "screens 只列本轮新增屏幕（不含已上线屏幕）"
    else:
        step2 = f"2. 按 templates/brief.md 写 `docs/frontend/00-brief.md`：目标用户与场景、核心任务（≤5）、屏幕清单（≤{MAX_SCREENS} 屏，每屏 id/路由/目的/关键信息/必备状态 loading·empty·error·success）、真实内容（写 `content/*.md` 与 `mock/*.json`，字段与量级符合真实业务）、非目标、约束（WCAG 2.2 AA、断点 375/768/1024/1440、亮/暗）。"
        out_screens = "screens（id/route/purpose/states）"
    return f"""你是 roles/product/product-manager（阅读 company-os roles/product/product-manager.md 与 CHARTER）。阶段 0：把老板的需求原话写成可被逐条核对的 Brief。
{COMMON}
老板原话：
<<<
{BRIEF_INPUT}
>>>
技术栈提示：{STACK}
步骤：
1. `git fetch && git checkout {INT} || git checkout -b {INT} origin/{BASE}`。
{step2}
3. commit（显式 add）并 push `{INT}`。
结构化输出：commit、brief_path、{out_screens}、stack（最终确定的技术栈一句话）、notes。"""


def ia_prompt(brief):
    return f"""你是 roles/design/ux-researcher。阶段 1：信息架构 + 低保真线框。
{COMMON}
输入：`{brief['brief_path']}`（commit {brief['commit']}）。屏幕：
{screens_md(brief['screens'])}
步骤：
1. checkout `{INT}` 并 pull。
2. {'更新' if EXTEND else '写'} `docs/frontend/01-ia.md`：站点地图、每屏信息优先级（用户第一眼看什么）、主流程（含错误/空态分支）、导航模型（应用壳 / 无壳页面区分）{'——只追加新屏幕相关内容，站点地图/导航补入新屏幕' if EXTEND else ''}。
3. 每{'个新' if EXTEND else ''}屏写 `design/wireframes/<id>.html`：纯灰度（只用 #000–#fff 灰阶）、无组件库、无图片、用真实文案（来自 content/）；同一文件内用 CSS 媒体查询覆盖 1440 与 375，375 下 `scrollWidth<=375`。
4. 门禁：Playwright/无头浏览器打开每个线框在 1440 与 375 下截图到本地检查（截图不入库），375 无横向滚动。
5. commit + push `{INT}`。
结构化输出：commit、ia_path、wireframes（文件路径列表）、notes。"""


def tokens_prompt(brief, ia):
    if EXTEND:
        return f"""你是 roles/design/ui-designer。阶段 2（增量）：校验并按需**追加**设计令牌。
{COMMON}
输入：`{brief['brief_path']}`、`{ia['ia_path']}`（commit {ia['commit']}）、现有 `design/tokens.json` / `design/tokens.css`。新屏幕线框：{', '.join(ia['wireframes'])}。
步骤：
1. checkout `{INT}` 并 pull。
2. 逐屏对照线框判断现有令牌是否够用（例如聊天气泡、营销页大标题字阶、表格密度、步骤条、代码块等）；缺的**追加**到 `design/tokens.json`（含 dark 覆盖与用途说明），已有值一律不改；不缺则不改文件。
3. `node design/build-tokens.mjs` 重新生成 tokens.css；`node design/check-contrast.mjs` 复核（含新增 role）。
4. 有改动则 commit + push `{INT}`；无改动 commit 填当前 HEAD。
结构化输出：commit、tokens_json、tokens_css、min_contrast、notes（列出新增令牌或写"无需新增"）。"""
    return f"""你是 roles/design/ui-designer。阶段 2：设计令牌（设计系统的唯一事实源）。
{COMMON}
输入：`{brief['brief_path']}`、`{ia['ia_path']}`（commit {ia['commit']}），品牌约束见 brief §7。
步骤：
1. checkout `{INT}` 并 pull。
2. 以 templates/tokens.json 为骨架写 `design/tokens.json`（W3C DTCG 格式）：字体族（含中文回退）、字阶 3–5 级、8pt 间距、1 主色 + 中性灰阶 + 语义色 + role 层（bg/surface/border/fg/fg-muted/primary…）及 dark 覆盖、圆角/阴影/边框、控件高度与热区 ≥40px、动效时长。每个值写一句用途说明，不要照抄模板色。
3. 写 `design/build-tokens.mjs` 从 tokens.json 生成 `design/tokens.css`（`:root` 与 `[data-theme=dark]` 两套 CSS 变量），并把生成结果一并提交。
4. 门禁：写 `design/check-contrast.mjs` 实测所有 fg×bg role 组合（亮/暗）的 WCAG 对比度，正文 ≥4.5:1、大字 ≥3:1，输出最小值；不过就调色。
5. commit + push `{INT}`。
结构化输出：commit、tokens_json、tokens_css、min_contrast（实测最小正文对比度）、notes。"""


def hifi_prompt(screen, brief, tokens):
    sid = screen["id"]
    return f"""你是 roles/design/ui-designer。阶段 3：屏幕 `{sid}`（{screen['route']}）的高保真设计稿（HTML 形式，是后续实现的唯一标准）。
{COMMON}
输入：brief `{brief['brief_path']}`、线框 `design/wireframes/{sid}.html`、令牌 `{tokens['tokens_css']}`（commit {tokens['commit']}）。屏幕目的：{screen['purpose']}；必备状态：{', '.join(screen['states'])}。
步骤：
1. `git fetch && git checkout -b fe01/hifi-{sid} origin/{INT}`。
2. 写 `design/hifi/{sid}/index.html`：只引用 `../../tokens.css` 变量（页面内 0 个硬编码色值/字号/间距，用 grep 自查）；真实文案与数据；覆盖全部状态（用 `?state=loading|empty|error|success` 或同页多区块）；1440 与 375 两断点；`data-theme=dark` 暗色完整；hover/focus-visible/disabled 样式；所有可点元素 ≥40px。
3. 用 Playwright 截基准图到 `design/hifi/{sid}/ref/`：{{desktop,mobile}}-{{light,dark}}-{{state}}.png，压缩后每张 <300KB。
4. 自查：对齐、留白节奏（8pt）、层级（标题/正文/辅助三级清晰）、文案长度极值（最长名字/金额）、375 无溢出。
5. commit + push `fe01/hifi-{sid}`。
结构化输出：screen、branch、commit、hifi_path、ref_shots（png 张数）、notes。"""


def hifi_merge_prompt(hifis):
    branches = ", ".join(f"`{h['branch']}`" for h in hifis)
    return f"""你是 roles/orchestrators/project-lead。把全部高保真分支合入 `{INT}`。
{COMMON}
分支：{branches}。各分支只改 design/hifi/<screen>/，理论上无冲突；出现非该目录的冲突 → merged=false 说明。
步骤：checkout `{INT}` → 逐个 `git merge --no-ff origin/<branch>` → 确认 design/hifi/ 下每屏都有 index.html 与 ref/*.png → push `{INT}`。
结构化输出：merged、commit、notes。"""


def foundation_prompt(brief, tokens, hifi_commit):
    if EXTEND:
        return f"""你是 roles/orchestrators/tech-lead。阶段 4（增量）：为本轮新屏幕补齐工程地基，不推翻现有工程。
{COMMON}
输入：brief `{brief['brief_path']}`、令牌 `{tokens['tokens_json']}` / `{tokens['tokens_css']}`、新屏幕高保真 `design/hifi/<id>/index.html`（{INT}@{hifi_commit}）；现有 `AGENTS.md`、`docs/frontend/04-components.md`、`/kitchen-sink`、`tools/*.mjs`。
步骤：
1. checkout `{INT}` 并 pull。
2. 逐屏对照高保真稿找出映射表里没有的控件（如聊天气泡/消息列表、步骤条、数据表格分页与筛选、开关、营销页 hero/定价卡等）：新增 `src/components/ui|composed/*`，外观只来自 theme.css 令牌；令牌有新增时同步 `src/styles/theme.css`。
3. 更新 `docs/frontend/04-components.md` 与 `/kitchen-sink`（新组件 × 变体 × 状态，亮暗）；`AGENTS.md` 补充新约定；`tools/*.mjs` 如需支持新屏幕的状态/视口配置一并补。
4. 门禁：`pnpm lint && pnpm typecheck && pnpm build` 全绿；`tools/shoot.mjs kitchen-sink`、`tools/a11y.mjs kitchen-sink` 通过；已上线屏幕 `tools/compare.mjs <id>` 不回退。
5. commit + push `{INT}`。
结构化输出：commit、base_library、components_doc、kitchen_sink_route、ai_context_path、check_commands（实际可跑的命令列表）、gates_passed、notes（列出新增组件）。"""
    return f"""你是 roles/orchestrators/tech-lead。阶段 4：工程地基——让后续每个 AI 实现会话拿到的是「我们的设计系统」而不是组件库默认值。
{COMMON}
输入：brief `{brief['brief_path']}`（stack：{brief['stack']}）、令牌 `{tokens['tokens_json']}` / `{tokens['tokens_css']}`、高保真 `design/hifi/*/index.html`（{INT}@{hifi_commit}）。
步骤：
1. checkout `{INT}` 并 pull。
2. 初始化工程（若仓库已有工程则在其内新增，不要推翻）：{STACK}。写 `docs/frontend/04-adr.md` 记录基座选择理由（无样式/低样式优先；对照 design/hifi 组件形态判断哪个库改造成本最低）。
3. 令牌注入：`src/styles/theme.css` 是唯一从 tokens.css 映射到基座主题（shadcn CSS 变量 / Tailwind `@theme` / 库 ThemeProvider）的地方；页面层禁止出现色值。
4. 写 `docs/frontend/04-components.md` 组件映射表：设计稿中出现的每种控件 ↔ 代码组件 + 变体 + 尺寸；缺的标 composed（自组）或 todo。
5. 实现 `/kitchen-sink` 路由：映射表中每个组件 × 变体 × 状态（default/hover/focus/disabled/loading/error），亮暗都对。
6. 文件式路由：`src/pages/<id>/` 目录自动成为路由（新增屏幕不改公共注册表）；mock 数据从 `mock/*.json` 读的 data 层。
7. 检查脚本：`tools/shoot.mjs <screen>`（1440/375 × 亮/暗 × 状态 截图）、`tools/compare.mjs <screen>`（与 design/hifi/<screen>/ref 做 pixelmatch，输出相似度与 diff 图）、`tools/a11y.mjs <screen>`（axe-core 对比度/热区/焦点 + 375 scrollWidth + console error）。
8. 按 templates/ai-context.md 写仓库根 `AGENTS.md`（事实源顺序、硬规则、可执行检查、分支约定）。
9. 门禁：`pnpm lint && pnpm typecheck && pnpm build` 全绿；`tools/shoot.mjs kitchen-sink` 出图并肉眼确认组件外观来自令牌（对照 design/hifi 的按钮/输入框/卡片形态）。
10. commit + push `{INT}`。
结构化输出：commit、base_library、components_doc、kitchen_sink_route、ai_context_path、check_commands（实际可跑的命令列表）、gates_passed、notes。"""


def impl_prompt(screen, foundation):
    sid = screen["id"]
    cmds = "\n".join(f"  - `{c}`" for c in foundation["check_commands"])
    return f"""你是 roles/engineering/frontend-engineer。阶段 5：按稿实现屏幕 `{sid}`（{screen['route']}）。
{COMMON}
先读仓库根 `{foundation['ai_context_path']}` 与 `{foundation['components_doc']}`（{INT}@{foundation['commit']}，基座 {foundation['base_library']}）。设计稿：`design/hifi/{sid}/index.html` 与 `design/hifi/{sid}/ref/*.png` 是唯一标准，不自由发挥。
步骤：
1. `git fetch && git checkout -b fe01/screen-{sid} origin/{INT}`。
2. 实现 `src/pages/{sid}/`：只用映射表中的组件与 theme.css 令牌；数据只从 mock/ 读；状态 {', '.join(screen['states'])} 全部真实可切换；断点 375/768/1024/1440；亮暗；hover/focus-visible/disabled。
3. 门禁（全部实际运行）：
{cmds}
  - `tools/compare.mjs {sid}`：与基准图并排/像素比对，明显差异逐项修到一致；
  - 375 下 scrollWidth<=375；console error = 0。
4. commit + push `fe01/screen-{sid}`。设计稿本身的问题不要改稿，写进 notes。
顺序建议（时间盒 60 分钟）：先 4 个状态 + 1440/375 + 亮暗跑通并过门禁（约前 40 分钟），再按 compare 差异修细节；不要为像素级差异反复微调。
结构化输出：screen、branch、commit、gates_passed、notes。"""


def escalate_prompt(screen, impl, review):
    sid = screen["id"]
    issues = json.dumps(review["blocking_issues"], ensure_ascii=False, indent=1)
    return f"""你是 roles/orchestrators/tech-lead。屏幕 `{sid}` 的实现分支 `{impl['branch']}`（commit {impl['commit']}）经 2 轮修复仍未通过独立审查，现由你接手做最后一轮升级修复。
{COMMON}
仍在阻塞的问题：
{issues}
要求：先用浏览器/脚本**复现**每一条，再修；怀疑审查判断有误的，用实测证据写进 unfixed 说明。修后重跑 `AGENTS.md` 列出的全部门禁 + `tools/compare.mjs {sid}` + `tools/a11y.mjs {sid}`，push 同一分支。
结构化输出：commit、fixed、unfixed。"""


def review_prompt(stage, target, checklist):
    return f"""你是独立审查员（roles/design/ui-designer 或 roles/qa/code-reviewer 视阶段而定；不得是产出者会话；只审不改，不提交任何代码）。审查 {REPO} {target}。
{COMMON}
审查清单（templates/visual-qa.md 为通用底稿）：
{checklist}
每条问题写成「文件/路由 + 视口 + 主题 + 现象」，可被修复者直接定位。硬指标任一不过即 blocking。
结构化输出：verdict（pass / fix）、blocking_issues、minor_issues。"""


CHECKS = {
    "brief": "屏幕清单每屏含 loading/empty/error；核心任务 ≤5 且可被屏幕覆盖；content/ 与 mock/ 全是真实、量级合理的内容（无 lorem/随机数/占位名）；非目标与约束明确；老板原话中的每个要求都能在 brief 中找到对应行。",
    "ia": "每个线框在浏览器可打开；层级与主流程与 brief 一致；无色/无组件库；375 无横向滚动（实测 scrollWidth）；应用壳/无壳页面区分正确；错误与空态分支在流程图中存在。",
    "tokens": "DTCG 格式合法（$type/$value）；字阶 3–5 级、8pt 间距、role 层完整且 dark 覆盖；运行 design/check-contrast.mjs 复核正文 ≥4.5:1；tokens.css 与 tokens.json 一致（重新生成后 git diff 为空）；无照抄模板默认色而不说明。",
    "hifi": "只引用 tokens.css 变量（grep 页面内 #hex/px 硬编码为 0，字号间距允许 calc/var）；全部状态、1440/375、亮/暗齐全；六项：布局骨架/间距节奏/字阶层级/色彩/组件形态/交互反馈；硬指标：375 无溢出、热区 ≥40px、对比度 ≥4.5:1、暗色无白块、文案极值不破版；ref/ 基准图与页面一致。",
    "foundation": "lint/typecheck/build 实跑全绿；/kitchen-sink 每个组件外观来自令牌（对照 design/hifi 的控件形态，不是库默认蓝）；页面层 grep 无硬编码色值；AGENTS.md 与 04-components.md 与实际代码一致；tools/shoot|compare|a11y 三个脚本可运行；文件式路由生效。",
    "impl": "checkout 该分支并实跑 check_commands；对照 design/hifi/<screen>/ref 逐图六项打分（布局骨架/间距/字阶/色彩/组件形态/交互反馈）；全部状态存在且真实；硬指标：375 无溢出、热区 ≥40px、对比度 ≥4.5:1、暗色无白块、0 console error；页面层无硬编码色值/字号；数据来自 mock。",
}


def fix_prompt(stage, target, branch, review):
    issues = json.dumps({"blocking": review["blocking_issues"], "minor": review["minor_issues"]}, ensure_ascii=False, indent=1)
    return f"""你是本阶段（{stage}）的产出者角色。{target} 未通过独立审查，请逐条修复并推送到同一分支 `{branch}`。
{COMMON}
问题清单：
{issues}
要求：blocking 全部修复；minor 尽量修，修不了的在 unfixed 说明原因。修复后重跑本阶段全部门禁。
结构化输出：commit、fixed、unfixed。"""


def merge_prompt(impl):
    return f"""你是 roles/orchestrators/project-lead。把实现分支 `{impl['branch']}`（屏幕 {impl['screen']}，commit {impl['commit']}）合入 `{INT}`。
{COMMON}
步骤：checkout `{INT}` 并 pull → `git merge --no-ff origin/{impl['branch']}`（冲突只应在 lockfile：取 {INT} 版本后 `pnpm install` 重生成；其他冲突 → merged=false 说明）→ `pnpm lint && pnpm typecheck && pnpm build` → push `{INT}`。
结构化输出：merged、commit、notes。"""


def scope_md(merged_ids, unmerged):
    lines = [f"本轮已合入集成分支的屏幕：{', '.join(merged_ids) or '（无）'}" + (f"；已上线需回归的屏幕：{', '.join(EXISTING)}" if EXISTING else "") + "。"]
    if unmerged:
        lines.append("**本轮明确未合入**（实现未过审，不在本次走查/审计范围，不要把它们的缺失记为 P0/P1）：")
        lines += [f"- `{u['screen']}`：{'；'.join(u['issues'][:3])}" for u in unmerged]
    return "\n".join(lines)


def walkthrough_prompt(brief, commit, merged_ids, unmerged, recheck=None):
    recheck_md = f"\n这是第 {recheck} 轮复查：只需 ① 逐条复验上轮 P0/P1 是否修复 ② 回归一遍主流程；不再全量探索，时间盒 30 分钟。" if recheck else ""
    return f"""你是 roles/legal-research/user-experience-officer（体验官）。在 `{INT}`@{commit} 上以真实用户身份走完 brief 的全部核心任务。
{COMMON}
输入：`{brief['brief_path']}`。屏幕：
{screens_md(brief['screens'])}
{scope_md(merged_ids, unmerged)}{recheck_md}
步骤：本地 `pnpm install && pnpm build && pnpm preview`（或 dev），用浏览器在 1440 与 375（触屏模拟）各走一遍全部核心任务，亮/暗各一次；记录卡点、看不懂的文案、点不到的按钮、状态缺失、层级混乱；按 P0（无法完成任务）/P1（明显粗糙或误导）/P2/P3 分级，写 `docs/frontend/07-ux-walkthrough.md`（含截图路径描述，截图不入库）并 push `{INT}`。只写报告，不改产品代码。
结构化输出：verdict（无 P0/P1 = pass）、p0_p1、p2_p3、report_path。"""


def audit_prompt(brief, commit, merged_ids, unmerged, recheck=None):
    recheck_md = f"\n这是第 {recheck} 轮复查：只需复验上轮 P0/P1 + 重跑 ①② 两项；时间盒 30 分钟。" if recheck else ""
    return f"""你是 roles/qa/qa-engineer，兼做合规与安全审计（CHARTER 四道把关中的 QA + 审计两道）。在 `{INT}`@{commit} 上审计。
{COMMON}
输入：`{brief['brief_path']}`。
{scope_md(merged_ids, unmerged)}{recheck_md}
检查：① 本地实跑 lint/typecheck/build；② 每屏 `tools/a11y.mjs <screen>`（axe-core 违规、375 溢出、console error）；③ 依赖许可证（`pnpm licenses list` 或等价）：无 GPL/AGPL/非开源许可进入生产依赖，字体为 OFL/自有；④ 无第三方文案/图片/商标；⑤ 无 secrets 入库、无放宽 minimumReleaseAge；⑥ mock 数据不含真实个人信息。按 P0/P1/P2/P3 写 `docs/frontend/07-qa-audit.md` 并 push `{INT}`。只写报告，不改产品代码。
结构化输出：verdict（无 P0/P1 = pass）、p0_p1、p2_p3、report_path。"""


def walk_fix_prompt(walk):
    issues = json.dumps(walk["p0_p1"], ensure_ascii=False, indent=1)
    return f"""你是 roles/engineering/frontend-engineer。体验官走查 / QA 审计（{walk['report_path']}）发现 P0/P1，请在 `{INT}` 上直接修复并 push。
{COMMON}
P0/P1 清单：
{issues}
修复后重跑 lint/typecheck/build 与相关屏的 tools/compare、tools/a11y；不得偏离 design/hifi 定稿（若定稿本身导致 P0，改稿 + 更新 ref 图并在 fixed 中说明）。
结构化输出：commit、fixed、unfixed。"""


def release_prompt(commit, merged_ids, unmerged):
    deploy = f"执行 `{DEPLOY_CMD}`，成功后填 deployed_url" if DEPLOY_CMD else "本轮不部署，deployed_url 留空"
    return f"""你是 roles/orchestrators/project-lead。发布：`{INT}`@{commit} → `{BASE}` → 部署 → 交接文档。
{COMMON}
{scope_md(merged_ids, unmerged)}
步骤：
1. checkout `{BASE}` 并 pull；`git merge --no-ff origin/{INT}`；`pnpm install && pnpm lint && pnpm typecheck && pnpm build` 全绿（公司规则：不依赖 GitHub Actions，本地全绿即合）。
2. `git push origin {BASE}`（禁止 force）。
3. {deploy}。
4. 更新 `docs/handoff-context.md`：本轮八阶段产物路径、分支、commit、部署地址、体验官报告中的 P2/P3 遗留、**未合入屏幕及其阻塞问题与分支**、下一轮建议；commit + push `{BASE}`。
结构化输出：main_commit、deployed_url、handoff_path、notes。"""


# ---------- 运行时 ----------
agent_slots = asyncio.Semaphore(MAX_CONCURRENT)
merge_lock = asyncio.Lock()


async def run_agent(prompt, **kw):
    delay = 120
    for attempt in range(8):
        async with agent_slots:
            try:
                return await agent(prompt, repos=[REPO_SLUG], **kw)
            except WorkflowAgentError as e:
                if "429" not in str(e) and "concurrent session limit" not in str(e):
                    raise
                log(f"[{kw.get('label')}] 429 concurrent limit, retry #{attempt + 1} in {delay}s")
        await asyncio.sleep(delay)
        delay = min(delay * 2, 900)
    raise WorkflowAgentError(f"{kw.get('label')}: gave up after repeated 429")


async def reviewed(stage, phase, label, produce_prompt, schema, branch_of, target_of, minutes=45, review_minutes=30):
    """产出 → 独立审查 → (修复 → 再审) ≤2 轮。返回 (result, passed)。"""
    out = await run_agent(produce_prompt, phase=phase, schema=schema, label=label, soft_time_limit_minutes=minutes)
    branch = branch_of(out)
    target = target_of(out)
    log(f"[{label}] produced {branch}@{out['commit'][:8]}")
    rev = await run_agent(review_prompt(stage, target, CHECKS[stage]), phase=phase, schema=REVIEW_SCHEMA, label=f"{label}-review", soft_time_limit_minutes=review_minutes)
    rounds = 0
    while rev["verdict"] != "pass" and rounds < 2:
        log(f"[{label}] review=fix blocking={len(rev['blocking_issues'])}")
        fixed = await run_agent(fix_prompt(stage, target, branch, rev), phase=phase, schema=FIX_SCHEMA, label=f"{label}-fix{rounds + 1}", soft_time_limit_minutes=minutes)
        out = {**out, "commit": fixed["commit"]}
        target = target_of(out)
        rounds += 1
        rev = await run_agent(review_prompt(stage, target, CHECKS[stage]), phase=phase, schema=REVIEW_SCHEMA, label=f"{label}-review{rounds + 1}", soft_time_limit_minutes=review_minutes)
    passed = rev["verdict"] == "pass"
    log(f"[{label}] final={'pass' if passed else 'FAIL'} after {rounds} fix rounds")
    if not passed:
        log("BLOCKING " + json.dumps({"stage": label, "issues": rev["blocking_issues"]}, ensure_ascii=False))
    return out, passed, rev


def int_target(path_desc):
    return lambda out: f"分支 `{INT}` commit {out['commit']}：{path_desc(out)}"


async def main():
    await register_workflow(META)
    log(f"fe01 {REPO_SLUG}: base={BASE} int={INT} max_screens={MAX_SCREENS} extend={EXTEND} existing={EXISTING}")

    # 0 brief
    brief, ok, _ = await reviewed("brief", "brief", "brief", brief_prompt(), BRIEF_SCHEMA, lambda o: INT, int_target(lambda o: f"`{o['brief_path']}` + content/ + mock/"), minutes=40)
    if not ok:
        return log("ABORT brief 未过审")
    screens = brief["screens"][:MAX_SCREENS]
    log(f"screens: {', '.join(s['id'] for s in screens)}")

    # 1 ia
    ia, ok, _ = await reviewed("ia", "ia", "ia", ia_prompt({**brief, "screens": screens}), IA_SCHEMA, lambda o: INT, int_target(lambda o: f"`{o['ia_path']}` + design/wireframes/*.html"), minutes=45)
    if not ok:
        return log("ABORT ia 未过审")

    # 2 tokens
    tokens, ok, _ = await reviewed("tokens", "tokens", "tokens", tokens_prompt(brief, ia), TOKENS_SCHEMA, lambda o: INT, int_target(lambda o: f"`{o['tokens_json']}` / `{o['tokens_css']}`"), minutes=40)
    if not ok:
        return log("ABORT tokens 未过审")

    # 3 hifi（每屏并行，独立分支）→ 合入集成分支
    async def one_hifi(s):
        return await reviewed("hifi", "hifi", f"hifi-{s['id']}", hifi_prompt(s, brief, tokens), HIFI_SCHEMA, lambda o: o["branch"], lambda o: f"分支 `{o['branch']}` commit {o['commit']}：`{o['hifi_path']}` 与 ref/", minutes=60, review_minutes=40)

    hifi_results = await asyncio.gather(*(one_hifi(s) for s in screens), return_exceptions=True)
    hifis, screens_ok = [], []
    for s, r in zip(screens, hifi_results):
        if isinstance(r, Exception):
            log(f"[hifi-{s['id']}] agent error: {r}")
        elif r[1]:
            hifis.append(r[0])
            screens_ok.append(s)
        else:
            log(f"[hifi-{s['id']}] 未过审，本轮不实现该屏")
    if not hifis:
        return log("ABORT 没有任何屏幕的高保真过审")
    hm = await run_agent(hifi_merge_prompt(hifis), phase="hifi", schema=MERGE_SCHEMA, label="hifi-merge", soft_time_limit_minutes=30)
    if not hm["merged"]:
        return log("ABORT hifi 合并失败: " + hm["notes"])

    # 4 foundation
    foundation, ok, _ = await reviewed("foundation", "foundation", "foundation", foundation_prompt(brief, tokens, hm["commit"]), FOUNDATION_SCHEMA, lambda o: INT, int_target(lambda o: f"工程地基（{o['base_library']}）、`{o['components_doc']}`、{o['kitchen_sink_route']}、`{o['ai_context_path']}`"), minutes=60, review_minutes=40)
    if not ok or not foundation["gates_passed"]:
        return log("ABORT foundation 未过审或门禁未过")

    # 5+6 implement（每屏并行）→ 独立视觉 QA → 串行合入集成分支
    async def one_impl(s):
        sid = s["id"]
        target_of = lambda o: f"分支 `{o['branch']}` commit {o['commit']}：src/pages/{sid}/ 对照 design/hifi/{sid}/ref"
        out, passed, rev = await reviewed("impl", "implement", f"impl-{sid}", impl_prompt(s, foundation), IMPL_SCHEMA, lambda o: o["branch"], target_of, minutes=60, review_minutes=40)
        if not passed or not out["gates_passed"]:
            # 显式升级：tech-lead 接手一轮 → 再审一次；仍不过则该屏本轮不合入
            if rev["verdict"] == "pass":
                rev = {**rev, "blocking_issues": ["实现会话自报 gates_passed=false：" + out["notes"]]}
            log(f"[impl-{sid}] escalate → tech-lead")
            esc = await run_agent(escalate_prompt(s, out, rev), phase="implement", schema=FIX_SCHEMA, label=f"impl-{sid}-escalate", soft_time_limit_minutes=60)
            out = {**out, "commit": esc["commit"], "gates_passed": True}
            rev = await run_agent(review_prompt("impl", target_of(out), CHECKS["impl"]), phase="implement", schema=REVIEW_SCHEMA, label=f"impl-{sid}-review-final", soft_time_limit_minutes=40)
            if rev["verdict"] != "pass":
                log("UNMERGED " + json.dumps({"screen": sid, "branch": out["branch"], "issues": rev["blocking_issues"]}, ensure_ascii=False))
                return {"screen": sid, "state": "qa_failed", "branch": out["branch"], "issues": rev["blocking_issues"]}
            log(f"[impl-{sid}] escalation passed")
        async with merge_lock:
            m = await run_agent(merge_prompt(out), phase="integrate", schema=MERGE_SCHEMA, label=f"merge-{s['id']}", soft_time_limit_minutes=30)
        return {"screen": s["id"], "state": "merged" if m["merged"] else "merge_failed", "commit": m["commit"], "notes": m["notes"]}

    impl_results = await asyncio.gather(*(one_impl(s) for s in screens_ok), return_exceptions=True)
    merged, unmerged = [], []
    for s, r in zip(screens_ok, impl_results):
        if isinstance(r, Exception):
            log(f"[impl-{s['id']}] agent error: {r}")
            unmerged.append({"screen": s["id"], "branch": f"fe01/screen-{s['id']}", "issues": [f"agent error: {r}"]})
        else:
            log(f"[impl-{s['id']}] {r['state']}")
            if r["state"] == "merged":
                merged.append(r)
            else:
                unmerged.append({"screen": s["id"], "branch": r.get("branch", ""), "issues": r.get("issues") or [r.get("notes", r["state"])]})
    if not merged:
        return log("ABORT 没有任何屏幕合入集成分支")
    merged_ids = [m["screen"] for m in merged]

    # 7 integrate：体验官走查 → 修 P0/P1（≤2 轮）→ 发布
    last = merged[-1]["commit"]
    async def gates(commit, suffix, recheck=None):
        ux, qa = await asyncio.gather(
            run_agent(walkthrough_prompt(brief, commit, merged_ids, unmerged, recheck), phase="integrate", schema=WALK_SCHEMA, label=f"ux-walkthrough{suffix}", soft_time_limit_minutes=30 if recheck else 45),
            run_agent(audit_prompt(brief, commit, merged_ids, unmerged, recheck), phase="integrate", schema=WALK_SCHEMA, label=f"qa-audit{suffix}", soft_time_limit_minutes=30 if recheck else 45),
        )
        return {
            "verdict": "pass" if ux["verdict"] == "pass" and qa["verdict"] == "pass" else "fix",
            "p0_p1": ux["p0_p1"] + qa["p0_p1"], "p2_p3": ux["p2_p3"] + qa["p2_p3"],
            "report_path": f"{ux['report_path']} , {qa['report_path']}",
        }

    walk = await gates(last, "")
    rounds = 0
    while walk["verdict"] != "pass" and rounds < 2:
        log(f"[gates] P0/P1={len(walk['p0_p1'])} → fix round {rounds + 1}")
        fixed = await run_agent(walk_fix_prompt(walk), phase="integrate", schema=FIX_SCHEMA, label=f"gates-fix{rounds + 1}", soft_time_limit_minutes=60)
        last = fixed["commit"]
        rounds += 1
        walk = await gates(last, str(rounds + 1), recheck=rounds + 1)
    if walk["verdict"] != "pass":
        return log("ABORT 体验走查仍有 P0/P1: " + json.dumps(walk["p0_p1"], ensure_ascii=False))
    rel = await run_agent(release_prompt(last, merged_ids, unmerged), phase="integrate", schema=RELEASE_SCHEMA, label="release", soft_time_limit_minutes=45)
    log("SUMMARY " + json.dumps({
        "screens_total": len(screens), "hifi_passed": len(hifis), "merged": merged_ids, "unmerged": unmerged,
        "main_commit": rel["main_commit"], "deployed_url": rel["deployed_url"], "handoff": rel["handoff_path"],
        "ux_p2_p3": walk["p2_p3"],
    }, ensure_ascii=False))


asyncio.run(main())
