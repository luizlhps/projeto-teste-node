import { CustomerCreateDto } from 'src/application/dtos/customer-create.dto';
import { CustomerGetDto } from 'src/application/dtos/customer-get.dto';
import { Customer } from 'src/domain/entites/_index';

export interface ICustomerRepository {
  save(customerCreateDto: CustomerCreateDto): Promise<Customer>;

  findbyCode(customerGetDto: CustomerGetDto): Promise<Customer | null>;
}
