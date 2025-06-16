import express from "express";
import { checkAuth } from "../utils/checkAuth.js";
import { getSticker } from "../controllers/sticker-controller.js";
const router = express.Router();

router.route("/").get(checkAuth, getSticker);

export { router };
