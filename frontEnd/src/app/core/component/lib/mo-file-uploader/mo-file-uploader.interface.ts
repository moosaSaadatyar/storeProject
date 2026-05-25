
/**
 * @example   upConfig: IFileUploaderConfig = {
    accept: FileTypes.PNG,
    selectMode: 'multiple',
  }
 */
export interface IFileUploaderConfig {
  selectMode?: string;
  required?: boolean;
  accept: string;
  maxFileSize?: number;
  errors?: Record<string, string>;
}

export interface IFileContainer {
  file: File;
  spinner: number;
}

export interface IFileInformation{
  code?: string;
  name?: string;
  downloadUrl?: string;
}
