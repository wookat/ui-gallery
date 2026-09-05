import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { marked } from 'marked';
import { MessageService } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { Drawer } from 'primeng/drawer';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import chat from '@ui-gallery/spec/mock/chat.json';
import team from '@ui-gallery/spec/mock/team.json';
import { Icon } from '../icons';

interface RawMessage { role: string; content: string; streaming?: boolean; sources?: string[]; tool?: { name: string; args: Record<string, string>; status: string } }
interface Message extends RawMessage { html: SafeHtml }
const seed: RawMessage[] = chat.messages;

@Component({
  selector: 'app-chat',
  imports: [FormsModule, JsonPipe, NgTemplateOutlet, Avatar, Badge, Button, Chip, Drawer, IconField, InputIcon, InputText, Select, Tag, Textarea, Tooltip, Icon],
  template: `
    <div class="chat">
      <aside class="list hide-mobile"><ng-container *ngTemplateOutlet="sidebar" /></aside>
      <p-drawer [visible]="listOpen()" (visibleChange)="listOpen.set($event)" position="left" header="会话" styleClass="chat-drawer">
        <ng-container *ngTemplateOutlet="sidebar" />
      </p-drawer>

      <ng-template #sidebar>
        <div class="stack" style="gap:0.75rem">
          <div class="row">
            <p-iconfield class="grow">
              <p-inputicon><app-icon name="search" [size]="14" /></p-inputicon>
              <input pInputText class="w-full" pSize="small" placeholder="搜索会话" [ngModel]="q()" (ngModelChange)="q.set($event)" />
            </p-iconfield>
            <p-button [rounded]="true" size="small" (onClick)="newChat()" pTooltip="新建会话" ariaLabel="新建会话"><app-icon name="plus" /></p-button>
          </div>
          @for (g of groups(); track g.label) {
            <div>
              <p class="group text-xs muted">{{ g.label }}</p>
              @for (c of g.items; track c.id) {
                <button class="conv" [class.active]="c.id === active()" (click)="active.set(c.id); listOpen.set(false)">
                  <app-icon name="message-square" [size]="16" class="muted" />
                  <span class="grow truncate text-sm">{{ c.title }}</span>
                  <span class="text-xs muted">{{ c.time }}</span>
                  @if (c.unread) { <p-badge [value]="c.unread" /> }
                </button>
              }
            </div>
          }
        </div>
      </ng-template>

      <section class="main">
        <header class="row between chead">
          <div class="row">
            <p-button [text]="true" severity="secondary" [rounded]="true" styleClass="show-mobile" (onClick)="listOpen.set(true)" ariaLabel="会话列表"><app-icon name="menu" /></p-button>
            <div class="col" style="gap:0">
              <span class="font-medium">{{ current()?.title ?? '新会话' }}</span>
              <span class="text-xs muted">{{ model }} · {{ messages().length }} 条消息</span>
            </div>
          </div>
          <p-button [text]="true" severity="secondary" [rounded]="true" ariaLabel="更多"><app-icon name="more-horizontal" /></p-button>
        </header>

        <div class="stream" #stream>
          @if (!messages().length) {
            <div class="welcome">
              <span class="hello"><app-icon name="sparkles" [size]="28" /></span>
              <h2 class="section-title">你好，{{ me.name }}</h2>
              <p class="muted">我可以帮你分析业务数据、起草文案或解释异常。</p>
              <div class="grid grid-2 w-full" style="max-width: 36rem">
                @for (s of chat.suggestions; track s) {
                  <button class="sugg" (click)="send(s)"><app-icon name="zap" [size]="16" /><span class="text-sm">{{ s }}</span></button>
                }
              </div>
            </div>
          }
          @for (m of messages(); track $index) {
            <div class="msg" [class.user]="m.role === 'user'">
              @if (m.role === 'user') { <p-avatar [label]="me.name.slice(0, 1)" shape="circle" /> } @else { <p-avatar shape="circle" styleClass="bot"><app-icon name="bot" [size]="16" /></p-avatar> }
              <div class="col" style="max-width: 100%; min-width: 0">
                @if (m.tool) {
                  <details class="tool">
                    <summary class="row text-sm"><app-icon name="code" [size]="14" /> 调用工具 <code>{{ m.tool.name }}</code> <p-tag [value]="m.tool.status === 'done' ? '完成' : m.tool.status" severity="success" /><app-icon name="chevron-down" [size]="14" class="muted" /></summary>
                    <pre class="text-xs">{{ m.tool.args | json }}</pre>
                  </details>
                }
                <div class="bubble md" [innerHTML]="m.html"></div>
                @if (m.streaming) { <span class="typing"><i></i><i></i><i></i></span> }
                <div class="row wrap text-xs muted">
                  <span>{{ m.role === 'user' ? '你' : '助手' }} · 刚刚</span>
                  @if (m.role === 'assistant') {
                    <p-button [text]="true" severity="secondary" size="small" [rounded]="true" pTooltip="复制" ariaLabel="复制" (onClick)="copy(m.content)"><app-icon name="copy" [size]="14" /></p-button>
                  }
                  @for (s of m.sources ?? []; track s) { <p-chip [label]="s" styleClass="src"><app-icon name="link" [size]="12" /></p-chip> }
                </div>
              </div>
            </div>
          }
        </div>

        <footer class="composer">
          @if (messages().length) {
            <div class="row wrap chips">
              @for (s of chat.suggestions; track s) { <p-chip [label]="s" styleClass="sugg-chip" (click)="send(s)" /> }
            </div>
          }
          <div class="box">
            <textarea pTextarea [autoResize]="true" rows="1" placeholder="输入消息，Enter 发送，Shift+Enter 换行" [(ngModel)]="draft" (keydown.enter)="onEnter($event)" maxlength="2000"></textarea>
            <div class="row between">
              <div class="row">
                <p-button [text]="true" severity="secondary" [rounded]="true" pTooltip="附件" ariaLabel="附件"><app-icon name="paperclip" /></p-button>
                <p-select [(ngModel)]="model" [options]="chat.models" size="small" styleClass="model" />
              </div>
              <div class="row">
                <span class="text-xs muted hide-mobile">{{ draft.length }} / 2000 · ⏎ 发送</span>
                <p-button [rounded]="true" [disabled]="!draft.trim()" (onClick)="send()" ariaLabel="发送"><app-icon name="send" /></p-button>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  `,
  styles: `
    :host { display: block; margin: -1.5rem; }
    .chat { display: grid; grid-template-columns: 1fr; height: calc(100dvh - 3.5rem); }
    .list { border-right: 1px solid var(--p-content-border-color); padding: 1rem; overflow-y: auto; }
    .group { margin: 0.5rem 0 0.25rem 0.5rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .conv { display: flex; align-items: center; gap: 0.5rem; width: 100%; padding: 0.5rem; border: 0; border-radius: 0.5rem; background: none; color: inherit; cursor: pointer; text-align: left; font: inherit; }
    .conv:hover { background: var(--p-content-hover-background); }
    .conv.active { background: var(--p-highlight-background); color: var(--p-highlight-color); }
    .main { display: flex; flex-direction: column; min-width: 0; min-height: 0; }
    .chead { padding: 0.75rem 1rem; border-bottom: 1px solid var(--p-content-border-color); }
    .stream { flex: 1; overflow-y: auto; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .welcome { margin: auto; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; }
    .hello { display: grid; place-items: center; width: 3.5rem; height: 3.5rem; border-radius: 1rem; background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
    .sugg { display: flex; align-items: center; gap: 0.5rem; padding: 0.875rem; border: 1px solid var(--p-content-border-color); border-radius: 0.75rem; background: var(--p-content-background); color: inherit; cursor: pointer; text-align: left; font: inherit; }
    .sugg:hover { background: var(--p-content-hover-background); }
    .msg { display: flex; gap: 0.75rem; max-width: 52rem; width: 100%; margin: 0 auto; }
    .msg.user { flex-direction: row-reverse; }
    .msg.user .col { align-items: flex-end; }
    :host ::ng-deep .bot { background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
    .bubble { padding: 0.75rem 1rem; border-radius: 1rem; background: var(--p-content-hover-background); font-size: 0.9375rem; line-height: 1.6; max-width: 100%; overflow-x: auto; }
    .msg.user .bubble { background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
    .md ::ng-deep p { margin: 0 0 0.5rem; } .md ::ng-deep p:last-child { margin: 0; }
    .md ::ng-deep pre { background: var(--p-surface-900); color: var(--p-surface-0); padding: 0.75rem; border-radius: 0.5rem; overflow-x: auto; font-size: 0.8125rem; }
    .md ::ng-deep code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.875em; }
    .md ::ng-deep table { border-collapse: collapse; margin: 0.5rem 0; font-size: 0.875rem; }
    .md ::ng-deep th, .md ::ng-deep td { border: 1px solid var(--p-content-border-color); padding: 0.375rem 0.625rem; text-align: left; }
    .md ::ng-deep blockquote { margin: 0; padding-left: 0.75rem; border-left: 3px solid var(--p-primary-color); color: var(--p-text-muted-color); }
    .tool { border: 1px solid var(--p-content-border-color); border-radius: 0.75rem; padding: 0.5rem 0.75rem; }
    .tool summary { cursor: pointer; list-style: none; }
    .tool pre { margin: 0.5rem 0 0; background: var(--p-content-hover-background); padding: 0.5rem; border-radius: 0.5rem; overflow-x: auto; }
    .typing { display: inline-flex; gap: 0.25rem; padding: 0 0.5rem; }
    .typing i { width: 0.375rem; height: 0.375rem; border-radius: 999px; background: var(--p-text-muted-color); animation: blink 1.2s infinite; }
    .typing i:nth-child(2) { animation-delay: 0.2s; } .typing i:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
    :host ::ng-deep .src { font-size: 0.75rem; padding: 0.125rem 0.5rem; gap: 0.25rem; }
    :host ::ng-deep .sugg-chip { cursor: pointer; font-size: 0.8125rem; }
    .composer { border-top: 1px solid var(--p-content-border-color); padding: 0.75rem 1rem 1rem; }
    .chips { max-width: 52rem; margin: 0 auto 0.75rem; }
    .box { max-width: 52rem; margin: 0 auto; border: 1px solid var(--p-content-border-color); border-radius: 1rem; padding: 0.5rem 0.75rem; background: var(--p-content-background); display: flex; flex-direction: column; gap: 0.25rem; }
    .box:focus-within { border-color: var(--p-primary-color); }
    .box textarea { border: 0; box-shadow: none; padding: 0.5rem 0.25rem; max-height: 10rem; background: transparent; }
    :host ::ng-deep .model { min-width: 10rem; }
    :host ::ng-deep .chat-drawer { width: 20rem !important; }
    @media (min-width: 1024px) { .chat { grid-template-columns: 18rem 1fr; } }
    @media (max-width: 767px) { :host { margin: -1rem; } .chat { height: calc(100dvh - 3.5rem); } .stream { padding: 1rem 0.75rem; } }
  `,
})
export class ChatPage {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toast = inject(MessageService);
  readonly stream = viewChild<ElementRef<HTMLDivElement>>('stream');
  readonly chat = chat;
  readonly me = team[0];
  readonly q = signal('');
  readonly listOpen = signal(false);
  readonly active = signal<string | null>(new URLSearchParams(location.search).get('state') === 'empty' ? null : chat.conversations[0].id);
  readonly messages = signal<Message[]>(this.active() ? seed.map((m) => this.render(m)) : []);
  model = chat.models[0];
  draft = '';

