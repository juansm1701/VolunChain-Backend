import { IsString, IsNotEmpty } from "class-validator";

export class VerifyEmailDTO {
  @IsString({ message: "Token must be a string" })
  @IsNotEmpty({ message: "Token is required" })
  token: string;
}
