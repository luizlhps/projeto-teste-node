export class CustomerCreateDto {
  customer_code: string;

  constructor(props: ICustomerCreateDto) {
    this.customer_code = props.customer_code;
  }
}

interface ICustomerCreateDto {
  customer_code: string;
}
