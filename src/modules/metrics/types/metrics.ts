export interface ImpactMetrics {
  totalVolunteers: number;
  totalHours: number;
  totalProjects: number;
  averageHoursPerVolunteer: number;
  projectStatuses: {
    active: number;
    completed: number;
    archived: number;
  };
}

export interface OrganizationImpactMetrics extends ImpactMetrics {
  organizationId: string;
  organizationName: string;
}

export interface ProjectImpactMetrics {
  projectId: string;
  projectName: string;
  totalVolunteers: number;
  totalHours: number;
  startDate: Date;
  endDate: Date;
  status: string;
  volunteerBreakdown: {
    userId: string;
    userName: string;
    hoursContributed: number;
  }[];
}
