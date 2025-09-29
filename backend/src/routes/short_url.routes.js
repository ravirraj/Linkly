import { createShortUrl, getShortUrl } from "../controller/short_url.controller.js";
import { Router } from "express";

const router = Router();

router.post("/create", createShortUrl);
router.get("/:id", getShortUrl);

export default router;