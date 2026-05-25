import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// import { environment } from 'environment/environment';

import { IFileContainer } from './mo-file-uploader.interface';


@Injectable()
export class BhrFileUploaderService {

  private fileContainerList: IFileContainer[] = [];

  constructor(
    protected http: HttpClient
  ) {}


  /**
   * @argument files:File[]
   * @description Get array of files and return new array of IFileContainer
   * @returns IFileContainer
   */
  public getFileContainer(files: File[]): IFileContainer[] {
    if (files.length === 0) {
      return null;
    }
    if (files.length > 1) {
      let tempArray = Array.from(files).map(f => {
        let temp: IFileContainer = { file: f, spinner: 0 };
        return temp;
      });
      this.fileContainerList = [...this.fileContainerList,...tempArray]; 
      return this.fileContainerList;
    }

    this.fileContainerList.push({ file: files[0], spinner: 0 });
    return this.fileContainerList;
  }


  /**
   * @argument IFileContainer
   * @description Remove item from selectedFiles list
   * @returns void
   */
  removeFileFromList(files: IFileContainer[],file:IFileContainer): void {

    let indexOfFile = files.findIndex(f => f.file === file.file);

    if (indexOfFile !== undefined) {
      files.splice(indexOfFile, 1);
    }
    return;
  }

  UploadFile(fileData:FormData):Observable<any> {
    return null
    // this.http.post(`${environment.apis.default.url}/api/file-management/file`, fileData);
  }
}
