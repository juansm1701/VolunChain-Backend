import { IsString, MinLength, MaxLength, Matches } from "class-validator";

export class ValidateWalletFormatDto {
  @IsString({ message: "Wallet address must be a string" })
  @MinLength(56, {
    message: "Stellar wallet address must be 56 characters long",
  })
  @MaxLength(56, {
    message: "Stellar wallet address must be 56 characters long",
  })
  @Matches(/^G[A-Z2-7]{55}$/, {
    message: "Invalid Stellar wallet address format",
  })
  walletAddress: string;
}

export class VerifyWalletDto {
  @IsString({ message: "Wallet address must be a string" })
  @MinLength(56, {
    message: "Stellar wallet address must be 56 characters long",
  })
  @MaxLength(56, {
    message: "Stellar wallet address must be 56 characters long",
  })
  @Matches(/^G[A-Z2-7]{55}$/, {
    message: "Invalid Stellar wallet address format",
  })
  walletAddress: string;

  @IsString({ message: "Signature must be a string" })
  signature: string;

  @IsString({ message: "Message must be a string" })
  message: string;
}
