import Chatroom from "../models/chatroom-schema.js";
import ChatroomMember from "../models/chatroom_member-schema.js";
import Message from "../models/message-schema.js";

export const getChatrooms = async (req, res) => {
  try {
    const { user_id } = req.query;
    console.log(user_id);
    const chatrooms = await Chatroom.find({ members: { $in: user_id } });
    console.log(chatrooms);
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

export const countUnreadMessage = async (req, res) => {
  try {
    const { chatroom_id, user_id } = req.body;
    const chatroomMember = await ChatroomMember.findOne({
      chatroom_id: chatroom_id,
      user_id: user_id,
    });
    const lastReadAt = chatroomMember.last_read_at;

    const unreadCount = await Message.countDocuments({
      chatroom_id: chatroom_id,
      isRecalled: false,
      user_id: { $ne: user_id },
      createdAt: { $gt: lastReadAt },
    });
    res.json(unreadCount);
  } catch (error) {
    console.error("伺服器錯誤:", error.message);
    res.status(400).json({ error: error.message });
  }
};
