import { MetricsService } from '../../src/services/MetricsService';
import { MetricsRepository } from '../../src/repository/MetricsRepository';
import { ImpactMetrics, ProjectImpactMetrics } from '../../src/types/metrics';

// Mock del repositorio de métricas
jest.mock('../../src/repository/MetricsRepository');

describe('MetricsService', () => {
  let metricsService: MetricsService;
  let mockMetricsRepository: jest.Mocked<MetricsRepository>;

  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Inicializar el servicio con el repositorio simulado
    metricsService = new MetricsService();
    
    // Acceder al repositorio mockeado dentro del servicio
    mockMetricsRepository = metricsService['metricsRepository'] as jest.Mocked<MetricsRepository>;
  });

  describe('getGlobalMetrics', () => {
    it('debe retornar las métricas globales del repositorio', async () => {
      // Datos de prueba
      const mockMetrics: ImpactMetrics = {
        totalVolunteers: 50,
        totalHours: 500,
        totalProjects: 10,
        averageHoursPerVolunteer: 10,
        projectStatuses: {
          active: 5,
          completed: 3,
          archived: 2
        }
      };

      // Configurar el mock para retornar los datos de prueba
      mockMetricsRepository.getGlobalMetrics.mockResolvedValue(mockMetrics);

      // Llamar al método del servicio
      const result = await metricsService.getGlobalMetrics();

      // Verificar que el repositorio fue llamado
      expect(mockMetricsRepository.getGlobalMetrics).toHaveBeenCalledTimes(1);

      // Verificar que los datos retornados son los esperados
      expect(result).toEqual(mockMetrics);
    });
  });

  describe('getProjectMetrics', () => {
    it('debe retornar las métricas de un proyecto específico', async () => {
      // ID de proyecto de prueba
      const projectId = 'test-project-id';

      // Datos de prueba
      const mockProjectMetrics: ProjectImpactMetrics = {
        projectId,
        projectName: 'Test Project',
        totalVolunteers: 10,
        totalHours: 100,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        status: 'active',
        volunteerBreakdown: [
          {
            userId: 'user1',
            userName: 'User One',
            hoursContributed: 50
          },
          {
            userId: 'user2',
            userName: 'User Two',
            hoursContributed: 50
          }
        ]
      };

      // Configurar el mock para retornar los datos de prueba
      mockMetricsRepository.getProjectMetrics.mockResolvedValue(mockProjectMetrics);

      // Llamar al método del servicio
      const result = await metricsService.getProjectMetrics(projectId);

      // Verificar que el repositorio fue llamado con el ID correcto
      expect(mockMetricsRepository.getProjectMetrics).toHaveBeenCalledWith(projectId);

      // Verificar que los datos retornados son los esperados
      expect(result).toEqual(mockProjectMetrics);
    });

    it('debe retornar null cuando el proyecto no existe', async () => {
      // ID de proyecto inexistente
      const projectId = 'non-existent-project';

      // Configurar el mock para retornar null
      mockMetricsRepository.getProjectMetrics.mockResolvedValue(null);

      // Llamar al método del servicio
      const result = await metricsService.getProjectMetrics(projectId);

      // Verificar que el repositorio fue llamado con el ID correcto
      expect(mockMetricsRepository.getProjectMetrics).toHaveBeenCalledWith(projectId);

      // Verificar que se retorna null
      expect(result).toBeNull();
    });
  });

  // Pruebas adicionales podrían incluir verificación de caché, errores, etc.
}); 