import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CabinetApiService } from './api.service';
import { IPagedResult, IUploadedImage } from '../../core/interface/api.interface';
import { IProject, IProjectFilterParams } from '../../core/interface/project.interface';

/**
 * سرویس پروژه / نمونه‌کار — عمومی و مدیریتی
 */
@Injectable({ providedIn: 'root' })
export class ProjectService extends CabinetApiService {
  /* ================= عمومی ================= */

  list(params: IProjectFilterParams = {}): Observable<IPagedResult<IProject>> {
    return this.get<IPagedResult<IProject>>('/projects', params as Record<string, string | number | boolean>);
  }

  getById(id: string): Observable<IProject> {
    return this.get<IProject>(`/projects/${id}`);
  }

  /* ================= مدیریتی ================= */

  adminList(params: { q?: string; category?: string; isPublished?: boolean; page?: number; limit?: number } = {}): Observable<IPagedResult<IProject>> {
    return this.get<IPagedResult<IProject>>('/admin/projects', params);
  }

  adminGetById(id: string): Observable<IProject> {
    return this.get<IProject>(`/admin/projects/${id}`);
  }

  adminCreate(formData: FormData): Observable<IProject> {
    return this.post<IProject>('/admin/projects', formData);
  }

  adminUpdate(id: string, formData: FormData): Observable<IProject> {
    return this.put<IProject>(`/admin/projects/${id}`, formData);
  }

  adminDelete(id: string): Observable<null> {
    return this.delete<null>(`/admin/projects/${id}`);
  }

  /* ================= آپلود ================= */

  uploadImages(files: File[], dir = 'projects'): Observable<IUploadedImage[]> {
    const formData = new FormData();
    formData.append('_uploadDir', dir);
    files.forEach((file) => formData.append('files', file));
    return this.post<IUploadedImage[]>('/admin/upload', formData);
  }
}
