# DTO-Based Validation Implementation Guide

## Overview

This guide documents the comprehensive DTO-based validation system implemented using `class-validator` and `class-transformer`. This system replaces the previous express-validator approach with a more robust, type-safe validation mechanism that aligns with our Domain-Driven Design (DDD) architecture.

## Architecture

### Core Components

1. **Validation Middleware** (`src/shared/middleware/validation.middleware.ts`)

   - `validateDto<T>()` - Validates request body
   - `validateQueryDto<T>()` - Validates query parameters
   - `validateParamsDto<T>()` - Validates route parameters

2. **Base DTOs** (`src/shared/dto/base.dto.ts`)

   - `UuidParamsDto` - For UUID route parameters
   - `PaginationQueryDto` - For pagination query parameters
   - `BaseResponseDto` - Base response structure
   - `ErrorResponseDto` - Error response structure

3. **Module-Specific DTOs**
   - Auth: `RegisterDto`, `LoginDto`, `VerifyEmailDTO`, `ResendVerificationDTO`
   - Organization: `CreateOrganizationDto`, `UpdateOrganizationDto`
   - User: `CreateUserDto`, `UpdateUserDto`
   - Project: `CreateProjectDto`, `UpdateProjectDto`
   - NFT: `CreateNFTDto`
   - Messaging: `SendMessageDto`, `MarkAsReadDto`
   - Volunteer: `CreateVolunteerDTO`, `UpdateVolunteerDTO`

## Usage Examples

### 1. Route-Level Validation

```typescript
import { Router } from "express";
import {
  validateDto,
  validateParamsDto,
  validateQueryDto,
} from "../shared/middleware/validation.middleware";
import { CreateOrganizationDto } from "../modules/organization/presentation/dto/create-organization.dto";
import { UuidParamsDto, PaginationQueryDto } from "../shared/dto/base.dto";

const router = Router();

// POST with body validation
router.post(
  "/organizations",
  validateDto(CreateOrganizationDto),
  organizationController.create
);

// GET with parameter validation
router.get(
  "/organizations/:id",
  validateParamsDto(UuidParamsDto),
  organizationController.getById
);

// GET with query validation
router.get(
  "/organizations",
  validateQueryDto(PaginationQueryDto),
  organizationController.getAll
);
```

### 2. Controller Type Safety

```typescript
import { Request, Response } from "express";
import { CreateOrganizationDto } from "../dto/create-organization.dto";
import { UuidParamsDto, PaginationQueryDto } from "../../shared/dto/base.dto";

export class OrganizationController {
  createOrganization = async (
    req: Request<{}, {}, CreateOrganizationDto>,
    res: Response
  ): Promise<void> => {
    // req.body is now typed as CreateOrganizationDto
    const organization = await this.createUseCase.execute(req.body);
    res.status(201).json({ success: true, data: organization });
  };

  getById = async (
    req: Request<UuidParamsDto>,
    res: Response
  ): Promise<void> => {
    // req.params.id is validated as UUID
    const organization = await this.getUseCase.execute(req.params.id);
    res.json({ success: true, data: organization });
  };

  getAll = async (
    req: Request<{}, {}, {}, PaginationQueryDto>,
    res: Response
  ): Promise<void> => {
    // req.query is typed and validated
    const { page, limit, search } = req.query;
    const organizations = await this.getAllUseCase.execute({
      page,
      limit,
      search,
    });
    res.json({ success: true, data: organizations });
  };
}
```

### 3. Creating Custom DTOs

```typescript
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
} from "class-validator";

export class CreateOrganizationDto {
  @IsString({ message: "Name must be a string" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(100, { message: "Name cannot exceed 100 characters" })
  name: string;

  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  @MaxLength(500, { message: "Description cannot exceed 500 characters" })
  description?: string;
}
```

## Validation Rules

### Common Validation Decorators

- `@IsString()` - Validates string type
- `@IsEmail()` - Validates email format
- `@IsUUID(4)` - Validates UUID v4 format
- `@IsInt()`, `@IsNumber()` - Validates numeric types
- `@IsBoolean()` - Validates boolean type
- `@IsOptional()` - Makes field optional
- `@MinLength(n)`, `@MaxLength(n)` - String length validation
- `@Min(n)`, `@Max(n)` - Numeric range validation
- `@Matches(regex)` - Regular expression validation
- `@IsEnum(enum)` - Enum validation
- `@IsUrl()` - URL validation

### Transform Decorators

```typescript
import { Transform } from "class-transformer";

export class PaginationQueryDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: "Page must be an integer" })
  @Min(1, { message: "Page must be at least 1" })
  page: number;
}
```

## Error Response Format

When validation fails, the middleware returns a standardized error response:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "property": "email",
      "value": "invalid-email",
      "constraints": ["Please provide a valid email address"]
    },
    {
      "property": "name",
      "value": "A",
      "constraints": ["Name must be at least 2 characters long"]
    }
  ]
}
```

## Migration from express-validator

### Before (express-validator)

```typescript
import { body, param, validationResult } from "express-validator";

router.post(
  "/nfts",
  [
    body("userId").isUUID(),
    body("organizationId").isUUID(),
    body("description").isString().notEmpty(),
  ],
  NFTController.createNFT
);
```

### After (class-validator)

```typescript
import { validateDto } from "../shared/middleware/validation.middleware";
import { CreateNFTDto } from "../modules/nft/dto/create-nft.dto";

router.post("/nfts", validateDto(CreateNFTDto), NFTController.createNFT);
```

## Benefits

1. **Type Safety** - Full TypeScript support with typed request objects
2. **Centralized Validation** - All validation rules defined in DTO classes
3. **Reusability** - DTOs can be reused across different endpoints
4. **Consistency** - Standardized error responses
5. **Maintainability** - Easy to update validation rules in one place
6. **DDD Alignment** - Fits well with Domain-Driven Design principles
7. **Auto-transformation** - Automatic type conversion with class-transformer

## Testing

Test files are available in `src/shared/middleware/__tests__/validation.middleware.test.ts` demonstrating proper testing of validation middleware.

## Migration Checklist

- [ ] Replace express-validator imports with class-validator DTOs
- [ ] Update route handlers to use validation middleware
- [ ] Update controller method signatures with proper typing
- [ ] Test all endpoints with both valid and invalid data
- [ ] Update API documentation with new validation rules
- [ ] Remove unused express-validator dependencies (optional)

## Best Practices

1. Always provide descriptive error messages in validation decorators
2. Use appropriate validation decorators for each field type
3. Group related validations in the same DTO class
4. Use base DTOs for common patterns (UUID params, pagination)
5. Keep DTOs focused and specific to their use case
6. Test validation logic thoroughly
7. Document custom validation rules
