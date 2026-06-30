import { JSEncrypt } from "jsencrypt";

export class CryptoService {
  private publicKey: string | null = null;
  private encrypt = new JSEncrypt();

  setPublicKey(rawKey: string) {
    try {
      this.publicKey = rawKey;
      this.encrypt.setPublicKey(rawKey);
    } catch (e) {
      console.error("Failed to set public key", e);
    }
  }

  encryptEndpoint(endpoint: string): string | null {
    if (!this.publicKey) {
      return null;
    }

    const endpointWithoutQuery = endpoint.split("?")[0];

    const payload = JSON.stringify({ endpoint: endpointWithoutQuery });
    const encrypted = this.encrypt.encrypt(payload);

    if (!encrypted) {
      return null;
    }

    const base64Encrypted = btoa(encrypted);

    return base64Encrypted;
  }

  hasPublicKey(): boolean {
    return this.publicKey !== null;
  }
}

export const cryptoService = new CryptoService();
