import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { UIChart } from 'primeng/chart';
import { ProgressBar } from 'primeng/progressbar';
import { ScrollPanel } from 'primeng/scrollpanel';
import { SelectButton } from 'primeng/selectbutton';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Timeline } from 'primeng/timeline';
import { FormsModule } from '@angular/forms';
import stats from '@ui-gallery/spec/mock/stats.json';
import series from '@ui-gallery/spec/mock/series.json';
import orders from '@ui-gallery/spec/mock/orders.json';
import activity from '@ui-gallery/spec/mock/activity.json';
import tasks from '@ui-gallery/spec/mock/tasks.json';
import team from '@ui-gallery/spec/mock/team.json';
import { Icon } from '../icons';
import { SettingsService } from '../settings.service';
import { PageHeader, StatusTag, money } from '../shared';

interface Stat { key: string; label: string; value: number; unit?: string; delta: number; trend: number[] }

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule, Avatar, Button, Card, UIChart, ProgressBar, ScrollPanel, SelectButton, Skeleton, TableModule, Tag, Timeline, Icon, PageHeader, StatusTag],
  template: `
    <app-page-header title="仪表盘" [description]="'欢迎回来，' + me.name + '。这里是今天的业务概况。'">
      <p-selectbutton [options]="ranges" [(ngModel)]="range" optionLabel="label" optionValue="value" [allowEmpty]="false" size="small" />
      <p-button label="新建项目" routerLink="/form" queryParamsHandling="preserve"><app-icon name="plus" /></p-button>
    </app-page-header>

    @if (loading()) {
      <div class="grid grid-4">
        @for (s of stats; track s.key) {
          <p-card><p-skeleton width="40%" height="0.9rem" styleClass="mb-2" /><p-skeleton width="60%" height="1.75rem" styleClass="mb-3" /><p-skeleton height="3rem" /></p-card>
        }
      </div>
      <div class="grid charts">
        <p-card><p-skeleton width="30%" height="1rem" styleClass="mb-3" /><p-skeleton height="16rem" /></p-card>
        <p-card><p-skeleton width="30%" height="1rem" styleClass="mb-3" /><p-skeleton height="16rem" borderRadius="999px" /></p-card>
      </div>
    } @else {
      <div class="grid grid-4">
        @for (s of stats; track s.key) {
          <p-card>
            <div class="row between text-sm muted"><span>{{ s.label }}</span>
              <p-tag [value]="(s.delta > 0 ? '+' : '') + s.delta + '%'" [severity]="s.delta > 0 ? 'success' : 'danger'" [rounded]="true" />
            </div>
            <div class="stat-value">{{ format(s) }}</div>
            <div class="spark"><p-chart type="line" [data]="spark(s)" [options]="sparkOptions" height="3rem" width="100%" /></div>
          </p-card>
        }
      </div>

      <div class="grid charts">
        <p-card header="收入趋势" subheader="过去 7 个月的收入与订单">
          <p-chart type="line" [data]="lineData()" [options]="lineOptions()" height="18rem" width="100%" />
        </p-card>
        <p-card header="渠道占比" subheader="订单来源分布">
          <p-chart type="doughnut" [data]="donutData()" [options]="donutOptions()" height="18rem" width="100%" />
        </p-card>
      </div>
    }

    <div class="grid grid-2">
      <p-card header="最近订单" subheader="最新的业务交易">
        <p-table [value]="recent" [tableStyle]="{ 'min-width': '28rem' }" styleClass="stack-mobile" size="small">
          <ng-template #header><tr><th>订单</th><th>客户</th><th>状态</th><th class="right">金额</th></tr></ng-template>
          <ng-template #body let-o>
            <tr><td data-label="订单" class="font-medium">{{ o.id }}</td><td data-label="客户">{{ o.customer }}</td><td data-label="状态"><app-status-tag [value]="o.status" /></td><td data-label="金额" class="right">{{ money(o.amount) }}</td></tr>
          </ng-template>
        </p-table>
      </p-card>
      <p-card header="活动动态" subheader="团队最近发生的事情">
        <p-scrollpanel [style]="{ height: '16rem' }">
          <p-timeline [value]="activity" styleClass="compact">
            <ng-template #marker let-e>
              <p-avatar [label]="e.user.slice(0, 1)" shape="circle" size="normal" />
            </ng-template>
            <ng-template #content let-e>
              <p class="text-sm"><span class="font-medium">{{ e.user }}</span> {{ e.action }}</p>
              <p class="text-xs muted">{{ e.time }}</p>
            </ng-template>
          </p-timeline>
        </p-scrollpanel>
      </p-card>
    </div>

    <p-card header="任务进度" subheader="本周团队执行情况">
      <div class="grid grid-2">
        @for (t of tasks; track t.title) {
          <div class="col">
            <div class="row between text-sm"><span>{{ t.title }}</span><span class="muted">{{ t.owner }} · {{ t.progress }}%</span></div>
            <p-progressbar [value]="t.progress" [showValue]="false" [style]="{ height: '0.5rem' }" />
          </div>
        }
      </div>
    </p-card>
  `,
  styles: `
    .stat-value { font-size: 1.5rem; font-weight: 600; margin: 0.25rem 0 0.5rem; }
    .spark { margin-top: 0.25rem; border-radius: 0.375rem; overflow: hidden; }
    .charts { grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr); }
    :host ::ng-deep .compact .p-timeline-event-opposite { display: none; }
    :host ::ng-deep .compact .p-timeline-event-content { padding-bottom: 1rem; }
    :host ::ng-deep .mb-2 { margin-bottom: 0.5rem; display: block; }
    :host ::ng-deep .mb-3 { margin-bottom: 0.75rem; display: block; }
    @media (max-width: 1023px) { .charts { grid-template-columns: minmax(0, 1fr); } }
  `,
})
export class DashboardPage {
  private readonly settings = inject(SettingsService);
  readonly me = team[0];
  readonly stats = stats as Stat[];
  readonly recent = orders.slice(0, 5);
  readonly activity = activity;
  readonly tasks = tasks.slice(0, 6);
  readonly money = money;
  readonly ranges = [
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
  ];
  range = 'week';
  readonly loading = signal(new URLSearchParams(location.search).get('state') === 'loading');

