import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StaticDataService } from '../services/static-data.service';
import { NavbarComponent } from '../components/shared/navbar/navbar.component';
import { FooterComponent } from '../components/shared/footer/footer.component';
import { CustomersDataService } from '../services/customers-data.service';
import { forkJoin } from 'rxjs';
import { ToastComponent } from '../components/shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  constructor(
    private translate: TranslateService,
    private readonly staticDataService: StaticDataService,
    private customersDataService: CustomersDataService,
  ) {
    this.translate.setFallbackLang('it');
    this.translate.use('it');
  }

  ngOnInit(): void {
    forkJoin({
      limits: this.staticDataService.loadLimit(),
      explanations: this.staticDataService.loadExplanations(),
      example: this.staticDataService.loadIggintExample(),
    })
      .pipe()
      .subscribe(({ example }) => {
        this.customersDataService.setData(example);
      });
  }

  ngOnDestroy(): void {}
}
