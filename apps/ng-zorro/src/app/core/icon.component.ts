import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity, lucideAlertCircle, lucideArchive, lucideArrowDown, lucideArrowLeft, lucideArrowRight, lucideArrowUp,
  lucideBarChart3, lucideBell, lucideBot, lucideBoxes, lucideCalendarDays, lucideCheck, lucideChevronDown,
  lucideChevronLeft, lucideChevronRight, lucideChevronUp, lucideCircleHelp, lucideClipboard, lucideClock3, lucideCopy,
  lucideDownload, lucideEdit3, lucideEllipsis, lucideFilePlus, lucideFilter, lucideGlobe, lucideGrid2X2, lucideHeart,
  lucideHome, lucideLayoutDashboard, lucideLink2, lucideList, lucideLoaderCircle, lucideLock, lucideLogIn, lucideLogOut,
  lucideMenu, lucideMessageCircle, lucideMessageSquare, lucideMic, lucideMinus, lucideMoreHorizontal, lucideMoon,
  lucidePaperclip, lucidePencil, lucidePlay, lucidePlug, lucidePlus, lucideRefreshCw, lucideSearch, lucideSend,
  lucideSettings, lucideShield, lucideShoppingCart, lucideSlidersHorizontal, lucideSparkles, lucideStar, lucideSun,
  lucideTag, lucideTrash2, lucideUpload, lucideUser, lucideUsers, lucideX, lucideZap, lucideEye, lucideEyeOff,
} from '@ng-icons/lucide';
import {
  tablerActivity, tablerAlertCircle, tablerArchive, tablerArrowDown, tablerArrowLeft, tablerArrowRight, tablerArrowUp,
  tablerChartBar, tablerBell, tablerRobot, tablerBox, tablerCalendar, tablerCheck, tablerChevronDown, tablerChevronLeft,
  tablerChevronRight, tablerChevronUp, tablerHelpCircle, tablerClipboard, tablerClock, tablerCopy, tablerDownload,
  tablerEdit, tablerDots, tablerFilePlus, tablerFilter, tablerGlobe, tablerGrid3x3, tablerHeart, tablerHome,
  tablerLayoutDashboard, tablerLink, tablerList, tablerLoader2, tablerLock, tablerLogin, tablerLogout, tablerMenu2,
  tablerMessageCircle, tablerMessage, tablerMicrophone, tablerMinus, tablerMoon, tablerPaperclip, tablerPencil,
  tablerPlayerPlay, tablerPlugConnected, tablerPlus, tablerRefresh, tablerSearch, tablerSend, tablerSettings, tablerShield,
  tablerShoppingCart, tablerAdjustmentsHorizontal, tablerSparkles, tablerStar, tablerSun, tablerTag, tablerTrash,
  tablerUpload, tablerUser, tablerUsers, tablerX, tablerZzz, tablerEye, tablerEyeOff,
} from '@ng-icons/tabler-icons';
import {
  phosphorPulse, phosphorWarningCircle, phosphorArchive, phosphorArrowDown, phosphorArrowLeft, phosphorArrowRight,
  phosphorArrowUp, phosphorChartBar, phosphorBell, phosphorRobot, phosphorCube, phosphorCalendar, phosphorCheck,
  phosphorCaretDown, phosphorCaretLeft, phosphorCaretRight, phosphorCaretUp, phosphorQuestion, phosphorClipboard,
  phosphorClock, phosphorCopy, phosphorDownloadSimple, phosphorPencil, phosphorDotsThree, phosphorFilePlus, phosphorFunnel,
  phosphorGlobe, phosphorGridFour, phosphorHeart, phosphorHouse, phosphorSquaresFour, phosphorLink, phosphorList,
  phosphorCircleNotch, phosphorLock, phosphorSignIn, phosphorSignOut, phosphorChatCircle, phosphorChatText,
  phosphorMicrophone, phosphorMinus, phosphorMoon, phosphorPaperclip, phosphorPlay, phosphorPlugs, phosphorPlus,
  phosphorArrowClockwise, phosphorMagnifyingGlass, phosphorPaperPlaneTilt, phosphorGear, phosphorShield,
  phosphorShoppingCart, phosphorSlidersHorizontal, phosphorSparkle, phosphorStar, phosphorSun, phosphorTag, phosphorTrash,
  phosphorUploadSimple, phosphorUser, phosphorUsers, phosphorX, phosphorLightning, phosphorEye, phosphorEyeSlash,
} from '@ng-icons/phosphor-icons/regular';
import {
  heroChartBar, heroExclamationCircle, heroArchiveBox, heroArrowDown, heroArrowLeft, heroArrowRight, heroArrowUp,
  heroBell, heroCpuChip, heroSquare2Stack, heroCalendarDays, heroCheck, heroChevronDown, heroChevronLeft,
  heroChevronRight, heroChevronUp, heroQuestionMarkCircle, heroClipboard, heroClock, heroDocumentDuplicate,
  heroArrowDownTray, heroPencil, heroEllipsisHorizontal, heroDocumentPlus, heroFunnel, heroGlobeAlt, heroSquares2x2,
  heroHeart, heroHome, heroLink, heroListBullet, heroArrowPath, heroLockClosed, heroArrowRightOnRectangle,
  heroArrowLeftOnRectangle, heroBars3, heroChatBubbleOvalLeft, heroChatBubbleLeftRight, heroMicrophone, heroMinus,
  heroMoon, heroPaperClip, heroPlay, heroSignal, heroPlus, heroMagnifyingGlass, heroPaperAirplane, heroCog6Tooth,
  heroShieldCheck, heroShoppingCart, heroAdjustmentsHorizontal, heroSparkles, heroStar, heroSun, heroTag, heroTrash,
  heroArrowUpTray, heroUser, heroUsers, heroXMark, heroBolt, heroEye, heroEyeSlash,
} from '@ng-icons/heroicons/outline';
import { UrlSettings, type IconFamily } from './url-settings';

