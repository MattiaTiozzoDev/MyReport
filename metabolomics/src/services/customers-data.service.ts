import { Injectable } from '@angular/core';
import { StaticDataService } from './static-data.service';
import { CustomerType } from '../enums/customerType.enum';
import { Customer, CustomerData, MappedValue } from '../types/customers.type';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersDataService {
  public customersData: CustomerData[] = [];
  public customerDataSubject: Subject<CustomerData> =
    new Subject<CustomerData>();
  public $customerData = this.customerDataSubject.asObservable();
  public customerIndex = 0;

  constructor(private staticDataService: StaticDataService) {}

  setCustomer() {
    this.customerDataSubject.next(this.customersData[this.customerIndex]);
  }

  getCustomer(): Customer {
    return this.customersData[this.customerIndex]?.customer;
  }

  public changeCustomer() {
    this.customerIndex++;
  }

  public setData(data: any): void {
    this.customersData = data
      .filter(
        (el) => el['__EMPTY_3'] && [1, 2, 3].includes(Number(el['__EMPTY_3']))
      )
      .map((element: any) => this.mapData(element));
    this.customerDataSubject.next(this.customersData[this.customerIndex]);
  }

  private mapData(data): CustomerData {
    return {
      customer: {
        accDate: data['__EMPTY'],
        orderId: data['__EMPTY_1'],
        fiscalCode: data['__EMPTY_2'],
        type: Number(data['__EMPTY_3']),
        available: data['__EMPTY_4'],
        name: data['__EMPTY_6'],
        accNumber: data['__EMPTY_7'],
        refDate: data['__EMPTY_8'],
      },
      values: this.mapValues(data, Number(data['__EMPTY_3'])),
    };
  }

  private mapValues(data, type): MappedValue[] {
    let values = [];
    Object.keys(data).forEach((key) => {
      if (!key.startsWith('__EMPTY_')) {
        if (key == '__EMPTY_3') data[key] = Number(data[key]);
        var limit = this.getLimits(key, type);
        values.push({
          id: key,
          value: data[key],
          ...limit,
        });
      }
    });
    return values;
  }

  private getLimits(id, type): Partial<MappedValue> {
    var limit = this.staticDataService.limit.find(
      (lim) => lim.id === Number(id)
    );
    switch (type) {
      case CustomerType.CHILD:
        return {
          desc: limit ? limit.desc : null,
          yellInf: limit ? limit.cYellInf : null,
          yellSup: limit ? limit.cYellSup : null,
          grInf: limit ? limit.cGrInf : null,
          grSup: limit ? limit.cGrSup : null,
          sign: limit ? limit.cSign : null,
          note: limit && limit.note ? limit.note : null,
        };
      case CustomerType.WOMAN:
        return {
          desc: limit ? limit.desc : null,
          yellInf: limit ? limit.wYellInf : null,
          yellSup: limit ? limit.wYellSup : null,
          grInf: limit ? limit.wGrInf : null,
          grSup: limit ? limit.wGrSup : null,
          sign: limit ? limit.wSign : null,
          note: limit && limit.note ? limit.note : null,
        };
      case CustomerType.MAN:
        return {
          desc: limit ? limit.desc : null,
          yellInf: limit ? limit.mYellInf : null,
          yellSup: limit ? limit.mYellSup : null,
          grInf: limit ? limit.mGrInf : null,
          grSup: limit ? limit.mGrSup : null,
          sign: limit ? limit.mSign : null,
          note: limit && limit.note ? limit.note : null,
        };
      default:
        return null;
    }
  }

  public getProfileMetabolites(values) {
    let hight = [];
    let low = [];
    values.forEach((el) => {
      if (el.value < el.yellInf) {
        low.push(el.id);
      }
      if (el.value > el.yellSup) {
        hight.push(el.id);
      }
    });
    return { hight, low };
  }
}
