import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeFa from '@angular/common/locales/fa';
import { LOCALE_ID } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeuix/themes/nora';
import Aura from '@primeuix/themes/aura';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
registerLocaleData(localeFa);

/**
 * تم برند کابینت: روی preset پایه‌ی Aura با رنگ طلایی برند.
 *
 * نکته: در PrimeNG 21 (سیستم تم PrimeUix v3)، کلید `extend` روی preset را
 * با متغیرهای سفارشی merge نمی‌کند (preset گسترش‌یافته بعد از متغیرهای
 * سفارشی تزریق می‌شود و بر آن‌ها ارجاع می‌دهد)؛ بنابراین اینجا preset را
 * مستقیماً spread کرده و `semantic.primary` را جایگزین می‌کنیم.
 */
const CabinetTheme = {
  ...Aura,
  semantic: {
    ...Aura.semantic,
    primary: {
      50: '#fbf5ec',
      100: '#f5e9d3',
      200: '#ecd4a8',
      300: '#e2bc7c',
      400: '#d6a254',
      500: '#c6924b',
      600: '#a97838',
      700: '#8a5f2c',
      800: '#6f4b26',
      900: '#5a3c21',
      950: '#46301b',
    },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
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
    providePrimeNG({
      theme: {
        preset: CabinetTheme,
        options: {
          darkModeSelector: '.dark',
        }
      }
    })
  ],
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/i18n/', '.json');
}
