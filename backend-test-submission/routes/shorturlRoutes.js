import express from "express";
import {
  createShortUrl,
  redirectShortUrl,
} from "../controllers/shorturlController.js";

const router = express.Router();

router.post("/", createShortUrl);

router.get("/:shortcode", redirectShortUrl);

export default router;
