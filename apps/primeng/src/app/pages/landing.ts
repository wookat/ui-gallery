import { Component, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Carousel } from 'primeng/carousel';
import { Drawer } from 'primeng/drawer';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import landing from '@ui-gallery/spec/mock/landing.json';
import plans from '@ui-gallery/spec/mock/plans.json';
import team from '@ui-gallery/spec/mock/team.json';
import nav from '@ui-gallery/spec/mock/nav.json';
import { Icon, IconName } from '../icons';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-landing',
  imports: [
    FormsModule, RouterLink, Accordion, AccordionPanel, AccordionHeader, AccordionContent, Avatar, AvatarGroup, Button, Card, Carousel,
    Drawer, Select, Tag, ToggleSwitch, Icon,
  ],
  template: `
    <header class="nav">
      <div class="container row between">
        <a class="brand row" routerLink="/landing" queryParamsHandling="preserve"><span class="logo"><app-icon name="boxes" [size]="16" /></span>Acme</a>
        <nav class="links hide-mobile">
          @for (l of links; track l) { <a href="#{{ l.id }}">{{ l.label }}</a> }
        </nav>
        <div class="row">
          <p-button [text]="true" severity="secondary" [rounded]="true" (onClick)="settings.toggleDark()" [ariaLabel]="settings.dark() ? '切换到浅色' : '切换到深色'">
            <app-icon [name]="settings.dark() ? 'sun' : 'moon'" />
          </p-button>
          <p-button label="登录" [text]="true" severity="secondary" routerLink="/login" queryParamsHandling="preserve" styleClass="hide-mobile" />
          <p-button [label]="hero.primary" routerLink="/" queryParamsHandling="preserve" styleClass="hide-mobile" />
          <p-button [text]="true" severity="secondary" [rounded]="true" styleClass="show-mobile" (onClick)="menu.set(true)" ariaLabel="菜单"><app-icon name="menu" /></p-button>
        </div>
      </div>
    </header>
    <p-drawer [visible]="menu()" (visibleChange)="menu.set($event)" position="right" header="Acme">
      <nav class="col" style="gap:0.25rem">
        @for (l of links; track l) { <a class="mlink" href="#{{ l.id }}" (click)="menu.set(false)">{{ l.label }}</a> }
        <p-button label="登录" [outlined]="true" severity="secondary" routerLink="/login" queryParamsHandling="preserve" styleClass="w-full mt" />
        <p-button [label]="hero.primary" routerLink="/" queryParamsHandling="preserve" styleClass="w-full" />
      </nav>
    </p-drawer>

    <main>
      <section class="hero container">
        <p-tag value="v2 全新发布" [rounded]="true" severity="secondary" />
        <h1>{{ hero.title }}</h1>
        <p class="lead muted">{{ hero.subtitle }}</p>
        <div class="row cta">
          <p-button [label]="hero.primary" size="large" routerLink="/" queryParamsHandling="preserve" iconPos="right"><app-icon name="arrow-right" /></p-button>
          <p-button [label]="hero.secondary" size="large" [outlined]="true" severity="secondary" routerLink="/components" queryParamsHandling="preserve" />
        </div>
        <div class="row social">
          <p-avatar-group>
            @for (m of team.slice(0, 4); track m.email) { <p-avatar [label]="m.name.slice(0, 1)" shape="circle" /> }
            <p-avatar label="+" shape="circle" />
          </p-avatar-group>
          <span class="text-sm muted">{{ hero.social }}</span>
        </div>
        <div class="shot placeholder"><app-icon name="image" [size]="40" /><span>产品截图</span></div>
      </section>

      <section class="container logos">
        <p class="text-sm muted center">受到各行业团队信任</p>
        <div class="logo-row">
          @for (t of landing.testimonials; track t.company) { <span class="logo-item">{{ t.company }}</span> }
        </div>
      </section>

      <section id="features" class="container section">
        <h2 class="center">一切所需，开箱即用</h2>
        <p class="muted center lead-sm">从接入到上线，专为快速迭代的团队设计。</p>
        <div class="grid grid-3">
          @for (f of features; track f.title) {
            <p-card>
              <span class="feat-icon"><app-icon [name]="f.icon" [size]="20" /></span>
              <h3>{{ f.title }}</h3>
              <p class="muted text-sm">{{ f.desc }}</p>
            </p-card>
          }
        </div>
      </section>

      <section id="product" class="container section stack" style="gap:4rem">
        @for (f of features.slice(0, 3); track f.title; let i = $index) {
          <div class="split" [class.reverse]="i % 2 === 1">
            <div class="col">
              <p-tag [value]="f.title" severity="secondary" />
              <h3 class="h3">{{ f.title }}</h3>
              <p class="muted">{{ f.desc }}</p>
              <ul class="checks">
                @for (n of nav.slice(i * 2, i * 2 + 3); track n.key) { <li class="row text-sm"><app-icon name="check-circle" [size]="16" />{{ n.label }}</li> }
              </ul>
              <p-button label="了解更多" [link]="true" iconPos="right" styleClass="link-btn"><app-icon name="arrow-right" /></p-button>
            </div>
            <div class="placeholder split-shot"><app-icon [name]="f.icon" [size]="40" /></div>
          </div>
        }
      </section>

      <section class="numbers">
        <div class="container grid grid-4">
          @for (n of landing.numbers; track n.label) {
            <div class="center"><div class="num">{{ n.value }}</div><div class="text-sm muted">{{ n.label }}</div></div>
          }
        </div>
      </section>

      <section id="pricing" class="container section">
        <h2 class="center">简单透明的定价</h2>
        <div class="row center" style="justify-content:center; margin: 1rem 0 2rem">
          <span class="text-sm" [class.muted]="yearly">按月</span>
          <p-toggleswitch [(ngModel)]="yearly" ariaLabel="按年付费" />
          <span class="text-sm" [class.muted]="!yearly">按年 <p-tag value="省 20%" severity="success" /></span>
        </div>
        <div class="grid grid-3 pricing">
          @for (p of plans; track p.name) {
            <p-card [styleClass]="p.recommended ? 'plan recommended' : 'plan'">
              <div class="row between"><span class="font-semibold">{{ p.name }}</span>@if (p.recommended) { <p-tag value="推荐" /> }</div>
              <div class="price">@if (p.price === null) { 联系我们 } @else { ¥{{ price(p.price) }}<span class="text-sm muted"> / 月</span> }</div>
              <ul class="checks grow">@for (f of p.features; track f) { <li class="row text-sm"><app-icon name="check" [size]="14" />{{ f }}</li> }</ul>
              <p-button [label]="p.price === 0 ? '免费开始' : p.price === null ? '联系销售' : '选择 ' + p.name" [outlined]="!p.recommended" [severity]="p.recommended ? 'primary' : 'secondary'" styleClass="w-full" routerLink="/login" queryParamsHandling="preserve" />
            </p-card>
          }
        </div>
      </section>

      <section id="customers" class="container section">
        <h2 class="center">客户怎么说</h2>
        <p-carousel [value]="landing.testimonials" [numVisible]="3" [numScroll]="1" [responsiveOptions]="carouselOptions" [circular]="true" [showIndicators]="true">
          <ng-template #item let-t>
            <div class="quote-wrap">
              <p-card styleClass="quote">
                <div class="stars row">@for (s of [1, 2, 3, 4, 5]; track s) { <app-icon name="star" [size]="14" /> }</div>
                <p class="q">“{{ t.quote }}”</p>
                <div class="row"><p-avatar [label]="t.name.slice(0, 1)" shape="circle" /><div class="col" style="gap:0"><span class="text-sm font-medium">{{ t.name }}</span><span class="text-xs muted">{{ t.company }}</span></div></div>
              </p-card>
            </div>
          </ng-template>
        </p-carousel>
      </section>

      <section id="faq" class="container section narrow">
        <h2 class="center">常见问题</h2>
        <p-accordion [value]="0">
          @for (f of landing.faq; track f.q; let i = $index) {
            <p-accordion-panel [value]="i">
              <p-accordion-header>{{ f.q }}</p-accordion-header>
              <p-accordion-content><p class="muted">{{ f.a }}</p></p-accordion-content>
            </p-accordion-panel>
          }
        </p-accordion>
      </section>

      <section class="container section">
        <div class="cta-banner">
          <h2>准备好开始了吗？</h2>
          <p>{{ hero.social }}。{{ hero.subtitle }}</p>
          <div class="row" style="justify-content:center">
            <p-button [label]="hero.primary" severity="contrast" size="large" routerLink="/login" queryParamsHandling="preserve" />
            <p-button label="联系销售" [outlined]="true" severity="contrast" size="large" />
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container grid grid-4">
        <div class="col">
          <span class="brand row"><span class="logo"><app-icon name="boxes" [size]="16" /></span>Acme</span>
          <p class="text-sm muted">{{ hero.subtitle }}</p>
          <div class="row">
            <a class="soc" href="#" aria-label="GitHub"><app-icon name="github" /></a>
            <a class="soc" href="#" aria-label="微信"><app-icon name="wechat" /></a>
            <a class="soc" href="#" aria-label="邮件"><app-icon name="mail" /></a>
          </div>
        </div>
        @for (col of footer; track col.title) {
          <div class="col">
            <p class="font-medium text-sm">{{ col.title }}</p>
            @for (l of col.links; track l) { <a class="flink" href="#">{{ l }}</a> }
          </div>
        }
      </div>
      <div class="container row between wrap" style="margin-top:2rem">
        <span class="text-xs muted">© 2026 Acme, Inc. 保留所有权利。</span>
        <p-select [(ngModel)]="lang" [options]="langs" optionLabel="label" optionValue="value" size="small">
          <ng-template #dropdownicon><app-icon name="language" [size]="14" /></ng-template>
        </p-select>
      </div>
    </footer>
  `,
  styles: `
    :host { display: block; background: var(--p-content-background); color: var(--p-text-color); }
    .container { max-width: 72rem; margin: 0 auto; padding: 0 1rem; }
    .nav { position: sticky; top: 0; z-index: 10; height: 3.5rem; display: flex; align-items: center; background: color-mix(in srgb, var(--p-content-background) 85%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--p-content-border-color); }
    .nav .container { width: 100%; }
    .brand { font-weight: 600; text-decoration: none; color: inherit; }
    .logo { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; border-radius: 0.5rem; background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
    .links { display: flex; gap: 1.5rem; }
    .links a, .mlink { font-size: 0.875rem; color: var(--p-text-muted-color); text-decoration: none; }
    .links a:hover { color: var(--p-text-color); }
    .mlink { display: block; padding: 0.625rem 0.5rem; border-radius: 0.375rem; font-size: 1rem; }
    .mlink:hover { background: var(--p-content-hover-background); }
    .hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.25rem; padding: 4rem 1rem 2rem; }
    h1 { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em; max-width: 48rem; margin: 0; }
    h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; letter-spacing: -0.01em; margin: 0 0 0.5rem; }
    h3 { font-size: 1rem; font-weight: 600; margin: 0.75rem 0 0.25rem; }
    .h3 { font-size: 1.5rem; margin: 0.5rem 0; }
    .lead { font-size: 1.125rem; max-width: 36rem; margin: 0; }
    .lead-sm { margin: 0 auto 2rem; max-width: 32rem; }
    .cta { flex-wrap: wrap; justify-content: center; }
    .shot { width: 100%; max-width: 56rem; aspect-ratio: 16 / 9; margin-top: 1.5rem; flex-direction: column; gap: 0.5rem; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
    .logos { padding: 2rem 1rem; }
    .logo-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem 2.5rem; margin-top: 1rem; }
    .logo-item { font-weight: 700; font-size: 1.125rem; color: var(--p-text-muted-color); opacity: 0.7; letter-spacing: 0.02em; }
    .section { padding: 4rem 1rem; }
    .narrow { max-width: 48rem; }
    .feat-icon { display: inline-grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: 0.625rem; background: var(--p-primary-50); color: var(--p-primary-600); }
    html.dark .feat-icon { background: var(--p-primary-900); color: var(--p-primary-300); }
    .split { display: grid; gap: 2rem; align-items: center; grid-template-columns: 1fr; }
    .split-shot { aspect-ratio: 4 / 3; border-radius: 1rem; }
    .checks { display: flex; flex-direction: column; gap: 0.5rem; margin: 0.75rem 0; }
    .checks app-icon { color: var(--p-primary-color); }
    :host ::ng-deep .link-btn { padding-left: 0; }
    .numbers { background: var(--p-content-hover-background); padding: 3rem 0; }
    .num { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; }
    :host ::ng-deep .plan .p-card-body { display: flex; flex-direction: column; gap: 0.75rem; height: 100%; }
    :host ::ng-deep .plan.recommended { border-color: var(--p-primary-color); box-shadow: 0 0 0 1px var(--p-primary-color); }
    .pricing { align-items: stretch; }
    .price { font-size: 2rem; font-weight: 700; }
    .quote-wrap { padding: 0.5rem; height: 100%; }
    :host ::ng-deep .quote .p-card-body { display: flex; flex-direction: column; gap: 0.75rem; height: 100%; }
    .stars { color: var(--p-amber-500); gap: 0.125rem; }
    .q { flex: 1; margin: 0; }
    .cta-banner { background: var(--p-primary-color); color: var(--p-primary-contrast-color); border-radius: 1.25rem; padding: 3rem 1.5rem; text-align: center; display: flex; flex-direction: column; gap: 1rem; align-items: center; }
    .cta-banner p { margin: 0; opacity: 0.85; max-width: 36rem; }
    .footer { border-top: 1px solid var(--p-content-border-color); padding: 3rem 0 2rem; }
    .flink { font-size: 0.875rem; color: var(--p-text-muted-color); text-decoration: none; }
    .flink:hover { color: var(--p-text-color); }
    .soc { color: var(--p-text-muted-color); display: inline-flex; padding: 0.375rem; border-radius: 0.375rem; }
    .soc:hover { color: var(--p-text-color); background: var(--p-content-hover-background); }
    .center { text-align: center; }
    :host ::ng-deep .mt { margin-top: 1rem; }
    @media (min-width: 768px) {
      .split { grid-template-columns: 1fr 1fr; }
      .split.reverse .placeholder { order: -1; }
    }
    @media (max-width: 767px) {
      .hero { padding-top: 2.5rem; }
      .section { padding: 2.5rem 1rem; }
      .num { font-size: 1.5rem; }
    }
  `,
})
export class LandingPage {
  private readonly carousel = viewChild(Carousel);
  constructor() {
    afterNextRender(() => this.carousel()?.cd.markForCheck());
  }
  readonly settings = inject(SettingsService);
  readonly hero = landing.hero;
  readonly landing = landing;
  readonly features = landing.features as { icon: IconName; title: string; desc: string }[];
  readonly plans = plans;
  readonly team = team;
  readonly nav = nav;
  readonly menu = signal(false);
  yearly = false;
  price(p: number) {
    return this.yearly ? Math.round(p * 0.8) : p;
  }
  lang = 'zh-CN';
  readonly langs = [
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en' },
    { label: '日本語', value: 'ja' },
  ];
  readonly links = [
    { id: 'features', label: '功能' },
    { id: 'product', label: '产品' },
    { id: 'pricing', label: '定价' },
    { id: 'customers', label: '客户' },
    { id: 'faq', label: '常见问题' },
  ];
  readonly footer = [
    { title: '产品', links: landing.features.slice(0, 4).map((f) => f.title) },
    { title: '资源', links: ['文档', '更新日志', 'API 参考', '状态页'] },
    { title: '公司', links: ['关于', '博客', '招聘', '联系我们'] },
  ];
  readonly carouselOptions = [
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 1, numScroll: 1 },
  ];
}
