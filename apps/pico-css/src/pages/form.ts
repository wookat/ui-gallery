import { icon } from "../icons"

export function render(): string {
  return `<div class="page-heading"><div><small>ACME CONSOLE</small><h1>创建项目</h1><p>用三步完成一个新的工作区配置。</p></div></div>
  <ol class="stepper" id="stepper"><li class="active"><span class="step-number">1</span>基本信息</li><li><span class="step-number">2</span>详细配置</li><li><span class="step-number">3</span>确认提交</li></ol>
  <form id="project-form" novalidate><section data-step="1"><article><header><h2>基本信息</h2><p>告诉我们项目的基础信息。</p></header><div class="form-grid"><label>项目名称 *<input name="name" required placeholder="例如：增长分析" /></label><label>项目类型<select required name="type"><option value="">选择类型</option><option>Pro plan</option><option>Team plan</option></select></label><label class="span-2">邮箱 *<input name="email" type="email" required placeholder="you@example.com" /></label><label class="span-2">电话<div role="group"><select aria-label="国家代码"><option>+86</option><option>+1</option></select><input type="tel" placeholder="电话号码" /></div></label><label class="span-2">描述<textarea id="description" maxlength="500" placeholder="描述你的项目目标..."></textarea><small><span id="char-count">0</span>/500</small></label><fieldset><legend>项目规模</legend><label><input type="radio" name="size" value="small" required />小型团队</label><label><input type="radio" name="size" value="large" />协作团队</label></fieldset><fieldset><legend>功能</legend><label><input type="checkbox" />数据分析</label><label><input type="checkbox" />团队协作</label></fieldset><label role="switch"><input type="checkbox" role="switch" checked /> 接收项目活动提醒</label></div><footer><button type="button" id="next-1">下一步${icon("arrow-right")}</button></footer></article></section>
  <section data-step="2" hidden><article><header><h2>详细配置</h2><p>选择计划、权限与通知。</p></header><div class="form-grid"><label>计划<select><option>Pro</option><option>Team</option></select></label><label>通知频率<select><option>每日</option><option>每周</option></select></label><label>语言（多选）<select multiple><option>中文</option><option>English</option><option>日本語</option></select></label><label>快捷搜索<input list="teams" placeholder="选择团队" /><datalist id="teams"><option value="增长团队"></option><option value="产品团队"></option></datalist></label><label>日期<input type="date" /></label><label>时间<input type="time" /></label><label>日期范围<div role="group"><input type="date" /><input type="date" /></div></label><label class="span-2">采样区间<div role="group"><input type="range" value="20" min="0" max="100" /><input type="range" value="80" min="0" max="100" /></div></label><fieldset><legend>评分</legend><label class="rating"><input type="radio" name="rating" value="1" />★</label><label class="rating"><input type="radio" name="rating" value="2" />★★</label><label class="rating"><input type="radio" name="rating" value="3" />★★★</label><label class="rating"><input type="radio" name="rating" value="4" />★★★★</label><label class="rating"><input type="radio" name="rating" value="5" />★★★★★</label></fieldset><label>颜色<input type="color" value="#0172ad" /></label><label class="span-2">上传文件<span class="dropzone"><input type="file" multiple /><small>拖拽文件到这里或点击上传</small></span></label><label class="span-2">标签<input id="tags" placeholder="输入标签后按 Enter" /><small>标签将显示为 chips</small></label><p class="span-2" data-tooltip="这是组合控件示例">${icon("info")} 字段帮助：配置选项可稍后修改。</p></div><footer class="grid"><button type="button" class="outline" id="back-2">上一步</button><button type="button" id="next-2">下一步</button></footer></article></section>
  <section data-step="3" hidden><article><header><h2>确认提交</h2><p>检查配置后提交。</p></header><dl><dt>项目名称</dt><dd id="summary-name">—</dd><dt>项目类型</dt><dd id="summary-type">—</dd><dt>邮箱</dt><dd id="summary-email">—</dd></dl><label><input type="checkbox" id="agree" required /> 我同意服务条款与隐私政策</label><footer class="grid"><button type="button" class="outline" id="back-3">上一步</button><button type="submit">${icon("check")}提交项目</button></footer></article></section></form>`
}

export function mount(root: HTMLElement): void {
  const form = root.querySelector<HTMLFormElement>("#project-form")
  const sections = [...root.querySelectorAll<HTMLElement>("[data-step]")]
  const steps = [...root.querySelectorAll<HTMLElement>(".stepper li")]
  const show = (step: number) => {
    sections.forEach((section) => { section.hidden = Number(section.dataset.step) !== step })
    steps.forEach((item, index) => item.classList.toggle("active", index < step))
    if (step === 3) {
      root.querySelector("#summary-name")!.textContent = form?.elements.namedItem("name") instanceof HTMLInputElement ? (form.elements.namedItem("name") as HTMLInputElement).value : "—"
      root.querySelector("#summary-type")!.textContent = form?.elements.namedItem("type") instanceof HTMLSelectElement ? (form.elements.namedItem("type") as HTMLSelectElement).value : "—"
      root.querySelector("#summary-email")!.textContent = form?.elements.namedItem("email") instanceof HTMLInputElement ? (form.elements.namedItem("email") as HTMLInputElement).value : "—"
    }
  }
  root.querySelector("#next-1")?.addEventListener("click", () => { if (form?.checkValidity()) show(2); else form?.reportValidity() })
  root.querySelector("#next-2")?.addEventListener("click", () => show(3))
  root.querySelector("#back-2")?.addEventListener("click", () => show(1))
  root.querySelector("#back-3")?.addEventListener("click", () => show(2))
  root.querySelector("#description")?.addEventListener("input", (event) => { root.querySelector("#char-count")!.textContent = String((event.target as HTMLTextAreaElement).value.length) })
  root.querySelector("#tags")?.addEventListener("keydown", (event) => {
    const keyboardEvent = event as KeyboardEvent
    if (keyboardEvent.key !== "Enter") return
    event.preventDefault()
    const input = event.target as HTMLInputElement
    if (!input.value.trim()) return
    const chip = document.createElement("mark"); chip.textContent = input.value; input.before(chip); input.value = ""
  })
  form?.addEventListener("submit", (event) => {
    event.preventDefault()
    if (!form.checkValidity()) { form.reportValidity(); return }
    const section = root.querySelector<HTMLElement>("[data-step='3']")
    if (section) section.innerHTML = `<article role="status" style="text-align:center"><h2>${icon("check-circle")}项目创建成功</h2><p>你的工作区已经准备就绪。</p><button type="button" id="return-dashboard">返回</button></article>`
    root.querySelector("#return-dashboard")?.addEventListener("click", () => window.history.pushState({}, "", "./"))
  })
}
