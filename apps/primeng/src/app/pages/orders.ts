import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { Drawer } from 'primeng/drawer';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Textarea } from 'primeng/textarea';
import { Tag } from 'primeng/tag';
import ordersData from '@ui-gallery/spec/mock/orders.json';
import { Icon } from '../icons';
import { PageHeader, StatusTag, channelLabel, money, orderStatus } from '../shared';

type Order = (typeof ordersData)[number];
type State = 'ready' | 'loading' | 'empty' | 'error';

interface Column { field: keyof Order; header: string }

@Component({
  selector: 'app-orders',
  imports: [
    FormsModule, Button, Card, DatePicker, Drawer, IconField, InputIcon, InputText, Menu, Message, MultiSelect, Select, Skeleton,
    TableModule, Tabs, TabList, Tab, TabPanels, TabPanel, Textarea, Tag, Icon, PageHeader, StatusTag,
  ],
  template: `
    <app-page-header title="订单" description="管理所有渠道的订单、退款与发货。">
      <p-button label="导出" [outlined]="true" severity="secondary" (onClick)="toast('导出已开始', '将通过邮件发送 CSV 文件。')"><app-icon name="download" /></p-button>
      <p-button label="新建订单"><app-icon name="plus" /></p-button>
    </app-page-header>

    <p-card>
      <div class="toolbar">
        <p-iconfield class="grow search">
          <p-inputicon><app-icon name="search" [size]="14" /></p-inputicon>
          <input pInputText class="w-full" placeholder="搜索订单号 / 客户 / 邮箱" [ngModel]="query()" (ngModelChange)="query.set($event)" />
        </p-iconfield>
        <p-select [options]="statusOptions" [ngModel]="status()" (ngModelChange)="status.set($event)" placeholder="状态" [showClear]="true" optionLabel="label" optionValue="value" styleClass="w-10" />
        <p-datepicker [ngModel]="range()" (ngModelChange)="range.set($event)" selectionMode="range" [readonlyInput]="true" placeholder="日期范围" [showIcon]="true" dateFormat="mm-dd" styleClass="w-11" />
        <p-multiselect [options]="channelOptions" [ngModel]="channels()" (ngModelChange)="channels.set($event)" placeholder="渠道" optionLabel="label" optionValue="value" display="chip" styleClass="w-11" />
        <p-multiselect [options]="allColumns" [(ngModel)]="visibleColumns" optionLabel="header" placeholder="列" [showToggleAll]="false" styleClass="w-10" selectedItemsLabel="{0} 列" [maxSelectedLabels]="0" />
        <p-select [options]="stateOptions" [ngModel]="state()" (ngModelChange)="state.set($event)" optionLabel="label" optionValue="value" styleClass="w-9" />
      </div>

      @switch (state()) {
        @case ('loading') {
          <div class="stack" style="padding-top:1rem">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) { <p-skeleton height="2.25rem" /> }
          </div>
        }
        @case ('error') {
          <div class="empty">
            <app-icon name="alert-circle" [size]="36" />
            <p class="font-medium">加载失败</p>
            <p class="muted text-sm">网络异常，请稍后重试。</p>
            <p-button label="重试" [outlined]="true" (onClick)="state.set('ready')"><app-icon name="refresh" /></p-button>
          </div>
        }
        @default {
          @if (selected().length) {
            <p-message severity="info" styleClass="w-full sel-banner">
              <div class="row between w-full"><span>已选择 {{ selected().length }} 条订单</span>
                <p-button label="批量删除" severity="danger" [text]="true" size="small" (onClick)="confirmDelete(selected())" />
              </div>
            </p-message>
          }
          <p-table
            [value]="filtered()" [columns]="visibleColumns" dataKey="id" [paginator]="true" [rows]="10" [rowsPerPageOptions]="[10, 20, 50]"
            [showCurrentPageReport]="true" currentPageReportTemplate="第 {first} - {last} 条，共 {totalRecords} 条"
            [selection]="selected()" (selectionChange)="selected.set($event)" [rowHover]="true" sortField="date" [sortOrder]="-1"
            [tableStyle]="{ 'min-width': '56rem' }" styleClass="orders-table">
            <ng-template #header let-columns>
              <tr>
                <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
                @for (c of columns; track c.field) {
                  <th [pSortableColumn]="c.field" [class.right]="c.field === 'amount'">{{ c.header }} <p-sortIcon [field]="c.field" /></th>
                }
                <th style="width: 4rem"></th>
              </tr>
            </ng-template>
            <ng-template #body let-o let-columns="columns">
              <tr class="p-selectable-row">
                <td><p-tableCheckbox [value]="o" /></td>
                @for (c of columns; track c.field) {
                  <td [class.right]="c.field === 'amount'" [class.font-medium]="c.field === 'id'">
                    @switch (c.field) {
                      @case ('status') { <app-status-tag [value]="o.status" /> }
                      @case ('amount') { {{ money(o.amount, o.currency) }} }
                      @case ('channel') { <p-tag [value]="channelLabel[o.channel]" severity="secondary" /> }
                      @case ('customer') { <div class="col" style="gap:0"><span>{{ o.customer }}</span><span class="text-xs muted">{{ o.email }}</span></div> }
                      @default { {{ o[c.field] }} }
                    }
                  </td>
                }
                <td>
                  <p-button [text]="true" [rounded]="true" severity="secondary" size="small" (onClick)="openMenu($event, o)" ariaLabel="更多操作"><app-icon name="more-horizontal" /></p-button>
                </td>
              </tr>
            </ng-template>
            <ng-template #emptymessage>
              <tr><td [attr.colspan]="visibleColumns.length + 2">
                <div class="empty">
                  <app-icon name="shopping-cart" [size]="36" />
                  <p class="font-medium">没有匹配的订单</p>
                  <p class="muted text-sm">试试调整搜索或筛选条件。</p>
                  <p-button label="清除筛选" [outlined]="true" severity="secondary" (onClick)="reset()" />
                </div>
              </td></tr>
            </ng-template>
          </p-table>
        }
      }
    </p-card>

    <p-menu #rowMenu [model]="rowItems" [popup]="true" appendTo="body" />

    <p-drawer [visible]="!!current()" (visibleChange)="!$event && current.set(null)" position="right" styleClass="order-drawer" [header]="'订单 ' + current()?.id">
      @if (current(); as o) {
        <div class="stack">
          <div class="row wrap"><app-status-tag [value]="o.status" /><p-tag [value]="channelLabel[o.channel]" severity="secondary" /></div>
          <p-tabs value="detail">
            <p-tablist>
              <p-tab value="detail">详情</p-tab>
              <p-tab value="timeline">时间线</p-tab>
              <p-tab value="notes">备注</p-tab>
            </p-tablist>
            <p-tabpanels>
              <p-tabpanel value="detail">
                <dl class="desc">
                  <dt>客户</dt><dd>{{ o.customer }}</dd>
                  <dt>邮箱</dt><dd>{{ o.email }}</dd>
                  <dt>商品</dt><dd>{{ o.product }}</dd>
                  <dt>金额</dt><dd class="font-semibold">{{ money(o.amount, o.currency) }}</dd>
                  <dt>日期</dt><dd>{{ o.date }}</dd>
                  <dt>渠道</dt><dd>{{ channelLabel[o.channel] }}</dd>
                </dl>
              </p-tabpanel>
              <p-tabpanel value="timeline">
                <ul class="tl">
                  <li><span class="dot"></span><div><p class="text-sm">订单创建</p><p class="text-xs muted">{{ o.date }}</p></div></li>
                  <li><span class="dot"></span><div><p class="text-sm">状态更新为「{{ statusLabel(o.status) }}」</p><p class="text-xs muted">{{ o.date }}</p></div></li>
                </ul>
              </p-tabpanel>
              <p-tabpanel value="notes">
                <div class="field">
                  <label for="note">内部备注</label>
                  <textarea pTextarea id="note" rows="4" class="w-full" placeholder="添加备注..." [(ngModel)]="note"></textarea>
                  <p-button label="保存备注" size="small" (onClick)="toast('备注已保存', o.id)" />
                </div>
              </p-tabpanel>
            </p-tabpanels>
          </p-tabs>
          <div class="row wrap">
            <p-button label="编辑" [outlined]="true" severity="secondary"><app-icon name="pencil" /></p-button>
            <p-button label="删除" severity="danger" [outlined]="true" (onClick)="confirmDelete([o])"><app-icon name="trash" /></p-button>
          </div>
        </div>
      }
    </p-drawer>
  `,
  styles: `
    .toolbar { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 1rem; }
    .search { min-width: 14rem; }
    :host ::ng-deep .sel-banner { display: block; margin-top: 1rem; }
    :host ::ng-deep .sel-banner .p-message-text { width: 100%; }
    :host ::ng-deep .w-9 { width: 9rem; }
    :host ::ng-deep .w-10 { width: 10rem; }
    :host ::ng-deep .w-11 { width: 11rem; }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 3rem 1rem; text-align: center; color: var(--p-text-color); }
    .empty app-icon { color: var(--p-text-muted-color); }
    .desc { display: grid; grid-template-columns: 5rem 1fr; gap: 0.5rem 1rem; margin: 0; font-size: 0.875rem; }
    .desc dt { color: var(--p-text-muted-color); }
    .desc dd { margin: 0; }
    .tl { display: flex; flex-direction: column; gap: 1rem; }
    .tl li { display: flex; gap: 0.75rem; }
    .tl .dot { width: 0.625rem; height: 0.625rem; border-radius: 999px; background: var(--p-primary-color); margin-top: 0.4rem; flex: none; }
    :host ::ng-deep .order-drawer { width: 28rem !important; max-width: 100vw; }
    @media (max-width: 767px) {
      .toolbar > * { flex: 1 1 100%; }
      :host ::ng-deep .toolbar .w-9, :host ::ng-deep .toolbar .w-10, :host ::ng-deep .toolbar .w-11 { width: 100%; }
    }
  `,
})
export class OrdersPage {
  private readonly messages = inject(MessageService);
  private readonly confirm = inject(ConfirmationService);
  readonly money = money;
  readonly channelLabel = channelLabel;
  readonly all = signal<Order[]>(ordersData);
  readonly query = signal('');
  readonly status = signal<string | null>(null);
  readonly channels = signal<string[]>([]);
  readonly range = signal<Date[] | null>(null);
  readonly selected = signal<Order[]>([]);
  readonly current = signal<Order | null>(null);
  readonly state = signal<State>((new URLSearchParams(location.search).get('state') as State) || 'ready');
  note = '';

