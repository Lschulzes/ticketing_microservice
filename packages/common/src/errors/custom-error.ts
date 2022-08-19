export abstract class CustomError extends Error {
  abstract isOperational: boolean;
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): Array<{ message: string; field?: string }>;
}
