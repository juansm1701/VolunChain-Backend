import { StrKey } from '@stellar/stellar-sdk';

export class StellarAddress {
  private readonly _value: string;

  constructor(address: string) {
    if (!address) {
      throw new Error('Stellar address cannot be empty');
    }

    if (!this.isValidFormat(address)) {
      throw new Error('Invalid Stellar address format');
    }

    this._value = address;
  }

  public get value(): string {
    return this._value;
  }

  private isValidFormat(address: string): boolean {
    try {
      // Check if it's a valid Stellar public key (starts with 'G')
      if (StrKey.isValidEd25519PublicKey(address)) {
        return true;
      }

      // Check if it's a valid Stellar muxed account (starts with 'M')
      if (StrKey.isValidMed25519PublicKey(address)) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  public static isValid(address: string): boolean {
    try {
      new StellarAddress(address);
      return true;
    } catch {
      return false;
    }
  }

  public equals(other: StellarAddress): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
