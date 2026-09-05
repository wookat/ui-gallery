import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BrandComponent } from '../../core/brand.component';
import { IconComponent } from '../../core/icon.component';

@Component({
  selector: 'ui-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NzAlertModule,
    NzButtonModule,
    NzCardModule,
    NzCheckboxModule,
    NzDividerModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    BrandComponent,
    IconComponent,
  ],
  template: `
    <main class="login-page">
      <nz-card class="login-card">
        <div class="login-grid">
          <ui-brand />
          <div class="heading">
            <h1 nz-typography>登录 Acme Console</h1>
            <p nz-typography nzType="secondary">使用你的账号继续工作</p>
          </div>
          @if (error()) {
            <nz-alert nzType="error" nzShowIcon nzMessage="登录失败" nzDescription="邮箱或密码错误，请重试。" />
          }
          <form nz-form [formGroup]="form" (ngSubmit)="submit()">
            <nz-form-item>
              <nz-form-label nzRequired nzFor="email">邮箱</nz-form-label>
              <nz-form-control nzErrorTip="请输入有效的邮箱">
                <nz-input-wrapper>
                  <nz-icon nzInputPrefix nzType="mail" />
                  <input nz-input id="email" type="email" formControlName="email" />
                </nz-input-wrapper>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired nzFor="password">密码</nz-form-label>
              <nz-form-control nzErrorTip="请输入密码">
                <nz-input-wrapper>
                  <nz-icon nzInputPrefix nzType="lock" />
                  <input nz-input id="password" [type]="passwordVisible() ? 'text' : 'password'" formControlName="password" />
                  <button nz-button nzType="text" type="button" nzInputSuffix (click)="passwordVisible.set(!passwordVisible())">
                    <ui-icon [name]="passwordVisible() ? 'eye-off' : 'eye'" />
                  </button>
                </nz-input-wrapper>
              </nz-form-control>
            </nz-form-item>
            <div class="login-options">
              <label nz-checkbox formControlName="remember">记住我</label>
              <a class="link-target" routerLink="/login" [queryParams]="{ state: 'error' }" queryParamsHandling="merge">忘记密码</a>
            </div>
            <button nz-button nzType="primary" nzBlock [nzLoading]="loading()" type="submit">登录</button>
          </form>
          <nz-divider nzText="或" />
          <div class="oauth-buttons">
            <button nz-button nzBlock>Google</button>
            <button nz-button nzBlock>GitHub</button>
            <button nz-button nzBlock>微信</button>
          </div>
          <div class="register">还没有账号？<a class="link-target" routerLink="/landing" queryParamsHandling="preserve">注册</a></div>
        </div>
      </nz-card>
    </main>
  `,
  styles: `
    .login-page { display: grid; min-height: 100dvh; place-items: center; padding: 16px; background: #f5f5f5; }
    :host-context(.dark) .login-page { background: #000; }
    .login-card { width: min(100%, 400px); }
    .login-grid { display: grid; gap: 20px; padding: 8px; }
    .heading h1 { margin: 0 0 4px; font-size: 24px; }
    .heading p { margin: 0; }
    .login-options { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
    .oauth-buttons { display: grid; gap: 8px; grid-template-columns: repeat(3, 1fr); }
    .register { color: rgba(0,0,0,.45); text-align: center; }
    :host-context(.dark) .register { color: rgba(255,255,255,.45); }
    .link-target { display: inline-flex; align-items: center; min-width: 40px; min-height: 40px; }
    .register a { color: #1677ff; }
    @media (max-width: 430px) { .oauth-buttons { grid-template-columns: 1fr; } }
  `,
})
export class LoginPage implements OnDestroy {
  readonly passwordVisible = signal(false);
  readonly loading = signal(false);
  readonly error = signal(false);
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false),
  });
  private submitSubscription?: Subscription;

  constructor(route: ActivatedRoute) {
    route.queryParamMap.subscribe((params) => this.error.set(params.get('state') === 'error'));
  }

  submit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => control.markAsDirty());
      return;
    }
    this.loading.set(true);
    this.error.set(false);
    this.submitSubscription?.unsubscribe();
    this.submitSubscription = timer(1200).subscribe(() => {
      this.loading.set(false);
      this.error.set(true);
    });
  }

  ngOnDestroy(): void {
    this.submitSubscription?.unsubscribe();
  }
}
