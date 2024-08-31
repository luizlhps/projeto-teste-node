import { Measure_type } from '@prisma/client';

export class MeasureUpdateDto {
  measure_uuid: string;
  measure_value: number;

  constructor(props: IMeasureUpdateDto) {
    this.measure_uuid = props.measure_uuid;
    this.measure_value = props.measure_value;
  }
}

interface IMeasureUpdateDto {
  measure_uuid: string;
  measure_value: number;
}
