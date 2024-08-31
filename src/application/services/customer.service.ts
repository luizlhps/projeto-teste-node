import {
  FindAllMeasuresCustomerOutputDto,
  FindAllMeasuresCustomerOutputDtoMeasureDto,
} from './../dtos/find-all-measures-customer-output.dto';

import { Measure_type } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { BadRequestException } from 'src/shared/exceptions/bad-request-exception';
import { ICustomerService } from '../interfaces/_index';
import { ICustomerRepository } from 'src/infrastructure/interfaces/_index';
import { TYPES } from '@infrastructure/di-types';
import { CustomerCreateDto } from '../dtos/customer-create.dto';
import { Customer } from 'src/domain/entites/customer';
import { FindAllMeasuresCustomerInputDto } from '../dtos/find-all-measures-customer-input.dto';
import { CustomerGetDto } from '../dtos/customer-get.dto';

@injectable()
export class CustomerService implements ICustomerService {
  private _customerRepository: ICustomerRepository;

  public constructor(@inject(TYPES.customerRepository) customerRepository: ICustomerRepository) {
    this._customerRepository = customerRepository;
  }

  async save(customerCreateDto: CustomerCreateDto): Promise<Customer> {
    return await this._customerRepository.save(customerCreateDto);
  }

  async findAllMeasures(
    customerGetDto: FindAllMeasuresCustomerInputDto,
  ): Promise<FindAllMeasuresCustomerOutputDto | null> {
    if (
      !customerGetDto.customer_code ||
      typeof customerGetDto.customer_code !== 'string' ||
      customerGetDto.customer_code.trim().length === 0
    ) {
      throw new BadRequestException('O código do cliente é obrigatório e não pode estar vazio.', 'INVALID_DATA');
    }

    const allowedTypes = [Measure_type.GAS, Measure_type.WATER];
    if (customerGetDto.filter?.measure_type && !allowedTypes.includes(customerGetDto.filter.measure_type)) {
      throw new BadRequestException('Tipo de medição não permitida', 'INVALID_TYPE');
    }

    const customer = await this.findbyCode(customerGetDto);
    if (!customer) {
      throw new BadRequestException('Nenhuma leitura encontrada.', 'NOT_FOUND');
    }

    return new FindAllMeasuresCustomerOutputDto({
      customer_code: customer.customer_code,
      measures:
        customer.measures?.map(
          (measure) =>
            new FindAllMeasuresCustomerOutputDtoMeasureDto(
              measure.measure_uuid,
              measure.measure_datetime,
              measure.measure_type,
              measure.has_confirmed,
              measure.image_url,
            ),
        ) ?? [],
    });
  }

  async findbyCode(customerGetDto: CustomerGetDto): Promise<Customer | null> {
    return await this._customerRepository.findbyCode(customerGetDto);
  }
}
