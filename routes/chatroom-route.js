import express from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {
  getChatrooms,
  newChatroom,
  countUnreadMessage,
} from "../controllers/chatroom-controller.js";
const router = express.Router();

router.route("/").get(checkAuth, getChatrooms).post(checkAuth, newChatroom);
router.route("/unread").get(checkAuth, countUnreadMessage);

export { router };
