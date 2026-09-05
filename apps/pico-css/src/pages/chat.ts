import { marked } from "marked"
import chat from "@ui-gallery/spec/mock/chat.json"
import { icon } from "../icons"

function markdown(value: string): string {
  return marked.parse(value, { async: false }) as string
}

export function render(): string {
  const empty = new URLSearchParams(window.location.search).get("state") === "empty"
  return `<div class="chat-page"><button class="outline chat-drawer-button" id="chat-drawer-button">${icon("menu")} 对话</button><aside class="chat-sidebar" id="chat-sidebar"><div class="chat-sidebar-head"><h2>对话</h2><button class="outline" id="new-chat">${icon("plus")}</button></div><input type="search" placeholder="搜索对话" aria-label="搜索对话"><button id="new-chat-main">${icon("plus")} 新建对话</button><div class="conversation-list">${chat.conversations.map((c) => `<button class="${c.id === "c1" ? "active" : ""}"><span>${c.title}<small>${c.time}</small></span>${c.unread ? `<mark>${c.unread}</mark>` : ""}</button>`).join("")}</div></aside><section class="chat-main"><header><div><strong>${chat.conversations[0].title}</strong><small>GPT-5 · 已连接</small></div><select>${chat.models.map((m) => `<option>${m}</option>`).join("")}</select></header>${empty ? `<div class="chat-empty"><h2>你好，林晓</h2><p>今天想从哪里开始？</p><div>${chat.suggestions.map((s) => `<button class="outline suggestion">${s}</button>`).join("")}</div></div>` : `<div class="message-stream">${chat.messages.map((m) => `<article class="message ${m.role}"><div class="avatar">${m.role === "user" ? "林" : "AI"}</div><div><header><strong>${m.role === "user" ? "林晓" : "AI 助手"}</strong><small>刚刚</small></header><div class="bubble">${m.role === "assistant" ? markdown(m.content) : `<p>${m.content}</p>`}</div>${m.sources ? `<div class="source-chips">${m.sources.map((s) => `<mark>${icon("paperclip")} ${s}</mark>`).join("")}</div>` : ""}${m.tool ? `<details class="tool-call"><summary>${icon("check")} 工具调用 · ${m.tool.name}</summary><pre>${JSON.stringify(m.tool.args, null, 2)}</pre></details>` : ""}</div></article>`).join("")}<article class="message assistant" aria-busy="true"><div class="avatar">AI</div><div class="bubble typing">正在思考…</div></article></div>`}<footer class="chat-composer"><div class="suggestions">${chat.suggestions.map((s) => `<button class="outline">${s}</button>`).join("")}</div><div role="group"><button class="outline" aria-label="附件">${icon("paperclip")}</button><textarea id="chat-input" rows="1" maxlength="2000" placeholder="输入消息…"></textarea><button id="send-chat">${icon("send")}</button></div><small>0 / 2000 · Enter 发送 / Shift+Enter 换行</small></footer></section></div>`
}

export function mount(root: HTMLElement): void {
  const sidebar = root.querySelector("#chat-sidebar")
  root.querySelector("#chat-drawer-button")?.addEventListener("click", () => sidebar?.classList.toggle("open"))
  root.querySelectorAll(".suggestion").forEach((button) => button.addEventListener("click", () => {
    const input = root.querySelector<HTMLTextAreaElement>("#chat-input")
    if (input) input.value = button.textContent ?? ""
  }))
  root.querySelector("#chat-input")?.addEventListener("input", (event) => {
    const input = event.currentTarget as HTMLTextAreaElement
    input.style.height = "auto"; input.style.height = `${input.scrollHeight}px`
  })
  root.querySelectorAll<HTMLElement>(".bubble pre").forEach((pre) => {
    const button = document.createElement("button"); button.className = "outline copy-code"; button.textContent = "复制"
    button.addEventListener("click", () => navigator.clipboard?.writeText(pre.textContent ?? ""))
    pre.parentElement?.append(button)
  })
}
