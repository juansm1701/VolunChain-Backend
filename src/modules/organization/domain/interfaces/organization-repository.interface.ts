import { Organization } from "../entities/organization.entity";

export interface IOrganizationRepository {
  save(organization: Organization): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  findByEmail(email: string): Promise<Organization | null>;
  findAll(options?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<Organization[]>;
  update(id: string, organization: Organization): Promise<Organization>;
  delete(id: string): Promise<void>;
}
