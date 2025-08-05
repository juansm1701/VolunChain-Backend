import { HorizonWalletRepository } from "../repositories/HorizonWalletRepository";
import { StellarAddress } from "../domain/value-objects/StellarAddress";

// Mock the @stellar/stellar-sdk
jest.mock("@stellar/stellar-sdk", () => ({
  Server: jest.fn().mockImplementation(() => ({
    accounts: jest.fn().mockReturnThis(),
    accountId: jest.fn().mockReturnThis(),
    call: jest.fn(),
  })),
  Networks: {
    PUBLIC: "Public Global Stellar Network ; September 2015",
    TESTNET: "Test SDF Network ; September 2015",
  },
}));

// Mock the horizon config
jest.mock("../../../config/horizon.config", () => ({
  horizonConfig: {
    url: "https://horizon-testnet.stellar.org",
    network: "testnet",
    timeout: 30000,
  },
}));

describe("HorizonWalletRepository", () => {
  let repository: HorizonWalletRepository;
  let mockServer: any;
  const validWalletAddress =
    "GCKFBEIYTKP5RDBQMUTAPDCFZDFNVTQNXUCUZMAQYVWLQHTQBDKTQRQY";

  beforeEach(() => {
    const { Server } = require("@stellar/stellar-sdk");
    mockServer = {
      accounts: jest.fn().mockReturnThis(),
      accountId: jest.fn().mockReturnThis(),
      call: jest.fn(),
    };
    Server.mockImplementation(() => mockServer);

    repository = new HorizonWalletRepository();
    jest.clearAllMocks();
  });

  describe("verifyWallet", () => {
    it("should return valid verification for existing account", async () => {
      const mockAccountData = {
        sequence: "123456789",
        balances: [
          { asset_type: "native", balance: "100.0000000" },
          { asset_type: "credit_alphanum4", balance: "50.0000000" },
        ],
      };

      mockServer.call.mockResolvedValue(mockAccountData);

      const stellarAddress = new StellarAddress(validWalletAddress);
      const result = await repository.verifyWallet(stellarAddress);

      expect(result.walletAddress).toBe(validWalletAddress);
      expect(result.isValid).toBe(true);
      expect(result.accountExists).toBe(true);
      expect(result.balance).toBe("100.0000000");
      expect(result.sequence).toBe("123456789");
      expect(result.errorMessage).toBeUndefined();
    });

    it("should return valid verification for non-existing account (404 error)", async () => {
      const error = new Error("Account not found");
      (error as any).response = { status: 404 };
      mockServer.call.mockRejectedValue(error);

      const stellarAddress = new StellarAddress(validWalletAddress);
      const result = await repository.verifyWallet(stellarAddress);

      expect(result.walletAddress).toBe(validWalletAddress);
      expect(result.isValid).toBe(true);
      expect(result.accountExists).toBe(false);
      expect(result.balance).toBe("0");
      expect(result.sequence).toBe("0");
      expect(result.errorMessage).toBeUndefined();
    });

    it("should return invalid verification for network errors", async () => {
      const error = new Error("Network timeout");
      mockServer.call.mockRejectedValue(error);

      const stellarAddress = new StellarAddress(validWalletAddress);
      const result = await repository.verifyWallet(stellarAddress);

      expect(result.walletAddress).toBe(validWalletAddress);
      expect(result.isValid).toBe(false);
      expect(result.accountExists).toBe(false);
      expect(result.balance).toBe("0");
      expect(result.sequence).toBe("0");
      expect(result.errorMessage).toBe(
        "Wallet verification failed: Network timeout"
      );
    });

    it("should extract native balance correctly when no native balance exists", async () => {
      const mockAccountData = {
        sequence: "123456789",
        balances: [{ asset_type: "credit_alphanum4", balance: "50.0000000" }],
      };

      mockServer.call.mockResolvedValue(mockAccountData);

      const stellarAddress = new StellarAddress(validWalletAddress);
      const result = await repository.verifyWallet(stellarAddress);

      expect(result.balance).toBe("0");
    });
  });

  describe("accountExists", () => {
    it("should return true for existing account", async () => {
      mockServer.call.mockResolvedValue({ id: validWalletAddress });

      const stellarAddress = new StellarAddress(validWalletAddress);
      const result = await repository.accountExists(stellarAddress);

      expect(result).toBe(true);
    });

    it("should return false for non-existing account", async () => {
      const error = new Error("Account not found");
      (error as any).response = { status: 404 };
      mockServer.call.mockRejectedValue(error);

      const stellarAddress = new StellarAddress(validWalletAddress);
      const result = await repository.accountExists(stellarAddress);

      expect(result).toBe(false);
    });

    it("should throw error for other network errors", async () => {
      const error = new Error("Network timeout");
      mockServer.call.mockRejectedValue(error);

      const stellarAddress = new StellarAddress(validWalletAddress);

      await expect(repository.accountExists(stellarAddress)).rejects.toThrow(
        "Network timeout"
      );
    });
  });

  describe("getAccountDetails", () => {
    it("should return account details for existing account", async () => {
      const mockAccountData = { id: validWalletAddress, sequence: "123456789" };
      mockServer.call.mockResolvedValue(mockAccountData);

      const stellarAddress = new StellarAddress(validWalletAddress);
      const result = await repository.getAccountDetails(stellarAddress);

      expect(result).toEqual(mockAccountData);
    });

    it("should return null for non-existing account", async () => {
      const error = new Error("Account not found");
      (error as any).response = { status: 404 };
      mockServer.call.mockRejectedValue(error);

      const stellarAddress = new StellarAddress(validWalletAddress);
      const result = await repository.getAccountDetails(stellarAddress);

      expect(result).toBeNull();
    });

    it("should throw error for other network errors", async () => {
      const error = new Error("Network timeout");
      mockServer.call.mockRejectedValue(error);

      const stellarAddress = new StellarAddress(validWalletAddress);

      await expect(
        repository.getAccountDetails(stellarAddress)
      ).rejects.toThrow("Network timeout");
    });
  });
});
