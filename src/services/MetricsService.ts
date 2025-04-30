import { MetricsRepository } from '../repository/MetricsRepository';
import { ImpactMetrics, OrganizationImpactMetrics, ProjectImpactMetrics } from '../types/metrics';
import { createClient } from 'redis';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export class MetricsService {
  private metricsRepository: MetricsRepository;
  private redisClient: any;
  private CACHE_TTL = 24 * 60 * 60; // 24 horas en segundos

  constructor() {
    this.metricsRepository = new MetricsRepository();
    this.redisClient = null;
    
    // Inicializar cliente Redis si está disponible en el entorno
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redisClient = createClient({ url: redisUrl });
      this.redisClient.connect().catch((err: Error) => {
        console.error('Redis connection error:', err);
        this.redisClient = null;
      });
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      this.redisClient = null;
    }
  }

  /**
   * Obtiene métricas globales de impacto
   */
  async getGlobalMetrics(): Promise<ImpactMetrics> {
    // Intentar obtener de cache primero
    const cacheKey = 'global:metrics';
    
    if (this.redisClient) {
      try {
        const cachedData = await this.redisClient.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (error) {
        console.error('Redis read error:', error);
      }
    }

    // Si no está en caché o hay un error, obtener de la base de datos
    const metrics = await this.metricsRepository.getGlobalMetrics();
    
    // Guardar en caché para futuras consultas
    if (this.redisClient) {
      try {
        await this.redisClient.set(cacheKey, JSON.stringify(metrics), {
          EX: this.CACHE_TTL
        });
      } catch (error) {
        console.error('Redis write error:', error);
      }
    }

    return metrics;
  }

  /**
   * Obtiene métricas de impacto para una organización específica
   */
  async getOrganizationMetrics(organizationId: string): Promise<OrganizationImpactMetrics | null> {
    const cacheKey = `org:${organizationId}:metrics`;
    
    if (this.redisClient) {
      try {
        const cachedData = await this.redisClient.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (error) {
        console.error('Redis read error:', error);
      }
    }

    const metrics = await this.metricsRepository.getOrganizationMetrics(organizationId);
    
    if (metrics && this.redisClient) {
      try {
        await this.redisClient.set(cacheKey, JSON.stringify(metrics), {
          EX: this.CACHE_TTL
        });
      } catch (error) {
        console.error('Redis write error:', error);
      }
    }

    return metrics;
  }

  /**
   * Obtiene métricas de impacto para un proyecto específico
   */
  async getProjectMetrics(projectId: string): Promise<ProjectImpactMetrics | null> {
    const cacheKey = `project:${projectId}:metrics`;
    
    if (this.redisClient) {
      try {
        const cachedData = await this.redisClient.get(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (error) {
        console.error('Redis read error:', error);
      }
    }

    const metrics = await this.metricsRepository.getProjectMetrics(projectId);
    
    if (metrics && this.redisClient) {
      try {
        await this.redisClient.set(cacheKey, JSON.stringify(metrics), {
          EX: this.CACHE_TTL
        });
      } catch (error) {
        console.error('Redis write error:', error);
      }
    }

    return metrics;
  }

  /**
   * Actualiza el caché de métricas - puede ser llamado por una tarea programada
   */
  async refreshMetricsCache(): Promise<void> {
    try {
      // Actualizar métricas globales
      const globalMetrics = await this.metricsRepository.getGlobalMetrics();
      if (this.redisClient) {
        await this.redisClient.set('global:metrics', JSON.stringify(globalMetrics), {
          EX: this.CACHE_TTL
        });
      }

      // Aquí se podría añadir código para actualizar métricas de todas las organizaciones
      // y proyectos, pero esto podría ser costoso en términos de recursos.
      // Por lo general, es mejor actualizar sólo las métricas globales y las más accedidas.
      
      console.log('Metrics cache refreshed successfully');
    } catch (error) {
      console.error('Error refreshing metrics cache:', error);
      throw error;
    }
  }
} 