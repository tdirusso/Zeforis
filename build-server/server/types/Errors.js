"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = exports.ServerError = exports.ConflictError = exports.UnprocessableError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = exports.APIError = void 0;
class APIError extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.errors = errors;
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}
exports.APIError = APIError;
function createAPIErrorClass(statusCode) {
    return class extends APIError {
        constructor(message, errors) {
            super(message, statusCode, errors);
        }
    };
}
exports.BadRequestError = createAPIErrorClass(400);
exports.NotFoundError = createAPIErrorClass(404);
exports.UnauthorizedError = createAPIErrorClass(401);
exports.ForbiddenError = createAPIErrorClass(403);
exports.UnprocessableError = createAPIErrorClass(422);
exports.ConflictError = createAPIErrorClass(409);
exports.ServerError = createAPIErrorClass(500);
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["NoTokenProvided"] = "Missing authentication cookie.";
    ErrorMessages["InvalidTokenBody"] = "Missing required fields in x-access-token body.";
})(ErrorMessages = exports.ErrorMessages || (exports.ErrorMessages = {}));
