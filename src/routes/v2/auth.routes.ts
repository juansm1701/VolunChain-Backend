import { Router } from "express";
import { validateDto } from "../../shared/middleware/validation.middleware";
import { RegisterDto } from "../../modules/auth/dto/register.dto";
import { LoginDto } from "../../modules/auth/dto/login.dto";
import { ResendVerificationDTO } from "../../modules/auth/dto/resendVerificationDTO";
import { VerifyEmailDTO } from "../../modules/auth/dto/verifyEmailDTO";
import {
  ValidateWalletFormatDto,
  VerifyWalletDto,
} from "../../modules/auth/dto/wallet-validation.dto";

const router = Router();

// Note: This is an example of how to properly integrate validation middleware
// The controller would need to be properly instantiated with dependencies

// POST /auth/register - User registration
router.post(
  "/register",
  validateDto(RegisterDto)
  // authController.register
);

// POST /auth/login - User login
router.post(
  "/login",
  validateDto(LoginDto)
  // authController.login
);

// POST /auth/resend-verification - Resend email verification
router.post(
  "/resend-verification",
  validateDto(ResendVerificationDTO)
  // authController.resendVerificationEmail
);

// POST /auth/verify-email - Verify email with token
router.post(
  "/verify-email",
  validateDto(VerifyEmailDTO)
  // authController.verifyEmail
);

// POST /auth/validate-wallet-format - Validate wallet address format
router.post(
  "/validate-wallet-format",
  validateDto(ValidateWalletFormatDto)
  // authController.validateWalletFormat
);

// POST /auth/verify-wallet - Verify wallet ownership
router.post(
  "/verify-wallet",
  validateDto(VerifyWalletDto)
  // authController.verifyWallet
);

export default router;
