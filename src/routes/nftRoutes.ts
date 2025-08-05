import { Router } from "express";
import NFTController from "../modules/nft/presentation/controllers/NFTController.stub";
import {
  validateDto,
  validateParamsDto,
} from "../shared/middleware/validation.middleware";
import { CreateNFTDto } from "../modules/nft/dto/create-nft.dto";
import { UuidParamsDto } from "../shared/dto/base.dto";

const router = Router();

router.post("/nfts", validateDto(CreateNFTDto), NFTController.createNFT);

router.get(
  "/nfts/:id",
  validateParamsDto(UuidParamsDto),
  NFTController.getNFTById
);

router.get(
  "/users/:userId/nfts",
  validateParamsDto(UuidParamsDto),
  NFTController.getNFTsByUserId
);

router.delete(
  "/nfts/:id",
  validateParamsDto(UuidParamsDto),
  NFTController.deleteNFT
);

export default router;
