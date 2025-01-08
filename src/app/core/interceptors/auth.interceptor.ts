import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // No need to add Authorization header since we're using cookies
  // Just ensure withCredentials is set for cross-origin requests
  // if we are not using cookies, we can add the token here
  // const token = this.authService.getToken();
  // if (token) {
  //   request = request.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  // }
  if (!req.withCredentials) {
    req = req.clone({
      withCredentials: true,
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
  }
  return next(req);
};
