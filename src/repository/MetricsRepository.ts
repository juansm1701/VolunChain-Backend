import { PrismaClient } from '@prisma/client';
import { ImpactMetrics, OrganizationImpactMetrics, ProjectImpactMetrics } from '../types/metrics';

// Definir interfaces propias para los tipos necesarios
interface Project {
  id: string;
  name: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

interface Volunteer {
  id: string;
}

interface UserVolunteer {
  userId: string;
  volunteerId: string;
  hoursContributed: number;
  user: {
    name: string;
    lastName?: string | null;
  };
}

export class MetricsRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getGlobalMetrics(): Promise<ImpactMetrics> {
    // Obtener número total de voluntarios (relaciones únicas en UserVolunteer)
    const totalVolunteers = await this.prisma.userVolunteer.count();

    // Obtener total de horas contribuidas
    const hoursResult = await this.prisma.userVolunteer.aggregate({
      _sum: {
        hoursContributed: true
      }
    });
    const totalHours = hoursResult._sum.hoursContributed || 0;

    // Obtener total de proyectos
    const totalProjects = await this.prisma.project.count();

    // Obtener conteo de proyectos por estado
    const projectStatuses = await this.prisma.project.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    const statusCounts = {
      active: 0,
      completed: 0,
      archived: 0
    };

    projectStatuses.forEach((status: { status: string; _count: { id: number } }) => {
      if (status.status === 'active' || status.status === 'completed' || status.status === 'archived') {
        statusCounts[status.status as keyof typeof statusCounts] = status._count.id;
      }
    });

    // Calcular promedio de horas por voluntario
    const averageHoursPerVolunteer = totalVolunteers > 0 ? totalHours / totalVolunteers : 0;

    return {
      totalVolunteers,
      totalHours,
      totalProjects,
      averageHoursPerVolunteer,
      projectStatuses: statusCounts
    };
  }

  async getOrganizationMetrics(organizationId: string): Promise<OrganizationImpactMetrics | null> {
    // Obtener información de la organización
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!organization) {
      return null;
    }

    // Obtener proyectos de la organización
    const projects = await this.prisma.project.findMany({
      where: { organizationId }
    });

    const projectIds = projects.map((project: any) => project.id);

    // Obtener voluntarios en estos proyectos
    const volunteers = await this.prisma.volunteer.findMany({
      where: {
        projectId: {
          in: projectIds
        }
      }
    });

    const volunteerIds = volunteers.map((volunteer: any) => volunteer.id);

    // Obtener relaciones UserVolunteer para estos voluntarios
    const userVolunteers = await this.prisma.userVolunteer.findMany({
      where: {
        volunteerId: {
          in: volunteerIds
        }
      }
    });

    // Calcular métricas
    const totalVolunteers = userVolunteers.length;
    const totalHours = userVolunteers.reduce((sum: number, uv: any) => sum + uv.hoursContributed, 0);
    const totalProjects = projects.length;

    // Contar proyectos por estado
    const statusCounts = {
      active: 0,
      completed: 0,
      archived: 0
    };

    projects.forEach((project: any) => {
      if (project.status === 'active' || project.status === 'completed' || project.status === 'archived') {
        statusCounts[project.status as keyof typeof statusCounts]++;
      }
    });

    // Calcular promedio de horas por voluntario
    const averageHoursPerVolunteer = totalVolunteers > 0 ? totalHours / totalVolunteers : 0;

    return {
      organizationId,
      organizationName: organization.name,
      totalVolunteers,
      totalHours,
      totalProjects,
      averageHoursPerVolunteer,
      projectStatuses: statusCounts
    };
  }

  async getProjectMetrics(projectId: string): Promise<ProjectImpactMetrics | null> {
    // Obtener información del proyecto
    const project = await this.prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return null;
    }

    // Obtener voluntarios de este proyecto
    const volunteers = await this.prisma.volunteer.findMany({
      where: { projectId }
    });

    const volunteerIds = volunteers.map((volunteer: any) => volunteer.id);

    // Obtener relaciones UserVolunteer para estos voluntarios
    const userVolunteers = await this.prisma.userVolunteer.findMany({
      where: {
        volunteerId: {
          in: volunteerIds
        }
      },
      include: {
        user: true
      }
    });

    // Calcular métricas
    const totalVolunteers = userVolunteers.length;
    const totalHours = userVolunteers.reduce((sum: number, uv: any) => sum + uv.hoursContributed, 0);

    // Preparar desglose de voluntarios
    const volunteerBreakdown = userVolunteers.map((uv: UserVolunteer) => ({
      userId: uv.userId,
      userName: `${uv.user.name} ${uv.user.lastName || ''}`.trim(),
      hoursContributed: uv.hoursContributed
    }));

    return {
      projectId,
      projectName: project.name,
      totalVolunteers,
      totalHours,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      volunteerBreakdown
    };
  }
} 