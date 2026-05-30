import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../../public/envierments/envierments';
import { IBodyResult } from '../../interface/body-result/body-result.interface';

type readByIdType<T1 , T2 , T3> = T3 extends string ? T2 : T1;
type convertToBodyResultType<T> = T extends unknown[] ? IBodyResult<unknown> : T;


@Injectable()
export abstract class GenericApiService<T>
{

  protected constructor(
    protected http: HttpClient,
    protected restUrl: string
  )
  {
  }

  // C => CRUD
  public create(entity: Partial<T>, concatUrl: string = '', params: Record<string, any> = {}): Observable<T>
  {
    return this.http.post<T>(`${environment.apiUrl}/${this.restUrl}/${concatUrl}`, entity,
    {
      params
    });
  }

  // R => CRUD
  public readList(params: Record<string, any> = {}, concatUrl: string = ''): Observable<IBodyResult<T>>
  {
    return this.convertToBodyResult$(
      this.http.get<T[] | IBodyResult<T>>(
        `${environment.apiUrl}/${this.restUrl}/${concatUrl}`,
        {
          params
        }
      )
    );
  }

  // R => CRUD
  public read<T>(params: Record<string, any> = {}, concatUrl: string = ''): Observable<T[]> {
    return this.http.get<T[]>(
      `${environment.apiUrl}/${this.restUrl}/${concatUrl}`,
      {
        params
      }
      );
  }

  public readSingle<T>(params: Record<string, any> = {}, concatUrl: string = ''): Observable<T> {
    return this.http.get<T>(
      `${environment.apiUrl}/${this.restUrl}/${concatUrl}`,
      {
        params
      }
    );
  }


  public readById<T1= unknown , T2 extends string | undefined = undefined>(id: string | number, afterIdUrl ?: T2, params: Record<string, any> = {}): Observable<readByIdType<T , T1 , T2>>
  {
    return this.http.get<readByIdType<T , T1 , T2>>(`${environment.apiUrl}/${this.restUrl}/${id}/${afterIdUrl ?? ''}`,
    {
      params
    })
      .pipe(
        map(
          (data) => {
            return this.convertToBodyResult(data);
          }
        )
      ) as Observable<readByIdType<T , T1 , T2>>;
  }

  // U => CRUD
  public update(id: string | number, entity: Partial<T>, afterIdUrl = '', params: Record<string, any> = {}): Observable<unknown>
  {
    afterIdUrl = afterIdUrl && `/${afterIdUrl}`;
    id = id && `/${id}`;
    return this.http.put<unknown>(`${environment.apiUrl}/${this.restUrl}${id}${afterIdUrl}`, entity,
    {
      params
    });
  }

  public updateSingle(entity: Partial<T>, params: Record<string, any> = {}): Observable<T>
  {
    return this.http.put<T>(`${environment.apiUrl}/${this.restUrl}`, entity,
      {
        params
      });
  }

  // D => CRUD
  public delete(id: number | string, afterIdUrl = '', params: Record<string, any> = {}): Observable<unknown>
  {
    const rowId = id ?`/${id}`: ''
    return this.http.delete<unknown>(`${environment.apiUrl}/${this.restUrl}${rowId}/${afterIdUrl}`,
    {
      params
    });
  }

  protected convertToBodyResult$<T>(obs$: Observable<T[] | IBodyResult<T>>): Observable<IBodyResult<T>>
  {
    return obs$.pipe(
      map(
        (data) =>
          this.convertToBodyResult(data)
      ),
      map(
        (data) => data as IBodyResult<T>
      )
    );
  }

  public convertToBodyResult(data: unknown): convertToBodyResultType<typeof data>
  {
    return ((data instanceof Array) ?
      { items: data, totalCount: -1 } :
           data) as convertToBodyResultType<typeof data>;
  }

    /**
     *@param concatUrl Append url to
     * @returns Rest api url
     */
    public getRestUrl(concatUrl: string = ''): string
    {
      return `${this.restUrl}${concatUrl}`;
    }
    public createWithUrlFirst(concatUrl: string, entity: Partial<T>, params: Record<string, any> = {}): Observable<T> {
      return this.http.post<T>(
        `${environment.apiUrl}/${this.restUrl}/${concatUrl}`,
        entity,
        { params }
      );
    }
    public deleteWithUrlFirst(organizationId: string, cancelRuleId: string) {
      return this.http.delete(
        `${environment.apiUrl}/api/identity/organization-units/${organizationId}/cancel-rule`,
        {
          params: { CancelRuleId: cancelRuleId }
        }
      );
    }
}

