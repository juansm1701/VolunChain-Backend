import { WalletVerification } from "../entities/WalletVerification";
import { StellarAddress } from "../value-objects/StellarAddress";

export interface IWalletRepository {
  /**
   * Verifies a Stellar wallet address using Horizon API
   * @param address - The Stellar address to verify
   * @returns Promise<WalletVerification> - Verification result
   */
  verifyWallet(address: StellarAddress): Promise<WalletVerification>;

  /**
   * Checks if an account exists on the Stellar network
   * @param address - The Stellar address to check
   * @returns Promise<boolean> - True if account exists
   */
  accountExists(address: StellarAddress): Promise<boolean>;

  /**
   * Gets account details from Horizon API
   * @param address - The Stellar address to get details for
   * @returns Promise<any> - Account details from Horizon
   */
  getAccountDetails(address: StellarAddress): Promise<any>;
}
