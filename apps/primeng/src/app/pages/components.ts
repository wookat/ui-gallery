import { Component, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Badge } from 'primeng/badge';
import { BlockUI } from 'primeng/blockui';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';
import { Card } from 'primeng/card';
import { Carousel } from 'primeng/carousel';
import { CascadeSelect } from 'primeng/cascadeselect';
import { Checkbox } from 'primeng/checkbox';
import { Chip } from 'primeng/chip';
import { ColorPicker } from 'primeng/colorpicker';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { ContextMenu } from 'primeng/contextmenu';
import { DataView } from 'primeng/dataview';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { Dock } from 'primeng/dock';
import { Drawer } from 'primeng/drawer';
import { Fieldset } from 'primeng/fieldset';
import { FileUpload } from 'primeng/fileupload';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { IftaLabel } from 'primeng/iftalabel';
import { Image } from 'primeng/image';
import { Inplace } from 'primeng/inplace';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputIcon } from 'primeng/inputicon';
import { InputMask } from 'primeng/inputmask';
import { InputNumber } from 'primeng/inputnumber';
import { InputOtp } from 'primeng/inputotp';
import { InputText } from 'primeng/inputtext';
import { Knob } from 'primeng/knob';
import { Listbox } from 'primeng/listbox';
import { Menu } from 'primeng/menu';
import { Menubar } from 'primeng/menubar';
import { Message } from 'primeng/message';
import { MeterGroup } from 'primeng/metergroup';
import { MultiSelect } from 'primeng/multiselect';
import { OrderList } from 'primeng/orderlist';
import { OrganizationChart } from 'primeng/organizationchart';
import { OverlayBadge } from 'primeng/overlaybadge';
import { Paginator } from 'primeng/paginator';
import { Panel } from 'primeng/panel';
import { PanelMenu } from 'primeng/panelmenu';
import { Password } from 'primeng/password';
import { PickList } from 'primeng/picklist';
import { Popover } from 'primeng/popover';
import { ProgressBar } from 'primeng/progressbar';
import { ProgressSpinner } from 'primeng/progressspinner';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { ScrollPanel } from 'primeng/scrollpanel';
import { ScrollTop } from 'primeng/scrolltop';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { Skeleton } from 'primeng/skeleton';
import { Slider } from 'primeng/slider';
import { SpeedDial } from 'primeng/speeddial';
import { SplitButton } from 'primeng/splitbutton';
import { Splitter } from 'primeng/splitter';
import { Stepper, StepList, Step, StepItem, StepPanel } from 'primeng/stepper';
import { Steps } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { Textarea } from 'primeng/textarea';
import { TieredMenu } from 'primeng/tieredmenu';
import { Timeline } from 'primeng/timeline';
import { ToggleButton } from 'primeng/togglebutton';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Toolbar } from 'primeng/toolbar';
import { Tooltip } from 'primeng/tooltip';
import { Tree } from 'primeng/tree';
import { TreeSelect } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import contract from '@ui-gallery/spec/contract.json';
import gallery from '../../../gallery.json';
import nav from '@ui-gallery/spec/mock/nav.json';
import team from '@ui-gallery/spec/mock/team.json';
import orders from '@ui-gallery/spec/mock/orders.json';
import activity from '@ui-gallery/spec/mock/activity.json';
import stats from '@ui-gallery/spec/mock/stats.json';
import tasks from '@ui-gallery/spec/mock/tasks.json';
import notifications from '@ui-gallery/spec/mock/notifications.json';
import chat from '@ui-gallery/spec/mock/chat.json';
import { Icon } from '../icons';
import { FontKey, IconSet, SettingsService, fonts, iconSets } from '../settings.service';
import { PageHeader, StatusTag, Severity, money } from '../shared';

type Coverage = 'implemented' | 'composed' | 'missing';

