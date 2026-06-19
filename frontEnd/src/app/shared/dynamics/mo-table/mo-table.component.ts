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
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../public/envierments/envierments';
import {
  MoTableActionEvent,
  MoTableActionType,
  MoTableApiConfig,
  MoTableColumn,
  MoTableConfig,
} from './mo-table-interFace';





@Component({
  selector: 'mo-table',
  imports: [CommonModule, TableModule, TranslateModule],
  templateUrl: './mo-table.component.html',
  styleUrl: './mo-table.component.css',
})
export class MoTableComponent implements OnChanges {
  @Input() config: MoTableConfig;
  @Input() data: any[] | null = null;
  @Input() reloadData: unknown;

  @Output() rowClick = new EventEmitter<any>();
  @Output() dataLoaded = new EventEmitter<any[]>();
  @Output() loadError = new EventEmitter<unknown>();
  @Output() actionClick = new EventEmitter<MoTableActionEvent>();

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

    if (changes['reloadData'] && !changes['reloadData'].firstChange) {
      this.reload();
    }
  }

  public reload(): void {
    this.loadFromApi();
  }

  public addRow(row: any, position: 'start' | 'end' = 'start'): void {
    if (!row) {
      return;
    }

    const dataKey = this.config?.dataKey;
    const rowKey = dataKey ? this.getByPath(row, dataKey) : undefined;
    const currentRows = rowKey
      ? this.rows.filter((item) => this.getByPath(item, dataKey) !== rowKey)
      : this.rows;
    const wasExists = rowKey ? currentRows.length !== this.rows.length : false;

    this.rows = position === 'start' ? [row, ...currentRows] : [...currentRows, row];
    this.totalRecords = wasExists ? this.totalRecords : this.totalRecords + 1;
    this.error = null;
    this.dataLoaded.emit(this.rows);
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
    return this.config?.emptyMessage ?? 'NO_CONTENT';
  }

  public get loadingMessage(): string {
    return this.config?.loadingMessage ?? 'MO_TABLE_LOADING';
  }

  public get errorMessage(): string {
    return this.config?.errorMessage ?? 'MO_TABLE_LOAD_ERROR';
  }

  public get actionsVisible(): boolean {
    return this.config?.actions?.show ?? false;
  }

  public get actionsHeader(): string {
    return this.config?.actions?.header ?? 'ACTIONS';
  }

  public get actionsWidth(): string {
    return this.config?.actions?.width ?? '10rem';
  }

  public get showViewAction(): boolean {
    return this.config?.actions?.view ?? true;
  }

  public get showEditAction(): boolean {
    return this.config?.actions?.edit ?? true;
  }

  public get showDeleteAction(): boolean {
    return this.config?.actions?.delete ?? true;
  }

  public cellValue(row: any, column: MoTableColumn): string | number {
    const value = column.valueGetter
      ? column.valueGetter(row, column)
      : this.getByPath(row, column.field);

    return column.formatter ? column.formatter(value, row, column) : (value ?? '');
  }

  public cellTranslateKey(row: any, column: MoTableColumn): string {
    return String(this.cellValue(row, column));
  }

  public onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  public onActionClick(event: MouseEvent, action: MoTableActionType, row: any, rowIndex: number): void {
    event.stopPropagation();
    this.actionClick.emit({ action, row, rowIndex });
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
          const totalRecords = this.extractTotal(response, api.totalPath, loadedRows.length);
          this.setRows(loadedRows, totalRecords);
          this.dataLoaded.emit(loadedRows);
        },
        error: (error) => {
          this.error = this.errorMessage;
          this.setRows([], 0);
          this.loadError.emit(error);
        },
      });
  }

  private setRows(rows: any[], totalRecords?: number): void {
    this.rows = Array.isArray(rows) ? rows : [];
    this.totalRecords = totalRecords ?? this.rows.length;
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
