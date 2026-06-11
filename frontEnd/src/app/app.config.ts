import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeFa from '@angular/common/locales/fa';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeFa);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-left',
      timeOut: 3000,
      closeButton: false,
      tapToDismiss: true,
      newestOnTop: true,
    }),

    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'fa',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
    { provide: LOCALE_ID, useValue: 'fa-IR' },
  ],
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
