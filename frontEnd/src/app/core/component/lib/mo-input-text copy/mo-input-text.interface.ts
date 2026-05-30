
export interface IInputTextConfigParent
{
  inputId: string;
  errors?: Record<string, string>;
  inputClass?: string;
  labelClass?: string;
  containerClass?: string;
  minLength?: number;
  maxLength?: number;
  isPassword?: boolean;
  requiredStar?: boolean;
  readonly?:boolean;
  placeholder?: string;
}

export interface IInputTextLabelRequired extends IInputTextConfigParent
{
  label: string;
  aerieLabel:string;
}

export interface IInputTextFloatLabelRequired extends IInputTextConfigParent
{
  floatLabel: string;
}

export type IInputTextConfig = XOR<IInputTextFloatLabelRequired , IInputTextLabelRequired > ;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
