import { IsEmail } from "class-validator";

export class ResendVerificationDTO {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;
}
