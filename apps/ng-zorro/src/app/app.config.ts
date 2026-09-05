import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { provideNzNativeDateAdapter } from 'ng-zorro-antd/core/time';
import {
  AppstoreOutline,
  BellOutline,
  BulbOutline,
  DashboardOutline,
  DownOutline,
  EditOutline,
  EyeInvisibleOutline,
  EyeOutline,
  FileAddOutline,
  GlobalOutline,
  GithubOutline,
  InfoCircleOutline,
  LockOutline,
  LoginOutline,
  MailOutline,
  LogoutOutline,
  MenuOutline,
  MessageOutline,
  MoreOutline,
  PlusOutline,
  QuestionCircleOutline,
  SearchOutline,
  SettingOutline,
  ShoppingCartOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons';
import { provideIcons } from '@ng-icons/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { lucideBell, lucideCircleHelp, lucideSearch } from '@ng-icons/lucide';
import { routes } from './app.routes';
import { UrlSettings } from './core/url-settings';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideNzI18n(zh_CN),
    provideNzIcons([
      AppstoreOutline,
      BellOutline,
      BulbOutline,
      DashboardOutline,
      DownOutline,
      EditOutline,
      EyeInvisibleOutline,
      EyeOutline,
      FileAddOutline,
      GlobalOutline,
      GithubOutline,
      InfoCircleOutline,
      LockOutline,
      LoginOutline,
      MailOutline,
      LogoutOutline,
      MenuOutline,
      MessageOutline,
      MoreOutline,
      PlusOutline,
      QuestionCircleOutline,
      SearchOutline,
      SettingOutline,
      ShoppingCartOutline,
      UserOutline,
    ]),
    provideIcons({ lucideBell, lucideCircleHelp, lucideSearch }),
    provideNzNativeDateAdapter(),
    NzMessageService,
    NzModalService,
    provideAppInitializer(() => inject(UrlSettings).initialize()),
  ]
};
