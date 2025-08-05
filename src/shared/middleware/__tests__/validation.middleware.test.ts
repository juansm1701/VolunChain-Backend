import { Request, Response } from "express";
import {
  validateDto,
  validateQueryDto,
  validateParamsDto,
} from "../validation.middleware";
import { CreateOrganizationDto } from "../../../modules/organization/presentation/dto/create-organization.dto";
import { UuidParamsDto, PaginationQueryDto } from "../../dto/base.dto";
import "reflect-metadata";

describe("Validation Middleware", () => {
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

  describe("validateDto", () => {
    it("should pass validation with valid CreateOrganizationDto", async () => {
      const validData = {
        name: "Test Organization",
        email: "test@example.com",
        password: "password123",
        description: "A test organization for unit testing purposes",
      };

      mockRequest.body = validData;

      const middleware = validateDto(CreateOrganizationDto);
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should fail validation with invalid CreateOrganizationDto", async () => {
      const invalidData = {
        name: "A", // Too short
        email: "invalid-email", // Invalid email
        password: "123", // Too short
        description: "Short", // Too short
      };

      mockRequest.body = invalidData;

      const middleware = validateDto(CreateOrganizationDto);
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Validation failed",
          details: expect.arrayContaining([
            expect.objectContaining({
              property: expect.any(String),
              constraints: expect.any(Array),
            }),
          ]),
        })
      );
    });
  });

  describe("validateParamsDto", () => {
    it("should pass validation with valid UUID", async () => {
      mockRequest.params = {
        id: "550e8400-e29b-41d4-a716-446655440000",
      };

      const middleware = validateParamsDto(UuidParamsDto);
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should fail validation with invalid UUID", async () => {
      mockRequest.params = {
        id: "invalid-uuid",
      };

      const middleware = validateParamsDto(UuidParamsDto);
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe("validateQueryDto", () => {
    it("should pass validation with valid pagination query", async () => {
      mockRequest.query = {
        page: "1",
        limit: "10",
        search: "test",
      };

      const middleware = validateQueryDto(PaginationQueryDto);
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should fail validation with invalid pagination query", async () => {
      mockRequest.query = {
        page: "invalid",
        limit: "-5",
      };

      const middleware = validateQueryDto(PaginationQueryDto);
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});
