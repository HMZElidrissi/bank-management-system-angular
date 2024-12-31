import { Routes } from '@angular/router';
import { SigninComponent } from '@features/auth/signin/signin.component';
import { SignupComponent } from '@features/auth/signup/signup.component';

export const authRoutes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
    title: 'Sign In'
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up'
  },
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  }
];
