import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import chat from '@ui-gallery/spec/mock/chat.json';
import { marked } from 'marked';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { IconComponent } from '../../core/icon.component';

type Message = (typeof chat.messages)[number] & { role: 'user' | 'assistant' };
type Block = { kind: 'text' | 'code'; value: string; language?: string };

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NzAvatarModule, NzBadgeModule, NzButtonModule, NzCardModule, NzCollapseModule, NzDrawerModule, NzInputModule, NzRadioModule, NzSelectModule, NzSpinModule, NzTagModule, NzTypographyModule, IconComponent],
  template: `
    <section class="chat-page">
      <header class="chat-header"><button nz-button nzType="text" class="mobile-only" (click)="conversationOpen=true"><ui-icon name="menu" /></button><h1 nz-typography>AI 助手</h1><nz-radio-group [(ngModel)]="state" nzButtonStyle="solid"><label nz-radio-button nzValue="normal">正常</label><label nz-radio-button nzValue="loading">加载</label><label nz-radio-button nzValue="empty">空</label><label nz-radio-button nzValue="error">错误</label></nz-radio-group></header>
      <div class="chat-layout">
        <aside class="conversation-panel"><ng-container *ngTemplateOutlet="conversationTpl" /></aside>
        <main class="message-panel">
          @if (state === 'loading') { <div class="loading"><nz-spin nzSimple /><span>正在加载对话…</span></div> }
          @else if (state === 'error') { <div class="loading"><p nz-typography nzType="danger">对话加载失败</p><button nz-button nzType="primary" (click)="state='normal'">重试</button></div> }
          @else if (state === 'empty' || selectedMessages.length === 0) { <div class="empty-chat"><nz-avatar nzSize="large"><ui-icon name="bot" /></nz-avatar><h2>今天想了解什么？</h2><p nz-typography nzType="secondary">从一个问题开始你的数据探索。</p><div class="suggestion-cards">@for(suggestion of suggestions; track suggestion){<nz-card (click)="fillSuggestion(suggestion)">{{suggestion}}</nz-card>}</div></div> }
          @else { <div class="messages">@for(message of selectedMessages; track $index){<article class="message" [class.user-message]="message.role === 'user'"><nz-avatar>{{message.role === 'user' ? '林' : 'AI'}}</nz-avatar><div class="bubble"><div class="message-meta">{{message.role === 'user' ? '林' : 'AI 助手'}} · 刚刚</div>@if(message.role === 'assistant'){ @for(block of blocks(message.content); track $index){ @if(block.kind === 'code'){<div class="code-block"><button nz-button nzSize="small" (click)="copy(block.value)">复制</button><pre><code>{{block.value}}</code></pre></div>} @else {<div class="markdown" [innerHTML]="render(block.value)"></div>} } @if(message.sources){<div class="sources">@for(source of message.sources; track source){<nz-tag>来源: {{source}}</nz-tag>}</div>} @if(message.tool){<nz-collapse><nz-collapse-panel [nzHeader]="'工具调用 ' + message.tool.name + ' · ' + message.tool.status"><pre>{{message.tool.args | json}}</pre></nz-collapse-panel></nz-collapse>} @if(message.streaming){<div class="streaming"><nz-spin nzSimple nzSize="small" /> 正在生成<span class="cursor"></span></div>} } @else {<p>{{message.content}}</p>}</div></article>}</div> }
          <div class="composer"><div class="suggestions">@for(suggestion of suggestions; track suggestion){<nz-tag (click)="fillSuggestion(suggestion)">{{suggestion}}</nz-tag>}</div><div class="composer-row"><button nz-button nzType="text"><ui-icon name="paperclip" /></button><textarea nz-input rows="1" [(ngModel)]="draft" maxlength="2000" placeholder="输入消息，按 Enter 发送" (keydown.enter)="send($event)"></textarea><nz-select [(ngModel)]="model" class="model"><nz-option *ngFor="let item of models" [nzValue]="item" [nzLabel]="item" /></nz-select><button nz-button nzType="primary" [disabled]="!draft.trim()" (click)="send()">发送</button></div><div class="hint">Enter 发送 · Shift+Enter 换行 · {{draft.length}}/2000</div></div>
        </main>
      </div>
    </section>
    <nz-drawer [nzVisible]="conversationOpen" nzPlacement="left" nzTitle="对话" (nzOnClose)="conversationOpen=false"><ng-container *nzDrawerContent><ng-container *ngTemplateOutlet="conversationTpl" /></ng-container></nz-drawer>
    <ng-template #conversationTpl><div class="conversation"><input nz-input [(ngModel)]="conversationQuery" placeholder="搜索对话" /><button nz-button nzType="primary" nzBlock (click)="newConversation()"><ui-icon name="plus" /> 新建对话</button><h4>今天</h4>@for(item of todayConversations; track item.id){<div class="conversation-item" (click)="selectConversation(item.id)"><span>{{item.title}}<small>{{item.time}}</small></span>@if(item.unread){<nz-badge [nzCount]="item.unread" />}</div>}<h4>更早</h4>@for(item of olderConversations; track item.id){<div class="conversation-item" (click)="selectConversation(item.id)"><span>{{item.title}}<small>{{item.time}}</small></span></div>}</div></ng-template>
  `,
  styles: `.chat-page{display:flex;flex-direction:column;height:calc(100vh - 48px);min-height:620px}.chat-header{display:flex;align-items:center;gap:16px;margin-bottom:16px}.chat-header h1{margin:0;flex:1}.chat-layout{display:flex;flex:1;min-height:0;border:1px solid var(--ant-color-border);border-radius:8px;overflow:hidden}.conversation-panel{width:280px;flex:0 0 280px;border-right:1px solid var(--ant-color-border);padding:16px}.conversation{display:grid;gap:12px}.conversation h4{margin:8px 0 0;color:var(--ant-color-text-secondary)}.conversation-item{display:flex;justify-content:space-between;gap:8px;padding:10px;border-radius:6px;cursor:pointer}.conversation-item:hover{background:var(--ant-color-fill-quaternary)}.conversation-item small{display:block;color:var(--ant-color-text-secondary);margin-top:4px}.message-panel{display:flex;flex-direction:column;min-width:0;flex:1}.messages{overflow:auto;flex:1;padding:24px}.message{display:flex;gap:12px;max-width:820px;margin-bottom:24px}.message.user-message{margin-left:auto;flex-direction:row-reverse}.bubble{min-width:0;max-width:calc(100% - 48px);padding:12px 16px;border-radius:10px;background:var(--ant-color-fill-quaternary)}.user-message .bubble{background:var(--ant-color-primary,#1677ff);color:#fff}.message-meta{font-size:12px;color:var(--ant-color-text-secondary);margin-bottom:8px}.user-message .message-meta{color:rgba(255,255,255,.72)}.markdown{overflow-x:auto}.markdown :last-child{margin-bottom:0}.code-block{position:relative;border:1px solid var(--ant-color-border);border-radius:6px;background:var(--ant-color-bg-container);margin:12px 0;overflow:auto}.code-block button{position:absolute;right:8px;top:8px}.code-block pre{margin:0;padding:16px;overflow:auto}.sources{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}.streaming{display:flex;align-items:center;gap:6px;color:var(--ant-color-text-secondary);margin-top:10px}.cursor{display:inline-block;width:7px;height:16px;background:currentColor;animation:blink 1s steps(2,start) infinite}@keyframes blink{50%{opacity:0}}.composer{padding:16px;border-top:1px solid var(--ant-color-border)}.composer-row{display:flex;align-items:flex-end;gap:8px}.composer-row textarea{flex:1;resize:none}.model{width:130px}.hint{font-size:12px;color:var(--ant-color-text-secondary);text-align:right;margin-top:6px}.suggestions{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.empty-chat,.loading{display:grid;place-items:center;align-content:center;gap:12px;flex:1;text-align:center}.suggestion-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;max-width:600px}.suggestion-cards nz-card{cursor:pointer}.mobile-only{display:none}@media(max-width:767px){.chat-page{height:calc(100vh - 32px);min-height:580px}.conversation-panel{display:none}.mobile-only{display:inline-flex}.chat-header{flex-wrap:wrap}.chat-header nz-radio-group{order:3;width:100%;overflow:auto}.messages{padding:16px}.model{display:none}.composer-row button:last-child{white-space:nowrap}.suggestion-cards{grid-template-columns:1fr}.bubble{max-width:calc(100% - 42px)}}`,
})
export class ChatPage {
  readonly conversations = chat.conversations; readonly suggestions = chat.suggestions; readonly models = chat.models; state: 'normal' | 'loading' | 'empty' | 'error' = 'normal';
  selectedId = 'c1'; conversationOpen = false; conversationQuery = ''; draft = ''; model = this.models[0]; messages: Message[] = [...chat.messages] as Message[];
  constructor(route: ActivatedRoute, private readonly message: NzMessageService) { route.queryParamMap.subscribe((params) => { const state = params.get('state'); if (state === 'loading' || state === 'empty' || state === 'error') this.state = state; }); }
  get todayConversations() { return this.conversations.filter((item) => item.time === '刚刚' && item.title.includes(this.conversationQuery)); }
  get olderConversations() { return this.conversations.filter((item) => item.time !== '刚刚' && item.title.includes(this.conversationQuery)); }
  get selectedMessages(): Message[] { return this.selectedId === 'c1' ? this.messages : []; }
  blocks(content: string): Block[] { const result: Block[] = []; let position = 0; const pattern = /```(\w*)\n([\s\S]*?)```/g; let match: RegExpExecArray | null; while ((match = pattern.exec(content))) { if (match.index > position) result.push({ kind: 'text', value: content.slice(position, match.index) }); result.push({ kind: 'code', language: match[1], value: match[2] }); position = match.index + match[0].length; } if (position < content.length) result.push({ kind: 'text', value: content.slice(position) }); return result; }
  render(value: string): string { return marked.parse(value) as string; }
  fillSuggestion(value: string): void { this.draft = value; }
  newConversation(): void { this.selectedId = 'new'; this.state = 'empty'; this.conversationOpen = false; }
  selectConversation(id: string): void { this.selectedId = id; this.state = id === 'c1' ? 'normal' : 'empty'; this.conversationOpen = false; }
  send(event?: Event): void { if (event instanceof KeyboardEvent && !event.shiftKey) event.preventDefault(); if (!this.draft.trim()) return; this.messages = [...this.messages, { role: 'user', content: this.draft } as Message]; this.draft = ''; this.selectedId = 'c1'; this.state = 'normal'; }
  copy(value: string): void { void navigator.clipboard?.writeText(value); this.message.success('已复制'); }
}
