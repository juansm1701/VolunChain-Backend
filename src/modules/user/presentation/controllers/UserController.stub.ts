import { Request, Response } from "express";

/**
 * Stub controller for User functionality
 * This replaces the original controller that referenced deleted services
 * TODO: Implement proper user controller using new modular architecture
 */
export default class UserController {
  async createUser(req: Request, res: Response) {
    res.status(501).json({
      message: "User service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async getUserById(req: Request, res: Response) {
    res.status(501).json({
      message: "User service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async getUserByEmail(req: Request, res: Response) {
    res.status(501).json({
      message: "User service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async updateUser(req: Request, res: Response) {
    res.status(501).json({
      message: "User service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async deleteUser(req: Request, res: Response) {
    res.status(501).json({
      message: "User service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }
}