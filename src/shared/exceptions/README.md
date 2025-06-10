# Error Handling System

## Overview

This directory contains the centralized error handling system for the VolunChain application. The system provides a consistent way to handle and format errors across the application.

## Structure

- `AppException.ts` - Base exception class and common constants
- `DomainExceptions.ts` - Domain-specific exception classes
- `errorHandler.ts` - Global error handling middleware

## Usage

### Throwing Errors

```typescript
// In your controllers/services
import {
  ValidationException,
  NotFoundException,
} from "@shared/exceptions/DomainExceptions";

function updateUser(id: string, data: UserUpdateDto) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (!isValid(data)) {
    throw new ValidationException("Invalid user data", {
      invalidFields: ["email", "name"],
    });
  }
  // ...
}
```

### Error Response Format

All errors are returned in the following format:

```json
{
  "statusCode": 400,
  "message": "Invalid user data",
  "errorCode": "VALIDATION_ERROR",
  "details": {
    "invalidFields": ["email", "name"]
  }
}
```

### Available Exception Classes

1. `ValidationException` (400)

   - For invalid input data
   - Include details about validation failures

2. `AuthenticationException` (401)

   - For authentication failures
   - Use when user is not authenticated

3. `AuthorizationException` (403)

   - For permission issues
   - Use when user lacks required permissions

4. `NotFoundException` (404)

   - For missing resources
   - Use when requested entity doesn't exist

5. `ConflictException` (409)

   - For resource conflicts
   - Use for unique constraint violations

6. `InternalServerException` (500)
   - For unexpected server errors
   - Use as a last resort

## Best Practices

1. Always use the most specific exception class available
2. Include meaningful error messages
3. Add relevant details when available
4. Don't expose sensitive information in error messages
5. Log errors appropriately before throwing

## Development Mode

In development mode, additional information is included in the error response:

- Stack trace
- Request body
- Request query parameters

## Testing

Run the test suite:

```bash
npm test -- --grep "Exception"
```

## Contributing

When adding new exception types:

1. Extend `AppException`
2. Add appropriate HTTP status code
3. Add corresponding error code
4. Update tests
5. Update this documentation
