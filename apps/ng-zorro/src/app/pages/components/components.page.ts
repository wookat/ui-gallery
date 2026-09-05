import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import orders from '@ui-gallery/spec/mock/orders.json';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
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
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
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
import { IconComponent } from '../../core/icon.component';

export const COVERAGE = {
  Typography: 'implemented', Button: 'implemented', ButtonGroup: 'composed', IconButton: 'implemented',
  Input: 'implemented', Textarea: 'implemented', NumberInput: 'implemented', Select: 'implemented', MultiSelect: 'implemented',
  Combobox: 'composed', Autocomplete: 'implemented', Checkbox: 'implemented', Radio: 'implemented', Switch: 'implemented',
  Slider: 'implemented', Rating: 'implemented', DatePicker: 'implemented', TimePicker: 'implemented', DateRangePicker: 'implemented',
  ColorPicker: 'implemented', Upload: 'implemented', Cascader: 'composed', Transfer: 'implemented', Mention: 'implemented',
  PinInput: 'composed', Form: 'implemented', Table: 'implemented', DataGrid: 'composed', Descriptions: 'implemented',
  List: 'implemented', Card: 'implemented', Avatar: 'implemented', AvatarGroup: 'composed', Badge: 'implemented', Tag: 'implemented',
  Statistic: 'implemented', Timeline: 'implemented', Tree: 'implemented', Calendar: 'implemented', Image: 'implemented',
  Carousel: 'implemented', Empty: 'implemented', Tooltip: 'implemented', Popover: 'implemented', QRCode: 'implemented',
  Segmented: 'implemented', Alert: 'implemented', Toast: 'implemented', Notification: 'composed', Dialog: 'implemented',
  Drawer: 'implemented', Progress: 'implemented', Skeleton: 'implemented', Spinner: 'implemented', Result: 'implemented',
  Popconfirm: 'implemented', Menu: 'implemented', Dropdown: 'implemented', Breadcrumb: 'implemented', Tabs: 'implemented',
  Pagination: 'implemented', Steps: 'implemented', Anchor: 'implemented', BackTop: 'composed', Affix: 'implemented',
  Navbar: 'composed', Sidebar: 'composed', CommandPalette: 'composed', Grid: 'implemented', Stack: 'composed',
  Layout: 'implemented', Container: 'composed', AspectRatio: 'composed', Resizable: 'composed', ScrollArea: 'composed',
  Accordion: 'implemented', ThemeProvider: 'composed', Watermark: 'composed', Tour: 'missing', FloatButton: 'implemented',
  Kbd: 'implemented', Code: 'implemented', Divider: 'implemented', Link: 'implemented',
} as const;

export type CoverageStatus = (typeof COVERAGE)[keyof typeof COVERAGE];
type ComponentKey = keyof typeof COVERAGE;

