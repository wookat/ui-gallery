import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import orders from '@ui-gallery/spec/mock/orders.json';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { IconComponent } from '../../core/icon.component';

type Order = (typeof orders)[number] & { checked?: boolean };
type PageState = 'normal' | 'loading' | 'empty' | 'error';

@Component({
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzAlertModule, NzAvatarModule, NzButtonModule, NzCardModule, NzCheckboxModule,
    NzDatePickerModule, NzDescriptionsModule, NzDrawerModule, NzDropdownModule, NzEmptyModule,
    NzInputModule, NzModalModule, NzPaginationModule, NzPopoverModule, NzRadioModule, NzSelectModule,
    NzSkeletonModule, NzSpaceModule, NzTableModule, NzTabsModule, NzTagModule, NzTypographyModule, IconComponent,
  ],
  template: `
    <section class="orders-page">
      <header class="page-heading">
        <div><h1 nz-typography>订单</h1><p nz-typography nzType="secondary">订单、客户与支付状态</p></div>
        <nz-radio-group [(ngModel)]="state" nzButtonStyle="solid">
          @for (option of stateOptions; track option.value) { <label nz-radio-button [nzValue]="option.value">{{ option.label }}</label> }
        </nz-radio-group>
      </header>
      @if (state === 'loading') {
        <nz-card><nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 8 }" /></nz-card>
      } @else if (state === 'empty') {
        <nz-card><nz-empty nzNotFoundContent="暂无订单"><button nz-button nzType="primary">新建订单</button></nz-empty></nz-card>
      } @else if (state === 'error') {
        <nz-alert nzType="error" nzShowIcon nzMessage="订单加载失败">
          <ng-template #nzAlertAction><button nz-button nzType="primary" nzSize="small" (click)="state = 'normal'">重试</button></ng-template>
        </nz-alert>
      } @else {
        <nz-space nzWrap class="toolbar">
          <nz-input-group *nzSpaceItem nzPrefixIcon="search" class="search"><input nz-input [(ngModel)]="query" placeholder="搜索订单、客户或邮箱" /></nz-input-group>
          <nz-select *nzSpaceItem [(ngModel)]="status" nzAllowClear nzPlaceHolder="状态" class="filter">
            <nz-option nzValue="paid" nzLabel="已支付" /><nz-option nzValue="pending" nzLabel="处理中" /><nz-option nzValue="refunded" nzLabel="已退款" /><nz-option nzValue="failed" nzLabel="失败" /><nz-option nzValue="shipped" nzLabel="已发货" />
          </nz-select>
          <nz-range-picker *nzSpaceItem [(ngModel)]="dateRange" nzPlaceHolder="日期范围" />
          <nz-select *nzSpaceItem nzMode="multiple" [(ngModel)]="channels" nzPlaceHolder="渠道" class="filter">
            <nz-option nzValue="web" nzLabel="Web" /><nz-option nzValue="ios" nzLabel="iOS" /><nz-option nzValue="android" nzLabel="Android" /><nz-option nzValue="api" nzLabel="API" />
          </nz-select>
          <button *nzSpaceItem nz-button (click)="exportRows()"><ui-icon name="download" />导出</button>
          <button *nzSpaceItem nz-button nz-popover [nzPopoverContent]="columnsTpl"><ui-icon name="sliders" />列显示</button>
        </nz-space>
        <ng-template #columnsTpl>@for (column of columns; track column.key) { <label nz-checkbox [(ngModel)]="column.visible">{{ column.label }}</label><br /> }</ng-template>
        <nz-card class="table-card">
          <nz-table #orderTable nzShowSorterTooltip [nzData]="pagedRows()" [nzFrontPagination]="false" [nzShowPagination]="false" [nzScroll]="{ x: '980px' }">
            <thead><tr>
              <th nzWidth="48px" [nzChecked]="allChecked" [nzIndeterminate]="indeterminate" (nzCheckedChange)="checkAll($event)"></th>
              @if (columnVisible('id')) { <th nzShowSort [nzSortFn]="sortBy('id')">订单</th> }
              @if (columnVisible('customer')) { <th nzShowSort [nzSortFn]="sortBy('customer')">客户</th> }
              @if (columnVisible('product')) { <th>产品</th> } @if (columnVisible('status')) { <th>状态</th> }
              @if (columnVisible('amount')) { <th nzAlign="right" nzShowSort [nzSortFn]="sortBy('amount')">金额</th> }
              @if (columnVisible('date')) { <th>日期</th> } @if (columnVisible('channel')) { <th>渠道</th> } <th nzRight>操作</th>
            </tr></thead>
            <tbody>@for (row of orderTable.data; track row.id) {
              <tr (click)="openDetails(row)">
                <td (click)="$event.stopPropagation()"><label nz-checkbox [(ngModel)]="row.checked" (ngModelChange)="refreshChecked()"></label></td>
                @if (columnVisible('id')) { <td>{{ row.id }}</td> }
                @if (columnVisible('customer')) { <td><span class="customer"><nz-avatar nzSize="small">{{ row.customer.slice(0, 1) }}</nz-avatar>{{ row.customer }}</span></td> }
                @if (columnVisible('product')) { <td>{{ row.product }}</td> } @if (columnVisible('status')) { <td><nz-tag [nzColor]="statusColor(row.status)">{{ statusLabel(row.status) }}</nz-tag></td> }
                @if (columnVisible('amount')) { <td nzAlign="right">¥ {{ row.amount | number:'1.2-2' }}</td> } @if (columnVisible('date')) { <td>{{ row.date }}</td> } @if (columnVisible('channel')) { <td>{{ row.channel }}</td> }
                <td nzRight (click)="$event.stopPropagation()"><a nz-dropdown [nzDropdownMenu]="rowMenu">更多 <ui-icon name="chevron-down" /></a></td>
              </tr>
            }</tbody>
          </nz-table>
          <ng-template #totalTpl let-total>共 {{ total }} 条</ng-template><div class="table-footer"><span>共 {{ filteredRows().length }} 条</span><nz-pagination [nzPageIndex]="page" [nzTotal]="filteredRows().length" [nzPageSize]="pageSize" nzShowSizeChanger [nzShowTotal]="totalTpl" (nzPageIndexChange)="page = $event" (nzPageSizeChange)="pageSize = $event; page = 1" /></div>
        </nz-card>
      }
    </section>
    <nz-dropdown-menu #rowMenu="nzDropdownMenu"><ul nz-menu><li nz-menu-item>编辑</li><li nz-menu-item (click)="deleteSelected()">删除</li></ul></nz-dropdown-menu>
    <nz-drawer [nzVisible]="drawerOpen" nzPlacement="right" [nzWidth]="480" (nzOnClose)="drawerOpen = false" nzTitle="订单详情">
      @if (selected) { <ng-container *nzDrawerContent>
        <nz-descriptions nzBordered [nzColumn]="1">
          <nz-descriptions-item nzTitle="订单号">{{ selected.id }}</nz-descriptions-item><nz-descriptions-item nzTitle="客户">{{ selected.customer }} · {{ selected.email }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="产品">{{ selected.product }}</nz-descriptions-item><nz-descriptions-item nzTitle="金额">¥ {{ selected.amount | number:'1.2-2' }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="状态"><nz-tag [nzColor]="statusColor(selected.status)">{{ statusLabel(selected.status) }}</nz-tag></nz-descriptions-item>
          <nz-descriptions-item nzTitle="日期">{{ selected.date }}</nz-descriptions-item><nz-descriptions-item nzTitle="渠道">{{ selected.channel }}</nz-descriptions-item>
        </nz-descriptions>
        <nz-tabs><nz-tab nzTitle="详情"><p>订单信息已同步至 Acme Console。</p></nz-tab><nz-tab nzTitle="备注"><textarea nz-input rows="5" placeholder="备注"></textarea></nz-tab></nz-tabs>
      </ng-container> }
    </nz-drawer>
  `,
  styles: `
    .orders-page { display: grid; gap: 16px; }.page-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
    .page-heading h1 { margin: 0 0 4px; }.page-heading p { margin: 0; }.toolbar { width: 100%; }.search { width: 260px; }.filter { min-width: 130px; }
    .table-card { min-width: 0; }.customer { display: inline-flex; gap: 8px; align-items: center; white-space: nowrap; }.table-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 16px; }
    nz-checkbox { display: inline-block; margin-bottom: 8px; } @media (max-width: 767px) { .page-heading { flex-direction: column; }.search { width: 100%; }.table-footer { align-items: flex-start; flex-direction: column; } }
  `,
})
export class OrdersPage {
  readonly allRows = signal<Order[]>(orders.map((row) => ({ ...row, checked: false })));
  readonly stateOptions = [{ value: 'normal', label: '正常' }, { value: 'loading', label: '加载' }, { value: 'empty', label: '空' }, { value: 'error', label: '错误' }];
  state: PageState = 'normal'; query = ''; status: string | null = null; channels: string[] = []; dateRange: unknown;
  page = 1; pageSize = 10; drawerOpen = false; selected?: Order; allChecked = false; indeterminate = false;
  columns = [{ key: 'id', label: '订单', visible: true }, { key: 'customer', label: '客户', visible: true }, { key: 'product', label: '产品', visible: true }, { key: 'status', label: '状态', visible: true }, { key: 'amount', label: '金额', visible: true }, { key: 'date', label: '日期', visible: true }, { key: 'channel', label: '渠道', visible: true }];
  readonly filteredRows = computed(() => this.allRows().filter((row) => { const text = `${row.id} ${row.customer} ${row.email} ${row.product}`.toLowerCase(); return (!this.query || text.includes(this.query.toLowerCase())) && (!this.status || row.status === this.status) && (!this.channels.length || this.channels.includes(row.channel)); }));
  readonly pagedRows = computed(() => this.filteredRows().slice((this.page - 1) * this.pageSize, this.page * this.pageSize));
  constructor(private readonly modal: NzModalService, private readonly message: NzMessageService) {}
  columnVisible(key: string): boolean { return this.columns.find((column) => column.key === key)?.visible ?? true; }
  statusLabel(status: Order['status']): string { return ({ paid: '已支付', pending: '处理中', refunded: '已退款', failed: '失败', shipped: '已发货' })[status] ?? status; }
  statusColor(status: Order['status']): string { return ({ paid: 'success', pending: 'processing', refunded: 'warning', failed: 'error', shipped: 'blue' })[status] ?? 'default'; }
  sortBy(key: string): (a: Order, b: Order) => number { return (a, b) => String(a[key as keyof Order]).localeCompare(String(b[key as keyof Order])); }
  refreshChecked(): void { const rows = this.pagedRows(); const count = rows.filter((row) => row.checked).length; this.allChecked = count === rows.length && rows.length > 0; this.indeterminate = count > 0 && count < rows.length; }
  checkAll(checked: boolean): void { this.pagedRows().forEach((row) => (row.checked = checked)); this.refreshChecked(); }
  openDetails(row: Order): void { this.selected = row; this.drawerOpen = true; }
  deleteSelected(): void { const row = this.selected ?? this.allRows().find((item) => item.checked); if (!row) return; this.modal.confirm({ nzTitle: '删除订单', nzContent: `确定删除 ${row.id} 吗？`, nzOnOk: () => { this.allRows.update((items) => items.filter((item) => item.id !== row.id)); this.message.success(`已删除 ${row.id}`); } }); }
  exportRows(): void { this.message.success('已导出当前订单'); }
}
