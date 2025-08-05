import cron from "node-cron";
import { MetricsService } from "../modules/metrics/application/services/MetricsService";

/**
 * Clase para gestionar tareas programadas mediante cron
 */
export class CronManager {
  private metricsService: MetricsService;

  constructor() {
    this.metricsService = new MetricsService();
  }

  /**
   * Inicializa todas las tareas programadas
   */
  initCronJobs(): void {
    // Programar la tarea de actualización de métricas a la 1:00 AM todos los días
    cron.schedule("0 1 * * *", async () => {
      console.log(
        "Ejecutando tarea programada: Actualización de métricas de impacto"
      );
      try {
        await this.metricsService.refreshMetricsCache();
        console.log("Actualización de métricas completada con éxito");
      } catch (error) {
        console.error("Error al ejecutar actualización de métricas:", error);
      }
    });

    // Aquí se pueden agregar más tareas programadas en el futuro
    console.log("Tareas programadas inicializadas correctamente");
  }
}

// Exportar una instancia singleton para ser usada en toda la aplicación
export const cronManager = new CronManager();
