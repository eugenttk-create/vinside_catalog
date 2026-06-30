import { JSEncrypt } from "jsencrypt";

export class CryptoService {
  private publicKey: string | null = null;
  private encrypt = new JSEncrypt();
  private publicKeyPromise: Promise<void> | null = null;

  private readCookie(): string | null {
    const cookies = document.cookie.split(";");
    const carcatCookie = cookies.find((c) => c.trim().startsWith("carcat_id="));
    if (!carcatCookie) return null;
    try {
      const base64Key = carcatCookie.split("=")[1];
      return atob(base64Key);
    } catch (e) {
      console.error("Failed to decode public key cookie", e);
      return null;
    }
  }

  async setPublicKeyFromCookie(retries = 5, delayMs = 50): Promise<void> {
    if (this.publicKeyPromise) return this.publicKeyPromise;

    this.publicKeyPromise = (async () => {
      for (let attempt = 0; attempt < retries; attempt++) {
        const decodedKey = this.readCookie();
        if (decodedKey) {
          this.publicKey = decodedKey;
          this.encrypt.setPublicKey(decodedKey);
          this.publicKeyPromise = null;
          return;
        }
        await new Promise((res) => setTimeout(res, delayMs));
      }
      console.warn("carcat_id cookie not found after retries");
      this.publicKeyPromise = null;
    })();

    return this.publicKeyPromise;
  }

  encryptEndpoint(endpoint: string): string | null {
    if (!this.publicKey) return null;
    const endpointWithoutQuery = endpoint.split("?")[0];
    const payload = JSON.stringify({ endpoint: endpointWithoutQuery });
    const encrypted = this.encrypt.encrypt(payload);
    if (!encrypted) return null;
    return btoa(encrypted);
  }

  hasPublicKey(): boolean {
    return this.publicKey !== null;
  }
}

export const cryptoService = new CryptoService();
