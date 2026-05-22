import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient) {
  return {
    getTranslation: (lang: string|'fa') => http.get(`./assets/i18n/${lang}.json`),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage:'fa',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
  ],
};
