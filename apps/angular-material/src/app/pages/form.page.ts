import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import team from '@ui-gallery/spec/mock/team.json';
import { SHARED_IMPORTS } from '../shared/material';

const COUNTRY_CODES = [
  { code: '+86', label: '中国 +86' }, { code: '+852', label: '香港 +852' }, { code: '+1', label: '美国 +1' },
  { code: '+44', label: '英国 +44' }, { code: '+81', label: '日本 +81' }, { code: '+65', label: '新加坡 +65' },
];
const CHANNEL_OPTIONS = ['web', 'ios', 'android', 'api'];
const REGIONS = ['中国大陆', '新加坡', '法兰克福'];

@Component({
  selector: 'app-form',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <main class="page form-page">
      @if (submitted()) {
        <mat-card class="result-card"><mat-card-content class="result"><span class="result-icon success"><mat-icon svgIcon="check"></mat-icon></span><h1>活动已发布</h1><p class="muted">「{{ basicForm.controls.name.value }}」已创建，我们已通过 {{ basicForm.controls.email.value }} 发送确认邮件。</p><dl class="descriptions"><div><dt class="muted">活动类型</dt><dd>{{ typeLabel() }}</dd></div><div><dt class="muted">日期</dt><dd>{{ detailForm.controls.startDate.value | date: 'yyyy-MM-dd' }} — {{ detailForm.controls.endDate.value | date: 'yyyy-MM-dd' }}</dd></div><div><dt class="muted">负责人</dt><dd>{{ detailForm.controls.owner.value }}</dd></div><div><dt class="muted">渠道</dt><dd>{{ detailForm.controls.channels.value.join('、') }}</dd></div></dl><div class="demo-row wrap"><button mat-flat-button color="primary" routerLink="/">返回仪表盘</button><button mat-stroked-button (click)="reset()">再创建一个</button></div></mat-card-content></mat-card>
      } @else {
      <header class="page-header"><div><p class="eyebrow">WORKFLOW</p><h1>创建活动</h1><p class="muted">三步完成一次活动配置，带 * 的为必填项。</p></div><span class="chip">第 {{ stepIndex() + 1 }} / 3 步</span></header>
      <mat-card class="form-stepper-card"><mat-card-content><mat-stepper [orientation]="verticalStepper() ? 'vertical' : 'horizontal'" linear #stepper (selectionChange)="stepIndex.set($event.selectedIndex)"><ng-template matStepperIcon="edit"><mat-icon svgIcon="pencil"></mat-icon></ng-template><ng-template matStepperIcon="done"><mat-icon svgIcon="check"></mat-icon></ng-template>
        <mat-step [stepControl]="basicForm" label="基本信息"><form [formGroup]="basicForm" class="step-form">
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>活动名称</mat-label><input matInput formControlName="name" required><mat-hint>简洁描述这次活动</mat-hint><mat-error>请输入 2–40 个字符的活动名称</mat-error></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>预计人数</mat-label><input matInput type="number" formControlName="capacity" min="1" max="5000" required><span matTextSuffix>人</span><mat-hint>1 – 5000</mat-hint><mat-error>请输入 1–5000 之间的数字</mat-error></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>联系邮箱</mat-label><input matInput type="email" formControlName="email" required autocomplete="email"><mat-icon matSuffix svgIcon="mail"></mat-icon><mat-error>请输入有效的邮箱地址</mat-error></mat-form-field>
            <div class="phone-group"><mat-form-field appearance="outline" class="phone-code"><mat-label>国家码</mat-label><mat-select formControlName="countryCode" required>@for (country of countryCodes; track country.code) {<mat-option [value]="country.code">{{ country.label }}</mat-option>}</mat-select></mat-form-field><mat-form-field appearance="outline" class="phone-number"><mat-label>联系电话</mat-label><input matInput type="tel" formControlName="phone" required inputmode="numeric"><mat-icon matSuffix svgIcon="phone"></mat-icon><mat-error>请输入 6–15 位数字</mat-error></mat-form-field></div>
            <mat-form-field appearance="outline" class="full-span"><mat-label>活动简介</mat-label><textarea matInput formControlName="description" cdkTextareaAutosize cdkAutosizeMinRows="3" cdkAutosizeMaxRows="6" maxlength="200" required></textarea><mat-hint align="end">{{ basicForm.controls.description.value.length }} / 200</mat-hint><mat-error>请输入至少 10 个字符的简介</mat-error></mat-form-field>
            <fieldset class="field-group"><legend>活动类型 <span class="required">*</span></legend><mat-radio-group formControlName="type" class="stack tight" aria-label="活动类型">@for (type of typeOptions; track type.value) {<mat-radio-button [value]="type.value">{{ type.label }}</mat-radio-button>}</mat-radio-group>@if (basicForm.controls.type.touched && basicForm.controls.type.invalid) {<mat-error class="field-error">请选择活动类型</mat-error>}</fieldset>
            <fieldset class="field-group"><legend>活动形式 <span class="required">*</span><button mat-icon-button type="button" matTooltip="至少选择一种形式" aria-label="活动形式说明"><mat-icon svgIcon="circle-help"></mat-icon></button></legend><div class="stack tight">@for (format of formatOptions; track format) {<mat-checkbox [checked]="basicForm.controls.formats.value.includes(format)" (change)="toggleFormat(format, $event.checked)">{{ format }}</mat-checkbox>}</div>@if (basicForm.controls.formats.touched && basicForm.controls.formats.invalid) {<mat-error class="field-error">请至少选择一种活动形式</mat-error>}</fieldset>
            <div class="full-span switch-row"><mat-slide-toggle formControlName="isPublic">公开活动</mat-slide-toggle><span class="muted">公开后将展示在活动列表，任何人都可报名。</span></div>
          </div>
          <div class="step-actions"><button mat-flat-button color="primary" type="button" (click)="next(basicForm, stepper)">下一步</button></div>
        </form></mat-step>
        <mat-step [stepControl]="detailForm" label="详细配置"><form [formGroup]="detailForm" class="step-form">
          <div class="form-grid">
            <mat-form-field appearance="outline"><mat-label>数据区域</mat-label><mat-select formControlName="region" required>@for (region of regions; track region) {<mat-option [value]="region">{{ region }}</mat-option>}</mat-select><mat-error>请选择数据区域</mat-error></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>推广渠道</mat-label><mat-select formControlName="channels" multiple required>@for (channel of channelOptions; track channel) {<mat-option [value]="channel">{{ channel }}</mat-option>}</mat-select><mat-hint>可多选</mat-hint><mat-error>请至少选择一个渠道</mat-error></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>负责人</mat-label><input matInput formControlName="owner" [matAutocomplete]="ownerAuto" required placeholder="输入姓名搜索"><mat-icon matSuffix svgIcon="chevron-down"></mat-icon><mat-autocomplete #ownerAuto="matAutocomplete">@for (member of filteredMembers(); track member.email) {<mat-option [value]="member.name">{{ member.name }} <span class="muted">{{ member.email }}</span></mat-option>}</mat-autocomplete><mat-hint>从团队成员中选择</mat-hint><mat-error>请选择团队成员</mat-error></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>发布日期</mat-label><input matInput [matDatepicker]="publishPicker" formControlName="publishDate" required><mat-datepicker-toggle matIconSuffix [for]="publishPicker"></mat-datepicker-toggle><mat-datepicker #publishPicker></mat-datepicker><mat-error>请选择发布日期</mat-error></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>开始时间</mat-label><input matInput [matTimepicker]="timepicker" formControlName="time" required><mat-timepicker-toggle matIconSuffix [for]="timepicker"></mat-timepicker-toggle><mat-timepicker #timepicker></mat-timepicker><mat-hint>使用 24 小时制</mat-hint><mat-error>请选择开始时间</mat-error></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>活动日期范围</mat-label><mat-date-range-input [rangePicker]="rangePicker" required><input matStartDate formControlName="startDate" placeholder="开始"><input matEndDate formControlName="endDate" placeholder="结束"></mat-date-range-input><mat-datepicker-toggle matIconSuffix [for]="rangePicker"></mat-datepicker-toggle><mat-date-range-picker #rangePicker></mat-date-range-picker><mat-error>请选择完整的日期范围</mat-error></mat-form-field>
            <div class="full-span"><label class="field-label">预算区间 <span class="required">*</span><button mat-icon-button type="button" matTooltip="设置活动预算上下限（人民币）" aria-label="预算说明"><mat-icon svgIcon="circle-help"></mat-icon></button></label><mat-slider min="0" max="100000" step="1000" discrete class="full"><input matSliderStartThumb formControlName="budgetMin"><input matSliderEndThumb formControlName="budgetMax"></mat-slider><div class="spread muted"><span>¥{{ detailForm.controls.budgetMin.value | number }}</span><span>¥{{ detailForm.controls.budgetMax.value | number }}</span></div></div>
            <div class="field-group"><label class="field-label">优先级评分 <span class="required">*</span></label><div class="rating" role="radiogroup" aria-label="优先级">@for (star of [1, 2, 3, 4, 5]; track star) {<button mat-icon-button type="button" role="radio" [attr.aria-checked]="star === detailForm.controls.rating.value" (click)="detailForm.controls.rating.setValue(star)" [attr.aria-label]="star + ' 星'"><mat-icon [svgIcon]="star <= detailForm.controls.rating.value ? 'star' : 'star-outline'"></mat-icon></button>}<span class="muted">{{ detailForm.controls.rating.value }} / 5</span></div><p class="field-help muted">用于排序活动列表</p></div>
            <div class="field-group"><label class="field-label" for="theme-color">主题色 <span class="required">*</span></label><div class="color-picker"><input id="theme-color" type="color" formControlName="color"><span class="color-value">{{ detailForm.controls.color.value }}</span></div><p class="field-help muted">用于活动页面强调色</p></div>
            <div class="full-span"><label class="field-label">标签 <button mat-icon-button type="button" matTooltip="输入后按 Enter 或逗号添加" aria-label="标签说明"><mat-icon svgIcon="circle-help"></mat-icon></button></label><mat-form-field appearance="outline" class="full"><mat-label>活动标签</mat-label><mat-chip-grid #tagGrid aria-label="活动标签">@for (tag of tags(); track tag) {<mat-chip-row (removed)="removeTag(tag)">{{ tag }}<button matChipRemove type="button" [attr.aria-label]="'移除 ' + tag"><mat-icon svgIcon="x"></mat-icon></button></mat-chip-row>}</mat-chip-grid><input placeholder="新标签…" [matChipInputFor]="tagGrid" [matChipInputSeparatorKeyCodes]="separatorKeys" (matChipInputTokenEnd)="addTag($event)"><mat-hint>最多 5 个标签</mat-hint></mat-form-field></div>
            <div class="full-span"><label class="field-label">素材上传</label><div class="upload-zone" [class.dragging]="dragging()" (dragover)="$event.preventDefault(); dragging.set(true)" (dragleave)="dragging.set(false)" (drop)="onDrop($event)"><input #fileInput type="file" hidden multiple (change)="selectFiles(fileInput.files)"><mat-icon svgIcon="upload"></mat-icon><p>拖拽文件到这里，或 <button mat-button type="button" (click)="fileInput.click()">选择文件</button></p></div>@if (files().length) {<mat-list>@for (file of files(); track file.name) {<mat-list-item><mat-icon matListItemIcon svgIcon="paper"></mat-icon><span matListItemTitle>{{ file.name }}</span><span matListItemLine>{{ file.size / 1024 | number: '1.0-0' }} KB</span><button mat-icon-button matListItemMeta type="button" (click)="removeFile(file)" aria-label="移除文件"><mat-icon svgIcon="x"></mat-icon></button></mat-list-item>}</mat-list>}</div>
          </div>
          <div class="step-actions"><button mat-button type="button" matStepperPrevious>上一步</button><button mat-flat-button color="primary" type="button" (click)="next(detailForm, stepper)">下一步</button></div>
        </form></mat-step>
        <mat-step [stepControl]="confirmForm" label="确认"><form [formGroup]="confirmForm" class="step-form" (ngSubmit)="submit()">
          <h2 class="summary-title">确认信息</h2><p class="muted">请核对以下信息，提交后将立即发布。</p>
          <dl class="descriptions summary">
            <div><dt class="muted">活动名称</dt><dd>{{ basicForm.controls.name.value }}</dd></div><div><dt class="muted">活动类型</dt><dd>{{ typeLabel() }}</dd></div>
            <div><dt class="muted">活动形式</dt><dd>{{ basicForm.controls.formats.value.join('、') }}</dd></div><div><dt class="muted">预计人数</dt><dd>{{ basicForm.controls.capacity.value }} 人</dd></div>
            <div><dt class="muted">联系方式</dt><dd>{{ basicForm.controls.email.value }} · {{ basicForm.controls.countryCode.value }} {{ basicForm.controls.phone.value }}</dd></div><div><dt class="muted">公开</dt><dd>{{ basicForm.controls.isPublic.value ? '是' : '否' }}</dd></div>
            <div><dt class="muted">数据区域</dt><dd>{{ detailForm.controls.region.value }}</dd></div><div><dt class="muted">渠道</dt><dd>{{ detailForm.controls.channels.value.join('、') }}</dd></div>
            <div><dt class="muted">负责人</dt><dd>{{ detailForm.controls.owner.value }}</dd></div><div><dt class="muted">发布日期</dt><dd>{{ detailForm.controls.publishDate.value | date: 'yyyy-MM-dd' }} {{ detailForm.controls.time.value | date: 'HH:mm' }}</dd></div>
            <div><dt class="muted">活动日期</dt><dd>{{ detailForm.controls.startDate.value | date: 'yyyy-MM-dd' }} — {{ detailForm.controls.endDate.value | date: 'yyyy-MM-dd' }}</dd></div><div><dt class="muted">预算</dt><dd>¥{{ detailForm.controls.budgetMin.value | number }} – ¥{{ detailForm.controls.budgetMax.value | number }}</dd></div>
            <div><dt class="muted">优先级</dt><dd>{{ detailForm.controls.rating.value }} / 5</dd></div><div><dt class="muted">主题色</dt><dd><span class="swatch" [style.background]="detailForm.controls.color.value"></span>{{ detailForm.controls.color.value }}</dd></div>
            <div><dt class="muted">标签</dt><dd>{{ tags().length ? tags().join('、') : '无' }}</dd></div><div><dt class="muted">素材</dt><dd>{{ files().length }} 个文件</dd></div>
          </dl>
          <mat-checkbox formControlName="agree" required>我已阅读并同意服务条款与隐私政策 <span class="required">*</span></mat-checkbox>@if (confirmForm.controls.agree.touched && confirmForm.controls.agree.invalid) {<mat-error class="field-error">发布前需要同意条款</mat-error>}
          <div class="step-actions"><button mat-button type="button" matStepperPrevious>上一步</button><button mat-flat-button color="primary" type="submit" [disabled]="submitting()">@if (submitting()) {<mat-spinner diameter="18"></mat-spinner>}发布活动</button></div>
        </form></mat-step>
      </mat-stepper></mat-card-content></mat-card>
      }
    </main>
  `,
})
export class FormPage {
  private readonly fb = inject(FormBuilder).nonNullable;
  readonly countryCodes = COUNTRY_CODES;
  readonly channelOptions = CHANNEL_OPTIONS;
  readonly regions = REGIONS;
  readonly members = team;
  readonly typeOptions = [{ value: 'webinar', label: '线上分享' }, { value: 'workshop', label: '工作坊' }, { value: 'launch', label: '产品发布' }];
  readonly formatOptions = ['直播', '录播', '线下'];
  readonly separatorKeys = [13, 188];
  readonly basicForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    capacity: [100, [Validators.required, Validators.min(1), Validators.max(5000)]],
    email: ['', [Validators.required, Validators.email]],
    countryCode: ['+86', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\d{6,15}$/)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    type: ['', Validators.required],
    formats: [[] as string[], [Validators.required, Validators.minLength(1)]],
    isPublic: [true],
  });
  readonly detailForm = this.fb.group({
    region: ['', Validators.required],
    channels: [[] as string[], [Validators.required, Validators.minLength(1)]],
    owner: ['', Validators.required],
    publishDate: [null as Date | null, Validators.required],
    time: [null as Date | null, Validators.required],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    budgetMin: [10000, Validators.required],
    budgetMax: [60000, Validators.required],
    rating: [4, [Validators.required, Validators.min(1)]],
    color: ['#005cbb', Validators.required],
  });
  readonly confirmForm = this.fb.group({ agree: [false, Validators.requiredTrue] });
  readonly tags = signal<string[]>([]);
  readonly files = signal<File[]>([]);
  readonly dragging = signal(false);
  readonly stepIndex = signal(0);
  readonly submitted = signal(false);
  readonly submitting = signal(false);
  readonly verticalStepper = signal(false);

  constructor() {
    inject(BreakpointObserver).observe('(max-width: 959px)').subscribe((state) => this.verticalStepper.set(state.matches));
  }

  typeLabel(): string { return this.typeOptions.find((type) => type.value === this.basicForm.controls.type.value)?.label ?? ''; }
  filteredMembers(): typeof team { const q = this.detailForm.controls.owner.value.toLowerCase(); return this.members.filter((member) => member.name.toLowerCase().includes(q) || member.email.includes(q)); }
  toggleFormat(format: string, checked: boolean): void {
    const control = this.basicForm.controls.formats;
    control.setValue(checked ? [...control.value, format] : control.value.filter((item) => item !== format));
    control.markAsTouched();
  }
  addTag(event: { value: string; chipInput: { clear(): void } }): void {
    const value = event.value.trim();
    if (value && this.tags().length < 5 && !this.tags().includes(value)) this.tags.update((tags) => [...tags, value]);
    event.chipInput.clear();
  }
  removeTag(tag: string): void { this.tags.update((tags) => tags.filter((item) => item !== tag)); }
  selectFiles(fileList: FileList | null): void { if (fileList) this.files.update((files) => [...files, ...Array.from(fileList)]); }
  removeFile(file: File): void { this.files.update((files) => files.filter((item) => item !== file)); }
  onDrop(event: DragEvent): void { event.preventDefault(); this.dragging.set(false); this.selectFiles(event.dataTransfer?.files ?? null); }
  next(form: { markAllAsTouched(): void; valid: boolean }, stepper: { next(): void }): void { form.markAllAsTouched(); if (form.valid) stepper.next(); }
  submit(): void {
    this.confirmForm.markAllAsTouched();
    if (this.basicForm.invalid || this.detailForm.invalid || this.confirmForm.invalid) return;
    this.submitting.set(true);
    setTimeout(() => { this.submitting.set(false); this.submitted.set(true); window.scrollTo({ top: 0 }); }, 600);
  }
  reset(): void {
    this.basicForm.reset(); this.detailForm.reset(); this.confirmForm.reset();
    this.tags.set([]); this.files.set([]); this.stepIndex.set(0); this.submitted.set(false);
  }
}
