import axios from "axios";
import store from "../store/store.js";
import { setCredentials, clearAuth } from "../store/slice/authSlice.js";




const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// refresh ke liye alag axios (interceptor loop avoid karne ke liye)
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// REQUEST INTERCEPTOR → har request me token lagana
api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  console.log(token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshApi.post("/api/auth/refresh"); // refresh ke liye alag instance
        const newAccessToken = res.data.accessToken;

        // redux update
        store.dispatch(
          setCredentials({
            user: store.getState().auth.user,
            accessToken: newAccessToken,
          })
        );

        // retry original request
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
