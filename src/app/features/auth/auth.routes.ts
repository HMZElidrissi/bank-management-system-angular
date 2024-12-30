import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';

export const authRoutes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
    title: 'Sign In'
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  }
];
