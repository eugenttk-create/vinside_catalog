import axios from "axios";
import { cryptoService } from "../utils/encryption";

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const DEFAULT_LANGUAGE = "en";

const getRequestLanguage = (): string => {
  const saved = localStorage.getItem("language");
  if (saved) return saved;

  if (window.__WIDGET_LANGUAGE__) {
    return window.__WIDGET_LANGUAGE__;
  }

  return DEFAULT_LANGUAGE;
};

api.interceptors.request.use((config) => {
  const token = window.__WIDGET_TOKEN__;
  console.log("cookies: ", document.cookie);
  console.log("headers: ", config.headers);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const language = getRequestLanguage();
  config.headers["Accept-Language"] = language;
  console.log("hasPublicKey: ", cryptoService.hasPublicKey());
  if (cryptoService.hasPublicKey() && config.url) {
    const encryptedEndpoint = cryptoService.encryptEndpoint(config.url);
    console.log("encryptedEndpoint: ", encryptedEndpoint);
    if (encryptedEndpoint) {
      config.headers["carcat-session"] = encryptedEndpoint;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes("/catalogs")) {
      cryptoService.setPublicKeyFromCookie();
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
