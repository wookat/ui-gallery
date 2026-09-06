import { Component, ViewChild, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { marked } from 'marked';
import chatData from '@ui-gallery/spec/mock/chat.json';
import { SHARED_IMPORTS } from '../shared/material';

type ToolCall = { name: string; args: Record<string, unknown>; status: string };
type ChatMessage = { role: string; content: string; sources?: string[]; tool?: ToolCall; streaming?: boolean };
type Segment = { kind: 'text'; html: SafeHtml } | { kind: 'code'; lang: string; code: string };

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <main class="chat-page">
      <mat-sidenav-container class="chat-container">
        <mat-sidenav #sessionsDrawer class="chat-sessions" [mode]="mobile ? 'over' : 'side'" [opened]="mobile ? sessionsOpen : true" (closed)="sessionsOpen = false">
          <div class="chat-sessions-header"><b>会话</b><button mat-icon-button (click)="sessionsDrawer.close()" matTooltip="关闭会话列表"><mat-icon svgIcon="x"></mat-icon></button></div>
          <button mat-flat-button color="primary" class="new-chat" (click)="newConversation()"><mat-icon svgIcon="plus"></mat-icon>新建会话</button><mat-form-field appearance="outline" class="full session-search" subscriptSizing="dynamic"><mat-icon matPrefix svgIcon="search"></mat-icon><input matInput [formControl]="sessionQuery" placeholder="搜索会话"></mat-form-field>
          <mat-nav-list>@for (conversation of filteredConversations(); track conversation.id) {<a mat-list-item [class.active-chat]="conversation.id === activeConversation"><mat-icon matListItemIcon svgIcon="message-square"></mat-icon><span matListItemTitle>{{ conversation.title }}</span><span matListItemLine>{{ conversation.time }}</span>@if (conversation.unread) {<span matListItemMeta class="unread">{{ conversation.unread }}</span>}</a>}</mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <header class="chat-toolbar"><div class="chat-title-row"><button mat-icon-button class="chat-session-toggle" (click)="sessionsOpen = true; sessionsDrawer.open()" aria-label="打开会话列表"><mat-icon svgIcon="menu"></mat-icon></button><div><p class="eyebrow">AI WORKSPACE</p><h1>智能助手</h1></div></div><div class="chat-toolbar-actions"><span class="chip toolbar-model">{{ selectedModel }}</span><button mat-icon-button matTooltip="新建对话" (click)="newConversation()"><mat-icon svgIcon="edit"></mat-icon></button></div></header>
          <section class="chat-content">
            @if (emptyState) {
              <div class="chat-empty"><span class="chat-orb"><mat-icon svgIcon="sparkles"></mat-icon></span><h2>今天我能帮你做什么？</h2><p class="muted">分析业务数据、写作和自动化工作都可以交给我。</p><div class="suggestion-cards">@for (suggestion of suggestions; track suggestion) {<button mat-stroked-button (click)="prompt.setValue(suggestion)"><mat-icon svgIcon="sparkles"></mat-icon>{{ suggestion }}</button>}</div></div>
            } @else {
              <div class="message-list">@for (message of messages; track $index) {<article class="message" [class.user-message]="message.role === 'user'"><span class="avatar">{{ message.role === 'user' ? '林' : 'AI' }}</span><div class="message-body"><div class="message-meta"><b>{{ message.role === 'user' ? '你' : 'Assistant' }}</b><small class="muted">{{ message.role === 'user' ? '刚刚' : '1 秒前' }}</small></div><div class="message-content" [class.streaming]="message.streaming">@if (message.tool) {<div class="tool-card" role="status"><div class="tool-head"><mat-icon svgIcon="code"></mat-icon><b>工具调用 · {{ message.tool.name }}</b><span class="chip" [class.positive]="message.tool.status === 'done'">@if (message.tool.status === 'done') {<mat-icon svgIcon="check"></mat-icon>} @else {<mat-spinner diameter="14"></mat-spinner>}{{ message.tool.status }}</span></div><pre class="tool-args"><code>{{ message.tool.args | json }}</code></pre></div>}<div class="message-text markdown-body">@for (segment of segments(message); track $index) {@if (segment.kind === 'code') {<div class="code-block-wrap"><div class="code-block-bar"><span class="muted">{{ segment.lang || 'code' }}</span><button mat-button (click)="copyText(segment.code, '代码已复制')" aria-label="复制代码块"><mat-icon svgIcon="copy"></mat-icon>复制</button></div><pre class="code-block"><code>{{ segment.code }}</code></pre></div>} @else {<div [innerHTML]="segment.html"></div>}}@if (message.streaming) {<span class="typing" aria-label="正在生成"><span></span><span></span><span></span></span>}</div>@if (message.sources?.length) {<div class="sources"><span class="muted">来源</span>@for (source of message.sources; track source) {<span class="chip source-chip"><mat-icon svgIcon="link"></mat-icon>{{ source }}</span>}</div>}@if (message.role === 'assistant') {<div class="message-actions">@if (message.streaming) {<span class="muted streaming-label"><mat-spinner diameter="14"></mat-spinner>正在生成…</span>} @else {<button mat-stroked-button (click)="copyText(message.content, '消息已复制')" aria-label="复制消息"><mat-icon svgIcon="copy"></mat-icon>复制</button>}</div>}</div></div></article>}</div>
            }
          </section>
          <footer class="chat-composer"><mat-chip-set class="suggestion-row">@for (suggestion of suggestions; track suggestion) {<mat-chip (click)="prompt.setValue(suggestion)">{{ suggestion }}</mat-chip>}</mat-chip-set><div class="composer-box"><textarea matInput cdkTextareaAutosize [formControl]="prompt" rows="2" maxlength="4000" placeholder="输入消息，按 Enter 发送"></textarea><div class="composer-actions"><div class="demo-row"><button mat-icon-button matTooltip="添加附件" aria-label="添加附件"><mat-icon svgIcon="paperclip"></mat-icon></button><mat-form-field appearance="outline" subscriptSizing="dynamic"><mat-label>模型</mat-label><mat-select [(value)]="selectedModel">@for (model of models; track model) {<mat-option [value]="model">{{ model }}</mat-option>}</mat-select></mat-form-field></div><div class="composer-meta"><span class="muted">{{ prompt.value?.length ?? 0 }}/4000 · Shift + Enter 换行</span><button mat-flat-button color="primary" (click)="send()" [disabled]="!prompt.value?.trim()"><mat-icon svgIcon="send"></mat-icon>发送</button></div></div></div></footer>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </main>
  `,
})
export class ChatPage {
  @ViewChild('sessionsDrawer') sessionsDrawer?: MatSidenav;
  readonly conversations = chatData.conversations;
  readonly messages: ChatMessage[] = chatData.messages;
  private readonly segmentCache = new Map<string, Segment[]>();
  private readonly snackBar = inject(MatSnackBar);
  readonly suggestions = chatData.suggestions.slice(0, 4);
  readonly models = chatData.models;
  readonly prompt = new FormControl('');
  readonly sessionQuery = new FormControl('');
  filteredConversations(): typeof chatData.conversations { const q = (this.sessionQuery.value ?? '').trim().toLowerCase(); return q ? this.conversations.filter((item) => item.title.toLowerCase().includes(q)) : this.conversations; }
  readonly emptyState = new URLSearchParams(window.location.search).get('state') === 'empty';
  selectedModel = this.models[0];
  sessionsOpen = false;
  activeConversation = this.conversations[0]?.id;
  mobile = window.matchMedia('(max-width: 959px)').matches;
  private readonly sanitizer = inject(DomSanitizer);

  segments(message: ChatMessage): Segment[] {
    const cached = this.segmentCache.get(message.content);
    if (cached) return cached;
    const result: Segment[] = [];
    const fence = /```(\w*)\n([\s\S]*?)```/g;
    let last = 0;
    for (const match of message.content.matchAll(fence)) {
      const text = message.content.slice(last, match.index).trim();
      if (text) result.push({ kind: 'text', html: this.renderMarkdown(text) });
      result.push({ kind: 'code', lang: match[1], code: match[2].replace(/\n$/, '') });
      last = (match.index ?? 0) + match[0].length;
    }
    const tail = message.content.slice(last).trim();
    if (tail) result.push({ kind: 'text', html: this.renderMarkdown(tail) });
    this.segmentCache.set(message.content, result);
    return result;
  }

  copyText(text: string, message: string): void {
    navigator.clipboard?.writeText(text);
    this.snackBar.open(message, undefined, { duration: 1800 });
  }

  private renderMarkdown(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(marked.parse(content, { async: false }) as string);
  }

  newConversation(): void {
    this.prompt.setValue('');
  }

  send(): void {
    if (this.prompt.value?.trim()) this.prompt.setValue('');
  }
}
