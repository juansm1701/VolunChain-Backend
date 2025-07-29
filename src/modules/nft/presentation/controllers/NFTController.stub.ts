import { Request, Response } from "express";

/**
 * Stub controller for NFT functionality
 * This replaces the original controller that referenced deleted services
 * TODO: Implement proper NFT controller using new modular architecture
 */
class NFTController {
  async createNFT(req: Request, res: Response) {
    res.status(501).json({
      message: "NFT service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async getNFTById(req: Request, res: Response) {
    res.status(501).json({
      message: "NFT service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async getNFTsByUserId(req: Request, res: Response) {
    res.status(501).json({
      message: "NFT service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }

  async deleteNFT(req: Request, res: Response) {
    res.status(501).json({
      message: "NFT service temporarily disabled during migration",
      error: "Service migration in progress"
    });
  }
}

export default new NFTController();