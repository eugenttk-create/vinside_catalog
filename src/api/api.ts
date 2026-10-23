import axios, { type InternalAxiosRequestConfig } from "axios";
import { cryptoService } from "../utils/encryption";
import { demoRequest } from "../demo/demoAdapter";

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";
const API_URL = import.meta.env.VITE_API_URL;

const demoAdapter = async (config: InternalAxiosRequestConfig) => {
  const method = (config.method ?? "get").toUpperCase();
  const url = config.url ?? "";
  let parsedData: unknown;
  if (config.data) {
    try {
      parsedData = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    } catch {
      parsedData = config.data;
    }
  }
  const result = await demoRequest(method, url, parsedData);
  if (result.status >= 400) {
    throw {
      response: { status: result.status, data: result.data, statusText: result.statusText, headers: result.headers, config },
      message: result.statusText,
      config,
    };
  }
  return {
    data: result.data,
    status: result.status,
    statusText: result.statusText,
    headers: result.headers,
    config,
  };
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
  ...(DEMO_MODE ? { adapter: demoAdapter } : {}),
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

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const language = getRequestLanguage();
  config.headers["Accept-Language"] = language;

  if (cryptoService.hasPublicKey() && config.url) {
    const encryptedEndpoint = cryptoService.encryptEndpoint(config.url);
    if (encryptedEndpoint) {
      config.headers["carcat-session"] = encryptedEndpoint;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const publicKey = response.headers["carcat-id"];
    if (publicKey) {
      cryptoService.setPublicKey(publicKey);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  },
);

export default api;
