import { EMPTY, Observable, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

import { IMoTable } from 'core/components/dynamics/mo-table/mo-table.interface';

export const pipedPreConfirmObs$ = <T = any>(obs$: Observable<T>): Observable<T> =>
 obs$
    .pipe(
      catchError(
        () =>
        {
          swal.close();
          return EMPTY;
        }
      )
    );

export const pipedPreConfirmDelete$ =<T = any>( config: IMoTable ,obs$: Observable<T> ): Observable<T> =>
  pipedPreConfirmObs$<T>(obs$)
    .pipe(
      tap(
       ()=> config?.actions?.rowActions?.delete?.useSpinner?.next(null)
      )
    );
