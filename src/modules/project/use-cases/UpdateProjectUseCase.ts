import { IProjectRepository } from '../repositories/IProjectRepository';
import { Project } from '../domain/Project';
import { UpdateProjectDto } from '../dto/UpdateProjectDto';

export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    
    if (!project) {
      throw new Error('Project not found');
    }

    project.update(dto);
    return this.projectRepository.update(project);
  }
} 