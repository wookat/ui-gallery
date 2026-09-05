import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { IconComponent } from '../../core/icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzAutocompleteModule, NzButtonModule, NzCheckboxModule, NzColorPickerModule, NzDatePickerModule, NzDescriptionsModule, NzFormModule, NzInputModule, NzInputNumberModule, NzRateModule, NzRadioModule, NzResultModule, NzSelectModule, NzSliderModule, NzStepsModule, NzSwitchModule, NzTagModule, NzTimePickerModule, NzTooltipModule, NzUploadModule, IconComponent],
  template: `
    <section class="form-page"><h1 nz-typography>新建项目</h1>
      <nz-steps [nzCurrent]="step" nzSize="small"><nz-step nzTitle="基本信息" /><nz-step nzTitle="详细配置" /><nz-step nzTitle="确认" /></nz-steps>
      @if (!success) { <form nz-form [formGroup]="form" (ngSubmit)="submit()">
        @if (step === 0) { <div formGroupName="basic" class="form-grid">
          <nz-form-item><nz-form-label nzRequired>项目名称</nz-form-label><nz-form-control nzErrorTip="请输入项目名称"><input nz-input formControlName="name" /></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label nzRequired>预算</nz-form-label><nz-form-control nzErrorTip="预算需在 1 至 1000000 之间"><nz-input-number formControlName="budget" [nzMin]="1" [nzMax]="1000000" /></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label nzRequired>邮箱</nz-form-label><nz-form-control nzErrorTip="请输入有效邮箱"><input nz-input formControlName="email" /></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label nzRequired>电话</nz-form-label><nz-form-control nzErrorTip="请输入电话号码"><nz-input-group nzAddOnBefore><nz-select formControlName="country" [nzOptions]="countries" /></nz-input-group><input nz-input formControlName="phone" /></nz-form-control></nz-form-item>
          <nz-form-item class="full"><nz-form-label nzRequired>描述</nz-form-label><nz-form-control nzErrorTip="请输入描述"><textarea nz-input formControlName="description" maxlength="200" rows="4"></textarea></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label nzRequired>类型</nz-form-label><nz-form-control nzErrorTip="请选择类型"><nz-radio-group formControlName="type"><label nz-radio nzValue="internal">内部</label><label nz-radio nzValue="external">外部</label></nz-radio-group></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label>范围</nz-form-label><nz-form-control><label nz-checkbox formControlName="scope">Web / 移动端</label></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label>启用通知</nz-form-label><nz-form-control><nz-switch formControlName="notify" /></nz-form-control></nz-form-item>
        </div> } @else if (step === 1) { <div formGroupName="detail" class="form-grid">
          <nz-form-item><nz-form-label nzRequired>区域</nz-form-label><nz-form-control nzErrorTip="请选择区域"><nz-select formControlName="region"><nz-option nzValue="cn" nzLabel="中国大陆" /><nz-option nzValue="sg" nzLabel="新加坡" /><nz-option nzValue="eu" nzLabel="欧洲" /></nz-select></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label>标签</nz-form-label><nz-form-control><nz-select formControlName="tags" nzMode="multiple"><nz-option nzValue="sales" nzLabel="销售" /><nz-option nzValue="ops" nzLabel="运营" /><nz-option nzValue="finance" nzLabel="财务" /></nz-select></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label nzRequired>负责人</nz-form-label><nz-form-control nzErrorTip="请选择负责人"><nz-select formControlName="owner" nzShowSearch><nz-option nzValue="lin" nzLabel="林晓" /><nz-option nzValue="wang" nzLabel="王子涵" /><nz-option nzValue="alex" nzLabel="Alex Chen" /></nz-select></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label>自动完成</nz-form-label><nz-form-control><input nz-input formControlName="suggestion" [nzAutocomplete]="auto" /><nz-autocomplete #auto><nz-auto-option nzValue="每周一">每周一</nz-auto-option><nz-auto-option nzValue="每月一日">每月一日</nz-auto-option></nz-autocomplete></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label>日期</nz-form-label><nz-form-control><nz-date-picker formControlName="date" /></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label>时间</nz-form-label><nz-form-control><nz-time-picker formControlName="time" /></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label>日期范围</nz-form-label><nz-form-control><nz-range-picker formControlName="range" /></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label>范围滑块</nz-form-label><nz-form-control><nz-slider formControlName="slider" nzRange [nzMin]="0" [nzMax]="100" /></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label>评分</nz-form-label><nz-form-control><nz-rate formControlName="rate" /></nz-form-control></nz-form-item>
          <nz-form-item><nz-form-label nzTooltipTitle="用于品牌标识">颜色 <ui-icon name="circle-help" nz-tooltip /></nz-form-label><nz-form-control nzExtra="请选择一个主题色"><nz-color-picker formControlName="color" /></nz-form-control></nz-form-item>
          <nz-form-item class="full"><nz-form-label>附件</nz-form-label><nz-form-control><nz-upload nzType="drag" [nzBeforeUpload]="beforeUpload" [nzFileList]="fileList"><p>拖拽文件到此处，或点击上传</p></nz-upload></nz-form-control></nz-form-item>
          <nz-form-item class="full"><nz-form-label>自定义标签</nz-form-label><nz-form-control>@for (tag of editableTags; track tag) { <nz-tag nzMode="closeable" (nzOnClose)="removeTag(tag)">{{ tag }}</nz-tag> }<nz-tag (click)="addingTag = true">+ 新标签</nz-tag>@if (addingTag) { <input nz-input class="tag-input" [(ngModel)]="newTag" [ngModelOptions]="{standalone:true}" (keyup.enter)="addTag()" /> }</nz-form-control></nz-form-item>
        </div> } @else { <nz-descriptions nzBordered [nzColumn]="1"><nz-descriptions-item nzTitle="项目名称">{{ form.value.basic?.name }}</nz-descriptions-item><nz-descriptions-item nzTitle="邮箱">{{ form.value.basic?.email }}</nz-descriptions-item><nz-descriptions-item nzTitle="预算">¥ {{ form.value.basic?.budget }}</nz-descriptions-item><nz-descriptions-item nzTitle="区域">{{ form.value.detail?.region }}</nz-descriptions-item></nz-descriptions><label nz-checkbox formControlName="agreement" class="agreement">我已阅读并同意条款</label> }
        <div class="actions"><button nz-button type="button" [disabled]="step === 0" (click)="step = step - 1">上一步</button><button nz-button nzType="primary" type="button" *ngIf="step < 2" (click)="next()">下一步</button><button nz-button nzType="primary" *ngIf="step === 2">提交</button></div>
      </form> } @else { <nz-result nzStatus="success" nzTitle="项目创建成功"><div nz-result-extra><button nz-button (click)="step = 0; success = false">返回</button><button nz-button nzType="primary" (click)="reset()">再建一个</button></div></nz-result> }
    </section>
  `,
  styles: `.form-page { display:grid; gap:24px; max-width:960px; }.form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:0 24px; }.form-grid .full { grid-column:1/-1; } nz-form-item { min-width:0; }.actions { display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }.agreement { display:block; margin-top:20px; }.tag-input { width:120px; margin-left:8px; } nz-input-number, nz-select, nz-date-picker, nz-time-picker, nz-range-picker { width:100%; } @media(max-width:767px){.form-grid{grid-template-columns:1fr;} .form-grid .full{grid-column:auto;} .actions{justify-content:stretch}.actions button{flex:1;}}`,
})
export class FormPage {
  private readonly fb = inject(FormBuilder);
  step = 0; success = false; addingTag = false; newTag = ''; editableTags = ['核心项目', '内部'];
  countries = [{ label: '+86', value: '+86' }, { label: '+1', value: '+1' }, { label: '+81', value: '+81' }];
  fileList: NzUploadFile[] = [{ uid: '1', name: '需求文档.pdf', status: 'done' }, { uid: '2', name: '品牌素材.zip', status: 'done' }];
  readonly form = this.fb.group({
    basic: this.fb.group({ name: ['', Validators.required], budget: [1000, [Validators.required, Validators.min(1)]], email: ['', [Validators.required, Validators.email]], country: ['+86', Validators.required], phone: ['', [Validators.required, Validators.pattern(/^[0-9]{6,15}$/)]], description: ['', [Validators.required, Validators.maxLength(200)]], type: ['internal', Validators.required], scope: [true, Validators.required], notify: [true] }),
    detail: this.fb.group({ region: ['', Validators.required], tags: [[] as string[]], owner: ['', Validators.required], suggestion: [''], date: [null], time: [null], range: [null], slider: [[20, 80]], rate: [4], color: ['#1677ff'] }),
    agreement: [false, Validators.requiredTrue],
  });
  beforeUpload = (): boolean => false;
  next(): void { const group = this.step === 0 ? this.form.controls.basic : this.form.controls.detail; group.markAllAsTouched(); if (group.invalid) return; this.step += 1; }
  submit(): void { this.form.controls.agreement.markAsTouched(); if (this.form.invalid) return; setTimeout(() => (this.success = true), 1000); }
  reset(): void { this.form.reset({ basic: { name: '', budget: 1000, email: '', country: '+86', phone: '', description: '', type: 'internal', scope: true, notify: true }, detail: { region: '', tags: [], owner: '', suggestion: '', date: null, time: null, range: null, slider: [20, 80], rate: 4, color: '#1677ff' }, agreement: false }); this.step = 0; this.success = false; }
  removeTag(tag: string): void { this.editableTags = this.editableTags.filter((item) => item !== tag); }
  addTag(): void { if (this.newTag.trim()) this.editableTags = [...this.editableTags, this.newTag.trim()]; this.newTag = ''; this.addingTag = false; }
}
