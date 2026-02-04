import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private toastService: ToastService) {}
  /**
   * Esporta HTML in PDF tramite Electron
   * @param htmlContent stringa HTML completa
   */
  async exportHtml(htmlContent: string, fileName: string): Promise<string> {
    if (!(window as any).electronAPI?.exportPDF) {
      throw new Error('Electron API non disponibile');
    }

    try {
      const filePath = await (window as any).electronAPI.exportPDF({
        htmlContent,
        fileName,
      });
      return filePath;
    } catch (error) {
      this.toastService.showMessage(
        'error',
        'Errore generazione PDF, file già esistente',
      );
      console.error('Errore generazione PDF:', error);
      throw error;
    }
  }

  async openExportFolder(): Promise<string> {
    if (!(window as any).electronAPI?.openExportFolder) {
      throw new Error('Electron API non disponibile');
    }
    try {
      const filePath = await (window as any).electronAPI.openExportFolder();
      return filePath;
    } catch (error) {
      console.error('Errore generazione PDF:', error);
      throw error;
    }
  }

  /**
   * Esporta il contenuto di un elemento HTML (anche nascosto)
   * @param elementId id dell'elemento
   */
  async exportElementById(
    elementId: string,
    fileName: string,
  ): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Elemento con id "${elementId}" non trovato`);

    // Clona il div invisibile
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.display = 'block'; // visibile solo per il PDF

    // Recupera tutti gli stili in linea e dei componenti Angular
    let allStyles = '';
    document.querySelectorAll('style').forEach((style) => {
      allStyles += style.outerHTML;
    });

    // Costruisce l'HTML completo da passare a Electron
    const fullHtml = `
    <html>
      <head>
        <meta charset="UTF-8">
        ${allStyles}
      </head>
      <body>
        ${clone.outerHTML}
      </body>
    </html>
  `;

    // Passa il contenuto HTML al servizio Electron
    return this.exportHtml(fullHtml, fileName);
  }
}
