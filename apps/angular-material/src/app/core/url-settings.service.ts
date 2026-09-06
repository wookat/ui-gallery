import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { IconSetName } from './icons/types';

const fontStacks: Record<string, string> = {
  default: 'Roboto, "Helvetica Neue", sans-serif',
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  'noto-sans-sc': "'Noto Sans SC Variable', sans-serif",
  'lxgw-wenkai': "'LXGW WenKai Screen', serif",
};

@Injectable({ providedIn: 'root' })
export class UrlSettingsService {
  readonly theme = signal<'light' | 'dark'>('light');
  readonly font = signal('default');
  readonly iconSet = signal<IconSetName>('native');

  constructor(private readonly router: Router) {
    this.read();
  }

  read(): void {
    const params = new URLSearchParams(window.location.search);
    const requestedTheme = params.get('theme');
    const dark =
      requestedTheme === 'dark' ||
      (!requestedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const theme = dark ? 'dark' : 'light';
    const font = fontStacks[params.get('font') ?? 'default'] ? params.get('font') ?? 'default' : 'default';
    const requestedIcons = params.get('icons') ?? params.get('icon') ?? 'native';
    const iconSet: IconSetName = ['native', 'lucide', 'tabler', 'phosphor', 'heroicons'].includes(requestedIcons)
      ? (requestedIcons as IconSetName)
      : 'native';

    this.theme.set(theme);
    this.font.set(font);
    this.iconSet.set(iconSet);
    this.apply(theme, font);
  }

  toggle(): void {
    const theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.router.navigate([], {
      queryParams: { theme },
      queryParamsHandling: 'merge',
    });
    this.theme.set(theme);
    this.apply(theme, this.font());
  }

  private apply(theme: 'light' | 'dark', font: string): void {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.style.colorScheme = theme;
    root.style.setProperty('--app-font', fontStacks[font] ?? fontStacks['default']);
  }
}
