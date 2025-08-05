import { StellarAddress } from "../domain/value-objects/StellarAddress";

describe("StellarAddress", () => {
  describe("constructor", () => {
    it("should create a valid StellarAddress with a valid public key", () => {
      const validAddress =
        "GCKFBEIYTKP5RDBQMUTAPDCFZDFNVTQNXUCUZMAQYVWLQHTQBDKTQRQY";
      const stellarAddress = new StellarAddress(validAddress);
      expect(stellarAddress.value).toBe(validAddress);
    });

    it("should throw error for empty address", () => {
      expect(() => new StellarAddress("")).toThrow(
        "Stellar address cannot be empty"
      );
    });

    it("should throw error for invalid address format", () => {
      expect(() => new StellarAddress("invalid-address")).toThrow(
        "Invalid Stellar address format"
      );
    });

    it("should throw error for address with wrong prefix", () => {
      expect(
        () =>
          new StellarAddress(
            "ACKFBEIYTKP5RDBQMUTAPDCFZDFNVTQNXUCUZMAQYVWLQHTQBDKTQRQY"
          )
      ).toThrow("Invalid Stellar address format");
    });
  });

  describe("isValid static method", () => {
    it("should return true for valid address", () => {
      const validAddress =
        "GCKFBEIYTKP5RDBQMUTAPDCFZDFNVTQNXUCUZMAQYVWLQHTQBDKTQRQY";
      expect(StellarAddress.isValid(validAddress)).toBe(true);
    });

    it("should return false for invalid address", () => {
      expect(StellarAddress.isValid("invalid-address")).toBe(false);
    });

    it("should return false for empty address", () => {
      expect(StellarAddress.isValid("")).toBe(false);
    });
  });

  describe("equals method", () => {
    it("should return true for equal addresses", () => {
      const address =
        "GCKFBEIYTKP5RDBQMUTAPDCFZDFNVTQNXUCUZMAQYVWLQHTQBDKTQRQY";
      const stellarAddress1 = new StellarAddress(address);
      const stellarAddress2 = new StellarAddress(address);
      expect(stellarAddress1.equals(stellarAddress2)).toBe(true);
    });

    it("should return false for different addresses", () => {
      const address1 =
        "GCKFBEIYTKP5RDBQMUTAPDCFZDFNVTQNXUCUZMAQYVWLQHTQBDKTQRQY";
      const address2 =
        "GDQNY3PBOJOKYZSRMK2S7LHHGWZIUISD4QORETLMXEWXBI7KFZZMKTL3";
      const stellarAddress1 = new StellarAddress(address1);
      const stellarAddress2 = new StellarAddress(address2);
      expect(stellarAddress1.equals(stellarAddress2)).toBe(false);
    });
  });

  describe("toString method", () => {
    it("should return the address value", () => {
      const address =
        "GCKFBEIYTKP5RDBQMUTAPDCFZDFNVTQNXUCUZMAQYVWLQHTQBDKTQRQY";
      const stellarAddress = new StellarAddress(address);
      expect(stellarAddress.toString()).toBe(address);
    });
  });
});
