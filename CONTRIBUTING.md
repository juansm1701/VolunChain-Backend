# Contributing to VolunChain

## 🏗️ Architecture Overview

VolunChain follows **Domain-Driven Design (DDD)** principles with a strict modular architecture. Every piece of code must be organized within its appropriate domain module.

## 📁 Module Structure

Every module in `src/modules/<domain>/` must follow this structure:

```
src/modules/<domain>/
├── __tests__/                    # All tests for this module
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
├── domain/                       # Domain layer (business logic)
│   ├── entities/                 # Domain entities
│   ├── value-objects/            # Value objects
│   ├── interfaces/               # Domain interfaces
│   └── exceptions/               # Domain-specific exceptions
├── application/                  # Application layer (use cases & services)
│   ├── services/                 # Application services
│   ├── use-cases/                # Business use cases
│   └── interfaces/               # Application interfaces
├── infrastructure/               # Infrastructure layer
│   ├── repositories/             # Repository implementations
│   ├── services/                 # External service implementations
│   └── adapters/                 # External system adapters
├── presentation/                 # Presentation layer
│   ├── controllers/              # HTTP controllers
│   ├── routes/                   # Express routes
│   ├── middlewares/              # Module-specific middlewares
│   └── dto/                      # Data Transfer Objects
└── README.md                     # Module documentation
```

## 🎯 Coding Standards

### Naming Conventions

- **Classes**: PascalCase (e.g., `UserService`, `CreateUserUseCase`)
- **Functions/Methods**: camelCase (e.g., `createUser`, `validateEmail`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
- **Files**: kebab-case (e.g., `user-service.ts`, `create-user.usecase.ts`)
- **DTOs**: PascalCase with "Dto" suffix (e.g., `CreateUserDto`, `UserResponseDto`)

### Code Organization Rules

1. **Domain Logic**: Must live in `domain/` - no business logic in controllers or services
2. **Use Cases**: All business operations must be use cases in `application/use-cases/`
3. **Services**: Application services in `application/services/`, infrastructure services in `infrastructure/services/`
4. **Controllers**: Only handle HTTP concerns, delegate to use cases
5. **DTOs**: All API contracts must be DTOs with validation decorators

### Validation & DTOs

All DTOs must use `class-validator` decorators:

```typescript
import { IsString, IsEmail, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
```

### Testing Requirements

- **Unit Tests**: Test individual functions/classes in isolation
- **Integration Tests**: Test module interactions
- **E2E Tests**: Test complete user workflows
- **Coverage**: Minimum 80% code coverage per module
- **Test Files**: Must be in `__tests__/` directory within each module

### Database & Migrations

- Use Prisma for all database operations
- Migrations must be database-agnostic (support both PostgreSQL and SQLite)
- Repository pattern for data access
- No raw SQL in business logic

## 🚀 Development Workflow

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# For testing
cp .env.example .env.test
# Set DB_TYPE=sqlite in .env.test
```

### 2. Database Setup

```bash
# Development (PostgreSQL)
docker-compose up -d
npm run db:migrate
npm run db:seed

# Testing (SQLite)
npm run test:setup
```

### 3. Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm test                    # All tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # E2E tests only

# Code quality
npm run lint              # ESLint
npm run format            # Prettier
npm run type-check        # TypeScript check
```

### 4. Pre-commit Hooks

The project uses pre-commit hooks that automatically:

- Run ESLint for code style
- Run Prettier for formatting
- Run TypeScript type checking
- Run affected tests

**Bypass for urgent fixes only:**

```bash
git commit -m "urgent fix" --no-verify
```

## 📝 Module Development Guidelines

### Creating a New Module

1. Create the module directory structure
2. Implement domain entities and value objects
3. Define repository interfaces
4. Implement use cases
5. Create application services
6. Add controllers and routes
7. Write comprehensive tests
8. Create module README.md

### Module README Template

Every module must include a README.md with:

````markdown
# <Module Name>

## Overview

Brief description of the module's purpose and responsibilities.

## Architecture

- Domain entities and business rules
- Use cases and application logic
- Infrastructure concerns
- API endpoints

## Development

### Adding New Features

1. Create/update domain entities
2. Implement use cases
3. Add controllers and routes
4. Write tests
5. Update documentation

### Testing

```bash
npm test -- --testPathPattern=modules/<module-name>
```
````

### API Endpoints

List of available endpoints with examples.

## Dependencies

List of other modules this module depends on.

```

## 🔧 Code Quality Standards

### TypeScript

- Strict mode enabled
- No `any` types without explicit justification
- Proper interface definitions
- Generic types where appropriate

### Error Handling

- Use domain exceptions for business logic errors
- Proper HTTP status codes in controllers
- Consistent error response format
- Logging for debugging

### Performance

- Database queries optimized
- Proper indexing
- Caching where appropriate
- Rate limiting on public endpoints

### Security

- Input validation on all endpoints
- Authentication/authorization checks
- SQL injection prevention (use Prisma)
- Rate limiting
- CORS configuration

## 🐛 Bug Reports & Feature Requests

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error logs

### Feature Requests

Include:
- Problem description
- Proposed solution
- Use cases
- Impact assessment

## 📋 Pull Request Guidelines

1. **Branch Naming**: `feature/description` or `fix/description`
2. **Commit Messages**: Conventional commits format
3. **Tests**: All new code must have tests
4. **Documentation**: Update README files as needed
5. **Code Review**: All PRs require review

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass and coverage is adequate
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Security considerations addressed

## 🎯 Getting Help

- Check existing documentation
- Search existing issues
- Create detailed issue reports
- Join our community discussions

---

**Remember**: This is production software. Every line of code affects real users. Write it like your career depends on it.
```
