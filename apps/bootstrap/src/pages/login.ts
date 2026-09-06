import { icon } from "../lib/icons"
import { href } from "../lib/router"
import type { PageResult } from "./types"

export function renderLogin(): PageResult {
  const html = `<div class="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary p-3 p-sm-4">
  <div class="card shadow-sm w-100" style="max-width:420px" id="loginCard">
    <div class="card-body p-4 p-sm-5">
      <div id="loginAlert" class="alert alert-danger d-flex align-items-center gap-2 d-none" role="alert">${icon("alert-circle")}<span>邮箱或密码不正确，请重试。</span></div>
      <div class="text-center mb-4">
        <span class="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary text-white mb-3" style="width:48px;height:48px;font-size:1.5rem">${icon("boxes")}</span>
        <h1 class="h3 mb-1">Acme Console</h1>
        <p class="text-body-secondary mb-0">登录以继续管理你的团队与订单</p>
      </div>
      <form id="loginForm" novalidate>
        <div class="mb-3">
          <label for="loginEmail" class="form-label">邮箱</label>
          <div class="input-group has-validation">
            <span class="input-group-text">${icon("mail")}</span>
            <input type="email" class="form-control" id="loginEmail" placeholder="you@example.com" autocomplete="email" required>
            <div class="invalid-feedback">请输入有效的邮箱地址</div>
          </div>
        </div>
        <div class="mb-3">
          <label for="loginPassword" class="form-label">密码</label>
          <div class="input-group has-validation">
            <span class="input-group-text">${icon("lock")}</span>
            <input type="password" class="form-control" id="loginPassword" placeholder="至少 8 位" autocomplete="current-password" minlength="8" required>
            <button class="btn btn-outline-secondary" type="button" id="togglePassword" aria-label="显示密码">${icon("eye")}</button>
            <div class="invalid-feedback">密码至少 8 位</div>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="form-check mb-0">
            <input class="form-check-input" type="checkbox" id="rememberMe" checked>
            <label class="form-check-label" for="rememberMe">记住我</label>
          </div>
          <a href="#" class="small">忘记密码？</a>
        </div>
        <button type="submit" class="btn btn-primary w-100" id="loginSubmit">登录</button>
        <div class="d-flex align-items-center my-4"><hr class="flex-grow-1"><span class="px-3 text-body-secondary small">或</span><hr class="flex-grow-1"></div>
        <div class="d-grid gap-2">
          <button type="button" class="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2">${icon("google")} 使用 Google 登录</button>
          <button type="button" class="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2">${icon("github")} 使用 GitHub 登录</button>
          <button type="button" class="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2">${icon("wechat")} 使用微信登录</button>
        </div>
      </form>
    </div>
    <div class="card-footer text-center text-body-secondary py-3 bg-transparent">还没有账号？<a href="#">注册</a> · <a href="${href("/")}" data-link="/">进入演示</a></div>
  </div>
</div>`

  const mount = (root: HTMLElement) => {
    const form = root.querySelector<HTMLFormElement>("#loginForm")!
    const email = root.querySelector<HTMLInputElement>("#loginEmail")!
    const password = root.querySelector<HTMLInputElement>("#loginPassword")!
    const submit = root.querySelector<HTMLButtonElement>("#loginSubmit")!
    const alert = root.querySelector<HTMLElement>("#loginAlert")!
    root.querySelector("#togglePassword")!.addEventListener("click", (e) => {
      const btn = e.currentTarget as HTMLButtonElement
      const show = password.type === "password"
      password.type = show ? "text" : "password"
      btn.innerHTML = show ? icon("eye-off") : icon("eye")
      btn.setAttribute("aria-label", show ? "隐藏密码" : "显示密码")
    })
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      form.classList.add("was-validated")
      if (!form.checkValidity()) return
      submit.disabled = true
      submit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>登录中…`
      window.setTimeout(() => {
        submit.disabled = false
        submit.textContent = "登录"
        if (email.value.endsWith("@acme.dev")) window.location.assign(href("/"))
        else alert.classList.remove("d-none")
      }, 900)
    })
  }
  return { html, mount }
}
