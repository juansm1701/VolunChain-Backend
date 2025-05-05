import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Primero, crear o encontrar una organización
    let organization = await prisma.organization.findFirst();
    
    if (!organization) {
      console.log('Creando una organización de prueba...');
      organization = await prisma.organization.create({
        data: {
          name: 'Organización de Prueba',
          email: 'test@example.com',
          password: 'password123', // En producción debería estar hasheada
          category: 'ONG',
          wallet: 'wallet-test-' + Date.now()
        }
      });
      console.log('Organización creada:', organization);
    } else {
      console.log('Usando organización existente:', organization);
    }
    
    // Crear un proyecto
    const project = await prisma.project.create({
      data: {
        name: 'Proyecto de Prueba',
        description: 'Un proyecto para probar las métricas de impacto',
        location: 'Virtual',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días en el futuro
        organizationId: organization.id
      }
    });
    
    console.log('Proyecto creado exitosamente:', project);
    
    // Crear una posición de voluntario para este proyecto
    const volunteer = await prisma.volunteer.create({
      data: {
        name: 'Voluntario de Prueba',
        description: 'Posición para probar las métricas',
        requirements: 'Ninguno',
        projectId: project.id
      }
    });
    
    console.log('Posición de voluntario creada:', volunteer);
    
    // Opcional: Crear un usuario y asignarle horas de voluntariado
    let user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('Creando un usuario de prueba...');
      user = await prisma.user.create({
        data: {
          name: 'Usuario de Prueba',
          lastName: 'Apellido',
          email: 'user@example.com',
          password: 'password123', // En producción debería estar hasheada
          wallet: 'wallet-user-' + Date.now()
        }
      });
      console.log('Usuario creado:', user);
    } else {
      console.log('Usando usuario existente:', user);
    }
    
    // Asignar horas de voluntariado
    const userVolunteer = await prisma.userVolunteer.create({
      data: {
        userId: user.id,
        volunteerId: volunteer.id,
        hoursContributed: 10
      }
    });
    
    console.log('Horas de voluntariado asignadas:', userVolunteer);
    
  } catch (error) {
    console.error('Error al crear datos de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => console.log('Script completado exitosamente'))
  .catch(e => console.error('Error en el script:', e)); 