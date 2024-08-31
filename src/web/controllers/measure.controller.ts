import { Response, Request, Router, NextFunction } from 'express';
import { IMeasureService } from 'src/application/interfaces/measure.service.interface';
import { myContainer } from 'src/infrastructure/di';
import 'reflect-metadata';
import { TYPES } from '@infrastructure/di-types';
export const measureRouter = Router();

measureRouter.patch('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const MeasureService = myContainer.get<IMeasureService>(TYPES.measureService);

    res.json(await MeasureService.confirmMeasure(req.body));
  } catch (error) {
    next(error);
  }
});

measureRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const MeasureService = myContainer.get<IMeasureService>(TYPES.measureService);
    res.json(await MeasureService.newMeasure(req.body));
  } catch (error) {
    console.log(error);
    next(error);
  }
});
