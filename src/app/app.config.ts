import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { transactionCartReducer } from '@store/reducers/transaction-cart.reducer';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
    provideStore({
      transactionCart: transactionCartReducer
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    }),
    provideAnimations()
  ]
};
