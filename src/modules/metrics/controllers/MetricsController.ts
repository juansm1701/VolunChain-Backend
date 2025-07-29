import { Request, Response } from "express";
import { MetricsService } from "../services/MetricsService";

export class MetricsController {
  private metricsService: MetricsService;

  constructor() {
    this.metricsService = new MetricsService();
  }

  /**
   * GET /metrics/impact
   * Devuelve métricas globales de impacto
   */
  async getGlobalMetrics(req: Request, res: Response): Promise<void> {
    try {
      const metrics = await this.metricsService.getGlobalMetrics();
      res.status(200).json(metrics);
    } catch (error) {
      console.error("Error al obtener métricas globales:", error);
      res.status(500).json({ error: "Error al obtener métricas de impacto" });
    }
  }

  /**
   * GET /projects/:id/impact
   * Devuelve métricas de impacto específicas de un proyecto
   */
  async getProjectMetrics(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        res.status(400).json({ error: "ID de proyecto no proporcionado" });
        return;
      }

      const metrics = await this.metricsService.getProjectMetrics(projectId);

      if (!metrics) {
        res.status(404).json({ error: "Proyecto no encontrado" });
        return;
      }

      res.status(200).json(metrics);
    } catch (error) {
      console.error("Error al obtener métricas del proyecto:", error);
      res
        .status(500)
        .json({ error: "Error al obtener métricas de impacto del proyecto" });
    }
  }

  /**
   * GET /organizations/:id/impact
   * Devuelve métricas de impacto específicas de una organización
   */
  async getOrganizationMetrics(req: Request, res: Response): Promise<void> {
    try {
      const organizationId = req.params.id;
      if (!organizationId) {
        res.status(400).json({ error: "ID de organización no proporcionado" });
        return;
      }

      const metrics =
        await this.metricsService.getOrganizationMetrics(organizationId);

      if (!metrics) {
        res.status(404).json({ error: "Organización no encontrada" });
        return;
      }

      res.status(200).json(metrics);
    } catch (error) {
      console.error("Error al obtener métricas de la organización:", error);
      res
        .status(500)
        .json({
          error: "Error al obtener métricas de impacto de la organización",
        });
    }
  }
}
