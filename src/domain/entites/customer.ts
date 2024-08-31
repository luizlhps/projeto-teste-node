import { Measure } from '@prisma/client';

interface ICustomer {
  id: number;
  customer_code: string;
  measures?: Measure[];
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer {
  id: number;
  customer_code: string;
  measures?: Measure[];
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: ICustomer) {
    this.id = props.id;
    this.customer_code = props.customer_code;
    this.measures = props.measures;
    this.is_deleted = props.is_deleted;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
