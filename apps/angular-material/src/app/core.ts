import { Injectable, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';

const iconNames = [
  'activity', 'alert-circle', 'archive', 'arrow-down', 'arrow-left', 'arrow-right',
  'arrow-up', 'bell', 'bot', 'boxes', 'calendar', 'check', 'chevron-down',
  'chevron-left', 'chevron-right', 'chevron-up', 'clipboard', 'clock', 'copy',
  'download', 'edit', 'ellipsis', 'file-plus', 'filter', 'globe', 'grid',
  'heart', 'home', 'layout-dashboard', 'link', 'list', 'lock', 'log-in',
  'log-out', 'menu', 'message-square', 'moon', 'paperclip', 'pencil', 'plus',
  'refresh', 'search', 'send', 'settings', 'shield', 'shopping-cart',
  'sliders', 'sparkles', 'star', 'sun', 'tag', 'trash', 'upload', 'user',
  'users', 'x', 'zap', 'more', 'info', 'play', 'plug', 'mic', 'loader', 'circle', 'eye',
];

@Injectable({ providedIn: 'root' })
export class IconService {
  constructor(registry: MatIconRegistry, sanitizer: DomSanitizer) {
    for (const name of iconNames) {
      const safe = sanitizer.bypassSecurityTrustHtml(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>`,
      );
      registry.addSvgIconLiteral(name, safe);
    }
  }
}

@Injectable({ providedIn: 'root' })
export class UrlSettingsService {
  readonly theme = signal<'light' | 'dark'>('light');
  readonly font = signal('default');
  readonly iconSet = signal('native');

  constructor(private readonly router: Router) { this.read(); }

  read() {
    const params = new URLSearchParams(window.location.search);
    const explicit = params.get('theme');
    const dark = explicit === 'dark' || (!explicit && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const theme = dark ? 'dark' : 'light';
    const font = params.get('font') ?? 'default';
    const iconSet = params.get('icon') ?? params.get('icons') ?? 'native';
    this.theme.set(theme); this.font.set(font); this.iconSet.set(iconSet);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
    document.documentElement.style.colorScheme = theme;
    const fonts: Record<string, string> = {
      default: 'Roboto, "Helvetica Neue", sans-serif',
      inter: "'Inter Variable', sans-serif",
      geist: "'Geist Variable', sans-serif",
      'noto-sans-sc': "'Noto Sans SC Variable', sans-serif",
      'lxgw-wenkai': "'LXGW WenKai Screen', serif",
    };
    document.documentElement.style.setProperty('--app-font', fonts[font] ?? fonts['default']);
  }

  toggle() {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.router.navigate([], { queryParams: { theme: next }, queryParamsHandling: 'merge' });
    this.theme.set(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.classList.toggle('light', next === 'light');
    document.documentElement.style.colorScheme = next;
  }
}
