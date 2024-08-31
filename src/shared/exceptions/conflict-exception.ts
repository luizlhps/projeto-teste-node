import { ErrorBase } from './error-base';

export class ConflictException extends ErrorBase {
  error_code: string;
  error_description: string;
  status: number;

  constructor(description: string, error_code: string) {
    super(description);
    this.error_code = error_code;
    this.status = 409;
    this.error_description = description;
  }
}
