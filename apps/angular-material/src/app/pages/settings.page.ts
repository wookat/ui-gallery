import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import invoices from '@ui-gallery/spec/mock/invoices.json';
import plans from '@ui-gallery/spec/mock/plans.json';
import sessions from '@ui-gallery/spec/mock/sessions.json';
import team from '@ui-gallery/spec/mock/team.json';
import { SHARED_IMPORTS } from '../shared/material';

@Component({
  selector: 'app-delete-account-dialog',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <h2 mat-dialog-title>删除账户</h2>
    <mat-dialog-content>
      <p>删除账户会永久移除团队、订单和所有配置，无法恢复。</p>
      <mat-form-field appearance="outline" class="full">
        <mat-label>输入 DELETE 确认</mat-label>
        <input matInput [formControl]="confirmation" autocomplete="off">
        @if (confirmation.value && confirmation.value !== 'DELETE') {<mat-error>请输入大写 DELETE</mat-error>}
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>取消</button>
      <button mat-flat-button color="warn" [disabled]="confirmation.value !== 'DELETE'" (click)="confirm()">永久删除</button>
    </mat-dialog-actions>
  `,
})
export class DeleteAccountDialog {
  readonly confirmation = inject(FormBuilder).nonNullable.control('');
  private readonly dialogRef = inject(MatDialogRef<DeleteAccountDialog>);
  readonly accountName = inject<{ accountName: string }>(MAT_DIALOG_DATA).accountName;

  confirm(): void {
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <main class="page settings-page">
      <header class="page-header"><div><p class="eyebrow">WORKSPACE</p><h1>设置</h1><p class="muted">管理个人资料、团队与订阅偏好。</p></div><button mat-flat-button color="primary" (click)="save()">保存更改</button></header>
      <div class="settings-layout">
        <nav class="settings-nav" aria-label="设置导航">
          @for (item of tabs; track item.key) {<button mat-button [class.active-setting]="activeTab() === item.key" (click)="activeTab.set(item.key)"><mat-icon [svgIcon]="item.icon"></mat-icon>{{ item.label }}</button>}
        </nav>
        <section class="settings-content">
          @if (mobile()) {
            <mat-tab-group animationDuration="0ms" [selectedIndex]="tabIndex()" (selectedIndexChange)="activeTab.set(tabs[$event].key)">
              @for (item of tabs; track item.key) {<mat-tab [label]="item.label"></mat-tab>}
            </mat-tab-group>
          }
          @switch (activeTab()) {
            @case ('profile') {
              <mat-card><mat-card-header><mat-card-title>个人资料</mat-card-title><mat-card-subtitle>这些信息会显示在团队活动和邀请中。</mat-card-subtitle></mat-card-header><mat-card-content>
                <div class="profile-banner"><span class="avatar avatar-large">林</span><div><h3>林晓</h3><p class="muted">管理员 · Acme Console</p></div><button mat-stroked-button>更换头像</button></div>
                <form class="form-grid" [formGroup]="profileForm"><mat-form-field appearance="outline"><mat-label>姓名</mat-label><input matInput formControlName="name"><mat-error>请输入姓名</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>邮箱</mat-label><input matInput formControlName="email" readonly></mat-form-field><mat-form-field appearance="outline"><mat-label>语言</mat-label><mat-select formControlName="language"><mat-option value="zh">简体中文</mat-option><mat-option value="en">English</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>时区</mat-label><input matInput formControlName="timezone" [matAutocomplete]="timezoneOptions"><mat-autocomplete #timezoneOptions="matAutocomplete"><mat-option value="Asia/Shanghai">Asia/Shanghai</mat-option><mat-option value="America/Los_Angeles">America/Los_Angeles</mat-option></mat-autocomplete></mat-form-field><mat-form-field appearance="outline" class="full-span"><mat-label>个人简介</mat-label><textarea matInput formControlName="bio" rows="4"></textarea><mat-hint align="end">{{ profileForm.controls.bio.value.length }}/160</mat-hint></mat-form-field></form>
              </mat-card-content></mat-card>
            }
            @case ('security') {
              <mat-card><mat-card-header><mat-card-title>账号安全</mat-card-title><mat-card-subtitle>定期更新密码并检查活跃设备。</mat-card-subtitle></mat-card-header><mat-card-content class="stack">
                <form class="form-grid" [formGroup]="passwordForm"><mat-form-field appearance="outline"><mat-label>当前密码</mat-label><input matInput type="password" formControlName="current"><mat-error>请输入当前密码</mat-error></mat-form-field><span></span><mat-form-field appearance="outline"><mat-label>新密码</mat-label><input matInput type="password" formControlName="next"><mat-hint>至少 8 个字符</mat-hint><mat-error>请输入至少 8 个字符</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>确认新密码</mat-label><input matInput type="password" formControlName="confirm"><mat-error>两次密码不一致</mat-error></mat-form-field></form>
                <mat-divider></mat-divider><div class="spread"><div><h3>两步验证</h3><p class="muted">登录时要求输入验证码，保护账户安全。</p></div><mat-slide-toggle checked></mat-slide-toggle></div><div class="qr-placeholder"><mat-icon svgIcon="shield"></mat-icon><span>扫码绑定验证器</span></div><mat-divider></mat-divider><h3>活跃会话</h3><mat-list>@for (session of sessions; track session.device) {<mat-list-item><mat-icon matListItemIcon [svgIcon]="session.current ? 'laptop' : 'phone'"></mat-icon><span matListItemTitle>{{ session.device }} @if (session.current) {<span class="chip">当前设备</span>}</span><span matListItemLine>{{ session.location }} · {{ session.time }}</span><button mat-icon-button matListItemMeta matTooltip="注销会话"><mat-icon svgIcon="log-out"></mat-icon></button></mat-list-item>}</mat-list>
              </mat-card-content></mat-card>
            }
            @case ('notifications') {
              <mat-card><mat-card-header><mat-card-title>通知偏好</mat-card-title><mat-card-subtitle>选择希望接收哪些工作台通知。</mat-card-subtitle></mat-card-header><mat-card-content class="stack"><mat-button-toggle-group value="all" aria-label="通知渠道"><mat-button-toggle value="all">全部</mat-button-toggle><mat-button-toggle value="email">邮件</mat-button-toggle><mat-button-toggle value="push">推送</mat-button-toggle><mat-button-toggle value="in-app">站内</mat-button-toggle></mat-button-toggle-group>@for (item of notificationGroups; track item.title) {<div class="spread setting-row"><div><b>{{ item.title }}</b><p class="muted">{{ item.description }}</p></div><mat-slide-toggle [checked]="item.enabled"></mat-slide-toggle></div>}</mat-card-content></mat-card>
            }
            @case ('team') {
              <mat-card><mat-card-header><mat-card-title>团队成员</mat-card-title><mat-card-subtitle>管理成员角色和访问权限。</mat-card-subtitle></mat-card-header><mat-card-content><div class="invite-row"><mat-form-field appearance="outline" class="full"><mat-label>邀请成员邮箱</mat-label><input matInput placeholder="teammate@example.com"></mat-form-field><button mat-flat-button color="primary">发送邀请</button></div><div class="table-wrap"><table mat-table [dataSource]="team"><ng-container matColumnDef="member"><th mat-header-cell *matHeaderCellDef>成员</th><td mat-cell *matCellDef="let member"><div class="row"><span class="avatar">{{ member.name.slice(0, 1) }}</span><span>{{ member.name }}<small class="muted">{{ member.email }}</small></span></div></td></ng-container><ng-container matColumnDef="role"><th mat-header-cell *matHeaderCellDef>角色</th><td mat-cell *matCellDef="let member"><mat-select [value]="member.role"><mat-option value="owner">Owner</mat-option><mat-option value="admin">Admin</mat-option><mat-option value="member">Member</mat-option><mat-option value="viewer">Viewer</mat-option></mat-select></td></ng-container><ng-container matColumnDef="active"><th mat-header-cell *matHeaderCellDef>最近活跃</th><td mat-cell *matCellDef="let member">{{ member.lastActive }}</td></ng-container><tr mat-header-row *matHeaderRowDef="teamColumns"></tr><tr mat-row *matRowDef="let row; columns: teamColumns"></tr></table></div></mat-card-content></mat-card>
            }
            @case ('billing') {
              <div class="stack"><mat-card><mat-card-header><mat-card-title>当前计划</mat-card-title><mat-card-subtitle>Pro · 下次扣款 2026 年 10 月 1 日</mat-card-subtitle></mat-card-header><mat-card-content><div class="billing-current"><div><span class="price">¥99<span class="muted">/月</span></span><p class="muted">已使用 8 / 10 个席位</p></div><button mat-stroked-button>管理订阅</button></div></mat-card-content></mat-card><div class="grid grid-3">@for (plan of plans; track plan.name) {<mat-card [class.recommended-plan]="plan.recommended"><mat-card-content class="card-pad"><div class="spread"><h3>{{ plan.name }}</h3>@if (plan.recommended) {<span class="chip">推荐</span>}</div><div class="price">{{ plan.price === null ? '定制' : plan.price === 0 ? '免费' : '¥' + plan.price }}</div>@for (feature of plan.features; track feature) {<p class="muted">✓ {{ feature }}</p>}<button mat-stroked-button class="full">选择方案</button></mat-card-content></mat-card>}</div><mat-card><mat-card-header><mat-card-title>发票</mat-card-title></mat-card-header><mat-card-content class="table-wrap"><table mat-table [dataSource]="invoices"><ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>编号</th><td mat-cell *matCellDef="let invoice">{{ invoice.id }}</td></ng-container><ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>日期</th><td mat-cell *matCellDef="let invoice">{{ invoice.date }}</td></ng-container><ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>金额</th><td mat-cell *matCellDef="let invoice">¥{{ invoice.amount }}</td></ng-container><tr mat-header-row *matHeaderRowDef="invoiceColumns"></tr><tr mat-row *matRowDef="let row; columns: invoiceColumns"></tr></table></mat-card-content></mat-card></div>
            }
          }
          <mat-card class="danger-zone"><mat-card-header><mat-card-title>危险区域</mat-card-title><mat-card-subtitle>删除账户和工作区数据，操作不可撤销。</mat-card-subtitle></mat-card-header><mat-card-content><div class="spread"><div><b>删除 Acme Console 账户</b><p class="muted">所有订单、成员和配置都会被永久移除。</p></div><button mat-stroked-button color="warn" (click)="deleteAccount()">删除账户</button></div></mat-card-content></mat-card>
        </section>
      </div>
    </main>
  `,
})
export class SettingsPage {
  readonly tabs = [
    { key: 'profile', label: '个人资料', icon: 'user' },
    { key: 'security', label: '账号安全', icon: 'shield' },
    { key: 'notifications', label: '通知', icon: 'bell' },
    { key: 'team', label: '团队', icon: 'users' },
    { key: 'billing', label: '计费', icon: 'credit-card' },
  ] as const;
  readonly activeTab = signal<(typeof this.tabs)[number]['key']>('profile');
  readonly mobile = signal(false);
  readonly profileForm = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    email: [{ value: 'lin.xiao@acme.dev', disabled: true }],
    language: ['zh'],
    timezone: ['Asia/Shanghai'],
    bio: ['负责 Acme Console 的产品与增长。'],
  });
  readonly passwordForm = inject(FormBuilder).nonNullable.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required],
  });
  readonly sessions = sessions;
  readonly team = team;
  readonly plans = plans;
  readonly invoices = invoices;
  readonly teamColumns = ['member', 'role', 'active'];
  readonly invoiceColumns = ['id', 'date', 'amount'];
  readonly notificationGroups = [
    { title: '订单状态更新', description: '支付、退款和发货状态变化', enabled: true },
    { title: '团队活动', description: '成员评论、提及和权限变化', enabled: true },
    { title: '产品更新', description: '新功能和维护通知', enabled: false },
  ];
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.breakpoint.observe('(max-width: 959px)').subscribe((state) => this.mobile.set(state.matches));
  }

  tabIndex(): number {
    return this.tabs.findIndex((tab) => tab.key === this.activeTab());
  }

  save(): void {
    this.snackBar.open('设置已保存', '知道了', { duration: 2400 });
  }

  deleteAccount(): void {
    const ref = this.dialog.open(DeleteAccountDialog, { width: '440px', data: { accountName: 'Acme Console' } });
    ref.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.snackBar.open('账户删除请求已提交', '知道了', { duration: 3200 });
      }
    });
  }
}
