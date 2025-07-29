import { Request, Response } from "express";

/**
 * Stub controller for Auth functionality
 * This replaces the original controller that referenced deleted services
 * TODO: Implement proper auth controller using new modular architecture
 */
class AuthController {
  async register(req: Request, res: Response) {
    res.status(501).json({
      message: "Auth service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async login(req: Request, res: Response) {
    res.status(501).json({
      message: "Auth service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async resendVerificationEmail(req: Request, res: Response) {
    res.status(501).json({
      message: "Auth service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async verifyEmail(req: Request, res: Response) {
    res.status(501).json({
      message: "Auth service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async verifyWallet(req: Request, res: Response) {
    res.status(501).json({
      message: "Auth service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async validateWalletFormat(req: Request, res: Response) {
    res.status(501).json({
      message: "Auth service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }
}

export default new AuthController();