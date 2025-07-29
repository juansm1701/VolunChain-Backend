export class WalletVerification {
  public readonly walletAddress: string;
  public readonly isValid: boolean;
  public readonly accountExists: boolean;
  public readonly balance: string;
  public readonly sequence: string;
  public readonly verifiedAt: Date;
  public readonly errorMessage?: string;

  constructor(
    walletAddress: string,
    isValid: boolean,
    accountExists: boolean,
    balance: string = "0",
    sequence: string = "0",
    verifiedAt: Date = new Date(),
    errorMessage?: string
  ) {
    this.walletAddress = walletAddress;
    this.isValid = isValid;
    this.accountExists = accountExists;
    this.balance = balance;
    this.sequence = sequence;
    this.verifiedAt = verifiedAt;
    this.errorMessage = errorMessage;
  }

  public static createInvalid(
    walletAddress: string,
    errorMessage: string
  ): WalletVerification {
    return new WalletVerification(
      walletAddress,
      false,
      false,
      "0",
      "0",
      new Date(),
      errorMessage
    );
  }

  public static createValid(
    walletAddress: string,
    accountExists: boolean,
    balance: string,
    sequence: string
  ): WalletVerification {
    return new WalletVerification(
      walletAddress,
      true,
      accountExists,
      balance,
      sequence,
      new Date()
    );
  }

  public isVerified(): boolean {
    return this.isValid && this.accountExists;
  }
}
