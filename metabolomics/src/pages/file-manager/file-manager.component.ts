import { Component, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'metabolomics-file-manager',
  imports: [TranslateModule, TranslatePipe, PdfContainerComponent],
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss',
})
export class FileManagerComponent implements OnDestroy {
  public company: string = 'Val Sambro';
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
    public customersDataService: CustomersDataService
  ) {}

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
    for (let i = 1; i < this.numberOfCustomers - 1; i++) {
      this.customersDataService.setCustomer();
      this.setOutputFileName();
      try {
        const path = await this.pdfService.exportElementById(
          'pdf-section',
          this.outputFileName
        );
        this.loader = true;
        this.isDownloading = true;
      } catch (err) {
        alert('Errore: ' + err);
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
