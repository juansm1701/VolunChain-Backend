# VolunChain Refactoring Plan

## 🎯 Overview

This document outlines the comprehensive refactoring required to transform VolunChain into a production-grade, strictly organized Domain-Driven Design system.

## 📋 Files Requiring Refactoring

### 1. Controllers (Move to presentation/controllers)

**Current Location**: `src/controllers/`
**Target Location**: `src/modules/<domain>/presentation/controllers/`

| File                          | Target Module    | Action                                            |
| ----------------------------- | ---------------- | ------------------------------------------------- |
| `Auth.controller.ts`          | `auth`           | Move and rename to `auth.controller.ts`           |
| `UserController.ts`           | `user`           | Move and rename to `user.controller.ts`           |
| `Project.controller.ts`       | `project`        | Move and rename to `project.controller.ts`        |
| `OrganizationController.ts`   | `organization`   | Move and rename to `organization.controller.ts`   |
| `VolunteerController.ts`      | `volunteer`      | Move and rename to `volunteer.controller.ts`      |
| `NFTController.ts`            | `nft`            | Move and rename to `nft.controller.ts`            |
| `certificate.controller.ts`   | `certificate`    | Move and rename to `certificate.controller.ts`    |
| `userVolunteer.controller.ts` | `user-volunteer` | Move and rename to `user-volunteer.controller.ts` |

### 2. Services (Move to application/services)

**Current Location**: `src/services/`
**Target Location**: `src/modules/<domain>/application/services/`

| File                       | Target Module    | Action                                         |
| -------------------------- | ---------------- | ---------------------------------------------- |
| `AuthService.ts`           | `auth`           | Move and rename to `auth.service.ts`           |
| `UserService.ts`           | `user`           | Move and rename to `user.service.ts`           |
| `ProjectService.ts`        | `project`        | Move and rename to `project.service.ts`        |
| `OrganizationService.ts`   | `organization`   | Move and rename to `organization.service.ts`   |
| `VolunteerService.ts`      | `volunteer`      | Move and rename to `volunteer.service.ts`      |
| `NFTService.ts`            | `nft`            | Move and rename to `nft.service.ts`            |
| `userVolunteer.service.ts` | `user-volunteer` | Move and rename to `user-volunteer.service.ts` |
| `logger.service.ts`        | `shared`         | Move to `shared/infrastructure/services/`      |
| `sorobanService.ts`        | `blockchain`     | Move to `blockchain/infrastructure/services/`  |

### 3. Entities (Move to domain/entities)

**Current Location**: `src/entities/`
**Target Location**: `src/modules/<domain>/domain/entities/`

| File                      | Target Module    | Action                                        |
| ------------------------- | ---------------- | --------------------------------------------- |
| `User.ts`                 | `user`           | Move and rename to `user.entity.ts`           |
| `Project.ts`              | `project`        | Move and rename to `project.entity.ts`        |
| `Organization.ts`         | `organization`   | Move and rename to `organization.entity.ts`   |
| `Volunteer.ts`            | `volunteer`      | Move and rename to `volunteer.entity.ts`      |
| `NFT.ts`                  | `nft`            | Move and rename to `nft.entity.ts`            |
| `Photo.ts`                | `photo`          | Move and rename to `photo.entity.ts`          |
| `userVolunteer.entity.ts` | `user-volunteer` | Move and rename to `user-volunteer.entity.ts` |
| `BaseEntity.ts`           | `shared`         | Move to `shared/domain/entities/`             |
| `Entity.ts`               | `shared`         | Move to `shared/domain/entities/`             |
| `TestItem.ts`             | `testing`        | Move to `testing/domain/entities/` or delete  |

### 4. Routes (Move to presentation/routes)

**Current Location**: `src/routes/`
**Target Location**: `src/modules/<domain>/presentation/routes/`

