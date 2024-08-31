import { Measure, Measure_type } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IMeasureFilter } from 'src/shared/filters/measure-filter';
import { PrismaService } from '../context/database';
import { IMeasureRepository } from '../interfaces/_index';
import { MeasureUpdateDto } from 'src/application/dtos/measure-update.dto';
import { MeasureCreateDto } from 'src/application/dtos/measure-create.dto';
import { TYPES } from '@infrastructure/di-types';

@injectable()
export class MeasureRepository implements IMeasureRepository {
  private _prisma: PrismaService;

  public constructor(@inject(TYPES.PrismaClient) prisma: PrismaService) {
    this._prisma = prisma;
  }
  async update(measureUpdateDto: MeasureUpdateDto): Promise<Measure> {
    return await this._prisma.client.measure.update({
      where: {
        measure_uuid: measureUpdateDto.measure_uuid,
      },
      data: {
        measure_value: measureUpdateDto.measure_value,
        has_confirmed: true,
      },
    });
  }

  async findbyUuid(uuid: string): Promise<Measure | null> {
    return await this._prisma.client.measure.findUnique({
      where: {
        measure_uuid: uuid,
      },
    });
  }
  async save(measureCreateDto: MeasureCreateDto): Promise<Measure> {
    return await this._prisma.client.measure.create({
      data: measureCreateDto,
    });
  }
  async findbyMeasure(measure_datetime: string) {
    return await this._prisma.client.measure.findFirst({
      where: { measure_datetime: measure_datetime },
    });
  }

  async getAll(measureFilter?: IMeasureFilter): Promise<Measure[]> {
    let filter: any = { where: {} };

    if (measureFilter?.customer_code) {
      filter.where.customer_code = measureFilter?.customer_code;
    }

    if (measureFilter?.measure_datetime) {
      filter.where.measure_datetime = measureFilter?.measure_datetime;
    }

    return await this._prisma.client.measure.findMany({
      ...filter,
      include: {
        customer: true,
      },
    });
  }
}
