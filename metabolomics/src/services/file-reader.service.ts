import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { JsonFile } from '../types/files.type';
import { ToastService } from './toast.service';
import {
  EXCELL_TYPE,
  HOMICA_FILENAME,
  VALSAMBRO_FILENAME,
} from '../configs/constants.utils';
import { TenantType } from '../enums/tenant.enum';
import { FileType } from '../enums/file-type.enum';
import { TenantService } from './tenant.service';
import { FileTypeService } from './file-type.service';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  public tenantType = TenantType;

  constructor(
    private toastService: ToastService,
    private tenantService: TenantService,
    private fileTypeService: FileTypeService,
  ) {}

  generateJSON(event: Event): Observable<JsonFile> {
    return new Observable((observer) => {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) {
        this.toastService.showMessage('error', 'Nessun file selezionato');
        observer.error('Nessun file selezionato');
        return;
      }

      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });

          //const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets['Calcoli'];

          const fileName = file.name;
          if (!this.isCorrectFilename(fileName)) {
            observer.error('Nome del file non valido');
            return;
          }
          this.setTenant(fileName);
          this.setFileType(fileName);
          const json = XLSX.utils.sheet_to_json(sheet, { defval: null });

          observer.next({ json, fileName });
          observer.complete();
        } catch (err) {
          observer.error(err);
        }
      };

      reader.onerror = () => observer.error(reader.error);

      reader.readAsArrayBuffer(file);
    });
  }

  generateJSONFromDrop(file: File): Observable<JsonFile> {
    return new Observable((observer) => {
      if (!file) {
        this.toastService.showMessage('error', 'Nessun file selezionato');
        observer.error('Nessun file selezionato');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });

          //const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets['Calcoli'];

          const fileName = file.name;
          if (!this.isCorrectFilename(fileName)) {
            observer.error('Nome del file non valido');
            return;
          }
          this.setTenant(fileName);
          this.setFileType(fileName);
          const json = XLSX.utils.sheet_to_json(sheet, { defval: null });
          observer.next({ json, fileName });
          observer.complete();
        } catch (err) {
          observer.error(err);
        }
      };

      reader.onerror = () => observer.error(reader.error);

      reader.readAsArrayBuffer(file);
    });
  }

  isCorrectFilename(fileName: string): boolean {
    if (!this.isExcellType(fileName)) {
      this.toastService.showMessage(
        'error',
        'Tipo di file non valido. Carica un file Excel.',
      );
      return false;
    } else if (!this.isCorrectName(fileName)) {
      this.toastService.showMessage(
        'error',
        'Nome del file non valido. Verifica il nome del file e riprova.',
      );
      return false;
    }
    return true;
  }

  private getFileName(fileName: string): string {
    const NAME = fileName.split('.')[0];
    return NAME;
  }

  private setTenant(fileName: string): void {
    if (VALSAMBRO_FILENAME.some((prefix) => fileName.startsWith(prefix))) {
      this.tenantService.tenant = this.tenantType.VALSAMBRO;
    }

    if (HOMICA_FILENAME.some((prefix) => fileName.startsWith(prefix))) {
      this.tenantService.tenant = this.tenantType.HOMICA;
    }
  }

  private setFileType(fileName: string): void {
    const name = fileName.split('.')[0];
    const key = name.startsWith('HO_') ? name.slice(3, 9) : name.slice(0, 6);
    this.fileTypeService.fileType = FileType[key] ?? null;
  }

  private isCorrectName(fileName: string): boolean {
    const name = this.getFileName(fileName);
    return (
      HOMICA_FILENAME.some((prefix) => name.startsWith(prefix)) ||
      VALSAMBRO_FILENAME.some((prefix) => name.startsWith(prefix))
    );
  }

  private isExcellType(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return EXCELL_TYPE.includes(extension || '');
  }
}
