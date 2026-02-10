import axios from "axios";
import { encryptionService } from "../utils/encryption";
import { getCookie } from "../utils/cookies";
import type { InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Accept-Language": "en",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = window.__WIDGET_TOKEN__;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (encryptionService.isInitialized() && config.url) {
    try {
      const encryptedEndpoint = encryptionService.encryptEndpoint(config.url);
      config.headers["carcat_session"] = encryptedEndpoint;
    } catch (error) {
      console.error("Failed to encrypt endpoint:", error);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (!encryptionService.isInitialized()) {
      const carcatId = getCookie("carcat_id");

      if (carcatId) {
        console.log(
          "Found carcat_id cookie:",
          carcatId.substring(0, 50) + "..."
        );
        console.log("Cookie length:", carcatId.length);

        try {
          encryptionService.initializeFromBase64(carcatId);
          console.log("Encryption initialized from carcat_id cookie");
        } catch (error) {
          console.error("Failed to initialize encryption from cookie:", error);
        }
      } else {
        console.log("carcat_id cookie not found");
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