export const ICON_NAMES = [
  'activity', 'alert-circle', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up',
  'bar-chart', 'bell', 'bot', 'boxes', 'calendar', 'check', 'chevron-down', 'chevron-left',
  'chevron-right', 'chevron-up', 'circle-help', 'clipboard', 'clock', 'copy', 'download', 'edit',
  'ellipsis-horizontal', 'file-plus', 'filter', 'globe', 'grid', 'heart', 'home',
  'layout-dashboard', 'link', 'list', 'loader', 'lock', 'log-in', 'log-out', 'menu',
  'message-circle', 'message-square', 'mic', 'minus', 'more-horizontal', 'moon', 'paperclip',
  'pencil', 'play', 'plug', 'plus', 'refresh', 'search', 'send', 'settings', 'shield',
  'shopping-cart', 'sliders', 'sparkles', 'star', 'sun', 'tag', 'trash', 'upload', 'user',
  'users', 'x', 'zap', 'eye', 'eye-off',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

const nativeNames: Record<IconName, string> = {
  activity: 'line-chart', 'alert-circle': 'exclamation-circle', archive: 'inbox', 'arrow-down': 'down',
  'arrow-left': 'left', 'arrow-right': 'right', 'arrow-up': 'up', 'bar-chart': 'bar-chart', bell: 'bell',
  bot: 'robot', boxes: 'appstore', calendar: 'calendar', check: 'check', 'chevron-down': 'down',
  'chevron-left': 'left', 'chevron-right': 'right', 'chevron-up': 'up', 'circle-help': 'question-circle',
  clipboard: 'snippets', clock: 'clock-circle', copy: 'copy', download: 'download', edit: 'edit',
  'ellipsis-horizontal': 'ellipsis', 'file-plus': 'file-add', filter: 'filter', globe: 'global', grid: 'appstore',
  heart: 'heart', home: 'home', 'layout-dashboard': 'dashboard', link: 'link', list: 'ordered-list',
  loader: 'loading', lock: 'lock', 'log-in': 'login', 'log-out': 'logout', menu: 'menu',
  'message-circle': 'message', 'message-square': 'message', mic: 'audio', minus: 'minus',
  'more-horizontal': 'ellipsis', moon: 'moon', paperclip: 'paper-clip', pencil: 'edit', play: 'play-circle',
  plug: 'usb', plus: 'plus', refresh: 'reload', search: 'search', send: 'send', settings: 'setting',
  shield: 'safety', 'shopping-cart': 'shopping-cart', sliders: 'sliders', sparkles: 'thunderbolt', star: 'star',
  sun: 'sun', tag: 'tag', trash: 'delete', upload: 'upload', user: 'user', users: 'team', x: 'close',
  zap: 'thunderbolt', eye: 'eye', 'eye-off': 'eye-invisible',
};

const familyNames: Record<Exclude<IconFamily, 'native'>, Record<IconName, string>> = {
  lucide: {
    activity: 'lucideActivity', 'alert-circle': 'lucideAlertCircle', archive: 'lucideArchive', 'arrow-down': 'lucideArrowDown',
    'arrow-left': 'lucideArrowLeft', 'arrow-right': 'lucideArrowRight', 'arrow-up': 'lucideArrowUp', 'bar-chart': 'lucideBarChart3',
    bell: 'lucideBell', bot: 'lucideBot', boxes: 'lucideBoxes', calendar: 'lucideCalendarDays', check: 'lucideCheck',
    'chevron-down': 'lucideChevronDown', 'chevron-left': 'lucideChevronLeft', 'chevron-right': 'lucideChevronRight',
    'chevron-up': 'lucideChevronUp', 'circle-help': 'lucideCircleHelp', clipboard: 'lucideClipboard', clock: 'lucideClock3',
    copy: 'lucideCopy', download: 'lucideDownload', edit: 'lucideEdit3', 'ellipsis-horizontal': 'lucideEllipsis',
    'file-plus': 'lucideFilePlus', filter: 'lucideFilter', globe: 'lucideGlobe', grid: 'lucideGrid2X2', heart: 'lucideHeart',
    home: 'lucideHome', 'layout-dashboard': 'lucideLayoutDashboard', link: 'lucideLink2', list: 'lucideList',
    loader: 'lucideLoaderCircle', lock: 'lucideLock', 'log-in': 'lucideLogIn', 'log-out': 'lucideLogOut', menu: 'lucideMenu',
    'message-circle': 'lucideMessageCircle', 'message-square': 'lucideMessageSquare', mic: 'lucideMic', minus: 'lucideMinus',
    'more-horizontal': 'lucideMoreHorizontal', moon: 'lucideMoon', paperclip: 'lucidePaperclip', pencil: 'lucidePencil',
    play: 'lucidePlay', plug: 'lucidePlug', plus: 'lucidePlus', refresh: 'lucideRefreshCw', search: 'lucideSearch',
    send: 'lucideSend', settings: 'lucideSettings', shield: 'lucideShield', 'shopping-cart': 'lucideShoppingCart',
    sliders: 'lucideSlidersHorizontal', sparkles: 'lucideSparkles', star: 'lucideStar', sun: 'lucideSun', tag: 'lucideTag',
    trash: 'lucideTrash2', upload: 'lucideUpload', user: 'lucideUser', users: 'lucideUsers', x: 'lucideX', zap: 'lucideZap',
    eye: 'lucideEye', 'eye-off': 'lucideEyeOff',
  },
  tabler: {
    activity: 'tablerActivity', 'alert-circle': 'tablerAlertCircle', archive: 'tablerArchive', 'arrow-down': 'tablerArrowDown',
    'arrow-left': 'tablerArrowLeft', 'arrow-right': 'tablerArrowRight', 'arrow-up': 'tablerArrowUp', 'bar-chart': 'tablerChartBar',
    bell: 'tablerBell', bot: 'tablerRobot', boxes: 'tablerBox', calendar: 'tablerCalendar', check: 'tablerCheck',
    'chevron-down': 'tablerChevronDown', 'chevron-left': 'tablerChevronLeft', 'chevron-right': 'tablerChevronRight',
    'chevron-up': 'tablerChevronUp', 'circle-help': 'tablerHelpCircle', clipboard: 'tablerClipboard', clock: 'tablerClock',
    copy: 'tablerCopy', download: 'tablerDownload', edit: 'tablerEdit', 'ellipsis-horizontal': 'tablerDots', 'file-plus': 'tablerFilePlus',
    filter: 'tablerFilter', globe: 'tablerGlobe', grid: 'tablerGrid3x3', heart: 'tablerHeart', home: 'tablerHome',
    'layout-dashboard': 'tablerLayoutDashboard', link: 'tablerLink', list: 'tablerList', loader: 'tablerLoader2', lock: 'tablerLock',
    'log-in': 'tablerLogin', 'log-out': 'tablerLogout', menu: 'tablerMenu2', 'message-circle': 'tablerMessageCircle',
    'message-square': 'tablerMessage', mic: 'tablerMicrophone', minus: 'tablerMinus', 'more-horizontal': 'tablerDots', moon: 'tablerMoon',
    paperclip: 'tablerPaperclip', pencil: 'tablerPencil', play: 'tablerPlayerPlay', plug: 'tablerPlugConnected', plus: 'tablerPlus',
    refresh: 'tablerRefresh', search: 'tablerSearch', send: 'tablerSend', settings: 'tablerSettings', shield: 'tablerShield',
    'shopping-cart': 'tablerShoppingCart', sliders: 'tablerAdjustmentsHorizontal', sparkles: 'tablerSparkles', star: 'tablerStar',
    sun: 'tablerSun', tag: 'tablerTag', trash: 'tablerTrash', upload: 'tablerUpload', user: 'tablerUser', users: 'tablerUsers',
    x: 'tablerX', zap: 'tablerZzz', eye: 'tablerEye', 'eye-off': 'tablerEyeOff',
  },
  phosphor: {
    activity: 'phosphorPulse', 'alert-circle': 'phosphorWarningCircle', archive: 'phosphorArchive', 'arrow-down': 'phosphorArrowDown',
    'arrow-left': 'phosphorArrowLeft', 'arrow-right': 'phosphorArrowRight', 'arrow-up': 'phosphorArrowUp', 'bar-chart': 'phosphorChartBar',
    bell: 'phosphorBell', bot: 'phosphorRobot', boxes: 'phosphorCube', calendar: 'phosphorCalendar', check: 'phosphorCheck',
    'chevron-down': 'phosphorCaretDown', 'chevron-left': 'phosphorCaretLeft', 'chevron-right': 'phosphorCaretRight',
    'chevron-up': 'phosphorCaretUp', 'circle-help': 'phosphorQuestion', clipboard: 'phosphorClipboard', clock: 'phosphorClock',
    copy: 'phosphorCopy', download: 'phosphorDownloadSimple', edit: 'phosphorPencil', 'ellipsis-horizontal': 'phosphorDotsThree',
    'file-plus': 'phosphorFilePlus', filter: 'phosphorFunnel', globe: 'phosphorGlobe', grid: 'phosphorGridFour', heart: 'phosphorHeart',
    home: 'phosphorHouse', 'layout-dashboard': 'phosphorSquaresFour', link: 'phosphorLink', list: 'phosphorList',
    loader: 'phosphorCircleNotch', lock: 'phosphorLock', 'log-in': 'phosphorSignIn', 'log-out': 'phosphorSignOut', menu: 'phosphorList',
    'message-circle': 'phosphorChatCircle', 'message-square': 'phosphorChatText', mic: 'phosphorMicrophone', minus: 'phosphorMinus',
    'more-horizontal': 'phosphorDotsThree', moon: 'phosphorMoon', paperclip: 'phosphorPaperclip', pencil: 'phosphorPencil',
    play: 'phosphorPlay', plug: 'phosphorPlugs', plus: 'phosphorPlus', refresh: 'phosphorArrowClockwise', search: 'phosphorMagnifyingGlass',
    send: 'phosphorPaperPlaneTilt', settings: 'phosphorGear', shield: 'phosphorShield', 'shopping-cart': 'phosphorShoppingCart',
    sliders: 'phosphorSlidersHorizontal', sparkles: 'phosphorSparkle', star: 'phosphorStar', sun: 'phosphorSun', tag: 'phosphorTag',
    trash: 'phosphorTrash', upload: 'phosphorUploadSimple', user: 'phosphorUser', users: 'phosphorUsers', x: 'phosphorX',
    zap: 'phosphorLightning', eye: 'phosphorEye', 'eye-off': 'phosphorEyeSlash',
  },
  heroicons: {
    activity: 'heroChartBar', 'alert-circle': 'heroExclamationCircle', archive: 'heroArchiveBox', 'arrow-down': 'heroArrowDown',
    'arrow-left': 'heroArrowLeft', 'arrow-right': 'heroArrowRight', 'arrow-up': 'heroArrowUp', 'bar-chart': 'heroChartBar',
    bell: 'heroBell', bot: 'heroCpuChip', boxes: 'heroSquare2Stack', calendar: 'heroCalendarDays', check: 'heroCheck',
    'chevron-down': 'heroChevronDown', 'chevron-left': 'heroChevronLeft', 'chevron-right': 'heroChevronRight',
    'chevron-up': 'heroChevronUp', 'circle-help': 'heroQuestionMarkCircle', clipboard: 'heroClipboard', clock: 'heroClock',
    copy: 'heroDocumentDuplicate', download: 'heroArrowDownTray', edit: 'heroPencil', 'ellipsis-horizontal': 'heroEllipsisHorizontal',
    'file-plus': 'heroDocumentPlus', filter: 'heroFunnel', globe: 'heroGlobeAlt', grid: 'heroSquares2x2', heart: 'heroHeart',
    home: 'heroHome', 'layout-dashboard': 'heroSquares2x2', link: 'heroLink', list: 'heroListBullet', loader: 'heroArrowPath',
    lock: 'heroLockClosed', 'log-in': 'heroArrowRightOnRectangle', 'log-out': 'heroArrowLeftOnRectangle', menu: 'heroBars3',
    'message-circle': 'heroChatBubbleOvalLeft', 'message-square': 'heroChatBubbleLeftRight', mic: 'heroMicrophone', minus: 'heroMinus',
    'more-horizontal': 'heroEllipsisHorizontal', moon: 'heroMoon', paperclip: 'heroPaperClip', pencil: 'heroPencil', play: 'heroPlay',
    plug: 'heroSignal', plus: 'heroPlus', refresh: 'heroArrowPath', search: 'heroMagnifyingGlass', send: 'heroPaperAirplane',
    settings: 'heroCog6Tooth', shield: 'heroShieldCheck', 'shopping-cart': 'heroShoppingCart', sliders: 'heroAdjustmentsHorizontal',
    sparkles: 'heroSparkles', star: 'heroStar', sun: 'heroSun', tag: 'heroTag', trash: 'heroTrash', upload: 'heroArrowUpTray',
    user: 'heroUser', users: 'heroUsers', x: 'heroXMark', zap: 'heroBolt', eye: 'heroEye', 'eye-off': 'heroEyeSlash',
  },
};

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [NzIconModule, NgIcon],
  viewProviders: [provideIcons({
    lucideActivity, lucideAlertCircle, lucideArchive, lucideArrowDown, lucideArrowLeft, lucideArrowRight, lucideArrowUp,
    lucideBarChart3, lucideBell, lucideBot, lucideBoxes, lucideCalendarDays, lucideCheck, lucideChevronDown, lucideChevronLeft,
    lucideChevronRight, lucideChevronUp, lucideCircleHelp, lucideClipboard, lucideClock3, lucideCopy, lucideDownload, lucideEdit3,
    lucideEllipsis, lucideFilePlus, lucideFilter, lucideGlobe, lucideGrid2X2, lucideHeart, lucideHome, lucideLayoutDashboard,
    lucideLink2, lucideList, lucideLoaderCircle, lucideLock, lucideLogIn, lucideLogOut, lucideMenu, lucideMessageCircle,
    lucideMessageSquare, lucideMic, lucideMinus, lucideMoreHorizontal, lucideMoon, lucidePaperclip, lucidePencil, lucidePlay,
    lucidePlug, lucidePlus, lucideRefreshCw, lucideSearch, lucideSend, lucideSettings, lucideShield, lucideShoppingCart,
    lucideSlidersHorizontal, lucideSparkles, lucideStar, lucideSun, lucideTag, lucideTrash2, lucideUpload, lucideUser, lucideUsers,
    lucideX, lucideZap, lucideEye, lucideEyeOff, tablerActivity, tablerAlertCircle, tablerArchive, tablerArrowDown, tablerArrowLeft,
    tablerArrowRight, tablerArrowUp, tablerChartBar, tablerBell, tablerRobot, tablerBox, tablerCalendar, tablerCheck,
    tablerChevronDown, tablerChevronLeft, tablerChevronRight, tablerChevronUp, tablerHelpCircle, tablerClipboard, tablerClock,
    tablerCopy, tablerDownload, tablerEdit, tablerDots, tablerFilePlus, tablerFilter, tablerGlobe, tablerGrid3x3, tablerHeart,
    tablerHome, tablerLayoutDashboard, tablerLink, tablerList, tablerLoader2, tablerLock, tablerLogin, tablerLogout, tablerMenu2,
    tablerMessageCircle, tablerMessage, tablerMicrophone, tablerMinus, tablerMoon, tablerPaperclip, tablerPencil, tablerPlayerPlay,
    tablerPlugConnected, tablerPlus, tablerRefresh, tablerSearch, tablerSend, tablerSettings, tablerShield, tablerShoppingCart,
    tablerAdjustmentsHorizontal, tablerSparkles, tablerStar, tablerSun, tablerTag, tablerTrash, tablerUpload, tablerUser, tablerUsers,
    tablerX, tablerZzz, tablerEye, tablerEyeOff, phosphorPulse, phosphorWarningCircle, phosphorArchive, phosphorArrowDown,
    phosphorArrowLeft, phosphorArrowRight, phosphorArrowUp, phosphorChartBar, phosphorBell, phosphorRobot, phosphorCube,
    phosphorCalendar, phosphorCheck, phosphorCaretDown, phosphorCaretLeft, phosphorCaretRight, phosphorCaretUp, phosphorQuestion,
    phosphorClipboard, phosphorClock, phosphorCopy, phosphorDownloadSimple, phosphorPencil, phosphorDotsThree, phosphorFilePlus,
    phosphorFunnel, phosphorGlobe, phosphorGridFour, phosphorHeart, phosphorHouse, phosphorSquaresFour, phosphorLink, phosphorList,
    phosphorCircleNotch, phosphorLock, phosphorSignIn, phosphorSignOut, phosphorChatCircle, phosphorChatText, phosphorMicrophone,
    phosphorMinus, phosphorMoon, phosphorPaperclip, phosphorPlay, phosphorPlugs, phosphorPlus, phosphorArrowClockwise,
    phosphorMagnifyingGlass, phosphorPaperPlaneTilt, phosphorGear, phosphorShield, phosphorShoppingCart, phosphorSlidersHorizontal,
    phosphorSparkle, phosphorStar, phosphorSun, phosphorTag, phosphorTrash, phosphorUploadSimple, phosphorUser, phosphorUsers,
    phosphorX, phosphorLightning, phosphorEye, phosphorEyeSlash, heroChartBar, heroExclamationCircle, heroArchiveBox, heroArrowDown,
    heroArrowLeft, heroArrowRight, heroArrowUp, heroBell, heroCpuChip, heroSquare2Stack, heroCalendarDays, heroCheck,
    heroChevronDown, heroChevronLeft, heroChevronRight, heroChevronUp, heroQuestionMarkCircle, heroClipboard, heroClock,
    heroDocumentDuplicate, heroArrowDownTray, heroPencil, heroEllipsisHorizontal, heroDocumentPlus, heroFunnel, heroGlobeAlt,
    heroSquares2x2, heroHeart, heroHome, heroLink, heroListBullet, heroArrowPath, heroLockClosed, heroArrowRightOnRectangle,
    heroArrowLeftOnRectangle, heroBars3, heroChatBubbleOvalLeft, heroChatBubbleLeftRight, heroMicrophone, heroMinus, heroMoon,
    heroPaperClip, heroPlay, heroSignal, heroPlus, heroMagnifyingGlass, heroPaperAirplane, heroCog6Tooth, heroShieldCheck,
    heroShoppingCart, heroAdjustmentsHorizontal, heroSparkles, heroStar, heroSun, heroTag, heroTrash, heroArrowUpTray, heroUser,
    heroUsers, heroXMark, heroBolt, heroEye, heroEyeSlash,
  })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (family() === 'native') { <nz-icon [nzType]="nativeName()" nzTheme="outline" [nzSpin]="name() === 'loader'" /> } @else { <ng-icon [name]="familyName()" [size]="sizeValue()" [class.icon-spin]="name() === 'loader'" /> }`,
  styles: `:host ::ng-deep .icon-spin{animation:icon-spin 1s linear infinite}@keyframes icon-spin{to{transform:rotate(360deg)}}`,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number | string>(16);
  private readonly settings = inject(UrlSettings);
  readonly family = computed(() => this.settings.icons);

  nativeName(): string { return nativeNames[this.name()]; }
  familyName(): string { return familyNames[this.family() as Exclude<IconFamily, 'native'>][this.name()]; }
  sizeValue(): string { return String(this.size()); }
}
