import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Chip } from 'primeng/chip';
import { ColorPicker } from 'primeng/colorpicker';
import { DatePicker } from 'primeng/datepicker';
import { FileUpload } from 'primeng/fileupload';
import { InputGroup } from 'primeng/inputgroup';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { MultiSelect } from 'primeng/multiselect';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { Select } from 'primeng/select';
import { Slider } from 'primeng/slider';
import { Stepper, StepList, Step, StepPanels, StepPanel } from 'primeng/stepper';
import { Textarea } from 'primeng/textarea';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Tooltip } from 'primeng/tooltip';
import plans from '@ui-gallery/spec/mock/plans.json';
import team from '@ui-gallery/spec/mock/team.json';
import nav from '@ui-gallery/spec/mock/nav.json';
import { Icon } from '../icons';
import { PageHeader, channelLabel } from '../shared';

@Component({
  selector: 'app-form',
  imports: [
    ReactiveFormsModule, RouterLink, AutoComplete, Button, Card, Checkbox, Chip, ColorPicker, DatePicker, FileUpload, InputGroup,
    InputNumber, InputText, Message, MultiSelect, RadioButton, Rating, Select, Slider, Stepper, StepList, Step, StepPanels, StepPanel,
    Textarea, ToggleSwitch, Tooltip, Icon, PageHeader, DecimalPipe,
  ],
  template: `
    <app-page-header title="创建项目" description="用三步完成一个新的工作区配置。" />

    @if (done()) {
      <p-card>
        <div class="result">
          <span class="result-icon"><app-icon name="check" [size]="28" /></span>
          <h2 class="section-title">项目创建成功</h2>
          <p class="muted">「{{ basic.controls.name.value }}」已经准备就绪，团队成员将收到邀请邮件。</p>
          <div class="row">
            <p-button label="进入项目" routerLink="/" queryParamsHandling="preserve" />
            <p-button label="再建一个" [outlined]="true" severity="secondary" (onClick)="reset()" />
          </div>
        </div>
      </p-card>
    } @else {
      <p-stepper [value]="step()" (valueChange)="step.set($any($event))" [linear]="true">
        <p-step-list>
          <p-step [value]="1">基本信息</p-step>
          <p-step [value]="2">配置选项</p-step>
          <p-step [value]="3">确认提交</p-step>
        </p-step-list>
        <p-step-panels>
          <p-step-panel [value]="1">
            <ng-template #content>
              <p-card header="基本信息" subheader="告诉我们项目的基础信息。">
                <form [formGroup]="basic" class="grid grid-2" novalidate>
                  <div class="field">
                    <label for="name">项目名称<span class="req">*</span></label>
                    <input pInputText id="name" formControlName="name" placeholder="例如：增长分析" [invalid]="bad(basic, 'name')" />
                    @if (bad(basic, 'name')) { <span class="err">项目名称必填，2–40 个字符</span> }
                  </div>
                  <div class="field">
                    <label for="budget">预算 (CNY)</label>
                    <p-inputnumber inputId="budget" formControlName="budget" mode="currency" currency="CNY" locale="zh-CN" [min]="0" [showButtons]="true" styleClass="w-full" />
                  </div>
                  <div class="field">
                    <label for="email">负责人邮箱<span class="req">*</span></label>
                    <input pInputText id="email" type="email" formControlName="email" placeholder="owner@acme.dev" [invalid]="bad(basic, 'email')" />
                    @if (bad(basic, 'email')) { <span class="err">请输入有效邮箱</span> }
                  </div>
                  <div class="field">
                    <label for="phone">联系电话</label>
                    <p-inputgroup>
                      <p-select formControlName="country" [options]="countries" optionLabel="label" optionValue="value" styleClass="country" />
                      <input pInputText id="phone" formControlName="phone" placeholder="138 0000 0000" />
                    </p-inputgroup>
                  </div>
                  <div class="field span-2">
                    <label for="desc">描述 <app-icon name="help-circle" [size]="14" pTooltip="用一两句话描述项目目标" class="muted" /></label>
                    <textarea pTextarea id="desc" formControlName="description" rows="3" placeholder="描述你的项目目标..." maxlength="200"></textarea>
                    <span class="help right">{{ basic.controls.description.value.length }} / 200</span>
                  </div>
                  <div class="field span-2">
                    <span class="label">计划<span class="req">*</span></span>
                    <div class="grid grid-3">
                      @for (p of plans; track p.name) {
                        <label class="option" [class.checked]="basic.controls.plan.value === p.name">
                          <p-radiobutton formControlName="plan" [value]="p.name" [inputId]="'plan-' + p.name" />
                          <span class="col" style="gap:0"><span class="font-medium">{{ p.name }}</span><span class="text-xs muted">{{ p.price === null ? '定制报价' : '¥' + p.price + ' / 月' }} · {{ p.features[0] }}</span></span>
                        </label>
                      }
                    </div>
                  </div>
                  <div class="field span-2">
                    <span class="label">渠道</span>
                    <div class="row wrap">
                      @for (c of channels; track c.value) {
                        <label class="row text-sm"><p-checkbox formControlName="channels" [value]="c.value" [inputId]="'ch-' + c.value" />{{ c.label }}</label>
                      }
                    </div>
                  </div>
                  <div class="option between span-2">
                    <div><p class="font-medium">通知开关</p><p class="text-sm muted">接收项目活动提醒</p></div>
                    <p-toggleswitch formControlName="notify" />
                  </div>
                </form>
                <div class="row" style="justify-content:flex-end; margin-top:1rem">
                  <p-button label="下一步" (onClick)="next(basic, 2)" iconPos="right"><app-icon name="arrow-right" /></p-button>
                </div>
              </p-card>
            </ng-template>
          </p-step-panel>

          <p-step-panel [value]="2">
            <ng-template #content>
              <p-card header="配置选项" subheader="选择计划、权限与通知。">
                <form [formGroup]="config" class="stack" novalidate>
                  <div class="grid grid-2">
                    <div class="field">
                      <label for="members">成员</label>
                      <p-multiselect inputId="members" formControlName="members" [options]="members" optionLabel="name" optionValue="email" placeholder="选择成员" display="chip" styleClass="w-full" [filter]="true" />
                    </div>
                    <div class="field">
                      <label for="module">默认模块</label>
                      <p-autocomplete inputId="module" formControlName="module" [suggestions]="suggestions()" (completeMethod)="search($event)" optionLabel="label" [dropdown]="true" placeholder="搜索模块" styleClass="w-full" inputStyleClass="w-full" />
                    </div>
                    <div class="field">
                      <label for="start">开始日期</label>
                      <p-datepicker inputId="start" formControlName="start" [showIcon]="true" dateFormat="yy-mm-dd" styleClass="w-full" />
                    </div>
                    <div class="field">
                      <label for="time">每日提醒时间</label>
                      <p-datepicker inputId="time" formControlName="time" [timeOnly]="true" [showIcon]="true" styleClass="w-full" />
                    </div>
                    <div class="field span-2">
                      <label for="range">活动周期</label>
                      <p-datepicker inputId="range" formControlName="range" selectionMode="range" [readonlyInput]="true" [showIcon]="true" dateFormat="yy-mm-dd" styleClass="w-full" />
                    </div>
                  </div>
                  <div class="grid grid-2">
                    <div class="field">
                      <span class="label">采样比例 <span class="muted">{{ config.controls.sample.value }}%</span></span>
                      <p-slider formControlName="sample" [min]="0" [max]="100" styleClass="w-full" />
                    </div>
                    <div class="field">
                      <span class="label">优先级</span>
                      <p-rating formControlName="priority" />
                    </div>
                    <div class="field">
                      <span class="label">主题色</span>
                      <div class="row"><p-colorpicker formControlName="color" /><span class="mono text-sm">#{{ config.controls.color.value }}</span></div>
                    </div>
                    <div class="field">
                      <span class="label">标签</span>
                      <div class="row wrap">
                        @for (t of config.controls.tags.value; track t) { <p-chip [label]="t" [removable]="true" (onRemove)="removeTag(t)" /> }
                        <input pInputText pSize="small" placeholder="回车添加" (keydown.enter)="addTag($event)" style="width: 8rem" />
                      </div>
                    </div>
                  </div>
                  <div class="field">
                    <span class="label">附件</span>
                    <p-fileupload name="files" [multiple]="true" accept="image/*,.pdf" [maxFileSize]="5000000" [customUpload]="true" chooseLabel="选择文件" uploadLabel="上传" cancelLabel="清除" (uploadHandler)="uploaded()">
                      <ng-template #empty><p class="muted text-sm">拖放文件到此处上传，单文件 ≤ 5 MB。</p></ng-template>
                    </p-fileupload>
                  </div>
                </form>
                <div class="row between" style="margin-top:1rem">
                  <p-button label="上一步" [outlined]="true" severity="secondary" (onClick)="step.set(1)" />
                  <p-button label="下一步" (onClick)="next(config, 3)" iconPos="right"><app-icon name="arrow-right" /></p-button>
                </div>
              </p-card>
            </ng-template>
          </p-step-panel>

          <p-step-panel [value]="3">
            <ng-template #content>
              <p-card header="确认提交" subheader="检查配置后提交。">
                <div class="stack">
                  <dl class="desc">
                    <dt>项目名称</dt><dd>{{ basic.controls.name.value }}</dd>
                    <dt>负责人</dt><dd>{{ basic.controls.email.value }}</dd>
                    <dt>预算</dt><dd>¥{{ basic.controls.budget.value | number }}</dd>
                    <dt>计划</dt><dd>{{ basic.controls.plan.value }}</dd>
                    <dt>成员</dt><dd>{{ config.controls.members.value.length }} 人</dd>
                    <dt>渠道</dt><dd>{{ basic.controls.channels.value.join(', ') || '—' }}</dd>
                    <dt>采样比例</dt><dd>{{ config.controls.sample.value }}%</dd>
                    <dt>标签</dt><dd><div class="row wrap">@for (t of config.controls.tags.value; track t) { <p-chip [label]="t" /> }</div></dd>
                  </dl>
                  @if (submitted() && !agree.value) {
                    <p-message severity="error">请先同意服务条款</p-message>
                  }
                  <label class="row text-sm"><p-checkbox [formControl]="agree" [binary]="true" inputId="agree" />我同意服务条款与隐私政策</label>
                  <div class="row between">
                    <p-button label="上一步" [outlined]="true" severity="secondary" (onClick)="step.set(2)" />
                    <p-button label="提交项目" [loading]="submitting()" (onClick)="submit()" />
                  </div>
                </div>
              </p-card>
            </ng-template>
          </p-step-panel>
        </p-step-panels>
      </p-stepper>
    }
  `,
  styles: `
    .span-2 { grid-column: span 2; }
    :host ::ng-deep .country { width: 7rem; flex: none; }
    .option { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 1px solid var(--p-content-border-color); border-radius: var(--p-content-border-radius); cursor: pointer; }
    .option.checked { border-color: var(--p-primary-color); }
    .desc { display: grid; grid-template-columns: 6rem 1fr; gap: 0.5rem 1rem; margin: 0; font-size: 0.875rem; }
    .desc dt { color: var(--p-text-muted-color); }
    .desc dd { margin: 0; }
    .result { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; padding: 2rem 1rem; }
    .result-icon { display: grid; place-items: center; width: 3.5rem; height: 3.5rem; border-radius: 999px; background: var(--p-green-100); color: var(--p-green-600); }
    html.dark .result-icon { background: var(--p-green-900); color: var(--p-green-300); }
    :host ::ng-deep .p-step-panel { padding: 0; }
    :host ::ng-deep .p-fileupload-content { max-width: 100%; }
    @media (max-width: 767px) {
      .span-2 { grid-column: auto; }
      :host ::ng-deep .p-step-title { display: none; }
    }
  `,
})
export class FormPage {
  private readonly fb = inject(FormBuilder);
  private readonly messages = inject(MessageService);
  readonly step = signal(1);
  readonly done = signal(false);
  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly plans = plans;
  readonly members = team;
  readonly channels = Object.entries(channelLabel).map(([value, label]) => ({ label, value }));
  readonly countries = [
    { label: '+86', value: 'cn' },
    { label: '+1', value: 'us' },
    { label: '+44', value: 'uk' },
    { label: '+81', value: 'jp' },
  ];
  private readonly modules = nav.map((n) => ({ label: n.label, value: n.key }));
  readonly suggestions = signal(this.modules);

