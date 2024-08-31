import { Measure_type } from '@prisma/client';

export interface NewMeasureInputDto {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: Measure_type;
}
