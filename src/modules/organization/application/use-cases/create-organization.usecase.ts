import { CreateOrganizationDto } from "../../presentation/dto/create-organization.dto";
import { Organization } from "../../domain/entities/organization.entity";
import { IOrganizationRepository } from "../../domain/interfaces/organization-repository.interface";
import { randomUUID } from "crypto";

export class CreateOrganizationUseCase {
  constructor(
    private readonly organizationRepository: IOrganizationRepository
  ) {}

  async execute(dto: CreateOrganizationDto): Promise<Organization> {
    const organizationProps = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      description: dto.description,
      category: dto.category,
      website: dto.website,
      address: dto.address,
      phone: dto.phone,
      isVerified: false,
    };

    const organization = Organization.create(organizationProps);

    return await this.organizationRepository.save(organization);
  }
}