  current() {
    return chat.conversations.find((c) => c.id === this.active());
  }

  groups() {
    const q = this.q().toLowerCase();
    const items = chat.conversations.filter((c) => c.title.toLowerCase().includes(q));
    const today = items.filter((c) => c.time.includes('刚刚') || c.time.includes('分钟') || c.time.includes('小时'));
    const earlier = items.filter((c) => !today.includes(c));
    return [
      { label: '今天', items: today },
      { label: '更早', items: earlier },
    ].filter((g) => g.items.length);
  }

  private render(m: RawMessage): Message {
    const html = marked.parse(m.content, { async: false, gfm: true, breaks: true });
    return { ...m, html: this.sanitizer.bypassSecurityTrustHtml(html) };
  }

  newChat() {
    this.active.set(null);
    this.messages.set([]);
    this.listOpen.set(false);
  }

  onEnter(e: Event) {
    const ke = e as KeyboardEvent;
    if (ke.shiftKey) return;
    e.preventDefault();
    this.send();
  }

  send(text = this.draft) {
    const content = text.trim();
    if (!content) return;
    this.draft = '';
    if (!this.active()) this.active.set(chat.conversations[0].id);
    this.messages.update((ms) => [...ms.map((m) => ({ ...m, streaming: false })), this.render({ role: 'user', content }), { ...this.render({ role: 'assistant', content: '正在思考…' }), streaming: true }]);
    setTimeout(() => this.stream()?.nativeElement.scrollTo({ top: 1e9, behavior: 'smooth' }));
  }

  copy(text: string) {
    navigator.clipboard?.writeText(text);
    this.toast.add({ severity: 'success', summary: '已复制', life: 1500 });
  }
}
