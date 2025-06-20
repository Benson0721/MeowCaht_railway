import express from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {
  getChatroomMember,
  updateLastReadAt,
  updateUnreadCount,
  addChatroomMember,
} from "../controllers/chatroom-member-controller.js";
const router = express.Router();

router
  .route("/")
  .get(getChatroomMember)
  .patch(checkAuth, updateLastReadAt)
  .put(checkAuth, updateUnreadCount)
  .post(checkAuth, addChatroomMember);

export { router };
