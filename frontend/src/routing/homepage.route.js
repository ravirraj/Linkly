import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routerTress.js";
import Dashboard from "../pages/Dashboard.jsx";
import Homepage from "../pages/Homepage.jsx";

export const homepageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Homepage
}); 