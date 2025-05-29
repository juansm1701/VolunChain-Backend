import { VerifyWalletUseCase } from '../use-cases/VerifyWalletUseCase';
import { IWalletRepository } from '../domain/interfaces/IWalletRepository';
import { WalletVerification } from '../domain/entities/WalletVerification';
import { StellarAddress } from '../domain/value-objects/StellarAddress';
import { WalletVerificationRequestDto } from '../dto/WalletVerificationRequestDto';

// Mock the wallet repository
const mockWalletRepository: jest.Mocked<IWalletRepository> = {
  verifyWallet: jest.fn(),
  accountExists: jest.fn(),
  getAccountDetails: jest.fn(),
};

describe('VerifyWalletUseCase', () => {
  let useCase: VerifyWalletUseCase;
  const validWalletAddress = 'GCKFBEIYTKP5RDBQMUTAPDCFZDFNVTQNXUCUZMAQYVWLQHTQBDKTQRQY';

  beforeEach(() => {
    useCase = new VerifyWalletUseCase(mockWalletRepository);
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return successful verification for valid wallet with existing account', async () => {
      const mockVerification = WalletVerification.createValid(
        validWalletAddress,
        true,
        '100.0000000',
        '123456789'
      );

      mockWalletRepository.verifyWallet.mockResolvedValue(mockVerification);

      const dto = new WalletVerificationRequestDto(validWalletAddress);
      const result = await useCase.execute(dto);

      expect(result.success).toBe(true);
      expect(result.walletAddress).toBe(validWalletAddress);
      expect(result.isValid).toBe(true);
      expect(result.accountExists).toBe(true);
      expect(result.balance).toBe('100.0000000');
      expect(result.sequence).toBe('123456789');
      expect(result.message).toBe('Wallet verified successfully');
      expect(mockWalletRepository.verifyWallet).toHaveBeenCalledWith(
        expect.any(StellarAddress)
      );
    });

    it('should return successful verification for valid wallet without existing account', async () => {
      const mockVerification = WalletVerification.createValid(
        validWalletAddress,
        false,
        '0',
        '0'
      );

      mockWalletRepository.verifyWallet.mockResolvedValue(mockVerification);

      const dto = new WalletVerificationRequestDto(validWalletAddress);
      const result = await useCase.execute(dto);

      expect(result.success).toBe(true);
      expect(result.walletAddress).toBe(validWalletAddress);
      expect(result.isValid).toBe(true);
      expect(result.accountExists).toBe(false);
      expect(result.balance).toBe('0');
      expect(result.sequence).toBe('0');
      expect(result.message).toBe('Wallet verification failed');
    });

    it('should return error for invalid wallet address format', async () => {
      const invalidAddress = 'invalid-wallet-address';
      const dto = new WalletVerificationRequestDto(invalidAddress);
      
      const result = await useCase.execute(dto);

      expect(result.success).toBe(false);
      expect(result.walletAddress).toBe(invalidAddress);
      expect(result.isValid).toBe(false);
      expect(result.accountExists).toBe(false);
      expect(result.message).toBe('Invalid Stellar address format');
      expect(mockWalletRepository.verifyWallet).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      const errorMessage = 'Network error';
      mockWalletRepository.verifyWallet.mockRejectedValue(new Error(errorMessage));

      const dto = new WalletVerificationRequestDto(validWalletAddress);
      const result = await useCase.execute(dto);

      expect(result.success).toBe(false);
      expect(result.walletAddress).toBe(validWalletAddress);
      expect(result.isValid).toBe(false);
      expect(result.accountExists).toBe(false);
      expect(result.message).toBe(errorMessage);
      expect(result.errorDetails).toBe(errorMessage);
    });

    it('should handle unknown errors gracefully', async () => {
      mockWalletRepository.verifyWallet.mockRejectedValue('Unknown error');

      const dto = new WalletVerificationRequestDto(validWalletAddress);
      const result = await useCase.execute(dto);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Wallet verification failed');
    });
  });
});
