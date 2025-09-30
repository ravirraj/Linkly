// User routes

import express from "express";
import { registerUser, loginUser,logoutUser ,refreshAccessToken} from "../controller/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser);
router.post("/refresh", refreshAccessToken);0

// Protected route example
router.get("/profile", authenticate, (req, res) => {
    res.json({ user: req.user });
});

export default router;