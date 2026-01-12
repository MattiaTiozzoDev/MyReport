import { Injectable } from '@angular/core';
import { TenantType } from '../enums/tenant.enum';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public subject: Subject<any> = new Subject<any>();
  public $show = this.subject.asObservable();

  public showMessage(type, message) {
    this.subject.next({
      show: true,
      type,
      message,
    });
  }
}
