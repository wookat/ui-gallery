import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import activity from '@ui-gallery/spec/mock/activity.json';
import orders from '@ui-gallery/spec/mock/orders.json';
import series from '@ui-gallery/spec/mock/series.json';
import stats from '@ui-gallery/spec/mock/stats.json';
import tasks from '@ui-gallery/spec/mock/tasks.json';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import type * as echarts from 'echarts';
import { EchartsDirective } from '../../core/echarts.directive';
import { IconComponent } from '../../core/icon.component';
import { Viewport } from '../../core/viewport';

type Order = (typeof orders)[number];

@Component({
  selector: 'ui-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzAvatarModule,
    NzBadgeModule,
    NzButtonModule,
    NzCardModule,
    NzDropdownModule,
    NzIconModule,
    NzMenuModule,
    NzProgressModule,
    NzSkeletonModule,
    NzStatisticModule,
    NzSwitchModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzTimelineModule,
    EchartsDirective,
    IconComponent,
  ],
  template: `
    <div class="dashboard-page">
      <header class="page-heading">
        <div><h1 nz-typography>仪表盘</h1><p nz-typography nzType="secondary">Acme Console</p></div>
        <button nz-button nzType="primary"><ui-icon name="plus" />新建项目</button>
      </header>
      <div class="loading-toggle"><span>显示加载态</span><nz-switch [(ngModel)]="loadingState" /></div>
      @if (loadingState) {
        <div class="stats-grid">
          @for (item of stats; track item.key) { <nz-card><nz-skeleton [nzActive]="true" /></nz-card> }
        </div>
        <nz-card><nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 8 }" /></nz-card>
      } @else {
        <div class="stats-grid">
          @for (item of stats; track item.key) {
            <nz-card>
              <nz-statistic [nzTitle]="item.label" [nzValue]="formatValue(item)" />
              <nz-tag [nzColor]="item.delta >= 0 ? 'success' : 'error'">
                {{ item.delta >= 0 ? '↑' : '↓' }} {{ absoluteDelta(item.delta) }}%
              </nz-tag>
              <div class="sparkline" [uiEcharts]="sparkOption(item.trend)"></div>
            </nz-card>
          }
        </div>
        <nz-tabs nzType="line" (nzSelectedIndexChange)="period.set($event)">
          <nz-tab nzTitle="日" />
          <nz-tab nzTitle="周" />
          <nz-tab nzTitle="月" />
        </nz-tabs>
        <div class="chart-grid">
          <nz-card nzTitle="收入趋势" class="wide-card">
            <div class="chart" [uiEcharts]="revenueOption()"></div>
          </nz-card>
          <nz-card nzTitle="订单分析">
            <div class="chart" [uiEcharts]="ordersOption()"></div>
          </nz-card>
        </div>
        <div class="dashboard-grid">
          <nz-card nzTitle="最近订单" style="grid-column: span 8">
            <nz-table #ordersTable [nzData]="recentOrders" [nzFrontPagination]="false" [nzShowPagination]="false" [nzScroll]="viewport.isMobile() ? {} : { x: '640px' }">
              <thead><tr><th>订单</th><th>客户</th><th>状态</th><th nzAlign="right">金额</th><th class="col-actions">操作</th></tr></thead>
              <tbody>
                @for (order of ordersTable.data; track order.id) {
                  <tr>
                    <td>{{ order.id }}</td>
                    <td><span class="customer"><nz-avatar nzSize="small" [nzText]="order.customer.slice(0, 1)" />{{ order.customer }}</span></td>
                    <td><nz-tag [nzColor]="statusColor(order.status)">{{ statusLabel(order.status) }}</nz-tag></td>
                    <td nzAlign="right">¥{{ order.amount | number: '1.2-2' }}</td>
                    <td class="col-actions"><a nz-dropdown [nzDropdownMenu]="rowMenu">更多 <ui-icon name="chevron-down" /></a></td>
                  </tr>
                }
              </tbody>
            </nz-table>
          </nz-card>
          <nz-dropdown-menu #rowMenu="nzDropdownMenu">
            <ul nz-menu><li nz-menu-item>编辑</li><li nz-menu-item>删除</li></ul>
          </nz-dropdown-menu>
          <nz-card nzTitle="团队动态" style="grid-column: span 4">
            <nz-timeline>
              @for (item of activity; track item.user + item.time) {
                <nz-timeline-item><strong>{{ item.user }}</strong> {{ item.action }}<small>{{ item.time }}</small></nz-timeline-item>
              }
            </nz-timeline>
          </nz-card>
          <nz-card nzTitle="任务进度" style="grid-column: span 12">
            @for (task of tasks; track task.title) {
              <div class="task-row"><span>{{ task.title }}</span><nz-progress [nzPercent]="task.progress" nzSize="small" /></div>
            }
          </nz-card>
        </div>
      }
    </div>
  `,
  styles: `
    .dashboard-page { display: grid; gap: 16px; }
    .page-heading { display: flex; align-items: end; justify-content: space-between; gap: 16px; }
    .page-heading h1 { margin: 0; }
    .page-heading p { margin: 4px 0 0; }
    .loading-toggle { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
    .stats-grid { display: grid; gap: 16px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .stats-grid nz-card { min-width: 0; }
    .sparkline { margin-top: 8px; }
    .chart-grid { display: grid; gap: 16px; grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); }
    .customer { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
    @media (max-width: 767px) { .customer { white-space: normal; } .col-actions { display: none; } .ant-table-cell { padding: 12px 6px !important; word-break: break-word; } }
    .task-row { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
    .task-row span { width: 150px; }
    .task-row nz-progress { flex: 1; }
    nz-timeline-item small { display: block; color: #8c8c8c; }
    @media (max-width: 991px) {
      .stats-grid, .chart-grid { grid-template-columns: 1fr 1fr; }
      .wide-card { grid-column: span 2; }
      .dashboard-grid > * { grid-column: span 12 !important; }
    }
    @media (max-width: 575px) {
      .stats-grid, .chart-grid { grid-template-columns: 1fr; }
      .wide-card { grid-column: span 1; }
      .page-heading { align-items: flex-start; flex-direction: column; }
    }
  `,
})
export class DashboardPage {
  readonly stats = stats;
  readonly activity = activity;
  readonly tasks = tasks;
  readonly recentOrders = orders.slice(0, 5);
  readonly viewport = inject(Viewport);
  readonly period = signal(2);
  loadingState = false;
  readonly periodSeries = computed(() => {
    const end = this.period() === 0 ? 3 : this.period() === 1 ? 5 : series.months.length;
    return {
      months: series.months.slice(-end),
      revenue: series.revenue.slice(-end),
      orders: series.orders.slice(-end),
    };
  });

