import { WalletService } from "../../application/services/WalletService";
import { HorizonWalletRepository } from "../../repositories/HorizonWalletRepository";
import { VerifyWalletUseCase } from "../../use-cases/VerifyWalletUseCase";
import { ValidateWalletFormatUseCase } from "../../use-cases/ValidateWalletFormatUseCase";
import { WalletVerificationRequestDto } from "../../dto/WalletVerificationRequestDto";
import { WalletVerificationResponseDto } from "../../dto/WalletVerificationResponseDto";

jest.mock("../../repositories/HorizonWalletRepository");
jest.mock("../../use-cases/VerifyWalletUseCase");
jest.mock("../../use-cases/ValidateWalletFormatUseCase");

describe("WalletService", () => {
  let walletService: WalletService;
  let mockHorizonWalletRepository: jest.Mocked<HorizonWalletRepository>;
  let mockVerifyWalletUseCase: jest.Mocked<VerifyWalletUseCase>;
  let mockValidateWalletFormatUseCase: jest.Mocked<ValidateWalletFormatUseCase>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockHorizonWalletRepository = new HorizonWalletRepository() as jest.Mocked<HorizonWalletRepository>;
    mockVerifyWalletUseCase = new VerifyWalletUseCase(mockHorizonWalletRepository) as jest.Mocked<VerifyWalletUseCase>;
    mockValidateWalletFormatUseCase = new ValidateWalletFormatUseCase() as jest.Mocked<ValidateWalletFormatUseCase>;

    walletService = new WalletService();
    (walletService as any).walletRepository = mockHorizonWalletRepository;
    (walletService as any).verifyWalletUseCase = mockVerifyWalletUseCase;
    (walletService as any).validateWalletFormatUseCase = mockValidateWalletFormatUseCase;
  });

  describe("validateWalletFormat", () => {
    it("should validate wallet format successfully", async () => {
      const walletAddress = "GCKFBEIYTKP5RHGR4QJQW2PCYXA4MFDBBHC6VQM7Z6N2XYW7TGNXLR3Z";
      const expectedResponse: WalletVerificationResponseDto = {
        success: true,
        isValid: true,
        walletAddress,
        message: "Wallet format is valid",
      };

      mockValidateWalletFormatUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await walletService.validateWalletFormat(walletAddress);

      expect(result).toEqual(expectedResponse);
      expect(mockValidateWalletFormatUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          walletAddress,
        })
      );
    });

    it("should return invalid format response for invalid wallet", async () => {
      const walletAddress = "invalid-wallet";
      const expectedResponse: WalletVerificationResponseDto = {
        success: false,
        isValid: false,
        walletAddress,
        message: "Invalid wallet format",
      };

      mockValidateWalletFormatUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await walletService.validateWalletFormat(walletAddress);

      expect(result).toEqual(expectedResponse);
      expect(mockValidateWalletFormatUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          walletAddress,
        })
      );
    });
  });

  describe("verifyWallet", () => {
    it("should verify wallet successfully", async () => {
      const walletAddress = "GCKFBEIYTKP5RHGR4QJQW2PCYXA4MFDBBHC6VQM7Z6N2XYW7TGNXLR3Z";
      const expectedResponse: WalletVerificationResponseDto = {
        success: true,
        isValid: true,
        walletAddress,
        message: "Wallet is valid and exists on network",
      };

      mockVerifyWalletUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await walletService.verifyWallet(walletAddress);

      expect(result).toEqual(expectedResponse);
      expect(mockVerifyWalletUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          walletAddress,
        })
      );
    });

    it("should return invalid response for non-existent wallet", async () => {
      const walletAddress = "GCKFBEIYTKP5RHGR4QJQW2PCYXA4MFDBBHC6VQM7Z6N2XYW7TGNXLR3Z";
      const expectedResponse: WalletVerificationResponseDto = {
        success: false,
        isValid: false,
        walletAddress,
        message: "Wallet does not exist on network",
      };

      mockVerifyWalletUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await walletService.verifyWallet(walletAddress);

      expect(result).toEqual(expectedResponse);
      expect(mockVerifyWalletUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          walletAddress,
        })
      );
    });
  });

  describe("isWalletValid", () => {
    it("should return true for valid wallet", async () => {
      const walletAddress = "GCKFBEIYTKP5RHGR4QJQW2PCYXA4MFDBBHC6VQM7Z6N2XYW7TGNXLR3Z";
      const mockResponse: WalletVerificationResponseDto = {
        success: true,
        isValid: true,
        walletAddress,
        message: "Wallet is valid",
      };

      mockVerifyWalletUseCase.execute.mockResolvedValue(mockResponse);

      const result = await walletService.isWalletValid(walletAddress);

      expect(result).toBe(true);
      expect(mockVerifyWalletUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          walletAddress,
        })
      );
    });

    it("should return false for invalid wallet", async () => {
      const walletAddress = "invalid-wallet";
      const mockResponse: WalletVerificationResponseDto = {
        success: false,
        isValid: false,
        walletAddress,
        message: "Wallet is invalid",
      };

      mockVerifyWalletUseCase.execute.mockResolvedValue(mockResponse);

      const result = await walletService.isWalletValid(walletAddress);

      expect(result).toBe(false);
    });

    it("should return false when verification throws error", async () => {
      const walletAddress = "GCKFBEIYTKP5RHGR4QJQW2PCYXA4MFDBBHC6VQM7Z6N2XYW7TGNXLR3Z";

      mockVerifyWalletUseCase.execute.mockRejectedValue(new Error("Network error"));

      const result = await walletService.isWalletValid(walletAddress);

      expect(result).toBe(false);
    });

    it("should return false when success is true but isValid is false", async () => {
      const walletAddress = "GCKFBEIYTKP5RHGR4QJQW2PCYXA4MFDBBHC6VQM7Z6N2XYW7TGNXLR3Z";
      const mockResponse: WalletVerificationResponseDto = {
        success: true,
        isValid: false,
        walletAddress,
        message: "Wallet format is valid but does not exist",
      };

      mockVerifyWalletUseCase.execute.mockResolvedValue(mockResponse);

      const result = await walletService.isWalletValid(walletAddress);

      expect(result).toBe(false);
    });
  });
});