| File                    | Target Module  | Action                                      |
| ----------------------- | -------------- | ------------------------------------------- |
| `authRoutes.ts`         | `auth`         | Move and rename to `auth.routes.ts`         |
| `userRoutes.ts`         | `user`         | Move and rename to `user.routes.ts`         |
| `ProjectRoutes.ts`      | `project`      | Move and rename to `project.routes.ts`      |
| `OrganizationRoutes.ts` | `organization` | Move and rename to `organization.routes.ts` |
| `VolunteerRoutes.ts`    | `volunteer`    | Move and rename to `volunteer.routes.ts`    |
| `nftRoutes.ts`          | `nft`          | Move and rename to `nft.routes.ts`          |
| `certificatesRoutes.ts` | `certificate`  | Move and rename to `certificate.routes.ts`  |

### 5. DTOs (Move to presentation/dto)

**Current Location**: `src/dtos/`
**Target Location**: `src/modules/<domain>/presentation/dto/`

| File                       | Target Module | Action                                          |
| -------------------------- | ------------- | ----------------------------------------------- |
| `emailVerification.dto.ts` | `auth`        | Move and rename to `email-verification.dto.ts`  |
| `resendVerificationDTO.ts` | `auth`        | Move and rename to `resend-verification.dto.ts` |
| `verifyEmailDTO.ts`        | `auth`        | Move and rename to `verify-email.dto.ts`        |

### 6. Use Cases (Move to application/use-cases)

**Current Location**: `src/useCase/`
**Target Location**: `src/modules/<domain>/application/use-cases/`

| File                              | Target Module | Action                                                    |
| --------------------------------- | ------------- | --------------------------------------------------------- |
| `emailVerificationUsecase.ts`     | `auth`        | Move and rename to `email-verification.usecase.ts`        |
| `resendEmailVericationUseCase.ts` | `auth`        | Move and rename to `resend-email-verification.usecase.ts` |

### 7. Repositories (Move to infrastructure/repositories)

**Current Location**: `src/repository/`
**Target Location**: `src/modules/<domain>/infrastructure/repositories/`

| File                  | Target Module | Action                                             |
| --------------------- | ------------- | -------------------------------------------------- |
| `PhotoRepository.ts`  | `photo`       | Move and rename to `photo.repository.ts`           |
| `user.repository.ts`  | `user`        | Move and rename to `user.repository.ts`            |
| `IPhotoRepository.ts` | `photo`       | Move and rename to `photo-repository.interface.ts` |
| `IUserRepository.ts`  | `user`        | Move and rename to `user-repository.interface.ts`  |

### 8. Middlewares (Move to presentation/middlewares)

**Current Location**: `src/middleware/` and `src/middlewares/`
**Target Location**: `src/modules/<domain>/presentation/middlewares/` or `src/shared/infrastructure/middlewares/`

| File                          | Target Module | Action                                       |
| ----------------------------- | ------------- | -------------------------------------------- |
| `authMiddleware.ts`           | `auth`        | Move and rename to `auth.middleware.ts`      |
| `rateLimitMiddleware.ts`      | `shared`      | Move to `shared/infrastructure/middlewares/` |
| `auth.middleware.ts`          | `auth`        | Move and rename to `auth.middleware.ts`      |
| `dbPerformanceMiddleware.ts`  | `shared`      | Move to `shared/infrastructure/middlewares/` |
| `errorHandler.ts`             | `shared`      | Move to `shared/infrastructure/middlewares/` |
| `rateLimit.middleware.ts`     | `shared`      | Move to `shared/infrastructure/middlewares/` |
| `requestLogger.middleware.ts` | `shared`      | Move to `shared/infrastructure/middlewares/` |
| `traceId.middleware.ts`       | `shared`      | Move to `shared/infrastructure/middlewares/` |

### 9. Tests (Move to **tests**)

**Current Location**: `src/tests/` and `tests/`
**Target Location**: `src/modules/<domain>/__tests__/`

| File           | Target Module      | Action                                       |
| -------------- | ------------------ | -------------------------------------------- |
| All test files | Respective modules | Move to appropriate `__tests__/` directories |

### 10. Types (Move to shared or modules)

**Current Location**: `src/types/`
**Target Location**: `src/shared/domain/types/` or `src/modules/<domain>/domain/types/`