@Component({
  selector: 'app-components',
  imports: [
    FormsModule, Accordion, AccordionPanel, AccordionHeader, AccordionContent, AutoComplete, Avatar, AvatarGroup, Badge, BlockUI, Breadcrumb, Button, ButtonGroup,
    Card, Carousel, CascadeSelect, Checkbox, Chip, ColorPicker, ConfirmPopup, ContextMenu, DataView, DatePicker, Dialog, Divider, Dock, Drawer, Fieldset, FileUpload,
    FloatLabel, IconField, IftaLabel, Image, Inplace, InputGroup, InputGroupAddon, InputIcon, InputMask, InputNumber, InputOtp, InputText,
    Knob, Listbox, Menu, Menubar, Message, MeterGroup, MultiSelect, OrderList, OrganizationChart, OverlayBadge, Paginator, Panel, PanelMenu, Password, PickList, Popover,
    ProgressBar, ProgressSpinner, RadioButton, Rating, ScrollPanel, ScrollTop, Select, SelectButton, Skeleton, Slider, SpeedDial, SplitButton, Splitter,
    Stepper, StepList, Step, StepItem, StepPanel, Steps, TableModule, Tabs, TabList, Tab, TabPanels, TabPanel, Tag, Textarea, TieredMenu, Timeline, ToggleButton,
    ToggleSwitch, Toolbar, Tooltip, Tree, TreeSelect, TreeTableModule, Icon, PageHeader, StatusTag,
  ],
  template: `
    <app-page-header title="组件总览" [description]="'PrimeNG ' + version + ' · Aura 主题 · 契约 ' + contract.length + ' 个组件：' + count('implemented') + ' 原生 / ' + count('composed') + ' 组合 / ' + count('missing') + ' 缺失'">
      <p-selectbutton [options]="filterOptions" [(ngModel)]="filter" optionLabel="label" optionValue="value" [allowEmpty]="false" size="small" />
    </app-page-header>

    <nav class="anchors" aria-label="组件索引">
      @for (c of contract; track c) {
        @if (filter === 'all' || coverage[c] === filter) {
          <a [href]="'#c-' + c" [class]="'anchor ' + coverage[c]">{{ c }}</a>
        }
      }
    </nav>

    <div class="sections">
      <!-- ============ 通用 ============ -->
      <section class="demo" id="c-Typography" [hidden]="hide('Typography')">
        <h2>Typography <span class="cov composed">composed</span> <span class="note">PrimeNG 不提供排版组件，用原生标签 + 主题 token</span></h2>
        <div class="stack">
          <h1 class="t1">一级标题 Heading 1</h1><h2 class="t2">二级标题 Heading 2</h2><h3 class="t3">三级标题 Heading 3</h3>
          <p>正文段落：PrimeNG 是一个面向 Angular 的开源 UI 组件库，本页展示契约中每一个组件在该库的实现方式。</p>
          <p class="muted text-sm">辅助说明文字 · Secondary text</p>
          <p><a href="#c-Link">链接 Link</a> · <code>inline code</code> · <kbd class="kbd">⌘</kbd><kbd class="kbd">K</kbd> · <mark>高亮</mark> · <del>删除线</del> · <strong>加粗</strong> · <em>斜体</em></p>
        </div>
      </section>

      <section class="demo" id="c-Button" [hidden]="hide('Button')">
        <h2>Button <span class="cov implemented">implemented</span></h2>
        <div class="stack">
          <div class="row wrap">@for (s of severities; track s) { <p-button [label]="s" [severity]="s" /> }</div>
          <div class="row wrap"><p-button label="outlined" [outlined]="true" /><p-button label="text" [text]="true" /><p-button label="raised" [raised]="true" /><p-button label="rounded" [rounded]="true" /><p-button label="link" [link]="true" /><p-button label="disabled" [disabled]="true" /><p-button label="loading" [loading]="true" /></div>
          <div class="row wrap" style="align-items:center"><p-button label="small" size="small" /><p-button label="default" /><p-button label="large" size="large" /><p-button label="图标" ><app-icon name="plus" /></p-button><p-button label="右图标" iconPos="right"><app-icon name="arrow-right" /></p-button><p-button badge="2" label="Badge" /></div>
        </div>
      </section>

      <section class="demo" id="c-ButtonGroup" [hidden]="hide('ButtonGroup')">
        <h2>ButtonGroup <span class="cov implemented">implemented</span></h2>
        <div class="row wrap">
          <p-buttongroup><p-button label="保存"><app-icon name="check" /></p-button><p-button label="删除"><app-icon name="trash" /></p-button><p-button label="取消"><app-icon name="x" /></p-button></p-buttongroup>
          <p-buttongroup><p-button label="左" [outlined]="true" severity="secondary" /><p-button label="中" [outlined]="true" severity="secondary" /><p-button label="右" [outlined]="true" severity="secondary" /></p-buttongroup>
        </div>
      </section>

      <section class="demo" id="c-IconButton" [hidden]="hide('IconButton')">
        <h2>IconButton <span class="cov implemented">implemented</span> <span class="note">p-button 仅图标 + rounded/text/outlined</span></h2>
        <div class="row wrap">
          <p-button [rounded]="true" ariaLabel="搜索"><app-icon name="search" /></p-button>
          <p-button [rounded]="true" [outlined]="true" severity="secondary" ariaLabel="编辑"><app-icon name="pencil" /></p-button>
          <p-button [rounded]="true" [text]="true" severity="danger" ariaLabel="删除"><app-icon name="trash" /></p-button>
          <p-button [rounded]="true" size="small" severity="info" ariaLabel="信息"><app-icon name="info" [size]="14" /></p-button>
          <p-button [rounded]="true" size="large" severity="help" ariaLabel="帮助"><app-icon name="help-circle" [size]="20" /></p-button>
          <p-button [rounded]="true" [disabled]="true" ariaLabel="禁用"><app-icon name="lock" /></p-button>
        </div>
      </section>

      <section class="demo" id="c-Input" [hidden]="hide('Input')">
        <h2>Input <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3">
          <input pInputText placeholder="默认" />
          <input pInputText pSize="small" placeholder="small" />
          <input pInputText pSize="large" placeholder="large" />
          <input pInputText placeholder="disabled" disabled />
          <input pInputText placeholder="invalid" [invalid]="true" />
          <input pInputText placeholder="readonly" value="只读内容" readonly />
          <p-iconfield><p-inputicon><app-icon name="search" [size]="14" /></p-inputicon><input pInputText placeholder="前缀图标" /></p-iconfield>
          <p-floatlabel><input pInputText id="fl" [(ngModel)]="text" /><label for="fl">Float label</label></p-floatlabel>
          <p-iftalabel><input pInputText id="ifta" [(ngModel)]="text" /><label for="ifta">Ifta label</label></p-iftalabel>
          <p-inputgroup><p-inputgroup-addon>https://</p-inputgroup-addon><input pInputText placeholder="domain" /><p-inputgroup-addon>.com</p-inputgroup-addon></p-inputgroup>
          <p-inputmask mask="999-9999-9999" placeholder="电话掩码 999-9999-9999" />
          <p-password [(ngModel)]="pwd" placeholder="密码" [toggleMask]="true" [feedback]="false" />
        </div>
      </section>

      <section class="demo" id="c-Textarea" [hidden]="hide('Textarea')">
        <h2>Textarea <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3">
          <textarea pTextarea rows="3" placeholder="默认"></textarea>
          <textarea pTextarea rows="3" [autoResize]="true" placeholder="autoResize 自动增高"></textarea>
          <textarea pTextarea rows="3" placeholder="disabled" disabled></textarea>
          <textarea pTextarea rows="3" placeholder="invalid" [invalid]="true"></textarea>
        </div>
      </section>

      <section class="demo" id="c-NumberInput" [hidden]="hide('NumberInput')">
        <h2>NumberInput <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3">
          <p-inputnumber [(ngModel)]="num" placeholder="整数" />
          <p-inputnumber [(ngModel)]="num" [showButtons]="true" [min]="0" [max]="100" />
          <p-inputnumber [(ngModel)]="num" [showButtons]="true" buttonLayout="horizontal" spinnerMode="horizontal" styleClass="w-full" inputStyleClass="w-full" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
          <p-inputnumber [(ngModel)]="amount" mode="currency" currency="CNY" locale="zh-CN" />
          <p-inputnumber [(ngModel)]="num" suffix=" %" [min]="0" [max]="100" />
          <p-inputnumber [(ngModel)]="num" [disabled]="true" />
        </div>
      </section>

      <section class="demo" id="c-Select" [hidden]="hide('Select')">
        <h2>Select <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3">
          <p-select [options]="cities" [(ngModel)]="city" placeholder="选择城市" />
          <p-select [options]="cities" [(ngModel)]="city" placeholder="可清除 + 过滤" [showClear]="true" [filter]="true" />
          <p-select [options]="cities" placeholder="small" size="small" />
          <p-select [options]="cities" placeholder="large" size="large" />
          <p-select [options]="cities" placeholder="disabled" [disabled]="true" />
          <p-select [options]="cities" placeholder="invalid" [invalid]="true" />
          <p-select [options]="groupedCities" [group]="true" placeholder="分组选项" optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" />
          <p-select [options]="cities" [(ngModel)]="city" [editable]="true" placeholder="可编辑" />
          <p-listbox [options]="cities" [(ngModel)]="city" [checkmark]="true" />
        </div>
      </section>

      <section class="demo" id="c-MultiSelect" [hidden]="hide('MultiSelect')">
        <h2>MultiSelect <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3">
          <p-multiselect [options]="cities" [(ngModel)]="multi" placeholder="多选" />
          <p-multiselect [options]="cities" [(ngModel)]="multi" placeholder="chip 显示 + 过滤" display="chip" [filter]="true" />
          <p-multiselect [options]="cities" placeholder="disabled" [disabled]="true" />
          <p-listbox [options]="cities" [(ngModel)]="multi" [multiple]="true" [checkbox]="true" [filter]="true" />
        </div>
      </section>

      <section class="demo" id="c-Combobox" [hidden]="hide('Combobox')">
        <h2>Combobox <span class="cov implemented">implemented</span> <span class="note">p-select [filter] / p-autocomplete [dropdown]</span></h2>
        <div class="grid grid-3">
          <p-select [options]="cities" [(ngModel)]="city" [filter]="true" filterPlaceholder="搜索城市" placeholder="可搜索下拉" [showClear]="true" />
          <p-autocomplete [(ngModel)]="acValue" [suggestions]="suggestions()" (completeMethod)="complete($event)" [dropdown]="true" placeholder="输入并选择" />
          <p-cascadeselect [options]="$any(cascade)" optionLabel="name" optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']" placeholder="级联选择" />
        </div>
      </section>

      <section class="demo" id="c-Autocomplete" [hidden]="hide('Autocomplete')">
        <h2>Autocomplete <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3">
          <p-autocomplete [(ngModel)]="acValue" [suggestions]="suggestions()" (completeMethod)="complete($event)" placeholder="基础" />
          <p-autocomplete [(ngModel)]="acMulti" [suggestions]="suggestions()" (completeMethod)="complete($event)" [multiple]="true" placeholder="多值" />
          <p-autocomplete [(ngModel)]="acValue" [suggestions]="suggestions()" (completeMethod)="complete($event)" [disabled]="true" placeholder="disabled" />
        </div>
      </section>

      <section class="demo" id="c-Checkbox" [hidden]="hide('Checkbox')">
        <h2>Checkbox <span class="cov implemented">implemented</span></h2>
        <div class="row wrap">
          <label class="row text-sm"><p-checkbox [(ngModel)]="checked" [binary]="true" inputId="cb1" />默认</label>
          <label class="row text-sm"><p-checkbox [ngModel]="true" [binary]="true" inputId="cb2" />选中</label>
          <label class="row text-sm"><p-checkbox [indeterminate]="true" [binary]="true" inputId="cb3" />半选</label>
          <label class="row text-sm"><p-checkbox [ngModel]="true" [binary]="true" [disabled]="true" inputId="cb4" />禁用</label>
          <label class="row text-sm"><p-checkbox [binary]="true" [invalid]="true" inputId="cb5" />错误</label>
          <label class="row text-sm"><p-checkbox [binary]="true" size="small" inputId="cb6" />small</label>
          <label class="row text-sm"><p-checkbox [binary]="true" size="large" inputId="cb7" />large</label>
          <label class="row text-sm"><p-checkbox [binary]="true" variant="filled" inputId="cb8" />filled</label>
        </div>
      </section>

      <section class="demo" id="c-Radio" [hidden]="hide('Radio')">
        <h2>Radio <span class="cov implemented">implemented</span></h2>
        <div class="row wrap">
          @for (c of cities.slice(0, 3); track c) { <label class="row text-sm"><p-radiobutton name="city" [value]="c" [(ngModel)]="radio" [inputId]="'r-' + c" />{{ c }}</label> }
          <label class="row text-sm"><p-radiobutton name="d" value="x" [ngModel]="'x'" [disabled]="true" inputId="r-d" />禁用</label>
          <label class="row text-sm"><p-radiobutton name="e" value="y" [ngModel]="null" [invalid]="true" inputId="r-e" />错误</label>
          <label class="row text-sm"><p-radiobutton name="f" value="z" [ngModel]="'z'" size="small" inputId="r-f" />small</label>
          <label class="row text-sm"><p-radiobutton name="g" value="w" [ngModel]="'w'" size="large" inputId="r-g" />large</label>
        </div>
      </section>

      <section class="demo" id="c-Switch" [hidden]="hide('Switch')">
        <h2>Switch <span class="cov implemented">implemented</span></h2>
        <div class="row wrap">
          <p-toggleswitch [(ngModel)]="checked" ariaLabel="默认" />
          <p-toggleswitch [ngModel]="true" ariaLabel="开" />
          <p-toggleswitch [ngModel]="true" [disabled]="true" ariaLabel="禁用" />
          <p-toggleswitch [invalid]="true" ariaLabel="错误" />
          <p-toggleswitch [(ngModel)]="checked" ariaLabel="自定义图标"><ng-template #handle let-checked="checked"><app-icon [name]="checked ? 'check' : 'x'" [size]="12" /></ng-template></p-toggleswitch>
          <p-togglebutton [(ngModel)]="checked" onLabel="已开启" offLabel="已关闭" />
          <p-togglebutton [(ngModel)]="checked" onLabel="B" offLabel="B" size="small" />
        </div>
      </section>

      <section class="demo" id="c-Slider" [hidden]="hide('Slider')">
        <h2>Slider <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3" style="align-items:center">
          <p-slider [(ngModel)]="slider" />
          <p-slider [(ngModel)]="sliderRange" [range]="true" />
          <p-slider [(ngModel)]="slider" [step]="20" />
          <p-slider [ngModel]="40" [disabled]="true" />
          <p-slider [(ngModel)]="slider" orientation="vertical" styleClass="vslider" />
          <p-knob [(ngModel)]="slider" [size]="80" valueTemplate="{value}%" />
        </div>
      </section>

      <section class="demo" id="c-Rating" [hidden]="hide('Rating')">
        <h2>Rating <span class="cov implemented">implemented</span></h2>
        <div class="row wrap"><p-rating [(ngModel)]="rating" /><p-rating [ngModel]="3" [readonly]="true" /><p-rating [ngModel]="2" [disabled]="true" /><p-rating [(ngModel)]="rating" [stars]="10" /></div>
      </section>

      <section class="demo" id="c-DatePicker" [hidden]="hide('DatePicker')">
        <h2>DatePicker <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3">
          <p-datepicker [(ngModel)]="date" placeholder="选择日期" [showIcon]="true" dateFormat="yy-mm-dd" />
          <p-datepicker [(ngModel)]="date" placeholder="月份" view="month" dateFormat="yy-mm" />
          <p-datepicker [(ngModel)]="date" placeholder="含时间" [showTime]="true" hourFormat="24" dateFormat="yy-mm-dd" />
          <p-datepicker [(ngModel)]="date" placeholder="含按钮栏" [showButtonBar]="true" dateFormat="yy-mm-dd" />
          <p-datepicker [(ngModel)]="date" placeholder="disabled" [disabled]="true" />
          <p-datepicker [(ngModel)]="date" placeholder="invalid" [invalid]="true" />
        </div>
      </section>

      <section class="demo" id="c-TimePicker" [hidden]="hide('TimePicker')">
        <h2>TimePicker <span class="cov implemented">implemented</span> <span class="note">p-datepicker [timeOnly]</span></h2>
        <div class="grid grid-3">
          <p-datepicker [(ngModel)]="time" [timeOnly]="true" placeholder="24 小时" [showIcon]="true" />
          <p-datepicker [(ngModel)]="time" [timeOnly]="true" hourFormat="12" placeholder="12 小时" />
          <p-datepicker [(ngModel)]="time" [timeOnly]="true" [showSeconds]="true" placeholder="含秒" />
        </div>
      </section>

      <section class="demo" id="c-DateRangePicker" [hidden]="hide('DateRangePicker')">
        <h2>DateRangePicker <span class="cov implemented">implemented</span> <span class="note">p-datepicker selectionMode="range"</span></h2>
        <div class="grid grid-3">
          <p-datepicker [(ngModel)]="range" selectionMode="range" [readonlyInput]="true" placeholder="日期范围" [showIcon]="true" dateFormat="mm-dd" />
          <p-datepicker [(ngModel)]="range" selectionMode="range" [numberOfMonths]="2" [readonlyInput]="true" placeholder="双月面板" dateFormat="mm-dd" styleClass="span-2" />
          <p-datepicker [(ngModel)]="multiDates" selectionMode="multiple" [readonlyInput]="true" placeholder="多选日期" dateFormat="mm-dd" />
        </div>
      </section>

      <section class="demo" id="c-ColorPicker" [hidden]="hide('ColorPicker')">
        <h2>ColorPicker <span class="cov implemented">implemented</span></h2>
        <div class="row wrap" style="align-items:flex-start"><p-colorpicker [(ngModel)]="color" /><p-colorpicker [(ngModel)]="color" format="rgb" /><p-colorpicker [ngModel]="color" [disabled]="true" /><p-colorpicker [(ngModel)]="color" [inline]="true" /></div>
      </section>

      <section class="demo" id="c-Upload" [hidden]="hide('Upload')">
        <h2>Upload <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-2">
          <p-fileupload name="f[]" [multiple]="true" accept="image/*" [maxFileSize]="1000000" [customUpload]="true" chooseLabel="选择" uploadLabel="上传" cancelLabel="清除"><ng-template #empty><p class="muted text-sm">拖放文件到此处</p></ng-template></p-fileupload>
          <div class="stack"><p-fileupload mode="basic" chooseLabel="基础模式" [customUpload]="true" [auto]="true" /><p-fileupload mode="basic" chooseLabel="禁用" [disabled]="true" /></div>
        </div>
      </section>

      <section class="demo" id="c-Cascader" [hidden]="hide('Cascader')">
        <h2>Cascader <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3">
          <p-cascadeselect [(ngModel)]="cascadeValue" [options]="$any(cascade)" optionLabel="name" optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']" placeholder="选择城市" />
          <p-cascadeselect [options]="$any(cascade)" optionLabel="name" optionGroupLabel="name" [optionGroupChildren]="['states', 'cities']" placeholder="disabled" [disabled]="true" />
          <p-treeselect [(ngModel)]="treeValue" [options]="treeNodes" placeholder="树选择" />
        </div>
      </section>

      <section class="demo" id="c-Transfer" [hidden]="hide('Transfer')">
        <h2>Transfer <span class="cov implemented">implemented</span> <span class="note">p-picklist / p-orderlist</span></h2>
        <div class="grid grid-2">
          <p-picklist [source]="pickSource" [target]="pickTarget" sourceHeader="可选成员" targetHeader="已选成员" [dragdrop]="true" [responsive]="true" breakpoint="1024px" [showSourceControls]="false" [showTargetControls]="false" scrollHeight="14rem">
            <ng-template #item let-m>{{ m.name }}</ng-template>
          </p-picklist>
          <p-orderlist [value]="orderItems" header="排序" [dragdrop]="true" scrollHeight="14rem"><ng-template #item let-m>{{ m.name }}</ng-template></p-orderlist>
        </div>
      </section>

      <section class="demo" id="c-Mention" [hidden]="hide('Mention')">
        <h2>Mention <span class="cov composed">composed</span> <span class="note">p-autocomplete 多值 + Chip 组合模拟 @ 提及</span></h2>
        <div class="grid grid-2">
          <p-autocomplete [(ngModel)]="mention" [suggestions]="mentionSuggestions()" (completeMethod)="completeMention($event)" [multiple]="true" optionLabel="name" placeholder="输入 @ 提及成员" [dropdown]="true">
            <ng-template #item let-m><div class="row"><p-avatar [label]="m.name.slice(0, 1)" shape="circle" size="normal" /><span>{{ m.name }} <span class="muted text-xs">{{ m.email }}</span></span></div></ng-template>
          </p-autocomplete>
        </div>
      </section>

      <section class="demo" id="c-PinInput" [hidden]="hide('PinInput')">
        <h2>PinInput <span class="cov implemented">implemented</span> <span class="note">p-inputotp</span></h2>
        <div class="row wrap"><p-inputotp [(ngModel)]="otp" /><p-inputotp [(ngModel)]="otp" [length]="6" [integerOnly]="true" /><p-inputotp [(ngModel)]="otp" [mask]="true" /><p-inputotp [(ngModel)]="otp" [disabled]="true" /></div>
      </section>

      <section class="demo" id="c-Form" [hidden]="hide('Form')">
        <h2>Form <span class="cov composed">composed</span> <span class="note">Angular Reactive/Template Forms + p-message；参见 /form</span></h2>
        <form class="grid grid-2" (submit)="$event.preventDefault(); toast('success', '已提交')">
          <div class="field"><label for="f1">姓名<span class="req">*</span></label><input pInputText id="f1" [(ngModel)]="text" name="n" required /><span class="help">必填项</span></div>
          <div class="field"><label for="f2">邮箱</label><input pInputText id="f2" [invalid]="true" name="e" /><span class="err">邮箱格式不正确</span></div>
          <div class="span-2 row"><p-button label="提交" type="submit" /><p-button label="重置" [outlined]="true" severity="secondary" type="reset" /></div>
        </form>
      </section>

      <section class="demo" id="c-Table" [hidden]="hide('Table')">
        <h2>Table <span class="cov implemented">implemented</span></h2>
        <div class="stack">
          <div class="x-scroll"><p-table [value]="orders.slice(0, 5)" [tableStyle]="{ 'min-width': '40rem' }" styleClass="stack-mobile" [showGridlines]="true" [stripedRows]="true" size="small">
            <ng-template #header><tr><th>订单号</th><th>客户</th><th>状态</th><th class="right">金额</th></tr></ng-template>
            <ng-template #body let-o><tr><td data-label="订单号">{{ o.id }}</td><td data-label="客户">{{ o.customer }}</td><td data-label="状态"><app-status-tag [value]="o.status" /></td><td data-label="金额" class="right">{{ money(o.amount) }}</td></tr></ng-template>
          </p-table></div>
          <div class="x-scroll"><p-table [value]="[]" [tableStyle]="{ 'min-width': '30rem' }" styleClass="stack-mobile"><ng-template #header><tr><th>空状态</th></tr></ng-template><ng-template #emptymessage><tr><td class="muted center">暂无数据</td></tr></ng-template></p-table></div>
          <div class="x-scroll"><p-table [value]="[1, 2, 3]" [tableStyle]="{ 'min-width': '30rem' }" styleClass="stack-mobile"><ng-template #header><tr><th>加载中</th><th></th></tr></ng-template><ng-template #body><tr><td><p-skeleton /></td><td><p-skeleton /></td></tr></ng-template></p-table></div>
        </div>
      </section>

      <section class="demo" id="c-DataGrid" [hidden]="hide('DataGrid')">
        <h2>DataGrid <span class="cov implemented">implemented</span> <span class="note">p-table 排序/筛选/选择/分页/列宽拖拽/冻结列 + p-treetable</span></h2>
        <div class="stack">
          <p-table [value]="orders" [tableStyle]="{ 'min-width': '56rem' }" [paginator]="true" [rows]="5" [(selection)]="gridSel" dataKey="id" [resizableColumns]="true" [reorderableColumns]="true" [scrollable]="true" [globalFilterFields]="['customer', 'id']" #grid>
            <ng-template #caption><div class="row between"><span class="font-medium">订单网格</span><p-iconfield><p-inputicon><app-icon name="search" [size]="14" /></p-inputicon><input pInputText pSize="small" placeholder="全局搜索" (input)="grid.filterGlobal($any($event.target).value, 'contains')" /></p-iconfield></div></ng-template>
            <ng-template #header>
              <tr>
                <th style="width:3rem" pFrozenColumn><p-tableHeaderCheckbox /></th>
                <th pSortableColumn="id" pResizableColumn pReorderableColumn pFrozenColumn>订单号 <p-sortIcon field="id" /></th>
                <th pSortableColumn="customer" pResizableColumn pReorderableColumn>客户 <p-sortIcon field="customer" /><p-columnFilter type="text" field="customer" display="menu" /></th>
                <th pSortableColumn="status" pResizableColumn>状态 <p-sortIcon field="status" /></th>
                <th pSortableColumn="date" pResizableColumn>日期 <p-sortIcon field="date" /></th>
                <th pSortableColumn="amount" pResizableColumn class="right">金额 <p-sortIcon field="amount" /></th>
              </tr>
            </ng-template>
            <ng-template #body let-o><tr><td pFrozenColumn><p-tableCheckbox [value]="o" /></td><td pFrozenColumn class="font-medium">{{ o.id }}</td><td>{{ o.customer }}</td><td><app-status-tag [value]="o.status" /></td><td>{{ o.date }}</td><td class="right">{{ money(o.amount) }}</td></tr></ng-template>
          </p-table>
          <div class="x-scroll"><p-treetable [value]="treeTable" [tableStyle]="{ 'min-width': '36rem' }" [columns]="ttCols">
            <ng-template #header let-columns><tr>@for (c of columns; track c.field) { <th>{{ c.header }}</th> }</tr></ng-template>
            <ng-template #body let-rowNode let-rowData="rowData" let-columns="columns"><tr [ttRow]="rowNode">@for (c of columns; track c.field; let i = $index) { <td>@if (i === 0) { <p-treeTableToggler [rowNode]="rowNode" /> }{{ rowData[c.field] }}</td> }</tr></ng-template>
          </p-treetable></div>
        </div>
      </section>

      <section class="demo" id="c-Descriptions" [hidden]="hide('Descriptions')">
        <h2>Descriptions <span class="cov composed">composed</span> <span class="note">dl/dt/dd + 主题 token</span></h2>
        <p-card><dl class="desc"><dt>订单号</dt><dd>{{ orders[0].id }}</dd><dt>客户</dt><dd>{{ orders[0].customer }}</dd><dt>状态</dt><dd><app-status-tag [value]="orders[0].status" /></dd><dt>金额</dt><dd>{{ money(orders[0].amount) }}</dd><dt>渠道</dt><dd>{{ orders[0].channel }}</dd><dt>日期</dt><dd>{{ orders[0].date }}</dd></dl></p-card>
      </section>

      <section class="demo" id="c-List" [hidden]="hide('List')">
        <h2>List <span class="cov implemented">implemented</span> <span class="note">p-dataview / p-listbox / p-scroller</span></h2>
        <div class="grid grid-2">
          <p-dataview [value]="team" layout="list">
            <ng-template #list let-items>
              @for (m of items; track m.email) { <div class="row between li"><div class="row"><p-avatar [label]="m.name.slice(0, 1)" shape="circle" /><div class="col" style="gap:0"><span class="font-medium text-sm">{{ m.name }}</span><span class="text-xs muted">{{ m.email }}</span></div></div><p-tag [value]="m.role" severity="secondary" /></div> }
            </ng-template>
          </p-dataview>
          <p-dataview [value]="team" layout="grid">
            <ng-template #grid let-items><div class="grid grid-2">@for (m of items; track m.email) { <p-card><div class="col center" style="align-items:center"><p-avatar [label]="m.name.slice(0, 1)" shape="circle" size="large" /><span class="font-medium text-sm">{{ m.name }}</span><span class="text-xs muted">{{ m.role }}</span></div></p-card> }</div></ng-template>
          </p-dataview>
        </div>
      </section>

      <section class="demo" id="c-Card" [hidden]="hide('Card')">
        <h2>Card <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-3">
          <p-card header="标题" subheader="副标题"><p class="text-sm muted">卡片内容区域。</p><ng-template #footer><div class="row"><p-button label="确定" size="small" /><p-button label="取消" size="small" [text]="true" severity="secondary" /></div></ng-template></p-card>
          <p-card><ng-template #header><div class="placeholder" style="height:8rem; border-radius: 0"><app-icon name="image" [size]="28" /></div></ng-template><span class="font-medium">带封面</span><p class="text-sm muted">header 插槽放图片。</p></p-card>
          <p-card styleClass="hoverable"><div class="row between"><span class="font-medium">可悬停</span><p-tag value="hover" /></div><p class="text-sm muted">悬停时阴影加深。</p></p-card>
        </div>
      </section>

      <section class="demo" id="c-Avatar" [hidden]="hide('Avatar')">
        <h2>Avatar <span class="cov implemented">implemented</span></h2>
        <div class="row wrap" style="align-items:center">
          <p-avatar label="P" /><p-avatar label="P" shape="circle" /><p-avatar label="P" size="large" shape="circle" /><p-avatar label="P" size="xlarge" shape="circle" />
          <p-avatar icon="pi pi-user" shape="circle" /><p-avatar label="A" shape="circle" [style]="{ 'background-color': 'var(--p-primary-color)', color: 'var(--p-primary-contrast-color)' }" />
          <p-overlaybadge value="4" severity="danger"><p-avatar label="U" size="large" /></p-overlaybadge>
        </div>
      </section>

      <section class="demo" id="c-AvatarGroup" [hidden]="hide('AvatarGroup')">
        <h2>AvatarGroup <span class="cov implemented">implemented</span></h2>
        <p-avatar-group>@for (m of team.slice(0, 5); track m.email) { <p-avatar [label]="m.name.slice(0, 1)" shape="circle" size="large" /> }<p-avatar label="+2" shape="circle" size="large" /></p-avatar-group>
      </section>

      <section class="demo" id="c-Badge" [hidden]="hide('Badge')">
        <h2>Badge <span class="cov implemented">implemented</span></h2>
        <div class="row wrap" style="align-items:center">
          @for (s of severities; track s) { <p-badge value="2" [severity]="s" /> }
          <p-badge value="8" size="small" /><p-badge value="8" size="large" /><p-badge value="8" size="xlarge" /><p-badge />
          <p-overlaybadge value="3"><app-icon name="bell" [size]="24" /></p-overlaybadge>
          <p-overlaybadge severity="danger"><app-icon name="mail" [size]="24" /></p-overlaybadge>
          <p-button label="消息" badge="12" badgeSeverity="contrast" [outlined]="true" />
        </div>
      </section>

      <section class="demo" id="c-Tag" [hidden]="hide('Tag')">
        <h2>Tag <span class="cov implemented">implemented</span> <span class="note">p-tag + p-chip</span></h2>
        <div class="row wrap">
          @for (s of severities; track s) { <p-tag [value]="s" [severity]="s" /> }
          <p-tag value="rounded" [rounded]="true" /><p-tag value="icon" icon="pi pi-check" severity="success" />
          <p-chip label="Chip" /><p-chip label="可移除" [removable]="true" /><p-chip label="头像" image="" icon="pi pi-user" /><p-chip label="图标"><app-icon name="star" [size]="14" /></p-chip>
        </div>
      </section>

      <section class="demo" id="c-Statistic" [hidden]="hide('Statistic')">
        <h2>Statistic <span class="cov composed">composed</span> <span class="note">Card + 大数字 + Tag 组合</span></h2>
        <div class="grid grid-4">
          @for (s of stats; track s.key) {
            <p-card><span class="text-sm muted">{{ s.label }}</span><div class="stat">{{ s.unit === 'CNY' ? money(s.value) : s.unit === '%' ? s.value + '%' : s.value }}</div><p-tag [value]="(s.delta > 0 ? '+' : '') + s.delta + '%'" [severity]="s.delta >= 0 ? 'success' : 'danger'" /></p-card>
          }
        </div>
      </section>

      <section class="demo" id="c-Timeline" [hidden]="hide('Timeline')">
        <h2>Timeline <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-2">
          <p-timeline [value]="activity.slice(0, 4)"><ng-template #content let-a><span class="text-sm">{{ a.user }} {{ a.action }}</span><br /><span class="text-xs muted">{{ a.time }}</span></ng-template></p-timeline>
          <p-timeline [value]="activity.slice(0, 4)" align="alternate"><ng-template #marker><span class="tl-marker"><app-icon name="check" [size]="12" /></span></ng-template><ng-template #content let-a><span class="text-sm">{{ a.action }}</span></ng-template></p-timeline>
          <p-timeline [value]="activity.slice(0, 4)" layout="horizontal" align="top" styleClass="span-2"><ng-template #content let-a><span class="text-xs">{{ a.time }}</span></ng-template></p-timeline>
        </div>
      </section>

      <section class="demo" id="c-Tree" [hidden]="hide('Tree')">
        <h2>Tree <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-2">
          <p-tree [value]="treeNodes" [filter]="true" filterPlaceholder="过滤" />
          <p-tree [value]="treeNodes" selectionMode="checkbox" [(selection)]="treeSel" />
        </div>
      </section>

      <section class="demo" id="c-Calendar" [hidden]="hide('Calendar')">
        <h2>Calendar <span class="cov implemented">implemented</span> <span class="note">p-datepicker [inline]</span></h2>
        <div class="grid grid-2"><p-datepicker [(ngModel)]="date" [inline]="true" /><p-datepicker [(ngModel)]="range" [inline]="true" selectionMode="range" [showWeek]="true" /></div>
      </section>

      <section class="demo" id="c-Image" [hidden]="hide('Image')">
        <h2>Image <span class="cov implemented">implemented</span> <span class="note">p-image 预览 + p-skeleton 占位</span></h2>
        <div class="row wrap" style="align-items:flex-start">
          <p-image [src]="svgPlaceholder" alt="示意图" width="160" [preview]="true" />
          <p-skeleton width="10rem" height="7rem" />
          <div class="placeholder" style="width:10rem; height:7rem"><app-icon name="image" [size]="24" /></div>
        </div>
      </section>

      <section class="demo" id="c-Carousel" [hidden]="hide('Carousel')">
        <h2>Carousel <span class="cov implemented">implemented</span></h2>
        <p-carousel [value]="team" [numVisible]="3" [numScroll]="1" [circular]="true" [responsiveOptions]="carouselOptions">
          <ng-template #item let-m><div style="padding:0.5rem"><p-card><div class="col center" style="align-items:center"><p-avatar [label]="m.name.slice(0, 1)" shape="circle" size="large" /><span class="font-medium">{{ m.name }}</span><span class="text-xs muted">{{ m.role }}</span></div></p-card></div></ng-template>
        </p-carousel>
      </section>

      <section class="demo" id="c-Empty" [hidden]="hide('Empty')">
        <h2>Empty <span class="cov composed">composed</span> <span class="note">图标 + 文案 + 按钮组合</span></h2>
        <div class="grid grid-2">
          <p-card><div class="empty"><app-icon name="boxes" [size]="36" /><p class="font-medium">暂无数据</p><p class="muted text-sm">当前筛选条件下没有结果。</p><p-button label="清除筛选" [outlined]="true" severity="secondary" size="small" /></div></p-card>
          <p-card><div class="empty"><app-icon name="alert-circle" [size]="36" /><p class="font-medium">加载失败</p><p class="muted text-sm">请检查网络后重试。</p><p-button label="重试" size="small"><app-icon name="refresh" /></p-button></div></p-card>
        </div>
      </section>

      <section class="demo" id="c-Tooltip" [hidden]="hide('Tooltip')">
        <h2>Tooltip <span class="cov implemented">implemented</span></h2>
        <div class="row wrap">
          <p-button label="上方" pTooltip="上方提示" tooltipPosition="top" [outlined]="true" severity="secondary" />
          <p-button label="下方" pTooltip="下方提示" tooltipPosition="bottom" [outlined]="true" severity="secondary" />
          <p-button label="左侧" pTooltip="左侧提示" tooltipPosition="left" [outlined]="true" severity="secondary" />
          <p-button label="右侧" pTooltip="右侧提示" tooltipPosition="right" [outlined]="true" severity="secondary" />
          <input pInputText pTooltip="聚焦时显示" tooltipEvent="focus" placeholder="focus 触发" />
        </div>
      </section>

      <section class="demo" id="c-Popover" [hidden]="hide('Popover')">
        <h2>Popover <span class="cov implemented">implemented</span></h2>
        <div class="row wrap">
          <p-button label="打开 Popover" (onClick)="op.toggle($event)" [outlined]="true" />
          <p-popover #op><div class="stack" style="width: 16rem"><span class="font-medium">通知</span>@for (n of notifications.slice(0, 2); track n.title) { <div class="text-sm"><span>{{ n.title }}</span><br /><span class="text-xs muted">{{ n.time }}</span></div> }</div></p-popover>
          <p-button label="悬停卡片" (mouseenter)="hover.show($event)" (mouseleave)="hover.hide()" [text]="true" />
          <p-popover #hover><div class="row" style="width: 14rem"><p-avatar [label]="team[0].name.slice(0, 1)" shape="circle" size="large" /><div class="col" style="gap:0"><span class="font-medium">{{ team[0].name }}</span><span class="text-xs muted">{{ team[0].email }}</span></div></div></p-popover>
        </div>
      </section>

      <section class="demo" id="c-QRCode" [hidden]="hide('QRCode')">
        <h2>QRCode <span class="cov missing">missing</span> <span class="note">PrimeNG 无二维码组件，需第三方（如 angularx-qrcode）</span></h2>
        <div class="placeholder" style="width:8rem;height:8rem">QR</div>
      </section>

      <section class="demo" id="c-Segmented" [hidden]="hide('Segmented')">
        <h2>Segmented <span class="cov implemented">implemented</span> <span class="note">p-selectbutton</span></h2>
        <div class="row wrap">
          <p-selectbutton [options]="ranges" [(ngModel)]="segment" optionLabel="label" optionValue="value" [allowEmpty]="false" />
          <p-selectbutton [options]="ranges" [(ngModel)]="segment" optionLabel="label" optionValue="value" size="small" />
          <p-selectbutton [options]="ranges" [(ngModel)]="segment" optionLabel="label" optionValue="value" size="large" />
          <p-selectbutton [options]="ranges" [ngModel]="'week'" optionLabel="label" optionValue="value" [disabled]="true" />
          <p-selectbutton [options]="ranges" [(ngModel)]="segments" optionLabel="label" optionValue="value" [multiple]="true" />
        </div>
      </section>

      <section class="demo" id="c-Alert" [hidden]="hide('Alert')">
        <h2>Alert <span class="cov implemented">implemented</span> <span class="note">p-message</span></h2>
        <div class="stack">
          @for (s of severities; track s) { <p-message [severity]="s === 'danger' ? 'error' : s" [closable]="true">{{ s }} 提示文案</p-message> }
          <p-message severity="info" variant="outlined">outlined 变体</p-message>
          <p-message severity="success" variant="simple">simple 变体</p-message>
          <p-message severity="warn" size="small">small</p-message>
          <p-message severity="error" size="large" icon="pi pi-times-circle">large + 图标</p-message>
        </div>
      </section>

      <section class="demo" id="c-Toast" [hidden]="hide('Toast')">
        <h2>Toast <span class="cov implemented">implemented</span></h2>
        <div class="row wrap">@for (s of ['success', 'info', 'warn', 'error', 'secondary', 'contrast']; track s) { <p-button [label]="s" [severity]="$any(s === 'error' ? 'danger' : s)" [outlined]="true" (onClick)="toast(s, s + ' 消息')" /> }<p-button label="粘性" (onClick)="toast('info', '需要手动关闭', true)" /></div>
      </section>

      <section class="demo" id="c-Notification" [hidden]="hide('Notification')">
        <h2>Notification <span class="cov composed">composed</span> <span class="note">Toast 自定义模板 + 操作按钮</span></h2>
        <div class="row wrap"><p-button label="发送通知" (onClick)="notify()" [outlined]="true"><app-icon name="bell" /></p-button></div>
      </section>

      <section class="demo" id="c-Dialog" [hidden]="hide('Dialog')">
        <h2>Dialog <span class="cov implemented">implemented</span></h2>
        <div class="row wrap">
          <p-button label="基础对话框" (onClick)="dialog.set(true)" [outlined]="true" />
          <p-button label="确认对话框" (onClick)="confirmDialog()" severity="danger" [outlined]="true" />
          <p-button label="最大化" (onClick)="dialogMax.set(true)" [outlined]="true" severity="secondary" />
        </div>
        <p-dialog header="编辑成员" [visible]="dialog()" (visibleChange)="dialog.set($event)" [modal]="true" [style]="{ width: '28rem', maxWidth: '95vw' }" [draggable]="false">
          <div class="stack"><div class="field"><label for="dn">姓名</label><input pInputText id="dn" [ngModel]="team[0].name" /></div><div class="field"><label for="de">邮箱</label><input pInputText id="de" [ngModel]="team[0].email" /></div></div>
          <ng-template #footer><p-button label="取消" [text]="true" severity="secondary" (onClick)="dialog.set(false)" /><p-button label="保存" (onClick)="dialog.set(false); toast('success', '已保存')" /></ng-template>
        </p-dialog>
        <p-dialog header="可最大化" [visible]="dialogMax()" (visibleChange)="dialogMax.set($event)" [modal]="true" [maximizable]="true" [style]="{ width: '40rem', maxWidth: '95vw' }"><p class="muted">点击右上角按钮最大化对话框。</p></p-dialog>
      </section>

      <section class="demo" id="c-Drawer" [hidden]="hide('Drawer')">
        <h2>Drawer <span class="cov implemented">implemented</span></h2>
        <div class="row wrap">@for (p of drawerPositions; track p) { <p-button [label]="p" (onClick)="drawerPos.set(p)" [outlined]="true" severity="secondary" /> }<p-button label="full" (onClick)="drawerPos.set('full')" [outlined]="true" severity="secondary" /></div>
        <p-drawer [visible]="!!drawerPos()" (visibleChange)="!$event && drawerPos.set(null)" [position]="drawerPos() ?? 'right'" header="抽屉"><p class="muted">位置：{{ drawerPos() }}</p></p-drawer>
      </section>

      <section class="demo" id="c-Progress" [hidden]="hide('Progress')">
        <h2>Progress <span class="cov implemented">implemented</span></h2>
        <div class="stack">
          <p-progressbar [value]="tasks[0].progress" /><p-progressbar [value]="tasks[1].progress" [showValue]="false" [style]="{ height: '6px' }" /><p-progressbar mode="indeterminate" [style]="{ height: '6px' }" />
          <p-metergroup [value]="meter" />
          <div class="row"><p-knob [ngModel]="tasks[2].progress" [readonly]="true" [size]="72" /><p-knob [ngModel]="tasks[3].progress" [readonly]="true" [size]="72" valueColor="var(--p-green-500)" /></div>
        </div>
      </section>

      <section class="demo" id="c-Skeleton" [hidden]="hide('Skeleton')">
        <h2>Skeleton <span class="cov implemented">implemented</span></h2>
        <div class="grid grid-2">
          <div class="stack"><p-skeleton width="60%" /><p-skeleton /><p-skeleton width="80%" /><p-skeleton height="4rem" /></div>
          <div class="row" style="align-items:flex-start"><p-skeleton shape="circle" size="3rem" /><div class="stack grow"><p-skeleton width="40%" /><p-skeleton /><p-skeleton borderRadius="16px" width="6rem" height="1.5rem" /></div></div>
        </div>
      </section>

      <section class="demo" id="c-Spinner" [hidden]="hide('Spinner')">
        <h2>Spinner <span class="cov implemented">implemented</span></h2>
        <div class="row wrap" style="align-items:center"><p-progressspinner [style]="{ width: '2rem', height: '2rem' }" strokeWidth="6" ariaLabel="加载中" /><p-progressspinner [style]="{ width: '3rem', height: '3rem' }" strokeWidth="4" ariaLabel="加载中" /><p-progressspinner [style]="{ width: '4rem', height: '4rem' }" strokeWidth="3" ariaLabel="加载中" /><p-button label="加载中" [loading]="true" />
          <p-button label="BlockUI" [outlined]="true" (onClick)="block()" /><p-blockui [blocked]="blocked()" [target]="blockTarget" /><p-card #blockTarget styleClass="grow"><span class="text-sm muted">被遮罩的区域</span></p-card>
        </div>
      </section>

      <section class="demo" id="c-Result" [hidden]="hide('Result')">
        <h2>Result <span class="cov composed">composed</span> <span class="note">图标 + 标题 + 描述 + 操作</span></h2>
        <div class="grid grid-2">
          <p-card><div class="empty"><span class="result-icon success"><app-icon name="check" [size]="28" /></span><p class="font-semibold">操作成功</p><p class="muted text-sm">你的更改已保存。</p><p-button label="返回" size="small" /></div></p-card>
          <p-card><div class="empty"><span class="result-icon danger"><app-icon name="x" [size]="28" /></span><p class="font-semibold">提交失败</p><p class="muted text-sm">请稍后重试。</p><p-button label="重试" size="small" severity="danger" [outlined]="true" /></div></p-card>
        </div>
      </section>

      <section class="demo" id="c-Popconfirm" [hidden]="hide('Popconfirm')">
        <h2>Popconfirm <span class="cov implemented">implemented</span> <span class="note">p-confirmpopup</span></h2>
        <div class="row wrap"><p-button label="删除" severity="danger" [outlined]="true" (onClick)="popconfirm($event)"><app-icon name="trash" /></p-button><p-confirmpopup key="pop" /></div>
      </section>

      <section class="demo" id="c-Menu" [hidden]="hide('Menu')">
        <h2>Menu <span class="cov implemented">implemented</span> <span class="note">p-menu / p-tieredmenu / p-panelmenu / p-contextmenu / p-megamenu</span></h2>
        <div class="grid grid-3">
          <p-menu [model]="menuItems" />
          <p-tieredmenu [model]="tieredItems" />
          <p-panelmenu [model]="panelItems" />
          <div class="placeholder span-3" style="height: 5rem" (contextmenu)="cm.show($event)">右键打开 ContextMenu</div>
          <p-contextmenu #cm [model]="menuItems" />
        </div>
      </section>

      <section class="demo" id="c-Dropdown" [hidden]="hide('Dropdown')">
        <h2>Dropdown <span class="cov implemented">implemented</span> <span class="note">p-menu [popup] / p-splitbutton</span></h2>
        <div class="row wrap">
          <p-button label="下拉菜单" [outlined]="true" (onClick)="pm.toggle($event)" iconPos="right"><app-icon name="chevron-down" /></p-button><p-menu #pm [model]="menuItems" [popup]="true" />
          <p-splitbutton label="保存" [model]="menuItems" (onClick)="toast('success', '已保存')" />
          <p-splitbutton label="outlined" [model]="menuItems" [outlined]="true" severity="secondary" />
          <p-splitbutton label="small" [model]="menuItems" size="small" severity="info" />
        </div>
      </section>

      <section class="demo" id="c-Breadcrumb" [hidden]="hide('Breadcrumb')">
        <h2>Breadcrumb <span class="cov implemented">implemented</span></h2>
        <p-breadcrumb [model]="crumbs" [home]="{ icon: 'pi pi-home' }" />
      </section>

      <section class="demo" id="c-Tabs" [hidden]="hide('Tabs')">
        <h2>Tabs <span class="cov implemented">implemented</span></h2>
        <div class="stack">
          <p-tabs value="0"><p-tablist><p-tab value="0">概览</p-tab><p-tab value="1">订单</p-tab><p-tab value="2" [disabled]="true">禁用</p-tab></p-tablist><p-tabpanels><p-tabpanel value="0"><p class="text-sm muted">概览内容</p></p-tabpanel><p-tabpanel value="1"><p class="text-sm muted">订单内容</p></p-tabpanel></p-tabpanels></p-tabs>
          <p-tabs value="0" [scrollable]="true"><p-tablist>@for (n of nav; track n.key; let i = $index) { <p-tab [value]="'' + i"><app-icon [name]="$any(n.icon)" [size]="14" /> {{ n.label }}</p-tab> }</p-tablist></p-tabs>
        </div>
      </section>

      <section class="demo" id="c-Pagination" [hidden]="hide('Pagination')">
        <h2>Pagination <span class="cov implemented">implemented</span></h2>
        <div class="stack"><p-paginator [rows]="10" [totalRecords]="120" /><p-paginator [rows]="10" [totalRecords]="120" [rowsPerPageOptions]="[10, 20, 30]" [showFirstLastIcon]="false" [showCurrentPageReport]="true" currentPageReportTemplate="{first} - {last} / {totalRecords}" /><p-paginator [rows]="10" [totalRecords]="120" [showPageLinks]="false" [showJumpToPageDropdown]="true" /></div>
      </section>

      <section class="demo" id="c-Steps" [hidden]="hide('Steps')">
        <h2>Steps <span class="cov implemented">implemented</span> <span class="note">p-steps / p-stepper</span></h2>
        <div class="stack">
          <p-steps [model]="stepItems" [activeIndex]="1" [readonly]="false" />
          <p-stepper [value]="1"><p-step-list><p-step [value]="1">基本信息</p-step><p-step [value]="2">配置</p-step><p-step [value]="3">完成</p-step></p-step-list></p-stepper>
          <p-stepper [value]="1" styleClass="vstepper"><p-step-item [value]="1"><p-step>第一步</p-step><p-step-panel><ng-template #content><p class="text-sm muted">垂直步骤内容</p></ng-template></p-step-panel></p-step-item><p-step-item [value]="2"><p-step>第二步</p-step><p-step-panel><ng-template #content><p class="text-sm muted">第二步内容</p></ng-template></p-step-panel></p-step-item></p-stepper>
        </div>
      </section>

      <section class="demo" id="c-Anchor" [hidden]="hide('Anchor')">
        <h2>Anchor <span class="cov composed">composed</span> <span class="note">本页顶部索引：a[href=#id] + 路由 anchorScrolling</span></h2>
        <div class="row wrap">@for (c of contract.slice(0, 6); track c) { <a class="anchor implemented" [href]="'#c-' + c">{{ c }}</a> }</div>
      </section>

      <section class="demo" id="c-BackTop" [hidden]="hide('BackTop')">
        <h2>BackTop <span class="cov implemented">implemented</span> <span class="note">p-scrolltop（右下角浮动，滚动后出现）</span></h2>
        <p-scrolltop [threshold]="200" /><p class="text-sm muted">向下滚动页面后右下角出现返回顶部按钮。</p>
        <p-scrollpanel [style]="{ width: '100%', height: '8rem' }"><div class="stack" style="padding-right:1rem">@for (a of activity; track $index) { <p class="text-sm">{{ a.user }} {{ a.action }}</p> }</div></p-scrollpanel>
      </section>

      <section class="demo" id="c-Affix" [hidden]="hide('Affix')">
        <h2>Affix <span class="cov composed">composed</span> <span class="note">CSS position: sticky（本应用顶栏 / 落地页导航即使用）</span></h2>
        <p-scrollpanel [style]="{ width: '100%', height: '8rem' }"><div class="sticky-demo"><div class="sticky-bar">固定在容器顶部的工具栏</div>@for (a of activity; track $index) { <p class="text-sm" style="padding:0 0.5rem">{{ a.user }} {{ a.action }}</p> }</div></p-scrollpanel>
      </section>

      <section class="demo" id="c-Navbar" [hidden]="hide('Navbar')">
        <h2>Navbar <span class="cov implemented">implemented</span> <span class="note">p-menubar / p-toolbar</span></h2>
        <div class="stack">
          <p-menubar [model]="menubarItems" styleClass="demo-menubar"><ng-template #start><span class="row font-semibold"><span class="logo"><app-icon name="boxes" [size]="14" /></span>Acme</span></ng-template><ng-template #end><div class="row"><input pInputText pSize="small" placeholder="搜索" /><p-avatar [label]="team[0].name.slice(0, 1)" shape="circle" /></div></ng-template></p-menubar>
          <p-toolbar><ng-template #start><p-button [text]="true" severity="secondary" ariaLabel="菜单"><app-icon name="menu" /></p-button><span class="font-medium">工具栏</span></ng-template><ng-template #center><p-selectbutton [options]="ranges" [ngModel]="'day'" optionLabel="label" optionValue="value" size="small" /></ng-template><ng-template #end><p-button label="新建" size="small" /></ng-template></p-toolbar>
        </div>
      </section>

      <section class="demo" id="c-Sidebar" [hidden]="hide('Sidebar')">
        <h2>Sidebar <span class="cov implemented">implemented</span> <span class="note">p-drawer + p-panelmenu（应用外壳同款）</span></h2>
        <div class="row wrap"><p-button label="打开侧栏" [outlined]="true" (onClick)="sidebar.set(true)"><app-icon name="menu" /></p-button><p-dock [model]="dockItems" position="bottom" styleClass="static-dock" /></div>
        <p-drawer [visible]="sidebar()" (visibleChange)="sidebar.set($event)" header="Acme"><p-panelmenu [model]="panelItems" /></p-drawer>
      </section>

      <section class="demo" id="c-CommandPalette" [hidden]="hide('CommandPalette')">
        <h2>CommandPalette <span class="cov composed">composed</span> <span class="note">Dialog + InputText + Listbox 组合</span></h2>
        <p-button label="⌘K 打开命令面板" [outlined]="true" severity="secondary" (onClick)="palette.set(true)"><app-icon name="search" /></p-button>
        <p-dialog [visible]="palette()" (visibleChange)="palette.set($event)" [modal]="true" [showHeader]="false" [style]="{ width: '32rem', maxWidth: '95vw' }" styleClass="palette" [dismissableMask]="true">
          <p-iconfield><p-inputicon><app-icon name="search" /></p-inputicon><input pInputText class="w-full" pSize="large" placeholder="输入命令或搜索…" [(ngModel)]="paletteQ" /></p-iconfield>
          <p-listbox [options]="paletteItems()" optionLabel="label" [group]="true" optionGroupLabel="label" optionGroupChildren="items" (onChange)="palette.set(false); toast('info', $event.value.label)" scrollHeight="16rem" />
          <div class="row between text-xs muted" style="padding:0.5rem 0.25rem 0"><span><kbd class="kbd">↑↓</kbd> 选择 <kbd class="kbd">⏎</kbd> 执行</span><span><kbd class="kbd">Esc</kbd> 关闭</span></div>
        </p-dialog>
      </section>

      <section class="demo" id="c-Grid" [hidden]="hide('Grid')">
        <h2>Grid <span class="cov composed">composed</span> <span class="note">CSS Grid 工具类（PrimeFlex 已弃用，官方推荐 Tailwind/CSS）</span></h2>
        <div class="grid grid-4">@for (i of [1, 2, 3, 4, 5, 6, 7, 8]; track i) { <div class="cell">{{ i }}</div> }</div>
      </section>

      <section class="demo" id="c-Stack" [hidden]="hide('Stack')">
        <h2>Stack <span class="cov composed">composed</span> <span class="note">flex 列/行 + gap</span></h2>
        <div class="grid grid-2"><div class="stack"><div class="cell">A</div><div class="cell">B</div><div class="cell">C</div></div><div class="row"><div class="cell grow">A</div><div class="cell grow">B</div><div class="cell grow">C</div></div></div>
      </section>

      <section class="demo" id="c-Layout" [hidden]="hide('Layout')">
        <h2>Layout <span class="cov composed">composed</span> <span class="note">应用外壳 = 顶栏 + 侧栏 + 内容 + 页脚（CSS Grid）</span></h2>
        <div class="layout-demo"><div class="cell hdr">Header</div><div class="cell side">Sider</div><div class="cell body">Content</div><div class="cell ftr">Footer</div></div>
      </section>

      <section class="demo" id="c-Container" [hidden]="hide('Container')">
        <h2>Container <span class="cov composed">composed</span> <span class="note">max-width + margin auto</span></h2>
        <div class="cell" style="max-width: 40rem; margin: 0 auto">居中容器 max-width: 40rem</div>
      </section>

      <section class="demo" id="c-AspectRatio" [hidden]="hide('AspectRatio')">
        <h2>AspectRatio <span class="cov composed">composed</span> <span class="note">CSS aspect-ratio</span></h2>
        <div class="grid grid-3"><div class="placeholder" style="aspect-ratio: 16/9">16 : 9</div><div class="placeholder" style="aspect-ratio: 4/3">4 : 3</div><div class="placeholder" style="aspect-ratio: 1">1 : 1</div></div>
      </section>

      <section class="demo" id="c-Resizable" [hidden]="hide('Resizable')">
        <h2>Resizable <span class="cov implemented">implemented</span> <span class="note">p-splitter</span></h2>
        <p-splitter [style]="{ height: '10rem' }" [panelSizes]="[30, 70]"><ng-template #panel><div class="cell full">左 30%</div></ng-template><ng-template #panel><p-splitter layout="vertical"><ng-template #panel><div class="cell full">上</div></ng-template><ng-template #panel><div class="cell full">下</div></ng-template></p-splitter></ng-template></p-splitter>
      </section>

      <section class="demo" id="c-ScrollArea" [hidden]="hide('ScrollArea')">
        <h2>ScrollArea <span class="cov implemented">implemented</span> <span class="note">p-scrollpanel / p-scroller 虚拟滚动</span></h2>
        <div class="grid grid-2">
          <p-scrollpanel [style]="{ width: '100%', height: '10rem' }"><div style="padding-right: 1rem">@for (o of orders; track o.id) { <p class="text-sm">{{ o.id }} · {{ o.customer }} · {{ money(o.amount) }}</p> }</div></p-scrollpanel>
          <p-scroller [items]="scrollerItems" [itemSize]="36" scrollHeight="10rem" styleClass="scroller"><ng-template #item let-i let-options="options"><div class="li text-sm" [class.odd]="options.odd">{{ i }}</div></ng-template></p-scroller>
        </div>
      </section>

      <section class="demo" id="c-Accordion" [hidden]="hide('Accordion')">
        <h2>Accordion <span class="cov implemented">implemented</span> <span class="note">p-accordion / p-panel / p-fieldset</span></h2>
        <div class="grid grid-2">
          <p-accordion [value]="['0']" [multiple]="true">@for (n of notifications.slice(0, 3); track n.title; let i = $index) { <p-accordion-panel [value]="'' + i"><p-accordion-header>{{ n.title }}</p-accordion-header><p-accordion-content><p class="text-sm muted">{{ n.time }}{{ n.unread ? ' · 未读' : '' }}</p></p-accordion-content></p-accordion-panel> }</p-accordion>
          <div class="stack"><p-panel header="可折叠面板" [toggleable]="true"><p class="text-sm muted">p-panel 内容</p></p-panel><p-fieldset legend="Fieldset" [toggleable]="true"><p class="text-sm muted">p-fieldset 内容</p></p-fieldset><p-inplace><ng-template #display><span class="text-sm">点击就地编辑</span></ng-template><ng-template #content><input pInputText pSize="small" [ngModel]="text" /></ng-template></p-inplace></div>
        </div>
      </section>

      <section class="demo" id="c-ThemeProvider" [hidden]="hide('ThemeProvider')">
        <h2>ThemeProvider <span class="cov implemented">implemented</span> <span class="note">providePrimeNG({{ '{' }} theme: Aura, darkModeSelector: '.dark' {{ '}' }}) + URL 参数 ?theme/?font/?icons</span></h2>
        <div class="grid grid-3">
          <div class="field"><span class="label">主题</span><p-selectbutton [options]="[{ label: '浅色', value: false }, { label: '深色', value: true }]" [ngModel]="settings.dark()" (ngModelChange)="settings.setDark($event)" optionLabel="label" optionValue="value" [allowEmpty]="false" /></div>
          <div class="field"><span class="label">字体</span><p-select [options]="fontOptions" [ngModel]="settings.font()" (ngModelChange)="settings.setFont($event)" optionLabel="label" optionValue="value" /></div>
          <div class="field"><span class="label">图标集</span><p-select [options]="iconOptions" [ngModel]="settings.icons()" (ngModelChange)="settings.setIcons($event)" /></div>
        </div>
        <div class="row wrap" style="margin-top:0.75rem">@for (n of ['search', 'bell', 'settings', 'trash', 'calendar', 'mail', 'star', 'heart']; track n) { <span class="swatch"><app-icon [name]="$any(n)" [size]="20" /></span> }</div>
      </section>

      <section class="demo" id="c-Watermark" [hidden]="hide('Watermark')">
        <h2>Watermark <span class="cov missing">missing</span> <span class="note">PrimeNG 无水印组件</span></h2>
        <div class="placeholder" style="height:6rem">—</div>
      </section>

      <section class="demo" id="c-Tour" [hidden]="hide('Tour')">
        <h2>Tour <span class="cov missing">missing</span> <span class="note">PrimeNG 无引导/漫游组件</span></h2>
        <div class="placeholder" style="height:6rem">—</div>
      </section>

      <section class="demo" id="c-FloatButton" [hidden]="hide('FloatButton')">
        <h2>FloatButton <span class="cov implemented">implemented</span> <span class="note">p-speeddial（右下角浮动）</span></h2>
        <div class="fab-area"><p-speeddial [model]="dialItems" direction="up" [style]="{ position: 'absolute', right: '1rem', bottom: '1rem' }" /><p-speeddial [model]="dialItems" direction="right" type="semi-circle" [radius]="70" [style]="{ position: 'absolute', left: '1rem', bottom: '1rem' }" /><p-button [rounded]="true" size="large" [style]="{ position: 'absolute', right: '6rem', bottom: '1rem' }" ariaLabel="新建"><app-icon name="plus" [size]="20" /></p-button></div>
      </section>

      <section class="demo" id="c-Kbd" [hidden]="hide('Kbd')">
        <h2>Kbd <span class="cov composed">composed</span> <span class="note">原生 kbd + token 样式</span></h2>
        <div class="row wrap"><kbd class="kbd">⌘</kbd><kbd class="kbd">Shift</kbd><kbd class="kbd">K</kbd><span class="text-sm muted">·</span><kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">Enter</kbd></div>
      </section>

      <section class="demo" id="c-Code" [hidden]="hide('Code')">
        <h2>Code <span class="cov composed">composed</span> <span class="note">pre/code + 复制按钮（PrimeNG Editor 依赖 Quill，未引入）</span></h2>
        <div class="code"><div class="row between"><span class="text-xs muted">sql</span><p-button [text]="true" severity="secondary" size="small" [rounded]="true" (onClick)="toast('success', '已复制')" ariaLabel="复制"><app-icon name="copy" [size]="14" /></p-button></div><pre>{{ codeSample }}</pre></div>
      </section>

      <section class="demo" id="c-Divider" [hidden]="hide('Divider')">
        <h2>Divider <span class="cov implemented">implemented</span></h2>
        <div class="stack"><p-divider /><p-divider align="center"><span class="text-xs muted">或</span></p-divider><p-divider type="dashed" align="left"><b class="text-sm">左对齐</b></p-divider><div class="row" style="height: 3rem"><span>左</span><p-divider layout="vertical" /><span>右</span></div></div>
      </section>

      <section class="demo" id="c-Link" [hidden]="hide('Link')">
        <h2>Link <span class="cov composed">composed</span> <span class="note">a 标签 / p-button [link] / routerLink</span></h2>
        <div class="row wrap"><a href="#c-Typography">默认链接</a><a href="#c-Typography" class="muted">次要链接</a><p-button label="按钮链接" [link]="true" /><a href="#c-Typography" class="row">外部链接 <app-icon name="link" [size]="14" /></a></div>
      </section>

      <!-- ============ PrimeNG 额外组件 ============ -->
      <section class="demo" id="c-extra">
        <h2>PrimeNG 额外组件 <span class="note">契约之外、库内导出的其他组件</span></h2>
        <div class="grid grid-2">
          <div class="x-scroll"><p-organizationchart [value]="orgChart"><ng-template #default let-node><span class="text-sm">{{ node.label }}</span></ng-template></p-organizationchart></div>
          <div class="stack">
            <p-metergroup [value]="meter" labelPosition="start" />
            <p-inplace><ng-template #display>Inplace：点击展开</ng-template><ng-template #content><p class="text-sm muted">已展开内容</p></ng-template></p-inplace>
            <p-fieldset legend="Fieldset"><p class="text-sm muted">分组字段集</p></p-fieldset>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host ::ng-deep .p-timeline-horizontal .p-timeline-event:last-child { flex-grow: 1; }
    :host ::ng-deep .p-timeline-horizontal .p-timeline-event-content { white-space: nowrap; }
    .anchors { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 1.5rem; }
    .anchor { font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 999px; border: 1px solid var(--p-content-border-color); text-decoration: none; color: var(--p-text-color); }
    .anchor.composed { border-style: dashed; }
    .anchor.missing { opacity: 0.5; text-decoration: line-through; }
    .anchor:hover { background: var(--p-content-hover-background); }
    .sections { display: flex; flex-direction: column; gap: 1rem; }
    .demo { background: var(--p-content-background); border: 1px solid var(--p-content-border-color); border-radius: var(--p-content-border-radius); padding: 1.25rem; scroll-margin-top: 4.5rem; }
    .demo > h2 { font-size: 1rem; font-weight: 600; margin: 0 0 1rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .cov { font-size: 0.6875rem; font-weight: 500; padding: 0.0625rem 0.5rem; border-radius: 999px; text-transform: lowercase; }
    .cov.implemented { background: var(--p-green-100); color: var(--p-green-700); }
    .cov.composed { background: var(--p-amber-100); color: var(--p-amber-700); }
    .cov.missing { background: var(--p-red-100); color: var(--p-red-700); }
    html.dark .cov.implemented { background: var(--p-green-900); color: var(--p-green-300); }
    html.dark .cov.composed { background: var(--p-amber-900); color: var(--p-amber-300); }
    html.dark .cov.missing { background: var(--p-red-900); color: var(--p-red-300); }
    .note { font-size: 0.75rem; font-weight: 400; color: var(--p-text-muted-color); }
    .t1 { font-size: 2rem; font-weight: 700; margin: 0; letter-spacing: -0.02em; }
    .t2 { font-size: 1.5rem; font-weight: 600; margin: 0; }
    .t3 { font-size: 1.125rem; font-weight: 600; margin: 0; }
    .kbd { display: inline-block; font-family: inherit; font-size: 0.75rem; padding: 0.0625rem 0.375rem; border-radius: 0.25rem; border: 1px solid var(--p-content-border-color); border-bottom-width: 2px; background: var(--p-content-hover-background); }
    .x-scroll { overflow-x: auto; max-width: 100%; }
    :host ::ng-deep .p-inputnumber, :host ::ng-deep .p-inputnumber-input { min-width: 0; max-width: 100%; }
    :host ::ng-deep .p-tablist-tab-list { overflow-x: auto; }
    :host ::ng-deep .demo-menubar .p-menubar-end input { width: 6rem; }
    :host ::ng-deep .demo-menubar { flex-wrap: wrap; }
    .span-2 { grid-column: span 2; } .span-3 { grid-column: span 3; }
    :host ::ng-deep .vslider { height: 8rem; }
    .desc { display: grid; grid-template-columns: 6rem 1fr; gap: 0.5rem 1rem; margin: 0; font-size: 0.875rem; }
    .desc dt { color: var(--p-text-muted-color); } .desc dd { margin: 0; }
    .li { padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--p-content-border-color); }
    .li.odd { background: var(--p-content-hover-background); }
    :host ::ng-deep .hoverable { transition: box-shadow 0.2s; } :host ::ng-deep .hoverable:hover { box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.15); }
    .stat { font-size: 1.5rem; font-weight: 600; margin: 0.25rem 0; }
    .tl-marker { display: grid; place-items: center; width: 1.5rem; height: 1.5rem; border-radius: 999px; background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem 1rem; text-align: center; }
    .empty > app-icon { color: var(--p-text-muted-color); }
    .result-icon { display: grid; place-items: center; width: 3.5rem; height: 3.5rem; border-radius: 999px; }
    .result-icon.success { background: var(--p-green-100); color: var(--p-green-600); } .result-icon.danger { background: var(--p-red-100); color: var(--p-red-600); }
    .cell { padding: 0.75rem; border-radius: 0.5rem; background: var(--p-content-hover-background); border: 1px dashed var(--p-content-border-color); text-align: center; font-size: 0.875rem; }
    .cell.full { height: 100%; display: grid; place-items: center; border-radius: 0; border: 0; }
    .layout-demo { display: grid; grid-template-columns: 8rem 1fr; grid-template-rows: auto 6rem auto; gap: 0.5rem; }
    .layout-demo .hdr, .layout-demo .ftr { grid-column: span 2; }
    .logo { display: inline-grid; place-items: center; width: 1.5rem; height: 1.5rem; border-radius: 0.375rem; background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
    .sticky-demo { position: relative; } .sticky-bar { position: sticky; top: 0; padding: 0.5rem; background: var(--p-primary-color); color: var(--p-primary-contrast-color); border-radius: 0.375rem; font-size: 0.875rem; z-index: 1; }
    .fab-area { position: relative; height: 12rem; border: 1px dashed var(--p-content-border-color); border-radius: 0.5rem; }
    .code { background: var(--p-surface-900); color: var(--p-surface-0); border-radius: 0.5rem; padding: 0.5rem 0.75rem; }
    .code pre { margin: 0; font-size: 0.8125rem; overflow-x: auto; }
    .swatch { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; background: var(--p-content-hover-background); }
    :host ::ng-deep .palette .p-dialog-content { padding: 0.75rem; }
    :host ::ng-deep .static-dock { position: static; width: auto; }
    :host ::ng-deep .static-dock .p-dock-list-container { position: static; }
    :host ::ng-deep .scroller { border: 1px solid var(--p-content-border-color); border-radius: var(--p-content-border-radius); }
    :host ::ng-deep .vstepper .p-step-panel { padding-left: 1rem; }
    @media (max-width: 767px) {
      .span-2, .span-3 { grid-column: auto; }
      .layout-demo { grid-template-columns: 1fr; }
      .layout-demo .hdr, .layout-demo .ftr { grid-column: auto; }
      :host ::ng-deep #c-DataGrid .p-datatable-table { min-width: 0 !important; width: 100% !important; table-layout: fixed; }
      :host ::ng-deep #c-DataGrid p-treetable table { min-width: 0 !important; width: 100% !important; table-layout: fixed; }
      :host ::ng-deep #c-Tabs p-tabs:last-child .p-tablist-tab-list { flex-wrap: wrap; overflow-x: hidden; }
      :host ::ng-deep #c-extra .p-organizationchart-table { width: 100% !important; max-width: 100% !important; table-layout: fixed; }
    }
  `,
})
export class ComponentsPage {
  private readonly carousel = viewChild(Carousel);
  constructor() {
    afterNextRender(() => this.carousel()?.cd.markForCheck());
  }
  readonly settings = inject(SettingsService);
  private readonly messages = inject(MessageService);
  private readonly confirm = inject(ConfirmationService);
  readonly contract = contract.components as string[];
  readonly coverage = gallery.coverage as Record<string, Coverage>;
  readonly version = gallery.version;
  readonly money = money;
  readonly team = team;
  readonly orders = orders;
  readonly activity = activity;
  readonly stats = stats;
  readonly tasks = tasks;
  readonly notifications = notifications;
  readonly nav = nav;
  filter: Coverage | 'all' = 'all';
  readonly filterOptions = [
    { label: '全部', value: 'all' },
    { label: '原生', value: 'implemented' },
    { label: '组合', value: 'composed' },
    { label: '缺失', value: 'missing' },
  ];
  readonly severities: Severity[] = ['success', 'info', 'warn', 'danger', 'secondary', 'contrast'];

