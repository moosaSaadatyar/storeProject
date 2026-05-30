import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';


import { MoFileUploaderService } from './mo-file-uploader.service';
import { IFileContainer, IFileUploaderConfig } from './mo-file-uploader.interface';
import swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotifyService } from 'mo-ui/core/service/notif/notif.service';
import { generateToken } from 'mo-ui/core/static/helpers/generate-token';
import { CONFIRM_CONFIG } from 'mo-ui/core/confirm-config/confirm-config.const';


@Component({
  selector: 'mo-file-uploader',
  templateUrl: './mo-file-uploader.component.html',
  styleUrls: ['./mo-file-uploader.component.css'],
  providers: [MoFileUploaderService],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    TranslateModule
  ],
})
export class MoFileUploaderComponent implements OnInit {
  /**
   * @example   upConfig: IFileUploaderConfig = {
    accept: FileTypes.PNG,
    selectMode: 'multiple',
  }
   */
  public fileUploaderConfig!: IFileUploaderConfig;

  public selectedFiles?: IFileContainer[] = [];

  public uploadResult?: any[] = [];

  @Input() multiSelect?: boolean;

  private uploadStarted = false;

  public imageSrc: string | ArrayBuffer;

  public isImageFile: boolean = false;

  //INJECTIONS

  private _confirmConfig = inject(generateToken(CONFIRM_CONFIG));

  private activeModal = inject(NgbActiveModal);

  private _bhrFileUploaderService = inject(MoFileUploaderService);

  private _notify = inject(NotifyService);

  private translateService = inject(TranslateService);

  public ngOnInit(): void {
  }

  /**
   * @argument event
   * @description Convert selected files to array of IFileContainer
   * @returns IFileContainer[]
   */
  public onFileSelected(event: any): void {
    this.selectedFiles = this._bhrFileUploaderService.getFileContainer(event.target.files);
    const file = event.target.files[0];
    this.isImageFile = (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => this.imageSrc = reader.result;

    reader.readAsDataURL(file);
  }

  public startUploadFiles(i: number = this.selectedFiles.length - 1): void {
    this.uploadStarted = true;
    if (i >= 0) {
      this.selectedFiles[i].spinner = 1;
      this.registerFile(this.selectedFiles[i]).subscribe(resultOfUpload => {
        this.uploadResult.push(resultOfUpload);
        this.selectedFiles[i].spinner = 2;
        setTimeout(() => {
          this.selectedFiles.pop();
          if (this.selectedFiles.length <= i) {
            this.startUploadFiles(--i);
          }
        }, 900);
      });
    }
    if (this.selectedFiles.length === 0) {
      this.uploadStarted = false;
      this.closeFileUploaderWithResult(this.uploadResult);
    }
  }

  /**
   * @argument IFileContainer
   * @description Remove item from selectedFiles list
   * @returns void
   */
  public removeFromList(fileContainer: IFileContainer): void {
    this._bhrFileUploaderService.removeFileFromList(this.selectedFiles, fileContainer);
  }

  /**
   * @description Close file uploader modal with result as null
   * @returns void
   */
  public closeFileUploader(): void {
    if (this.uploadStarted == true) {
      swal.fire({
        ...this._confirmConfig(),
        text: `${this.translateService.instant('DELETE_FILE_ON_CLOSE_MODAL_WARNING')} . ${this.translateService.instant('CLOSE_MODAL_WARNING')}`
      }).then(
        ({ isConfirmed }) => {
          if (isConfirmed) {
            this.activeModal.close();
          }
        }
      );
    } else {
      this.activeModal.close();
    }

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  onChange: Function = () => {
  };

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    let files: File[] = [];
    const dataFiles = event.dataTransfer.files;

    if (this.multiSelect == false) {
      if (dataFiles.length > 1) {
        this._notify.warning('لطفا فقط یک مورد را انتخاب نمایید');
      } else {
        files.push(dataFiles[0]);
        this.selectedFiles = this._bhrFileUploaderService.getFileContainer(files);
      }
    } else {
      for (let i = 0; i < dataFiles.length; i++) {
        files.push(dataFiles[i]);
      }
      this.selectedFiles = this._bhrFileUploaderService.getFileContainer(files);
    }
  }

  /**
   * @description Close file uploader modal with any result
   * @returns void
   */
  private closeFileUploaderWithResult(resultOfModal: any): void {
    this.activeModal.close(resultOfModal);
  }

  private registerFile(fileContainer: IFileContainer): Observable<boolean> {
    const formData = new FormData();
    formData.append('FileContainerName', 'tmp');
    formData.append('FileType', '2');
    formData.append('File', null);
    formData.set('File', fileContainer.file);

    return this._bhrFileUploaderService.UploadFile(formData);
  }

  get showSelectedFiles() {
    return this.selectedFiles?.length > 0;
  }

  get disableUploadBtn() {
    return !this.showSelectedFiles || this.uploadStarted;
  }

  get isImage() {
    return this.isImageFile;
  }
}
