import { IProjectRepository } from "../repositories/IProjectRepository";
import { Project } from "../domain/Project";

export class ListProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(organizationId?: string): Promise<Project[]> {
    if (organizationId) {
      return this.projectRepository.findByOrganizationId(organizationId);
    }
    return this.projectRepository.findAll();
  }
}
