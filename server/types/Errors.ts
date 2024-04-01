export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class UnprocessableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnprocessableError';
  }
}


export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export enum ErrorMessages {
  NoTokenProvided = 'Missing authentication cookie.',
  InvalidTokenBody = 'Missing required fields in x-access-token body.'
}