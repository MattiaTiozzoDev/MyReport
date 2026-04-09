import { Injectable } from '@angular/core';
import { StaticDataService } from './static-data.service';
import { CustomerType } from '../enums/customerType.enum';
import { Customer, CustomerData, MappedValue } from '../types/customers.type';
import { Subject } from 'rxjs';
import { FileTypeService } from './file-type.service';
import { GUTSYS_NAMES } from '../configs/gutsys-names';
import { VLSCFA_NAMES } from '../configs/vlscfa-names';
import { VLSCFA_LIMITS } from '../configs/vlascfa-limits';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class CustomersDataService {
  public customersData: CustomerData[] = [];
  public customerDataSubject: Subject<CustomerData> =
    new Subject<CustomerData>();
  public $customerData = this.customerDataSubject.asObservable();
  public customerIndex = 0;

  constructor(
    private staticDataService: StaticDataService,
    private fileTypeService: FileTypeService,
  ) {}

  public setCustomer() {
    this.customerDataSubject.next(this.customersData[this.customerIndex]);
  }

  public getCustomer(): Customer {
    return this.customersData[this.customerIndex]?.customer;
  }

  public changeCustomer(index) {
    this.customerIndex = index;
    this.customerDataSubject.next(this.customersData[this.customerIndex]);
  }

  public setData(data: any): void {
    const fileType = this.fileTypeService.fileType;
    const filteredData = data.filter(
      (el) => el['__EMPTY_3'] && [1, 2, 3].includes(Number(el['__EMPTY_3'])),
    );
    if (fileType === 'METABO') {
      this.customersData = filteredData.map((element: any) =>
        this.mapMetaboData(element),
      );
    } else if (fileType === 'ISTFEC') {
      this.customersData = filteredData.map((element: any) =>
        this.mapIstaminaData(element),
      );
    } else if (fileType === 'GUTSYS') {
      this.customersData = filteredData.map((element: any) =>
        this.mapGutsysData(element),
      );
    } else if (fileType === 'VLSCFA') {
      this.customersData = filteredData.map((element: any) =>
        this.mapVlscfaData(element),
      );
    }
    this.customerDataSubject.next(this.customersData[this.customerIndex]);
  }

  private mapMetaboData(data): CustomerData {
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
      (lim) => lim.id === Number(id),
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

  public getProfilevlscfa(values) {
    let hight = [];
    let low = [];
    values.forEach((el) => {
      if (el.value < el.inf) {
        low.push(el.id);
      }
      if (el.value > el.sup) {
        hight.push(el.id);
      }
    });
    return { hight, low };
  }

  private mapIstaminaData(data): CustomerData {
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
      result: data['__EMPTY_20'],
    };
  }

  private mapGutsysData(data): CustomerData {
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
      values: this.mapGutsysValues(data),
    };
  }

  private mapGutsysValues(data) {
    let values = [];
    Object.keys(data).forEach((key) => {
      if (!key.startsWith('__EMPTY_')) {
        if (key == '__EMPTY_3') data[key] = Number(data[key]);
        values.push({
          id: key,
          value: data[key],
          name: GUTSYS_NAMES[key] ? GUTSYS_NAMES[key] : '',
        });
      }
    });
    return values;
  }

  private mapVlscfaData(data): CustomerData {
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
      values: this.mapVlscfaValues(data),
    };
  }

  private mapVlscfaValues(data) {
    let values = [];
    let population = Number(data['__EMPTY_3']);
    Object.keys(data).forEach((key) => {
      if (!key.startsWith('__EMPTY_')) {
        if (key == '19') {
          values.push({
            id: key,
            value: this.parseDecimal(this.mapNullValVlscfa(data[key], key)),
            name: VLSCFA_NAMES[key] ? VLSCFA_NAMES[key] : '',
            inf: VLSCFA_LIMITS[key]?.['inf' + population],
            sup: VLSCFA_LIMITS[key]?.['sup' + population],
          });
        } else {
          values.push({
            id: key,
            value: this.parseDecimal(this.mapNullValVlscfa(data[key], key)),
            name: VLSCFA_NAMES[key] ? VLSCFA_NAMES[key] : '',
            inf: VLSCFA_LIMITS[key]?.inf,
            sup: VLSCFA_LIMITS[key]?.sup,
          });
        }
      }
    });
    return values;
  }

  mapNullValVlscfa(val, id) {
    if (val) return val;
    if (id == '17' || id == '18') return 0.01;
    return 0.1;
  }

  private parseDecimal(value) {
    if (value == undefined && value == null) return 'N.D.';
    var normalized = null;
    if (typeof value == 'string') {
      normalized = value?.replace(',', '.');
      normalized = Number(normalized);
    }

    const number = parseFloat(normalized ?? value);

    if (isNaN(number)) return 'N.D.';

    return Math.round(number * 100) / 100;
  }
}
