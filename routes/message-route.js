import express from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {
  getHistoryMessage,
  sendMessage,
  recallMessage,
  getReadCount,
} from "../controllers/message-controller.js";
const router = express.Router();

router
  .route("/")
  .get(checkAuth, getHistoryMessage)
  .post(checkAuth, sendMessage)
  .patch(checkAuth, recallMessage);

router.route("/readcount").get(checkAuth, getReadCount);

export { router };
