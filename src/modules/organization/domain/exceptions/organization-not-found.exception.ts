import { DomainException } from "../../../shared/domain/exceptions/domain.exception";

export class OrganizationNotFoundException extends DomainException {
  constructor(organizationId: string) {
    super(`Organization with ID ${organizationId} not found`);
  }
}
