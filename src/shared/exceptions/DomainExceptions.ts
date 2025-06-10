import { AppException, HttpStatus, ErrorCodes } from "./AppException";

export class ValidationException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION_ERROR);
  }
}

export class AuthenticationException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCodes.AUTHENTICATION_ERROR);
  }
}

export class AuthorizationException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN, ErrorCodes.AUTHORIZATION_ERROR);
  }
}

export class NotFoundException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND, ErrorCodes.RESOURCE_NOT_FOUND);
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT, ErrorCodes.RESOURCE_CONFLICT);
  }
}

export class InternalServerException extends AppException {
  constructor(message: string = "Internal server error") {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, ErrorCodes.INTERNAL_ERROR);
  }
}
