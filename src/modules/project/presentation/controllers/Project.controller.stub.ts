import { Request, Response } from "express";

/**
 * Stub controller for Project functionality
 * This replaces the original controller that referenced deleted services
 * TODO: Implement proper project controller using new modular architecture
 */
export default class ProjectController {
  async createProject(req: Request, res: Response) {
    res.status(501).json({
      message: "Project service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async getProjectById(req: Request, res: Response) {
    res.status(501).json({
      message: "Project service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async getProjectsByOrganizationId(req: Request, res: Response) {
    res.status(501).json({
      message: "Project service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async updateProject(req: Request, res: Response) {
    res.status(501).json({
      message: "Project service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async deleteProject(req: Request, res: Response) {
    res.status(501).json({
      message: "Project service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }
}