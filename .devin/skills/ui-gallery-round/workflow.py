import asyncio
import json
import os

REPO = "github.com/wookat/ui-gallery"
REPO_SLUG = "wookat/ui-gallery"
ROUND = int(os.environ.get("UI_GALLERY_ROUND", "1"))
REPO_DIR = os.environ.get("UI_GALLERY_REPO_DIR", os.path.expanduser("~/repos/ui-gallery"))
LIBS_PATH = os.path.join(REPO_DIR, "docs", "libraries.json")

with open(LIBS_PATH, encoding="utf-8") as f:
    LIBS = [x for x in json.load(f)["libraries"] if x.get("round") == ROUND]
LIBS.sort(key=lambda x: x["slug"])

META = {
    "name": f"ui-gallery-round-{ROUND}",
    "description": "为每个 UI 组件库实现 8 页参考应用 → 独立视觉审查 → 修复 → 串行合入 main 并部署",
    "product": "wookat/ui-gallery",
    "phases": [
        {"title": "build", "detail": "按 apps/README.md 模板实现 apps/<slug>，推送 lib/<slug> 分支", "labels": [f"build-{l['slug']}" for l in LIBS], "soft_time_limit_minutes": 60},
        {"title": "review", "detail": "独立视觉审查（SOP-10 清单），只报问题不改代码", "labels": [f"review-{l['slug']}" for l in LIBS], "soft_time_limit_minutes": 30},
        {"title": "fix", "detail": "按审查清单修复并推送同一分支", "labels": [f"fix-{l['slug']}" for l in LIBS], "soft_time_limit_minutes": 45},
        {"title": "merge", "detail": "串行合入 main：重装 lockfile、全量 build/shoot/assemble、wrangler 部署", "labels": [f"merge-{l['slug']}" for l in LIBS], "soft_time_limit_minutes": 25},
    ],
}

BUILD_SCHEMA = {
    "type": "object",
    "properties": {
        "slug": {"type": "string"},
        "branch": {"type": "string"},
        "commit": {"type": "string"},
        "gates_passed": {"type": "boolean"},
        "missing_components": {"type": "array", "items": {"type": "string"}},
        "composed_components": {"type": "array", "items": {"type": "string"}},
        "notes": {"type": "string"},
    },
    "required": ["slug", "branch", "commit", "gates_passed", "notes"],
}

REVIEW_SCHEMA = {
    "type": "object",
    "properties": {
        "verdict": {"type": "string", "enum": ["pass", "fix"]},
        "blocking_issues": {"type": "array", "items": {"type": "string"}},
        "minor_issues": {"type": "array", "items": {"type": "string"}},
        "screenshots_checked": {"type": "integer"},
    },
    "required": ["verdict", "blocking_issues", "minor_issues"],
}

FIX_SCHEMA = {
    "type": "object",
    "properties": {"commit": {"type": "string"}, "fixed": {"type": "array", "items": {"type": "string"}}, "unfixed": {"type": "array", "items": {"type": "string"}}},
    "required": ["commit", "fixed", "unfixed"],
}

MERGE_SCHEMA = {
    "type": "object",
    "properties": {"merged": {"type": "boolean"}, "main_commit": {"type": "string"}, "deployed_url": {"type": "string"}, "notes": {"type": "string"}},
    "required": ["merged", "main_commit", "notes"],
}

COMMON_RULES = """
仓库：https://github.com/wookat/ui-gallery （分支 main）。全程中文提交说明可中英混用。
硬性规则：
- 先读 docs/page-spec.md、apps/README.md、packages/spec/contract.json，并对照参考实现 apps/shadcn-ui 的目录结构、gallery.json 与路由/主题/字体/图标参数约定；新应用必须与之一致（8 路由、?theme=、?font=、?icon=、basename /apps/<slug>）。
- 用该库的官方默认主题，不写自定义配色；用该库原生框架（package 字段 framework）。
- 所有数据只从 @ui-gallery/spec 的 mock/*.json 读取，不自造文案。
- 不启用 GitHub Actions；不修改 pnpm-workspace.yaml 的 minimumReleaseAge/allowBuilds 之外的供应链策略；依赖遇到 ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION 时降版本，不放宽策略。
- 不提交生成的 PNG、dist、node_modules。
- 不复制任何竞品/官网真实文案、图片、商标；字体只用仓库已自托管的 OFL 字体。
- 只允许改动 apps/<slug>/ 目录、pnpm-lock.yaml，以及 docs/libraries.json 中你这一行的 status 字段；不要动 apps/shadcn-ui、gallery/、tools/、packages/。
"""


