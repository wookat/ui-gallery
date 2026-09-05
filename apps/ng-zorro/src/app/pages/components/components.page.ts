import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import orders from '@ui-gallery/spec/mock/orders.json';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzWatermarkModule } from 'ng-zorro-antd/watermark';
import { IconComponent } from '../../core/icon.component';
import { UrlSettings } from '../../core/url-settings';

export const COVERAGE = {
  Typography: 'implemented', Button: 'implemented', ButtonGroup: 'composed', IconButton: 'implemented',
  Input: 'implemented', Textarea: 'implemented', NumberInput: 'implemented', Select: 'implemented', MultiSelect: 'implemented',
  Combobox: 'implemented', Autocomplete: 'implemented', Checkbox: 'implemented', Radio: 'implemented', Switch: 'implemented',
  Slider: 'implemented', Rating: 'implemented', DatePicker: 'implemented', TimePicker: 'implemented', DateRangePicker: 'implemented',
  ColorPicker: 'implemented', Upload: 'implemented', Cascader: 'implemented', Transfer: 'implemented', Mention: 'implemented',
  PinInput: 'composed', Form: 'implemented', Table: 'implemented', DataGrid: 'composed', Descriptions: 'implemented',
  List: 'implemented', Card: 'implemented', Avatar: 'implemented', AvatarGroup: 'implemented', Badge: 'implemented', Tag: 'implemented',
  Statistic: 'implemented', Timeline: 'implemented', Tree: 'implemented', Calendar: 'implemented', Image: 'implemented',
  Carousel: 'implemented', Empty: 'implemented', Tooltip: 'implemented', Popover: 'implemented', QRCode: 'implemented',
  Segmented: 'implemented', Alert: 'implemented', Toast: 'implemented', Notification: 'implemented', Dialog: 'implemented',
  Drawer: 'implemented', Progress: 'implemented', Skeleton: 'implemented', Spinner: 'implemented', Result: 'implemented',
  Popconfirm: 'implemented', Menu: 'implemented', Dropdown: 'implemented', Breadcrumb: 'implemented', Tabs: 'implemented',
  Pagination: 'implemented', Steps: 'implemented', Anchor: 'implemented', BackTop: 'implemented', Affix: 'implemented',
  Navbar: 'composed', Sidebar: 'composed', CommandPalette: 'composed', Grid: 'implemented', Stack: 'implemented',
  Layout: 'implemented', Container: 'composed', AspectRatio: 'composed', Resizable: 'implemented', ScrollArea: 'composed',
  Accordion: 'implemented', ThemeProvider: 'composed', Watermark: 'implemented', Tour: 'missing', FloatButton: 'implemented',
  Kbd: 'implemented', Code: 'implemented', Divider: 'implemented', Link: 'implemented',
} as const;

export type CoverageStatus = (typeof COVERAGE)[keyof typeof COVERAGE];
type ComponentKey = keyof typeof COVERAGE;

