import { Observable, ReplaySubject, Subject } from 'rxjs';
import { IBodyResult } from '../../../interface/body-result/body-result.interface';


export interface IMoSelect {
  reloadData$?: Subject<unknown>;
  options$?: Observable<IBodyResult<IDynamicSelectItem>>;
  emptyFilterMessage?: string;
  items?: IDynamicSelectItem[];
  selectedItems?: IDynamicSelectItem[];
  errors?: Record<string, string>;
  floatLabel?: string;
  optionLabel?: string;
  requiredStar?: boolean;
  labelClass?: string;
  optionValue?: string;
  filter?: boolean;
  filterBy?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  style?: any;
  panelStyle?: any;
  styleClass?: string;
  panelStyleClass?: string;
  readonly?: boolean;
  required?: boolean;
  filterPlaceholder?: string;
  selectId?: string;
  autofocus?: boolean;
  resetFilterOnHide?: boolean;
  dropdownIcon?: string;
  autoDisplayFirst?: boolean;
  group?: boolean;
  showClear?: boolean;
  emptyMessage?: string;
  lazy?: boolean;
  virtualScroll?: boolean;
  virtualScrollItemSize?: number;
  filterMatchMode?: string;
  maxLength?: number;
  tooltip?: string;
  tooltipPosition?: string;
  tooltipPositionStyle?: string;
  tooltipStyleClass?: string;
  autofocusFilter?: boolean;
  useDefault?: boolean;
  loadingMode$?: Subject<boolean>;

  onClick?: ReplaySubject<unknown>;
  onChange?: ReplaySubject<unknown>;
  onFilter?: ReplaySubject<unknown>;
  onFocus?: ReplaySubject<unknown>;
  onBlur?: ReplaySubject<unknown>;
  onShow?: ReplaySubject<unknown>;
  onHide?: ReplaySubject<unknown>;
  onClear?: ReplaySubject<unknown>;
  onLazyLoad?: ReplaySubject<unknown>;
}

export interface IDynamicSelectItem {
  topic?: string;
  id?: string | number;
  bValue?: boolean;
  name?: string;
  disabled?:boolean;
  items?:IDynamicSelectItem[];
  value?:string;
  label?:string;
  isVirtual?:boolean;
  isDefault?:boolean;
}
