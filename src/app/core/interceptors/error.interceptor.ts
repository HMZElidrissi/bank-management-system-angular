import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastService = inject(ToastService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleSpecificErrors(error.status, router, authService);

      toastService.error(
        error.error?.message || 'An unexpected error occurred. Please try again later.'
      );

      return throwError(() => error);
    })
  );
};

function handleSpecificErrors(status: number, router: Router, authService: AuthService): void {
  switch (status) {
    case HttpStatusCode.Unauthorized:
      authService.signout();
      router.navigate(['/auth/signin']);
      break;
  }
}
