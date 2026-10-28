import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CabinetApiService } from './api.service';
import { IPagedResult } from '../../core/interface/api.interface';
import { ICategory } from '../../core/interface/category.interface';

/**
 * سرویس دسته‌بندی‌ها
 */
@Injectable({ providedIn: 'root' })
export class CategoryService extends CabinetApiService {
  /* عمومی */
  list(): Observable<ICategory[]> {
    return this.get<ICategory[]>('/categories');
  }

  /* مدیریتی */
  adminList(params: { page?: number; limit?: number } = {}): Observable<IPagedResult<ICategory>> {
    return this.get<IPagedResult<ICategory>>('/admin/categories', params);
  }

  adminCreate(formData: FormData): Observable<ICategory> {
    return this.post<ICategory>('/admin/categories', formData);
  }

  adminUpdate(id: string, formData: FormData): Observable<ICategory> {
    return this.put<ICategory>(`/admin/categories/${id}`, formData);
  }

  adminDelete(id: string): Observable<null> {
    return this.delete<null>(`/admin/categories/${id}`);
  }
}
