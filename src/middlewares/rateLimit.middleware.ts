import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Middleware para limitar la tasa de solicitudes a la API de métricas
 * para evitar abusos y garantizar la disponibilidad del servicio.
 */
export const rateLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar cada IP a 100 solicitudes por ventana
  standardHeaders: true, // Devolver límite de tasa en encabezados `RateLimit-*`
  legacyHeaders: false, // Deshabilitar encabezados `X-RateLimit-*`
  message: {
    error: 'Demasiadas solicitudes, por favor intente de nuevo más tarde.'
  },
  // Determinar el límite en función de si el usuario está autenticado o no
  keyGenerator: (req: Request) => {
    return (req as any).user?.id 
      ? `auth_${(req as any).user.id}` // Usuarios autenticados tienen un límite por ID
      : req.ip || 'unknown'; // Usuarios no autenticados tienen un límite por IP
  }
}); 