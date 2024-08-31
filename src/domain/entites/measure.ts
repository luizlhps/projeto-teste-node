import { Customer } from '@prisma/client';

interface IMeasure {
  id: number;
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
  customer_id: number;
  customer: Customer;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Measure {
  id: number;
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
  customer_id: number;
  customer: Customer;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(private props: IMeasure) {
    this.id = props.id;
    this.measure_uuid = props.measure_uuid;
    this.measure_datetime = props.measure_datetime;
    this.measure_type = props.measure_type;
    this.has_confirmed = props.has_confirmed;
    this.image_url = props.image_url;
    this.customer_id = props.customer_id;
    this.customer = props.customer;
    this.is_deleted = props.is_deleted;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
