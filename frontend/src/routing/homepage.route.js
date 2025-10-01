import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "../routing/routerTress.js";
import store  from "@/store/store.js";

export const homepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    const { isAuthenticated } = store.getState().auth;

    if (!isAuthenticated) {
      throw redirect({ to: "/auth" });   // ✅ ye sahi hai
    } else {
      throw redirect({ to: "/dashboard" }); // ✅ ye bhi sahi hai
    }
  },
});
