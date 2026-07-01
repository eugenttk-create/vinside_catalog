import { JSEncrypt } from "jsencrypt";

export class CryptoService {
  private publicKey: string | null = null;
  private encrypt = new JSEncrypt();

  setPublicKey(base64Key: string) {
    try {
      const decodedKey = atob(base64Key);
      this.publicKey = decodedKey;
      this.encrypt.setPublicKey(decodedKey);
    } catch (e) {
      console.error("Failed to decode/set public key", e);
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

    return btoa(encrypted);
  }

  hasPublicKey(): boolean {
    return this.publicKey !== null;
  }
}

export const cryptoService = new CryptoService();
