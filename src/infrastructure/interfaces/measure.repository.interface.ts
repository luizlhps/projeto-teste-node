import { MeasureCreateDto } from '@application/dtos/measure-create.dto';
import { MeasureUpdateDto } from '@application/dtos/measure-update.dto';
import { Measure } from '@prisma/client';
import { IMeasureFilter } from 'src/shared/filters/measure-filter';

export interface IMeasureRepository {
  save(measureCreateDto: MeasureCreateDto): Promise<Measure>;
  findbyUuid(uuid: string): Promise<Measure | null>;
  getAll(measureFilter?: IMeasureFilter): Promise<Measure[]>;
  update(measureUpdateDto: MeasureUpdateDto): Promise<Measure>;
}
