import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FileReaderService } from '../../services/file-reader.service';
import { PdfService } from '../../services/file-export.service';
import { firstValueFrom, Subscription, take } from 'rxjs';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
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
import { FileType } from '../../enums/file-type.enum';
import {
  VALSAMBRO_FILENAME,
  HOMICA_FILENAME,
  EXCELL_TYPE,
} from '../../configs/constants.utils';
import { FileTypeService } from '../../services/file-type.service';

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
export class FileManagerComponent implements OnDestroy {
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
    private fileTypeService: FileTypeService,
    private toastService: ToastService,
    private zone: NgZone,
    private translateService: TranslateService,
  ) {}

  public setLang(customer: any) {
    if (customer.available != undefined) {
      this.translateService.use(customer.available === 1 ? 'en' : 'it');
    } else {
      this.translateService.use('it');
    }
  }

  onFileSelected(event: Event) {
    this.loadSubscription = this.fileReaderService
      .generateJSON(event)
      .pipe()
      .subscribe((data) => {
        this.file = data.json;
        this.inputFileName = data.fileName;
        this.customersDataService.setData(this.file);
        let customer = this.customersDataService.getCustomer();
        this.setLang(customer);
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
        this.file = data.json;
        this.inputFileName = data.fileName;
        this.customersDataService.setData(this.file);
        let customer = this.customersDataService.getCustomer();
        this.setLang(customer);
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
        this.setLang(customer);
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
    if (this.tenantService.tenant == this.tenantType.VALSAMBRO) {
      this.outputFileName = `${customer.name.replace(' ', '_')}_${this.fileTypeService.fileType}.pdf`;
    } else {
      this.outputFileName = `${customer.orderId}.pdf`;
    }
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.dropLoadSubscription?.unsubscribe();
  }
}
