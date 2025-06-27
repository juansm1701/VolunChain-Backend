# Certificate Module

## Overview

The Certificate module handles the generation, management, and verification of volunteer certificates. This module integrates with blockchain technology to create verifiable, tamper-proof certificates for completed volunteer work.

## Architecture

### Domain Layer (`domain/`)

- **Entities**: Certificate domain entities with business rules
- **Value Objects**: Certificate-specific value objects (CertificateId, IssuerInfo, etc.)
- **Interfaces**: Domain service interfaces and repository contracts
- **Exceptions**: Certificate-specific domain exceptions

### Application Layer (`application/`)

- **Services**: Application services for certificate operations
- **Use Cases**: Business use cases (GenerateCertificate, VerifyCertificate, etc.)
- **Interfaces**: Application service interfaces

### Infrastructure Layer (`infrastructure/`)

- **Repositories**: Prisma-based repository implementations
- **Services**: External service integrations (PDF generation, blockchain, etc.)
- **Adapters**: External system adapters

### Presentation Layer (`presentation/`)

- **Controllers**: HTTP controllers for certificate endpoints
- **Routes**: Express routes for certificate API
- **Middlewares**: Certificate-specific middlewares
- **DTOs**: Data Transfer Objects with validation

## Development

### Adding New Features

1. **Domain Changes**

   - Update entities in `domain/entities/`
   - Add value objects in `domain/value-objects/`
   - Define interfaces in `domain/interfaces/`
   - Add exceptions in `domain/exceptions/`

2. **Application Logic**

   - Create use cases in `application/use-cases/`
   - Implement services in `application/services/`
   - Define interfaces in `application/interfaces/`

3. **Infrastructure**

   - Update repositories in `infrastructure/repositories/`
   - Add external services in `infrastructure/services/`
   - Implement adapters in `infrastructure/adapters/`

4. **Presentation**

   - Add controllers in `presentation/controllers/`
   - Create routes in `presentation/routes/`
   - Define DTOs in `presentation/dto/`
   - Add middlewares in `presentation/middlewares/`

5. **Testing**
   - Write unit tests in `__tests__/unit/`
   - Add integration tests in `__tests__/integration/`
   - Create e2e tests in `__tests__/e2e/`

### Testing

```bash
# Run all certificate module tests
npm test -- --testPathPattern=modules/certificate

# Run specific test types
npm test -- --testPathPattern=modules/certificate/__tests__/unit
npm test -- --testPathPattern=modules/certificate/__tests__/integration
npm test -- --testPathPattern=modules/certificate/__tests__/e2e
```

### API Endpoints

#### Certificate Management

- `POST /api/v1/certificates` - Generate new certificate
- `GET /api/v1/certificates/:id` - Get certificate by ID
- `GET /api/v1/certificates/user/:userId` - Get user's certificates
- `DELETE /api/v1/certificates/:id` - Revoke certificate

#### Certificate Verification

- `GET /api/v1/certificates/:id/verify` - Verify certificate authenticity
- `POST /api/v1/certificates/:id/verify` - Verify certificate with blockchain

#### Certificate Download

- `GET /api/v1/certificates/:id/download` - Download certificate as PDF
- `GET /api/v1/certificates/:id/qr` - Get certificate QR code

### DTOs

All API requests and responses use DTOs with `class-validator` decorators:

```typescript
// GenerateCertificateDto
export class GenerateCertificateDto {
  @IsString()
  @IsUUID()
  volunteerId: string;

  @IsString()
  @IsUUID()
  projectId: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(1)
  hoursWorked: number;

  @IsDateString()
  completionDate: string;
}
```

### Error Handling

The module uses domain-specific exceptions:

```typescript
export class CertificateNotFoundException extends DomainException {
  constructor(certificateId: string) {
    super(`Certificate with ID ${certificateId} not found`);
  }
}

export class CertificateAlreadyExistsException extends DomainException {
  constructor(volunteerId: string, projectId: string) {
    super(
      `Certificate already exists for volunteer ${volunteerId} and project ${projectId}`
    );
  }
}

export class CertificateVerificationFailedException extends DomainException {
  constructor(certificateId: string) {
    super(`Certificate verification failed for ID ${certificateId}`);
  }
}
```

## Dependencies

### Internal Dependencies

- **shared**: Common utilities, base entities, and exceptions
- **volunteer**: Volunteer management for certificate recipients
- **project**: Project management for certificate projects
- **organization**: Organization management for certificate issuers
- **blockchain**: Blockchain operations for certificate verification

### External Dependencies

- **Prisma**: Database ORM
- **class-validator**: DTO validation
- **pdfkit**: PDF generation
- **qrcode**: QR code generation
- **crypto**: Cryptographic operations

## Business Rules

1. **Unique Certificates**: Only one certificate per volunteer per project
2. **Project Completion**: Certificates can only be issued for completed projects
3. **Verification**: All certificates are verifiable on the blockchain
4. **Immutable**: Once issued, certificates cannot be modified
5. **Revocation**: Only organization owners can revoke certificates

## Security Considerations

- All endpoints require authentication
- Certificate generation requires organization authorization
- Blockchain verification ensures certificate authenticity
- PDF certificates include digital signatures
- QR codes link to blockchain verification

## Performance Considerations

- Certificate generation is asynchronous
- PDF generation is cached
- Blockchain verification is optimized
- Database queries use proper indexing
- File storage is optimized for downloads

## Monitoring

- All certificate operations are logged
- Blockchain transaction monitoring
- PDF generation performance tracking
- Download statistics collection
- Error tracking for failed operations

## Blockchain Integration

The certificate module integrates with blockchain technology to ensure:

- **Immutability**: Certificates cannot be tampered with
- **Verification**: Anyone can verify certificate authenticity
- **Transparency**: All certificates are publicly verifiable
- **Decentralization**: No single point of failure

### Blockchain Operations

1. **Certificate Minting**: Create NFT representation of certificate
2. **Metadata Storage**: Store certificate metadata on blockchain
3. **Verification**: Verify certificate authenticity via blockchain
4. **Revocation**: Mark certificate as revoked on blockchain
