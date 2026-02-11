import axios from "axios";
import JSEncrypt from "jsencrypt"; // Add this import; install via npm install jsencrypt

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Accept-Language": "en",
  },
});

let publicKey: string | null = null;

const readPublicKeyFromCookie = () => {
  console.log("[LOG] Starting to read 'carcat_id' cookie...");
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("carcat_id="));

  if (cookie) {
    console.log("[LOG] Cookie found: ", cookie);
    const base64Key = cookie.split("=")[1];
    console.log("[LOG] Extracted base64Key: ", base64Key);
    const decodedKey = atob(base64Key);
    console.log("[LOG] Decoded public key from base64: ", decodedKey);
    return decodedKey;
  } else {
    console.log("[LOG] No 'carcat_id' cookie found.");
  }
  return null;
};

api.interceptors.request.use((config) => {
  console.log("[LOG] Entering request interceptor for URL: ", config.url);

  const token = window.__WIDGET_TOKEN__;
  if (token) {
    console.log("[LOG] Adding Authorization header with token: ", token);
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (publicKey && config.url) {
    console.log(
      "[LOG] Public key is available. Preparing to encrypt endpoint: ",
      config.url
    );
    const jsonPayload = { endpoint: config.url };
    const dataToEncrypt = JSON.stringify(jsonPayload);
    console.log("[LOG] JSON payload to encrypt: ", dataToEncrypt);

    const encrypt = new JSEncrypt();
    console.log("[LOG] Setting public key for encryption: ", publicKey);
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(dataToEncrypt);
    console.log("[LOG] Encrypted result (base64): ", encrypted);

    if (encrypted) {
      console.log("[LOG] Adding 'carcat_session' header: ", encrypted);
      config.headers["carcat_session"] = encrypted;
    } else {
      console.error("[ERROR] Encryption failed for endpoint: ", config.url);
    }
  } else {
    console.log("[LOG] No public key yet or no URL - skipping encryption.");
  }

  console.log("[LOG] Final request config: ", config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(
      "[LOG] Entering response interceptor for URL: ",
      response.config.url
    );
    console.log("[LOG] Response status: ", response.status);
    console.log("[LOG] Response data: ", response.data);

    if (response.config.url === "/catalogs" && !publicKey) {
      console.log(
        "[LOG] This is the getCatalogs response - attempting to load public key from cookie."
      );
      const keyFromCookie = readPublicKeyFromCookie();
      if (keyFromCookie) {
        publicKey = keyFromCookie;
        console.log("[LOG] Public key successfully loaded and stored.");
      } else {
        console.error(
          "[ERROR] Failed to load public key from cookie after getCatalogs."
        );
      }
    } else {
      console.log(
        "[LOG] Not the initial getCatalogs response or key already loaded - skipping key load."
      );
    }

    return response;
  },
  (error) => {
    console.error("[ERROR] Entering error response interceptor.");
    console.error("[ERROR] Error details: ", error);
    if (error.response?.status === 401) {
      console.error("[ERROR] Unauthorized access detected.");
    }
    return Promise.reject(error);
  }
);

export default api;
