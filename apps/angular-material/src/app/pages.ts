import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { marked } from 'marked';
import activity from '@ui-gallery/spec/mock/activity.json';
import chat from '@ui-gallery/spec/mock/chat.json';
import invoices from '@ui-gallery/spec/mock/invoices.json';
import landing from '@ui-gallery/spec/mock/landing.json';
import orders from '@ui-gallery/spec/mock/orders.json';
import plans from '@ui-gallery/spec/mock/plans.json';
import series from '@ui-gallery/spec/mock/series.json';
import sessions from '@ui-gallery/spec/mock/sessions.json';
import stats from '@ui-gallery/spec/mock/stats.json';
import tasks from '@ui-gallery/spec/mock/tasks.json';
import team from '@ui-gallery/spec/mock/team.json';
import { UrlSettingsService } from './core';
import { coverage } from './coverage';

const MATERIAL = [
  MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
  MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatDividerModule,
  MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule,
  MatStepperModule, MatTableModule, MatTabsModule, MatTooltipModule, MatToolbarModule,
];
const BASE = [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ...MATERIAL];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: BASE,
  template: `
    <main class="page" style="min-height:100vh;display:grid;place-items:center">
      <mat-card style="width:min(100%,460px)">
        <mat-card-header><mat-card-title><span class="brand-mark">A</span> 登录 Acme Console</mat-card-title><mat-card-subtitle>欢迎回来，继续管理你的业务。</mat-card-subtitle></mat-card-header>
        <mat-card-content class="stack">
          <div *ngIf="error" class="notice">登录失败，请检查邮箱和密码后重试。</div>
          <form [formGroup]="form" (ngSubmit)="submit()" class="stack">
            <mat-form-field appearance="outline"><mat-label>邮箱</mat-label><mat-icon matPrefix svgIcon="user"></mat-icon><input matInput formControlName="email" type="email" placeholder="name@example.com"><mat-error *ngIf="form.controls['email'].hasError('required')">请输入邮箱</mat-error><mat-error *ngIf="form.controls['email'].hasError('email')">邮箱格式不正确</mat-error></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>密码</mat-label><input matInput formControlName="password" [type]="showPassword ? 'text' : 'password'"><button mat-icon-button matSuffix type="button" (click)="showPassword=!showPassword"><mat-icon [svgIcon]="showPassword ? 'eye' : 'lock'"></mat-icon></button><mat-error>请输入密码</mat-error></mat-form-field>
            <div class="spread"><mat-checkbox>记住我</mat-checkbox><a href="#" class="muted">忘记密码？</a></div>
            <button mat-flat-button color="primary" class="full" [disabled]="loading">{{ loading ? '正在登录…' : '登录' }}<mat-progress-spinner *ngIf="loading" diameter="18" mode="indeterminate"></mat-progress-spinner></button>
          </form>
          <div class="row muted"><mat-divider style="flex:1"></mat-divider><span>或</span><mat-divider style="flex:1"></mat-divider></div>
          <div class="grid grid-3"><button mat-stroked-button>Google</button><button mat-stroked-button>GitHub</button><button mat-stroked-button>微信</button></div>
          <p class="muted" style="text-align:center;margin:0">还没有账号？ <a routerLink="/landing" queryParamsHandling="preserve">免费注册</a></p>
        </mat-card-content>
      </mat-card>
    </main>
  `,
  styles: [`.brand-mark{display:inline-grid;width:30px;height:30px;place-items:center;border-radius:8px;background:var(--mat-sys-primary);color:var(--mat-sys-on-primary);margin-right:8px}.mat-mdc-card-header{padding:24px 24px 8px}.mat-mdc-card-content{padding:16px 24px 24px}.mat-mdc-progress-spinner{display:inline-block;margin-left:8px;vertical-align:middle}`],
})
export class LoginPage {
  readonly form: FormGroup; loading = false; error = false; showPassword = false;
  constructor(fb: FormBuilder) { this.form = fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] }); }
  submit() { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.loading = true; this.error = false; setTimeout(() => { this.loading = false; this.error = true; }, 800); }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: BASE,
  template: `
    <div class="page">
      <div class="page-header"><div><p class="eyebrow">ACME CONSOLE</p><h1 style="margin:0">概览</h1><p class="muted">今天也保持清晰的业务节奏。</p></div><mat-button-toggle-group value="month"><mat-button-toggle value="day">日</mat-button-toggle><mat-button-toggle value="week">周</mat-button-toggle><mat-button-toggle value="month">月</mat-button-toggle></mat-button-toggle-group></div>
      <ng-container *ngIf="loading; else dashboardData"><div class="grid grid-4"><div class="skeleton" *ngFor="let item of [1,2,3,4]"></div></div><div class="grid grid-2" style="margin-top:20px"><div class="skeleton" style="height:330px"></div><div class="skeleton" style="height:330px"></div></div></ng-container>
      <ng-template #dashboardData>
        <div class="grid grid-4"><mat-card *ngFor="let stat of statList"><mat-card-content class="card-pad"><div class="spread"><span class="muted">{{stat.label}}</span><mat-icon svgIcon="activity"></mat-icon></div><strong style="display:block;font-size:30px;margin:12px 0">{{formatStat(stat)}}</strong><span class="chip" [class.positive]="stat.delta >= 0" [class.negative]="stat.delta < 0">{{stat.delta >= 0 ? '+' : ''}}{{stat.delta}}% 同比</span><svg class="sparkline" viewBox="0 0 120 38" preserveAspectRatio="none"><polyline [attr.points]="spark(stat.trend)"></polyline></svg></mat-card-content></mat-card></div>
        <div class="grid grid-2" style="margin-top:20px"><mat-card><mat-card-header><mat-card-title>收入趋势</mat-card-title><mat-card-subtitle>近 7 个月收入与订单</mat-card-subtitle></mat-card-header><mat-card-content><svg viewBox="0 0 600 230" class="full" style="height:230px"><polyline [attr.points]="chart(series.revenue)" fill="none" stroke="var(--mat-sys-primary)" stroke-width="4"></polyline><polyline [attr.points]="chart(series.orders)" fill="none" stroke="var(--mat-sys-tertiary)" stroke-width="3" stroke-dasharray="6 7"></polyline></svg><div class="spread muted"><span *ngFor="let month of series.months">{{month}}</span></div></mat-card-content></mat-card><mat-card><mat-card-header><mat-card-title>渠道分布</mat-card-title><mat-card-subtitle>订单来源占比</mat-card-subtitle></mat-card-header><mat-card-content><div class="donut"><div><strong>100%</strong><small>总渠道</small></div></div><div class="stack" style="margin-top:16px"><div class="spread" *ngFor="let channel of series.byChannel"><span>{{channel.name}}</span><span class="chip">{{channel.value}}%</span></div></div></mat-card-content></mat-card></div>
        <div class="grid grid-2" style="margin-top:20px"><mat-card><mat-card-header><mat-card-title>最近订单</mat-card-title><mat-card-subtitle>最新 5 笔业务记录</mat-card-subtitle></mat-card-header><mat-card-content class="table-wrap"><table mat-table [dataSource]="recentOrders"><ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>订单号</th><td mat-cell *matCellDef="let row">{{row.id}}</td></ng-container><ng-container matColumnDef="customer"><th mat-header-cell *matHeaderCellDef>客户</th><td mat-cell *matCellDef="let row"><span class="row"><span class="avatar">{{row.customer.slice(0,1)}}</span>{{row.customer}}</span></td></ng-container><ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>状态</th><td mat-cell *matCellDef="let row"><span class="chip status">{{statusLabel(row.status)}}</span></td></ng-container><ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>金额</th><td mat-cell *matCellDef="let row">¥{{row.amount | number:'1.0-0'}}</td></ng-container><tr mat-header-row *matHeaderRowDef="columns"></tr><tr mat-row *matRowDef="let row; columns: columns"></tr></table></mat-card-content></mat-card><mat-card><mat-card-header><mat-card-title>团队动态</mat-card-title><mat-card-subtitle>最近发生的协作</mat-card-subtitle></mat-card-header><mat-card-content><mat-list><mat-list-item *ngFor="let item of activity"><span matListItemAvatar class="avatar">{{item.user.slice(0,1)}}</span><span matListItemTitle>{{item.user}} {{item.action}}</span><span matListItemLine>{{item.time}}</span></mat-list-item></mat-list></mat-card-content></mat-card></div>
        <mat-card style="margin-top:20px"><mat-card-header><mat-card-title>任务进度</mat-card-title></mat-card-header><mat-card-content class="grid grid-2"><div *ngFor="let task of tasks"><div class="spread"><span>{{task.title}}</span><span class="muted">{{task.progress}}%</span></div><mat-progress-bar mode="determinate" [value]="task.progress"></mat-progress-bar><small class="muted">{{task.owner}}</small></div></mat-card-content></mat-card>
      </ng-template>
    </div>
  `,
  styles: [`.donut{width:160px;height:160px;margin:auto;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--mat-sys-primary) 0 52%,var(--mat-sys-tertiary) 52% 75%,var(--mat-sys-secondary) 75% 92%,var(--mat-sys-outline-variant) 92%);position:relative}.donut:before{content:'';position:absolute;inset:28px;border-radius:50%;background:var(--mat-sys-surface)}.donut div{position:relative;text-align:center}.donut strong,.donut small{display:block}`],
})
export class DashboardPage implements OnInit {
  readonly statList = stats; readonly series = series; readonly activity = activity; readonly tasks = tasks; readonly recentOrders = orders.slice(0, 5); readonly columns = ['id', 'customer', 'status', 'amount']; loading = false;
  ngOnInit() { this.loading = new URLSearchParams(window.location.search).get('state') === 'loading'; }
  formatStat(stat: typeof stats[number]) { return stat.unit === '%' ? `${stat.value}%` : stat.unit === 'CNY' ? `¥${stat.value.toLocaleString()}` : stat.value.toLocaleString(); }
  spark(values: number[]) { const max = Math.max(...values), min = Math.min(...values); return values.map((v, i) => `${i * 20},${34 - ((v - min) / Math.max(max - min, 1)) * 28}`).join(' '); }
  chart(values: number[]) { const max = Math.max(...values), min = Math.min(...values); return values.map((v, i) => `${i * 100},${210 - ((v - min) / Math.max(max - min, 1)) * 180}`).join(' '); }
  statusLabel(value: string) { return ({ paid: '已支付', pending: '待处理', refunded: '已退款', failed: '失败', shipped: '已发货' } as Record<string, string>)[value] ?? value; }
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: BASE,
  template: `
    <div class="page"><div class="page-header"><div><p class="eyebrow">ORDERS</p><h1 style="margin:0">订单</h1><p class="muted">搜索、筛选并处理所有订单。</p></div><button mat-flat-button color="primary"><mat-icon svgIcon="download"></mat-icon>导出</button></div>
      <mat-card><mat-card-content class="card-pad"><div class="grid grid-3"><mat-form-field appearance="outline"><mat-label>搜索订单</mat-label><mat-icon matPrefix svgIcon="search"></mat-icon><input matInput [(ngModel)]="query" placeholder="订单号或客户"></mat-form-field><mat-form-field appearance="outline"><mat-label>状态</mat-label><mat-select [(ngModel)]="status"><mat-option value="">全部状态</mat-option><mat-option value="paid">已支付</mat-option><mat-option value="pending">待处理</mat-option><mat-option value="refunded">已退款</mat-option><mat-option value="failed">失败</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>渠道（多选）</mat-label><mat-select multiple [(ngModel)]="channels"><mat-option value="web">Web</mat-option><mat-option value="ios">iOS</mat-option><mat-option value="android">Android</mat-option><mat-option value="api">API</mat-option></mat-select></mat-form-field></div></mat-card-content></mat-card>
      <div *ngIf="state === 'error'" class="notice" style="margin-top:20px">订单数据暂时加载失败。<button mat-button (click)="state='ready'">重试</button></div>
      <mat-card style="margin-top:20px" *ngIf="state === 'loading'"><mat-card-content class="card-pad" style="display:grid;place-items:center;min-height:320px"><mat-progress-spinner mode="indeterminate"></mat-progress-spinner></mat-card-content></mat-card>
      <mat-card style="margin-top:20px" *ngIf="state !== 'loading' && state !== 'error'"><mat-card-header><mat-card-title>订单列表 <span class="chip">{{filtered.length}} 笔</span></mat-card-title><mat-card-subtitle>支持排序、选择与详情抽屉</mat-card-subtitle></mat-card-header><mat-card-content class="table-wrap" *ngIf="filtered.length; else empty"><table mat-table [dataSource]="filtered"><ng-container matColumnDef="select"><th mat-header-cell *matHeaderCellDef><mat-checkbox></mat-checkbox></th><td mat-cell *matCellDef="let row"><mat-checkbox></mat-checkbox></td></ng-container><ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>订单号</th><td mat-cell *matCellDef="let row"><button mat-button (click)="selected=row">{{row.id}}</button></td></ng-container><ng-container matColumnDef="customer"><th mat-header-cell *matHeaderCellDef>客户</th><td mat-cell *matCellDef="let row"><span class="row"><span class="avatar">{{row.customer.slice(0,1)}}</span>{{row.customer}}</span></td></ng-container><ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>状态</th><td mat-cell *matCellDef="let row"><span class="chip status">{{statusLabel(row.status)}}</span></td></ng-container><ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>日期</th><td mat-cell *matCellDef="let row">{{row.date}}</td></ng-container><ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>金额</th><td mat-cell *matCellDef="let row" style="text-align:right">¥{{row.amount | number:'1.2-2'}}</td></ng-container><ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let row"><button mat-icon-button [matMenuTriggerFor]="orderMenu"><mat-icon svgIcon="more"></mat-icon></button><mat-menu #orderMenu="matMenu"><button mat-menu-item (click)="selected=row">查看详情</button><button mat-menu-item (click)="remove(row)">删除</button></mat-menu></td></ng-container><tr mat-header-row *matHeaderRowDef="orderColumns"></tr><tr mat-row *matRowDef="let row; columns: orderColumns" (click)="selected=row"></tr></table><mat-paginator [length]="filtered.length" [pageSize]="5"></mat-paginator></mat-card-content><ng-template #empty><div class="card-pad" style="text-align:center"><mat-icon svgIcon="archive" style="width:54px;height:54px"></mat-icon><h2>没有找到订单</h2><p class="muted">尝试调整筛选条件。</p><button mat-stroked-button (click)="query='';status='';channels=[]">清除筛选</button></div></ng-template></mat-card>
      <mat-sidenav-container *ngIf="selected" class="detail-drawer"><mat-sidenav mode="over" position="end" opened (closedStart)="selected=null"><div class="card-pad"><div class="spread"><h2>订单详情</h2><button mat-icon-button (click)="selected=null"><mat-icon svgIcon="x"></mat-icon></button></div><mat-list><mat-list-item><span matListItemTitle>订单号</span><span matListItemLine>{{selected.id}}</span></mat-list-item><mat-list-item><span matListItemTitle>客户</span><span matListItemLine>{{selected.customer}} · {{selected.email}}</span></mat-list-item><mat-list-item><span matListItemTitle>金额</span><span matListItemLine>¥{{selected.amount | number:'1.2-2'}}</span></mat-list-item></mat-list><mat-tab-group><mat-tab label="明细"><p class="muted">{{selected.product}} · {{selected.channel}}</p></mat-tab><mat-tab label="备注"><mat-form-field appearance="outline" class="full"><mat-label>添加备注</mat-label><textarea matInput rows="4"></textarea></mat-form-field></mat-tab></mat-tab-group><button mat-stroked-button color="warn" (click)="remove(selected)">删除订单</button></div></mat-sidenav></mat-sidenav-container>
    </div>
  `,
  styles: [`.detail-drawer{position:fixed;inset:64px 0 0;z-index:5;background:transparent;pointer-events:none}.detail-drawer mat-sidenav{width:min(420px,100%);pointer-events:auto}.detail-drawer:after{content:'';position:absolute;inset:0;background:rgb(0 0 0 / 25%);z-index:-1}`],
})
export class OrdersPage {
  readonly source = orders; query = ''; status = ''; channels: string[] = []; selected: any = null; state = new URLSearchParams(window.location.search).get('state') ?? 'ready'; readonly orderColumns = ['select', 'id', 'customer', 'status', 'date', 'amount', 'actions'];
  constructor(private readonly snack: MatSnackBar) {}
  get filtered() { return this.source.filter(row => (!this.query || `${row.id}${row.customer}`.toLowerCase().includes(this.query.toLowerCase())) && (!this.status || row.status === this.status) && (!this.channels.length || this.channels.includes(row.channel))); }
  remove(row: any) { this.selected = null; this.snack.open(`已删除 ${row.id}`, '撤销', { duration: 2400 }); }
  statusLabel(value: string) { return ({ paid: '已支付', pending: '待处理', refunded: '已退款', failed: '失败', shipped: '已发货' } as Record<string, string>)[value] ?? value; }
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: BASE,
  template: `
    <div class="page"><div class="page-header"><div><p class="eyebrow">NEW PROJECT</p><h1 style="margin:0">新建项目</h1><p class="muted">用三步完成项目配置，所有字段都可以稍后修改。</p></div></div>
      <mat-card><mat-stepper orientation="vertical" [linear]="false" #stepper>
        <mat-step [stepControl]="basic"><form [formGroup]="basic" class="card-pad stack"><ng-template matStepLabel>基本信息</ng-template><div class="grid grid-2"><mat-form-field appearance="outline"><mat-label>项目名称 *</mat-label><input matInput formControlName="name"><mat-error>请输入项目名称</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>项目编号 *</mat-label><input matInput formControlName="code"><mat-error>请输入项目编号</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>负责人邮箱 *</mat-label><input matInput formControlName="email" type="email"><mat-error>请输入有效邮箱</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>联系电话</mat-label><mat-select matPrefix value="+86"><mat-option value="+86">+86</mat-option><mat-option value="+1">+1</mat-option></mat-select><input matInput formControlName="phone"></mat-form-field></div><mat-form-field appearance="outline" class="full"><mat-label>项目描述</mat-label><textarea matInput formControlName="description" maxlength="180" rows="4"></textarea><mat-hint align="end">{{basic.get('description')?.value?.length ?? 0}} / 180</mat-hint></mat-form-field><mat-radio-group formControlName="type"><label>项目类型</label><div class="demo-row"><mat-radio-button value="product">产品</mat-radio-button><mat-radio-button value="marketing">营销</mat-radio-button><mat-radio-button value="internal">内部</mat-radio-button></div></mat-radio-group><div class="demo-row"><mat-checkbox formControlName="analytics">启用分析</mat-checkbox><mat-checkbox formControlName="reports">每周报告</mat-checkbox><mat-slide-toggle formControlName="public">公开项目</mat-slide-toggle></div><div><button mat-flat-button color="primary" matStepperNext>下一步</button></div></form></mat-step>
        <mat-step [stepControl]="details"><form [formGroup]="details" class="card-pad stack"><ng-template matStepLabel>详细配置</ng-template><div class="grid grid-2"><mat-form-field appearance="outline"><mat-label>团队规模</mat-label><mat-select formControlName="size"><mat-option value="small">1–10 人</mat-option><mat-option value="medium">11–50 人</mat-option><mat-option value="large">50 人以上</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>技术栈（多选）</mat-label><mat-select multiple formControlName="stack"><mat-option value="angular">Angular</mat-option><mat-option value="react">React</mat-option><mat-option value="vue">Vue</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>地区</mat-label><input matInput formControlName="region" [matAutocomplete]="regions"><mat-autocomplete #regions="matAutocomplete"><mat-option *ngFor="let region of ['上海','杭州','北京','深圳']" [value]="region">{{region}}</mat-option></mat-autocomplete></mat-form-field><mat-form-field appearance="outline"><mat-label>开始日期</mat-label><input matInput [matDatepicker]="picker" formControlName="date"><mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle><mat-datepicker #picker></mat-datepicker></mat-form-field><mat-form-field appearance="outline"><mat-label>开始时间</mat-label><input matInput type="time" formControlName="time"></mat-form-field></div><div class="grid grid-2"><mat-form-field appearance="outline"><mat-label>预算区间</mat-label><input matInput placeholder="¥ 0 - ¥ 100,000"></mat-form-field><mat-form-field appearance="outline"><mat-label>标签</mat-label><mat-chip-grid #chipGrid><mat-chip-row *ngFor="let tag of tags" (removed)="removeTag(tag)">{{tag}}<button matChipRemove><mat-icon svgIcon="x"></mat-icon></button></mat-chip-row><input [matChipInputFor]="chipGrid" (matChipInputTokenEnd)="addTag($event)" placeholder="输入后回车"></mat-chip-grid></mat-form-field></div><div><label>评分</label><div class="demo-row"><button mat-icon-button *ngFor="let star of [1,2,3,4,5]" (click)="rating=star"><mat-icon [svgIcon]="star <= rating ? 'star' : 'circle'"></mat-icon></button></div></div><div class="upload-zone" (dragover)="$event.preventDefault()" (drop)="onDrop($event)"><mat-icon svgIcon="upload"></mat-icon><strong>拖拽文件到这里，或点击选择</strong><span class="muted">支持 PNG、PDF、CSV，单个文件不超过 10MB</span><input type="file" multiple (change)="onFiles($event)"></div><div class="demo-row"><button mat-button matTooltip="项目创建后可以继续调整">需要帮助？<mat-icon svgIcon="info"></mat-icon></button><button mat-button matStepperPrevious>上一步</button><button mat-flat-button color="primary" matStepperNext>下一步</button></div></form></mat-step>
        <mat-step><div class="card-pad stack"><ng-template matStepLabel>确认提交</ng-template><mat-card appearance="outlined"><mat-card-header><mat-card-title>项目摘要</mat-card-title></mat-card-header><mat-card-content><dl class="summary"><dt>项目名称</dt><dd>{{basic.value.name || '未填写'}}</dd><dt>项目类型</dt><dd>{{basic.value.type || '未选择'}}</dd><dt>团队规模</dt><dd>{{details.value.size || '未选择'}}</dd><dt>文件</dt><dd>{{files.length ? files.join('、') : '未上传'}}</dd></dl></mat-card-content></mat-card><mat-checkbox [(ngModel)]="agreed">我已阅读并同意服务条款</mat-checkbox><div><button mat-button matStepperPrevious>上一步</button><button mat-flat-button color="primary" [disabled]="!agreed" (click)="submitted=true">提交项目</button></div><div *ngIf="submitted" class="result"><mat-icon svgIcon="check"></mat-icon><h2>项目创建成功</h2><p class="muted">你的项目已经准备好，可以开始邀请团队成员了。</p><button mat-stroked-button routerLink="/" queryParamsHandling="preserve">返回仪表盘</button></div></div></mat-step>
      </mat-stepper></mat-card>
    </div>
  `,
  styles: [`.upload-zone{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;padding:30px;border:1px dashed var(--mat-sys-outline);border-radius:14px;text-align:center}.upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer}.summary{display:grid;grid-template-columns:140px 1fr;gap:12px;margin:0}.summary dt{color:var(--mat-sys-on-surface-variant)}.summary dd{margin:0}.result{text-align:center;padding:30px;background:var(--mat-sys-primary-container);border-radius:16px}.result mat-icon{width:50px;height:50px}`],
})
export class FormPage {
  readonly basic: FormGroup; readonly details: FormGroup; tags = ['核心项目']; rating = 4; files: string[] = []; agreed = false; submitted = false;
  constructor(fb: FormBuilder) {
    this.basic = fb.group({ name: ['', Validators.required], code: ['', Validators.required], email: ['', [Validators.required, Validators.email]], phone: [''], description: [''], type: ['product'], analytics: [true], reports: [false], public: [false] });
    this.details = fb.group({ size: ['medium'], stack: [['angular']], region: ['上海'], date: [new Date()], time: ['09:30'] });
  }
  addTag(event: any) { const value = event.value?.trim(); if (value) this.tags = [...this.tags, value]; event.chipInput?.clear(); }
  removeTag(tag: string) { this.tags = this.tags.filter(value => value !== tag); }
  onFiles(event: Event) { const input = event.target as HTMLInputElement; this.files = Array.from(input.files ?? []).map(file => file.name); }
  onDrop(event: DragEvent) { event.preventDefault(); this.files = Array.from(event.dataTransfer?.files ?? []).map(file => file.name); }
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: BASE,
  template: `
    <div class="page"><div class="page-header"><div><p class="eyebrow">SETTINGS</p><h1 style="margin:0">设置</h1><p class="muted">管理你的账户、团队与订阅设置。</p></div></div>
      <mat-tab-group animationDuration="0ms"><mat-tab label="个人资料"><mat-card class="card-pad"><h2>个人资料</h2><p class="muted">更新你的公开账户信息。</p><div class="row"><span class="avatar" style="width:64px;height:64px;font-size:24px">林</span><div><b>林晓</b><p class="muted" style="margin:4px 0">admin@acme.dev</p></div><button mat-stroked-button style="margin-left:auto">更换头像</button></div><mat-divider style="margin:20px 0"></mat-divider><div class="grid grid-2"><mat-form-field appearance="outline"><mat-label>姓名</mat-label><input matInput value="林晓"></mat-form-field><mat-form-field appearance="outline"><mat-label>语言</mat-label><mat-select value="zh"><mat-option value="zh">简体中文</mat-option><mat-option value="en">English</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>简介</mat-label><textarea matInput rows="3">负责 Acme Console 的产品与增长。</textarea></mat-form-field><mat-form-field appearance="outline"><mat-label>时区</mat-label><input matInput value="中国标准时间" [matAutocomplete]="timezone"><mat-autocomplete #timezone="matAutocomplete"><mat-option value="中国标准时间">中国标准时间</mat-option><mat-option value="UTC">UTC</mat-option></mat-autocomplete></mat-form-field></div><button mat-flat-button color="primary">保存更改</button></mat-card></mat-tab>
        <mat-tab label="账号安全"><div class="grid grid-2"><mat-card class="card-pad"><h2>安全设置</h2><p class="muted">保护你的账户与登录会话。</p><mat-slide-toggle checked>两步验证</mat-slide-toggle><div class="qr-placeholder">二维码占位<br><small>使用身份验证器扫描</small></div><mat-form-field appearance="outline" class="full"><mat-label>新密码</mat-label><input matInput type="password"></mat-form-field><button mat-stroked-button>更新密码</button></mat-card><mat-card><mat-card-header><mat-card-title>活跃会话</mat-card-title></mat-card-header><mat-list><mat-list-item *ngFor="let session of sessions"><mat-icon matListItemIcon svgIcon="globe"></mat-icon><span matListItemTitle>{{session.device}}</span><span matListItemLine>{{session.location}} · {{session.time}}</span><button mat-button matListItemMeta *ngIf="!session.current">注销</button><span class="chip" matListItemMeta *ngIf="session.current">当前</span></mat-list-item></mat-list></mat-card></div></mat-tab>
        <mat-tab label="通知"><mat-card class="card-pad"><h2>通知偏好</h2><div class="stack"><div class="spread" *ngFor="let item of ['项目更新','账单提醒','团队活动','产品新闻']"><span><b>{{item}}</b><small class="muted" style="display:block">通过邮件接收重要提醒</small></span><mat-slide-toggle [checked]="item !== '产品新闻'"></mat-slide-toggle></div></div><mat-divider style="margin:20px 0"></mat-divider><mat-button-toggle-group value="email"><mat-button-toggle value="email">邮件</mat-button-toggle><mat-button-toggle value="push">推送</mat-button-toggle><mat-button-toggle value="in-app">站内</mat-button-toggle></mat-button-toggle-group></mat-card></mat-tab>
        <mat-tab label="团队"><mat-card><mat-card-header><mat-card-title>团队成员</mat-card-title><mat-card-subtitle>管理团队访问权限。</mat-card-subtitle></mat-card-header><div class="table-wrap"><table mat-table [dataSource]="team"><ng-container matColumnDef="member"><th mat-header-cell *matHeaderCellDef>成员</th><td mat-cell *matCellDef="let member"><span class="row"><span class="avatar">{{member.name.slice(0,1)}}</span>{{member.name}}</span></td></ng-container><ng-container matColumnDef="role"><th mat-header-cell *matHeaderCellDef>角色</th><td mat-cell *matCellDef="let member"><mat-select [value]="member.role"><mat-option value="owner">owner</mat-option><mat-option value="admin">admin</mat-option><mat-option value="member">member</mat-option><mat-option value="viewer">viewer</mat-option></mat-select></td></ng-container><ng-container matColumnDef="active"><th mat-header-cell *matHeaderCellDef>最近活跃</th><td mat-cell *matCellDef="let member">{{member.lastActive}}</td></ng-container><tr mat-header-row *matHeaderRowDef="teamColumns"></tr><tr mat-row *matRowDef="let row; columns:teamColumns"></tr></table></div><div class="card-pad"><mat-form-field appearance="outline"><mat-label>邀请成员邮箱</mat-label><input matInput placeholder="name@example.com"></mat-form-field><button mat-flat-button color="primary">邀请成员</button></div></mat-card></mat-tab>
        <mat-tab label="计费"><div class="stack"><mat-card><mat-card-header><mat-card-title>订阅方案</mat-card-title></mat-card-header><mat-card-content class="grid grid-3"><div *ngFor="let plan of plans" class="card-pad" style="border:1px solid var(--mat-sys-outline-variant);border-radius:14px" [class.danger]="plan.recommended"><div class="spread"><b>{{plan.name}}</b><span *ngIf="plan.recommended" class="chip">推荐</span></div><div class="price">{{plan.price === null ? '定制' : plan.price === 0 ? '免费' : '¥'+plan.price}}<small class="muted"> /月</small></div><p *ngFor="let feature of plan.features" class="muted">✓ {{feature}}</p><button mat-stroked-button class="full">选择方案</button></div></mat-card-content></mat-card><mat-card><mat-card-header><mat-card-title>发票记录</mat-card-title></mat-card-header><div class="table-wrap"><table mat-table [dataSource]="invoices"><ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>编号</th><td mat-cell *matCellDef="let invoice">{{invoice.id}}</td></ng-container><ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>日期</th><td mat-cell *matCellDef="let invoice">{{invoice.date}}</td></ng-container><ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>金额</th><td mat-cell *matCellDef="let invoice">¥{{invoice.amount}}</td></ng-container><tr mat-header-row *matHeaderRowDef="invoiceColumns"></tr><tr mat-row *matRowDef="let row; columns:invoiceColumns"></tr></table></div></mat-card><mat-card class="danger card-pad"><h2>危险区</h2><p class="muted">删除账户会永久移除所有数据。</p><button mat-stroked-button color="warn" (click)="confirmDelete()">删除账户</button></mat-card></div></mat-tab></mat-tab-group>
    </div>
  `,
  styles: [`.qr-placeholder{display:grid;place-items:center;width:170px;height:170px;margin:22px 0;background:repeating-linear-gradient(45deg,var(--mat-sys-surface-variant),var(--mat-sys-surface-variant) 4px,var(--mat-sys-surface) 4px,var(--mat-sys-surface) 8px);border:10px solid var(--mat-sys-surface-container-high);text-align:center}`],
})
export class SettingsPage {
  readonly sessions = sessions; readonly team = team; readonly plans = plans; readonly invoices = invoices; readonly teamColumns = ['member', 'role', 'active']; readonly invoiceColumns = ['id', 'date', 'amount'];
  constructor(private readonly dialog: MatDialog) {}
  confirmDelete() { const value = window.prompt('请输入 DELETE 确认删除账户'); if (value === 'DELETE') window.alert('账户删除请求已提交'); }
}

