import { Component, computed, inject, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import * as L from '@ng-icons/lucide';
import * as T from '@ng-icons/tabler-icons';
import * as P from '@ng-icons/phosphor-icons/regular';
import * as H from '@ng-icons/heroicons/outline';
import { SettingsService } from './settings.service';

export type IconName =
  | 'search' | 'bell' | 'menu' | 'sun' | 'moon' | 'log-out' | 'log-in' | 'user' | 'users' | 'settings'
  | 'layout-dashboard' | 'shopping-cart' | 'file-plus' | 'message-square' | 'boxes' | 'globe' | 'zap'
  | 'shield' | 'bar-chart' | 'bot' | 'plug' | 'mail' | 'lock' | 'eye' | 'eye-off' | 'check' | 'x' | 'plus'
  | 'minus' | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right' | 'more-horizontal' | 'pencil'
  | 'trash' | 'download' | 'upload' | 'copy' | 'send' | 'paperclip' | 'star' | 'heart' | 'home' | 'calendar'
  | 'clock' | 'filter' | 'refresh' | 'info' | 'alert-circle' | 'arrow-up' | 'arrow-down' | 'arrow-right'
  | 'help-circle' | 'sparkles' | 'github' | 'google' | 'wechat' | 'columns' | 'language' | 'smartphone'
  | 'laptop' | 'image' | 'credit-card' | 'check-circle' | 'code' | 'link';

// name → [primeicons class, lucide, tabler, phosphor, heroicons]
const table: Record<IconName, [string, string, string, string, string]> = {
  search: ['pi-search', L.lucideSearch, T.tablerSearch, P.phosphorMagnifyingGlass, H.heroMagnifyingGlass],
  bell: ['pi-bell', L.lucideBell, T.tablerBell, P.phosphorBell, H.heroBell],
  menu: ['pi-bars', L.lucideMenu, T.tablerMenu2, P.phosphorList, H.heroBars3],
  sun: ['pi-sun', L.lucideSun, T.tablerSun, P.phosphorSun, H.heroSun],
  moon: ['pi-moon', L.lucideMoon, T.tablerMoon, P.phosphorMoon, H.heroMoon],
  'log-out': ['pi-sign-out', L.lucideLogOut, T.tablerLogout, P.phosphorSignOut, H.heroArrowRightOnRectangle],
  'log-in': ['pi-sign-in', L.lucideLogIn, T.tablerLogin, P.phosphorSignIn, H.heroArrowLeftOnRectangle],
  user: ['pi-user', L.lucideUser, T.tablerUser, P.phosphorUser, H.heroUser],
  users: ['pi-users', L.lucideUsers, T.tablerUsers, P.phosphorUsers, H.heroUsers],
  settings: ['pi-cog', L.lucideSettings, T.tablerSettings, P.phosphorGear, H.heroCog6Tooth],
  'layout-dashboard': ['pi-th-large', L.lucideLayoutDashboard, T.tablerLayoutDashboard, P.phosphorSquaresFour, H.heroSquares2x2],
  'shopping-cart': ['pi-shopping-cart', L.lucideShoppingCart, T.tablerShoppingCart, P.phosphorShoppingCart, H.heroShoppingCart],
  'file-plus': ['pi-file-plus', L.lucideFilePlus, T.tablerFilePlus, P.phosphorFilePlus, H.heroDocumentPlus],
  'message-square': ['pi-comments', L.lucideMessageSquare, T.tablerMessage, P.phosphorChatText, H.heroChatBubbleLeftRight],
  boxes: ['pi-box', L.lucideBoxes, T.tablerBox, P.phosphorCube, H.heroCube],
  globe: ['pi-globe', L.lucideGlobe, T.tablerGlobe, P.phosphorGlobe, H.heroGlobeAlt],
  zap: ['pi-bolt', L.lucideZap, T.tablerBolt, P.phosphorLightning, H.heroBolt],
  shield: ['pi-shield', L.lucideShield, T.tablerShield, P.phosphorShield, H.heroShieldCheck],
  'bar-chart': ['pi-chart-bar', L.lucideBarChart, T.tablerChartBar, P.phosphorChartBar, H.heroChartBar],
  bot: ['pi-microchip-ai', L.lucideBot, T.tablerRobot, P.phosphorRobot, H.heroCpuChip],
  plug: ['pi-link', L.lucidePlug, T.tablerPlug, P.phosphorPlugs, H.heroPuzzlePiece],
  mail: ['pi-envelope', L.lucideMail, T.tablerMail, P.phosphorEnvelope, H.heroEnvelope],
  lock: ['pi-lock', L.lucideLock, T.tablerLock, P.phosphorLock, H.heroLockClosed],
  eye: ['pi-eye', L.lucideEye, T.tablerEye, P.phosphorEye, H.heroEye],
  'eye-off': ['pi-eye-slash', L.lucideEyeOff, T.tablerEyeOff, P.phosphorEyeSlash, H.heroEyeSlash],
  check: ['pi-check', L.lucideCheck, T.tablerCheck, P.phosphorCheck, H.heroCheck],
  x: ['pi-times', L.lucideX, T.tablerX, P.phosphorX, H.heroXMark],
  plus: ['pi-plus', L.lucidePlus, T.tablerPlus, P.phosphorPlus, H.heroPlus],
  minus: ['pi-minus', L.lucideMinus, T.tablerMinus, P.phosphorMinus, H.heroMinus],
  'chevron-down': ['pi-chevron-down', L.lucideChevronDown, T.tablerChevronDown, P.phosphorCaretDown, H.heroChevronDown],
  'chevron-up': ['pi-chevron-up', L.lucideChevronUp, T.tablerChevronUp, P.phosphorCaretUp, H.heroChevronUp],
  'chevron-left': ['pi-chevron-left', L.lucideChevronLeft, T.tablerChevronLeft, P.phosphorCaretLeft, H.heroChevronLeft],
  'chevron-right': ['pi-chevron-right', L.lucideChevronRight, T.tablerChevronRight, P.phosphorCaretRight, H.heroChevronRight],
  'more-horizontal': ['pi-ellipsis-h', L.lucideEllipsis, T.tablerDots, P.phosphorDotsThree, H.heroEllipsisHorizontal],
  pencil: ['pi-pencil', L.lucidePencil, T.tablerPencil, P.phosphorPencilSimple, H.heroPencil],
  trash: ['pi-trash', L.lucideTrash2, T.tablerTrash, P.phosphorTrash, H.heroTrash],
  download: ['pi-download', L.lucideDownload, T.tablerDownload, P.phosphorDownload, H.heroArrowDownTray],
  upload: ['pi-upload', L.lucideUpload, T.tablerUpload, P.phosphorUpload, H.heroArrowUpTray],
  copy: ['pi-copy', L.lucideCopy, T.tablerCopy, P.phosphorCopy, H.heroDocumentDuplicate],
  send: ['pi-send', L.lucideSend, T.tablerSend, P.phosphorPaperPlaneTilt, H.heroPaperAirplane],
  paperclip: ['pi-paperclip', L.lucidePaperclip, T.tablerPaperclip, P.phosphorPaperclip, H.heroPaperClip],
  star: ['pi-star', L.lucideStar, T.tablerStar, P.phosphorStar, H.heroStar],
  heart: ['pi-heart', L.lucideHeart, T.tablerHeart, P.phosphorHeart, H.heroHeart],
  home: ['pi-home', L.lucideHouse, T.tablerHome, P.phosphorHouse, H.heroHome],
  calendar: ['pi-calendar', L.lucideCalendar, T.tablerCalendar, P.phosphorCalendar, H.heroCalendar],
  clock: ['pi-clock', L.lucideClock, T.tablerClock, P.phosphorClock, H.heroClock],
  filter: ['pi-filter', L.lucideFilter, T.tablerFilter, P.phosphorFunnel, H.heroFunnel],
  refresh: ['pi-refresh', L.lucideRefreshCw, T.tablerRefresh, P.phosphorArrowsClockwise, H.heroArrowPath],
  info: ['pi-info-circle', L.lucideInfo, T.tablerInfoCircle, P.phosphorInfo, H.heroInformationCircle],
  'alert-circle': ['pi-exclamation-circle', L.lucideCircleAlert, T.tablerAlertCircle, P.phosphorWarningCircle, H.heroExclamationCircle],
  'arrow-up': ['pi-arrow-up', L.lucideArrowUp, T.tablerArrowUp, P.phosphorArrowUp, H.heroArrowUp],
  'arrow-down': ['pi-arrow-down', L.lucideArrowDown, T.tablerArrowDown, P.phosphorArrowDown, H.heroArrowDown],
  'arrow-right': ['pi-arrow-right', L.lucideArrowRight, T.tablerArrowRight, P.phosphorArrowRight, H.heroArrowRight],
  'help-circle': ['pi-question-circle', L.lucideCircleHelp, T.tablerHelpCircle, P.phosphorQuestion, H.heroQuestionMarkCircle],
  sparkles: ['pi-sparkles', L.lucideSparkles, T.tablerSparkles, P.phosphorSparkle, H.heroSparkles],
  github: ['pi-github', L.lucideCode, T.tablerBrandGithub, P.phosphorGithubLogo, H.heroCodeBracket],
  google: ['pi-google', L.lucideGlobe, T.tablerBrandGoogle, P.phosphorGoogleLogo, H.heroGlobeAlt],
  wechat: ['pi-wechat', L.lucideMessageCircle, T.tablerBrandWechat, P.phosphorWechatLogo, H.heroChatBubbleLeftRight],
  columns: ['pi-table', L.lucideColumns, T.tablerColumns3, P.phosphorColumns, H.heroViewColumns],
  language: ['pi-language', L.lucideLanguages, T.tablerLanguage, P.phosphorTranslate, H.heroLanguage],
  smartphone: ['pi-mobile', L.lucideSmartphone, T.tablerDeviceMobile, P.phosphorDeviceMobile, H.heroDevicePhoneMobile],
  laptop: ['pi-desktop', L.lucideLaptop, T.tablerDeviceLaptop, P.phosphorLaptop, H.heroComputerDesktop],
  image: ['pi-image', L.lucideImage, T.tablerPhoto, P.phosphorImage, H.heroPhoto],
  'credit-card': ['pi-credit-card', L.lucideCreditCard, T.tablerCreditCard, P.phosphorCreditCard, H.heroCreditCard],
  'check-circle': ['pi-check-circle', L.lucideCircleCheck, T.tablerCircleCheck, P.phosphorCheckCircle, H.heroCheckCircle],
  code: ['pi-code', L.lucideCode, T.tablerCode, P.phosphorCode, H.heroCodeBracket],
  link: ['pi-link', L.lucideLink, T.tablerLink, P.phosphorLink, H.heroLink],
};

const setIndex = { lucide: 1, tabler: 2, phosphor: 3, heroicons: 4 } as const;

/** PrimeIcons class for a semantic icon name (used where PrimeNG expects an icon class string). */
export function pi(name: IconName): string {
  return `pi ${table[name][0]}`;
}

@Component({
  selector: 'app-icon',
  imports: [NgIcon],
  template: `
    @if (svg(); as s) {
      <ng-icon [svg]="s" [size]="size() + 'px'" aria-hidden="true" />
    } @else {
      <i [class]="'pi ' + table[name()][0]" [style.font-size.px]="size()" aria-hidden="true"></i>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; justify-content: center; line-height: 1; vertical-align: middle; }
  `,
})
export class Icon {
  private readonly settings = inject(SettingsService);
  readonly name = input.required<IconName>();
  readonly size = input(16);
  readonly table = table;
  readonly svg = computed(() => {
    const set = this.settings.icons();
    if (set === 'native') return null;
    return table[this.name()][setIndex[set]];
  });
}
