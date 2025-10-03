import api, { refreshApi } from "./axiousInstance.js";
import { redirect } from "@tanstack/react-router";
import { setCredentials, clearAuth } from "@/store/slice/authSlice";

export const checkAuth = async ({ context }) => {
  const store = context.store;

  try {
    let accessToken = store.getState().auth.accessToken;

    // If no access token, try refreshing
    if (!accessToken) {
      try {
        const refreshRes = await refreshApi.post("/api/auth/refresh");
        accessToken = refreshRes.data.accessToken;

        store.dispatch(
          setCredentials({
            user: refreshRes.data.user || null,
            accessToken,
          })
        );
      } catch (refreshErr) {
        // Refresh failed -> redirect to login
        store.dispatch(clearAuth());
        throw redirect({ to: "/auth" });
      }
    }

    // Now we have a token (either from Redux or refreshed)
    const res = await api.get("/api/auth/me");
    const userData = res.data;

    store.dispatch(
      setCredentials({
        user: userData.user,
        accessToken: accessToken, // keep the current token
      })
    );

    const { isAuthenticated } = store.getState().auth;
    if (!isAuthenticated) throw redirect({ to: "/auth" });

    return true;
  } catch (error) {
    console.log("checkAuth error:", error.response?.data || error);
    store.dispatch(clearAuth());
    throw redirect({ to: "/auth" });
  }
};
