import { IProjectRepository } from '../repositories/IProjectRepository';
import { Project, ProjectStatus } from '../domain/Project';
import { CreateProjectDto } from '../dto/CreateProjectDto';

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(dto: CreateProjectDto): Promise<Project> {
    const project = Project.create({
      title: dto.title,
      description: dto.description,
      organizationId: dto.organizationId,
      status: dto.status || ProjectStatus.DRAFT
    });

    return this.projectRepository.save(project);
  }
} 