  readonly statusOptions = Object.entries(orderStatus)
    .filter(([k]) => k !== 'due')
    .map(([value, v]) => ({ label: v.label, value }));
  readonly channelOptions = Object.entries(channelLabel).map(([value, label]) => ({ label, value }));
  readonly stateOptions = [
    { label: '正常', value: 'ready' },
    { label: '加载中', value: 'loading' },
    { label: '空状态', value: 'empty' },
    { label: '错误', value: 'error' },
  ];
  readonly allColumns: Column[] = [
    { field: 'id', header: '订单号' },
    { field: 'customer', header: '客户' },
    { field: 'product', header: '商品' },
    { field: 'status', header: '状态' },
    { field: 'channel', header: '渠道' },
    { field: 'date', header: '日期' },
    { field: 'amount', header: '金额' },
  ];
  visibleColumns: Column[] = [...this.allColumns];

  readonly filtered = computed(() => {
    if (this.state() === 'empty') return [];
    const q = this.query().trim().toLowerCase();
    const [from, to] = this.range() ?? [];
    return this.all().filter((o) => {
      if (q && ![o.id, o.customer, o.email, o.product].some((v) => v.toLowerCase().includes(q))) return false;
      if (this.status() && o.status !== this.status()) return false;
      if (this.channels().length && !this.channels().includes(o.channel)) return false;
      if (from && new Date(o.date) < from) return false;
      if (to && new Date(o.date) > to) return false;
      return true;
    });
  });

