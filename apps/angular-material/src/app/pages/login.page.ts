import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../shared/material';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: SHARED_IMPORTS,
  template: `
    <main class="auth-page">
      <section class="auth-brand"><a class="brand" routerLink="/landing"><span class="brand-mark"><mat-icon svgIcon="sparkles"></mat-icon></span>Acme Console</a><div class="auth-quote"><mat-icon svgIcon="format-quote"></mat-icon><blockquote>“清晰的工具让团队做出更好的决定。”</blockquote><span class="muted">— Acme 产品团队</span></div></section>
      <section class="auth-panel"><div class="auth-card"><div class="mobile-auth-brand"><a class="brand" routerLink="/landing"><span class="brand-mark"><mat-icon svgIcon="sparkles"></mat-icon></span>Acme Console</a></div><div class="auth-heading"><p class="eyebrow">WELCOME BACK</p><h1>登录你的工作台</h1><p class="muted">继续你的工作，保持一切井然有序。</p></div>@if (showError()) {<div class="auth-alert"><mat-icon svgIcon="error"></mat-icon><span>邮箱或密码不正确，请重试。</span><button mat-icon-button (click)="showError.set(false)" aria-label="关闭提示"><mat-icon svgIcon="x"></mat-icon></button></div>}<div class="oauth-grid"><button mat-stroked-button (click)="oauth('Google')"><mat-icon svgIcon="globe"></mat-icon>Google</button><button mat-stroked-button (click)="oauth('GitHub')"><mat-icon svgIcon="code"></mat-icon>GitHub</button><button mat-stroked-button (click)="oauth('WeChat')"><mat-icon svgIcon="message-square"></mat-icon>微信</button></div><div class="or-divider"><span>或使用邮箱</span></div><form [formGroup]="loginForm" (ngSubmit)="submit()" class="stack"><mat-form-field appearance="outline"><mat-label>邮箱</mat-label><input matInput type="email" formControlName="email" autocomplete="email"><mat-error>请输入有效的邮箱</mat-error></mat-form-field><mat-form-field appearance="outline"><mat-label>密码</mat-label><input matInput [type]="passwordVisible() ? 'text' : 'password'" formControlName="password" autocomplete="current-password"><button mat-icon-button matSuffix type="button" (click)="passwordVisible.set(!passwordVisible())" [attr.aria-label]="passwordVisible() ? '隐藏密码' : '显示密码'"><mat-icon [svgIcon]="passwordVisible() ? 'eye-off' : 'eye'"></mat-icon></button><mat-error>请输入密码</mat-error></mat-form-field><div class="spread"><mat-checkbox formControlName="remember">记住我</mat-checkbox><a routerLink="/login">忘记密码？</a></div><button mat-flat-button color="primary" class="full" type="submit">登录 <mat-icon svgIcon="arrow-right"></mat-icon></button></form><p class="auth-switch muted">还没有账户？ <a routerLink="/login">免费注册</a></p><small class="muted auth-terms">继续即表示你同意服务条款和隐私政策。</small></div></section>
    </main>
  `,
})
export class LoginPage {
  readonly loginForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [true],
  });
  readonly passwordVisible = signal(false);
  readonly showError = signal(false);

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.showError.set(true);
  }

  oauth(provider: string): void {
    this.showError.set(false);
    this.loginForm.controls.email.setValue(`${provider.toLowerCase()}@example.com`);
  }
}
