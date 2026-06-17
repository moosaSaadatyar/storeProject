import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { environment } from '../../../../../public/envierments/envierments';

export type MoTableAlign = 'left' | 'center' | 'right';

export interface MoTableColumn {
  field: string;
  header: string;
  width?: string;
  align?: MoTableAlign;
  sortable?: boolean;
  valueGetter?: (row: any, column: MoTableColumn) => unknown;
  formatter?: (value: unknown, row: any, column: MoTableColumn) => string | number;
}

export interface MoTableApiConfig {
  url: string;
  method?: 'GET';
  params?: Record<string, string | number | boolean>;
  dataPath?: string;
  totalPath?: string;
  useEnvironmentApiUrl?: boolean;
  autoLoad?: boolean;
}

export interface MoTableConfig {
  columns: MoTableColumn[];
  api?: string | MoTableApiConfig;
  data?: any[];
  tableStyle?: Record<string, string>;
  styleClass?: string;
  dataKey?: string;
  paginator?: boolean;
  rows?: number;
  rowsPerPageOptions?: number[];
  emptyMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  showGridlines?: boolean;
  stripedRows?: boolean;
  responsiveLayout?: 'scroll' | 'stack';
}

@Component({
  selector: 'mo-table',
  imports: [CommonModule, TableModule],
  templateUrl: './mo-table.component.html',
  styleUrl: './mo-table.component.css',
})
export class MoTableComponent implements OnChanges {
  @Input() config: MoTableConfig;
  @Input() data: any[] | null = null;

  @Output() rowClick = new EventEmitter<any>();
  @Output() dataLoaded = new EventEmitter<any[]>();
  @Output() loadError = new EventEmitter<unknown>();

  private http = inject(HttpClient);

  public rows: any[] = [];
  public loading = false;
  public error: string | null = null;
  public totalRecords = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.setRows(this.data);
      return;
    }

    if (changes['config']) {
      this.initTable();
    }
  }

  public reload(): void {
    this.loadFromApi();
  }

  public get columns(): MoTableColumn[] {
    return this.config?.columns ?? [];
  }

  public get tableStyle(): Record<string, string> {
    return this.config?.tableStyle ?? { 'min-width': '50rem' };
  }

  public get styleClass(): string {
    return this.config?.styleClass ?? '';
  }

  public get paginator(): boolean {
    return this.config?.paginator ?? false;
  }

  public get pageRows(): number {
    return this.config?.rows ?? 10;
  }

  public get rowsPerPageOptions(): number[] {
    return this.config?.rowsPerPageOptions ?? [10, 25, 50];
  }

  public get emptyMessage(): string {
    return this.config?.emptyMessage ?? 'داده ای برای نمایش وجود ندارد';
  }

  public get loadingMessage(): string {
    return this.config?.loadingMessage ?? 'در حال دریافت اطلاعات...';
  }

  public get errorMessage(): string {
    return this.config?.errorMessage ?? 'خطا در دریافت اطلاعات';
  }

  public cellValue(row: any, column: MoTableColumn): string | number {
    const value = column.valueGetter
      ? column.valueGetter(row, column)
      : this.getByPath(row, column.field);

    return column.formatter ? column.formatter(value, row, column) : (value ?? '');
  }

  public onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  public trackColumn(_index: number, column: MoTableColumn): string {
    return column.field;
  }

  private initTable(): void {
    this.error = null;

    if (!this.config) {
      this.setRows([]);
      return;
    }

    if (this.data) {
      this.setRows(this.data);
      return;
    }

    if (this.config.data) {
      this.setRows(this.config.data);
      return;
    }

    const api = this.normalizeApiConfig(this.config.api);
    if (!api || api.autoLoad === false) {
      this.setRows([]);
      return;
    }

    this.loadFromApi();
  }

  private loadFromApi(): void {
    const api = this.normalizeApiConfig(this.config?.api);
    if (!api) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.http
      .get<unknown>(this.buildUrl(api), { params: api.params ?? {} })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          const loadedRows = this.extractRows(response, api.dataPath);
          this.totalRecords = this.extractTotal(response, api.totalPath, loadedRows.length);
          this.setRows(loadedRows);
          this.dataLoaded.emit(loadedRows);
        },
        error: (error) => {
          this.error = this.errorMessage;
          this.setRows([]);
          this.loadError.emit(error);
        },
      });
  }

  private setRows(rows: any[]): void {
    this.rows = Array.isArray(rows) ? rows : [];
    this.totalRecords = this.totalRecords || this.rows.length;
  }

  private normalizeApiConfig(api?: string | MoTableApiConfig): MoTableApiConfig | null {
    if (!api) {
      return null;
    }

    return typeof api === 'string' ? { url: api, method: 'GET' } : { method: 'GET', ...api };
  }

  private buildUrl(api: MoTableApiConfig): string {
    if (/^https?:\/\//i.test(api.url) || api.useEnvironmentApiUrl === false) {
      return api.url;
    }

    return `${environment.apiUrl}/${api.url.replace(/^\/+/, '')}`;
  }

  private extractRows(response: unknown, dataPath?: string): any[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const body = response as Record<string, unknown>;
    const data = dataPath ? this.getByPath(body, dataPath) : body['items'] ?? body['data'] ?? body['products'];

    return Array.isArray(data) ? data : [];
  }

  private extractTotal(response: unknown, totalPath: string | undefined, fallback: number): number {
    if (!response || typeof response !== 'object') {
      return fallback;
    }

    const body = response as Record<string, unknown>;
    const total = totalPath ? this.getByPath(body, totalPath) : body['totalCount'] ?? body['total'];

    return typeof total === 'number' ? total : fallback;
  }

  private getByPath(source: any, path: string): any {
    return path.split('.').reduce((value, key) => value?.[key], source);
  }

}
