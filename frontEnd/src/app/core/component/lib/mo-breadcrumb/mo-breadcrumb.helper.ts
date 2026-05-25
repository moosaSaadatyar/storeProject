// import { inject } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';

// export const  breadcrumbTranslate = (key: string = ''): ()=> string =>
//   ()=> inject(TranslateService).instant(key);

import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

export const breadcrumbTranslate = (key: string = ''): () => Observable<string> => {
  return () => {
    const translateService = inject(TranslateService);
    
    if (!translateService || !key) {
      return of(key);
    }
    
    return translateService.get(key).pipe(
      take(1),
      map(translated => translated || key),
      catchError(() => {
        return of(key);
      })
    );
  };
};