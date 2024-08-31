import { Measure_type } from '@prisma/client';

export class MeasureCreateDto {
  image_url: string;
  measure_uuid: string;
  measure_datetime: string;
  measure_type: Measure_type;
  customer_id: number;
  measure_value: number;

  constructor(props: IMeasureCreateDto) {
    this.image_url = props.image_url;
    this.measure_uuid = props.measure_uuid;
    this.measure_datetime = props.measure_datetime;
    this.measure_type = props.measure_type;
    this.customer_id = props.customer_id;
    this.measure_value = props.measure_value;
  }
}

interface IMeasureCreateDto {
  image_url: string;
  measure_uuid: string;
  measure_datetime: string;
  measure_type: Measure_type;
  customer_id: number;
  measure_value: number;
}
