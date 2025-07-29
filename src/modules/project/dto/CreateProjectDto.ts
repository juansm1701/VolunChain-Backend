import { ProjectStatus } from "../domain/Project";

export interface CreateProjectDto {
  title: string;
  description: string;
  organizationId: string;
  status?: ProjectStatus;
}
