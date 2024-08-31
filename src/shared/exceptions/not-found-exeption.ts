import { ErrorBase } from './error-base';

export class NotFoundException extends ErrorBase {
  error_code: string;
  error_description: string;
  status: number;

  constructor(description: string, error_code: string) {
    super(description);
    this.status = 404;
    this.error_code = error_code;
    this.error_description = description;
  }
}
