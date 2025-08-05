import { Request, Response } from "express";

/**
 * Stub controller for UserVolunteer functionality
 * This replaces the original controller that referenced deleted services
 * TODO: Implement proper userVolunteer controller using new modular architecture
 */
class UserVolunteerController {
  async createUserVolunteer(req: Request, res: Response) {
    res.status(501).json({
      message: "UserVolunteer service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async getUserVolunteers(req: Request, res: Response) {
    res.status(501).json({
      message: "UserVolunteer service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async updateUserVolunteer(req: Request, res: Response) {
    res.status(501).json({
      message: "UserVolunteer service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async deleteUserVolunteer(req: Request, res: Response) {
    res.status(501).json({
      message: "UserVolunteer service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }
}

export default new UserVolunteerController();