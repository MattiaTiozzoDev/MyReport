import { Injectable } from '@angular/core';
import { FileType } from '../enums/file-type.enum';

@Injectable({
  providedIn: 'root',
})
export class FileTypeService {
  private type: FileType = FileType.IGGINT;

  get fileType(): FileType {
    return this.type;
  }

  set fileType(value: FileType) {
    this.type = value;
  }
}
