import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: "/api", // Change if your API base URL is different
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the Firebase token
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;