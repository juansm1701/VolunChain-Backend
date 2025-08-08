import { Request, Response } from "express";

// imports for DTO validator
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

// Necessary DTOs
import { RegisterDto } from "../../dto/register.dto";
import { LoginDto } from "../../dto/login.dto";
import { ResendVerificationDTO } from "../../dto/resendVerificationDTO";
import {
  VerifyWalletDto,
  ValidateWalletFormatDto,
} from "../../dto/wallet-validation.dto";

// Use cases
import { PrismaUserRepository } from "../../../user/repositories/PrismaUserRepository";
import { SendVerificationEmailUseCase } from "../../use-cases/send-verification-email.usecase";
import { ResendVerificationEmailUseCase } from "../../use-cases/resend-verification-email.usecase";
import { VerifyEmailUseCase } from "../../use-cases/verify-email.usecase";

const userRepository = new PrismaUserRepository();
const sendVerificationEmailUseCase = new SendVerificationEmailUseCase(
  userRepository
);
const resendVerificationEmailUseCase = new ResendVerificationEmailUseCase(
  userRepository
);
const verifyEmailUseCase = new VerifyEmailUseCase(userRepository);

// DTO validator
async function validateOr400<T>(
  Cls: new () => T,
  payload: unknown,
  res: Response
): Promise<T | undefined> {
  const dto = plainToInstance(Cls, payload);
  const errors = await validate(dto as object, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  // dto not verified, throw a Bad Request
  if (errors.length) {
    res.status(400).json({ message: "Validation failed", errors });
    return;
  }

  return dto;
}

const register = async (req: Request, res: Response) => {
  const dto = await validateOr400(RegisterDto, req.body, res);
  if (!dto) return;

  try {
    // Send verification email to provided address
    await sendVerificationEmailUseCase.execute({ email: dto.email });
    res.status(200).json({ message: "Verification email sent" });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to send verification email";
    const status = message === "User not found" ? 400 : 500;
    res.status(status).json({ error: message });
  }
};

const login = async (req: Request, res: Response) => {
  const dto = await validateOr400(LoginDto, req.body, res);
  if (!dto) return;

  // TODO: Implement Wallet auth logic as a use case
  res.status(501).json({
    message: "Login service temporarily disabled",
    error: "Wallet auth logic not implemented yet",
  });
};

const resendVerificationEmail = async (req: Request, res: Response) => {
  const dto = await validateOr400(ResendVerificationDTO, req.body, res);
  if (!dto) return;

  try {
    // Resends verification email to provided address
    await resendVerificationEmailUseCase.execute({ email: dto.email });
    res.status(200).json({ message: "Verification email resent" });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to resend verification email";
    const status = message === "User not found" ? 404 : 500;
    res.status(status).json({ error: message });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const tokenParam =
    typeof req.params.token === "string" ? req.params.token : undefined;
  const tokenQuery =
    typeof req.query.token === "string"
      ? (req.query.token as string)
      : undefined;
  const token = tokenParam || tokenQuery;

  // if token is not given in the request
  if (!token) {
    res
      .status(400)
      .json({
        success: false,
        message: "Token in URL is required",
        verified: false,
      });
    return;
  }

  try {
    // Verifies email using use case
    const result = await verifyEmailUseCase.execute({ token });
    const status = result.success ? 200 : 400;
    res.status(status).json(result);
  } catch {
    res
      .status(400)
      .json({
        success: false,
        message: "Invalid or expired verification token",
        verified: false,
      });
  }
};

const verifyWallet = async (req: Request, res: Response) => {
  const dto = await validateOr400(VerifyWalletDto, req.body, res);
  if (!dto) return;

  // TODO: add logic for verifying wallet
  res.status(501).json({
    message: "Wallet verification temporarily disabled",
    error: "Wallet verification not implemented yet",
  });
};

const validateWalletFormat = async (req: Request, res: Response) => {
  const dto = await validateOr400(ValidateWalletFormatDto, req.body, res);
  if (!dto) return;

  // TODO: add logic for validation of wallet format
  res.status(501).json({
    message: "Wallet format validation temporarily disabled",
    error: "Wallet format validation not implemented yet",
  });
};

export default {
  register,
  login,
  resendVerificationEmail,
  verifyEmail,
  verifyWallet,
  validateWalletFormat,
};
