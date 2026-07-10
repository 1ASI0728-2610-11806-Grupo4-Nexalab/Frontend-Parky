import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then(m => m.Register)
  },
  {
    path: '',
    loadComponent: () => import('./layout/dashboard-layout/dashboard-layout').then(m => m.DashboardLayout),
    children: [
      {
        path: 'driver',
        pathMatch: 'full',
        loadComponent: () => import('./pages/driver/driver').then(m => m.DriverDashboard),
        data: { mode: 'conductor' }
      },
      {
        path: 'driver/reservations',
        loadComponent: () => import('./pages/reservations/reservations').then(m => m.ReservationsView)
      },
      {
        path: 'driver/messages',
        loadComponent: () => import('./pages/messages/messages').then(m => m.MessagesView)
      },
      {
        path: 'driver/settings',
        loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsView)
      },
      {
        path: 'owner',
        pathMatch: 'full',
        loadComponent: () => import('./pages/owner/owner').then(m => m.OwnerDashboard),
        data: { mode: 'propietario' }
      },
      {
        path: 'owner/garage',
        loadComponent: () => import('./pages/garage/garage').then(m => m.GarageView)
      },
      {
        path: 'owner/stats',
        loadComponent: () => import('./pages/stats/stats').then(m => m.StatsView)
      },
      {
        path: 'owner/settings',
        loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsView)
      },
      {
        path: 'owner/profile',
        loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileView)
      },
      {
        path: 'owner/messages',
        loadComponent: () => import('./pages/messages/messages').then(m => m.MessagesView)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileView)
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
