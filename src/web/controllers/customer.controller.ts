import { Measure_type } from '@prisma/client';
import { Response, Request, Router, NextFunction } from 'express';
import { CustomerGetDto } from 'src/application/dtos/customer-get.dto';
import { ICustomerService } from 'src/application/interfaces/_index';
import { myContainer } from 'src/infrastructure/di';
import 'reflect-metadata';
import { TYPES } from '@infrastructure/di-types';
export const customerRouter = Router();

customerRouter.get('/:customer_code/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerService = myContainer.get<ICustomerService>(TYPES.customerService);

    const { customer_code } = req.params;
    const { measure_type } = req.query;

    const customerGetDto: CustomerGetDto = {
      customer_code,
      filter: measure_type ? { measure_type: measure_type as Measure_type } : undefined,
    };

    const customer = await customerService.findAllMeasures(customerGetDto);

    res.json(customer);
  } catch (error) {
    next(error);
  }
});
