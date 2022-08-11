import { ValidationError } from "express-validator";
import { AppError } from "./app-error";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  public statusCode: number;
  public isOperational: boolean;
  constructor(private errors: Array<ValidationError>) {
    super();

    this.statusCode = 400;
    this.isOperational = true;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return this.errors.map((err, i) => ({
      message: err.msg,
      field: err.param,
    }));
  }
}
