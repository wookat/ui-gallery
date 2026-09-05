import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import nav from '@ui-gallery/spec/mock/nav.json';
import notifications from '@ui-gallery/spec/mock/notifications.json';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { BrandComponent } from '../core/brand.component';
import { IconComponent, type IconName } from '../core/icon.component';
import { UrlSettings } from '../core/url-settings';

@Component({
  selector: 'ui-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NzAvatarModule,
    NzBadgeModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzDropdownModule,
    NzDrawerModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzLayoutModule,
    NzListModule,
    NzMenuModule,
    NzPopoverModule,
    NzTooltipModule,
    BrandComponent,
    IconComponent,
  ],
  template: `
    <nz-layout class="shell">
      <nz-sider
        nzCollapsible
        nzTheme="light"
        [nzCollapsed]="collapsed()"
        [nzBreakpoint]="'lg'"
        [nzCollapsedWidth]="0"
        [nzTrigger]="null"
      >
        <div class="sider-content">
          <div class="brand-wrap"><ui-brand /></div>
          <ng-container *ngTemplateOutlet="menuTemplate"></ng-container>
          <button nz-button nzType="text" class="collapse-button" (click)="collapsed.set(!collapsed())">
            <ui-icon [name]="collapsed() ? 'menu' : 'chevron-left'" />
            <span>{{ collapsed() ? '展开' : '收起' }}</span>
          </button>
          <a class="user-card" routerLink="/settings" queryParamsHandling="preserve">
            <nz-avatar nzSize="small" nzText="林" />
            <span>林晓</span>
          </a>
        </div>
      </nz-sider>
      <nz-layout>
        <nz-header class="header">
          <button nz-button nzType="text" class="mobile-menu" (click)="mobileOpen.set(true)">
            <ui-icon name="menu" />
          </button>
          <nz-breadcrumb>
            <nz-breadcrumb-item><a routerLink="/" queryParamsHandling="preserve">Acme Console</a></nz-breadcrumb-item>
            <nz-breadcrumb-item>{{ currentTitle() }}</nz-breadcrumb-item>
          </nz-breadcrumb>
          <div class="header-actions">
            <nz-input-group nzPrefixIcon="search" class="global-search">
              <input nz-input placeholder="搜索..." />
            </nz-input-group>
            <button nz-button nzType="text" nz-tooltip nzTooltipTitle="通知" [nz-popover]="notificationTpl" nzPopoverPlacement="bottomRight">
              <nz-badge [nzCount]="unreadCount()"><ui-icon name="bell" /></nz-badge>
            </button>
            <button nz-button nzType="text" nz-tooltip nzTooltipTitle="切换主题" (click)="settings.toggleTheme()">
              <ui-icon [name]="settings.theme === 'dark' ? 'sun' : 'moon'" />
            </button>
            <button nz-button nzType="text" nz-dropdown [nzDropdownMenu]="accountMenu">
              <nz-avatar nzSize="small" nzText="林" />
            </button>
            <nz-dropdown-menu #accountMenu="nzDropdownMenu">
              <ul nz-menu>
                <li nz-menu-item>个人资料</li>
                <li nz-menu-item>账号安全</li>
                <li nz-menu-item>通知</li>
                <li nz-menu-item>账单</li>
                <li nz-menu-item>退出登录</li>
              </ul>
            </nz-dropdown-menu>
          </div>
        </nz-header>
        <nz-content class="page-content">
          <router-outlet />
        </nz-content>
      </nz-layout>
    </nz-layout>
    <nz-drawer [nzVisible]="mobileOpen()" nzPlacement="left" nzTitle="Acme Console" [nzWidth]="280" (nzOnClose)="mobileOpen.set(false)">
      <ng-container *nzDrawerContent>
        <ng-container *ngTemplateOutlet="menuTemplate; context: { mobile: true }"></ng-container>
      </ng-container>
    </nz-drawer>
    <ng-template #menuTemplate let-mobile="mobile">
      <ul nz-menu nzMode="inline" nzTheme="light">
        <li nz-menu-group nzTitle="工作区">
          @for (item of navItems; track item.key) {
            <li nz-menu-item [routerLink]="item.path" routerLinkActive="ant-menu-item-selected" queryParamsHandling="preserve" (click)="mobile && mobileOpen.set(false)">
              <ui-icon [name]="iconName(item.icon)" />
              <span>{{ item.label }}</span>
              @if (item.badge) { <nz-badge [nzCount]="item.badge" /> }
            </li>
          }
        </li>
      </ul>
    </ng-template>
    <ng-template #notificationTpl>
      <nz-list nzSize="small" nzHeader="通知">
        @for (item of notifications; track item.title) {
          <nz-list-item>
            <nz-list-item-meta [nzTitle]="item.title" [nzDescription]="item.time" />
          </nz-list-item>
        }
      </nz-list>
    </ng-template>
  `,
  styles: `
    :host { display: block; min-height: 100dvh; }
    .shell { min-height: 100dvh; }
    .sider-content { display: flex; min-height: 100dvh; flex-direction: column; padding: 16px 12px; }
    .brand-wrap { padding: 0 8px 20px; }
    .header { display: flex; align-items: center; gap: 16px; padding: 0 24px; background: #fff; border-bottom: 1px solid #f0f0f0; }
    :host-context(.dark) .header { background: #141414; border-bottom-color: #303030; }
    .header-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
    .global-search { width: 220px; }
    .mobile-menu { display: none; }
    .collapse-button { margin-top: auto; min-height: 40px; text-align: left; }
    .user-card { display: flex; align-items: center; gap: 8px; min-height: 40px; padding: 12px 8px 0; text-decoration: none; }
    .page-content { padding: 24px; min-width: 0; }
    :host-context(.dark) .user-card { color: rgba(255,255,255,.85); }
    :host-context(.dark) .collapse-button { color: rgba(255,255,255,.85); }
    @media (max-width: 991px) {
      .mobile-menu { display: inline-flex; }
      .global-search { display: none; }
      .header { padding: 0 16px; }
    }
  `,
})
export class ShellComponent {
  readonly navItems = nav;
  readonly notifications = notifications;
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly settings = new UrlSettings();
  readonly unreadCount = computed(() => this.notifications.filter((item) => item.unread).length);
  readonly currentTitle = signal('仪表盘');

  iconName(value: string): IconName {
    return value as IconName;
  }

  constructor(router: Router, route: ActivatedRoute) {
    router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const path = router.url.split('?')[0];
      this.currentTitle.set(this.navItems.find((item) => item.path === path)?.label ?? '仪表盘');
    });
    route.url.subscribe(() => {
      const path = router.url.split('?')[0];
      this.currentTitle.set(this.navItems.find((item) => item.path === path)?.label ?? '仪表盘');
    });
  }
}
