import express from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {
  getChatrooms,
  newChatroom,
  getChatroomMember,
  updateLastReadAt,
  updateUnreadCount,
} from "../controllers/chatroom-controller.js";
const router = express.Router();

router.route("/").get(checkAuth, getChatrooms).post(checkAuth, newChatroom);
router
  .route("/member")
  .get(checkAuth, getChatroomMember)
  .patch(checkAuth, updateLastReadAt)
  .put(checkAuth, updateUnreadCount);

export { router };