@Component({
  standalone: true,
  imports: [
    CommonModule, FormsModule, IconComponent, NzAffixModule, NzAlertModule, NzAnchorModule, NzAvatarModule, NzBadgeModule,
    NzBreadCrumbModule, NzButtonModule, NzCalendarModule, NzCardModule, NzCarouselModule, NzCheckboxModule, NzCollapseModule,
    NzColorPickerModule, NzDatePickerModule, NzDescriptionsModule, NzDividerModule, NzDrawerModule, NzDropdownModule, NzEmptyModule,
    NzFloatButtonModule, NzFormModule, NzGridModule, NzImageModule, NzInputModule, NzInputNumberModule, NzListModule, NzMenuModule,
    NzMentionModule, NzModalModule, NzPaginationModule, NzPopconfirmModule, NzPopoverModule, NzProgressModule, NzQRCodeModule,
    NzRadioModule, NzRateModule, NzResultModule, NzSegmentedModule, NzSelectModule, NzSkeletonModule, NzSliderModule, NzSpaceModule,
    NzSpinModule, NzStatisticModule, NzSwitchModule, NzTableModule, NzTabsModule, NzTagModule, NzTimelineModule, NzTimePickerModule,
    NzTooltipModule, NzTreeModule, NzTypographyModule, NzUploadModule,
  ],
  template: `
    <section class="components-page">
      <header class="page-heading"><div><h1 nz-typography>组件全集</h1><p nz-typography nzType="secondary">NG-ZORRO 原生组件、组合模式与覆盖状态。</p></div><nz-tag nzColor="blue">{{ implementedCount }} 个已覆盖</nz-tag></header>
      <nz-card class="index-card"><h2 nz-typography nzType="secondary">组件索引</h2><div class="index">@for (name of components; track name) { <a [href]="'#comp-' + name">{{ name }}</a> }</div></nz-card>
      <div class="sections">@for (name of components; track name) {
        <section class="component-section" [id]="'comp-' + name">
          <div class="section-heading"><h2 nz-typography>{{ name }}</h2><nz-tag [nzColor]="statusColor(status(name))">{{ status(name) }}</nz-tag></div>
          <nz-card nzSize="small">
            @switch (name) {
              @case ('Typography') { <h1 nz-typography>标题文字</h1><p nz-typography>正文与 <a nz-typography href="#comp-Link">链接</a>。</p><p nz-typography nzType="secondary">辅助说明</p> }
              @case ('Button') { <div class="demo-row"><button nz-button nzType="primary">主要</button><button nz-button>默认</button><button nz-button nzType="dashed">虚线</button><button nz-button nzType="text">文本</button><button nz-button nzType="link">链接</button><button nz-button nzDanger>危险</button><button nz-button nzType="primary" nzLoading>加载中</button></div><div class="demo-row"><button nz-button nzSize="small">小</button><button nz-button>默认</button><button nz-button nzSize="large">大</button><button nz-button nzShape="circle"><ui-icon name="plus" /></button></div> }
              @case ('IconButton') { <div class="demo-row">@for(icon of iconNames; track icon){<button nz-button nzShape="circle" nz-tooltip [nzTooltipTitle]="icon"><ui-icon [name]="icon" /></button>}</div> }
              @case ('Input') { <div class="demo-row"><input nz-input placeholder="输入内容" /><input nz-input nzStatus="error" value="校验失败" /><nz-input-group nzPrefixIcon="search"><input nz-input placeholder="带前缀" /></nz-input-group></div> }
              @case ('Textarea') { <textarea nz-input rows="3" placeholder="多行文本"></textarea> }
              @case ('NumberInput') { <nz-input-number [nzMin]="0" [nzMax]="100" [nzStep]="1" [(ngModel)]="numberValue" /><nz-input-number nzStatus="error" [nzMin]="0" /> }
              @case ('Select') { <nz-select [(ngModel)]="selectValue" nzPlaceHolder="选择一项"><nz-option nzValue="all" nzLabel="全部" /><nz-option nzValue="paid" nzLabel="已支付" /></nz-select> }
              @case ('MultiSelect') { <nz-select nzMode="multiple" [(ngModel)]="multiValue" nzPlaceHolder="多选"><nz-option nzValue="web" nzLabel="Web" /><nz-option nzValue="api" nzLabel="API" /></nz-select> }
              @case ('Autocomplete') { <input nz-input placeholder="自动完成" list="component-options" /><datalist id="component-options"><option value="订单"></option><option value="客户"></option></datalist> }
              @case ('Checkbox') { <label nz-checkbox [(ngModel)]="checked">同意条款</label><label nz-checkbox nzDisabled>禁用</label> }
              @case ('Radio') { <nz-radio-group [(ngModel)]="radioValue"><label nz-radio nzValue="a">选项 A</label><label nz-radio nzValue="b">选项 B</label></nz-radio-group> }
              @case ('Switch') { <nz-switch [(ngModel)]="checked" nzCheckedChildren="开" nzUnCheckedChildren="关" /><nz-switch nzDisabled /> }
              @case ('Slider') { <nz-slider [(ngModel)]="sliderValue" /><nz-slider nzRange [(ngModel)]="rangeValue" /> }
              @case ('Rating') { <nz-rate [(ngModel)]="ratingValue" /><nz-rate nzDisabled [ngModel]="3" /> }
              @case ('DatePicker') { <nz-date-picker /><nz-time-picker /><nz-range-picker /> }
              @case ('ColorPicker') { <nz-color-picker [(ngModel)]="colorValue" /> }
              @case ('Upload') { <nz-upload nzType="drag" [nzBeforeUpload]="beforeUpload"><p>拖拽文件到此处</p></nz-upload> }
              @case ('Transfer') { <div class="transfer-demo"><div>可选<div class="transfer-item">订单</div><div class="transfer-item">客户</div></div><div class="transfer-arrows">→</div><div>已选<div class="transfer-item">项目</div></div></div> }
              @case ('Mention') { <textarea nz-input nzMentionTrigger="@" placeholder="@ 提及成员"></textarea> }
              @case ('Form') { <form nz-form class="demo-form"><nz-form-item><nz-form-label nzRequired>名称</nz-form-label><nz-form-control nzErrorTip="请输入名称"><input nz-input required /></nz-form-control></nz-form-item><nz-form-item><nz-form-label>邮箱</nz-form-label><nz-form-control><input nz-input type="email" nzStatus="error" value="invalid" /></nz-form-control></nz-form-item></form> }
              @case ('Table') { <nz-table #table [nzData]="rows" [nzShowPagination]="false" [nzScroll]="{x:'640px'}"><thead><tr><th>订单</th><th>客户</th><th>状态</th><th>金额</th></tr></thead><tbody>@for(row of table.data;track row.id){<tr><td>{{row.id}}</td><td>{{row.customer}}</td><td><nz-tag nzColor="success">已支付</nz-tag></td><td>¥ {{row.amount}}</td></tr>}</tbody></nz-table> }
              @case ('Descriptions') { <nz-descriptions nzBordered nzSize="small"><nz-descriptions-item nzTitle="编号">ORD-1001</nz-descriptions-item><nz-descriptions-item nzTitle="状态"><nz-tag nzColor="success">已支付</nz-tag></nz-descriptions-item><nz-descriptions-item nzTitle="金额">¥ 1,280.00</nz-descriptions-item></nz-descriptions> }
              @case ('List') { <nz-list nzBordered><nz-list-item>订单已完成 <nz-tag nzColor="success">完成</nz-tag></nz-list-item><nz-list-item>团队邀请待处理</nz-list-item></nz-list> }
              @case ('Card') { <nz-card nzTitle="卡片标题" nzHoverable>卡片内容</nz-card> }
              @case ('Avatar') { <div class="demo-row"><nz-avatar>林</nz-avatar><nz-avatar nzShape="square" nzText="AI" /><nz-avatar nzIcon="user" /></div> }
              @case ('AvatarGroup') { <div class="avatar-group"><nz-avatar>林</nz-avatar><nz-avatar>周</nz-avatar><nz-avatar>陈</nz-avatar><nz-avatar nzText="+3" /></div> }
              @case ('Badge') { <nz-badge [nzCount]="5"><nz-avatar nzShape="square" nzText="箱" /></nz-badge><nz-badge nzStatus="success" nzText="在线" /> }
              @case ('Tag') { <div class="demo-row"><nz-tag>默认</nz-tag><nz-tag nzColor="success">成功</nz-tag><nz-tag nzColor="warning">提醒</nz-tag><nz-tag nzMode="closeable">可关闭</nz-tag></div> }
              @case ('Statistic') { <div class="stat-grid"><nz-statistic nzTitle="收入" [nzValue]="12880" nzPrefix="¥" /><nz-statistic nzTitle="转化率" [nzValue]="68.2" nzSuffix="%" /></div> }
              @case ('Timeline') { <nz-timeline><nz-timeline-item>订单创建</nz-timeline-item><nz-timeline-item nzColor="green">支付完成</nz-timeline-item><nz-timeline-item nzColor="gray">已归档</nz-timeline-item></nz-timeline> }
              @case ('Tree') { <nz-tree [nzData]="treeData" nzShowLine /> }
              @case ('Calendar') { <div class="constrained"><nz-calendar [nzFullscreen]="false" /></div> }
              @case ('Image') { <div class="image-placeholder" role="img" aria-label="图片预览">图片预览</div> }
              @case ('Carousel') { <nz-carousel [nzAutoPlay]="true"><div nz-carousel-content>轮播内容 A</div><div nz-carousel-content>轮播内容 B</div></nz-carousel> }
              @case ('Empty') { <nz-empty nzNotFoundContent="暂无数据" /> }
              @case ('Tooltip') { <button nz-button nz-tooltip nzTooltipTitle="提示内容">悬停查看</button> }
              @case ('Popover') { <button nz-button nz-popover nzPopoverTitle="标题" nzPopoverContent="气泡内容">打开气泡</button> }
              @case ('QRCode') { <div class="constrained"><nz-qrcode nzValue="https://acme-console.local" [nzSize]="128" /></div> }
              @case ('Segmented') { <nz-segmented [nzOptions]="['日','周','月']" /> }
              @case ('Alert') { <nz-alert nzType="info" nzMessage="信息提示" nzDescription="这是一个可读的状态提示。" nzShowIcon /> }
              @case ('Toast') { <button nz-button nzType="primary" (click)="toast()">显示 Toast</button><nz-tag>静态示例：操作成功</nz-tag> }
              @case ('Notification') { <button nz-button (click)="toast()">触发通知</button><nz-alert nzType="success" nzMessage="通知示例" nzShowIcon /> }
              @case ('Dialog') { <button nz-button (click)="dialog()">打开对话框</button><nz-alert nzType="info" nzMessage="静态对话框预览" nzShowIcon /> }
              @case ('Drawer') { <button nz-button (click)="drawerOpen=true">打开抽屉</button><nz-drawer [(nzVisible)]="drawerOpen" nzTitle="抽屉示例" (nzOnClose)="drawerOpen=false"><ng-container *nzDrawerContent>抽屉内容</ng-container></nz-drawer> }
              @case ('Progress') { <nz-progress [nzPercent]="68" /><nz-progress nzType="circle" [nzPercent]="42" /> }
              @case ('Skeleton') { <nz-skeleton [nzActive]="true" [nzParagraph]="{rows:2}" /> }
              @case ('Spinner') { <nz-spin nzSimple /><nz-spin nzTip="加载中..." /> }
              @case ('Result') { <nz-result nzStatus="success" nzTitle="操作成功" nzSubTitle="结果已保存" /> }
              @case ('Popconfirm') { <button nz-button nz-popconfirm nzPopconfirmTitle="确认删除？">删除</button> }
              @case ('Menu') { <ul nz-menu nzMode="horizontal"><li nz-menu-item nzSelected>工作台</li><li nz-menu-item>设置</li></ul> }
              @case ('Dropdown') { <button nz-button nz-dropdown [nzDropdownMenu]="menu">更多操作</button><nz-dropdown-menu #menu="nzDropdownMenu"><ul nz-menu><li nz-menu-item>编辑</li><li nz-menu-item>删除</li></ul></nz-dropdown-menu> }
              @case ('Breadcrumb') { <nz-breadcrumb><nz-breadcrumb-item>工作区</nz-breadcrumb-item><nz-breadcrumb-item>组件</nz-breadcrumb-item></nz-breadcrumb> }
              @case ('Tabs') { <nz-tabs><nz-tab nzTitle="概览">概览内容</nz-tab><nz-tab nzTitle="设置">设置内容</nz-tab></nz-tabs> }
              @case ('Pagination') { <nz-pagination [nzPageIndex]="1" [nzTotal]="50" /> }
              @case ('Steps') { <div class="steps-demo"><span class="step-done">1 开始</span><span class="step-current">2 进行中</span><span>3 完成</span></div> }
              @case ('Anchor') { <nz-anchor><nz-link nzHref="#comp-Button" nzTitle="Button" /><nz-link nzHref="#comp-Table" nzTitle="Table" /></nz-anchor> }
              @case ('Affix') { <nz-affix [nzOffsetTop]="12"><button nz-button>吸顶操作</button></nz-affix> }
              @case ('Grid') { <div nz-row [nzGutter]="[8,8]"><div nz-col nzSpan="8"><div class="grid-box">8</div></div><div nz-col nzSpan="8"><div class="grid-box">8</div></div><div nz-col nzSpan="8"><div class="grid-box">8</div></div></div> }
              @case ('Layout') { <div class="mini-layout"><aside>侧栏</aside><div><header>页头</header><main>内容</main></div></div> }
              @case ('Accordion') { <nz-collapse nzAccordion><nz-collapse-panel nzHeader="面板一">面板内容</nz-collapse-panel><nz-collapse-panel nzHeader="面板二">更多内容</nz-collapse-panel></nz-collapse> }
              @case ('FloatButton') { <nz-float-button nzType="primary" nzShape="circle"><ui-icon name="plus" /></nz-float-button> }
              @case ('Divider') { <nz-divider nzText="分隔线" /> }
              @case ('Code') { <p nz-typography nzCode>const result = true;</p> }
              @case ('Kbd') { <p nz-typography nzKeyboard>⌘ K</p> }
              @case ('Link') { <a nz-typography href="#component-index">返回组件索引</a> }
              @default { <div class="composed-demo"><ui-icon name="sparkles" /><strong>{{ name }}</strong><span>{{ description(name) }}</span></div> }
            }
          </nz-card>
        </section>
      }</div>
    </section>
  `,
  styles: `
    .components-page{display:grid;gap:20px;min-width:0}.page-heading,.section-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;min-width:0}.page-heading h1,.section-heading h2{margin:0}.index-card{position:sticky;top:0;z-index:2;min-width:0}.index-card h2{font-size:14px;margin:0 0 12px}.index{display:flex;flex-wrap:wrap;gap:8px;min-width:0}.index a{border:1px solid #f0f0f0;border-radius:999px;padding:4px 10px;text-decoration:none;font-size:12px}.sections{display:grid;gap:16px;min-width:0}.component-section{scroll-margin-top:90px;min-width:0;max-width:100%}.section-heading{margin-bottom:8px}.demo-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;min-width:0}.demo-row>*{max-width:100%}.demo-form{max-width:560px}.stat-grid{display:flex;flex-wrap:wrap;gap:32px}.avatar-group{display:flex}.avatar-group nz-avatar{margin-right:-8px;border:2px solid #fff}.constrained{max-width:360px;overflow:auto}.grid-box{padding:16px;background:rgba(24,144,255,.1);text-align:center}.transfer-demo{display:flex;gap:24px;align-items:center;max-width:100%;overflow:auto}.transfer-item{border:1px solid #f0f0f0;padding:8px 16px;margin-top:8px}.transfer-arrows{font-size:24px}.image-placeholder{display:grid;place-items:center;width:240px;height:120px;background:#f0f0f0}.steps-demo{display:flex;flex-wrap:wrap;gap:24px}.step-done{color:#52c41a}.step-current{color:#1890ff;font-weight:600}.mini-layout{display:grid;grid-template-columns:120px 1fr;min-height:120px;max-width:100%;overflow:hidden}.mini-layout aside{padding:16px;background:#001529;color:#fff}.mini-layout header{height:42px;padding:12px;border-bottom:1px solid #f0f0f0}.mini-layout main{padding:12px}.composed-demo{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:16px;border:1px dashed #f0f0f0;min-height:44px;min-width:0;overflow-wrap:anywhere}.composed-demo span{color:rgba(0,0,0,.45)}:host-context(.dark) .index a{border-color:#303030}:host-context(.dark) .avatar-group nz-avatar{border-color:#141414}:host-context(.dark) .composed-demo{border-color:#303030}:host-context(.dark) .composed-demo span{color:rgba(255,255,255,.45)}:host-context(.dark) .transfer-item,:host-context(.dark) .mini-layout header{border-color:#303030}:host-context(.dark) .image-placeholder{background:#303030}@media(max-width:767px){.page-heading{align-items:flex-start;flex-direction:column}.index-card{position:static}.index{max-height:180px;overflow:auto}.section-heading{align-items:flex-start}.stat-grid{gap:16px}.mini-layout{grid-template-columns:1fr}.mini-layout aside{display:none}}
  `,
})
export class ComponentsPage {
  readonly components = Object.keys(COVERAGE) as ComponentKey[];
  readonly iconNames = ['plus', 'search', 'settings', 'bell', 'download'] as const;
  readonly rows = orders.slice(0, 3);
  readonly transferData = [{ key: '1', title: '订单' }, { key: '2', title: '客户' }];
  readonly treeData = [{ title: '工作区', key: '0', expanded: true, children: [{ title: '订单', key: '0-0' }, { title: '设置', key: '0-1' }] }];
  readonly implementedCount = Object.values(COVERAGE).filter((value) => value !== 'missing').length;
  numberValue = 12; selectValue = 'all'; multiValue = ['web']; checked = true; radioValue = 'a'; sliderValue = 42;
  rangeValue = [20, 70]; ratingValue = 4; colorValue = '#1890ff'; drawerOpen = false;
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  status(name: ComponentKey): CoverageStatus { return COVERAGE[name]; }
  statusColor(status: CoverageStatus): string { return status === 'implemented' ? 'success' : status === 'composed' ? 'processing' : 'default'; }
  description(name: ComponentKey): string { return name === 'Tour' ? 'NG-ZORRO 22 未提供官方 Tour 入口。' : '使用 NG-ZORRO 官方部件组合实现。'; }
  beforeUpload = (): boolean => false;
  toast(): void { this.message.success('操作成功'); }
  dialog(): void { this.modal.info({ nzTitle: '对话框示例', nzContent: '这是一个静态交互示例。' }); }
}
