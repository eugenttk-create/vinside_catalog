import forge from "node-forge";

class EncryptionService {
  private publicKey: forge.pki.rsa.PublicKey | null = null;

  initializeFromBase64(base64PublicKey: string): void {
    try {
      const decodedKey = forge.util.decode64(base64PublicKey);

      if (decodedKey.includes("-----BEGIN")) {
        this.publicKey = forge.pki.publicKeyFromPem(decodedKey);
      } else {
        const asn1 = forge.asn1.fromDer(decodedKey);
        this.publicKey = forge.pki.publicKeyFromAsn1(asn1);
      }

      console.log("Public key initialized successfully");
    } catch (error) {
      console.error("Failed to initialize public key:", error);
      throw error;
    }
  }

  encryptEndpoint(endpoint: string): string {
    if (!this.publicKey) {
      throw new Error("Public key not initialized");
    }

    try {
      const payload = JSON.stringify({ endpoint });

      const encrypted = this.publicKey.encrypt(payload, "RSA-OAEP", {
        md: forge.md.sha256.create(),
      });

      const base64Encrypted = forge.util.encode64(encrypted);

      return base64Encrypted;
    } catch (error) {
      console.error("Encryption failed:", error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.publicKey !== null;
  }

  reset(): void {
    this.publicKey = null;
  }
}

export const encryptionService = new EncryptionService();
