import express from "express";
import { checkAuth } from "../utils/checkAuth.js";
import {
  getChatrooms,
  newChatroom,
  inviteUserToChatroom,
  getOneChatroom,
} from "../controllers/chatroom-controller.js";
const router = express.Router();

router
  .route("/")
  .get(checkAuth, getChatrooms)
  .post(checkAuth, newChatroom)
  .patch(checkAuth, inviteUserToChatroom);

router.route("/:chatroom_id").get(checkAuth, getOneChatroom);

export { router };
