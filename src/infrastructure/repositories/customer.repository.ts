import { Measure_type } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ICustomerRepository } from '../interfaces/_index';
import { PrismaService } from '../context/database';
import { CustomerCreateDto } from 'src/application/dtos/customer-create.dto';
import { Customer } from 'src/domain/entites/_index';
import { CustomerGetDto } from 'src/application/dtos/customer-get.dto';
import { TYPES } from '@infrastructure/di-types';

@injectable()
export class CustomerRepository implements ICustomerRepository {
  private _prisma: PrismaService;

  public constructor(@inject(TYPES.PrismaClient) prisma: PrismaService) {
    this._prisma = prisma;
  }

  async save(customerCreateDto: CustomerCreateDto): Promise<Customer> {
    return await this._prisma.client.customer.create({
      data: {
        customer_code: customerCreateDto.customer_code,
      },
    });
  }
  async findbyCode(customerGetDto: CustomerGetDto): Promise<Customer | null> {
    const filter: any = {
      where: {
        customer_code: customerGetDto.customer_code,
      },
      include: {
        measures: {
          where: {
            measure_type: customerGetDto.filter?.measure_type,
          },
        },
      },
    };

    return await this._prisma.client.customer.findUnique(filter);
  }
}
