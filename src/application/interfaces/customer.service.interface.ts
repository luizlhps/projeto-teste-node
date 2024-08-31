import { Customer } from '@prisma/client';
import { CustomerCreateDto } from '../dtos/customer-create.dto';
import { CustomerGetDto } from '../dtos/customer-get.dto';
import { FindAllMeasuresCustomerOutputDto } from '../dtos/find-all-measures-customer-output.dto';

export interface ICustomerService {
  save(customerCreateDto: CustomerCreateDto): Promise<Customer>;
  findbyCode(customerGetDto: CustomerGetDto): Promise<Customer | null>;
  findAllMeasures(customerGetDto: CustomerGetDto): Promise<FindAllMeasuresCustomerOutputDto | null>;
}
