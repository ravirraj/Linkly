import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routerTress.js";
import Dashboard from "../pages/Dashboard.jsx";
import { checkAuth } from "@/utils/helper.js";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
  beforeLoad : checkAuth
}); 