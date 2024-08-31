import { Measure_type } from '@prisma/client';

export class CustomerGetDto {
  customer_code: string;
  filter?: {
    measure_type?: Measure_type;
  };

  constructor(props: CustomerGetDto) {
    this.customer_code = props.customer_code;
    this.filter = props.filter;
  }
}

export interface IFindAllMeasuresCustomerInputDto {
  customer_code: string;
  filter?: {
    measure_type?: Measure_type;
  };
}
