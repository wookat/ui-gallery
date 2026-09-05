import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Dialog } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import team from '@ui-gallery/spec/mock/team.json';
import sessions from '@ui-gallery/spec/mock/sessions.json';
import plans from '@ui-gallery/spec/mock/plans.json';
import invoices from '@ui-gallery/spec/mock/invoices.json';
import { Icon } from '../icons';
import { PageHeader, StatusTag, money } from '../shared';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule, Avatar, Button, Card, Dialog, Divider, InputText, Message, Password, Select, SelectButton, TableModule,
    Tabs, TabList, Tab, TabPanels, TabPanel, Tag, Textarea, ToggleSwitch, Icon, PageHeader, StatusTag,
  ],
  template: `
    <app-page-header title="设置" description="管理账户、安全、通知、团队与计费。" />

    <p-tabs [value]="tab()" (valueChange)="tab.set($any($event))" [scrollable]="true">
      <p-tablist>
        <p-tab value="profile">个人资料</p-tab>
        <p-tab value="security">安全</p-tab>
        <p-tab value="notifications">通知</p-tab>
        <p-tab value="team">团队</p-tab>
        <p-tab value="billing">计费</p-tab>
      </p-tablist>
      <p-tabpanels>
        <p-tabpanel value="profile">
          <div class="stack">
            <p-card header="头像">
              <div class="row wrap" style="gap:1rem">
                <p-avatar [label]="me.name.slice(0, 1)" shape="circle" size="xlarge" />
                <div class="col">
                  <div class="row wrap">
                    <p-button label="上传新头像" [outlined]="true" severity="secondary" size="small"><app-icon name="upload" /></p-button>
                    <p-button label="移除" [text]="true" severity="danger" size="small" />
                  </div>
                  <span class="text-xs muted">支持 PNG / JPG，不超过 2 MB。</span>
                </div>
              </div>
            </p-card>
            <p-card header="基本信息">
              <div class="grid grid-2">
                <div class="field"><label for="name">姓名</label><input pInputText id="name" [(ngModel)]="profile.name" /></div>
                <div class="field"><label for="email">邮箱</label><input pInputText id="email" type="email" [(ngModel)]="profile.email" /></div>
                <div class="field"><label for="lang">语言</label><p-select inputId="lang" [(ngModel)]="profile.lang" [options]="langs" optionLabel="label" optionValue="value" styleClass="w-full" /></div>
                <div class="field"><label for="tz">时区</label><p-select inputId="tz" [(ngModel)]="profile.tz" [options]="timezones" [filter]="true" styleClass="w-full" /></div>
                <div class="field span-2"><label for="bio">简介</label><textarea pTextarea id="bio" rows="3" [(ngModel)]="profile.bio" placeholder="介绍一下你自己..."></textarea></div>
              </div>
              <div class="row" style="justify-content:flex-end; margin-top:1rem"><p-button label="保存更改" (onClick)="saved('个人资料')" /></div>
            </p-card>
          </div>
        </p-tabpanel>

        <p-tabpanel value="security">
          <div class="stack">
            <p-card header="修改密码">
              <div class="grid grid-3">
                <div class="field"><label for="cur">当前密码</label><p-password inputId="cur" [(ngModel)]="pwd.current" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full" /></div>
                <div class="field"><label for="new">新密码</label><p-password inputId="new" [(ngModel)]="pwd.next" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full" promptLabel="输入密码" weakLabel="弱" mediumLabel="中" strongLabel="强" /></div>
                <div class="field"><label for="confirm">确认新密码</label><p-password inputId="confirm" [(ngModel)]="pwd.confirm" [feedback]="false" [toggleMask]="true" styleClass="w-full" inputStyleClass="w-full" [invalid]="!!pwd.confirm && pwd.confirm !== pwd.next" /></div>
              </div>
              <div class="row" style="justify-content:flex-end; margin-top:1rem"><p-button label="更新密码" (onClick)="saved('密码')" /></div>
            </p-card>
            <p-card header="两步验证">
              <div class="row between wrap">
                <div><p class="font-medium">启用两步验证 (2FA)</p><p class="text-sm muted">登录时需要输入验证器 App 生成的动态码。</p></div>
                <p-toggleswitch [(ngModel)]="twoFactor" />
              </div>
              @if (twoFactor) {
                <p-divider />
                <div class="row wrap" style="gap:1rem; align-items:flex-start">
                  <div class="placeholder qr">QR</div>
                  <div class="col grow">
                    <p class="text-sm">使用验证器 App 扫描二维码，或手动输入密钥。</p>
                    <code class="text-sm">ACME-XXXX-XXXX-XXXX</code>
                    <p-message severity="warn" styleClass="text-sm">请妥善保存恢复代码，丢失后无法找回。</p-message>
                  </div>
                </div>
              }
            </p-card>
            <p-card header="活跃会话">
              <ul class="list">
                @for (s of sessions; track s.device) {
                  <li class="row between wrap">
                    <div class="row">
                      <app-icon [name]="s.device.includes('iPhone') ? 'smartphone' : 'laptop'" [size]="20" class="muted" />
                      <div class="col" style="gap:0">
                        <span class="row">{{ s.device }} @if (s.current) { <p-tag value="当前设备" severity="success" /> }</span>
                        <span class="text-xs muted">{{ s.location }} · {{ s.time }}</span>
                      </div>
                    </div>
                    @if (!s.current) { <p-button label="注销" [text]="true" severity="danger" size="small" (onClick)="saved('会话已注销')" /> }
                  </li>
                }
              </ul>
            </p-card>
            <p-card header="危险区域" styleClass="danger">
              <div class="row between wrap">
                <div><p class="font-medium">删除账户</p><p class="text-sm muted">永久删除账户与所有数据，此操作不可撤销。</p></div>
                <p-button label="删除账户" severity="danger" [outlined]="true" (onClick)="deleteOpen.set(true)" />
              </div>
            </p-card>
          </div>
        </p-tabpanel>

        <p-tabpanel value="notifications">
          <p-card header="通知偏好">
            <div class="stack">
              <div class="field">
                <span class="label">接收方式</span>
                <p-selectbutton [(ngModel)]="notifyChannel" [options]="notifyChannels" optionLabel="label" optionValue="value" [allowEmpty]="false" />
              </div>
              <p-divider />
              @for (n of notifyItems; track n.key) {
                <div class="row between wrap">
                  <div><p class="font-medium">{{ n.label }}</p><p class="text-sm muted">{{ n.desc }}</p></div>
                  <p-toggleswitch [(ngModel)]="n.on" />
                </div>
              }
              <div class="row" style="justify-content:flex-end"><p-button label="保存偏好" (onClick)="saved('通知偏好')" /></div>
            </div>
          </p-card>
        </p-tabpanel>

        <p-tabpanel value="team">
          <p-card>
            <div class="row between wrap" style="margin-bottom:1rem">
              <div><p class="font-semibold">团队成员</p><p class="text-sm muted">{{ team.length }} 位成员</p></div>
              <div class="row">
                <input pInputText placeholder="邮箱地址" [(ngModel)]="invite" style="width: 14rem" />
                <p-button label="邀请" (onClick)="doInvite()"><app-icon name="plus" /></p-button>
              </div>
            </div>
            <p-table [value]="team" [tableStyle]="{ 'min-width': '40rem' }">
              <ng-template #header><tr><th>成员</th><th>角色</th><th>最近活跃</th><th></th></tr></ng-template>
              <ng-template #body let-m>
                <tr>
                  <td><div class="row"><p-avatar [label]="m.name.slice(0, 1)" shape="circle" /><div class="col" style="gap:0"><span class="font-medium">{{ m.name }}</span><span class="text-xs muted">{{ m.email }}</span></div></div></td>
                  <td><p-select [ngModel]="m.role" [options]="roles" optionLabel="label" optionValue="value" size="small" [disabled]="m.role === 'owner'" /></td>
                  <td class="muted">{{ m.lastActive }}</td>
                  <td class="right">@if (m.role !== 'owner') { <p-button [text]="true" severity="danger" size="small" [rounded]="true" ariaLabel="移除"><app-icon name="trash" /></p-button> }</td>
                </tr>
              </ng-template>
            </p-table>
          </p-card>
        </p-tabpanel>

        <p-tabpanel value="billing">
          <div class="stack">
            <div class="grid grid-3">
              @for (p of plans; track p.name) {
                <p-card [styleClass]="p.recommended ? 'plan recommended' : 'plan'">
                  <div class="row between"><span class="font-semibold">{{ p.name }}</span>@if (p.recommended) { <p-tag value="推荐" /> }</div>
                  <div class="price">@if (p.price === null) { 联系我们 } @else { ¥{{ p.price }}<span class="text-sm muted"> / 月</span> }</div>
                  <ul class="features">@for (f of p.features; track f) { <li class="row text-sm"><app-icon name="check" [size]="14" />{{ f }}</li> }</ul>
                  <p-button [label]="p.recommended ? '当前计划' : '切换到此计划'" [outlined]="!p.recommended" [severity]="p.recommended ? 'primary' : 'secondary'" styleClass="w-full" [disabled]="p.recommended" />
                </p-card>
              }
            </div>
            <p-card header="账单历史">
              <p-table [value]="invoices" [tableStyle]="{ 'min-width': '32rem' }">
                <ng-template #header><tr><th>编号</th><th>日期</th><th>状态</th><th class="right">金额</th><th></th></tr></ng-template>
                <ng-template #body let-i>
                  <tr>
                    <td class="font-medium">{{ i.id }}</td><td>{{ i.date }}</td><td><app-status-tag [value]="i.status" /></td>
                    <td class="right">{{ money(i.amount) }}</td>
                    <td class="right"><p-button [text]="true" severity="secondary" size="small" [rounded]="true" ariaLabel="下载"><app-icon name="download" /></p-button></td>
                  </tr>
                </ng-template>
              </p-table>
            </p-card>
          </div>
        </p-tabpanel>
      </p-tabpanels>
    </p-tabs>

    <p-dialog header="删除账户" [visible]="deleteOpen()" (visibleChange)="deleteOpen.set($event)" [modal]="true" [style]="{ width: '28rem', maxWidth: '95vw' }">
      <div class="stack">
        <p-message severity="error">此操作将永久删除账户 {{ me.email }} 及其所有数据。</p-message>
        <div class="field">
          <label for="confirmText">请输入 <b>DELETE</b> 以确认</label>
          <input pInputText id="confirmText" [(ngModel)]="confirmText" autocomplete="off" />
        </div>
      </div>
      <ng-template #footer>
        <p-button label="取消" [text]="true" severity="secondary" (onClick)="deleteOpen.set(false)" />
        <p-button label="永久删除" severity="danger" [disabled]="confirmText !== 'DELETE'" (onClick)="deleteOpen.set(false); saved('账户删除请求已提交')" />
      </ng-template>
    </p-dialog>
  `,
  styles: `
    .span-2 { grid-column: span 2; }
    .list { display: flex; flex-direction: column; gap: 0.75rem; }
    .qr { width: 8rem; height: 8rem; flex: none; }
    :host ::ng-deep .danger { border-color: var(--p-red-300); }
    :host ::ng-deep .plan.recommended { border-color: var(--p-primary-color); }
    :host ::ng-deep .plan .p-card-body { display: flex; flex-direction: column; gap: 0.75rem; height: 100%; }
    .price { font-size: 1.75rem; font-weight: 600; }
    .features { display: flex; flex-direction: column; gap: 0.375rem; flex: 1; }
    :host ::ng-deep .p-tabpanels { padding: 1rem 0 0; background: transparent; }
    :host ::ng-deep .p-tablist-tab-list { background: transparent; }
    @media (max-width: 767px) { .span-2 { grid-column: auto; } }
  `,
})
export class SettingsPage {
  private readonly messages = inject(MessageService);
  readonly me = team[0];
  readonly team = team;
  readonly sessions = sessions;
  readonly plans = plans;
  readonly invoices = invoices;
  readonly money = money;
  readonly tab = signal('profile');
  readonly deleteOpen = signal(false);
  confirmText = '';
  invite = '';
  twoFactor = false;
  profile = { name: this.me.name, email: this.me.email, lang: 'zh-CN', tz: 'Asia/Shanghai', bio: '' };
  pwd = { current: '', next: '', confirm: '' };
  readonly langs = [
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en' },
    { label: '日本語', value: 'ja' },
  ];
  readonly timezones = ['Asia/Shanghai', 'Asia/Tokyo', 'Asia/Singapore', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles'];
  readonly roles = [
    { label: '所有者', value: 'owner' },
    { label: '管理员', value: 'admin' },
    { label: '成员', value: 'member' },
    { label: '访客', value: 'viewer' },
  ];
  notifyChannel = 'email';
  readonly notifyChannels = [
    { label: '邮件', value: 'email' },
    { label: '站内', value: 'inapp' },
    { label: '全部', value: 'all' },
  ];
  readonly notifyItems = [
    { key: 'orders', label: '订单动态', desc: '新订单、退款与发货更新', on: true },
    { key: 'mentions', label: '提及与评论', desc: '有人在评论中提到你', on: true },
    { key: 'digest', label: '每周摘要', desc: '每周一发送经营周报', on: false },
    { key: 'marketing', label: '产品更新', desc: '新功能与使用技巧', on: false },
  ];

  saved(what: string) {
    this.messages.add({ severity: 'success', summary: '已保存', detail: `${what}已更新` });
  }

  doInvite() {
    if (!this.invite) return;
    this.messages.add({ severity: 'success', summary: '邀请已发送', detail: this.invite });
    this.invite = '';
  }
}
