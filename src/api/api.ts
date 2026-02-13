import axios from "axios";
import { cryptoService } from "../utils/encryption";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Accept-Language": "en",
  },
});

api.interceptors.request.use((config) => {
  const token = window.__WIDGET_TOKEN__;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (cryptoService.hasPublicKey() && config.url) {
    const encryptedEndpoint = cryptoService.encryptEndpoint(config.url);
    if (encryptedEndpoint) {
      config.headers["carcat_session"] = encryptedEndpoint;
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
