import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileReaderService } from '../../services/file-reader.service';
import { PdfService } from '../../services/file-export.service';
import { Subscription, take } from 'rxjs';
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
  public file: any;
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
    private toastService: ToastService
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
        this.file = data.json;
        this.inputFileName = data.fileName;
        this.customersDataService.setData(this.file);
      });
  }

  private setOutputFileName() {
    let customer = this.customersDataService.getCustomer();
    this.outputFileName =
      customer.accNumber + '-' + customer.name.replace(' ', '_') + '.pdf';
  }

  async download() {
    this.numberOfCustomers = this.customersDataService.customersData.length;
    for (let i = 0; i < this.numberOfCustomers; i++) {
      this.customersDataService.setCustomer();
      this.setOutputFileName();
      this.customersDataService.changeCustomer();
      try {
        const path = await this.pdfService.exportElementById(
          'pdf-section',
          this.outputFileName
        );
        this.loader = true;
        this.isDownloading = true;
      } catch (err) {
        console.error('Errore durante il download: ', err);
      }
    }
    this.isDownloading = false;
    setTimeout(() => {
      this.loader = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.dropLoadSubscription?.unsubscribe();
  }
}