def build_prompt(lib):
    return f"""你是 UI Gallery 项目的「建库工程师」。任务：在 {REPO} 为组件库 **{lib['name']}**（GitHub {lib['repo']}，npm 主包 {lib['pkg']}，框架 {lib['framework']}）实现参考应用 `apps/{lib['slug']}/`。
{COMMON_RULES}
步骤：
1. `git checkout -b lib/{lib['slug']}` 基于最新 main。
2. 用该库官方推荐方式初始化（CLI 或手工），实现 docs/page-spec.md 的全部 8 个页面及其全部状态（加载/空/错误/hover/暗色/移动端 375）。
3. `/components` 必须展示该库导出的全部组件 × 变体 × 尺寸 × 状态；contract.json 中每个组件在 gallery.json.coverage 标 implemented / composed / missing，不得静默省略。
4. 图标：若库自带图标体系，默认用它并把 gallery.json.theme.nativeIcons 设 true，同时仍要支持 ?icon= 切换到 lucide/tabler/phosphor/heroicons（React 用 packages/icons-react；其他框架按 apps/README.md 说明处理，做不到的在 notes 说明）。
5. 质量门（全部必须通过）：`pnpm install`、`pnpm --filter {lib['slug']} lint`、`pnpm --filter {lib['slug']} typecheck`、`pnpm --filter {lib['slug']} build`、`pnpm build`、`node tools/shoot/shoot.mjs {lib['slug']}`（应产出 34 张截图）、Playwright 自查 375px 下 document.documentElement.scrollWidth<=375 且 0 console error。
6. 在 docs/libraries.json 把本库 status 设为 "built"。
7. 一个或多个 commit，推送分支 `lib/{lib['slug']}`（不要开 PR，不要推 main）。
结构化输出：slug、branch、commit（最新 hash）、gates_passed、missing_components、composed_components、notes（图标/字体/暗色的取舍与已知问题）。"""


def review_prompt(lib, built):
    return f"""你是 UI Gallery 项目的「视觉审查员」（独立于实现者，只审不改）。审查 {REPO} 分支 `{built['branch']}`（commit {built['commit']}）中的 `apps/{lib['slug']}/`（组件库 {lib['name']}）。
{COMMON_RULES}
步骤：
1. checkout 该分支，`pnpm install && pnpm build && node tools/shoot/shoot.mjs {lib['slug']}`，逐张查看 shots/{lib['slug']}/ 的全部截图（8 路由 × 桌面/移动 × 亮/暗 + components 长图）。
2. 对照 docs/page-spec.md 逐页核对信息结构与组件是否齐全；核对 gallery.json.coverage 与 /components 页面实际展示是否一致（标 implemented 却没出现 = 阻塞）。
3. 硬指标：375px 无横向溢出；点击热区 ≥40px；正文对比度 ≥4.5:1；0 console error；暗色模式全页生效（无白块）；loading/empty/error 三态真实存在；/login 与 /landing 无应用壳。
4. 视觉：是否用官方默认主题（未偷换配色）、排版层级、间距一致性、图标切换与字体切换是否真的生效。
不要修改任何代码。结构化输出：verdict（pass / fix）、blocking_issues（每条含路由+视口+主题+现象，例如「/orders mobile dark：表格横向溢出到 412px」）、minor_issues、screenshots_checked。"""


def fix_prompt(lib, built, review):
    issues = json.dumps({"blocking": review["blocking_issues"], "minor": review["minor_issues"]}, ensure_ascii=False, sort_keys=True, indent=1)
    return f"""你是 UI Gallery 项目的「建库工程师」。分支 `{built['branch']}` 的 `apps/{lib['slug']}/`（组件库 {lib['name']}）未通过独立视觉审查，请逐条修复并推送同一分支。
{COMMON_RULES}
审查问题清单：
{issues}
要求：blocking 全部修复；minor 尽量修复，修不了的在 unfixed 说明原因。修复后重跑全部质量门（lint/typecheck/build/pnpm build/shoot/375 溢出/console error）。推送到 `{built['branch']}`，不开 PR。
结构化输出：commit、fixed、unfixed。"""


