import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { OverlayBadge } from 'primeng/overlaybadge';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Button } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { Popover } from 'primeng/popover';
import { Tooltip } from 'primeng/tooltip';
import nav from '@ui-gallery/spec/mock/nav.json';
import notifications from '@ui-gallery/spec/mock/notifications.json';
import team from '@ui-gallery/spec/mock/team.json';
import { Icon, IconName } from '../icons';
import { SettingsService } from '../settings.service';

interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, Avatar, Badge, OverlayBadge, Breadcrumb, Button, Drawer,
    IconField, InputIcon, InputText, Menu, Popover, Tooltip, Icon,
  ],
  template: `
    <div class="shell" [class.collapsed]="collapsed()">
      <aside class="sidebar hide-mobile">
        <a class="brand" routerLink="/" queryParamsHandling="preserve">
          <span class="brand-mark">A</span>
          <span class="brand-text">Acme Console</span>
        </a>
        <div class="nav-group-label">工作区</div>
        <ul class="nav">
          @for (item of nav; track item.key) {
            <li>
              <a [routerLink]="item.path" queryParamsHandling="preserve" routerLinkActive="active"
                 [routerLinkActiveOptions]="{ exact: true }" [pTooltip]="collapsed() ? item.label : undefined" tooltipPosition="right">
                <app-icon [name]="icon(item.icon)" [size]="16" />
                <span class="nav-label">{{ item.label }}</span>
                @if (item.badge) { <p-badge [value]="item.badge" severity="secondary" class="nav-badge" /> }
              </a>
            </li>
          }
        </ul>
        <div class="sidebar-footer">
          <a class="user-card" routerLink="/settings" queryParamsHandling="preserve">
            <p-avatar [label]="me.name.slice(0, 1)" shape="circle" />
            <span class="nav-label col" style="gap:0">
              <span class="font-medium">{{ me.name }}</span>
              <span class="text-xs muted">{{ me.email }}</span>
            </span>
          </a>
        </div>
      </aside>

      <div class="main">
        <header class="topbar">
          <p-button class="hide-mobile icon-btn" [text]="true" severity="secondary" (onClick)="collapsed.set(!collapsed())" pTooltip="收起/展开侧栏" tooltipPosition="bottom" ariaLabel="切换侧栏">
            <app-icon name="menu" />
          </p-button>
          <p-button class="show-mobile icon-btn" [text]="true" severity="secondary" (onClick)="mobileOpen.set(true)" ariaLabel="打开菜单">
            <app-icon name="menu" />
          </p-button>
          <p-breadcrumb class="hide-mobile" [model]="crumbs()" [home]="home" />
          <span class="grow"></span>
          <p-iconfield class="hide-mobile search">
            <p-inputicon><app-icon name="search" [size]="14" /></p-inputicon>
            <input pInputText type="text" placeholder="搜索..." pSize="small" />
          </p-iconfield>
          <p-button class="icon-btn" [text]="true" severity="secondary" (onClick)="notif.toggle($event)" ariaLabel="通知">
            <p-overlaybadge [value]="unread" severity="danger" size="small">
              <app-icon name="bell" />
            </p-overlaybadge>
          </p-button>
          <p-popover #notif>
            <div class="notif">
              <div class="row between"><span class="font-semibold">通知</span><span class="text-xs muted">{{ unread }} 条未读</span></div>
              @for (n of notifications; track n.title) {
                <div class="notif-item" [class.unread]="n.unread">
                  <span class="dot"></span>
                  <div class="col" style="gap:0"><span class="text-sm">{{ n.title }}</span><span class="text-xs muted">{{ n.time }}</span></div>
                </div>
              }
            </div>
          </p-popover>
          <p-button class="icon-btn" [text]="true" severity="secondary" (onClick)="toggleTheme()" pTooltip="切换主题" tooltipPosition="bottom" ariaLabel="切换主题">
            <app-icon [name]="settings.dark() ? 'sun' : 'moon'" />
          </p-button>
          <p-button class="icon-btn" [text]="true" [rounded]="true" severity="secondary" (onClick)="userMenu.toggle($event)" ariaLabel="用户菜单">
            <p-avatar [label]="me.name.slice(0, 1)" shape="circle" size="normal" />
          </p-button>
          <p-menu #userMenu [model]="userItems" [popup]="true" appendTo="body" />
        </header>
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>

    <p-drawer [visible]="mobileOpen()" (visibleChange)="mobileOpen.set($event)" [style]="{ width: '18rem' }">
      <ng-template #headless>
        <div class="drawer-body">
          <div class="row between" style="padding: 1rem 1rem 0.5rem">
            <a class="brand" routerLink="/" queryParamsHandling="preserve" (click)="mobileOpen.set(false)">
              <span class="brand-mark">A</span><span class="brand-text">Acme Console</span>
            </a>
            <p-button [text]="true" severity="secondary" [rounded]="true" (onClick)="mobileOpen.set(false)" ariaLabel="关闭"><app-icon name="x" /></p-button>
          </div>
          <ul class="nav" style="padding: 0 0.75rem">
            @for (item of nav; track item.key) {
              <li>
                <a [routerLink]="item.path" queryParamsHandling="preserve" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="mobileOpen.set(false)">
                  <app-icon [name]="icon(item.icon)" [size]="16" />
                  <span class="nav-label">{{ item.label }}</span>
                  @if (item.badge) { <p-badge [value]="item.badge" severity="secondary" class="nav-badge" /> }
                </a>
              </li>
            }
          </ul>
        </div>
      </ng-template>
    </p-drawer>
  `,
  styles: `
    .shell { display: flex; min-height: 100vh; }
    .sidebar {
      width: 16rem; flex: none; position: sticky; top: 0; height: 100vh; overflow-y: auto;
      display: flex; flex-direction: column; padding: 0.75rem;
      background: var(--p-content-background); border-right: 1px solid var(--p-content-border-color);
      transition: width 0.2s;
    }
    .collapsed .sidebar { width: 4rem; }
    .collapsed .nav-label, .collapsed .brand-text, .collapsed .nav-group-label, .collapsed .nav-badge { display: none; }
    .collapsed .nav a, .collapsed .user-card, .collapsed .brand { justify-content: center; }
    .brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; text-decoration: none; color: inherit; padding: 0.5rem; }
    .brand-mark {
      display: grid; place-items: center; width: 2rem; height: 2rem; border-radius: 0.5rem;
      background: var(--p-primary-color); color: var(--p-primary-contrast-color); font-weight: 700;
    }
    .nav-group-label { font-size: 0.75rem; color: var(--p-text-muted-color); padding: 0.75rem 0.5rem 0.25rem; }
    .nav { display: flex; flex-direction: column; gap: 0.125rem; }
    .nav a {
      display: flex; align-items: center; gap: 0.625rem; padding: 0.5rem 0.625rem; border-radius: var(--p-content-border-radius);
      color: var(--p-text-color); text-decoration: none; font-size: 0.875rem; transition: background 0.15s;
    }
    .nav a:hover { background: var(--p-content-hover-background); }
    .nav a.active { background: var(--p-highlight-background); color: var(--p-highlight-color); font-weight: 500; }
    .nav-badge { margin-left: auto; }
    .sidebar-footer { margin-top: auto; border-top: 1px solid var(--p-content-border-color); padding-top: 0.5rem; }
    .user-card { display: flex; align-items: center; gap: 0.625rem; padding: 0.5rem; border-radius: var(--p-content-border-radius); color: inherit; text-decoration: none; }
    .user-card:hover { background: var(--p-content-hover-background); }
    .main { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; }
    .topbar {
      position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 0.5rem; height: 4rem; padding: 0 1rem;
      background: color-mix(in srgb, var(--p-content-background) 92%, transparent); backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--p-content-border-color);
    }
    .topbar ::ng-deep .p-breadcrumb { background: transparent; border: 0; padding: 0; }
    .search { width: 14rem; flex: none; }
    .search input { width: 100%; }
    .content { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; min-width: 0; }
    .notif { display: flex; flex-direction: column; gap: 0.5rem; width: 18rem; }
    .notif-item { display: flex; gap: 0.5rem; align-items: flex-start; padding: 0.5rem; border-radius: var(--p-content-border-radius); }
    .notif-item:hover { background: var(--p-content-hover-background); }
    .notif-item .dot { width: 0.5rem; height: 0.5rem; margin-top: 0.4rem; border-radius: 999px; background: transparent; flex: none; }
    .notif-item.unread .dot { background: var(--p-primary-color); }
    .drawer-body { display: flex; flex-direction: column; gap: 0.5rem; }
    @media (max-width: 767px) {
      .content { padding: 1rem; gap: 1rem; }
      .topbar { padding: 0 0.5rem; }
    }
  `,
})
export class AppShell {
  readonly settings = inject(SettingsService);
  private readonly router = inject(Router);
  readonly nav = nav as NavItem[];
  readonly notifications = notifications;
  readonly unread = notifications.filter((n) => n.unread).length;
  readonly me = team[0];
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly home: MenuItem = { label: 'Acme Console', routerLink: '/', queryParamsHandling: 'preserve' };
  readonly userItems: MenuItem[] = [
    { label: this.me.name, disabled: true },
    { separator: true },
    { label: '账户设置', icon: 'pi pi-cog', routerLink: '/settings', queryParamsHandling: 'preserve' },
    { label: '退出登录', icon: 'pi pi-sign-out', routerLink: '/login', queryParamsHandling: 'preserve' },
  ];

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
  readonly crumbs = computed<MenuItem[]>(() => {
    const path = this.url().split('?')[0];
    const item = this.nav.find((n) => n.path === path) ?? this.nav[0];
    return [{ label: item.label }];
  });

  icon(name: string): IconName {
    return name as IconName;
  }

  toggleTheme() {
    this.settings.toggleDark();
    const params = new URLSearchParams(window.location.search);
    params.set('theme', this.settings.dark() ? 'dark' : 'light');
    history.replaceState(null, '', `${window.location.pathname}?${params}`);
  }
}
