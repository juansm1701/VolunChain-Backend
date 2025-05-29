import {
  AppException,
  HttpStatus,
  ErrorCodes,
} from "../../../src/shared/exceptions/AppException";
import {
  ValidationException,
  AuthenticationException,
  NotFoundException,
} from "../../../src/shared/exceptions/DomainExceptions";
import { errorHandler } from "../../../src/shared/middleware/errorHandler";
import { Request, Response } from "express";

describe("Exception System", () => {
  describe("AppException", () => {
    it("should create an AppException with correct properties", () => {
      const exception = new AppException(
        "Test error",
        HttpStatus.BAD_REQUEST,
        ErrorCodes.VALIDATION_ERROR
      );

      expect(exception.message).toBe("Test error");
      expect(exception.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.errorCode).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(exception).toBeInstanceOf(Error);
    });

    it("should serialize to JSON correctly", () => {
      const exception = new AppException(
        "Test error",
        HttpStatus.BAD_REQUEST,
        ErrorCodes.VALIDATION_ERROR
      );

      const json = exception.toJSON();
      expect(json).toEqual({
        message: "Test error",
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ErrorCodes.VALIDATION_ERROR,
      });
    });
  });

  describe("Domain Exceptions", () => {
    it("should create ValidationException with correct properties", () => {
      const exception = new ValidationException("Invalid input");
      expect(exception.message).toBe("Invalid input");
      expect(exception.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.errorCode).toBe(ErrorCodes.VALIDATION_ERROR);
    });

    it("should create AuthenticationException with correct properties", () => {
      const exception = new AuthenticationException("Invalid credentials");
      expect(exception.message).toBe("Invalid credentials");
      expect(exception.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(exception.errorCode).toBe(ErrorCodes.AUTHENTICATION_ERROR);
    });

    it("should create NotFoundException with correct properties", () => {
      const exception = new NotFoundException("Resource not found");
      expect(exception.message).toBe("Resource not found");
      expect(exception.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(exception.errorCode).toBe(ErrorCodes.RESOURCE_NOT_FOUND);
    });
  });

  describe("Error Handler Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      nextFunction = jest.fn();
    });

    it("should handle AppException correctly", () => {
      const exception = new ValidationException("Invalid input");

      errorHandler(
        exception,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid input",
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: ErrorCodes.VALIDATION_ERROR,
        })
      );
    });

    it("should handle unknown errors correctly", () => {
      const error = new Error("Unknown error");

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Unknown error",
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: ErrorCodes.INTERNAL_ERROR,
        })
      );
    });
  });
});
