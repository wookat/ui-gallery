import { Clipboard } from '@angular/cdk/clipboard';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { coverage } from '../coverage';
import { SHARED_IMPORTS, moveItemInArray } from '../shared/material';

type TreeNode = { name: string; children?: TreeNode[] };

@Component({
  selector: 'app-demo-dialog',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `<h2 mat-dialog-title>确认操作</h2><mat-dialog-content>这是一个真实的 MatDialog，所有按钮都可以操作。</mat-dialog-content><mat-dialog-actions align="end"><button mat-button mat-dialog-close>取消</button><button mat-flat-button color="primary" [mat-dialog-close]="true">确认</button></mat-dialog-actions>`,
})
export class DemoDialog {}

@Component({
  selector: 'app-demo-sheet',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `<div class="sheet"><h2>Bottom sheet</h2><p class="muted">这是 CDK overlay 上的底部操作面板。</p><button mat-flat-button color="primary" (click)="close()">完成</button></div>`,
})
export class DemoSheet {
  private readonly ref = inject(MatBottomSheetRef<DemoSheet>);
  close(): void { this.ref.dismiss(); }
}

@Component({
  selector: 'app-components',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <main class="page components-page">
      <header class="page-header"><div><p class="eyebrow">REFERENCE</p><h1>组件全集</h1><p class="muted">真实 Angular Material / CDK 交互与 coverage 对照。</p></div><button mat-stroked-button (click)="openDialog()">打开 Dialog</button></header>
      <mat-chip-set class="component-index">@for (entry of componentEntries; track entry[0]) {<mat-chip [class.missing-chip]="entry[1] === 'missing'">{{ entry[0] }}</mat-chip>}</mat-chip-set>
      <section class="component-grid">
        <mat-card><mat-card-header><mat-card-title>Button / Button Group</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> variant · size · state</mat-card-subtitle></mat-card-header><mat-card-content class="demo-row wrap"><button mat-button>Text</button><button mat-flat-button color="primary">Filled</button><button mat-raised-button>Elevated</button><button mat-stroked-button>Outlined</button><button mat-button color="primary">Tonal</button><button mat-flat-button disabled>Disabled</button><button mat-icon-button aria-label="编辑"><mat-icon svgIcon="edit"></mat-icon></button><button mat-fab color="primary" aria-label="添加"><mat-icon svgIcon="plus"></mat-icon></button><button mat-mini-fab><mat-icon svgIcon="plus"></mat-icon></button><button mat-fab extended><mat-icon svgIcon="plus"></mat-icon>新建</button><mat-button-toggle-group value="one"><mat-button-toggle value="one">One</mat-button-toggle><mat-button-toggle value="two">Two</mat-button-toggle></mat-button-toggle-group></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-title>Input / Select / Autocomplete</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> fill · outline · prefix · suffix · error · hint</mat-card-subtitle></mat-card-header><mat-card-content class="form-grid"><mat-form-field appearance="fill"><mat-label>Fill input</mat-label><mat-icon matPrefix svgIcon="search"></mat-icon><input matInput placeholder="Search"><button mat-icon-button matSuffix><mat-icon svgIcon="x"></mat-icon></button><mat-hint>可清除的搜索框</mat-hint></mat-form-field><mat-form-field appearance="outline"><mat-label>Password</mat-label><input matInput type="password"><mat-icon matSuffix svgIcon="eye-off"></mat-icon></mat-form-field><mat-form-field appearance="outline"><mat-label>Select</mat-label><mat-select><mat-option value="a">Option A</mat-option><mat-option value="b">Option B</mat-option></mat-select></mat-form-field><mat-form-field appearance="outline"><mat-label>Multi select</mat-label><mat-select multiple><mat-option value="a">Alpha</mat-option><mat-option value="b">Beta</mat-option></mat-select></mat-form-field></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-title>Checkbox / Radio / Switch</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> selection states</mat-card-subtitle></mat-card-header><mat-card-content class="stack"><mat-checkbox>Checked option</mat-checkbox><mat-checkbox [indeterminate]="true">Indeterminate option</mat-checkbox><mat-radio-group value="first" class="demo-row"><mat-radio-button value="first">First</mat-radio-button><mat-radio-button value="second">Second</mat-radio-button></mat-radio-group><mat-slide-toggle checked>Enabled</mat-slide-toggle></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-title>Slider / Date / Time</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> single · range · discrete</mat-card-subtitle></mat-card-header><mat-card-content class="stack"><mat-slider min="0" max="100" discrete><input matSliderThumb value="42"></mat-slider><mat-slider min="0" max="100"><input matSliderStartThumb value="20"><input matSliderEndThumb value="80"></mat-slider><div class="demo-row"><mat-form-field appearance="outline"><mat-label>Date</mat-label><input matInput [matDatepicker]="datePicker"><mat-datepicker-toggle matIconSuffix [for]="datePicker"></mat-datepicker-toggle><mat-datepicker #datePicker></mat-datepicker></mat-form-field><mat-form-field appearance="outline"><mat-label>Time</mat-label><input matInput [matTimepicker]="timePicker"><mat-timepicker-toggle matIconSuffix [for]="timePicker"></mat-timepicker-toggle><mat-timepicker #timePicker></mat-timepicker></mat-form-field></div></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-title>Chips / Badge / Tooltip</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> listbox · selectable · multi-color</mat-card-subtitle></mat-card-header><mat-card-content class="stack"><mat-chip-set aria-label="标签"><mat-chip color="primary" highlighted>Design</mat-chip><mat-chip>Engineering</mat-chip><mat-chip color="warn">Blocked</mat-chip></mat-chip-set><div class="demo-row"><button mat-button matBadge="8" matBadgeColor="warn">Notifications</button><button mat-icon-button matBadge="99+" matBadgeColor="primary" matTooltip="消息"><mat-icon svgIcon="bell"></mat-icon></button><button mat-icon-button matTooltip="上方提示" matTooltipPosition="above"><mat-icon svgIcon="info"></mat-icon></button></div></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-title>Progress / Spinner / Steps</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> determinate · buffer · query</mat-card-subtitle></mat-card-header><mat-card-content class="stack"><mat-progress-bar mode="determinate" value="68"></mat-progress-bar><mat-progress-bar mode="buffer" value="40" bufferValue="75"></mat-progress-bar><mat-progress-bar mode="indeterminate"></mat-progress-bar><div class="demo-row"><mat-spinner diameter="28"></mat-spinner><mat-progress-spinner diameter="28" mode="determinate" value="72"></mat-progress-spinner><span class="chip">Step 2 / 4</span></div></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-title>Tabs / Accordion / Expansion</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> default · stretch · nested content</mat-card-subtitle></mat-card-header><mat-card-content><mat-tab-group><mat-tab label="Overview">Overview content</mat-tab><mat-tab label="Activity">Activity content</mat-tab></mat-tab-group><mat-accordion><mat-expansion-panel><mat-expansion-panel-header>展开更多</mat-expansion-panel-header><p class="muted">Expansion panel 内容。</p></mat-expansion-panel></mat-accordion></mat-card-content></mat-card>
        <mat-card class="wide-demo-card"><mat-card-header><mat-card-title>Table / Sort / Paginator</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> dense data grid</mat-card-subtitle></mat-card-header><mat-card-content class="table-wrap"><table mat-table [dataSource]="tableDataSource" matSort><ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef mat-sort-header>名称</th><td mat-cell *matCellDef="let row">{{ row.name }}</td></ng-container><ng-container matColumnDef="state"><th mat-header-cell *matHeaderCellDef mat-sort-header>状态</th><td mat-cell *matCellDef="let row"><span class="status status-success">{{ row.state }}</span></td></ng-container><tr mat-header-row *matHeaderRowDef="tableColumns"></tr><tr mat-row *matRowDef="let row; columns: tableColumns"></tr></table><mat-paginator [pageSize]="3" [pageSizeOptions]="[3, 6]" showFirstLastButtons></mat-paginator></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-title>Tree / List / Drawer</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> nested data · selection · sidenav</mat-card-subtitle></mat-card-header><mat-card-content><mat-tree [dataSource]="treeData" [treeControl]="treeControl"><mat-nested-tree-node *matTreeNodeDef="let node"><div class="tree-row" matTreeNodePadding [matTreeNodePaddingIndent]="20"><span class="tree-spacer"></span>{{ node.name }}</div></mat-nested-tree-node><mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild"><div class="tree-row" matTreeNodePadding [matTreeNodePaddingIndent]="20"><button mat-icon-button matTreeNodeToggle [attr.aria-label]="'展开 ' + node.name"><mat-icon [svgIcon]="treeControl.isExpanded(node) ? 'chevron-down' : 'chevron-right'"></mat-icon></button>{{ node.name }}</div><div [class.tree-invisible]="!treeControl.isExpanded(node)" role="group"><ng-container matTreeNodeOutlet></ng-container></div></mat-nested-tree-node></mat-tree><mat-divider></mat-divider><mat-list><mat-list-item><mat-icon matListItemIcon svgIcon="home"></mat-icon><span matListItemTitle>单行列表</span><span matListItemLine>双行说明</span></mat-list-item><mat-list-item><mat-icon matListItemIcon svgIcon="users"></mat-icon><span matListItemTitle>团队成员</span></mat-list-item></mat-list></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-title>Menu / Snackbar / Dialog</mat-card-title><mat-card-subtitle><span class="chip">implemented</span> overlay actions</mat-card-subtitle></mat-card-header><mat-card-content class="demo-row wrap"><button mat-flat-button [matMenuTriggerFor]="menu">打开菜单</button><mat-menu #menu="matMenu"><button mat-menu-item (click)="notify('编辑')"><mat-icon svgIcon="edit"></mat-icon>编辑</button><button mat-menu-item [matMenuTriggerFor]="nestedMenu">更多</button></mat-menu><mat-menu #nestedMenu="matMenu"><button mat-menu-item>导出</button><button mat-menu-item>复制链接</button></mat-menu><button mat-stroked-button (click)="notify('成功')">Snackbar</button><button mat-stroked-button (click)="openDialog()">Dialog</button><button mat-stroked-button (click)="openSheet()">Bottom sheet</button></mat-card-content></mat-card>
        <mat-card><mat-card-header><mat-card-title>CDK 补充</mat-card-title><mat-card-subtitle>真实拖拽、复制、自动尺寸和虚拟滚动</mat-card-subtitle></mat-card-header><mat-card-content class="stack"><div cdkDropList class="drag-list" (cdkDropListDropped)="drop($event)">@for (item of dragItems; track item) {<div cdkDrag class="drag-item"><mat-icon svgIcon="menu"></mat-icon>{{ item }}</div>}</div><button mat-button [cdkCopyToClipboard]="'Angular Material copied text'" (click)="notify('已复制')">cdkCopyToClipboard</button><textarea matInput cdkTextareaAutosize placeholder="cdkTextareaAutosize"></textarea><cdk-virtual-scroll-viewport itemSize="36" class="virtual-viewport"><div *cdkVirtualFor="let item of virtualItems" class="virtual-row">Virtual row {{ item }}</div></cdk-virtual-scroll-viewport></mat-card-content></mat-card>
        @for (entry of missingEntries; track entry[0]) {<mat-card class="missing-card"><mat-card-header><mat-card-title>{{ entry[0] }}</mat-card-title><mat-card-subtitle><span class="chip missing-chip">missing</span></mat-card-subtitle></mat-card-header><mat-card-content><p class="muted">Angular Material 无此组件</p></mat-card-content></mat-card>}
      </section>
    </main>
  `,
})
export class ComponentsPage implements AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  readonly componentEntries = Object.entries(coverage);
  readonly missingEntries = this.componentEntries.filter((entry) => entry[1] === 'missing');
  readonly tableColumns = ['name', 'state'];
  readonly tableData = [
    { name: 'Design system', state: 'Ready' },
    { name: 'Documentation', state: 'Review' },
    { name: 'Release', state: 'Ready' },
    { name: 'Accessibility', state: 'Ready' },
    { name: 'Localization', state: 'Review' },
    { name: 'Performance', state: 'Ready' },
  ];
  readonly tableDataSource = new MatTableDataSource(this.tableData);
  readonly dragItems = ['First item', 'Second item', 'Third item'];
  readonly virtualItems = Array.from({ length: 1000 }, (_, index) => index + 1);
  readonly treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  readonly treeData = new MatTreeNestedDataSource<TreeNode>();
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly clipboard = inject(Clipboard);

  constructor() {
    this.treeData.data = [{ name: 'Workspace', children: [{ name: 'Design' }, { name: 'Engineering', children: [{ name: 'Frontend' }, { name: 'Backend' }] }] }];
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator ?? null;
    this.tableDataSource.sort = this.sort ?? null;
  }

  hasChild = (_: number, node: TreeNode): boolean => !!node.children?.length;
  drop(event: { previousIndex: number; currentIndex: number }): void { moveItemInArray(this.dragItems, event.previousIndex, event.currentIndex); }
  notify(message: string): void { this.snackBar.open(message, '知道了', { duration: 2200 }); }
  openDialog(): void { this.dialog.open(DemoDialog, { width: '420px' }); }
  openSheet(): void { this.bottomSheet.open(DemoSheet); }
}
