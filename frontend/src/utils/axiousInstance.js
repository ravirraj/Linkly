import axios from "axios";
import store from "../store/store.js";
import { setCredentials, clearAuth } from "../store/slice/authSlice.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // apne backend ka URL
  withCredentials: true,            // cookies bhejne ke liye
});
// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post("api/auth/refresh");
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
