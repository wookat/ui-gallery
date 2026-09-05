import { Routes } from '@angular/router';
import { AppShell } from './layouts/app-shell';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login').then((m) => m.LoginPage) },
  { path: 'landing', loadComponent: () => import('./pages/landing').then((m) => m.LandingPage) },
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/dashboard').then((m) => m.DashboardPage) },
      { path: 'orders', loadComponent: () => import('./pages/orders').then((m) => m.OrdersPage) },
      { path: 'form', loadComponent: () => import('./pages/form').then((m) => m.FormPage) },
      { path: 'settings', loadComponent: () => import('./pages/settings').then((m) => m.SettingsPage) },
      { path: 'components', loadComponent: () => import('./pages/components').then((m) => m.ComponentsPage) },
      { path: 'chat', loadComponent: () => import('./pages/chat').then((m) => m.ChatPage) },
    ],
  },
  { path: '**', redirectTo: '' },
];
