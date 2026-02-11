let publicKey: CryptoKey | null = null;

function base64ToArrayBuffer(base64: string) {
  console.log("[CARCAT] Decoding base64 public key...");

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  console.log("[CARCAT] Base64 decoded. Bytes length:", bytes.length);

  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  const encoded = btoa(binary);

  console.log("[CARCAT] Encrypted payload base64 length:", encoded.length);

  return encoded;
}

export function getCookie(name: string) {
  console.log(`[CARCAT] Searching cookie: ${name}`);

  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));

  if (match) {
    console.log("[CARCAT] Cookie found");
    return match[2];
  }

  console.warn("[CARCAT] Cookie not found");
  return null;
}

export async function loadPublicKeyFromCookie() {
  if (publicKey) {
    console.log("[CARCAT] Using cached public key");
    return publicKey;
  }

  const cookie = getCookie("carcat_id");

  if (!cookie) {
    console.warn("[CARCAT] No carcat_id cookie available");
    return null;
  }

  try {
    const keyBuffer = base64ToArrayBuffer(cookie);

    console.log("[CARCAT] Importing RSA public key...");

    publicKey = await crypto.subtle.importKey(
      "spki",
      keyBuffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      false,
      ["encrypt"]
    );

    console.log("[CARCAT] RSA public key imported successfully");

    return publicKey;
  } catch (error) {
    console.error("[CARCAT] Failed to import public key:", error);
    return null;
  }
}

export async function encryptEndpoint(endpoint: string) {
  console.log("[CARCAT] Encrypting endpoint:", endpoint);

  const key = await loadPublicKeyFromCookie();

  if (!key) {
    console.warn("[CARCAT] Encryption skipped — no public key");
    return null;
  }

  const payloadObject = { endpoint };
  const payload = JSON.stringify(payloadObject);

  console.log("[CARCAT] Payload before encryption:", payload);

  const encoded = new TextEncoder().encode(payload);

  console.log("[CARCAT] Payload byte length:", encoded.length);

  try {
    const encrypted = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      key,
      encoded
    );

    console.log(
      "[CARCAT] Encryption successful. Encrypted byte length:",
      encrypted.byteLength
    );

    return arrayBufferToBase64(encrypted);
  } catch (error) {
    console.error("[CARCAT] Encryption failed:", error);
    return null;
  }
}
