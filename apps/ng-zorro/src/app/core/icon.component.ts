import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgIcon } from '@ng-icons/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBell,
  lucideCircleHelp,
  lucideSearch,
} from '@ng-icons/lucide';
import { tablerBell, tablerHelpCircle, tablerSearch } from '@ng-icons/tabler-icons';
import {
  phosphorBell,
  phosphorMagnifyingGlass,
  phosphorQuestion,
} from '@ng-icons/phosphor-icons/regular';
import {
  heroBell,
  heroMagnifyingGlass,
  heroQuestionMarkCircle,
} from '@ng-icons/heroicons/outline';
import { UrlSettings, type IconFamily } from './url-settings';

export const ICON_NAMES = [
  'activity', 'alert-circle', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up',
  'bar-chart', 'bell', 'bot', 'boxes', 'calendar', 'check', 'chevron-down', 'chevron-left',
  'chevron-right', 'chevron-up', 'circle-help', 'clipboard', 'clock', 'copy', 'download', 'edit',
  'ellipsis-horizontal', 'file-plus', 'filter', 'globe', 'grid', 'heart', 'home',
  'layout-dashboard', 'link', 'list', 'loader', 'lock', 'log-in', 'log-out', 'menu',
  'message-circle', 'message-square', 'mic', 'minus', 'more-horizontal', 'moon', 'paperclip',
  'pencil', 'play', 'plus', 'plug', 'refresh', 'search', 'send', 'settings', 'shield',
  'shopping-cart', 'sliders', 'sparkles', 'star', 'sun', 'tag', 'trash', 'upload', 'user',
  'users', 'x', 'zap', 'eye', 'eye-off',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

const nativeNames: Partial<Record<IconName, string>> = {
  search: 'search',
  bell: 'bell',
  'layout-dashboard': 'dashboard',
  'shopping-cart': 'shopping-cart',
  'file-plus': 'file-add',
  'message-square': 'message',
  boxes: 'appstore',
  globe: 'global',
  settings: 'setting',
  menu: 'menu',
  moon: 'bulb',
  sun: 'bulb',
  plus: 'plus',
  edit: 'edit',
  lock: 'lock',
  user: 'user',
  eye: 'eye',
  'eye-off': 'eye-invisible',
  'log-in': 'login',
  'log-out': 'logout',
};

const familyNames: Record<IconFamily, Partial<Record<IconName, string>>> = {
  native: nativeNames,
  lucide: { search: 'lucideSearch', bell: 'lucideBell', 'circle-help': 'lucideCircleHelp' },
  tabler: { search: 'tablerSearch', bell: 'tablerBell', 'circle-help': 'tablerHelpCircle' },
  phosphor: {
    search: 'phosphorMagnifyingGlass',
    bell: 'phosphorBell',
    'circle-help': 'phosphorQuestion',
  },
  heroicons: {
    search: 'heroMagnifyingGlass',
    bell: 'heroBell',
    'circle-help': 'heroQuestionMarkCircle',
  },
};

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [NzIconModule, NgIcon],
  viewProviders: [
    provideIcons({
      lucideBell,
      lucideCircleHelp,
      lucideSearch,
      tablerBell,
      tablerHelpCircle,
      tablerSearch,
      phosphorBell,
      phosphorMagnifyingGlass,
      phosphorQuestion,
      heroBell,
      heroMagnifyingGlass,
      heroQuestionMarkCircle,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (family() === 'native') {
      <nz-icon [nzType]="nativeName()" nzTheme="outline" />
    } @else {
      <ng-icon [name]="familyName()" [size]="sizeValue()" />
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number | string>(16);
  private readonly settings = new UrlSettings();
  readonly family = computed(() => this.settings.icons);

  nativeName(): string {
    return nativeNames[this.name()] ?? 'question-circle';
  }

  familyName(): string {
    return familyNames[this.family()][this.name()] ?? familyNames[this.family()]['circle-help']!;
  }

  sizeValue(): string {
    return String(this.size());
  }
}
