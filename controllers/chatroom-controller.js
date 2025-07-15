import Chatroom from "../models/chatroom-schema.js";
import ChatroomMember from "../models/chatroom_member-schema.js";

export const getChatrooms = async (req, res) => {
  try {
    const { user_id } = req.query;
    const chatrooms = await Chatroom.find({ members: { $in: user_id } });
    res.json(chatrooms);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const getOneChatroom = async (req, res) => {
  try {
    const chatroom_id = req.params.chatroom_id;
    const chatroom = await Chatroom.findOne({ _id: chatroom_id });
    res.json(chatroom);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const newChatroom = async (req, res) => {
  try {
    const { type, members, avatar, name } = req.body;
    const chatroom = new Chatroom({
      type: type,
      avatar: avatar,
      name: name,
      members: members,
    });
    const savedChatroom = await chatroom.save();

    members.forEach((member) => {
      const chatroomMember = new ChatroomMember({
        user_id: member,
        chatroom_id: savedChatroom._id,
      });
      chatroomMember.save();
    });

    res.json(savedChatroom);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};
export const inviteUserToChatroom = async (req, res) => {
  try {
    const { chatroom_id, user_id } = req.body;
    const chatroom = await Chatroom.findOne({
      _id: chatroom_id,
    });
    if (!chatroom) {
      return res.status(400).json({ error: "Chatroom not found" });
    }
    chatroom.members.push(user_id);
    const savedChatroom = await chatroom.save();

    res.json(savedChatroom);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};