  text = '';
  pwd = '';
  num = 42;
  amount = 1638.45;
  cities = ['上海', '北京', '深圳', '杭州', '成都'];
  groupedCities = [
    { label: '华东', items: [{ label: '上海', value: 'sh' }, { label: '杭州', value: 'hz' }] },
    { label: '华北', items: [{ label: '北京', value: 'bj' }, { label: '天津', value: 'tj' }] },
  ];
  city: string | null = null;
  multi: string[] = [];
  acValue = '';
  acMulti: string[] = [];
  readonly suggestions = signal<string[]>([]);
  mention: (typeof team)[number][] = [];
  readonly mentionSuggestions = signal(team);
  checked = false;
  radio = this.cities[0];
  slider = 40;
  sliderRange = [20, 80];
  rating = 4;
  date: Date | null = null;
  time: Date | null = null;
  range: Date[] | null = null;
  multiDates: Date[] | null = null;
  color = '10b981';
  otp = '';
  segment = 'week';
  segments = ['day', 'week'];
  readonly ranges = [
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
  ];
  cascadeValue: unknown = null;
  readonly cascade = [
    { name: '中国', states: [{ name: '华东', cities: [{ name: '上海' }, { name: '杭州' }] }, { name: '华北', cities: [{ name: '北京' }, { name: '天津' }] }] },
    { name: '日本', states: [{ name: '关东', cities: [{ name: '东京' }, { name: '横滨' }] }] },
  ];
  readonly treeNodes: TreeNode[] = nav.map((n, i) => ({ key: n.key, label: n.label, icon: 'pi ' + n.icon.replace(/^/, 'pi-'), children: i < 3 ? team.slice(i, i + 2).map((m) => ({ key: n.key + m.email, label: m.name, leaf: true })) : undefined }));
  treeValue: TreeNode | null = null;
  treeSel: TreeNode[] = [];
  readonly treeTable: TreeNode[] = [
    { data: { name: '华东', orders: 3, amount: money(4200) }, expanded: true, children: orders.slice(0, 3).map((o) => ({ data: { name: o.customer, orders: 1, amount: money(o.amount) } })) },
    { data: { name: '华北', orders: 2, amount: money(2100) }, children: orders.slice(3, 5).map((o) => ({ data: { name: o.customer, orders: 1, amount: money(o.amount) } })) },
  ];
  readonly ttCols = [
    { field: 'name', header: '区域 / 客户' },
    { field: 'orders', header: '订单数' },
    { field: 'amount', header: '金额' },
  ];
  gridSel: (typeof orders)[number][] = [];
  pickSource = team.slice(0, 4);
  pickTarget = team.slice(4);
  orderItems = [...team];
  readonly carouselOptions = [
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 },
  ];
  readonly svgPlaceholder = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="#e4e4e7"/><text x="160" y="105" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#71717a">320 × 200</text></svg>');
  readonly dialog = signal(false);
  readonly dialogMax = signal(false);
  readonly drawerPositions = ['left', 'right', 'top', 'bottom'] as const;
  readonly drawerPos = signal<'left' | 'right' | 'top' | 'bottom' | 'full' | null>(null);
  readonly sidebar = signal(false);
  readonly palette = signal(false);
  paletteQ = '';
  readonly blocked = signal(false);
  readonly meter = [
    { label: '已用', value: 45, color: 'var(--p-primary-color)' },
    { label: '缓存', value: 20, color: 'var(--p-cyan-500)' },
    { label: '系统', value: 10, color: 'var(--p-orange-500)' },
  ];
  readonly scrollerItems = Array.from({ length: 200 }, (_, i) => `第 ${i + 1} 行 · 虚拟滚动`);
  readonly codeSample = "SELECT date_trunc('month', created_at) AS m, sum(amount)\nFROM orders WHERE status = 'paid'\nGROUP BY 1 ORDER BY 1 DESC LIMIT 2;";
  readonly fontOptions = (Object.keys(fonts) as FontKey[]).map((value) => ({ label: value, value }));
  readonly iconOptions: IconSet[] = iconSets;

  readonly menuItems: MenuItem[] = [
    { label: '查看', icon: 'pi pi-eye' },
    { label: '编辑', icon: 'pi pi-pencil' },
    { separator: true },
    { label: '删除', icon: 'pi pi-trash' },
  ];
  readonly tieredItems: MenuItem[] = [
    { label: '文件', icon: 'pi pi-file', items: [{ label: '新建', icon: 'pi pi-plus', items: [{ label: '项目' }, { label: '文档' }] }, { label: '打开' }] },
    { label: '编辑', icon: 'pi pi-pencil', items: [{ label: '撤销' }, { label: '重做' }] },
    { separator: true },
    { label: '退出', icon: 'pi pi-sign-out' },
  ];
  readonly panelItems: MenuItem[] = nav.slice(0, 4).map((n, i) => ({ label: n.label, icon: 'pi pi-' + n.icon, expanded: i === 0, items: team.slice(0, 2).map((m) => ({ label: m.name })) }));
  readonly menubarItems: MenuItem[] = nav.slice(0, 5).map((n) => ({ label: n.label, icon: 'pi pi-' + n.icon }));
  readonly crumbs: MenuItem[] = [{ label: '订单' }, { label: orders[0].id }];
  readonly stepItems: MenuItem[] = [{ label: '基本信息' }, { label: '配置' }, { label: '确认' }];
  readonly dialItems: MenuItem[] = [
    { icon: 'pi pi-pencil', tooltipOptions: { tooltipLabel: '编辑' } },
    { icon: 'pi pi-refresh', tooltipOptions: { tooltipLabel: '刷新' } },
    { icon: 'pi pi-trash', tooltipOptions: { tooltipLabel: '删除' } },
    { icon: 'pi pi-upload', tooltipOptions: { tooltipLabel: '上传' } },
  ];
  readonly dockItems: MenuItem[] = nav.slice(0, 4).map((n) => ({ label: n.label, icon: 'pi pi-' + n.icon }));
  readonly orgChart: TreeNode[] = [
    { label: team[0].name, expanded: true, children: [{ label: team[1].name, expanded: true, children: [{ label: team[3].name }, { label: team[4].name }] }, { label: team[2].name }] },
  ];

  hide(name: string) {
    return this.filter !== 'all' && this.coverage[name] !== this.filter;
  }

  count(c: Coverage) {
    return this.contract.filter((k) => this.coverage[k] === c).length;
  }

  complete(e: AutoCompleteCompleteEvent) {
    this.suggestions.set(this.cities.filter((c) => c.includes(e.query)));
  }

  completeMention(e: AutoCompleteCompleteEvent) {
    const q = e.query.replace(/^@/, '').toLowerCase();
    this.mentionSuggestions.set(team.filter((m) => m.name.toLowerCase().includes(q) || m.email.includes(q)));
  }

  paletteItems() {
    const q = this.paletteQ.toLowerCase();
    return [
      { label: '导航', items: nav.filter((n) => n.label.toLowerCase().includes(q)).map((n) => ({ label: n.label })) },
      { label: '建议', items: chat.suggestions.filter((s) => s.toLowerCase().includes(q)).map((s) => ({ label: s })) },
    ].filter((g) => g.items.length);
  }

  toast(severity: string, detail: string, sticky = false) {
    this.messages.add({ severity, summary: sticky ? '粘性通知' : '提示', detail, sticky, life: 3000 });
  }

  notify() {
    this.messages.add({ severity: 'info', summary: notifications[0].title, detail: notifications[0].time, life: 5000 });
  }

  confirmDialog() {
    this.confirm.confirm({ header: '删除确认', message: '确定要删除该记录？此操作不可撤销。', icon: 'pi pi-exclamation-triangle', acceptButtonProps: { label: '删除', severity: 'danger' }, rejectButtonProps: { label: '取消', severity: 'secondary', outlined: true }, accept: () => this.toast('success', '已删除') });
  }

  popconfirm(event: Event) {
    this.confirm.confirm({ key: 'pop', target: event.currentTarget as EventTarget, message: '确定删除？', icon: 'pi pi-exclamation-triangle', acceptButtonProps: { label: '删除', severity: 'danger', size: 'small' }, rejectButtonProps: { label: '取消', severity: 'secondary', outlined: true, size: 'small' }, accept: () => this.toast('success', '已删除') });
  }

  block() {
    this.blocked.set(true);
    setTimeout(() => this.blocked.set(false), 1500);
  }
}
