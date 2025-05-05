import request from 'supertest';
import app from '../../src/index';
import { prisma } from '../../src/config/prisma';

describe('Metrics API Integration Tests', () => {
  // Limpiar la base de datos y agregar datos de prueba antes de las pruebas
  beforeAll(async () => {
    // Limpiar tablas relevantes
    await prisma.userVolunteer.deleteMany();
    await prisma.volunteer.deleteMany();
    await prisma.project.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    // Crear datos de prueba
    const organization = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        email: 'test@organization.com',
        password: 'password123',
        category: 'Test Category',
        wallet: 'test-wallet-org'
      }
    });

    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'A test project for integration tests',
        location: 'Test Location',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        status: 'active',
        organizationId: organization.id
      }
    });

    const volunteer = await prisma.volunteer.create({
      data: {
        name: 'Test Volunteer Position',
        description: 'A test volunteer position',
        requirements: 'None',
        projectId: project.id
      }
    });

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@user.com',
        password: 'password123',
        wallet: 'test-wallet-user'
      }
    });

    // Crear relación UserVolunteer con horas
    await prisma.userVolunteer.create({
      data: {
        userId: user.id,
        volunteerId: volunteer.id,
        hoursContributed: 25
      }
    });
  });

  // Limpiar la base de datos después de las pruebas
  afterAll(async () => {
    await prisma.userVolunteer.deleteMany();
    await prisma.volunteer.deleteMany();
    await prisma.project.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /metrics/impact', () => {
    it('debe retornar métricas globales correctamente', async () => {
      const response = await request(app).get('/metrics/impact');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalVolunteers');
      expect(response.body).toHaveProperty('totalHours');
      expect(response.body).toHaveProperty('totalProjects');
      expect(response.body).toHaveProperty('averageHoursPerVolunteer');
      expect(response.body).toHaveProperty('projectStatuses');

      // Verificar valores esperados
      expect(response.body.totalVolunteers).toBe(1);
      expect(response.body.totalProjects).toBe(1);
      expect(response.body.projectStatuses.active).toBe(1);
    });
  });

  describe('GET /projects/:id/impact', () => {
    it('debe retornar métricas de un proyecto específico', async () => {
      // Obtener ID del proyecto creado para pruebas
      const project = await prisma.project.findFirst();
      if (!project) {
        throw new Error('No se encontró el proyecto de prueba');
      }

      const response = await request(app).get(`/projects/${project.id}/impact`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projectId');
      expect(response.body).toHaveProperty('projectName');
      expect(response.body).toHaveProperty('totalVolunteers');
      expect(response.body).toHaveProperty('totalHours');
      expect(response.body).toHaveProperty('volunteerBreakdown');

      // Verificar valores esperados
      expect(response.body.projectId).toBe(project.id);
      expect(response.body.totalVolunteers).toBe(1);
      expect(response.body.totalHours).toBe(25);
    });

    it('debe retornar 404 para un proyecto que no existe', async () => {
      const response = await request(app).get('/projects/nonexistent-id/impact');
      expect(response.status).toBe(404);
    });
  });
}); 