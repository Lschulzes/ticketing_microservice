import { CustomError } from "./custom-error";

export class AppError extends CustomError {
  public isOperational: boolean;
  constructor(private error: string, public statusCode: number) {
    super(error);

    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.error }];
  }
}
