// ...existing code...
import axios from "axios";
import store from "../store/store.js";
import { setCredentials, clearAuth } from "../store/slice/authSlice.js";
// ...existing code...

// normalize backend URL: ensure protocol and no trailing slash
const raw = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
let baseURL = String(raw).trim().replace(/\/+$/, "");
if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(baseURL)) {
  baseURL = (baseURL.startsWith("localhost") || baseURL.startsWith("127.") || baseURL.startsWith("::1"))
    ? `http://${baseURL}`
    : `https://${baseURL}`;
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// refresh ke liye alag axios (interceptor loop avoid karne ke liye)
const refreshApi = axios.create({
  baseURL,
  withCredentials: true,
});

// ...existing code...
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ...existing code...
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;



    if(originalRequest.url.includes("/api/auth/login") || originalRequest.url.includes("/api/auth/register")){
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshApi.post("/api/auth/refresh");
        const newAccessToken = res.data.accessToken;

        store.dispatch(
          setCredentials({
            user: store.getState().auth.user,
            accessToken: newAccessToken,
          })
        );

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (error) {
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);

export default api;