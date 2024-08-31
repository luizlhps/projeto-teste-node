import { Container } from 'inversify';
import { TYPES } from './di-types';
import { PrismaService } from './context/database';
import { ICustomerRepository, IMeasureRepository } from './interfaces/_index';
import { CustomerRepository, MeasureRepository } from './repositories/_index';
import { MeasureService } from 'src/application/services/measure.service';
import { CustomerService } from 'src/application/services/customer.service';
import { IMeasureService } from 'src/application/interfaces/measure.service.interface';
import { ICustomerService } from 'src/application/interfaces/customer.service.interface';

export const myContainer = new Container();

myContainer.bind<IMeasureService>(TYPES.measureService).to(MeasureService);
myContainer.bind<ICustomerService>(TYPES.customerService).to(CustomerService);

myContainer.bind<IMeasureRepository>(TYPES.measureRepository).to(MeasureRepository);
myContainer.bind<ICustomerRepository>(TYPES.customerRepository).to(CustomerRepository);

// Prisma Service
myContainer.bind<PrismaService>(TYPES.PrismaClient).to(PrismaService);
export { TYPES };