const componentList = Object.entries(coverage).map(([name, status]) => ({ name, status }));

@Component({
  selector: 'app-components',
  standalone: true,
  imports: BASE,
  template: `
    <div class="page"><div class="page-header"><div><p class="eyebrow">KITCHEN SINK</p><h1 style="margin:0">组件全集</h1><p class="muted">Angular Material 与 CDK 的可交互组件参考。</p></div><span class="chip">{{componentList.length}} 个组件</span></div>
      <mat-card class="component-index"><strong>快速跳转</strong><a mat-stroked-button *ngFor="let item of componentList" href="#component-{{item.name}}">{{item.name}}</a></mat-card>
      <div class="stack" style="margin-top:20px"><mat-card *ngFor="let item of componentList" class="component-card" id="component-{{item.name}}"><mat-card-header><mat-card-title>{{item.name}} <span class="chip" [class.negative]="item.status === 'missing'">{{item.status}}</span></mat-card-title><mat-card-subtitle>{{item.status === 'missing' ? 'Angular Material 无此组件' : '展示默认、禁用、交互状态与组合用法'}}</mat-card-subtitle></mat-card-header><mat-card-content><ng-container [ngSwitch]="item.name"><div *ngSwitchCase="'Typography'" class="stack"><h1>标题一级</h1><h2>标题二级</h2><p>正文与 <a href="#">链接</a>，以及 <code>inline code</code>。</p><blockquote>组件库默认排版保持清晰、克制与可读。</blockquote></div><div *ngSwitchCase="'Button'" class="demo-row"><button mat-button>Text</button><button mat-flat-button color="primary">Filled</button><button mat-stroked-button>Outlined</button><button mat-raised-button>Elevated</button><button mat-button disabled>Disabled</button><button mat-fab><mat-icon svgIcon="plus"></mat-icon></button><button mat-mini-fab><mat-icon svgIcon="edit"></mat-icon></button></div><div *ngSwitchCase="'Input'" class="grid grid-3"><mat-form-field appearance="fill"><mat-label>Fill</mat-label><input matInput placeholder="请输入"></mat-form-field><mat-form-field appearance="outline"><mat-label>Outline</mat-label><input matInput value="示例值"></mat-form-field><mat-form-field appearance="outline" color="warn"><mat-label>Error</mat-label><input matInput value="错误值" aria-invalid="true"><mat-error>字段格式错误</mat-error></mat-form-field></div><div *ngSwitchCase="'Checkbox'" class="demo-row"><mat-checkbox>默认</mat-checkbox><mat-checkbox checked>选中</mat-checkbox><mat-checkbox indeterminate>半选</mat-checkbox><mat-checkbox disabled>禁用</mat-checkbox></div><div *ngSwitchCase="'Progress'" class="stack"><mat-progress-bar mode="determinate" value="68"></mat-progress-bar><mat-progress-bar mode="indeterminate"></mat-progress-bar><mat-progress-spinner mode="determinate" value="72"></mat-progress-spinner></div><div *ngSwitchCase="'Tabs'"><mat-tab-group><mat-tab label="默认">默认标签页内容</mat-tab><mat-tab label="分析">分析内容</mat-tab><mat-tab label="设置">设置内容</mat-tab></mat-tab-group></div><div *ngSwitchCase="'Menu'"><button mat-flat-button [matMenuTriggerFor]="componentMenu">打开菜单</button><mat-menu #componentMenu="matMenu"><button mat-menu-item>编辑</button><button mat-menu-item>复制</button><button mat-menu-item>删除</button></mat-menu></div><div *ngSwitchCase="'Dialog'"><button mat-stroked-button (click)="dialog.open(dialogContent)">打开对话框</button><ng-template #dialogContent><div class="card-pad"><h2 mat-dialog-title>确认操作</h2><p mat-dialog-content>这是一个 Material Dialog 组合示例。</p><button mat-button mat-dialog-close>关闭</button></div></ng-template></div><div *ngSwitchCase="'Accordion'"><mat-accordion><mat-expansion-panel><mat-expansion-panel-header><mat-panel-title>展开面板</mat-panel-title></mat-expansion-panel-header><p>面板内容支持渐进披露。</p></mat-expansion-panel></mat-accordion></div><div *ngSwitchCase="'Table'" class="table-wrap"><table mat-table [dataSource]="recentOrders"><ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let row">{{row.id}}</td></ng-container><ng-container matColumnDef="customer"><th mat-header-cell *matHeaderCellDef>客户</th><td mat-cell *matCellDef="let row">{{row.customer}}</td></ng-container><tr mat-header-row *matHeaderRowDef="['id','customer']"></tr><tr mat-row *matRowDef="let row; columns:['id','customer']"></tr></table></div><div *ngSwitchCase="'Slider'"><mat-slider min="0" max="100"><input matSliderThumb value="45"></mat-slider></div><div *ngSwitchCase="'Switch'"><mat-slide-toggle checked>启用此功能</mat-slide-toggle></div><div *ngSwitchCase="'Segmented'"><mat-button-toggle-group value="one"><mat-button-toggle value="one">日</mat-button-toggle><mat-button-toggle value="two">周</mat-button-toggle><mat-button-toggle value="three">月</mat-button-toggle></mat-button-toggle-group></div><div *ngSwitchCase="'Card'"><mat-card appearance="outlined"><mat-card-content>Material Card 支持标题、内容与动作区域。</mat-card-content></mat-card></div><div *ngSwitchCase="'List'"><mat-list><mat-list-item *ngFor="let value of ['第一项','第二项','第三项']"><mat-icon matListItemIcon svgIcon="check"></mat-icon><span matListItemTitle>{{value}}</span></mat-list-item></mat-list></div><div *ngSwitchCase="'Alert'" class="notice">这是一个 composed Alert，使用 Card 与错误色语义组合。</div><div *ngSwitchCase="'Badge'" class="demo-row"><button mat-flat-button matBadge="8" matBadgeColor="accent">带徽章按钮</button><span class="chip">Tag</span></div><div *ngSwitchCase="'Missing'" class="muted">Angular Material 无此组件</div><div *ngSwitchDefault class="demo-row"><button mat-stroked-button>默认示例</button><button mat-button disabled>禁用状态</button><span class="muted">组合实现与 Angular Material 原生能力</span></div></ng-container></mat-card-content></mat-card></div>
      <mat-card style="margin-top:20px"><mat-card-header><mat-card-title>Angular Material / CDK 补充</mat-card-title></mat-card-header><mat-card-content class="demo-row"><span class="chip">mat-button-toggle</span><span class="chip">mat-chips</span><span class="chip">mat-grid-list</span><span class="chip">mat-bottom-sheet</span><span class="chip">mat-sort</span><span class="chip">mat-ripple</span><span class="chip">cdk drag-drop</span><span class="chip">cdk virtual-scroll</span><span class="chip">cdk clipboard</span><span class="chip">cdkTextareaAutosize</span><span class="chip">mat-expansion-panel</span><span class="chip">mat-tree</span><span class="chip">mat-badge</span><span class="chip">mat-icon</span><span class="chip">mat-toolbar</span></mat-card-content></mat-card>
    </div>
  `,
})
export class ComponentsPage {
  readonly componentList = componentList; readonly recentOrders = orders.slice(0, 3);
  constructor(public readonly dialog: MatDialog) {}
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: BASE,
  template: `
    <main><mat-toolbar><span class="brand-mark">A</span><span style="font-weight:700;margin-left:10px">Acme Console</span><span class="topbar-spacer"></span><nav class="demo-row"><a mat-button href="#features">特性</a><a mat-button href="#pricing">定价</a><a mat-button href="#faq">FAQ</a><a mat-flat-button color="primary" routerLink="/login" queryParamsHandling="preserve">开始使用</a></nav><button mat-icon-button [matMenuTriggerFor]="landingMenu"><mat-icon svgIcon="menu"></mat-icon></button></mat-toolbar><mat-menu #landingMenu="matMenu"><button mat-menu-item>特性</button><button mat-menu-item>定价</button><button mat-menu-item>常见问题</button></mat-menu>
      <section class="hero"><div class="hero-grid"><div><span class="chip">统一工作台 · 新一代协作</span><h1>{{landing.hero.title}}</h1><p style="font-size:20px;max-width:650px" class="muted">{{landing.hero.subtitle}}</p><div class="demo-row" style="margin-top:28px"><button mat-flat-button color="primary" routerLink="/login" queryParamsHandling="preserve">{{landing.hero.primary}}</button><button mat-stroked-button>{{landing.hero.secondary}}</button></div><p class="muted" style="margin-top:22px">◉ ◉ ◉ {{landing.hero.social}}</p></div><div class="hero-shot"></div></div></section>
      <section class="section"><div class="logo-cloud"><div *ngFor="let logo of ['NORTHWIND','CONTOSO','FABRIKAM','GLOBEX','INITECH','UMBRELLA']">{{logo}}</div></div></section>
      <section class="section" id="features"><p class="eyebrow">FEATURES</p><h2>让复杂工作变得简单</h2><div class="grid grid-3"><mat-card *ngFor="let feature of landing.features"><mat-card-content class="card-pad"><span class="feature-icon"><mat-icon svgIcon="zap"></mat-icon></span><h3>{{feature.title}}</h3><p class="muted">{{feature.desc}}</p></mat-card-content></mat-card></div></section>
      <section class="section"><div class="split" *ngFor="let feature of landing.features.slice(0,3); let i=index"><div class="split-shot"></div><div><span class="chip">0{{i+1}}</span><h2>{{feature.title}}</h2><p class="muted">{{feature.desc}} 从数据到行动，团队始终围绕同一份真实状态协作。</p><button mat-button color="primary">了解更多 →</button></div></div></section>
      <section class="section" style="background:var(--mat-sys-primary-container)"><div class="grid grid-4"><div *ngFor="let number of landing.numbers"><strong style="font-size:38px">{{number.value}}</strong><p class="muted">{{number.label}}</p></div></div></section>
      <section class="section" id="pricing"><div class="page-header"><div><p class="eyebrow">PRICING</p><h2>从免费开始，按需增长</h2></div><mat-slide-toggle>按年付费（省 20%）</mat-slide-toggle></div><div class="grid grid-3"><mat-card *ngFor="let plan of plans"><mat-card-content class="card-pad"><div class="spread"><h3>{{plan.name}}</h3><span *ngIf="plan.recommended" class="chip">推荐</span></div><div class="price">{{plan.price === null ? '定制' : plan.price === 0 ? '免费' : '¥'+plan.price}}</div><p *ngFor="let feature of plan.features" class="muted">✓ {{feature}}</p><button mat-stroked-button class="full">选择方案</button></mat-card-content></mat-card></div></section>
      <section class="section"><p class="eyebrow">CUSTOMERS</p><h2>他们正在用 Acme Console 前进</h2><div class="grid grid-3"><mat-card *ngFor="let quote of landing.testimonials"><mat-card-content class="card-pad"><p>“{{quote.quote}}”</p><div class="row"><span class="avatar">{{quote.name.slice(0,1)}}</span><span><b>{{quote.name}}</b><small class="muted" style="display:block">{{quote.company}}</small></span></div></mat-card-content></mat-card></div></section>
      <section class="section" id="faq"><p class="eyebrow">FAQ</p><h2>常见问题</h2><mat-accordion><mat-expansion-panel *ngFor="let item of landing.faq"><mat-expansion-panel-header><mat-panel-title>{{item.q}}</mat-panel-title></mat-expansion-panel-header><p>{{item.a}}</p></mat-expansion-panel></mat-accordion></section>
      <section class="section"><mat-card class="hero" style="border-radius:24px"><h2>准备好让团队更专注了吗？</h2><p>今天就开始，把分散的工作重新放回一个清晰的控制台。</p><button mat-flat-button color="primary" routerLink="/login" queryParamsHandling="preserve">免费开始</button></mat-card></section>
      <footer class="section" style="padding-top:32px;padding-bottom:32px;border-top:1px solid var(--mat-sys-outline-variant)"><div class="grid grid-4"><div><b>Acme Console</b><p class="muted">让团队的工作清晰可见。</p></div><div><b>产品</b><p class="muted">特性<br>定价<br>更新日志</p></div><div><b>资源</b><p class="muted">文档<br>帮助中心<br>API</p></div><div><b>公司</b><p class="muted">关于我们<br>联系我们<br>隐私</p></div></div><p class="muted">© 2026 Acme Console · <mat-form-field appearance="outline"><mat-label>语言</mat-label><mat-select value="zh"><mat-option value="zh">中文</mat-option><mat-option value="en">English</mat-option></mat-select></mat-form-field></p></footer>
    </main>
  `,
})
export class LandingPage {
  readonly landing = landing; readonly plans = plans;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: BASE,
  template: `
    <div class="chat-layout"><aside class="chat-list"><div class="spread"><h2>AI 助手</h2><button mat-mini-fab color="primary"><mat-icon svgIcon="plus"></mat-icon></button></div><mat-form-field appearance="outline" class="full"><mat-label>搜索会话</mat-label><input matInput placeholder="输入关键词"></mat-form-field><button mat-stroked-button class="full">＋ 新建会话</button><mat-nav-list><a mat-list-item *ngFor="let item of chat.conversations"><mat-icon matListItemIcon svgIcon="message-square"></mat-icon><span matListItemTitle>{{item.title}}</span><span matListItemLine>{{item.time}} <span *ngIf="item.unread" class="chip">{{item.unread}}</span></span></a></mat-nav-list></aside><section class="chat-main"><mat-toolbar><button mat-icon-button><mat-icon svgIcon="menu"></mat-icon></button><span>9 月收入分析</span><span class="topbar-spacer"></span><mat-form-field appearance="outline"><mat-label>模型</mat-label><mat-select value="gpt-5"><mat-option *ngFor="let model of chat.models" [value]="model">{{model}}</mat-option></mat-select></mat-form-field></mat-toolbar><div class="messages" *ngIf="empty; else messageList"><div style="text-align:center;padding-top:18vh"><mat-icon svgIcon="sparkles" style="width:54px;height:54px"></mat-icon><h1>今天想了解什么？</h1><div class="grid grid-2"><button mat-stroked-button *ngFor="let suggestion of chat.suggestions" (click)="draft=suggestion">{{suggestion}}</button></div></div></div><ng-template #messageList><div class="messages"><div *ngFor="let message of chat.messages" class="bubble" [class.user]="message.role === 'user'" [class.assistant]="message.role === 'assistant'"><div [innerHTML]="render(message.content)"></div><div *ngIf="message.sources" class="demo-row" style="margin-top:10px"><span class="chip" *ngFor="let source of message.sources">{{source}}</span></div><mat-expansion-panel *ngIf="message.tool" style="margin-top:12px"><mat-expansion-panel-header><mat-panel-title>工具调用 · {{message.tool.name}}</mat-panel-title></mat-expansion-panel-header><code>{{message.tool.args | json}}</code></mat-expansion-panel><span *ngIf="message.streaming" class="muted">● ● ● 正在输入</span></div></div></ng-template><div class="composer"><mat-form-field appearance="outline" class="full"><mat-label>输入消息</mat-label><textarea matInput [(ngModel)]="draft" rows="2" placeholder="向 AI 助手提问…"></textarea><button mat-icon-button matPrefix><mat-icon svgIcon="paperclip"></mat-icon></button><button mat-fab color="primary" matSuffix><mat-icon svgIcon="send"></mat-icon></button><mat-hint>{{draft.length}} / 4000 · Enter 发送，Shift + Enter 换行</mat-hint></mat-form-field><div class="demo-row"><button mat-stroked-button *ngFor="let suggestion of chat.suggestions" (click)="draft=suggestion">{{suggestion}}</button></div></div></section></div>
  `,
})
export class ChatPage {
  readonly chat = chat; draft = ''; empty = new URLSearchParams(window.location.search).get('state') === 'empty';
  render(content: string) { return String(marked.parse(content)); }
}