| File            | Target Module | Action                         |
| --------------- | ------------- | ------------------------------ |
| `auth.types.ts` | `auth`        | Move to `auth/domain/types/`   |
| `redis.d.ts`    | `shared`      | Move to `shared/domain/types/` |
| `express/`      | `shared`      | Move to `shared/domain/types/` |

### 11. Utils (Move to shared)

**Current Location**: `src/utils/`
**Target Location**: `src/shared/infrastructure/utils/`

| File                    | Target Module | Action                                 |
| ----------------------- | ------------- | -------------------------------------- |
| `asyncHandler.ts`       | `shared`      | Move to `shared/infrastructure/utils/` |
| `cron.ts`               | `shared`      | Move to `shared/infrastructure/utils/` |
| `db-monitor.ts`         | `shared`      | Move to `shared/infrastructure/utils/` |
| `email.utils.ts`        | `shared`      | Move to `shared/infrastructure/utils/` |
| `logger.ts`             | `shared`      | Move to `shared/infrastructure/utils/` |
| `transaction.helper.ts` | `shared`      | Move to `shared/infrastructure/utils/` |

### 12. Errors (Move to shared)

**Current Location**: `src/errors/`
**Target Location**: `src/shared/domain/exceptions/`

| File                            | Target Module | Action                                 |
| ------------------------------- | ------------- | -------------------------------------- |
| `index.ts`                      | `shared`      | Move to `shared/domain/exceptions/`    |
| `VolunteerRegistrationError.ts` | `volunteer`   | Move to `volunteer/domain/exceptions/` |

## 🏗️ New Module Structure

### Required New Modules

1. **organization** - Organization management
2. **certificate** - Certificate generation and management
3. **user-volunteer** - User-volunteer relationship management
4. **blockchain** - Blockchain operations (Soroban, Stellar)
5. **testing** - Testing utilities and helpers

### Module Structure Template

Each module must follow this structure:

```
src/modules/<domain>/
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── interfaces/
│   └── exceptions/
├── application/
│   ├── services/
│   ├── use-cases/
│   └── interfaces/
├── infrastructure/
│   ├── repositories/
│   ├── services/
│   └── adapters/
├── presentation/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── dto/
└── README.md
```

## 🔧 Implementation Steps

### Phase 1: Foundation

1. ✅ Update CONTRIBUTING.md with strict standards
2. ✅ Update README.md with new architecture
3. Create REFACTORING_PLAN.md (this document)
4. Create module README templates

### Phase 2: Module Creation

1. Create missing modules (organization, certificate, user-volunteer, blockchain)
2. Move files to their correct locations
3. Update imports and references
4. Fix naming conventions

### Phase 3: Code Quality

1. Add class-validator decorators to all DTOs
2. Implement proper error handling
3. Add comprehensive tests
4. Update documentation

### Phase 4: Validation

1. Run all tests
2. Check code coverage
3. Validate architecture compliance
4. Performance testing

## 🚨 Critical Issues to Fix

1. **Inconsistent naming**: Files use different naming conventions
2. **Missing validation**: DTOs lack proper validation decorators
3. **Poor separation**: Business logic mixed with presentation logic
4. **Incomplete testing**: Many modules lack comprehensive tests
5. **Documentation gaps**: Missing module documentation

## 📊 Success Metrics

- [ ] All files moved to correct module locations
- [ ] 100% of DTOs have class-validator decorators
- [ ] 80%+ test coverage per module
- [ ] All modules have comprehensive README files
- [ ] No business logic in controllers
- [ ] Consistent naming conventions throughout
- [ ] All imports updated and working
- [ ] Zero linting errors
- [ ] All tests passing

## 🎯 Next Steps

1. Start with the `auth` module as it's most critical
2. Move files systematically, one module at a time
3. Update imports and fix references
4. Add proper validation and error handling
5. Write comprehensive tests
6. Create module documentation
7. Repeat for all modules

---

**Remember**: This is production software. Every change must maintain functionality while improving architecture.
