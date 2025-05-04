import { Router } from 'express';
import { MetricsController } from '../controllers/MetricsController';
import { optionalAuthMiddleware } from '../middlewares/auth.middleware';
import { rateLimiterMiddleware } from '../middlewares/rateLimit.middleware';

const router = Router();
const metricsController = new MetricsController();

// Aplicar rate limiting a todas las rutas de métricas
router.use(rateLimiterMiddleware);

// Aplicar autenticación opcional para permitir acceso público a las métricas
router.use(optionalAuthMiddleware);

// GET /metrics/impact - Métricas globales
router.get('/impact', async (req, res) => {
  await metricsController.getGlobalMetrics(req, res);
});

// GET /projects/:id/impact - Métricas de un proyecto específico
router.get('/projects/:id/impact', async (req, res) => {
  await metricsController.getProjectMetrics(req, res);
});

// GET /organizations/:id/impact - Métricas de una organización específica
router.get('/organizations/:id/impact', async (req, res) => {
  await metricsController.getOrganizationMetrics(req, res);
});

export default router; 