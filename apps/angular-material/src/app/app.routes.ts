import { Routes } from '@angular/router';
import { ShellComponent } from './shell';
import { DashboardPage } from './pages/dashboard.page';
import { OrdersPage } from './pages/orders.page';
import { SettingsPage } from './pages/settings.page';
import { FormPage } from './pages/form.page';
import { ComponentsPage } from './pages/components.page';
import { ChatPage } from './pages/chat.page';
import { LandingPage } from './pages/landing.page';
import { LoginPage } from './pages/login.page';
export const appRoutes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'landing', component: LandingPage },
  { path: '', component: ShellComponent, children: [
    { path: '', component: DashboardPage },
    { path: 'orders', component: OrdersPage },
    { path: 'form', component: FormPage },
    { path: 'settings', component: SettingsPage },
    { path: 'components', component: ComponentsPage },
    { path: 'chat', component: ChatPage },
  ]},
  { path: '**', redirectTo: '' },
];
