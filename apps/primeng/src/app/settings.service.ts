import { DOCUMENT, Injectable, inject, signal } from '@angular/core';

export type IconSet = 'native' | 'lucide' | 'tabler' | 'phosphor' | 'heroicons';
export type FontKey = 'default' | 'inter' | 'geist' | 'noto-sans-sc' | 'lxgw-wenkai';

export const fonts: Record<FontKey, string> = {
  default: "'Inter Variable', system-ui, sans-serif",
  inter: "'Inter Variable', sans-serif",
  geist: "'Geist Variable', sans-serif",
  'noto-sans-sc': "'Noto Sans SC Variable', sans-serif",
  'lxgw-wenkai': "'LXGW WenKai Screen', serif",
};

export const iconSets: IconSet[] = ['native', 'lucide', 'tabler', 'phosphor', 'heroicons'];

/** Reads ?theme= ?font= ?icons= (alias ?icon=) once at startup and applies them to <html>. */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly doc = inject(DOCUMENT);
  readonly dark = signal(false);
  readonly icons = signal<IconSet>('lucide');
  readonly font = signal<FontKey>('default');

  constructor() {
    const params = new URLSearchParams(this.doc.defaultView?.location.search ?? '');
    const explicit = params.get('theme');
    const prefersDark = this.doc.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;
    this.setDark(explicit === 'dark' || (!explicit && prefersDark));

    const icon = params.get('icons') ?? params.get('icon');
    if (icon && (iconSets as string[]).includes(icon)) this.icons.set(icon as IconSet);

    const font = params.get('font') as FontKey | null;
    if (font && font in fonts) this.font.set(font);
    this.doc.documentElement.style.setProperty('--font-sans', fonts[this.font()]);
  }

  setDark(dark: boolean) {
    this.dark.set(dark);
    this.doc.documentElement.classList.toggle('dark', dark);
    this.doc.documentElement.classList.toggle('light', !dark);
    this.doc.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }

  toggleDark() {
    this.setDark(!this.dark());
  }

  setFont(font: FontKey) {
    this.font.set(font);
    this.doc.documentElement.style.setProperty('--font-sans', fonts[font]);
  }

  setIcons(set: IconSet) {
    this.icons.set(set);
  }
}