  private readonly css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  private readonly palette = computed(() => {
    void this.settings.dark();
    return {
      primary: this.css('--p-primary-color'),
      secondary: this.css('--p-surface-400'),
      text: this.css('--p-text-muted-color'),
      grid: this.css('--p-content-border-color'),
      colors: ['--p-primary-500', '--p-primary-300', '--p-surface-400', '--p-surface-600'].map(this.css),
    };
  });

  readonly sparkOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    elements: { point: { radius: 0 }, line: { borderWidth: 2, tension: 0.4 } },
  };

  spark(s: Stat) {
    return {
      labels: s.trend.map((_, i) => i),
      datasets: [{ data: s.trend, borderColor: this.palette().primary, fill: true, backgroundColor: this.palette().primary + '22' }],
    };
  }

  readonly lineData = computed(() => ({
    labels: series.months,
    datasets: [
      { label: '收入 (k)', data: series.revenue, borderColor: this.palette().primary, backgroundColor: this.palette().primary + '33', fill: true, tension: 0.4 },
      { label: '订单', data: series.orders.map((v) => v / 10), borderColor: this.palette().secondary, backgroundColor: 'transparent', tension: 0.4 },
    ],
  }));
  readonly lineOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { labels: { color: this.palette().text } } },
    scales: {
      x: { ticks: { color: this.palette().text }, grid: { display: false } },
      y: { ticks: { color: this.palette().text }, grid: { color: this.palette().grid } },
    },
  }));
  readonly donutData = computed(() => ({
    labels: series.byChannel.map((c) => c.name),
    datasets: [{ data: series.byChannel.map((c) => c.value), backgroundColor: this.palette().colors, borderWidth: 0 }],
  }));
  readonly donutOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutout: '65%',
    plugins: { legend: { position: 'bottom', labels: { color: this.palette().text } } },
  }));

  format(s: Stat) {
    if (s.unit === 'CNY') return money(s.value);
    return `${s.value.toLocaleString('zh-CN')}${s.unit ?? ''}`;
  }
}
