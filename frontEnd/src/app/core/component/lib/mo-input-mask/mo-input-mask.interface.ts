import { XOR } from "../mo-input-text/mo-input-text.interface";

export interface IInputMaskConfigParent
{
  mask: string;
  inputId: string;
  errors?: Record<string, string>;
  inputClass?: string;
  labelClass?: string;
  containerClass?: string;
  requiredStar?: boolean;
  readonly?:boolean;
  startGroup?: IConCatGroup[];
  endGroup?: IConCatGroup[];
  minlength?: number;
  maxlength?: number
}

export interface IInputMaskLabelRequired extends IInputMaskConfigParent
{
  label: string;
}

export interface IInputMaskFloatLabelRequired extends IInputMaskConfigParent
{
  floatLabel: string;
}

export type IInputMaskConfig = XOR<IInputMaskFloatLabelRequired , IInputMaskLabelRequired > ;

export interface IConCatGroup
{
  startIcon?: string;
  text?: string;
  endIcon?: string;
}
