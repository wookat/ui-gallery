import { Routes } from '@angular/router';
import { ShellComponent } from './shell';
import { ComponentsPage, DashboardPage, FormPage, LandingPage, LoginPage, OrdersPage, SettingsPage, ChatPage } from './pages';
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