  rowItems: MenuItem[] = [];
  private readonly rowMenu = viewChild.required<Menu>('rowMenu');

  openMenu(event: Event, o: Order) {
    this.rowItems = [
      { label: '查看详情', icon: 'pi pi-eye', command: () => this.current.set(o) },
      { label: '编辑', icon: 'pi pi-pencil', command: () => this.toast('编辑订单', o.id) },
      { separator: true },
      { label: '删除', icon: 'pi pi-trash', styleClass: 'danger-item', command: () => this.confirmDelete([o]) },
    ];
    this.rowMenu().toggle(event);
  }

  statusLabel(s: string) {
    return orderStatus[s]?.label ?? s;
  }

  reset() {
    this.query.set('');
    this.status.set(null);
    this.channels.set([]);
    this.range.set(null);
    this.state.set('ready');
  }

  confirmDelete(list: Order[]) {
    this.confirm.confirm({
      header: '删除订单',
      message: `确定删除 ${list.length} 条订单？此操作不可撤销。`,
      icon: 'pi pi-exclamation-triangle',
      acceptButtonProps: { label: '删除', severity: 'danger' },
      rejectButtonProps: { label: '取消', severity: 'secondary', outlined: true },
      accept: () => {
        const ids = new Set(list.map((o) => o.id));
        this.all.update((a) => a.filter((o) => !ids.has(o.id)));
        this.selected.set([]);
        if (this.current() && ids.has(this.current()!.id)) this.current.set(null);
        this.toast('删除成功', `已删除 ${list.length} 条订单`);
      },
    });
  }

  toast(summary: string, detail: string) {
    this.messages.add({ severity: 'success', summary, detail, life: 3000 });
  }
}
