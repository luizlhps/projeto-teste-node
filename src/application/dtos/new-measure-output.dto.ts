export class NewMeasureOutputDto {
  image_url: string;
  measure_value: number;
  measure_uuid: string;

  constructor(image_url: string, measure_value: number, measure_uuid: string) {
    this.image_url = image_url;
    this.measure_value = measure_value;
    this.measure_uuid = measure_uuid;
  }
}
