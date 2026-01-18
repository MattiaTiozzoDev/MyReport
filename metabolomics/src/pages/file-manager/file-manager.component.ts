import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FileReaderService } from '../../services/file-reader.service';
import { PdfService } from '../../services/file-export.service';
import { firstValueFrom, Subscription, take } from 'rxjs';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { StaticDataService } from '../../services/static-data.service';
import { IndexPageComponent } from '../../components/pdf-pages/index-page/index-page.component';
import { PresentationPageComponent } from '../../components/pdf-pages/presentation-page/presentation-page.component';
import { PdfContainerComponent } from '../pdf-container/pdf-container.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { NavbarComponent } from '../../components/shared/navbar/navbar.component';
import { CustomersDataService } from '../../services/customers-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantService } from '../../services/tenant.service';
import { TenantType } from '../../enums/tenant.enum';
import { ToastService } from '../../services/toast.service';
import { TitleCasePipe } from '@angular/common';

const EXCELL_TYPE = ['xlsx', 'xlsm', 'xls', 'csv'];

const HOMICA_FILENAME = ['HO_METABO'];

const VALSAMBRO_FILENAME = ['METABO'];

@Component({
  selector: 'metabolomics-file-manager',
  imports: [
    TranslateModule,
    TranslatePipe,
    PdfContainerComponent,
    TitleCasePipe,
  ],
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss',
})
export class FileManagerComponent implements OnInit, OnDestroy {
  public company: string;
  public tenantType = TenantType;
  public file: any;
  public folderPath: string = '';
  public inputFileName: string;
  public outputFileName = 'output.pdf';
  public isDragOver: boolean = false;
  public loadSubscription: Subscription | null;
  public dropLoadSubscription: Subscription | null;

  public loader = false;
  public isDownloading = false;
  public numberOfCustomers = 0;

  constructor(
    private readonly fileReaderService: FileReaderService,
    private pdfService: PdfService,
    public customersDataService: CustomersDataService,
    private route: ActivatedRoute,
    private tenantService: TenantService,
    private toastService: ToastService,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    let tenant = this.route.snapshot.paramMap.get('tenant');
    this.tenantService.tenant = TenantType[tenant];
    this.company = this.tenantService.tenant;
  }

  onFileSelected(event: Event) {
    this.loadSubscription = this.fileReaderService
      .generateJSON(event)
      .pipe()
      .subscribe((data) => {
        if (!this.isCorrectFilename(data.fileName)) {
          return;
        }
        this.file = data.json;
        this.inputFileName = data.fileName;
        this.customersDataService.setData(this.file);
      });
  }

  // Drag & drop
  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.loadFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragOver = false;
  }

  loadFile(file: File) {
    this.dropLoadSubscription = this.fileReaderService
      .generateJSONFromDrop(file)
      .pipe()
      .subscribe((data) => {
        if (!this.isCorrectFilename(data.fileName)) {
          return;
        }
        this.file = data.json;
        this.inputFileName = data.fileName;
        this.customersDataService.setData(this.file);
      });
  }

  async download() {
    try {
      this.folderPath = await this.pdfService.openExportFolder();
      this.loader = true;
      this.isDownloading = true;
    } catch (err) {
      console.error('Errore durante il download: ', err);
    }
    this.numberOfCustomers = this.customersDataService.customersData.length;
    for (let i = 0; i < this.numberOfCustomers; i++) {
      try {
        this.customersDataService.setCustomer();
        this.setOutputFileName();
        let customer = this.customersDataService.getCustomer();
        await firstValueFrom(this.zone.onStable);
        const filePath = await this.pdfService.exportElementById(
          'pdf-section',
          this.outputFileName,
        );
        if (i + 1 < this.numberOfCustomers) {
          this.customersDataService.changeCustomer(i + 1);
        } else {
          this.customersDataService.changeCustomer(0);
        }
      } catch (err) {
        console.error('Errore durante il download: ', err);
      }
    }
    if (this.numberOfCustomers > 0) {
      this.toastService.showMessage(
        'success',
        `I file sono stati salvati in ${this.folderPath}`,
      );
    } else {
      this.toastService.showMessage('error', 'Nessun cliente da processare.');
    }
    this.isDownloading = false;
    this.file = null;
    setTimeout(() => {
      this.loader = false;
      this.toastService.close();
    }, 3000);
  }

  private setOutputFileName() {
    let customer = this.customersDataService.getCustomer();
    if (this.company == this.tenantType.VALSAMBRO) {
      this.outputFileName = `${customer.name.replace(' ', '_')}_METABO.pdf`;
    } else {
      this.outputFileName = `${customer.orderId}.pdf`;
    }
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
    } else if (!this.isCorrectTentant(fileName)) {
      this.toastService.showMessage(
        'error',
        'Il file caricato non corrisponde al cliente selezionato. Verifica e riprova.',
      );
      return false;
    }
    return true;
  }

  private getFileName(fileName: string): string {
    const NAME = fileName.split('.')[0];
    return NAME;
  }

  private isExcellType(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return EXCELL_TYPE.includes(extension || '');
  }

  private isCorrectName(fileName: string): boolean {
    const name = this.getFileName(fileName);
    return (
      HOMICA_FILENAME.some((prefix) => name.startsWith(prefix)) ||
      VALSAMBRO_FILENAME.some((prefix) => name.startsWith(prefix))
    );
  }

  private isCorrectTentant(fileName: string): boolean {
    const base = this.getFileName(fileName);

    if (this.company === this.tenantType.VALSAMBRO) {
      return VALSAMBRO_FILENAME.some((prefix) => base.startsWith(prefix));
    }

    if (this.company === this.tenantType.HOMICA) {
      return HOMICA_FILENAME.some((prefix) => base.startsWith(prefix));
    }

    return false;
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.dropLoadSubscription?.unsubscribe();
  }
}
