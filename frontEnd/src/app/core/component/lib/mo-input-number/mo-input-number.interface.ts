import { XOR } from "../mo-input-text/mo-input-text.interface";

export interface IInputNumberConfigParent {
  inputId: string;
  errors?: Record<string, string>;
  inputClass?: string;
  labelClass?: string;
  requiredStar?: boolean;
  minLength?: number;
  maxLength?: number;
  containerClass?: string;
  placeholder?: string;
  readonly?:boolean;
  disabled?: boolean;
  maxValue?: number;
  moneySplitter?: boolean
}

export interface IInputNumberLabelRequired extends IInputNumberConfigParent {
  label: string;
  aerieLabel:string;
}

export interface IInputNumberFloatLabelRequired extends IInputNumberConfigParent {
  floatLabel: string;
}

export type IInputNumberConfig = XOR<IInputNumberFloatLabelRequired, IInputNumberLabelRequired>;
