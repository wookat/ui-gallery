import type { SafeHtml } from '@angular/platform-browser';

export type IconSetName = 'native' | 'lucide' | 'tabler' | 'phosphor' | 'heroicons';
export type IconMap = Record<string, string>;
export type SafeIconMap = Record<string, SafeHtml>;
