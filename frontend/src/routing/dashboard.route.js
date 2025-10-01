import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routerTress.js";
import Dashboard from "../pages/Dashboard.jsx";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
}); 