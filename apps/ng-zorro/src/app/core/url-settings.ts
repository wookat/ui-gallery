import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

export type Theme = 'light' | 'dark';
export type Font = 'default' | 'inter' | 'geist' | 'noto-sans-sc' | 'lxgw-wenkai';
export type IconFamily = 'native' | 'lucide' | 'tabler' | 'phosphor' | 'heroicons';

@Injectable({ providedIn: 'root' })
export class UrlSettings {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private initialized = false;

  theme: Theme = 'light';
  font: Font = 'default';
  icons: IconFamily = 'native';

  initialize(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }
    this.initialized = true;
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');
    this.theme =
      themeParam === 'dark' || themeParam === 'light'
        ? themeParam
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    this.font = this.getFont(params.get('font'));
    this.icons = this.getIcons(params.get('icons') ?? params.get('icon'));
    this.applyTheme();
    this.applyFont();
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    void this.router.navigate([], {
      queryParams: { theme: this.theme },
      queryParamsHandling: 'merge',
    });
  }

  private applyTheme(): void {
    const root = this.document.documentElement;
    root.classList.toggle('dark', this.theme === 'dark');
    root.dataset['theme'] = this.theme;
    root.style.colorScheme = this.theme;
    const existing = this.document.getElementById('nz-dark');
    if (this.theme === 'dark') {
      if (!existing) {
        const link = this.document.createElement('link');
        link.id = 'nz-dark';
        link.rel = 'stylesheet';
        link.href = `${this.document.querySelector('base')?.getAttribute('href') ?? '/'}dark.css`;
        this.document.head.appendChild(link);
      }
    } else {
      existing?.remove();
    }
  }

  private applyFont(): void {
    const fonts: Record<Exclude<Font, 'default'>, string> = {
      inter: 'Inter Variable',
      geist: 'Geist Variable',
      'noto-sans-sc': 'Noto Sans SC Variable',
      'lxgw-wenkai': 'LXGW WenKai Screen',
    };
    if (this.font !== 'default') {
      this.document.documentElement.style.setProperty('--ui-font', fonts[this.font]);
    }
  }

  private getFont(value: string | null): Font {
    return ['default', 'inter', 'geist', 'noto-sans-sc', 'lxgw-wenkai'].includes(value ?? '')
      ? (value as Font)
      : 'default';
  }

  private getIcons(value: string | null): IconFamily {
    return ['native', 'lucide', 'tabler', 'phosphor', 'heroicons'].includes(value ?? '')
      ? (value as IconFamily)
      : 'native';
  }
}
