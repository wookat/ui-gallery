import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import series from '@ui-gallery/spec/mock/series.json';
import stats from '@ui-gallery/spec/mock/stats.json';
import activity from '@ui-gallery/spec/mock/activity.json';
import orders from '@ui-gallery/spec/mock/orders.json';
import tasks from '@ui-gallery/spec/mock/tasks.json';
import { SHARED_IMPORTS, statusTone } from '../shared/material';

Chart.register(...registerables);

type DashboardChart = Chart<'line' | 'bar' | 'doughnut'>;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <main class="page dashboard-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">OVERVIEW</p>
          <h1>欢迎回来，林晓</h1>
          <p class="muted">这是你的业务控制台，今天也保持清晰可见。</p>
        </div>
        <mat-button-toggle-group value="month" aria-label="时间范围">
          <mat-button-toggle value="day">日</mat-button-toggle>
          <mat-button-toggle value="week">周</mat-button-toggle>
          <mat-button-toggle value="month">月</mat-button-toggle>
        </mat-button-toggle-group>
      </header>

      @if (loading) {
        <section class="stats-grid" aria-label="统计数据加载中">
          @for (item of [1, 2, 3, 4]; track item) {
            <mat-card class="skeleton-card"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-value"></div><div class="skeleton skeleton-line"></div></mat-card>
          }
        </section>
        <section class="dashboard-chart-grid">
          @for (item of [1, 2, 3]; track item) {
            <mat-card class="skeleton-chart"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-chart"></div></mat-card>
          }
        </section>
      } @else {
        <section class="stats-grid">
          @for (stat of stats; track stat.key) {
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="spread"><span class="muted">{{ stat.label }}</span><mat-icon [svgIcon]="stat.delta >= 0 ? 'trending-up' : 'trending-down'"></mat-icon></div>
                <div class="stat-value">{{ formatValue(stat.value, stat.unit) }}</div>
                <div class="spread"><span class="chip" [class.negative]="stat.delta < 0">{{ stat.delta >= 0 ? '+' : '' }}{{ stat.delta }}%</span><svg class="sparkline" viewBox="0 0 100 36" role="img" aria-label="趋势"><polyline [attr.points]="sparkline(stat.trend)"></polyline></svg></div>
              </mat-card-content>
            </mat-card>
          }
        </section>

        <section class="dashboard-chart-grid">
          <mat-card class="chart-card chart-wide">
            <mat-card-header><mat-card-title>收入趋势</mat-card-title><mat-card-subtitle>近 7 个月收入（千元）</mat-card-subtitle></mat-card-header>
            <mat-card-content><div class="chart-canvas"><canvas #revenueCanvas aria-label="收入折线图"></canvas></div></mat-card-content>
          </mat-card>
          <mat-card class="chart-card">
            <mat-card-header><mat-card-title>订单趋势</mat-card-title><mat-card-subtitle>月度订单量</mat-card-subtitle></mat-card-header>
            <mat-card-content><div class="chart-canvas"><canvas #ordersCanvas aria-label="订单柱状图"></canvas></div></mat-card-content>
          </mat-card>
          <mat-card class="chart-card">
            <mat-card-header><mat-card-title>渠道分布</mat-card-title><mat-card-subtitle>订单来源占比</mat-card-subtitle></mat-card-header>
            <mat-card-content><div class="chart-canvas donut-canvas"><canvas #channelCanvas aria-label="渠道环形图"></canvas></div></mat-card-content>
          </mat-card>
        </section>

        <section class="dashboard-lower-grid">
          <mat-card>
            <mat-card-header><mat-card-title>最近订单</mat-card-title><button mat-button color="primary" routerLink="/orders" queryParamsHandling="preserve">查看全部</button></mat-card-header>
            <mat-card-content class="table-wrap">
              <table mat-table [dataSource]="recentOrders">
                <ng-container matColumnDef="order"><th mat-header-cell *matHeaderCellDef>订单</th><td mat-cell *matCellDef="let order"><div class="row"><span class="avatar">{{ order.customer.slice(0, 1) }}</span><span><b>{{ order.id }}</b><small class="muted">{{ order.customer }}</small></span></div></td></ng-container>
                <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>金额</th><td mat-cell *matCellDef="let order">¥{{ order.amount.toLocaleString() }}</td></ng-container>
                <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>状态</th><td mat-cell *matCellDef="let order"><span class="status" [class]="statusTone(order.status)">{{ statusLabel(order.status) }}</span></td></ng-container>
                <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let order"><button mat-icon-button [matMenuTriggerFor]="orderMenu" aria-label="订单操作"><mat-icon svgIcon="more-vertical"></mat-icon></button><mat-menu #orderMenu="matMenu"><button mat-menu-item><mat-icon svgIcon="edit"></mat-icon>编辑 {{ order.id }}</button><button mat-menu-item><mat-icon svgIcon="download"></mat-icon>导出</button></mat-menu></td></ng-container>
                <tr mat-header-row *matHeaderRowDef="orderColumns"></tr><tr mat-row *matRowDef="let row; columns: orderColumns"></tr>
              </table>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-header><mat-card-title>团队动态</mat-card-title></mat-card-header>
            <mat-card-content class="timeline">
              @for (item of activity; track item.user) {
                <div class="timeline-item"><span class="avatar">{{ item.user.slice(0, 1) }}</span><div><b>{{ item.user }}</b><span class="muted">{{ item.action }}</span><small class="muted">{{ item.time }}</small></div></div>
              }
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-header><mat-card-title>任务进度</mat-card-title><button mat-icon-button matTooltip="查看所有任务"><mat-icon svgIcon="more-vertical"></mat-icon></button></mat-card-header>
            <mat-card-content class="stack">
              @for (task of tasks; track task.title) {
                <div><div class="spread"><span>{{ task.title }}</span><small>{{ task.progress }}%</small></div><mat-progress-bar mode="determinate" [value]="task.progress"></mat-progress-bar></div>
              }
            </mat-card-content>
          </mat-card>
        </section>
      }
    </main>
  `,
})
export class DashboardPage implements AfterViewInit, OnDestroy {
  readonly statusTone = statusTone;
  @ViewChild('revenueCanvas') revenueCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('ordersCanvas') ordersCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('channelCanvas') channelCanvas?: ElementRef<HTMLCanvasElement>;

  readonly stats = stats;
  readonly activity = activity;
  readonly recentOrders = orders.slice(0, 5);
  readonly tasks = tasks;
  readonly orderColumns = ['order', 'amount', 'status', 'actions'];
  readonly loading = new URLSearchParams(window.location.search).get('state') === 'loading';
  private readonly charts: DashboardChart[] = [];

  ngAfterViewInit(): void {
    if (!this.loading) {
      queueMicrotask(() => this.createCharts());
    }
  }

  ngOnDestroy(): void {
    this.charts.forEach((chart) => chart.destroy());
  }

  formatValue(value: number, unit?: string): string {
    return unit === 'CNY' ? `¥${value.toLocaleString()}` : `${value.toLocaleString()}${unit ?? ''}`;
  }

  sparkline(values: readonly number[]): string {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    return values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 100},${32 - ((value - min) / range) * 28}`).join(' ');
  }

  statusLabel(status: string): string {
    return { paid: '已支付', pending: '待处理', refunded: '已退款', failed: '失败', shipped: '已发货' }[status] ?? status;
  }

  private createCharts(): void {
    const styles = getComputedStyle(document.documentElement);
    const primary = this.readColorToken(styles, '--mat-sys-primary', '#005cbb');
    const secondary = this.readColorToken(styles, '--mat-sys-secondary', '#536174');
    const tertiary = this.readColorToken(styles, '--mat-sys-tertiary', '#705575');
    const outlineVariant = this.readColorToken(styles, '--mat-sys-outline-variant', '#c2c6d0');
    const surface = this.readColorToken(styles, '--mat-sys-on-surface-variant', '#45464f');
    const primaryFill = this.withAlpha(primary, 0.2);
    const gridColor = this.withAlpha(surface, 0.18);
    const common = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };

    if (this.revenueCanvas) {
      this.charts.push(new Chart(this.revenueCanvas.nativeElement, {
        type: 'line',
        data: { labels: series.months, datasets: [{ data: series.revenue, borderColor: primary, backgroundColor: primaryFill, borderWidth: 2, pointRadius: 3, fill: true, tension: 0.35 }] },
        options: { ...common, scales: { y: { grid: { color: gridColor } }, x: { grid: { display: false } } } },
      }) as DashboardChart);
    }
    if (this.ordersCanvas) {
      this.charts.push(new Chart(this.ordersCanvas.nativeElement, {
        type: 'bar',
        data: { labels: series.months, datasets: [{ data: series.orders, backgroundColor: primary, borderRadius: 6 }] },
        options: { ...common, scales: { y: { grid: { color: gridColor } }, x: { grid: { display: false } } } },
      }) as DashboardChart);
    }
    if (this.channelCanvas) {
      this.charts.push(new Chart(this.channelCanvas.nativeElement, {
        type: 'doughnut',
        data: { labels: series.byChannel.map((item) => item.name), datasets: [{ data: series.byChannel.map((item) => item.value), backgroundColor: [primary, secondary, tertiary, outlineVariant], borderWidth: 0 }] },
        options: { ...common, cutout: '68%' },
      }) as DashboardChart);
    }
  }

  private withAlpha(color: string, alpha: number): string {
    const rgb = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (rgb) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`;
    const hex = color.replace('#', '');
    if (/^[\da-f]{6}$/i.test(hex)) {
      return `rgba(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}, ${alpha})`;
    }
    return color;
  }

  private readColorToken(styles: CSSStyleDeclaration, name: string, fallback: string): string {
    if (!styles.getPropertyValue(name).trim()) return fallback;
    const probe = document.createElement('span');
    probe.style.color = `var(${name})`;
    document.body.appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    return resolved && resolved !== 'rgba(0, 0, 0, 0)' ? resolved : fallback;
  }
}
