import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import nav from '@ui-gallery/spec/mock/nav.json';
import notifications from '@ui-gallery/spec/mock/notifications.json';
import { IconService, UrlSettingsService } from './core';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatBadgeModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatListModule, MatMenuModule, MatSidenavModule, MatToolbarModule, MatTooltipModule],
  template: `
    <mat-sidenav-container class="shell-container">
      <mat-sidenav #sidenav [mode]="mobile() ? 'over' : 'side'" [opened]="!mobile() || drawerOpen()" class="shell-sidenav" [class.shell-sidenav-collapsed]="collapsed()">
        <div class="brand"><span class="brand-mark">A</span>@if (!collapsed()) {<span>Acme Console</span>}</div>
        <button mat-icon-button class="collapse" (click)="collapsed.set(!collapsed())" [attr.aria-label]="collapsed() ? '展开导航' : '折叠导航'"><mat-icon svgIcon="chevron-left"></mat-icon></button>
        <mat-nav-list>
          @for (item of navItems; track item.path) {
            <a mat-list-item [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{exact: item.path === '/'}" queryParamsHandling="preserve" (click)="mobile() && drawerOpen.set(false)" [matTooltip]="collapsed() ? item.label : ''">
              <mat-icon matListItemIcon [svgIcon]="item.icon"></mat-icon>@if (!collapsed()) {<span matListItemTitle>{{ item.label }}</span>}
              @if (item.badge && !collapsed()) {<span matBadge="{{item.badge}}" matBadgeSize="small" matBadgeColor="accent"></span>}
            </a>
          }
        </mat-nav-list>
        @if (!collapsed()) {<div class="sidenav-user"><span class="avatar">林</span><span><b>林晓</b><small>管理员</small></span><button mat-icon-button [matMenuTriggerFor]="userMenu"><mat-icon svgIcon="more-vertical"></mat-icon></button></div>}
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar class="topbar">
          @if (mobile()) {<button mat-icon-button (click)="drawerOpen.set(true)"><mat-icon svgIcon="menu"></mat-icon></button>}
          <span class="breadcrumb">Acme Console <span>/</span> {{ currentLabel() }}</span><span class="topbar-spacer"></span>
          <mat-form-field class="search-field" appearance="outline" subscriptSizing="dynamic"><mat-icon matPrefix svgIcon="search"></mat-icon><input matInput placeholder="搜索..." /></mat-form-field>
          <button mat-icon-button [matMenuTriggerFor]="noticeMenu" [matBadge]="unreadCount" matBadgeSize="small" matBadgeColor="accent" aria-label="通知"><mat-icon svgIcon="bell"></mat-icon></button>
          <button mat-icon-button (click)="settings.toggle()" [attr.aria-label]="settings.theme() === 'dark' ? '切换亮色' : '切换暗色'"><mat-icon [svgIcon]="settings.theme() === 'dark' ? 'sun' : 'moon'"></mat-icon></button>
          <button mat-icon-button [matMenuTriggerFor]="userMenu" class="top-avatar">林</button>
        </mat-toolbar>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
    <mat-menu #noticeMenu="matMenu"><div class="menu-title">通知</div>@for (notice of notices; track notice.title) {<button mat-menu-item><span>{{ notice.title }}</span><small>{{ notice.time }}</small></button>}</mat-menu>
    <mat-menu #userMenu="matMenu"><button mat-menu-item>个人资料</button><button mat-menu-item>偏好设置</button><button mat-menu-item>快捷键</button><button mat-menu-item>帮助中心</button><button mat-menu-item>退出登录</button></mat-menu>
  `,
  styles: [`
    :host { display:block; min-height:100vh; }.shell-container { min-height:100vh; }.shell-sidenav { width:260px; border-right:1px solid var(--mat-sys-outline-variant); transition:width 180ms ease; }.shell-sidenav-collapsed { width:72px; }
    .brand { height:64px; display:flex; align-items:center; gap:10px; padding:0 20px; font-weight:700; letter-spacing:-.02em; }.brand-mark { width:32px; height:32px; display:grid; place-items:center; border-radius:9px; background:var(--mat-sys-primary); color:var(--mat-sys-on-primary); }
    .collapse { position:absolute; top:16px; right:-20px; z-index:3; background:var(--mat-sys-surface-container); }.active { background:var(--mat-sys-secondary-container); color:var(--mat-sys-on-secondary-container); }
    .topbar { position:sticky; top:0; z-index:4; height:64px; border-bottom:1px solid var(--mat-sys-outline-variant); background:color-mix(in srgb,var(--mat-sys-surface) 90%,transparent); backdrop-filter:blur(10px); }
    .breadcrumb { font-size:14px; font-weight:600; }.breadcrumb span { margin:0 8px; color:var(--mat-sys-outline); }.topbar-spacer { flex:1; }.search-field { width:220px; margin:20px 8px 0; }.search-field ::ng-deep .mat-mdc-form-field-subscript-wrapper { display:none; }
    .top-avatar { background:var(--mat-sys-primary-container); color:var(--mat-sys-on-primary-container); font-weight:700; }.sidenav-user { position:absolute; bottom:14px; left:14px; right:14px; display:flex; align-items:center; gap:10px; padding:10px; border-radius:12px; background:var(--mat-sys-surface-container); }
    .sidenav-user b,.sidenav-user small { display:block; }.sidenav-user small { color:var(--mat-sys-on-surface-variant); font-size:11px; }.sidenav-user button { margin-left:auto; }.menu-title { padding:12px 16px 6px; font-weight:700; }.mat-mdc-menu-item small { margin-left:auto; color:var(--mat-sys-on-surface-variant); }
    @media (max-width:959px) { .search-field { display:none; }.shell-sidenav, .shell-sidenav-collapsed { width:280px; } }
  `],
})
export class ShellComponent {
  readonly navItems = nav; readonly notices = notifications; readonly unreadCount = notifications.filter((notice) => notice.unread).length; readonly collapsed = signal(false); readonly drawerOpen = signal(false); readonly mobile = signal(false);
  readonly settings = inject(UrlSettingsService); private readonly breakpoints = inject(BreakpointObserver);
  constructor(_icons: IconService) { this.breakpoints.observe('(max-width: 959px)').subscribe(result => this.mobile.set(result.matches)); }
  currentLabel() { return this.navItems.find(item => window.location.pathname.endsWith(item.path) || (item.path === '/' && window.location.pathname.endsWith('/')))?.label ?? '概览'; }
}