def merge_prompt(lib, built):
    return f"""你是 UI Gallery 项目的「集成工程师」。把 {REPO} 分支 `{built['branch']}`（`apps/{lib['slug']}/`，组件库 {lib['name']}）合入 main 并部署。
{COMMON_RULES}
步骤：
1. `git fetch && git checkout main && git pull`，然后 `git merge --no-ff origin/{built['branch']}`。冲突只应出现在 pnpm-lock.yaml 与 docs/libraries.json：lockfile 取 main 版本后执行 `pnpm install` 重新生成；libraries.json 保留双方 status 改动。其他文件冲突 → 停止，merged=false 并说明。
2. 全量验证：`pnpm install && pnpm lint && pnpm typecheck && pnpm build && node tools/shoot/shoot.mjs {lib['slug']} && node tools/assemble.mjs`，dist/manifest.json 必须包含 {lib['slug']}。
3. 在 docs/libraries.json 把本库 status 设为 "merged"，作为合并提交的一部分。
4. `git push origin main`（禁止 force）。
5. 部署：若环境有 CLOUDFLARE_API_TOKEN，执行 `CLOUDFLARE_ACCOUNT_ID=ddff52d24ee44e21a021c15eaffcc86d pnpm exec wrangler deploy`（wrangler.jsonc 已在仓库根，assets 目录 dist；注意 dist/shots 需由 tools/shoot 全量产出：先跑 `node tools/shoot/shoot.mjs` 不带参数生成所有库截图再 assemble 再部署），成功后 deployed_url 填 https://ui.zalize.com ；没有 token 则留空并在 notes 说明。
结构化输出：merged、main_commit、deployed_url、notes。"""


merge_lock = asyncio.Lock()
# 组织并发会话上限 100，其他会话也在占用；限制本工作流同时在跑的子会话数，并对 429 退避重试
MAX_CONCURRENT = int(os.environ.get("UI_GALLERY_MAX_CONCURRENT", "12"))
agent_slots = asyncio.Semaphore(MAX_CONCURRENT)


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


async def build(lib):
    return await run_agent(build_prompt(lib), phase="build", schema=BUILD_SCHEMA, label=f"build-{lib['slug']}", soft_time_limit_minutes=60)


async def review(lib, built):
    return await run_agent(review_prompt(lib, built), phase="review", schema=REVIEW_SCHEMA, label=f"review-{lib['slug']}", soft_time_limit_minutes=40)


async def fix(lib, built, rev):
    return await run_agent(fix_prompt(lib, built, rev), phase="fix", schema=FIX_SCHEMA, label=f"fix-{lib['slug']}", soft_time_limit_minutes=60)


async def merge(lib, built):
    async with merge_lock:
        return await run_agent(merge_prompt(lib, built), phase="merge", schema=MERGE_SCHEMA, label=f"merge-{lib['slug']}", soft_time_limit_minutes=40)


async def run_lib(lib):
    slug = lib["slug"]
    try:
        built = await build(lib)
        log(f"[{slug}] built {built['branch']}@{built['commit'][:8]} gates={built['gates_passed']}")
        if not built["gates_passed"]:
            return {"slug": slug, "state": "gates_failed", "notes": built["notes"]}
        rev = await review(lib, built)
        log(f"[{slug}] review={rev['verdict']} blocking={len(rev['blocking_issues'])}")
        rounds = 0
        while rev["verdict"] != "pass" and rounds < 2:
            fixed = await fix(lib, built, rev)
            built = {**built, "commit": fixed["commit"]}
            rounds += 1
            rev = await review(lib, built)
            log(f"[{slug}] re-review#{rounds}={rev['verdict']} blocking={len(rev['blocking_issues'])}")
        if rev["verdict"] != "pass":
            return {"slug": slug, "state": "review_failed", "branch": built["branch"], "issues": rev["blocking_issues"]}
        merged = await merge(lib, built)
        log(f"[{slug}] merged={merged['merged']} main={merged['main_commit'][:8]} url={merged.get('deployed_url','')}")
        return {"slug": slug, "state": "merged" if merged["merged"] else "merge_failed", "notes": merged["notes"]}
    except WorkflowAgentError as e:
        log(f"[{slug}] agent error: {e}")
        return {"slug": slug, "state": "agent_error", "notes": str(e)}


async def main():
    await register_workflow(META)
    log(f"round {ROUND}: {len(LIBS)} libs: {', '.join(l['slug'] for l in LIBS)}")
    results = await asyncio.gather(*(run_lib(l) for l in LIBS))
    summary = {}
    for r in results:
        summary.setdefault(r["state"], []).append(r["slug"])
    log("SUMMARY " + json.dumps(summary, ensure_ascii=False, sort_keys=True))
    for r in results:
        if r["state"] != "merged":
            log("DETAIL " + json.dumps(r, ensure_ascii=False, sort_keys=True))


asyncio.run(main())
