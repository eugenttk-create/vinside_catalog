import forge from "node-forge";

class EncryptionService {
  private publicKey: forge.pki.rsa.PublicKey | null = null;

  initializeFromBase64(base64PublicKey: string): void {
    try {
      const decoded = forge.util.decode64(base64PublicKey);

      if (decoded.includes("-----BEGIN")) {
        this.publicKey = forge.pki.publicKeyFromPem(decoded);
      } else {
        const asn1 = forge.asn1.fromDer(decoded);
        this.publicKey = forge.pki.publicKeyFromAsn1(asn1);
      }

      console.log("Public key initialized successfully");
      console.log("Key size:", this.publicKey.n.bitLength(), "bits");
    } catch (error) {
      console.error("Failed to initialize public key:", error);
      throw error;
    }
  }

  encryptEndpoint(endpoint: string): string {
    if (!this.publicKey) {
      console.warn("Public key not initialized");
      throw new Error("Public key not initialized");
    }

    try {
      const payload = JSON.stringify({ endpoint });
      console.log("Payload to encrypt:", payload);

      const encrypted = this.publicKey.encrypt(payload, "RSA-OAEP", {
        md: forge.md.sha256.create(),
      });

      console.log("Encrypted (binary length):", encrypted.length, "bytes");

      const base64Encrypted = forge.util.encode64(encrypted);
      console.log(
        "Base64 encrypted:",
        base64Encrypted.substring(0, 50) + "..."
      );
      console.log("Base64 length:", base64Encrypted.length, "chars");

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
