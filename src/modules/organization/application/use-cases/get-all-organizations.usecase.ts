import { Organization } from "../../domain/entities/organization.entity";
import { IOrganizationRepository } from "../../domain/interfaces/organization-repository.interface";

interface GetAllOrganizationsOptions {
  page: number;
  limit: number;
  search?: string;
}

export class GetAllOrganizationsUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository
  ) {}

  async execute(options: GetAllOrganizationsOptions): Promise<Organization[]> {
    return await this.organizationRepository.findAll({
      page: options.page,
      limit: options.limit,
      search: options.search,
    });
  }
}
