export class ConfirmMeasureInputDto {
  measure_uuid: string;
  confirmed_value: number;

  constructor(measure_uuid: string, confirmed_value: number) {
    this.measure_uuid = measure_uuid;
    this.confirmed_value = confirmed_value;
  }
}