@Component({
  standalone: true,
  imports: [
    CommonModule, FormsModule, IconComponent, NzAffixModule, NzAlertModule, NzAnchorModule, NzAutocompleteModule, NzAvatarModule, NzBadgeModule,
    NzBreadCrumbModule, NzButtonModule, NzCalendarModule, NzCardModule, NzCarouselModule, NzCascaderModule, NzCheckboxModule, NzCollapseModule,
    NzColorPickerModule, NzDatePickerModule, NzDescriptionsModule, NzDividerModule, NzDrawerModule, NzDropdownModule, NzEmptyModule,
    NzFloatButtonModule, NzFlexModule, NzFormModule, NzGridModule, NzIconModule, NzImageModule, NzInputModule, NzInputNumberModule, NzLayoutModule, NzListModule, NzMenuModule,
    NzMentionModule, NzModalModule, NzPaginationModule, NzPopconfirmModule, NzPopoverModule, NzProgressModule, NzQRCodeModule,
    NzRadioModule, NzRateModule, NzResizableModule, NzResultModule, NzSegmentedModule, NzSelectModule, NzSkeletonModule, NzSliderModule,
    NzSpaceModule, NzSpinModule, NzStatisticModule, NzStepsModule, NzSwitchModule, NzTableModule, NzTabsModule, NzTagModule,
    NzTimelineModule, NzTimePickerModule, NzTooltipModule, NzTransferModule, NzTreeModule, NzTypographyModule, NzUploadModule,
    NzWatermarkModule,
  ],
  providers: [NzNotificationService],
  template: `
    <section class="components-page">
      <header class="page-heading"><div><h1 nz-typography>组件全集</h1><p nz-typography nzType="secondary">NG-ZORRO 原生组件、组合模式与覆盖状态。</p></div><nz-tag nzColor="blue">{{ implementedCount }} 个已覆盖</nz-tag></header>
      <nz-card class="index-card"><h2 nz-typography nzType="secondary">组件索引</h2><div class="index">@for (name of components; track name) { <a [href]="'#comp-' + name">{{ name }}</a> }</div></nz-card>
      <div class="sections">@for (name of components; track name) {
        <section class="component-section" [id]="'comp-' + name">
          <div class="section-heading"><h2 nz-typography>{{ name }}</h2><nz-tag [nzColor]="statusColor(status(name))">{{ status(name) }}</nz-tag></div>
          <nz-card nzSize="small">
            @switch (name) {
              @case ('Typography') { <h1 nz-typography>一级标题</h1><h2 nz-typography>二级标题</h2><h3 nz-typography>三级标题</h3><h4 nz-typography>四级标题</h4><h5 nz-typography>五级标题</h5><p nz-typography>正文</p><span nz-typography nzCode>code</span><span nz-typography nzKeyboard>Ctrl + K</span><blockquote nz-typography>引用文字</blockquote><ul nz-typography><li>列表项一</li><li>列表项二</li></ul><ol nz-typography><li>有序一</li><li>有序二</li></ol><p nz-typography nzType="secondary">辅助说明</p><a nz-typography href="#comp-Link">链接</a> }
              @case ('Button') { <div class="demo-row"><button nz-button nzType="primary">主要</button><button nz-button>默认</button><button nz-button nzType="dashed">虚线</button><button nz-button nzType="text">文本</button><button nz-button nzType="link">链接</button><button nz-button nzDanger>危险</button><button nz-button nzType="primary" nzLoading>加载中</button></div><div class="demo-row"><button nz-button nzSize="small">小</button><button nz-button>默认</button><button nz-button nzSize="large">大</button><button nz-button nzShape="circle"><ui-icon name="plus" /></button></div> }
              @case ('ButtonGroup') { <nz-space-compact><button nz-button>编辑</button><button nz-button nzType="primary">发布</button></nz-space-compact><nz-space-compact nzSize="small"><button nz-button>小</button><button nz-button nzDisabled>禁用</button></nz-space-compact> }
              @case ('IconButton') { <div class="demo-row">@for(icon of iconNames; track icon){<button nz-button nzShape="circle" nz-tooltip [nzTooltipTitle]="icon"><ui-icon [name]="icon" /></button>}</div> }
              @case ('Input') { <div class="demo-row"><input nz-input nzSize="small" placeholder="小尺寸" /><input nz-input placeholder="输入内容" /><input nz-input nzSize="large" nzStatus="error" value="校验失败" /><input nz-input nzDisabled value="禁用" /></div><div class="stacked-demo input-demo"><nz-input-wrapper><nz-icon nzInputPrefix nzType="user" /><input nz-input placeholder="前后缀" /><nz-icon nzInputSuffix nzType="info-circle" /></nz-input-wrapper><nz-input-wrapper><input nz-input [(ngModel)]="inputValue" /><nz-icon nzInputSuffix nzType="close-circle" nzTheme="fill" class="clear-icon" (click)="inputValue=''" /></nz-input-wrapper><nz-input-wrapper><input nz-input [type]="pwdVisible ? 'text':'password'" placeholder="密码" /><nz-icon nzInputSuffix [nzType]="pwdVisible ? 'eye-invisible':'eye'" (click)="pwdVisible=!pwdVisible" /></nz-input-wrapper><nz-input-search><input nz-input placeholder="搜索" /><button nz-button nzInputAddonAfter nzType="primary" nzSearch><nz-icon nzType="search" /></button></nz-input-search></div> }
              @case ('Textarea') { <div class="demo-row"><textarea nz-input rows="2" placeholder="多行文本"></textarea><textarea nz-input nzStatus="error" rows="2" value="校验失败"></textarea></div> }
              @case ('NumberInput') { <nz-input-number nzSize="small" [nzMin]="0" [nzMax]="100" [nzStep]="1" [(ngModel)]="numberValue" /><nz-input-number [nzMin]="0" [nzMax]="100" [nzStep]="1" [(ngModel)]="numberValue" /><nz-input-number nzSize="large" nzStatus="error" [nzMin]="0" nzDisabled /> }
              @case ('Select') { <div class="demo-row"><nz-select nzSize="small" [(ngModel)]="selectValue" nzPlaceHolder="小尺寸"><nz-option nzValue="all" nzLabel="全部" /></nz-select><nz-select [(ngModel)]="selectValue" nzPlaceHolder="选择一项"><nz-option nzValue="all" nzLabel="全部" /><nz-option nzValue="paid" nzLabel="已支付" /></nz-select><nz-select nzSize="large" nzStatus="error" nzDisabled><nz-option nzValue="error" nzLabel="错误" /></nz-select></div> }
              @case ('MultiSelect') { <nz-select nzMode="multiple" nzSize="large" [(ngModel)]="multiValue" nzPlaceHolder="多选"><nz-option nzValue="web" nzLabel="Web" /><nz-option nzValue="api" nzLabel="API" /></nz-select> }
              @case ('Combobox') { <nz-select nzShowSearch nzAllowClear nzPlaceHolder="搜索客户"><nz-option nzValue="林晓" nzLabel="林晓" /><nz-option nzValue="Maria" nzLabel="Maria García" /></nz-select> }
              @case ('Autocomplete') { <div class="demo-row"><input nz-input [nzAutocomplete]="componentAuto" placeholder="自动完成" /><input nz-input nzStatus="error" [nzAutocomplete]="componentAutoError" value="校验失败" /></div><nz-autocomplete #componentAuto><nz-auto-option nzValue="订单">订单</nz-auto-option><nz-auto-option nzValue="客户">客户</nz-auto-option></nz-autocomplete><nz-autocomplete #componentAutoError><nz-auto-option nzValue="订单">订单</nz-auto-option></nz-autocomplete> }
              @case ('Checkbox') { <label nz-checkbox [(ngModel)]="checked">同意条款</label><label nz-checkbox nzIndeterminate>部分选中</label><label nz-checkbox nzDisabled>禁用</label> }
              @case ('Radio') { <nz-radio-group [(ngModel)]="radioValue"><label nz-radio nzValue="a">选项 A</label><label nz-radio nzValue="b">选项 B</label></nz-radio-group> }
              @case ('Switch') { <div class="demo-row"><nz-switch nzSize="small" [(ngModel)]="checked" nzCheckedChildren="开" nzUnCheckedChildren="关" /><nz-switch [(ngModel)]="checked" /><nz-switch nzLoading /><nz-switch nzDisabled /></div> }
              @case ('Slider') { <nz-slider [(ngModel)]="sliderValue" /><nz-slider nzRange [(ngModel)]="rangeValue" /> }
              @case ('Rating') { <nz-rate [(ngModel)]="ratingValue" /><nz-rate nzDisabled [ngModel]="3" /> }
              @case ('DatePicker') { <div class="demo-row"><nz-date-picker nzSize="small" /><nz-date-picker /><nz-date-picker nzSize="large" nzStatus="error" /><nz-date-picker nzDisabled /></div> }
              @case ('TimePicker') { <div class="demo-row"><nz-time-picker nzSize="small" /><nz-time-picker /><nz-time-picker nzSize="large" nzStatus="error" /><nz-time-picker nzDisabled /></div> }
              @case ('DateRangePicker') { <div class="demo-row"><nz-range-picker nzSize="small" /><nz-range-picker /><nz-range-picker nzSize="large" nzDisabled /></div> }
              @case ('ColorPicker') { <nz-color-picker [(ngModel)]="colorValue" /> }
              @case ('Upload') { <nz-upload nzType="drag" [nzBeforeUpload]="beforeUpload"><p>拖拽文件到此处</p></nz-upload> }
              @case ('Cascader') { <div class="demo-row"><nz-cascader [nzOptions]="cascaderOptions" nzPlaceHolder="选择层级" /><nz-cascader [nzOptions]="cascaderOptions" nzDisabled nzSize="small" /><nz-cascader [nzOptions]="cascaderOptions" nzStatus="error" nzSize="large" /></div> }
              @case ('Transfer') { <div class="constrained"><nz-transfer [nzDataSource]="transferData" [nzTitles]="['可选','已选']" /></div> }
              @case ('Mention') { <nz-mention [nzSuggestions]="mentionSuggestions"><textarea nzMentionTrigger nz-input placeholder="@ 提及成员"></textarea></nz-mention> }
              @case ('PinInput') { <nz-space-compact><input nz-input maxlength="1" /><input nz-input maxlength="1" /><input nz-input maxlength="1" /><input nz-input maxlength="1" /><input nz-input maxlength="1" /><input nz-input maxlength="1" /></nz-space-compact> }
              @case ('Form') { <form nz-form class="demo-form"><nz-form-item><nz-form-label nzRequired>名称</nz-form-label><nz-form-control nzErrorTip="请输入名称"><input nz-input required /></nz-form-control></nz-form-item><nz-form-item><nz-form-label>邮箱</nz-form-label><nz-form-control><input nz-input type="email" nzStatus="error" value="invalid" /></nz-form-control></nz-form-item></form> }
              @case ('Table') { <nz-table #table [nzData]="rows" [nzShowPagination]="false" [nzScroll]="{x:'640px'}"><thead><tr><th>订单</th><th>客户</th><th>状态</th><th>金额</th></tr></thead><tbody>@for(row of table.data;track row.id){<tr><td>{{row.id}}</td><td>{{row.customer}}</td><td><nz-tag nzColor="success">已支付</nz-tag></td><td>¥ {{row.amount}}</td></tr>}</tbody></nz-table> }
              @case ('DataGrid') { <nz-table #dataGrid [nzData]="rows" nzSize="small" [nzLoading]="false" [nzShowPagination]="false" [nzScroll]="{x:'720px'}"><thead><tr><th nzLeft nzWidth="120px"><label nz-checkbox [nzChecked]="allRowsSelected" (nzCheckedChange)="toggleAllRows($event)"></label></th><th nzLeft [nzSortFn]="sortById">订单</th><th [nzFilters]="statusFilters" [nzFilterFn]="filterStatus">状态</th><th>客户</th><th>金额</th></tr></thead><tbody>@for(row of dataGrid.data;track row.id){<tr><td nzLeft><label nz-checkbox [ngModel]="isRowSelected(row.id)" (ngModelChange)="toggleRow(row.id, $event)"></label></td><td nzLeft>{{row.id}}</td><td><nz-tag nzColor="success">已支付</nz-tag></td><td>{{row.customer}}</td><td>¥ {{row.amount}}</td></tr>}</tbody></nz-table> }
              @case ('Descriptions') { <nz-descriptions nzBordered nzSize="small"><nz-descriptions-item nzTitle="编号">ORD-1001</nz-descriptions-item><nz-descriptions-item nzTitle="状态"><nz-tag nzColor="success">已支付</nz-tag></nz-descriptions-item><nz-descriptions-item nzTitle="金额">¥ 1,280.00</nz-descriptions-item></nz-descriptions> }
              @case ('List') { <nz-list nzBordered><nz-list-item>订单已完成 <nz-tag nzColor="success">完成</nz-tag></nz-list-item><nz-list-item>团队邀请待处理</nz-list-item></nz-list> }
              @case ('Card') { <div class="demo-row"><nz-card nzSize="small" nzTitle="小卡片">卡片内容</nz-card><nz-card nzTitle="卡片标题" nzHoverable>卡片内容</nz-card><nz-card nzLoading /></div> }
              @case ('Avatar') { <div class="demo-row"><nz-avatar nzText="林" /><nz-avatar nzShape="square" nzText="AI" /><nz-avatar nzIcon="user" /></div> }
              @case ('AvatarGroup') { <nz-avatar-group><nz-avatar nzText="林" /><nz-avatar nzText="周" /><nz-avatar nzText="陈" /><nz-avatar nzText="+3" /></nz-avatar-group><nz-avatar-group nzSize="small"><nz-avatar nzText="小" /><nz-avatar nzText="组" /></nz-avatar-group> }
              @case ('Badge') { <div class="demo-row"><nz-badge [nzCount]="5"><nz-avatar nzShape="square" nzText="箱" /></nz-badge><nz-badge nzDot><nz-avatar nzShape="square" nzText="点" /></nz-badge><nz-badge nzStatus="success" nzText="在线" /></div> }
              @case ('Tag') { <div class="demo-row"><nz-tag nzSize="small">小</nz-tag><nz-tag>默认</nz-tag><nz-tag nzColor="success">成功</nz-tag><nz-tag nzColor="warning">提醒</nz-tag><nz-tag nzColor="error">错误</nz-tag><nz-tag nzMode="closeable">可关闭</nz-tag></div> }
              @case ('Statistic') { <div class="stat-grid"><nz-statistic nzTitle="收入" [nzValue]="12880" nzPrefix="¥" /><nz-statistic nzTitle="转化率" [nzValue]="68.2" nzSuffix="%" /></div> }
              @case ('Timeline') { <nz-timeline><nz-timeline-item>订单创建</nz-timeline-item><nz-timeline-item nzColor="green">支付完成</nz-timeline-item><nz-timeline-item nzColor="gray">已归档</nz-timeline-item></nz-timeline> }
              @case ('Tree') { <nz-tree [nzData]="treeData" nzShowLine /> }
              @case ('Calendar') { <div class="constrained"><nz-calendar [nzFullscreen]="false" /></div> }
              @case ('Image') { <div class="image-demo"><img nz-image [nzSrc]="imagePlaceholder" alt="本地图片预览" /></div> }
              @case ('Carousel') { <nz-carousel [nzAutoPlay]="true" class="carousel-demo"><div nz-carousel-content>轮播内容 A</div><div nz-carousel-content>轮播内容 B</div></nz-carousel> }
              @case ('Empty') { <nz-empty nzNotFoundContent="暂无数据" /> }
              @case ('Tooltip') { <button nz-button nz-tooltip nzTooltipTitle="提示内容">悬停查看</button> }
              @case ('Popover') { <button nz-button nz-popover nzPopoverTitle="标题" nzPopoverContent="气泡内容">打开气泡</button> }
              @case ('QRCode') { <div class="constrained"><nz-qrcode nzValue="https://acme-console.local" [nzSize]="128" /></div> }
              @case ('Segmented') { <nz-segmented [nzOptions]="['日','周','月']" /> }
              @case ('Alert') { <div class="stacked-demo"><nz-alert nzType="success" nzMessage="成功提示" nzShowIcon /><nz-alert nzType="info" nzMessage="信息提示" nzShowIcon /><nz-alert nzType="warning" nzMessage="警告提示" nzShowIcon /><nz-alert nzType="error" nzMessage="错误提示" nzShowIcon /></div> }
              @case ('Toast') { <button nz-button nzType="primary" (click)="toast()">显示 Toast</button><nz-tag>静态示例：操作成功</nz-tag> }
              @case ('Notification') { <div class="demo-row"><button nz-button nzType="primary" (click)="notify('success')">成功通知</button><button nz-button (click)="notify('info')">信息通知</button><button nz-button nzDanger (click)="notify('error')">错误通知</button></div><nz-alert nzType="success" nzMessage="通知示例" nzShowIcon /> }
              @case ('Dialog') { <div class="demo-row"><button nz-button (click)="dialog()">信息</button><button nz-button (click)="dialogConfirm()">确认</button><button nz-button (click)="dialogFullscreen()">全屏</button><button nz-button (click)="dialogScrollable(longTextTpl)">可滚动</button></div><nz-alert nzType="info" nzMessage="静态对话框预览" nzShowIcon /> }
              @case ('Drawer') { <div class="demo-row"><button nz-button (click)="openDrawer('top')">上</button><button nz-button (click)="openDrawer('bottom')">下</button><button nz-button (click)="openDrawer('left')">左</button><button nz-button (click)="openDrawer('right')">右</button></div><nz-drawer [(nzVisible)]="drawerOpen" [nzPlacement]="drawerPlacement" nzTitle="抽屉示例" (nzOnClose)="drawerOpen=false"><ng-container *nzDrawerContent>抽屉内容</ng-container></nz-drawer> }
              @case ('Progress') { <div class="demo-row"><nz-progress nzSize="small" [nzPercent]="68" /><nz-progress [nzPercent]="82" nzStatus="success" /><nz-progress [nzPercent]="42" nzStatus="exception" /><nz-progress nzType="circle" [nzPercent]="42" /></div> }
              @case ('Skeleton') { <nz-skeleton [nzActive]="true" [nzParagraph]="{rows:2}" /> }
              @case ('Spinner') { <div class="demo-row"><nz-spin nzSimple /><nz-spin nzSimple nzSize="large" /><nz-spin nzTip="加载中..." class="spin-tip"><div class="spin-box"></div></nz-spin></div> }
              @case ('Result') { <nz-result nzStatus="success" nzTitle="操作成功" nzSubTitle="结果已保存" /> }
              @case ('Popconfirm') { <button nz-button nz-popconfirm nzPopconfirmTitle="确认删除？">删除</button> }
              @case ('Menu') { <ul nz-menu nzMode="horizontal"><li nz-menu-item nzSelected>工作台</li><li nz-menu-item>设置</li></ul><ul nz-menu nzMode="vertical" class="menu-vertical"><li nz-menu-item nzSelected>工作台</li><li nz-menu-item>设置</li></ul><button nz-button (click)="menuCollapsed=!menuCollapsed">切换折叠菜单</button><ul nz-menu nzMode="inline" [nzInlineCollapsed]="menuCollapsed" class="menu-vertical"><li nz-submenu nzTitle="管理" nzIcon="setting"><ul><li nz-menu-item>订单</li><li nz-menu-item>客户</li></ul></li></ul> }
              @case ('Dropdown') { <button nz-button nz-dropdown [nzDropdownMenu]="menu">更多操作</button><nz-dropdown-menu #menu="nzDropdownMenu"><ul nz-menu><li nz-menu-item>编辑</li><li nz-menu-item>删除</li></ul></nz-dropdown-menu> }
              @case ('Breadcrumb') { <nz-breadcrumb><nz-breadcrumb-item>工作区</nz-breadcrumb-item><nz-breadcrumb-item>组件</nz-breadcrumb-item></nz-breadcrumb> }
              @case ('Tabs') { <div class="stacked-demo"><nz-tabs><nz-tab nzTitle="概览">概览内容</nz-tab><nz-tab nzTitle="设置">设置内容</nz-tab></nz-tabs><nz-tabs nzType="card"><nz-tab nzTitle="概览">概览内容</nz-tab><nz-tab nzTitle="设置">设置内容</nz-tab></nz-tabs><nz-tabs nzType="editable-card"><nz-tab nzTitle="概览">概览内容</nz-tab><nz-tab nzTitle="设置">设置内容</nz-tab></nz-tabs><nz-tabs nzSize="small"><nz-tab nzTitle="概览">概览内容</nz-tab><nz-tab nzTitle="设置">设置内容</nz-tab></nz-tabs></div> }
              @case ('Pagination') { <div class="demo-row"><nz-pagination nzSize="small" [nzPageIndex]="1" [nzTotal]="50" /><nz-pagination [nzPageIndex]="1" [nzTotal]="50" nzDisabled /></div> }
              @case ('Steps') { <div class="steps-demo"><nz-steps nzSize="small" [nzCurrent]="1"><nz-step nzTitle="开始" /><nz-step nzTitle="进行中" /><nz-step nzTitle="完成" /></nz-steps><nz-steps nzDirection="vertical" [nzCurrent]="1"><nz-step nzTitle="第一步" /><nz-step nzTitle="第二步" /></nz-steps></div> }
              @case ('Anchor') { <nz-anchor><nz-link nzHref="#comp-Button" nzTitle="Button" /><nz-link nzHref="#comp-Table" nzTitle="Table" /></nz-anchor> }
              @case ('Affix') { <nz-affix [nzOffsetTop]="12"><button nz-button>吸顶操作</button></nz-affix> }
              @case ('BackTop') { <div class="backtop-preview"><button nz-button nzType="primary"><ui-icon name="chevron-up" /> 返回顶部</button><nz-float-button-top [nzVisibilityHeight]="0" /></div> }
              @case ('Grid') { <div nz-row [nzGutter]="[8,8]"><div nz-col nzSpan="8"><div class="grid-box">8</div></div><div nz-col nzSpan="8"><div class="grid-box">8</div></div><div nz-col nzSpan="8"><div class="grid-box">8</div></div></div> }
              @case ('Navbar') { <nz-layout class="mini-layout"><nz-header class="navbar-demo"><ul nz-menu nzMode="horizontal" nzTheme="dark"><li nz-menu-item nzSelected>工作台</li><li nz-menu-item>订单</li></ul><div class="layout-actions"><button nz-button nzType="text"><ui-icon name="bell" /></button><button nz-button nzType="text">账户</button></div></nz-header></nz-layout> }
              @case ('Sidebar') { <nz-layout class="sidebar-demo"><nz-sider nzCollapsible [nzTrigger]="null" nzTheme="light"><ul nz-menu nzMode="inline" nzTheme="light"><li nz-menu-item nzSelected>概览</li><li nz-submenu nzTitle="管理"><ul><li nz-menu-item>订单</li><li nz-menu-item>客户</li></ul></li></ul></nz-sider><nz-content>内容区域</nz-content></nz-layout> }
              @case ('CommandPalette') { <div class="command-preview"><button nz-button nzType="primary" (click)="openCommandPalette(commandTemplate)">打开命令面板</button><nz-list nzBordered>@for (command of filteredCommands; track command) { <nz-list-item>{{ command }}</nz-list-item> }</nz-list></div><ng-template #commandTemplate><input nz-input [(ngModel)]="commandQuery" placeholder="搜索命令" /><nz-list>@for (command of filteredCommands; track command) { <nz-list-item>{{ command }}</nz-list-item> }</nz-list></ng-template> }
              @case ('Stack') { <nz-space nzDirection="vertical"><button nz-button nzType="primary">第一项</button><button nz-button>第二项</button></nz-space><nz-flex nzGap="small" nzWrap="wrap"><nz-tag>并排</nz-tag><nz-tag>布局</nz-tag></nz-flex> }
              @case ('Container') { <div class="container-demo">最大宽度 960px 的内容容器</div> }
              @case ('AspectRatio') { <div class="aspect-demo"><img nz-image [nzSrc]="imagePlaceholder" alt="比例图" /></div> }
              @case ('Resizable') { <div class="resizable-demo" nz-resizable [nzMinWidth]="160" [nzMinHeight]="70" [nzMaxWidth]="320" [nzMaxHeight]="160"><div>拖拽右下角调整大小</div><nz-resize-handles /></div> }
              @case ('ScrollArea') { <div class="scroll-demo">@for (row of rows; track row.id) { <div>{{ row.id }} · {{ row.customer }}</div> }<div>ORD-1004 · 客户</div><div>ORD-1005 · 项目</div></div> }
              @case ('ThemeProvider') { <div class="theme-demo"><nz-switch [(ngModel)]="darkTheme" (ngModelChange)="toggleTheme()" /><span>当前主题：{{ darkTheme ? 'dark' : 'light' }}</span><p nz-typography nzType="secondary">主题由 UrlSettings 统一管理并同步到页面。</p></div> }
              @case ('Watermark') { <nz-watermark nzContent="Acme Console"><nz-card nzTitle="受保护内容">内部工作区</nz-card></nz-watermark> }
              @case ('Layout') { <nz-layout class="layout-demo"><nz-sider [nzWidth]="96">侧栏</nz-sider><nz-layout><nz-header>页头</nz-header><nz-content>内容</nz-content><nz-footer>页脚</nz-footer></nz-layout></nz-layout> }
              @case ('Accordion') { <nz-collapse nzAccordion><nz-collapse-panel nzHeader="面板一">面板内容</nz-collapse-panel><nz-collapse-panel nzHeader="面板二">更多内容</nz-collapse-panel></nz-collapse> }
              @case ('FloatButton') { <div class="float-demo"><nz-float-button nzType="primary" nzShape="circle"><ui-icon name="plus" /></nz-float-button></div> }
              @case ('Divider') { <nz-divider nzText="分隔线" /> }
              @case ('Code') { <p nz-typography nzCode>const result = true;</p> }
              @case ('Kbd') { <p nz-typography nzKeyboard>⌘ K</p> }
              @case ('Link') { <a nz-typography href="#component-index">返回组件索引</a> }
              @case ('Tour') { <nz-empty nzNotFoundContent="NG-ZORRO 22 无 Tour 组件" /> }
            }
            <ng-template #longTextTpl><div>@for (row of rows; track row.id) { <p>{{ row.id }} · {{ row.customer }} · {{ row.product }}</p> }</div></ng-template>
          </nz-card>
        </section>
      }</div>
    </section>
  `,
  styles: `
    .components-page{display:grid;gap:20px;min-width:0}.page-heading,.section-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;min-width:0}.page-heading h1,.section-heading h2{margin:0}.index-card{position:sticky;top:0;z-index:2;min-width:0}.index-card h2{font-size:14px;margin:0 0 12px}.index{display:flex;flex-wrap:wrap;gap:8px;min-width:0}.index a{display:inline-flex;align-items:center;min-height:40px;border:1px solid #f0f0f0;border-radius:999px;padding:4px 10px;text-decoration:none;font-size:12px}.sections{display:grid;gap:16px;min-width:0}.component-section{scroll-margin-top:90px;min-width:0;max-width:100%}.section-heading{margin-bottom:8px}.demo-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-width:0}.demo-row>*{max-width:100%}.demo-form{max-width:560px}.input-demo{max-width:560px}.clear-icon{cursor:pointer}.stat-grid{display:flex;flex-wrap:wrap;gap:32px}.constrained{max-width:100%;overflow:auto}.grid-box{padding:16px;background:rgba(24,144,255,.1);text-align:center}.stacked-demo{display:grid;gap:8px}.steps-demo{display:grid;gap:20px}.steps-demo nz-steps{min-width:0}.image-demo img{display:block;width:240px;max-width:100%;height:auto}.carousel-demo [nz-carousel-content]{height:160px!important;line-height:160px;text-align:center;background:#364d79;color:#fff;overflow:hidden}.carousel-demo .slick-list,.carousel-demo .slick-track{height:160px!important}.backtop-preview{display:flex;align-items:center;gap:16px;min-height:64px}.layout-demo{min-height:140px}.layout-demo nz-sider{color:rgba(255,255,255,.85);padding:16px}.layout-demo nz-header{color:rgba(255,255,255,.85);padding:0 16px;line-height:48px;height:48px}.layout-demo nz-content,.layout-demo nz-footer{padding:12px}.navbar-demo{display:flex;align-items:center;justify-content:space-between;padding:0 16px;color:rgba(255,255,255,.85)}.navbar-demo .ant-btn-text{color:rgba(255,255,255,.85)}.layout-actions{display:flex;gap:4px}.menu-vertical{width:200px;max-width:100%}.spin-box{width:160px;height:64px}.float-demo{position:relative;height:96px}.sidebar-demo{min-height:120px}.sidebar-demo nz-content{padding:16px}.command-preview{display:grid;gap:12px;max-width:360px}.container-demo{width:100%;max-width:960px;margin:auto;padding:18px;text-align:center;background:rgba(24,144,255,.08)}.aspect-demo{width:100%;max-width:360px;aspect-ratio:16/9;overflow:hidden}.aspect-demo img{width:100%;height:100%;object-fit:cover}.resizable-demo{display:grid;place-items:center;padding:16px;background:rgba(24,144,255,.08);border:1px solid #f0f0f0}.scroll-demo{height:120px;overflow:auto;padding:8px 12px;border:1px solid #f0f0f0;line-height:30px}.theme-demo{display:flex;align-items:center;flex-wrap:wrap;gap:12px}.theme-demo p{width:100%;margin:0}.avatar-group nz-avatar{margin-right:-8px;border:2px solid #fff}.theme-demo nz-switch{flex:0 0 auto}:host-context(.dark) .index a,:host-context(.dark) .resizable-demo,:host-context(.dark) .scroll-demo{border-color:#303030}:host-context(.dark) .avatar-group nz-avatar{border-color:#141414}:host-context(.dark) .layout-demo nz-header{border-color:#303030}@media(max-width:767px){.page-heading{align-items:flex-start;flex-direction:column}.index-card{position:static}.index{max-height:180px;overflow:auto}.section-heading{align-items:flex-start}.stat-grid{gap:16px}.layout-demo nz-sider{display:none}.backtop-preview{flex-wrap:wrap}}
  `,
})
export class ComponentsPage {
  readonly components = Object.keys(COVERAGE) as ComponentKey[];
  readonly iconNames = ['plus', 'search', 'settings', 'bell', 'download'] as const;
  readonly rows = orders.slice(0, 3);
  readonly transferData = [{ key: '1', title: '订单' }, { key: '2', title: '客户' }];
  readonly cascaderOptions = [{ label: '工作区', value: 'workspace', children: [{ label: '订单', value: 'orders' }, { label: '设置', value: 'settings' }] }];
  readonly mentionSuggestions = ['林晓', '周宁', '陈默'];
  readonly commands = ['搜索订单', '打开设置', '查看帮助'];
  readonly statusFilters = [{ text: '已支付', value: 'paid' }, { text: '处理中', value: 'pending' }];
  readonly imagePlaceholder = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="#e6f4ff"/><circle cx="90" cy="74" r="28" fill="#91caff"/><path d="M20 155 112 95l50 34 38-28 100 54Z" fill="#1677ff"/><text x="160" y="32" text-anchor="middle" fill="#1677ff" font-size="16">LOCAL IMAGE</text></svg>');
  readonly treeData = [{ title: '工作区', key: '0', expanded: true, children: [{ title: '订单', key: '0-0' }, { title: '设置', key: '0-1' }] }];
  readonly implementedCount = Object.values(COVERAGE).filter((value) => value !== 'missing').length;
  numberValue = 12; selectValue = 'all'; multiValue = ['web']; checked = true; radioValue = 'a'; sliderValue = 42;
  rangeValue = [20, 70]; ratingValue = 4; colorValue = '#1890ff'; drawerOpen = false; drawerPlacement: 'top' | 'bottom' | 'left' | 'right' = 'right'; darkTheme = false;
  inputValue = '可清除'; pwdVisible = false; menuCollapsed = false;
  selectedRowIds: string[] = []; commandQuery = '';
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly notification = inject(NzNotificationService);
  private readonly settings = inject(UrlSettings);
  status(name: ComponentKey): CoverageStatus { return COVERAGE[name]; }
  statusColor(status: CoverageStatus): string { return status === 'implemented' ? 'success' : status === 'composed' ? 'processing' : 'default'; }
  beforeUpload = (): boolean => false;
  sortById = (a: { id: string }, b: { id: string }): number => a.id.localeCompare(b.id);
  filterStatus = (value: string, row: { status?: string }): boolean => value === 'paid' || row.status === value;
  get allRowsSelected(): boolean { return this.selectedRowIds.length === this.rows.length; }
  isRowSelected(id: string): boolean { return this.selectedRowIds.includes(id); }
  get filteredCommands(): string[] { return this.commands.filter((command) => command.includes(this.commandQuery)); }
  toggleRow(id: string, selected: boolean): void {
    this.selectedRowIds = selected ? [...new Set([...this.selectedRowIds, id])] : this.selectedRowIds.filter((item) => item !== id);
  }
  toggleAllRows(selected: boolean): void { this.selectedRowIds = selected ? this.rows.map((row) => row.id) : []; }
  toast(): void { this.message.success('操作成功'); }
  notify(type: 'success' | 'info' | 'error'): void {
    this.notification[type](`${type === 'success' ? '成功' : type === 'info' ? '信息' : '错误'}通知`, '这是一个静态通知示例。');
  }
  dialog(): void { this.modal.info({ nzTitle: '对话框示例', nzContent: '这是一个静态交互示例。' }); }
  dialogConfirm(): void { this.modal.confirm({ nzTitle: '确认操作？', nzContent: '此操作不可撤销。' }); }
  dialogFullscreen(): void { this.modal.create({ nzTitle: '全屏对话框', nzContent: '全屏内容', nzWidth: '100vw', nzClassName: 'fullscreen-modal' }); }
  dialogScrollable(content: TemplateRef<unknown>): void { this.modal.create({ nzTitle: '可滚动', nzContent: content, nzBodyStyle: { maxHeight: '40vh', overflow: 'auto' } }); }
  openDrawer(placement: 'top' | 'bottom' | 'left' | 'right'): void { this.drawerPlacement = placement; this.drawerOpen = true; }
  openCommandPalette(content: TemplateRef<unknown>): void {
    this.modal.info({ nzTitle: '命令面板', nzContent: content });
  }
  toggleTheme(): void {
    this.settings.toggleTheme();
    this.darkTheme = this.settings.theme === 'dark';
  }
}