  constructor(route: ActivatedRoute) {
    route.queryParamMap.subscribe((params) => {
      this.loadingState = params.get('state') === 'loading';
    });
  }

  formatValue(item: (typeof stats)[number]): string {
    return item.unit === 'CNY'
      ? `¥${item.value.toLocaleString()}`
      : `${item.value.toLocaleString()}${item.unit ?? ''}`;
  }

  absoluteDelta(value: number): string {
    return Math.abs(value).toFixed(1);
  }

  statusLabel(status: Order['status']): string {
    const labels: Record<string, string> = { paid: '已支付', pending: '处理中', refunded: '已退款', failed: '失败', shipped: '已发货' };
    return labels[status] ?? status;
  }

  statusColor(status: Order['status']): string {
    const colors: Record<string, string> = {
      paid: 'success',
      pending: 'processing',
      refunded: 'warning',
      failed: 'error',
      shipped: 'blue',
    };
    return colors[status] ?? 'default';
  }

  sparkOption(values: readonly number[]): echarts.EChartsOption {
    return {
      animation: false,
      grid: { top: 4, right: 0, bottom: 4, left: 0 },
      xAxis: { type: 'category', show: false, data: [...values].map((_, index) => index) },
      yAxis: { type: 'value', show: false },
      series: [{ type: 'line', data: [...values], smooth: true, symbol: 'none', lineStyle: { width: 2, color: '#1677ff' }, areaStyle: { opacity: 0.12, color: '#1677ff' } }],
    };
  }

  revenueOption(): echarts.EChartsOption {
    const data = this.periodSeries();
    return {
      tooltip: { trigger: 'axis' },
      legend: { data: ['收入', '订单'] },
      grid: { left: 42, right: 18, top: 32, bottom: 30 },
      xAxis: { type: 'category', data: data.months },
      yAxis: [{ type: 'value' }, { type: 'value' }],
      series: [
        { name: '收入', type: 'line', smooth: true, data: data.revenue, areaStyle: { opacity: 0.12 } },
        { name: '订单', type: 'line', smooth: true, yAxisIndex: 1, data: data.orders },
      ],
    };
  }

  ordersOption(): echarts.EChartsOption {
    const data = this.periodSeries();
    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      grid: { left: 28, right: 12, top: 16, bottom: 34 },
      xAxis: { type: 'category', data: data.months },
      yAxis: { type: 'value' },
      series: [
        { name: '订单', type: 'bar', data: data.orders },
        { name: '渠道', type: 'pie', radius: ['40%', '65%'], center: ['70%', '38%'], data: series.byChannel },
      ],
    };
  }
}
