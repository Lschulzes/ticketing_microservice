export abstract class CustomError extends Error {
  abstract isOperational: boolean;
  abstract statusCode: number;

  constructor() {
    super();

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): Array<{ message: string; field?: string }>;
}
