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

function createErrorClass(statusCode: number) {
  return class extends APIError {
    errors?: APIErrorData;
    constructor(message: string, errors?: APIErrorData) {
      super(message, statusCode, errors);
    }
  };
}

export const BadRequestError = createErrorClass(400);
export const NotFoundError = createErrorClass(404);
export const UnauthorizedError = createErrorClass(401);
export const ForbiddenError = createErrorClass(403);
export const UnprocessableError = createErrorClass(422);
export const ConflictError = createErrorClass(409);
export const ServerError = createErrorClass(500);

export enum ErrorMessages {
  NoTokenProvided = 'Missing authentication cookie.',
  InvalidTokenBody = 'Missing required fields in x-access-token body.'
}