  readonly basic = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    budget: [50000],
    email: ['', [Validators.required, Validators.email]],
    country: ['cn'],
    phone: [''],
    description: [''],
    plan: [plans.find((p) => p.recommended)?.name ?? plans[0].name, Validators.required],
    channels: [['web', 'ios'] as string[]],
    notify: [true],
  });
  readonly config = this.fb.nonNullable.group({
    members: [[team[0].email, team[1].email] as string[]],
    module: [null as { label: string; value: string } | null],
    start: [null as Date | null],
    time: [null as Date | null],
    range: [null as Date[] | null],
    sample: [60],
    priority: [3],
    color: ['10b981'],
    tags: [['增长', 'Q3'] as string[]],
  });
  readonly agree = this.fb.nonNullable.control(false);

  bad(group: typeof this.basic, name: keyof typeof this.basic.controls) {
    const c = group.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  next(group: typeof this.basic | typeof this.config, to: number) {
    group.markAllAsTouched();
    if (group.invalid) return;
    this.step.set(to);
  }

  search(e: AutoCompleteCompleteEvent) {
    const q = e.query.toLowerCase();
    this.suggestions.set(this.modules.filter((m) => m.label.toLowerCase().includes(q) || m.value.includes(q)));
  }

  addTag(e: Event) {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const v = input.value.trim();
    if (v && !this.config.controls.tags.value.includes(v)) this.config.controls.tags.setValue([...this.config.controls.tags.value, v]);
    input.value = '';
  }

  removeTag(t: string) {
    this.config.controls.tags.setValue(this.config.controls.tags.value.filter((x) => x !== t));
  }

  uploaded() {
    this.messages.add({ severity: 'success', summary: '上传完成', detail: '附件已加入项目' });
  }

  submit() {
    this.submitted.set(true);
    if (!this.agree.value) return;
    this.submitting.set(true);
    setTimeout(() => {
      this.submitting.set(false);
      this.done.set(true);
      this.messages.add({ severity: 'success', summary: '提交成功', detail: '项目已创建' });
    }, 700);
  }

  reset() {
    this.basic.reset();
    this.config.reset();
    this.agree.reset();
    this.submitted.set(false);
    this.done.set(false);
    this.step.set(1);
  }
}
