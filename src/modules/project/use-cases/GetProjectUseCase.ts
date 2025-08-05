import { IProjectRepository } from "../repositories/IProjectRepository";
import { Project } from "../domain/Project";

export class GetProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new Error("Project not found");
    }

    return project;
  }
}
