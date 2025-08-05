// import { PrismaClient } from '@prisma/client';
// import { IProjectRepository } from './IProjectRepository';
// import { Project, ProjectStatus } from '../domain/Project';

// export class PrismaProjectRepository implements IProjectRepository {
//   constructor(private prisma: PrismaClient) {}

//   async findById(id: string): Promise<Project | null> {
//     const project = await this.prisma.project.findUnique({
//       where: { id }
//     });

//     if (!project) return null;

//     return Project.create({
//       title: project.title,
//       description: project.description,
//       organizationId: project.organizationId,
//       status: project.status as ProjectStatus
//     });
//   }

//   async findAll(): Promise<Project[]> {
//     const projects = await this.prisma.project.findMany();
//     return projects.map(project =>
//       Project.create({
//         title: project.title,
//         description: project.description,
//         organizationId: project.organizationId,
//         status: project.status as ProjectStatus
//       })
//     );
//   }

//   async findByOrganizationId(organizationId: string): Promise<Project[]> {
//     const projects = await this.prisma.project.findMany({
//       where: { organizationId }
//     });
//     return projects.map(project =>
//       Project.create({
//         title: project.title,
//         description: project.description,
//         organizationId: project.organizationId,
//         status: project.status as ProjectStatus
//       })
//     );
//   }

//   async save(project: Project): Promise<Project> {
//     const savedProject = await this.prisma.project.create({
//       data: {
//         id: project.id,
//         title: project.title,
//         description: project.description,
//         organizationId: project.organizationId,
//         status: project.status,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     });

//     return Project.create({
//       title: savedProject.title,
//       description: savedProject.description,
//       organizationId: savedProject.organizationId,
//       status: savedProject.status as ProjectStatus
//     });
//   }

//   async update(project: Project): Promise<Project> {
//     const updatedProject = await this.prisma.project.update({
//       where: { id: project.id },
//       data: {
//         title: project.title,
//         description: project.description,
//         organizationId: project.organizationId,
//         status: project.status,
//         updatedAt: new Date()
//       }
//     });

//     return Project.create({
//       title: updatedProject.title,
//       description: updatedProject.description,
//       organizationId: updatedProject.organizationId,
//       status: updatedProject.status as ProjectStatus
//     });
//   }

//   async delete(id: string): Promise<void> {
//     await this.prisma.project.delete({
//       where: { id }
//     });
//   }
// }
