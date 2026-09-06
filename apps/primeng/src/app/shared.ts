import { Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';

export type Severity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

export const orderStatus: Record<string, { label: string; severity: Severity }> = {
  paid: { label: '已支付', severity: 'success' },
  pending: { label: '待处理', severity: 'warn' },
  shipped: { label: '已发货', severity: 'info' },
  refunded: { label: '已退款', severity: 'secondary' },
  failed: { label: '失败', severity: 'danger' },
  due: { label: '待付款', severity: 'warn' },
};

export const channelLabel: Record<string, string> = { web: 'Web', ios: 'iOS', android: 'Android', api: 'API' };

export function money(value: number, currency = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}

@Component({
  selector: 'app-status-tag',
  imports: [Tag],
  template: `<p-tag [value]="meta().label" [severity]="meta().severity" />`,
})
export class StatusTag {
  readonly value = input.required<string>();
  meta() {
    return orderStatus[this.value()] ?? { label: this.value(), severity: 'secondary' as Severity };
  }
}

@Component({
  selector: 'app-page-header',
  template: `
    <div class="header">
      <div class="col" style="gap:0.25rem">
        <h1 class="page-title">{{ title() }}</h1>
        @if (description()) { <p class="muted text-sm">{{ description() }}</p> }
      </div>
      <div class="row wrap"><ng-content /></div>
    </div>
  `,
  styles: `
    .header { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 0.75rem; }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input<string>();
}
