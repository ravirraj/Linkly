import { createShortUrl, getShortUrl , getAllShortUrls} from "../controller/short_url.controller.js";
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", authenticate, createShortUrl);
router.get("/:id", getShortUrl);
router.get("/", authenticate, getAllShortUrls);

export default router;