import { Clipboard } from '@angular/cdk/clipboard';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, HostListener, Input, ViewChild, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import activity from '@ui-gallery/spec/mock/activity.json';
import landing from '@ui-gallery/spec/mock/landing.json';
import nav from '@ui-gallery/spec/mock/nav.json';
import notifications from '@ui-gallery/spec/mock/notifications.json';
import orders from '@ui-gallery/spec/mock/orders.json';
import stats from '@ui-gallery/spec/mock/stats.json';
import tasks from '@ui-gallery/spec/mock/tasks.json';
import team from '@ui-gallery/spec/mock/team.json';
import { UrlSettingsService } from '../core/url-settings.service';
import { coverage, CoverageStatus } from '../coverage';
import { SHARED_IMPORTS, moveItemInArray } from '../shared/material';

type TreeNode = { name: string; children?: TreeNode[] };
type DialogKind = 'basic' | 'confirm' | 'fullscreen' | 'scroll';

@Component({
  selector: 'app-demo-card',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <mat-card class="component-card" [class.wide-demo-card]="wide" [id]="'c-' + name">
      <mat-card-header>
        <mat-card-title>{{ name }}</mat-card-title>
        <mat-card-subtitle><span class="chip" [class.chip-composed]="status === 'composed'" [class.chip-missing]="status === 'missing'">{{ status }}</span> {{ hint }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content><ng-content></ng-content></mat-card-content>
    </mat-card>
  `,
})
export class DemoCard {
  @Input({ required: true }) name = '';
  @Input() hint = '';
  @Input() wide = false;
  get status(): CoverageStatus { return coverage[this.name] ?? 'missing'; }
}

@Component({
  selector: 'app-demo-dialog',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <h2 mat-dialog-title>{{ titles[kind] }}</h2>
    <mat-dialog-content>
      @if (kind === 'scroll') { @for (row of rows; track row.id) {<p>{{ row.id }} · {{ row.customer }} · ¥{{ row.amount | number: '1.2-2' }}</p>} }
      @else if (kind === 'confirm') {<p>删除后无法恢复，确定继续吗？</p>}
      @else {<p>这是一个真实的 MatDialog，所有按钮都可以操作。</p>}
    </mat-dialog-content>
    <mat-dialog-actions align="end"><button mat-button mat-dialog-close>取消</button><button mat-flat-button [color]="kind === 'confirm' ? 'warn' : 'primary'" [mat-dialog-close]="true">{{ kind === 'confirm' ? '删除' : '确认' }}</button></mat-dialog-actions>
  `,
})
export class DemoDialog {
  readonly kind = inject<DialogKind>(MAT_DIALOG_DATA) ?? 'basic';
  readonly rows = orders;
  readonly titles: Record<DialogKind, string> = { basic: '普通对话框', confirm: '确认删除', fullscreen: '全屏对话框', scroll: '可滚动对话框' };
}

@Component({
  selector: 'app-image-preview',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `<div class="image-preview"><div class="placeholder-image large"><mat-icon svgIcon="image"></mat-icon></div><mat-dialog-actions align="end"><button mat-button mat-dialog-close>关闭</button></mat-dialog-actions></div>`,
})
export class ImagePreviewDialog {}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <div class="command-palette">
      <mat-form-field appearance="outline" class="full" subscriptSizing="dynamic"><mat-icon matPrefix svgIcon="search"></mat-icon><input matInput [formControl]="query" placeholder="搜索页面或命令…" cdkFocusInitial><span matSuffix class="kbd">Esc</span></mat-form-field>
      <mat-nav-list>@for (item of filtered(); track item.key) {<a mat-list-item [routerLink]="item.path" (click)="ref.close()"><mat-icon matListItemIcon [svgIcon]="item.icon"></mat-icon><span matListItemTitle>{{ item.label }}</span><span matListItemMeta class="kbd">↵</span></a>} @empty {<p class="muted command-empty">没有匹配的命令</p>}</mat-nav-list>
    </div>
  `,
})
export class CommandPaletteDialog {
  readonly ref = inject(MatDialogRef<CommandPaletteDialog>);
  readonly query = new FormControl('');
  readonly items = nav;
  filtered(): typeof nav { const q = (this.query.value ?? '').toLowerCase(); return this.items.filter((item) => item.label.toLowerCase().includes(q) || item.key.includes(q)); }
}

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
  imports: [...SHARED_IMPORTS, DemoCard],
  template: `
    <main class="page components-page">
      <header class="page-header"><div><p class="eyebrow">REFERENCE</p><h1>组件全集</h1><p class="muted">真实 Angular Material / CDK 交互与 coverage 对照，共 {{ componentEntries.length }} 个组件。</p></div><div class="demo-row"><span class="chip">implemented {{ count('implemented') }}</span><span class="chip chip-composed">composed {{ count('composed') }}</span><span class="chip chip-missing">missing {{ count('missing') }}</span></div></header>
      <nav class="component-index" aria-label="组件锚点索引">@for (entry of componentEntries; track entry[0]) {<a mat-stroked-button class="index-link" [class.index-composed]="entry[1] === 'composed'" [class.index-missing]="entry[1] === 'missing'" [href]="'#c-' + entry[0]" (click)="scrollTo(entry[0], $event)"><mat-icon [svgIcon]="entry[1] === 'implemented' ? 'check' : entry[1] === 'composed' ? 'boxes' : 'x'"></mat-icon>{{ entry[0] }}</a>}</nav>

      <h2 class="section-title" id="s-typography">排版</h2>
      <section class="component-grid">
        <app-demo-card name="Typography" hint="h1–h6 · 正文 · 引用 · 列表" [wide]="true"><div class="type-scale"><h1 class="mat-headline-large">Headline large / h1</h1><h2 class="mat-headline-medium">Headline medium / h2</h2><h3 class="mat-headline-small">Headline small / h3</h3><h4 class="mat-title-large">Title large / h4</h4><h5 class="mat-title-medium">Title medium / h5</h5><h6 class="mat-title-small">Title small / h6</h6><p class="mat-body-large">Body large：{{ landingContent.hero.subtitle }}</p><p class="mat-body-medium muted">Body medium · <a href="#c-Link">链接</a> · <code>inline code</code> · <kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd></p><blockquote class="quote">{{ landingContent.testimonials[0].quote }}</blockquote><ul class="type-list">@for (feature of landingContent.features.slice(0, 3); track feature.title) {<li>{{ feature.title }} — {{ feature.desc }}</li>}</ul></div></app-demo-card>
        <app-demo-card name="Code" hint="inline · block"><p>行内代码 <code>ng serve --open</code> 与代码块：</p><pre class="code-block"><code>&#64;Component(&#123; selector: 'app-root' &#125;)
export class App &#123;&#125;</code></pre><button matButton (click)="copy(codeSample)"><mat-icon svgIcon="copy"></mat-icon>复制代码</button></app-demo-card>
        <app-demo-card name="Kbd" hint="快捷键"><div class="demo-row"><kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">K</kbd><span class="muted">打开命令面板</span></div><div class="demo-row"><kbd class="kbd">Shift</kbd> + <kbd class="kbd">Enter</kbd><span class="muted">换行</span></div></app-demo-card>
        <app-demo-card name="Link" hint="默认 · 弱化 · 图标 · 禁用"><div class="demo-row wrap"><a href="#c-Button">默认链接</a><a class="muted" href="#c-Button">弱化链接</a><a mat-button href="#c-Button">按钮式链接 <mat-icon svgIcon="arrow-right"></mat-icon></a><a class="link-disabled" aria-disabled="true">禁用链接</a></div></app-demo-card>
        <app-demo-card name="Divider" hint="水平 · inset · 垂直"><mat-list><mat-list-item>第一项</mat-list-item><mat-divider></mat-divider><mat-list-item>第二项</mat-list-item><mat-divider inset></mat-divider><mat-list-item>第三项（inset）</mat-list-item></mat-list><div class="demo-row divider-row"><span>左</span><mat-divider vertical></mat-divider><span>右</span></div></app-demo-card>
      </section>

      <h2 class="section-title" id="s-buttons">按钮</h2>
      <section class="component-grid">
        <app-demo-card name="Button" hint="variant · disabled · loading" [wide]="true"><div class="stack"><div class="demo-row wrap"><button matButton>Text</button><button matButton="filled">Filled</button><button matButton="tonal">Tonal</button><button matButton="outlined">Outlined</button><button matButton="elevated">Elevated</button></div><div class="demo-row wrap"><button matButton disabled>Text</button><button matButton="filled" disabled>Filled</button><button matButton="tonal" disabled>Tonal</button><button matButton="outlined" disabled>Outlined</button><button matButton="elevated" disabled>Elevated</button></div><div class="demo-row wrap"><button matButton="filled"><mat-icon svgIcon="download"></mat-icon>带图标</button><button matButton="outlined" disabled><mat-spinner diameter="18"></mat-spinner>加载中</button><button matButton="filled" color="warn"><mat-icon svgIcon="trash"></mat-icon>Destructive</button><a matButton href="#c-Link">Link 样式</a></div></div></app-demo-card>
        <app-demo-card name="ButtonGroup" hint="单选 · 多选 · 图标"><div class="stack"><mat-button-toggle-group value="one" aria-label="单选组"><mat-button-toggle value="one">One</mat-button-toggle><mat-button-toggle value="two">Two</mat-button-toggle><mat-button-toggle value="three">Three</mat-button-toggle></mat-button-toggle-group><mat-button-toggle-group multiple aria-label="多选组"><mat-button-toggle value="b" checked>加粗</mat-button-toggle><mat-button-toggle value="i">斜体</mat-button-toggle><mat-button-toggle value="u" disabled>下划线</mat-button-toggle></mat-button-toggle-group></div></app-demo-card>
        <app-demo-card name="IconButton" hint="默认 · 角标 · 禁用"><div class="demo-row wrap"><button matIconButton aria-label="编辑"><mat-icon svgIcon="edit"></mat-icon></button><button matIconButton matBadge="3" matBadgeColor="warn" aria-label="通知"><mat-icon svgIcon="bell"></mat-icon></button><button matIconButton matTooltip="收藏" aria-label="收藏"><mat-icon svgIcon="heart"></mat-icon></button><button matIconButton disabled aria-label="删除"><mat-icon svgIcon="trash"></mat-icon></button></div></app-demo-card>
        <app-demo-card name="FloatButton" hint="FAB · mini · extended"><div class="fab-demo"><div class="fab-row"><button matFab color="primary" aria-label="新建"><mat-icon svgIcon="plus"></mat-icon></button><button matMiniFab aria-label="编辑"><mat-icon svgIcon="edit"></mat-icon></button><button matFab extended><mat-icon svgIcon="plus"></mat-icon>新建订单</button></div><div class="fab-stage"><span class="muted">页面右下角悬浮位置</span><button matMiniFab class="fab-floating" aria-label="回到顶部" (click)="backTop()"><mat-icon svgIcon="chevron-up"></mat-icon></button></div></div></app-demo-card>
        <app-demo-card name="Segmented" hint="button-toggle 图标分段"><mat-button-toggle-group [value]="view()" (change)="view.set($event.value)" aria-label="视图"><mat-button-toggle value="list"><mat-icon svgIcon="list"></mat-icon>列表</mat-button-toggle><mat-button-toggle value="grid"><mat-icon svgIcon="grid"></mat-icon>网格</mat-button-toggle><mat-button-toggle value="chart"><mat-icon svgIcon="bar-chart"></mat-icon>图表</mat-button-toggle></mat-button-toggle-group><p class="muted">当前：{{ view() }}</p></app-demo-card>
      </section>

      <h2 class="section-title" id="s-forms">表单控件</h2>
      <section class="component-grid">
        <app-demo-card name="Input" hint="fill · outline · 前后缀 · 清除 · 密码 · 错误" [wide]="true"><div class="form-grid"><mat-form-field appearance="fill"><mat-label>搜索</mat-label><mat-icon matPrefix svgIcon="search"></mat-icon><input matInput [formControl]="searchInput" placeholder="搜索订单">@if (searchInput.value) {<button matIconButton matSuffix (click)="searchInput.setValue('')" aria-label="清除"><mat-icon svgIcon="x"></mat-icon></button>}<mat-hint>可清除的搜索框</mat-hint></mat-form-field><mat-form-field appearance="outline"><mat-label>密码</mat-label><input matInput [type]="showPassword() ? 'text' : 'password'" value="secret"><button matIconButton matSuffix (click)="showPassword.set(!showPassword())" [attr.aria-label]="showPassword() ? '隐藏' : '显示'"><mat-icon [svgIcon]="showPassword() ? 'eye-off' : 'eye'"></mat-icon></button></mat-form-field><mat-form-field appearance="outline"><mat-label>金额</mat-label><span matTextPrefix>¥&nbsp;</span><input matInput type="number" value="99"><span matTextSuffix>.00</span></mat-form-field><mat-form-field appearance="outline"><mat-label>邮箱</mat-label><input matInput [formControl]="emailInput"><mat-error>请输入有效邮箱</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>禁用</mat-label><input matInput disabled value="只读内容"></mat-form-field></div></app-demo-card>
        <app-demo-card name="Textarea" hint="自动增高 · 字数统计"><mat-form-field appearance="outline" class="full"><mat-label>备注</mat-label><textarea matInput cdkTextareaAutosize cdkAutosizeMinRows="2" cdkAutosizeMaxRows="5" maxlength="120" [formControl]="noteInput"></textarea><mat-hint align="end">{{ noteInput.value?.length ?? 0 }} / 120</mat-hint></mat-form-field></app-demo-card>
        <app-demo-card name="NumberInput" hint="步进按钮"><mat-form-field appearance="outline" class="full"><mat-label>数量</mat-label><button matIconButton matPrefix (click)="quantity.set(quantity() - 1)" [disabled]="quantity() <= 0" aria-label="减少"><mat-icon svgIcon="chevron-down"></mat-icon></button><input matInput type="number" [value]="quantity()" (input)="quantity.set(+($any($event.target).value || 0))" min="0" max="99"><button matIconButton matSuffix (click)="quantity.set(quantity() + 1)" [disabled]="quantity() >= 99" aria-label="增加"><mat-icon svgIcon="chevron-up"></mat-icon></button><mat-hint>0 – 99</mat-hint></mat-form-field></app-demo-card>
        <app-demo-card name="Select" hint="分组 · 禁用项"><mat-form-field appearance="outline" class="full"><mat-label>状态</mat-label><mat-select value="paid"><mat-optgroup label="进行中"><mat-option value="pending">待处理</mat-option><mat-option value="shipped">已发货</mat-option></mat-optgroup><mat-optgroup label="已结束"><mat-option value="paid">已支付</mat-option><mat-option value="refunded" disabled>已退款</mat-option></mat-optgroup></mat-select></mat-form-field></app-demo-card>
        <app-demo-card name="MultiSelect" hint="多选 · 摘要触发器"><mat-form-field appearance="outline" class="full"><mat-label>渠道</mat-label><mat-select multiple [formControl]="channels"><mat-select-trigger>{{ channels.value?.[0] ?? '' }}@if ((channels.value?.length ?? 0) > 1) {<span class="muted"> (+{{ (channels.value?.length ?? 0) - 1 }})</span>}</mat-select-trigger>@for (channel of channelOptions; track channel) {<mat-option [value]="channel">{{ channel }}</mat-option>}</mat-select></mat-form-field></app-demo-card>
        <app-demo-card name="Autocomplete" hint="输入过滤"><mat-form-field appearance="outline" class="full"><mat-label>客户</mat-label><input matInput [formControl]="customerInput" [matAutocomplete]="customerAuto"><mat-autocomplete #customerAuto="matAutocomplete">@for (member of filteredMembers(); track member.email) {<mat-option [value]="member.name">{{ member.name }} <span class="muted">{{ member.email }}</span></mat-option>}</mat-autocomplete></mat-form-field></app-demo-card>
        <app-demo-card name="Combobox" hint="autocomplete + 自定义值"><mat-form-field appearance="outline" class="full"><mat-label>产品</mat-label><input matInput [formControl]="productInput" [matAutocomplete]="productAuto" placeholder="选择或输入"><mat-icon matSuffix svgIcon="chevron-down"></mat-icon><mat-autocomplete #productAuto="matAutocomplete">@for (product of filteredProducts(); track product) {<mat-option [value]="product">{{ product }}</mat-option>}@if (productInput.value && !products.includes(productInput.value)) {<mat-option [value]="productInput.value">使用「{{ productInput.value }}」</mat-option>}</mat-autocomplete></mat-form-field></app-demo-card>
        <app-demo-card name="Checkbox" hint="checked · indeterminate · disabled"><div class="stack tight"><mat-checkbox [checked]="allTasks()" [indeterminate]="someTasks()" (change)="toggleAllTasks($event.checked)">全部任务</mat-checkbox>@for (task of taskChecks; track task.title) {<mat-checkbox class="indent" [(ngModel)]="task.done">{{ task.title }}</mat-checkbox>}<mat-checkbox disabled checked>已锁定</mat-checkbox></div></app-demo-card>
        <app-demo-card name="Radio" hint="单选组 · 禁用"><mat-radio-group value="web" class="stack tight" aria-label="渠道">@for (channel of channelOptions; track channel) {<mat-radio-button [value]="channel" [disabled]="channel === 'api'">{{ channel }}</mat-radio-button>}</mat-radio-group></app-demo-card>
        <app-demo-card name="Switch" hint="slide-toggle"><div class="stack tight"><mat-slide-toggle checked>邮件通知</mat-slide-toggle><mat-slide-toggle>推送通知</mat-slide-toggle><mat-slide-toggle disabled checked>系统公告（必开）</mat-slide-toggle></div></app-demo-card>
        <app-demo-card name="Slider" hint="单值 · discrete · 区间 · 禁用"><div class="stack tight"><mat-slider min="0" max="100" class="full"><input matSliderThumb value="35"></mat-slider><mat-slider min="0" max="100" step="10" discrete showTickMarks class="full"><input matSliderThumb value="60"></mat-slider><mat-slider min="0" max="100" class="full"><input matSliderStartThumb value="20"><input matSliderEndThumb value="80"></mat-slider><mat-slider min="0" max="100" disabled class="full"><input matSliderThumb value="50"></mat-slider></div></app-demo-card>
        <app-demo-card name="Rating" hint="icon-button 星级"><div class="rating" role="radiogroup" aria-label="评分">@for (star of [1, 2, 3, 4, 5]; track star) {<button matIconButton type="button" (click)="rating.set(star)" [attr.aria-label]="star + ' 星'" [attr.aria-checked]="star === rating()" role="radio"><mat-icon [svgIcon]="star <= rating() ? 'star' : 'star-outline'"></mat-icon></button>}<span class="muted">{{ rating() }} / 5</span></div></app-demo-card>
        <app-demo-card name="DatePicker" hint="datepicker"><mat-form-field appearance="outline" class="full"><mat-label>日期</mat-label><input matInput [matDatepicker]="datePicker"><mat-datepicker-toggle matIconSuffix [for]="datePicker"></mat-datepicker-toggle><mat-datepicker #datePicker></mat-datepicker></mat-form-field></app-demo-card>
        <app-demo-card name="TimePicker" hint="timepicker"><mat-form-field appearance="outline" class="full"><mat-label>时间</mat-label><input matInput [matTimepicker]="timePicker"><mat-timepicker-toggle matIconSuffix [for]="timePicker"></mat-timepicker-toggle><mat-timepicker #timePicker></mat-timepicker></mat-form-field></app-demo-card>
        <app-demo-card name="DateRangePicker" hint="date-range-input"><mat-form-field appearance="outline" class="full"><mat-label>日期范围</mat-label><mat-date-range-input [rangePicker]="rangePicker"><input matStartDate placeholder="开始"><input matEndDate placeholder="结束"></mat-date-range-input><mat-datepicker-toggle matIconSuffix [for]="rangePicker"></mat-datepicker-toggle><mat-date-range-picker #rangePicker></mat-date-range-picker></mat-form-field></app-demo-card>
        <app-demo-card name="ColorPicker" hint="原生 color + 预设"><div class="color-picker"><input type="color" [value]="color()" (input)="color.set($any($event.target).value)" aria-label="选择颜色"><span class="color-value">{{ color() }}</span></div><mat-chip-listbox aria-label="预设颜色" (change)="color.set($event.value)">@for (preset of presetColors; track preset) {<mat-chip-option [value]="preset" [selected]="preset === color()"><span class="swatch" [style.background]="preset"></span>{{ preset }}</mat-chip-option>}</mat-chip-listbox></app-demo-card>
        <app-demo-card name="Upload" hint="拖拽区 + 文件列表"><div class="upload-zone" [class.dragging]="dragging()" (dragover)="$event.preventDefault(); dragging.set(true)" (dragleave)="dragging.set(false)" (drop)="onDrop($event)"><input #fileInput type="file" hidden multiple (change)="selectFiles(fileInput.files)"><mat-icon svgIcon="upload"></mat-icon><p>拖拽文件到这里，或 <button matButton type="button" (click)="fileInput.click()">选择文件</button></p></div>@if (files().length) {<mat-list>@for (file of files(); track file.name) {<mat-list-item><mat-icon matListItemIcon svgIcon="paper"></mat-icon><span matListItemTitle>{{ file.name }}</span><span matListItemLine>{{ file.size / 1024 | number: '1.0-0' }} KB</span><button matIconButton matListItemMeta (click)="removeFile(file)" aria-label="移除"><mat-icon svgIcon="x"></mat-icon></button></mat-list-item>}</mat-list>}</app-demo-card>
        <app-demo-card name="Cascader" hint="级联 mat-menu"><button matButton="outlined" [matMenuTriggerFor]="cascadeMenu"><mat-icon svgIcon="filter"></mat-icon>{{ cascade() || '选择渠道 / 状态' }}<mat-icon svgIcon="chevron-down"></mat-icon></button><mat-menu #cascadeMenu="matMenu">@for (channel of channelOptions; track channel) {<button mat-menu-item [matMenuTriggerFor]="cascadeStatus" (mouseenter)="cascadeChannel = channel">{{ channel }}</button>}</mat-menu><mat-menu #cascadeStatus="matMenu">@for (status of statusOptions; track status) {<button mat-menu-item (click)="cascade.set(cascadeChannel + ' / ' + status)">{{ status }}</button>}</mat-menu></app-demo-card>
        <app-demo-card name="Transfer" hint="双栏 selection-list 穿梭" [wide]="true"><div class="transfer"><mat-selection-list #leftList class="transfer-list" aria-label="候选成员">@for (member of transferLeft(); track member) {<mat-list-option [value]="member">{{ member }}</mat-list-option>}</mat-selection-list><div class="transfer-actions"><button matIconButton (click)="moveRight(leftList)" [disabled]="!leftList.selectedOptions.selected.length" aria-label="移到右侧"><mat-icon svgIcon="chevron-right"></mat-icon></button><button matIconButton (click)="moveLeft(rightList)" [disabled]="!rightList.selectedOptions.selected.length" aria-label="移到左侧"><mat-icon svgIcon="chevron-left"></mat-icon></button></div><mat-selection-list #rightList class="transfer-list" aria-label="已选成员">@for (member of transferRight(); track member) {<mat-list-option [value]="member">{{ member }}</mat-list-option>} @empty {<p class="muted transfer-empty">暂无已选成员</p>}</mat-selection-list></div></app-demo-card>
        <app-demo-card name="Mention" hint="输入 &#64; 触发成员建议"><mat-form-field appearance="outline" class="full"><mat-label>评论</mat-label><input matInput [formControl]="mentionInput" [matAutocomplete]="mentionAuto" placeholder="输入 &#64; 提及成员"><mat-autocomplete #mentionAuto="matAutocomplete" (optionSelected)="applyMention($event.option.value)">@for (member of mentionMatches(); track member.email) {<mat-option [value]="member.name"><span class="avatar small">{{ member.name.slice(0, 1) }}</span>{{ member.name }}</mat-option>}</mat-autocomplete><mat-hint>&#64; 之后开始过滤</mat-hint></mat-form-field></app-demo-card>
        <app-demo-card name="PinInput" hint="6 位验证码"><div class="pin-row" (paste)="onPinPaste($event)">@for (index of pinIndexes; track index) {<input class="pin-cell" inputmode="numeric" maxlength="1" [value]="pin()[index] ?? ''" (input)="onPin(index, $event)" [attr.aria-label]="'第 ' + (index + 1) + ' 位'">}</div><p class="muted">已输入 {{ pin().join('').length }} / 6</p></app-demo-card>
        <app-demo-card name="Form" hint="垂直 · 水平 · 内联布局" [wide]="true"><div class="form-layouts"><form class="stack tight"><b>垂直</b><mat-form-field appearance="outline"><mat-label>姓名</mat-label><input matInput required></mat-form-field><mat-form-field appearance="outline"><mat-label>邮箱</mat-label><input matInput type="email" required></mat-form-field></form><form class="form-horizontal"><b>水平</b><label>姓名<mat-form-field appearance="outline" subscriptSizing="dynamic"><input matInput required></mat-form-field></label><label>邮箱<mat-form-field appearance="outline" subscriptSizing="dynamic"><input matInput required></mat-form-field></label></form><form class="form-inline"><b>内联</b><div class="demo-row wrap"><mat-form-field appearance="outline" subscriptSizing="dynamic"><mat-label>关键词</mat-label><input matInput></mat-form-field><button matButton="filled">搜索</button></div></form></div></app-demo-card>
      </section>

      <h2 class="section-title" id="s-data">数据展示</h2>
      <section class="component-grid">
        <app-demo-card name="Table" hint="排序 · 分页" [wide]="true"><div class="table-wrap"><table mat-table [dataSource]="tableDataSource" matSort><ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef mat-sort-header>订单</th><td mat-cell *matCellDef="let row">{{ row.id }}</td></ng-container><ng-container matColumnDef="customer"><th mat-header-cell *matHeaderCellDef mat-sort-header>客户</th><td mat-cell *matCellDef="let row">{{ row.customer }}</td></ng-container><ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef mat-sort-header>金额</th><td mat-cell *matCellDef="let row">¥{{ row.amount | number: '1.2-2' }}</td></ng-container><ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>状态</th><td mat-cell *matCellDef="let row"><span class="status" [class.status-success]="row.status === 'paid'">{{ row.status }}</span></td></ng-container><tr mat-header-row *matHeaderRowDef="tableColumns"></tr><tr mat-row *matRowDef="let row; columns: tableColumns"></tr></table></div><mat-paginator [pageSize]="4" [pageSizeOptions]="[4, 8]"></mat-paginator></app-demo-card>
        <app-demo-card name="DataGrid" hint="sticky header · 选择列 · 滚动" [wide]="true"><div class="table-wrap grid-scroll"><table mat-table [dataSource]="gridRows"><ng-container matColumnDef="select" sticky><th mat-header-cell *matHeaderCellDef><mat-checkbox [checked]="gridSelected().size === gridRows.length" [indeterminate]="gridSelected().size > 0 && gridSelected().size < gridRows.length" (change)="toggleAllGrid($event.checked)" aria-label="全选"></mat-checkbox></th><td mat-cell *matCellDef="let row"><mat-checkbox [checked]="gridSelected().has(row.id)" (change)="toggleGrid(row.id)" [attr.aria-label]="'选择 ' + row.id"></mat-checkbox></td></ng-container>@for (column of gridColumns; track column) {<ng-container [matColumnDef]="column"><th mat-header-cell *matHeaderCellDef>{{ column }}</th><td mat-cell *matCellDef="let row">{{ row[column] }}</td></ng-container>}<tr mat-header-row *matHeaderRowDef="['select', ...gridColumns]; sticky: true"></tr><tr mat-row *matRowDef="let row; columns: ['select', ...gridColumns]"></tr></table></div><p class="muted">已选择 {{ gridSelected().size }} 行</p></app-demo-card>
        <app-demo-card name="Descriptions" hint="键值描述列表"><dl class="descriptions">@for (item of descriptionItems; track item[0]) {<div><dt class="muted">{{ item[0] }}</dt><dd>{{ item[1] }}</dd></div>}</dl></app-demo-card>
        <app-demo-card name="List" hint="双行 · 导航 · 选择"><mat-list><mat-list-item><mat-icon matListItemIcon svgIcon="home"></mat-icon><span matListItemTitle>单行列表</span><span matListItemLine>双行说明</span></mat-list-item><mat-list-item><mat-icon matListItemIcon svgIcon="users"></mat-icon><span matListItemTitle>团队成员</span><span matListItemMeta>{{ members.length }}</span></mat-list-item></mat-list><mat-divider></mat-divider><mat-selection-list aria-label="偏好"><mat-list-option selected>邮件摘要</mat-list-option><mat-list-option>周报</mat-list-option></mat-selection-list><mat-divider></mat-divider><p class="muted">可拖拽排序（CDK DragDrop）</p><div cdkDropList class="drag-list" (cdkDropListDropped)="drop($event)">@for (item of dragItems; track item) {<div cdkDrag class="drag-item"><mat-icon svgIcon="menu"></mat-icon>{{ item }}</div>}</div></app-demo-card>
        <app-demo-card name="Card" hint="媒体 · 操作栏 · outlined" [wide]="true"><div class="card-layouts"><mat-card><div class="placeholder-image" mat-card-image></div><mat-card-header><mat-card-title>{{ landingContent.features[0].title }}</mat-card-title><mat-card-subtitle>媒体卡片</mat-card-subtitle></mat-card-header><mat-card-content><p class="muted">{{ landingContent.features[0].desc }}</p></mat-card-content><mat-card-actions align="end"><button matButton>分享</button><button matButton="filled">查看</button></mat-card-actions></mat-card><mat-card appearance="outlined"><mat-card-header><span class="avatar" mat-card-avatar>{{ members[0].name.slice(0, 1) }}</span><mat-card-title>{{ members[0].name }}</mat-card-title><mat-card-subtitle>{{ members[0].role }} · outlined</mat-card-subtitle></mat-card-header><mat-card-content><p class="muted">{{ members[0].email }}</p></mat-card-content><mat-card-footer><mat-progress-bar mode="determinate" value="72"></mat-progress-bar></mat-card-footer></mat-card><mat-card class="card-horizontal"><div class="placeholder-image square"></div><div><mat-card-header><mat-card-title>{{ landingContent.features[2].title }}</mat-card-title><mat-card-subtitle>横向布局</mat-card-subtitle></mat-card-header><mat-card-content><p class="muted">{{ landingContent.features[2].desc }}</p></mat-card-content></div></mat-card></div></app-demo-card>
        <app-demo-card name="Avatar" hint="尺寸 · 图标 · 状态"><div class="demo-row wrap"><span class="avatar small">{{ members[0].name.slice(0, 1) }}</span><span class="avatar">{{ members[1].name.slice(0, 1) }}</span><span class="avatar large">{{ members[2].name.slice(0, 1) }}</span><span class="avatar large"><mat-icon svgIcon="user"></mat-icon></span><span class="avatar-status"><span class="avatar">{{ members[3].name.slice(0, 1) }}</span><span class="status-dot"></span></span></div></app-demo-card>
        <app-demo-card name="AvatarGroup" hint="堆叠 + 剩余数"><div class="avatar-stack">@for (member of members.slice(0, 4); track member.email) {<span class="avatar" [matTooltip]="member.name">{{ member.name.slice(0, 1) }}</span>}<span class="avatar more">+{{ members.length - 4 }}</span></div></app-demo-card>
        <app-demo-card name="Badge" hint="数字 · 点 · 颜色 · 位置"><div class="demo-row wrap badge-row"><button matButton matBadge="8" matBadgeColor="warn">收件箱</button><button matIconButton matBadge="99+" matBadgeColor="primary" aria-label="通知"><mat-icon svgIcon="bell"></mat-icon></button><span matBadge="•" matBadgeSize="small" matBadgePosition="above before" class="badge-text">有更新</span><button matIconButton matBadge="2" [matBadgeHidden]="true" aria-label="隐藏角标"><mat-icon svgIcon="mail"></mat-icon></button></div></app-demo-card>
        <app-demo-card name="Tag" hint="chip-set · 可删除 · 可选"><div class="stack tight"><mat-chip-set aria-label="标签"><mat-chip color="primary" highlighted>Design</mat-chip><mat-chip>Engineering</mat-chip><mat-chip color="warn" highlighted>Blocked</mat-chip><mat-chip disabled>Archived</mat-chip></mat-chip-set><mat-chip-grid #tagGrid aria-label="可删除标签">@for (tag of tags(); track tag) {<mat-chip-row (removed)="removeTag(tag)">{{ tag }}<button matChipRemove [attr.aria-label]="'移除 ' + tag"><mat-icon svgIcon="x"></mat-icon></button></mat-chip-row>}<input placeholder="新标签…" [matChipInputFor]="tagGrid" (matChipInputTokenEnd)="addTag($event)"></mat-chip-grid><mat-chip-listbox multiple aria-label="筛选"><mat-chip-option selected>web</mat-chip-option><mat-chip-option>ios</mat-chip-option><mat-chip-option>android</mat-chip-option></mat-chip-listbox></div></app-demo-card>
        <app-demo-card name="Statistic" hint="stats.json 指标"><div class="stat-grid">@for (stat of statistics.slice(0, 4); track stat.key) {<div class="stat"><span class="muted">{{ stat.label }}</span><b>{{ stat.unit === 'CNY' ? '¥' : '' }}{{ stat.value | number }}</b><span class="chip" [class.negative]="stat.delta < 0" [class.positive]="stat.delta >= 0"><mat-icon [svgIcon]="stat.delta >= 0 ? 'trending-up' : 'trending-down'"></mat-icon>{{ stat.delta >= 0 ? '+' : '' }}{{ stat.delta }}%</span></div>}</div></app-demo-card>
        <app-demo-card name="Timeline" hint="activity.json 时间线"><ol class="timeline">@for (item of activities.slice(0, 4); track item.action) {<li><span class="timeline-dot"></span><div><b>{{ item.user }}</b> {{ item.action }}<small class="muted">{{ item.time }}</small></div></li>}</ol></app-demo-card>
        <app-demo-card name="Tree" hint="嵌套树 · 展开/折叠"><mat-tree [dataSource]="treeData" [treeControl]="treeControl"><mat-nested-tree-node *matTreeNodeDef="let node"><div class="tree-row"><span class="tree-spacer"></span>{{ node.name }}</div></mat-nested-tree-node><mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild"><div class="tree-row"><button matIconButton matTreeNodeToggle [attr.aria-label]="'展开 ' + node.name"><mat-icon [svgIcon]="treeControl.isExpanded(node) ? 'chevron-down' : 'chevron-right'"></mat-icon></button>{{ node.name }}</div><div [class.tree-invisible]="!treeControl.isExpanded(node)" role="group"><ng-container matTreeNodeOutlet></ng-container></div></mat-nested-tree-node></mat-tree></app-demo-card>
        <app-demo-card name="Calendar" hint="内联 mat-calendar"><mat-calendar class="inline-calendar" [(selected)]="calendarDate"></mat-calendar><p class="muted">已选：{{ calendarDate | date: 'yyyy-MM-dd' }}</p></app-demo-card>
        <app-demo-card name="Image" hint="占位 + 预览 Dialog"><figure class="image-figure"><button class="image-button" (click)="previewImage()" aria-label="预览图片"><div class="placeholder-image"><mat-icon svgIcon="image"></mat-icon></div></button><figcaption class="muted">点击图片放大预览</figcaption></figure></app-demo-card>
        <app-demo-card name="Carousel" hint="评价轮播 · 前后切换 · 指示点"><div class="carousel"><button matIconButton (click)="slide(-1)" aria-label="上一条"><mat-icon svgIcon="chevron-left"></mat-icon></button><div class="carousel-slide"><p>“{{ landingContent.testimonials[slideIndex()].quote }}”</p><div class="demo-row"><span class="avatar small">{{ landingContent.testimonials[slideIndex()].name.slice(0, 1) }}</span><b>{{ landingContent.testimonials[slideIndex()].name }}</b><small class="muted">{{ landingContent.testimonials[slideIndex()].company }}</small></div></div><button matIconButton (click)="slide(1)" aria-label="下一条"><mat-icon svgIcon="chevron-right"></mat-icon></button></div><div class="carousel-dots" role="tablist">@for (item of landingContent.testimonials; track item.name; let i = $index) {<button class="dot" [class.active]="i === slideIndex()" (click)="slideIndex.set(i)" [attr.aria-label]="'第 ' + (i + 1) + ' 条'" role="tab"></button>}</div></app-demo-card>
        <app-demo-card name="Empty" hint="空态 + 操作"><div class="empty-state"><span class="empty-icon"><mat-icon svgIcon="inbox"></mat-icon></span><h3>没有找到订单</h3><p class="muted">试试调整筛选条件，或创建一笔新订单。</p><button matButton="filled"><mat-icon svgIcon="plus"></mat-icon>新建订单</button></div></app-demo-card>
        <app-demo-card name="Tooltip" hint="四个方向 · 延迟"><div class="demo-row wrap"><button matButton="outlined" matTooltip="上方提示" matTooltipPosition="above">above</button><button matButton="outlined" matTooltip="下方提示" matTooltipPosition="below">below</button><button matButton="outlined" matTooltip="左侧提示" matTooltipPosition="left">left</button><button matButton="outlined" matTooltip="右侧提示" matTooltipPosition="right">right</button><button matButton="outlined" matTooltip="禁用状态" matTooltipDisabled>disabled</button></div></app-demo-card>
        <app-demo-card name="Popover" hint="mat-menu 富内容浮层"><button matButton="outlined" [matMenuTriggerFor]="popover"><mat-icon svgIcon="user"></mat-icon>{{ members[0].name }}</button><mat-menu #popover="matMenu" class="popover-panel"><div class="popover-card" (click)="$event.stopPropagation()"><div class="demo-row"><span class="avatar">{{ members[0].name.slice(0, 1) }}</span><div><b>{{ members[0].name }}</b><small class="muted block">{{ members[0].email }}</small></div></div><p class="muted">{{ members[0].role }} · 最近活跃 {{ members[0].lastActive }}</p><button matButton="tonal">发送消息</button></div></mat-menu></app-demo-card>
      </section>

      <h2 class="section-title" id="s-feedback">反馈</h2>
      <section class="component-grid">
        <app-demo-card name="Alert" hint="info · success · warning · error" [wide]="true"><div class="stack tight"><div class="alert alert-info" role="status"><mat-icon svgIcon="info"></mat-icon><div><b>信息</b><p>{{ notices[2].title }}</p></div></div><div class="alert alert-success" role="status"><mat-icon svgIcon="check"></mat-icon><div><b>成功</b><p>{{ notices[0].title }}</p></div></div><div class="alert alert-warning" role="status"><mat-icon svgIcon="warning"></mat-icon><div><b>警告</b><p>{{ notices[1].title }}</p></div><button matButton>查看</button></div><div class="alert alert-error" role="alert"><mat-icon svgIcon="error"></mat-icon><div><b>错误</b><p>订单加载失败，请重试。</p></div><button matIconButton aria-label="关闭"><mat-icon svgIcon="x"></mat-icon></button></div></div></app-demo-card>
        <app-demo-card name="Toast" hint="snackbar 4 级 + 带操作"><div class="demo-row wrap"><button matButton="outlined" (click)="toast('info', '已同步最新数据')">info</button><button matButton="outlined" (click)="toast('success', '保存成功')">success</button><button matButton="outlined" (click)="toast('warning', '网络不稳定')">warning</button><button matButton="outlined" (click)="toast('error', '删除失败')">error</button><button matButton="filled" (click)="toast('action', '订单已归档', '撤销')">带操作</button></div></app-demo-card>
        <app-demo-card name="Notification" hint="通知列表 + 推送"><mat-list class="notification-list">@for (notice of notices.slice(0, 3); track notice.title) {<mat-list-item><mat-icon matListItemIcon svgIcon="bell"></mat-icon><span matListItemTitle>{{ notice.title }}</span><span matListItemLine>{{ notice.time }}</span>@if (notice.unread) {<span matListItemMeta class="unread-dot"></span>}</mat-list-item>}</mat-list><button matButton="tonal" (click)="pushNotification()"><mat-icon svgIcon="bell"></mat-icon>推送一条通知</button></app-demo-card>
        <app-demo-card name="Dialog" hint="普通 · 确认 · 全屏 · 可滚动"><div class="demo-row wrap"><button matButton="outlined" (click)="openDialog('basic')">普通</button><button matButton="outlined" (click)="openDialog('confirm')">确认</button><button matButton="outlined" (click)="openDialog('fullscreen')">全屏</button><button matButton="outlined" (click)="openDialog('scroll')">可滚动</button><button matButton="outlined" (click)="openSheet()">Bottom sheet</button></div></app-demo-card>
        <app-demo-card name="Drawer" hint="sidenav start / end · bottom sheet" [wide]="true"><div class="demo-row wrap"><button matButton="outlined" (click)="startDrawer.toggle()">左侧</button><button matButton="outlined" (click)="endDrawer.toggle()">右侧</button><button matButton="outlined" (click)="openSheet()">底部</button></div><mat-sidenav-container class="drawer-stage"><mat-sidenav #startDrawer mode="over" position="start" class="stage-drawer"><h3>左侧抽屉</h3><p class="muted">mode="over" · position="start"</p><button matButton (click)="startDrawer.close()">关闭</button></mat-sidenav><mat-sidenav #endDrawer mode="over" position="end" class="stage-drawer"><h3>右侧抽屉</h3><p class="muted">mode="over" · position="end"</p><button matButton (click)="endDrawer.close()">关闭</button></mat-sidenav><mat-sidenav-content class="stage-content"><p class="muted">在此区域内打开抽屉</p></mat-sidenav-content></mat-sidenav-container></app-demo-card>
        <app-demo-card name="Progress" hint="线性 · 缓冲 · 环形 · 步骤"><div class="stack tight progress-stack"><div class="spread"><span class="muted">上传进度</span><b>68%</b></div><mat-progress-bar mode="determinate" value="68"></mat-progress-bar><div class="spread"><span class="muted">缓冲 40 / 75</span></div><mat-progress-bar mode="buffer" value="40" bufferValue="75"></mat-progress-bar><div class="demo-row"><mat-progress-spinner diameter="40" mode="determinate" value="72"></mat-progress-spinner><mat-progress-spinner diameter="40" mode="determinate" value="35" color="warn"></mat-progress-spinner><mat-progress-spinner diameter="40" mode="indeterminate"></mat-progress-spinner><span class="muted">72% · 35% · 加载中</span></div><ol class="step-progress" aria-label="步骤进度"><li class="done"><mat-icon svgIcon="check"></mat-icon>创建</li><li class="done"><mat-icon svgIcon="check"></mat-icon>审核</li><li class="current"><span>3</span>发布</li><li><span>4</span>完成</li></ol></div></app-demo-card>
        <app-demo-card name="Spinner" hint="尺寸 · 颜色"><div class="demo-row wrap"><mat-spinner diameter="20"></mat-spinner><mat-spinner diameter="32"></mat-spinner><mat-spinner diameter="48"></mat-spinner><mat-spinner diameter="32" color="warn"></mat-spinner></div></app-demo-card>
        <app-demo-card name="Skeleton" hint="文本 · 头像 · 卡片"><div class="skeleton-demo"><div class="demo-row"><span class="skeleton circle"></span><div class="stack tight grow"><span class="skeleton line"></span><span class="skeleton line short"></span></div></div><span class="skeleton block"></span></div></app-demo-card>
        <app-demo-card name="Result" hint="成功 · 失败"><div class="result-row"><div class="result"><span class="result-icon success"><mat-icon svgIcon="check"></mat-icon></span><h3>发布成功</h3><p class="muted">活动已创建</p><button matButton="filled">查看</button></div><div class="result"><span class="result-icon error"><mat-icon svgIcon="error"></mat-icon></span><h3>提交失败</h3><p class="muted">请稍后重试</p><button matButton="outlined">重试</button></div></div></app-demo-card>
        <app-demo-card name="Popconfirm" hint="菜单式确认气泡"><button matButton="outlined" color="warn" [matMenuTriggerFor]="popconfirm" #popTrigger="matMenuTrigger"><mat-icon svgIcon="trash"></mat-icon>删除订单</button><mat-menu #popconfirm="matMenu"><div class="popover-card" (click)="$event.stopPropagation()"><div class="demo-row"><mat-icon svgIcon="warning"></mat-icon><b>确定删除这条订单？</b></div><div class="demo-row popconfirm-actions"><button matButton (click)="popTrigger.closeMenu()">取消</button><button matButton="filled" color="warn" (click)="popTrigger.closeMenu(); confirmDelete()">删除</button></div></div></mat-menu></app-demo-card>
      </section>

      <h2 class="section-title" id="s-nav">导航</h2>
      <section class="component-grid">
        <app-demo-card name="Menu" hint="下拉 · 嵌套 · 垂直导航"><div class="demo-row wrap"><button matButton="filled" [matMenuTriggerFor]="menu">打开菜单</button><mat-menu #menu="matMenu"><button mat-menu-item (click)="notify('编辑')"><mat-icon svgIcon="edit"></mat-icon>编辑</button><button mat-menu-item [matMenuTriggerFor]="nestedMenu"><mat-icon svgIcon="more-vertical"></mat-icon>更多</button><mat-divider></mat-divider><button mat-menu-item disabled><mat-icon svgIcon="trash"></mat-icon>删除</button></mat-menu><mat-menu #nestedMenu="matMenu"><button mat-menu-item>导出</button><button mat-menu-item>复制链接</button></mat-menu></div><mat-nav-list class="vertical-menu">@for (item of navItems.slice(0, 4); track item.key) {<a mat-list-item [activated]="item.key === 'dashboard'"><mat-icon matListItemIcon [svgIcon]="item.icon"></mat-icon><span matListItemTitle>{{ item.label }}</span>@if (item.badge) {<span matListItemMeta class="chip">{{ item.badge }}</span>}</a>}</mat-nav-list></app-demo-card>
        <app-demo-card name="Dropdown" hint="下拉选择型菜单"><button matButton="outlined" [matMenuTriggerFor]="dropdown">{{ sortBy() }}<mat-icon svgIcon="chevron-down"></mat-icon></button><mat-menu #dropdown="matMenu">@for (option of sortOptions; track option) {<button mat-menu-item (click)="sortBy.set(option)"><mat-icon [svgIcon]="option === sortBy() ? 'check' : 'clear'" [class.invisible]="option !== sortBy()"></mat-icon>{{ option }}</button>}</mat-menu></app-demo-card>
        <app-demo-card name="Breadcrumb" hint="链接 + 分隔符"><nav class="breadcrumbs" aria-label="面包屑"><a routerLink="/">仪表盘</a><mat-icon svgIcon="chevron-right"></mat-icon><a routerLink="/orders">订单</a><mat-icon svgIcon="chevron-right"></mat-icon><span aria-current="page">{{ rows[0].id }}</span></nav></app-demo-card>
        <app-demo-card name="Tabs" hint="默认 · 拉伸 · 图标 · 禁用" [wide]="true"><mat-tab-group animationDuration="0ms"><mat-tab label="概览"><p class="tab-body">概览内容</p></mat-tab><mat-tab label="活动"><p class="tab-body">活动内容</p></mat-tab><mat-tab label="禁用" disabled></mat-tab></mat-tab-group><mat-tab-group animationDuration="0ms" mat-stretch-tabs><mat-tab><ng-template mat-tab-label><mat-icon svgIcon="home"></mat-icon>&nbsp;首页</ng-template><p class="tab-body">拉伸标签 + 图标</p></mat-tab><mat-tab><ng-template mat-tab-label><mat-icon svgIcon="bell"></mat-icon>&nbsp;通知</ng-template><p class="tab-body">通知内容</p></mat-tab></mat-tab-group></app-demo-card>
        <app-demo-card name="Pagination" hint="独立 paginator"><mat-paginator [length]="rows.length * 12" [pageSize]="10" [pageIndex]="paginatorIndex()" (page)="paginatorIndex.set($event.pageIndex)" [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons aria-label="分页"></mat-paginator><p class="muted">当前第 {{ paginatorIndex() + 1 }} 页</p></app-demo-card>
        <app-demo-card name="Steps" hint="横向 · 纵向 stepper" [wide]="true"><mat-stepper [selectedIndex]="1" animationDuration="0ms"><ng-template matStepperIcon="edit"><mat-icon svgIcon="pencil"></mat-icon></ng-template><ng-template matStepperIcon="done"><mat-icon svgIcon="check"></mat-icon></ng-template><mat-step label="基本信息" [completed]="true"></mat-step><mat-step label="详细配置"></mat-step><mat-step label="确认"></mat-step></mat-stepper><mat-stepper orientation="vertical" [selectedIndex]="0" animationDuration="0ms"><ng-template matStepperIcon="edit"><mat-icon svgIcon="pencil"></mat-icon></ng-template><ng-template matStepperIcon="done"><mat-icon svgIcon="check"></mat-icon></ng-template><mat-step label="创建活动"><p class="muted">纵向步骤内容</p></mat-step><mat-step label="邀请成员" optional></mat-step></mat-stepper></app-demo-card>
        <app-demo-card name="Navbar" hint="mat-toolbar 应用栏" [wide]="true"><mat-toolbar class="demo-toolbar"><button matIconButton aria-label="菜单"><mat-icon svgIcon="menu"></mat-icon></button><span>Acme Console</span><span class="toolbar-spacer"></span><button matIconButton aria-label="搜索"><mat-icon svgIcon="search"></mat-icon></button><button matIconButton matBadge="2" matBadgeColor="warn" aria-label="通知"><mat-icon svgIcon="bell"></mat-icon></button><span class="avatar small">{{ members[0].name.slice(0, 1) }}</span></mat-toolbar><mat-toolbar color="primary" class="demo-toolbar"><span>主色应用栏</span><span class="toolbar-spacer"></span><button matButton>登录</button></mat-toolbar></app-demo-card>
        <app-demo-card name="Sidebar" hint="side 模式 sidenav + 导航列表"><mat-sidenav-container class="sidebar-stage"><mat-sidenav mode="side" opened class="sidebar-demo"><mat-nav-list>@for (item of navItems.slice(0, 5); track item.key) {<a mat-list-item [activated]="item.key === 'orders'"><mat-icon matListItemIcon [svgIcon]="item.icon"></mat-icon><span matListItemTitle>{{ item.label }}</span></a>}</mat-nav-list></mat-sidenav><mat-sidenav-content class="stage-content"><p class="muted">内容区域</p></mat-sidenav-content></mat-sidenav-container></app-demo-card>
        <app-demo-card name="Anchor" hint="页内锚点导航"><nav class="anchor-nav" aria-label="分节锚点">@for (section of sections; track section.id) {<a [href]="'#' + section.id" (click)="scrollToId(section.id, $event)">{{ section.label }}</a>}</nav></app-demo-card>
        <app-demo-card name="BackTop" hint="滚动后显示的回顶按钮"><p class="muted">向下滚动 400px 后右下角出现回到顶部按钮。</p><button matButton="tonal" (click)="backTop()"><mat-icon svgIcon="chevron-up"></mat-icon>回到顶部</button></app-demo-card>
        <app-demo-card name="Affix" hint="position: sticky 固定"><div class="affix-stage"><div class="affix-bar">固定在滚动容器顶部</div>@for (item of activities; track item.action) {<p class="muted">{{ item.user }} {{ item.action }}</p>}</div></app-demo-card>
        <app-demo-card name="CommandPalette" hint="Ctrl/⌘ + K 打开"><button matButton="outlined" (click)="openCommandPalette()"><mat-icon svgIcon="search"></mat-icon>搜索命令<span class="kbd">⌘K</span></button></app-demo-card>
      </section>

      <h2 class="section-title" id="s-layout">布局</h2>
      <section class="component-grid">
        <app-demo-card name="Grid" hint="mat-grid-list 4 列"><mat-grid-list cols="4" rowHeight="56px" gutterSize="8px"><mat-grid-tile colspan="2" class="tile">2 / 4</mat-grid-tile><mat-grid-tile class="tile">1</mat-grid-tile><mat-grid-tile class="tile">1</mat-grid-tile><mat-grid-tile class="tile">1</mat-grid-tile><mat-grid-tile colspan="3" class="tile">3 / 4</mat-grid-tile></mat-grid-list></app-demo-card>
        <app-demo-card name="Layout" hint="header · sidebar · content · footer"><div class="layout-demo"><div class="layout-header">Header</div><div class="layout-body"><div class="layout-side">Sidebar</div><div class="layout-main">Content</div></div><div class="layout-footer">Footer</div></div></app-demo-card>
        <app-demo-card name="Stack" hint="纵向 · 横向 · 间距"><div class="stack tight"><div class="demo-row"><span class="chip">A</span><span class="chip">B</span><span class="chip">C</span></div><div class="stack xs"><span class="chip">A</span><span class="chip">B</span></div></div></app-demo-card>
        <app-demo-card name="Container" hint="max-width 容器"><div class="container-demo"><div class="container sm">sm · 480</div><div class="container md">md · 720</div><div class="container lg">lg · 100%</div></div></app-demo-card>
        <app-demo-card name="AspectRatio" hint="16:9 · 1:1"><div class="demo-row wrap ratio-row"><div class="ratio ratio-16-9">16:9</div><div class="ratio ratio-1-1">1:1</div></div></app-demo-card>
        <app-demo-card name="ScrollArea" hint="固定高度滚动 + 虚拟滚动"><div class="scroll-area">@for (row of rows; track row.id) {<p>{{ row.id }} · {{ row.customer }}</p>}</div><cdk-virtual-scroll-viewport itemSize="36" class="virtual-viewport"><div *cdkVirtualFor="let item of virtualItems" class="virtual-row">Virtual row {{ item }}</div></cdk-virtual-scroll-viewport></app-demo-card>
        <app-demo-card name="Accordion" hint="多开 · 禁用"><mat-accordion multi>@for (item of landingContent.faq.slice(0, 3); track item.q; let i = $index) {<mat-expansion-panel [expanded]="i === 0"><mat-expansion-panel-header><mat-panel-title>{{ item.q }}</mat-panel-title></mat-expansion-panel-header><p class="muted">{{ item.a }}</p></mat-expansion-panel>}<mat-expansion-panel disabled><mat-expansion-panel-header><mat-panel-title>禁用面板</mat-panel-title></mat-expansion-panel-header></mat-expansion-panel></mat-accordion></app-demo-card>
        <app-demo-card name="Resizable" hint="Angular Material 无 Splitter"><p class="muted">Angular Material / CDK 未提供可拖拽分栏组件。</p></app-demo-card>
      </section>

      <h2 class="section-title" id="s-misc">其他</h2>
      <section class="component-grid">
        <app-demo-card name="ThemeProvider" hint="mat.theme 暗色/主色令牌" [wide]="true"><div class="demo-row wrap"><button matButton="filled" (click)="settings.toggle()"><mat-icon [svgIcon]="settings.theme() === 'dark' ? 'sun' : 'moon'"></mat-icon>切换到{{ settings.theme() === 'dark' ? '亮色' : '暗色' }}</button><span class="muted">当前 {{ settings.theme() }} · 字体 {{ settings.font() }} · 图标 {{ settings.iconSet() }}</span></div><div class="swatches">@for (token of tokens; track token) {<div class="swatch-item"><span class="swatch-box" [style.background]="'var(--mat-sys-' + token + ')'"></span><code>{{ token }}</code></div>}</div></app-demo-card>
        <app-demo-card name="QRCode" hint="Angular Material 无 QRCode"><p class="muted">需第三方库生成二维码，本库未提供。</p></app-demo-card>
        <app-demo-card name="Watermark" hint="Angular Material 无 Watermark"><p class="muted">本库未提供水印组件。</p></app-demo-card>
        <app-demo-card name="Tour" hint="Angular Material 无 Tour"><p class="muted">本库未提供引导/漫游组件。</p></app-demo-card>
      </section>
      @if (showBackTop()) {<button matMiniFab class="back-top" (click)="backTop()" aria-label="回到顶部"><mat-icon svgIcon="chevron-up"></mat-icon></button>}
    </main>
  `,
})
export class ComponentsPage implements AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  readonly settings = inject(UrlSettingsService);
  readonly componentEntries = Object.entries(coverage);
  readonly landingContent = landing;
  readonly members = team;
  readonly rows = orders.slice(0, 8);
  readonly statistics = stats;
  readonly activities = activity;
  readonly notices = notifications;
  readonly navItems = nav;
  readonly sections = [
    { id: 's-typography', label: '排版' }, { id: 's-buttons', label: '按钮' }, { id: 's-forms', label: '表单控件' },
    { id: 's-data', label: '数据展示' }, { id: 's-feedback', label: '反馈' }, { id: 's-nav', label: '导航' }, { id: 's-layout', label: '布局' }, { id: 's-misc', label: '其他' },
  ];
  readonly codeSample = "@Component({ selector: 'app-root' })\nexport class App {}";
  readonly tokens = ['primary', 'primary-container', 'secondary-container', 'tertiary', 'tertiary-container', 'error', 'error-container', 'surface-container', 'surface-variant', 'outline'];
  readonly channelOptions = ['web', 'ios', 'android', 'api'];
  readonly statusOptions = ['paid', 'pending', 'refunded', 'failed', 'shipped'];
  readonly products = [...new Set(orders.map((order) => order.product))];
  readonly sortOptions = ['按日期排序', '按金额排序', '按客户排序'];
  readonly presetColors = ['#005cbb', '#6750a4', '#386a20', '#b3261e'];
  readonly pinIndexes = [0, 1, 2, 3, 4, 5];
  readonly descriptionItems: [string, string][] = [
    ['订单号', orders[0].id], ['客户', orders[0].customer], ['产品', orders[0].product],
    ['金额', `¥${orders[0].amount.toLocaleString()}`], ['状态', orders[0].status], ['渠道', orders[0].channel],
  ];
  readonly tableColumns = ['id', 'customer', 'amount', 'status'];
  readonly tableDataSource = new MatTableDataSource(this.rows);
  readonly gridColumns = ['id', 'customer', 'product', 'amount', 'status', 'channel', 'date'];
  readonly gridRows = orders.slice(0, 12) as unknown as Record<string, string | number>[];
  readonly gridSelected = signal(new Set<string | number>());
  readonly dragItems = tasks.slice(0, 3).map((task) => task.title);
  readonly virtualItems = Array.from({ length: 1000 }, (_, index) => index + 1);
  readonly treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  readonly treeData = new MatTreeNestedDataSource<TreeNode>();
  readonly taskChecks = tasks.slice(0, 3).map((task) => ({ title: task.title, done: task.progress > 50 }));
  readonly searchInput = new FormControl('');
  readonly emailInput = new FormControl('not-an-email');
  readonly noteInput = new FormControl('');
  readonly customerInput = new FormControl('');
  readonly productInput = new FormControl('');
  readonly mentionInput = new FormControl('');
  readonly channels = new FormControl<string[]>(['web', 'ios']);
  readonly showPassword = signal(false);
  readonly quantity = signal(2);
  readonly rating = signal(4);
  readonly color = signal('#005cbb');
  readonly dragging = signal(false);
  readonly files = signal<File[]>([]);
  readonly cascade = signal('');
  readonly view = signal('list');
  readonly sortBy = signal('按日期排序');
  readonly paginatorIndex = signal(0);
  readonly slideIndex = signal(0);
  readonly tags = signal(['web', 'ios']);
  readonly pin = signal<string[]>([]);
  readonly transferLeft = signal(team.slice(0, 4).map((member) => member.name));
  readonly transferRight = signal(team.slice(4, 6).map((member) => member.name));
  readonly showBackTop = signal(false);
  calendarDate: Date | null = new Date(2026, 8, 5);
  cascadeChannel = '';
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly clipboard = inject(Clipboard);

  constructor() {
    this.emailInput.markAsTouched();
    this.treeData.data = [{ name: 'Workspace', children: [{ name: 'Design' }, { name: 'Engineering', children: [{ name: 'Frontend' }, { name: 'Backend' }] }] }];
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator ?? null;
    this.tableDataSource.sort = this.sort ?? null;
  }

  @HostListener('window:scroll')
  onScroll(): void { this.showBackTop.set(window.scrollY > 400); }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); this.openCommandPalette(); }
  }

  count(status: CoverageStatus): number { return this.componentEntries.filter((entry) => entry[1] === status).length; }
  scrollTo(name: string, event: Event): void { this.scrollToId(`c-${name}`, event); }
  scrollToId(id: string, event: Event): void { event.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  backTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  hasChild = (_: number, node: TreeNode): boolean => !!node.children?.length;
  drop(event: { previousIndex: number; currentIndex: number }): void { moveItemInArray(this.dragItems, event.previousIndex, event.currentIndex); }
  notify(message: string): void { this.snackBar.open(message, '知道了', { duration: 2200 }); }
  toast(level: string, message: string, action = '关闭'): void { this.snackBar.open(message, action, { duration: 3000, panelClass: `snack-${level}` }); }
  pushNotification(): void { this.snackBar.open(`${this.notices[0].title} · ${this.notices[0].time}`, '查看', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' }); }
  openDialog(kind: DialogKind): void {
    this.dialog.open(DemoDialog, kind === 'fullscreen' ? { data: kind, width: '100vw', height: '100vh', maxWidth: '100vw', panelClass: 'fullscreen-dialog' } : { data: kind, width: '440px', maxHeight: kind === 'scroll' ? '360px' : undefined });
  }
  openSheet(): void { this.bottomSheet.open(DemoSheet); }
  previewImage(): void { this.dialog.open(ImagePreviewDialog, { maxWidth: '90vw' }); }
  openCommandPalette(): void { this.dialog.open(CommandPaletteDialog, { width: '520px', maxWidth: '92vw', position: { top: '10vh' } }); }
  confirmDelete(): void { this.notify('订单已删除'); }
  filteredMembers(): typeof team { const q = (this.customerInput.value ?? '').toLowerCase(); return this.members.filter((member) => member.name.toLowerCase().includes(q) || member.email.includes(q)); }
  filteredProducts(): string[] { const q = (this.productInput.value ?? '').toLowerCase(); return this.products.filter((product) => product.toLowerCase().includes(q)); }
  mentionMatches(): typeof team { const value = this.mentionInput.value ?? ''; const at = value.lastIndexOf('@'); if (at < 0) return []; const q = value.slice(at + 1).toLowerCase(); return this.members.filter((member) => member.name.toLowerCase().includes(q)); }
  applyMention(name: string): void { const value = this.mentionInput.value ?? ''; const at = value.lastIndexOf('@'); this.mentionInput.setValue(`${value.slice(0, at)}@${name} `); }
  allTasks(): boolean { return this.taskChecks.every((task) => task.done); }
  someTasks(): boolean { return this.taskChecks.some((task) => task.done) && !this.allTasks(); }
  toggleAllTasks(checked: boolean): void { this.taskChecks.forEach((task) => (task.done = checked)); }
  toggleGrid(id: string | number): void { this.gridSelected.update((set) => { const next = new Set(set); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  toggleAllGrid(checked: boolean): void { this.gridSelected.set(new Set(checked ? this.gridRows.map((row) => row['id']) : [])); }
  addTag(event: { value: string; chipInput: { clear(): void } }): void { const value = event.value.trim(); if (value && !this.tags().includes(value)) this.tags.update((tags) => [...tags, value]); event.chipInput.clear(); }
  removeTag(tag: string): void { this.tags.update((tags) => tags.filter((item) => item !== tag)); }
  onPin(index: number, event: Event): void {
    const input = event.target as HTMLInputElement; const digit = input.value.replace(/\D/g, '').slice(-1); input.value = digit;
    this.pin.update((pin) => { const next = [...pin]; next[index] = digit; return next; });
    if (digit) (input.nextElementSibling as HTMLInputElement | null)?.focus();
  }
  onPinPaste(event: ClipboardEvent): void { const text = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, 6) ?? ''; if (text) { event.preventDefault(); this.pin.set(text.split('')); } }
  moveRight(list: MatSelectionList): void { const items = list.selectedOptions.selected.map((option) => option.value as string); this.transferLeft.update((current) => current.filter((item) => !items.includes(item))); this.transferRight.update((current) => [...current, ...items]); }
  moveLeft(list: MatSelectionList): void { const items = list.selectedOptions.selected.map((option) => option.value as string); this.transferRight.update((current) => current.filter((item) => !items.includes(item))); this.transferLeft.update((current) => [...current, ...items]); }
  slide(delta: number): void { const total = this.landingContent.testimonials.length; this.slideIndex.update((index) => (index + delta + total) % total); }
  selectFiles(fileList: FileList | null): void { if (fileList) this.files.update((files) => [...files, ...Array.from(fileList)]); }
  removeFile(file: File): void { this.files.update((files) => files.filter((item) => item !== file)); }
  onDrop(event: DragEvent): void { event.preventDefault(); this.dragging.set(false); this.selectFiles(event.dataTransfer?.files ?? null); }
  copy(text: string): void { this.clipboard.copy(text); this.notify('已复制'); }
}
