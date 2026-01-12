import { Injectable } from '@angular/core';
import { TenantType } from '../enums/tenant.enum';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private ten: TenantType;

  get tenant(): TenantType {
    return this.ten;
  }

  set tenant(value: TenantType) {
    this.ten = value;
  }
}
