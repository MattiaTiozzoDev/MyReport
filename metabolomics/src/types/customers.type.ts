export type CustomerData = {
  customer: Customer;
  values: MappedValue[];
};

export type Customer = {
  accDate: string;
  orderId: string;
  fiscalCode: string;
  type: number;
  available: string;
  name: string;
  accNumber: string;
  refDate: string;
};

export type MappedValue = {
  id: string;
  value: string;
  desc?: string | null;
  yellInf?: number | null;
  yellSup?: number | null;
  grInf?: number | null;
  grSup?: number | null;
  sign?: string | null;
  note?: string | null;
};
