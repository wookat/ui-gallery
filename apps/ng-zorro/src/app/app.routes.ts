import { Routes } from '@angular/router';
import { ShellComponent } from './layouts/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.page').then((m) => m.OrdersPage),
      },
      {
        path: 'form',
        loadComponent: () => import('./pages/form/form.page').then((m) => m.FormPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'components',
        loadComponent: () =>
          import('./pages/components/components.page').then((m) => m.ComponentsPage),
      },
      {
        path: 'chat',
        loadComponent: () => import('./pages/chat/chat.page').then((m) => m.ChatPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
