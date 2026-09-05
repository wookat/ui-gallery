import * as bootstrap from "bootstrap"
import { marked } from "marked"
import { icon } from "../lib/icons"
import { avatar, each, esc } from "../lib/html"
import { chat, type ChatMessage } from "../lib/data"
import { params } from "../lib/settings"
import type { PageResult } from "./types"

marked.use({ gfm: true, breaks: true })

const md = (src: string) => (marked.parse(src, { async: false }) as string)
  .replace(/<table>/g, '<div class="table-responsive"><table class="table table-sm table-bordered mb-2">')
  .replace(/<\/table>/g, "</table></div>")
  .replace(/<pre>/g, '<pre class="position-relative bg-body-tertiary border rounded-3 p-3 mb-2"><button type="button" class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2 copy-code" aria-label="复制代码">' + icon("copy") + "</button>")

const GROUPS: [string, string[]][] = [["今天", ["c1"]], ["最近 7 天", ["c2", "c3"]], ["更早", ["c4"]]]

function message(m: ChatMessage, i: number): string {
  const isUser = m.role === "user"
  const tool = "tool" in m ? m.tool : undefined
  const sources = "sources" in m ? m.sources : undefined
  const streaming = "streaming" in m && m.streaming
  return `<div class="d-flex gap-2 mb-4 ${isUser ? "flex-row-reverse" : ""}">
    ${isUser ? avatar("林晓", 32) : `<span class="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center flex-shrink-0" style="width:32px;height:32px">${icon("bot")}</span>`}
    <div class="min-w-0" style="max-width:85%">
      ${tool ? `<div class="mb-2"><button class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" type="button" data-bs-toggle="collapse" data-bs-target="#tool${i}" aria-expanded="false" aria-controls="tool${i}">${icon("plug")} 调用工具 <code class="text-body">${esc(tool.name)}</code> <span class="badge text-bg-success">${tool.status === "done" ? "完成" : tool.status}</span> ${icon("chevron-down")}</button><div class="collapse mt-2" id="tool${i}"><div class="card card-body py-2 small bg-body-tertiary"><pre class="mb-0"><code>${esc(JSON.stringify(tool.args, null, 2))}</code></pre></div></div></div>` : ""}
      <div class="chat-bubble ${isUser ? "bg-primary text-white" : "bg-body-tertiary border"} rounded-4 px-3 py-2">${isUser ? `<p class="mb-0">${esc(m.content)}</p>` : md(m.content)}${streaming ? `<span class="chat-cursor" aria-label="正在生成"></span>` : ""}</div>
      ${sources ? `<div class="d-flex flex-wrap gap-1 mt-2">${each(sources, (s) => `<a href="#" class="badge rounded-pill text-bg-light border text-decoration-none d-inline-flex align-items-center gap-1">${icon("link")}${esc(s)}</a>`)}</div>` : ""}
      ${!isUser && !streaming ? `<div class="btn-group btn-group-sm mt-2" role="group" aria-label="消息操作"><button type="button" class="btn btn-link text-body-secondary p-1 copy-msg" aria-label="复制">${icon("copy")}</button><button type="button" class="btn btn-link text-body-secondary p-1" aria-label="重新生成">${icon("refresh")}</button><button type="button" class="btn btn-link text-body-secondary p-1" aria-label="赞">${icon("heart")}</button></div>` : ""}
      ${streaming ? `<div class="d-flex align-items-center gap-2 mt-2 small text-body-secondary"><div class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></div>正在生成… <button type="button" class="btn btn-sm btn-outline-secondary py-0">停止</button></div>` : ""}
    </div></div>`
}

function conversations(active: string): string {
  return `<div class="p-3 border-bottom d-flex gap-2"><div class="input-group input-group-sm"><span class="input-group-text">${icon("search")}</span><input type="search" class="form-control" placeholder="搜索会话" aria-label="搜索会话"></div><button type="button" class="btn btn-primary btn-sm text-nowrap" data-action="new-chat">${icon("plus")} 新建</button></div>
  <div class="overflow-auto flex-grow-1">${each(GROUPS, ([label, ids]) => `<div class="px-3 pt-3 pb-1 small text-uppercase text-body-secondary fw-semibold">${label}</div><div class="list-group list-group-flush">${each(chat.conversations.filter((c) => ids.includes(c.id)), (c) => `<a href="#" class="list-group-item list-group-item-action d-flex align-items-center gap-2 ${c.id === active ? "active" : ""}" data-conv="${c.id}" ${c.id === active ? 'aria-current="true"' : ""}>${icon("message-square")}<span class="flex-grow-1 text-truncate">${esc(c.title)}</span><small class="opacity-75 text-nowrap">${esc(c.time)}</small>${c.unread ? `<span class="badge rounded-pill text-bg-danger">${c.unread}</span>` : ""}</a>`)}</div>`)}</div>`
}

export function renderChat(): PageResult {
  const empty = params().get("state") === "empty"
  const active = empty ? "" : "c1"
  const title = chat.conversations[0].title

  const composer = `<form class="border-top p-3 bg-body" id="chatForm" novalidate>
    <div class="d-flex flex-wrap gap-2 mb-2" id="suggestions">${each(chat.suggestions, (s) => `<button type="button" class="btn btn-sm btn-outline-secondary rounded-pill" data-suggest>${esc(s)}</button>`)}</div>
    <div class="border rounded-4 p-2 bg-body-tertiary">
      <textarea class="form-control border-0 bg-transparent shadow-none" id="chatInput" rows="2" placeholder="向助手提问，Shift+Enter 换行" aria-label="消息" maxlength="2000"></textarea>
      <div class="d-flex align-items-center gap-2 mt-1 flex-wrap">
        <button type="button" class="btn btn-sm btn-outline-secondary" aria-label="附件">${icon("paperclip")}</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" aria-label="语音">${icon("mic")}</button>
        <select class="form-select form-select-sm w-auto" aria-label="模型">${each(chat.models, (m) => `<option>${esc(m)}</option>`)}</select>
        <span class="ms-auto small text-body-secondary"><span id="charCount">0</span>/2000 · <kbd>Enter</kbd> 发送</span>
        <button type="submit" class="btn btn-primary btn-sm" id="sendBtn" disabled aria-label="发送">${icon("send")}</button>
      </div></div></form>`

  const html = `<div class="chat-layout d-flex border rounded-3 bg-body overflow-hidden">
    <aside class="chat-sidebar d-none d-lg-flex flex-column border-end flex-shrink-0">${conversations(active)}</aside>
    <div class="offcanvas offcanvas-start" tabindex="-1" id="chatConvs" aria-labelledby="chatConvsTitle"><div class="offcanvas-header border-bottom"><h2 class="offcanvas-title h6" id="chatConvsTitle">会话</h2><button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="关闭"></button></div><div class="offcanvas-body p-0 d-flex flex-column">${conversations(active)}</div></div>
    <section class="d-flex flex-column flex-grow-1 min-w-0">
      <header class="d-flex align-items-center gap-2 p-3 border-bottom"><button class="btn btn-outline-secondary btn-sm d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#chatConvs" aria-controls="chatConvs" aria-label="会话列表">${icon("menu")}</button><h1 class="h6 mb-0 text-truncate flex-grow-1" id="chatTitle">${empty ? "新会话" : esc(title)}</h1><div class="dropdown"><button class="btn btn-outline-secondary btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="更多">${icon("more-horizontal")}</button><ul class="dropdown-menu dropdown-menu-end"><li><button class="dropdown-item" type="button">${icon("pencil")} 重命名</button></li><li><button class="dropdown-item" type="button">${icon("archive")} 归档</button></li><li><hr class="dropdown-divider"></li><li><button class="dropdown-item text-danger" type="button">${icon("trash")} 删除</button></li></ul></div></header>
      <div class="flex-grow-1 overflow-auto p-3" id="messages">${empty
        ? `<div class="h-100 d-flex flex-column align-items-center justify-content-center text-center text-body-secondary"><span class="display-4 text-primary mb-2">${icon("sparkles")}</span><h2 class="h5 text-body">今天想了解什么？</h2><p class="mb-3">可以问我收入、订单、退款或帮你起草文案。</p></div>`
        : each(chat.messages, message)}</div>
      ${composer}
    </section>
    <div class="toast-container position-fixed bottom-0 end-0 p-3"><div id="chatToast" class="toast align-items-center text-bg-dark border-0" role="status" aria-live="polite" aria-atomic="true"><div class="d-flex"><div class="toast-body">已复制到剪贴板</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="关闭"></button></div></div></div>
  </div>`

  const mount = (root: HTMLElement) => {
    const form = root.querySelector<HTMLFormElement>("#chatForm")!
    const input = root.querySelector<HTMLTextAreaElement>("#chatInput")!
    const send = root.querySelector<HTMLButtonElement>("#sendBtn")!
    const count = root.querySelector<HTMLElement>("#charCount")!
    const list = root.querySelector<HTMLElement>("#messages")!
    const toast = new bootstrap.Toast(root.querySelector("#chatToast")!, { delay: 1500 })

    const sync = () => { count.textContent = String(input.value.length); send.disabled = !input.value.trim() }
    input.addEventListener("input", sync)
    input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit() } })
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      const text = input.value.trim()
      if (!text) return
      list.querySelector(".h-100")?.remove()
      list.insertAdjacentHTML("beforeend", message({ role: "user", content: text }, Date.now()))
      list.insertAdjacentHTML("beforeend", message({ role: "assistant", content: "…", streaming: true } as ChatMessage, Date.now() + 1))
      list.scrollTop = list.scrollHeight
      input.value = ""
      sync()
    })
    root.querySelectorAll<HTMLButtonElement>("[data-suggest]").forEach((b) => b.addEventListener("click", () => { input.value = b.textContent ?? ""; sync(); input.focus() }))
    root.addEventListener("click", (e) => {
      const t = e.target as HTMLElement
      const copy = t.closest<HTMLElement>(".copy-code, .copy-msg")
      if (copy) {
        const src = copy.classList.contains("copy-code") ? copy.parentElement?.querySelector("code")?.textContent : copy.closest(".min-w-0")?.querySelector(".chat-bubble")?.textContent
        navigator.clipboard?.writeText(src ?? "").catch(() => undefined)
        toast.show()
      }
      const conv = t.closest<HTMLElement>("[data-conv]")
      if (conv) {
        e.preventDefault()
        root.querySelectorAll("[data-conv]").forEach((a) => { a.classList.toggle("active", a.getAttribute("data-conv") === conv.dataset.conv); a.toggleAttribute("aria-current", a === conv) })
        root.querySelector("#chatTitle")!.textContent = conv.querySelector(".text-truncate")?.textContent ?? ""
        bootstrap.Offcanvas.getInstance(root.querySelector("#chatConvs")!)?.hide()
      }
      if (t.closest('[data-action="new-chat"]')) {
        list.innerHTML = `<div class="h-100 d-flex flex-column align-items-center justify-content-center text-center text-body-secondary"><span class="display-4 text-primary mb-2">${icon("sparkles")}</span><h2 class="h5 text-body">今天想了解什么？</h2></div>`
        root.querySelector("#chatTitle")!.textContent = "新会话"
        root.querySelectorAll("[data-conv]").forEach((a) => a.classList.remove("active"))
        bootstrap.Offcanvas.getInstance(root.querySelector("#chatConvs")!)?.hide()
      }
    })
    list.scrollTop = list.scrollHeight
    return () => toast.dispose()
  }
  return { html, mount }
}
