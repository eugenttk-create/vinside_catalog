import { JSEncrypt } from "jsencrypt";

export class CryptoService {
  private publicKey: string | null = null;
  private encrypt = new JSEncrypt();

  setPublicKeyFromCookie() {
    const cookies = document.cookie.split(";");
    const carcatCookie = cookies.find((c) => c.trim().startsWith("carcat_id="));

    if (carcatCookie) {
      const base64Key = carcatCookie.split("=")[1];
      const decodedKey = atob(base64Key);
      this.publicKey = decodedKey;
      this.encrypt.setPublicKey(decodedKey);
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
