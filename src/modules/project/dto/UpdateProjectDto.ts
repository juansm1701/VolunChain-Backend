import { ProjectStatus } from '../domain/Project';

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  organizationId?: string;
  status?: ProjectStatus;
} 