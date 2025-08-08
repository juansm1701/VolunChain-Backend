import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidateWalletFormatDto } from "../dto/wallet-validation.dto";

type WalletFormatValidationResult = {
  valid: boolean;
  errors?: string[];
};

export class ValidateWalletFormatUseCase {
  async execute(input: unknown): Promise<WalletFormatValidationResult> {
    const dto = plainToInstance(ValidateWalletFormatDto, input);
    const errors = await validate(dto as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length) {
      const messages = errors.flatMap((e) =>
        Object.values(e.constraints ?? {})
      );
      return { valid: false, errors: messages };
    }
    return { valid: true };
  }
}
