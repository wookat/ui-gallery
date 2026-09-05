import { BreakpointObserver } from '@angular/cdk/layout';
import type { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../shared/material';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <main class="page form-page">
      <header class="page-header"><div><p class="eyebrow">WORKFLOW</p><h1>创建活动</h1><p class="muted">使用真实 Material 控件完成一次活动配置。</p></div><span class="chip"><mat-icon svgIcon="check"></mat-icon>自动保存</span></header>
      <mat-card class="form-stepper-card"><mat-card-content><mat-stepper [orientation]="verticalStepper() ? 'vertical' : 'horizontal'" linear #stepper>
        <mat-step [stepControl]="detailsForm"><form [formGroup]="detailsForm"><ng-template matStepLabel>基本信息</ng-template><div class="form-grid"><mat-form-field appearance="outline"><mat-label>活动名称</mat-label><input matInput formControlName="name"><mat-hint>简洁描述这次活动</mat-hint><mat-error>请输入活动名称</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>活动类型</mat-label><mat-select formControlName="type"><mat-option value="webinar">线上分享</mat-option><mat-option value="workshop">工作坊</mat-option><mat-option value="launch">产品发布</mat-option></mat-select><mat-error>请选择活动类型</mat-error></mat-form-field><mat-form-field appearance="outline" class="full-span"><mat-label>活动简介</mat-label><textarea matInput formControlName="description" rows="3"></textarea><mat-hint>最多 200 个字符</mat-hint><mat-error>请输入活动简介</mat-error></mat-form-field></div><div class="step-actions"><button mat-flat-button color="primary" matStepperNext [disabled]="detailsForm.invalid">下一步</button></div></form></mat-step>
        <mat-step [stepControl]="scheduleForm"><form [formGroup]="scheduleForm"><ng-template matStepLabel>时间安排</ng-template><div class="form-grid"><mat-form-field appearance="outline"><mat-label>开始日期</mat-label><mat-date-range-input [rangePicker]="rangePicker"><input matStartDate formControlName="startDate"><input matEndDate formControlName="endDate"></mat-date-range-input><mat-datepicker-toggle matIconSuffix [for]="rangePicker"></mat-datepicker-toggle><mat-date-range-picker #rangePicker></mat-date-range-picker><mat-error>请选择日期范围</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>开始时间</mat-label><input matInput [matTimepicker]="timepicker" formControlName="time"><mat-timepicker-toggle matIconSuffix [for]="timepicker"></mat-timepicker-toggle><mat-timepicker #timepicker></mat-timepicker><mat-hint>使用 24 小时制</mat-hint><mat-error>请选择开始时间</mat-error></mat-form-field><div class="full-span"><label class="field-label">预算区间 <button mat-icon-button matTooltip="设置活动预算上下限" aria-label="预算说明"><mat-icon svgIcon="circle-help"></mat-icon></button></label><mat-slider min="0" max="100000" step="1000" discrete><input matSliderStartThumb formControlName="budgetMin"><input matSliderEndThumb formControlName="budgetMax"></mat-slider><div class="spread muted"><span>¥{{ scheduleForm.controls.budgetMin.value ?? 0 | number }}</span><span>¥{{ scheduleForm.controls.budgetMax.value ?? 0 | number }}</span></div></div></div><div class="step-actions"><button mat-button matStepperPrevious>上一步</button><button mat-flat-button color="primary" matStepperNext [disabled]="scheduleForm.invalid">下一步</button></div></form></mat-step>
        <mat-step [stepControl]="audienceForm"><form [formGroup]="audienceForm"><ng-template matStepLabel>受众与素材</ng-template><div class="form-grid"><mat-form-field appearance="outline"><mat-label>受众规模</mat-label><input matInput type="number" formControlName="audience"><mat-hint>预计参与人数</mat-hint><mat-error>请输入正整数</mat-error></mat-form-field><div><label class="field-label">评分</label><div class="rating">@for (star of [1, 2, 3, 4, 5]; track star) {<button mat-icon-button type="button" (click)="rating.set(star)" [attr.aria-label]="star + ' 星'"><mat-icon [svgIcon]="star <= rating() ? 'star' : 'star-outline'"></mat-icon></button>}</div><mat-hint>当前 {{ rating() }} / 5</mat-hint></div><div><label class="field-label">主题色</label><div class="color-picker"><input type="color" formControlName="color"><span>{{ audienceForm.controls.color.value }}</span></div><mat-hint>用于活动页面强调色</mat-hint></div><div class="full-span upload-zone" cdkDropList (cdkDropListDropped)="dropFile($event)" (dragover)="dragging.set(true)" (dragleave)="dragging.set(false)" (drop)="dragging.set(false)" [class.dragging]="dragging()"><input #fileInput type="file" hidden multiple (change)="selectFiles(fileInput.files)"><mat-icon svgIcon="upload"></mat-icon><h3>拖拽文件到这里</h3><p class="muted">或 <button mat-button type="button" (click)="fileInput.click()">选择文件</button>，支持 PDF、PNG、JPG</p>@if (files().length) {<mat-list>@for (file of files(); track file.name) {<mat-list-item><mat-icon matListItemIcon svgIcon="paper"></mat-icon><span matListItemTitle>{{ file.name }}</span><span matListItemLine>{{ file.size / 1024 | number: '1.0-0' }} KB</span><button mat-icon-button matListItemMeta (click)="removeFile(file)" aria-label="移除文件"><mat-icon svgIcon="x"></mat-icon></button></mat-list-item>}</mat-list>}</div></div><div class="step-actions"><button mat-button matStepperPrevious>上一步</button><button mat-flat-button color="primary" matStepperNext [disabled]="audienceForm.invalid">下一步</button></div></form></mat-step>
        <mat-step><ng-template matStepLabel>确认</ng-template><mat-card class="summary-card"><mat-card-header><mat-card-title>准备发布</mat-card-title><mat-card-subtitle>确认信息无误后提交活动。</mat-card-subtitle></mat-card-header><mat-card-content class="stack"><div class="spread"><span class="muted">活动名称</span><b>{{ detailsForm.controls.name.value || '未填写' }}</b></div><div class="spread"><span class="muted">时间</span><b>{{ scheduleForm.controls.startDate.value | date: 'yyyy-MM-dd' }} — {{ scheduleForm.controls.endDate.value | date: 'yyyy-MM-dd' }}</b></div><div class="spread"><span class="muted">受众规模</span><b>{{ audienceForm.controls.audience.value }} 人</b></div></mat-card-content></mat-card><div class="step-actions"><button mat-button matStepperPrevious>上一步</button><button mat-flat-button color="primary" (click)="submit()">发布活动</button></div></mat-step>
      </mat-stepper></mat-card-content></mat-card>
    </main>
  `,
})
export class FormPage {
  readonly detailsForm = inject(FormBuilder).nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(200)]],
  });
  readonly scheduleForm = inject(FormBuilder).group({
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
    time: [null as Date | null, Validators.required],
    budgetMin: [10000, Validators.required],
    budgetMax: [60000, Validators.required],
  });
  readonly audienceForm = inject(FormBuilder).nonNullable.group({
    audience: [100, [Validators.required, Validators.min(1)]],
    color: ['#4969a8', Validators.required],
  });
  readonly rating = signal(4);
  readonly dragging = signal(false);
  readonly files = signal<File[]>([]);
  readonly verticalStepper = signal(false);
  private readonly breakpoint = inject(BreakpointObserver);

  constructor() {
    this.breakpoint.observe('(max-width: 959px)').subscribe((state) => this.verticalStepper.set(state.matches));
  }

  selectFiles(fileList: FileList | null): void {
    if (fileList) this.files.update((files) => [...files, ...Array.from(fileList)]);
  }

  removeFile(file: File): void {
    this.files.update((files) => files.filter((item) => item !== file));
  }

  dropFile(event: CdkDragDrop<File[]>): void {
    if (event.item.data instanceof File) this.files.update((files) => [...files, event.item.data]);
  }

  submit(): void {
    this.detailsForm.markAllAsTouched();
    this.scheduleForm.markAllAsTouched();
    this.audienceForm.markAllAsTouched();
  }
}
