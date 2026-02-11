import axios from "axios";
import { encryptEndpoint } from "../utils/encryption";
// import { getCookie } from "../utils/cookies";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Accept-Language": "en",
  },
});

api.interceptors.request.use(async (config) => {
  console.log("======================================");
  console.log("Outgoing request:", config.url);
  console.log("Method:", config.method);

  const token = window.__WIDGET_TOKEN__;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization header attached");
  }

  if (config.url) {
    const encrypted = await encryptEndpoint(config.url);

    if (encrypted) {
      config.headers.carcat_session = encrypted;
      console.log("carcat_session header attached");
    } else {
      console.warn("carcat_session NOT attached");
    }
  }

  console.log("Final headers:", config.headers);
  console.log("======================================");

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.config.url);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.status);

    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }

    return Promise.reject(error);
  }
);

export default api;
