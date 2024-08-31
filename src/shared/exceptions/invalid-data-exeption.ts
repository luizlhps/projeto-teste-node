import { ErrorBase } from './error-base';

export class InvalidDataException extends ErrorBase {
  error_code: string;
  error_description: string;
  status: number;

  constructor(message: string) {
    super(message);
    this.error_code = 'INVALID_DATA';
    this.status = 400;
    this.error_description = message;
  }
}
