import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

declare global {
  interface Window {
    electronAPI?: {
      exportPDF: (payload: { htmlContent: string; fileName: string }) => Promise<string>;
      openExportFolder: () => Promise<string[]>;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private toastService: ToastService) {}

  /**
   * Esporta HTML in PDF tramite Electron
   * @param htmlContent stringa HTML completa
   * @param fileName nome del file PDF
   */
  async exportHtml(htmlContent: string, fileName: string): Promise<string> {
    if (!window.electronAPI?.exportPDF) {
      const errorMsg = 'Electron API non disponibile';
      this.toastService.showMessage('error', errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const filePath = await window.electronAPI.exportPDF({
        htmlContent,
        fileName,
      });
      this.toastService.showMessage('success', `PDF salvato: ${fileName}`);
      return filePath;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Errore nella generazione del PDF';
      this.toastService.showMessage('error', errorMsg);
      console.error('Errore generazione PDF:', error);
      throw error;
    }
  }

  /**
   * Apre il dialog per selezionare la cartella di export
   */
  async openExportFolder(): Promise<string[]> {
    if (!window.electronAPI?.openExportFolder) {
      const errorMsg = 'Electron API non disponibile';
      this.toastService.showMessage('error', errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const filePaths = await window.electronAPI.openExportFolder();
      return filePaths;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Errore nella selezione della cartella';
      this.toastService.showMessage('error', errorMsg);
      console.error('Errore selezione cartella:', error);
      throw error;
    }
  }

  /**
   * Esporta il contenuto di un elemento HTML (anche nascosto)
   * @param elementId id dell'elemento da esportare
   * @param fileName nome del file PDF
   */
  async exportElementById(
    elementId: string,
    fileName: string,
  ): Promise<string> {
    const element = document.getElementById(elementId);
    if (!element) {
      const errorMsg = `Elemento con id "${elementId}" non trovato`;
      this.toastService.showMessage('error', errorMsg);
      throw new Error(errorMsg);
    }

    // Clona l'elemento
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.display = 'block'; // visibile per il PDF

    // Recupera tutti gli stili (style tags) dal document
    let allStyles = '';
    document.querySelectorAll('style').forEach((style) => {
      allStyles += style.outerHTML;
    });

    // Recupera anche i link ai CSS esterni (se necessari)
    let cssLinks = '';
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const href = (link as HTMLLinkElement).href;
      if (href) {
        cssLinks += `<link rel="stylesheet" href="${href}">`;
      }
    });

    // Aggiungi stili globali per assicurare che Montserrat sia usato
    const globalStyles = `
      <style>
        html, body {
          font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
          margin: 0;
          padding: 0;
        }
        * {
          font-family: inherit;
        }
      </style>
    `;

    // Costruisce l'HTML completo da passare a Electron
    const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${cssLinks}
        ${allStyles}
        ${globalStyles}
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
