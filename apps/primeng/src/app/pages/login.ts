import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';
import { Divider } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { Icon } from '../icons';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Button, Card, Checkbox, Divider, IconField, InputIcon, InputText, Message, Password, Icon],
  template: `
    <div class="login-wrap">
      <p-card class="login-card">
        <ng-template #header>
          <div class="login-head">
            <a class="brand" routerLink="/" queryParamsHandling="preserve"><span class="brand-mark">A</span>Acme Console</a>
            <h1 class="page-title">欢迎回来</h1>
            <p class="muted">登录 Acme Console，继续你的工作。</p>
          </div>
        </ng-template>
        @if (error()) {
          <p-message severity="error" [closable]="true" (onClose)="error.set(false)" styleClass="w-full">
            <div class="row"><app-icon name="alert-circle" /><span>邮箱或密码错误，请重试。</span></div>
          </p-message>
        }
        <form [formGroup]="form" (ngSubmit)="submit()" class="stack" novalidate>
          <div class="field">
            <label for="email">邮箱<span class="req">*</span></label>
            <p-iconfield>
              <p-inputicon><app-icon name="mail" [size]="14" /></p-inputicon>
              <input pInputText id="email" type="email" formControlName="email" placeholder="you@example.com" class="w-full" autocomplete="email" [invalid]="invalid('email')" />
            </p-iconfield>
            @if (invalid('email')) { <span class="err">请输入有效的邮箱地址</span> } @else { <span class="help">使用工作邮箱登录。</span> }
          </div>
          <div class="field">
            <label for="password">密码<span class="req">*</span></label>
            <p-password inputId="password" formControlName="password" [toggleMask]="true" [feedback]="false" placeholder="••••••••" styleClass="w-full" inputStyleClass="w-full" [invalid]="invalid('password')" autocomplete="current-password" />
            @if (invalid('password')) { <span class="err">密码至少 6 位</span> }
          </div>
          <div class="row between">
            <label class="row text-sm"><p-checkbox formControlName="remember" [binary]="true" inputId="remember" />记住我</label>
            <a class="text-sm" href="#forgot">忘记密码？</a>
          </div>
          <p-button type="submit" label="登录" styleClass="w-full" [loading]="loading()" />
        </form>
        <p-divider align="center"><span class="text-xs muted">或</span></p-divider>
        <div class="oauth">
          <p-button [outlined]="true" severity="secondary" label="Google"><app-icon name="google" /></p-button>
          <p-button [outlined]="true" severity="secondary" label="GitHub"><app-icon name="github" /></p-button>
          <p-button [outlined]="true" severity="secondary" label="微信"><app-icon name="wechat" /></p-button>
        </div>
        <ng-template #footer>
          <p class="text-sm muted" style="text-align:center">还没有账户？ <a href="#register">立即注册</a></p>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: `
    .login-wrap { min-height: 100vh; display: grid; place-items: center; padding: 1rem; }
    .login-card { width: 100%; max-width: 26rem; display: block; }
    .login-head { padding: 1.25rem 1.25rem 0; display: flex; flex-direction: column; gap: 0.75rem; }
    .brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; text-decoration: none; color: inherit; }
    .brand-mark { display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 0.5rem; background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
    :host ::ng-deep .p-card-body { display: flex; flex-direction: column; gap: 1rem; }
    :host ::ng-deep .p-password { width: 100%; }
    .oauth { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
    @media (max-width: 480px) { .oauth { grid-template-columns: 1fr; } }
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly settings = inject(SettingsService);
  readonly loading = signal(false);
  readonly error = signal(true);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true],
  });

  invalid(name: 'email' | 'password') {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
    }, 800);
  }
}
