import { icon } from "../icons"

export function render(): string {
  const error = new URLSearchParams(window.location.search).get("state") === "error"
  return `<main class="container" style="max-width:520px;padding-top:8vh"><article>
    <a class="brand" data-link href="/"><span class="brand-mark">A</span><span>Acme Console</span></a>
    <h1>欢迎回来</h1><p>登录 Acme Console，继续你的工作。</p>
    ${error ? `<article class="alert-error" role="alert"><strong>演示错误状态</strong><p>密码错误时会在这里显示验证错误。</p></article>` : ""}
    <form id="login-form" novalidate>
      <label for="email">邮箱</label><div class="login-input"><span class="input-prefix">${icon("mail")}</span><input id="email" name="email" type="email" placeholder="you@example.com" required /></div><small class="field-error" hidden>请输入有效的邮箱地址。</small>
      <label for="password">密码</label><div class="login-input"><span class="input-prefix">${icon("lock")}</span><input id="password" name="password" type="password" placeholder="••••••••" required /><button type="button" class="outline" id="password-toggle">${icon("eye")}</button></div>
      <label><input type="checkbox" /> 记住我</label>
      <div class="grid"><a href="#forgot">忘记密码？</a><button type="submit">登录</button></div>
    </form>
    <div class="login-divider"><hr /><span>或</span><hr /></div>
    <div class="grid"><button class="outline" type="button">${icon("globe")}Google</button><button class="outline" type="button">${icon("github")}GitHub</button><button class="outline" type="button">${icon("message-circle")}微信</button></div>
    <footer style="text-align:center">还没有账户？ <a href="#register">立即注册</a></footer>
  </article></main>`
}

export function mount(root: HTMLElement): void {
  const password = root.querySelector<HTMLInputElement>("#password")
  root.querySelector("#password-toggle")?.addEventListener("click", () => {
    if (!password) return
    password.type = password.type === "password" ? "text" : "password"
  })
  const form = root.querySelector<HTMLFormElement>("#login-form")
  const email = root.querySelector<HTMLInputElement>("#email")
  const error = root.querySelector<HTMLElement>(".field-error")
  form?.addEventListener("submit", (event) => {
    event.preventDefault()
    const valid = Boolean(email?.value && email.validity.valid && password?.value)
    if (!valid) { email?.setAttribute("aria-invalid", "true"); if (error) error.hidden = false; return }
    const button = form.querySelector<HTMLButtonElement>("button[type=submit]")
    if (button) { button.setAttribute("aria-busy", "true"); button.disabled = true }
    window.setTimeout(() => {
      if (button) { button.removeAttribute("aria-busy"); button.disabled = false }
      const alert = document.createElement("article")
      alert.className = "alert-error"
      alert.setAttribute("role", "alert")
      alert.innerHTML = "<strong>登录失败</strong><p>请检查邮箱和密码后重试。</p>"
      form.before(alert)
    }, 1200)
  })
}
