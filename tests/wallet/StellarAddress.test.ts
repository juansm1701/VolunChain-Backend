import { StellarAddress } from '../../src/modules/wallet/domain/value-objects/StellarAddress';

// Mock the @stellar/stellar-sdk
jest.mock('@stellar/stellar-sdk', () => ({
  StrKey: {
    isValidEd25519PublicKey: jest.fn((address: string) => address.startsWith('G') && address.length === 56),
    isValidMed25519PublicKey: jest.fn((address: string) => address.startsWith('M') && address.length === 69),
  },
}));

describe('StellarAddress', () => {
  describe('constructor', () => {
    it('should create a valid StellarAddress with a valid public key', () => {
      const validAddress = 'GCDCSYJ2SPFW4NEJP2RDSINPTMJMUIFNQ5D2DZ52IGI4W2PAJTB5VQ42';
      const stellarAddress = new StellarAddress(validAddress);
      expect(stellarAddress.value).toBe(validAddress);
    });

    it('should throw error for empty address', () => {
      expect(() => new StellarAddress('')).toThrow('Stellar address cannot be empty');
    });

    it('should throw error for invalid address format', () => {
      expect(() => new StellarAddress('invalid-address')).toThrow('Invalid Stellar address format');
    });

    it('should throw error for address with wrong prefix', () => {
      expect(() => new StellarAddress('ACDCSYJ2SPFW4NEJP2RDSINPTMJMUIFNQ5D2DZ52IGI4W2PAJTB5VQ42')).toThrow('Invalid Stellar address format');
    });
  });

  describe('isValid static method', () => {
    it('should return true for valid address', () => {
      const validAddress = 'GCDCSYJ2SPFW4NEJP2RDSINPTMJMUIFNQ5D2DZ52IGI4W2PAJTB5VQ42';
      expect(StellarAddress.isValid(validAddress)).toBe(true);
    });

    it('should return false for invalid address', () => {
      expect(StellarAddress.isValid('invalid-address')).toBe(false);
    });

    it('should return false for empty address', () => {
      expect(StellarAddress.isValid('')).toBe(false);
    });
  });

  describe('equals method', () => {
    it('should return true for equal addresses', () => {
      const address = 'GCDCSYJ2SPFW4NEJP2RDSINPTMJMUIFNQ5D2DZ52IGI4W2PAJTB5VQ42';
      const stellarAddress1 = new StellarAddress(address);
      const stellarAddress2 = new StellarAddress(address);
      expect(stellarAddress1.equals(stellarAddress2)).toBe(true);
    });

    it('should return false for different addresses', () => {
      const address1 = 'GCDCSYJ2SPFW4NEJP2RDSINPTMJMUIFNQ5D2DZ52IGI4W2PAJTB5VQ42';
      const address2 = 'GCKQFU4NYCS6ON2HY5BRJ4SCNC5C3QGAM7ZQXP7J3FM66NDNGJSEIZE5';
      const stellarAddress1 = new StellarAddress(address1);
      const stellarAddress2 = new StellarAddress(address2);
      expect(stellarAddress1.equals(stellarAddress2)).toBe(false);
    });
  });

  describe('toString method', () => {
    it('should return the address value', () => {
      const address = 'GCDCSYJ2SPFW4NEJP2RDSINPTMJMUIFNQ5D2DZ52IGI4W2PAJTB5VQ42';
      const stellarAddress = new StellarAddress(address);
      expect(stellarAddress.toString()).toBe(address);
    });
  });
});
