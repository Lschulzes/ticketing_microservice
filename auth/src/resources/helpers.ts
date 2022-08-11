const API_ENDPOINT = "/api/users";
export const CURRENT_USER_ENDPOINT = `${API_ENDPOINT}/current-user`;
export const SIGNIN_ENDPOINT = `${API_ENDPOINT}/signin`;
export const SIGNOUT_ENDPOINT = `${API_ENDPOINT}/signout`;
export const SIGNUP_ENDPOINT = `${API_ENDPOINT}/signup`;

export class AppError extends Error {
  public status: string;
  public isOperational: boolean;
  constructor(message: string, public statusCode: number) {
    super(message);
    this.status = `${statusCode}`.charAt(0) === "4" ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
