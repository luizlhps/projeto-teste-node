import { ErrorBase } from './error-base';

export class BadRequestException extends ErrorBase {
  error_code: string;
  error_description: string;
  status: number;

  constructor(description: string, error_code: string) {
    super(description);
    this.error_code = error_code;
    this.status = 400;
    this.error_description = description;
  }
}
