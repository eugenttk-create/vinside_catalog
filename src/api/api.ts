import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
    "Accept-language": "en",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default api;
