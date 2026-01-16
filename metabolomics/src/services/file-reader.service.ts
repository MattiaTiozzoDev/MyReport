import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { JsonFile } from '../types/files.type';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  constructor(private toastService: ToastService) {}

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
}
