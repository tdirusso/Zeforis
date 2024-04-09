export interface APIErrorData {
  [key: string]: any | [] | undefined;
}

export class APIError extends Error {
  errors?: APIErrorData;
  statusCode: number;

  constructor(message: string, statusCode: number, errors?: APIErrorData) {
    super(message);
    this.errors = errors;
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

function createAPIErrorClass(statusCode: number) {
  return class extends APIError {
    errors?: APIErrorData;
    constructor(message: string, errors?: APIErrorData) {
      super(message, statusCode, errors);
    }
  };
}

export const BadRequestError = createAPIErrorClass(400);
export const NotFoundError = createAPIErrorClass(404);
export const UnauthorizedError = createAPIErrorClass(401);
export const ForbiddenError = createAPIErrorClass(403);
export const UnprocessableError = createAPIErrorClass(422);
export const ConflictError = createAPIErrorClass(409);
export const ServerError = createAPIErrorClass(500);

export enum ErrorMessages {
  NoTokenProvided = 'Missing authentication cookie.',
  InvalidTokenBody = 'Missing required fields in x-access-token body.'
}