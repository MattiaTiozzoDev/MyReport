import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StaticDataService } from '../services/static-data.service';
import { NavbarComponent } from '../components/shared/navbar/navbar.component';
import { FooterComponent } from '../components/shared/footer/footer.component';
import { CustomersDataService } from '../services/customers-data.service';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastComponent } from '../components/shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private readonly staticDataService: StaticDataService,
    private customersDataService: CustomersDataService,
  ) {
    this.translate.setFallbackLang('it');
    this.translate.use('it');
  }

  ngOnInit(): void {
    // Carica solo i dati necessari (example)
    this.staticDataService
      .loadUrogenExample()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (example) => {
          this.customersDataService.setData(example);
        },
        error: (error) => {
          console.error('Errore nel caricamento dei dati:', error);
        },
      });
  }

  ngOnDestroy(): void {
    // Completa il subject per unsubscribe automatico da tutte le observable
    this.destroy$.next();
    this.destroy$.complete();
  }
}
