export class ErrorBase extends Error {
  error_code: string;
  error_description: string;
  status: number;

  constructor(description: string) {
    super(description);
    this.error_code = this.constructor.name;
    this.status = 409;
    this.error_description = this.constructor.name;
  }
}
