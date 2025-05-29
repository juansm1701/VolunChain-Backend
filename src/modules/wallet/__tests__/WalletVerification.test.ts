import { WalletVerification } from '../domain/entities/WalletVerification';

describe('WalletVerification', () => {
  const mockWalletAddress = 'GCKFBEIYTKP5RDBQMUTAPDCFZDFNVTQNXUCUZMAQYVWLQHTQBDKTQRQY';

  describe('constructor', () => {
    it('should create a WalletVerification instance with all properties', () => {
      const verification = new WalletVerification(
        mockWalletAddress,
        true,
        true,
        '100.0000000',
        '123456789',
        new Date('2023-01-01'),
        undefined
      );

      expect(verification.walletAddress).toBe(mockWalletAddress);
      expect(verification.isValid).toBe(true);
      expect(verification.accountExists).toBe(true);
      expect(verification.balance).toBe('100.0000000');
      expect(verification.sequence).toBe('123456789');
      expect(verification.errorMessage).toBeUndefined();
    });

    it('should create a WalletVerification instance with default values', () => {
      const verification = new WalletVerification(mockWalletAddress, true, false);

      expect(verification.walletAddress).toBe(mockWalletAddress);
      expect(verification.isValid).toBe(true);
      expect(verification.accountExists).toBe(false);
      expect(verification.balance).toBe('0');
      expect(verification.sequence).toBe('0');
      expect(verification.verifiedAt).toBeInstanceOf(Date);
      expect(verification.errorMessage).toBeUndefined();
    });
  });

  describe('createInvalid static method', () => {
    it('should create an invalid WalletVerification', () => {
      const errorMessage = 'Invalid wallet format';
      const verification = WalletVerification.createInvalid(mockWalletAddress, errorMessage);

      expect(verification.walletAddress).toBe(mockWalletAddress);
      expect(verification.isValid).toBe(false);
      expect(verification.accountExists).toBe(false);
      expect(verification.balance).toBe('0');
      expect(verification.sequence).toBe('0');
      expect(verification.errorMessage).toBe(errorMessage);
      expect(verification.verifiedAt).toBeInstanceOf(Date);
    });
  });

  describe('createValid static method', () => {
    it('should create a valid WalletVerification with account existing', () => {
      const balance = '250.5000000';
      const sequence = '987654321';
      const verification = WalletVerification.createValid(
        mockWalletAddress,
        true,
        balance,
        sequence
      );

      expect(verification.walletAddress).toBe(mockWalletAddress);
      expect(verification.isValid).toBe(true);
      expect(verification.accountExists).toBe(true);
      expect(verification.balance).toBe(balance);
      expect(verification.sequence).toBe(sequence);
      expect(verification.errorMessage).toBeUndefined();
      expect(verification.verifiedAt).toBeInstanceOf(Date);
    });

    it('should create a valid WalletVerification with account not existing', () => {
      const verification = WalletVerification.createValid(
        mockWalletAddress,
        false,
        '0',
        '0'
      );

      expect(verification.walletAddress).toBe(mockWalletAddress);
      expect(verification.isValid).toBe(true);
      expect(verification.accountExists).toBe(false);
      expect(verification.balance).toBe('0');
      expect(verification.sequence).toBe('0');
      expect(verification.errorMessage).toBeUndefined();
    });
  });

  describe('isVerified method', () => {
    it('should return true when wallet is valid and account exists', () => {
      const verification = WalletVerification.createValid(mockWalletAddress, true, '100', '123');
      expect(verification.isVerified()).toBe(true);
    });

    it('should return false when wallet is valid but account does not exist', () => {
      const verification = WalletVerification.createValid(mockWalletAddress, false, '0', '0');
      expect(verification.isVerified()).toBe(false);
    });

    it('should return false when wallet is invalid', () => {
      const verification = WalletVerification.createInvalid(mockWalletAddress, 'Invalid format');
      expect(verification.isVerified()).toBe(false);
    });
  });
});
