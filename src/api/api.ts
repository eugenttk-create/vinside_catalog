import axios from "axios";
import JSEncrypt from "jsencrypt";

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
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("carcat_id="));
  if (cookie) {
    const base64Key = cookie.split("=")[1];
    return atob(base64Key);
  }
  return null;
};

api.interceptors.request.use((config) => {
  const token = window.__WIDGET_TOKEN__;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (publicKey && config.url) {
    const jsonPayload = { endpoint: config.url };
    const dataToEncrypt = JSON.stringify(jsonPayload);

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(dataToEncrypt);

    if (encrypted) {
      config.headers["carcat_session"] = encrypted;
    } else {
      console.error("Encryption failed");
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config.url === "/catalogs" && !publicKey) {
      const keyFromCookie = readPublicKeyFromCookie();
      if (keyFromCookie) {
        publicKey = keyFromCookie;
        console.log("Public key loaded from cookie");
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default api;
