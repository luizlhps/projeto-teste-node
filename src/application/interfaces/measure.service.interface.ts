import { ConfirmMeasureInputDto } from '../dtos/confirm-measure-input.dto';
import { ConfirmMeasureOutputDto } from '../dtos/confirm-measure-output.dto';
import { NewMeasureInputDto } from '../dtos/new-measure-input.dto';
import { NewMeasureOutputDto } from '../dtos/new-measure-output.dto';

export interface IMeasureService {
  listMeasures(): Promise<any>;
  newMeasure(newMeasureInputDto: NewMeasureInputDto): Promise<NewMeasureOutputDto>;
  confirmMeasure(confirmMeasureInputDto: ConfirmMeasureInputDto): Promise<ConfirmMeasureOutputDto>;
}
