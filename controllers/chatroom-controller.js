import Chatroom from "../models/chatroom-schema.js";
import ChatroomMember from "../models/chatroom_member-schema.js";

export const getChatrooms = async (req, res) => {
  try {
    const { user_id } = req.body;
    const chatrooms = await ChatroomMember.find({ user_id });
    res.json(chatrooms);
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
