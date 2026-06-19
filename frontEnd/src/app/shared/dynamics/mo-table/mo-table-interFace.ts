
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
  actions?: MoTableActionsConfig;
}

export type MoTableAlign = 'left' | 'center' | 'right';
export type MoTableActionType = 'view' | 'edit' | 'delete';

export interface MoTableColumn {
  field: string;
  header: string;
  width?: string;
  align?: MoTableAlign;
  sortable?: boolean;
  translateValue?: boolean;
  suffix?: string;
  valueGetter?: (row: any, column: MoTableColumn) => unknown;
  formatter?: (value: unknown, row: any, column: MoTableColumn) => string | number;
}

export interface MoTableActionsConfig {
  show?: boolean;
  header?: string;
  width?: string;
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export interface MoTableActionEvent {
  action: MoTableActionType;
  row: any;
  rowIndex: number;
}
