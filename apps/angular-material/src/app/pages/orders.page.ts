import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import orders from '@ui-gallery/spec/mock/orders.json';
import { SHARED_IMPORTS } from '../shared/material';

type Order = (typeof orders)[number];
type OrderStatus = Order['status'];
type OrderColumnKey = 'id' | 'customer' | 'product' | 'amount' | 'status' | 'channel';

@Component({
  selector: 'app-delete-order-dialog',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <h2 mat-dialog-title>删除订单</h2>
    <mat-dialog-content>
      <p>确认删除订单 <strong>{{ order.id }}</strong> 吗？此操作无法撤销。</p>
      <mat-form-field appearance="outline" class="full">
        <mat-label>输入 DELETE 确认</mat-label>
        <input matInput [formControl]="confirmation" autocomplete="off">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>取消</button>
      <button mat-flat-button color="warn" [disabled]="confirmation.value !== 'DELETE'" (click)="confirm()">删除订单</button>
    </mat-dialog-actions>
  `,
})
export class DeleteOrderDialog {
  readonly confirmation = new FormControl('');
  readonly order = inject<{ order: Order }>(MAT_DIALOG_DATA).order;
  private readonly dialogRef = inject(MatDialogRef<DeleteOrderDialog>);

  confirm(): void {
    this.dialogRef.close(true);
  }
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <main class="page orders-page">
      <header class="page-header">
        <div><p class="eyebrow">OPERATIONS</p><h1>订单</h1><p class="muted">搜索、筛选和管理所有订单。</p></div>
        <div class="demo-row"><button mat-stroked-button><mat-icon svgIcon="download"></mat-icon>导出</button><button mat-flat-button color="primary"><mat-icon svgIcon="plus"></mat-icon>新建订单</button></div>
      </header>

      <mat-card class="filter-card">
        <mat-card-content class="filters">
          <mat-form-field appearance="outline" class="filter-search"><mat-label>搜索订单</mat-label><mat-icon matPrefix svgIcon="search"></mat-icon><input matInput [formControl]="search" placeholder="订单号、客户或邮箱"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>状态</mat-label><mat-select [formControl]="status"><mat-option value="all">全部状态</mat-option>@for (item of statusOptions; track item.value) {<mat-option [value]="item.value">{{ item.label }}</mat-option>}</mat-select></mat-form-field>
          <mat-form-field appearance="outline" class="date-field"><mat-label>日期范围</mat-label><mat-date-range-input [rangePicker]="picker"><input matStartDate [formControl]="dateStart" placeholder="开始日期"><input matEndDate [formControl]="dateEnd" placeholder="结束日期"></mat-date-range-input><mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle><mat-date-range-picker #picker></mat-date-range-picker></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>渠道</mat-label><mat-select [formControl]="channels" multiple><mat-select-trigger>{{ channelSummary() }}</mat-select-trigger>@for (channel of channelOptions; track channel) {<mat-option [value]="channel">{{ channel }}</mat-option>}</mat-select></mat-form-field>
          <button mat-icon-button [matMenuTriggerFor]="columnsMenu" matTooltip="显示列" aria-label="显示列"><mat-icon svgIcon="tune"></mat-icon></button>
          <mat-menu #columnsMenu="matMenu"><div class="menu-title">显示列</div>@for (column of allColumns; track column.key) {<button mat-menu-item (click)="$event.stopPropagation()"><mat-checkbox [checked]="visibleColumns.includes(column.key)" (click)="$event.stopPropagation()" (change)="toggleColumn(column.key)">{{ column.label }}</mat-checkbox></button>}</mat-menu>
        </mat-card-content>
      </mat-card>

      @if (state === 'loading') {
        <mat-card class="state-card"><mat-progress-spinner mode="indeterminate" diameter="44"></mat-progress-spinner><h2>正在加载订单</h2><p class="muted">请稍候，订单数据马上就绪。</p></mat-card>
      } @else if (state === 'error') {
        <mat-card class="state-card error-state"><mat-icon svgIcon="error"></mat-icon><h2>订单加载失败</h2><p class="muted">暂时无法获取订单数据。</p><button mat-stroked-button (click)="retry()">重试</button></mat-card>
      } @else if (filteredRows.length === 0 || state === 'empty') {
        <mat-card class="state-card"><mat-icon svgIcon="inbox"></mat-icon><h2>没有找到订单</h2><p class="muted">试试调整筛选条件，或创建一笔新订单。</p><button mat-flat-button color="primary" (click)="resetFilters()">清除筛选</button></mat-card>
      } @else {
        <mat-card class="table-card">
          <mat-card-content class="table-wrap">
            <table mat-table [dataSource]="dataSource" matSort>
              <ng-container matColumnDef="select"><th mat-header-cell *matHeaderCellDef><mat-checkbox (change)="$event ? toggleAllRows() : null" [checked]="selection.hasValue() && isAllSelected()" [indeterminate]="selection.hasValue() && !isAllSelected()" aria-label="全选订单"></mat-checkbox></th><td mat-cell *matCellDef="let row"><mat-checkbox (click)="$event.stopPropagation()" (change)="$event ? selection.toggle(row) : null" [checked]="selection.isSelected(row)" aria-label="选择订单"></mat-checkbox></td></ng-container>
              <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef mat-sort-header>订单号</th><td mat-cell *matCellDef="let row"><span class="cell-primary">{{ row.id }}</span><small class="sub-info">{{ row.date }}</small></td></ng-container>
              <ng-container matColumnDef="customer"><th mat-header-cell *matHeaderCellDef mat-sort-header>客户</th><td mat-cell *matCellDef="let row"><div class="row"><span class="avatar">{{ row.customer.slice(0, 1) }}</span><span><span class="cell-primary">{{ row.customer }}</span><small class="sub-info">{{ row.email }}</small></span></div></td></ng-container>
              <ng-container matColumnDef="product"><th mat-header-cell *matHeaderCellDef>产品</th><td mat-cell *matCellDef="let row">{{ row.product }}</td></ng-container>
              <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef mat-sort-header>金额</th><td mat-cell *matCellDef="let row" class="amount">¥{{ row.amount.toLocaleString() }}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>状态</th><td mat-cell *matCellDef="let row"><span class="status" [class.status-success]="row.status === 'paid'">{{ statusLabel(row.status) }}</span></td></ng-container>
              <ng-container matColumnDef="channel"><th mat-header-cell *matHeaderCellDef>渠道</th><td mat-cell *matCellDef="let row">{{ row.channel }}</td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let row"><button mat-icon-button [matMenuTriggerFor]="rowMenu" (click)="$event.stopPropagation()" aria-label="订单操作"><mat-icon svgIcon="more-vertical"></mat-icon></button><mat-menu #rowMenu="matMenu"><button mat-menu-item (click)="edit(row)"><mat-icon svgIcon="edit"></mat-icon>编辑</button><button mat-menu-item (click)="remove(row)"><mat-icon svgIcon="trash"></mat-icon>删除</button></mat-menu></td></ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr><tr mat-row *matRowDef="let row; columns: displayedColumns" (click)="openDetails(row)"></tr>
            </table>
          </mat-card-content>
          <mat-card-actions class="table-footer"><span class="muted">{{ selection.selected.length ? '已选择 ' + selection.selected.length + ' 项' : '共 ' + filteredRows.length + ' 条订单' }}</span><mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator></mat-card-actions>
        </mat-card>
      }

      <mat-sidenav-container class="details-container">
        <mat-sidenav #drawer position="end" mode="over" [opened]="!!selectedOrder" (closed)="selectedOrder = undefined" class="details-drawer">
          @if (selectedOrder; as order) {
            <div class="drawer-header"><h2>{{ order.id }}</h2><button mat-icon-button (click)="drawer.close()"><mat-icon svgIcon="close"></mat-icon></button></div>
            <div class="stack drawer-content"><span class="status status-success">{{ statusLabel(order.status) }}</span><mat-list><mat-list-item><span matListItemTitle>客户</span><span matListItemLine>{{ order.customer }} · {{ order.email }}</span></mat-list-item><mat-list-item><span matListItemTitle>产品</span><span matListItemLine>{{ order.product }}</span></mat-list-item><mat-list-item><span matListItemTitle>金额</span><span matListItemLine>¥{{ order.amount.toLocaleString() }}</span></mat-list-item><mat-list-item><span matListItemTitle>日期 / 渠道</span><span matListItemLine>{{ order.date }} · {{ order.channel }}</span></mat-list-item></mat-list><mat-tab-group><mat-tab label="详情"><p class="muted">订单已通过风控检查，发票将于付款完成后发送。</p></mat-tab><mat-tab label="备注"><mat-form-field appearance="outline" class="full"><mat-label>添加备注</mat-label><textarea matInput rows="4"></textarea></mat-form-field></mat-tab></mat-tab-group></div>
          }
        </mat-sidenav>
        <mat-sidenav-content></mat-sidenav-content>
      </mat-sidenav-container>
    </main>
  `,
})
export class OrdersPage implements AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  readonly dataSource = new MatTableDataSource<Order>(orders);
  readonly selection = new SelectionModel<Order>(true, []);
  readonly search = new FormControl('');
  readonly status = new FormControl('all');
  readonly channels = new FormControl<string[]>([]);
  readonly dateStart = new FormControl<Date | null>(null);
  readonly dateEnd = new FormControl<Date | null>(null);
  readonly statusOptions: ReadonlyArray<{ value: OrderStatus; label: string }> = [
    { value: 'paid', label: '已支付' }, { value: 'pending', label: '待处理' }, { value: 'refunded', label: '已退款' },
    { value: 'failed', label: '失败' }, { value: 'shipped', label: '已发货' },
  ];
  readonly channelOptions = ['web', 'ios', 'android', 'api'];
  readonly allColumns = [
    { key: 'id', label: '订单号' }, { key: 'customer', label: '客户' }, { key: 'product', label: '产品' },
    { key: 'amount', label: '金额' }, { key: 'status', label: '状态' }, { key: 'channel', label: '渠道' },
  ] as const;
  visibleColumns: OrderColumnKey[] = this.allColumns.map((column) => column.key);
  selectedOrder?: Order;
  readonly state = new URLSearchParams(window.location.search).get('state') as 'empty' | 'loading' | 'error' | null;
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.search.valueChanges.subscribe(() => this.applyFilters());
    this.status.valueChanges.subscribe(() => this.applyFilters());
    this.channels.valueChanges.subscribe(() => this.applyFilters());
    this.dateStart.valueChanges.subscribe(() => this.applyFilters());
    this.dateEnd.valueChanges.subscribe(() => this.applyFilters());
    this.applyFilters();
  }

  get filteredRows(): Order[] {
    return this.dataSource.filteredData;
  }

  get displayedColumns(): string[] {
    return ['select', ...this.visibleColumns, 'actions'];
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  }

  isAllSelected(): boolean {
    const rows = this.dataSource.filteredData;
    return rows.length > 0 && rows.every((row) => this.selection.isSelected(row));
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.filteredData.forEach((row) => this.selection.select(row));
    }
  }

  toggleColumn(column: OrderColumnKey): void {
    this.visibleColumns = this.visibleColumns.includes(column)
      ? this.visibleColumns.filter((item) => item !== column)
      : [...this.visibleColumns, column];
  }

  channelSummary(): string {
    const values = this.channels.value ?? [];
    return values.length ? values.join('、') : '全部渠道';
  }

  statusLabel(status: string): string {
    return { paid: '已支付', pending: '待处理', refunded: '已退款', failed: '失败', shipped: '已发货' }[status] ?? status;
  }

  openDetails(order: Order): void {
    this.selectedOrder = order;
  }

  edit(order: Order): void {
    this.snackBar.open(`已进入 ${order.id} 编辑模式`, '知道了', { duration: 2400 });
  }

  remove(order: Order): void {
    const ref = this.dialog.open(DeleteOrderDialog, { data: { order }, width: '420px' });
    ref.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.snackBar.open(`订单 ${order.id} 已删除`, '撤销', { duration: 3200 });
      }
    });
  }

  retry(): void {
    window.location.reload();
  }

  resetFilters(): void {
    this.search.setValue('');
    this.status.setValue('all');
    this.channels.setValue([]);
    this.dateStart.setValue(null);
    this.dateEnd.setValue(null);
  }

  private applyFilters(): void {
    const query = (this.search.value ?? '').trim().toLowerCase();
    const status = this.status.value ?? 'all';
    const channels = this.channels.value ?? [];
    const start = this.dateStart.value?.toISOString().slice(0, 10);
    const end = this.dateEnd.value?.toISOString().slice(0, 10);
    this.dataSource.data = orders.filter((order) => {
      const matchesText = !query || [order.id, order.customer, order.email, order.product].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = status === 'all' || order.status === status;
      const matchesChannel = !channels.length || channels.includes(order.channel);
      const matchesDate = (!start || order.date >= start) && (!end || order.date <= end);
      return matchesText && matchesStatus && matchesChannel && matchesDate;
    });
    this.selection.clear();
  }
}
