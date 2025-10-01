import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routerTress.js";
import Authpage from "../pages/Authpage.jsx";

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: Authpage 
}); 