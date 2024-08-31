export class FindAllMeasuresCustomerOutputDto {
  customer_code: string;
  measures: FindAllMeasuresCustomerOutputDtoMeasureDto[] | [];

  constructor(props: ICustomerGetOutputDto) {
    this.customer_code = props.customer_code;
    this.measures = props.measures;
  }
}

export class FindAllMeasuresCustomerOutputDtoMeasureDto {
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;

  constructor(
    measure_uuid: string,
    measure_datetime: Date,
    measure_type: string,
    has_confirmed: boolean,
    image_url: string
  ) {
    this.measure_uuid = measure_uuid;
    this.measure_datetime = measure_datetime;
    this.measure_type = measure_type;
    this.has_confirmed = has_confirmed;
    this.image_url = image_url;
  }
}

interface ICustomerGetOutputDto {
  customer_code: string;
  measures: FindAllMeasuresCustomerOutputDtoMeasureDto[] | [];
}
