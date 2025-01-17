import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
        title: 'Dashboard'
      },
      {
        path: 'accounts',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./accounts/accounts-list/accounts-list.component').then(
                (m) => m.AccountsListComponent
              ),
            title: 'Accounts'
          },
          {
            path: 'new',
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] },
            loadComponent: () =>
              import('./accounts/account-form/account-form.component').then(
                (m) => m.AccountFormComponent
              ),
            title: 'Create Account'
          },
          {
            path: 'edit/:id',
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] },
            loadComponent: () =>
              import('./accounts/account-form/account-form.component').then(
                (m) => m.AccountFormComponent
              ),
            title: 'Edit Account'
          }
        ]
      },
      {
        path: 'users',
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./users/users-list/users-list.component').then((m) => m.UsersListComponent),
            title: 'Users'
          },
          {
            path: 'new',
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] },
            loadComponent: () =>
              import('./users/user-form/user-form.component').then((m) => m.UserFormComponent),
            title: 'Create User'
          },
          {
            path: 'edit/:id',
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] },
            loadComponent: () =>
              import('./users/user-form/user-form.component').then((m) => m.UserFormComponent),
            title: 'Edit User'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];
