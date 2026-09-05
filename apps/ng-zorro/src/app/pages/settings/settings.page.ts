import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import sessions from '@ui-gallery/spec/mock/sessions.json';
import team from '@ui-gallery/spec/mock/team.json';
import plans from '@ui-gallery/spec/mock/plans.json';
import invoices from '@ui-gallery/spec/mock/invoices.json';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzAvatarModule, NzBadgeModule, NzButtonModule, NzCardModule, NzFormModule, NzInputModule, NzModalModule, NzQRCodeModule, NzSegmentedModule, NzSelectModule, NzSwitchModule, NzTableModule, NzTabsModule, NzTagModule, NzTypographyModule, NzUploadModule],
  template: `
    <section class="settings-page"><h1 nz-typography>设置</h1>
      <nz-tabs [nzTabPosition]="isMobile ? 'top' : 'left'" class="settings-tabs">
        <nz-tab nzTitle="个人资料"><nz-card><form nz-form [formGroup]="profile"><nz-form-item><nz-form-label>头像</nz-form-label><nz-form-control><nz-upload [nzBeforeUpload]="beforeUpload" nzShowUploadList="false"><nz-avatar nzSize="large">林</nz-avatar></nz-upload></nz-form-control></nz-form-item><nz-form-item><nz-form-label nzRequired>姓名</nz-form-label><nz-form-control><input nz-input formControlName="name" /></nz-form-control></nz-form-item><nz-form-item><nz-form-label>简介</nz-form-label><nz-form-control><textarea nz-input rows="3" formControlName="description"></textarea></nz-form-control></nz-form-item><nz-form-item><nz-form-label>语言</nz-form-label><nz-form-control><nz-select formControlName="language"><nz-option nzValue="zh" nzLabel="简体中文" /><nz-option nzValue="en" nzLabel="English" /></nz-select></nz-form-control></nz-form-item><nz-form-item><nz-form-label>时区</nz-form-label><nz-form-control><nz-select formControlName="timezone" nzShowSearch><nz-option nzValue="Asia/Shanghai" nzLabel="Asia/Shanghai" /><nz-option nzValue="Asia/Tokyo" nzLabel="Asia/Tokyo" /><nz-option nzValue="Europe/Berlin" nzLabel="Europe/Berlin" /></nz-select></nz-form-control></nz-form-item></form></nz-card></nz-tab>
        <nz-tab nzTitle="账号安全"><nz-card><h3 nz-typography>修改密码</h3><form nz-form [formGroup]="password"><nz-form-item><nz-form-label nzRequired>当前密码</nz-form-label><nz-form-control><input nz-input type="password" formControlName="current" /></nz-form-control></nz-form-item><nz-form-item><nz-form-label nzRequired>新密码</nz-form-label><nz-form-control><input nz-input type="password" formControlName="next" /></nz-form-control></nz-form-item><nz-form-item><nz-form-label nzRequired>确认密码</nz-form-label><nz-form-control><input nz-input type="password" formControlName="confirm" /></nz-form-control></nz-form-item></form><div class="security-row"><span>两步验证</span><nz-switch [(ngModel)]="twoFactor" [ngModelOptions]="{standalone:true}" /></div><nz-qrcode nzValue="acme-console-2fa" [nzSize]="160" /><h3 nz-typography>活跃会话</h3>@for (session of sessions; track session.device) {<div class="session"><div><strong>{{ session.device }}</strong><div nz-typography nzType="secondary">{{ session.location }} · {{ session.time }}</div></div>@if(session.current){<nz-tag nzColor="success">当前</nz-tag>}@else{<button nz-button nzDanger nzType="link">注销</button>}</div>}</nz-card></nz-tab>
        <nz-tab nzTitle="通知"><nz-card><h3 nz-typography>通知偏好</h3>@for (group of notificationGroups; track group.title) {<h4>{{ group.title }}</h4>@for (item of group.items; track item.label) {<div class="security-row"><span>{{ item.label }}</span><nz-switch [(ngModel)]="item.enabled" [ngModelOptions]="{standalone:true}" /></div>}}</nz-card><nz-segmented class="notify-segment" [nzOptions]="['邮件','推送','站内']" /></nz-tab>
        <nz-tab nzTitle="团队"><nz-card><nz-input-group nzSearch nzAddOnAfter="邀请"><input nz-input placeholder="输入邮箱邀请成员" /></nz-input-group><nz-table [nzData]="team" [nzShowPagination]="false" [nzScroll]="{ x: '620px' }"><thead><tr><th>成员</th><th>角色</th><th>最近活跃</th><th>操作</th></tr></thead><tbody>@for (member of team; track member.email) {<tr><td><span class="member"><nz-avatar nzSize="small">{{member.name.slice(0,1)}}</nz-avatar><span>{{member.name}}<small>{{member.email}}</small></span></span></td><td><nz-select [(ngModel)]="member.role" [ngModelOptions]="{standalone:true}" nzSize="small"><nz-option nzValue="owner" nzLabel="Owner" /><nz-option nzValue="admin" nzLabel="Admin" /><nz-option nzValue="member" nzLabel="Member" /><nz-option nzValue="viewer" nzLabel="Viewer" /></nz-select></td><td>{{member.lastActive}}</td><td><a nzDanger>移除</a></td></tr>}</tbody></nz-table></nz-card></nz-tab>
        <nz-tab nzTitle="计费"><nz-card><h3 nz-typography>当前计划</h3><nz-card nzSize="small"><strong>Pro</strong><span class="price">¥99 / 月</span></nz-card><div class="plans">@for(plan of plans; track plan.name){<nz-card><h3>{{plan.name}}</h3><div class="price">@if(plan.price === null){联系我们}@else{¥{{plan.price}} / 月}</div>@for(feature of plan.features; track feature){<p>✓ {{feature}}</p>}</nz-card>}</div><h3 nz-typography>账单</h3><nz-table [nzData]="invoices" [nzShowPagination]="false" [nzScroll]="{ x: '520px' }"><thead><tr><th>编号</th><th>日期</th><th>金额</th><th>状态</th></tr></thead><tbody>@for(invoice of invoices; track invoice.id){<tr><td>{{invoice.id}}</td><td>{{invoice.date}}</td><td>¥{{invoice.amount | number:'1.2-2'}}</td><td><nz-tag [nzColor]="invoice.status === 'paid' ? 'success' : 'warning'">{{invoice.status === 'paid' ? '已支付' : '待支付'}}</nz-tag></td></tr>}</tbody></nz-table></nz-card></nz-tab>
      </nz-tabs>
      <nz-card class="danger-zone"><h3 nz-typography>危险区</h3><p nz-typography nzType="secondary">删除账号后，所有数据将永久移除。</p><button nz-button nzDanger (click)="deleteVisible=true">删除账号</button></nz-card>
    </section>
    <nz-modal [(nzVisible)]="deleteVisible" nzTitle="删除账号" [nzOkDisabled]="deletePhrase !== '删除'" (nzOnCancel)="deleteVisible=false" (nzOnOk)="deleteAccount()"><ng-container *nzModalContent><p>请输入「删除」以确认此操作。</p><input nz-input [(ngModel)]="deletePhrase" placeholder="删除" /></ng-container></nz-modal>
  `,
  styles: `.settings-page{display:grid;gap:16px}.settings-tabs{min-height:560px}.security-row{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f0f0f0;padding:12px 0}.session,.member{display:flex;align-items:center;justify-content:space-between;gap:12px}.member{justify-content:flex-start}.member small{display:block;color:#8c8c8c}.plans{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:16px 0}.price{font-size:20px;font-weight:600;margin:12px 0}.notify-segment{margin-top:16px}.danger-zone{border:1px solid var(--ant-error-color,#ff4d4f)}@media(max-width:767px){.plans{grid-template-columns:1fr}.settings-tabs{min-height:0}}`,
})
export class SettingsPage {
  private readonly fb = inject(FormBuilder);
  readonly sessions = sessions; readonly team = team; readonly plans = plans; readonly invoices = invoices; isMobile = window.matchMedia('(max-width: 767px)').matches;
  twoFactor = false; deleteVisible = false; deletePhrase = ''; fileList: NzUploadFile[] = [];
  profile = this.fb.group({ name: ['林晓', Validators.required], description: [''], language: ['zh'], timezone: ['Asia/Shanghai'] });
  password = this.fb.group({ current: ['', Validators.required], next: ['', [Validators.required, Validators.minLength(8)]], confirm: ['', Validators.required] });
  notificationGroups = [{ title: '工作动态', items: [{ label: '订单更新', enabled: true }, { label: '团队活动', enabled: true }] }, { title: '系统', items: [{ label: '产品公告', enabled: false }, { label: '安全提醒', enabled: true }] }];
  constructor(private readonly message: NzMessageService) {}
  beforeUpload = (): boolean => false;
  deleteAccount(): void { this.deleteVisible = false; this.deletePhrase = ''; this.message.success('账号已删除'); }
}
