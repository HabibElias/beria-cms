import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true,
  timeout: 60_000,
  headers: { Accept: "application/json" },
});

export default apiClient;
